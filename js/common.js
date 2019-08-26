var USER_KEY = sessionStorage.getItem("userkey");
var ADMIN_KEY = sessionStorage.getItem("userkey");
var ORGANIZER_KEY = sessionStorage.getItem("userkey");

//initialize firebase project
function initializeFirebaseProject() {
    // Your web app's Firebase configuration
    console.log("Begin firebase project initialization");

    var firebaseConfig = {
        apiKey: "AIzaSyBOI0UdMeBBKVZtw4VsSrn0iGiK8RdLRG0",
        authDomain: "dialog-internal-event-manager.firebaseapp.com",
        databaseURL: "https://dialog-internal-event-manager.firebaseio.com",
        projectId: "dialog-internal-event-manager",
        storageBucket: "dialog-internal-event-manager.appspot.com",
        messagingSenderId: "168700423082",
        appId: "1:168700423082:web:6ad2292be26320c9"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("After firebase project initialization");
}



//loads when user clicks on SignOut
function signOutUser() {
    console.log("Begin SignOut");

    if (confirm("Are You sure want to sign out ??")) {
        firebase.auth().signOut().then(function() {
            //isUserLoggedIn();
            alert("Signing out .....");

            // This function will attempt to remove a cookie from all paths.
            var pathBits = location.pathname.split('/');
            var pathCurrent = ' path=';

            // do a simple pathless delete first.
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

            for (var i = 0; i < pathBits.length; i++) {
                pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
                document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
            }

            sessionStorage.clear();
            console.log("Signing out");

            window.location.href = "Login.html";

        }).catch(function(error) {
            alert("Error Occured when signing out!! . err -> " + error);
        });
    }
}



//checks whether user is logged at At Start( when logging in)
function isUserLoggedInAtStart() {
    console.log("begins login check");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user is logged in");
            var userObj = firebase.auth().currentUser;
            var dbRef = firebase.database().ref(); // Reference to realtime db

            var emailRef = dbRef.child('users').orderByChild('email').equalTo(userObj.email);
            emailRef.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    // key will be "ada" the first time and "alan" the second time
                    var userkey = childSnapshot.key;
                    sessionStorage.setItem("userkey", userkey);
                    // childData will be the actual contents of the child
                    var childData = childSnapshot.child('email').val();
                    console.log("userkey -->> " + userkey);
                });
            });

            var adminRef = dbRef.child('admins').orderByKey();
            adminRef.once('value').then(function(adminSnapshot) {
                adminSnapshot.forEach(function(childAdminSnapshot) {
                    var currentAdmin = childAdminSnapshot.key;
                    console.log(currentAdmin);
                    if (sessionStorage.getItem("userkey") == currentAdmin) {
                        sessionStorage.setItem("organizerKey", "null");
                        sessionStorage.setItem("adminKey", currentAdmin);
                        window.location.href = "adminDashboard.html";
                    }
                    return 0;
                });
            });

            var organizerRef = dbRef.child('organizers').orderByKey();
            organizerRef.once('value').then(function(adminSnapshot) {
                adminSnapshot.forEach(function(childOrganizerSnapshot) {
                    var currentOrganizer = childOrganizerSnapshot.key;
                    console.log(currentOrganizer);
                    if (sessionStorage.getItem("userkey") == currentOrganizer) {
                        sessionStorage.setItem("adminKey", "null");
                        sessionStorage.setItem("organizerKey", currentOrganizer);
                        window.location.href = "organizerDashboard.html";
                    }
                    return 0;
                });
            });

        } else {
            // No user is signed in.
            console.log("user is  not logged in");
            if (window.location.pathname != '/ITP_DialogEventManager_WebApp/html/Login.html') {
                console.log("user is not logged in " + window.location.pathname);

                window.location.href = "Login.html";
            }
        }
    });

}


/*checks whether user is logged at At ayntime. if the current page is not specific for
    the user, will redirect to login.html*/
function isUserLoggedIn() {
    console.log("begins login check");

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // No user is signed in.
            console.log("user is  not logged in");
            if (window.location.pathname != '/ITP_DialogEventManager_WebApp/html/Login.html') {
                console.log("user is not logged in " + window.location.pathname);

                window.location.href = "Login.html";
            }
        }
    });

}

//to check whether the user is an admin
function isUserAnAdmin() {
    if (sessionStorage.getItem("adminKey") === sessionStorage.getItem("userkey")) {
        console.log("An admin is logged in");
        return true;
    } else {
        return false;
    }
}

//to check whether the user is an organizer
function isUserAnOrganizer() {
    if (sessionStorage.getItem("organizerKey") === sessionStorage.getItem("userkey")) {
        console.log("An Organizer is logged in");
        return true;
    } else {
        return false;
    }
}