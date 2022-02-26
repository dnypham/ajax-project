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
const $searchBar2 = document.querySelector('.search-bar-2');
const $modal = document.querySelector('#popup');
const $arrowRight = document.querySelector('#arrow-right');
const $arrowLeft = document.querySelector('#arrow-left');

let breweryCount = 0;
let city;
let breweryName;
let editId;
let pageNumber = 1;

// Functions

function hideLoader(spinner) {
  spinner.classList.add('hidden');
}

function showLoader(spinner) {
  spinner.classList.remove('hidden');
}

function resetPage() {
  breweryCount = 0;
  pageNumber = 1;
}

function viewSwap(event) {
  if (event.target === $homepage || event.target === $homepage2) {
    $localView.classList.add('hidden');
    $pageResultsContainer.classList.add('hidden');
    document.querySelector('.not-found-container').classList.add('hidden');
    $homepageView.classList.remove('hidden');
    $searchBar.setAttribute('placeholder', 'Search by city...');
    $parentDiv.innerHTML = '';
    resetPage();
  } else if (event.target === $localButton) {
    $homepageView.classList.add('hidden');
    $notFound.classList.add('hidden');
    $localView.classList.remove('hidden');
    resetPage();
    $header.textContent = 'Local Breweries';
    showLoader($spinner);
  } else if (event.target === $favorites || event.target === $favorites2) {
    $homepageView.classList.add('hidden');
    $pageResultsContainer.classList.add('hidden');
    $localView.classList.remove('hidden');
    $parentDiv.innerHTML = '';
    resetPage();
    $header.textContent = 'Favorites';
    hideLoader($spinner);
  } else if (event.target === $searchBar || event.target === $searchBar2) {
    $homepageView.classList.add('hidden');
    $pageResultsContainer.classList.remove('hidden');
    $parentDiv.innerHTML = '';
    resetPage();
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

    breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?by_dist=${latitude},${longitude}`);
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

  data.favorites.length === 0
    ? $notFound.classList.remove('hidden')
    : data.favorites.forEach(brewery => $parentDiv.appendChild(renderBreweries(brewery)));
});

$favorites2.addEventListener('click', function (event) {
  viewSwap(event);

  data.favorites.length === 0
    ? $notFound.classList.remove('hidden')
    : data.favorites.forEach(brewery => $parentDiv.appendChild(renderBreweries(brewery)));
});

// Search for breweries in a city when clicking enter.

$searchBar.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {

    if (!$searchBar.value || $searchBar.value.trim().length === 0) {
      return;
    }

    if ($searchBar.getAttribute('placeholder') === 'Search by city...') {
      viewSwap(event);

      city = $searchBar.value;

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=20&by_city=${city}`);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        hideLoader($spinner);
        const breweries = breweryRequest.response;

        breweries.forEach(brewery => {
          $parentDiv.appendChild(renderBreweries(brewery));
          breweryCount++;
        });

        if (breweryCount > 0) {
          $header.textContent = `${city} Breweries`;
        } else {
          $header.textContent = `No Breweries Found in "${city}"`;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar.value = '';
      });

      breweryRequest.send();
      $localView.classList.remove('hidden');
    } else {
      viewSwap(event);
      breweryName = $searchBar.value;

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?by_name=${breweryName}`);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        hideLoader($spinner);

        const breweries = breweryRequest.response;

        breweries.forEach(brewery => {
          $parentDiv.appendChild(renderBreweries(brewery));
          breweryCount++;
        });

        if (breweryCount > 0) {
          $header.textContent = breweryName;
        } else {
          $header.textContent = `No results for "${breweryName}"`;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar.value = '';
      });

      breweryRequest.send();
      $localView.classList.remove('hidden');
    }

  }
});

$searchBar2.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {

    if (!$searchBar2.value || $searchBar2.value.trim().length === 0) {
      return;
    }

    if ($searchBar2.getAttribute('placeholder') === 'Search by city...') {
      viewSwap(event);

      city = $searchBar2.value;

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=20&by_city=${city}`);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        hideLoader($spinner);
        const breweries = breweryRequest.response;

        breweries.forEach(brewery => {
          $parentDiv.appendChild(renderBreweries(brewery));
          breweryCount++;
        });

        if (breweryCount > 0) {
          $header.textContent = `${city} Breweries`;
        } else {
          $header.textContent = `No Breweries Found in "${city}"`;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar2.value = '';
      });

      breweryRequest.send();
      $localView.classList.remove('hidden');
    } else {
      viewSwap(event);
      breweryName = $searchBar2.value;

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?by_name=${breweryName}`);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        hideLoader($spinner);

        const breweries = breweryRequest.response;

        breweries.forEach(brewery => {
          $parentDiv.appendChild(renderBreweries(brewery));
          breweryCount++;
        });

        if (breweryCount > 0) {
          $header.textContent = breweryName;
        } else {
          $header.textContent = `No results for "${breweryName}"`;
          $pageResultsContainer.classList.add('hidden');
        }
        $searchBar2.value = '';
      });

      breweryRequest.send();
      $localView.classList.remove('hidden');
    }

  }
});

// Function to Render Brewery Cards

function renderBreweries(brewery) {
  const $col3 = document.createElement('div');
  $col3.setAttribute('class', 'column-half-content');

  const $breweryCardFlex = document.createElement('div');
  $breweryCardFlex.setAttribute('class', 'brewery-card-flex');
  $col3.appendChild($breweryCardFlex);

  const $breweryCard = document.createElement('div');
  $breweryCard.setAttribute('class', 'brewery-card');
  $breweryCardFlex.appendChild($breweryCard);

  const $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  $breweryCard.appendChild($row);

  const $col1 = document.createElement('div');
  $col1.setAttribute('class', 'column-half');
  $col1.setAttribute('class', 'heart-container');
  $row.appendChild($col1);

  const $infoFlex = document.createElement('div');
  $infoFlex.setAttribute('class', 'info-flex');
  $col1.appendChild($infoFlex);

  const $breweryInfo = document.createElement('div');
  $breweryInfo.setAttribute('class', 'brewery-info');
  $infoFlex.appendChild($breweryInfo);

  const $h3 = document.createElement('h3');
  if (brewery.name) {
    $h3.textContent = brewery.name;
    $breweryInfo.appendChild($h3);
  } else {
    brewery.name = '';
  }

  const $ul = document.createElement('ul');
  $breweryInfo.appendChild($ul);

  const $li1 = document.createElement('li');

  brewery.phone
    ? brewery.phone = `(${brewery.phone.slice(0, 3)}) ${brewery.phone.slice(3, 6)}-${brewery.phone.slice(6)}`
    : brewery.phone = '';

  $li1.textContent = brewery.phone;
  $ul.appendChild($li1);

  const $li2 = document.createElement('li');

  brewery.street
    ? brewery.street = `${brewery.street}, `
    : brewery.street = '';

  brewery.city
    ? brewery.city = `${brewery.city}, `
    : brewery.city = '';

  if (!brewery.state) {
    brewery.state = '';
  }

  $li2.textContent = brewery.street + brewery.city + brewery.state;
  $ul.appendChild($li2);

  const $li3 = document.createElement('li');
  $ul.appendChild($li3);

  const $a = document.createElement('a');
  if (brewery.website_url) {
    $a.textContent = brewery.website_url.slice(7);
    $a.setAttribute('href', brewery.website_url);
    $a.setAttribute('target', '_blank');
  }
  $li3.appendChild($a);

  const $i1 = document.createElement('i');

  $i1.setAttribute('class', 'far fa-heart fa-2x');

  for (let i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].id === brewery.id) {
      $i1.setAttribute('class', 'fas fa-heart fa-2x');
    }
  }

  $i1.setAttribute('id', 'heart');
  $i1.setAttribute('data-id', brewery.id);
  $col1.appendChild($i1);

  const $col2 = document.createElement('div');
  $col2.setAttribute('class', 'column-half');
  $row.appendChild($col2);

  const $mapFlex = document.createElement('div');
  $mapFlex.setAttribute('class', 'map-flex');
  $col2.appendChild($mapFlex);

  const $breweryMap = document.createElement('div');
  $breweryMap.setAttribute('class', 'brewery-map');
  $mapFlex.appendChild($breweryMap);

  const $map = document.createElement('iframe');

  if (brewery.latitude && brewery.longitude) {
    $map.setAttribute('src', `https://maps.google.com/maps?q=${brewery.latitude},${brewery.longitude}&z=15&output=embed`);
    $map.setAttribute('width', '100%');
    $map.setAttribute('height', '100%');
    $map.setAttribute('frameborder', '0');
    $map.setAttribute('style', 'border: 0;');
    $breweryMap.appendChild($map);
  } else {
    const $img = document.createElement('img');
    $img.setAttribute('class', 'map-image');
    $img.setAttribute('src', 'https://static-00.iconduck.com/assets.00/map-marker-slash-icon-500x512-rym1tj3e.png');
    $breweryMap.appendChild($img);
  }

  return $col3;
}

