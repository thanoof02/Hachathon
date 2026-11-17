/** CSRF origin checks must use the incoming Host, not Next.js's internal localhost URL. */
type OriginInput={origin:string|null;requestUrl:string;host:string|null;fetchSite?:string|null;appOrigin?:string};
const authority=/^(?:\[[0-9a-f:]+\]|[a-z0-9.-]+)(?::\d{1,5})?$/i;
function canonicalOrigin(value:string):string|null{try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)return null;return url.origin;}catch{return null;}}
export function isAllowedRequestOrigin({origin,requestUrl,host,fetchSite,appOrigin}:OriginInput):boolean{
 // Browsers declare cross-site requests even when an Origin header is absent.
 if(fetchSite==='cross-site')return false;
 // Preserve support for same-site navigation and non-browser REST clients.
 if(!origin)return true;
 const actual=canonicalOrigin(origin);if(!actual)return false;
 if(appOrigin?.trim()){const configured=canonicalOrigin(appOrigin.trim());return configured!==null&&actual===configured;}
 try{const internal=new URL(requestUrl);if(host&&!authority.test(host))return false;const expected=canonicalOrigin(`${internal.protocol}//${host||internal.host}`);return expected!==null&&actual===expected;}catch{return false;}
}
