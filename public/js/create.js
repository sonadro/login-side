// db connection
const db = firebase.firestore();

// DOM
const createUserForm = document.querySelector('.new-user');

async function encrypt(input) {
    const res = await fetch('http://localhost/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parcel: input
        }),
    });
    const data = await(res.json());

    return await data.pass;
}

async function register(user) {
    // hash password
    const res = await fetch('http://localhost/create-encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userPw: user.password,
        }),
    });

    // store hashed password in user object
    const data = await(res.json());
    
    const uploadUser = {
        email: user.email,
        username: user.username,
        password: data.password
    }

    let mailExists = false;
    let userExists = false;
    db.collection('brukere').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();

            if (user.username === data.username) {
                userExists = true;
                console.log(data, 'exists');
            };

            if (user.email === data.email) {
                mailExists = true;
                console.log(data, 'exists');
            };
            
        });

        // check if username & email already exists in database
        if (userExists) {
            console.log('username exists');
        } else {
            console.log('user existn\'t');
            
        }
    
        if (mailExists) {
            console.log('mail exists');
        } else {
            console.log('mail existn\'t');
        }
    
        if (!mailExists && !userExists) {
            db.collection('brukere').add(uploadUser).then(() => {
                console.log('added user:', user);
            }).catch(err => console.error(err));
        }
    }).catch(err => console.error(err));
}

// on submit
createUserForm.addEventListener('submit', e => {
    // prevent refresh
    e.preventDefault();

    // get form values
    let email = createUserForm.email.value;
    let username = createUserForm.brukernavn.value;
    let password = createUserForm.passord.value;
    let repeatPw = createUserForm.gjenta.value;

    if (password.length < 2) {
        console.log('Invalid password');
    } else if (password === repeatPw) {
        let user = {
            email,
            username,
            password
        };

        register(user);
    } else {
        console.log('Your passwords aren\'t matching');
    }
});