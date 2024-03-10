export function arrayToPlaceholder(array) {
  return array.map(() => '?').join(', ');
}
