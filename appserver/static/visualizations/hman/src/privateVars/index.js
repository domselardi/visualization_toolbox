const sharedRenderedEchartsArray = [];

class PrivateVars {
  constructor() {
    this.initialized = false; // Per-instance flag for SplunkVisualizationBase.initialize
    this._renderedEchartsArray = sharedRenderedEchartsArray; // Shared chart registry used by the annotation modal
  }
}

module.exports = PrivateVars;
