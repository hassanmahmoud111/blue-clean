import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, CheckCircle2, ChevronLeft, CircleAlert, Clock3, Link2, RefreshCw, RotateCw, Settings2, ShieldCheck } from 'lucide-react';
import { channelConnections } from '../data/workflows';
import { apiFetch } from '../services/apiClient';
import './reference-pages.css';
import './system-completion.css';

const logs=[
  {id:'SYNC-8942',platform:'Booking.com',event:'تعديل حجز RES-2026-1842',time:'منذ دقيقتين',state:'نجحت',tone:'green'},
  {id:'SYNC-8941',platform:'Airbnb',event:'حجز جديد للوحدة 304',time:'منذ 4 دقائق',state:'نجحت',tone:'green'},
  {id:'SYNC-8939',platform:'Booking.com',event:'تحديث توفر الوحدة 102',time:'منذ 18 دقيقة',state:'أُعيدت المحاولة',tone:'orange'},
  {id:'SYNC-8935',platform:'Airbnb',event:'إلغاء حجز سابق',time:'منذ 42 دقيقة',state:'نجحت',tone:'green'},
];

export default function IntegrationsPage(){
  const [syncing,setSyncing]=useState('');
  const [channels,setChannels]=useState(channelConnections);

  useEffect(()=>{
    let active=true;
    apiFetch<any>('/client/integrations').then(res=>{
      if(active && res.ok && res.data && Array.isArray(res.data.platforms)){
        setChannels(prev=>prev.map(ch=>{
          const found=res.data.platforms.find((p:any)=>p.platform===ch.id);
          if(!found) return ch;
          return {
            ...ch,
            status: found.is_connected ? 'connected' : ch.status,
            note: found.time_ago ? `آخر مزامنة: ${found.time_ago}` : ch.note,
          };
        }));
      }
    });
    return ()=>{active=false};
  },[]);

  const sync=async (id:string)=>{
    setSyncing(id);
    try {
      if(id==='all'){
        await Promise.all([
          apiFetch('/client/integrations/booking/sync',{method:'POST'}),
          apiFetch('/client/integrations/airbnb/sync',{method:'POST'}),
        ]);
      } else {
        await apiFetch(`/client/integrations/${id}/sync`,{method:'POST'});
      }
    } catch {
      // ignore
    } finally {
      window.setTimeout(()=>setSyncing(''),500);
    }
  };

  return <div className="reference-page integrations-page"><header className="reference-page-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><Link to="/app/settings">الإعدادات</Link><ChevronLeft size={13}/><span>الربط والمزامنة</span></div><h1><Link2 size={28}/>الربط والمزامنة</h1><p>حالة المنصات، نطاق البيانات، وسجل محاولات المزامنة.</p></div><div className="reference-page-actions"><button className="reference-secondary" onClick={()=>sync('all')}><RotateCw className={syncing==='all'?'spin':''} size={17}/>مزامنة الكل</button></div></header>
    <section className="integration-summary"><article><CheckCircle2/><span><b>منصتان متصلتان</b><small>Booking.com وAirbnb</small></span></article><article><RefreshCw/><span><b>آخر مزامنة</b><small>منذ دقيقتين</small></span></article><article><ShieldCheck/><span><b>منع التكرار</b><small>مفعّل بمعرّفات خارجية</small></span></article><article><AlertTriangle/><span><b>محاولة واحدة</b><small>نجحت بعد إعادة تلقائية</small></span></article></section>
    <div className="integration-layout"><main className="integration-main"><section className="reference-panel integration-providers"><header><div><h2>مزودو الحجز</h2><p>لا نعرض مزامنة كميزة مؤكدة إلا عند وجود وصول رسمي وصلاحيات صالحة.</p></div></header>{channels.filter(item=>item.id!=='direct').map(item=><article key={item.id}><span className={`provider-logo ${item.id}`}>{item.shortName}</span><div><h3>{item.name}</h3><p>{item.note}</p><small>{item.syncMethod}</small></div><span className={`integration-state ${item.status}`}>{item.status==='connected'?<><i/>متصل</>:<><CircleAlert size={13}/>يدوي حاليًا</>}</span><div className="integration-capabilities"><b>البيانات</b><span>{item.id==='gathern'?'إدخال حجوزات يدوي':'الحجوزات والتعديلات والإلغاءات'}</span><span>{item.id==='booking'?'التوفر والأسعار حسب الصلاحية':item.id==='airbnb'?'التوفر والرسائل حسب صلاحية الشريك':'لا ننسب بيانات إلى API غير موثقة'}</span></div><button disabled={item.status!=='connected'} onClick={()=>sync(item.id)}><RotateCw className={syncing===item.id?'spin':''} size={15}/>{item.status==='connected'?'مزامنة الآن':'إعداد الإدخال اليدوي'}</button><button className="icon-only" aria-label="إعدادات المنصة"><Settings2 size={17}/></button></article>)}</section>
      <section className="reference-panel sync-log"><header><div><h2>سجل المزامنة</h2><p>أحداث مفهومة للمستخدم؛ التفاصيل التقنية تبقى للـ Backend والإدارة الفنية.</p></div><button>عرض السجل الكامل</button></header>{logs.map(log=><article key={log.id}><span className={`log-icon ${log.tone}`}>{log.tone==='green'?<Check size={15}/>:<RotateCw size={15}/>}</span><div><b>{log.event}</b><small>{log.platform} · {log.id}</small></div><time>{log.time}</time><em className={`reference-chip ${log.tone}`}>{log.state}</em></article>)}</section></main>
      <aside><section className="reference-panel integration-rule-card"><Clock3 size={23}/><h2>كيف تعمل المزامنة؟</h2><ol><li><b>استقبال الحدث</b><span>حجز جديد، تعديل أو إلغاء من المنصة.</span></li><li><b>منع التكرار</b><span>فحص معرّف الحجز ومفتاح الحدث.</span></li><li><b>تحديث التقويم</b><span>تحديث الوحدة والمهام المرتبطة.</span></li><li><b>إعادة المحاولة</b><span>عند الفشل المؤقت دون تدخل المستخدم.</span></li></ol></section><section className="reference-panel integration-warning"><CircleAlert size={22}/><div><h2>Gathern</h2><p>لا توجد وثائق API عامة مؤكدة لدينا؛ لذلك يدعم التصميم الإدخال اليدوي إلى أن يقدم المزود صلاحيات ووثائق رسمية.</p></div></section></aside>
    </div>
  </div>;
}
