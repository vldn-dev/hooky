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
var vanish;
var vanishFlag;
var MAX_SPEED = 300;
var ACCELERATION = 1000;
var DRAG = 300;
var collide = false;
game.create = function() {
    x = game.world.randomX;
    y = game.world.randomY;

    enemies = game.add.group();
    enemyhooks = game.add.group();
    var _playerShape = game.add.bitmapData(20, 20);
    _playerShape.fill(255, 255, 255, 1);
    _player = game.add.sprite(0, 0, _playerShape);
    _player.x = x;
    _player.y = y;
    _player.alpha = 1;
    game.physics.enable(_player, Phaser.Physics.ARCADE);
    _player.body.collideWorldBounds = true;

    _player.body.drag.setTo(DRAG, 0);
    wall = game.add.graphics();
    wall.lineStyle(10, 0xFFFFFF, 1);
    wall.drawRect(100, 100, game.world.width - 200, game.world.height - 200);



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
        if (channelOpen === 'false') {
            _player.x = game.world.width / 2 - 250;
            _player.y = game.world.height / 2;

            stream = {
                action: 'move',
                x: game.world.width - _player.x,
                y: _player.y
            };
            channel.send(stream);
            channelOpen = 'true';
        }

    };


    channel.onmessage = function(data, userid) {
        console.log(data, userid);

        var i = user.indexOf(userid);
        if (user.indexOf(userid) !== -1) {
            switch (data.action) {

                case 'move':
                    enemies.children[i].x = data.x;
                    enemies.children[i].y = data.y;
                    break;
                case 'reset':
                    enemies.children[i].x = data.x;
                    enemies.children[i].y = data.y;
                    _player.x = game.world.width / 2 - 250;
                    _player.y = game.world.height / 2;

            }
        } else {
            user.push(userid);

            var enemyShape = game.add.bitmapData(20, 20);
            enemyShape.fill(100, 0, 0, 1);
            enemy = enemies.create(data.x, data.y, enemyShape);
            game.physics.enable(enemy, Phaser.Physics.ARCADE);

            enemy.body.drag.setTo(DRAG, 0);
            enemy.body.collideWorldBounds = true;
        }
    };

    channel.onleave = function(userid) {
        var i = user.indexOf(userid);
        user.splice(i, 1);
		enemies.children[i].body = null;
        enemies.children[i].destroy();

    };

};

game.update = function() {
    if (channelOpen === 'true') {
        if (_player.x <= 100 || _player.x >= game.world.width - 100 || _player.y <= 100 || _player.y >= game.world.height - 100) {
            game.stage.backgroundColor = '#992d2d';
            vanish = game.add.tween(_player).to({
                alpha: 0
            }, 1500, Phaser.Easing.Linear.None, true);
            vanish.onComplete.add(newRound, this);
            ACCELERATION = 250;
            vanishFlag = true;
        } else {
            if (vanishFlag === true) {
                game.tweens.removeAll();
                _player.alpha = 1;
                ACCELERATION = 1000;
            }
            game.stage.backgroundColor = '#000000';
            vanishFlag = false;
        }
        game.physics.arcade.collide(_player, enemy, collisionHandler, null, this);

        if (_player.body.acceleration.x >= 0 || _player.body.acceleration.x <= 0) {

            if (collide === false) {
                stream = {
                    action: 'move',
                    x: game.world.width - _player.x,
                    y: _player.y
                };
                channel.send(stream);
                stream = 'null';
            } else {
                stream = {
                    action: 'collision',
                    x: game.world.width - enemy.x,
                    y: enemy.y
                };
                channel.send(stream);
                stream = null;

            }
        }
    }

    if (arrowKeys.left.isDown) {

        collide = false;
        _player.body.acceleration.x = -ACCELERATION;
    } else if (arrowKeys.right.isDown) {

        collide = false;
        _player.body.acceleration.x = ACCELERATION;
    } else {
        _player.body.acceleration.x = 0;
    }

    if (arrowKeys.up.isDown) {

        collide = false;
        _player.body.acceleration.y = -ACCELERATION;
    } else if (arrowKeys.down.isDown) {

        collide = false;
        _player.body.acceleration.y = ACCELERATION;
    } else {
        _player.body.acceleration.y = 0;
    }

};

function gofull() {
    if (game.scale.isFullScreen) {

        game.scale.stopFullScreen();
    } else {
        game.scale.startFullScreen(false);
    }
}

function throwHook() {
    // Need to delete last event from Array!!
}

function collisionHandler(obj1, obj2) {

    //  The two sprites are colliding
    game.stage.backgroundColor = '#992d2d';
    collide = true;
}

function stopHook() {}

function newRound() {
    _player.x = game.world.width / 2 - 250;
    _player.y = game.world.height / 2;
    stream = {
        action: 'reset',
        x: game.world.width - _player.x,
        y: _player.y
    };
    channel.send(stream);
}

function togglePause() {

    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

}
module.exports = game;
