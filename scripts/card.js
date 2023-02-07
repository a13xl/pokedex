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
    opnLoadingCard();
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-about');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    pokemonHeightWeight(id);
    closeLoading();
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
    opnLoadingCard();
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-basisStats');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    let stats = allPokemons[id]['stats'];

    document.getElementById('pokemon-info-container').innerHTML = loadBigCardStateTemplate(stats);
    closeLoading();
}

async function loadBigCardEvolution(id) {
    opnLoadingCard();
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-evolution');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    await getEvolutionChainData(id);
    closeLoading();
}

function createBigCardEvolution(id, evolution) {
    let evolutionContainer = document.getElementById('pokemon-info-container');
    evolutionContainer.innerHTML = '';

    if(evolution.length < 2) {
        evolutionContainer.innerHTML = `<h2 style="margin-top: -80px; text-align: center;">${allPokemons[id]['name']} hat keine Entwicklung!</h2>`;
    } else {
        for(x=0; x < (evolution.length - 1); x++) {
            let value1 = evolution[x][0];
            let value2 = evolution[x+1];
            let pokemon1 = searchByNameEn(value1['name']);

            getEvolution1Numbers(value2, pokemon1, evolutionContainer);
        }
    }
}

function getEvolution1Numbers(value2, pokemon1, evolutionContainer) {
    if(value2.length > 1) { // Pokemon have more than 1 Evolution 1
        evolutionContainer.innerHTML = createBasisSpecialTemplate(pokemon1);

        evolutionSpecialLoop(value2);

    } else {
        let pokemon2 = searchByNameEn(value2[0]['name']);
        let trigger = getEvolutionTrigger(value2, '0');

        evolutionContainer.innerHTML += createEvolutionsTemplate(pokemon1, pokemon2, trigger);
    }
}

function evolutionSpecialLoop(value2) {
    for(x=0; x < value2.length; x++) {
        let pokemon2 = searchByNameEn(value2[x]['name']);
        let trigger = getEvolutionTrigger(value2, x);

        document.getElementById('evolution1Container').innerHTML += createEvolution1SpecialTemplate(pokemon2, trigger);
    }
}

function getEvolutionTrigger(value2, x) {
    if(value2[x]['lvl']) {
        trigger = `Lvl ${value2[x]['lvl']}`;
    } else if(value2[x]['trigger'] == 'trade') {
        trigger = 'Tausch';
    } else if(value2[x]['item']) {
        let stonename = getStoneName(value2[x]['item']);
        trigger = `
        <img src="../img/stones/${value2[x]['item']}.png" alt="${value2[x]['item']}" title="${stonename}" style="height: 2rem; object-fit: contain"></img>`;
    }
    return trigger;
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

async function loadBigCardMoves(id){
    opnLoadingCard();
    bigCardNavStyle(id);

    let navInfo = document.getElementById('info-headline-moves');
    navInfo.style.color = getBigCardNavColor();
    navInfo.style.borderBottom = '2px solid #3f51b5';

    await loadMoves(id);
    closeLoading();
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