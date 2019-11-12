/* global Component */
function lifetimeCaller (lifetime) {
  if (this.data.node.type !== 'component') return
  const { $instance } = this.data
  if ($instance[lifetime]) $instance[lifetime]()
}

function applyProps (instance, props) {
  instance.props = Object.assign({}, props)
}

Component({
  options: {
    pureDataPattern: /^$/,
    styleIsolation: 'apply-shared'
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
        applyProps(instance, node.props)

        instance.data = instance.data ? instance.data() : {}

        for (const key in instance) {
          if (key in component && typeof instance[key] === 'function') {
            instance[key] = instance[key].bind(instance)
          }
        }

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
  },
  observers: {
    node: function (node) {
      if (node && node.type === 'component' && this.data.$instance && node.props) {
        applyProps(this.data.$instance, node.props)
        this.data.$instance.forceUpdate()
      }
    }
  }
})
