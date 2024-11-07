// Variables globales
let currentImageIndex = 0; // Pour gérer l'index de la lightbox
let media = []; // Pour stocker les médias
let photographer; // Pour stocker les informations du photographe

// Fonction pour récupérer l'ID du photographe depuis l'URL
function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Récupère l'ID depuis l'URL
}

// Fonction pour récupérer les médias du photographe par ID
async function getMediaByPhotographerId(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    
    // Filtre les médias en fonction de l'ID
    return data.media.filter(item => item.photographerId == id);
}

// Fonction pour récupérer les informations du photographe par ID
async function getPhotographerById(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    
    // Trouve le photographe avec l'ID donné
    return data.photographers.find(photographer => photographer.id == id) || null; // Retourne le photographe ou null
}

// Fonction pour trier les médias selon un critère
function triParCritere(media, critere) {
    return media.sort((a, b) => {
        if (critere === "popularite") {
            return b.likes - a.likes; // Tri par nombre de likes (décroissant)
        } else if (critere === "date") {
            return new Date(b.date) - new Date(a.date); // Tri par date (décroissant)
        } else if (critere === "nom") {
            return a.title.localeCompare(b.title); // Tri par nom (alphabétique)
        }
    });
}

// Fonction pour ouvrir la lightbox
function openLightbox(index) {
    currentImageIndex = index; // Mettre à jour l'index de l'image actuelle

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxVideo = document.getElementById("lightbox-video");
    const lightboxTitle = document.getElementById("lightbox-title");

    const currentMedia = media[currentImageIndex]; // Récupère l'élément média actuel
    lightboxImage.style.display = "none";
    lightboxVideo.style.display = "none";

    // Afficher l'image ou la vidéo selon le type de média
    if (currentMedia.image) {
        lightboxImage.src = `assets/photos/${photographer.name}/${currentMedia.image}`;
        lightboxImage.style.display = "block";
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
    } else if (currentMedia.video) {
        lightboxVideo.src = `assets/photos/${photographer.name}/${currentMedia.video}`;
        lightboxVideo.style.display = "block";
    }

    lightboxTitle.textContent = currentMedia.title || "Média sans titre";
    lightbox.style.display = "flex"; // Afficher la lightbox

    // Ajout de l'écoute des touches de navigation
    document.addEventListener("keydown", handleLightboxKeydown);

    // Gérer le focus à l'intérieur de la lightbox
    trapFocus(lightbox);
}

// Fonction pour gérer les touches de navigation dans la lightbox
function handleLightboxKeydown(e) {
    if (e.key === "ArrowRight") {
        changeImage(1);
    } else if (e.key === "ArrowLeft") {
        changeImage(-1);
    } else if (e.key === "Escape") {
        closeLightbox();
    }
}

// Fonction pour piéger le focus à l'intérieur de la lightbox
function trapFocus(lightbox) {
    const focusableElements = lightbox.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"]), input, textarea, select');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Gérer le tab
    lightbox.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    // Optionnel : Mettre le focus sur le premier élément de la lightbox lors de l'ouverture
    firstElement.focus();
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";

    // Supprimer l'écoute des touches de navigation pour la lightbox
    document.removeEventListener("keydown", handleLightboxKeydown);
}

// Sélectionner le bouton de fermeture
const closeLightboxButton = document.querySelector(".lightbox .close");

// Ajouter un écouteur pour la touche "Enter" et "Espace" sur le bouton de fermeture
closeLightboxButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Empêche tout comportement par défaut
        closeLightbox(); // Ferme la lightbox
    }
});

// Maintenir le comportement du clic avec la souris
closeLightboxButton.addEventListener("click", closeLightbox);

// Fonction pour changer d'image dans la lightbox
function changeImage(direction) {
    currentImageIndex += direction;

    // Boucle autour du tableau des médias
    if (currentImageIndex < 0) {
        currentImageIndex = media.length - 1;
    } else if (currentImageIndex >= media.length) {
        currentImageIndex = 0;
    }

    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxVideo = document.getElementById("lightbox-video");
    const lightboxTitle = document.getElementById("lightbox-title");

    const currentMedia = media[currentImageIndex];

    // Réinitialiser l'affichage
    lightboxImage.style.display = "none";
    lightboxVideo.style.display = "none";

    if (currentMedia.image) {
        lightboxImage.src = `assets/photos/${photographer.name}/${currentMedia.image}`;
        lightboxImage.style.display = "block";
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
    } else if (currentMedia.video) {
        lightboxVideo.src = `assets/photos/${photographer.name}/${currentMedia.video}`;
        lightboxVideo.style.display = "block";
    }

    // Met à jour le titre
    lightboxTitle.textContent = currentMedia.title || "Média sans titre";
}

