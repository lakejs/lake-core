import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function insertBookmark(range: Range): { anchor: Nodes, focus: Nodes } {
  if (range.isCollapsed) {
    const focus = query('<bookmark type="focus" />');
    const endRange = range.clone().collapseToEnd();
    endRange.insertNode(focus);
    return {
      anchor: new Nodes(),
      focus,
    };
  }
  const anchor = query('<bookmark type="anchor" />');
  const focus = query('<bookmark type="focus" />');
  const startRange = range.clone().collapseToStart();
  startRange.insertNode(anchor);
  const endRange = range.clone().collapseToEnd();
  endRange.insertNode(focus);
  return {
    anchor,
    focus,
  };
}