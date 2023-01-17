const loginForm = document.querySelector('.login');

loginForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const username = loginForm.brukernavn.value;
    const password = loginForm.passord.value;

    console.log(username, password);
});