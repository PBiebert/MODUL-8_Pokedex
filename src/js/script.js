"use strict";
const main = document.querySelector("main");
const dialog = document.querySelector("dialog");
let currentStack = [];
let allPokemonStack = [];
let currentDialog;
let counter = 3;
let offset = 0;

document.addEventListener("keyup", (event) => {
  if (event.key == "Escape") {
    closeDialog();
  }
});

async function init() {
  loadSpinner(true);
  await loadPokemonList(counter, offset);
  renderPokemonCard();
  renderLoadMoreButton();
  loadSpinner(false);
  console.log(currentStack);
  loadAllPokemonName();
}

async function loadPokemonList(counter, offset) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${counter}&offset=${offset}`);
    const responseToJson = await response.json();
    let fetchStack = responseToJson.results;
    await loadPokemonDetails(fetchStack);
  } catch (error) {
    errorMassage(error);
  }
}

async function loadPokemonDetails(fetchStack) {
  for (let i = 0; i < fetchStack.length; i++) {
    try {
      const response = await fetch(fetchStack[i].url);
      const pokemonData = await response.json();

      console.log(pokemonData);

      createNewPokemon(pokemonData);
    } catch (error) {
      errorMassage(error);
    }
  }
}

async function loadAllPokemonName() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`);
  const responseToJson = await response.json();
  allPokemonStack.push(...responseToJson.results);
}

function createNewPokemon(pokemonData) {
  let pokemon = {};

  pokemon.id = pokemonData.id;
  pokemon.name = capitalizeFirstLetter(pokemonData.name);
  pokemon.typs = pokemonData.types;
  pokemon.img = pokemonData.sprites.other.dream_world.front_default;
  pokemon.height = (pokemonData.height * 0.1).toFixed(2) + " m";
  pokemon.weight = (pokemonData.weight * 0.1).toFixed(2) + " kg";
  pokemon.abilities = pokemonData.abilities;
  pokemon.stats = pokemonData.stats;
  currentStack.push(pokemon);
}

function renderPokemonCard() {
  const cartContainer = document.querySelector(".card-container");

  cartContainer.innerHTML = "";

  for (let i = 0; i < currentStack.length; i++) {
    cartContainer.innerHTML += templatePokemonCard(i);
    renderPokemonClass(i);
  }
}

function renderPokemonClass(i) {
  let currentPokemon = currentStack[i];
  let currenElement = document.getElementById(`elemente_${currentStack[i].name}`);

  for (let j = 0; j < currentPokemon.typs.length; j++) {
    let element = capitalizeFirstLetter(currentPokemon.typs[j].type.name);

    currenElement.innerHTML += templateElement(element);
  }
}

function capitalizeFirstLetter(word) {
  let capitalized = word;

  capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
  return capitalized;
}

function renderLoadMoreButton() {
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.innerHTML += templateLoadMoreButton();
}

async function loadMore() {
  offset += counter;
  ButtonDisableToggle(true);
  loadSpinner(true);
  await loadPokemonList(counter, offset);
  renderPokemonCard();
  ButtonDisableToggle(false);
  loadSpinner(false);
}

function openDialog(id) {
  const stackId = Number(id - 1);
  currentDialog = stackId;
  rednerDialog(stackId);
}

function rednerDialog(id) {
  setDialogHtml(id);
  setDialogBackgroundColor(id);
  setDialogElements(id);
  setDialogAbilities(id);
  setDialogStats(id);
  setOverflowHiddn("body");
  dialog.showModal();
}

function changePokemon(value) {
  switch (value) {
    case "back":
      currentDialog--;
      break;
    case "next":
      currentDialog++;
      break;
  }
  closeDialog();

  checkValidateCurrentIndex();
  rednerDialog(currentDialog);
}

function closeDialog() {
  dialog.close();
  removeOverflowHiddn("body");
  dialog.innerHTML = "";
}

