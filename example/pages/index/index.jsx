const mpjsx = require('../../../src/index')

const MyComponent = {
  isMpJSXComponent: true,
  data () {
    return { text: 'hello component' }
  },
  attached () {
    this.handleTap = this.handleTap.bind(this)
  },
  handleTap () {
    this.setData({ text: 'click!' })
  },
  render () {
    return <view bindtap={this.handleTap}>{this.data.text}</view>
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
