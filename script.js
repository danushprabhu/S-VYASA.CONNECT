const timetable = {
  MON:[
    ['09:00 AM','Operating Systems','LH-102','Dr. Meera','Done'],
    ['10:00 AM','Database Management','LH-102','Prof. Arun','Done'],
    ['11:15 AM','Data Structures','LH-102','Prof. Kavya','Next'],
    ['01:00 PM','Web Technology','LH-102','Prof. Rahul','1:00 PM'],
    ['02:00 PM','Computer Networks','Lab 3','Prof. Rahul','Changed']
  ],
  TUE:[
    ['09:00 AM','DBMS','LH-102','Prof. Arun','09:00 AM'],
    ['10:00 AM','Computer Networks','LH-204','Prof. Rahul','10:00 AM'],
    ['11:15 AM','Data Structures','LH-102','Prof. Kavya','11:15 AM'],
    ['01:00 PM','Web Technology','LH-102','Prof. Rahul','01:00 PM']
  ],
  WED:[
    ['09:00 AM','Mathematics','LH-205','Dr. Priya','09:00 AM'],
    ['10:00 AM','Operating Systems','Lab 2','Dr. Meera','10:00 AM'],
    ['02:00 PM','DBMS','LH-102','Prof. Arun','02:00 PM']
  ],
  THU:[
    ['09:00 AM','Computer Networks','LH-102','Prof. Rahul','09:00 AM'],
    ['11:15 AM','Data Structures','LH-204','Prof. Kavya','11:15 AM'],
    ['02:00 PM','Mathematics','LH-205','Dr. Priya','02:00 PM']
  ],
  FRI:[
    ['09:00 AM','Operating Systems','Lab 2','Dr. Meera','09:00 AM'],
    ['10:00 AM','DBMS','LH-102','Prof. Arun','10:00 AM'],
    ['11:15 AM','Computer Networks','LH-204','Prof. Rahul','11:15 AM']
  ]
};

const eventData=[
 {cat:'academic',date:'TODAY · 4 PM',icon:'🎤',title:'Tech Talk 2026',desc:'AI, careers and emerging technology · Seminar Hall'},
 {cat:'sports',date:'TOMORROW · 3 PM',icon:'🏀',title:'Inter-College Basketball',desc:'College Ground · Team practice & fixtures'},
 {cat:'innovation',date:'SATURDAY · 10 AM',icon:'💡',title:'Campus Hackathon',desc:'Innovation Lab · Build, pitch and win'},
 {cat:'culture',date:'FRIDAY · 6 PM',icon:'🎭',title:'Cultural Night',desc:'Open Auditorium · Music, dance and performances'}
];

const rooms=[
 ['LH-102','Occupied','Data Structures · 11:15 AM'],
 ['Lab 3','Available','Free until 2:00 PM'],
 ['Seminar Hall','Available','Free until 4:00 PM'],
 ['Room 204','Maintenance','Network switch maintenance'],
 ['LH-205','Available','Free now'],
 ['Innovation Lab','Occupied','Hackathon preparation']
];

let lastAnswer='';
let currentDay=localStorage.getItem('cc_day') || 'MON';
let selectedRole=localStorage.getItem('cc_role') || 'Student';

/* ---------- Events ---------- */
function renderEvents(filter='all'){
 const el=document.getElementById('eventList'); if(!el)return;
 el.innerHTML=eventData
  .filter(e=>filter==='all'||e.cat===filter)
  .map((e,i)=>`<article class="event-item">
   <div class="event-date">${e.date}</div>
   <div><div class="badge">${e.cat.toUpperCase()}</div><h3>${e.icon} ${e.title}</h3><p>${e.desc}</p></div>
   <button onclick="showDemo('${escapeAttr(e.title)}','${escapeAttr(e.desc)}')">View Details →</button>
  </article>`).join('');
}
function filterEvents(cat,el){
 document.querySelectorAll('.event-filter').forEach(x=>x.classList.remove('active'));
 if(el)el.classList.add('active'); renderEvents(cat);
}

/* ---------- Rooms ---------- */
function renderRooms(){
 const el=document.getElementById('roomGrid'); if(!el)return;
 el.innerHTML=rooms.map(r=>`<article class="room-card">
  <div class="room-top"><b>${r[0]}</b><span class="room-status ${r[1].toLowerCase().replace(/\s/g,'-')}">${r[1]}</span></div>
  <p>${r[2]}</p>
 </article>`).join('');
}
function showRooms(){renderRooms();document.querySelector('.room-section')?.scrollIntoView({behavior:'smooth'});}

