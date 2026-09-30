export function matchesSearchQuery(
  query: string,
  ...values: string[]
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return (
    normalizedQuery.length === 0 ||
    values.some((value) => value.toLowerCase().includes(normalizedQuery))
  );
}
