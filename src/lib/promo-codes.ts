import { SERVICE_FEE } from "@/lib/pricing";

export const PROMO_EAT76 = "EAT76";
export const PROMO_EAT76_DISCOUNT = SERVICE_FEE;

export function applyPromoCode(
  code: string,
  serviceFee: number
): { valid: boolean; discount: number; message: string } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discount: 0, message: "" };
  }
  if (normalized === PROMO_EAT76) {
    return {
      valid: true,
      discount: Math.min(serviceFee, PROMO_EAT76_DISCOUNT),
      message: "EAT76 applied. $1.76 off service fee.",
    };
  }
  return { valid: false, discount: 0, message: "Code not recognized" };
}
