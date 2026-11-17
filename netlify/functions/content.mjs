// Netlify Function: /api/content (GET public, PUT admin) – stored in Netlify Blobs
import {getStore} from '@netlify/blobs';
export const config={path:'/api/content'};
export default async (req)=>{
  const s=getStore('inft');
  if(req.method==='GET')return new Response(await s.get('content')||'{}',{headers:{'content-type':'application/json'}});
  if(req.method==='PUT'){
    if(req.headers.get('x-admin')!==process.env.ADMIN_PASSWORD)return new Response('no',{status:401});
    await s.set('content',(await req.text()).slice(0,200000));return Response.json({ok:true})}
  return new Response('no',{status:405});
};
