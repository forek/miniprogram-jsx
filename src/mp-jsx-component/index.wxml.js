const TAG_LIST = [
  {
    tag: 'view',
    attrs: [
      { name: 'style', default: "''" }
    ],
    methods: ['bindtap']
  },
  {
    tag: 'button',
    attrs: [
      { name: 'style', default: "''" }
    ],
    methods: ['bindtap']
  }
]

const MP_JSX_COMPONENT = 'mp-jsx-component'

const MAP_TAG_LIST = list => list.map(item => `
  <${item.tag} wx:if="{{node.type === '${item.tag}'}}" ${MAP_TAG_ATTRS(item.attrs)} ${MAP_TAG_METHODS(item.methods)}>
    ${RENDER_CHILDREN('node.children')}
  </${item.tag}>
`).join('\n')

const MAP_TAG_ATTRS = attrs => attrs.map(item =>
  `${item.name}="{{node.props.${item.name} || ${item.default}}}"`
).join(' ')

const MAP_TAG_METHODS = methods => methods.map(item =>
  `${item}="bindMethods"`
).join(' ')

const RENDER_CHILDREN = CHILDREN => `
  <block wx:if="{{${CHILDREN}}}" wx:for="{{${CHILDREN}}}">
    <${MP_JSX_COMPONENT} node="{{item}}" />
  </block>
`

const RENDER_TEXT = TEXT => `{{${TEXT}}}`

const RENDER_TEMPLATE = () => `
  <block>
    <block wx:if="{{node.type === 'text'}}">
      ${RENDER_TEXT('node.text')}
    </block>
    <block wx:if="{{node.type === 'tag'}}">
      ${MAP_TAG_LIST(TAG_LIST)}
    </block>
  </block>
`

module.exports = () => RENDER_TEMPLATE()