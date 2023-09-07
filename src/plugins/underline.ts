import type LakeCore from '../main';
import { getTags, addMark, removeMark } from '../operations';

const tagName = 'u';

export default (editor: LakeCore) => {
  editor.commands.add('underline', () => {
    editor.focus();
    const range = editor.selection.range;
    const appliedTags = getTags(range);
    if (appliedTags.find(item => item.name === tagName)) {
      removeMark(range, `<${tagName} />`);
    } else {
      addMark(range, `<${tagName} />`);
    }
    editor.select();
  });
};
