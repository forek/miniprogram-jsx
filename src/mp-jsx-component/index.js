/* global Component */
Component({
  properties: {
    node: Object
  },
  data: {},
  lifetimes: {
    created () {
      const { node } = this.props
      if (node.type === 'component') {
        // init component
        // node.instance.setData = this.setData.bind(this)
      }
    },
    attached () {
      const { node } = this.data
      if (node.type === 'component') {
        
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
