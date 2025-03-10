const players = ["Goku", "Vegeta", "Milk", "Piccolo", "Gohan", "Freezer", "Cell", "Janemba", "Majin Buu", "Broly"];

const elements = {
    leftList: document.getElementById("leftList"),
    rightList: document.getElementById("rightList"),
    leftImage: document.getElementById("leftImage"),
    rightImage: document.getElementById("rightImage"),
    leftHealthText: document.getElementById("leftHealth"),
    rightHealthText: document.getElementById("rightHealth"),
    fightBtn: document.getElementById("fightBtn"),
    healBtn: document.getElementById("healBtn"),
    actionLog: document.getElementById("actionLog")
};

const images = players.reduce((acc, player) => {
    acc[player] = `./../assets/${player.toLowerCase().replace(' ', '_')}.png`;
    return acc;
}, {});

let leftFighter = null,
    rightFighter = null,
    leftHealth = 100,
    rightHealth = 100,
    turn = "left";

function populateList(list, imageElement, side) {
    players.forEach(player => {
        let li = document.createElement("li");
        li.textContent = player;

        li.addEventListener("mouseover", () => {
            if (!list.classList.contains("disabled")) {
                imageElement.src = images[player];
                imageElement.style.display = "block";
            }
        });

        li.addEventListener("mouseout", () => {
            if ((side === "left" && player !== leftFighter) || (side === "right" && player !== rightFighter)) {
                imageElement.style.display = "none";
            }
        });

        li.addEventListener("click", () => {
            if (list.classList.contains("disabled")) return;

            if (side === "left") {
                leftFighter = player;
                elements.leftImage.src = images[player];
                leftHealth = 100;
                elements.leftHealthText.textContent = leftHealth;
                elements.leftList.classList.add("disabled");
            } else {
                rightFighter = player;
                elements.rightImage.src = images[player];
                rightHealth = 100;
                elements.rightHealthText.textContent = rightHealth;
                elements.rightList.classList.add("disabled");
            }
        });

        list.appendChild(li);
    });
}

populateList(elements.leftList, elements.leftImage, "left");
populateList(elements.rightList, elements.rightImage, "right");

function logAction(message) {
    let li = document.createElement("li");
    li.textContent = message;
    elements.actionLog.appendChild(li);
    elements.actionLog.scrollTop = elements.actionLog.scrollHeight;
}

function updateTurnIndicator() {
    const turnText = turn === "left" ? leftFighter : rightFighter;
    document.getElementById("turnIndicator").textContent = `Turno de: ${turnText} 🥋`;
}

elements.fightBtn.addEventListener("click", () => {
    if (!leftFighter || !rightFighter) {
        alert("Debes seleccionar ambos luchadores");
        return;
    }

    let damage = Math.floor(Math.random() * 20) + 5;
    if (turn === "left") {
        rightHealth = Math.max(0, rightHealth - damage);
        elements.rightHealthText.textContent = rightHealth;
        logAction(`${leftFighter} atacó a ${rightFighter} y le bajó ${damage} de vida`);
        turn = "right";
    } else {
        leftHealth = Math.max(0, leftHealth - damage);
        elements.leftHealthText.textContent = leftHealth;
        logAction(`${rightFighter} atacó a ${leftFighter} y le bajó ${damage} de vida`);
        turn = "left";
    }

    updateTurnIndicator();
    checkWinner();
});

elements.healBtn.addEventListener("click", () => {
    let healAmount = 5;
    if (!leftFighter || !rightFighter) {
        alert("Debes seleccionar ambos luchadores");
        return;
    }
    if (turn === "left") {
        leftHealth = Math.min(100, leftHealth + healAmount);
        elements.leftHealthText.textContent = leftHealth;
        logAction(`${leftFighter} se curó ${healAmount} de vida ❤️`);
        turn = "right";
    } else {
        rightHealth = Math.min(100, rightHealth + healAmount);
        elements.rightHealthText.textContent = rightHealth;
        logAction(`${rightFighter} se curó ${healAmount} de vida ❤️`);
        turn = "left";
    }

    updateTurnIndicator();
});

function checkWinner() {
    if (leftHealth === 0 || rightHealth === 0) {
        let winner = leftHealth === 0 ? rightFighter : leftFighter;
        alert(`${winner} ha ganado la pelea`);
        resetGame();
    }
}

function resetGame() {
    leftFighter = rightFighter = null;
    leftHealth = rightHealth = 100;
    elements.leftHealthText.textContent = elements.rightHealthText.textContent = "100";
    elements.leftImage.style.display = elements.rightImage.style.display = "none";
    elements.leftList.classList.remove("disabled");
    elements.rightList.classList.remove("disabled");
    elements.actionLog.innerHTML = "";
    updateTurnIndicator();
}
