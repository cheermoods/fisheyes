import { displayPhotographerInfo } from './photographerInfo.js';
import { displayPhotographerMedia } from './mediaDisplay.js';
import { setupSorting, updateSelectOptions } from './sortingManager.js';
import { updateTotalLikes } from './likesManager.js';

// import { test2 } from './mediaDisplay.js'

// ===========================
// Section Initialisation
// ===========================
let media = []; // Liste des médias

// Initialisation des fonctionnalités
async function init() {
    // Charger et afficher les informations du photographe
    await displayPhotographerInfo();

    // Charger les médias et afficher les médias du photographe
    media = await displayPhotographerMedia();

    // Initialiser la gestion du tri
    setupSorting(media, async (sortedMedia) => {
        let media = sortedMedia; // Mettre à jour la liste triée
        await displayPhotographerMedia(media); // Afficher les médias triés

    // Mettre à jour le total des likes lors du chargement initial
    updateTotalLikes(media);
    }); 
}

// Lancer l'initialisation
init();

// ===========================
// Section Form
// ===========================

// Afficher le contenu du formulaire dans la console
function logFormData(event) {
    const form = event.target;
    const formData = new FormData(form);
    for (let [name, value] of formData.entries()) {
        console.log(`${name}: ${value}`);
    }
}

// ===========================
// Section Sorting Manager
// ===========================

// Tri des Médias
document.getElementById("tri").addEventListener("change", async () => {
    await displayPhotographerMedia();
    updateSelectOptions(); // Met à jour les options après le changement
});

/* test fonction paramettre
function test() {
    const abc = 1;
    test2(abc)
}
test()
*/

