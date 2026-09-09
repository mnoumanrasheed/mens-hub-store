"use client";

import { useActionState } from "react";
import { deleteProductAction, toggleProductAction } from "@/actions/products";
import { initialMutationState } from "@/types/mutation-state";

export function ProductToggle({ id, field, value, label }: { id: string; field: string; value: boolean; label: string }) {
  const [state, action, pending] = useActionState(toggleProductAction, initialMutationState);
  return <form action={action}><input type="hidden" name="id" value={id} /><input type="hidden" name="field" value={field} /><input type="hidden" name="value" value={String(value)} /><button className="admin-action" disabled={pending}>{pending ? "Working…" : label}</button>{state.status === "error" ? <p className="mt-1 max-w-44 text-xs text-red-700">{state.message}</p> : null}</form>;
}

export function ProductDelete({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(deleteProductAction, initialMutationState);
  return <form action={action} onSubmit={(event) => { if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="admin-action text-red-700" disabled={pending}>{pending ? "Deleting…" : "Delete"}</button>{state.status === "error" ? <p className="mt-1 max-w-44 text-xs text-red-700">{state.message}</p> : null}</form>;
}
