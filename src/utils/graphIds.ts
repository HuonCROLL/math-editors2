/** Generate a unique graph embed reference id for HTML + embeds. */
export function createGraphEmbedId(): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `graph_${Date.now().toString(36)}_${suffix}`;
}
