const container = document.querySelector(".slider-container");
const controller = document.querySelector(".controller");
const rightSlide = document.querySelector(".right-slide");
const leftSlide = document.querySelector(".left-slide");
const sliderButtons = document.querySelector(".action-buttons");
const downButton = document.querySelector(".down-button");
const upButton = document.querySelector(".up-button");
const redoButton = document.querySelector(".redo-button");
const bulbButton = document.querySelector(".bulb-button");
const popup = document.querySelector(".popup");
const popupButton = document.querySelector(".popup-button");
const melodies = [
  "./assets/flowers.mp3",
  "./assets/Sky.mp3",
  "./assets/memories.mp3",
  "./assets/eagle.mp3",
  "./assets/fern.mp3",
  "./assets/born.mp3",
];
const upBtnText = upButton.innerHTML;
const downBtnText = downButton.innerHTML;

const audio = new Audio();

let counter = -1;
let isRotate = false;
let firstClick = false;
let capturePoint;
let slideDirection;
let source = melodies[counter];

rightSlide.style = `top: -500%`;

function setFirstClick() {
  firstClick = true;
  document.removeEventListener("click", setFirstClick);
}

function playAudio() {
  audio.src = source;
  audio.autoplay = "true";
}

function checkButtonsText() {
  if (counter === 5) {
    downButton.innerHTML = "to begining";

    if (isRotate) {
      downButton.classList.add("down-button_rotate-last");
    } else {
      downButton.classList.add("down-button_last");
    }
  } else {
    downButton.innerHTML = downBtnText;
    downButton.classList.remove("down-button_last");
    downButton.classList.remove("down-button_rotate-last");
  }

  if (counter === 0) {
    upButton.innerHTML = "to end";

    if (isRotate) {
      upButton.classList.add("up-button_rotate-first");
    }
  } else {
    upButton.innerHTML = upBtnText;
    upButton.classList.remove("up-button_rotate-first");
  }
}

function changeSlide(arg) {
  if (arg) {
    counter++;

    if (counter > 5) {
      counter = 0;
    }
  } else {
    counter--;

    if (counter < 0) {
      counter = 5;
    }
  }
  checkButtonsText();

  if (!isRotate) {
    rightSlide.style = `top: ${-(500 - counter * 100)}%`;
    leftSlide.style = `top: ${counter * -100}%`;
  } else {
    rightSlide.style = `left: ${-(500 - counter * 100)}%`;
    leftSlide.style = `left: ${counter * -100}%`;
  }
  source = melodies[counter];
  playAudio();
}

function rotate() {
  if (isRotate) {
    rightSlide.style = `top: ${-(500 - counter * 100)}%`;
    leftSlide.style = `top: ${counter * -100}%`;
  } else {
    rightSlide.style = `left: ${-(500 - counter * 100)}%`;
    leftSlide.style = `left: ${counter * -100}%`;
  }
  leftSlide.classList.toggle("left-slide_rotate");
  rightSlide.classList.toggle("right-slide_rotate");
  sliderButtons.classList.toggle("action-buttons_rotate");
  downButton.classList.toggle("down-button_rotate");
  upButton.classList.toggle("up-button_rotate");
  redoButton.classList.toggle("redo-button_rotate");
  isRotate = !isRotate;

  if (!firstClick) {
    playAudio();
  }
}

function changeLightMode() {
  for (let i = 0; i < leftSlide.children.length; i++) {
    for (let j = 0; j < leftSlide.children[i].children.length; j++) {
      leftSlide.children[i].children[j].classList.toggle("invert");
    }
  }
  downButton.classList.toggle("invert");
  upButton.classList.toggle("invert");
  redoButton.classList.toggle("invert");
  bulbButton.classList.toggle("invert");
}

