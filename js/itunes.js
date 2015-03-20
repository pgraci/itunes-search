$(document).ready(function() {


    startup_genre();

    $('button').click(function(){
      var usersearch = $('#search-word').val();
      dosearch(usersearch);
    });

    $('#search-word').bind("enterKey",function(e){
       var usersearch = $('#search-word').val();
       dosearch(usersearch);
    });
    $('#search-word').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });

    function startup_genre(){

      var default_url_api = "https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=50/json?callback-?";

      resetanddestroy();

      $.getJSON(default_url_api, function(data){
          $.each(data.feed.entry, function(i, field){

            search_artwork = field["im:image"][2].label.replace('.170x170-75','.600x600-75');
            search_preview_url = field.link[1].attributes.href;
            search_artist = field["im:name"].label;
            search_track_name = field["im:artist"].label;
            search_album = field["im:collection"]["im:name"].label;
            search_buy_url = field["im:collection"].link.attributes.href;

            if (search_artwork) {
              createplayers(i);
              buildtracks(i,search_artwork,search_artist,search_track_name,search_album,search_buy_url,playerinfo);
              buildthisplayer(i,search_preview_url);
            }
          });

          animateandhover();

      });
    };

    function dosearch(usersearch){

      var apiurl = 'https://itunes.apple.com/search?media=music&entity=musicTrack&sort=recent&callback=?&term=';

      resetanddestroy();

      $.getJSON(apiurl + usersearch, function(data){

          if (data.results.length === 0) {
                $('#music-container').append('<li>No matches for ' + usersearch + '. Try another search.</li>');
          } else {
               $.each(data.results, function(i, field){

                 search_artwork = field.artworkUrl100.replace('.100x100-75','.600x600-75');
                 search_preview_url = field.previewUrl;
                 search_artist = field.artistName;
                 search_track_name = field.trackName;
                 search_album = field.collectionName;
                 search_buy_url = field.trackViewUrl;

                 if (search_artwork) {
                   createplayers(i);
                   buildtracks(i,search_artwork,search_artist,search_track_name,search_album,search_buy_url,playerinfo);
                   buildthisplayer(i,search_preview_url);
                 }
               });
          }

          animateandhover();

      });
    };

    function resetanddestroy() {
      $('#music-container').html('');

      $(".cp-jplayer").remove();
      $(".cp-container").jPlayer("destroy");
    }

    function createplayers(i) {
      $('body').append('<div id="jquery_jplayer_' + i + '" class="cp-jplayer"></div>');

      playerinfo = '<div id="cp_container_' + i + '" class="cp-container">';
      playerinfo += ' <div class="cp-progress-holder">';
      playerinfo += '   <div class="cp-progress-1"></div>';
      playerinfo += '   <div class="cp-progress-2"></div>';
      playerinfo += ' </div>';
      playerinfo += ' <div class="cp-circle-control"></div>';
      playerinfo += ' <ul class="cp-controls">';
      playerinfo += '   <li><a class="cp-play" tabindex="1">play</a></li>';
      playerinfo += '   <li><a class="cp-pause" style="display:none;" tabindex="1">pause</a></li>';
      playerinfo += ' </ul>';
      playerinfo += '</div>';

      return playerinfo;
    }

    function buildthisplayer(i,search_preview_url) {
      var myCirclePlayer = new CirclePlayer("#jquery_jplayer_" + i,
      {
        m4a: search_preview_url
      }, {
        cssSelectorAncestor: "#cp_container_" + i
      });
    }

    function buildtracks(i,search_artwork,search_artist,search_track_name,search_album,search_buy_url,playerinfo) {
      trackinfo = '<div class="music-img"><img src="' + search_artwork + '"></div>\n';
      trackinfo += '<div class="music-title"><span class="music-artist">' + search_artist + '</span><br />' + search_track_name + '<br />'  + search_album + '</div>\n';
      trackinfo += '<div class="music-meta" id="meta' + i + '">' + playerinfo + '<a href="' + search_buy_url + '" target="_buy">Buy Now</a></div>\n';

      alltracks = $('<li id="' + i + '" class="songs col-lg-2 col-md-2 col-sm-3 col-xs-6">' + trackinfo + '</li>');

      $('#music-container').append(alltracks);
    }

    function animateandhover() {
      $(function() {
        $('.songs').each(function(i) {
          $(this).delay((i++) * 200).fadeTo(1000, 1); })
      });

      $('.songs').hover(
        function(){
          $('#meta' + this.id).css('display','block');
        },
        function () {
          $('#meta' + this.id).css('display','none');
        }
      );
    }

});