/* ---------- Roles ---------- */
const roleData={
 Student:['Student Mode','Classes, study material, events, rooms, faculty chat & Campus AI.','89% Attendance','5 Classes Today','3 New Alerts'],
 Faculty:['Faculty Mode','Manage classes, rooms, announcements and student support.','12 Classes','4 Room Alerts','8 Messages'],
 Parent:['Parent Mode','Stay updated on attendance, events and achievements.','89% Attendance','3 Achievements','2 Events'],
 Admin:['Admin Mode','Campus-wide schedules, room availability and announcements.','24 Rooms','7 Alerts','18 Events']
};
function setRole(el,role){
 selectedRole=role;localStorage.setItem('cc_role',role);
 document.querySelectorAll('.role').forEach(x=>x.classList.remove('active'));
 if(el)el.classList.add('active');
 const d=roleData[role]||roleData.Student;
 const panel=document.getElementById('rolePanel');
 if(panel)panel.innerHTML=`<div><b>${d[0]}</b><span>${d[1]}</span></div><strong>${d[2]}</strong><strong>${d[3]}</strong><strong>${d[4]}</strong>`;
}

/* ---------- Timetable ---------- */
function renderTimetable(day=currentDay){
 currentDay=day;localStorage.setItem('cc_day',day);
 const rows=timetable[day]||timetable.MON;
 const table=document.querySelector('.timetable'); if(!table)return;
 table.querySelector('.table-head').innerHTML=`<b>${day}DAY · SEC A</b><span>Campus Schedule</span>`;
 table.querySelectorAll('.slot').forEach(x=>x.remove());
 rows.forEach(r=>{
  const div=document.createElement('div');
  div.className='slot '+(r[4]==='Next'?'next ':'')+(r[4]==='Changed'?'shift':'');
  div.innerHTML=`<span>${r[0]}</span><div><b>${r[1]}</b><small>${r[2]} · ${r[3]}</small></div><em>${r[4]}</em>`;
  table.appendChild(div);
 });
 document.querySelectorAll('.day').forEach(x=>x.classList.toggle('active',x.textContent.trim()===day));
 const info=document.querySelector('.mini-info');
 if(info)info.innerHTML=`<b>${rows.length} slots</b><span>${day} timetable loaded locally</span>`;
}
function initDays(){
 document.querySelectorAll('.day').forEach(btn=>{
  btn.addEventListener('click',()=>renderTimetable(btn.textContent.trim()));
 });
}

