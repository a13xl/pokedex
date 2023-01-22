let currentPokemon; // Array with Pokemon infos
let currentName;    // Pokemon Name
let currentDescription; // Pokemon description in german

async function getPokemon() {
    for(x=1; x <= 151; x++) {
        loadArea(x);
        await loadPokemon(x);
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

    await loadSpecies();
    renderPokemon();
    pokemonType();
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
            currentName = text['name'];
            break;
        }
    }

}

function loadDescription(currentSpecies) {
    for(i=0; i < currentSpecies['flavor_text_entries'].length; i++) {
        let text = currentSpecies['flavor_text_entries'][i];
        if(text['language']['name'] == 'de'){
            currentDescription = text['flavor_text'];
            break;
        }
    }
}

function renderPokemon() {
    let nr = currentPokemon['id'];
    document.getElementById('pokemon-name-' + nr).innerHTML = currentName;
    document.getElementById('pokemon-id-' + nr).innerHTML = `#${nr}`
    document.getElementById('pokemon-img-' + nr).src = currentPokemon['sprites']['other']['home']['front_default'];
    
}

function pokemonType() {
    let types = currentPokemon['types'];

    for(i=0; i<types.length ;i++) {
        let type = types[i]['type']['name'];
        let typeColor = getTypeColor(type);

        document.getElementById('pokemon-type-' + currentPokemon['id']).innerHTML += loadTypeIcon(type, i);
        let typeIcon = document.getElementById('pokemon-type-icon-' + currentPokemon['id'] + '-' + i);

        typeIcon.style.backgroundColor = typeColor;
        typeIcon.style.boxShadow = `0 0 20px ${typeColor}`;
    }
    document.getElementById('pokedex-type-' + currentPokemon['id']).style.backgroundImage = `url(./img/backgrounds/background_${types[0]['type']['name']}.png)`;
}

function getTypeColor(type) {
    switch(type) {
        case 'fire':
            return '#ff331a'
            break;
        case 'grass':
            return '#62bc5a'
            break;
        case 'poison':
            return '#9553cd'
            break;
    }
}
