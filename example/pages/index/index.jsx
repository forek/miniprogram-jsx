const mpjsx = require('../../../src/index')

const MyComponentB = {
  isMpJSXComponent: true,
  attached () {
    console.log('MyComponentB attached')
  },
  ready () {
    console.log('MyComponentB ready')
  },
  detached () {
    console.log('MyComponentB detached')
  },
  render () {
    return <view>hello MyComponentB</view>
  }
}

const MyComponent = {
  isMpJSXComponent: true,
  data () {
    return { value: 'hello input!' }
  },
  attached () {
    this.handleInput = this.handleInput.bind(this)
  },
  handleInput (e) {
    const { value } = e.detail
    this.setData({ value: value })
  },
  renderList () {
    const arr = [];
    ['hello foo', 'hello bar', 'hello baz'].forEach(item => {
      arr.push(<view key={item}>{item}</view>)
    })
    return <view>{arr}</view>
  },
  render () {
    const { value } = this.data
    const el = (
      <view>
        <view>输入内容: {this.data.value}</view>
        <input type='text' value={value} bindinput={this.handleInput} />
        {this.renderList()}
        {value.length > 10 && <MyComponentB />}
        <view>111</view>
      </view>
    )
    return el
  }
}

const TodoList = {
  isMpJSXComponent: true,
  render () {
    return (
      <view>
        {this.props.items.map(item => (
          <view class='todo-item' key={item.id} bindtap={this.props.onRemoveItem.bind(null, item)}> * {item.text}</view>
        ))}
      </view>
    )
  }
}

const Todo = {
  isMpJSXComponent: true,
  data () {
    return { items: [], text: '' }
  },
  handleChange (e) {
    const { value } = e.detail
    this.setData({ text: value })
  },
  handleSubmit (e) {
    if (!this.data.text.length) return
    const newItem = {
      text: this.data.text,
      id: Date.now()
    }
    this.setData({
      items: this.data.items.concat(newItem),
      text: ''
    })
  },
  handleRemove (item, e) {
    this.setData({ items: this.data.items.filter(v => v.id !== item.id) })
  },
  render () {
    return (
      <view class='main'>
        <view>TODO</view>
        <TodoList items={this.data.items} onRemoveItem={this.handleRemove} />
        <input type='text' value={this.data.text} bindinput={this.handleChange} />
        <button bindtap={this.handleSubmit}>
          Add #{this.data.items.length + 1}
        </button>
      </view>
    )
  }
}

function MpJSXPage (opts) {
  Page(opts)
}

MpJSXPage({
  data: {
    root: null
  },
  onLoad () {
    this.setData({ root: this.render() })
  },
  render () {
    return <Todo />
  }
})
