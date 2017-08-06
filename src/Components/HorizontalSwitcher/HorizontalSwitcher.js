export default {
  name: 'horizontalSwitcher',
  props: ['currentViewIndex', 'contents'],
  data: function(){
    return {
      offsetX: '0px'
    }
  },

  watch: {
    currentViewIndex: function(newVal){
      if(typeof(this.$el) === 'undefined') return
      var currentView = this.$el.children[this.currentViewIndex]
      if(typeof(currentView) === 'undefined') return
        this.offsetX = '-' + $(currentView).position().left + 'px'
    }
  },

  mounted: function(){
    //设置subView与this宽度（百分比）
    // var $this = $(this.$el)
    // var $subViews = $this.find('.subView')

    // var sumWidth = (100 * $subViews.length) + '%'
    // var subWidth = (100 / $subViews.length) + '%'
    
    // $this.width(sumWidth)
    // $subViews.width(subWidth)
  }
}