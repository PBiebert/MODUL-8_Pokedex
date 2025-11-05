"use strict";
const dialog = document.querySelector("dialog");
let currentStack = [];
let counter = 3;
let offset = 0;

document.addEventListener("keyup", (event) => {
  if (event.key == "Escape") {
    closeDialog();
  }
});

async function init() {
  await loadPokemonList(counter, offset);
  renderPokemonCard();
  console.log(currentStack);
}

async function loadPokemonList(counter, offset) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${counter}&offset=${offset}`);
    const responseToJson = await response.json();
    let fetchStack = responseToJson.results;
    await loadPokemonDetails(fetchStack);

    fetchStack = [];
  } catch (error) {
    console.log(`Fehler beim laden der PokemonListe`);
  }
}

async function loadPokemonDetails(fetchStack) {
  for (let i = 0; i < fetchStack.length; i++) {
    try {
      const response = await fetch(fetchStack[i].url);
      const pokemonData = await response.json();
      console.log(pokemonData);

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
    } catch (error) {
      console.log(`Fehler beim laden der Details`);
    }
  }
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

async function loadMore() {
  offset += counter;

  await loadPokemonList(counter, offset);
  renderPokemonCard();
}

function openDialog(id) {
  const stackId = Number(id - 1);

  renderDialog(stackId);
  setDialogElements(stackId);

  dialog.showModal();
}

function closeDialog() {
  dialog.close();
  dialog.innerHTML = "";
}

function renderDialog(stackId) {
  dialog.innerHTML += templateDialog(stackId);
  setDialogBackgroundColor(stackId);
  setDialogAbilities(stackId);
  setDialogStats(stackId);
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
  console.log(statsArray);
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
