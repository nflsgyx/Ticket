var user_id = '1111';
var user_fullname = 'John';
var lng = -122.08;
var lat = 37.38;

var devHost = 'http://localhost:8080/Ticket/'

// $.ajaxSetup({
//   xhrFields: {
//     withCredentials: true
//   }
// });

$(document).ready(function() {
  // initGeoLocation();
  $('#nearby-btn').click(loadNearbyItems);
  $('#fav-btn').click(loadFavoriteItems);
  $('#recommend-btn').click(loadRecommendedItems);
  $('#welcome-msg').html('Welcome, ' + user_fullname);
  $('#login-btn').click(login);
  $('#logout-link').attr('href', devHost + '/logout');
  validateSession();
});

function validateSession() {

  var url = devHost + './login';
  var req = null;

  showLoadingMessage('Validating session...');

  ajax('GET', url, req, function(res) {
    if (res.status === 'OK') {
      onSessionValid(res);
    } else {
      onSessionInvalid();
    }
  }, function() {
    onSessionInvalid();
  });
}

function initGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPositionUpdated,
      onLoadPositionFailed, {
        maximumAge: 60000
      });
    showLoadingMessage('Retrieving your location...');
  } else {
    onLoadPositionFailed();
  }
}

function onSessionValid(result) {
  user_id = result.user_id;
  user_fullname = result.name;

  var loginForm = document.querySelector('#login-form');
  var itemNav = document.querySelector('#item-nav');
  var itemList = document.querySelector('#item-list');
  var avatar = document.querySelector('#avatar');
  var welcomeMsg = document.querySelector('#welcome-msg');
  var logoutBtn = document.querySelector('#logout-link');

  $('#welcome-msg').html('Welcome, ' + user_fullname);

  showElement('#item-nav');
  showElement('#item-list');
  showElement('#avatar');
  showElement('#welcome-msg');
  showElement('#logout-link', 'inline-block');
  hideElement('#login-form');
  initGeoLocation();
}

function onSessionInvalid() {

  hideElement('#item-nav');
  hideElement('#item-list');
  hideElement('#avatar');
  hideElement('#logout-link');
  hideElement('#welcome-msg');

  showElement('#login-form');
}

function onPositionUpdated(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;

  loadNearbyItems();
}

function onLoadPositionFailed() {
  console.warn('navigator.geolocation is not available');
  getLocationFromIP();
}

function getLocationFromIP() {
  // Get location from http://ipinfo.io/json
  var url = 'http://ipinfo.io/json'
  var req = null;

  $.get("https://ipinfo.io?token=d075529d90c8c2", function(result) {
    if ('loc' in result) {
      var loc = result.loc.split(',');
      lat = loc[0];
      lng = loc[1];
      console.log(lat);
      console.log(lng);
      loadNearbyItems();
    } else {
      console.warn('Getting location by IP failed.');
    }
}, "jsonp")

  // $.ajax({
  //   type: 'GET',
  //   url: url,
  //   dataType: "json",
  //   contentType: "application/json",
  //   success: function(result) {
  //     if ('loc' in result) {
  //       var loc = result.loc.split(',');
  //       lat = loc[0];
  //       lng = loc[1];
  //     } else {
  //       console.warn('Getting location by IP failed.');
  //     }
  //   },
  //   error: function(){
  //       console.warn('Getting location by IP failed.');
  //   }
  // });

  // ajax('GET', url, req, function(res) {
  //     // console.log(res)
  //     var result = res;
  //     if ('loc' in result) {
  //         var loc = result.loc.split(',');
  //         lat = loc[0];
  //         lng = loc[1];
  //     } else {
  //         console.warn('Getting location by IP failed.');
  //     }
  //     loadNearbyItems();
  // });
}

// -----------------------------------
// Helper Functions
// -----------------------------------

/**
 * A helper function that makes a navigation button active
 *
 * @param btnId -
 *            The id of the navigation button
 */
function activeBtn(btnId) {
  $('.main-nav-btn').removeClass('active');
  $('#' + btnId).addClass('active');
}

function showLoadingMessage(msg) {
  $('#item-list').html('<p class="notice"><i class="fa fa-spinner fa-spin"></i> ' + msg + '</p>');
}

