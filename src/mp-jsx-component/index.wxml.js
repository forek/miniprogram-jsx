const EMPTY_STRING = "''"

const PUBLIC_ATTRS = [
  {
    name: 'id'
  },
  {
    name: 'class'
  },
  {
    name: 'style'
  },
  {
    name: 'hidden'
  }
]

const PUBLIC_METHODS = [
  'bindtap'
]

const TAG_LIST = [
  {
    tag: 'view',
    attrs: [
      {
        name: 'hover-class',
        alias: 'hoverClass'
      },
      {
        name: 'hover-stop-propagation',
        alias: 'hoverStopPropagation'
      },
      {
        name: 'hover-start-time',
        alias: 'hoverStartTime',
        default: '50'
      },
      {
        name: 'hover-class',
        alias: 'hoverClass'
      }
    ],
    methods: []
  },
  {
    tag: 'button',
    attrs: [],
    methods: []
  },
  {
    tag: 'input',
    isSelfColseTag: true,
    attrs: [
      {
        name: 'value'
      },
      {
        name: 'type',
        default: "'text'"
      },
      {
        name: 'placeholder'
      }
    ],
    methods: [
      'bindinput',
      'bindfocus',
      'bindblur',
      'bindconfirm'
    ]
  }
]

const MP_JSX_COMPONENT = 'mp-jsx-component'

const MAP_TAG_LIST = list => list.map((item, i) => item.isSelfColseTag
  ? `<${item.tag} wx:${i === 0 ? 'if' : 'elif'}="{{node.tag === '${item.tag}'}}" ${MAP_TAG_ATTRS(item.attrs)} ${MAP_TAG_METHODS(item.methods)} />`
  : `<${item.tag} wx:${i === 0 ? 'if' : 'elif'}="{{node.tag === '${item.tag}'}}" ${MAP_TAG_ATTRS(item.attrs)} ${MAP_TAG_METHODS(item.methods)}>
      ${RENDER_CHILDREN('node.children')}
    </${item.tag}>
  `).join('\n')

const MAP_TAG_ATTRS = attrs => PUBLIC_ATTRS.concat(attrs || []).map(item =>
  `${item.name}="{{node.props.${item.alias || item.name} || ${item.default || EMPTY_STRING}}}"`
).join(' ')

const MAP_TAG_METHODS = methods => PUBLIC_METHODS.concat(methods || []).map(item =>
  `${item}="bindMethods"`
).join(' ')

const RENDER_CHILDREN = CHILDREN => `
  <block wx:if="{{${CHILDREN}}}" wx:for="{{${CHILDREN}}}" wx:key="{{item.props.key || index}}">
    <block wx:if="{{item}}">
      <${MP_JSX_COMPONENT} node="{{item}}" />
    </block>
  </block>
`

const RENDER_TEXT = TEXT => `{{${TEXT}}}`

const RENDER_TEMPLATE = () => `
  <block>
    <block wx:if="{{node.type === 'text'}}">
      ${RENDER_TEXT('node.text')}
    </block>
    <block wx:elif="{{node.type === 'tag'}}">
      ${MAP_TAG_LIST(TAG_LIST)}
    </block>
    <block wx:elif="{{node.type === 'component'}}">
      <${MP_JSX_COMPONENT} node="{{root}}" />
    </block>
    <block wx:elif="{{node.type === 'fragment'}}">
      ${RENDER_CHILDREN('node.children')}
    </block>
  </block>
`

module.exports = () => RENDER_TEMPLATE()
