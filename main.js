var slides = new Array();
var curslide;
var sTimeout;
var paused = false;
var n = 0;

var DEBUG = true;

// Starts everything off
function startShow()
{
	// Grab all the slide divs
	var divs = document.getElementsByTagName("div");

	for (var i=0; i<divs.length; i++) {
		if( divs[i].className == "page" ) {
			var s = { div: divs[i] };
			slides.push(s);
		}
	}

	// Make all slides invisible and switch them to the right class
	for( var i=0; i<slides.length; i++ ) {
		slides[i].div.style.display = "none";
		slides[i].div.className = "realpage";
	}

	loadSlide(0);

	curslide = 0;
	showSlide(curslide);	
	startTimer();

	updateTime();

	if(DEBUG) {
		document.getElementById("pause").style.display = "";
		document.getElementById("refresh").style.display = "";
	}

	setTimeout("window.location.reload();", 120000);

}

// Switch to new slide
function showSlide( nSlide )
{
	// Hide the old
	for(var i=0; i<slides.length; i++)
		slides[i].div.style.display = "none";

	// Show the new
	slides[nSlide].div.style.display = "";

	// Update the title
	tcell = document.getElementById("titlecell");
	tcell.innerHTML = slideTitle( nSlide );

	// Update the next slide
	var nextSlide = (nSlide + 1) % slides.length;
	loadSlide( nextSlide );
}

// Call the update function for slide number n
function loadSlide(n)
{
	if( slides[n].div.id == "" )
		return;

	fname = slides[n].div.id + "Up";

	// Test to see if there is an update function for this slide
	try {
		f = eval( fname );
	} catch(err) { return; }

	// Call the update function
	eval( fname + "(slides[" + n + "]);" );
}


// Advance onto the next slide
function changeSlide()
{
	if( paused )
		return;

	curslide = (curslide + 1) % slides.length;

	showSlide(curslide);
	startTimer();
}

// Start the timer to the next slide
function startTimer()
{
	sTimeOut = setTimeout("changeSlide();", 5000);
	nowNextTimeout = setTimeout("updateNowNext();", 15000);
	updateNowNext();
}

// Update the clock
function updateTime()
{
	cell = document.getElementById("time");
	
	d = new Date();
	hour = d.getHours();
	minute = d.getMinutes();

	if( minute < 10 )
		minute = "0" + minute;
	if( hour < 10 )
		hour = "0" + hour;

	cell.innerHTML = hour + ":" + minute;

	setTimeout("updateTime()", 1000);
}

// Find slide number n's title
function slideTitle(n)
{
	children = slides[n].div.childNodes;
	for( var i=0; i < children.length; i++ ) {
		if( children[i].className == "title" )
			return children[i].innerHTML;
	}
}

// Pause/Play the show
function pauseShow()
{
	paused = !paused;

	var p = document.getElementById("pause");
	if( paused ) {
		p.innerHTML = "Play";
		clearTimeout(sTimeout);
	} else {
		p.innerHTML = "Pause";
		startTimer();
	}
}

function refreshSlide()
{
	loadSlide(curslide);
}

// *** Slide update functions ***
function upcoming_matchesUp(slide)
{
	d = MochiKit.Async.doSimpleXMLHttpRequest( "./info/upcoming.php?n=" + n );
	n++;
	d.addCallback(upcoming_matches_cb,slide);
	d.addErrback(upcoming_matches_err);
}

function upcoming_matches_cb(slide,res)
{
	var resList = MochiKit.Async.evalJSONRequest(res);

	// Create the rows
	rows = [];
	for (var i in resList.matches) {
		var match = resList.matches[i];
		var r = [];

		r.push( TD({"class":"matchNum"}, match.number) );
		r.push( TD({"class":"matchTime"}, match.time) );
		
		for( var j = 0; j < 4; j++ )
			r.push( TD({"class":"matchTeam"}, match.teams[j]) );
			
		
		rows.push(TR(null, r));
	}

	var mt = document.getElementById("matchtable");

	var t = TABLE({"id":"matchtable"},
		      THEAD( null,
			    [ TR( {"class":"header"},
				  [ TH( null, " " ),
				    TH( null, " " ),
				    TH( null, " " ),
				    TH( {"colspan":4, "id":"matchTeamsHeader"},  "Teams" ) ] ),
			      TR( {"class":"header"},
				  [ TH( {"id":"matchMatchHeader"}, "Match" ), 
				    TH( {"id":"matchTimeHeader"}, "Time" ), 
					TH( {"class":"colourHeader"}, "C0" ), 
				    TH( {"class":"colourHeader"}, "C1" ), 
				    TH( {"class":"colourHeader"}, "C2" ), 
				    TH( {"class":"colourHeader"}, "C3" ) ] ) ] ),
			    TBODY(null,rows ) );

	MochiKit.DOM.swapDOM(mt, t);
}

