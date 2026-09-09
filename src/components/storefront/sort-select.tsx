"use client";

export function SortSelect({ value }: { value: string }) {
  return <><label className="sr-only" htmlFor="sort-products">Sort products</label><select id="sort-products" name="sort" defaultValue={value} className="store-filter-input" onChange={(event) => event.currentTarget.form?.requestSubmit()}><option value="newest">Newest</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="discount">Discount</option><option value="featured">Featured</option></select></>;
}
