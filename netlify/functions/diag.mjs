// Open: /api/diag?p=<ADMIN_PASSWORD>  -> shows what is wrong (no secrets are printed)
export const config={path:'/api/diag'};
export default async (req)=>{
  const e=process.env,u=new URL(req.url);
  if(!e.ADMIN_PASSWORD||u.searchParams.get('p')!==e.ADMIN_PASSWORD)return new Response('add ?p=YOUR_ADMIN_PASSWORD',{status:401});
  const out={token_set:!!e.TELEGRAM_BOT_TOKEN,chat_id_set:!!e.TELEGRAM_CHAT_ID,chat_id:e.TELEGRAM_CHAT_ID||null};
  if(!out.token_set||!out.chat_id_set)return Response.json(out);
  const api=(m,q='')=>fetch(`https://api.telegram.org/bot${e.TELEGRAM_BOT_TOKEN}/${m}${q}`).then(r=>r.json()).catch(x=>({ok:false,description:String(x)}));
  const me=await api('getMe');out.bot=me.ok?'@'+me.result.username:('ERROR: '+me.description);
  const m=await api('sendMessage',`?chat_id=${encodeURIComponent(e.TELEGRAM_CHAT_ID)}&text=${encodeURIComponent('✅ INFT test message')}`);
  out.send=m.ok?'OK – check the channel':('ERROR: '+m.description);
  return Response.json(out);
};