function changeVolume(e) {
  const delta = e.deltaY || e.wheelDeltaY || e.wheelDelta || e.detail;

  if (delta < 0 && audio.volume < 1) {
    audio.volume = Math.round(audio.volume * 100 + 5) / 100;
  }

  if (delta > 0 && audio.volume > 0) {
    audio.volume = Math.round(audio.volume * 100 - 5) / 100;
  }
}

function grabElement(e) {
  e.preventDefault();

  if (!isRotate) {
    capturePoint = e.clientY;
  } else {
    capturePoint = e.clientX;
  }
  const clue = document.createElement("div");
  clue.className = "clue";
  const upArrow = document.createElement("i");
  const text = document.createElement("h2");
  text.textContent = "swipe slide to move";
  const downArrow = document.createElement("i");

  if (!isRotate) {
    clue.style = `top: ${e.pageY}px; left: ${e.pageX}px`;
    upArrow.className = "fas fa-arrow-up";
    downArrow.className = "fas fa-arrow-down";
  } else {
    clue.style = `top: ${e.pageY}px; left: ${e.pageX}px; display: flex; align-items: center`;
    upArrow.className = "fas fa-arrow-left";
    downArrow.className = "fas fa-arrow-right";
  }
  container.appendChild(clue);
  clue.appendChild(upArrow);
  clue.appendChild(text);
  clue.appendChild(downArrow);
  setTimeout(() => {
    clue.classList.add("clue_invert");
  }, 1000);
  setTimeout(() => {
    clue.remove();
  }, 3000);
}

function moveElement(e, arg) {
  if (!capturePoint) {
    if (e.clientY < 10) {
      controller.classList.add("controller_showed");

      if (isRotate) {
        controller.style = "left: calc(50% - 11vmax)";
      }
    } else {
      controller.classList.remove("controller_showed");
    }
  }
  if (capturePoint && !isRotate) {
    if (e.clientY > capturePoint + 50) {
      if (arg === "left") {
        slideDirection = "asc";
      } else {
        slideDirection = "desc";
      }
    } else if (e.clientY < capturePoint - 50) {
      if (arg === "left") {
        slideDirection = "desc";
      } else {
        slideDirection = "asc";
      }
    } else {
      slideDirection = "";
    }
  }

  if (capturePoint && isRotate) {
    if (e.clientX > capturePoint + 50) {
      if (arg === "left") {
        slideDirection = "asc";
      } else {
        slideDirection = "desc";
      }
    } else if (e.clientX < capturePoint - 50) {
      if (arg === "left") {
        slideDirection = "desc";
      } else {
        slideDirection = "asc";
      }
    } else {
      slideDirection = "";
    }
  }
}

function dropElement() {
  if (slideDirection === "desc") {
    changeSlide(true);
  } else if (slideDirection === "asc") {
    changeSlide(false);
  } else {
    return;
  }
  slideDirection = "";
  capturePoint = null;
}

function controllerButtonClick(e) {
  const index = e.target.id.replace("item-", "");
  counter = +index;
  changeSlide(false);
}

playAudio();
changeSlide(true);
popup.classList.add("popup_opened");

controller.addEventListener("click", controllerButtonClick);
downButton.addEventListener("click", () => {
  changeSlide(true);
});
upButton.addEventListener("click", () => {
  changeSlide(false);
});
redoButton.addEventListener("click", rotate);
bulbButton.addEventListener("click", changeLightMode);
document.addEventListener("wheel", changeVolume);
leftSlide.addEventListener("mousedown", grabElement);
leftSlide.addEventListener("mousemove", (e) => {
  moveElement(e, "left");
});
leftSlide.addEventListener("mouseup", dropElement);
rightSlide.addEventListener("mousedown", grabElement);
rightSlide.addEventListener("mousemove", moveElement);
rightSlide.addEventListener("mouseup", dropElement);
popupButton.addEventListener("click", () => {
  popup.classList.remove("popup_opened");
  playAudio();
});
document.addEventListener("click", setFirstClick);