function showWarningMessage(msg) {
  $('#item-list').html('<p class="notice"><i class="fa fa-exclamation-triangle"></i> ' +
    msg + '</p>');
}

function showErrorMessage(msg) {
  $('#item-list').html('<p class="notice"><i class="fa fa-exclamation-circle"></i> ' +
    msg + '</p>');
}

/**
 * A helper function that creates a DOM element <tag options...>
 *
 * @param tag
 * @param options
 * @returns
 */
// function $(tag, options) {
//     if (!options) {
//         return document.getElementById(tag);
//     }

//     var element = document.createElement(tag);

//     for (var option in options) {
//         if (options.hasOwnProperty(option)) {
//             element[option] = options[option];
//         }
//     }

//     return element;
// }

function hideElement(element) {
  $(element).hide();
}

function showElement(element, style) {
  var displayStyle = style ? style : 'block';
  $(element).attr('style', 'display:' + displayStyle);
}

function ajax(method, url, data, callback, errorHandler) {
  // var xhr = new XMLHttpRequest();

  // xhr.withCredentials = false;

  // xhr.open(method, url, true);

  // xhr.onload = function() {
  //     // if (xhr.status === 200) {
  //         callback(xhr.responseText);
  //     // } else {
  //     //     errorHandler();
  //     // }
  // };

  // xhr.onerror = function() {
  //     console.error("The request couldn't be completed.");
  //     errorHandler();
  // };



  // if (data === null) {
  //     xhr.send();
  // } else {
  //     // xhr.setRequestHeader("Content-Type",
  //     //     "application/json;charset=utf-8");
  //     xhr.send(data);
  // }
  $.ajax({
    type: method,
    url: url,
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: data,
    success: function(result, status, request) {
      callback(result)
    },
    error: function(request, status, error) {
      console.log(request);
      console.log(status);
      console.log(error);
      console.error("The request couldn't be completed.");
      errorHandler();
    }
  })
}

/**
 * API #1 Load the nearby items API end point: [GET]
 * /Dashi/search?user_id=1111&lat=37.38&lon=-122.08
 */
function loadNearbyItems() {
  console.log('loadNearbyItems');
  activeBtn('nearby-btn');

  // The request parameters
  var url = devHost + './search';
  var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
  // var req = JSON.stringify({});
  var req = null;
  // display loading message
  showLoadingMessage('Loading nearby items...');

  // make AJAX call
  ajax('GET', url + '?' + params, req,
    // successful callback
    function(res) {
      // console.log(res);
      var items = res;
      if (!items || items.length === 0) {
        showWarningMessage('No nearby item.');
      } else {
        // console.log(items);
        listItems(items);
      }
    },
    // failed callback
    function() {
      showErrorMessage('Cannot load nearby items.');
    });
}

/**
 * API #2 Load favorite (or visited) items API end point: [GET]
 * /Dashi/history?user_id=1111
 */
function loadFavoriteItems() {
  activeBtn('fav-btn');

  // The request parameters
  var url = devHost + './history';
  var params = 'user_id=' + user_id;
  // var req = JSON.stringify({});
  var req = null;

  // display loading message
  showLoadingMessage('Loading favorite items...');

  // make AJAX call
  ajax('GET', url + '?' + params, req, function(res) {
    var items = res;
    if (!items || items.length === 0) {
      showWarningMessage('No favorite item.');
    } else {
      console.log(items);
      listItems(items);
    }
  }, function() {
    showErrorMessage('Cannot load favorite items.');
  });
}

/**
 * API #3 Load recommended items API end point: [GET]
 * /Dashi/recommendation?user_id=1111
 */
function loadRecommendedItems() {
  activeBtn('recommend-btn');

  // The request parameters
  var url = devHost + './recommendation';
  var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;

  // var req = JSON.stringify({});
  var req = null;
  // display loading message
  showLoadingMessage('Loading recommended items...');

  // make AJAX call
  ajax(
    'GET',
    url + '?' + params,
    req,
    // successful callback
    function(res) {
      var items = res;
      if (!items || items.length === 0) {
        showWarningMessage('No recommended item. Make sure you have favorites.');
      } else {
        listItems(items);
      }
    },
    // failed callback
    function() {
      showErrorMessage('Cannot load recommended items.');
    });
}

