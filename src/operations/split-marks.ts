import { splitNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type TwoParts = {
  left: Nodes | null;
  right: Nodes | null;
};

type ThreeParts = TwoParts & {
  center: Nodes | null;
};

// Removes empty marks that contain no content.
function removeEmptyMarks(node: Nodes): void {
  if (node.isMark && node.hasEmptyText) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if (child.isMark && child.hasEmptyText) {
      child.remove();
    }
  }
}

// Splits text nodes or mark nodes at a specified position.
function splitMarksAtPoint(node: Nodes, offset: number, removeEmptyMark: boolean): TwoParts {
  let left = null;
  let right = null;
  const block = node.closestBlock();
  const parts = splitNodes(node, offset, block);
  if (parts) {
    if (removeEmptyMark) {
      removeEmptyMarks(parts.left);
      removeEmptyMarks(parts.right);
      if (!parts.left.hasEmptyText) {
        left = parts.left;
      }
      if (!parts.right.hasEmptyText) {
        right = parts.right;
      }
    } else {
      left = parts.left;
      right = parts.right;
    }
  }
  return {
    left,
    right,
  };
}

// Splits text nodes or mark nodes.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
export function splitMarks(range: Range, removeEmptyMark: boolean = true): ThreeParts {
  if (!range.commonAncestor.isContentEditable) {
    return {
      left: null,
      center: null,
      right: null,
    };
  }
  if (range.isCollapsed) {
    const parts = splitMarksAtPoint(range.startNode, range.startOffset, removeEmptyMark);
    if (parts.left) {
      range.setStartAfter(parts.left);
      range.collapseToStart();
    } else if (parts.right) {
      range.setStartBefore(parts.right);
      range.collapseToStart();
    }
    return {
      left: parts.left,
      center: null,
      right: parts.right,
    };
  }
  const startParts = splitMarksAtPoint(range.startNode, range.startOffset, removeEmptyMark);
  if (startParts.left) {
    range.setStartAfter(startParts.left);
  } else if (startParts.right) {
    range.setStartBefore(startParts.right);
  }
  const endParts = splitMarksAtPoint(range.endNode, range.endOffset, removeEmptyMark);
  if (endParts.left) {
    range.setEndAfter(endParts.left);
  } else if (endParts.right) {
    range.setEndBefore(endParts.right);
  }
  return {
    left: startParts.left,
    center: endParts.left,
    right: endParts.right,
  };
}
