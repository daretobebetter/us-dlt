// let _   = require('lodash');

module.exports = configs => {
  return async (req, res, next) => {
    let authorizationHeader = req.header('Authorization') || '';
    
    let notAuthorized = () => res.status(401).send();
    
    if(authorizationHeader.startsWith('Bearer')) {
      var [, token] = authorizationHeader.split(/\s+/);
    }
    let [url] = req.url.split('?');
    
    if(!token) {
      console.warn(`${req.headers.origin} - ${req.method} - ${req.url} - has no API key, got rejected` );
      return notAuthorized();
    }

    // has token, verify in DB
    if (token === 'AuMRwwDQYDVQQLEwZjbGl'){
        next();
    } else {
        return notAuthorized();
    }
  }; 
};
