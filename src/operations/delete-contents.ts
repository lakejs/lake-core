import { Range } from '../models/range';

// Removes the contents of the specified range.
export function deleteContents(range: Range): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  const nativeRange = range.get();
  nativeRange.deleteContents();
}
