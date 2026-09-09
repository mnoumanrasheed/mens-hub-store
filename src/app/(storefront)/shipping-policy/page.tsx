import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("shipping-policy"); }
export default function Page() { return <PolicyContent slug="shipping-policy" />; }
