export default function StorefrontLoading() {
  return (
    <main className="mh-storefront-loading" aria-busy="true" aria-label="Loading page content">
      <div className="mh-storefront-loading-inner">
        <span className="mh-loading-line mh-loading-line-short" />
        <span className="mh-loading-line mh-loading-line-title" />
        <span className="mh-loading-line mh-loading-line-copy" />
        <div className="mh-storefront-loading-grid">
          <span className="mh-loading-block" />
          <div>
            <span className="mh-loading-line mh-loading-line-title" />
            <span className="mh-loading-line mh-loading-line-copy" />
            <span className="mh-loading-line mh-loading-line-copy" />
          </div>
        </div>
      </div>
    </main>
  );
}
