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


// Fonction pour afficher les médias du photographe
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

    /*
    media.forEach((item) => {
        //XXX condition video ou image

        const img = document.createElement("img");
        console.log(`assets/photos/${photographerName}/${item.image}`)
        img.setAttribute("src", `assets/photos/${photographerName}/${item.image}`);
        img.setAttribute("alt", item.title || "Image du photographe");
        mediaSection.appendChild(img);
    });
    */

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

async function displayPhotographerInfo() {
    const id = getPhotographerIdFromURL();
    const photographer = await getPhotographerById(id);
    
    if (photographer) {
        // Remplir les informations
        document.getElementById("photographer-name").textContent = photographer.name;
        document.getElementById("photographer-city").textContent = `${photographer.city}, ${photographer.country}`;
        document.getElementById("photographer-tagline").textContent = photographer.tagline;
        
        // Afficher la photo du photographe
        const picture = `assets/photos/IDPhotos/${photographer.portrait}`; // Assurez-vous que le chemin est correct
        document.getElementById("photographer-portrait").setAttribute("src", picture);
    } else {
        console.error("Photographe non trouvé");
    }
}

// Appeler la fonction pour afficher les informations du photographe
displayPhotographerInfo();

