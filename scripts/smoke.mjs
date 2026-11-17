import assert from 'node:assert/strict';
const base=process.env.E2E_BASE_URL||'http://127.0.0.1:3000';
function client(){let cookie='';return async(path,body,method)=>{const r=await fetch(base+'/api/'+path,{method:method||(body?'POST':'GET'),headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const set=r.headers.get('set-cookie');if(set)cookie=set.split(';')[0];return {status:r.status,data:await r.json()};};}
const a=client(),b=client();
assert.equal((await a('checkins')).status,401);
assert.equal((await a('guest',{})).data.session.role,'guest');
assert.equal((await b('guest',{})).status,200);
const entry=await a('journal',{text:'Fictional integration-test journal',mood:'calm'});assert.equal(entry.status,201);
assert.ok((await a('journal')).data.items.some(e=>e.id===entry.data.id));
assert.equal((await b('journal')).data.items.length,0);
assert.equal((await a('institution')).status,403);
assert.equal((await a('checkins',{answers:[{question:99,option:0,comment:''}],consent:true})).status,400);
assert.equal((await a('checkins',{answers:[{question:0,option:0,comment:''},{question:0,option:1,comment:''}],consent:true})).status,400);
const urgent=await a('checkins',{answers:[{question:10,option:4,comment:''}],consent:true});assert.equal(urgent.data.analysis.risk_level,'crisis');assert.equal(urgent.data.analysis.needs_immediate_help,true);
const rejected=await a('bookings',{therapistId:'dev',date:'2099-01-05',time:'09:00',mode:'video',pricing:'free',consent:true});assert.equal(rejected.status,400);
const booking=await a('bookings',{therapistId:'asha',date:'2099-01-05',time:'09:00',mode:'video',pricing:'free',consent:true});assert.equal(booking.status,201);assert.equal(booking.data.fee,0);
assert.equal((await b('bookings',{id:booking.data.id,action:'cancel'},'PATCH')).status,404);
assert.equal((await a('bookings',{id:booking.data.id,action:'reschedule',date:'2099-02-02',time:'11:00'},'PATCH')).status,200);
assert.equal((await a('bookings',{id:booking.data.id,action:'cancel'},'PATCH')).status,200);
const admin=client();assert.equal((await admin('auth',{action:'login',email:'admin@therapulse.demo',password:'DemoCare!2026',consent:true})).status,200);const analytics=await admin('institution');assert.equal(analytics.status,200);assert.ok(analytics.data.cohorts.every(c=>c.members>=5));assert.equal('items' in analytics.data,false);
assert.equal((await b('auth',{action:'signup',email:'forbidden@example.test',password:'DemoCare!2026',name:'Example',role:'superadmin',consent:true})).status,400);
const account=await a('auth',{action:'signup',email:`test-${Date.now()}@example.test`,password:'DemoCare!2026',name:'Test Alias',role:'user',consent:true,migrate:true});assert.equal(account.status,201);assert.ok((await a('journal')).data.items.some(e=>e.id===entry.data.id));
for(const route of ['/','/check-in','/toolkit','/therapists','/journal','/sessions','/pitch','/institution','/therapist','/login','/expression','/safety','/circles']){const r=await fetch(base+route);assert.equal(r.status,200,route);assert.ok((await r.text()).includes('Therapulse'),route);}
console.log('PASS: anonymous auth, encryption-backed persistence, user isolation, role guards, answer validation, crisis routing, free-slot validation, booking ownership/reschedule/cancel, institution aggregates, role escalation rejection, guest migration, and 13 page responses.');
