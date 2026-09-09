import { PolicyContent, policyMetadata } from "@/components/storefront/managed-page";
export function generateMetadata() { return policyMetadata("size-guide"); }
export default function Page() { return <PolicyContent slug="size-guide" />; }
