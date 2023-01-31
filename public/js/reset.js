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
    // get URL values
    const url = window.location.search;
    const args = url.slice(1).split('&');
    
    const token = args[1].slice(6);
    const secret = args[2].slice(7);

    // hash password
    const res = await fetch('http://localhost/reset-encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            secret,
            token
        }),
    });

    // store hashed password
    const data = await(res.json());

    if (data.status === 'success') {
        resetPassword(data.hash, data.id);
    } else {
        console.log(data);
    }
}

function resetPassword(password, id) {
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