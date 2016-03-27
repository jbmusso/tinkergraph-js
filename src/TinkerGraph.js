var inherits = require('util').inherits;

var _ = require('lodash');

// var Graph = require('gremlin-core/src/structure/graph');
// var Vertex = require('gremlin-core/src/structure/vertex');


// var ElementHelper = require('gremlin-core/src/structure/util/elementhelper');
import * as ElementHelper from './ElementHelper';
var TinkerIndex = require('./tinkerindex');
var TinkerHelper = require('./tinkerhelper');
var TinkerVertex = require('./tinkervertex');
var TinkerEdge = require('./tinkeredge');

// var TinkerGraphTraversal = require('../process/graph/tinkergraphtraversal');


function TinkerGraph () {
  this.currentId = 0;
  this.vertices = new Map();
  this.edges = new Map();
  // this.variables = new TinkerGraphVariables();
  this.graphView = null;

  this.vertexIndex = new TinkerIndex(this, TinkerVertex);
  this.edgeIndex = new TinkerIndex(this, TinkerEdge);
}

// inherits(TinkerGraph, Graph);

TinkerGraph.open = function() {
  return new TinkerGraph();
};

TinkerGraph.prototype.v = function(id) {
  if (!!id) {
    throw new Error('throw Graph.Exceptions.elementNotFound(Vertex.class, null);');
  }

  var vertex = this.vertices.get(id);

  if (!vertex) {
    throw new Error('Graph.Exceptions.elementNotFound(Vertex.class, id);');
  } else {
    return vertex;
  }
};

TinkerGraph.prototype.addVertex = function(object = [], ...args) {
  const keyValues = args.length ? _.chunk([object, ...args], 2): _.toPairs(object);

  // ElementHelper.legalPropertyKeyValueArray(keyValues);

  // var idValue = ElementHelper.getIdValue(keyValues) || null;
  // var label = ElementHelper.getLabelValue(keyValues) || Vertex.DEFAULT_LABEL;
  let idValue = null;
  const label = 'vertex';

  if (idValue) {
    if (this.vertices.get(idValue)) {
      throw new Error('Exceptions.vertexWithIdAlreadyExists('+idValue);
    }
  } else {
      idValue = TinkerHelper.getNextId(this);
  }

  var vertex = new TinkerVertex(idValue, label, this);
  this.vertices.set(vertex.id, vertex);


  ElementHelper.attachProperties(vertex, keyValues);

  return vertex;
};

TinkerGraph.prototype.V = function() {
  var traversal = new TinkerGraphTraversal(this, Vertex);

  return traversal;
};

TinkerGraph.prototype.E = function() {
  throw new Error('Not yet implemented');
};

TinkerGraph.prototype.of = function() {
  return new TinkerTraversal(this);
};

TinkerGraph.prototype.getIndexedKeys = function(elementClass) {
  // todo: remove switch?
  switch (elementClass.name) {
    case 'Vertex':
      return this.vertexIndex.getIndexedKeys();
    case 'Edge':
      return this.edgeIndex.getIndexedKeys();
    default:
      throw new Error('IllegalArgumentException("Class is not indexable: " + elementClass)');
  }
};


module.exports = TinkerGraph;