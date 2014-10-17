var TinkerGraph = require('../../src/structure/tinkergraph');

describe('Traversal steps', function() {
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

        alice.addEdge('spouseOf', bob);
        bob.addEdge('likes', dude);

        var count = 0;

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

        alice.addEdge('spouseOf', bob);
        bob.addEdge('likes', dude);

        var count = 0;

        g.V().both('spouseOf').forEach(function(vertex) {
          ++count;
          assert.isDefined(vertex);
          assert.equal(vertex.constructor.name, 'TinkerVertex');
        });

        assert.equal(count, 2);
      });
    });
  });

  describe('.outE()', function() {
    describe('without label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().outE().forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 2);
      });
    });

    describe('with a label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().outE('likes').forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 1);
      });
    });
  });

  describe('.inE()', function() {
    describe('without label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().inE().forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 2);
      });
    });

    describe('with a label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().inE('knows').forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 1);
      });
    });
  });

  describe('.bothE()', function() {
    describe('without label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().bothE().forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 4);
      });
    });

    describe('with a label', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().bothE('knows').forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 2);
      });
    });
    describe('with multiple labels', function() {
      it('should retrieve outgoing incident edges', function() {
        var g = TinkerGraph.open();
        var alice = g.addVertex('name', 'alice');
        var bob = g.addVertex('name', 'bob');

        alice.addEdge('likes', bob);
        bob.addEdge('knows', alice);

        var count = 0;

        g.V().bothE('knows', 'likes').forEach(function(edge) {
          ++count;
          assert.isDefined(edge);
          assert.equal(edge.constructor.name, 'TinkerEdge');
        });

        assert.equal(count, 4);
      });
    });
  });

  describe('.path()', function() {
    it.skip('should retrieve all paths', function() {

      var g = TinkerGraph.open();
      var alice = g.addVertex('name', 'alice');
      var bob = g.addVertex('name', 'bob');

      alice.addEdge('likes', bob);
      bob.addEdge('knows', alice);

      var count = 0;

      var paths = g.V().path();
      paths.forEach(function(path) {
        ++count;
        console.log(path);
      });
    });
  });
});