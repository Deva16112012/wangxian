const pages=[...document.querySelectorAll(".page")];
const veil=document.getElementById("veil");
let world="untamed";
let unsealed=false;
let ghostBusy=false;
let ghostTimer;

const timelineData={
  untamed:[
    {number:"01",place:"Cloud Recesses",title:"The first collision",image:"assets/images/collage.png",note:"The rules. The rooftop. The beginning of a memory you did not yet know you would keep."},
    {number:"02",place:"On the road",title:"Side by side",image:"assets/images/untamed.png",note:"Somewhere along the way, seeing them together stopped feeling temporary."},
    {number:"03",place:"Years between",title:"The melody remembers",image:"assets/images/grid.png",note:"You know what recognition means now. The first time, you did not."}
  ],
  donghua:[
    {number:"01",place:"Gusu",title:"A noisy beginning",image:"assets/images/rabbits.png",note:"Before you knew what every glance would become, there was only the beginning."},
    {number:"02",place:"Night hunt",title:"Two paths crossing",image:"assets/images/grid.png",note:"A remembered voice. A familiar argument. Two paths repeatedly finding the same road."},
    {number:"03",place:"Return",title:"Recognition",image:"assets/images/collage.png",note:"The strange ache of returning to a scene when you already understand everything it means."}
  ]
};

const ghostLines=[
  "…Wei Ying.",
  "Lan Zhan.",
  "You remember what happens next.",
  "Was it always this quiet?",
  "Don't skip this part.",
  "The melody was never forgotten.",
  "You knew this scene once.",
  "Somewhere, you are watching it for the first time.",
  "Ah. This part.",
  "You stayed.",
  "They are still here.",
  "The first time is gone. The memory is not."
];

