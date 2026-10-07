import { BedDouble, Building2, CalendarPlus, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Grid2X2, List, Map, MapPin, Pencil, Plus, Search, Sparkles, UserRound, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import './reference-pages.css';

const unitRows = [
  ['101','BLD-101','برج النخيل','الرياض','مشغولة','blue','أحمد العتيبي','2 ضيوف','10 سبتمبر 2026','11:00 ص','10 سبتمبر 2026','03:00 م',['airbnb','booking','gathern']],
  ['102','BLD-102','برج النخيل','الرياض','بانتظار التنظيف','orange','-','','10 سبتمبر 2026','09:30 ص','10 سبتمبر 2026','02:00 م',['airbnb']],
  ['203','BLD-203','مساكن الروضة','الرياض','قيد الصيانة','red','-','','-','','11 سبتمبر 2026','04:00 م',['booking']],
  ['304','BLD-304','برج الياسمين','جدة','بانتظار التنظيف','orange','-','','10 سبتمبر 2026','10:30 ص','10 سبتمبر 2026','03:00 م',['airbnb','gathern']],
  ['405','BLD-405','مساكن النخيل','الرياض','جاهزة للضيف','green','-','','9 سبتمبر 2026','11:00 ص','12 سبتمبر 2026','03:00 م',['booking']],
  ['501','BLD-501','برج الروضة','الرياض','مشغولة','blue','سارة محمد','3 ضيوف','11 سبتمبر 2026','11:00 ص','15 سبتمبر 2026','03:00 م',['airbnb','booking']],
  ['602','BLD-602','برج النخيل','الرياض','جاهزة للضيف','green','-','','8 سبتمبر 2026','10:00 ص','12 سبتمبر 2026','02:00 م',['gathern']],
  ['701','BLD-701','برج الياسمين','جدة','خارج الخدمة','gray','-','','-','','-','',[]],
];

export default function UnitsPage(){return <div className="reference-page units-page">
  <header className="reference-page-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><span>الرئيسية</span><ChevronLeft size={13}/><span>الوحدات</span></div><h1><Building2 size={28}/>الوحدات</h1><p>إدارة جميع عقاراتك ووحداتك في مكان واحد</p></div><div className="reference-page-actions"><button className="reference-secondary"><Download size={18}/>تصدير<ChevronDown size={15}/></button><Link className="reference-primary" to="/app/new/unit"><Plus size={20}/>إضافة وحدة جديدة</Link></div></header>
  <section className="reference-stats five"><Stat label="إجمالي الوحدات" value="12" color="blue" icon={Building2}/><Stat label="جاهزة للضيف" value="2" color="green" icon={BedDouble}/><Stat label="بانتظار التنظيف" value="1" color="orange" icon={Wrench}/><Stat label="قيد الصيانة" value="1" color="red" icon={Wrench}/><Stat label="مشغولة" value="8" color="sky" icon={BedDouble}/></section>
  <section className="reference-panel units-table-card">
    <div className="units-toolbar"><div className="units-filters"><label className="reference-search"><Search size={18}/><input placeholder="ابحث عن وحدة أو عقار ..."/></label><button className="reference-control">جميع العقارات<ChevronDown size={15}/></button><button className="reference-control">جميع الحالات<ChevronDown size={15}/></button><button className="reference-control">جميع المنصات<ChevronDown size={15}/></button></div><div className="units-views"><button><Grid2X2 size={17}/>بطاقات</button><button className="active"><List size={17}/>قائمة</button><button><Map size={17}/>خريطة</button></div></div>
    <table className="reference-table">
      <thead>
        <tr>
          <th>الوحدة</th>
          <th>العقار</th>
          <th>الحالة</th>
          <th>الضيف الحالي</th>
          <th>المغادرة</th>
          <th>الحجز التالي</th>
          <th>المنصات</th>
          <th style={{ textAlign: 'center' }}>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        {unitRows.map((row, index) => (
          <tr key={row[0] as string}>
            <td>
              <div className="unit-cell">
                <span className="reference-checkbox" />
                <span className={`ref-thumbnail u${index + 1}`} />
                <span className="unit-name">
                  <strong>شقة {row[0]}</strong>
                  <small>{row[1]}</small>
                </span>
              </div>
            </td>
            <td>
              <div className="unit-property">
                <strong>{row[2]}</strong>
                <small>
                  <MapPin size={11} />
                  {row[3]}
                </small>
              </div>
            </td>
            <td>
              <span className={`reference-chip ${row[5]}`}>{row[4]}</span>
            </td>
            <td>
              <div className="guest-copy">
                <strong>{row[6]}</strong>
                {row[7] && (
                  <small>
                    <UserRound size={11} />
                    {row[7]}
                  </small>
                )}
              </div>
            </td>
            <td>
              <strong>{row[8]}</strong>
              <small>{row[9]}</small>
            </td>
            <td>
              <strong>{row[10]}</strong>
              <small>{row[11]}</small>
            </td>
            <td>
              <div className="platform-stack">
                {(row[12] as string[]).map(platform => (
                  <span className={`platform-square ${platform}`} key={platform}>
                    {platform === 'booking' ? 'B.' : platform === 'airbnb' ? '⌂' : 'G'}
                  </span>
                ))}
                {(row[12] as string[]).length === 0 && '-'}
              </div>
            </td>
            <td>
              <div className="table-actions-cell">
                <Tooltip text="عرض التفاصيل">
                  <Link
                    to={`/app/units/${row[1]}`}
                    className="table-icon-btn primary"
                    aria-label={`عرض تفاصيل شقة ${row[0]}`}
                  >
                    <Eye size={16} />
                  </Link>
                </Tooltip>
                <Tooltip text="تعديل الوحدة">
                  <Link
                    to={`/app/units/${row[1]}/edit`}
                    className="table-icon-btn edit"
                    aria-label={`تعديل شقة ${row[0]}`}
                  >
                    <Pencil size={15} />
                  </Link>
                </Tooltip>
                <Tooltip text="إضافة حجز">
                  <Link
                    to={`/app/new/booking?unit=${row[1]}`}
                    className="table-icon-btn booking"
                    aria-label={`إضافة حجز لشقة ${row[0]}`}
                  >
                    <CalendarPlus size={15} />
                  </Link>
                </Tooltip>
                <Tooltip text="طلب تنظيف">
                  <Link
                    to={`/app/new/cleaning?unit=${row[1]}`}
                    className="table-icon-btn clean"
                    aria-label={`طلب تنظيف لشقة ${row[0]}`}
                  >
                    <Sparkles size={15} />
                  </Link>
                </Tooltip>
                <Tooltip text="طلب صيانة">
                  <Link
                    to={`/app/new/maintenance?unit=${row[1]}`}
                    className="table-icon-btn maintenance"
                    aria-label={`طلب صيانة لشقة ${row[0]}`}
                  >
                    <Wrench size={15} />
                  </Link>
                </Tooltip>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <footer className="reference-pagination"><div className="page-size">عدد العناصر في الصفحة <button className="reference-control">10<ChevronDown size={14}/></button></div><span>عرض 1 - 8 من 12 وحدة</span><div className="pagination-buttons"><button><ChevronLeft size={16}/></button><button className="active">1</button><button>2</button><button>3</button><button><ChevronRight size={16}/></button></div></footer>
  </section>
</div>}

function Stat({label,value,color,icon:Icon}:{label:string;value:string;color:string;icon:typeof Building2}){return <article className="reference-stat"><span className={`reference-stat-icon ${color}`}><Icon size={27}/></span><div className="reference-stat-copy"><span>{label}</span><strong>{value}</strong></div></article>}
