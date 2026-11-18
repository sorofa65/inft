// Shared: rules, fee info, A4 sheets (Bangla+English), PDF/JPG builder
const FEE={t:3500,a:2000,d:1500,pay:'01927511157',wa:'01770034218'};
const bn=n=>String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
const $=i=>document.getElementById(i),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PR=[['কিক অফ','কিক অফের মাধ্যমে খেলা শুরু হবে এবং কিক-অফটি ওয়ান স্টেপে করতে হবে।'],
['ফ্রি কিক','একটি প্লেয়ার ফাউল করলে বিপক্ষ দল ফ্রি কিক পাবে এবং সেটি ওয়ান স্টেপে কিক করতে হবে।'],
['থ্রো ইন','ফুটবলে সাধারণত বল লাইন ক্রস করলে থ্রো ইন করা হয়; এক্ষেত্রে থ্রো ইনের বদলে কিক ইন হবে এবং তা অবশ্যই ওয়ান স্টেপে কিক করতে হবে।'],
['পেনাল্টি','কোনো টিম পেনাল্টি পেলে নির্দিষ্ট দূরত্ব থেকে ওয়ান স্টেপে কিক করতে হবে।'],
['কর্নার কিক','কর্নার কিকটি ওয়ান স্টেপে কিক করতে হবে।'],
['ওয়ান স্টেপ কিক','ওয়ান স্টেপ কিক সাধারণত এক পা মাটিতে রেখে অপর পা দিয়ে করতে হয়, অর্থাৎ একটি পা মাটিতে থাকবে এবং অপর পা দিয়ে কিক করতে হবে। অন্যথায় একবার সতর্ক করার পর পরবর্তীতে আবার একই ভুল করলে বিপক্ষ দল ফ্রি কিক/কিক ইন পাবে।']];
const RL=['প্রতিটি দলে মোট ১২ জন প্লেয়ার থাকবে — গোলরক্ষকসহ ৮ জন মূল দলে (মাঠে) এবং ৪ জন অতিরিক্ত (সাব) প্লেয়ার।',
'প্রতি ম্যাচে সর্বোচ্চ তিন জন প্লেয়ার বদলি (সাবস্টিটিউট) হিসেবে নামানো যাবে। রোলিং সাবস্টিটিউট নেই।',
'কোনো প্লেয়ার একটি ম্যাচে রেড কার্ড খেলে পরবর্তী ম্যাচ খেলতে ৩০০ টাকা জরিমানা দিয়ে খেলতে হবে।',
'আয়োজকদের উপস্থিতিতে একবারই লটারি হবে। ১৬ (ষোল)টি দল ৪টি ব্লকে (প্রতি ব্লকে ৪ দল) ভাগ হবে এবং আগে থেকে নির্ধারিত শিডিউল অনুযায়ী খেলা হবে। খেলা সরাসরি নকআউট — যে দল হারবে সে দল টুর্নামেন্ট থেকে বাদ; আর আলাদা লটারি হবে না।','মাঠ ফি জমা দিয়ে মাঠে প্রবেশ করতে হবে।','অবশ্যই বল এবং জার্সি আনতে হবে।',
'রেফারির সিদ্ধান্তই চূড়ান্ত সিদ্ধান্ত বলে গণ্য হবে।','এক দলের প্লেয়ার অন্য দলে খেলতে চাইলে ৪০০ টাকা ট্রান্সফার ফি জমা দিয়ে মাঠে নামতে হবে।',
'প্রত্যেক দলকে খেলা শুরু হওয়ার ৩০ মিনিট পূর্বে উপস্থিত হতে হবে।','কোনো দলের কোনো প্রকার অভিযোগ থাকলে সরাসরি কমিটির সাথে আলোচনা করতে হবে।',
'কোনো খেলোয়াড় রেফারির সাথে বেয়াদবি করলে অথবা খেলার সৌন্দর্য নষ্ট করলে কমিটি ওই খেলোয়াড়কে ম্যাচ নিষিদ্ধ কিংবা জরিমানা করার অধিকার রাখে।',
'খেলা ফ্লাডলাইটে অনুষ্ঠিত হবে এবং লোডশেডিং হলে খেলা অপেক্ষমাণ থাকবে; এ ক্ষেত্রে কমিটির সিদ্ধান্তই চূড়ান্ত হবে।'];
const FR=[`এন্ট্রি ফি <b>${bn(FEE.t)} টাকা</b>। মাঠের খরচ হিসাব করেই ফি নির্ধারণ করা হয়েছে, তাই ফি কমানোর কোনো সুযোগ নেই।`,
`ফর্ম নিয়ে দল কনফার্ম করতে <b>${bn(FEE.a)} টাকা অগ্রিম</b> বিকাশ/নগদে পাঠাতে হবে: <b>${bn(FEE.pay)}</b> (বিকাশ ও নগদ)।`,
`বাকি <b>${bn(FEE.d)} টাকা</b> যে দিন খেলা, সেদিন খেলার আগেই জমা দিতে হবে। বাকি টাকা না দিলে খেলতে দেওয়া হবে না।`,
`চাইলে পুরো <b>${bn(FEE.t)} টাকা</b> একবারে দিয়ে দল কনফার্ম করা যাবে — এটাই সবচেয়ে ভালো।`,
`যোগাযোগ ও টাকা জমার জন্য শুধু উপরের বিকাশ/নগদ নম্বর এবং হোয়াটসঅ্যাপ <b>${bn(FEE.wa)}</b> ব্যবহার করুন। অন্য কোনো নম্বরে যোগাযোগ বা টাকা পাঠাবেন না।`,
'টাকা জমা না দিলে দল কনফার্ম হবে না।'];
const li=a=>a.map(x=>`<li>${x}</li>`).join('');
const prHTML=()=>PR.map(([h,t])=>`<li><b>${h}ঃ</b> ${t}</li>`).join('');
const HD=`<div class="hd"><img src="assets/logo_bw.png"><div><h1>INFT</h1><p>ইমামবাড়ী নাইট ফুটবল টুর্নামেন্ট ২০২৬</p><p>Imambari Night Football Tournament · SEASON 3</p></div></div>`;
const FL=[['দলের নাম','Team Name'],['সংক্ষিপ্ত নাম','Short Name'],['ম্যানেজারের নাম','Manager Name'],['ক্যাপ্টেনের নাম','Captain Name'],['মোবাইল নম্বর','Contact No.'],['হোয়াটসঅ্যাপ নম্বর','WhatsApp No.'],['এলাকা / গ্রাম','Village / Area'],['জার্সির রং','Jersey Color'],['পেমেন্ট মাধ্যম (বিকাশ/নগদ)','Payment Method'],['সেন্ডার নম্বর / TrxID','Sender No. / TrxID'],['জমা দিয়েছেন (৳)','Amount Paid (৳)'],['তারিখ','Date']];
const SG=(a,b)=>`<div class="sg"><div>${a}</div><div>${b}</div><div>কমিটি / Authority</div></div>`;
function sheetForm(d){return `<div class="a4"><div class="fb">${HD}<div class="tt">দল নিবন্ধন ফরম / TEAM REGISTRATION FORM</div>
<div class="f">${FL.map((f,i)=>`<div class="fr"><div class="fl">${f[0]}<small>${f[1]}</small></div><div class="fc">:</div><div class="fv">${E(d.v[i])}</div></div>`).join('')}</div>
<table><colgroup><col style="width:15mm"><col><col style="width:18mm"><col style="width:28mm"><col style="width:30mm"></colgroup><tr><th>ক্রম<br>Sl</th><th>প্লেয়ারের নাম<br>Player Name</th><th>জার্সি<br>No</th><th>পজিশন<br>Position</th><th>স্বাক্ষর<br>Sign</th></tr>${Array.from({length:12},(_,i)=>{const p=d.pl[i]||[];return`<tr><td>${i<8?bn(i+1):'সাব '+bn(i-7)}</td><td class="v">${E(p[0])}</td><td class="v">${E(p[1])}</td><td class="v">${E(p[2])}</td><td></td></tr>`}).join('')}</table>
<p style="font-size:10.5px;margin:2px 0"><b>মূল দল ৮ জন (গোলরক্ষকসহ) + সাব ৪ জন = মোট ১২ জন · Main 8 + Sub 4 = 12</b></p>
<div class="bx"><b>ফি ও পেমেন্টের নিয়ম:</b><ol class="rl" style="font-size:10.5px;margin:2px 0">${li(FR)}</ol></div>${SG('ম্যানেজারের স্বাক্ষর / Manager','ক্যাপ্টেনের স্বাক্ষর / Captain')}</div></div>`}
function sheetRules(d){return `<div class="a4"><div class="fb">${HD}<div class="tt">খেলার নিয়মাবলী / MATCH RULES</div><ul class="rl" style="list-style:none;padding:0">${prHTML()}</ul><ol class="rl">${li(RL)}</ol>
<div class="tt" style="margin:8px 0">অঙ্গীকার পত্র / DECLARATION</div><p style="font-size:12px;line-height:1.9">আমি <span class="v">${E(d.v[3])||'………………………'}</span>, <span class="v">${E(d.v[0])||'………………………'}</span> ক্লাবের ক্যাপ্টেন, টিম ম্যানেজার <span class="v">${E(d.v[2])||'………………………'}</span>। উপরের সকল নিয়ম সম্পর্কে অবগত আছি এবং আমি ও আমার টিমের সকল প্লেয়ার নিয়মগুলো সর্বদা মেনে চলবো।</p>${SG('ক্যাপ্টেন / Captain','ম্যানেজার / Manager')}</div></div>`}
// Make sure every Bangla/Latin font is really loaded BEFORE the sheet is captured (otherwise text overlaps / jumbles)
async function fontsReady(){const t='অআইউএওকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ংঃঁ ক্ষ জ্ঞ ম্যা ১২৩৪৫৬৭৮৯০ ৳ Abc123';
 try{await Promise.all(['500 13px "Hind Siliguri"','600 13px "Hind Siliguri"','700 13px "Hind Siliguri"','700 13px Poppins','800 13px Poppins'].map(f=>document.fonts.load(f,t)))}catch(e){}
 try{await document.fonts.ready}catch(e){}}
