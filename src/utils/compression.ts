import pako from 'pako';

/**
 * Nén HTML thành Uint8Array (binary)
 */
export const compressHTML = (html: string): Uint8Array => {
  return pako.gzip(html);
};

/**
 * Giải nén Uint8Array thành HTML
 */
export const decompressHTML = (compressed: Uint8Array): string => {
  try {
    return pako.ungzip(compressed, { to: 'string' });
  } catch (error) {
    console.error('Failed to decompress HTML:', error);
    return ''; // Fallback nếu giải nén thất bại
  }
};
