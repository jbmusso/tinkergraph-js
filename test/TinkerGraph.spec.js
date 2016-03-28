import _ from 'lodash';
import { assert } from 'chai';

import { createGraph } from '../src';


describe('Graph', () => {
  describe('.addvertex()', () => {
    it('should add a vertex with no property', () => {
      const g = createGraph();
      const v = g.addVertex();

      assert.equal(g.vertices.size, 1);
      assert.equal(v.id, 0);
    });

    describe('method signatures', () => {
      it('should add a vertex with key/value passed as multiple arguments', () => {
        const g = createGraph();
        const v = g.addVertex('name', 'alice', 'foo', 'bar');

        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'alice');
        assert.equal(v.property('foo').value, 'bar');
      });

      it('should add a vertex with properties passed as a single object argument', () => {
        const g = createGraph();
        const v = g.addVertex({ name: 'bob', baz: 'duh' });

        assert.equal(g.vertices.size, 1);
        assert.equal(v.id, 0);
        assert.equal(v.property('name').value, 'bob');
        assert.equal(v.property('baz').value, 'duh');
      });
    });

    describe('multiple vertices creation', () => {
      it('should add many vertices to the graph', () => {
        const g = createGraph();
        const v1 = g.addVertex({ name: 'bob' });
        const v2 = g.addVertex({ name: 'alice' });

        assert.equal(g.vertices.size, 2);
      });

      it('should increment vertices ids properly', () => {
        const g = createGraph();
        const v1 = g.addVertex({ name: 'bob' });
        const v2 = g.addVertex({ name: 'alice' });

        assert.equal(v1.id, 0);
        assert.equal(v2.id, 1);
      });
    });
  });

  describe('.addEdge()', () => {
    it('should add an edge with no property', () => {
      const g = createGraph();
      const v1 = g.addVertex();
      const v2 = g.addVertex();
      const e = v1.addEdge('knows', v2);

      assert.equal(g.edges.size, 1);
      assert.equal(e.label, 'knows');

      assert.equal(v1.outEdges.size, 1);
      assert.equal(v1.outEdges.get('knows').size, 1);
      assert.equal(v1.outEdges.get('knows').values().next().value, e);

      assert.equal(v2.inEdges.size, 1);
      assert.equal(v2.inEdges.get('knows').size, 1);
      assert.equal(v2.inEdges.get('knows').values().next().value, e);
    });

    it('should add an edge with properties', () => {
      const g = createGraph();
      const v1 = g.addVertex('name', 'bob');
      const v2 = g.addVertex({ name: 'alice' });
      const e = v1.addEdge('likes', v2, { since: 'now' });

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


  describe('Indices', () => {
    it('should manage indices', () => {
      const g = createGraph();
      const vertexKeys = g.getIndexedKeys('vertex');
      assert.equal(vertexKeys.size, 0);

      const edgeKeys = g.getIndexedKeys('edge');
      assert.equal(edgeKeys.size, 0);

      g.createIndex('name1', 'vertex');
      g.createIndex('name2', 'vertex');
      // Add the same index twice to check idempotence
      g.createIndex('name1', 'vertex');
      g.createIndex('oid1', 'edge');
      g.createIndex('oid2', 'edge');

      assert.sameMembers(Array.from(vertexKeys.values()), ['name1', 'name2']);
      assert.sameMembers(Array.from(edgeKeys.values()), ['oid1', 'oid2']);

      g.dropIndex('name2', 'vertex');
      assert.equal(vertexKeys.size, 1);
      assert.equal(vertexKeys.values().next().value, 'name1');

      g.dropIndex('name1', 'vertex');
      assert.equal(vertexKeys.size, 0);

      g.dropIndex('oid2', 'edge');
      assert.equal(edgeKeys.size, 1);
      assert.equal(edgeKeys.values().next().value, 'oid1');

      g.dropIndex('oid1', 'edge');
      assert.equal(edgeKeys.size, 0);
    });

    it('should not create vertex index with a non-string key', () => {
      const g = createGraph();
      const regex = /^Index key must be a string value/;
      const VERTEX = 'vertex';

      assert.throws(() => g.createIndex(null, VERTEX), regex);
      assert.throws(() => g.createIndex(undefined, VERTEX), regex);
      assert.throws(() => g.createIndex(0, VERTEX), regex);
      assert.throws(() => g.createIndex(1, VERTEX), regex);
      assert.throws(() => g.createIndex([], VERTEX), regex);
      assert.throws(() => g.createIndex({}, VERTEX), regex);
    });

    it('should not create vertex index with a non-string key', () => {
      const g = createGraph();
      const regex = /^Index key must be a string value/;
      const EDGE = 'edge';

      assert.throws(() => g.createIndex(null, EDGE), regex);
      assert.throws(() => g.createIndex(undefined, EDGE), regex);
      assert.throws(() => g.createIndex(0, EDGE), regex);
      assert.throws(() => g.createIndex(1, EDGE), regex);
      assert.throws(() => g.createIndex([], EDGE), regex);
      assert.throws(() => g.createIndex({}, EDGE), regex);
    });

    it('should not create vertex index with an empty key', () => {
      const g = createGraph();
      const regex = /Index key cannot be an empty string/

      assert.throws(() => g.createIndex('', 'vertex'), regex);
    });

    it('should not create edge index with an empty key', () => {
      const g = createGraph();
      const regex = /Index key cannot be an empty string/

      assert.throws(() => g.createIndex('', 'edge'), regex);
    });

    describe.skip('Hitting indices', function () {
      // Vertex indices update and removal
      it('should update vertex indices in a new graph', () => {

      });

      it('should remove vertex from an index', () => {

      });

      it('should update vertex indices in an existing graph', () => {

      });

      // Edge indices update and removal
      it('should update edge indices in a new graph', () => {

      });

      it('should remove edge from an index', () => {

      });

      it('should update edge indices in an existing graph', () => {

      });
    });

    describe.skip('Mutation of removed element', function () {
      it('should not modify a vertex that was removed', () => {

      });

      it('should not add edge to a vertex that was removed', () => {

      });

      it('should not read value of property on vertex that was removed', () => {

      });
    });
  });
});
