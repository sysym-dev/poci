export interface ParsedPaginate {
  limit: number;
  offset: number;
  number: number;
}

export function parsePaginate(size?: number, number?: number): ParsedPaginate {
  const limit = size ?? 10;
  const offset = ((number ?? 1) - 1) * limit;

  return {
    limit,
    offset,
    number: number ?? 1,
  };
}
