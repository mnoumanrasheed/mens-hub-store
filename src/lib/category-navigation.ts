export const storefrontCategoryOrder = [
  "shirts",
  "pants",
  "shalwar-qameez",
  "trousers",
  "tracksuits",
  "perfumes",
  "accessories",
  "shoes",
] as const;

export const accessoryCategorySlugs = ["watches", "glasses", "belts"] as const;

type CategoryLike = { slug: string };

function orderIndex(slug: string) {
  const index = storefrontCategoryOrder.indexOf(slug as (typeof storefrontCategoryOrder)[number]);
  return index === -1 ? storefrontCategoryOrder.length : index;
}

export function orderStorefrontCategories<T extends CategoryLike>(categories: readonly T[]) {
  return [...categories].sort((left, right) => orderIndex(left.slug) - orderIndex(right.slug));
}

export function isAccessoryCategory(slug: string) {
  return (accessoryCategorySlugs as readonly string[]).includes(slug);
}

export function getTopLevelStorefrontCategories<T extends CategoryLike>(categories: readonly T[]) {
  return orderStorefrontCategories(categories.filter((category) => !isAccessoryCategory(category.slug)));
}

export function getAccessoryStorefrontCategories<T extends CategoryLike>(categories: readonly T[]) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  return accessoryCategorySlugs.flatMap((slug) => {
    const category = bySlug.get(slug);
    return category ? [category] : [];
  });
}

export type StorefrontNavigationItem<T extends CategoryLike> = T & { children: T[] };

export function getStorefrontNavigation<T extends CategoryLike>(categories: readonly T[]): StorefrontNavigationItem<T>[] {
  const accessories = categories.find((category) => category.slug === "accessories");
  const accessoryChildren = getAccessoryStorefrontCategories(categories);

  return getTopLevelStorefrontCategories(categories).map((category) => ({
    ...category,
    children: category.slug === "accessories" && accessories ? accessoryChildren : [],
  }));
}
