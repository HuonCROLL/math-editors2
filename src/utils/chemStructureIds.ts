/** Generate a unique chemical-structure reference id for HTML + embeds. */
export function createChemStructureId(): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `mol_${Date.now().toString(36)}_${suffix}`;
}
