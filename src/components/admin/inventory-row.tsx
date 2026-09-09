"use client";

import { useActionState } from "react";
import { updateInventoryAction } from "@/actions/products";
import { initialMutationState } from "@/types/mutation-state";

export function InventoryRow({ product, threshold }: { product: { id: string; name: string; sku: string; totalArticles: number; availableArticles: number; soldArticles: number }; threshold: number }) {
  const [state, action, pending] = useActionState(updateInventoryAction, initialMutationState);
  const status = product.availableArticles === 0 ? "OUT OF STOCK" : product.availableArticles <= threshold ? `ONLY ${product.availableArticles} LEFT` : "IN STOCK";
  return <form action={action} className="grid gap-3 border-b border-admin-line p-4 last:border-0 lg:grid-cols-[minmax(220px,1fr)_repeat(3,110px)_130px_110px] lg:items-end">
    <input type="hidden" name="id" value={product.id} />
    <div><p className="font-bold text-admin-ink">{product.name}</p><p className="text-xs text-admin-muted">{product.sku}</p>{state.message ? <p className={`mt-1 text-xs ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p> : null}</div>
    <NumberField name="totalArticles" label="Total" value={product.totalArticles} /><NumberField name="availableArticles" label="Available" value={product.availableArticles} /><NumberField name="soldArticles" label="Sold" value={product.soldArticles} />
    <span className={`rounded-full px-3 py-2 text-center text-xs font-bold ${product.availableArticles === 0 ? "bg-red-100 text-red-800" : product.availableArticles <= threshold ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"}`}>{status}</span>
    <button className="admin-button" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
  </form>;
}
function NumberField({ name, label, value }: { name: string; label: string; value: number }) { return <label className="grid gap-1 text-xs font-bold text-admin-muted">{label}<input className="min-h-10 rounded border border-admin-line bg-white px-2 text-sm text-admin-ink" name={name} type="number" min="0" defaultValue={value} /></label>; }
