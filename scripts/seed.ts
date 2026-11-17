import {createHash} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {list,put} from '../lib/store';
import {analyze,therapists} from '../lib/domain';
async function main(){
 if(process.env.DATABASE_URL)throw new Error('This seed intentionally supports local demo storage only. No remote database writes are authorized.');
 const accounts=[{email:'user@therapulse.demo',alias:'Aanya',role:'user',verified:false},{email:'therapist@therapulse.demo',alias:'Dr. Ananya Rao',role:'therapist',verified:true},{email:'admin@therapulse.demo',alias:'Demo College Admin',role:'institution',org:'demo-college',verified:false}];
 for(const a of accounts){const id=createHash('sha256').update(a.email).digest('hex');if(!(await list('auth:'+id,'user')).length)await put('auth:'+id,'user',{id,alias:a.alias,role:a.role,org:a.org,verified:a.verified,password:await bcrypt.hash('DemoCare!2026',12)},'auth:'+id);}
 const id=createHash('sha256').update(accounts[0].email).digest('hex');
 if(!(await list(id,'checkin')).length)for(let i=0;i<7;i++){const answers=Array.from({length:13},(_,question)=>({question,option:question===10?0:Math.min(2,Math.max(0,Math.floor((7-i)/3))),comment:''}));await put(id,'checkin',{answers,analysis:analyze(answers)},'demo-checkin-'+i);}
 for(const t of therapists)await put('demo-catalog','therapist',{...t,verified:true,demo:true},'catalog:'+t.id);
 await put('demo-college','institution',{name:'Therapulse Demo College',inviteCode:'CALM-CAMPUS',minimumGroupSize:5},'demo-college');
 for(let i=0;i<40;i++)await put('demo-college','aggregate',{cohort:i<18?'Engineering':i<30?'Arts & Sciences':'Business',week:Math.floor(i/10)+1,score:50+(i*7)%43,stressSource:'Academics',risk:i<21?'low':i<31?'mild':i<38?'moderate':'high'},'sample-aggregate-'+i);
 await put('demo-review','verification',{name:'Sample Pending Therapist',license:'DEMO-PENDING',authority:'Sample review only',status:'manual_review',demo:true},'demo-pending');
 console.log('Therapulse local seed complete: 3 accounts, 4 sample profiles, 1 institution, 40 anonymous aggregate records, 1 pending profile.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1});

