const $homepage = document.querySelector('.logo');
const $homepage2 = document.querySelector('.logo-2');
const $homepageView = document.querySelector('main[data-view="homepage"]');
const $localButton = document.querySelector('#local-button');
const $localView = document.querySelector('main[data-view="local"]');
const $header = document.querySelector('#dynamic-header');
const $pageResultsContainer = document.querySelector('#page-results-container');
const $parentDiv = document.querySelector('#parent-div');
const $notFound = document.querySelector('.not-found-container');
const $spinner = document.querySelector('.spinner-container');
const $favorites = document.querySelector('.favorites-list');
const $favorites2 = document.querySelector('.favorites-list-2');
const $searchBar = document.querySelector('.search-bar');

let breweryCount = 0;
let city;
let breweryName;

// Functions

function hideLoader(spinner) {
  spinner.classList.add('hidden');
}

function showLoader(spinner) {
  spinner.classList.remove('hidden');
}

function viewSwap(event) {
  if (event.target === $homepage || event.target === $homepage2) {
    $localView.classList.add('hidden');
    $pageResultsContainer.classList.add('hidden');
    document.querySelector('.not-found-container').classList.add('hidden');
    $homepageView.classList.remove('hidden');
    $searchBar.setAttribute('placeholder', 'Search by city...');
    $parentDiv.innerHTML = '';
    pageNumber = 1;
  } else if (event.target === $localButton) {
    $homepageView.classList.add('hidden');
    $notFound.classList.add('hidden');
    $localView.classList.remove('hidden');
    $header.textContent = 'Local Breweries';
    showLoader($spinner);
  } else if (event.target === $favorites || event.target === $favorites2) {
    $homepageView.classList.add('hidden');
    $pageResultsContainer.classList.add('hidden');
    $localView.classList.remove('hidden');
    $parentDiv.innerHTML = '';
    pageNumber = 1;
    $header.textContent = 'Favorites';
    hideLoader($spinner);
  } else if (event.target === $searchBar) {
    $homepageView.classList.add('hidden');
    $pageResultsContainer.classList.remove('hidden');
    $parentDiv.innerHTML = '';
    showLoader($spinner);
  }
}

// Click app name in header to go to Homepage View

$homepage.addEventListener('click', function (event) {
  viewSwap(event);
});

$homepage2.addEventListener('click', function (event) {
  viewSwap(event);
});

// Click local button to go to Local Breweries View

$localButton.addEventListener('click', function (event) {

  viewSwap(event);

  const geolocationRequest = new XMLHttpRequest();

  geolocationRequest.open('GET', 'http://www.geoplugin.net/json.gp?ip=');
  geolocationRequest.responseType = 'json';

  geolocationRequest.addEventListener('load', function () {
    const longitude = geolocationRequest.response.geoplugin_longitude;
    const latitude = geolocationRequest.response.geoplugin_latitude;
    const breweryRequest = new XMLHttpRequest();

    breweryRequest.open('GET', 'https://api.openbrewerydb.org/breweries?by_dist=' + latitude + ',' + longitude);
    breweryRequest.responseType = 'json';

    breweryRequest.addEventListener('load', function () {
      hideLoader($spinner);
      const breweries = breweryRequest.response;

      breweries.forEach(brewery => $parentDiv.appendChild(renderBreweries(brewery)));

    });
    breweryRequest.send();
  });
  geolocationRequest.send();
});

// Favorites list

$favorites.addEventListener('click', function (event) {
  viewSwap(event);

  if (data.favorites.length === 0) {
    $notFound.classList.remove('hidden');
  } else {
    data.favorites.forEach(brewery => $parentDiv.appendChild(renderBreweries(brewery)));
  }
});

$favorites2.addEventListener('click', function (event) {
  viewSwap(event);

  if (data.favorites.length === 0) {
    $notFound.classList.remove('hidden');
  } else {
    data.favorites.forEach(brewery => $parentDiv.appendChild(renderBreweries(brewery)));
  }
});

