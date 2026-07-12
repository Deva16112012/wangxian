const screens = [...document.querySelectorAll(".screen")];
const ambience = document.getElementById("ambience");
const sound = document.getElementById("sound");
const thought = document.getElementById("thought");
const thoughtText = thought.querySelector("span");

let world = null;
let memoryOpen = false;
let thoughtBusy = false;
let thoughtTimer;

const thoughts = [
  "Lan Zhan.",
  "Wei Ying.",
  "Don't skip this part.",
  "You remember what happens next.",
  "Was it always this quiet?",
  "Come back later.",
  "...",
  "The melody was never lost."
];

function show(id) {
  screens.forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  window.scrollTo(0, 0);
}

document.querySelector('[data-action="remember"]').addEventListener("click", () => show("world"));
document.querySelector('[data-action="not-yet"]').addEventListener("click", () => show("gone"));

document.querySelectorAll("[data-world]").forEach(button => {
  button.addEventListener("click", () => {
    world = button.dataset.world;
    document.body.dataset.world = world;
    const input = document.getElementById("sealInput");
    input.placeholder = world === "donghua" ? "name the animation..." : "name the drama...";
    document.getElementById("sealMessage").textContent = "";
    show("seal");
    setTimeout(() => input.focus(), 600);
  });
});

const normalize = value => value.trim().toLowerCase().replace(/[\s_-]+/g, "");
const passwords = {
  donghua: ["modaozushi", "魔道祖师", "魔道祖師"],
  untamed: ["theuntamed", "陈情令", "陳情令"]
};

document.getElementById("sealForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("sealInput");
  const message = document.getElementById("sealMessage");
  const okay = (passwords[world] || []).map(normalize).includes(normalize(input.value));

  if (!okay) {
    message.textContent = "Not that one.";
    input.value = "";
    input.focus();
    return;
  }

  message.textContent = "";
  show("threshold");
  setTimeout(() => {
    show("memory");
    memoryOpen = true;
    sound.classList.remove("hidden");
    ambience.volume = 0.34;
    ambience.play().catch(() => {});
    scheduleThought();
    observeMemories();
  }, 3400);
});

sound.addEventListener("click", async () => {
  if (ambience.paused) {
    await ambience.play().catch(() => {});
    sound.textContent = "sound, remembered";
  } else {
    ambience.pause();
    sound.textContent = "silence";
  }
});

document.getElementById("musicButton").addEventListener("click", async () => {
  await ambience.play().catch(() => {});
  sound.textContent = "sound, remembered";
});

function flashThought() {
  if (!memoryOpen || thoughtBusy) return;
  thoughtBusy = true;
  thoughtText.textContent = thoughts[Math.floor(Math.random() * thoughts.length)];
  thought.style.setProperty("--x", `${10 + Math.random() * 80}vw`);
  thought.style.setProperty("--y", `${12 + Math.random() * 76}svh`);
  thought.style.setProperty("--r", `${-2 + Math.random() * 4}deg`);
  thought.classList.remove("flash");
  void thought.offsetWidth;
  thought.classList.add("flash");
  setTimeout(() => {
    thought.classList.remove("flash");
    thoughtBusy = false;
  }, 1100);
}

function rollThought() {
  if (Math.random() < 0.05) flashThought();
}

function scheduleThought() {
  clearTimeout(thoughtTimer);
  thoughtTimer = setTimeout(() => {
    rollThought();
    scheduleThought();
  }, 90000 + Math.random() * 150000);
}

document.querySelectorAll("[data-jump]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.jump)?.scrollIntoView({behavior:"smooth"});
    rollThought();
  });
});

function observeMemories() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold: 0.16});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

const search = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

document.getElementById("searchOpen").addEventListener("click", () => {
  search.classList.add("open");
  search.setAttribute("aria-hidden", "false");
  setTimeout(() => searchInput.focus(), 100);
});
document.getElementById("searchClose").addEventListener("click", closeSearch);
function closeSearch() {
  search.classList.remove("open");
  search.setAttribute("aria-hidden", "true");
  searchInput.value = "";
  searchResults.innerHTML = "";
}

const searchable = [...document.querySelectorAll(".searchable")];
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!q) return;
  searchable
    .filter(el => `${el.dataset.search || ""} ${el.textContent}`.toLowerCase().includes(q))
    .slice(0, 8)
    .forEach(el => {
      const button = document.createElement("button");
      const heading = el.querySelector("h2,h3,figcaption,p");
      button.textContent = heading?.textContent.trim() || "A memory";
      button.addEventListener("click", () => {
        closeSearch();
        el.scrollIntoView({behavior:"smooth", block:"center"});
      });
      searchResults.appendChild(button);
    });
  if (!searchResults.children.length) {
    searchResults.innerHTML = "<p style='color:#777;font:italic 18px var(--serif)'>Maybe not today.</p>";
  }
});

const quiz = [
  {
    q:"When everything becomes too loud, what do you keep?",
    a:[
      ["The rule I know is right.","lan"],
      ["The person everyone else misunderstood.","wei"],
      ["The people I can still protect.","jiang"],
      ["The truth, even if I say little.","wen"]
    ]
  },
  {
    q:"What returns to you first?",
    a:[
      ["A melody.","lan"],
      ["A laugh.","wei"],
      ["A place that used to be home.","jiang"],
      ["A quiet act of kindness.","wen"]
    ]
  },
  {
    q:"You know the ending. Why do you stay?",
    a:[
      ["Because devotion changes the meaning of it.","lan"],
      ["Because joy survived somehow.","wei"],
      ["Because grief deserves to be remembered.","jiang"],
      ["Because small choices mattered.","wen"]
    ]
  }
];

const results = {
  lan:"Lan Wangji stayed with you. Maybe it was the quiet. Maybe it was everything the quiet contained.",
  wei:"Wei Wuxian stayed with you. Some people remain as laughter first, and ache second.",
  jiang:"Jiang Cheng stayed with you. Home, grief, anger—some memories refuse to become simple.",
  wen:"Wen Ning stayed with you. Perhaps you remembered the gentleness that survived."
};

let qi = 0;
let scores = {lan:0,wei:0,jiang:0,wen:0};
const quizBox = document.getElementById("quizBox");
const quizResult = document.getElementById("quizResult");

document.getElementById("quizStart").addEventListener("click", event => {
  event.currentTarget.classList.add("hidden");
  quizBox.classList.remove("hidden");
  qi = 0;
  scores = {lan:0,wei:0,jiang:0,wen:0};
  renderQuiz();
});

function renderQuiz() {
  const item = quiz[qi];
  document.getElementById("quizProgress").textContent = `${String(qi+1).padStart(2,"0")} / ${String(quiz.length).padStart(2,"0")}`;
  document.getElementById("quizQuestion").textContent = item.q;
  const answers = document.getElementById("quizAnswers");
  answers.innerHTML = "";
  item.a.forEach(([label,key]) => {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", () => {
      scores[key]++;
      qi++;
      if (qi < quiz.length) renderQuiz();
      else finishQuiz();
    });
    answers.appendChild(button);
  });
}

function finishQuiz() {
  quizBox.classList.add("hidden");
  const winner = Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0];
  quizResult.textContent = results[winner];
  quizResult.classList.remove("hidden");
}
