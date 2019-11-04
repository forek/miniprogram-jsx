class Node {
  constructor (type) {
    this.type = type
  }
}

class TextNode extends Node {
  constructor ({ text }) {
    super('text')
    this.text = text
  }
}

class TagNode extends Node {
  constructor ({ tag, props, children }) {
    super('tag')
    this.tag = tag
    this.props = props
    this.children = children
  }
}

class ComponentNode extends Node {
  constructor ({ instance, props, children }) {
    super('component')
    this.instance = instance
    this.props = props
    this.children = children
  }
}

class FragmentNode extends Node {
  constructor ({ children }) {
    super('fragment')
    this.children = children
  }
}

class MpJSXComponent {
  constructor (opts) {
    this.isMpJSXComponent = true
    this.opts = opts
    this.render = opts.render
  }
}

function createMpJSXComponent (fn) {
  return new MpJSXComponent(fn)
}

function isMpJSXComponent (obj) {
  return obj instanceof MpJSXComponent
}

module.exports = {
  Node,
  TextNode,
  TagNode,
  ComponentNode,
  FragmentNode,
  createMpJSXComponent,
  isMpJSXComponent
}