function upcoming_matches_err()
{
}

function scoresUp(slide)
{
	d = MochiKit.Async.doSimpleXMLHttpRequest( "./info/scores.php?n=" + n );
	n++;
	d.addCallback(scores_cb,slide);
	d.addErrback(scores_err);
}

function knockout_diagramUp(slide)
{
	var img = document.getElementById("knockoutsImg");
	var src = img.src;
	var pos = src.indexOf('?');
	if (pos >= 0) {
		src = src.substr(0, pos);
	}
	var date = new Date();
	img.src = src + '?v=' + date.getTime();
	return false;
}

function scores_cb(slide,res)
{
	var resList = MochiKit.Async.evalJSONRequest(res);

	// Create the rows
	var rows = [];
	// Left column position
	var lPos = 1;

	var nPerCol, nCol = 0;

	// Decide whether to move to two columns
	if( resList.scores.length > 9 ) {
		nCol = 2;
		nPerCol = Math.floor(resList.scores.length/2);

		if( nPerCol * 2 < resList.scores.length )
			nPerCol++;

		// Right column position
		var rPos = nPerCol + 1;
	} else {
		nCol = 1;
		nPerCol = resList.scores.length;
	}
		
	for( var i=0; i < nPerCol; i++ ) {
		var lscore = resList.scores[i];
		var r = [];

		r.push( TD({"class":"scorePosition"}, lPos) );
		r.push( TD({"class":"scoreTeam"}, lscore.team) );
		r.push( TD({"class":"scorePoints"}, lscore.points) );

		if( nCol == 2 ) {
			r.push( TD({"class":"empty"}," ") );

			if( rPos - 1 < resList.scores.length ) {
				var rscore = resList.scores[ rPos - 1 ];
				r.push( TD({"class":"scorePosition"}, rPos) );
				r.push( TD({"class":"scoreTeam"}, rscore.team) );
				r.push( TD({"class":"scorePoints"}, rscore.points) );
			} else {
				r.push( TD({"class":"scorePosition"}, "") );
				r.push( TD({"class":"scoreTeam"}, "") );
				r.push( TD({"class":"scorePoints"}, "") );
			}

			rPos++;
		}

		lPos++;
		rows.push(TR(null,r));
	}


	var mt = document.getElementById("scorestable");

	var headers;
	if( nCol == 1 )
		headers = THEAD(null,
				TR( {"class":"header"},
				    [ map(partial(TH,null), ["Position", "Team", "Score"]) ] ) );
	else
		headers = THEAD(null,
				TR( {"class":"header"},
				    [ map(partial(TH,null), ["Position", "Team", "Score", "", "Position", "Team", "Score"]) ] ) );

	var t = TABLE({"id":"scorestable"},
		      headers,
		      TBODY(null, rows) );

	MochiKit.DOM.swapDOM(mt, t);
}

function scores_err()
{
}

function set_now_next_cell(id, val){
	var cell = document.getElementById(id);
	cell.innerHTML = val;
}

function set_now_cell(num, val){
	set_now_next_cell("now_" + num, val);
}

function set_next_cell(num, val){
	set_now_next_cell("next_" + num, val);
}

function now_next_cb(res){

	var resList = MochiKit.Async.evalJSONRequest(res);

	for (var i=0; i<resList.now.length; i++)
		set_now_cell(i, resList.now[i]);

	for (var i=0; i<resList.next.length; i++)
		set_next_cell(i, resList.next[i]);
}

function now_next_err()
{
}

function updateNowNext(){

	d = MochiKit.Async.doSimpleXMLHttpRequest( "./info/nownext.php?n=" + n );
	n++;
	d.addCallback(now_next_cb);
	d.addErrback(scores_err);

}
