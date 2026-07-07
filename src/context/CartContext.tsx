import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { trackEvent } from '../utils/analytics';
import { getProductPrice } from '../utils/currency';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedScent?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedScent?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedScent?: string) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartTotal: number;
  discountAmount: number;
  subtotal: number;
  shipping: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('auraskin_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem('auraskin_coupon') || '';
  });

  useEffect(() => {
    localStorage.setItem('auraskin_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('auraskin_coupon', couponCode);
  }, [couponCode]);

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedScent?: string) => {
    // Default size and scent if not provided
    const sizeVal = selectedSize || product.sizes?.[0] || product.size;
    const scentVal = selectedScent || product.scents?.[0] || "Signature Blend";

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => 
        item.product.id === product.id &&
        (item.selectedSize || item.product.size) === sizeVal &&
        (item.selectedScent || "Signature Blend") === scentVal
      );

      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.product.id === product.id &&
          (item.selectedSize || item.product.size) === sizeVal &&
          (item.selectedScent || "Signature Blend") === scentVal
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity, selectedSize: sizeVal, selectedScent: scentVal }];
      }
      return newItems;
    });

    const sizePrice = getProductPrice(product, sizeVal);
    const discPrice = sizePrice - (sizePrice * product.discount) / 100;

    trackEvent({
      name: 'add_to_cart',
      params: {
        item_id: product.id,
        item_name: product.name,
        price: discPrice,
        quantity,
        size: sizeVal,
        scent: scentVal,
      },
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedScent?: string) => {
    const sizeVal = selectedSize || "";
    const scentVal = selectedScent || "";

    const itemToRemove = cartItems.find((item) => 
      item.product.id === productId &&
      (item.selectedSize || "") === sizeVal &&
      (item.selectedScent || "") === scentVal
    );

    setCartItems((prevItems) => prevItems.filter((item) => 
      !(item.product.id === productId &&
        (item.selectedSize || "") === sizeVal &&
        (item.selectedScent || "") === scentVal)
    ));

    if (itemToRemove) {
      const sizePrice = getProductPrice(itemToRemove.product, itemToRemove.selectedSize);
      trackEvent({
        name: 'remove_from_cart',
        params: {
          item_id: itemToRemove.product.id,
          item_name: itemToRemove.product.name,
          price: sizePrice - (sizePrice * itemToRemove.product.discount) / 100,
          size: itemToRemove.selectedSize,
          scent: itemToRemove.selectedScent,
        },
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedScent?: string) => {
    const sizeVal = selectedSize || "";
    const scentVal = selectedScent || "";

    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedScent);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        (item.selectedSize || "") === sizeVal &&
        (item.selectedScent || "") === scentVal
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AURAGLOW' || cleanCode === 'WELCOME10') {
      setCouponCode(cleanCode);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const sizePrice = getProductPrice(item.product, item.selectedSize);
    const discountedPrice = sizePrice - (sizePrice * item.product.discount) / 100;
    return acc + discountedPrice * item.quantity;
  }, 0);

  let discountRate = 0;
  if (couponCode === 'AURAGLOW') discountRate = 0.15; // 15% off
  else if (couponCode === 'WELCOME10') discountRate = 0.1; // 10% off

  const discountAmount = subtotal * discountRate;
  const cartTotal = subtotal - discountAmount;
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free shipping over ₹1500, else ₹99
  const finalTotal = cartTotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        applyCoupon,
        removeCoupon,
        cartTotal,
        discountAmount,
        subtotal,
        shipping,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
