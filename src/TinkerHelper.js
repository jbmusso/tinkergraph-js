import _ from 'lodash';

import TinkerVertexIterator from './utils/TinkerVertexIterator';
import TinkerEdgeIterator from './utils/TinkerEdgeIterator';
import * as ElementHelper from './ElementHelper';

// -------------------------
// TinkerHelper
// -------------------------
function TinkerHelper() {
}
TinkerHelper.getNextId = function(graph) {
  // return Stream.generate(() -> (++graph.currentId)).filter(id -> !graph.vertices.containsKey(id) && !graph.edges.containsKey(id)).findAny().get();
  return graph.currentId++;
};

TinkerHelper.addEdge = function(graph, outVertex, inVertex, label, keyValues) {
  // ElementHelper.validateLabel(label);
  // ElementHelper.legalPropertyKeyValueArray(keyValues);

  // let idValue = ElementHelper.getIdValue(keyValues) || null;
  let idValue = null; // temp fix

  if (idValue) {
    if (graph.edges.has(idValue)) {
      throw new Error('Graph.Exceptions.edgeWithIdAlreadyExists'+ idValue);
    } else {
      idValue = TinkerHelper.getNextId(graph);
    }
  }

  var TinkerEdge = require('./tinkeredge'); //temp workaround
  var edge = new TinkerEdge(idValue, outVertex, label, inVertex, graph);
  ElementHelper.attachProperties(edge, _.toPairs(keyValues));

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
  var inEdges;

  if (direction === 'out' || direction === 'both') {
    if (labels.length > 0) {
      labels.forEach(function(label) {
        outEdges = vertex.outEdges.get(label) || new Set();
        edges.addIterator(outEdges.values());
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
        inEdges = vertex.inEdges.get(label) || new Set();
        edges.addIterator(inEdges.values());
      });
    } else {
      vertex.inEdges.forEach(function(labeledEdgeSet, edgeLabel) {
        edges.addIterator(labeledEdgeSet.values());
      });
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
  var edges;
  var vertexIterator;
  var vertices;
  var outVertexIterator;
  var inVertexIterator;

  if (direction !== "both") {
    edges = TinkerHelper.getEdges(vertex, direction, branchFactor, labels);

    vertexIterator = new TinkerVertexIterator(edges, direction);
    return vertexIterator;
  } else {
    vertices = new MultiIterator(branchFactor);
    outVertexIterator = new TinkerVertexIterator(TinkerHelper.getEdges(vertex, 'out', branchFactor, labels), 'out');
    inVertexIterator = new TinkerVertexIterator(TinkerHelper.getEdges(vertex, 'in', branchFactor, labels), 'in');

    vertices.addIterator(outVertexIterator);
    vertices.addIterator(inVertexIterator);

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

  return vertices.values(); // iterator
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