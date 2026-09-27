import { Container } from "@/components/storefront/container";

export default function ProductLoading() {
  return (
    <main className="mh-pdp mh-pdp-loading" aria-busy="true" aria-label="Loading product">
      <Container size="wide">
        <div className="mh-pdp-loading-breadcrumb">
          <span className="mh-loading-line mh-loading-line-short" />
        </div>
        <div className="mh-pdp-layout">
          <div className="mh-pdp-loading-media mh-loading-block" />
          <div className="mh-pdp-loading-information">
            <span className="mh-loading-line mh-loading-line-short" />
            <span className="mh-loading-line mh-loading-line-product-title" />
            <span className="mh-loading-line mh-loading-line-copy" />
            <span className="mh-loading-line mh-loading-line-copy" />
            <span className="mh-loading-block mh-pdp-loading-action" />
            <span className="mh-loading-block mh-pdp-loading-action" />
          </div>
        </div>
      </Container>
    </main>
  );
}
