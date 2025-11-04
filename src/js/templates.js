"use strict";

function templatePokemonCard(i) {
  return /*html*/ `
    <div class="card-body ${currentStack[i].typs[0].type.name}" id="${currentStack[i].id}" onclick=openDialog(id)>
        <div class="background-img">
            <svg class="poke-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0 -18 0"></path>
                <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
                <path d="M3 12h6"></path>
                <path d="M15 12h6"></path>
            </svg>
        </div>
        <div class="data-container">
            <h2 class="name">#${currentStack[i].id} ${currentStack[i].name}</h2>
            <div class="elements" id="elemente_${currentStack[i].name}"></div>
        </div>
        <div class="poke-img">
            <img src="${currentStack[i].img}" alt="Picture from ${currentStack[i].name}">
        </div>
    </div>`;
}

function templateElement(element) {
  return `
    <div class="element ${element.toLowerCase()}">${element} </div>
    `;
}
