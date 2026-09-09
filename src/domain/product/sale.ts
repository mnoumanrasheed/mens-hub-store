export type SaleWindow = {
  originalPrice: string;
  salePrice: string | null;
  saleEnabled: boolean;
  saleStartAt: Date | null;
  saleEndAt: Date | null;
};

const moneyPattern = /^\d+(?:\.\d{1,2})?$/;

function moneyToMinorUnits(value: string): bigint | null {
  if (!moneyPattern.test(value)) {
    return null;
  }

  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
}

export type SalePresentation = {
  active: boolean;
  effectivePrice: string;
  discountPercent: number | null;
};

export function getSalePresentation(sale: SaleWindow, now = new Date()): SalePresentation {
  if (!isSaleActive(sale, now) || sale.salePrice === null) {
    return { active: false, effectivePrice: sale.originalPrice, discountPercent: null };
  }
  const original = moneyToMinorUnits(sale.originalPrice);
  const discounted = moneyToMinorUnits(sale.salePrice);
  if (original === null || discounted === null || original <= BigInt(0)) {
    return { active: false, effectivePrice: sale.originalPrice, discountPercent: null };
  }
  const discountPercent = Number(((original - discounted) * BigInt(100) + original / BigInt(2)) / original);
  return { active: true, effectivePrice: sale.salePrice, discountPercent };
}

export function isSaleActive(sale: SaleWindow, now = new Date()): boolean {
  if (!sale.saleEnabled || sale.salePrice === null) {
    return false;
  }

  const originalPrice = moneyToMinorUnits(sale.originalPrice);
  const salePrice = moneyToMinorUnits(sale.salePrice);

  if (
    originalPrice === null ||
    salePrice === null ||
    salePrice <= BigInt(0) ||
    salePrice >= originalPrice
  ) {
    return false;
  }

  if (sale.saleStartAt && now < sale.saleStartAt) {
    return false;
  }

  if (sale.saleEndAt && now > sale.saleEndAt) {
    return false;
  }

  return true;
}
