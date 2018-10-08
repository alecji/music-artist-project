var spotifyArtistBaseURL = "https://v6ssyzr7m2.execute-api.us-east-2.amazonaws.com/prod/spotifySearch?q="
var spotifyAlbumBaseURL = "https://v6ssyzr7m2.execute-api.us-east-2.amazonaws.com/prod/spotifySearch?id="

function spotifySearch (artistSearch) {
	var spotifySection = $("#spotify-row");
	//Condition where the artist name has a space
	var artistWithSpace = artistSearch;
	// var artistWithSpace = "drake"
	var artist = artistWithSpace.split(" ").join("+");
	var spotifyArtistURL = spotifyArtistBaseURL+artist

	$.ajax({
		url: spotifyArtistURL,
		type: "GET",
    cors: true ,
	}).done(function(artistIdData){
		var artistID = artistIdData.artists.items[0].id
		var artistName = artistIdData.artists.items[0].name

		if (artistID) {
			var spotifyIdURL = spotifyAlbumBaseURL+artistID

			$.ajax({
				url: spotifyIdURL,
				type: "GET",
				cors: true,
			}).done(function(albumData) {
				spotifySection.empty();

				//loop through and add albums
				var spotifyEmbed  = (albumData.items[0].uri);
				var spotifyAlbumURI = "https://open.spotify.com/embed?uri="+spotifyEmbed+"&theme=black"
				var spotifyPlayer = '<iframe src="'+spotifyAlbumURI+'" width="100%" height="400" frameborder="0" allowtransparency="true" ></iframe>';
				spotifySection.append(spotifyPlayer)
			})
		}
	})
}