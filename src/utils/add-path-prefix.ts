export function addPathPrefix(path: string | undefined, prefix: string): string {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string');
  }

  if (path.startsWith(prefix)) {
    return path;
  }

  return prefix + path;
}
