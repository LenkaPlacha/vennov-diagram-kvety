const flowers = document.querySelectorAll(".item");

flowers.forEach(function (flower) {
  flower.addEventListener("dragstart", drag);
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
  event.preventDefault();
  event.stopPropagation();

  const flowerId = event.dataTransfer.getData("text/plain");
  const flower = document.getElementById(flowerId);
  const targetArea = event.currentTarget;

  if (flower && targetArea) {
    targetArea.appendChild(flower);
  }
}

function isInArea(flowerId, areaId) {
  const flower = document.getElementById(flowerId);
  const area = document.getElementById(areaId);

  if (!flower || !area) {
    return false;
  }

  return flower.parentElement === area;
}

function isStillUnsorted(flowerId) {
  const flower = document.getElementById(flowerId);

  if (!flower || !flower.parentElement) {
    return false;
  }

  return flower.parentElement.classList.contains("items");
}

/* Zvuk nesprávnej odpovede */

function playWrongSound() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();

  oscillator.connect(volume);
  volume.connect(audioContext.destination);

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(
    300,
    audioContext.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    150,
    audioContext.currentTime + 0.4
  );

  volume.gain.setValueAtTime(
    0.15,
    audioContext.currentTime
  );

  volume.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);

  oscillator.addEventListener("ended", function () {
    audioContext.close();
  });
}

/* Zvuk správnej odpovede */

function playSuccessSound() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();

  const notes = [
    { frequency: 523.25, start: 0 },
    { frequency: 659.25, start: 0.15 },
    { frequency: 783.99, start: 0.3 },
    { frequency: 1046.5, start: 0.48 }
  ];

  notes.forEach(function (note) {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    const startTime =
      audioContext.currentTime + note.start;

    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;

    volume.gain.setValueAtTime(
      0.001,
      startTime
    );

    volume.gain.linearRampToValueAtTime(
      0.15,
      startTime + 0.03
    );

    volume.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + 0.35
    );

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.36);
  });

  setTimeout(function () {
    audioContext.close();
  }, 1200);
}

/* Smutný smajlík */

let sadFaceTimer;

function showSadFace() {
  const sadFace = document.getElementById("sad-face");

  if (!sadFace) {
    return;
  }

  clearTimeout(sadFaceTimer);

  sadFace.classList.remove("show");

  void sadFace.offsetWidth;

  sadFace.classList.add("show");

  sadFaceTimer = setTimeout(function () {
    sadFace.classList.remove("show");
  }, 2000);
}

function hideSadFace() {
  const sadFace = document.getElementById("sad-face");

  clearTimeout(sadFaceTimer);

  if (sadFace) {
    sadFace.classList.remove("show");
  }
}

/* Ohňostroj */

function createFireworks() {
  const celebration =
    document.getElementById("celebration");

  if (!celebration) {
    return;
  }

  clearFireworks();

  const colors = [
    "#ff1744",
    "#ffea00",
    "#00e676",
    "#2979ff",
    "#d500f9",
    "#ff9100",
    "#00e5ff"
  ];

  const positions = [
    { x: 20, y: 30 },
    { x: 50, y: 20 },
    { x: 80, y: 35 },
    { x: 35, y: 60 },
    { x: 70, y: 65 }
  ];

  positions.forEach(function (position, burstIndex) {
    for (let i = 0; i < 16; i++) {
      const particle =
        document.createElement("span");

      const angle = (360 / 16) * i;
      const distance = 70 + Math.random() * 70;

      const color =
        colors[
          Math.floor(Math.random() * colors.length)
        ];

      particle.classList.add("firework-particle");

      particle.style.left = position.x + "%";
      particle.style.top = position.y + "%";
      particle.style.backgroundColor = color;
      particle.style.color = color;

      particle.style.setProperty(
        "--move-x",
        Math.cos(angle * Math.PI / 180) *
          distance +
          "px"
      );

      particle.style.setProperty(
        "--move-y",
        Math.sin(angle * Math.PI / 180) *
          distance +
          "px"
      );

      particle.style.animationDelay =
        burstIndex * 0.18 + "s";

      celebration.appendChild(particle);
    }
  });

  setTimeout(clearFireworks, 3000);
}

