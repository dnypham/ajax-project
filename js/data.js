/* exported data, data2 */

var data = {
  favorites: []
};

var previousDataJSON = localStorage.getItem('javascript-local-storage');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
});

var data2 = {
  signedIn: null,
  view: 'homepage',
  users: [],
  nextUserId: 1
};

var previousData2JSON = localStorage.getItem('javascript-local-storage2');

if (previousData2JSON !== null) {
  data2 = JSON.parse(previousData2JSON);
}

window.addEventListener('beforeunload', function (event) {
  var data2JSON = JSON.stringify(data2);
  localStorage.setItem('javascript-local-storage2', data2JSON);
});
