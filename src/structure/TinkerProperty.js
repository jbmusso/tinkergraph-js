class TinkerProperty {
  constructor(element, key, value) {
    this.element = element;
    this.key = key;
    this.value = value;
    this.graph = this.element.graph;
  }

  getElement() {
    return this.element;
  };

  getKey() {
    // return GraphKey.unHide(this.key);
  };

  getValue() {
    return this.value;
  };

  isPresent() {
    return !!this.value;
  };

  isHidden() {
    // return GraphKey.isHidden(this.key);
  };
}

export default TinkerProperty;
