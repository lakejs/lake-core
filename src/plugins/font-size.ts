import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('fontSize', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-size: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
