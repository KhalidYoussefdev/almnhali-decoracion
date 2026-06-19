export function deepMerge<T extends object>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults } as T;
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const overVal = overrides[key];
    if (overVal === undefined) continue;
    const defVal = defaults[key];
    if (
      typeof defVal === 'object' &&
      defVal !== null &&
      !Array.isArray(defVal) &&
      typeof overVal === 'object' &&
      overVal !== null &&
      !Array.isArray(overVal)
    ) {
      result[key] = deepMerge(defVal as object, overVal as object) as T[keyof T];
    } else {
      result[key] = overVal as T[keyof T];
    }
  }
  return result;
}