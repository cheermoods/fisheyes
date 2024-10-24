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

// Variables globales
let currentImageIndex = 0; // Pour gérer l'index de la lightbox
let media = []; // Pour stocker les médias
let photographer; // Pour stocker les informations du photographe

// Fonction pour ouvrir la lightbox
function openLightbox(imageSrc, index) {
    currentImageIndex = index; // Met à jour l'index de l'image actuelle
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    lightboxImage.src = imageSrc; // Définit la source de l'image
    lightbox.style.display = "flex"; // Affiche la lightbox
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none"; // Cache la lightbox
}

// Fonction pour changer d'image dans la lightbox
function changeImage(direction) {
    currentImageIndex += direction; // Change l'index de l'image
    // Boucle autour du tableau des médias
    if (currentImageIndex < 0) {
        currentImageIndex = media.length - 1; // Retourne à la dernière image si on est avant le premier
    } else if (currentImageIndex >= media.length) {
        currentImageIndex = 0; // Retourne à la première image si on dépasse la dernière
    }

    const lightboxImage = document.getElementById("lightbox-image");
    // Mets à jour l'image affichée selon le type de média
    if (media[currentImageIndex].image) {
        lightboxImage.src = `assets/photos/${photographer.name}/${media[currentImageIndex].image}`;
    } else if (media[currentImageIndex].video) {
        lightboxImage.src = `assets/photos/${photographer.name}/${media[currentImageIndex].video}`; // Si c'est une vidéo, vous pouvez l'implémenter ici
    }
}

// Fonction pour afficher les médias du photographe
async function displayPhotographerMedia() {
    const id = getPhotographerIdFromURL(); // Récupère l'ID du photographe
    media = await getMediaByPhotographerId(id); // Récupère les médias
    const mediaSection = document.querySelector(".media_section");
    mediaSection.innerHTML = ""; // Réinitialise la section

    photographer = await getPhotographerById(id); // Récupère les infos du photographe
    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    const select = document.getElementById("tri");
    const critere = select.value; // Récupère le critère de tri choisi par l'utilisateur

    const mediaTries = triParCritere(media, critere); // Trie les médias selon le critère choisi

    let totalLikes = 0; // Initialise le total des likes

    // Affiche chaque média trié
    mediaTries.forEach((item, index) => {
        totalLikes += item.likes; // Additionne les likes

        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement("img");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.image}`);
            mediaElement.setAttribute("alt", item.title || "Image du photographe");

            // Ajouter un événement pour ouvrir la lightbox au clic
            mediaElement.addEventListener("click", () => openLightbox(mediaElement.src, index));
        } else if (item.video) {
            mediaElement = document.createElement("video");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.video}`);
            mediaElement.setAttribute("controls", ""); // Ajoute des contrôles pour la vidéo
            mediaElement.setAttribute("alt", item.title || "Vidéo du photographe");
        }

        mediaContainer.appendChild(mediaElement);
        mediaSection.appendChild(mediaContainer);
    });

    // Mettre à jour les likes et le prix dans le rectangle
    document.getElementById("total-likes").innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;
    document.getElementById("price-per-day").textContent = `${photographer.price} € / jour`;
}

// Fonction pour afficher les informations du photographe
async function displayPhotographerInfo() {
    const id = getPhotographerIdFromURL(); // Récupère l'ID du photographe
    const photographerData = await getPhotographerById(id); // Récupère les infos du photographe

    if (photographerData) {
        // Remplit les éléments HTML avec les informations du photographe
        document.getElementById("photographer-name").textContent = photographerData.name;
        document.getElementById("photographer-city").textContent = `${photographerData.city}, ${photographerData.country}`;
        document.getElementById("photographer-tagline").textContent = photographerData.tagline;

        // Affiche la photo du photographe
        const picture = `assets/photos/IDPhotos/${photographerData.portrait}`;
        document.getElementById("photographer-portrait").setAttribute("src", picture);
        document.getElementById("photographer-portrait").setAttribute("alt", `Portrait de ${photographerData.name}`);
    } else {
        console.error("Photographe non trouvé");
    }
}

// Événements au chargement du document
document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.getElementById("tri");
    if (selectElement) {
        selectElement.addEventListener("change", displayPhotographerMedia); // Met à jour l'affichage quand le critère change
    }
    displayPhotographerMedia(); // Affiche les médias au chargement
    displayPhotographerInfo(); // Affiche les infos du photographe
});


/* mettre la condition si video balise video et si img balise img*/
/* media section inner html += */
/* rajouter des attribut aria sur les elements qui prennent le focus */
/* listner qui ecoute en permanence les claviers appui touche + les fleches */