Component({
  properties: {
    node: Object
  },
  data: {},
  lifetimes: {
    created () {

    },
    attached () {

    },
    ready () {

    },
    moved () {

    },
    detached () {

    }
  },
  methods: {
    bindMethods(e) {
      const { props } = this.data.node
      switch (e.type) {
        case 'tap':
          if (props && props.bindtap) props.bindtap(e)
          break;
      }
    }
  }
})