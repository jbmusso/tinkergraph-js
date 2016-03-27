import { inherits } from 'util';

import _ from 'lodash';

import * as ElementHelper from './ElementHelper';
import TinkerHelper from './TinkerHelper';
import TinkerElement from './TinkerElement';
import TinkerVertexProperty from './TinkerVertexProperty';

// var ElementHelper = require('gremlin-core/src/structure/util/elementhelper');

class TinkerVertex extends TinkerElement {
  constructor(id, label, graph) {
    super(id, label, graph);
    // TinkerElement.apply(this, arguments);
    this.id = id;
    this.label = label;
    this.graph = graph;

    this.outEdges = new Map(); // <Label, Array<Edge>>
    this.inEdges = new Map(); // <Label, Array<Edge>>
    this.iterators = new TinkerVertex.Iterators();
  }

  /**
   * This method is overloaded in Java and handles both set/get operations.
   * We added getProperty/setProperty methods to the prototype (see below) to
   * handle these operations.
   */
  property(key, value, keyValues) {
    var list;
    if (arguments.length === 1) { // todo: improve check?
      return this.getProperty(key);
    } else {
      return this.setProperty(key, value, keyValues);
    }
  };

  // JS specific method for getting a property (see property method above)
  getProperty(key) { // JS specific method
    var list;

    if (TinkerHelper.inComputerMode(this.graph)) {
      list = this.graph.graphView.getProperty(this, key);

      if (list.length === 0) {
        // return VertexProperty.empty();
        return {}; // temp fix
      }
      else if (list.length == 1) {
        return list[0];
      }
      else {
        new Error('Vertex.Exceptions.multiplePropertiesExistForProvidedKey(key)');
      }
    } else {
      return this.getPropertyGraphMode(key);
    }
  };

  // JS specific
  getPropertyGraphMode(key) {
    if (this.properties.has(key)) {
      const list = this.properties.get(key);

      if (list.length > 1) {
        new Error('Vertex.Exceptions.multiplePropertiesExistForProvidedKey(key)');
      }
      else {
        return list[0];
      }
    } else {
      // return VertexProperty.empty();
      return {}; // temp fix
    }
  };

  // JS specific method for setting a property (see property method above)
  setProperty(key, value, keyValues) {
    var vertexProperty;

    keyValues = keyValues || [];
    // ElementHelper.legalPropertyKeyValueArray(keyValues);

    // if (TinkerHelper.inComputerMode(this.graph)) {
    var inComputerMode = false;
    if (inComputerMode) {
      vertexProperty = this.graph.graphView.setProperty(this, key, value);
      ElementHelper.attachProperties(vertexProperty, keyValues);
      return vertexProperty;
    } else {
      return this.setPropertyGraphMode(key, value, keyValues);
    }
  };

  setPropertyGraphMode(key, value, keyValues) {
    let vertexProperty;
    // var optionalId = ElementHelper.getIdValue(keyValues);
    let optionalId; // temp
    // ElementHelper.validateProperty(key, value);

    if (optionalId) {
      vertexProperty = new TinkerVertexProperty(optionalId.get(), this, key, value);
    } else {
      vertexProperty = new TinkerVertexProperty(this, key, value);
    }

    const list = this.properties.get(key) || [];
    list.push(vertexProperty);

    this.properties.set(key, list);
    // this.graph.vertexIndex.autoUpdate(key, value, null, this); //todo: implemented index

    ElementHelper.attachProperties(vertexProperty, keyValues);

    return vertexProperty;
  };

  addEdge(label, vertex, keyValues) { //...keyValues
    var edge = TinkerHelper.addEdge(this.graph, this, vertex, label, keyValues);

    return edge;
  };

  remove() {
    var edges = [];
    this.getIterators().edges(Direction.BOTH, Number.MAX_SAFE_INTEGER).forEach(edges.push);
    edges.forEach(Edge.remove);
    this.properties.clear();
    this.graph.vertexIndex.removeElement(this);
    this.graph.vertices.delete(this.id);
  };

  getIterators() {
    return this.iterators;
  };

}


TinkerVertex.Iterators = function TinkerVertexIterators() {
};

inherits(TinkerVertex.Iterators, TinkerElement.Iterators); // extends
// _.extend(TinkerVertex.Iterators.prototype, Vertex.Iterators.prototype, {
//   // properties: function() {

//   // },

//   // hiddens: function() {

//   // },

//   edges: function(direction, branchFactor, labels, element) {
//     var edges = TinkerHelper.getEdges(element, direction, branchFactor, labels);
//     return edges;
//   },

//   vertices: function(direction, branchFactor, labels, element) {
//     var vertices = TinkerHelper.getVertices(element, direction, branchFactor, labels);

//     return vertices;
//   },
// }); // implements




module.exports = TinkerVertex;