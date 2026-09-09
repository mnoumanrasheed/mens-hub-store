import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("how-to-order"); }
export default function Page() { return <PolicyContent slug="how-to-order" />; }
