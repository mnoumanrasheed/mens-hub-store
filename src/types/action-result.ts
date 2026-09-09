export type FieldErrors<TField extends string = string> = Partial<
  Record<TField, string[]>
>;

export type ActionResult<TData = undefined, TField extends string = string> =
  | { ok: true; data: TData }
  | {
      ok: false;
      message: string;
      fieldErrors?: FieldErrors<TField>;
    };
