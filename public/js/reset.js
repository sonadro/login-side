const db = firebase.firestore();
const form = document.querySelector('.newPw');

form.addEventListener('submit', e => {
    e.preventDefault();

    const password = form.password.value;
    const repeatPw = form.repeat.value;

    if (password === repeatPw) {
        sendToBackend(password);
    } else {
        console.log('passwords don\'t match');
    }
});

async function sendToBackend(password) {
    // hash password
    const res = await fetch('http://localhost/reset-encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password
        }),
    });

    // store hashed password
    const data = await(res.json());

    if (data.status === 'success') {
        resetPassword(data.hash);
    } else {
        console.log(data);
    }
}

function resetPassword(password) {
    const url = window.location.href;
    const id = url.slice(url.indexOf('?id=') + 4);

    let dbUser;
    db.collection('brukere').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const docId = doc.id;

            if (id === docId) {
                dbUser = data;
            }
        });
        
        if (dbUser) {
            let uploadUser = dbUser;

            uploadUser.password = password;

            db.collection('brukere').doc(id).set(uploadUser);
            console.log('reset password');
        } else {
            return 'Error: Couldn\'t find user.';
        }
    })
}