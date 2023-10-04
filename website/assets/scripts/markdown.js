
function pager(page = 0, page_count = 0) {
  function pagerExe(suffix = "") {
    let pagerStart = document.getElementById('pager-start'+suffix);
    let pagerOne = document.getElementById('pager-1'+suffix);
    let pagerTwo = document.getElementById('pager-2'+suffix);
    let pagerThree = document.getElementById('pager-3'+suffix);
    let pagerFour = document.getElementById('pager-4'+suffix);
    let pagerFive = document.getElementById('pager-5'+suffix);
    let pagerEnd = document.getElementById('pager-end'+suffix);

    const CURRECT = "pager-currect";
    const SPACE = "pager-space";
    const PAGE = "pager-page";

    function classPager(pager_currect, numb) {
      if (numb == page) {
        pager_currect.className = "pager-currect";
      } else {
        pager_currect.className = "pager-page";
      }
    }

    if (page <= 4 ) {
      function pagerIn(pager, numb, result) {
        if (numb < page_count) {
          pager.removeAttribute('hidden');
          pager.innerText = result;
          
        } else {
          pager.setAttribute("hidden", "");
        }
      }

      pagerStart.innerText = 1;
      classPager(pagerStart, 1);

      pagerIn(pagerOne, 2, 2);
      classPager(pagerOne, 2);

      pagerIn(pagerTwo, 3, 3);
      classPager(pagerTwo, 3);

      pagerIn(pagerThree, 4, 4);
      classPager(pagerThree, 4);

      pagerIn(pagerFour, 5, 5);
      classPager(pagerFour, 5);

      pagerIn(pagerFive, 6, "...");
      pagerFive.className = "pager-space";

      classPager(pagerEnd, page_count);
      pagerEnd.innerText = page_count;

      if (1 < Number(page_count)) {
        pagerEnd.removeAttribute('hidden');
        pagerStart.removeAttribute('hidden');
      } else {
        pagerEnd.setAttribute("hidden", "");
        pagerStart.setAttribute("hidden", "");
      }
    } else {
      for (let page of [pagerOne, pagerTwo, pagerThree, pagerFour, pagerFive]) {
        page.removeAttribute('hidden');
      }

      if (page >= page_count-3) {
        pagerStart.innerText = 1;
        pagerStart.className = "pager-page";

        pagerOne.innerText = "...";
        pagerOne.className = "pager-space";

        pagerTwo.innerText = page_count-4;
        pagerTwo.className = "pager-page";

        pagerThree.innerText = page_count-3;
        classPager(pagerThree, page_count-3);
        
        pagerFour.innerText = page_count-2;
        classPager(pagerFour, page_count-2);
        
        pagerFive.innerText = page_count-1;
        classPager(pagerFive, page_count-1);
        
        pagerEnd.innerText = page_count;
        classPager(pagerEnd, page_count);

        pagerEnd.removeAttribute('hidden');
        pagerStart.removeAttribute('hidden');
      } else {
        pagerStart.innerText = 1;
        pagerStart.className = "pager-page";

        pagerOne.innerText = "...";
        pagerOne.className = "pager-space";
        
        pagerTwo.innerText = page-1;
        pagerTwo.className = "pager-page";
        
        pagerThree.innerText = page;
        pagerThree.className = "pager-currect";
        
        pagerFour.innerText = Number(page)+1;
        pagerFour.className = "pager-page";
        
        pagerFive.innerText = "...";
        pagerFive.className = "pager-space";
        
        pagerEnd.innerText = page_count;
        pagerEnd.className = "pager-page";

        pagerEnd.removeAttribute('hidden');
        pagerStart.removeAttribute('hidden');
      }
    }
  }

  pagerExe("");
  pagerExe("-");
}

async function renderCards() {
  // Разбиваем URL на части
  let [baseUrl, queryParams] = window.location.href.split("?");
  let params = new URLSearchParams(queryParams);
  let paramsDict = OpenWS.urlParams(window.location.href);

  console.log(params, queryParams, OpenWS.getFromDict(params, "game_select", "false"))

  if (OpenWS.getFromDict(paramsDict, "game_select", "false") === "false") {
    let rendRes = await renderMods();
    if (rendRes > -1) {
      // Заменяем значение параметра "page" на N
      params.set("page", rendRes);

      // Собираем обновленный URL
      window.history.pushState('page'+rendRes, 'Open Workshop', `${baseUrl}?${params}`);
      
      rendRes = await renderMods();
    } else if (rendRes == -2) {
      document.title = "Open Workshop - mods not found :("
      
      const cardData = {
        "id": -1,
        "name": "Модов нет 😭",
        "logo": "assets/images/no-mods.webp",
        "short_description": "Попробуйте другие фильтры!<br><br>По текущей конфигурации фильтров - модов нет <i>(но вы держитесь 🙊)</i>."
      };
      document.getElementById('cards').appendChild(OpenWS.createCard(cardData, false));
      addCard(10);
    };
  } else {
    let rendRes = await renderGames();
    if (rendRes > -1) {
      // Заменяем значение параметра "page" на N
      params.set("page", rendRes);

      // Собираем обновленный URL
      window.history.pushState('page'+rendRes, 'Open Workshop', `${baseUrl}?${params}`);
      
      rendRes = await renderGames();
    } else if (rendRes == -2) {
      document.title = "Open Workshop - games not found :("
      console.log("kkk")
      const cardData = {
        "id": -1,
        "name": "Игр нет 😭",
        "logo": "assets/images/no-mods.webp",
        "short_description": "Попробуйте другие фильтры!<br><br>По текущей конфигурации фильтров - игр нет <i>(но вы держитесь 🙊)</i>."
      };
      document.getElementById('cards').appendChild(OpenWS.createCard(cardData, false));
      addCard(10);
    };
  };
};

