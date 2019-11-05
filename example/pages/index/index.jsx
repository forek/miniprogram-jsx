const mpjsx = require('../../../src/index')

const MyComponent = {
  isMpJSXComponent: true,
  data () {
    return { text: 'hello MyComponent' }
  },
  render () {
    return <view>{this.data.text}</view>
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
