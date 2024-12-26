export function photographerTemplate(photographer) {
  const { name, portrait, id, city, tagline, price } = photographer; // Destructuration

  // Chemin vers les portraits
  const picture = `../../assets/photos/IDPhotos/${portrait}`;

  // URL page du photographe
  const photographerPageUrl = `photographer.html?id=${id}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const link = document.createElement("a");
    link.setAttribute("href", photographerPageUrl);
    
    // Conteneur de l'image de profil
    const profilePictureDiv = document.createElement("div");
    profilePictureDiv.classList.add("profile-picture");

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);
    profilePictureDiv.appendChild(img);

    // Nom du photographe
    const h2 = document.createElement("h2");
    h2.textContent = name;

    // Ville du photographe
    const cityElement = document.createElement("p");
    cityElement.classList.add("city");
    cityElement.textContent = city;

    // Tagline du photographe
    const taglineElement = document.createElement("p");
    taglineElement.classList.add("tagline");
    taglineElement.textContent = tagline;

    // Ajouter le prix par jour (après la tagline)
    const priceElement = document.createElement("p");
    priceElement.classList.add("price");  // Ajoute une classe pour le style
    priceElement.textContent = `${price}€ / jour`;  // Utilisation de price ici

    // Ajout des éléments au lien et à l'article
    link.appendChild(profilePictureDiv);
    link.appendChild(h2);
    link.appendChild(cityElement);
    link.appendChild(taglineElement);
    link.appendChild(priceElement); // Le prix est maintenant après la tagline
    article.appendChild(link);

    return article;
  }

  return { name, picture, getUserCardDOM };
}
