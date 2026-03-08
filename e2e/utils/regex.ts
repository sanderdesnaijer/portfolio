export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function titleRegExp(title: string): RegExp {
  return new RegExp(escapeRegExp(title), "i");
}
