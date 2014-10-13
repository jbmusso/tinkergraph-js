var inherits = require('util').inherits;

var DefaultGraphTraversal = require('../../../gremlin-core/util/defaultgraphtraversal');

function TinkerTraversal(graph) {
  this.sideEffects().setGraph(graph);
  this.strategies().register(TinkerGraphStepStrategy.instance());
  this.addStep(new StartStep(this));
}

inherits(TinkerTraversal, DefaultGraphTraversal);