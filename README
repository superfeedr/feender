# Feender

This is a simple node.js (pure javascript) module that's able to extract feed urls from any url.
This is based on [Feediscovery](http://feediscovery.appspot.com/), but functions locally, to avoid the outrageous charges from GAE.

## Example:

```javascript
feender('http://blog.superfeedr.com', function(error, feeds) {
	console.log(feeds[0].title); // 'Atom Feed'
	console.log(feeds[0].href); // 'http://blog.superfeedr.com/atom.xml'
	console.log(feeds[0].type); // 'application/atom+xml'
	console.log(feeds[0].rel); // 'alternate'
});
```

Works great with [Superfeedr](https://superfeedr.com/)!