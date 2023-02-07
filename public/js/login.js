// DOM
const loginForm = document.querySelector('.login');

// send to backend
async function sendToBackend(userPw, dbUserPw) {
    // hash password
    const res = await fetch('http://localhost/login-encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userPw,
            dbUserPw
        }),
    });

    // store hashed password
    const data = await(res.json());

    if (data.match) {
        console.log('Du har nå logget inn.');
        location.href = 'http://localhost/bruker';
    } else {
        console.log('Feil passord.');
    }
}

// login
async function login(user) {
    // get from db
    db.collection('brukere').get().then(snapshot => {
        let success = false;
        snapshot.docs.forEach(doc => {
            const docData = doc.data();

            if (user.username === docData.username) {
                success = true;
                sendToBackend(user.password, docData.password);
            };
        });

        if (!success) {
            console.log('Kunne ikke finne brukeren din.');
        }
    }).catch(err => console.error(err));
}

// on submit
loginForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const username = loginForm.brukernavn.value;
    const password = loginForm.passord.value;

    let user = {
        username,
        password
    };

    login(user);
});