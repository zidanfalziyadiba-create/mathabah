import { Activity, Eye, RefreshCw, Target, UserCheck, Users } from "lucide-react";

type DailyAnalytics = {
  day: string;
  visitors: number;
  pageViews: number;
  leads: number;
};

type AnalyticsData = {
  summary: {
    activeVisitors: number;
    visitorsToday: number;
    pageViewsToday: number;
    leadsToday: number;
    leadsTotal: number;
  };
  daily: DailyAnalytics[];
  updatedAt: string;
};

type Props = {
  data: AnalyticsData | null;
  loading: boolean;
  onRefresh: () => void;
};

const numberFormat = new Intl.NumberFormat("ar-SA");
const number = (value?: number) => numberFormat.format(Number(value || 0));

function dayLabel(day: string) {
  const date = new Date(`${day}T12:00:00+03:00`);
  return new Intl.DateTimeFormat("ar-SA", {
    timeZone: "Asia/Riyadh",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function AdminAnalytics({ data, loading, onRefresh }: Props) {
  const summary = data?.summary;
  const conversion = summary && summary.visitorsToday > 0
    ? `${((summary.leadsToday / summary.visitorsToday) * 100).toFixed(1)}%`
    : "—";
  const series = data?.daily || [];
  const max = Math.max(1, ...series.map((item) => Math.max(item.visitors, item.leads)));
  const updatedAt = data?.updatedAt
    ? new Intl.DateTimeFormat("ar-SA", {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(data.updatedAt))
    : "—";

  const cards = [
    { label: "جلسات نشطة الآن", value: number(summary?.activeVisitors), note: "نبضة خلال آخر ٩٠ ثانية", icon: Activity, tone: "live" },
    { label: "جلسات فريدة اليوم", value: number(summary?.visitorsToday), note: "معرّف جلسة يومي، وليس أشخاصاً مؤكّدين", icon: Users, tone: "visitors" },
    { label: "مشاهدات الصفحات اليوم", value: number(summary?.pageViewsToday), note: "من صفحات الموقع العامة", icon: Eye, tone: "views" },
    { label: "طلبات جديدة اليوم", value: number(summary?.leadsToday), note: "طلبات محفوظة فعلياً في قاعدة العملاء", icon: UserCheck, tone: "leads" },
    { label: "إجمالي الطلبات المحفوظة", value: number(summary?.leadsTotal), note: "من سجلات العملاء الموجودة", icon: Target, tone: "total" },
    { label: "الطلبات لكل جلسة اليوم", value: conversion, note: "مؤشر تقريبي؛ قد يتجاوز ١٠٠٪", icon: Target, tone: "rate" },
  ];

  return (
    <section className="admin-analytics" aria-label="تحليلات الزوار والعملاء المحتملين">
      <header className="admin-analytics-header">
        <div>
          <h3>إحصاءات الموقع</h3>
          <p>تُحدّث اللوحة تلقائياً كل ١٥ ثانية. آخر تحديث: {updatedAt} بتوقيت الرياض.</p>
        </div>
        <button type="button" className="admin-analytics-refresh" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? "admin-analytics-spin" : ""} />
          تحديث الآن
        </button>
      </header>

      <div className="admin-analytics-cards">
        {cards.map(({ label, value, note, icon: Icon, tone }) => (
          <article className={`admin-analytics-card tone-${tone}`} key={label}>
            <div className="admin-analytics-card-top"><span>{label}</span><Icon size={17} /></div>
            <strong>{data ? value : "—"}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>

      <section className="admin-analytics-chart">
        <div className="admin-analytics-chart-heading">
          <div><h4>الجلسات والطلبات — آخر ٧ أيام</h4><p>الأعداد اليومية حسب توقيت الرياض.</p></div>
          <div className="admin-analytics-legend"><span><i className="legend-visitors" />جلسات فريدة</span><span><i className="legend-leads" />طلبات محفوظة</span></div>
        </div>
        {!series.length ? (
          <div className="admin-analytics-empty">ستظهر البيانات بعد بدء استقبال زيارات الموقع.</div>
        ) : (
          <div className="admin-analytics-bars" role="img" aria-label="مقارنة الجلسات الفريدة والطلبات المحفوظة خلال آخر سبعة أيام">
            {series.map((item) => {
              const visitorHeight = item.visitors ? Math.max(4, (item.visitors / max) * 120) : 0;
              const leadHeight = item.leads ? Math.max(4, (item.leads / max) * 120) : 0;
              return (
                <div className="admin-analytics-day" key={item.day}>
                  <div className="admin-analytics-bar-values"><span>{number(item.visitors)}</span><span>{number(item.leads)}</span></div>
                  <div className="admin-analytics-bar-pair">
                    <i className="bar-visitors" style={{ height: `${visitorHeight}px` }} title={`${number(item.visitors)} جلسة`} />
                    <i className="bar-leads" style={{ height: `${leadHeight}px` }} title={`${number(item.leads)} طلب`} />
                  </div>
                  <small>{dayLabel(item.day)}</small>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="admin-analytics-privacy">
        الخصوصية: القياس يستخدم معرّفاً عشوائياً مؤقتاً في جلسة المتصفح. قاعدة التحليلات لا تحفظ عنوان IP أو الاسم أو تفاصيل نموذج العميل؛ وقد تنطبق على سجلات التشغيل سياسات مزود الاستضافة. أعداد الزوار تعني جلسات متصفح تقريبية وليست هوية أشخاص.
      </p>
    </section>
  );
}
