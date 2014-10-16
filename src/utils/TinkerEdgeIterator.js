// TODO: move entire class to TinkerHelper.js ?

function TinkerEdgeIterator(edges, branchFactor) {
  this.edges = edges;
  this.branchFactor = branchFactor;
  this.currentCount = 0;
}

TinkerEdgeIterator.prototype.next = function() {
  this.currentCount += 1;

  var nextEdge = this.edges.next(); // edges = MultiIterator

  var canContinue = this.currentCount < this.branchFactor && !nextEdge.done;

  if (canContinue) {
    // yield edge
    return nextEdge;
  } else {
    return {
      value: undefined,
      done: true
    };
  }
};


module.exports = TinkerEdgeIterator;