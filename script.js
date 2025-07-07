// W renderze zamiast ustawiać bezpośrednio style, nadajemy klasy i tekst

function renderPlansza(board) {
  terminal.innerHTML = "";

  for(let r=0; r<rows; r++) {
    let line = document.createElement("div");
    line.style.userSelect = "none";
    line.style.whiteSpace = "pre";

    for(let c=0; c<cols; c++) {
      const ch = board[r][c];
      let span = document.createElement("span");

      // Sprawdzamy, czy to początek słowa w tej pozycji
      const wordAtPos = placedWords.find(({ word, row, col }) => r === row && c === col);

      if(wordAtPos) {
        span.textContent = wordAtPos.word;
        span.classList.add("word");
        span.title = "Kliknij, aby wybrać słowo";

        span.addEventListener("click", () => kliknijSlowo(wordAtPos.word));
        line.appendChild(span);

        // Pomijamy resztę liter słowa (bo już wypisaliśmy całe naraz)
        c += wordAtPos.word.length - 1;
      } else {
        // Zwykły znak wypełniacza
        span.textContent = ch;
        span.classList.add("filler");
        line.appendChild(span);
      }
    }

    terminal.appendChild(line);
  }
}
