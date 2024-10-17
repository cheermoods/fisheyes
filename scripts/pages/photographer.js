// pupetter - firebase

//Mettre le code JavaScript lié à la page photographer.html
//Design patern A VOIR

/*
async function getPhotographerById(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    // Trouve le photographe avec l'ID donné
    for (let i = 0; i < data.photographers.length; i++) {
      if (data.photographers[i].id === id) {
        return data.photographers[i];
      }
    }
    return null; 
}
*/

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

/* Fonction pour récupérer le nom du photographe basé sur l'ID
async function getPhotographerById(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    
    // Trouve le photographe avec l'ID donné
    const photographer = data.photographers.find(photographer => photographer.id == id);

    // Vérifie si le photographe a été trouvé
    // return photographer ? photographer.name : null;
    if (photographer) {
        return photographer.name;
    } else {
        return null;
    } 
}
*/

async function getPhotographerById(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    
    // Trouve le photographe avec l'ID donné
    const photographer = data.photographers.find(photographer => photographer.id == id);
    return photographer ? photographer : null; // Retourner l'objet photographe complet
}


/* Fonction pour afficher les médias du photographe
async function displayPhotographerMedia() {
    const id = getPhotographerIdFromURL(); // Récupère l'ID du photographe depuis l'URL
    
    // Vérifie si l'ID est présent dans l'URL
    if (!id) {
        window.location.href = "index.html"; // Redirige vers la page d'accueil si l'ID est absent
        return;
    }
  
    // Récupère les médias du photographe avec l'ID
    const media = await getMediaByPhotographerId(id);
    
    // Récupère le nom du photographe pour construire le chemin des images
    const photographerName = await getPhotographerById(id);
    if (!photographerName) {
        window.location.href = "index.html"; // Redirige vers la page d'accueil si le photographe n'est pas trouvé
        return;
    }
    
    // Sélectionne la section où les médias seront affichés
    const mediaSection = document.querySelector(".media_section");
    if (!mediaSection) {
        console.error("La section '.media_section' est absente du document.");
        return;
    }

    
    media.forEach((item) => {
        //XXX condition video ou image

        const img = document.createElement("img");
        console.log(`assets/photos/${photographerName}/${item.image}`)
        img.setAttribute("src", `assets/photos/${photographerName}/${item.image}`);
        img.setAttribute("alt", item.title || "Image du photographe");
        mediaSection.appendChild(img);
    });
    

    media.forEach((item) => {
        let mediaElement;
    
        // Créer un conteneur pour l'image/vidéo et les informations
        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");
    
        if (item.image) {
            // Si c'est une image
            mediaElement = document.createElement("img");
            mediaElement.setAttribute("src", `assets/photos/${photographerName.name}/${item.image}`);
            mediaElement.setAttribute("alt", item.title || "Image du photographe");
        } else if (item.video) {
            // Si c'est une vidéo
            mediaElement = document.createElement("video");
            mediaElement.setAttribute("src", `assets/photos/${photographerName.name}/${item.video}`);
            mediaElement.setAttribute("controls", ""); // Pour afficher les contrôles de la vidéo
            mediaElement.setAttribute("alt", item.title || "Vidéo du photographe");
        }
    
        // Ajouter le média au conteneur
        mediaContainer.appendChild(mediaElement);

        // Créer un conteneur pour le titre et les likes
        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");

        // Créer un élément pour le titre
        const titleElement = document.createElement("p");
        titleElement.textContent = item.title || "Titre inconnu";

        // Créer un élément pour le nombre de likes
        const likesElement = document.createElement("p");
        likesElement.innerHTML = `${item.likes || 0} <i class="fas fa-heart like-icon"></i>`;

        // Ajouter le titre et les likes au conteneur
        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(likesElement);

        // Ajouter le conteneur d'informations au conteneur principal
        mediaContainer.appendChild(infoContainer);

        // Ajouter le conteneur au mediaSection
        mediaSection.appendChild(mediaContainer)
    });    
}

// Appelle la fonction pour afficher les médias
displayPhotographerMedia();
*/

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

// Fonction pour ouvrir la lightbox avec l'image
function openLightbox(imageSrc) {
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

// Fonction pour afficher les médias du photographe
async function displayPhotographerMedia() {
    const id = getPhotographerIdFromURL(); // Récupère l'ID du photographe
    const media = await getMediaByPhotographerId(id); // Récupère les médias du photographe
    const mediaSection = document.querySelector(".media_section");
    mediaSection.innerHTML = ""; // Vide la section avant d'afficher de nouveaux médias

    const photographer = await getPhotographerById(id); // Récupère les infos du photographe
    if (!photographer) {
        console.error("Photographe non trouvé");
        return; // Quitte si le photographe n'est pas trouvé
    }

    const select = document.getElementById("tri");
    const critere = select.value; // Récupère le critère de tri choisi par l'utilisateur

    const mediaTries = triParCritere(media, critere); // Trie les médias selon le critère choisi

    // Affiche chaque média trié
    mediaTries.forEach((item) => {
        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");
        
        let mediaElement; // Déclare la variable pour le média
        // Crée un élément image ou vidéo selon le type
        if (item.image) {
            mediaElement = document.createElement("img");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.image}`);
            mediaElement.setAttribute("alt", item.title || "Image du photographe");

            // Ajouter un événement pour ouvrir la lightbox au clic
            mediaElement.addEventListener("click", () => openLightbox(mediaElement.src));
        } else if (item.video) {
            mediaElement = document.createElement("video");
            mediaElement.setAttribute("src", `assets/photos/${photographer.name}/${item.video}`);
            mediaElement.setAttribute("controls", ""); // Ajoute des contrôles pour la vidéo
            mediaElement.setAttribute("alt", item.title || "Vidéo du photographe");
        }

        mediaContainer.appendChild(mediaElement); // Ajoute le média au conteneur

        // Crée un conteneur pour le titre et les likes
        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");
        
        const titleElement = document.createElement("p");
        titleElement.textContent = item.title || "Titre inconnu"; // Affiche le titre

        const likesElement = document.createElement("p");
        likesElement.innerHTML = `${item.likes || 0} <i class="fas fa-heart like-icon"></i>`; // Affiche le nombre de likes
        
        // Ajoute le titre et les likes au conteneur d'infos
        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(likesElement);
        
        mediaContainer.appendChild(infoContainer); // Ajoute le conteneur d'infos au conteneur du média
        mediaSection.appendChild(mediaContainer); // Ajoute le conteneur du média à la section principale
    });
}

// Fonction pour afficher les informations du photographe
async function displayPhotographerInfo() {
    const id = getPhotographerIdFromURL(); // Récupère l'ID du photographe
    const photographer = await getPhotographerById(id); // Récupère les infos du photographe
    
    if (photographer) {
        // Remplit les éléments HTML avec les informations du photographe
        document.getElementById("photographer-name").textContent = photographer.name;
        document.getElementById("photographer-city").textContent = `${photographer.city}, ${photographer.country}`;
        document.getElementById("photographer-tagline").textContent = photographer.tagline;
        
        // Affiche la photo du photographe
        const picture = `assets/photos/IDPhotos/${photographer.portrait}`;
        document.getElementById("photographer-portrait").setAttribute("src", picture);
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