export type SaleWindow = {
  originalPrice: string;
  salePrice: string | null;
};

const moneyPattern = /^\d+(?:\.\d{1,2})?$/;

function moneyToMinorUnits(value: string): bigint | null {
  if (!moneyPattern.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
}

export type SalePresentation = {
  active: boolean;
  effectivePrice: string;
  discountPercent: number | null;
};

export function getSalePresentation(sale: SaleWindow): SalePresentation {
  if (!sale.salePrice) return { active: false, effectivePrice: sale.originalPrice, discountPercent: null };
  const original = moneyToMinorUnits(sale.originalPrice);
  const discounted = moneyToMinorUnits(sale.salePrice);
  if (original === null || discounted === null || discounted <= BigInt(0) || discounted >= original) {
    return { active: false, effectivePrice: sale.originalPrice, discountPercent: null };
  }
  const discountPercent = Number(((original - discounted) * BigInt(100) + original / BigInt(2)) / original);
  return { active: true, effectivePrice: sale.salePrice, discountPercent };
}

export function isSaleActive(sale: SaleWindow): boolean {
  return getSalePresentation(sale).active;
}
