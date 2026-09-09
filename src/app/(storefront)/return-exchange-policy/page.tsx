import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("return-exchange-policy"); }
export default function Page() { return <PolicyContent slug="return-exchange-policy" />; }
