var preloader = {};

preloader.preload = function () {
  // set background color and preload image
    this.stage.backgroundColor = '#000000';
 //   this.game.preloadBar = this.add.sprite((properties.size.x-311)/2, (properties.size.y-27)/2, 'preloaderBar');
 //   this.load.setPreloadSprite(this.preloadBar);
    // load images
    this.game.load.image('logo', 'images/phaser.png#grunt-cache-bust');
    this.load.image('background', 'images/background.png');

     this.load.image('monster-player', 'images/monster-player.png');
     this.load.image('monster-idle', 'images/monster-idle.png');
    this.load.image('close', 'images/orb-red.png');
this.load.image('chat', 'images/chat.png');
    this.game.load.image('button-pause', 'images/button-pause.png');
    this.game.load.image('bullet', 'images/purple_ball.png');
      this.game.load.atlas('arcade', 'images/arcade-joystick.png', 'images/arcade-joystick.json');
    // load spritesheets

  this.load.spritesheet('button', 'images/button_sprite_sheet.png', 193, 71);
   
    
 
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = preloader;
