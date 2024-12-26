import {getMedia, displayPhotographerMedia} from './mediaDisplay.js';
import { updateTotalLikes } from './likesManager.js';

let media = []

// Fonction de tri des médias
export function triParCritere(media, critere) {
    return media.sort((a, b) => {
        if (critere === "popularite") {
            return b.likes - a.likes; // Tri par nombre de likes décroissant
        } else if (critere === "date") {
            return new Date(b.date) - new Date(a.date); // Tri par date décroissant
        } else if (critere === "titre") {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return titleA.localeCompare(titleB, 'fr', { sensitivity: 'base' }); // Tri alphabétique
        }
    });
}

// Gestion du tri des médias
export function updateSelectOptions() {
    const select = document.getElementById("tri");
    const selectedValue = select.value;

    // Parcours les options et cache celle qui est sélectionnée
    Array.from(select.options).forEach(option => {
        if (option.value === selectedValue) {
            option.hidden = true; // Cache l'option sélectionnée dans le menu déroulant
        } else {
            option.hidden = false; // Affiche les autres options
        }
    });
}

// Fonction pour gérer le tri des médias
export function setupSorting() {
    const select = document.getElementById("tri");

    select.addEventListener("change", async () => {
        const selectedValue = select.value;
        media = getMedia();

        // Trier les médias selon le critère
        triParCritere(media, selectedValue);

        // Réafficher les médias après le tri
        await displayPhotographerMedia();

        // Mettre à jour les options du menu déroulant
        updateSelectOptions();

        // Mettre à jour le total des likes après le tri
        updateTotalLikes(media);
    });
}





