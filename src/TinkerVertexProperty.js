var inherits = require('util').inherits;
import * as ElementHelper from './ElementHelper';

var _ = require('lodash');

// var ElementHelper = require('gremlin-core/src/structure/util/ElementHelper');
// var GraphKey = require('gremlin-core/src/structure/Graph.Key');

var TinkerElement = require('./TinkerElement');
var TinkerHelper = require('./TinkerHelper');



function TinkerVertexProperty(vertex, key, value, propertyKeyValues) {
  var id = null;
  // var id = TinkerHelper.getNextId(vertex.graph);
  TinkerElement.call(this, id, key, vertex.graph); //bug: id incr. by 2 instead of 1 because of this (to fix in TinkerHelper.getNextId())
  this.vertex = vertex;
  this.key = key;
  this.value = value;
  // ElementHelper.legalPropertyKeyValueArray(propertyKeyValues);
  ElementHelper.attachProperties(this, propertyKeyValues);
  //TODO: check if objectid is passed as first parameter
}

inherits(TinkerVertexProperty, TinkerElement);
_.extend(TinkerVertexProperty.prototype, TinkerElement.prototype);

TinkerVertexProperty.prototype.key = function() {
  return GraphKey.unHide(this.key);
};

TinkerVertexProperty.prototype.getValue = function() {
  return this.value;
};

TinkerVertexProperty.prototype.isPresent = function() {
  return true;
};

TinkerVertexProperty.prototype.isHidden = function() {
  return GraphKey.isHidden(this.key);
};

TinkerVertexProperty.prototype.toString = function() {
  // return StringFactory.propertyString(this);
};


module.exports = TinkerVertexProperty;