// Search for breweries in a city when clicking enter.

$searchBar.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {

    if (!$searchBar.value || $searchBar.value === ' ') {
      return;
    }

    if ($searchBar.getAttribute('placeholder') === 'Search by city...') {
      breweryCount = 0;
      pageNumber = 1;

      // if ($searchBar.value) {
      //   $homepageView.classList.add('hidden');
      // }

      viewSwap(event);

      // $homepageView.classList.add('hidden');
      // $pageResultsContainer.classList.remove('hidden');
      // $parentDiv.innerHTML = '';
      city = $searchBar.value;

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', 'https://api.openbrewerydb.org/breweries?page=' + pageNumber + '&' + 'per_page=20' + '&' + 'by_city=' + city);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        hideLoader($spinner);
        const breweries = breweryRequest.response;

        // for (var i = 0; i < breweries.length; i++) {
        //   $parentDiv.appendChild(renderBreweries(breweries[i]));
        //   breweryCount++;
        // }

        breweries.forEach(brewery => {
          $parentDiv.appendChild(renderBreweries(brewery));
          breweryCount++;
        });

        if (breweryCount > 0) {
          $header.textContent = city + ' ' + 'Breweries';
        } else {
          $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar.value = '';
      });

      breweryRequest.send();
      $localView.classList.remove('hidden');
    } else {
      breweryCount = 0;
      pageNumber = 1;
      if ($searchBar.value) {
        $homepageView.classList.add('hidden');
      }
      $pageResultsContainer.classList.add('hidden');
      $parentDiv.innerHTML = '';
      breweryName = $searchBar.value;

      openBreweryDB = new XMLHttpRequest();

      openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?by_name=' + breweryName);
      openBreweryDB.responseType = 'json';

      openBreweryDB.addEventListener('load', function () {
        hideLoader(document.querySelector('.spinner-container'));
        var breweries = openBreweryDB.response;

        for (var i = 0; i < breweries.length; i++) {
          $parentDiv.appendChild(renderBreweries(breweries[i]));
          breweryCount++;
        }

        if (breweryCount > 0) {
          $header.textContent = breweryName;
        } else {
          $header.textContent = 'No results for' + ' ' + breweryName;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar.value = '';
      });

      openBreweryDB.send();
      $localView.classList.remove('hidden');
    }

  }
});

var $searchBar2 = document.querySelector('.search-bar-2');

$searchBar2.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {

    if (!$searchBar2.value || $searchBar2.value === ' ') {
      return;
    }

    showLoader(document.querySelector('.spinner-container'));

    if ($searchBar2.getAttribute('placeholder') === 'Search by city...') {
      breweryCount = 0;
      pageNumber = 1;
      if ($searchBar2.value) {
        $homepageView.classList.add('hidden');
      }
      $pageResultsContainer.classList.remove('hidden');
      $parentDiv.innerHTML = '';
      city = $searchBar2.value;
      var openBreweryDB = new XMLHttpRequest();

      openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?page=' + pageNumber + '&' + 'per_page=20' + '&' + 'by_city=' + city);
      openBreweryDB.responseType = 'json';

      openBreweryDB.addEventListener('load', function () {
        hideLoader(document.querySelector('.spinner-container'));
        var breweries = openBreweryDB.response;

        for (var i = 0; i < breweries.length; i++) {
          $parentDiv.appendChild(renderBreweries(breweries[i]));
          breweryCount++;
        }

        if (breweryCount > 0) {
          $header.textContent = city + ' ' + 'Breweries';
        } else {
          $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar2.value = '';
      });

      openBreweryDB.send();
      $localView.classList.remove('hidden');
    } else {
      breweryCount = 0;
      pageNumber = 1;
      if ($searchBar2.value) {
        $homepageView.classList.add('hidden');
      }
      $pageResultsContainer.classList.add('hidden');
      $parentDiv.innerHTML = '';
      breweryName = $searchBar2.value;

      openBreweryDB = new XMLHttpRequest();

      openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?by_name=' + breweryName);
      openBreweryDB.responseType = 'json';

      openBreweryDB.addEventListener('load', function () {
        hideLoader(document.querySelector('.spinner-container'));

        var breweries = openBreweryDB.response;

        for (var i = 0; i < breweries.length; i++) {
          $parentDiv.appendChild(renderBreweries(breweries[i]));
          breweryCount++;
        }

        if (breweryCount > 0) {
          $header.textContent = breweryName;
        } else {
          $header.textContent = 'No results for' + ' ' + breweryName;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar2.value = '';
      });

      openBreweryDB.send();
      $localView.classList.remove('hidden');
    }

  }
});

