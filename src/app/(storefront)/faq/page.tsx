import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("faq"); }
export default function Page() { return <PolicyContent slug="faq" />; }
