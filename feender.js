
var http = require('http');
var $ = require('jquery');
var urlparser = require('url');

module.exports = function(url, done) {

  http.get(url, function (response) {
    var feeds = [];
    var body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });

    response.on('end', function() {
            var doc = $(body);
      var links = doc.find('head link'); // Let's extract all the header links.
      $(links).each(function(i, l){
        var link = $(l);
        if (link.attr('type') === "application/atom+xml" || link.attr('type') === "application/rss+xml") {
          var feedUrl = urlparser.parse(link.attr('href'));
          var feed = {rel: "alternate", type: link.attr('type')};
          if(feedUrl.hostname) {
            feed.href = link.attr('href');
          }
          else {
            feed.href = urlparser.format(urlparser.resolve(url, link.attr('href')));
          }
          if(link.attr('title') !== "") {
            feed.title = link.attr('title');
          }
          else {
            feed.title = doc.find('title').text();
          }
          feeds.push(feed)
        }
      });

      if(feeds.length === 0) {
        for(var i =0; i <doc.length; i++) {
          if(doc[i]._tagName === "feed") {
            feeds.push({
              rel: "self",
              type: "application/atom+xml",
              href: url,
              title: $(doc.find('title')[0]).text()
            });
          }
        }
      }
      if(feeds.length === 0) {
        if(doc.find('channel').length > 0 ) {
          feeds.push({
            rel: "self",
            type: "application/rss+xml",
            href: url,
            title: doc.find('channel>title').text()
          });
        }
      }

      done(null, feeds);
    });
  }).on('error', function(error) {
    done(error, feeds);
  });
};