function clearFireworks() {
  const celebration =
    document.getElementById("celebration");

  if (celebration) {
    celebration.innerHTML = "";
  }
}

/* Kontrola odpovede */

function checkAnswer() {
  const result = document.getElementById("result");

  if (!result) {
    return;
  }

  hideSadFace();
  clearFireworks();

  const flowerIds = [
    "flower1",
    "flower2",
    "flower3",
    "flower4",
    "flower5",
    "flower6"
  ];

  const unsortedFlowers =
    flowerIds.filter(function (flowerId) {
      return isStillUnsorted(flowerId);
    });

  if (unsortedFlowers.length > 0) {
    result.textContent =
      "🌼 Zatriediť treba ešte " +
      unsortedFlowers.length +
      " kvetov.";

    result.style.color = "#d97706";
    return;
  }

  const allCorrect =
    isInArea("flower1", "blueArea") &&
    isInArea("flower2", "blueArea") &&
    isInArea("flower3", "greenArea") &&
    isInArea("flower4", "greenArea") &&
    isInArea("flower5", "bothArea") &&
    isInArea("flower6", "bothArea");

  if (allCorrect) {
    result.textContent =
      "✅ Výborne! Všetky kvety sú správne zatriedené.";

    result.style.color = "green";

    playSuccessSound();
    createFireworks();
  } else {
    result.textContent =
      "❌ Niektorý kvet je v nesprávnej oblasti. Skús ešte raz.";

    result.style.color = "#c62828";

    playWrongSound();
    showSadFace();
  }
}

/* Resetovanie a premiešanie */

function resetGame() {
  const itemsArea = document.querySelector(".items");
  const result = document.getElementById("result");

  if (!itemsArea) {
    return;
  }

  const flowerIds = [
    "flower1",
    "flower2",
    "flower3",
    "flower4",
    "flower5",
    "flower6"
  ];

  const shuffledFlowerIds = [...flowerIds];

  for (
    let i = shuffledFlowerIds.length - 1;
    i > 0;
    i--
  ) {
    const randomIndex =
      Math.floor(Math.random() * (i + 1));

    const temporaryValue = shuffledFlowerIds[i];

    shuffledFlowerIds[i] =
      shuffledFlowerIds[randomIndex];

    shuffledFlowerIds[randomIndex] =
      temporaryValue;
  }

  shuffledFlowerIds.forEach(function (flowerId) {
    const flower =
      document.getElementById(flowerId);

    if (flower) {
      itemsArea.appendChild(flower);
    }
  });

  if (result) {
    result.textContent = "";
    result.style.color = "";
  }

  hideSadFace();
  clearFireworks();
}
/* Mobilné ovládanie - výber kvetu */
let selectedFlower = null;

document.querySelectorAll(".item").forEach(function (flower) {

  flower.addEventListener("touchstart", function (event) {

    event.preventDefault();

    selectedFlower = flower;

  });

});

/* Presunutie do modrého kruhu */
document
  .getElementById("blueArea")
  .addEventListener("touchend", function (event) {

    event.preventDefault();

    if (selectedFlower) {
      this.appendChild(selectedFlower);
      selectedFlower = null;
    }

  });

/* Presunutie do zeleného kruhu */
document
  .getElementById("greenArea")
  .addEventListener("touchend", function (event) {

    event.preventDefault();

    if (selectedFlower) {
      this.appendChild(selectedFlower);
      selectedFlower = null;
    }

  });

/* Presunutie do prieniku */
document
  .getElementById("bothArea")
  .addEventListener("touchend", function (event) {

    event.preventDefault();

    if (selectedFlower) {
      this.appendChild(selectedFlower);
      selectedFlower = null;
    }

  });