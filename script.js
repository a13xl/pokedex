let allPokemons = [];
let searchedPokemon = [];
let currentPokemon; // Array with Pokemon infos
let currentPokemons = []; // current showed Pokemons
let currentCount = 1;
let newCount = 133;
let maxCount = 151;
let globalTheme;

async function getPokemons() {
    load();
    await getCurrentPokemons();
    closeLoading();
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

/* =============== NOT IN USE ===============
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

function loadGenus(currentSpecies) {
    for(i=0; i < currentSpecies['genera'].length; i++) {
        let text = currentSpecies['genera'][i];
        if(text['language']['name'] == 'de'){
            currentPokemon['genus'] = text['genus'];
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
*/

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

    if(searchTerm.length > 0) {
        searchByNameDe(searchTerm);
    } else {
        console.log('zeige vorher geladene Pokemons')
    }
}

function searchByNameDe(searchTerm) {
    let searchResult = []
    searchResult = allPokemons.filter((pokemon) => {
        const pokemonName = pokemon['name'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
        return pokemonName.indexOf(searchTerm) >= 0; // search term
    });
    console.log(searchResult);
}

function searchByNameEn(searchTerm) {
    let searchResult = []
    searchResult = allPokemons.filter((pokemon) => {
        const pokemonName = pokemon['name_en'].toLowerCase(); // Pokemon Name (array allPokemons) to Lower Case
        return pokemonName.indexOf(searchTerm) >= 0; // search term
    });
    return searchResult;
}

function getSearchInput() {
    let searchTerm = document.getElementById('searchInput').value;
    return searchTerm.toLowerCase();
}

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
    document.getElementById('bigView').classList.remove('d-none');
    document.getElementById('main').classList.add('main-bg');
    document.getElementById('body').style.overflow = 'hidden'
}

function renderBigCard(id) {
    document.getElementById('big-view-content').innerHTML = createBigCardContainer();
    document.getElementById('pokemon-big-header').innerHTML = loadBigCardHeaderTemplate(id);
    loadBigCardInfos(id);
    changeThemeBigView();
}

