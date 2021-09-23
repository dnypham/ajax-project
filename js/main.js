// Click GitHub icon to go to GitHub profile

var $github = document.querySelector('#github');

$github.addEventListener('click', function () {
  window.open('https://github.com/dnypham');
});

// Click LinkedIn icon to go to LinkedIn profile

var $linkedin = document.querySelector('#linkedin');

$linkedin.addEventListener('click', function () {
  window.open('https://www.linkedin.com/in/daniel-pham-10/');
});

// Click app name in header to go to Homepage View

var $homepage = document.querySelector('h1');
var $homepageView = document.querySelector('main[data-view="homepage"]');
var $localButton = document.querySelector('#local-button');
var $localView = document.querySelector('main[data-view="local"]');

$homepage.addEventListener('click', function (event) {
  $homepageView.classList.remove('hidden');
  $localView.classList.add('hidden');

  $parentDiv.innerHTML = '';
});

// Click local button to go to Local Breweries View

$localButton.addEventListener('click', function (event) {
  $localView.classList.remove('hidden');
  $homepageView.classList.add('hidden');

  var ipgeo = new XMLHttpRequest();

  ipgeo.open('GET', 'http://api.techniknews.net/ipgeo/');
  ipgeo.responseType = 'json';

  ipgeo.addEventListener('load', function () {
    var city = ipgeo.response.city;
    var openBreweryDB = new XMLHttpRequest();

    openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?by_city=' + city);
    openBreweryDB.responseType = 'json';

    openBreweryDB.addEventListener('load', function () {
      var breweries = openBreweryDB.response;

      for (var i = 0; i < breweries.length; i++) {
        $parentDiv.appendChild(renderBreweries(breweries[i]));
      }
    });

    openBreweryDB.send();
  });

  ipgeo.send();

});

// Function to Render Brewery Cards

var $parentDiv = document.querySelector('#parent-div');

function renderBreweries(breweries) {
  var $col3 = document.createElement('div');
  $col3.setAttribute('class', 'column-half');

  var $breweryCardFlex = document.createElement('div');
  $breweryCardFlex.setAttribute('class', 'brewery-card-flex');
  $col3.appendChild($breweryCardFlex);

  var $breweryCard = document.createElement('div');
  $breweryCard.setAttribute('class', 'brewery-card');
  $breweryCardFlex.appendChild($breweryCard);

  var $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  $breweryCard.appendChild($row);

  var $col1 = document.createElement('div');
  $col1.setAttribute('class', 'column-half');
  $row.appendChild($col1);

  var $infoFlex = document.createElement('div');
  $infoFlex.setAttribute('class', 'info-flex');
  $col1.appendChild($infoFlex);

  var $breweryInfo = document.createElement('div');
  $breweryInfo.setAttribute('class', 'brewery-info');
  $infoFlex.appendChild($breweryInfo);

  var $h3 = document.createElement('h3');
  $h3.textContent = breweries.name;
  $breweryInfo.appendChild($h3);

  var $ul = document.createElement('ul');
  $breweryInfo.appendChild($ul);

  var $li1 = document.createElement('li');
  var phoneString = '(' + breweries.phone.slice(0, 3) + ')' + ' ' + breweries.phone.slice(3, 6) + '-' + breweries.phone.slice(6);
  $li1.textContent = phoneString;
  $ul.appendChild($li1);

  var $li2 = document.createElement('li');
  if (breweries.street === null) {
    breweries.street = '';
  } else {
    breweries.street = breweries.street + ', ';
  }
  $li2.textContent = breweries.street + breweries.city + ', ' + breweries.state;
  $ul.appendChild($li2);

  var $li3 = document.createElement('li');
  $ul.appendChild($li3);

  var $a = document.createElement('a');
  if (breweries.website_url) {
    $a.textContent = breweries.website_url.slice(7);
    $a.setAttribute('href', breweries.website_url);
    $a.setAttribute('target', '_blank');
  }
  $li3.appendChild($a);

  var $listIconsFlex = document.createElement('div');
  $listIconsFlex.setAttribute('class', 'list-icons-flex');
  $breweryInfo.appendChild($listIconsFlex);

  var $i1 = document.createElement('i');
  $i1.setAttribute('class', 'far fa-bookmark fa-2x');
  $listIconsFlex.appendChild($i1);

  var $i2 = document.createElement('i');
  $i2.setAttribute('class', 'far fa-heart fa-2x');
  $listIconsFlex.appendChild($i2);

  var $col2 = document.createElement('div');
  $col2.setAttribute('class', 'column-half');
  $row.appendChild($col2);

  var $mapFlex = document.createElement('div');
  $mapFlex.setAttribute('class', 'map-flex');
  $col2.appendChild($mapFlex);

  var $breweryMap = document.createElement('div');
  $breweryMap.setAttribute('class', 'brewery-map');
  $mapFlex.appendChild($breweryMap);

  var $map = document.createElement('iframe');

  if (breweries.latitude && breweries.longitude) {
    $map.setAttribute('src', 'https://maps.google.com/maps?q=' + breweries.latitude + ',' + breweries.longitude + '&z=15&output=embed');
    $map.setAttribute('width', '100%');
    $map.setAttribute('height', '100%');
    $map.setAttribute('frameborder', '0');
    $map.setAttribute('style', 'border: 0;');
    $breweryMap.appendChild($map);
  } else {
    var $img = document.createElement('img');
    $img.setAttribute('class', 'map-image');
    $img.setAttribute('src', 'https://static-00.iconduck.com/assets.00/map-marker-slash-icon-500x512-rym1tj3e.png');
    $breweryMap.appendChild($img);
  }

  return $col3;
}