// Function to Render Brewery Cards

function renderBreweries(breweries) {
  var $col3 = document.createElement('div');
  $col3.setAttribute('class', 'column-half-content');

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
  $col1.setAttribute('class', 'heart-container');
  $row.appendChild($col1);

  var $infoFlex = document.createElement('div');
  $infoFlex.setAttribute('class', 'info-flex');
  $col1.appendChild($infoFlex);

  var $breweryInfo = document.createElement('div');
  $breweryInfo.setAttribute('class', 'brewery-info');
  $infoFlex.appendChild($breweryInfo);

  var $h3 = document.createElement('h3');
  if (breweries.name === null) {
    breweries.name = '';
  } else {
    $h3.textContent = breweries.name;
    $breweryInfo.appendChild($h3);
  }

  var $ul = document.createElement('ul');
  $breweryInfo.appendChild($ul);

  var $li1 = document.createElement('li');
  var phone;
  if (breweries.phone) {
    phone = '(' + breweries.phone.slice(0, 3) + ')' + ' ' + breweries.phone.slice(3, 6) + '-' + breweries.phone.slice(6);
  } else {
    phone = '';
  }
  $li1.textContent = phone;
  $ul.appendChild($li1);

  var $li2 = document.createElement('li');
  var street;
  var city;
  var state;
  if (breweries.street === null) {
    street = '';
  } else {
    street = breweries.street + ', ';
  }
  if (breweries.city === null) {
    city = '';
  } else {
    city = breweries.city + ', ';
  }
  if (breweries.state === null) {
    state = '';
  } else {
    state = breweries.state;
  }
  $li2.textContent = street + city + state;
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

  var $i1 = document.createElement('i');

  $i1.setAttribute('class', 'far fa-heart fa-2x');

  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].id === breweries.id) {
      $i1.setAttribute('class', 'fas fa-heart fa-2x');
    }
  }

  $i1.setAttribute('id', 'heart');
  $i1.setAttribute('data-id', breweries.id);
  $col1.appendChild($i1);

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

// Event listener to toggle hearts

var $modal = document.querySelector('#popup');
var editId;

$parentDiv.addEventListener('click', function (event) {
  if (event.target.matches('#heart')) {
    if (event.target.className === 'far fa-heart fa-2x') {
      event.target.className = 'fas fa-heart fa-2x';
      var id = event.target.getAttribute('data-id');

      var openBreweryDB = new XMLHttpRequest();

      openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries/' + id);
      openBreweryDB.responseType = 'json';

      openBreweryDB.addEventListener('load', function () {
        data.favorites.push(openBreweryDB.response);
      });

      openBreweryDB.send();

    } else {
      editId = event.target.getAttribute('data-id');
      $modal.classList.remove('hidden');
    }
  }
});

// Pop up event listeners

$modal.addEventListener('click', function (event) {
  if (event.target.textContent === 'CANCEL') {
    $modal.classList.add('hidden');
  }

  if (event.target.textContent === 'CONFIRM') {

    var breweryEdit = document.querySelector('[data-id="' + editId + '"]');
    breweryEdit.className = 'far fa-heart fa-2x';
    for (var x = 0; x < data.favorites.length; x++) {
      if (breweryEdit.getAttribute('data-id') === data.favorites[x].id) {
        data.favorites.splice(x, 1);
        if ($header.textContent === 'Favorites') {
          $parentDiv.innerHTML = '';
          for (var i = 0; i < data.favorites.length; i++) {
            $parentDiv.appendChild(renderBreweries(data.favorites[i]));
          }
        }
      }
    }
    editId = '';
    $modal.classList.add('hidden');
  }
});