function getBigCardNavColor() {
    if(globalTheme == 'dark') {
        return 'white';
    } else {
        return 'black';
    }
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

function bigCardNavStyle(id) {
    document.getElementById('pokemon-info-main').innerHTML = loadPokemonNav(id);
}

function loadBigCardInfos(id) {
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-about');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    pokemonHeightWeight(id);
}

function pokemonHeightWeight(id) {
    let height = allPokemons[id]['height'] / 10;
    //height = height.toString(10);
    height = height.toFixed(1);
    height = height.replace(".", ",");
    
    let weight = allPokemons[id]['weight'] / 10;
    //weight = weight.toString(10);
    weight = weight.toFixed(1);
    weight = weight.replace(".", ",");

    document.getElementById('pokemon-info-container').innerHTML = loadBigCardInfosTemplate(id, height, weight);
}

function loadBigCardState(id) {
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-basisStats');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    let stats = allPokemons[id]['stats'];

    document.getElementById('pokemon-info-container').innerHTML = loadBigCardStateTemplate(stats);
}

function loadBigCardEvolution(id) {
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-evolution');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    getEvolutionChainData(id);
}

function createBigCardEvolution(id, evolution) {
    let evolutionContainer = document.getElementById('pokemon-info-container');
    evolutionContainer.innerHTML = '';

    if(evolution.length < 2) {
        evolutionContainer.innerHTML = `<h2>${allPokemons[id]['name']} hat keine Entwicklung!</h2>`;
    } else {
        let evolution1 = evolution[1];

        if(evolution1.length < 2) {
            for(x=0; x < (evolution.length - 1); x++) {
                let value1 = evolution[x][0];
                let value2 = evolution[x+1];
                let pokemon1 = searchByNameEn(value1['name']);
                
                if(value2.length > 1) {
                    // more then 1 Evolution1 (evee)
                    console.log('mehr als 1 Evolution gleiche Stufe')
                } else {
                    let pokemon2 = searchByNameEn(value2[0]['name']);
                    let trigger;

                    if(value2[0]['lvl']) {
                        trigger = `Lvl ${value2[0]['lvl']}`;
                    } else if(value2[0]['trigger'] == 'trade') {
                        trigger = 'Tausch';
                    } else if(value2[0]['item']) {
                        let stonename = getStoneName(value2[0]['item']);
                        trigger = `
                        <img src="../img/stones/${value2[0]['item']}.png" alt="${value2[0]['item']}" title="${stonename}" style="height: 2rem; object-fit: contain"></img>`;
                    }

                    evolutionContainer.innerHTML += `
                    <div style="width: 100%; display: flex; justify-content: space-between;">
                        <div><img src="${pokemon1[0]['sprites']['other']['home']['front_default']}" alt="${pokemon1[0]['name_en']} Picture" title="${pokemon1[0]['name']}" style="height: 7rem"></div>
                        <div style="display: flex; flex-direction: column; justify-content: center">
                            ${trigger}
                            <img src="../img/icons/arrow-right.png"></img>
                        </div>
                        <div><img src="${pokemon2[0]['sprites']['other']['home']['front_default']}" alt="${pokemon1[0]['name_en']}" title="${pokemon1[0]['name']}" style="height: 7rem"></div>
                    </div>`;
                }
            }
        }
    }
}

function getStoneName(stoneEn) {
    switch(stoneEn) {
        case 'fire-stone':
            return 'Feuerstein';
        break;
        case 'leaf-stone':
            return 'Blattstein';
        break;
        case 'moon-stone':
            return 'Mondstein';
        break;
        case 'thunder-stone':
            return 'Donnerstein';
        break;
        case 'water-stone':
            return 'Wasserstein';
        break;
    }
}

async function loadMoves(id) {
    let movesMachine = [];
    let movesLvlUp = [];
    let moveLvlUp; // help value to create movesLvlUp array

    let move = allPokemons[id]['moves'];
    for(x=0; x < move.length; x++) {
        if(move[x]["version_group_details"][0]["version_group"]['name'] == 'red-blue'){
            let moveNameDe = await getMoveNameDe(move, x);
            if(move[x]['version_group_details'][0]['move_learn_method']['name'] == 'machine') {
                movesMachine.push(moveNameDe);
            } else if(move[x]['version_group_details'][0]['move_learn_method']['name'] == 'level-up') {
                moveLvlUp = {'name': moveNameDe, 'lvl': move[x]['version_group_details'][0]['level_learned_at']};
                movesLvlUp.push(moveLvlUp);
            } else {
                console.log('ERROR Move ', moveNameDe);
            }
        }
    }
    movesLvlUp = sortByMax(movesLvlUp); // sort Level up moves from lowest to highest
    createBigCardMoves(movesMachine, movesLvlUp);
}

function sortByMax(array) {
    return array.sort(function (a, b) {
        return a.lvl - b.lvl
    });
}

async function getMoveNameDe(move, moveNr) {
    let url = move[moveNr]['move']['url'];
    let response = await fetch(url);
    moveName = await response.json();

    let moveNameDe = moveName['names'][4]['name']
    return moveNameDe
}

function loadBigCardMoves(id){
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-moves');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    loadMoves(id);
}

function createBigCardMoves(movesMachine, movesLvlUp) {
    document.getElementById('pokemon-info-container').innerHTML = createMovesArea();
    document.getElementById('pokemon-moves-lvl').innerHTML = '<h3>Levelaufstieg</h3>';

    for(x=0; x < movesLvlUp.length; x++) {
        document.getElementById('pokemon-moves-lvl').innerHTML += createMovesLvlUpTemplate(movesLvlUp[x]);
    }

    if(movesMachine.length > 0) {
        document.getElementById('pokemon-moves-machine').innerHTML = '<h3>Technische-/Versteckte Maschine</h3>';
        for(y=0; y < movesMachine.length; y++) {
        
            if(y < (movesMachine.length -1)) {
                document.getElementById('pokemon-moves-machine').innerHTML += createMovesMachineTemplate(movesMachine[y]);
            } else {
                document.getElementById('pokemon-moves-machine').innerHTML += createMovesMachineTemplateLast(movesMachine[y]);
            }
        }
    }
}

function closeBigView() {
    document.getElementById('bigView').classList.add('d-none');
    document.getElementById('main').classList.remove('main-bg');
    document.getElementById('body').style.overflow = ''
}

function stopClosing() {
    event.stopPropagation();
}

// ========== LOADING ==========
function closeLoading() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('main').classList.remove('main-bg');
    document.getElementById('body').style.overflow = '';
}

/* ========== FOOTER ========== */
function impressum() {
    let pokemonIndex = 0;
    openBigView();
    renderBigCard(pokemonIndex);
    document.getElementById('big-view-content').innerHTML = impressumTemplate();
    changeThemeImpressum();
}