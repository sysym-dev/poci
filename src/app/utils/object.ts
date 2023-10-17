export function hasOwnProperty(
  obj: Record<string, any>,
  property: any,
): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}
