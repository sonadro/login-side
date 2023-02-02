// db connection
const db = firebase.firestore();

// DOM
const newPasswordForm = document.querySelector('.newPassword');

async function sendToBackend(uEmail, id) {
    // send data
    const res = await fetch('http://localhost/forgot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uEmail,
            id
        }),
    });

    const data = await(res.json());

    if (data.status === 'success') {
        db.collection('brukere').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const docData = doc.data();

                if (uEmail === docData.email) {
                    docData.token = data.token;

                    try {
                        db.collection('brukere').doc(id).set(docData);
                        console.log('token upload');
                    } catch (err) {
                        console.error(err);
                    }
                }
            })
        })
    }
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
            const id = doc.id;

            if (email === data.email) {
                console.log('email matches');

                if (username === data.username) {
                    console.log('username matches');

                    // send mail
                    sendToBackend(email, id);
                };
            };
        });
    });
});