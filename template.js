function loadPokedexEelement(pokemonNr) {
    return `
        <div id="pokedex-card-bg-${pokemonNr}" class="pokedex-card-bg" onclick="showPokemonBig(${pokemonNr})">
            <div id="pokedex-type-${pokemonNr}" class="pokedex-type">
                <div>
                    <span id="pokemon-name-${pokemonNr}" class="pokemon-name"></span>
                    <span id="pokemon-id-${pokemonNr}" class="pokemon-id"></span>
                </div>
                <img id="pokemon-img-${pokemonNr}" class="pokemon-img">
                <div id="pokemon-type-${pokemonNr}" class="pokemon-type"></div>
            </div>
        </div>`;
}

function loadTypeIcon(type, typNr) {
    return `
        <div id="pokemon-type-icon-${currentPokemon['id']}-${typNr}" class="pokemon-type-icon">
            <img style="height: 25px;" src="./img/type_icons/${type}.png" alt="${type} icon" onclick="showSameType('${type}')"></img>
        </div>`;
}

function getTypeColorIcon(type) {
    switch(type) {
        case 'fire':
            return ['linear-gradient(to bottom, #c42424,#f37878,#c42424)','#c42424', 'Feuer'] //#ff331a
        break;
        case 'grass':
            return ['linear-gradient(to bottom, #0D4A0E,#2cd732,#0D4A0E)', '#0D4A0E', 'Pflanze'] //#62bc5a
        break;
        case 'poison':
            return ['linear-gradient(to bottom, #732270,#BE84BD,#732270)', '#732270', 'Gift'] //#9553cd
        break;
        case 'bug':
            return ['linear-gradient(to bottom, #9CA264,#EDF5A4,#9CA264)', '#9CA264', 'Käfer'] //#b4c621
        break;
        case 'flying':
            return ['linear-gradient(to bottom, #CE62D0,#f8b8f9,#CE62D0)', '#CE62D0', 'Flug'] //#9cb6e4
        break;
        case 'water':
            return ['linear-gradient(to bottom, #05599e,#349df3,#05599e)', '#05599e', 'Wasser'] //#05599e
        break;
        case 'normal':
            return ['linear-gradient(to bottom, #adadad,#ffffff,#adadad)', '#adadad', 'Normal'] //#cecece
        break;
        case 'electric':
            return ['linear-gradient(to bottom, #FCC916,#fbf292,#FCC916)', '#FCC916', 'Elektro'] //#e8c545
        break;
        case 'ground':
            return ['linear-gradient(to bottom, #B18557,#ffd29f,#B18557)', '#B18557', 'Boden'] //#c09d31
        break;
        case 'fairy':
            return ['linear-gradient(to bottom, #e588a8,#ffdbe7,#e588a8)', '#e588a8', 'Fee'] //#f6a5f6
        break;
        case 'fighting':
            return ['linear-gradient(to bottom, #472716,#9E7E6E,#472716)', '#472716', 'Kampf'] //#9a451c
        break;
        case 'psychic':
            return ['linear-gradient(to bottom, #cf0e51,#fd89b2,#cf0e51)', '#cf0e51', 'Psycho'] //#9e45c5
        break;
        case 'rock':
            return ['linear-gradient(to bottom, #804529,#d1a188,#804529)', '#804529', 'Gestein'] //#9f8e73
        break;
        case 'steel':
            return ['linear-gradient(to bottom, #7d7d7f,#b5b5b7,#7d7d7f)', '#7d7d7f', 'Stahl'] //#7d7d7f
        break;
        case 'ice':
            return ['linear-gradient(to bottom, #77d3e5,#b4f3ff,#77d3e5)', '#77d3e5', 'Eis'] //#77d3e5
        break;
        case 'ghost':
            return ['linear-gradient(to bottom, #1F0D36,#771CA2,#1F0D36)', '#1F0D36', 'Geist'] //#5c4585
        break;
        case 'dragon':
            return ['linear-gradient(to bottom, #a96de5,#d1a3ff,#a96de5)', 'Drache'] //#a0841f
        break;
    }
}

// ========== DARK / LIGHT MODE ==========
function changeThemeToDark(navbar, body, themeTxt, footer) {
    navbar.style.backgroundColor = '#454646';
    body.style.backgroundColor = '#212529';
    themeTxt.innerHTML = `<span onclick="changeTheme('light')">light mode</span>`;
    footer.style.backgroundColor = '#454646';
}

function changeThemeToLight(navbar, body, themeTxt, footer) {
    navbar.style.backgroundColor = '#212529';
    body.style.backgroundColor = 'white';
    themeTxt.innerHTML = `<span onclick="changeTheme('dark')">dark mode</span>`;
    footer.style.backgroundColor = '#212529';
}

// ========== BIG CARD ==========
function loadBigCardHeaderTemplate(id) {
    return `
        <div class="pokemon-big-headline">
            <div>
                <div><h1 style="margin: 0;">${allPokemons[id]['name']}</h1>
                    <div id="pokemon-big-type"></div>
                </div>
            </div>
            <div style="display: flex; align-items: center; font-size: 25px;"><b>#${allPokemons[id]['id']}</b></div>
        </div>

        <div class="pokemon-big-img">
            <img src="${allPokemons[id]['sprites']['other']['home']['front_default']}" alt="" style="height: 265px;">
        </div>`;
}

function loadBigCardTypesTemplate(id, i, color) {
    return `
        <div class="pokemon-big-type" style="background: ${color};"><b>${allPokemons[id]['types'][i]['type']['name']}</b></div>`;
}

function loadPokemonNav(id) {
    return `
        <nav class="pokemon-info-nav">
            <table style="width: 100%; margin-left: 2%; margin-right: 2%">
                <tr>
                    <td id="info-headline-about" onclick="loadBigCardInfos(${id})" style="color: black; border-bottom: 2px solid #3f51b5;"><b>Infos</b></td>
                    <td id="info-headline-basisStats" onclick="loadBigCardState(${id})"><b>Basiswerte</b></td>
                    <td id="info-headline-evolution" onclick="loadBigCardEvolution(${id})"><b>Entwicklungen</b></td>
                    <td id="info-headline-moves" onclick="loadBigCardMoves(${id})"><b>Attacken</b></td>
                </tr>
            </table>
        </nav>
        <div id="pokemon-info-container" style="margin: 4%;"></div>`;
}

function loadBigCardInfosTemplate(id, height, weight) {
    return `
        <table style="width: 50%">
            <tr>
                <td>Größe:</td>
                <td style="text-align: right;">${height} m</td>
            </tr>
            <tr>
                <td>Gewicht:</td>
                <td style="text-align: right;">${weight} kg</td>
            </tr>
        </table>
        <br>
        <h3>Beschreibung</h3>
        <span style="font-size: 15px">${allPokemons[id]['description']}</span>`;
}