import type Editor from '..';
import { BoxDefinition } from '../types/box';

export const hrBox: BoxDefinition = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.selection.insertBox('hr');
    editor.history.save();
  });
};
