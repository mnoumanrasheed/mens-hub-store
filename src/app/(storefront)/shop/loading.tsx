import { Container } from "@/components/storefront/container";

export default function ShopLoading() {
  return (
    <main className="py-10 sm:py-20" aria-busy="true">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_auto] lg:items-end">
          <div>
            <div className="h-3 w-28 loading-shimmer" />
            <div className="mt-5 h-14 w-full max-w-lg loading-shimmer sm:h-16" />
            <div className="mt-4 h-4 w-full max-w-2xl loading-shimmer" />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 min-[430px]:gap-4 sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="loading-product-card">
              <div className="aspect-[4/5] loading-shimmer" />
              <div className="mt-4 h-3 w-20 loading-shimmer" />
              <div className="mt-3 h-4 w-4/5 loading-shimmer" />
              <div className="mt-3 h-4 w-24 loading-shimmer" />
              <div className="mt-5 h-11 w-full loading-shimmer" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
