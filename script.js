/* ==========================================
   MEMORY ARCHIVE
   Navigation
========================================== */
// ---------- Pages ----------
const pageOne = document.querySelector(".page-one");
const pageTwo = document.querySelector(".page-two");
const pageThree = document.querySelector(".page-three");
const pageFour = document.querySelector(".page-four");
const pageFive = document.querySelector(".page-five");
const pageSix = document.querySelector(".page-six");
const pageSeven = document.querySelector(".page-seven");
const pageEight = document.querySelector(".page-eight");
// ---------- Buttons ----------
const begin = document.querySelector(".begin");
const continueOne = document.querySelector(".continueOne");
const archiveBegin = document.querySelector(".archiveBegin");
const continueFour = document.querySelector(".continueFour");
const continueFive = document.querySelector(".continueFive");
const continueSix = document.querySelector(".continueSix");
const continueSeven = document.querySelector(".continueSeven");
// ---------- Doodle ----------
const doodle = document.querySelector(".doodle");
// ---------- Page Transition ----------
function showPage(currentPage, nextPage) {
    currentPage.style.opacity = "0";
    currentPage.style.pointerEvents = "none";
    nextPage.style.opacity = "1";
    nextPage.style.pointerEvents = "auto";
}
// ---------- Landing Page ----------
begin.addEventListener("click", function () {
    let start = null;
    const duration = 3200;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min(
            (timestamp - start) / duration,
            1
        );
        const x = -35 + Math.sin(progress * Math.PI * 4) * 18;
        const y = progress * 140;
        const rotation = Math.sin(progress * Math.PI * 3) * 12;
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
// ---------- Before You Continue ----------
continueOne.addEventListener("click", function () {
    showPage(pageTwo, pageThree);
});
// ---------- Archive ----------
archiveBegin.addEventListener("click", function () {
    showPage(pageThree, pageFour);
});
// ---------- Thank You ----------
continueFour.addEventListener("click", function () {
    showPage(pageFour, pageFive);
});
// ---------- Credits ----------
continueFive.addEventListener("click", function () {
    showPage(pageFive, pageSix);
});
// ---------- Story: Page 1 ----------
continueSix.addEventListener("click", function () {
    showPage(pageSix, pageSeven);
});
// ---------- Story: Page 2 ----------
continueSeven.addEventListener("click", function () {
    showPage(pageSeven, pageEight);
});
// ---------- Phase 2 Chat ----------
const herResponse = document.querySelector("#herResponse");
const chatMessages = document.querySelector("#chatMessages");
const autosaveStatus = document.querySelector("#autosaveStatus");
const sendMessage = document.querySelector("#sendMessage");
let chatHistory = JSON.parse(
    localStorage.getItem("memoryArchiveChat") || "[]"
);
function displayMessages() {
    chatMessages.innerHTML = "";
    chatHistory.forEach(function(message, index) {
        const bubble = document.createElement("div");
        bubble.className = "chat-message";
        const text = document.createElement("div");
        text.textContent = message;
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-message";
        deleteButton.textContent = "delete";
        deleteButton.addEventListener("click", function() {
            chatHistory.splice(index, 1);
            localStorage.setItem(
                "memoryArchiveChat",
                JSON.stringify(chatHistory)
            );
            displayMessages();
        });
        bubble.appendChild(text);
        bubble.appendChild(deleteButton);
        chatMessages.appendChild(bubble);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// ---------- Autosave Current Text ----------
herResponse.addEventListener("input", function () {
    localStorage.setItem(
        "memoryArchiveDraft",
        herResponse.value
    );
    autosaveStatus.textContent = "Autosaved ✓";
});
// ---------- Restore Unfinished Message ----------
const savedDraft = localStorage.getItem("memoryArchiveDraft");
if (savedDraft) {
    herResponse.value = savedDraft;
}
// ---------- Send Message ----------
sendMessage.addEventListener("click", function () {
    const message = herResponse.value.trim();
    if (!message) return;
    chatHistory.push(message);
    localStorage.setItem(
        "memoryArchiveChat",
        JSON.stringify(chatHistory)
    );
    localStorage.removeItem("memoryArchiveDraft");
    herResponse.value = "";
    autosaveStatus.textContent = "Saved ✓";
    displayMessages();
});
// ---------- Enter to Send ----------
herResponse.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage.click();
    }
});
displayMessages();