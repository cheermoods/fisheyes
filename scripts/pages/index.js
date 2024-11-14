import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {

  let response = await fetch("data/photographers.json");
  // position relative et absolu (img , a)

  // response.json()
  const data = await response.json(); // transfomrer en objet
  const photographers = data.photographers; //

  /*
  // Ceci est un exemple de données pour avoir un affichage de photographes de test
  let photographers = [
    {
      name: "Ma data test",
      id: 1,
      city: "Paris",
      country: "France",
      tagline: "Ceci est ma data test",
      price: 400,
      portrait: "account.png",
    },
    {
      name: "Autre data test",
      id: 2,
      city: "Londres",
      country: "UK",
      tagline: "Ceci est ma data test 2",
      price: 500,
      portrait: "account.png",
    },
  ]; 
  */

  console.log(photographers);

  // et bien retourner le tableau photographers seulement une fois récupéré
  return {
    photographers
  };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  //photographers.forEach(function(photographer) {
  photographers.forEach((photographer) => {
    // const photographerModel = photographerTemplate(data);
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
    console.log(photographer);
  });
}

async function init() {
  // Récupère les datas des photographes

  // const data = await fetch("http://localhost/miniprojets/fisheye/data/photographers.json");

  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
