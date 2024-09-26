export function photographerTemplate(photographer) {
  const { name, portrait, id } = photographer; // destructuration

  // Chemin vers les portraits
  const picture = `assets/photos/IDPhotos/${portrait}`;

  // URL page du photographe
  const photographerPageUrl = `photographer.html?id=${id}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const link = document.createElement("a");
    link.setAttribute("href", photographerPageUrl);
    
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);
    
    const h2 = document.createElement("h2");
    h2.textContent = name;

    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(link);

    return article;
  }
  return { name, picture, getUserCardDOM };
}


