var inherits = require('util').inherits;

var DefaultGraphTraversal = require('gremlin-core-js/src/process/graph/util/DefaultGraphTraversal');

var TinkerGraphStep = require('./step.sideEffect/TinkerGraphStep');
var TinkerGraphStrategy = require('./strategy/TinkerGraphStepStrategy');


function TinkerGraphTraversal(graph, elementClass) {
  DefaultGraphTraversal.call(this, graph);

  this.getStrategies().register(TinkerGraphStrategy.instance());
  this.addStep(new TinkerGraphStep(this, elementClass));
}

inherits(TinkerGraphTraversal, DefaultGraphTraversal);

TinkerGraphTraversal.prototype.prepareForGraphComputer = function() {
  DefaultGraphTraversal.prepareForGraphComputer.call(this);
  this.getStrategies().unregister(TinkerGraphStepStrategy);
};

module.exports = TinkerGraphTraversal;