function splitPieces(str: string): string[] {
  const regexp =
    /[^\p{Lu}_\-\s]+|\p{Lu}+(?![^\p{Lu}_\-\s])|\p{Lu}[^\p{Lu}_\-\s]*/gu;
  return Array.from(str.matchAll(regexp), m => m[0]);
}

export function titleCase(str: string | string[]): string {
  const pieces = Array.isArray(str) ? str : splitPieces(str);
  return pieces
    .map(s => {
      if (s.toUpperCase() === s) {
        return s;
      } else {
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      }
    })
    .join(' ');
}
