import type Editor from '..';

const tagName = 'u';

export default (editor: Editor) => {
  editor.command.add('underline', () => {
    const appliedNodes = editor.selection.getAppliedNodes();
    if (appliedNodes.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
  editor.keystroke.setKeydown('mod+u', event => {
    event.preventDefault();
    editor.command.execute('underline');
  });
};
