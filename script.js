/* ==========================================
   MEMORY ARCHIVE
   Navigation + Firebase Realtime Chat
========================================== */


/* ==========================================
   FIREBASE SETUP
========================================== */

const firebaseConfig = {
    apiKey: "AIzaSyBOQltdK0HB-6_7ML2VtRuUHAc9sws6v_E",
    authDomain: "memory-archive-38ac8.firebaseapp.com",
    projectId: "memory-archive-38ac8",
    storageBucket: "memory-archive-38ac8.firebasestorage.app",
    messagingSenderId: "176924998768",
    appId: "1:176924998768:web:f16645c410c121c0b5c8b5",
    measurementId: "G-S9ZS5Y23M0",
    databaseURL: "https://memory-archive-38ac8-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();


/* ==========================================
   PAGES
========================================== */

const pageOne = document.querySelector(".page-one");
const pageTwo = document.querySelector(".page-two");
const pageFour = document.querySelector(".page-four");
const pageFive = document.querySelector(".page-five");
const pageSix = document.querySelector(".page-six");
const pageSeven = document.querySelector(".page-seven");
const pageEight = document.querySelector(".page-eight");


/* ==========================================
   BUTTONS
========================================== */

const begin = document.querySelector(".begin");
const continueOne = document.querySelector(".continueOne");
const continueFour = document.querySelector(".continueFour");
const continueFive = document.querySelector(".continueFive");
const continueSix = document.querySelector(".continueSix");
const continueSeven = document.querySelector(".continueSeven");


/* ==========================================
   DOODLE
========================================== */

const doodle = document.querySelector(".doodle");


/* ==========================================
   PAGE TRANSITION
========================================== */

function showPage(currentPage, nextPage) {

    currentPage.style.opacity = "0";
    currentPage.style.pointerEvents = "none";

    nextPage.style.opacity = "1";
    nextPage.style.pointerEvents = "auto";
}


/* ==========================================
   LANDING PAGE
========================================== */

begin.addEventListener("click", function () {

    let start = null;
    const duration = 3200;

    function animate(timestamp) {

        if (!start) start = timestamp;

        const progress = Math.min(
            (timestamp - start) / duration,
            1
        );

        const x =
            -35 +
            Math.sin(progress * Math.PI * 4) * 18;

        const y =
            progress * 140;

        const rotation =
            Math.sin(progress * Math.PI * 3) * 12;

        doodle.style.transform =
            `translate(${x}px, ${y}px) rotate(${rotation}deg)`;


        if (progress > 0.8) {

            doodle.style.opacity =
                1 - ((progress - 0.8) / 0.2);
        }


        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            doodle.style.transform = "";
            doodle.style.opacity = "1";

            showPage(pageOne, pageTwo);
        }
    }

    requestAnimationFrame(animate);
});


/* ==========================================
   BEFORE YOU CONTINUE
========================================== */

continueOne.addEventListener("click", function () {

    showPage(pageTwo, pageFour);

});


/* ==========================================
   THANK YOU
========================================== */

continueFour.addEventListener("click", function () {

    showPage(pageFour, pageFive);

});


/* ==========================================
   CREDITS
========================================== */

continueFive.addEventListener("click", function () {

    showPage(pageFive, pageSix);

});


/* ==========================================
   STORY PAGE 1
========================================== */

continueSix.addEventListener("click", function () {

    showPage(pageSix, pageSeven);

});


/* ==========================================
   STORY PAGE 2
========================================== */

continueSeven.addEventListener("click", function () {

    showPage(pageSeven, pageEight);

});


/* ==========================================
   CHAT ELEMENTS
========================================== */

const herResponse =
    document.querySelector("#herResponse");

const chatMessages =
    document.querySelector("#chatMessages");

const autosaveStatus =
    document.querySelector("#autosaveStatus");

const sendMessage =
    document.querySelector("#sendMessage");


/* ==========================================
   CURRENT USER
========================================== */

let currentUser = null;


/* ==========================================
   FIREBASE LOGIN
========================================== */

auth.signInAnonymously()
    .then(function () {

        console.log("Firebase anonymous login successful.");

    })
    .catch(function (error) {

        console.error(
            "Firebase authentication failed:",
            error
        );

        autosaveStatus.textContent =
            "Chat connection failed.";
    });


