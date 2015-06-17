var game = {};
var user = [];
var hook;
var enemy;
var enemyhook;
var enemies;
var enemyhooks;
var shootButton;
var stream = {x:"0", y:"0", msg:"0", hookx:"0", hooky:"0"};

var _player = null;
var fontStyle = null;
var arrowKeys
var timer;
var channel = new DataChannel(location.hash.substr(1) || 'auto-session-establishment', {
        firebase: 'webrtc-experiment'
});

game.create = function () {
    this.game.renderer.clearBeforeRender = false;
    this.game.renderer.roundPixels = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
   // this.add.button(Candy.GAME_WIDTH - 96 - 10, 5, 'button-pause', this.managePause, this);
    _player = game.add.sprite(5, 260, 'monster-idle');
    _player.anchor.set(0.5);

 game.physics.enable(_player, Phaser.Physics.ARCADE);
 _player.body.drag.set(100);
    _player.body.maxVelocity.set(200);



    hook = this.add.sprite(0, 0, 'bullet');
     game.physics.enable(hook, Phaser.Physics.ARCADE);



    enemies = this.add.group();
    enemyhooks = this.add.group();

    _fontStyle = {
      font: "40px Arial",
      fill: "#FFFFFF",
      stroke: "#333",
      strokeThickness: 5,
      align: "center"
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
            game.screenWrap(_player);
                game.screenWrap(hook);


};
game.update = function () {

    if (arrowKeys.up.isDown)
    {
            stream.x = _player.x - 50;
            stream.y = _player.y - 64;
            channel.send(stream);
        game.physics.arcade.accelerationFromRotation(_player.rotation, 200, _player.body.acceleration);
    }
    else
    {

        _player.body.acceleration.set(0);
    }

    if (arrowKeys.left.isDown)
    {
        _player.body.angularVelocity = -300;
    }
    else if (arrowKeys.right.isDown)
    {
        _player.body.angularVelocity = 300;
    }
    else
    {
        _player.body.angularVelocity = 0;
    }

   
    

};
game.screenWrap = function(sprite) {

    if (sprite.x < 0)
    {
        sprite.x = this.game.width;
    }
    else if (sprite.x > this.game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = this.game.height;
    }
    else if (sprite.y > this.game.height)
    {
        sprite.y = 0;
    }

};
 function throwHook () {
    // Need to delete last event from Array!!
      game.time.events.add(1000, stopHook, this, hook);

    hook.reset(_player.x,_player.y);
  stream.hookx = hook.x;
       stream.hooky = hook.y;
            channel.send(stream);
       game.physics.arcade.velocityFromRotation(_player.rotation, 400, hook.body.velocity);
    };

function stopHook () {
stream.hookx = hook.x;
       stream.hooky = hook.y;
            channel.send(stream);
    hook.body.velocity.set(0);
}

channel.onopen = function (data, userid) {
     stream.x = _player.x - 50;
            stream.y = _player.y - 64;
            channel.send(stream);
};

channel.onmessage = function (data, userid, latency) {

                var i = user.indexOf(userid);
                if (user.indexOf(userid) != -1) {

                    enemies.children[i].x = data.x;
                    enemies.children[i].y = data.y;
                    enemyhooks.children[i].x = data.hookx;
                    enemyhooks.children[i].y = data.hooky;
    } else {
        user.push(userid);
                    enemy = enemies.create(data.x, data.y, 'monster-idle');
                    enemyhook = enemyhooks.create(data.hookx, data.hooky, 'bullet');
                    //    this.physics.enable(enemy, Phaser.Physics.ARCADE);
                 game.physics.arcade.enable(enemy);

                    game.physics.arcade.enable(enemyhook);
                }
};

channel.onleave = function (userid) {
    var i = user.indexOf(userid);
            if (user.indexOf(userid) != -1) {
                user.splice(i, 1);
                enemies.children[i].kill();
                enemyhooks.children[i].kill();
            } else {
                user.pop();
                enemies.remove(enemy);
                enemyhooks.remove(enemyhook);
            }
};




    module.exports = game;
