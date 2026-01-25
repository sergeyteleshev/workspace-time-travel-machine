export function isValidBranchName(name: string): boolean {
  if (!name || name.length === 0) return false;
  if (name.includes('..')) return false;
  if (name.startsWith('.') || name.startsWith('/') || name.startsWith('-'))
    return false;
  if (name.endsWith('.lock') || name.endsWith('/') || name.endsWith('.'))
    return false;
  if (name.includes('//') || name.includes('@{') || name.includes('\\'))
    return false;
  if (name.includes(' ')) return false;
  if (/[~^:?*\[]/.test(name)) return false;
  return /^[a-zA-Z0-9._\/-]+$/.test(name);
}
