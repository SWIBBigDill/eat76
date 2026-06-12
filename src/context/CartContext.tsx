"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import {
  DELIVERY_FEE,
  SERVICE_FEE,
  calculateCustomerCheckoutComparison,
} from "@/lib/pricing";
import { generateOrderId, persistLastOrder } from "@/lib/order-tracking";

const CART_STORAGE_KEY = "eat76-cart";
const ORDER_STORAGE_KEY = "eat76-last-order";

export type PlacedOrder = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tip: number;
  total: number;
  savings: number;
  placedAt: string;
};

type StoredCart = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  tip: number;
};

type CartContextValue = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  tip: number;
  isCartOpen: boolean;
  cartPulse: boolean;
  setRestaurant: (id: string, name: string) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  setTip: (tip: number) => void;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
  placeOrder: () => PlacedOrder | null;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): StoredCart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCart;
  } catch {
    return null;
  }
}

function saveCart(cart: StoredCart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* ignore quota errors */
  }
}

export function savePlacedOrder(order: PlacedOrder) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    persistLastOrder(order);
  } catch {
    /* ignore */
  }
}

export function loadPlacedOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(ORDER_STORAGE_KEY) ??
      localStorage.getItem("eat76-last-order");
    if (!raw) return null;
    return JSON.parse(raw) as PlacedOrder;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [tip, setTip] = useState(4);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadCart();
    if (stored) {
      setRestaurantId(stored.restaurantId);
      setRestaurantName(stored.restaurantName);
      setItems(stored.items);
      setTip(stored.tip);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart({ restaurantId, restaurantName, items, tip });
  }, [restaurantId, restaurantName, items, tip, hydrated]);

  const triggerPulse = useCallback(() => {
    setCartPulse(true);
    const timer = window.setTimeout(() => setCartPulse(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const setRestaurant = useCallback((id: string, name: string) => {
    setRestaurantId(id);
    setRestaurantName(name);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.menuItemId === item.menuItemId);
        if (existing) {
          return prev.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      triggerPulse();
      setCartOpen(true);
    },
    [triggerPulse]
  );

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setTip(4);
    setCartOpen(false);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const serviceFee = items.length > 0 ? SERVICE_FEE : 0;
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + serviceFee + deliveryFee + tip;

  const placeOrder = useCallback((): PlacedOrder | null => {
    if (items.length === 0 || !restaurantId || !restaurantName) return null;

    const comparison = calculateCustomerCheckoutComparison({
      foodSubtotal: subtotal,
      tip,
    });

    const order: PlacedOrder = {
      id: generateOrderId(),
      restaurantId,
      restaurantName,
      items: [...items],
      subtotal,
      serviceFee,
      deliveryFee,
      tip,
      total,
      savings: comparison.savings,
      placedAt: new Date().toISOString(),
    };

    savePlacedOrder(order);
    setItems([]);
    setCartOpen(false);
    setRestaurantId(null);
    setRestaurantName(null);
    setTip(4);

    return order;
  }, [
    items,
    restaurantId,
    restaurantName,
    subtotal,
    serviceFee,
    deliveryFee,
    tip,
    total,
  ]);

  const value = useMemo(
    () => ({
      restaurantId,
      restaurantName,
      items,
      tip,
      isCartOpen,
      cartPulse,
      setRestaurant,
      addItem,
      removeItem,
      updateQuantity,
      setTip,
      setCartOpen,
      clearCart,
      placeOrder,
      subtotal,
      serviceFee,
      deliveryFee,
      total,
      itemCount,
      hydrated,
    }),
    [
      restaurantId,
      restaurantName,
      items,
      tip,
      isCartOpen,
      cartPulse,
      setRestaurant,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      placeOrder,
      subtotal,
      serviceFee,
      deliveryFee,
      total,
      itemCount,
      hydrated,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
