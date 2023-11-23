import './css/core.css';
import './css/mark.css';
import './css/format-painter.css';
import './css/heading.css';
import './css/list.css';
import './css/blockquote.css';
import './css/box.css';
import './css/hr.css';
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
import hr from './plugins/hr';
import enter from './plugins/enter';
import shiftEnter from './plugins/shift-enter';
import backspace from './plugins/backspace';
import tab from './plugins/tab';
import markdown from './plugins/markdown';

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
Core.plugin.add(hr);
Core.plugin.add(enter);
Core.plugin.add(shiftEnter);
Core.plugin.add(backspace);
Core.plugin.add(tab);
Core.plugin.add(markdown);

export {
  Utils,
  Nodes,
  Range,
  HTMLParser,
  TextParser,
};

export default Core;
