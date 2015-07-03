var mainmenu = {};
mainmenu.preload = function(){

};
var info;

mainmenu.create = function (){

  var hash = window.location.hash.replace('#','');
  if (!hash.length){

	var style = { font: "24px Arial", fill: "#ffffff", align: "center" };

	var y = 20;
	var xmlhttp = new XMLHttpRequest();
	var url = "http://vldn.de/get.php";

	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		myFunction(xmlhttp.responseText);
	  }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	function myFunction(response) {
	  var arr = JSON.parse(response);
	  var i;
	  var out = "<table>";

	  for(i = 0; i < arr.length; i++) {

		info = mainmenu.game.add.text(32, y, arr[i].ID, style);
		info = mainmenu.game.add.text(62, y, arr[i].User, style);
		//	  out += "<tr><td>" +
		//		arr[i].ID +
		//		"</td><td>" +
		//		arr[i].User +
		//		"</td><td>" ;
		y += 24;
	  }
	  //	out += "</table>";
	  //	document.getElementById("id01").innerHTML = out;
	}


	//location.href = location.href + '#' + 'blablablaa';
	//location.reload();
  }
  else{

	this.game.state.start('game');}








	//this.game.state.start('game');
};
module.exports=mainmenu;
