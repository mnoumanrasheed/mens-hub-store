import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("terms-and-conditions"); }
export default function Page() { return <PolicyContent slug="terms-and-conditions" />; }
