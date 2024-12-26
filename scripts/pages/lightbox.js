// lightbox.js

let currentImageIndex = 0;
const leftArrow = document.getElementById("arrowleft");
const rightArrow = document.getElementById("arrowright");

// Fonction pour ouvrir la lightbox
export function openLightbox(index, media, photographer) {
    if (!media || !photographer) {
        console.error("Media ou photographer non définis");
        return;  // Empêche l'exécution si les données sont manquantes
    }

    currentImageIndex = index; // Mettre à jour l'index de l'image actuelle

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxVideo = document.getElementById("lightbox-video");
    const lightboxTitle = document.getElementById("lightbox-title");

    const currentMedia = media[currentImageIndex]; // Récupère l'élément média actuel
    lightboxImage.style.display = "none";
    lightboxVideo.style.display = "none";

    // Afficher l'image ou la vidéo
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
    lightbox.style.display = "flex";

    // Gestion des touches clavier pour navigation
    const keydownHandler = (e) => handleLightboxKeydown(e, media, photographer);
    document.addEventListener("keydown", keydownHandler);

    // Ajout des gestionnaires pour les flèches gauche et droite
    leftArrow.onclick = () => changeImage(-1, media, photographer);
    rightArrow.onclick = () => changeImage(1, media, photographer);

    // Gérer le focus dans la lightbox
    trapFocus(lightbox);

    // Nettoyage de l'événement quand la lightbox est fermée
    closeLightboxButton.addEventListener("click", () => {
        closeLightbox(keydownHandler);
    });
}

// Fonction pour gérer les touches de navigation dans la lightbox
function handleLightboxKeydown(e, media, photographer) {
    if (e.key === "ArrowRight") {
        changeImage(1, media, photographer);
    } else if (e.key === "ArrowLeft") {
        changeImage(-1, media, photographer);
    } else if (e.key === "Escape") {
        closeLightbox();
    }
}

// Fonction pour changer d'image dans la lightbox
export function changeImage(direction, media, photographer) {
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
export function closeLightbox(keydownHandler) {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";

    // Supprimer l'écoute des touches de navigation
    document.removeEventListener("keydown", keydownHandler);
}


// Sélectionner le bouton de fermeture
const closeLightboxButton = document.querySelector(".lightbox .close");

// Maintenir le comportement du clic avec la souris
closeLightboxButton.addEventListener("click", closeLightbox);

// Ajouter un écouteur pour la touche "Enter" et "Espace" sur le bouton de fermeture
closeLightboxButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Empêche tout comportement par défaut
        closeLightbox(); // Ferme la lightbox
    }
});


