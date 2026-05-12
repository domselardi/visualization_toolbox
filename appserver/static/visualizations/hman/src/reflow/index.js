const echarts = require('echarts');

// Toggle vertical scrolling on the Splunk panel depending on whether the timeline canvas
// is taller than the panel. Skipped while the user is actively dragging the resize handle.
function applyPanelOverflow(panelEl, chartHeight) {
  if (!panelEl || panelEl.classList.contains('ui-resizable-resizing')) { return; }
  panelEl.style.overflowX = 'hidden';
  panelEl.style.overflowY = panelEl.getBoundingClientRect().height < chartHeight ? 'auto' : 'hidden';
}

function attachResizeListener(element, getChartHeight) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        applyPanelOverflow(mutation.target, getChartHeight());
      }
    });
  });
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['class']
  });
  return observer;
}

// Override to respond to re-sizing events
const _reflow = function () {
  var myChart = echarts.getInstanceByDom(this.el);
  if (myChart == null) { return; }
  const hasResize = Object.prototype.hasOwnProperty.call(myChart, "resize");
  const currentChartEntry = this.scopedVariables['_renderedEchartsArray'].find(o => o.instanceByDom === myChart);
  if (currentChartEntry && currentChartEntry['visualizationType'] === 'timeline') {
    const theChartHolder = myChart.getDom();
    const scopedSplunkEchartsPanel = theChartHolder.parentElement.parentElement.parentElement.parentElement.parentElement;
    const self = this;
    // Read the height live from whichever timeline is currently rendered, so the height changes
    // pushed by dashboard filters (which rebuild the chart through updateView, not reflow) are honoured.
    const getLiveChartHeight = function () {
      const liveChart = echarts.getInstanceByDom(self.el);
      const liveEntry = self.scopedVariables['_renderedEchartsArray'].find(o => o.instanceByDom === liveChart);
      return (liveEntry && liveEntry['visualizationHeight']) || (liveChart && liveChart.getHeight()) || 0;
    };
    const theChartHeight = getLiveChartHeight();
    if (this.scopedVariables['_timelineResizeObserver']) {
      this.scopedVariables['_timelineResizeObserver'].disconnect();
    }
    this.scopedVariables['_timelineResizeObserver'] = attachResizeListener(scopedSplunkEchartsPanel, getLiveChartHeight);
    if (hasResize) {
      myChart.resize({ height: theChartHeight });
    }
    applyPanelOverflow(scopedSplunkEchartsPanel, theChartHeight);
  } else if (hasResize) {
    myChart.resize();
  }
}
module.exports = _reflow;
