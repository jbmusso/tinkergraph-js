function TinkerIndex(graph, indexClass) {
  this.index = new Map();
  this.indexedKeys = new Set(); // should be HashSet

  this.indexClass = indexClass;
  this.graph = graph;
}

TinkerIndex.prototype.put = function(key, value, element) {
  var keyMap = this.index.get(key);

  if (!keyMap) {
    keyMap = new Map();
    this.index.put(key, keyMap);
  }

  var objects = keyMap.get(value);
  if (!objects) {
    objects = new Set();
    keyMap.put(value, objects);
  }

  objects.add(element);
};

TinkerIndex.prototype.get = function(key, value) {
  var keyMap = this.index.get(key);

  if (!keyMap) {
    return []; // Java: Collections.emptyList()
  } else {
    var set = keyMap.get(value);
    if (!set) {
      return [];
    } else {
      return Array.from(set); // Java: new ArrayList<>(set);
    }
  }
};

TinkerIndex.prototype.count = function(key, value) {
  var keyMap = this.index.get(key);

  if (!keyMap) {
    return 0;
  } else {
    var set = keyMap.get(value);
    if (!set) {
      return 0;
    } else {
      return set.size;
    }
  }
};

TinkerIndex.prototype.remove = function(key, value, element) {
  var keyMap = this.index.get(key);

  if (!keyMap) {
    var objects = keyMap.get(value);
    if (objects) {
      objects.remove(element);
      if (objects.size === 0) {
        keyMap.remove(value);
      }
    }
  }
};

TinkerIndex.prototype.removeElement = function(element) {
  if (element.constructor.name === this.indexClass.name) {
    this.index.forEach(function(indexName) {
      indexName.forEach(function(set) {
        set.remove(element);
      });
    });
  }
};

TinkerIndex.prototype.autoUpdate = function(key, newValue, oldValue, element) {
  if (this.indexedKeys.has(key)) {
    if (oldValue) {
      this.remove(key, oldValue, element);
    }
    this.put(key, newValue, element);
  }
};

TinkerIndex.prototype.autoRemove = function(key, oldValue, element) {
  if (this.indexedKeys.has(key)) {
    this.remove(key, oldValue, element);
  }
};

TinkerIndex.prototype.createKeyIndex = function(key) {
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

};

TinkerIndex.prototype.getIndexedKeys = function() {
  return this.indexedKeys;
};


























module.exports = TinkerIndex;