const echarts = require('echarts');

function syncTimelineScrollWrapper(chartHolder, contentHeight) {
  const scrollWrapper = chartHolder.closest('.hman-scroll-wrapper');
  if (!scrollWrapper) {
    return;
  }

  const wrapperParent = scrollWrapper.parentElement;
  const resizablePanel = chartHolder.closest('.shared-reportvisualizer.ui-resizable');
  const availableHeight = wrapperParent && wrapperParent.clientHeight > 0
    ? wrapperParent.clientHeight
    : (resizablePanel ? resizablePanel.clientHeight : 0);

  if (availableHeight > 0) {
    scrollWrapper.style.height = `${availableHeight}px`;
    scrollWrapper.style.maxHeight = `${availableHeight}px`;
  } else if (contentHeight) {
    scrollWrapper.style.height = `${contentHeight}px`;
    scrollWrapper.style.maxHeight = `${contentHeight}px`;
  } else {
    scrollWrapper.style.height = '';
    scrollWrapper.style.maxHeight = '';
  }

  scrollWrapper.style.overflowY = 'auto';
  scrollWrapper.style.overflowX = 'hidden';
  scrollWrapper.style.minHeight = '0';
}

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
      syncTimelineScrollWrapper(theChartHolder, contentHeight);
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
