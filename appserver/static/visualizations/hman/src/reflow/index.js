const echarts = require('echarts');
const { scheduleTimelineScrollWrapperSync } = require('../timelineLayoutUtils');

// Override to respond to re-sizing events
const _reflow = function () {
  var myChart = echarts.getInstanceByDom(this.el);
  if (myChart != null) {
    let hasProperty = Object.prototype.hasOwnProperty.call(myChart, "resize");
    const currentChartEntry = this.scopedVariables['_renderedEchartsArray'].find(o => o.instanceByDom === myChart);
    if(currentChartEntry && currentChartEntry['visualizationType'] === 'timeline') {
      const theChartHolder = myChart.getDom();
      const contentHeight = currentChartEntry['visualizationHeight'];
      theChartHolder.style.height = `${contentHeight}px`;
      currentChartEntry['timelineViewportHeight'] = scheduleTimelineScrollWrapperSync(theChartHolder, contentHeight, currentChartEntry['timelineViewportHeight']);
    }
    if (hasProperty) {
      if (currentChartEntry && currentChartEntry['visualizationType'] === 'timeline' && currentChartEntry['visualizationHeight']) {
        myChart.resize({ height: currentChartEntry['visualizationHeight'] });
      } else {
        myChart.resize();
      }
    }
  }
}
module.exports = _reflow;
