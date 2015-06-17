var game = {};
var hook;
var enemy;
var enemyhook;
var enemies;
var enemyhooks;
var shootButton;
var stream = {x:"0", y:"0", msg:"0", hookx:"0", hooky:"0"};

var _player = null;
var fontStyle = null;
var scoreText = null;



game.create = function () {
  this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
   // this.add.button(Candy.GAME_WIDTH - 96 - 10, 5, 'button-pause', this.managePause, this);
    _player = this.add.sprite(5, 260, 'monster-idle');
   _player.anchor.set(0.5);
    game.physics.arcade.enable(_player);

    hook = this.add.sprite(0, 0, 'bullet');
    game.physics.arcade.enable(hook);


    enemies = this.add.group();
    enemyhooks = this.add.group();


    _fontStyle = {
      font: "40px Arial",
      fill: "#FFFFFF",
      stroke: "#333",
      strokeThickness: 5,
      align: "center"
    };


    _scoreText = this.add.text(120, 20, "0", _fontStyle);

 

   // this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
    //this.stick = this.pad.addStick(0, 0, 200, 'arcade');
    //this.stick.scale = 0.6;
    //this.stick.alignBottomLeft(48);
    //this.shootstick = this.pad.addStick(0, 0, 200, 'arcade');
    //this.shootstick.scale = 0.6;
    //this.shootstick.alignBottomRight(48);
    //shootButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);
};

module.exports = game;
