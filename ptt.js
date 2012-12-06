jQuery.ptt = function(options){
	var slides;
	
	// time table {'MM:SS':slide_number, ..}
	timetable = options.timetable || {};

	// Video and Presentation containers
	video_container = options.video_container;
	video_width = options.video_width || '425';
	video_height = options.video_height || '356';

	// presentation_container = options.presentation_container;
	// presentation_width = options.presentation_width;
	// presentation_height = options.presentation_height;

	// Video and Presentation URLs
	ytvideo_url = options.ytvideo_url + '?&enablejsapi=1&playerapiid=ytplayer&version=3';
	// presentation_embedcode = options.presentation_embedcode;


	if (swfobject){  // make sure that swfobject is loaded
		// speakerdeck api
		var onSpeakerDeckPlayerReady = function(p) {
		  slides = p
		};


		var params = { allowScriptAccess: "always" };
		var atts = { id: "ytplayer" };

		// setup youtube player
		swfobject.embedSWF(ytvideo_url, video_container, video_width, video_height, "8", null, null, params, atts);		

		onPlayerStateChange = function(newState) {
			
			var intervalId = null;
			if (newState == 1){ // if YT is playing start time checking function
				if(slides){ // makes sure speakerdeck api is ready
					intervalId = setInterval(playHeadMove,100);
				}
			}else{
				if(intervalID){ // stop the function if YT is buffering, paused or stopped
					clearInterval(intervalId);
				}
			}
		}


		onYouTubePlayerReady = function(playerId) {
			ytplayer = document.getElementById('ytplayer');
	  		ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	  	}

		// helper function
		String.prototype.pad = function(l, s){
		    return (l -= this.length) > 0 
		        ? (s = new Array(Math.ceil(l / s.length) + 1).join(s)).substr(0, s.length) + this + s.substr(0, l - s.length) 
		        : this;
		};
		
		// time checking function
		playHeadMove = function(){
			ytplayer = document.getElementById('ytplayer');
			// get current YT player time and convert it to MM:SS format 
			timeNow = ytplayer.getCurrentTime();
			if (timeNow <= 216000){ // make sure it's under 60 minutes
				timeNow = Math.floor(timeNow / 60).toFixed().pad(2, "0")  + ":" + (timeNow % 60).toFixed().pad(2, "0") 
			}
			
			// check with timetable
			for(i in timetable){
			  //console.log(timeNow + ' ' + i);
			  if(timeNow == i){
			  	slides.goToSlide(timetable[i]);
			  }
			};
		}
	}
}