async function renderMods() {
  let cardsElement = document.getElementById('cards');
  cardsElement.classList.add("hide");

  let params = OpenWS.urlParams(window.location.href);
  const dictionary = await window.OpenWS.fetchMods(params); // Добавил ключевое слово await, чтобы дождаться результата запроса
  
  const pagesCount = parseInt(Math.ceil(OpenWS.getFromDict(dictionary, "database_size", 30)/OpenWS.getFromDict(params, "page_size", 1)));
  document.title = "Open Workshop - "+OpenWS.getFromDict(dictionary, "database_size", 0)+" mods found"
  pager(OpenWS.getFromDict(params, "page", 0), pagesCount);

  cardsElement.innerHTML = "";
  cardsElement.classList.remove("hide");
  
  if (OpenWS.getFromDict(dictionary, "database_size", 0) > 0 && dictionary.results.length === 0) {
    return pagesCount;
  } else if (OpenWS.getFromDict(dictionary, "database_size", 0) < 1) {
    return -2
  }

  const doplink = "&"+window.location.href.split("?").pop();
  dictionary.results.forEach(cardData => {
    cardData.doplink = doplink;
    const card = OpenWS.createCard(cardData, true, OpenWS.getFromDict(params, "name", ""));
    cardsElement.appendChild(card);
  });

  addCard(10);

  await OpenWS.setterCardImgs();
  return -1
}
async function renderGames() {
  let cardsElement = document.getElementById('cards');
  cardsElement.classList.add("hide");

  let params = OpenWS.urlParams(window.location.href);
  const dictionary = await window.OpenWS.fetchGames(params); // Добавил ключевое слово await, чтобы дождаться результата запроса
  
  const pagesCount = parseInt(Math.ceil(OpenWS.getFromDict(dictionary, "database_size", 30)/OpenWS.getFromDict(params, "page_size", 1)));
  document.title = "Open Workshop - "+OpenWS.getFromDict(dictionary, "database_size", 0)+" games found"
  pager(OpenWS.getFromDict(params, "page", 0), pagesCount);

  cardsElement.innerHTML = "";
  cardsElement.classList.remove("hide");
  
  if (OpenWS.getFromDict(dictionary, "database_size", 0) > 0 && dictionary.results.length === 0) {
    return pagesCount;
  } else if (OpenWS.getFromDict(dictionary, "database_size", 0) < 1) {
    return -2
  }

  dictionary.results.forEach(cardData => {
    const card = OpenWS.createCard(cardData, false, OpenWS.getFromDict(params, "name", ""), true);
    cardsElement.appendChild(card);
  });

  addCard(10);

  return -1
}

renderCards(); // Вызываем функцию renderCards для рендеринга карточек


function addCard(zindex) {
    // Код для добавления новой карточки
  
    $("div.card-click").click(function(e){
      e.preventDefault();

      var isShowing = false;
  
      if ($(this).parent().hasClass("show")) {
        isShowing = true
      }
  
      if ($("div.cards").hasClass("showing")) {
        // a card is already in view
        $("div.card.show")
          .removeClass("show");
  
        if (isShowing) {
          // this card was showing - reset the grid
          $("div.cards")
            .removeClass("showing");
        } else {
          // this card isn't showing - get in with it
          $(this).parent()
            .css({zIndex: zindex})
            .addClass("show");
        }
  
        zindex=zindex+2;
  
      } else {
        // no cards in view

        $("div.cards")
          .addClass("showing");
        $(this).parent()
          .css({zIndex:zindex})
          .addClass("show");
  
        zindex=zindex+2;
      }

      const id = $(this).parent()[0].id;
      $('#card-flap'+id).css("z-index", zindex+1);
      $("div.panel").css({zIndex: zindex+1})
    });
}

function moveContainer() {
  var container = document.getElementById("container");
  container.classList.toggle("moved");
}

