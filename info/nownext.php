<?
include("pass.php");

// Set to number of minutes to add on to upcoming events
$offset = 0;

$db = @mysql_connect( $mysql_details["host"],
		      $mysql_details["user"],
		      $mysql_details["password"] );

if( !$db ) die("Couldn't connect to mysql");

if( !mysql_select_db("comp", $db) ) die ("Couldn't switch to use comp database");

function outputMatches($matches)
{
?>
{
"matches" : [ 
<?
$first = true;
foreach( $matches as $match ) {
	if( !$first )
		echo ",";
	else
		$first = false;

?>
	{ "number" : <?=$match["number"]?>,
          "time" : "<?=$match["time"]?>",
  	  "teams" : [ <?=implode(", ", $match["teams"])?> ],
	  "matchType" : <?=$match["matchType"]?> }
<?			
}
?>
] 
}
<?
}

$matches = array();

/* Find the match that's occurring now */

$q = "SELECT * FROM matches WHERE time < " . (time()+($offset*60)) . " ORDER BY TIME DESC LIMIT 1 ;";
$res = mysql_query( $q, $db );
if( !$res ) die( "Couldn't list matches" );

$match = mysql_fetch_assoc($res);

if( !$match ) {
  $now = array( "teams" => array( "\"x\"", "\"x\"", "\"x\"", "\"x\"" )  );
  $next = array( "teams" => array( "\"x\"", "\"x\"", "\"x\"", "\"x\"" )  );
} else {
$now = array( "number" => $match["number"],
	    "time" => date( "H:i", $match["time"]+($offset*60)),
	    "teams" => array( $match["red"], $match["green"], $match["blue"], $match["yellow"] ),
	    "matchType" => $match["matchType"] );


$q = "SELECT * FROM matches WHERE time > " . ($match["time"]+($offset*60)) . " ORDER BY TIME ASC LIMIT 1 ;";
$res = mysql_query( $q, $db );
if( !$res ) die( "Couldn't list matches" );

$match = mysql_fetch_assoc($res);
if( !$match ) {
  $next = array( "teams" => array( "x", "x", "x", "x" )  );
} else {
$next = array( "number" => $match["number"],
	       "time" => date( "H:i", $match["time"]+($offset*60)),
	       "teams" => array( $match["red"], $match["green"], $match["blue"], $match["yellow"] ),
	       "matchType" => $match["matchType"] );
}
}
?>
{ "now":[<?= implode(", ", $now["teams"]) ?>], "next":[<?= implode(", ", $next["teams"]) ?>] }



