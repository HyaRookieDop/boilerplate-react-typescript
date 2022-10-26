export function unique<T>(data: T[], field: keyof T) {
  const res = new Map()
  return data.filter((a) => !res.has(a[field]) && res.set(a[field], 1))
}
