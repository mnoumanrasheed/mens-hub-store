type SizeOptionInput = string | string[] | null | undefined;

/**
 * Converts legacy packed values such as "m,l,xl" into the individual values
 * used by the PDP, cart, and WhatsApp validation.
 */
export function normalizeProductSizeOptions(value: SizeOptionInput): string[] {
  const source = Array.isArray(value) ? value : [value];
  const options = source.flatMap((item) => {
    const label = item?.trim();
    if (!label) return [];
    if (/^one[\s-]?size$/i.test(label)) return ["ONE SIZE"];

    return label.split(/[,;|]+|\s+/);
  });

  return [...new Set(options.map((option) => option.trim().toUpperCase()).filter(Boolean))];
}
