import { testOperation } from '../utils';
import { setBlocks } from '../../src/operations/set-blocks';

describe('operations.setBlocks()', () => {

  it('no text is selected', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1>foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('after select the contents of a block', () => {
    const content = `
    <p>outer start</p>
    <p><anchor />foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1><anchor />foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('adds styles by passing through a string value', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <p style="text-align: center;">f<anchor />oo<strong>bold</strong></p>
    <p style="text-align: center;"><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p style="text-align: center;"></p>');
      },
    );
  });

  it('adds styles by passing through an object value', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <p style="text-align: center;">f<anchor />oo<strong>bold</strong></p>
    <p style="text-align: center;"><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, {
          'text-align': 'center',
        });
      },
    );
  });

  it('sets multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>f<anchor />oo<strong>bold</strong></h2>
    <h2>heading</h2>
    <h2><i>itelic</i>ba<focus />r</h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2></h2>');
      },
    );
  });

  it('creates a new block when the selected contents are not in a block', () => {
    const content = `
    foo<strong>bar<focus /></strong>cat
    `;
    const output = `
    <h2>foo<strong>bar<focus /></strong>cat</h2>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });

  it('creates a new block when there is only a text', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('creates a new block among other blocks', () => {
    const content = `
    <p>outer start</p>
    foo<strong>bar<focus /></strong>end
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>foo<strong>bar<focus /></strong>end</h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });

  it('sets a nested block when no text is selected', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p>foo<strong>bold</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <blockquote><ul><li>foo<strong>bold</strong><focus /></li></ul></blockquote>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ul><li></li></ul>');
      },
    );
  });

  it('sets blockquotes after select multi-block', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p><anchor />foo1<strong>bold1</strong></p></blockquote>
    <blockquote><p>foo2<strong>bold2</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <blockquote type="error"><p><anchor />foo1<strong>bold1</strong></p></blockquote>
    <blockquote type="error"><p>foo2<strong>bold2</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<blockquote type="error" />');
      },
    );
  });

  it('should create a list when there is no block', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <ol start="1"><li>foo<focus />bar</li></ol>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a block to a list', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>foo<strong>bold</strong><focus /></li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a list to another list', () => {
    const content = `
    <p>outer start</p>
    <ul><li>foo<strong>bold</strong><focus /></li></ul>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>foo<strong>bold</strong><focus /></li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a list to a heading', () => {
    const content = `
    <p>outer start</p>
    <ul><li>foo<strong>bold</strong><focus /></li></ul>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1>foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('should change multi-block to a list', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>f<anchor />oo<strong>bold</strong></li></ol>
    <ol start="2"><li>heading</li></ol>
    <ol start="3"><li><i>itelic</i>ba<focus />r</li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

});
