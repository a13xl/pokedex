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