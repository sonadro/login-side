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
    
    const token = args[0].slice(6);
    const secret = args[1].slice(7);

    // hash password & verify token
    const res = await fetch('http://localhost/reset-encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            token,
            secret
        }),
    });

    // store hashed password
    const data = await(res.json());

    if (data.status === 'success') {
        resetPassword(data.hash, token);
    } else {
        console.log(data);
    }
}

function resetPassword(password, token) {
    let dbUser;
    let id;
    db.collection('brukere').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();

            if (data.token === token) {
                dbUser = data;
                id = doc.id;
                console.log('User found');
            }
        });
        
        if (dbUser) {
            let uploadUser = dbUser;

            uploadUser.password = password;
            uploadUser.token = '';

            db.collection('brukere').doc(id).set(uploadUser);
            console.log('reset password');
        } else {
            console.error('Couldn\'t find token.');
        }
    })
}