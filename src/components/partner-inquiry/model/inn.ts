export function isValidInn(value: string): boolean {
  if (!/^(?:\d{10}|\d{12})$/.test(value)) return false;

  const digits = [...value].map(Number);
  const checksum = (weights: number[]) =>
    weights.reduce((sum, weight, index) => sum + weight * digits[index], 0) % 11 % 10;

  if (digits.length === 10) {
    return checksum([2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[9];
  }

  return (
    checksum([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[10] &&
    checksum([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[11]
  );
}
