var assert = require('assert')
var feender = require('../feender.js');

describe('Feender', function(){

  it('should follow redirects', function(done) {
    feender('http://techcrunch.com/', function(error, feeds) {
      feender('http://www.techcrunch.com/', function(error, feeds2) {
        assert.equal(feeds.length, feeds2.length);
        done();
      });
    });
  });

  it('should extract the feeds in an HTML document with relative urls', function(done) {
    feender('http://blog.superfeedr.com', function(error, feeds) {
      assert.equal(feeds[0].title, 'Atom Feed')
      assert.equal(feeds[0].href, 'http://blog.superfeedr.com/atom.xml')
      assert.equal(feeds[0].type, 'application/atom+xml')
      assert.equal(feeds[0].rel, 'alternate')
      done();
    });
  });

  it('should extract the feeds in an HTML document with absolute urls', function(done) {
    feender('http://superfeedr.tumblr.com/', function(error, feeds) {
      assert.equal(feeds[0].title, 'Superfeedr\'s tumbling!')
      assert.equal(feeds[0].href, 'http://superfeedr.tumblr.com/rss')
      assert.equal(feeds[0].type, 'application/rss+xml')
      assert.equal(feeds[0].rel, 'alternate')
      done();
    });
  });

  it('should be able to extract all the feeds from a single HTML document', function(done) {
    feender('https://pando.com/', function(error, feeds) {
      assert.equal(feeds.length, 2);
      done();
    });
  });

  it('should extract the links from an ATOM feed document', function(done) {
    feender('http://blog.superfeedr.com/atom.xml', function(error, feeds) {
      assert.equal(feeds[0].title, 'Superfeedr Blog : Real-time cloudy thoughts from a super-hero')
      assert.equal(feeds[0].href, 'http://blog.superfeedr.com/atom.xml')
      assert.equal(feeds[0].type, 'application/atom+xml')
      assert.equal(feeds[0].rel, 'self')
      done();
    });
  });

  it('should extarct the links from an RSS feed document', function(done) {
    feender('http://superfeedr.tumblr.com/rss', function(error, feeds) {
      assert.equal(feeds[0].title, 'Superfeedr\'s tumbling!')
      assert.equal(feeds[0].href, 'http://superfeedr.tumblr.com/rss')
      assert.equal(feeds[0].type, 'application/rss+xml')
      assert.equal(feeds[0].rel, 'self')
      done();
    });
  });

  it('should not extract links when there are none', function(done) {
    feender('http://facebook.com', function(error, feeds) {
      assert.equal(feeds.length, 0);
      done();
    });
  });

  it('should handle https urls', function(done) {
    feender('https://www.tbray.org/ongoing/', function(error, feeds) {
      assert.equal(feeds.length, 1);
      assert.equal(feeds[0].title, 'Atom (full content)')
      assert.equal(feeds[0].href, 'https://www.tbray.org/ongoing/ongoing.atom')
      assert.equal(feeds[0].type, 'application/atom+xml')
      assert.equal(feeds[0].rel, 'alternate')
      done();
    });
  });

});
