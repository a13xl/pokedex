async function getEvolutionChainData(id) {
    let currentSpecies = await loadSpecies((id + 1));
    let url = currentSpecies['evolution_chain']['url'];
    let response = await fetch(url);
    let currentEvolution = await response.json();

    loadEvolutions(id, currentEvolution);
}

function loadEvolutions(id, evolutionChain) {
    let evolution;

    evolution = getEvolutions(evolutionChain);
console.log(evolution);
    createBigCardEvolution(id, evolution);
}

function getEvolutions(evolutionChain) {
    let evolution = [];
    let data;

    // Basis Evolution
    data = getBasisEvolution(evolutionChain);
    if(data.length > 0){
        evolution.push(data);
    }
    data = null;

    // Evolution 1
    data = getEvolution1(evolutionChain);
    if(data.length > 0){
        evolution.push(data);
    }
    data = null;

    // Evolution 2
    data = getEvolution2(evolutionChain);
    if(data.length > 0){
        evolution.push(data);
    }
    data = null;

    return evolution;
}

function getBasisEvolution(evolutionChain) {
    let evolutionStep = [];
    let basis = getEvolution(evolutionChain['chain']);
    let boolean = checkEvolutionExist(basis['name']);

    if(basis && boolean === Boolean(true)) {
        evolutionStep.push(basis);
    }
    return evolutionStep;;
}

function getEvolution1(evolutionChain) {
    let evolutionStep = [];
    let evols1;

    try {
        evols1 = evolutionChain['chain']['evolves_to']; // [0]
    } catch {}

    if(evols1) {
        for(y=0; y < evols1.length; y++) {
            let evols1Start = evols1[y];
            let evols1End = evols1Start['evolution_details'][0];
            let evolution1 = getEvolution(evols1Start, evols1End);
            boolean = checkEvolutionExist(evolution1['name']);

            if(boolean === Boolean(true)) {
                evolutionStep.push(evolution1);
            }
        }
    }

    return evolutionStep;
}

function getEvolution2(evolutionChain) {
    let evolutionStep = [];
    let evols2;

    try {
        evols2 = evolutionChain['chain']['evolves_to'][0]['evolves_to'];
    } catch {}

    if(evols2) {
        for(y=0; y < evols2.length; y++) {
            let evols2Start = evols2[y];
            let evols2End = evols2Start['evolution_details'][0];
            
            let evolution2 = getEvolution(evols2Start, evols2End);
            boolean = checkEvolutionExist(evolution2['name']);

            if(boolean === Boolean(true)) {
                evolutionStep.push(evolution2);
            }
        }
    }
    return evolutionStep;
}

function checkEvolutionExist(name) {
    var hasMatch =false;

    for (var index = 0; index < allPokemons.length; ++index) {
        var pokemon = allPokemons[index];
        if(pokemon['name_en'] == name){
            hasMatch = true;
            break;
        }
    }

    return hasMatch;
}

function getEvolution(evolutionChainStart, evolutionChainEnd) {
    let name;
    let trigger;
    let lvl;
    let item;

    try {
        name = evolutionChainStart['species']['name'];
    } catch {}

    // falls name nicht in 
    try {
        trigger = evolutionChainEnd['trigger']['name'];
    } catch {}

    try {
        lvl = evolutionChainEnd['min_level'];
    } catch {}

    try {
        item = evolutionChainEnd['item']['name'];
    } catch {}

    var myJson = fillEvolutionTrigger(name, trigger, lvl, item);
    return myJson;
}