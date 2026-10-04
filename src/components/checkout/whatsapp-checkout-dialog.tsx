"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { whatsappCustomerSchema, type WhatsAppCustomer } from "@/validation/whatsapp-checkout";

type Props = { open: boolean; onClose: () => void; onContinue: (customer: WhatsAppCustomer) => Promise<void> };

const empty = { fullName: "", phone: "", address: "", city: "", email: "", notes: "" };

export function WhatsAppCheckoutDialog({ open, onClose, onContinue }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = whatsappCustomerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length))));
      return;
    }
    setErrors({});
    setPending(true);
    try { await onContinue(parsed.data); setValues(empty); } finally { setPending(false); }
  }

  function update(key: keyof typeof values, value: string) { setValues((current) => ({ ...current, [key]: value })); }

  return <dialog ref={dialog} className="m-auto w-[min(94vw,34rem)] border border-line bg-surface p-0 text-ivory shadow-2xl backdrop:bg-black/70" aria-labelledby="checkout-title" onClose={onClose} onCancel={onClose}>
    <form className="grid gap-4 p-5 sm:p-6" onSubmit={submit}>
      <div className="flex items-start justify-between gap-4"><div><p className="store-eyebrow">WhatsApp order</p><h2 id="checkout-title" className="mt-1 font-display text-3xl">Complete your order</h2><p className="mt-2 text-sm text-muted">Please provide your delivery details. Fields marked * are required.</p></div><button type="button" className="grid size-10 place-items-center text-muted hover:text-ivory" aria-label="Close checkout" onClick={onClose} disabled={pending}><X size={19} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Full Name *" name="fullName" value={values.fullName} onChange={update} error={errors.fullName} /><Field label="Contact / WhatsApp Number *" name="phone" value={values.phone} onChange={update} error={errors.phone} inputMode="tel" placeholder="03XXXXXXXXX" /><Field label="Email Address (Optional)" name="email" value={values.email} onChange={update} error={errors.email} type="email" /><Field label="City *" name="city" value={values.city} onChange={update} error={errors.city} /></div>
      <Field label="Delivery Address *" name="address" value={values.address} onChange={update} error={errors.address} textarea />
      <Field label="Order Notes (Optional)" name="notes" value={values.notes} onChange={update} error={errors.notes} textarea />
      <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" className="min-h-11 px-4 text-sm font-bold text-muted hover:text-ivory" onClick={onClose} disabled={pending}>Cancel</button><button type="submit" className="store-cta-primary justify-center" disabled={pending}>{pending ? "Opening WhatsApp..." : "Continue to WhatsApp"}</button></div>
    </form>
  </dialog>;
}

function Field({ label, name, value, onChange, error, type = "text", inputMode, placeholder, textarea = false }: { label: string; name: keyof typeof empty; value: string; onChange: (key: keyof typeof empty, value: string) => void; error?: string[]; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; placeholder?: string; textarea?: boolean }) {
  const id = "checkout-" + name;
  const classes = "mt-1 min-h-11 w-full border border-line bg-surface-raised px-3 text-sm text-ivory outline-none focus:border-gold";
  return <label className={"grid text-sm font-semibold text-ivory" + (textarea ? " sm:col-span-2" : "")} htmlFor={id}>{label}{textarea ? <textarea id={id} className={classes + " min-h-24 py-3"} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error?.length)} aria-describedby={error?.length ? id + "-error" : undefined} /> : <input id={id} className={classes} type={type} inputMode={inputMode} placeholder={placeholder} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error?.length)} aria-describedby={error?.length ? id + "-error" : undefined} />}{error?.[0] ? <span id={id + "-error"} className="mt-1 text-xs font-normal text-critical" role="alert">{error[0]}</span> : null}</label>;
}
