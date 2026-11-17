import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
import {secret} from './store';
export type Session={id:string;alias:string;role:'guest'|'user'|'therapist'|'institution';verified?:boolean;org?:string};
export async function session():Promise<Session|null>{const t=(await cookies()).get('therapulse-session')?.value;if(!t)return null;try{const {payload}=await jwtVerify(t,new TextEncoder().encode(await secret()),{algorithms:['HS256'],issuer:'therapulse',audience:'therapulse'});return payload as unknown as Session;}catch{return null;}}
export async function login(s:Session){const token=await new SignJWT({...s}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').setIssuer('therapulse').setAudience('therapulse').sign(new TextEncoder().encode(await secret()));(await cookies()).set('therapulse-session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:604800});}
const hits=new Map<string,{count:number;until:number}>();
export function rateLimit(key:string,max=60){const now=Date.now();if(hits.size>10000)for(const [k,v]of hits)if(v.until<now)hits.delete(k);const item=hits.get(key);if(!item||item.until<now){hits.set(key,{count:1,until:now+60000});return false;}item.count++;return item.count>max;}

