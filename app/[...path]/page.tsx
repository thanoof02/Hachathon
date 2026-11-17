import Therapulse from '@/components/therapulse';
const allowed = ['dashboard','check-in','toolkit','therapists','journal','expression','safety','circles','institution','therapist','sessions','pitch','login'];
export function generateStaticParams(){return allowed.map(path=>({path:[path]}));}
export default async function Page({params}:{params:Promise<{path:string[]}>}) {const {path}=await params; return <Therapulse initialPath={'/'+path.join('/')}/>;}

