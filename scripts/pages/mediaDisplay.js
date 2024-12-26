import { getPhotographerIdFromURL, getMediaByPhotographerId, getPhotographerById } from './dataManager.js';
import { triParCritere, updateSelectOptions } from './sortingManager.js';
import { handleLikesClick } from './likesManager.js';
import { openLightbox } from './lightbox.js';
import { updateTotalLikes } from './likesManager.js';

let media = [];
let photographer = null;

export const getMedia = () => media;

export function getPhotographer () {
    return photographer
}

export async function displayPhotographerMedia() {
    const id = getPhotographerIdFromURL();
    media = await getMediaByPhotographerId(id);
    photographer = await getPhotographerById(id);

    if (!photographer || !media) {
        console.error("Photographe ou médias non trouvés.");
        return;
    }
    

    const mediaSection = document.querySelector(".media_section");
    mediaSection.innerHTML = ""; // Réinitialise l'affichage des médias

    const select = document.getElementById("tri");
    const critere = select.value;
    const mediaTries = triParCritere(media, critere);

    // Mettre à jour les options visibles
    updateSelectOptions();

    let totalLikes = 0;

    mediaTries.forEach((item, index) => {
        totalLikes += item.likes;

        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement("img");
            mediaElement.src = `assets/photos/${photographer.name}/${item.image}`;
            mediaElement.alt = item.title || "Image du photographe";
        } else if (item.video) {
            mediaElement = document.createElement("video");
            mediaElement.src = `assets/photos/${photographer.name}/${item.video}`;
            mediaElement.controls = true;
        }

        mediaElement.tabIndex = 0; // Rendre accessible au clavier
        mediaElement.addEventListener("click", () => openLightbox(index, media, photographer));
        mediaElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") openLightbox(index, media, photographer);
        });

        const mediaInfo = document.createElement("div");
        mediaInfo.classList.add("media-info");

        const mediaTitle = document.createElement("span");
        mediaTitle.textContent = item.title || "Média sans titre";

        // Gestion des likes
        const likesContainer = document.createElement("span");
        likesContainer.classList.add("likes-container");
        likesContainer.innerHTML = `${item.likes} <i class="fas fa-heart"></i>`;
        likesContainer.tabIndex = 0;

        likesContainer.addEventListener("click", () => handleLikesClick(likesContainer, item));

        mediaInfo.appendChild(mediaTitle);
        mediaInfo.appendChild(likesContainer);
        mediaContainer.appendChild(mediaElement);
        mediaContainer.appendChild(mediaInfo);
        mediaSection.appendChild(mediaContainer);
    });

    // Met à jour le total des likes
    updateTotalLikes(mediaTries);

    document.getElementById("total-likes").innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;
    document.getElementById("price-per-day").textContent = `${photographer.price} € / jour`;
}

/* test 2
export function test2(cde) {
    console.log(cde)
}
*/
