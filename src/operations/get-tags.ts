import { NativeElement } from '../types/native';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type AttributeMapType = {[key: string]: string};

type AppliedTagMapType = {
  name: string,
  attributes: AttributeMapType,
};

// Returns the attributes of the element as an key-value object.
function getAttributes(node: Nodes): AttributeMapType {
  const nativeNode = node.get(0) as NativeElement;
  const attributes: AttributeMapType = {};
  if (nativeNode.hasAttributes()) {
    for (const attr of nativeNode.attributes) {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}

function pushAncestralTags(appliedTags: AppliedTagMapType[], range: Range): void {
  let parentNode = range.startNode;
  if (parentNode.isText) {
    parentNode = parentNode.parent();
  }
  while (parentNode.length > 0) {
    if (!parentNode.isEditable) {
      break;
    }
    appliedTags.push({
      name: parentNode.name,
      attributes: getAttributes(parentNode),
    });
    parentNode = parentNode.parent();
  }
}

function pushNextNestedTags(appliedTags: AppliedTagMapType[], range: Range): void {
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
        appliedTags.push({
          name: child.name,
          attributes: getAttributes(child),
        });
      }
      child = child.first();
    }
  }
}

// Returns the applied tags of the selection.
export function getTags(range: Range): AppliedTagMapType[] {
  const appliedTags: AppliedTagMapType[] = [];
  pushAncestralTags(appliedTags, range);
  pushNextNestedTags(appliedTags, range);
  return appliedTags;
}
