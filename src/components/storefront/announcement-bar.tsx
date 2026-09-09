import Link from "next/link";
import { cn } from "@/lib/cn";

type Announcement = { text: string; linkUrl: string | null; linkLabel: string | null; background: "DARK" | "GOLD" | "CRITICAL" };
export function AnnouncementBar({ announcement }: { announcement: Announcement | null }) {
  if (!announcement) return null;
  const external = announcement.linkUrl?.startsWith("https://");
  return <aside className={cn("px-4 py-2.5 text-center text-xs font-bold tracking-wide", announcement.background === "GOLD" && "bg-gold text-gold-ink", announcement.background === "CRITICAL" && "bg-critical text-white", announcement.background === "DARK" && "border-b border-line bg-surface text-ivory")}><span>{announcement.text}</span>{announcement.linkUrl && announcement.linkLabel ? <>{" "}<Link className="underline underline-offset-4" href={announcement.linkUrl} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{announcement.linkLabel}</Link></> : null}</aside>;
}
