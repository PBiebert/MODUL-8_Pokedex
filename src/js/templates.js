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

function templateDialog(stackId) {
  return `
        <div class="dialog-body" onclick="event.stopPropagation()">
          <div class="dialog-img">
            <div class="dialog-headline">
              <div class="name-area">
              <h2># ${currentStack[stackId].id}</h2>
                <h2>${currentStack[stackId].name}</h2>
              </div>

              <button class="close-dialog" onclick="closeDialog()">X</button>
            </div>
            <div class="picture-class-area">
              <div class="elements" id=dialog-element-container>

              </div>
              <img class="poke-img" src="${currentStack[stackId].img}" alt="Bild von ${currentStack[stackId].name}" />
            </div>
            <svg class="poke-background dialog-poke-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0 -18 0"></path>
              <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
              <path d="M3 12h6"></path>
              <path d="M15 12h6"></path>
            </svg>
          </div>
          <div class="dialog-content-container">
            <nav class="dialog-nav">
              <ul>
                <li id="about" class="dialog-nav-activ" onclick="openDialogNavElement(id)" tabindex="0" autofocus>About</li>
                <li id="base-stats"  onclick="openDialogNavElement(id)" tabindex="0">Base Stats</li>
              </ul>
            </nav>
            <div class="dialog-content">
              <table class="about ">
                <tr>
                  <th>Height:</th>
                  <td>${currentStack[stackId].height}</td>
                </tr>
                <tr>
                  <th>Weight:</th>
                  <td>${currentStack[stackId].weight}</td>
                </tr>
                <tr>
                  <th>Abilities:</th>
                  <td id="abilities">dies und das</td>
                </tr>
              </table>

              <div class="base-stats d-none">
                <table>
                </table>
              </div>

            </div>

            <div class="change-container">
              <button class="dialog-button" id="back" onclick="changePokemon(id)">back</button>
              <button class="dialog-button" id="next" onclick="changePokemon(id)">next</button>
            </div>
          </div>
        </div>`;
}

function templateDialogStats(statsArray) {
  return `
    <tr>
      <th class="stats-name">${statsArray.stat.name}</th>
      <td class="stats-value">${statsArray.base_stat}</td>
      <td class="stats-progress"><progress value="${statsArray.base_stat}" max="255"></progress></td>
     </tr>
`;
}
