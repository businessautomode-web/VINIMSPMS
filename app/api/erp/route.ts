import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
async function relay(req:NextRequest){
 const url=process.env.APPS_SCRIPT_URL,secret=process.env.ERP_API_SECRET;
 if(!url||!secret)return NextResponse.json({ok:false,message:"Google Sheets integration is not configured. Ask the administrator to add Vercel environment variables."},{status:503});
 try{const body=req.method==="GET"?{action:req.nextUrl.searchParams.get("action")||"health"}:await req.json();const r=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...body,secret}),cache:"no-store"});const data=await r.json();return NextResponse.json(data,{status:r.ok?200:502})}catch(e){console.error("ERP relay error",e);return NextResponse.json({ok:false,message:"Unable to connect to company data. Please try again or contact the administrator."},{status:502})}}
export async function GET(req:NextRequest){return relay(req)}
export async function POST(req:NextRequest){return relay(req)}
