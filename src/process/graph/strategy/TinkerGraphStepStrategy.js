var TraversalHelper = require('gremlin-core-js/src/process/util/traversalhelper');
var EmptyStep = require('gremlin-core-js/src/process/util/emptystep');

var TinkerGraphStep = require('../step.sideEffect/TinkerGraphStep');

function TinkerGraphStepStrategy() {
}

TinkerGraphStepStrategy.instance = function() {
  var instance = null;

  // Return Singleton pattern
  return instance !== null ? instance : instance = new TinkerGraphStepStrategy();
};

TinkerGraphStepStrategy.prototype.apply = function(traversal) {
  if (TraversalHelper.getStart(traversal) instanceof TinkerGraphStep) {
    var tinkerGraphStep = traversal.getSteps()[0];
    var currentStep = tinkerGraphStep.getNextStep();

    while (true) {

      if (currentStep == EmptyStep.instance() || TraversalHelper.isLabeled(currentStep)) {
        break;
      }

      if (currentStep instanceof HasStep) {
        tinkerGraphStep.hasContainers.addAll(currentStep.getHasContainers());
        TraversalHelper.removeStep(currentStep, traversal);
      } else if (currentStep instanceof IntervalStep) {
        tinkerGraphStep.hasContainers.addAll(currentStep.getHasContainers());
        TraversalHelper.removeStep(currentStep, traversal);
      } else if (currentStep instanceof IdentityStep) {
          // do nothing
      } else {
        break;
      }

      currentStep = currentStep.getNextStep();
  }
  }
};

module.exports = TinkerGraphStepStrategy;