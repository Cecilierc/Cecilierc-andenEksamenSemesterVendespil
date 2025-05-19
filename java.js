// Hent HTML-elementerne der bruges i spillet
const board = document.getElementById("game-board"); // Spillepladsen
const score1Display = document.getElementById("score1"); // Visning af spillerscore 1
const score2Display = document.getElementById("score2"); // Visning af spillerscore 2

// Initialisering af spillernes score
let score1 = 0; // Score for spiller 1
let score2 = 0; // Score for spiller 2
let flippedCards = []; // Array til at gemme omvendte kort
let lockBoard = false; // Flag til at låse spillepladen
let currentPlayer = 0; // Indikerer hvilken spiller der er aktiv

// Værdierne for kortene
const values = ['Stik 1', 'Stik 2', 'Stik 3', 'Stik 4', 'Stik 5', 'Stik 6', 'Stik 7', 'Stik 8', 'Stik 9'];
let cards = [...values, ...values]; // Dobbelt op på kortene
cards = shuffle(cards); // Bland kortene

// Byg spillepladen
cards.forEach(value => {
  // Opret kort-elementet
  const card = document.createElement("div");
  card.classList.add("card"); // Tildel class til kortet
  card.dataset.value = value; // Gem kortværdien i data-attribut

  // Opret og tilføj billede til kortet
  const img = document.createElement("img");
  img.src = `img/kort_1.png`; // Standard billede for kortet
  img.alt = "Kort"; // Alt teksten for tilgængelighed
  img.classList.add("kort-billede"); // Tildel class til billedet

  // Tilføj billedet til kortet
  card.appendChild(img);

  // Lyt efter klik på kortet
  card.addEventListener("click", handleFlip);
  
  // Tilføj kortet til spillepladen
  board.appendChild(card);
});

// Funktion til at blande array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Vælg et tilfældigt indeks
    [array[i], array[j]] = [array[j], array[i]]; // Byt elementerne
  }
  return array; // Returner det blandede array
}

// Håndterer kortomvending
function handleFlip(e) {
  if (lockBoard) return; // Stop hvis spillepladen er låst

  // Hvis der klikkes på <img> i stedet for selve kortet
  const card = e.target.closest('.card'); // Find kortet
  if (!card || card.classList.contains("flipped") || card.classList.contains("matched")) return; // Ugyldigt klik

  card.classList.add("flipped"); // Vend kortet om
  visStortKort(card.dataset.value); // Vis kortværdien

  flippedCards.push(card); // Tilføj kortet til flippedCards

  if (flippedCards.length === 2) {
    checkMatch(); // Tjek for match når der er to omvendte kort
  }
}

// Tjekker for match mellem kort
function checkMatch() {
  const [card1, card2] = flippedCards; // Tag de to kort der blev vendt
  lockBoard = true; // Lås spillepladen mens der tjekkes for match

  setTimeout(() => {
    // Tjek for match
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add("matched"); // Marker kortet som matchet
      card2.classList.add("matched");

      // Opdater score for den nuværende spiller
      if (currentPlayer === 0) {
        score1++;
        score1Display.textContent = score1; // Opdater score display for spiller 1
      } else {
        score2++;
        score2Display.textContent = score2; // Opdater score display for spiller 2
      }
    } else {
      // Hvis der ikke er et match, vend kortene tilbage
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }

    flippedCards = []; // Tøm arrayet med flippedCards
    currentPlayer = currentPlayer === 0 ? 1 : 0; // Skift til den anden spiller
    opdaterAktivSpiller(); // Opdater spillerinterface
    lockBoard = false; // Frigiv spillepladen
  }, 1000); // Forsinkelse før kortene vendes tilbage
}

// Opdater aktiv spiller
function opdaterAktivSpiller() {
  const spiller1 = document.getElementById("spiller1");
  const spiller2 = document.getElementById("spiller2");
  const ikon1 = document.getElementById("ikon1");
  const ikon2 = document.getElementById("ikon2");

  const spiller1Aktiv = currentPlayer === 0; // Tjek om spiller 1 er aktiv

  spiller1.classList.toggle("aktiv", spiller1Aktiv); // Opdater spiller 1 status
  spiller2.classList.toggle("aktiv", !spiller1Aktiv); // Opdater spiller 2 status

  // Skift ikoner afhængigt af hvilken spiller der er aktiv
  ikon1.src = spiller1Aktiv ? "img/orange_mand.png" : "img/hvid_mand.png";
  ikon2.src = spiller1Aktiv ? "img/hvid_mand.png" : "img/orange_mand.png";
}

// Vis detaljer for det valgte kort
function visStortKort(værdi) {
  const popup = document.getElementById("popup-card"); // Hent popup-elementet
  const indhold = document.getElementById("popup-indhold"); // Hent indholdselementet

  indhold.textContent = værdi; // Indsæt værdien i popup
  popup.classList.remove("popup-skjult"); // Vis popup
  popup.classList.add("popup-vis"); // Ændre popup status til synlig
}

// Luk popup ved klik
document.getElementById("luk-popup").addEventListener("click", () => {
  const popup = document.getElementById("popup-card"); // Hent popup-elementet
  popup.classList.remove("popup-vis"); // Skjul popup
  popup.classList.add("popup-skjult"); // Ændre popup status til skjult
});