// Event listener to toggle hearts

$parentDiv.addEventListener('click', function (event) {
  if (event.target.matches('#heart')) {
    if (event.target.className === 'far fa-heart fa-2x') {
      event.target.className = 'fas fa-heart fa-2x';
      const id = event.target.getAttribute('data-id');

      const breweryRequest = new XMLHttpRequest();

      breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries/${id}`);
      breweryRequest.responseType = 'json';

      breweryRequest.addEventListener('load', function () {
        data.favorites.push(breweryRequest.response);
      });

      breweryRequest.send();

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
    const breweryEdit = document.querySelector('[data-id="' + editId + '"]');

    breweryEdit.className = 'far fa-heart fa-2x';

    for (let x = 0; x < data.favorites.length; x++) {
      if (breweryEdit.getAttribute('data-id') === data.favorites[x].id) {
        data.favorites.splice(x, 1);

        if ($header.textContent === 'Favorites') {
          $parentDiv.innerHTML = '';

          data.favorites.forEach(brewery => {
            $parentDiv.appendChild(renderBreweries(brewery));
          });
        }
      }
    }
    editId = '';
    $modal.classList.add('hidden');
  }
});

//  Event listener to toggle arrow icons.

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

$arrowLeft.addEventListener('click', function (event) {
  if (pageNumber > 1) {
    pageNumber--;
    breweryCount = 0;
    $parentDiv.innerHTML = '';

    showLoader($spinner);

    const breweryRequest = new XMLHttpRequest();

    breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=20&by_city=${city}`);
    breweryRequest.responseType = 'json';

    breweryRequest.addEventListener('load', function () {
      hideLoader($spinner);

      const breweries = breweryRequest.response;

      breweries.forEach(brewery => {
        $parentDiv.appendChild(renderBreweries(brewery));
        breweryCount++;
      });

      breweryCount > 0
        ? $header.textContent = `${city} Breweries`
        : $header.textContent = `No Breweries Found in "${city}"`;

      $searchBar.value = '';
    });

    breweryRequest.send();
  }

});

// Event listener to change page results

$arrowRight.addEventListener('click', function (event) {

  if (breweryCount === 20) {
    showLoader($spinner);
    breweryCount = 0;
    pageNumber++;
    $parentDiv.innerHTML = '';

    const breweryRequest = new XMLHttpRequest();

    breweryRequest.open('GET', `https://api.openbrewerydb.org/breweries?page=${pageNumber}&per_page=20&by_city=${city}`);
    breweryRequest.responseType = 'json';

    breweryRequest.addEventListener('load', function () {
      hideLoader($spinner);

      const breweries = breweryRequest.response;

      breweries.forEach(brewery => {
        $parentDiv.appendChild(renderBreweries(brewery));
        breweryCount++;
      });

      if (breweryCount > 0) {
        $header.textContent = city + ' ' + 'Breweries';
      } else {
        $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
      }

      breweryCount > 0
        ? $header.textContent = `${city} Breweries`
        : $header.textContent = `No Breweries Found in "${city}"`;

      $searchBar.value = '';
    });

    breweryRequest.send();
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
