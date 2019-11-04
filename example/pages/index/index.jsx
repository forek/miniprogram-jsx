// const MpJSXPage = function () {}
// const MpJSXComponent = function () {}

// const MyComponent = MpJSXComponent({
//   data: {
//     text: 'I am component'
//   },
//   render () {
//     const { text } = this.data
//     return <view>{text}</view>
//   }
// })

// MpJSXPage({
//   data: {
//     text: 'hello world'
//   },
//   render () {
//     const { text } = this.data
//     return <view>
//       <view>{text}</view>
//       <MyComponent />
//     </view>
//   }
// })
const mpjsx = require('../../../src/index')

Page({
  onLoad () {
    console.log(this.render())
  },
  render () {
    // const { text } = this.data
    const text = 'hello world'
    return <view>
      <view>{text}</view>
    </view>
  }
})
