// Cloudflare Pages Function: /api/register -> Telegram (form jpg+pdf, payment screenshot, video)
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
export async function onRequestPost({request,env}){
  const f=await request.formData(); if(f.get('website'))return J({ok:true});
  const send=async(m,key,file,name,cap)=>{const b=new FormData();b.set('chat_id',env.TELEGRAM_CHAT_ID);if(cap)b.set('caption',cap.slice(0,1000));if(m==='sendVideo')b.set('supports_streaming','true');b.set(key,file,name);
    const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b});return r.json().catch(()=>({ok:false,description:'bad response'}))};
  const ip=request.headers.get('CF-Connecting-IP')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'}),failed=[];
  const cap=String(f.get('summary')||'')+`\n\n🕒 ${now}\n🌐 IP: ${ip}`;
  if(!f.get('jpg')){const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:cap})});return J({ok:r.ok,failed:[]},r.ok?200:502)}
  const a=await send('sendPhoto','photo',f.get('jpg'),'registration.jpg',cap);if(!a.ok)return J({ok:false,error:a.description},502);
  if(f.get('pdf')&&!(await send('sendDocument','document',f.get('pdf'),'registration_and_rules.pdf','📄 ফর্ম + নিয়মাবলী')).ok)failed.push('PDF');
  const s=f.get('shot');if(s&&s.size){let r=await send('sendPhoto','photo',s,'payment.jpg','💳 পেমেন্ট স্ক্রিনশট');if(!r.ok)r=await send('sendDocument','document',s,s.name||'payment','💳 পেমেন্ট স্ক্রিনশট');if(!r.ok)failed.push('স্ক্রিনশট')}
  const v=f.get('video');if(v&&v.size){let r=await send('sendVideo','video',v,v.name||'video.mp4','🎥 টিমের ভিডিও');if(!r.ok)r=await send('sendDocument','document',v,v.name||'video.mp4','🎥 টিমের ভিডিও');if(!r.ok)failed.push('ভিডিও')}
  return J({ok:true,failed});
}
