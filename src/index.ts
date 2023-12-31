import './css/core.css';
import './css/mark.css';
import './css/format-painter.css';
import './css/heading.css';
import './css/list.css';
import './css/blockquote.css';
import './css/box.css';
import './css/hr.css';
import './css/image.css';
import { BoxDefinition } from './types/box';
import * as Utils from './utils';
import { Nodes } from './models/nodes';
import { Range } from './models/range';
import { HTMLParser } from './parsers/html-parser';
import { TextParser } from './parsers/text-parser';
import { Core } from './core';
import paste from './plugins/paste';
import undo from './plugins/undo';
import redo from './plugins/redo';
import selectAll from './plugins/select-all';
import heading from './plugins/heading';
import blockquote from './plugins/blockquote';
import list from './plugins/list';
import align from './plugins/align';
import indent from './plugins/indent';
import bold from './plugins/bold';
import italic from './plugins/italic';
import underline from './plugins/underline';
import strikethrough from './plugins/strikethrough';
import subscript from './plugins/subscript';
import superscript from './plugins/superscript';
import code from './plugins/code';
import fontFamily from './plugins/font-family';
import fontSize from './plugins/font-size';
import fontColor from './plugins/font-color';
import highlight from './plugins/highlight';
import removeFormat from './plugins/remove-format';
import formatPainter from './plugins/format-painter';
import link from './plugins/link';
import unlink from './plugins/unlink';
import hr, { hrBox } from './plugins/hr';
import image, { imageBox } from './plugins/image';
import enterKey from './plugins/enter-key';
import shiftEnterKey from './plugins/shift-enter-key';
import backspaceKey from './plugins/backspace-key';
import deleteKey from './plugins/delete-key';
import tabKey from './plugins/tab-key';
import arrowKeys from './plugins/arrow-keys';
import markdown from './plugins/markdown';

Core.box.add(hrBox);
Core.box.add(imageBox);

Core.plugin.add(paste);
Core.plugin.add(undo);
Core.plugin.add(redo);
Core.plugin.add(selectAll);
Core.plugin.add(heading);
Core.plugin.add(blockquote);
Core.plugin.add(list);
Core.plugin.add(align);
Core.plugin.add(indent);
Core.plugin.add(bold);
Core.plugin.add(italic);
Core.plugin.add(underline);
Core.plugin.add(strikethrough);
Core.plugin.add(subscript);
Core.plugin.add(superscript);
Core.plugin.add(code);
Core.plugin.add(fontFamily);
Core.plugin.add(fontSize);
Core.plugin.add(fontColor);
Core.plugin.add(highlight);
Core.plugin.add(removeFormat);
Core.plugin.add(formatPainter);
Core.plugin.add(link);
Core.plugin.add(unlink);
Core.plugin.add(hr);
Core.plugin.add(image);
Core.plugin.add(enterKey);
Core.plugin.add(shiftEnterKey);
Core.plugin.add(backspaceKey);
Core.plugin.add(deleteKey);
Core.plugin.add(tabKey);
Core.plugin.add(arrowKeys);
Core.plugin.add(markdown);

export {
  BoxDefinition,
  Utils,
  Nodes,
  Range,
  HTMLParser,
  TextParser,
};

export default Core;