function showPage(id){
  pages.forEach(p=>p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  scrollTo(0,0);
}
function go(id){
  veil.classList.remove("go"); void veil.offsetWidth; veil.classList.add("go");
  setTimeout(()=>showPage(id),480);
  if(unsealed && !["prologue","return","goodbye","choice","seal","threshold"].includes(id)) rollGhost();
}
document.addEventListener("click",e=>{
  const target=e.target.closest("[data-go]");
  if(target) go(target.dataset.go);
});

document.getElementById("notYet").addEventListener("click",()=>go("goodbye"));

document.querySelectorAll("[data-world]").forEach(button=>button.addEventListener("click",()=>{
  world=button.dataset.world;
  document.body.dataset.world=world;
  document.getElementById("worldmark").textContent=world==="donghua"?"魔道祖师":"陈情令";
  document.getElementById("worldtitle").textContent=world==="donghua"?"MO DAO ZU SHI · A MEMORY":"THE UNTAMED · A MEMORY";
  document.getElementById("pass").placeholder=world==="donghua"?"name the animation...":"name the drama...";
  renderTimeline();
  go("seal");
  setTimeout(()=>document.getElementById("pass").focus(),700);
}));

const normalize=value=>value.trim().toLowerCase().replace(/[\s_-]+/g,"");
const passwords={
  donghua:["modaozushi","魔道祖师","魔道祖師"],
  untamed:["theuntamed","陈情令","陳情令"]
};
document.getElementById("passform").addEventListener("submit",e=>{
  e.preventDefault();
  const input=document.getElementById("pass");
  const msg=document.getElementById("passmsg");
  if(passwords[world].map(normalize).includes(normalize(input.value))){
    msg.textContent="ah. you do remember.";
    unsealed=true;
    input.value="";
    setTimeout(()=>go("threshold"),650);
    scheduleGhost();
  }else{
    msg.textContent="no… that is not the memory you chose.";
    input.value="";
    input.focus();
  }
});

function renderTimeline(){
  document.getElementById("timelineList").innerHTML=timelineData[world].map(item=>`
    <article>
      <b>${item.number}</b>
      <div><small>${item.place}</small><h2>${item.title}</h2><p>${item.note}</p></div>
      <img src="${item.image}" alt="">
    </article>`).join("");
}
renderTimeline();

function showGhost(){
  if(!unsealed||ghostBusy)return;
  ghostBusy=true;
  const box=document.getElementById("ghostMemory");
  const text=document.getElementById("ghostText");
  text.textContent=ghostLines[Math.floor(Math.random()*ghostLines.length)];
  box.style.setProperty("--x",`${10+Math.random()*78}vw`);
  box.style.setProperty("--y",`${12+Math.random()*72}svh`);
  box.style.setProperty("--tilt",`${-3+Math.random()*6}deg`);
  box.classList.remove("show"); void box.offsetWidth; box.classList.add("show");
  setTimeout(()=>{box.classList.remove("show");ghostBusy=false},1450);
}
function rollGhost(){if(Math.random()<.05)showGhost()}
function scheduleGhost(){
  clearTimeout(ghostTimer);
  ghostTimer=setTimeout(()=>{rollGhost();scheduleGhost()},12000+Math.random()*18000);
}

const audio=document.getElementById("ambience");
const sound=document.getElementById("sound");
let soundOn=localStorage.getItem("wx-sound")==="on";
async function syncSound(){
  if(soundOn){try{await audio.play();sound.textContent="♫ ambience · on"}catch{soundOn=false}}
  if(!soundOn){audio.pause();sound.textContent="♫ ambience"}
}
sound.addEventListener("click",()=>{soundOn=!soundOn;localStorage.setItem("wx-sound",soundOn?"on":"off");syncSound()});
syncSound();

document.querySelectorAll(".gallery img").forEach(img=>img.addEventListener("click",()=>{
  document.getElementById("lightboxImage").src=img.src;
  document.getElementById("lightbox").classList.add("open");
}));
document.getElementById("closeLightbox").addEventListener("click",()=>document.getElementById("lightbox").classList.remove("open"));

const searchPanel=document.getElementById("searchPanel");
const searchInput=document.getElementById("searchInput");
const searchResults=document.getElementById("searchResults");
const searchable=[
  ["timeline","moments before after again cloud recesses melody recognition"],
  ["story","story rain rooftop melody years returns"],
  ["pictures","faces pictures fragments eye collage"],
  ["chaos","laughter memes chaos wei wuxian"],
  ["quiz","who stayed cultivator questions memory"],
  ["rabbits","rabbits symbol myth softness folklore"]
];
document.getElementById("openSearch").addEventListener("click",()=>{
  searchPanel.classList.add("open"); searchPanel.setAttribute("aria-hidden","false"); setTimeout(()=>searchInput.focus(),50);
});
document.getElementById("closeSearch").addEventListener("click",()=>searchPanel.classList.remove("open"));
searchInput.addEventListener("input",()=>{
  const q=searchInput.value.trim().toLowerCase();
  searchResults.innerHTML=!q?"":searchable.filter(([,text])=>text.includes(q)).map(([id])=>`<button class="search-result" data-result="${id}">return to ${id} →</button>`).join("");
});
searchResults.addEventListener("click",e=>{
  const result=e.target.closest("[data-result]"); if(!result)return;
  searchPanel.classList.remove("open"); go(result.dataset.result);
});

const quiz=[
  ["When a memory hurts, you…",["hold it quietly","make a joke","ask why","turn it into a promise"]],
  ["Choose a place.",["a silent library","a crowded market","a mountain path","somewhere no one knows me"]],
  ["Someone you love is in danger.",["stand beside them","act first","find the truth","protect everyone I can"]],
  ["Which stays longest?",["a song","a laugh","a question","a kindness"]],
  ["You are misunderstood.",["say nothing","get louder","prove them wrong","keep going"]],
  ["At the end, you hope to…",["be remembered","be free","understand","return home"]]
];
const results=[
  ["LAN WANGJI","You remember in silence. What stays with you becomes something steady—almost sacred."],
  ["WEI WUXIAN","You keep warmth alive by refusing to let grief have the final word."],
  ["LAN XICHEN","You look for the truth between what people say and what they cannot."],
  ["WEN NING","Your memory returns to gentleness: the quiet courage of staying kind."]
];
let qi=0,scores=[0,0,0,0];
function startQuiz(){qi=0;scores=[0,0,0,0];document.getElementById("quizIntro").hidden=true;document.getElementById("quizResult").hidden=true;document.getElementById("quizGame").hidden=false;drawQuiz()}
function drawQuiz(){
  document.getElementById("progress").textContent=`MEMORY ${String(qi+1).padStart(2,"0")} / 06`;
  document.getElementById("question").textContent=quiz[qi][0];
  document.getElementById("answers").innerHTML=quiz[qi][1].map((a,i)=>`<button data-answer="${i}">${a}</button>`).join("");
}
document.getElementById("answers").addEventListener("click",e=>{
  const a=e.target.closest("[data-answer]");if(!a)return;
  scores[+a.dataset.answer]++;qi++;
  if(qi<quiz.length)drawQuiz();else{
    const winner=scores.indexOf(Math.max(...scores));
    document.getElementById("quizGame").hidden=true;
    document.getElementById("quizResult").hidden=false;
    document.getElementById("resultTitle").textContent=results[winner][0];
    document.getElementById("resultText").textContent=results[winner][1];
  }
});
document.getElementById("beginQuiz").addEventListener("click",startQuiz);
document.getElementById("restartQuiz").addEventListener("click",startQuiz);
