let allPokemons = [];
let searchedPokemon = [];
let currentPokemon; // Array with Pokemon infos

async function getPokemons() {
    await getCurrentPokemon();
}

async function getCurrentPokemon() {
    for(x=1; x <= 151; x++) {
        loadArea(x);
        await loadPokemon(x);
        await loadSpecies();
        renderPokemon();
        pokemonType();
        allPokemons.push(currentPokemon);
    }
}

// load Pokemons in "Cards". need template.js
function loadArea(pokemonNr) {
    document.getElementById('main').innerHTML += loadPokedexEelement(pokemonNr);
}

// get Pokemon infos
async function loadPokemon(pokemonNr){
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonNr}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

// load Pokemon name and description in german
async function loadSpecies() {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon['id']}`;
    let response = await fetch(url);
    let currentSpecies = await response.json();

    loadName(currentSpecies);
    loadDescription(currentSpecies);
}

function loadName(currentSpecies) {
    for(i=0; i < currentSpecies['names'].length; i++) {
        let text = currentSpecies['names'][i];
        if(text['language']['name'] == 'de'){
            currentPokemon['name_en'] = currentPokemon['name'];
            currentPokemon['name'] = text['name'];
            break;
        }
    }

}

function loadDescription(currentSpecies) {
    for(i=0; i < currentSpecies['flavor_text_entries'].length; i++) {
        let text = currentSpecies['flavor_text_entries'][i];
        if(text['language']['name'] == 'de'){
            currentPokemon['description'] = text['flavor_text'];
            break;
        }
    }
}

function renderPokemon() {
    let nr = currentPokemon['id'];
    document.getElementById('pokemon-name-' + nr).innerHTML = currentPokemon['name'];
    document.getElementById('pokemon-id-' + nr).innerHTML = `#${nr}`
    document.getElementById('pokemon-img-' + nr).src = currentPokemon['sprites']['other']['home']['front_default'];
    
}

function pokemonType() {
    let types = currentPokemon['types'];
    let typeColor;

    for(i=0; i<types.length ;i++) {
        pokemonTypeTemplate(types, i, typeColor);
    }
    typeColor = getTypeColorIcon(types[0]['type']['name_en']);
    document.getElementById('pokedex-card-bg-' + currentPokemon['id']).style.background = typeColor[0];
}

function showSameType(type) {
    // Alle vom gleichen Typ anzeigen
}

// ========== DARK / LIGHT MODE ==========
function changeTheme(theme) {
    let navbar = document.getElementById('navbar');
    let body = document.getElementById('body');
    let themeTxt = document.getElementById('siteTheme');
    let footer = document.getElementById('footer');

    if(theme == 'dark'){
        changeThemeToDark(navbar, body, themeTxt, footer);
    } else {
        changeThemeToLight(navbar, body, themeTxt, footer);
    }
}

// ========== SEARCH POKEMON ==========
function searchPokemon() {
    let search = document.getElementById('searchInput').value;
    search = search.toLowerCase().trim();
    searchedPokemon = allPokemons;
    document.getElementById('main').innerHTML = ``;

    if (search.length > 0) {
        
        console.log(search);
        searchedPokemon = allPokemons.filter(p => includesSearch(p, search));

    }
    //renderSearch();
}