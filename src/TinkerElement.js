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
    if (TinkerHelper.inComputerMode(this.graph)) {
      return Element.prototype.keys.call(this);
    } else {
      return this.properties.keySet().stream()
      .filter(function(key) {
        return !GraphKey.isHidden(key);
      })
      .collect(Collectors.toSet());
    }
  }

  hiddenKeys() {
    if (TinkerHelper.inComputerMode(this.graph)) {
      return Element.prototype.keys.call(this);
    } else {
      return this.properties.keySet().stream()
        .filter(GraphKey.isHidden)
        .map(Graph.Key.unHide)
        .collect(Collectors.toSet());
    }
  }

  property(key) {
    var list;

    if (TinkerHelper.inComputerMode(this.graph)) {
      list = this.graph.graphView.getProperty(this, key);
      return list.length === 0 ? Property.empty() : list[0];
    } else {
      if (this.properties.has(key)) {
        var property = this.properties.get(key)[0];

        return property;
      } else {
        // return Property.empty();
        return {} // temp fix;
      }
    }
  }

}


TinkerElement.Iterators = function() {
};

// inherits(TinkerElement.Iterators, Element.Iterators);

TinkerElement.Iterators.prototype = {
  hiddens: function(propertyKeys) {
    var propertyIterator;

    if (TinkerHelper.inComputerMode(this.graph)) {
      // var iterator =
      propertyIterator = this.graph.graphView.getProperties(TinkerElement.this).iterator();
      var propertyFilterIterator = new PropertyFilterIterator(propertyIterator, true, propertyKeys);

      return propertyFilterIterator;
    }  else {
      propertyIterator = properties.values().stream()
        .flatMap(function(list) {
          list.stream();
        }).collect(Collectors.toList()).iterator();

      new PropertyFilterIterator(propertyIterator, true, propertyKeys);
    }
  }
};

module.exports = TinkerElement;