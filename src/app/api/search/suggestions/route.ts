import { NextResponse } from "next/server";
import { getSearchSuggestions } from "@/data/storefront";
import { suggestionQuerySchema } from "@/validation/storefront";
import { acceptPublicRequest } from "@/lib/public-rate-limit";
export async function GET(request: Request) { if (!(await acceptPublicRequest(request, "search", 30))) return NextResponse.json({ results: [] }, { status: 429, headers: { "Cache-Control": "private, no-store" } }); const parsed = suggestionQuerySchema.safeParse(new URL(request.url).searchParams.get("q")); if (!parsed.success) return NextResponse.json({ results: [] }, { headers: { "Cache-Control": "private, no-store" } }); const results = await getSearchSuggestions(parsed.data); return NextResponse.json({ results }, { headers: { "Cache-Control": "private, no-store" } }); }
