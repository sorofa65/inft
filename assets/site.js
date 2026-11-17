// Shared download helper: works on PC, Android and iOS
window.saveBlob=async function(blob,name){const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
if(ios&&navigator.canShare){try{const f=new File([blob],name,{type:blob.type});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return}}catch(e){if(e&&e.name==='AbortError')return}}
const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),8000)};
// Shared header (logo + menu) and banner for every page
(function(){if(/embed/.test(location.search))return;
const S=document.currentScript,D=S?S.dataset:{},cur=location.pathname.split('/').pop()||'index.html';
const N=[['index.html','হোম'],['schedule.html','শিডিউল'],['rules.html','নিয়ম ও ফি'],['register.html','রেজিস্ট্রেশন'],['card.html','প্লেয়ার কার্ড'],['lineup.html','লাইনআপ'],['index.html#contact','যোগাযোগ']];
const st=document.createElement('style');st.textContent=`html{scroll-padding-top:70px}.bar{top:56px!important}
.sh{position:sticky;top:0;z-index:60;background:#061a3d;border-bottom:3px solid #f4d000;font-family:'Hind Siliguri',Poppins,sans-serif}.si{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:5px 12px;height:56px}
.sb{display:flex;align-items:center;gap:8px;color:#fff;text-decoration:none;font:800 20px/1 Poppins,sans-serif}.sb img{height:42px;width:auto}.sb small{display:block;font:600 12px 'Hind Siliguri',sans-serif;color:#f4d000;margin-top:2px}
#sn{display:flex;gap:2px;margin-left:auto}#sn a{color:#dbe6ff;padding:8px 11px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none}#sn a.on,#sn a:hover{background:#0e4fa3;color:#fff}
.sr{background:#f4d000;color:#111;padding:8px 14px;border-radius:20px;font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap}#sm{display:none;background:none;border:0;color:#fff;font-size:28px;line-height:1;padding:0 4px}
.sx{background:linear-gradient(#061a3dc0,#061a3df0),url(assets/banner.jpg) center/cover;color:#fff;text-align:center;padding:26px 14px;font-family:'Hind Siliguri',Poppins,sans-serif}.sx h1{margin:0;font-size:clamp(24px,5vw,38px);font-weight:700}.sx p{margin:4px 0 0;color:#dbe6ff;font-size:15px}
@media(max-width:860px){#sn{display:none;position:absolute;top:56px;left:0;right:0;background:#061a3d;flex-direction:column;padding:8px 12px 14px;border-bottom:3px solid #f4d000}#sn.open{display:flex}#sn a{padding:12px}#sm{display:block}.sr{margin-left:auto}}`;
document.head.appendChild(st);
if(!document.querySelector('link[href*="Hind+Siliguri"]')&&!document.querySelector('style')?.textContent.includes('Hind+Siliguri')){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;600;700&family=Poppins:wght@700;800&display=swap';document.head.appendChild(l)}
const h=document.createElement('header');h.className='sh no-print';
h.innerHTML=`<div class="si"><a class="sb" href="index.html"><img src="assets/logo_sm.png" alt="INFT লোগো"><span>INFT<small>সিজন ৩</small></span></a><nav id="sn">${N.map(n=>`<a href="${n[0]}" class="${n[0]===cur?'on':''}">${n[1]}</a>`).join('')}</nav><a class="sr" href="register.html">রেজিস্ট্রেশন</a><button id="sm" aria-label="মেনু">☰</button></div>`;
document.body.prepend(h);h.querySelector('#sm').onclick=()=>h.querySelector('#sn').classList.toggle('open');h.querySelectorAll('#sn a').forEach(a=>a.onclick=()=>h.querySelector('#sn').classList.remove('open'));
if(D.banner!=='0'&&D.title){const b=document.createElement('div');b.className='sx no-print';b.innerHTML=`<h1>${D.title}</h1>${D.sub?`<p>${D.sub}</p>`:''}`;h.after(b)}})();
