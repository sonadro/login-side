// db connection
const db = firebase.firestore();

// DOM
const newPasswordForm = document.querySelector('.newPassword');

async function sendToBackend(uName, uEmail) {
    // send data
    const res = await fetch('http://localhost/forgot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uName,
            uEmail
        }),
    });
}

// on submit
newPasswordForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    const email = newPasswordForm.email.value;
    const username = newPasswordForm.brukernavn.value;

    db.collection('brukere').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();

            if (email === data.email) {
                console.log('email matches');

                if (username === data.username) {
                    console.log('username matches');

                    // send mail
                    sendToBackend(username, email);
                };
            };
        });
    });
});