function TinkerVertexIterator(edges, direction) {
  this.edges = edges;
  this.direction = direction;
}

TinkerVertexIterator.prototype.next = function() {
  var next = this.edges.next();
  var nextEdge = next.value;
  var vertices;

  if (this.direction === "in") {
    vertices = nextEdge && nextEdge.outVertex;
  } else {
    vertices = nextEdge && nextEdge.inVertex;
  }


  var ret = {
    value: vertices,
    done: next.done
  };

  return ret;
};

module.exports = TinkerVertexIterator;