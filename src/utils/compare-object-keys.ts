export function compareObjectKeys(obj1: object, obj2: object): boolean {
  const a = obj1 as Record<string, unknown>;
  const b = obj2 as Record<string, unknown>;

  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);

  const commonKeys = keys1.filter((key) => keys2.includes(key));

  return commonKeys.every((key) => a[key] === b[key]);
}
