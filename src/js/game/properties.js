var npmProperties = require('../../../package.json');

module.exports =
  { title: 'Hooky'
  , description: npmProperties.description
  , port: 3017
  , liveReloadPort: 3018
  , mute: false
  , showStats: true
  , size:
    { x:1100 
    , y: 500
    }
  , analyticsId: 'UA-50892214-2'
  };
