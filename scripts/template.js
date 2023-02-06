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
    //infoCard.style.backgroundColor = '#454646';
    //infoCard.style.color = 'white';
}

function changeThemeToLight(navbar, body, themeTxt, footer) {
    navbar.style.backgroundColor = '#212529';
    body.style.backgroundColor = 'white';
    themeTxt.innerHTML = `<span onclick="changeTheme('dark')">dark mode</span>`;
    footer.style.backgroundColor = '#212529';
    //infoCard.style.backgroundColor = 'white';
    //infoCard.style.color = 'black';
}

function changeThemeBigViewToDark(bigViewContent, infoCard) {
    infoCard.style.backgroundColor = '#454646';
    infoCard.style.color = 'white';

    bigViewContent.style.backgroundColor = '#454646';
    bigViewContent.style.color = 'white';
}

function changeThemeBigViewToLight(bigViewContent, infoCard) {
    infoCard.style.backgroundColor = 'white';
    infoCard.style.color = 'black';

    bigViewContent.style.backgroundColor = 'white';
    bigViewContent.style.color = 'black';
}

function changeThemeImpressumToDark(impressumTel, impressumEMail) {
    impressumTel.style.color = 'yellow';
    impressumEMail.style.color = 'yellow';
}

function changeThemeImpressumToLight(impressumTel, impressumEMail) {
    impressumTel.style.color = '-webkit-link';
    impressumEMail.style.color = '-webkit-link';
}

// ========== BIG CARD ==========
function createBigCardContainer() {
    return `
        <div id="pokemon-big-header" class="pokemon-big"></div>
        <div id="pokemon-info-main"></div>`;
}

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

//style="color: ${color}; border-bottom: 2px solid #3f51b5;"
function loadPokemonNav(id) {
    return `
        <nav class="pokemon-info-nav">
            <table style="width: 100%; margin-left: 2%; margin-right: 2%">
                <tr>
                    <td id="info-headline-about" onclick="loadBigCardInfos(${id})"><b>Infos</b></td>
                    <td id="info-headline-basisStats" onclick="loadBigCardState(${id})"><b>Basiswerte</b></td>
                    <td id="info-headline-evolution" onclick="loadBigCardEvolution(${id})"><b>Entwicklungen</b></td>
                    <td id="info-headline-moves" onclick="loadBigCardMoves(${id})"><b>Attacken</b></td>
                </tr>
            </table>
        </nav>
        <div id="pokemon-info-container"></div>`;
}

function loadBigCardInfosTemplate(id, height, weight) {
    return `
        <table style="width: 60%">
            <tr>
                <td><b>Größe:</b></td>
                <td style="text-align: right;">${height} m</td>
            </tr>
            <tr>
                <td><b>Gewicht:</b></td>
                <td style="text-align: right;">${weight} kg</td>
            </tr>
        </table>
        <table style="width: 75%;">
            <tr>
                <td><b>Gattung:</b></td>
                <td style="text-align: center;">${allPokemons[id]['genus']}</td>
            </tr>
        </table>
        <br>
        <h3>Beschreibung</h3>
        <span style="font-size: 15px">${allPokemons[id]['description']}</span>`;
}

function loadBigCardStateTemplate(stats) {
    return `
        <table style="width: 100%;">
            <tr>
                <td>HP</td>
                <td style="text-align: center;"><b>${stats[0]['base_stat']}</b></td>
                <td><progress max="250" value="${stats[0]['base_stat']}"> ${stats[0]['base_stat']} </progress></td>
            </tr>
            <tr>
                <td>Angriff</td>
                <td style="text-align: center;"><b>${stats[1]['base_stat']}</b></td>
                <td><progress max="134" value="${stats[1]['base_stat']}"> ${stats[1]['base_stat']} </progress></td>
            </tr>
            <tr>
                <td>Verteidigung</td>
                <td style="text-align: center;"><b>${stats[2]['base_stat']}</b></td>
                <td><progress max="180" value="${stats[2]['base_stat']}"> ${stats[2]['base_stat']} </progress></td>
            </tr>
            <tr>
                <td>Spez. Angriff</td>
                <td style="text-align: center;"><b>${stats[3]['base_stat']}</b></td>
                <td><progress max="154" value="${stats[3]['base_stat']}"> ${stats[3]['base_stat']} </progress></td>
            </tr>
            <tr>
                <td>Spez. Verteidigung</td>
                <td style="text-align: center;"><b>${stats[4]['base_stat']}</b></td>
                <td><progress max="125" value="${stats[4]['base_stat']}"> ${stats[4]['base_stat']} </progress></td>
            </tr>
            <tr>
                <td>Spez. Initiative</td>
                <td style="text-align: center;"><b>${stats[5]['base_stat']}</b></td>
                <td><progress max="150" value="${stats[5]['base_stat']}"> ${stats[5]['base_stat']} </progress></td>
            </tr>
        </table>`;
}

function createMovesArea() {
    return `
        <div id="pokemon-moves">
            <div id="pokemon-moves-lvl"></div>
            <br>
            <div id="pokemon-moves-machine"></div>
        </div>`;
}

function createMovesLvlUpTemplate(moveLvlUp) {
    return `
        <table width="70%">
            <tr>
                <td>${moveLvlUp['name']}</td>
                <td style="text-align: right;">Level ${moveLvlUp['lvl']}</td>
            </tr>
        </table>`;
}

function createMovesMachineTemplate(moveMachine) {
    return `
        <span>${moveMachine} | </span>`;
}

function createMovesMachineTemplateLast(moveMachine) {
    return `
        <span>${moveMachine}</span>`;
}

/* ========== FOOTER ========== */
function impressumTemplate() {
    return `
        <div id="impressum" class="impressum card-body">
            <h2 class="card-title" style="margin-bottom: 10%;">IMPRESSUM</h2>
            <div class="answer-info" style="margin-bottom: 30%;">
                <p>Angaben gemäß § 5 TMG</p><p>Alexander Lovasz <br> 
                Gärtnerweg 1<br> 
                83329 Waging am See <br> <br></p>
                <p><strong>Kontakt:</strong> <br>
                Telefon: <a id="impressumTel" href="tel: 08681 4790 946">08681 4790 946</a><br>
                E-Mail: <a id="impressumEMail" href='mailto:general01@tuta.io'>general01@tuta.io</a></p>
            </div>
        </div>`;
}