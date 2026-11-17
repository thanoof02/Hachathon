export type Aggregate={cohort:string;week:number;score:number;risk:string;stressSource:string};
export function aggregateReport(rows:Aggregate[],minimum=5){
 if(rows.length<minimum)return {suppressed:true,groupSize:0,minimumGroupSize:minimum,trend:[],cohorts:[],risk:[],insight:'Not enough members to show a private report.'};
 const cohorts=[...new Set(rows.map(r=>r.cohort))].flatMap(name=>{const members=rows.filter(r=>r.cohort===name);return members.length<minimum?[]:[{name,members:members.length,score:Math.round(members.reduce((s,r)=>s+r.score,0)/members.length)}]});
 const trend=[...new Set(rows.map(r=>r.week))].sort().flatMap(week=>{const members=rows.filter(r=>r.week===week);return members.length<minimum?[]:[{week:'Week '+week,score:Math.round(members.reduce((s,r)=>s+r.score,0)/members.length)}]});
 return {suppressed:false,groupSize:rows.length,minimumGroupSize:minimum,trend,cohorts,risk:['low','mild','moderate','high','crisis'].map(name=>({name,value:rows.filter(r=>r.risk===name).length})),insight:'Illustrative insight from seeded aggregate data: consider an optional workshop on academic stress and sleep. This report contains no individual answers.'};
}