function namerEvent() {
  let namer = document.getElementById("param-name");
  
  let url = window.location.href
  let params = OpenWS.urlParams(url);

  console.log(namer.value);
  console.log(OpenWS.getFromDict(params, "name", ""));

  if (namer.value != OpenWS.getFromDict(params, "name", "")) {
    // Разбиваем URL на части
    let [baseUrl, queryParams] = url.split("?");
    let params = new URLSearchParams(queryParams);

    // Заменяем значение параметра "name" на N
    params.set("name", namer.value);

    // Собираем обновленный URL
    let updatedUrl = `${baseUrl}?${params}`;

    if (updatedUrl === window.location.href) { 
      console.log("RETURN ERROR")
      return 
    }
    console.log("NAME UPDATE")

    console.log(updatedUrl); // Выводим обновленный URL в консоль

    window.history.pushState('name'+namer.value, 'Open Workshop', updatedUrl);
    
    renderCards()
  }
}

function movePager(pageId) {
  let pageClick = document.getElementById(pageId);
  if (pageClick.classList.contains("pager-page")) {
    let url = window.location.href;
    let N = Number(pageClick.innerHTML); // Здесь укажите нужное число

    // Разбиваем URL на части
    let [baseUrl, queryParams] = url.split("?");
    let params = new URLSearchParams(queryParams);

    // Заменяем значение параметра "page" на N
    params.set("page", N);

    // Собираем обновленный URL
    let updatedUrl = `${baseUrl}?${params}`;

    if (updatedUrl === window.location.href) { 
      console.log("RETURN ERROR")
      return 
    }
    console.log("PAGE UPDATE")

    console.log(updatedUrl); // Выводим обновленный URL в консоль

    window.history.pushState('page'+N, 'Open Workshop', updatedUrl);
    
    renderCards()
  }
}

window.addEventListener('popstate', function(event) {
  // Обновите содержимое страницы здесь
  renderCards()
});

function pageSizeReselect() {
  // Получаем элемент <select> по его ID
  var selectElement = document.getElementById("page-size-selector");

  // Получаем значение выбранного элемента
  var selectedValue = Number(selectElement.value.split(' ')[0]);

  console.log("Выбранная опция: " + selectedValue);

  let url = window.location.href;

  // Разбиваем URL на части
  let [baseUrl, queryParams] = url.split("?");
  let params = new URLSearchParams(queryParams);

  // Заменяем значение параметра "page_size" на selectedValue
  params.set("page_size", selectedValue);

  // Собираем обновленный URL
  let updatedUrl = `${baseUrl}?${params}`;

  if (updatedUrl === window.location.href) { 
    console.log("RETURN ERROR")
    return 
  }
  console.log("PAGE UPDATE")

  console.log(updatedUrl); // Выводим обновленный URL в консоль

  window.history.pushState('page_size'+selectedValue, 'Open Workshop', updatedUrl);
  
  renderCards()
}

function gameSelectMode() {
  let gameChecker = document.getElementById("game-selector-in-menu-checkbox");
  
  let url = window.location.href;

  // Разбиваем URL на части
  let [baseUrl, queryParams] = url.split("?");
  let params = new URLSearchParams(queryParams);

  // Заменяем значение параметра "page" на N
  params.set("game_select", gameChecker.checked);

  // Собираем обновленный URL
  let updatedUrl = `${baseUrl}?${params}`;

  if (updatedUrl === window.location.href) { 
    return
  }

  window.history.pushState('game_select'+gameChecker.checked, 'Open Workshop', updatedUrl);
  
  renderCards()
}

function gameSelect(selectGameID) {
  let url = window.location.href;

  // Разбиваем URL на части
  let [baseUrl, queryParams] = url.split("?");
  let params = new URLSearchParams(queryParams);

  // Заменяем значение параметра "page" на N
  params.set("game", selectGameID);
  params.set("game_select", false);

  // Собираем обновленный URL
  let updatedUrl = `${baseUrl}?${params}`;

  if (updatedUrl === window.location.href) { 
    return
  }
  
  let gameChecker = document.getElementById("game-selector-in-menu-checkbox");
  gameChecker.checked = false;

  const gameName = document.getElementById("titlename"+selectGameID).innerText;
  const gameCurrect = document.getElementById("game-selector-in-menu-currect-game");
  gameCurrect.innerText = gameName;
  gameCurrect.title = gameName;

  console.log(updatedUrl); // Выводим обновленный URL в консоль

  window.history.pushState('game'+selectGameID, 'Open Workshop', updatedUrl);
  renderCards();
}

function gameReset() {
  let url = window.location.href;

  // Разбиваем URL на части
  let [baseUrl, queryParams] = url.split("?");
  let params = new URLSearchParams(queryParams);

  // Заменяем значение параметра "page" на N
  params.set("game", "");

  // Собираем обновленный URL
  let updatedUrl = `${baseUrl}?${params}`;

  if (updatedUrl === window.location.href) { 
    return
  }

  const gameCurrect = document.getElementById("game-selector-in-menu-currect-game");
  gameCurrect.innerText = "Игра не выбрана";
  gameCurrect.title = "Отображаются все моды";

  console.log(updatedUrl); // Выводим обновленный URL в консоль

  window.history.pushState('game', 'Open Workshop', updatedUrl);
  renderCards();
}
