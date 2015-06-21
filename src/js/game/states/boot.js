var Stats = require('Stats')
  , properties = require('../properties')
  , boot = {};

boot.preload = function() {
  this.game.load.image('preloaderBar', 'images/loading-bar.png');
}
boot.create = function () {

  if (properties.showStats) {
    addStats();
  }
// Soundoptions
  this.game.sound.mute = properties.mute;

    this.game.input.maxPointers = 2;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.setScreenSize(true);

  this.game.state.start('preloader');
};

function addStats() {
  var stats = new Stats();

  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  setInterval(function () {
    stats.begin();
    stats.end();
  }, 1000 / 60);
}

module.exports = boot;
