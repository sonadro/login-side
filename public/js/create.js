const createUserForm = document.querySelector('.new-user');

createUserForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const email = createUserForm.email.value;
    const userName = createUserForm.brukernavn.value;
    const password = createUserForm.passord.value;
    const repeatPw = createUserForm.gjenta.value;

    console.log(email, userName, password, repeatPw);
});