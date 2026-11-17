// Netlify Function: /api/register -> Telegram (request body limit ~6 MB)
export const config={path:'/api/register'};
export default async (req)=>{
  if(req.method!=='POST')return new Response('no',{status:405});
  const f=await req.formData(); if(f.get('website'))return Response.json({ok:true});
  const e=process.env;
  if(!e.TELEGRAM_BOT_TOKEN||!e.TELEGRAM_CHAT_ID)return Response.json({ok:false,error:'Netlify env variables missing (redeploy after adding)'},{status:500});
  const tg=(m,b)=>fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b});
  const ip=req.headers.get('x-nf-client-connection-ip')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'});
  const a=new FormData();a.set('chat_id',e.TELEGRAM_CHAT_ID);
  a.set('caption',String(f.get('summary')||'').slice(0,850)+`\n\n🕒 ${now}\n🌐 IP: ${ip}`);
  a.set('photo',f.get('jpg'),'registration.jpg');
  let r=await tg('sendPhoto',a);
  if(!r.ok){
    console.log('sendPhoto failed',r.status,await r.clone().text());
    const d=new FormData();d.set('chat_id',e.TELEGRAM_CHAT_ID);d.set('caption',a.get('caption'));d.set('document',f.get('jpg'),'registration.jpg');
    r=await tg('sendDocument',d);
    if(!r.ok)console.log('sendDocument failed',r.status,await r.clone().text());
  }
  if(f.get('pdf')){const b=new FormData();b.set('chat_id',e.TELEGRAM_CHAT_ID);b.set('document',f.get('pdf'),'registration.pdf');await tg('sendDocument',b)}
  const j=await r.json().catch(()=>({}));
  return Response.json({ok:r.ok,error:j.description||''},{status:r.ok?200:502});
};