async function cap(h){const o=$('o');o.innerHTML=h;await fontsReady();void o.offsetHeight;
 await Promise.all([...o.querySelectorAll('img')].map(i=>i.complete?1:new Promise(r=>i.onload=i.onerror=r)));
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 return html2canvas(o.firstChild,{scale:2,backgroundColor:'#fff',useCORS:true,logging:false,scrollX:0,scrollY:0,windowWidth:Math.max(document.documentElement.clientWidth,900)})}
function put(p,cv){p.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,210,297)}
async function build(d){const a=await cap(sheetForm(d)),b=await cap(sheetRules(d)),J=window.jspdf.jsPDF,N=()=>new J('p','mm','a4'),f=N(),r=N(),both=N();put(f,a);put(r,b);put(both,a);both.addPage();put(both,b);return{f,r,both,jpg:a.toDataURL('image/jpeg',.9)}}
const MOB=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
async function dlTwo(d,m){m.textContent='⏳ ফাইল তৈরি হচ্ছে…';const r=await build(d);
 if(MOB){await saveBlob(r.both.output('blob'),'INFT_Registration_Form_and_Rules.pdf');m.textContent='✅ ১টি PDF ডাউনলোড হয়েছে (ফর্ম + নিয়মাবলী)';return}
 await saveBlob(r.f.output('blob'),'INFT_Team_Registration_Form.pdf');setTimeout(async()=>{await saveBlob(r.r.output('blob'),'INFT_Match_Rules.pdf');m.textContent='✅ ২টি ফাইল ডাউনলোড হয়েছে (ফর্ম + নিয়মাবলী)'},900)}
