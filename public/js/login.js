// db connection
const db = firebase.firestore();

// DOM
const loginForm = document.querySelector('.login');

// on submit
loginForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const username = loginForm.brukernavn.value;
    const password = loginForm.passord.value;

    // check info with db
    db.collection('brukere').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (username === data.username) {
                console.log('username match');
                if (password === data.password) {
                    console.log('LOGGED IN!');
                }
            }
        });
    }).catch(err => console.error(err));
});