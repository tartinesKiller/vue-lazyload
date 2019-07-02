import { inBrowser } from './util'

export default (lazy) => {
  return {
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      container: {
        default: () => window
      },
      id: {
        type: Number,
        default: undefined
      }
    },
    render (h) {
      if (this.show === false) {
        return h(this.tag)
      }
      return h(this.tag, null, this.$slots.default)
    },
    data () {
      return {
        el: null,
        state: {
          loaded: false
        },
        rectEl: undefined,
        rectContainer: undefined,
        show: false
      }
    },
    computed: {
      isWindow () {
        return this.container.toString && this.container.toString() === '[object Window]'
      }
    },
    mounted () {
      this.el = this.$el
      lazy.addLazyBox(this)
      lazy.lazyLoadHandler()
    },
    beforeDestroy () {
      lazy.removeComponent(this)
    },
    methods: {
      getRects () {
        this.rectEl = this.$el.getBoundingClientRect()
        if (!this.isWindow) {
          this.rectContainer = this.container.getBoundingClientRect()
        }
      },
      checkInView () {
        this.getRects()
        if (this.isWindow) {
          return inBrowser &&
                      (this.rectEl.top < window.innerHeight * lazy.options.preLoad && this.rectEl.bottom > 0) &&
                      (this.rectEl.left < window.innerWidth * lazy.options.preLoad && this.rectEl.right > 0)
        } else {
          return inBrowser &&
                      this.rectEl.top > this.rectContainer.top && this.rectEl.top < this.rectContainer.bottom
        }
      },
      load () {
        this.show = true
        this.state.loaded = true
        this.$emit('show', this)
      }
    }
  }
}
