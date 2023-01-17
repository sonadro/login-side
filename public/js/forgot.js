// db connection
const db = firebase.firestore();

// DOM
const newPasswordForm = document.querySelector('.newPassword');

// on submit
newPasswordForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const email = newPasswordForm.email.value;
    const username = newPasswordForm.brukernavn.value;
});