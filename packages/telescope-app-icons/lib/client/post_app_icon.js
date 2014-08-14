Template[getTemplate('postAppIcon')].helpers({
  isPlayStoreLink: function(){
    var re = /https?:\/\/play\.google\.com\/store\/apps\/details\?id=.+/;
	  return re.test( this.url );
  },
  isAppleStoreLink: function(){
    var re = /https?:\/\/itunes\.apple\.com\/[a-z]{2}\/app\/[^\/]+\/id[0-9]+(\?.*)?/;
	return re.test( this.url );
  },
  appIconId : function () {
    return 'app_icon_' + this._id;
  },
  iconPlayStoreURL: function() {
    
    // start loading icon from google play store
    var url = this.url;
    var _id = this._id;
 
    $.get(url, function(response){
        var coverImg = $(response.responseText).find('.details-info img.cover-image');
        if( coverImg ) {
          var img = $('#app_icon_' + _id);
          var src = coverImg.attr('src');
          img.attr( 'src', src );
        }
     });
    
    // return a temporary icon
    return "img/app_icon_missing.png";
  },
  iconAppleStoreURL: function() {
    
    // start loading icon from Apple store
    var reGetAppleId = /https?:\/\/itunes\.apple\.com\/[a-z]{2}\/app\/[^\/]+\/id([0-9]+)(\?.*)?/;
    var match = reGetAppleId.exec(this.url);
    if( match && match[1] ) {
      var appleId = match[1];
      var url = 'http://itunes.apple.com/lookup?id=' + appleId;
      var _id = this._id;
   
      $.get(url, function(response){
          var reArtwork = /"artworkUrl512":"([^"]+)"/;
          var match = reArtwork.exec(response.responseText);
          if( match && match[1] ) {
            var src = match[1];
            var img = $('#app_icon_' + _id);
            img.attr( 'src', src );
          }
      });
    }
    
    // return a temporary icon
    return "img/app_icon_missing.png";
  }
});
