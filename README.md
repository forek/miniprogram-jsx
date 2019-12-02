# miniprogram-jsx
使用JSX开发(微信)小程序

## 简介
miniprogram-jsx(简称mpjsx)是一款让(微信)小程序支持使用JSX语法开发页面/组件的框架. 它在(微信)小程序原生组件的基础上扩展了小程序的开发方式, 使开发者可以用JSX语法编写完全动态的小程序页面/组件.

## 特性
* 完整支持JSX语法特性, 无任何语法用法限制
* 组件设计(生命周期, 事件系统等)基于小程序原生组件(Component), 不重复造轮子
* 开发方式贴近原生小程序, 易上手
* 基于webpack的打包工具, 支持引用多种格式文件

## 示例项目
项目地址: [Todo应用](https://github.com/forek/miniprogram-jsx-todo)

## 快速开始
### 0: 小程序项目配置
mpjsx目前只支持微信小程序, 固app.json/project.config.json等配置文件编写方式与微信小程序一致. 

### 1: 目录结构
mpjsx项目结构跟(微信)小程序基本一致, 需要在项目根目录提供app.json等配置文件:

```
├── app.json // 小程序配置文件
├── app.js
├── pages // 页面文件目录
│   ├── index
│   │   ├── index.jsx // 页面文件
│   │   ├── index.less // 样式文件
```
注意:
* 项目根目录以app.json所在的位置为准
* 页面需要在app.json中配置
* 页面可以不提供json文件和样式文件, 但必须提供js/jsx文件

### 2: 安装运行
本地安装:
```
npm i miniprogram-jsx
```
项目根目录运行打包命令:
```
npx mpjsx
```
监听模式打包
```
npx mpjsx -w
```

运行打包构建之后, 会在项目根目录生成`dist`文件夹, 使用微信开发者工具导入该文件夹即可预览开发效果.

### 3: 开发方式
#### 自定义组件
mpjsx组件以JS对象的形式编写, 必须定义`isMpJSXComponent`属性和`render`属性. 其中`render`属性为方法, 返回JSX对象作为该组件渲染结果.

```javascript
// /pages/index/index.jsx
import mpjsx from 'miniprogram-jsx' // 项目中使用JSX语法的文件必须添加该引用

// 自定义组件的变量名必须大写字母开头
const MyComponet = { 

  isMpJSXComponent: true // 必须为true, 使得该对象被视为mpjsx组件

  data () { 
    // 创建组件时调用, 返回组件data初始值
    return {
      text: ''
    }
  },

  attached () {
    // 生命周期函数, 与微信小程序一致
    this.setData({ text: 'hello world' }) // 调用this.setData方法设置组件data并触发render
  },

  render () {
    // render方法返回JSX对象
    return (
      <text>
        {this.data.text}
      </text>
    )
  }
}
```
### 组件生命周期
生命周期函数需要在组件对象顶层声明, 暂不支持声明在`lifetimes`字段内

* 支持`attached`, `ready`, `moved`, `detached`, 调用时机与微信小程序一致
* 不支持`created`, `error`
* 不支持"组件所在页面的生命周期"(即`show`, `hide`, `resize`)

### 自定义页面
开发一个页面的方式跟开发组件类似:
```javascript
import mpjsx from 'miniprogram-jsx'

const MyComponet = {
  isMpJSXComponent: true,

  onLoad () {
    // 作为页面调用的组件支持页面生命周期方法
  }
  // 其他组件代码 ...
}

// 调用mpjsx.MpJSXPage方法, 传入页面组件
mpjsx.MpJSXPage(MyComponet)
```

### 页面生命周期
用作页面的组件支持额外的页面生命周期方法, 需要声明在组件对象顶层
* 支持 `onLoad`, `onShow`, `onReady`, `onHide`, `onUnload`, `onPullDownRefresh`, `onReachBottom`, `onShareAppMessage`, `onPageScroll`, `onResize`, `onTabItemTap`, 调用时机与微信小程序一致

### 原生组件
目前阶段只支持一小部分原生组件(标签), 并且不支持HTML标签
* 以下所有标签支持通用属性: `id`, `class`, `style`, `hidden`
* 以下所有标签支持通用事件: `bindtap`
* 使用mpjsx组件时, 大部分原生标签的属性/事件名跟微信小程序一致, 但当属性名使用了 `-` 时, 该属性名必须改成`驼峰式命名` (例如: `hover-stop-propagation` 必须写成 `hoverStopPropagation`)

| 标签名     | 属性      | 事件 |备注 |
| -------- | ----------  | ---- |---- |
| view | `hoverStopPropagation`, `hoverStartTime`, `hoverClass` | | |
| text |  | | |
| button | | | |
| input | `value`, `type`, `placeholder` | `bindinput`, `bindfocus`, `bindblur`, `bindconfirm` | 自闭合 |

```javascript
const MyComponet = {
  isMpJSXComponent: true,

  handleTap () {
    console.log('点击了按钮')
  },

  render () {
    return (
      <view>
        <view class='title'>我是标题</view>
        <button id='button_1' bindtap={this.handleTap}>我是按钮</button>
      </view>
    )
  }
}
```

### 自定义组件属性
mpjsx自定义组件支持父组件传入向子组件任意类型及数量的属性, 子组件通过`this.props`对象获取. 当属性更新时, 组件会重新调用渲染. 组件不需要预先定义属性名和类型, 当有属性传入时可以直接通过`this.props`获取.

```javascript
const MyComponetA = {
  isMpJSXComponent: true,

  data () {
    console.log(this.props.content) // data方法可以接受到传入的属性
    return {}
  },

  render () {
    return (
      <text>{this.props.content}</text>
    )
  }
}

const MyComponentB = {
  isMpJSXComponent: true,

  render () {
    return (
      <view>
        <MyComponetA content='hello world'/>
      </view>
    )
  }
}

```
### 组件数据对象data
每个组件在创建实例时都会创建实例私有的data对象, 该对象主要用于渲染. 组件方法通过`this.data`访问该对象, 或使用`this.setData`方法修改对象并触发渲染更新.

```javascript
const MyComponet = {
  isMpJSXComponent: true,

  // 返回值用作组件data默认值
  data () {
    return {
      value: ''
    }
  },

  handleInput (e) {
    const { value } = e.detail
    this.setData({ value: value })
  },

  render () {
    return (
      <view>
        <text>{this.data.value}</text>
        <input
          value={this.data.value}
          bindinput={this.handleInput}
        />
      </view>
    )
  }
}
```
### 组件间关系
组件数据传递采用单向数据流设计, 当组件嵌套调用时, 数据通过属性(props)由父组件像子组件层层传递. 而当父组件需要获取子组件的数据时, 通过属性传递回调函数, 由子组件调用回调函数并传入数据.

```javascript
const MyComponetA = {
  isMpJSXComponent: true,

  handleTap (e) {
    if (this.props.onTap) this.props.onTap(e)
  },

  render () {
    return (
      <view bindtap={this.handleTap}>
        {this.props.content}
      </view>
    )
  }
}

const MyComponentB = {
  isMpJSXComponent: true,

  handleTap (e) {
    console.log('tap!', e)
  },

  render () {
    return (
      <view>
        <MyComponetA
          content='hello world'
          onTap={this.handleTap}
        />
      </view>
    )
  }
}

```
## 项目开发进度
项目目前处于预览阶段, 已具备开发需要的基本架构但尚未完善, 目前支持的功能包括:
* 完整的项目开发方式(页面/组件/样式等)
* 基于webpack的打包工具和cli, 支持打包js/jsx文件, 样式文件支持wxss/css/less格式, 当然也支持引用npm模块
* 支持常用的原生组件(标签)和部分常用事件