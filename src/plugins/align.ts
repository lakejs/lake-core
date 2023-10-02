import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('align', (type: string) => {
    editor.focus();
    editor.selection.setBlocks({
      'text-align': type,
    });
    editor.history.save();
    editor.select();
  });
};
