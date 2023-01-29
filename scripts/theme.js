// ========== DARK / LIGHT MODE ==========
function changeTheme(theme) {
    let navbar = document.getElementById('navbar');
    let body = document.getElementById('body');
    let themeTxt = document.getElementById('siteTheme');
    let footer = document.getElementById('footer');

    changeThemeQuery(theme, navbar, body, themeTxt, footer);

    globalTheme = theme;
}

function changeThemeBigView() {
    let bigViewContent = document.getElementById('big-view-content');
    let infoCard = document.getElementById('pokemon-info-main');
    
    if(globalTheme == 'dark'){
        changeThemeBigViewToDark(bigViewContent, infoCard);
    } else {
        changeThemeBigViewToLight(bigViewContent, infoCard);
    }
}

function changeThemeImpressum() {
    let impressumTel = document.getElementById('impressumTel');
    let impressumEMail = document.getElementById('impressumEMail');

    if(globalTheme == 'dark'){
        changeThemeImpressumToDark(impressumTel, impressumEMail);
    } else {
        changeThemeImpressumToLight(impressumTel, impressumEMail);
    }
}

function changeThemeQuery(theme, navbar, body, themeTxt, footer) {
    if(theme == 'dark'){
        changeThemeToDark(navbar, body, themeTxt, footer);
        save('dark');
    } else {
        changeThemeToLight(navbar, body, themeTxt, footer);
        save('light');
    }
}