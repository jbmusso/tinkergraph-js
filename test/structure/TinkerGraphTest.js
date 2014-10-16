var _ = require('lodash');

var TinkerGraph = require('../../src/structure/tinkergraph');


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

    it('should add a vertex with properties passed as multiple arguments', function() {
      var v = g.addVertex('name', 'alice');
      assert.equal(g.vertices.size, 1);
      assert.equal(v.id, 0);
      assert.equal(v.property('name').value, 'alice');
    });

    it('should add a vertex with properties passed as a single object argument', function() {
      var v = g.addVertex({ name: 'bob' });
      assert.equal(g.vertices.size, 1);
      assert.equal(v.id, 0);
      assert.equal(v.property('name').value, 'bob');
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

      assert.equal(v1.id, 0);
      assert.equal(v2.id, 1);

      assert.equal(g.vertices.size, 2);
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

      // Elements should be added to the graph
      assert.equal(g.vertices.size, 2);
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


  describe('traversals', function() {
    describe('.V() #', function() {
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

    describe('.V().out() #', function() {
      it('should retrieve outgoing adjacent vertices', function() {
        var g = TinkerGraph.open();

        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');
        var foo = g.addVertex('name', 'foo');

        alice.addEdge('likes', dude);
        bob.addEdge('likes', foo);

        var count = 0;

        g.V().out().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 2);
      });
    });

    describe('.V().out().out() #', function() {
      it('should retrieve outgoing adjacent vertices', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');

        alice.addEdge('likes', bob);
        bob.addEdge('likes', dude);

        var count = 0;

        g.V().out().out().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 1);
      });
    });
  });
});