/* ---------- Bees AI ---------- */
function answer(q){
 q=q.toLowerCase();
 if(q.includes('event')||q.includes('today'))return 'Today: 🎤 Tech Talk 2026 at 4:00 PM in the Seminar Hall. Tomorrow: 🏀 Inter-College Basketball at 3:00 PM.';
 if(q.includes('next class')||q.includes('class'))return 'Your next class is Data Structures at 11:15 AM in LH-102 with Prof. Kavya.';
 if(q.includes('shift')||q.includes('change'))return '⚠ Computer Networks has shifted from Room 204 to Lab 3 (Ground Floor, Tech Block) at 2:00 PM.';
 if(q.includes('room')||q.includes('available')||q.includes('free'))return '🚪 Available now: Lab 3, Seminar Hall and LH-205. Room 204 is under maintenance.';
 if(q.includes('sport')||q.includes('basket'))return '🏆 Basketball practice is today. Inter-College Basketball is tomorrow at 3:00 PM on the College Ground.';
 if(q.includes('material')||q.includes('ppt')||q.includes('study'))return '📚 Study Hub: Data Structures, Computer Networks, DBMS, Operating Systems and Web Technology materials.';
 if(q.includes('hackathon')||q.includes('hack')||q.includes('innovation'))return '💡 Hackathon update: registrations are open for the S-VYASA Campus Hackathon 2026 at the Innovation Lab on Saturday at 10:00 AM. Team size: 2–4 students.';
 if(q.includes('achievement'))return '🏆 Recent achievements: Basketball runners-up, Hackathon finalist team and inter-department coding challenge winner.';
 if(q.includes('meeting'))return '📢 Faculty coordination meeting: Friday at 5:30 PM in the Seminar Hall.';
 if(q.includes('hello')||q.includes('hi'))return 'Hi! I’m Bees 🐝. Ask me about classes, rooms, events, sports, materials or campus updates.';
 return 'I can help with events, classes, classroom shifts, rooms, study materials, sports, achievements, hackathons and campus updates.';
}
function addBubble(text,cls){
 const box=document.getElementById('chatBody');if(!box)return;
 const b=document.createElement('div');b.className='bubble '+cls;b.textContent=text;box.appendChild(b);box.scrollTop=box.scrollHeight;
}
function sendChat(e){
 e.preventDefault();const input=document.getElementById('chatInput');if(!input)return;
 const q=input.value.trim();if(!q)return;addBubble(q,'user-bubble');input.value='';
 setTimeout(()=>{lastAnswer=answer(q);addBubble(lastAnswer,'genie-bubble');saveChat()},220);
}
function askQuick(q){const i=document.getElementById('chatInput');if(i){i.value=q;sendChat({preventDefault(){}})}}
function speakLast(){if(lastAnswer&&'speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(lastAnswer));}}
function startVoice(){
 if(!('webkitSpeechRecognition'in window||'SpeechRecognition'in window)){showDemo('Voice Demo','Voice recognition is not supported by this browser. Chrome or Edge normally supports it.');return;}
 const R=window.SpeechRecognition||window.webkitSpeechRecognition,r=new R();
 r.lang='en-IN';r.interimResults=false;r.maxAlternatives=1;
 r.onstart=()=>showDemo('Listening…','Speak your question now. Bees will process it when you finish.');
 r.onerror=()=>showDemo('Voice Error','Microphone access was unavailable. Please allow microphone permission and try again.');
 r.onresult=e=>askQuick(e.results[0][0].transcript);r.start();
}

/* ---------- Faculty Chat ---------- */
function selectFaculty(el,name){
 document.querySelectorAll('.faculty').forEach(x=>x.classList.remove('active'));if(el)el.classList.add('active');
 document.getElementById('facultyName').textContent=name;
 document.getElementById('doubtMessages').innerHTML=`<div class="bubble">Hi! I'm ${name}. Send your academic doubt and I'll respond in this demo.</div>`;
 localStorage.setItem('cc_faculty',name);
}
function sendDoubt(e){
 e.preventDefault();const i=document.getElementById('doubtInput'),q=i.value.trim();if(!q)return;
 const box=document.getElementById('doubtMessages'),name=document.getElementById('facultyName').textContent;
 box.innerHTML+=`<div class="bubble user-bubble">${escapeHtml(q)}</div><div class="bubble">Thanks! Your doubt is received by ${escapeHtml(name)}. A real backend can route this to the faculty account.</div>`;
 i.value='';box.scrollTop=box.scrollHeight;localStorage.setItem('cc_last_doubt',q);
}

/* ---------- Modal / Login ---------- */
function showDemo(title,text){
 const m=document.getElementById('modalContent');if(!m)return;
 m.innerHTML=`<p class="eyebrow">CAMPUSCONNECT</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><button class="btn primary" onclick="closeModal()">Got it</button>`;
 document.getElementById('modal').classList.add('show');
}
function openLogin(){
 document.getElementById('modalContent').innerHTML=`<p class="eyebrow">CAMPUSCONNECT LOGIN</p><h2>Enter your campus.</h2>
 <p>Select your demo account type. Your choice is saved in this browser.</p>
 <div class="login-grid">
 <button onclick="demoLogin('Student')">🎓 Student</button><button onclick="demoLogin('Faculty')">👨‍🏫 Faculty</button>
 <button onclick="demoLogin('Parent')">👪 Parent</button><button onclick="demoLogin('Admin')">⚙ Admin</button></div>`;
 document.getElementById('modal').classList.add('show');
}
function demoLogin(role){
 closeModal();const btn=[...document.querySelectorAll('.role')].find(x=>x.textContent.includes(role));
 setRole(btn,role);showDemo('Welcome to CampusConnect',`${role} demo mode is active. Your preferences are saved locally.`);
}
function closeModal(){document.getElementById('modal')?.classList.remove('show');}
function dismissAlert(btn){btn?.closest('.alert-strip')?.remove();localStorage.setItem('cc_alert_dismissed','1');}
function toggleMenu(){document.getElementById('nav')?.classList.toggle('open');}

/* ---------- Small service actions ---------- */
function serviceAction(type){
 const data={
 classroom:['My Classroom','Current: LH-102 · Next: Data Structures at 11:15 AM.'],
 faculty:['Faculty Chat','Scroll to Doubt Support to select a faculty member and send a question.'],
 materials:['Study PPTs','Available demo subjects: Data Structures, CN, DBMS, OS and Web Technology.'],
 notifications:['Notifications','3 alerts: CN Lab shift, Tech Talk reminder and Basketball practice update.'],
 achievements:['Achievements','Academic, sports, cultural and innovation achievements can be tracked here.'],
 videos:['Campus Videos','Event videos and campus highlights can be connected to your media storage.'],
 info:['General Information','Meetings, classroom shifts, announcements and important campus information.']
 };
 const d=data[type];if(d)showDemo(d[0],d[1]);
}
function showHackathonUpdate(){showDemo('Hackathon Update','Registrations are open. Team formation: 2–4 students. Venue: Innovation Lab. Saturday · 10:00 AM.');}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(s){return String(s).replace(/'/g,"&#39;").replace(/"/g,'&quot;');}
function saveChat(){localStorage.setItem('cc_chat_saved','1');}

/* ---------- Startup ---------- */
document.addEventListener('DOMContentLoaded',()=>{
 const roleBtn=[...document.querySelectorAll('.role')].find(x=>x.textContent.includes(selectedRole));
 setRole(roleBtn,selectedRole);
 initDays();renderTimetable(currentDay);renderEvents();renderRooms();

 if(localStorage.getItem('cc_alert_dismissed')){
   document.querySelector('.alert-strip')?.remove();
 }
 document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav')?.classList.remove('open')));
 document.getElementById('modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
});
