const echarts = require('echarts');
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
      const scrollWrapper = theChartHolder.closest('.hman-scroll-wrapper');
      const resizablePanel = theChartHolder.closest('.shared-reportvisualizer.ui-resizable');
      if (scrollWrapper && resizablePanel) {
        const panelHeight = resizablePanel.clientHeight;
        scrollWrapper.style.height = `${panelHeight}px`;
        scrollWrapper.style.overflowY = panelHeight < contentHeight ? 'scroll' : 'hidden';
      }
    }
    if (hasProperty) {
      myChart.resize();
    }
  }
}
module.exports = _reflow;