export class Node {
  constructor (type) {
    this.type = type
  }
}

export class TextNode extends Node {
  constructor ({ text }) {
    super('text')
    this.text = text
  }
}

export class TagNode extends Node {
  constructor ({ tag, props, children }) {
    super('tag')
    this.tag = tag
    this.props = props
    this.children = children
  }
}

export class ComponentNode extends Node {
  constructor ({ component, props, children }) {
    super('component')
    this.component = component
    this.props = props
    this.children = children
  }
}

export class FragmentNode extends Node {
  constructor ({ children }) {
    super('fragment')
    this.children = children
  }
}

export class EmptyNode extends Node {
  constructor () {
    super('empty')
  }
}
