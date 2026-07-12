const fade = document.querySelector(".fade");

function swapPage(id) {
  WX.pages.forEach((page) => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  scrollTo(0, 0);
}

window.go = function (id) {
  if (document.startViewTransition) {
    document.startViewTransition(() => swapPage(id));
  } else {
    fade.classList.remove("go");
    void fade.offsetWidth;
    fade.classList.add("go");
    setTimeout(() => swapPage(id), 450);
  }
};

function normalizePassword(value) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

const worldPasswords = {
  donghua: ["modaozushi", "魔道祖师", "魔道祖師"],
  untamed: ["theuntamed", "陈情令", "陳情令"],
};

const rareMemories = [
  "…Wei Ying.",
  "The melody was never forgotten.",
  "You knew this scene once.",
  "Some stories do not end. They become memories.",
  "Come back. They are still here.",
  "The first time is gone. The memory is not.",
];

let archiveUnsealed = false;
let flickerBusy = false;
let ambientTimer;

function revealMemoryFlicker() {
  if (!archiveUnsealed || flickerBusy) return;

  const room = document.getElementById("rareMemory");
  const text = document.getElementById("rareMemoryText");
  if (!room || !text) return;

  flickerBusy = true;
  text.textContent =
    rareMemories[Math.floor(Math.random() * rareMemories.length)];

  room.style.setProperty("--flicker-x", `${8 + Math.random() * 72}vw`);
  room.style.setProperty("--flicker-y", `${10 + Math.random() * 72}svh`);
  room.style.setProperty("--flicker-tilt", `${-3 + Math.random() * 6}deg`);

  room.classList.remove("show");
  void room.offsetWidth;
  room.classList.add("show");
  room.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    room.classList.remove("show");
    room.setAttribute("aria-hidden", "true");
    flickerBusy = false;
  }, 1150);
}

function rollForMemoryFlicker() {
  if (Math.random() < 0.05) revealMemoryFlicker();
}

function scheduleAmbientMemory() {
  clearTimeout(ambientTimer);
  ambientTimer = setTimeout(() => {
    rollForMemoryFlicker();
    scheduleAmbientMemory();
  }, 12000 + Math.random() * 18000);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-page]");
  if (!target) return;

  const currentPage = document.querySelector(".page.active")?.id;
  const isInsideArchive =
    archiveUnsealed &&
    currentPage &&
    !["prologue", "remember", "choice", "seal"].includes(currentPage);

  if (isInsideArchive) rollForMemoryFlicker();
  go(target.dataset.page);
});

document.getElementById("passform").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("pass");
  const message = document.getElementById("passmsg");
  const card = document.getElementById("sealCard");
  const value = normalizePassword(input.value);
  const accepted = worldPasswords[WX.world] || [];

  if (accepted.map(normalizePassword).includes(value)) {
    message.textContent = "you remember.";
    card.classList.add("breaking");
    archiveUnsealed = true;

    setTimeout(() => {
      card.classList.remove("breaking");
      input.value = "";
      go("archive");
      scheduleAmbientMemory();
    }, 900);
  } else {
    message.textContent =
      WX.world === "donghua"
        ? "that is not the memory you chose."
        : "the strings remain silent.";
    input.value = "";
    input.focus();
  }
});

document.querySelectorAll("[data-world]").forEach((choice) =>
  choice.addEventListener("click", () => {
    WX.world = choice.dataset.world;
    document.body.dataset.world = WX.world;

    document.getElementById("worldmark").textContent =
      WX.world === "donghua" ? "魔道祖师" : "陈情令";

    document.getElementById("worldtitle").textContent =
      WX.world === "donghua"
        ? "MO DAO ZU SHI ARCHIVE"
        : "THE UNTAMED ARCHIVE";

    const sealQuestion = document.querySelector("#seal h2");
    const sealInput = document.getElementById("pass");
    const sealMessage = document.getElementById("passmsg");

    sealQuestion.textContent =
      WX.world === "donghua"
        ? "“Which memory did you choose?”"
        : "“Which memory did you choose?”";

    sealInput.placeholder =
      WX.world === "donghua"
        ? "name the animation..."
        : "name the drama...";

    sealMessage.textContent = "the strings wait in silence.";
    sealInput.value = "";

    window.renderTimeline?.();
    go("seal");

    setTimeout(() => sealInput.focus(), 650);
  })
);
