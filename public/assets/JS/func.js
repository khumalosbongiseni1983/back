let limit = 20
let offset = 0
let statusCheck = 1
let api_key = ''
window.onload = async () => {
  // Hoanf thanfh hien tai
  open_add_event_to_classname(closePopup, "close_popup_detail")
  open_add_event_to_classname(closeFunction, "close_popup_function")
  let username = ''
  async function checkLocal() {
    var user = await localStorage.getItem('user') || undefined
    if (user != undefined && user.length > 10) {
      var json = JSON.parse(user)
      api_key = json.api
      username = json.username
      return true
    } else {
      location.href = '/'
      return false
    }
  }
  await checkLocal()  
}
function load_account_facebook(api_key) {
  // document.getElementsByClassName('view')[0].innerHTML = ''
  var settings = {
    "url": "/api/facebook/show",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "data": {
      "apikey": api_key,
      "limit": limit,
      "offset": offset,
      "status": statusCheck
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.success) {
      for (let i = 0; i < response.data.length; i++) {
        var htm = createHtmlWithJS(response.data[i])
        // document.getElementsByClassName('view')[0].appendChild(htm)
      }
      loadEventClickCard()
    }
  });
}
function loadEventClickCard() {
  open_add_event_to_classname(showDetail, "detail_data")
  open_add_event_to_classname(copyCookie, "copy_cookie")
  open_add_event_to_classname(openLink, "open_link")
  open_add_event_to_classname(showFunction, "action_facebook")
  open_add_event_to_classname(copycoke, "copycoke")
  open_add_event_to_classname(deleteUidData, "delete_facebook")
  open_add_event_to_classname(statusUidData, "tick_facebook")
  open_add_event_to_classname(showData, "btn-search")
}
function formatDateTime(inputDateTime) {
  const dateTime = new Date(inputDateTime);

  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  const seconds = String(dateTime.getSeconds()).padStart(2, '0');
  const day = String(dateTime.getDate()).padStart(2, '0');
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const year = dateTime.getFullYear();

  const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

  return formattedDateTime;
}

function open_add_event_to_classname(callback, className) {
  var btn_functions = document.querySelectorAll('.' + className)
  for (let i = 0; i < btn_functions.length; i++) {
    var element = btn_functions[i]
    element.addEventListener('click', (e) => {
      callback(e.target)
    })
  }
}
const showData = () => {
  var UID = document.querySelector('#uid_account').value
  // load_account_facebook_uid(api_key, UID)
}
const copycoke = (element) => {
  var UID = element.parentElement.parentElement.getElementsByClassName('UID')[0].textContent
  copyToClipboard(UID)
  Swal.fire({
    icon: 'success',
    title: 'Oops...',
    text: 'Copy UID thành công',
  })
}
const showDetail = (element) => {
  var UID = element.parentElement.parentElement.getElementsByClassName('UID')[0].textContent
  var settings = {
    "url": "/api/facebook/show",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "data": {
      "apikey": api_key,
      "limit": limit,
      "offset": offset,
      "uid": UID
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.success) {
      var person = response.data[0]
      document.getElementsByClassName('popup_uid')[0].textContent = person.uid
      document.getElementsByClassName('popup_name')[0].textContent = person.name
      document.getElementsByClassName('popup_date')[0].textContent = person.date
      document.getElementsByClassName('popup_create_at')[0].textContent = person.timestemp
      document.getElementsByClassName('popup_country')[0].textContent = person.country
      document.getElementsByClassName('popup_mail')[0].textContent = person.email
      document.getElementsByClassName('cookie_account')[0].value = person.coke[person.coke.length - 1].cookie
      if (person.coke.length == 2) {
        document.getElementsByClassName('cookie_account_2')[0].value = person.coke[0].cookie
      }
      // TÀI KHOẢN ADS
      var popup_ads = document.getElementsByClassName('popup_ads')[0]
      popup_ads.innerHTML = ''
      for (let i = 0; i < person.ads.length; i++) {
        var tr = createTrAds(person.ads[i])
        popup_ads.appendChild(tr)
      }
      // TÀI KHOẢN ABM
      var popup_ads = document.getElementsByClassName('popup_bm')[0]
      popup_ads.innerHTML = ''
      for (let i = 0; i < person.bm.length; i++) {
        var tr = createTrBm(person.bm[i])
        popup_ads.appendChild(tr)
      }

    } else {
      Swal.fire({
        // icon: 'error',
        title: 'Oops...',
        text: 'Tải thất bại!',
      })
    }
  });
  document.querySelector('.detail_popup').classList.toggle('show')
}
const createTrAds = (ojb) => {
  var tr = document.createElement('tr')
  // 1
  var td = document.createElement('td')
  var a = document.createElement('a')
  a.href = 'https://business.facebook.com/ads/manager/account_settings/account_billing/?act=' + ojb.uid_ads
  a.textContent = ojb.uid_ads
  a.target = '_blank'
  td.appendChild(a)
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.name
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.type
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.action
  td.style.color = 'red'
  if (ojb.action == "Active") {
    td.style.color = 'green'
  }
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.balance
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.limitads
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.threshold
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.currency
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.role
  tr.appendChild(td)
  return tr
}
const createTrBm = (ojb) => {
  var tr = document.createElement('tr')
  tr.style.color = 'black'
  // 1
  var td = document.createElement('td')
  var a = document.createElement('a')
  a.href = 'https://business.facebook.com/settings/?business_id=' + ojb.uid_bm
  a.textContent = ojb.uid_bm
  a.target = '_blank'
  td.appendChild(a)
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.name
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.limitbm
  td.style.fontWeight = 700
  td.style.fontSize = '20px'
  tr.appendChild(td)
  // 1
  var td = document.createElement('td')
  td.textContent = ojb.role
  tr.appendChild(td)
  // 1
  return tr
}
const closePopup = (element) => {
  document.querySelector('.detail_popup').classList.toggle('show')
}
const showFunction = (element) => {
  var UID = element.parentElement.parentElement.getElementsByClassName('UID')[0].textContent
  document.querySelector('#uid_function_now').value = UID
  var settings = {
    "url": "/api/facebook/show",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "data": {
      "apikey": api_key,
      "limit": limit,
      "offset": offset,
      "uid": UID
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.success) {
      var person = response.data[0]
      var popup_ads = document.getElementById('list_uid_pages')
      popup_ads.innerHTML = ''
      for (let i = 0; i < person.ads.length; i++) {
        var idAds = document.createElement('option')
        idAds.value = person.ads[i].uid_ads
        idAds.textContent = person.ads[i].name + `  (${person.ads[i].uid_ads} | ${person.ads[i].action})`
        popup_ads.appendChild(idAds)
      }

    } else {
      Swal.fire({
        // icon: 'error',
        title: 'Oops...',
        text: 'Tải thất bại!',
      })
    }
  });
  document.querySelector('.function_popup').classList.toggle('show')
}
const closeFunction = (element) => {
  document.querySelector('.function_popup').classList.toggle('show')
}
const openLink = (element) => {
  var UID = element.parentElement.parentElement.getElementsByClassName('UID')[0].textContent
  window.open('https://facebook.com/' + UID, '_blank')
}
const copyCookie = (element) => {
  var coke = element.getAttribute('data-coke')
  copyToClipboard(coke)
  Swal.fire({
    icon: 'success',
    title: 'Oops...',
    text: 'Copy thành công',
  })
}
function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}