// Fonction pour afficher les médias du photographe
// Fonction pour afficher les médias du photographe
async function displayPhotographerMedia() {
    const id = getPhotographerIdFromURL();
    media = await getMediaByPhotographerId(id);
    const mediaSection = document.querySelector(".media_section");
    mediaSection.innerHTML = "";

    photographer = await getPhotographerById(id);
    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    const select = document.getElementById("tri");
    const critere = select.value;
    const mediaTries = triParCritere(media, critere);

    let totalLikes = 0;

    // Affiche chaque média trié
    mediaTries.forEach((item, index) => {
        totalLikes += item.likes;

        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement("img");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.image}`);
            mediaElement.setAttribute("alt", item.title || "Image du photographe");
        } else if (item.video) {
            mediaElement = document.createElement("video");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.video}`);
            mediaElement.setAttribute("controls", "");
        }

        // Rendre chaque média accessible au clavier
        mediaElement.setAttribute("tabindex", "0");
        mediaElement.addEventListener("click", () => openLightbox(index));
        mediaElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") openLightbox(index);
        });

        const mediaInfo = document.createElement("div");
        mediaInfo.classList.add("media-info");

        // Nom de la photo et likes
        const mediaTitle = document.createElement("span");
        mediaTitle.textContent = item.title || "Média sans titre";
        mediaInfo.appendChild(mediaTitle);

        const likesContainer = document.createElement("span");
        likesContainer.classList.add("likes-container");
        likesContainer.innerHTML = `${item.likes} <i class="fas fa-heart"></i>`;
        likesContainer.setAttribute("tabindex", "0");

        // Incrémenter les likes au clic
        likesContainer.addEventListener("click", () => {
            item.likes++; // Incrémente les likes pour ce média
            likesContainer.innerHTML = `${item.likes} <i class="fas fa-heart"></i>`; // Met à jour l'affichage des likes
            updateTotalLikes(); // Met à jour le total des likes
        });

        mediaInfo.appendChild(likesContainer);
        mediaContainer.appendChild(mediaElement);
        mediaContainer.appendChild(mediaInfo);
        mediaSection.appendChild(mediaContainer);
    });

    document.getElementById("total-likes").innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;
    document.getElementById("price-per-day").textContent = `${photographer.price} € / jour`;
}

// Fonction pour mettre à jour le total des likes
function updateTotalLikes() {
    let totalLikes = 0;
    media.forEach(item => {
        totalLikes += item.likes;
    });

    document.getElementById("total-likes").innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;
}


// Fonction pour afficher les informations du photographe
async function displayPhotographerInfo() {
    const id = getPhotographerIdFromURL();
    photographer = await getPhotographerById(id);
    
    const photographerName = document.querySelector('#photographer-name');
    const photographerCity = document.querySelector('#photographer-city');
    const photographerTagline = document.querySelector('#photographer-tagline');
    const photographerPortrait = document.querySelector('#photographer-portrait');

    if (photographer) {
        photographerName.textContent = photographer.name;
        photographerCity.textContent = `${photographer.city}, ${photographer.country}`; // Ajoutez la ville
        photographerTagline.textContent = photographer.tagline;
        photographerPortrait.src = `assets/photos/IDPhotos/${photographer.portrait}`;
    }
}

// Afficher le contenu du formulaire dans la console
function logFormData(event) {
    const form = event.target;
    const formData = new FormData(form);
    for (let [name, value] of formData.entries()) {
        console.log(`${name}: ${value}`);
    }
}

// Appel des fonctions pour afficher les informations du photographe et ses médias
displayPhotographerInfo();
displayPhotographerMedia();

// Gestion du tri des médias
document.getElementById("tri").addEventListener("change", async (event) => {
    await displayPhotographerMedia();
});

