
var request = require('request');
var cheerio = require('cheerio');
var urlparser = require('url');

module.exports = function(url, done) {
  request(url, function (error, response, body) {
    var feeds = [];
    if(error) {
      done(error, feeds);
    }
    else {
      var $ = cheerio.load(body);
      var links = $('head link'); // Let's extract all the header links.
      $(links).each(function(i, link){
        if (link.attribs.type === "application/atom+xml" || link.attribs.type === "application/rss+xml") {
          var feedUrl = urlparser.parse(link.attribs.href);
          var feed = {rel: "alternate", type: link.attribs.type};
          if(feedUrl.hostname) {
            feed.href = link.attribs.href;
          }
          else {
            feed.href = urlparser.format(urlparser.resolve(url, link.attribs.href));
          }
          if(link.attribs.title) {
            feed.title = link.attribs.title;
          }
          else {
            feed.title = $('title').text();
          }
          feeds.push(feed)
        }
      });

      if(feeds.length === 0) {
        if($('feed').length > 0 && $('feed')[0].attribs.xmlns.toLowerCase() === 'http://www.w3.org/2005/Atom'.toLowerCase()) {
          feeds.push({
            rel: "self",
            type: "application/atom+xml",
            href: url,
            title: $('feed>title').text()
          });
        }
        else if($('rss').length > 0 ) {
          feeds.push({
            rel: "self",
            type: "application/rss+xml",
            href: url,
            title: $('channel>title').text()
          });
        }
        else {

        }
      }

      done(null, feeds);
    }
  });
};

