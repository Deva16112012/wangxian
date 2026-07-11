/* V4: six-memory personality quiz */
const quizQuestions=[
 {scene:"MEMORY / NIGHT HUNT",q:"The path ahead splits in two. Everyone tells you which road is proper. You...",a:[
  ["take the proper road. rules exist for a reason.","lan"],["ask who decided what “proper” means.","wei"],["walk beside the person who would otherwise go alone.","song"],["study both roads before moving.","nie"]]},
 {scene:"MEMORY / CLOUD RECESSES",q:"Someone you care about breaks a rule for a reason you understand.",a:[
  ["quietly stand between them and the consequences.","lan"],["help them. deal with the lecture later.","wei"],["find a compromise nobody else noticed.","song"],["tell them exactly why this was reckless—then help.","nie"]]},
 {scene:"MEMORY / A NAME UNSPOKEN",q:"You miss someone. What betrays you first?",a:[
  ["nothing. I become frighteningly good at silence.","lan"],["every joke becomes a little too loud.","wei"],["the tiny things I keep without meaning to.","song"],["I turn the feeling into work.","nie"]]},
 {scene:"MEMORY / THE BANQUET",q:"A room full of people has completely misunderstood you.",a:[
  ["let them. truth does not become false because they missed it.","lan"],["make it worse on purpose. for enrichment.","wei"],["find the one person actually listening.","song"],["correct the record with evidence.","nie"]]},
 {scene:"MEMORY / RABBITS",q:"You are given two rabbits. This is now your problem. What happens?",a:[
  ["they receive names, a schedule, and immaculate care.","lan"],["I was told there were two. why are there seven now?","wei"],["I take approximately four hundred photographs.","song"],["I research rabbit care for six hours first.","nie"]]},
 {scene:"MEMORY / ONE MELODY",q:"If one memory could follow you through every lifetime, what would you keep?",a:[
  ["a promise kept when nobody was watching.","lan"],["the sound of someone laughing without fear.","wei"],["a quiet moment that looked ordinary to everyone else.","song"],["the moment everything finally made sense.","nie"]]}
];
const quizResults={
 lan:{cn:"静",title:"THE QUIET VOW",text:"You remember through loyalty. You may say little, but once someone has a place in your heart, your choices speak with alarming clarity.",traits:["STEADFAST","OBSERVANT","SECRETLY SOFT"]},
 wei:{cn:"火",title:"THE UNTAMED SPARK",text:"You remember through feeling, noise and impossible momentum. You question the shape of every rule and somehow leave the archive with three rabbits.",traits:["DEFIANT","BRILLIANT","CHAOTIC GOOD"]},
 song:{cn:"忆",title:"THE KEEPER OF SMALL THINGS",text:"You remember details other people walk past: a sleeve brushing a hand, an unfinished sentence, a song heard once. The archive trusts you with its softest rooms.",traits:["SENTIMENTAL","PERCEPTIVE","MEMORY KEEPER"]},
 nie:{cn:"理",title:"THE HIDDEN STRATEGIST",text:"You survive by noticing patterns. While everyone else is having a dramatic rooftop moment, you have already identified the structural problem and made a document.",traits:["ANALYTICAL","PREPARED","DEEPLY TIRED"]}
};
let quizStep=0,quizScores={lan:0,wei:0,song:0,nie:0};
const qi=document.getElementById("quizIntro"),qr=document.getElementById("quizRunner"),qe=document.getElementById("quizEnding");
function renderQuestion(){
 const item=quizQuestions[quizStep];
 document.getElementById("quizCount").textContent=`MEMORY ${String(quizStep+1).padStart(2,"0")} / ${String(quizQuestions.length).padStart(2,"0")}`;
 document.getElementById("quizBar").style.width=`${((quizStep+1)/quizQuestions.length)*100}%`;
 document.getElementById("quizScene").textContent=item.scene;
 document.getElementById("quizQuestion").textContent=item.q;
 const box=document.getElementById("quizAnswers");
 box.innerHTML=item.a.map((x,i)=>`<button data-kind="${x[1]}"><span>${String.fromCharCode(65+i)}.</span> ${x[0]}</button>`).join("");
 box.querySelectorAll("button").forEach(b=>b.onclick=()=>{quizScores[b.dataset.kind]++;quizStep++;if(quizStep<quizQuestions.length)renderQuestion();else finishQuiz()});
}
function finishQuiz(){
 qr.hidden=true;qe.hidden=false;
 const winner=Object.entries(quizScores).sort((a,b)=>b[1]-a[1])[0][0],r=quizResults[winner];
 document.getElementById("resultCn").textContent=r.cn;document.getElementById("resultTitle").textContent=r.title;
 document.getElementById("resultText").textContent=r.text;document.getElementById("resultTraits").innerHTML=r.traits.map(x=>`<span>${x}</span>`).join("");
}
document.getElementById("startQuiz").onclick=()=>{qi.hidden=true;qr.hidden=false;renderQuestion()};
document.getElementById("restartQuiz").onclick=()=>{quizStep=0;quizScores={lan:0,wei:0,song:0,nie:0};qe.hidden=true;qr.hidden=false;renderQuestion()};
