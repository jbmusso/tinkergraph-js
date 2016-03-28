var _ = require('lodash');
import { assert } from 'chai';

import { createGraph } from '../src';


describe('Graph', function() {
  describe('.addvertex()', function() {
    it('should add a vertex with no property', function() {
      const g = createGraph();
      var v = g.addVertex();

      assert.equal(g.vertices.size, 1);
      assert.equal(v.id, 0);
    });

    describe('method signatures', function() {
      it('should add a vertex with key/value passed as multiple arguments',   function() {
        const g = createGraph();
        var v = g.addVertex('name', 'alice', 'foo', 'bar');

        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'alice');
        assert.equal(v.property('foo').value, 'bar');
      });

      it('should add a vertex with properties passed as a single object argument', function() {
        const g = createGraph();
        var v = g.addVertex({ name: 'bob', baz: 'duh' });

        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'bob');
        assert.equal(v.property('baz').value, 'duh');
      });
    });

    describe('multiple vertices creation', function() {
      it('should add many vertices to the graph', function() {
        const g = createGraph();
        var v1 = g.addVertex({ name: 'bob' });
        var v2 = g.addVertex({ name: 'alice' });

        assert.equal(g.vertices.size, 2);
      });

      it('should increment vertices ids properly', function() {
        const g = createGraph();
        var v1 = g.addVertex({ name: 'bob' });
        var v2 = g.addVertex({ name: 'alice' });

        assert.equal(v1.id, 0);
        assert.equal(v2.id, 1);
      });
    });
  });

  describe('.addEdge()', function() {
    it('should add an edge with no property', function() {
      const g = createGraph();
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
      const g = createGraph();
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

});
