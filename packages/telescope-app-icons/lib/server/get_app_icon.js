var googlePlaySearch = Meteor.require('google-play-search'); 

var getGooglePlayData = function( url ) {

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
    var title = response.result.name;
    return { icon : icon, title : title };
  } 
  return null;
}

var getAppleStoreData = function( url ) {

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
        var title = content.results[0].trackName;
        return { icon : icon, title : title };
      }
    }
  }
  return null;
}

var getAppIconUrl = function (url) {
  var data = getGooglePlayData( url );
  if( !data ) data = getAppleStoreData( url );
  if( !data ) return null;
  return data.icon;
}

var getAppTitle = function (url) {
  var data = getGooglePlayData( url );
  if( !data ) data = getAppleStoreData( url );
  if( !data ) return null;
  return data.title;
}

Meteor.methods({
  testGetAppIconUrl: function (url) {
    console.log( 'url -> ' + url );
    console.log( 'icon -> ' + getAppIconUrl(url));
    
    return 'BLAHH';
  },
  testGetAppTitle: function (url) {
    console.log( 'url -> ' + url );
    console.log( 'title -> ' + getAppTitle(url));
    
    return 'BLAHH';
  },
  getAppTitleForUrl: function (url) {
    return getAppTitle(url);
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
