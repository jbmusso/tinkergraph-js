/*jshint -W079 */
var inherits = require('util').inherits;

require('es6-shim');

var Element = require('gremlin-core-js/src/structure/Element');
var Vertex = require('gremlin-core-js/src/structure/Vertex');
var Property = require('gremlin-core-js/src/structure/Property');

var TinkerHelper = require('./TinkerHelper');


function TinkerElement(id, label, graph) {
  this.graph = graph;
  this.id = id;
  this.label = label;
  this.properties = new Map();
}

inherits(TinkerElement, Element);

TinkerElement.prototype.hashCode = function() {
  return this.id.hashCode(); //todo: native Java, must override
};

TinkerElement.prototype.getId = function() {
  return this.id;
};

TinkerElement.prototype.label = function() {
  return this.label;
};

TinkerElement.prototype.keys = function() {
  if (TinkerHelper.inComputerMode(this.graph)) {
    return Element.prototype.keys.call(this);
  } else {
    return this.properties.keySet().stream()
    .filter(function(key) {
      return !GraphKey.isHidden(key);
    })
    .collect(Collectors.toSet());
  }
};

TinkerElement.prototype.hiddenKeys = function() {
  if (TinkerHelper.inComputerMode(this.graph)) {
    return Element.prototype.keys.call(this);
  } else {
    return this.properties.keySet().stream()
      .filter(GraphKey.isHidden)
      .map(Graph.Key.unHide)
      .collect(Collectors.toSet());
  }
};

TinkerElement.prototype.property = function(key) {
  var list;

  if (TinkerHelper.inComputerMode(this.graph)) {
    list = this.graph.graphView.getProperty(this, key);
    return list.length === 0 ? Property.empty() : list[0];
  } else {
    if (this.properties.has(key)) {
      var property = this.properties.get(key)[0];

      return property;
    } else {
      return Property.empty();
    }
  }
};

TinkerElement.Iterators = function() {
};

inherits(TinkerElement.Iterators, Element.Iterators);

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