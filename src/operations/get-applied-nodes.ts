import { KeyValue } from '../types/object';
import { NativeElement } from '../types/native';
import { parseStyle } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type AppliedTagMapType = {
  node: Nodes,
  name: string,
  attributes: KeyValue,
  styles: KeyValue,
};

// Returns the attributes of the element as an key-value object.
function getAttributes(node: Nodes): KeyValue {
  const nativeNode = node.get(0) as NativeElement;
  const attributes: KeyValue = {};
  if (nativeNode.hasAttributes()) {
    for (const attr of nativeNode.attributes) {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}

function pushAncestralNodes(appliedNodes: AppliedTagMapType[], range: Range): void {
  let parentNode = range.startNode;
  if (parentNode.isText) {
    parentNode = parentNode.parent();
  }
  while (parentNode.length > 0) {
    if (!parentNode.isEditable) {
      break;
    }
    appliedNodes.push({
      node: parentNode.clone(),
      name: parentNode.name,
      attributes: getAttributes(parentNode),
      styles: parseStyle(parentNode.attr('style')),
    });
    parentNode = parentNode.parent();
  }
}

function pushNextNestedNodes(appliedNodes: AppliedTagMapType[], range: Range): void {
  const startNode = range.startNode;
  let nextNode;
  if (startNode.isText && startNode.text().length === range.startOffset) {
    const node = startNode.next();
    if (node.length > 0 && node.isElement) {
      nextNode = node;
    }
  }
  if (startNode.isElement) {
    const children = startNode.children();
    if (children.length > 0) {
      const node = children[range.startOffset];
      if (node && node.isElement) {
        nextNode = node;
      }
    }
  }
  if (nextNode) {
    let child = nextNode;
    while (child.length > 0) {
      if (child.isElement) {
        appliedNodes.push({
          node: child.clone(),
          name: child.name,
          attributes: getAttributes(child),
          styles: parseStyle(child.attr('style')),
        });
      }
      child = child.first();
    }
  }
}

// Returns the applied nodes of the selection.
export function getAppliedNodes(range: Range): AppliedTagMapType[] {
  const appliedNodes: AppliedTagMapType[] = [];
  pushAncestralNodes(appliedNodes, range);
  pushNextNestedNodes(appliedNodes, range);
  return appliedNodes;
}