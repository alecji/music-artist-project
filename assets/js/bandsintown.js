// function searchBandsInTown start for search the artist including all the information
function searchBandsInTown(artistInput) {
  let queryArtist = 'https://rest.bandsintown.com/artists/' + artistInput + '?app_id=codingbootcamp';
  let queryEvent  = 'https://rest.bandsintown.com/artists/' + artistInput + '/events?app_id=codingbootcamp';

  // run bandsintown API to get the info
  $.ajax({
    url: queryArtist,
    method: "GET",
    success:function(response) {
      $('.js-artist-name').html(response.name);
      $('.js-artist-image').attr('src', response.thumb_url);
    }
  });

  // run bandsintown API to get the events
  $.ajax({
    url: queryEvent,
    method: "GET",
    error:function(xhr, textStatus, errorThrown){
      $(".js-no-artist").show();
      $(".js-artist-info").hide();
      $("#youtube, #social, #instagram, #recentSearch, #artist-navigation, #spotify").hide();
      },
    success:function(response) {

      $(".js-no-artist").hide();
      $(".js-artist-info").show();

      if (!response.length) {
        $(".js-no-events").show();
        $(".js-event-table").hide();
      } else {
        $(".js-event-table").show();
        $(".js-no-events").hide();
        $(".event").empty();
        // Loop through results
        $.each(response, function(i, data) {
          if (i <= 10) {
            let event = $("<tr>");
            event.append("<td class='td'>" + moment(data.datetime).format('MM/DD/YY') + "</td>" );
            event.append("<td class='td'>" + data.venue.name + "</td>");
            event.append("<td class='td'>" + data.venue.city + ", " + data.venue.country +"</td>" );
            event.append('<td><a href="'+ data.offers[0].url+'" target="_blank" class="btn btn-sm btn-primary btn-block">Tickets</a></td>');
            $(".event").append(event);
          }
        });
      }
    }
  });

  // run WIKIPEDIA API to get more info about the artist
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    data: {
      format: "json",
      action: "parse",
      page: artistInput,
      prop:"text",
      section:0,
    },
    dataType: 'jsonp',
    headers: {'Api-User-Agent': 'CBC'},
    error: function(xhr, textStatus, errorThrown){},
    success: function (data) {
      let markup = data.parse.text["*"];
      let i = $('<div>').html(markup);
      i.find('a').each(function() { $(this).replaceWith($(this).html()); });
      i.find('sup').remove();
      i.find('.mw-ext-cite-error').remove();

      $('.js-artist-bio').html($(i).find('p'));

      var article = $('.js-artist-bio').html();

      var unavailable = "<p>Redirect to:</p>";
      if (article === unavailable){$('.js-artist-bio').html("Sorry, we are unable to find the article.")}
    }
  });
}