/**
 * API #4 Toggle favorite (or visited) items
 *
 * @param item_id -
 *            The item business id
 *
 * API end point: [POST]/[DELETE] /Dashi/history request json data: {
 * user_id: 1111, visited: [a_list_of_business_ids] }
 */
function changeFavoriteItem(item_id) {
  // Check whether this item has been visited or not
  var li = $('#item-' + item_id);
  var favIcon = $('#fav-icon-' + item_id);
  var favorite = li.data('favorite');
  console.log("fav", favorite);

  // The request parameters
  var url = devHost + './history';
  var req = JSON.stringify({
    user_id: user_id,
    favorite: [item_id]
  });
  var method = favorite ? 'DELETE' : 'POST';

  ajax(method, url, req,
    // successful callback
    function(res) {
      var result = res;
      if (result.result === 'SUCCESS') {
        favorite = !favorite
        li.data('favorite', favorite);
        favIcon.removeClass('fa fa-heart');
        favIcon.removeClass('fa fa-heart-o');
        favIcon.addClass(favorite ? 'fa fa-heart' : 'fa fa-heart-o');
      }
    },
    // failed callback
    function() {
      showErrorMessage('Cannot change favorite item.');
    });
}


function login() {
  var username = $('#username').val();
  var password = $('#password').val();
  console.log(username)
  console.log(password)
  password = md5(username + md5(password));
  console.log(password)


  // The request parameters
  var url = devHost + './login';
  var req = JSON.stringify({
    user_id: username,
    password: password
  });

  ajax('POST', url, req,
    function(res) {
      if (res.status === 'OK') {
        onSessionValid(res);
      }
    },
    function() {
      console.log(md5('demo' + md5('123456')))
      $('#login-error').show()
    },
    true);
}


/**
 * List items
 *
 * @param items -
 *            An array of item JSON objects
 */
function listItems(items) {
  // Clear the current results
  $('#item-list').html('');

  for (var i = 0; i < items.length; i++) {
    addItem($('#item-list'), items[i]);
  }
}

/**
 * Add item to the list
 *
 * @param itemList -
 *            The
 *            <ul id="item-list">
 *            tag
 * @param item -
 *            The item data (JSON object)
 */
function addItem(itemList, item) {
  var item_id = item.item_id;

  // create the <li> tag and specify the id and class attributes
  var li = $('<li>').attr('id', 'item-' + item_id).addClass('item');

  // set the data attribute
  li.data("item_id", item_id);
  li.data("favorite", item.favorite);

  // item image
  if (item.image_url) {
    li.append($('<img>').attr('src', item.image_url));
  } else {
    li.append($('<img>').attr('src', 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'));
  }
  // section
  var section = $('<div>');

  // title
  var title = $('<a>').attr('href', item.url).attr('target', '_blank').addClass('item-name');
  title.html(item.name);
  section.append(title);

  // category
  var category = $('<p>').addClass('item-category');
  category.html('Category: ' + item.categories.join(', '));
  section.append(category);

  // date and time
  var time = $('<p>').addClass('item-time');
  time.html('Time: ' + item.date + ' ' + item.local_time.substring(0, item.local_time.length - 3));
  section.append(time);

  // stars
  var stars = $('<div>').addClass('stars');

  for (var i = 0; i < item.rating; i++) {
    var star = $('<i>').addClass('fa fa-star');
    stars.append(star);
  }

  if (('' + item.rating).match(/\.5$/)) {
    stars.append($('<i>').addClass('fa fa-star-half-o'));
  }

  section.append(stars);

  li.append(section);

  // address
  var address = $('<p>').addClass('item-address');

  address.html(item.address.replace(/,/g, '<br/>').replace(/\"/g, ''));
  li.append(address);

  // favorite link
  var favLink = $('<p>').addClass('fav-link');

  favLink.click(function() {
    changeFavoriteItem(item_id);
  });

  favLink.append($('<i>').attr('id', 'fav-icon-' + item_id).addClass(item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'));

  li.append(favLink);

  itemList.append(li);
}
