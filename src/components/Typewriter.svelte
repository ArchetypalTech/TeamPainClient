<script lang="ts">
    export let text: string;
    export let sentenceDelay: number = 2000;
    export let minTypingDelay: number = 50;
    export let maxTypingDelay: number = 150;
  
    let displayText: string = '';
    let currentIndex: number = 0;
    let isPaused: boolean = false;
  
    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    function getRandomDelay(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    async function typeText() {
      while (currentIndex < text.length) {
        if (isPaused) {
          await sleep(sentenceDelay);
          isPaused = false;
        } else {
          const char = text[currentIndex];
          displayText += char === '\n' ? '<br>' : char === '\t' ? '&emsp;' : char;
          currentIndex++;
  
          if (char === '.') {
            isPaused = true;
          } else {
            // Add a random delay between characters
            await sleep(getRandomDelay(minTypingDelay, maxTypingDelay));
          }
        }
      }
    }
  
    $: {
      displayText = '';
      currentIndex = 0;
      isPaused = false;
      typeText();
    }
  </script>
  
  <div>{@html displayText}</div>