import { inherits } from 'util';

import TinkerHelper from './TinkerHelper';


class TinkerElement {
  constructor(id, label, graph) {
    this.graph = graph;
    this.id = id;
    this.label = label;
    this.properties = new Map();
  }

  hashCode() {
    return this.id.hashCode(); //todo: native Java, must override
  }

  getId() {
    return this.id;
  }

  label() {
    return this.label;
  }

  keys() {
    return this.properties.keySet().stream()
      .filter(function(key) {
        return !GraphKey.isHidden(key);
      })
      .collect(Collectors.toSet());
  }

  hiddenKeys() {
    return this.properties.keySet().stream()
      .filter(GraphKey.isHidden)
      .map(Graph.Key.unHide)
      .collect(Collectors.toSet());
  }

  property(key) {
    var list;

    if (this.properties.has(key)) {
      var property = this.properties.get(key)[0];

      return property;
    } else {
      // return Property.empty();
      return {} // temp fix;
    }
  }
}


TinkerElement.Iterators = function() {
};

// inherits(TinkerElement.Iterators, Element.Iterators);

TinkerElement.Iterators.prototype = {
  hiddens: function(propertyKeys) {
    var propertyIterator = properties.values().stream()
      .flatMap(function(list) {
        list.stream();
      }).collect(Collectors.toList()).iterator();

    new PropertyFilterIterator(propertyIterator, true, propertyKeys);
  }
};

module.exports = TinkerElement;