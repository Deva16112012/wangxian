const fade=document.querySelector(".fade");
function swapPage(id){WX.pages.forEach(p=>p.classList.remove("active"));document.getElementById(id).classList.add("active");scrollTo(0,0)}
window.go=function(id){if(document.startViewTransition){document.startViewTransition(()=>swapPage(id))}else{fade.classList.remove("go");void fade.offsetWidth;fade.classList.add("go");setTimeout(()=>swapPage(id),450)}}
document.addEventListener("click",e=>{const target=e.target.closest("[data-page]");if(target)go(target.dataset.page)});
function normalizePassword(v){return v.trim().toLowerCase().replace(/\s+/g,"")}
document.getElementById("passform").addEventListener("submit",e=>{e.preventDefault();const v=normalizePassword(document.getElementById("pass").value),m=document.getElementById("passmsg"),card=document.getElementById("sealCard");if(["wangxian","忘羡","忘羨"].includes(v)){m.textContent="you remember.";card.classList.add("breaking");setTimeout(()=>{card.classList.remove("breaking");maybeRevealRareMemory()},900)}else{m.textContent="the strings remain silent.";document.getElementById("pass").value=""}});
document.querySelectorAll("[data-world]").forEach(x=>x.addEventListener("click",()=>{WX.world=x.dataset.world;document.body.dataset.world=WX.world;document.getElementById("worldmark").textContent=WX.world==="donghua"?"魔道祖师":"陈情令";document.getElementById("worldtitle").textContent=WX.world==="donghua"?"MO DAO ZU SHI ARCHIVE":"THE UNTAMED ARCHIVE";window.renderTimeline?.();go("seal")}));
const rareMemories=[
  "Every day means every day.",
  "The melody was never forgotten.",
  "...Wei Ying."
];
function maybeRevealRareMemory(){
  if(Math.random()>=0.05){go("archive");return}
  const room=document.getElementById("rareMemory"),text=document.getElementById("rareMemoryText");
  text.textContent=rareMemories[Math.floor(Math.random()*rareMemories.length)];
  room.classList.add("show");room.setAttribute("aria-hidden","false");
  setTimeout(()=>room.classList.remove("show"),3800);
  setTimeout(()=>{room.setAttribute("aria-hidden","true");go("archive")},5200);
}
