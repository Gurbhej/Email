
//to check and remember the selected game
let selectedGame = 0;

let trashLink = document.getElementById('trashLink');
let inboxLink = document.getElementById('inbox');
let composeLink = document.getElementById('compose');


trashLink.addEventListener('click', function(e) {
  e.preventDefault();
  // console.log('Trash clicked');
  let filteredList = games.filter(game => game.deleted);
  selectedGame = 0;
  render(filteredList);
});

inboxLink.addEventListener('click', function(e) {
  e.preventDefault();
  // console.log('Trash clicked');
  let inbox  = games.filter( game => !game.deleted);
  selectedGame = 0;
  render(inbox);
});

composeLink.addEventListener('click', composeForm);

function composeForm(e) {
  e.preventDefault();
  // console.log('Trash clicked');
  let htmlForm = `
          <div class="pure-g">
            <div class="pure-u-1">
              <form id="newgame" class="pure-form pure-form-aligned" name="newgame">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="publisher">Publisher</label>
                        <input id="publisher" type="text" placeholder="Publisher" name="publisher">
                        <span class="pure-form-message-inline">This is a required field.</span>
                    </div>

                    <div class="pure-control-group">
                        <label for="gamesubject">Subject</label>
                        <input id="gamesubject" type="text" placeholder="Subject" name="gamesubject">
                    </div>

                    <div class="pure-control-group">
                        <label for="gamebody">Body</label>
                        <textarea id="gamebody" placeholder="Body text" name="gamebody" class="pure-input-1-2" row="20" cols="200"></textarea>
                    </div>

                    <div class="pure-controls">
                        <button id="send" type="submit" class="pure-button pure-button-primary">Send</button>
                    </div>
                </fieldset>
            </form>
          </div>
        </div>
      `;

  let main = document.getElementById('main');
  main.innerHTML= htmlForm;

  let send = document.getElementById('send');
  send.addEventListener('click', function(e) {
    e.preventDefault();

let date = new Date();
console.log(date.toDateString());

    let object_newgame = {
      publisher : document.forms.newgame.publisher.value,
      subject : document.forms.newgame.gamesubject.value,
      body : document.forms.newgame.gamebody.value,
      date : date.toDateString(),
      avatar : 'https://archive.org/services/img/msdos_Pac-Man_1983',
      ifrmSrc : 'https://archive.org/embed/msdos_Pac-Man_1983'

    }
    // push ourr new object into games array
    games.unshift(object_newgame);


          setLocalStorage();
    inboxLink.click();
  });
};

function render(games){
// take the object.anydata from the demoData file
    let gamesEmailData =
    // used back-ticks `` for string
    `
    ${games.map ( (game, index) => `
                          <div class="email-item pure-g" data-id="${index}">
                                  <div class="pure-u">
                                      <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" class="email-avatar" src="${game.avatar}">
                                  </div>
                                  <div class="pure-u-3-4">
                                      <h5 class="email-name">${game.publisher} ${game.date}</h5>
                                      <h4 class="email-subject">${game.subject}</h4>
                                      <p class="email-desc">
                                          ${game.body.length > 80 ? `${game.body.substr(0, 79)}...` : game.body}
                                      </p>
                                  </div>
                              </div>
                          `).join('')}
     `;
     // used join above^ to join the values in the array i.e remove the commas to apper in between


      // we select the element id 'list' from the index.html file and equal it to a variable
      let elementList = document.getElementById('list');
      elementList.innerHTML = gamesEmailData;

      initialize(games);
 }

 function initialize(games) {
   let gameList = [...(document.querySelectorAll('[data-id]'))];
   gameList.map( (game, index) => game.addEventListener('click', function(e){
     //remove class from the previous seelected games
     gameList[selectedGame].classList.remove('email-item-selected');
     //add class to the game selected
     game.classList.add('email-item-selected');
     //update
     selectedGame = index;
     // console.log(this.dataset.id);

     showGAmeBOdy(index, games);
   }));

//selecct the first by default if there are any games
  if (games.length) {
    gameList[selectedGame].classList.add('email-item-selected');
    showGAmeBOdy(selectedGame, games);
  }
  else {
    let main = document.getElementById('main');
    main.innerHTML = '<h1 style="color: #eee">You Did Not Delete Any Games </h1>'
  }
}

  function showGAmeBOdy(indx, games){
  let displaayGameBody = `
    <div class="email-content">
        <div class="email-content-header pure-g">
            <div class="pure-u-1-2">
                <h1 class="email-content-title">${games[indx].subject}</h1>
                <p class="email-content-subtitle">
                    From <a>${games[indx].publisher}</a> at <span>3:56pm, April 3, 2012</span>
                </p>
            </div>

            <div class="email-content-controls pure-u-1-2">
                <button id="delete" class="secondary-button pure-button" data-id="${indx}">${games[indx].deleted ? 'Deleted' : 'Delete'}</button>
                <button class="secondary-button pure-button">Forward</button>
                <button class="secondary-button pure-button">Move to</button>
            </div>
        </div>

        <div class="email-content-body">
            <p>
            ${games[indx].body}
            </p>
            <p>
            <iframe width="560" height="315" src="${games[indx].ifrmSrc}" frameborder="0" allowfullscreen></iframe>

            </p>
        </div>
    </div>
`;
    let main = document.getElementById('main');
    main.innerHTML = displaayGameBody;

    let btn_delete = document.getElementById('delete');
    btn_delete.addEventListener('click', () => deleteGame(btn_delete.dataset.id, games));
  }

function deleteGame(index, games){
      //does not have deleted= true
    if (!games[index].deleted) {
      //add value prop deleted = true inside the selected email
      games[index].deleted = true;

//local storage to remember the state

      setLocalStorage();

      // update index view
      let inbox  = games.filter( game => !game.deleted)
      selectedGame = 0;
      render(inbox);
  }
  else{
      //does have deleted= true
      delete games[index].deleted;
      let filteredList = games.filter(game => game.deleted);
      selectedGame = 0;
      render(filteredList);
    }
  }


function setLocalStorage() {
  localStorage.setItem('items', JSON.stringify(games));
}


//if localstorage exxixsts then use it else use the global games
if (localStorage.getItem('items')) {
  games = JSON.parse(localStorage.getItem('items'));
  let filtered= games.filter(game  => !game.deleted);
  render(filtered);
}
else{
  render(games);
}
