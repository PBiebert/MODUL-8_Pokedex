"use strict";
let currentStack = [];
let counter = 20;
let offset = 0;

async function init() {
  await loadPokemonList(counter, offset);
  renderPokemonCard();
  console.log(currentStack);
  openDialog(1);
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

      let pokemon = {};

      pokemon.id = pokemonData.id;
      pokemon.name = validateFirstLetterCapitalized(pokemonData.name);
      pokemon.typs = pokemonData.types;
      pokemon.img = pokemonData.sprites.other.dream_world.front_default;
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
    let element = validateFirstLetterCapitalized(currentPokemon.typs[j].type.name);
    currenElement.innerHTML += templateElement(element);
  }
}

function validateFirstLetterCapitalized(word) {
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
  const dialog = document.querySelector("dialog");
  dialog.showModal();
}
