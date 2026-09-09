import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("privacy-policy"); }
export default function Page() { return <PolicyContent slug="privacy-policy" />; }
