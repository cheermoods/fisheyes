import {getMedia} from './mediaDisplay.js';

// Incrémentation et Mise à jour des Likes
export function updateTotalLikes(media) {
    let totalLikes = 0;
    media.forEach(item => {
        totalLikes += item.likes;
    });

    document.getElementById("total-likes").innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;
}

// Gestion des Likes
export function handleLikesClick(likesContainer, item) {
    const media = getMedia();

    // Vérifie si le média est déjà liké ou non
    if (item.isLiked) {
        item.likes--; // Décrémente les likes
        item.isLiked = false; // Met l'état à "non liké"
    } else {
        item.likes++; // Incrémente les likes
        item.isLiked = true; // Met l'état à "liké"
    }

    // Met à jour l'affichage des likes
    likesContainer.innerHTML = `${item.likes} <i class="fas fa-heart"></i>`;
    updateTotalLikes(media); // Met à jour le total des likes
}
