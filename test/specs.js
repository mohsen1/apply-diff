'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var applyDiffModule = require('..');
applyDiffModule(_);

describe('module', function() {
  it('should export a function', function() {
    expect(applyDiffModule).to.be.a.function;
  });

  it('should add applyDiff mixing to _ object', function(){
    expect(_.applyDiff).to.be.a.function;
  });
});

describe('type check', function(){
  it('throws errors for no arguments', function(){
    expect(function() { _.applyDiff(); }).to.throw(Error);
  });

  it('throws errors for one arguments', function(){
    expect(function() { _.applyDiff({}); }).to.throw(Error);
  });

  it('throws errors for number arguments', function(){
    expect(function() { _.applyDiff(3, {}); }).to.throw(Error);
    expect(function() { _.applyDiff({}, 5); }).to.throw(Error);
  });

  it('throws errors for string arguments', function(){
    expect(function() { _.applyDiff('one', {}); }).to.throw(Error);
    expect(function() { _.applyDiff({}, 'two'); }).to.throw(Error);
  });

});

describe('shallow', function() {
  it('does nothing if source and destination have no difference', function() {
    var source = {a: 1, b: 2, c: {}, d: []};
    var destination = {a: 1, b: 2, c: {}, d: []};

    _.applyDiff(source, destination);
    expect(source).to.deep.equal(destination);
  });

  it('removes a property from destination that was removed from source', function() {
    var source = {a: 1, c: {}, d: []};
    var destination = {a: 1, b: 2, c: {}, d: []};

    _.applyDiff(source, destination);
    expect(destination).to.not.have.property('b');
    expect(source).to.deep.equal(destination);
  });

  it('adds a new property in source to destination', function() {
    var source = {a: 1, b: 2, c: {}, d: [], e: 'new'};
    var destination = {a: 1, b: 2, c: {}, d: []};

    _.applyDiff(source, destination);
    expect(destination).to.have.property('e', 'new');
    expect(source).to.deep.equal(destination);
  });

  it('replaces a property in destination that appeared in source', function() {
    var source = {a: 1, b: 2, c: {}, g: 100};
    var destination = {a: 1, b: 2, c: {}, d: []};

    _.applyDiff(source, destination);
    expect(destination).to.not.have.property('d');
    expect(destination).to.have.property('g', 100);
    expect(source).to.deep.equal(destination);
  });

  it('replaces the non-object values in destination', function() {
    var source = {a: {object: true}};
    var destination = {a: 'string'};

    _.applyDiff(source, destination);
    expect(destination.a).to.be.a.object;
  });

  it('replaces the non-object values in destination', function() {
    var source = {a: 'string'};
    var destination = {a: {object: true}};

    _.applyDiff(source, destination);
    expect(destination.a).to.be.a.string;
  });
});

describe('deep', function() {
  it('does nothing if source and destination have no difference', function() {
    var source = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3
          }
        }
      }
    };
    var destination = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3
          }
        }
      }
    };

    _.applyDiff(source, destination);
    expect(source).to.deep.equal(destination);
  });

  it('removes a property from destination that was removed from source', function() {
    var source = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
          }
        }
      }
    };
    var destination = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3
          }
        }
      }
    };

    _.applyDiff(source, destination);
    expect(destination).to.not.have.deep.property('a.b.c.three');
    expect(source).to.deep.equal(destination);
  });

  it('adds a new property in source to destination', function() {
    var source = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3,
            four: 4
          }
        }
      }
    };
    var destination = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3
          }
        }
      }
    };

    _.applyDiff(source, destination);
    expect(destination).to.have.deep.property('a.b.c.four', 4);
    expect(source).to.deep.equal(destination);
  });

  it('replaces a property in destination that appeared in source', function() {
    var source = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            five: 5
          }
        }
      }
    };
    var destination = {
      a: {
        one: 1,
        two: 2,
        b: {
          c: {
            three: 3
          }
        }
      }
    };

    _.applyDiff(source, destination);
    expect(destination).to.not.have.deep.property('a.b.c.three');
    expect(destination).to.have.deep.property('a.b.c.five', 5);
    expect(source).to.deep.equal(destination);
  });
});


describe('arrays', function(){
  it('should do nothing if source and destination is the same', function() {
    var source = [1,2,3,4];
    var destination = [1,2,3,4];
    _.applyDiff(source, destination);

    expect(source).to.be.deep.equal(destination);
  });

  it('removes a property from destination that was removed from source', function() {
    var source = [1, 2, 3, 4];
    var destination = [1, 2, 3, 4, 5];

    _.applyDiff(source, destination);
    expect(destination.length).to.be.equal(4);
    expect(source).to.deep.equal(destination);
  });

  it('adds a new property in source to destination', function() {
    var source = [1, 2, 3, 4, 5];
    var destination = [1, 2, 3, 4];

    _.applyDiff(source, destination);
    expect(destination.length).to.be.equal(5);
    expect(source).to.deep.equal(destination);
  });

  it('replaces a property in destination that appeared in source', function() {
    var source = [1, 2, 3, 100];
    var destination = [1, 2, 3, 4];

    _.applyDiff(source, destination);
    expect(destination.length).to.be.equal(4);
    expect(destination).to.contain(100);
    expect(destination).not.to.contain(4);
    expect(source).to.deep.equal(destination);
  });

  it('should update objects inside arrays deeply', function(){
    var source = {one: [{two: 3}]};
    var destination = {one: [{two: 2}]};

    _.applyDiff(source, destination);
    expect(destination.one[0].two).to.equal(3);
  });

  it('should remove property from objects inside arrays deeply', function() {
    var source = {one: [{}]};
    var destination = {one: [{two: 2}]};

    _.applyDiff(source, destination);
    expect(destination.one[0].two).to.be.undefined;
    expect(destination.one[0]).to.be.empty;
  });

  it('should add property items to objects inside arrays deeply', function() {
    var source = {one: [{two: 2, three: 3}]};
    var destination = {one: [{two: 2}]};

    _.applyDiff(source, destination);
    expect(destination.one[0].three).to.equal(3);
  });
});
