var _ = require('lazy.js');

var MultiIterator = require('gremlin-core-js/src/process/util/multiiterator');
var ElementHelper = require('gremlin-core-js/src/structure/util/elementhelper');

var TinkerVertexIterator = require('../utils/tinkervertexiterator');
var TinkerEdgeIterator = require('../utils/tinkeredgeiterator');


function TinkerHelper() {
}

TinkerHelper.getNextId = function(graph) {
  // return Stream.generate(() -> (++graph.currentId)).filter(id -> !graph.vertices.containsKey(id) && !graph.edges.containsKey(id)).findAny().get();
  return graph.currentId++;
};

TinkerHelper.addEdge = function(graph, outVertex, inVertex, label, keyValues) {
  ElementHelper.validateLabel(label);
  ElementHelper.legalPropertyKeyValueArray(keyValues);

  idValue = ElementHelper.getIdValue(keyValues) || null;

  if (idValue) {
    if (graph.edges.has(idValue)) {
      throw new Error('Graph.Exceptions.edgeWithIdAlreadyExists'+ idValue);
    } else {
      idValue = TinkerHelper.getNextId(graph);
    }
  }

  var TinkerEdge = require('./tinkeredge'); //temp workaround
  var edge = new TinkerEdge(idValue, outVertex, label, inVertex, graph);
  ElementHelper.attachProperties(edge, keyValues);

  graph.edges.set(edge.id, edge);
  TinkerHelper.addOutEdge(outVertex, label, edge);
  TinkerHelper.addInEdge(inVertex, label, edge);
  return edge;
};

TinkerHelper.addOutEdge = function(vertex, label, edge) {
  var edges = vertex.outEdges.get(label);

  if (!edges) {
    edges = new Set();
    vertex.outEdges.set(label, edges);
  }

  edges.add(edge);
};

TinkerHelper.addInEdge = function(vertex, label, edge) {
  var edges = vertex.inEdges[label];

  if (!edges) {
    edges = new Set();
    vertex.inEdges.set(label, edges);
  }

  edges.add(edge);
};

TinkerHelper.dropView = function(graph) {
  graph.graphView = null;
};

TinkerHelper.getVertices = function(graph) {
  return graph.vertices.values();
};

TinkerHelper.getEdges = function(graph) {
  return graph.edges.values();
};

TinkerHelper.queryVertexIndex = function(graph, key, value) {
  return graph.vertexIndex.get(key, value);
};

// to be continued....

TinkerHelper.getProperties = function(element) {
  return element.properties;
};

TinkerHelper.getEdges = function(structure, direction, branchFactor, labels) {
  if (structure.constructor.name === 'TinkerVertex') {
    var vertex = structure;
    return TinkerHelper.getEdgesFromVertex(vertex, direction, branchFactor, labels);
  } else {
    return TinkerHelper.getEdgesFromGraph();
  }
};

TinkerHelper.getEdgesFromVertex = function(vertex, direction, branchFactor, labels) { // JS specific method
  var edges = new MultiIterator();
  var outEdges;
  var labeledEdgeSet;

  if (direction === 'out' || direction === 'both') {
    if (labels.length > 0) {
      labels.forEach(function(label) {
        outEdges = vertex.outEdges.get(label) || [];
        edges.addIterator(vertex.outEdges.values());
      });
    } else {
      vertex.outEdges.forEach(function(labeledEdgeSet, edgeLabel) {
        edges.addIterator(labeledEdgeSet.values());
      });
    }
  }

  if (direction === 'in' || direction === 'both') {
    if (labels.length > 0) {
      labels.forEach(function(label) {
        inEdges = vertex.inEdges.get(label) || [];
        edges.addIterator(vertex.inEdges.values());
      });
    } else {
      //todo fix : add vertex.inEdges.forEach loop
      for (labeledEdgeSet in vertex.inEdges) {
        edges.addIterator(vertex.inEdges.get(labeledEdgeSet));
      }
    }
  }

  return new TinkerEdgeIterator(edges, branchFactor);
};

TinkerHelper.getEdgesFromGraph = function() { // JS specific
  throw new Error('Not yet implemented in TinkerHelper.getEdgesFromGraph');
};

TinkerHelper.getVertices = function(structure, direction, branchFactor, labels) {
  var vertex;
  var edge;
  var graph;
  // Temp workaround against circle require
  var TinkerEdge = require('./tinkeredge');
  var TinkerVertex = require('./tinkervertex');

  if (structure instanceof TinkerVertex) { // structure = vertex
    vertex = structure;
    return TinkerHelper.getVerticesFromVertex(vertex, direction, branchFactor, labels);
  } else if (structure instanceof TinkerEdge) { // structure = edge
    edge = structure;
    return TinkerHelper.getVerticesFromEdge(edge, direction);
  } else { // structure = graph
    graph = structure;
    return Array.from(graph.vertices);
  }
};

TinkerHelper.getVerticesFromVertex = function(vertex, direction, branchFactor, labels) { // JS specific method
  if (direction !== "both") {
    var edges = TinkerHelper.getEdges(vertex, direction, branchFactor, labels);


    var vertexIterator = new TinkerVertexIterator(edges, direction);

    return vertexIterator;
  } else {
    var vertices = new MultiIterator(branchFactor);
    var outIterator = new TinkerVertexIterator(TinkerHelper.getEdges(vertex, Direction.OUT, branchFactor, labels), 'out');
    var inIterator = new TinkerVertexIterator(TinkerHelper.getEdges(vertex, Direction.OUT, branchFactor, labels), 'in');

    vertices.addIterator(outIterator);
    vertices.addIterator(inIterator);

    return vertices;
  }
};

TinkerHelper.getVerticesFromEdge = function(edge, direction) { // JS specific method
  var vertices = [];

  if (direction === 'out' || direction === 'both') {
    vertices.push(edge.outVertex);
  }

  if (direction === 'in' || direction === 'both') {
    vertices.push(edge.inVertex);
  }

  return new Iterator(vertices);
};

TinkerHelper.inComputerMode = function(graph) {
  return !!graph.graphView; //TODO: implement proper method
};

TinkerHelper.createGraphView = function(graph, isolation, computeKeys) {
  var graphView = new TinkerGraphView(isolation, computeKeys);
  graph.graphView = graphView;

  return graphView;
};

module.exports = TinkerHelper;