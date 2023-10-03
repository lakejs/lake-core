import { appendDeepest, query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Removes empty marks that contain no content.
function removeEmptyNodes(node: Nodes): void {
  if ((node.isMark || node.isText) && node.hasEmptyText) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if ((child.isMark || child.isText) && child.hasEmptyText) {
      child.remove();
    }
  }
}

// Returns an element copied from each first child of the descendants of the specified node.
function copyNestedMarks(node: Nodes, tagName?: string): Nodes | null {
  if (!node.isMark || !tagName) {
    return null;
  }
  let newMark = node.clone();
  let child = node.last();
  while (child.length > 0) {
    if (child.isMark && child.name !== tagName) {
      const newChild = child.clone();
      newMark.append(newChild);
      newMark = newChild;
    }
    child = child.last();
  }
  if (newMark.name === tagName) {
    if (newMark.first().length > 0) {
      newMark = newMark.first();
    } else {
      return null;
    }
  }
  newMark.debug();
  return newMark;
}

// Removes the specified marks from the range.
export function removeMark(range: Range, value?: string): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  let tagName;
  if (value) {
    const valueNode = query(value);
    tagName = valueNode.name;
  }
  if (range.isCollapsed) {
    if (tagName && range.commonAncestor.closest(tagName).length === 0) {
      return;
    }
    const parts = splitMarks(range, false);
    if (!parts.left) {
      return;
    }
    if (parts.right) {
      removeEmptyNodes(parts.right);
    }
    const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
    const newMark = copyNestedMarks(parts.left, tagName);
    if (!newMark) {
      parts.left.after(zeroWidthSpace);
      removeEmptyNodes(parts.left);
      range.setStartAfter(zeroWidthSpace);
      range.collapseToStart();
      return;
    }
    appendDeepest(newMark, zeroWidthSpace);
    parts.left.after(newMark);
    removeEmptyNodes(parts.left);
    // Resets the position of the selection
    range.selectNodeContents(newMark);
    range.reduce();
    range.collapseToEnd();
    return;
  }
  splitMarks(range);
  const nodeList = getMarks(range);
  const bookmark = insertBookmark(range);
  for (const node of nodeList) {
    if (node.isMark && (!tagName || node.name === tagName)) {
      node.remove(true);
    }
  }
  toBookmark(range, bookmark);
}
