var googlePlaySearch = Meteor.require('google-play-search'); 

var getIconGooglePlay = function( url ) {

  var reGetId = /^https?:\/\/play\.google\.com\/store\/apps\/details\?id=([\.a-zA-Z0-9_]+)/;
  var match = reGetId.exec(url);
  if( match && match[1] ) {
    var packageId = match[1];
    var response = Async.runSync(function(done) {

      googlePlaySearch.fetch(packageId, function(err, gameData) {
         done(null, gameData);
      });
     
    });
    var icon = response.result.icon;
    icon = icon.replace(/=w[0-9]+/, '=w64')
    return icon;
  } 
  return null;
}

var getIconAppleStore = function( url ) {

  var reGetAppleId = /^https?:\/\/itunes\.apple\.com\/[a-z]{2}\/app\/[^\/]+\/id([0-9]+)(\?.*)?/;
  var match = reGetAppleId.exec(url);
  if( match && match[1] ) {
    var appleId = match[1];
    var url = 'http://itunes.apple.com/lookup';
    
    var result = Meteor.http.get(url, {
      params: {
        id: appleId,
      }
    });
    
    if( result && result.statusCode == 200 )
    {
      var content = JSON.parse( result.content );
      if( content.results[0] ) {        
        var icon = content.results[0].artworkUrl512;
        icon = icon.replace(/\.png$|\.jpg$/, '.64x64-75.jpg')
        return icon;
      }
    }
  }
  return null;
}

var getAppIconUrl = function (url) {
  return getIconGooglePlay( url )
    || getIconAppleStore( url )
    || null;
}

Meteor.methods({
  testGetAppIconUrl: function (url) {
    console.log( 'url -> ' + url );
    console.log( 'icon -> ' + getAppIconUrl(url));
  }
});

var extendPost = function (post) {
  if(post.url){
    var url = getAppIconUrl(post.url);
    
    if(!!url){
      post.appIcon = url;
    }
  }
  return post;
}

postSubmitServerCallbacks.push(extendPost);
