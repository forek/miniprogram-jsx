import mpjsx from './index'

const pageLifetimes = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap']

function MpJSXPage (Component) {
  const pageObj = {
    data: {
      root: null,
      applyPageLifetimes: null
    },
    onLoad (query) {
      this.ready = new Promise(resolve => {
        this.setData({
          root: this.render(),
          applyPageLifetimes: {
            apply: instance => {
              instance.query = query
              pageLifetimes.forEach(key => {
                if (instance[key]) instance[key] = instance[key].bind(instance)
                this.instance = instance
                resolve()
              })
            }
          }
        })
      })
    },
    render () {
      return <Component />
    }
  }

  for (let i = 1; i < pageLifetimes.length; i++) {
    const key = pageLifetimes[i]
    pageObj[key] = async function () {
      await this.ready
      if (typeof this.instance[key] === 'function') this.instance[key].apply(null, arguments)
    }
  }

  Page(pageObj)
}

export default MpJSXPage
