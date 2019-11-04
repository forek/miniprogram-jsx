const { FragmentNode, ComponentNode, TextNode, TagNode, Node, isMpJSXComponent } = require('./node')

function createElement (tag, props, children) {
  children = Array.isArray(children) ? children : [children]
  children = children.map(child => typeof child === 'string' ? new TextNode({ text: child }) : child)

  if (typeof tag === 'string') return new TagNode({ tag, props, children })

  if (isMpJSXComponent(tag)) return new ComponentNode({ instance: tag, props, children })

  if (typeof tag === 'function') {
    const result = tag(props, children)
    if (typeof result === 'string') return new TextNode({ text: result })
    if (!(result instanceof Node)) throw new Error('') // todo
    return result
  }
}

function createFragment (children) {
  children = Array.isArray(children) ? children : [children]
  return new FragmentNode({ children })
}

module.exports = {
  createElement,
  createFragment
}
