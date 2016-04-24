var gapi = require('.');

gapi.loadApi('oauth2', 'v2', function (err, oauth2) {
  if (err) {
    console.error(err);
  }
  console.log(oauth2);
});
