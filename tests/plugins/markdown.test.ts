import { testPlugin } from '../utils';

describe('markdown plugin', () => {

  it('keystroke: set heading 1', () => {
    const content = `
    <p># <focus />foo</p>
    `;
    const output = `
    <h1># <focus />foo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keyup('space');
      },
    );
  });

  it('keystroke: set heading 2', () => {
    const content = `
    <p>## <focus />foo</p>
    `;
    const output = `
    <h2>## <focus />foo</h2>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keyup('space');
      },
    );
  });

});
