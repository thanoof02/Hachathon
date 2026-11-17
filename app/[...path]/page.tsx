import Therapulse from '@/components/website';
const allowed = ['payment','organisation','organisation/setup','organisation/plan','survey/thanks','therapist/earnings','dashboard','plan','privacy','history','support-now','therapist/license','therapist/services','therapist/availability','therapist/sessions','check-in','toolkit','therapists','journal','expression','safety','circles','institution','therapist','sessions','pitch','login'];
export function generateStaticParams(){return allowed.map(path=>({path:path.split('/')}));}
export default async function Page({params}:{params:Promise<{path:string[]}>}) {const {path}=await params; return <Therapulse initialPath={'/'+path.join('/')}/>;}
