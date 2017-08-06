
export default {
  name: 'navbar',
  props: ['titles','currentItemIndex'],
  mounted: function(){
    // var $this = $(this.$el)
    // var $tabItems = $this.find('.tab-item')
    // var $indicator = $this.find('.indicator')

    // var subWidth = (100 / $tabItems.length) + '%'
    
    // $tabItems.width(subWidth)
    // $indicator.width(subWidth)
  },
  data: function(){
    return {
      showTab: true,
      //position of indicator (left)
      indicatorPos: 0,  
      //use to resolve clash between touch & mouse event
      handleByTouch: {
        start: false, //touchstart -> mousedown
        end: false //touchend -> mouseup
      }
    }
  },

  watch:{
    //position of indicator (left)
    currentItemIndex: function(){
      if(this.$el)
        var activeTab = this.$el.children[1].children[this.currentItemIndex]
        this.indicatorPos = $(activeTab).offset().left + 'px'
    }
  },

  methods:{
    switchTab: function(e){
      this.$emit('tabChange', $(e.currentTarget).index())
    },

    waving: function(e){
      if(this.handleByTouch.down){
        this.handleByTouch.down = false
        return;
      }
      var $this = $(e.currentTarget)
      var $dotContainer = $this.find('.dot-container')
      var $dot = $dotContainer.find('.dot')

      if(e instanceof TouchEvent) {
        e = e.touches[0]
        this.handleByTouch.down = true
      }
      //计算点击位置
      var radius = Math.sqrt(Math.pow($this.width(), 2) + Math.pow($this.height(), 2))
      var x = e.pageX - $this.offset().left
      var y = e.pageY - $this.offset().top
      var offsetX = x - radius
      var offsetY = y - radius
      $dot.css({
        width: radius * 2,
        height: radius * 2,
        left: offsetX,
        top: offsetY
      })
      $dot.addClass('active')
      setTimeout(() => $dot.removeClass('active'), 400)
    }
  }
}