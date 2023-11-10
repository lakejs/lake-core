import type Editor from '..';
import { Point } from '../types/object';

const headingTypeMap = new Map([
  ['#', 'h1'],
  ['##', 'h2'],
  ['###', 'h3'],
  ['####', 'h4'],
  ['#####', 'h5'],
  ['######', 'h6'],
]);

const markSpaceList = [
  {
    re: /(\*\*)([^*]+)(\*\*)$/,
    getParameters: () => [
      'bold',
    ],
  },
];

const blockSpaceList = [
  {
    re: /^#+$/,
    getParameters: (text: string) => [
      'heading',
      headingTypeMap.get(text) ?? 'h6',
    ],
  },
  {
    re: /^\d+\.$/,
    getParameters: () => [
      'list',
      'numbered',
    ],
  },
  {
    re: /^[*\-+]$/,
    getParameters: () => [
      'list',
      'bulleted',
    ],
  },
  {
    re: /^\[\s?\]$/,
    getParameters: () => [
      'list',
      'checklist',
      false,
    ],
  },
  {
    re: /^\[x\]$/i,
    getParameters: () => [
      'list',
      'checklist',
      true,
    ],
  },
  {
    re: /^>$/,
    getParameters: () => [
      'blockquote',
    ],
  },
];

function getMarkdownPoint(editor: Editor): Point | void {
  const selection = editor.selection;
  const range = selection.range;
  let node = range.startNode;
  let offset = range.startOffset;
  if (offset === 0) {
    return;
  }
  if (node.isElement) {
    const child = node.children()[offset - 1];
    if (!child || !child.isText) {
      return;
    }
    node = child;
    offset = node.text().length;
  }
  if (offset < 2) {
    return;
  }
  return {
    node,
    offset,
  };
}

function executeMarkCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  const range = selection.range;
  editor.command.event.emit('execute:before');
  const offset = point.offset;
  const text = point.node.text().slice(0, offset - 1);
  for (const item of markSpaceList) {
    const result = item.re.exec(text);
    if (result !== null) {
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      const oldValue = node.text();
      const newValue = `${oldValue.slice(0, -1).replace(item.re, '$2')}\u200B`;
      node.get(0).nodeValue = newValue;
      range.setStart(node, offset - result[0].length - 1);
      range.setEnd(node, offset - (oldValue.length - newValue.length) - 1);
      const parameters = item.getParameters();
      editor.command.execute(parameters[0] as string);
      selection.toBookmark(bookmark);
      return true;
    }
  }
  return false;
}

function executeBlockCommand(editor: Editor, point: Point): boolean {
  const selection = editor.selection;
  editor.command.event.emit('execute:before');
  const offset = point.offset;
  const text = point.node.text().slice(0, offset - 1);
  for (const item of blockSpaceList) {
    if (item.re.test(text)) {
      const bookmark = selection.insertBookmark();
      const node = bookmark.focus.prev();
      node.remove();
      const block = bookmark.focus.closestBlock();
      if (block.isEmpty) {
        block.prepend('<br />');
        selection.range.selectAfterNodeContents(block);
      }
      const parameters = item.getParameters(text);
      editor.command.execute(parameters.shift() as string, ...parameters);
      selection.toBookmark(bookmark);
      return true;
    }
  }
  return false;
}

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', () => {
    const selection = editor.selection;
    const point = getMarkdownPoint(editor);
    if (!point) {
      return;
    }
    const isMatched = executeMarkCommand(editor, point);
    if (isMatched) {
      return;
    }
    const block = selection.getBlocks()[0];
    if (block && !(block.isHeading || block.name === 'p')) {
      return;
    }
    executeBlockCommand(editor, point);
  });
};