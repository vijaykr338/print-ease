import { addPathPrefix } from './add-path-prefix';

export function addBasePath(path: string | undefined): string {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string');
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return addPathPrefix(path, basePath);
}
