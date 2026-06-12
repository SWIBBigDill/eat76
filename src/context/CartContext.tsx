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
import {
  DEFAULT_DELIVERY_ADDRESS,
  validateDeliveryAddress,
} from "@/lib/delivery-address";
import { generateOrderId, persistLastOrder } from "@/lib/order-tracking";
import { applyPromoCode } from "@/lib/promo-codes";
import { addNotification } from "@/lib/notifications";

const CART_STORAGE_KEY = "eat76-cart";
const ADDRESS_STORAGE_KEY = "eat76-delivery-address";
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
  orderNotes?: string;
  deliverySchedule?: string;
  promoDiscount?: number;
};

type StoredCart = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  tip: number;
  deliveryAddress?: string;
  orderNotes?: string;
  deliverySchedule?: string;
  promoCode?: string;
};

type AddItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  tip: number;
  isCartOpen: boolean;
  cartPulse: boolean;
  setRestaurant: (id: string, name: string) => void;
  addItem: (item: AddItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  setTip: (tip: number) => void;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
  placeOrder: () => PlacedOrder | null;
  reorderFromOrder: (order: PlacedOrder) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  deliveryAddressValid: boolean;
  deliveryAddressError: string | null;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  deliverySchedule: string;
  setDeliverySchedule: (schedule: string) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  promoMessage: string | null;
  customTipMode: boolean;
  setCustomTipMode: (custom: boolean) => void;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    lineId: item.lineId ?? item.menuItemId,
    basePrice: item.basePrice ?? item.price,
  };
}

function loadDeliveryAddress(): string {
  if (typeof window === "undefined") return DEFAULT_DELIVERY_ADDRESS;
  try {
    return (
      localStorage.getItem(ADDRESS_STORAGE_KEY) ?? DEFAULT_DELIVERY_ADDRESS
    );
  } catch {
    return DEFAULT_DELIVERY_ADDRESS;
  }
}

