var $github = document.querySelector('#github');

$github.addEventListener('click', function () {
  window.open('https://github.com/dnypham');
});

var $linkedin = document.querySelector('#linkedin');

$linkedin.addEventListener('click', function () {
  window.open('https://www.linkedin.com/in/daniel-pham-10/');
});

var $homepage = document.querySelector('h1');
var $homepageView = document.querySelector('main[data-view="homepage"]');
var $localButton = document.querySelector('#local-button');
var $localView = document.querySelector('main[data-view="local"]');

$homepage.addEventListener('click', function () {
  $homepageView.classList.remove('hidden');
  $localView.classList.add('hidden');
});

$localButton.addEventListener('click', function (event) {
  $localView.classList.remove('hidden');
  $homepageView.classList.add('hidden');
});
