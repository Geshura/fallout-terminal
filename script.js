let haslo = "";
let probyPozostale = 5;
let zablokowany = true;

const terminal = document.getElementById("terminal");
const inputWrapper = document.getElementById("input-wrapper");

// Funkcja czyszcząca terminal i input
function wyczyscTerminal() {
  terminal.textContent = "";
  inputWrapper.innerHTML = "";
}

// Buduje planszę do gry z hasłem i próbami
function budujPamiec(word, attempts, revealed=[]) {
  let display = "";
  for(let i = 0; i < word.length; i++) {
    display += (revealed.includes(word[i]) ? word[i] : "_") + " ";
  }
  return `HASŁO: ${display.trim()}\n\nPRÓB: ${attempts}`;
}

// Tworzy pole input do wpisywania liter
function stworzInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 1;
  input.autocomplete = "off";
  input.autofocus = true;
  input.style.fontSize = "1.2rem";
  input.style.padding = "5px";
  inputWrapper.appendChild(input);

  input.addEventListener("input", (e) => {
    const litera = e.target.value.toUpperCase();
    e.target.value = ""; // Czyści pole

    if(zablokowany || !litera.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/i)) return;

    sprawdzLitere(litera);
  });
}

let odkryteLitery = [];

// Sprawdza czy litera jest w haśle
function sprawdzLitere(litera) {
  if(!haslo.includes(litera)) {
    probyPozostale--;
  } else {
    if(!odkryteLitery.includes(litera)) odkryteLitery.push(litera);
  }

  terminal.textContent = budujPamiec(haslo, probyPozostale, odkryteLitery);

  if(!haslo.split("").some(l => !odkryteLitery.includes(l))) {
    terminal.textContent += `\n\nWYGRAŁEŚ! Hasło to: ${haslo}`;
    zablokowany = true;
    inputWrapper.innerHTML = "";
  } else if(probyPozostale <= 0) {
    terminal.textContent += `\n\nPRZEGRAŁEŚ! Hasło to: ${haslo}`;
    zablokowany = true;
    inputWrapper.innerHTML = "";
  }
}

// Start gry: losuje słowo 6-literowe i ustawia parametry
function start() {
  if(!words6 || words6.length === 0) {
    terminal.textContent = "Brak słów do gry!";
    return;
  }

  haslo = words6[Math.floor(Math.random()*words6.length)].toUpperCase();
  probyPozostale = 5;
  odkryteLitery = [];
  zablokowany = false;

  wyczyscTerminal();
  terminal.textContent = budujPamiec(haslo, probyPozostale);
  stworzInput();
}

start();
