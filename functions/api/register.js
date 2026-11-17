// Cloudflare Pages Function: /api/register  -> Telegram
export async function onRequestPost({request,env}){
  const f=await request.formData(); if(f.get('website')) return new Response('{"ok":true}');
  const tg=(m,b)=>fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b});
  const ip=request.headers.get('CF-Connecting-IP')||'?', now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'});
  const a=new FormData(); a.set('chat_id',env.TELEGRAM_CHAT_ID);
  a.set('caption',(String(f.get('summary')||'').slice(0,850))+`\n\n🕒 ${now}\n🌐 IP: ${ip}`);
  a.set('photo',f.get('jpg'),'registration.jpg'); const r=await tg('sendPhoto',a);
  const b=new FormData(); b.set('chat_id',env.TELEGRAM_CHAT_ID); if(f.get('pdf')){b.set('document',f.get('pdf'),'registration.pdf'); await tg('sendDocument',b)}
  const j=await r.json().catch(()=>({}));return new Response(JSON.stringify({ok:r.ok,error:j.description||''}),{status:r.ok?200:502,headers:{'content-type':'application/json'}});
}
