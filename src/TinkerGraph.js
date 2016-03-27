import _ from 'lodash';

import * as ElementHelper from './ElementHelper';

import TinkerIndex from './TinkerIndex';
import * as TinkerHelper from './TinkerHelper';
import TinkerVertex from './TinkerVertex';
import TinkerEdge from './TinkerEdge';


class TinkerGraph {
  constructor() {
    this.currentId = 0;
    this.vertices = new Map();
    this.edges = new Map();
    // this.variables = new TinkerGraphVariables();
    this.graphView = null;

    this.vertexIndex = new TinkerIndex(this, TinkerVertex);
    this.edgeIndex = new TinkerIndex(this, TinkerEdge);
  }

  v(id) {
    if (!!id) {
      throw new Error('throw Graph.Exceptions.elementNotFound(Vertex.class, null);');
    }

    var vertex = this.vertices.get(id);

    if (!vertex) {
      throw new Error('Graph.Exceptions.elementNotFound(Vertex.class, id);');
    } else {
      return vertex;
    }
  }

  addVertex(object = [], ...args) {
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
  }

  V() {
    var traversal = new TinkerGraphTraversal(this, Vertex);

    return traversal;
  }

  E() {
    throw new Error('Not yet implemented');
  }

  of() {
    return new TinkerTraversal(this);
  }

  getIndexedKeys(elementClass) {
    // todo: remove switch?
    switch (elementClass.name) {
      case 'Vertex':
        return this.vertexIndex.getIndexedKeys();
      case 'Edge':
        return this.edgeIndex.getIndexedKeys();
      default:
        throw new Error('IllegalArgumentException("Class is not indexable: " + elementClass)');
    }
  }
}

TinkerGraph.open = function() {
  return new TinkerGraph();
};


export default TinkerGraph;
