'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {malayalam} from '@/lib/malayalam';
export type Locale='en'|'ml';
const LanguageContext=createContext({locale:'en' as Locale,setLocale:(_value:Locale)=>{},t:(value:string)=>value,text:(value:React.ReactNode):React.ReactNode=>value});
export function LanguageProvider({children}:{children:React.ReactNode}){const [locale,setLocale]=useState<Locale>('en');useEffect(()=>{if(localStorage.getItem('therapulse-language')==='ml')setLocale('ml')},[]);useEffect(()=>{document.documentElement.lang=locale},[locale]);const update=(value:Locale)=>{setLocale(value);localStorage.setItem('therapulse-language',value)};const t=(value:string)=>{if(locale!=='ml')return value;const translated=malayalam[value.trim()];return translated?(value.match(/^\s*/)?.[0]||'')+translated+(value.match(/\s*$/)?.[0]||''):value;};return <LanguageContext.Provider value={{locale,setLocale:update,t,text:value=>typeof value==='string'?t(value):value}}>{children}</LanguageContext.Provider>}
export const useLanguage=()=>useContext(LanguageContext);
export function LanguagePicker(){const {locale,setLocale}=useLanguage();return <label className="language-picker"><span className="sr-only">Website language / വെബ്‌സൈറ്റിന്റെ ഭാഷ</span><select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="en">English</option><option value="ml">മലയാളം</option></select></label>}
