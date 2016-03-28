import _ from 'lodash';

import * as ElementHelper from '../ElementHelper';

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

    this.vertexIndex = new TinkerIndex(this, TinkerVertex);
    this.edgeIndex = new TinkerIndex(this, TinkerEdge);
  }

  v(id) {
    if (!!id) {
      throw new Error('throw Graph.Exceptions.elementNotFound(Vertex.class, null);');
    }

    const vertex = this.vertices.get(id);

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

    const vertex = new TinkerVertex(idValue, label, this);
    this.vertices.set(vertex.id, vertex);

    ElementHelper.attachProperties(vertex, keyValues);

    return vertex;
  }

  V() {
    const traversal = new TinkerGraphTraversal(this, Vertex);

    return traversal;
  }

  E() {
    throw new Error('Not yet implemented');
  }

  of() {
    return new TinkerTraversal(this);
  }

  getIndexedKeys(elementClass = '') {
    switch (elementClass.toLowerCase()) {
      case 'vertex':
        return this.vertexIndex.indexedKeys;
      case 'edge':
        return this.edgeIndex.indexedKeys;
      default:
        throw new Error(`Class is not indexable: ${elementClass}`);
    }
  }

  createIndex(key, elementClass = '') {
    switch (elementClass.toLowerCase()) {
      case 'vertex':
        if (!this.vertexIndex) {
          this.vertexIndex = new TinkerIndex(this, elementClass);
        }
        this.vertexIndex.createKeyIndex(key);
        break;
      case 'edge':
        if (!this.edgeIndex) {
          this.edgeIndex = new TinkerIndex(this, elementClass);
        }
        this.edgeIndex.createKeyIndex(key);
        break;
      default:
        throw new Error(`Class is not indexable: ${elementClass}`);

    }
  }

  dropIndex(key, elementClass = '') {
    switch (elementClass.toLowerCase()) {
      case 'vertex':
        this.vertexIndex && this.vertexIndex.dropKeyIndex(key);
        break;
      case 'edge':
        this.edgeIndex && this.edgeIndex.dropKeyIndex(key);
        break;
      default:
        throw new Error(`Class is not indexable: ${elementClass}`);
    }
  }
}

TinkerGraph.open = function() {
  return new TinkerGraph();
};


export default TinkerGraph;
