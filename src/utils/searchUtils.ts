export const normalizeVietnamese = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
};

export const matchSearchQuery = (text: string | undefined | null, query: string): boolean => {
  if (!text || !query) return false;
  const q = query.trim();
  if (!q) return false;

  // Direct substring match (case insensitive)
  if (text.toLowerCase().includes(q.toLowerCase())) {
    return true;
  }

  // Normalized Vietnamese match (without accents & lowercased)
  const normalizedText = normalizeVietnamese(text);
  const normalizedQuery = normalizeVietnamese(q);
  return normalizedText.includes(normalizedQuery);
};
