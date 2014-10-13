tinkergraph-js
==============

A pure JavaScript implementation of TinkerPop's TinkerGraph in-memory graph database

This library is a work in progress. It requires an external dependency (gulthor/gremlin-core-js) which is not yet published to npm.


## Features

Most TinkerGraph features should be working:
* `g.addVertex('key1', 'value1', 'key2', 'value2');` or `g.addVertex({ key: 'value' })`
* vertex.addEdge('label', vertex, { key: 'value' });

## Integration with Gremlin

### Steps

#### Working steps:
* g.V() - does not accept filters yet

#### Actively developed
* g.V().out()
* g.V().in()
* g.V().both()
* ...

### Traversal

* traversal.forEach()