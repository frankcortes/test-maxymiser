// We are using ?mmcore.cfgid=1 for retrieve the data

function purchaseMovie() {
  var price = 120;
  actions.set('Sales_Quantity', '1').set('Sales_Amount', price).send();
  console.log('A movie was purchased!');
}

function rentMovie() {
  var price = 10;
  actions.trackClicks('.button__rent', {
    name: 'Rent_Movie',
    value: price
  });
  console.log('A movie was rented!');
}

function generateUID() {
  var letters = '0123456789abcdef';
  var segments = [8,4,4,4,12];
  var uid = [];
  for(var i = 0; i < segments.length; i++) {
    var segment = '';
    for(var j = 0; j < segments[i]; j++) {
      segment += generateElem(letters);
    }
    uid.push(segment);
  }
  return uid.join('-');
}

function generateElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCountry() {
  var countries = ['es', 'uk', 'pt', 'lu', 'fr', 'it'];
  return generateElem(countries);
}

function generateLanguageCode() {
  var languages = ['ES', 'CAT', 'ENG', 'FR', 'IT', 'DE'];
  return generateElem(languages);
}

function generateEmailName() {
  var emailNames = ['fran', 'david', 'jorge', 'mateo', 'nini', 'michael'];
  return generateElem(emailNames);
}

function generateDomain() {
  var domains = ['hola.com', 'microsoft.com', 'oracle.com', 'bla.com'];
  return generateElem(domains);
}

function generateCodeAndCountry() {
  var country = generateCountry();
  var languageCode = generateLanguageCode();
  return { country: country , language: [languageCode, country].join('_') };
}

function generateEmail() {
  return [generateEmailName(), generateDomain()].join('@');
}

function generateUser() {
  var data = generateCodeAndCountry();
  return {
    email: generateEmail(),
    uid: generateUID(),
    country: data.country,
    language: data.language
  };
}

function createUser() {
  var user = generateUser();
  for(var elem in user) {
    if(user.hasOwnProperty(elem)) {
      visitor.storeAttr(elem, user[elem]);
      console.log('store ' + elem + ' dimension to ' + user[elem]);
    }
  }
  renderUserDimensions(user);
  console.log('add user dimensions for maximiser');
}

function addEvents() {
  var purchaseButton = document.querySelector('.button__purchase');
  var rentalButton = document.querySelector('.button__rent');
  purchaseButton.addEventListener('click', purchaseMovie);
  rentalButton.addEventListener('click', rentMovie);
}

/* Is this function really needed? Cannot we inject code and
 expose variables in the "original" variant? */
function isAVariant() {
  return exists(site)  && exists(visitor) && exists(actions);
}

function exists(obj) {
  return typeof obj !== 'undefined';
}

// This is just an example about how we want to retrieve the experience data.
function renderVariant() {
  var experience = site.getPageExperiences()['Test buttons page_copy'];
  var boxText = document.querySelector('.box--variant');
  boxText.innerHTML = JSON.stringify(experience);
}

function renderUserDimensions(user) {
  var userText = document.querySelector('.box--user');
  userText.innerHTML = JSON.stringify(user);
}

function renderOriginal() {
  var boxText = document.querySelector('.box');
  boxText.innerHTML = '100% original';
}

function loadMain(){
  if(isAVariant()) {
    renderVariant();
    createUser();
    addEvents();
  } else {
    renderOriginal();
    console.log('original code, so we couldn\'t see site/actions/visitor data, could we?');
  }
}

window.onload = loadMain;
