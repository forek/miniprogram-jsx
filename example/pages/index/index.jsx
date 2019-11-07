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

Page({
  data: {
    root: {}
  },
  onLoad () {
    this.setData({ root: this.render() })
  },
  render () {
    const text = 'hello world'
    return <view>
      <view>{text}</view>
      <MyComponent />
    </view>
  }
})
