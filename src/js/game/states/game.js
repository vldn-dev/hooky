var game = {};
var user = [];
var hook;
var wall = null;
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
var MAX_SPEED = 300;
var ACCELERATION = 1000;
var DRAG = 300;

game.create = function() {
  x = game.world.randomX;
  y = game.world.randomY;

  enemies = game.add.group();
  enemyhooks = game.add.group();
  //  _player = game.add.sprite(x, y, 'monster-player');
  //  _player.anchor.set(0.5);
  var _playerShape = game.add.bitmapData(20,20);
  _playerShape.fill(255,255,255,1);
  _player = game.add.sprite(0,0, _playerShape);
  _player.x = x;
  _player.y = y;
  
  //_player.addChild(_playerShape);
  // hook = game.add.sprite(0, 0, 'bullet');
 game.physics.enable(_player, Phaser.Physics.ARCADE);
  //	  game.physics.p2.createDistanceConstraint(_player,hook,150);
  //	  game.camera.follow(_player);
  _player.body.collideWorldBounds = true;
_player.body.drag.setTo(DRAG,0);
wall = game.add.graphics();
wall.lineStyle(10,0xFFFFFF,1);
wall.drawRect(100,100,game.world.width-200,game.world.height-200);



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
	   _player.x = game.world.width/2-250;
	  _player.y = game.world.height/2;

	  stream = {action:'move', x:game.world.width-_player.x, y:_player.y};
	  channel.send(stream);
	  channelOpen = 'true';
	}

  };


  channel.onmessage = function(data, userid) {
	console.log(data,userid);

	var i = user.indexOf(userid);
	if (user.indexOf(userid) !== -1){
	  switch (data.action){

		case 'move':
		enemies.children[i].x = data.x;
		enemies.children[i].y = data.y;
		break;

	  }} else {
		user.push(userid);

		var enemyShape = game.add.bitmapData(20,20);
		enemyShape.fill(100,0,0,1);
		enemy = enemies.create(data.x, data.y, enemyShape);
		enemy.anchor.set(0.5);
		// enemyhook = enemyhooks.create(data.hookx, data.hooky, 'bullet');
		// var name = game.add.text(48, 43, userid, game.fontStyle);
		// name.anchor.set(0.5);
		// enemy.addChild(name);
		game.physics.arcade.enable([enemy]);
		enemy.body.collideWorldBounds = true;
		// game.physics.p2.createDistanceConstraint(enemy,enemyhook,150);
	  } };

	  channel.onleave = function(userid) {
		var i = user.indexOf(userid);
		user.splice(i, 1);
		enemies.children[i].kill();
		//  enemyhooks.children[i].kill();

	  };

};

game.update = function() {

  if (channelOpen === 'true'){
		if (_player.body.acceleration.x >= 0){
	stream = {action:'move', x:game.world.width-_player.x, y:_player.y};
	channel.send(stream);
	stream = 'null';
	}
  }

  if (arrowKeys.left.isDown) {

	_player.body.acceleration.x= -ACCELERATION;
  } else if (arrowKeys.right.isDown) {
_player.body.acceleration.x=ACCELERATION;
  }else{_player.body.acceleration.x=0;}

  if (arrowKeys.up.isDown) {
_player.body.acceleration.y = -ACCELERATION;
  } else if (arrowKeys.down.isDown) {
_player.body.acceleration.y = ACCELERATION;
  }else{_player.body.acceleration.y=0;}

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
