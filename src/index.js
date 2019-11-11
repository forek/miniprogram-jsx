const { FragmentNode, ComponentNode, TextNode, TagNode, Node } = require('./node')

function createElement (tag, props, children) {
  children = Array.isArray(children) ? children : [children]

  children = children.reduce((result, child) => {
    // 需要修改babel插件 去掉空字符节点
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      result.push(new TextNode({ text: child }))
    } else if (Array.isArray(child)) {
      result.push(new FragmentNode({ children: child }))
    } else {
      result.push(child)
    }
    return result
  }, [])

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
