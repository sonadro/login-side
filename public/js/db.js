// sleep
const sleep = function(ms) {
    const oldDate = Date.now();
    let newDate = Date.now();

    while(newDate - oldDate < ms) {
        newDate = Date.now();
    }
}

// get values
const getFromBackend = async function() {
    const res = await fetch('http://localhost/request-db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parcel: 'test',
        }),
    });

    // store hashed password
    const data = await(res.json());

    if (data.err) {
        console.error(data.err);
    }

    const config = {
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        databaseURL: data.databaseURL,
        projectId: data.projectId,
        storageBucket: data.storageBucket,
        messagingSenderId: data.messagingSenderId
    };
    
    firebase.initializeApp(config);

    globalThis.db = firebase.firestore();
}

getFromBackend();