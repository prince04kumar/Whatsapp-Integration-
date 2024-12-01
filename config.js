const mysql= require('mysql');

function connectToUserDatabase(){
const connection = mysql.createConnection({
    host: 'aaa',
    user: 'bbbb',
    password: 'cccccc',
    database: 'ddddddd',
    });

      return connection;
}

const keyValuePairs = [
  //Add values for the keys below
  { key: 'PAGE_ACCESS_TOKEN', value: 'EAAWZACd5JrwUBO03j1xwFZA5KVyXef1dYdH3MG3fmR01R58YIE7Q6UuT7wLqCPFqk8equN7kEFDRqu85GauGAg8WjPpCHaIu0PuVs8Vs5YYZAEql4iXrvHPKZBf2BVquUGuOPxFBgvPpRZCVtrSd98EzszF7BZBI36fJGPAOz082TDvG04zebMuLAfm3jrm6UxHcsSgZCwJOKZAYDrm8DN9dn7psiMiE' },
  { key: 'VERIFY_TOKEN', value: 'princeindia' },

];

module.exports = { connectToUserDatabase, keyValuePairs };

