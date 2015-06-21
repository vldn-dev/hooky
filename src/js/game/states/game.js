var game = {};
var user = [];
var hook;
var enemy;
var enemyhook;
var enemies;
var enemyhooks;
var shootButton;
var stream = {
  x: '0',
  y: '0',
  msg: '0',
  hookx: '0',
  hooky: '0'
};

var _player = null;
var fontStyle = null;
var arrowKeys;

game.create = function() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.updateBoundsCollisionGroup();


  game.physics.p2.restitution = 0.8;
  // this.add.button(Candy.GAME_WIDTH - 96 - 10, 5, 'button-pause', this.managePause, this);
  _player = game.add.sprite(game.world.randomX, game.world.randomY, 'monster-idle');
  _player.anchor.set(0.5);

  hook = this.add.sprite(0, 0, 'bullet');
  enemies = this.add.group();
  enemyhooks = this.add.group();
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

  game.camera.follow(_player);

  arrowKeys = game.input.keyboard.createCursorKeys();
  shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  shootButton.onDown.add(throwHook, this);
  game.physics.p2.enable([_player,hook]);
  game.physics.p2.createDistanceConstraint(_player,hook,150);

};

var channel = new DataChannel(location.hash.substr(1) || 'auto-session-establishment', {
  firebase: 'webrtc-experiment'
});
game.update = function() {
  _player.body.setZeroVelocity();
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
  sendStream(_player);
  sendStream(hook);
};

function sendStream(object) {
  if (user.length >= 1) {

	switch (object) {

	  case _player:
		stream.x = _player.x-_player.width/2;
	  stream.y = _player.y-_player.height/2;
	  channel.send(stream);
	  break;

	  case hook:
		stream.hookx = hook.x;
	  stream.hooky = hook.y;
	  channel.send(stream);
	  break;
	}

  }
}

function throwHook() {
  // Need to delete last event from Array!!
}


function stopHook() {
}




channel.onopen = function() {
  stream.x = _player.x;
  stream.y = _player.y;
  channel.send(stream);
};

channel.onmessage = function(data, userid) {

  var i = user.indexOf(userid);
  if (user.indexOf(userid) !== -1) {

	enemies.children[i].x = data.x;
	enemies.children[i].y = data.y;
	enemyhooks.children[i].x = data.hookx;
	enemyhooks.children[i].y = data.hooky;
  } else {
	user.push(userid);

	enemy = enemies.create(data.x, data.y, 'monster-idle');
	enemyhook = enemyhooks.create(data.hookx, data.hooky, 'bullet');
	var name = game.add.text(48, 43, userid, this._fontStyle);
	name.anchor.set(0.5);
	enemy.addChild(name);
enemy.body.collides([_player,enemy]);


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




module.exports = game;
