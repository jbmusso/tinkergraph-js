import { inherits } from 'util';

import TinkerHelper from './TinkerHelper';


class TinkerElement {
  constructor(id, label) {
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

  property(key) {
    if (this.properties.has(key)) {
      var property = this.properties.get(key)[0];

      return property;
    } else {
      return {} // temp fix;
    }
  }
}


TinkerElement.Iterators = function() {
};

// inherits(TinkerElement.Iterators, Element.Iterators);

TinkerElement.Iterators.prototype = {
  hiddens(propertyKeys) {
    const propertyIterator = properties.values().stream()
      .flatMap(function(list) {
        list.stream();
      }).collect(Collectors.toList()).iterator();

    new PropertyFilterIterator(propertyIterator, true, propertyKeys);
  }
};

module.exports = TinkerElement;