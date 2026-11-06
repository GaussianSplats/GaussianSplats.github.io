// Cloudflare Worker: set SITE_ORIGIN and GITHUB_CLIENT_ID as variables,
// and GITHUB_CLIENT_SECRET as a Worker secret. See README.md.
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');const allowed=env.SITE_ORIGIN;const headers={'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Content-Type':'application/json','Cache-Control':'no-store'};
 if(origin!==allowed)return new Response('Forbidden',{status:403});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return new Response('{}',{status:405,headers});
 try{const {code,redirect_uri}=await request.json();const redirect=new URL(redirect_uri);if(redirect.origin!==allowed||!redirect.pathname.endsWith('/editor.html')||!code)throw Error('Invalid request');const github=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri})});const data=await github.json();if(!github.ok||!data.access_token)throw Error(data.error_description||'GitHub sign-in failed');return new Response(JSON.stringify({access_token:data.access_token}),{headers});}catch(e){return new Response(JSON.stringify({error:e.message}),{status:400,headers});}
}};
