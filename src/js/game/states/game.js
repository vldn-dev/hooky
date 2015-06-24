var game = {};
var user = [];
var hook;
var enemy = null;
var enemyhook = null;
var enemies = null;
var enemyhooks = null;
var shootButton;
var stream = {};
var channelOpen = 'false';
var _player = null;
var fontStyle = null;
var arrowKeys;
var x;
var y;

var channel = new DataChannel(location.hash.substr(1) || 'auto-session-establishment', {
  firebase: 'webrtc-experiment'
});


game.create = function() {
  x = game.world.randomX;
  y = game.world.randomY;

  game.physics.startSystem(Phaser.Physics.P2JS);
  enemies = game.add.group();
  enemyhooks = game.add.group();
  game.physics.p2.restitution = 0.8;
  _player = game.add.sprite(x, y, 'monster-player');
  _player.anchor.set(0.5);
  // hook = game.add.sprite(0, 0, 'bullet');
  game.physics.p2.enable([_player]);
  //	  game.physics.p2.createDistanceConstraint(_player,hook,150);
  //	  game.camera.follow(_player);
  _player.body.collideWorldBounds = true;


  fontStyle = {
	font: '12px Arial',
	fill: '#FFFFFF',

	align: 'center'
  };

  // this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
  //this.stick = this.pad.addStick(0, 0, 200, 'arcade');
  //this.stick.scale = 0.6;
  //this.stick.alignBottomLeft(48);
  //this.shootstick = this.pad.addStick(0, 0, 200, 'arcade');
  //this.shootstick.scale = 0.6;
  //this.shootstick.alignBottomRight(48);
  //shootButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  arrowKeys = game.input.keyboard.createCursorKeys();
  shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  shootButton.onDown.add(throwHook, this);
 // game.input.onDown.add(gofull,this);


  channel.onopen = function() {
	if (channelOpen === 'false'){
	  channelOpen = 'true';
	}

  };


  channel.onmessage = function(data, userid) {
	console.log(data,userid);

	var i = user.indexOf(userid);
	if (user.indexOf(userid) !== -1){
	  switch (data.action){

		case 'move':
		var tempEnemy = enemies.children[i];
		tempEnemy.body.setZeroVelocity();
		enemies.children[i].body.x = data.x;
		enemies.children[i].body.y = data.y;
		break;

	  }} else {
		user.push(userid);
		enemy = enemies.create(data.x, data.y, 'monster-idle');
		enemy.anchor.set(0.5);
		// enemyhook = enemyhooks.create(data.hookx, data.hooky, 'bullet');
		// var name = game.add.text(48, 43, userid, game.fontStyle);
		// name.anchor.set(0.5);
		// enemy.addChild(name);
		game.physics.p2.enable([enemy]);
		enemy.body.collideWorldBounds = true;
		// game.physics.p2.createDistanceConstraint(enemy,enemyhook,150);
} };

  channel.onleave = function(userid) {
	var i = user.indexOf(userid);
	if (user.indexOf(userid) !== -1) {
	  user.splice(i, 1);
	  enemies.children[i].kill();
	  enemyhooks.children[i].kill();
	} 

  };

};

game.update = function() {


  if (channelOpen === 'true'){
//	if (_player.body.velocity >= 0){
	  stream = {action:'move', x:_player.x, y:_player.y};
	  channel.send(stream);
	  stream = 'null';
//	}
  }

  if (arrowKeys.left.isDown) {

	_player.body.moveLeft(400);
  } else if (arrowKeys.right.isDown) {

	_player.body.moveRight(400);
  }

  if (arrowKeys.up.isDown) {

	_player.body.moveUp(400);
  } else if (arrowKeys.down.isDown) {

	_player.body.moveDown(400);
  }

};
function gofull() {
  if (game.scale.isFullScreen){

	game.scale.stopFullScreen();}
	else{
	  game.scale.startFullScreen(false);}
}

function throwHook() {
  // Need to delete last event from Array!!
}


function stopHook() {
}

module.exports = game;
