import _ from 'lodash';

import * as ElementHelper from '../ElementHelper';

import TinkerElement from './TinkerElement';
import TinkerHelper from './TinkerHelper';



class TinkerVertexProperty extends TinkerElement {
  constructor(vertex, key, value, propertyKeyValues) {
    super(null, key, vertex.graph);
    // var id = null;
    // var id = TinkerHelper.getNextId(vertex.graph);
    // TinkerElement.call(this, id, key, vertex.graph); //bug: id incr. by 2 instead of 1 because of this (to fix in TinkerHelper.getNextId())

    this.vertex = vertex;
    this.key = key;
    this.value = value;
    // ElementHelper.legalPropertyKeyValueArray(propertyKeyValues);
    ElementHelper.attachProperties(this, propertyKeyValues);
    //TODO: check if objectid is passed as first parameter
  }

  key() {
    return GraphKey.unHide(this.key);
  }

  getValue() {
    return this.value;
  }

  isPresent() {
    return true;
  }

  isHidden() {
    return GraphKey.isHidden(this.key);
  }

  toString() {
    // return StringFactory.propertyString(this);
  }
}

export default TinkerVertexProperty;
