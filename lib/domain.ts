export type Risk = 'low'|'mild'|'moderate'|'high'|'crisis';
export type Answer = {question:number; option:number|null; comment:string};
export type Analysis = {overall_wellbeing_score:number;risk_level:Risk;detected_themes:string[];empathetic_summary:string;recommendations:{type:'tool'|'therapist'|'group'|'crisis';title:string;reason:string}[];suggested_specialization:string;needs_immediate_help:boolean;source:'rules'|'ai'};
export const questions = [
{title:"How's your pulse today?",hint:'There is no right or wrong answer. Just you, as you are.',options:['Good','Okay','Low','Anxious','Angry','Numb','Overwhelmed'],scores:[0,1,3,3,3,4,4]},
{title:'How have you been sleeping?',hint:'Think about your last few nights.',options:['Restful and refreshing','Mostly well','A little restless','Waking up often','Very little sleep','Sleeping much more'],scores:[0,1,2,3,4,3]},
{title:'How is your energy today?',hint:'Notice what your body is telling you.',options:['Full of energy','Pretty steady','Somewhere in between','Running low','Completely drained'],scores:[0,1,2,3,4]},
{title:'How often have you felt on edge?',hint:'Think about the past two weeks.',options:['Never','A few days','About half the days','Most days','Nearly every day'],scores:[0,1,2,3,4]},
{title:'Have things you enjoy felt different?',hint:'In the past two weeks, how often have you lost interest?',options:['Not at all','A few days','About half the days','Most days','Nearly every day'],scores:[0,1,2,3,4]},
{title:'How has your appetite been?',hint:'Small changes are worth noticing, too.',options:['About usual','A little less','A little more','Much less','Much more','Very unpredictable'],scores:[0,1,1,3,3,4]},
{title:'How easy is it to focus?',hint:'At work, while studying, or in everyday moments.',options:['Easy and clear','Mostly manageable','Sometimes difficult','Often difficult','Very hard right now'],scores:[0,1,2,3,4]},
{title:'How connected do you feel?',hint:'Think about the people who matter to you.',options:['Very connected','Mostly connected','Somewhat connected','Quite isolated','Completely alone'],scores:[0,1,2,3,4]},
{title:'Where is stress showing up?',hint:'Choose the main source. Add the intensity in your comments if you like.',options:['Little stress right now','Academics','Work','Relationships','Family','Finances','Health','Unsure'],scores:[0,3,3,3,3,3,3,2]},
{title:'Have you been feeling hopeless or like a burden?',hint:'You deserve support, whatever your answer.',options:['Never','Rarely','Sometimes','Often','Nearly all the time'],scores:[0,1,2,3,4]},
{title:'Have you had thoughts of hurting yourself or ending your life?',hint:'Thank you for being here. Your answer helps us offer the right support. You can skip this question.',options:['Never','Rarely','Sometimes','Often','Right now'],scores:[0,3,4,4,4]},
{title:'How does sharing your feelings feel?',hint:'It is okay if finding the words takes time.',options:['Very comfortable','Mostly comfortable','Depends on the person','Quite difficult','I cannot find the words'],scores:[0,1,2,3,4]},
{title:'What would feel helpful right now?',hint:'Optional. A small step is still a step.',options:['Someone to listen','Relaxation tools','Professional therapy','Group support','Not sure'],scores:[0,0,0,0,0]}
];
const malayalamCrisis = /ആത്മഹത്യ|ജീവിതം അവസാനിപ്പിക്ക|മരിക്കാൻ തോന്ന|എന്നെത്തന്നെ ഉപദ്രവിക്ക|ജീവിക്കാൻ താൽപ്പര്യമില്ല/;
const crisisWords = /\b(end my life|suicid(?:e|al)|kill myself|no reason to live|hurt myself|harm myself|want to die|ending my life)\b/i;
export function analyze(answers:Answer[]):Analysis {
 const urgent = answers.some(a=>(a.question===10 && a.option!==null && a.option>=2)||(crisisWords.test(a.comment)||malayalamCrisis.test(a.comment)));
 const answered=answers.filter(a=>a.option!==null && a.question<12);
 const burden=answered.reduce((s,a)=>s+(questions[a.question]?.scores[a.option!]??0),0);
 const score=answered.length?Math.max(0,Math.round(100-burden/(answered.length*4)*100)):50;
 const risk:Risk=urgent?'crisis':answers.some(a=>a.question===10&&a.option===1)?'high':score<30?'high':score<50?'moderate':score<72?'mild':'low';
 const themes:string[]=[];
 for(const [index,theme] of [[1,'sleep'],[3,'anxiety'],[4,'low motivation'],[7,'connection'],[8,'stress']] as const){if(answers.some(a=>a.question===index&&a.option!==null&&(questions[index].scores[a.option]??0)>=2))themes.push(theme);}
 const recommendations:Analysis['recommendations']=urgent?[{type:'crisis',title:'Reach out for immediate support',reason:'You deserve a real person beside you right now.'}]:[{type:'tool',title:'Take a breathing break',reason:'Make a little space for yourself with a guided breath.'},...(risk!=='low'?[{type:'therapist' as const,title:risk==='high'?'Explore priority and free appointments':'Find someone who understands',reason:'A qualified professional can help you explore what feels difficult.'},{type:'group' as const,title:'Find your support circle',reason:'Share at your own pace with people who understand.'}]:[])];
 return {overall_wellbeing_score:score,risk_level:risk,detected_themes:themes,empathetic_summary:urgent?'You matter, and you do not have to face this moment alone. Let us help you connect with someone now.':!answered.length?'You can come back when you feel ready. This is a neutral starting point because you skipped the questions.':'Thank you for making space for yourself. Your feelings are valid. We can take the next small step together.',recommendations,suggested_specialization:themes.includes('anxiety')?'anxiety':themes.includes('stress')?'stress':'general',needs_immediate_help:urgent,source:'rules'};
}
export const riskOrder:Risk[]=['low','mild','moderate','high','crisis'];
export function enforceSafety(base:Analysis, ai:Analysis):Analysis { const risk=riskOrder[Math.max(riskOrder.indexOf(base.risk_level),riskOrder.indexOf(ai.risk_level))];return {...ai,risk_level:risk,needs_immediate_help:risk==='crisis',recommendations:risk==='crisis'?base.recommendations:ai.recommendations,source:'ai'}; }
export const therapists = [
  {
    "id": "asha",
    "name": "Asha Menon",
    "title": "CBT Therapist",
    "initials": "AM",
    "specialization": "anxiety",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 4,
    "rating": 0,
    "fee": 899,
    "groupFee": 360,
    "free": true,
    "sliding": true,
    "color": "mint",
    "bio": "Practical, collaborative support for understanding thought patterns and everyday coping."
  },
  {
    "id": "dev",
    "name": "Dev Varma",
    "title": "Trauma-Informed Therapist",
    "initials": "DV",
    "specialization": "trauma",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 5,
    "rating": 0,
    "fee": 999,
    "groupFee": 400,
    "free": false,
    "sliding": true,
    "color": "lavender",
    "bio": "A patient, choice-led space that respects your pace and sense of safety."
  },
  {
    "id": "nisha",
    "name": "Nisha Thomas",
    "title": "Relationship Therapist",
    "initials": "NT",
    "specialization": "relationships",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 6,
    "rating": 0,
    "fee": 1099,
    "groupFee": 440,
    "free": false,
    "sliding": true,
    "color": "peach",
    "bio": "Support with communication, connection, and relationship difficulties."
  },
  {
    "id": "rohan",
    "name": "Rohan Pillai",
    "title": "Family Therapist",
    "initials": "RP",
    "specialization": "family",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 7,
    "rating": 0,
    "fee": 1299,
    "groupFee": 520,
    "free": false,
    "sliding": true,
    "color": "sand",
    "bio": "A space for families to improve communication and understand each other."
  },
  {
    "id": "diya",
    "name": "Diya Joseph",
    "title": "Child & Adolescent Therapist",
    "initials": "DJ",
    "specialization": "children",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 8,
    "rating": 0,
    "fee": 899,
    "groupFee": 360,
    "free": false,
    "sliding": true,
    "color": "mint",
    "bio": "Age-appropriate support for children, teenagers, and their caregivers."
  },
  {
    "id": "arun",
    "name": "Arun Mathew",
    "title": "Speech Therapist",
    "initials": "AM",
    "specialization": "speech",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 9,
    "rating": 0,
    "fee": 699,
    "groupFee": 280,
    "free": false,
    "sliding": true,
    "color": "lavender",
    "bio": "Support with communication, speech, and language goals."
  },
  {
    "id": "maya",
    "name": "Maya Krishnan",
    "title": "Occupational Therapist",
    "initials": "MK",
    "specialization": "occupational",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 10,
    "rating": 0,
    "fee": 799,
    "groupFee": 320,
    "free": false,
    "sliding": true,
    "color": "peach",
    "bio": "Support for participation, independence, and everyday activities."
  },
  {
    "id": "avin",
    "name": "Avin Das",
    "title": "Physiotherapist",
    "initials": "AD",
    "specialization": "physiotherapy",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 4,
    "rating": 0,
    "fee": 699,
    "groupFee": 280,
    "free": false,
    "sliding": true,
    "color": "sand",
    "bio": "Movement and rehabilitation support tailored to everyday needs."
  },
  {
    "id": "sara",
    "name": "Sara George",
    "title": "Career Counsellor",
    "initials": "SG",
    "specialization": "career",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 5,
    "rating": 0,
    "fee": 499,
    "groupFee": 200,
    "free": true,
    "sliding": true,
    "color": "mint",
    "bio": "Explore interests, choices, and practical next steps in education and work."
  },
  {
    "id": "neel",
    "name": "Neel Kumar",
    "title": "Nutrition Professional",
    "initials": "NK",
    "specialization": "nutrition",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 6,
    "rating": 0,
    "fee": 599,
    "groupFee": 240,
    "free": false,
    "sliding": true,
    "color": "lavender",
    "bio": "A supportive conversation about food routines and personal nutrition goals."
  },
  {
    "id": "tara",
    "name": "Tara Nair",
    "title": "Art/Music Therapist",
    "initials": "TN",
    "specialization": "creative",
    "languages": [
      "English",
      "Malayalam"
    ],
    "experience": 7,
    "rating": 0,
    "fee": 799,
    "groupFee": 320,
    "free": false,
    "sliding": true,
    "color": "peach",
    "bio": "Creative expression through art and music, at your own pace."
  },
  {
    "id": "vikram",
    "name": "Vikram Shah",
    "title": "Addiction Counsellor",
    "initials": "VS",
    "specialization": "addiction",
    "languages": [
      "English",
      "Malayalam",
      "Hindi"
    ],
    "experience": 8,
    "rating": 0,
    "fee": 799,
    "groupFee": 320,
    "free": false,
    "sliding": true,
    "color": "sand",
    "bio": "Compassionate support for understanding habits and exploring recovery."
  }
];
export const i18n = {en:{welcome:"A little care. A little closer to you.",checkin:"Check in with yourself",help:"Need help now?"},hi:{welcome:"थोड़ी देखभाल। खुद के थोड़ा करीब।",checkin:"अपने मन का हाल जानें",help:"अभी मदद चाहिए?"},kn:{welcome:"ಸ್ವಲ್ಪ ಕಾಳಜಿ. ನಿಮಗೆ ಇನ್ನಷ್ಟು ಹತ್ತಿರ.",checkin:"ನಿಮ್ಮ ಮನಸ್ಸನ್ನು ಆಲಿಸಿ",help:"ಈಗ ಸಹಾಯ ಬೇಕೇ?"}};
export const helplines = {IN:[{name:'Tele MANAS',label:'14416',href:'tel:+9114416?oai_link_source=model_response_hotline',description:'24/7 free mental health support',website:'https://telemanas.mohfw.gov.in/home?oai_link_source=model_response_hotline'}]};


