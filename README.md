tinkergraph-js
==============

A pure JavaScript implementation of TinkerGraph in-memory graph database from [TinkerPop3 framework](https://github.com/tinkerpop3) that works in Node.js and in the browser (soon).

This library is a work in progress and is not yet published on npm. It requires an external dependency (https://github.com/gulthor/gremlin-core-js) listed in the `package.json` file.

Both libraries will be published as v3.0.0 on npm once TinkerPop3 final version is released and all features are ported. They'll then track all subsequent releases.

## Install

```
$ npm install gulthor/tinkergraph-js -S
```

Run tests with:

```
$ gulp test
```

## Usage

The library is a 1:1 port of TinkerGraph. Please refer to [Gremlin docs](http://gremlindocs.com/) for a complete guide on using steps.

## Features

TinkerGraph structure features are tested and working. Features related to setting ids on creation are still work in progress.

### Graph structure

#### Adding a vertex
* `g.addVertex('key1', 'value1', 'key2', 'value2');`
* `g.addVertex({ key: 'value', key2: 'value2' });` (alternatively, JS only)

#### Adding an edge
* `vertex.addEdge('label', vertex, { key: 'value' });`

### Gremlin steps

#### Working steps
* V - does not accept filters yet

Vertex and edge steps
* out / outE / outV
* in / inE / inV
* both / bothE / bothV

#### Being developed
* E
* path
* map
* groupBy
* groupCount
* sideEffect
* ...

### Traversal methods

* `traversal.forEach(callback)` (working)
* `traversal.next()`
* ...

## Performance

TinkerGraph-js and gremlin-core-js internally uses iterators, ES6 Map and Set classes. All traversals are executed lazily.

On my laptop (2.3 Ghz i7 cpu, 16 Gb ram), TinkerGraph-js adds approximately 20000 vertices per second to the graph.

