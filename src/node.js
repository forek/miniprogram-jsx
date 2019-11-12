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
  constructor ({ component, props, children }) {
    super('component')
    this.component = component
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

class EmptyNode extends Node {
  constructor () {
    super('empty')
  }
}

module.exports = {
  Node,
  TextNode,
  TagNode,
  ComponentNode,
  FragmentNode,
  EmptyNode
}
