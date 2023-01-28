let allPokemons = [];
let searchedPokemon = [];
let currentPokemon; // Array with Pokemon infos
let currentPokemons = []; // current showed Pokemons
let currentCount = 1;
let newCount = 6;
let maxCount = 151;

async function getPokemons() {
    load();
    await getCurrentPokemons();
}

async function getCurrentPokemons() {
    for(x=currentCount; x <= newCount; x++) {
        loadArea(x);
        await loadPokemon(x)
        currentPokemons.push(currentPokemon);
        renderPokemon();
    }
    loadMorePokemonBtn();
    currentCount = newCount;

    closeLoading();

    if(allPokemons.length < maxCount){
        loadBackgroundPokemons();
    }
}

// load Pokemons from API if not loaded in Array allPokemons
async function loadPokemon(x){
    if(allPokemons.length < maxCount){
        await getCurrentPokemonInfo(x);
        allPokemons.push(currentPokemon);
    } else {
        let y = x-1;
        currentPokemon = allPokemons[y];
    }
}

// load all Pokemons in Background
async function loadBackgroundPokemons() {
    for(j=(currentCount+1); j <= maxCount; j++) {
        await getCurrentPokemonInfo(j);
        allPokemons.push(currentPokemon);
    }

}

// get German Name and Description
async function getCurrentPokemonInfo(x) {
    await loadPokemonArray(x);
    let currentSpecies = await loadSpecies();
    loadName(currentSpecies);
    loadDescription(currentSpecies);
    pokemonType();    
} 

function loadMorePokemonBtn() {
    if(newCount < maxCount){
        document.getElementById('pokedexContainerBtn').innerHTML = `<button onclick="loadMorePokemons()">Mehr laden</button>`;
    }
}

// click on Load more Pokemons
function loadMorePokemons() {
    let n = newCount;
    n = n + 30
    currentCount++

    if(n < maxCount){
        newCount = n;
        loadMorePokemonBtn();
    } else {
        newCount = maxCount;
        document.getElementById('pokedexContainerBtn').innerHTML = '';
    }
    getCurrentPokemons();
}

// load Pokemons in "Cards". need template.js
function loadArea(pokemonNr) {
    document.getElementById('pokemonContainer').innerHTML += loadPokedexEelement(pokemonNr);
}

// get Pokemon infos
async function loadPokemonArray(pokemonNr){
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonNr}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

// load Pokemon name and description in german
async function loadSpecies() {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon['id']}`;
    let response = await fetch(url);
    let currentSpecies = await response.json();

    return currentSpecies;
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
            //currentPokemon['description'] = text['flavor_text'];
            currentPokemon['description'] = text['flavor_text'].replace(/\n/gi, "<br>");
            break;
        }
    }
}

function renderPokemon() {
    let nr = currentPokemon['id'];
    document.getElementById('pokemon-name-' + nr).innerHTML = currentPokemon['name'];
    document.getElementById('pokemon-id-' + nr).innerHTML = `#${nr}`
    document.getElementById('pokemon-img-' + nr).src = currentPokemon['sprites']['other']['home']['front_default'];
    pokemonTypeRender();
}

function pokemonTypeRender() {
    let types = currentPokemon['types'];
    let typeColor;

    for(i=0; i<types.length ;i++) {
        pokemonTypeTemplate(types, i, typeColor);
    }
    typeColor = getTypeColorIcon(types[0]['type']['name_en']);
    document.getElementById('pokedex-card-bg-' + currentPokemon['id']).style.background = typeColor[0];
}

function pokemonType() {
    let types = currentPokemon['types'];

    for(i=0; i<types.length ;i++) {
        let type = types[i]['type']['name'];
        let typeName = getTypeColorIcon(type);
        typeName = typeName[2];

        currentPokemon['types'][i]['type']['name_en'] = types[i]['type']['name'];
        currentPokemon['types'][i]['type']['name'] = typeName;
    }
}