/* ==========================================
   AUTH STATE
========================================== */

auth.onAuthStateChanged(function (user) {

    if (!user) {

        currentUser = null;

        return;
    }

    currentUser = user;

    console.log(
        "Connected as:",
        currentUser.uid
    );

    autosaveStatus.textContent =
        "Connected ✓";

    startRealtimeChat();
});


/* ==========================================
   DATABASE REFERENCE
========================================== */

const messagesRef =
    db.ref("messages");


/* ==========================================
   REALTIME CHAT LISTENER
========================================== */

function startRealtimeChat() {

    messagesRef.on(
        "value",
        function (snapshot) {

            const messages =
                snapshot.val() || {};

            displayMessages(messages);

        },
        function (error) {

            console.error(
                "Realtime database error:",
                error
            );

            autosaveStatus.textContent =
                "Chat connection error.";
        }
    );
}


/* ==========================================
   DISPLAY MESSAGES
========================================== */

function displayMessages(messages) {

    chatMessages.innerHTML = "";


    Object.entries(messages).forEach(
        function ([messageId, message]) {

            const bubble =
                document.createElement("div");

            bubble.className =
                "chat-message";
           
            if (
             currentUser &&
             message.sender === currentUser.uid
            ) {
             bubble.classList.add("sent");
             bubble.style.alignSelf = "flex-end";
            } else {
             bubble.classList.add("received");
             bubble.style.alignSelf = "flex-start";
            }
            /* --------------------------------
               MESSAGE TEXT
            -------------------------------- */

            const text =
                document.createElement("div");

            text.textContent =
                message.text || "";


            /* --------------------------------
               TIME
            -------------------------------- */

            const time =
                document.createElement("small");

            time.className =
                "message-time";


            if (message.timestamp) {

                const date =
                    new Date(message.timestamp);

                time.textContent =
                    date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });
            }


            /* --------------------------------
               DELETE BUTTON
            -------------------------------- */

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-message";

            deleteButton.textContent =
                "delete";


            deleteButton.addEventListener(
                "click",
                function () {

                    db.ref(
                        "messages/" + messageId
                    ).remove()
                    .catch(function (error) {

                        console.error(
                            "Delete failed:",
                            error
                        );
                    });

                }
            );


            /* --------------------------------
               BUILD MESSAGE
            -------------------------------- */

            bubble.appendChild(text);

            bubble.appendChild(time);

            bubble.appendChild(deleteButton);

            chatMessages.appendChild(bubble);
        }
    );


    /* --------------------------------
       SCROLL TO BOTTOM
    -------------------------------- */

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ==========================================
   SEND MESSAGE
========================================== */

function sendChatMessage() {

    const message =
        herResponse.value.trim();


    if (!message) {
        return;
    }


    if (!currentUser) {

        autosaveStatus.textContent =
            "Connecting...";

        return;
    }


    if (message.length > 2000) {

        autosaveStatus.textContent =
            "Message is too long.";

        return;
    }


    messagesRef.push({

        text: message,

        sender: currentUser.uid,

        timestamp: firebase.database.ServerValue.TIMESTAMP

    })
    .then(function () {

        herResponse.value = "";

        localStorage.removeItem(
            "memoryArchiveDraft"
        );

        autosaveStatus.textContent =
            "Sent ✓";

    })
    .catch(function (error) {

        console.error(
            "Message could not be sent:",
            error
        );

        autosaveStatus.textContent =
            "Couldn't send message.";
    });
}


/* ==========================================
   SEND BUTTON
========================================== */

sendMessage.addEventListener(
    "click",
    sendChatMessage
);


/* ==========================================
   ENTER TO SEND
========================================== */

herResponse.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendChatMessage();
        }
    }
);


/* ==========================================
   AUTOSAVE DRAFT
========================================== */

herResponse.addEventListener(
    "input",
    function () {

        localStorage.setItem(
            "memoryArchiveDraft",
            herResponse.value
        );

        autosaveStatus.textContent =
            "Draft saved ✓";
    }
);


/* ==========================================
   RESTORE DRAFT
========================================== */

const savedDraft =
    localStorage.getItem(
        "memoryArchiveDraft"
    );


if (savedDraft) {

    herResponse.value =
        savedDraft;
}
