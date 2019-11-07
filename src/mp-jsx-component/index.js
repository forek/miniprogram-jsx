/* global Component */
function lifetimeCaller (lifetime) {
  if (this.data.node.type !== 'component') return
  const { $instance } = this.data
  if ($instance[lifetime]) $instance[lifetime]()
}

Component({
  options: {
    pureDataPattern: /^$/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    node: Object
  },
  data: {
    root: null,
    $instance: null
  },
  lifetimes: {
    created () {

    },
    attached () {
      const { node } = this.data
      if (node.type === 'component') {
        const { component } = node
        const instance = Object.create(component)
        instance.data = instance.data ? instance.data() : {}

        instance.setData = (obj) => {
          const { $instance } = this.data
          Object.assign($instance.data, obj)
          this.setData({ root: $instance.render() })
        }

        instance.forceUpdate = () => {
          this.setData({ root: this.data.$instance.render() })
        }

        if (instance.attached) instance.attached()

        this.setData({ root: instance.render(), $instance: instance })
      }
    },
    ready () {
      lifetimeCaller.call(this, 'ready')
    },
    moved () {
      lifetimeCaller.call(this, 'moved')
    },
    detached () {
      lifetimeCaller.call(this, 'detached')
    }
  },
  methods: {
    bindMethods (e) {
      const { props } = this.data.node
      if (props && props[`bind${e.type}`]) props[`bind${e.type}`](e)
    }
  }
})