function pokemonTypeTemplate(types, i, typeColor) {
    let type = types[i]['type']['name_en'];
    typeColor = getTypeColorIcon(type);

    document.getElementById('pokemon-type-' + currentPokemon['id']).innerHTML += loadTypeIcon(type, i);
    let typeIcon = document.getElementById('pokemon-type-icon-' + currentPokemon['id'] + '-' + i);

    typeIcon.style.background = typeColor[0];
    typeIcon.style.boxShadow = `0 0 20px ${typeColor[1]}`;
    typeIcon.title = currentPokemon['types'][i]['type']['name'];
}

// ========== DARK / LIGHT MODE ==========
function changeTheme(theme) {
    let navbar = document.getElementById('navbar');
    let body = document.getElementById('body');
    let themeTxt = document.getElementById('siteTheme');
    let footer = document.getElementById('footer');

    if(theme == 'dark'){
        changeThemeToDark(navbar, body, themeTxt, footer);
        save('dark');
    } else {
        changeThemeToLight(navbar, body, themeTxt, footer);
        save('light');
    }
}

// ========== SEARCH POKEMON ==========


// ========== BIG VIEW ==========
function showPokemonBig(id) {
    let pokemonIndex = id - 1;

    openBigView();
    renderBigCard(pokemonIndex);
    loadBigCardHeaderBackground(pokemonIndex);
    loadBigCardTypes(pokemonIndex);
    loadBigCardInfos(pokemonIndex);
}

function openBigView() {
    let main = document.getElementById('main');
    document.getElementById('bigView').classList.remove('d-none');
    main.classList.add('main-bg');

    //main.style.position = 'relative';
    main.style.overflow = 'hidden'
}

function renderBigCard(id) {
    document.getElementById('pokemon-big-header').innerHTML = loadBigCardHeaderTemplate(id);
    document.getElementById('pokemon-info-main').innerHTML = loadPokemonNav(id);
}

function loadBigCardHeaderBackground(id) {
    let type = allPokemons[id]['types'][0]['type']['name_en'];
    let backgroundColor = getTypeColorIcon(type);
    document.getElementById('pokemon-big-header').style.background = backgroundColor[0];
}

function loadBigCardTypes(id) {
    let types = allPokemons[id]['types'];

    for(j=0; j<types.length ;j++) {
        let type = types[j]['type']['name_en'];
        let typeName = getTypeColorIcon(type);
        document.getElementById('pokemon-big-type').innerHTML += loadBigCardTypesTemplate(id, j, typeName[1])
    }
}

function loadBigCardInfos(id) {
    let infoContainer = document.getElementById('pokemon-info-container');
    let height = allPokemons[id]['height'] / 10;
    //height = height.toString(10);
    height = height.toFixed(1);
    height = height.replace(".", ",");
    
    let weight = allPokemons[id]['weight'] / 10;
    //weight = weight.toString(10);
    weight = weight.toFixed(1);
    weight = weight.replace(".", ",");

    infoContainer.innerHTML = loadBigCardInfosTemplate(id, height, weight);
}

function loadBigCardState(id) {
    // Base State
}

function loadBigCardEvolution(id) {
    // Entwicklungsstufen
}

function loadBigCardMoves(id) {
    // Attacken
}

function closeBigView() {
    let main = document.getElementById('main');
    document.getElementById('bigView').classList.add('d-none');
    main.classList.remove('main-bg');
    main.style.overflow = ''
}

function stopClosing() {
    event.stopPropagation();
}

// ========== LOADING ==========
function closeLoading() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('main').classList.remove('main-bg');
}

// ========== LOCAL STORAGE ==========
function save(theme) {
    let currentThemeAsText = JSON.stringify(theme);
    localStorage.setItem('Pokedex_Theme', currentThemeAsText);
}

function load() {
    let currentThemeAsText = localStorage.getItem('Pokedex_Theme');

    if(currentThemeAsText) {
        changeTheme(JSON.parse(currentThemeAsText));
    }
}