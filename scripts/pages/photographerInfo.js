import { getPhotographerIdFromURL, getPhotographerById } from './dataManager.js';

let photographer; // Informations sur le photographe

// Fonction pour afficher les informations du photographe
export async function displayPhotographerInfo() {
    const id = getPhotographerIdFromURL();
    photographer = await getPhotographerById(id);

    if (photographer) {
        const photographerName = document.querySelector('#photographer-name');
        const photographerCity = document.querySelector('#photographer-city');
        const photographerTagline = document.querySelector('#photographer-tagline');
        const photographerPortrait = document.querySelector('#photographer-portrait');

        // Mettre à jour les éléments du DOM
        photographerName.textContent = photographer.name;
        photographerCity.textContent = `${photographer.city}, ${photographer.country}`;
        photographerTagline.textContent = photographer.tagline;
        photographerPortrait.src = `assets/photos/IDPhotos/${photographer.portrait}`;
        photographerPortrait.alt = `Portrait de ${photographer.name}`;

        // Affiche l'image une fois qu'elle est complètement chargée
        photographerPortrait.onload = () => {
            photographerPortrait.style.display = 'block'; 
        }

    } else {
        console.error("Aucun photographe trouvé avec cet ID.");
    }
}

