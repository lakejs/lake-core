import type Editor from '..';
import { blockTagNames } from '../config/tag-names';
import { getElementRules } from '../config/element-rules';
import { forEach, wrapNodeList, changeTagName, fixNumberedList, removeBr, query } from '../utils';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { HTMLParser } from '../parsers/html-parser';
import { TextParser } from '../parsers/text-parser';

const blockSelector = Array.from(blockTagNames).join(',');

function fixNestedBlocks(block: Nodes): void {
  const nodeList = [ block ];
  for  (const node of block.getWalker()) {
    nodeList.push(node);
  }
  for (const node of nodeList) {
    if (node.name === 'div') {
      if (node.find(blockSelector).length > 0) {
        node.remove(true);
      } else {
        changeTagName(node, 'p');
      }
    } else if (node.isHeading || ['blockquote', 'li'].indexOf(node.name) >= 0) {
      node.find(blockSelector).remove(true);
    }
  }
}

function fixClipboardData(fragment: DocumentFragment): void {
  let node = new Nodes(fragment.firstChild);
  while (node.length > 0) {
    const nextNode = node.next();
    if (node.isBlock) {
      fixNestedBlocks(node);
    }
    node = nextNode;
  }
  let nodeList: Nodes[] = [];
  node = new Nodes(fragment.firstChild);
  while (node.length > 0) {
    const nextNode = node.next();
    if (node.isMark || node.isText || node.isBookmark) {
      nodeList.push(node);
    } else {
      wrapNodeList(nodeList);
      nodeList = [];
    }
    node = nextNode;
  }
  wrapNodeList(nodeList);
}

function insertFirstNode(editor: Editor, otherNode: Nodes): void {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  if (boxNode.length > 0) {
    const box = new Box(boxNode);
    if (box.type === 'inline') {
      if (range.isBoxLeft) {
        range.selectBoxLeft(boxNode);
      } else if (range.isBoxRight) {
        range.selectBoxRight(boxNode);
      } else {
        editor.selection.removeBox();
      }
    } else {
      const paragraph = query('<p />');
      if (range.isBoxLeft) {
        boxNode.before(paragraph);
        range.shrinkAfter(paragraph);
      } else if (range.isBoxRight) {
        boxNode.after(paragraph);
        range.shrinkAfter(paragraph);
      } else {
        editor.selection.removeBox();
      }
    }
  }
  const block = range.startNode.closestBlock();
  if (otherNode.first().length > 0) {
    removeBr(block);
  }
  if (block.isEmpty && block.name === 'p') {
    block.replaceWith(otherNode);
    range.shrinkAfter(otherNode);
    return;
  }
  let child = otherNode.first();
  while(child.length > 0) {
    if (child.name === 'li') {
      child = child.first();
    }
    const nextSibling = child.next();
    editor.selection.insertNode(child);
    child = nextSibling;
  }
  otherNode.remove();
}

function pasteFragment(editor: Editor, fragment: DocumentFragment): void {
  const selection = editor.selection;
  const range = selection.range;
  if (fragment.childNodes.length === 0) {
    return;
  }
  const firstNode = new Nodes(fragment.firstChild);
  let lastNode = new Nodes(fragment.lastChild);
  if (range.getBlocks().length === 0) {
    selection.setBlocks('<p />');
  }
  insertFirstNode(editor, firstNode);
  // remove br
  let child = new Nodes(fragment.firstChild);
  while (child.length > 0) {
    const next = child.next();
    if (child.name === 'br') {
      child.remove();
    }
    child = next;
  }
  lastNode = new Nodes(fragment.lastChild);
  // insert fragment
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    if (parts.right && parts.right.isEmpty) {
      parts.right.remove();
    }
    selection.insertFragment(fragment);
    range.shrinkAfter(lastNode);
  }
  fixNumberedList(editor.container.children().filter(node => node.isBlock));
  editor.history.save();
}

export default (editor: Editor) => {
  editor.container.on('paste', event => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    editor.selection.deleteContents();
    const types = dataTransfer.types;
    const isPlainText = (types.length === 1 && types[0] === 'text/plain');
    if (isPlainText) {
      const content = dataTransfer.getData('text/plain');
      const textParser = new TextParser(content);
      const fragment = textParser.getFragment();
      pasteFragment(editor, fragment);
      return;
    }
    const content = dataTransfer.getData('text/html');
    const rules = getElementRules();
    rules.div = rules.p;
    forEach(rules, (key, attributeRules) => {
      delete attributeRules.id;
      delete attributeRules.class;
    });
    const htmlParser = new HTMLParser(content, rules);
    const fragment = htmlParser.getFragment();
    fixClipboardData(fragment);
    pasteFragment(editor, fragment);
    editor.box.renderAll(editor);
  });
};
