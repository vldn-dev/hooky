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

channel.onopen = function() {
if (channelOpen === 'false'){
  stream.action = 'create';

  stream.x = x;
  stream.y = y;
  channel.send(stream);

  this.onmessage(stream,'me');
  channelOpen = 'true';
}else {
   stream.action = 'create';

  stream.x = x;
  stream.y = y;
  channel.send(stream);
  
  console.log('Update Position');}

};


channel.onmessage = function(data, userid) {
  console.log(data,userid);

  var i = user.indexOf(userid);

  switch (data.action){

	case 'create':

	  if (userid === 'me'){ 
	  _player = game.add.sprite(data.x, data.y, 'monster-player');
	  _player.anchor.set(0.5);
	 // hook = game.add.sprite(0, 0, 'bullet');
	  game.physics.p2.enable([_player]);
//	  game.physics.p2.createDistanceConstraint(_player,hook,150);
//	  game.camera.follow(_player);
	  _player.body.collideWorldBounds = true;
	} else{
	  user.push(userid);

	 enemy = enemies.create(data.x, data.y, 'monster-idle');
	  enemy.anchor.set(0.5);
	 // enemyhook = enemyhooks.create(data.hookx, data.hooky, 'bullet');
		  var name = game.add.text(48, 43, userid, game.fontStyle);
	  name.anchor.set(0.5);
	  enemy.addChild(name);
	  game.physics.p2.enable([enemy]);

	  enemy.body.collideWorldBounds = true;
// game.physics.p2.createDistanceConstraint(enemy,enemyhook,150);


	}
	break;


	case 'move':
		
	  if (userid === 'me'){
	  _player.body.setZeroVelocity();
	  switch (data.direction){
		case 'left':
		  _player.body.moveLeft(400);
		break;
		case 'right':
		  _player.body.moveRight(400);
		break;
		case 'up':
		  _player.body.moveUp(400);
		break;
		case 'down':
		  _player.body.moveDown(400);
		break;
	  }

	}
	else {
  var tempEnemy = enemies.children[i];
 tempEnemy.body.setZeroVelocity();
	  switch (data.direction){
		case 'left':
		  enemies.children[i].body.moveLeft(400);
		break;
		case 'right':
		  enemies.children[i].body.moveRight(400);
		break;
		case 'up':
		  enemies.children[i].body.moveUp(400);
		break;
		case 'down':
		  enemies.children[i].body.moveDown(400);
		break;
	  }

	}
	break; 
  }

};

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
  if (arrowKeys.left.isDown) {
	stream = {action: 'move', direction:'left'};
	channel.send(stream);
	channel.onmessage(stream,'me');
	stream.action = 'null';

  } else if (arrowKeys.right.isDown) {
		stream = {action: 'move', direction:'right'};
	channel.send(stream);
	channel.onmessage(stream,'me');
	stream.action = 'null';
  }

  if (arrowKeys.up.isDown) {
		stream = {action: 'move', direction:'up'};
	channel.send(stream);
	channel.onmessage(stream,'me');
	stream.action = 'null';
  } else if (arrowKeys.down.isDown) {
		stream = {action: 'move', direction:'down'};
	channel.send(stream);
	channel.onmessage(stream,'me');
	stream.action = 'null';
  }
}
};

function throwHook() {
  // Need to delete last event from Array!!
}


function stopHook() {
}

module.exports = game;
