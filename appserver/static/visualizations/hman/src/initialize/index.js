const SplunkVisualizationBase = require('api/SplunkVisualizationBase');
const PrivateVariables = require('../privateVars');

const _initialize = function () {
  if (this.scopedVariables && this.scopedVariables.initialized) {
    return;
  }

  this.scopedVariables = new PrivateVariables();
  SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
  this.$el = $(this.el);

  if (!document.getElementById('myModal_annotation')) {
    this.createModal(this);
  }

  this.scopedVariables.initialized = true;
}

module.exports = _initialize
