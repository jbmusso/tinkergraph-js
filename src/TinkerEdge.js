import { inherits } from 'util';

import _ from 'lodash';

import TinkerElement from './TinkerElement';
import TinkerHelper from './TinkerHelper';
import TinkerProperty from './TinkerProperty';


class TinkerEdge extends TinkerElement {
  constructor(id, outVertex, label, inVertex, graph) {
    super(id, label, graph);
    this.outVertex = outVertex;
    this.inVertex = inVertex;
    // this.graph.edgeIndex.autoUpdate(T.label.getAccessor(), this.label, null, this);
    this.iterators = new TinkerEdge.Iterators(this);
  }

  property(key, value) {
    if (arguments.length === 1) {
      // get Mode
      return TinkerElement.prototype.property.call(this, key);
    } else {
      this.setProperty(key, value);
    }
  }

  setProperty(key, value) {
    // ElementHelper.validateProperty(key, value);

    var oldProperty = TinkerElement.prototype.property.call(this, key);
    var newProperty = new TinkerProperty(this, key, value);

    // this.properties.put(key, Arrays.asList(newProperty));
    this.properties.set(key, [newProperty]);
    // this.graph.edgeIndex.autoUpdate(key, value, oldProperty.isPresent() ? oldProperty.value() : null, this); // todo: reenable index

    return newProperty;
  }

  getIterators() {
    return this.iterators;
  }
}


TinkerEdge.Iterators = function TinkerEdgeIterators(edge) {
  this.edge = edge;
};

inherits(TinkerEdge.Iterators, TinkerElement.Iterators);
// _.extend(TinkerEdge.Iterators.prototype, Edge.Iterators.prototype);

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