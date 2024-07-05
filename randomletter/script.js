document.addEventListener('DOMContentLoaded', () => {
  const randomLettersElement = document.getElementById('randomLetters');
  const feedbackElement = document.getElementById('feedback');
  const keyboard = document.getElementById('keyboard');
  const inputElement = document.getElementById('input');
  let userInput = ''; // Track user input
  let currentLetterIndex = 0;

  function getRandomLetters() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = Math.floor(Math.random() * 3) + 1; // Random length between 1 and 3
    let randomLetters = '';
    for (let i = 0; i < length; i++) {
      randomLetters += letters[Math.floor(Math.random() * letters.length)];
    }
    return randomLetters;
  }

  function playAudio(filename) {
    const audio = new Audio(`audio/${filename}.mp3`);
    audio.play();
  }

  function playAudioSequence(letters, index = 0) {
    if (index < letters.length) {
      const audio = new Audio(`audio/${letters[index].toLowerCase()}.mp3`);
      audio.play();
      audio.onended = () => playAudioSequence(letters, index + 1);
    }
  }

  function highlightNextLetter() {
    const randomLetters = randomLettersElement.textContent;
    if (currentLetterIndex < randomLetters.length) {
      const nextLetter = randomLetters[currentLetterIndex].toUpperCase();
      const keyElement = document.querySelector(`.key[data-letter="${nextLetter}"]`);
      if (keyElement) {
        keyElement.classList.add('highlight');
      }
    }
  }

  function clearHighlight() {
    const highlightedKeys = document.querySelectorAll('.key.highlight');
    highlightedKeys.forEach(key => key.classList.remove('highlight'));
  }

  function generateRandomLetters() {
    const randomLetters = getRandomLetters(); // Generate random letters
    randomLettersElement.textContent = randomLetters;
    inputElement.textContent = ''; // Clear previous user input
    userInput = ''; // Reset user input
    currentLetterIndex = 0; // Reset current letter index
    clearHighlight(); // Clear previous highlights
    highlightNextLetter(); // Highlight the first letter
    playAudio('input');
    setTimeout(() => {
      playAudioSequence(randomLetters); // Play each letter audio in sequence after 0.3s delay
    }, 2000);
  }

  function handleCorrectInput() {
    feedbackElement.textContent = '正确!';
    feedbackElement.style.color = '#28a745';
    playAudio('ok'); // Play correct sound
    setTimeout(() => {
      generateRandomLetters(); // Generate new letters
    }, 2000);
  }

  function handleIncorrectInput(missingLetters) {
    feedbackElement.textContent = `错误! 缺少字母: ${missingLetters}`;
    feedbackElement.style.color = '#dc3545';
    var chars = Array.from(missingLetters);
    setTimeout(() => {
      playAudio('lessletter');
    }, 2000);
    chars.forEach(function(char) {
      setTimeout(() => {
        playAudio(char.toLowerCase());
      }, 3000);
    });
    //missingLetters.split('').forEach(letter => playAudio(letter.toLowerCase())); // Play missing letters sounds
    playAudio('wrong'); // Play wrong sound
    setTimeout(() => {
      feedbackElement.textContent = ''; // Clear feedback after 2 seconds
    }, 2000);
  }

  function handleInput(letter) {
    userInput += letter;
    inputElement.textContent = userInput; // Update displayed user input
    clearHighlight(); // Clear previous highlight
    currentLetterIndex++; // Move to next letter
    highlightNextLetter(); // Highlight the next letter
  }

  function compareInput() {
    const randomLetters = randomLettersElement.textContent;
    if (userInput.toLowerCase() === randomLetters.toLowerCase()) {
      handleCorrectInput();
    } else {
      const missingLetters = randomLetters.split('').filter(letter => !userInput.toLowerCase().includes(letter.toLowerCase())).join('');
      handleIncorrectInput(missingLetters);
    }
  }

  keyboard.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('key')) {
      const letter = clickedElement.getAttribute('data-letter');
      handleInput(letter);
    }
  });

  document.addEventListener('keydown', (event) => {
    const letter = event.key;
    if (letter.match(/[a-zA-Z]/) && letter !== 'Enter' && letter !== 'Backspace') {
      const keyElement = document.querySelector(`.key[data-letter="${letter.toUpperCase()}"]`);
      if (keyElement) {
        handleInput(letter);
      }
    } else if (event.key === 'Enter') {
      compareInput();
    } else if (event.key === 'Backspace') {
      userInput = userInput.slice(0, -1);
      inputElement.textContent = userInput;
      currentLetterIndex--; // Move to previous letter
      highlightNextLetter(); // Highlight the current letter
    }
  });

  generateRandomLetters();
});
