"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { DELIVERY_FEE, SERVICE_FEE } from "@/lib/pricing";

type CartContextValue = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  tip: number;
  setRestaurant: (id: string, name: string) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  setTip: (tip: number) => void;
  clearCart: () => void;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [tip, setTip] = useState(4);

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
    },
    []
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
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      restaurantId,
      restaurantName,
      items,
      tip,
      setRestaurant,
      addItem,
      removeItem,
      updateQuantity,
      setTip,
      clearCart,
      subtotal,
      serviceFee: items.length > 0 ? SERVICE_FEE : 0,
      deliveryFee: items.length > 0 ? DELIVERY_FEE : 0,
      total:
        subtotal +
        (items.length > 0 ? SERVICE_FEE + DELIVERY_FEE : 0) +
        tip,
      itemCount,
    }),
    [
      restaurantId,
      restaurantName,
      items,
      tip,
      setRestaurant,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
