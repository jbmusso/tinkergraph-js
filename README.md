tinkergraph-js
==============

A pure JavaScript implementation of the TinkerGraph in-memory graph database from the [Apache TinkerPop framework](http://tinkerpop.incubator.apache.org/) that works in Node.js and in the browser.

This library is rather low-level as it only exposes a raw property graph data structure (more formally: a directed, binary, attributed multi-graph). It is perfectly fine for use if your library needs an in-memory data structure with a simple public API. If you're looking for a higher level graph data structure, checkout the Gremlin JavaScript implementation of TinkerGraph: [gremlin-tinkergraph](https://github.com/jbmusso/gremlin-tinkergraph).

This library is a work in progress and is not yet published on npm. It is not production ready.

## Install

```
$ npm install jbmusso/tinkergraph-js --save
```

Run tests with:

```
$ npm test
```

## Usage

The library is a port of TinkerGraph, without the Gremlin implementation. It tries to mimic while still providing more idiomatic JavaScript function signatures.

### Graph structure

#### Adding a vertex

```javascript
g.addVertex('key1', 'value1', 'key2', 'value2');
g.addVertex({ key: 'value', key2: 'value2' }); // Alternatively, JS only
```

#### Adding an edge

```javascript
vertex.addEdge('label', vertex, { key: 'value' });
```

## Performance

tinkergraph-js uses iterators, ES6 Map and Set classes.

On my laptop (2.3 Ghz i7 cpu, 16 Gb ram), tinkergraph-js adds approximately 20000 vertices per second to the graph.

