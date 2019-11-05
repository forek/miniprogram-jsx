/* global Component */
Component({
  properties: {
    node: Object
  },
  data: {
    root: null
  },
  lifetimes: {
    created () {

    },
    attached () {
      const { node } = this.data
      if (node.type === 'component') {
        const { component } = node
        this.instance = Object.create(component)
        this.instance.data = {}
        this.instance.setData = (obj) => {
          Object.assign(this.instance.data, obj)
          this.setData({ root: this.instance.render() })
        }
        this.instance.setData(component.data())
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
          if (props && props.bindtap) props.bindtap(e)
          break
      }
    }
  }
})
