const echarts = require('echarts');

function attachResizeListener(element, config) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isResizing = element.classList.contains('ui-resizable-resizing');
        const target = mutation.target;
        if (!isResizing) {
          if(target.getBoundingClientRect().height < config.theChartHeight){
            target.style.overflowY = 'auto';
            target.style.overflowX = 'hidden';
          } else {
            target.style.overflowY = 'hidden';
            target.style.overflowX = 'hidden';
          }
        }
      }
    });
  });
  observer.observe(element, { 
    attributes: true, 
    attributeFilter: ['class'] 
  });
}

// Override to respond to re-sizing events
const _reflow = function () {
  var myChart = echarts.getInstanceByDom(this.el);
  if (myChart != null) {
    let hasProperty = Object.prototype.hasOwnProperty.call(myChart, "resize");
    const currentChartEntry = this.scopedVariables['_renderedEchartsArray'].find(o => o.instanceByDom === myChart);
    if(currentChartEntry && currentChartEntry['visualizationType'] === 'timeline') {
      const theChartHolder = myChart.getDom();
      const scopedSplunkEchartsPanel = theChartHolder.parentElement.parentElement.parentElement.parentElement.parentElement;
      const theChartHeight = currentChartEntry['visualizationHeight'] || myChart.getHeight();
      attachResizeListener(scopedSplunkEchartsPanel, { theChartHeight });
      if (hasProperty) {
        myChart.resize({ height: theChartHeight });
      }
    } else if (hasProperty) {
      myChart.resize();
    }
  }
}
module.exports = _reflow;
