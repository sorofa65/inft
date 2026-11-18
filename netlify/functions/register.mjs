// Netlify Function: /api/register -> Telegram. NOTE: Netlify body limit ~6 MB, so large videos fail here (use Cloudflare Pages for video).
export const config={path:'/api/register'};
export default async(req)=>{
  if(req.method!=='POST')return new Response('no',{status:405});
  const f=await req.formData();if(f.get('website'))return Response.json({ok:true});const e=process.env;
  const send=async(m,key,file,name,cap)=>{const b=new FormData();b.set('chat_id',e.TELEGRAM_CHAT_ID);if(cap)b.set('caption',cap.slice(0,1000));b.set(key,file,name);
    const r=await fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/${m}`,{method:'POST',body:b});return r.json().catch(()=>({ok:false}))};
  const ip=req.headers.get('x-nf-client-connection-ip')||'?',now=new Date().toLocaleString('en-GB',{timeZone:'Asia/Dhaka'}),failed=[];
  if(!f.get('jpg')){const r=await fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:e.TELEGRAM_CHAT_ID,text:String(f.get('summary')||'')+`\n\n🕒 ${now}`})});return Response.json({ok:r.ok,failed:[]},{status:r.ok?200:502})}
  const a=await send('sendPhoto','photo',f.get('jpg'),'registration.jpg',String(f.get('summary')||'')+`\n\n🕒 ${now}\n🌐 IP: ${ip}`);if(!a.ok)return Response.json({ok:false,error:a.description},{status:502});
  if(f.get('pdf')&&!(await send('sendDocument','document',f.get('pdf'),'registration_and_rules.pdf','📄 ফর্ম + নিয়মাবলী')).ok)failed.push('PDF');
  const s=f.get('shot');if(s&&s.size&&!(await send('sendPhoto','photo',s,'payment.jpg','💳 পেমেন্ট স্ক্রিনশট')).ok)failed.push('স্ক্রিনশট');
  const v=f.get('video');if(v&&v.size&&!(await send('sendVideo','video',v,v.name||'video.mp4','🎥 টিমের ভিডিও')).ok)failed.push('ভিডিও');
  return Response.json({ok:true,failed});
};
