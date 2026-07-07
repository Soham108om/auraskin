import { Product } from '../types';

/**
 * Formats a number to Indian Rupee (₹) standard format, without decimals by default.
 * Example: 1299 -> ₹1,299
 */
export const formatRupee = (price: number): string => {
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
};

/**
 * Calculates the adjusted price of a product based on the selected size.
 * Base size (first option or default) matches base price.
 * 2nd size adds ₹450, 3rd size adds ₹850.
 */
export const getProductPrice = (product: Product, size?: string): number => {
  const basePrice = product.price;
  if (!size || !product.sizes || product.sizes.length <= 1) {
    return basePrice;
  }
  
  const index = product.sizes.indexOf(size);
  if (index === 1) {
    return basePrice + 450;
  } else if (index === 2) {
    return basePrice + 850;
  }
  
  return basePrice;
};
