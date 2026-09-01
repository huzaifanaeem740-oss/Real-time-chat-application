const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const notificationSound = new Audio("../notification.mp3");
notificationSound.volume = 0.7;

let name = "";

while (!name) {
    name = prompt("Enter your name to join Vestro Chat");

    if (name === null) {
        name = "";
    } else {
        name = name.trim();
    }
}

const append = (message, position) => {
    const messageElement = document.createElement("div");

    messageElement.innerText = message;
    messageElement.classList.add("message", position);

    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

const playNotification = () => {
    notificationSound.currentTime = 0;

    notificationSound.play().catch(() => {
        console.log("Notification sound could not play");
    });
};

socket.emit("new-user-joined", name);

socket.on("user-joined", joinedName => {
    append(`${joinedName} joined the chat`, "left");
    playNotification();
});

socket.on("left", leftName => {
    append(`${leftName} left the chat`, "left");
    playNotification();
});

socket.on("receive", data => {
    append(`${data.name}: ${data.message}`, "left");
    playNotification();
});

form.addEventListener("submit", e => {
    e.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    append(`You: ${message}`, "right");

    socket.emit("send", message);

    playNotification();

    messageInput.value = "";
    messageInput.focus();
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeIcon.innerHTML = `
            <path
                d="M21 12.79A9 9 0 1 1 11.21 3
                7 7 0 0 0 21 12.79Z"
                fill="currentColor"
            />
        `;

        themeBtn.setAttribute("aria-label", "Switch to light mode");
    } else {
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="4" fill="currentColor"/>
            <path
                d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34
                M17.66 17.66L19.07 19.07M2 12H4M20 12H22
                M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />
        `;

        themeBtn.setAttribute("aria-label", "Switch to dark mode");
    }
});

