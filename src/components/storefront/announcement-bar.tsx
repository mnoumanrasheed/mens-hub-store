import Link from "next/link";

const message = "FREE DELIVERY ACROSS PAKISTAN ON ORDERS PKR 10,000+";

export function AnnouncementBar() {
  return (
    <Link href="/shipping-returns" className="mh-announcement-bar" aria-label="Free delivery across Pakistan on orders PKR 10,000 or more">
      <span className="mh-announcement-viewport" aria-hidden="true">
        <span className="mh-announcement-track">
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
          <span className="mh-announcement-group"><span>{message}</span><i>•</i></span>
        </span>
      </span>
    </Link>
  );
}
