function loadPokedexEelement(pokemonNr) {
    return `
        <div id="pokedex-type-${pokemonNr}" class="pokedex-type">
            <div>
                <span id="pokemon-name-${pokemonNr}" class="pokemon-name"></span>
                <span id="pokemon-id-${pokemonNr}" class="pokemon-id"></span>
            </div>
            <img id="pokemon-img-${pokemonNr}" class="pokemon-img">
            <div id="pokemon-type-${pokemonNr}" class="pokemon-type"></div>
        </div>`;
}

function loadTypeIcon(type, typNr) {
    return `
        <div id="pokemon-type-icon-${currentPokemon['id']}-${typNr}" class="pokemon-type-icon">
            <img style="height: 30px;" src="./img/type_icons/${type}.png" alt="${type} icon"></img>
        </div>`;
}