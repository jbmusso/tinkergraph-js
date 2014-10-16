var inherits = require('util').inherits;

require('es6-shim');
var _ = require('lazy.js');

var GraphStep = require('gremlin-core-js/src/process/step/sideEffect/graphstep');
var Vertex = require('gremlin-core-js/src/structure/vertex');
var Edge = require('gremlin-core-js/src/structure/edge');
var HasContainer = require('gremlin-core-js/src/structure/util/HasContainer');

var TinkerHelper = require('../../../structure/TinkerHelper');


function TinkerGraphStep(traversal, returnClass) {
  this.hasContainers = [];
  GraphStep.call(this, traversal, returnClass);
}

inherits(TinkerGraphStep, GraphStep);

TinkerGraphStep.prototype.generateTraverserIterator = function(trackPaths) {
  if (this.returnClass === Vertex) { //todo: improve check?
    this.start = this.vertices();
  } else {
    this.start = this.edges();
  }

  GraphStep.prototype.generateTraverserIterator.call(this, trackPaths);
};

TinkerGraphStep.prototype.edges = function() {
  var indexedContainer = this.getIndexKey(Edge);
  var edgeStream;
  var iterator;

  if (!indexedContainer) {
    edgeStream = TinkerHelper.getEdges(this.traversal.getSideEffects().getGraph()).stream();
  } else {
    edgeStream = TinkerHelper.queryEdgeIndex(this.traversal.getSideEffects().getGraph(), indexedContainer.key, indexedContainer.value).stream();
  }

  iterator = edgeStream.filter(function(e) {
    return HasContainer.testAll(e, this.hasContainers);
  })
  .collect(Collectors.toList())
  .iterator();

  return iterator;
};

TinkerGraphStep.prototype.vertices = function() {
  var indexedContainer = this.getIndexKey(Vertex);
  var graph = this.traversal.getSideEffects().getGraph();
  var vertices;
  var vertexStream;
  var iterator;
  var self = this;

  if (!indexedContainer) {
    vertices = TinkerHelper.getVertices(graph);
  } else {
    vertices = TinkerHelper.queryVertexIndex(graph, indexedContainer.key, indexedContainer.value);
  }

  iterator = vertices.filter(function(vertex) {
    var test = HasContainer.testAll(vertex, self.hasContainers);
    return test;
  }).values(); // returns an ES6 iterator


  return iterator;
};

TinkerGraphStep.prototype.getIndexKey = function(indexedClass) {
  var graph = this.traversal.getSideEffects().getGraph();
  var indexedKeys = graph.getIndexedKeys(indexedClass);

  var hasContainer = _(this.hasContainers)
    .filter(function(c) {
      return indexedKeys.contains(c.key) && c.predicate.equals(Compare.eq);
    });
    //TODO : implement Java's findAny() and orElseGet()
    // .findAny()
    // .orElseGet(function() {
    //   return null;
    // });

  var ret = hasContainer.toArray()[0] || null;

  return ret;
};

TinkerGraphStep.prototype.toString = function() {
  if (this.hasContainers.isEmpty()) {
    return GraphStep.prototype.toString.call(this);
  } else {
    return TraversalHelper.makeStepString(this, this.hasContainers);
  }
};

module.exports = TinkerGraphStep;