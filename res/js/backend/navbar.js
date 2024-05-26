// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';

// Initialize Firebase App
const firebaseConfig = {
    apiKey: "AIzaSyBAROjb_hDFU7eOw_Es0oUkQSngnoL3M2k",
    authDomain: "project-store-uni.firebaseapp.com",
    projectId: "project-store-uni",
    storageBucket: "project-store-uni.appspot.com",
    messagingSenderId: "733337078593",
    appId: "1:733337078593:web:ff198355dd0b192b952fc0",
    measurementId: "G-RG7MSM6SST",
    databaseURL: "https://project-store-uni-default-rtdb.firebaseio.com/"
};
initializeApp(firebaseConfig);

// Initialize Firebase Auth and Realtime Database
const auth = getAuth();
const db = getDatabase();

const userNavItem = document.getElementById('userNavItem');
const userEmailSpan = document.getElementById('userEmail');
const adminPanelNavItem = document.getElementById('adminPanelNavItem'); // Get the admin panel nav item

// Cart items 

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        const ordersRef = ref(db, `orders/${userId}`);

        // Fetch the number of items in the cart
        fetchCartItemCount(ordersRef).then((count) => {
            // Update the cart item count badge
            document.getElementById('cartItemCount').textContent = count;
        });
    }
});

// Fetch the number of items in the cart
function fetchCartItemCount(ordersRef) {
    return new Promise((resolve) => {
        onValue(ordersRef, (snapshot) => {
            let count = 0;
            snapshot.forEach((orderSnapshot) => {
                const order = orderSnapshot.val();
                // Only count the order if its status is "incart"
                if (order.orderStatus === 'incart') {
                    count++;
                }
            });
            resolve(count);
        });
    });
}

// Check for authentication state changes
onAuthStateChanged(auth, (user) => {
    const userAuthLink = document.getElementById('userAuthLink');
    const productsButton = document.getElementById('productsButton');
    const cartButton = document.getElementById('cartButton');
    const ordersButton = document.getElementById('ordersButton');
    if (user) {
        // User is signed in, show email
        modal.style.display = "none";
        userEmailSpan.textContent = user.displayName || user.email;
        console.log(user.email + " is signed in !");
        userAuthLink.href = "/res/pages/usersection.html";
        // User is signed in, enable the buttons
        productsButton.classList.remove('disabled');
        cartButton.classList.remove('disabled');
        ordersButton.classList.remove('disabled');

        // Check if the user is an admin
        const userRef = ref(db, 'users/' + user.uid);
        get(userRef).then((snapshot) => {
            if (snapshot.exists() && snapshot.val().type === 'admin') {
                // User is an admin, show the admin panel nav item
                adminPanelNavItem.style.display = 'inside';
            } else {
                // User is not an admin, hide the admin panel nav item
                adminPanelNavItem.style.display = 'none';
            }
        }).catch((error) => {
            console.error("Error fetching user document:", error);
        });

    } else {
        // No user is signed in
        modal.style.display = "block";
        userEmailSpan.textContent = '';
        console.log("guest entered!");
        userAuthLink.href = "/res/pages/authentication.html";
        adminPanelNavItem.style.display = 'none';
        // No user is signed in, disable the buttons
        productsButton.classList.add('disabled');
        cartButton.classList.add('disabled');
        ordersButton.classList.add('disabled'); // Hide admin panel nav item for guests
    }
});
