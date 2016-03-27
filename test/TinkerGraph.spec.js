var _ = require('lodash');
import { assert } from 'chai';

import TinkerGraph from '../src/TinkerGraph'


describe('Graph', function() {
  var g;

  describe('.addvertex()', function() {
    beforeEach(function() {
      g = TinkerGraph.open();
    });

    it('should add a vertex with no property', function() {
      var v = g.addVertex();
      assert.equal(g.vertices.size, 1);
      assert.equal(v.id, 0);
    });

    describe('method signatures', function() {
      it('should add a vertex with key/value passed as multiple arguments', function() {
        var v = g.addVertex('name', 'alice', 'foo', 'bar');
        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'alice');
        assert.equal(v.property('foo').value, 'bar');
      });

      it('should add a vertex with properties passed as a single object argument', function() {
        var v = g.addVertex({ name: 'bob', baz: 'duh' });
        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'bob');
        assert.equal(v.property('baz').value, 'duh');
      });
    });

    describe('multiple vertices creation', function() {
      it('should add many vertices to the graph', function() {
        var v1 = g.addVertex({ name: 'bob' });
        var v2 = g.addVertex({ name: 'alice' });

        assert.equal(g.vertices.size, 2);
      });

      it('should increment vertices ids properly', function() {
        var v1 = g.addVertex({ name: 'bob' });
        var v2 = g.addVertex({ name: 'alice' });

        assert.equal(v1.id, 0);
        assert.equal(v2.id, 1);
      });
    });
  });

  describe('.addEdge()', function() {
    beforeEach(function() {
      g = TinkerGraph.open();
    });

    it('should add an edge with no property', function() {
      var v1 = g.addVertex();
      var v2 = g.addVertex();
      var e = v1.addEdge('knows', v2);

      assert.equal(g.edges.size, 1);
      assert.equal(e.label, 'knows');

      assert.equal(v1.outEdges.size, 1);
      assert.equal(v1.outEdges.get('knows').size, 1);
      assert.equal(v1.outEdges.get('knows').values().next().value, e);

      assert.equal(v2.inEdges.size, 1);
      assert.equal(v2.inEdges.get('knows').size, 1);
      assert.equal(v2.inEdges.get('knows').values().next().value, e);
    });

    it('should add an edge with properties', function() {
      var v1 = g.addVertex('name', 'bob');
      var v2 = g.addVertex({ name: 'alice' });
      var e = v1.addEdge('likes', v2, { since: 'now' });

      assert.equal(e.property('since').value, 'now');

      assert.equal(g.edges.size, 1);
      assert.equal(e.label, 'likes');

      assert.equal(v1.outEdges.size, 1);
      assert.equal(v1.outEdges.get('likes').size, 1);
      assert.equal(v1.outEdges.get('likes').values().next().value, e);

      assert.equal(v2.inEdges.size, 1);
      assert.equal(v2.inEdges.get('likes').size, 1);
      assert.equal(v2.inEdges.get('likes').values().next().value, e);
    });
  });

  describe('.v()', function() {
    beforeEach(function() {
      g = TinkerGraph.open();
    });

    it('should retrieve a vertex from the graph', function() {
      var createdVertex = g.addVertex('name', 'ob');
      var fetchedVertex = g.v(0);

      assert.equal(fetchedVertex, createdVertex);
    });
  });

  describe.skip('.V()', function() {
    it('should retrieve all vertices from the graph', function() {
      var g = TinkerGraph.open();
      // Add dummy vertices
      g.addVertex('name', 'alice');
      g.addVertex('name', 'bob');
      g.addVertex('name', 'man');

      var count = 0;

      g.V().forEach(function(vertex) {
        assert.isDefined(vertex);
        assert.equal(vertex.constructor.name, 'TinkerVertex');
        count++;
      });

      assert.equal(count, 3);
    });
  });
});