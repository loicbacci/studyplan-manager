export const removeUndefined = (obj: object) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != undefined));
}