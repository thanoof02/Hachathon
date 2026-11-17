'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {malayalam} from '@/lib/malayalam';
import {hindi} from '@/lib/hindi';
import {kannada} from '@/lib/kannada';
export type Locale='en'|'hi'|'kn'|'ml';
const dictionaries:Record<Exclude<Locale,'en'>,Record<string,string>>={hi:hindi,kn:kannada,ml:malayalam};
const LanguageContext=createContext({locale:'en' as Locale,setLocale:(_value:Locale)=>{},t:(value:string)=>value,text:(value:React.ReactNode):React.ReactNode=>value});
export function LanguageProvider({children}:{children:React.ReactNode}){const [locale,setLocale]=useState<Locale>('en');useEffect(()=>{const saved=localStorage.getItem('therapulse-language');if(saved==='en'||saved==='hi'||saved==='kn'||saved==='ml')setLocale(saved)},[]);useEffect(()=>{document.documentElement.lang=locale},[locale]);const update=(value:Locale)=>{setLocale(value);localStorage.setItem('therapulse-language',value)};const t=(value:string)=>{if(locale==='en')return value;const translated=dictionaries[locale][value.trim()];return translated?(value.match(/^\s*/)?.[0]||'')+translated+(value.match(/\s*$/)?.[0]||''):value;};return <LanguageContext.Provider value={{locale,setLocale:update,t,text:value=>typeof value==='string'?t(value):value}}>{children}</LanguageContext.Provider>}
export const useLanguage=()=>useContext(LanguageContext);
export function LanguagePicker(){const {locale,setLocale}=useLanguage();return <label className="language-picker"><span className="sr-only">Website language / വെബ്‌സൈറ്റിന്റെ ഭാഷ</span><select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="kn">ಕನ್ನಡ</option><option value="ml">മലയാളം</option></select></label>}