function loadCart(): StoredCart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCart;
    return {
      ...parsed,
      items: parsed.items.map(normalizeCartItem),
      deliveryAddress: parsed.deliveryAddress ?? loadDeliveryAddress(),
    };
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
    const parsed = JSON.parse(raw) as PlacedOrder;
    return {
      ...parsed,
      items: parsed.items.map(normalizeCartItem),
    };
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [tip, setTip] = useState(4);
  const [deliveryAddress, setDeliveryAddressState] = useState(
    DEFAULT_DELIVERY_ADDRESS
  );
  const [orderNotes, setOrderNotesState] = useState("");
  const [deliverySchedule, setDeliveryScheduleState] = useState("asap");
  const [promoCode, setPromoCodeState] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [customTipMode, setCustomTipMode] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const addressValidation = useMemo(
    () => validateDeliveryAddress(deliveryAddress),
    [deliveryAddress]
  );

  useEffect(() => {
    const stored = loadCart();
    if (stored) {
      // Hydrate cart from localStorage after client mount (avoids SSR mismatch)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time hydration
      setRestaurantId(stored.restaurantId);
      setRestaurantName(stored.restaurantName);
      setItems(stored.items);
      setTip(stored.tip);
      if (stored.deliveryAddress) {
        setDeliveryAddressState(stored.deliveryAddress);
      } else {
        setDeliveryAddressState(loadDeliveryAddress());
      }
      if (stored.orderNotes) setOrderNotesState(stored.orderNotes);
      if (stored.deliverySchedule) setDeliveryScheduleState(stored.deliverySchedule);
      if (stored.promoCode) {
        setPromoCodeState(stored.promoCode);
        const result = applyPromoCode(stored.promoCode, SERVICE_FEE);
        setPromoDiscount(result.valid ? result.discount : 0);
        setPromoMessage(result.valid ? result.message : null);
      }
    } else {
      setDeliveryAddressState(loadDeliveryAddress());
    }
    setHydrated(true);
  }, []);

  const setDeliveryAddress = useCallback((address: string) => {
    setDeliveryAddressState(address);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ADDRESS_STORAGE_KEY, address);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const setOrderNotes = useCallback((notes: string) => {
    setOrderNotesState(notes);
  }, []);

  const setDeliverySchedule = useCallback((schedule: string) => {
    setDeliveryScheduleState(schedule);
  }, []);

  const setPromoCode = useCallback((code: string) => {
    setPromoCodeState(code);
    const result = applyPromoCode(code, SERVICE_FEE);
    setPromoDiscount(result.valid ? result.discount : 0);
    setPromoMessage(result.valid ? result.message : result.message || null);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart({
      restaurantId,
      restaurantName,
      items,
      tip,
      deliveryAddress,
      orderNotes,
      deliverySchedule,
      promoCode,
    });
  }, [
    restaurantId,
    restaurantName,
    items,
    tip,
    deliveryAddress,
    orderNotes,
    deliverySchedule,
    promoCode,
    hydrated,
  ]);

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
    (item: AddItemInput) => {
      const qty = item.quantity ?? 1;
      const lineId = item.lineId ?? item.menuItemId;
      setItems((prev) => {
        const existing = prev.find((i) => i.lineId === lineId);
        if (existing) {
          return prev.map((i) =>
            i.lineId === lineId
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [
          ...prev,
          normalizeCartItem({ ...item, lineId, quantity: qty }),
        ];
      });
      triggerPulse();
      setCartOpen(true);
    },
    [triggerPulse]
  );

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setTip(4);
    setCartOpen(false);
  }, []);

  const reorderFromOrder = useCallback((order: PlacedOrder) => {
    setRestaurantId(order.restaurantId);
    setRestaurantName(order.restaurantName);
    setItems(order.items.map(normalizeCartItem));
    setTip(order.tip);
    setCartOpen(true);
    triggerPulse();
  }, [triggerPulse]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const serviceFee = items.length > 0 ? Math.max(0, SERVICE_FEE - promoDiscount) : 0;
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + serviceFee + deliveryFee + tip;

  const placeOrder = useCallback((): PlacedOrder | null => {
    if (items.length === 0 || !restaurantId || !restaurantName) return null;
    if (!validateDeliveryAddress(deliveryAddress).valid) return null;

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
      orderNotes: orderNotes.trim() || undefined,
      deliverySchedule: deliverySchedule === "asap" ? "ASAP" : deliverySchedule,
      promoDiscount: promoDiscount > 0 ? promoDiscount : undefined,
    };

    savePlacedOrder(order);
    addNotification({
      title: `${restaurantName} order placed`,
      message: "Your order was placed successfully.",
      createdAt: new Date().toISOString(),
      type: "order",
      orderId: order.id,
    });
    setItems([]);
    setCartOpen(false);
    setRestaurantId(null);
    setRestaurantName(null);
    setTip(4);
    setOrderNotesState("");
    setDeliveryScheduleState("asap");
    setCustomTipMode(false);

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
    deliveryAddress,
    orderNotes,
    deliverySchedule,
    promoDiscount,
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
      reorderFromOrder,
      deliveryAddress,
      setDeliveryAddress,
      deliveryAddressValid: addressValidation.valid,
      deliveryAddressError: addressValidation.message,
      orderNotes,
      setOrderNotes,
      deliverySchedule,
      setDeliverySchedule,
      promoCode,
      setPromoCode,
      promoDiscount,
      promoMessage,
      customTipMode,
      setCustomTipMode,
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
      reorderFromOrder,
      deliveryAddress,
      setDeliveryAddress,
      addressValidation.valid,
      addressValidation.message,
      orderNotes,
      setOrderNotes,
      deliverySchedule,
      setDeliverySchedule,
      promoCode,
      setPromoCode,
      promoDiscount,
      promoMessage,
      customTipMode,
      setCustomTipMode,
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
