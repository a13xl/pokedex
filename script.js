let allPokemons = [];
let searchedPokemon = [];
let currentPokemon; // Array with Pokemon infos
let currentPokemons = []; // current showed Pokemons
let currentCount = 1;
let newCount = 40;
let maxCount = 151;
let globalTheme;

async function getPokemons() {
    load();
    await getCurrentPokemons();
    closeLoadingMain();
}

async function getCurrentPokemons() {
    for(x=currentCount; x <= newCount; x++) {
        loadArea(x);
        await loadPokemon(x)
        currentPokemons.push(currentPokemon);
        renderPokemon();
    }
    currentCount = newCount;
    loadMorePokemonBtn();

    if(allPokemons.length < maxCount){
        await loadBackgroundPokemons();
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
    let currentSpecies = await loadSpecies(currentPokemon['id']);
    //loadName(currentSpecies);
    currentPokemon['name_en'] = currentPokemon['name'];
    currentPokemon['name'] = currentSpecies['names'][5]['name'];
    //loadGenus(currentSpecies);
    currentPokemon['genus'] = currentSpecies['genera'][4]['genus'];
    //loadDescription(currentSpecies);
    currentPokemon['description'] = currentSpecies['flavor_text_entries'][25]['flavor_text'].replace(/\n/gi, "<br>");
    pokemonType();  
}

function loadMorePokemonBtn() {
    if(newCount < maxCount){
        document.getElementById('pokedexContainerBtn').innerHTML = `<button onclick="loadMorePokemons()" style="">Mehr laden</button>`;
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
async function loadSpecies(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`; // `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon['id']}`;
    let response = await fetch(url);
    let currentSpecies = await response.json();

    return currentSpecies;
}

function fillEvolutionTrigger(name, trigger, lvl, item) {
    if(trigger){
        if(trigger == 'level-up' && lvl > 0) {
            return {'name': name, 'trigger': trigger, 'lvl': lvl};
        } else if(trigger == 'use-item') {
            return {'name': name, 'trigger': trigger, 'item': item};
        } else {
            return {'name': name, 'trigger': trigger};
        }
    } else if(name) {
        return {'name': name};
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

// ========== SEARCH POKEMON ==========
function searchPokemon() {
    let searchTerm = getSearchInput();
    let searchType = document.getElementById('searchType').value;
    
    clearArea();

    if(searchTerm.length > 0) {
        searchTermGtZero(searchType, searchTerm); 
    } else {
        searchTermLtZero();
    }
}

function searchTermGtZero(searchType, searchTerm) {
    document.getElementById('pokedexContainerBtn').innerHTML = '';

        searchTypeSwitch(searchType, searchTerm);
        
        if(searchedPokemon.length > 0) {
            for (let x = 0; x < searchedPokemon.length; x++) {
                currentPokemon = searchedPokemon[x];
                loadArea(currentPokemon['id']);
                renderPokemon();
            }
        } else {
            document.getElementById('pokemonContainer').innerHTML = `
            <span class="searchError">Es wurde nichts gefunden!<br><br>Nothing found!</span>`;
        }
}

function searchTermLtZero() {
    if(newCount < maxCount){
        document.getElementById('pokedexContainerBtn').innerHTML = `<button onclick="loadMorePokemons()" style="">Mehr laden</button>`;
    }

    for (let x = 0; x < currentPokemons.length; x++) {
        currentPokemon = currentPokemons[x];
        loadArea(currentPokemon['id']);
        renderPokemon();
    }
}

function searchTypeSwitch(searchType, searchTerm) {
    switch (searchType) {
        case 'NameDe':
            searchedPokemon = searchByNameDe(searchTerm);
            break;
        case 'NameEn':
            searchedPokemon = searchByNameEn(searchTerm);
            break;
        case 'TypeDe':
                let searchedPokemon1 = searchByTypeDe(searchTerm, 0);
                let searchedPokemon2 = searchByTypeDe(searchTerm, 1);
                searchedPokemon = searchedPokemon1.concat(searchedPokemon2);
                searchedPokemon = searchedPokemon.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
            break;
        case 'TypeEn':
                let searchedPokemonTypeEn1 = searchByTypeEn(searchTerm, 0);
                let searchedPokemonTypeEn2 = searchByTypeEn(searchTerm, 1);
                searchedPokemon = searchedPokemonTypeEn1.concat(searchedPokemonTypeEn2);
                searchedPokemon = searchedPokemon.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
            break;
        case 'PokemonId':
            searchedPokemon = searchByID(searchTerm);
            break;
    }
}

function searchForType(type) {
    document.getElementById('searchInput').value = type;
    document.getElementById('searchType').value = 'TypeEn';
    searchPokemon();
}

function clearArea() {
    document.getElementById('pokemonContainer').innerHTML = '';
}

function searchByNameDe(searchTerm) {
    let searchResult = [];

    searchResult = allPokemons.filter((pokemon) => {
        const pokemonName = pokemon['name'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
        return pokemonName.indexOf(searchTerm) >= 0; // search term
    });
    return searchResult;
}

function searchByNameEn(searchTerm) {
    let searchResult = [];

    searchResult = allPokemons.filter((pokemon) => {
        const pokemonName = pokemon['name_en'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
        return pokemonName.indexOf(searchTerm) >= 0; // search term
    });
    return searchResult;
}

function searchByTypeDe(searchTerm, nr) {
    let searchResult = [];

    searchResult = allPokemons.filter((pokemon) => {
        if (pokemon['types'][nr]) {
            const pokemonType = pokemon['types'][nr]['type']['name'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
            return pokemonType.indexOf(searchTerm) >= 0; // search term
        }
    });
    return searchResult;
}

function searchByTypeEn(searchTerm, nr) {
    let searchResult = [];

    searchResult = allPokemons.filter((pokemon) => {
        if (pokemon['types'][nr]) {
            const pokemonType = pokemon['types'][nr]['type']['name_en'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
            return pokemonType.indexOf(searchTerm) >= 0; // search term
        }
    });
    return searchResult;
}

function searchByID(searchTerm) {
    let searchResult = [];

    searchResult = allPokemons.filter((pokemon) => {
        const pokemonID = pokemon['id'].toString(); // Pokemon Name (array allPokemons) to Lower Case
        return pokemonID.indexOf(searchTerm) >= 0; // search term
    });
    return searchResult;
}

function getSearchInput() {
    let searchTerm = document.getElementById('searchInput').value;
    return searchTerm.toLowerCase();
}

// ========== LOADING ==========
function opnLoadingCard() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('bigView').classList.add('card-bg');
}

function closeLoading() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('body').style.overflow = '';
    document.getElementById('bigView').classList.remove('card-bg');
}

function closeLoadingMain() {
    document.getElementById('main').classList.remove('main-bg');
    closeLoading();
}

/* ========== FOOTER ========== */
function impressum() {
    let pokemonIndex = 0;
    openBigView();
    renderBigCard(pokemonIndex);
    document.getElementById('big-view-content').innerHTML = impressumTemplate();
    changeThemeImpressum();
}

