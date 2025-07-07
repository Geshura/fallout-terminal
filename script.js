let haslo = "";
let probyPozostale = 0;
let zablokowany = true;

const terminal = document.getElementById("terminal");
const inputWrapper = document.getElementById("input-wrapper");
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

const difficultySettings = {
  easy: {
    lengths: [4, 5],
    attempts: 5
  },
  medium: {
    lengths: [6, 7],
    attempts: 7
  },
  hard: {
    lengths: [8, 9],
    attempts: 9
  }
};

function wyczyscTerminal() {
  terminal.textContent = "";
  inputWrapper.innerHTML = "";
}

function budujPamiec(word, attempts) {
  return `HASŁO: ${"_ ".repeat(word.length).trim()}\n\nPRÓB: ${attempts}`;
}

function stworzInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 1;
  input.autocomplete = "off";
  input.autofocus = true;
  inputWrapper.appendChild(input);

  input.addEventListener("input", (e) => {
    const litera = e.target.value.toUpperCase();
    e.target.value = "";

    if (zablokowany || !litera.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/i)) return;

    sprawdzLitere(litera);
  });
}

function sprawdzLitere(litera) {
  if (!haslo.includes(litera)) {
    probyPozostale--;
  }

  terminal.textContent = budujPamiec(haslo, probyPozostale);

  if (probyPozostale <= 0) {
    terminal.textContent += `\n\nKONIEC GRY! Hasło to: ${haslo}`;
    zablokowany = true;
    inputWrapper.innerHTML = "";
  }
}

function ustawPoziom(difficulty) {
  if (!difficultySettings[difficulty]) return;

  const lengths = difficultySettings[difficulty].lengths;
  const proby = difficultySettings[difficulty].attempts;

  const wybraneDlugosci = words.filter(word =>
    lengths.includes(word.length)
  );

  if (!wybraneDlugosci || wybraneDlugosci.length === 0) {
    alert(`Brak słów dla poziomu: ${difficulty}`);
    return;
  }

  haslo = wybraneDlugosci[Math.floor(Math.random() * wybraneDlugosci.length)].toUpperCase();
  probyPozostale = proby;
  zablokowany = false;

  wyczyscTerminal();
  terminal.textContent = budujPamiec(haslo, probyPozostale);
  stworzInput();
}

// Obsługa wyboru poziomu (radio)
difficultyRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      ustawPoziom(radio.value);
    }
  });
});
