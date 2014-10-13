var inherits = require('util').inherits;

var Property = require('gremlin-core-js/src/structure/Property');
var GraphKey = require('gremlin-core-js/src/structure/Graph.Key');

function TinkerProperty(element, key, value) {
  this.element = element;
  this.key = key;
  this.value = value;
  this.graph = this.element.graph;
}

inherits(TinkerProperty, Property);

TinkerProperty.prototype.getElement = function() {
  return this.element;
};

TinkerProperty.prototype.getKey = function() {
  return GraphKey.unHide(this.key);
};

TinkerProperty.prototype.getValue = function() {
  return this.value;
};

TinkerProperty.prototype.isPresent = function() {
  return !!this.value;
};

TinkerProperty.prototype.isHidden = function() {
  return GraphKey.isHidden(this.key);
};



module.exports = TinkerProperty;