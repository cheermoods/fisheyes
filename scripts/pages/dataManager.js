export function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

export async function getPhotographerById(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    return data.photographers.find(photographer => photographer.id == id) || null;
}

export async function getMediaByPhotographerId(id) {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();

    // Filtre les médias en fonction de l'ID
    return data.media.filter(item => item.photographerId == id);
}
