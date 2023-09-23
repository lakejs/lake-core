import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('align', (type: string) => {
    editor.focus();
    editor.selection.setBlocks({
      'text-align': type,
    });
    editor.history.save();
    editor.select();
  });
};