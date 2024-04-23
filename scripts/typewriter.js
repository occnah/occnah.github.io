// Typewriter effect
const titleText = "Ossian Stange";
let i = 0;
function typeWriter() {
  if (i < titleText.length) {
    document.getElementById("main-title").innerHTML += titleText.charAt(i);
    i++;
    setTimeout(typeWriter, 100); // Adjust typing speed here
  }
}

// Start typewriter effect when the page loads
window.onload = typeWriter;
