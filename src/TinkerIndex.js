class TinkerIndex {
  constructor(graph, indexClass) {
    this.index = new Map();
    this.indexedKeys = new Set(); // should be HashSet

    this.indexClass = indexClass;
    this.graph = graph;
  }

  put(key, value, element) {
    let keyMap = this.index.get(key);

    if (!keyMap) {
      keyMap = new Map();
      this.index.put(key, keyMap);
    }

    let objects = keyMap.get(value);
    if (!objects) {
      objects = new Set();
      keyMap.put(value, objects);
    }

    objects.add(element);
  }

  get(key, value) {
    const keyMap = this.index.get(key);

    if (!keyMap) {
      return []; // Java: Collections.emptyList()
    }
    return keyMap.get(value) ? Array.from(set) : [];
  }

  count(key, value) {
    const keyMap = this.index.get(key);

    if (!keyMap) {
      return 0;
    }
    const set = keyMap.get(value);

    return set ? set.size : 0;
  }

  remove(key, value, element) {
    const keyMap = this.index.get(key);

    if (!keyMap) {
      const objects = keyMap.get(value);
      if (objects) {
        objects.remove(element);
        if (objects.size === 0) {
          keyMap.remove(value);
        }
      }
    }
  }

  removeElement(element) {
    if (element.constructor.name === this.indexClass.name) {
      this.index.forEach(function(indexName) {
        indexName.forEach(function(set) {
          set.remove(element);
        });
      });
    }
  }

  autoUpdate(key, newValue, oldValue, element) {
    if (this.indexedKeys.has(key)) {
      if (oldValue) {
        this.remove(key, oldValue, element);
      }
      this.put(key, newValue, element);
    }
  }

  autoRemove(key, oldValue, element) {
    if (this.indexedKeys.has(key)) {
      this.remove(key, oldValue, element);
    }
  }

  createKeyIndex(key) {
    if (!key) {
      throw new Error('Graph.Exceptions.argumentCanNotBeNull("key")');
    }

    if (key === '') {
      throw new Error('IllegalArgumentException("The key for the index cannot be an empty string")');
    }

    if (this.indexedKeys.has(key)) {
      return;
    }

    this.indexedKeys.add(key);

    var values;
    if (this.indexClass.name === 'Vertex') {
      values = this.graph.vertices
    }
    // var values = this.graph.vertices

  }

  getIndexedKeys() {
    return this.indexedKeys;
  }
}


export default TinkerIndex;
