// average petals required to craft next rarity petal (taken from florr.io wiki)
const averageNeededForSuccess = [6.40625, 10.3125, 18.125, 33.75, 65, 127.5, 252.5]
const chancesForSuccess = [0.64, 0.32, 0.16, 0.08, 0.04, 0.02, 0.01]
// rarities
const rarities = ["Common", "Unusual", "Rare", "Epic", "Legendary", "Mythic", "Ultra", "Super"];
const rarityColors = ["#8ced67", "#fbe557", "#5253e4", "#8128df", "#d22825", "#54d9dc", "#f23375", "#61fe9e"];


let petalRarity = -1;

let resultEl = document.getElementById("result-el")
let currentRarity = document.getElementById("user-rarity")
let currentRarity2 = document.getElementById("user-rarity2")
let nextRarityEl = document.getElementById("user-rarity-add-1")
let nextRaritySimulated = document.getElementById("user-rarity-add-1-simulated")
let nextRarityAtLeastOne = document.getElementById("user-rarity-add-1-at-least-one")
let totalPetalsDisplay = document.getElementById("total-petals-display")
let selectedRarity = null; let selectedRarityStr = null;
let nextRarity = null; 
let color = null; 
let nextRarityColor = null;

let simulationResultEl = document.getElementById("simulation-result-el")

let rewardPetalsEl = document.getElementById("result-number-el")
let errorEl = document.getElementById("error-el")
let probability = document.getElementById("probability")

// helper function for error
function showError(msg) {
    errorEl.textContent = msg;
    rewardPetalsEl.textContent = "[result-petals]";
    simulationResultEl.textContent = "[simulated-petals]";
}

// helper functions for rarity selection
function unHighlightAll() {
    document.querySelectorAll("#buttons button").forEach(function(btn) { // apply this function to all buttons when one clicked.
        btn.classList.remove("selected") // remove the "selected" class from all buttons 
    });
}

function highlight(btn) {
    unHighlightAll();
    btn.classList.add("selected")
}

// add a function to highlight a specific button when it is clicked

document.querySelectorAll("#buttons button").forEach(btn => {
    btn.onclick = () => {
        highlight(btn);
        
        errorEl.textContent = ""
        rewardPetalsEl.textContent = "[result-petals]"
        totalPetalsDisplay.textContent = "[petals]"
        simulationResultEl.textContent = "[simulated-petals]"
        probability.textContent = "[probability]"

        petalRarity = Number(btn.dataset.index); 

        selectedRarityStr = btn.textContent; 
        nextRarity = rarities[petalRarity + 1]; 
        color = rarityColors[petalRarity]; 
        nextRarityColor = rarityColors[petalRarity + 1];

        currentRarity.style.color = color;
        currentRarity2.style.color = color;

        currentRarity.textContent = selectedRarityStr;
        currentRarity2.textContent = selectedRarityStr + "(s)";

        nextRarityEl.style.color = nextRarityColor;
        nextRarityEl.textContent = nextRarity + "(s)"

        nextRaritySimulated.style.color = nextRarityColor;
        nextRaritySimulated.textContent = nextRarity + "(s)"

        nextRarityAtLeastOne.style.color = nextRarityColor
        nextRarityAtLeastOne.textContent = nextRarity
    };
});

// maths function - probability of getting at least one x

function atLeastOne(lambda) {
    return 1 - Math.exp(-lambda);
}

function getPetalsReward() { // main function to determine an average petal reward and run a simulation to see what you would've gotten.
    // on-average logic 
    errorEl.textContent = ""

    let inputtedPetalsRaw = document.getElementById("petals-input").value
    let inputtedPetals = Number(inputtedPetalsRaw)
    if (inputtedPetals < 5 || inputtedPetals > 1000000) {
        showError("Error: Enter valid amount of petals (>5 and <1 million")
        return;
    }

    if (petalRarity === -1) {
        showError("Error: Please select a rarity from clicking the boxes at the top.")
        return;
    }

    totalPetalsDisplay.textContent = inputtedPetals

    const petalsReward = Number((inputtedPetals / averageNeededForSuccess[petalRarity]).toFixed(2));
    rewardPetalsEl.textContent = petalsReward

    let fullAttempts = Math.floor(inputtedPetals / 5); // lines 109-111 are all VERY wrong calculations but whatever.
    let chancePerAttempt = chancesForSuccess[petalRarity];
    let probabilityOfAtLeastOne = 1 - Math.pow(1 - chancePerAttempt, fullAttempts);

    probability.textContent = (probabilityOfAtLeastOne * 100).toFixed(3) + "%";
  
    // simulation logic (a little more complex)
    let simulatedPetalsReward = 0

    while (inputtedPetals >= 5) {
        if (inputtedPetals < 5) {
            break;
        }
    
        if (Math.random() < chancesForSuccess[petalRarity]) {
            simulatedPetalsReward++;
            inputtedPetals -= 5;
        } else {
            inputtedPetals -= Math.floor(Math.random() * 4) + 1
        }
    }

    simulationResultEl.textContent = simulatedPetalsReward
}
