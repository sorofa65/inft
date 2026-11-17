// Netlify Function: /api/photo -> Telegram channel (visitor-uploaded ground photos, name optional)
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  (optional TELEGRAM_PHOTO_CHAT_ID = separate channel just for photos)
export const config={path:'/api/photo'};
export default async(req)=>{
  if(req.method!=='POST')return new Response('no',{status:405});
  const e=process.env,chat=e.TELEGRAM_PHOTO_CHAT_ID||e.TELEGRAM_CHAT_ID;
  const f=await req.formData();if(f.get('website'))return Response.json({ok:true});
  const files=f.getAll('photo').filter(x=>x&&x.size&&x.size<=5e6&&/^image\//.test(x.type||'image/jpeg')).slice(0,5);
  if(!files.length)return Response.json({ok:false,error:'ছবি পাওয়া যায়নি'},{status:400});
  const name=String(f.get('name')||'').replace(/[\r\n]+/g,' ').trim().slice(0,60)||'নাম দেননি';
  const ip=req.headers.get('x-nf-client-connection-ip')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'});
  const cap=`📸 মাঠের ছবি (${files.length}টি)\n👤 ${name}\n🕒 ${now}\n🌐 IP: ${ip}`;
  const api=(m,b)=>fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b}).then(r=>r.json()).catch(()=>({ok:false,description:'network'}));
  let r;
  if(files.length==1){const b=new FormData();b.set('chat_id',chat);b.set('caption',cap);b.set('photo',files[0],'photo.jpg');r=await api('sendPhoto',b)}
  else{const b=new FormData();b.set('chat_id',chat);b.set('media',JSON.stringify(files.map((_,i)=>({type:'photo',media:'attach://p'+i,...(i?{}:{caption:cap})}))));files.forEach((x,i)=>b.set('p'+i,x,`photo${i+1}.jpg`));r=await api('sendMediaGroup',b)}
  if(!r.ok){ // fallback: send as documents (no size/dimension limits)
    r={ok:true};for(const [i,x] of files.entries()){const b=new FormData();b.set('chat_id',chat);if(!i)b.set('caption',cap);b.set('document',x,`photo${i+1}.jpg`);const d=await api('sendDocument',b);if(!d.ok){r=d;break}}}
  return r.ok?Response.json({ok:true}):Response.json({ok:false,error:r.description||'Telegram error'},{status:502});
};
