export const checkoutFeatureKey = 'checkout';

export type CheckoutState = {
  cartProductsIds: string[];
};

export const initialCheckoutState: CheckoutState = {
  cartProductsIds: []
};
