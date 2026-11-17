// KV binding name: KV  | env: ADMIN_PASSWORD
export async function onRequestGet({env}){return new Response(await env.KV.get('content')||'{}',{headers:{'content-type':'application/json'}})}
export async function onRequestPut({request,env}){
  if(request.headers.get('x-admin')!==env.ADMIN_PASSWORD)return new Response('no',{status:401});
  await env.KV.put('content',(await request.text()).slice(0,200000));return new Response('{"ok":true}')}
