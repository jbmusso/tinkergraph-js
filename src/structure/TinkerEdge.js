var inherits = require('util').inherits;

var _ = require('lodash');

var Edge = require('gremlin-core-js/src/structure/Edge');
var T = require('gremlin-core-js/src/process/T');
var ElementHelper = require('gremlin-core-js/src/structure/util/ElementHelper');

var TinkerElement = require('./tinkerelement');
var TinkerHelper = require('./tinkerhelper');
var TinkerProperty = require('./tinkerproperty');


function TinkerEdge(id, outVertex, label, inVertex, graph) {
  TinkerElement.call(this, id, label, graph);
  this.outVertex = outVertex;
  this.inVertex = inVertex;
  this.graph.edgeIndex.autoUpdate(T.label.getAccessor(), this.label, null, this);
  this.iterators = new TinkerEdge.Iterators(this);
}

inherits(TinkerEdge, TinkerElement); // extends
_.extend(TinkerEdge.prototype, Edge.prototype); // implements

TinkerEdge.prototype.property = function(key, value) {
  if (arguments.length === 1) {
    // get Mode
    return TinkerElement.prototype.property.call(this, key);
  } else {
    this.setProperty(key, value);
  }
};

TinkerEdge.prototype.setProperty = function(key, value) {
  if (TinkerHelper.inComputerMode(this.graph)) {
    return this.graph.graphView.setProperty(this, key, value);
  } else {
    ElementHelper.validateProperty(key, value);

    var oldProperty = TinkerElement.prototype.property.call(this, key);
    var newProperty = new TinkerProperty(this, key, value);

    // this.properties.put(key, Arrays.asList(newProperty));
    this.properties.set(key, [newProperty]);
    this.graph.edgeIndex.autoUpdate(key, value, oldProperty.isPresent() ? oldProperty.value() : null, this);

    return newProperty;
  }
};

TinkerEdge.prototype.getIterators = function() {
  return this.iterators;
};

TinkerEdge.Iterators = function TinkerEdgeIterators(edge) {
  this.edge = edge;
};

inherits(TinkerEdge.Iterators, TinkerElement.Iterators);
_.extend(TinkerEdge.Iterators.prototype, Edge.Iterators.prototype);

TinkerEdge.Iterators.prototype = {
  vertexIterator: function(direction) { // element as last parameter diverge from Java codebase
    return TinkerHelper.getVertices(this.edge, direction);
  },

  properties: function(propertyKeys) { //...propertyKeys
    return TinkerElement.Iterators.prototype.properties.apply(this, propertyKeys);
  },

  hiddens: function(propertyKeys) { //...propertyKeys
    return TinkerElement.Iterators.prototype.hiddens.apply(this, propertyKeys);
  }
};

module.exports = TinkerEdge;