function setDialogHtml(stackId) {
  dialog.innerHTML += templateDialog(stackId);
}

function setDialogBackgroundColor(stackId) {
  let dialogBody = document.querySelector(".dialog-body");

  dialogBody.classList.add(currentStack[stackId].typs[0].type.name);
}

function setDialogElements(stackId) {
  const dialogElementContainer = document.getElementById("dialog-element-container");

  for (let i = 0; i < currentStack[stackId].typs.length; i++) {
    let element = capitalizeFirstLetter(currentStack[stackId].typs[i].type.name);
    dialogElementContainer.innerHTML += templateElement(element);
  }
}

function setDialogAbilities(stackId) {
  const abilities = document.getElementById("abilities");
  const abilitiesArray = currentStack[stackId].abilities;
  abilities.innerHTML = "";

  for (let i = 0; i < abilitiesArray.length; i++) {
    let abilitie = abilitiesArray[i].ability.name;

    abilities.innerHTML += capitalizeFirstLetter(abilitie + ", ");
  }

  abilities.textContent = abilities.textContent.slice(0, -2);
}

function setDialogStats(stackId) {
  const baseStatsTable = document.querySelector(".base-stats table");
  baseStatsTable.innerHTML = "";

  const statsArray = currentStack[stackId].stats;
  FormatStatusNames(statsArray);

  for (let i = 0; i < statsArray.length; i++) {
    baseStatsTable.innerHTML += templateDialogStats(statsArray[i]);
  }
}

function FormatStatusNames(statsArray) {
  for (let i = 0; i < statsArray.length; i++) {
    switch (statsArray[i].stat.name) {
      case "special-attack":
        statsArray[i].stat.name = "Sp.-Atk.";
        break;

      case "special-defense":
        statsArray[i].stat.name = "Sp.-Def.";
        break;

      default:
        statsArray[i].stat.name = capitalizeFirstLetter(statsArray[i].stat.name);
        break;
    }
  }
}

function openDialogNavElement(navElement) {
  const selectElement = document.getElementById(navElement);
  const dialogNav = document.querySelectorAll(".dialog-nav li");
  const dialogContentSites = document.querySelector(".dialog-content");

  for (let i = 0; i < dialogNav.length; i++) {
    if (selectElement.id == dialogNav[i].id) {
      dialogNav[i].classList.add("dialog-nav-activ");
      dialogContentSites.children[i].classList.remove("d-none");
    } else {
      dialogNav[i].classList.remove("dialog-nav-activ");
      dialogContentSites.children[i].classList.add("d-none");
    }
  }
}

// -------------------------------

function checkValidateCurrentIndex() {
  if (currentDialog == -1) {
    currentDialog = currentStack.length - 1;
  } else if (currentDialog == currentStack.length) {
    currentDialog = 0;
  }
}

// function filterAllPokemon() {
//   let inputField = document.getElementById("search");
//   let inputMassage = inputField.value;

//   let filterResult = allPokemonStack.filter();
//   console.log(filterResult);

//   // if (inputMassage.length >= 3) {

//   // }
// }

function setOverflowHiddn(element) {
  let setElement = document.querySelector(element);
  setElement.classList.add("overflowHidden");
}

function removeOverflowHiddn(element) {
  let setElement = document.querySelector(element);
  setElement.classList.remove("overflowHidden");
}

function ButtonDisableToggle(value) {
  const button = document.getElementById("load-more");
  button.disabled = value;
}

function loadSpinner(value) {
  const overlay = document.querySelector(".overlay");

  if (value == true) {
    overlay.classList.remove("d-none");
    overlay.innerHTML += spinner();
  } else if (value == false) {
    const svg = overlay.querySelector(`svg`);
    overlay.removeChild(svg);
    overlay.classList.add("d-none");
  }
}

function errorMassage(error) {
  main.innerHTML = "";
  main.innerHTML += templateErrorMassage(error);
  console.log(error);
}
