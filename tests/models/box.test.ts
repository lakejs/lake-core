import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';

describe('models / box', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      value: {
        url: 'http://foo.com',
      },
      render: value => `<img src="${value?.url}" />`,
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('constructor: is a string', () => {
    const box = new Box('blockBox');
    container.append(box.node);
    expect(container.html()).to.equal('<lake-box type="block" name="blockBox"></lake-box>');
  });

  it('constructor: is a native node', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box').get(0));
    expect(box.name).to.equal('blockBox');
  });

  it('property: type', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    expect(box.type).to.equal('block');
  });

  it('property: name', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    expect(box.name).to.equal('blockBox');
  });

  it('property: value', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.value = {
      foo: 1,
    };
    expect(box.value.foo).to.equal(1);
  });

  it('method: render', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(container.find('lake-box').children().length).to.equal(3);
  });

  it('method: update', () => {
    container.html('<lake-box type="inline" name="inlineBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(box.value.url).to.equal('http://foo.com');
    expect(container.find('img').attr('src')).to.equal('http://foo.com');
    box.update({
      url: 'http://bar.com',
    });
    expect(box.value.url).to.equal('http://bar.com');
    expect(container.find('img').attr('src')).to.equal('http://bar.com');
  });

  it('method: remove', () => {
    container.html('<p>foo</p><lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    box.remove();
    expect(container.html()).to.equal('<p>foo</p>');
  });

});
