var instaURL = "https://igpi.ga/"
var fbURL = "https://graph.facebook.com/v2.10/?id=" 
var fbGetIDURL = "https://graph.facebook.com/v2.10/search?q="
var fbGetIDToken = "&type=page&access_token=160526811177215|24f1091fcfbe3cf6a77775e061a9544f"
var instaAccessToken = "&access_token=36374177.8899a4f.8288696c32cb409b8938cf3f0798ad20"
var fbFields="&fields=posts{message,created_time,link,full_picture,type}&access_token=160526811177215|24f1091fcfbe3cf6a77775e061a9544f"
var cardsToShow = 6;

//Masonry Grid setup - facebook
var facebookGrid = $('#fb-row').imagesLoaded( function() {
	facebookGrid.masonry({
		itemSelector: '.fb-col',
		columnWidth: '.grid-sizer',
		percentPosition: true
	});
});

//Masonry Grid setup - instagram
var instaGrid = $('#insta-row').imagesLoaded( function() {
	instaGrid.masonry({
		itemSelector: '.insta-col',
		columnWidth: '.grid-sizer',
		percentPosition: true
	});
});

function populateSocial (artistSearch) {

	//Condition where the artist name has a space
	var artistWithSpace = artistSearch;
	// var artistWithSpace = "drake"
	var artist = artistWithSpace.split(" ").join("+");
	var artistInsta = artistWithSpace.split(" ").join("");
	var fbIDURL = fbGetIDURL+artist+fbGetIDToken;
	var instaAjaxURL = instaURL + artistInsta + "/media?callback=?";
	
	//Instagram API start
	$.getJSON(instaAjaxURL, function(result){
		//Empty out previous results
		$('#insta-row').empty()
		$('#insta-row').append('<div class="grid-sizer">');

		//Setup array with instagram data
		var instaData = result.items;

		//Start a loop that will append insta cards to our div
		for (var i = 0;i < cardsToShow; i++) {
			var dataset = instaData[i];

			//Setting up variables for the card
			var imgURL = dataset.images.standard_resolution.url;
			var createdTime = dataset.created_time;

			if (dataset.caption.text) {
				var message = dataset.caption.text;
			}
			
			var likes = dataset.likes.count;
			var link = dataset.link;

			//Setting up DOM elements for the card
			var instaColumn    = $('<div class="col-sm-4 insta-col">');
			var instaPostImg = $("<img>");
			var instaCard = $("<div class='instaCard'>")
			var instaMessageDiv = $("<div class='fbMessage'>");
			var instaImgURL = $("<a>")
			var instaIconImg = $("<img>")

			//setup image
			instaPostImg.attr({
				src: imgURL,
				class: " img-responsive center-block",
			})

			//fb icon stuff
			instaIconImg.attr({
				src: "assets/img/instaIcon.png",
				class: " img-responsive center-block icon pull-right",
			})

			//setup link on the image that will redirect to instagram post
			instaImgURL.attr("href", link);
			instaImgURL.attr("target", "_blank");

			//Append image to URL ref
			instaCard.append(instaIconImg)
			instaImgURL.append(instaPostImg);
			instaCard.append(instaImgURL);
		
			//If a message exists, add it to the card, else do nothing
			if (message) {
				instaMessageDiv.html("<strong>"+message+"</strong>"+"<hr>"+"<span class='glyphicon glyphicon-heart'></span> " + likes);
				instaCard.append(instaMessageDiv);
				message = ""
			}
			
			//append card to column
			instaColumn.append(instaCard)
			console.log("This is running -- instagram")
	        // Masonry layout
	        instaGrid.append( instaColumn ).masonry( 'appended', instaColumn );
	        instaGrid.imagesLoaded( function() {
	          instaGrid.masonry('layout');
	        });
		}
	})

	// fb ajax call
	//First call to get artist ID from artist name
	$.ajax({
		url: fbIDURL,
		type: "GET",
	}).done(function(idresult){
		var artistID = idresult.data[0].id;
		var fbAjaxURL = fbURL+artistID+fbFields;

		//Second call to get feed Data from artist ID
		$.ajax({
			url: fbAjaxURL,
			type: 'GET',
		}).done(function(result) {
			//Empty out previous results
			$('#fb-row').empty()
			$('#fb-row').append('<div class="grid-sizer">');

			//Get fb post data array and start loop
			var fbData = result.posts.data;

			$.each(fbData, function(i, data) {
				if (i <= 10) {
			
					//setup image, post time, message and link to fb page
					var imgURL = data.full_picture;
					var createdTime = data.created_time;
					var link = data.link;
					var message = data.message;
	
					//Setup DOM elements
					var fbColumn = $('<div class="col-sm-4 fb-col">');
					var fbPostImg = $("<img>");
					var fbCard = $("<div class='fbCard'>")
					var fbMessageDiv = $("<div class='fbMessage'>");
					var fbImgURL = $("<a>")
	
					//Add classes for styling
					fbPostImg.attr({
						src: imgURL,
						class: " img-responsive center-block",
					})
	
					fbImgURL.attr("href", link);
					fbImgURL.attr("target", "_blank");
					fbImgURL.append(fbPostImg);
	
					fbCard.append(fbImgURL);
					
					//if message add to card
					if (message) {
						fbMessageDiv.html(message);
						fbCard.append(fbMessageDiv);
						message = "";
					}
	
					//append stuff to the doc
					fbColumn.append(fbCard)

					console.log(fbColumn)
	
					// Masonry layout
					facebookGrid.append( fbColumn ).masonry( 'appended', fbColumn );
					facebookGrid.imagesLoaded( function() {
						facebookGrid.masonry('layout');
					});
				}
			});

		})
	})
}