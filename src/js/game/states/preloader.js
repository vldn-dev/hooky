var preloader = {};

preloader.preload = function () {
  // set background color and preload image
    this.stage.backgroundColor = '#000000';
 //   this.game.preloadBar = this.add.sprite((properties.size.x-311)/2, (properties.size.y-27)/2, 'preloaderBar');
 //   this.load.setPreloadSprite(this.preloadBar);
    // load images
    this.game.load.image('logo', 'images/phaser.png#grunt-cache-bust');

      this.game.load.atlas('arcade', 'images/arcade-joystick.png', 'images/arcade-joystick.json');
    // load spritesheets

   
    
 
};

preloader.create = function () {
  this.game.state.start('mainmenu');
};

module.exports = preloader;
