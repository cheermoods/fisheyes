function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function validateForm() {
    let valid = true;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Réinitialiser les messages d'erreur
    document.getElementById("first-name-error").textContent = "";
    document.getElementById("last-name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("message-error").textContent = "";

    // Validation du prénom
    if (firstName.length < 2) {
        document.getElementById("first-name-error").textContent = "Le prénom doit contenir au moins 2 caractères.";
        valid = false;
    }

    // Validation du nom
    if (lastName.length < 2) {
        document.getElementById("last-name-error").textContent = "Le nom doit contenir au moins 2 caractères.";
        valid = false;
    }

    // Validation de l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("email-error").textContent = "Veuillez entrer un email valide.";
        valid = false;
    }

    // Validation du message
    if (message.length < 10) {
        document.getElementById("message-error").textContent = "Le message doit contenir au moins 10 caractères.";
        valid = false;
    }

    return valid;
}

function submitForm() {
    if (validateForm()) {
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Affichage dans la console
        console.log("Formulaire soumis avec les informations suivantes :");
        console.log("Prénom : " + firstName);
        console.log("Nom : " + lastName);
        console.log("Email : " + email);
        console.log("Message : " + message);

        closeModal(); // Ferme le modal après soumission
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    const closeButton = document.getElementById("close-button");
    const contactModal = document.getElementById("contact_modal");
    const contactForm = document.getElementById("contact-form");

    contactModal.style.display = "none"; // Le modal est initialement caché

   

    // Fermer le modal lorsque le bouton "X" est cliqué
    closeButton.addEventListener("click", () => {
        contactModal.style.display = "none";
    });

    // Fermer le modal si l'utilisateur clique à l'extérieur du formulaire
    window.addEventListener("click", (event) => {
        if (event.target === contactModal) {
            closeModal();
        }
    });

    // Soumettre le formulaire
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        submitForm();
    });
});

// Fonction pour afficher le modal
/*
function displayModal() {
    document.getElementById("contact_modal").style.display = "block";
}


// Fonction pour fermer le modal
function closeModal() {
    document.getElementById("contact_modal").style.display = "none";
}
    */

// Ajout d'un écouteur d'événement sur le bouton de fermeture
document.getElementById("close-button").addEventListener("click", closeModal);
