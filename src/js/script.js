"use strict";
const main = document.querySelector("main");
const dialog = document.querySelector("dialog");
const cartContainer = document.querySelector(".card-container");
const language = "en";
let currentStack = [];
let filterStack = [];
let allPokemonStack = [];
let activeStack = [];
let currentDialog;
let counter = 20;
let offset = 0;

document.addEventListener("keyup", (event) => {
  if (event.key == "Escape") {
    closeDialog();
  }
});

async function init() {
  loadSpinner(true);
  await loadPokemonList(counter, offset);
  activeStack = currentStack;
  renderPokemonCard(currentStack);
  renderLoadMoreButton();
  loadSpinner(false);
  loadAllPokemonName();
}

async function loadPokemonList(counter, offset) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${counter}&offset=${offset}`);
    const responseToJson = await response.json();
    let fetchStack = responseToJson.results;
    await loadPokemonDetails(fetchStack, currentStack);
  } catch (error) {
    errorMassage(error);
  }
}

async function loadPokemonDetails(fetchStack, saveStack) {
  try {
    const promises = [];

    for (let i = 0; i < fetchStack.length; i++) {
      promises.push(fetchSinglePokemon(fetchStack[i]));
    }

    const allPokemonData = await Promise.all(promises);

    for (let i = 0; i < allPokemonData.length; i++) {
      if (allPokemonData[i] !== null && allPokemonData[i] !== undefined) {
        try {
          const pokemonData = allPokemonData[i].pokemonData;
          const pokemonSpecies = allPokemonData[i].pokemonSpecies;
          createNewPokemon(pokemonData, pokemonSpecies, saveStack);
        } catch (error) {
          console.error(`Fehler beim Erstellen von Pokémon:`, error);
        }
      }
    }
  } catch (error) {
    errorMassage(error);
  }
}

async function fetchSinglePokemon(pokemon) {
  try {
    const responsePokemonData = await fetch(pokemon.url);
    const pokemonData = await responsePokemonData.json();

    const responsePokemonSpecies = await fetch(pokemonData.species.url);
    const pokemonSpecies = await responsePokemonSpecies.json();

    return { pokemonData, pokemonSpecies };
  } catch (error) {
    errorMassage(error);
    return null;
  }
}

async function loadAllPokemonName() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`);
  const responseToJson = await response.json();
  allPokemonStack.push(...responseToJson.results);
}

function createNewPokemon(pokemonData, pokemonSpecies, saveStack, language) {
  let pokemon = {};

  pokemon.id = pokemonData.id;
  pokemon.name = capitalizeFirstLetter(pokemonData.name);
  pokemon.typs = pokemonData.types;
  pokemon.img = alternativePokémonImage(pokemonData);
  pokemon.height = (pokemonData.height * 0.1).toFixed(2) + " m";
  pokemon.weight = (pokemonData.weight * 0.1).toFixed(2) + " kg";
  pokemon.abilities = pokemonData.abilities;
  pokemon.stats = pokemonData.stats;
  pokemon.genera = getGeneraByLanguage(pokemonSpecies, language);
  pokemon.baseColor = capitalizeFirstLetter(pokemonSpecies.color.name);
  pokemon.baseHappyness = pokemonSpecies.base_happiness;
  pokemon.shape = pokemonSpecies.shape.name;
  saveStack.push(pokemon);
}

function getGeneraByLanguage(pokemonSpecies, language) {
  const index = pokemonSpecies.genera.findIndex((entry) => entry.language.name === language);

  if (index !== -1) {
    return pokemonSpecies.genera[index].genus;
  } else {
    return "Unknown";
  }
}

function alternativePokémonImage(pokemonData) {
  if (pokemonData.sprites.other.dream_world.front_default != null) {
    return pokemonData.sprites.other.dream_world.front_default;
  } else if (pokemonData.sprites.other["official-artwork"].front_default != null) {
    return pokemonData.sprites.other["official-artwork"].front_default;
  } else if (pokemonData.sprites.other.home.front_default != null) {
    return pokemonData.sprites.other.home.front_default;
  } else {
    return "";
  }
}

function renderPokemonCard(saveStack) {
  let htmlContent = "";

  for (let i = 0; i < saveStack.length; i++) {
    htmlContent += templatePokemonCard(i, saveStack);
  }

  cartContainer.innerHTML = htmlContent;

  for (let i = 0; i < saveStack.length; i++) {
    renderPokemonClass(saveStack, i);
  }
}

function renderPokemonClass(saveStack, i) {
  let currentPokemon = saveStack[i];
  let currenElement = document.getElementById(`elemente_${saveStack[i].name}`);

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
  activeStack = currentStack;
  renderPokemonCard(currentStack);
  ButtonDisableToggle(false);
  loadSpinner(false);
}

function openDialog(id) {
  const stackId = activeStack.findIndex((pokemon) => pokemon.id === Number(id));

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

  dialogBody.classList.add(activeStack[stackId].typs[0].type.name);
}

function setDialogElements(stackId) {
  const dialogElementContainer = document.getElementById("dialog-element-container");

  for (let i = 0; i < activeStack[stackId].typs.length; i++) {
    let element = capitalizeFirstLetter(activeStack[stackId].typs[i].type.name);
    dialogElementContainer.innerHTML += templateElement(element);
  }
}

function setDialogAbilities(stackId) {
  const abilities = document.getElementById("abilities");
  const abilitiesArray = activeStack[stackId].abilities;
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

  const statsArray = activeStack[stackId].stats;
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

function checkValidateCurrentIndex() {
  if (currentDialog == -1) {
    currentDialog = activeStack.length - 1;
  } else if (currentDialog == activeStack.length) {
    currentDialog = 0;
  }
}

async function filterAllPokemon() {
  let inputField = document.getElementById("search");

  const loadMoreButton = document.getElementById("load-more");
  let inputMassage = inputField.value.toLowerCase().trim();

  if (inputMassage.length >= 3) {
    await setFilter(inputMassage);

    if (filterStack.length == 0) {
      cartContainer.innerHTML = templatePokemonNotFound();
    }

    setDnone(loadMoreButton);
  } else if (inputMassage.length === 0) {
    activeStack = currentStack;
    renderPokemonCard(currentStack);

    removeDnone(loadMoreButton);
  }
}

async function setFilter(inputMassage) {
  filterStack = [];
  let filterResult = allPokemonStack.filter((pokemon) => pokemon.name.toLowerCase().startsWith(inputMassage));
  await loadPokemonDetails(filterResult, filterStack);
  activeStack = filterStack;

  if (filterStack.length > 0) {
    renderPokemonCard(filterStack);
  }
}

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
  cartContainer.innerHTML = "";
  cartContainer.innerHTML += templateErrorMassage();
  console.log(error);
}

function setDnone(element) {
  element.classList.add("d-none");
}

function removeDnone(element) {
  element.classList.remove("d-none");
}
