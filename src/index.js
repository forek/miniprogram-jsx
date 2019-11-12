const { FragmentNode, ComponentNode, TextNode, TagNode, Node, EmptyNode } = require('./node')

function createElement (tag, props, children) {
  children = Array.isArray(children) ? children : [children]

  children = children.map(child => {
    if (!child) return new EmptyNode()
    if (Array.isArray(child)) return new FragmentNode({ children: child })
    if (child instanceof Node) return child
    return new TextNode({ text: String(child) })
  })

  if (typeof tag === 'string') return new TagNode({ tag, props, children })

  if (tag && typeof tag === 'object' && tag.isMpJSXComponent) return new ComponentNode({ component: tag, props, children })

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
