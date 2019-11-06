/* global Component */
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
        instance.data = component.data()

        instance.setData = (obj) => {
          const { $instance } = this.data
          Object.assign($instance.data, obj)
          this.setData({ root: $instance.render() })
        }

        if (instance.attached) instance.attached()

        this.setData({ root: instance.render(), $instance: instance })
      }
    },
    ready () {

    },
    moved () {

    },
    detached () {

    }
  },
  methods: {
    bindMethods (e) {
      const { props } = this.data.node

      switch (e.type) {
        case 'tap':
          if (props && props.bindtap) props.bindtap()
          break
      }
    }
  }
})
