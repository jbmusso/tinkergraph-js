var TinkerGraph = require('../../src/structure/tinkergraph');

describe('Traversals', function() {
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

  describe('.out()', function() {
    describe('without label', function() {
      it('should retrieve outgoing adjacent vertices', function() {
        var g = TinkerGraph.open();

        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');
        var foo = g.addVertex('name', 'foo');

        alice.addEdge('likes', dude);
        bob.addEdge('knows', foo);

        var count = 0;

        g.V().out().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 2);
      });
    });

    describe('with a label', function() {
      it('should retrieve outgoing adjacent vertices', function() {
        var g = TinkerGraph.open();

        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');
        var foo = g.addVertex('name', 'foo');

        alice.addEdge('likes', dude);
        bob.addEdge('knows', foo);

        var count = 0;

        g.V().out('likes').forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
          assert.equal(vertex.property('name').value, 'dude');
        });

        assert.equal(count, 1);
      });
    });

    describe('when chained', function() {
      it('should retrieve outgoing adjacent vertices 2 levels away', function() {
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

  describe('.in()', function() {
    describe('without label', function() {
      it('should retrieve ingoing adjacent vertices', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);

        var count = 0;

        g.V().in().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
          assert.equal(vertex.property('name').value, 'alice');
        });

        assert.equal(count, 1);
      });
    });

    describe('when chained', function() {
      it('should retrieve ingoing adjacent vertices 2 levels away', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');

        alice.addEdge('likes', bob);
        bob.addEdge('likes', dude);

        var count = 0;

        g.V().in().in().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
          assert.equal(vertex.property('name').value, 'alice');
        });

        assert.equal(count, 1);
      });
    });
  });

  describe('.both()', function() {
    describe('without label', function() {
      it('should retrieve adjacent vertices in both directions', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');

        var count = 0;

        alice.addEdge('spouseOf', bob);
        bob.addEdge('likes', dude);

        g.V().both().forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 4);
      });
    });

    describe('with a label', function() {
      it('should retrieve adjacent vertices in both directions', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');
        var dude = g.addVertex('name', 'dude');

        var count = 0;

        alice.addEdge('spouseOf', bob);
        bob.addEdge('likes', dude);

        g.V().both('spouseOf').forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 2);
      });
    });
  });
});