//  Event listener to toggle arrow icons.

var $arrowRight = document.querySelector('#arrow-right');
var $arrowLeft = document.querySelector('#arrow-left');

$arrowRight.addEventListener('mouseover', function (event) {
  $arrowRight.className = 'fas fa-arrow-alt-circle-right fa-2x';
});

$arrowRight.addEventListener('mouseout', function (event) {
  $arrowRight.className = 'far fa-arrow-alt-circle-right fa-2x';
});

$arrowLeft.addEventListener('mouseover', function (event) {
  $arrowLeft.className = 'fas fa-arrow-alt-circle-left fa-2x';
});

$arrowLeft.addEventListener('mouseout', function (event) {
  $arrowLeft.className = 'far fa-arrow-alt-circle-left fa-2x';
});

// Function to change brewery results

var pageNumber = 1;

$arrowLeft.addEventListener('click', function (event) {
  if (pageNumber > 1) {
    pageNumber--;
    breweryCount = 0;
    showLoader(document.querySelector('.spinner-container'));

    $parentDiv.innerHTML = '';
    var openBreweryDB = new XMLHttpRequest();

    openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?page=' + pageNumber + '&' + 'per_page=20' + '&' + 'by_city=' + city);
    openBreweryDB.responseType = 'json';

    openBreweryDB.addEventListener('load', function () {
      hideLoader(document.querySelector('.spinner-container'));
      var breweries = openBreweryDB.response;

      for (var i = 0; i < breweries.length; i++) {
        $parentDiv.appendChild(renderBreweries(breweries[i]));
        breweryCount++;
      }

      if (breweryCount > 0) {
        $header.textContent = city + ' ' + 'Breweries';
      } else {
        $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
      }
      $searchBar.value = '';
    });

    openBreweryDB.send();
  }

});

// Event listener to change page results

$arrowRight.addEventListener('click', function (event) {

  if (breweryCount === 20) {
    showLoader(document.querySelector('.spinner-container'));
    breweryCount = 0;
    pageNumber++;
    $parentDiv.innerHTML = '';
    var openBreweryDB = new XMLHttpRequest();

    openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?page=' + pageNumber + '&' + 'per_page=20' + '&' + 'by_city=' + city);
    openBreweryDB.responseType = 'json';

    openBreweryDB.addEventListener('load', function () {
      hideLoader(document.querySelector('.spinner-container'));
      var breweries = openBreweryDB.response;

      for (var i = 0; i < breweries.length; i++) {
        $parentDiv.appendChild(renderBreweries(breweries[i]));
        breweryCount++;
      }

      if (breweryCount > 0) {
        $header.textContent = city + ' ' + 'Breweries';
      } else {
        $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
      }
      $searchBar.value = '';
    });

    openBreweryDB.send();
  }
});

//  Search toggle to change search to name.

var $searchToggle = document.querySelector('.search-toggle');

$searchToggle.addEventListener('click', function (event) {
  if ($searchBar.getAttribute('placeholder') === 'Search by city...') {
    $searchBar.setAttribute('placeholder', 'Search by name...');
  } else {
    $searchBar.setAttribute('placeholder', 'Search by city...');
  }
});

var $searchToggle2 = document.querySelector('.search-toggle-2');

$searchToggle2.addEventListener('click', function (event) {
  if ($searchBar2.getAttribute('placeholder') === 'Search by city...') {
    $searchBar2.setAttribute('placeholder', 'Search by name...');
  } else {
    $searchBar2.setAttribute('placeholder', 'Search by city...');
  }
});
