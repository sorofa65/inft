// Netlify Function: /api/register -> Telegram (request body limit ~6 MB)
export const config={path:'/api/register'};
export default async (req)=>{
  if(req.method!=='POST')return new Response('no',{status:405});
  const f=await req.formData(); if(f.get('website'))return Response.json({ok:true});
  const e=process.env,tg=(m,b)=>fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b});
  const ip=req.headers.get('x-nf-client-connection-ip')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'});
  const a=new FormData();a.set('chat_id',e.TELEGRAM_CHAT_ID);a.set('caption',String(f.get('summary')||'').slice(0,850)+`\n\n🕒 ${now}\n🌐 IP: ${ip}`);
  a.set('photo',f.get('jpg'),'registration.jpg');const r=await tg('sendPhoto',a);
  if(f.get('pdf')){const b=new FormData();b.set('chat_id',e.TELEGRAM_CHAT_ID);b.set('document',f.get('pdf'),'registration.pdf');await tg('sendDocument',b)}
  return Response.json({ok:r.ok},{status:r.ok?200:502});
};
