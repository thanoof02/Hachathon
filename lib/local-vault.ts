'use client';
const keyName='therapulse-vault-key';
async function key(){let value=localStorage.getItem(keyName);if(!value){const k=await crypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);value=JSON.stringify(await crypto.subtle.exportKey('jwk',k));localStorage.setItem(keyName,value);}return crypto.subtle.importKey('jwk',JSON.parse(value),{name:'AES-GCM'},false,['encrypt','decrypt']);}
export type JournalEntry={id:string;text:string;mood:string;created_at:string};
export async function readJournal():Promise<JournalEntry[]>{const raw=localStorage.getItem('therapulse-private-journal');if(!raw)return [];const {iv,data}=JSON.parse(raw);const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(iv)},await key(),new Uint8Array(data));return JSON.parse(new TextDecoder().decode(plaintext));}
export async function writeJournal(entries:JournalEntry[]){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(),new TextEncoder().encode(JSON.stringify(entries)));localStorage.setItem('therapulse-private-journal',JSON.stringify({iv:[...iv],data:[...new Uint8Array(data)]}));}

