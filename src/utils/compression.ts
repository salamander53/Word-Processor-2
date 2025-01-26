import { diff_match_patch } from 'diff-match-patch';
import pako from 'pako';

const dmp = new diff_match_patch();

// Tính toán delta và nén
export const compressDelta = (
  oldContent: string,
  newContent: string
): Uint8Array => {
  const patches = dmp.patch_make(oldContent, newContent);
  const patchText = dmp.patch_toText(patches);
  return pako.gzip(patchText); // Nén bằng gzip
};

// Giải nén và áp dụng delta
export const decompressDelta = (
  oldContent: string,
  compressedDelta: Uint8Array
): string => {
  try {
    const patchText = pako.ungzip(compressedDelta, { to: 'string' });
    const patches = dmp.patch_fromText(patchText);
    const [newContent] = dmp.patch_apply(patches, oldContent);
    return newContent as string;
  } catch (error) {
    console.error('Decompression failed:', error);
    return oldContent; // Fallback về content cũ nếu lỗi
  }
};
