// Cloudflare Pages Function: /api/photo -> Telegram channel (visitor-uploaded ground photos, name optional)
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
export async function onRequestPost({request,env}){
  const chat=env.TELEGRAM_PHOTO_CHAT_ID||env.TELEGRAM_CHAT_ID,f=await request.formData();if(f.get('website'))return J({ok:true});
  const files=f.getAll('photo').filter(x=>x&&x.size&&x.size<=5e6&&/^image\//.test(x.type||'image/jpeg')).slice(0,5);
  if(!files.length)return J({ok:false,error:'ছবি পাওয়া যায়নি'},400);
  const name=String(f.get('name')||'').replace(/[\r\n]+/g,' ').trim().slice(0,60)||'নাম দেননি';
  const ip=request.headers.get('CF-Connecting-IP')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'});
  const cap=`📸 মাঠের ছবি (${files.length}টি)\n👤 ${name}\n🕒 ${now}\n🌐 IP: ${ip}`;
  const api=(m,b)=>fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b}).then(r=>r.json()).catch(()=>({ok:false,description:'network'}));
  let r;
  if(files.length==1){const b=new FormData();b.set('chat_id',chat);b.set('caption',cap);b.set('photo',files[0],'photo.jpg');r=await api('sendPhoto',b)}
  else{const b=new FormData();b.set('chat_id',chat);b.set('media',JSON.stringify(files.map((_,i)=>({type:'photo',media:'attach://p'+i,...(i?{}:{caption:cap})}))));files.forEach((x,i)=>b.set('p'+i,x,`photo${i+1}.jpg`));r=await api('sendMediaGroup',b)}
  if(!r.ok){r={ok:true};for(const [i,x] of files.entries()){const b=new FormData();b.set('chat_id',chat);if(!i)b.set('caption',cap);b.set('document',x,`photo${i+1}.jpg`);const d=await api('sendDocument',b);if(!d.ok){r=d;break}}}
  return r.ok?J({ok:true}):J({ok:false,error:r.description||'Telegram error'},502);
}
