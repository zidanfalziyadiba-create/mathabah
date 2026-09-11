import React, { useState, useEffect } from "react";
import { siteConfig } from "../siteConfig";

export const AdminModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [config, setConfig] = useState(siteConfig);

  useEffect(() => {
    const saved = localStorage.getItem("mathabah_custom_config");
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem("mathabah_custom_config", JSON.stringify(config));
    alert("تم حفظ الإعدادات بنجاح وتطبيقها على الموقع!");
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1e1e1e", color: "#fff", padding: "25px", borderRadius: "12px", width: "90%", maxWidth: "550px", maxHeight: "90vh", overflowY: "auto", border: "1px solid #444" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "15px", borderBottom: "1px solid #333", paddingBottom: "10px", color: "#d97706" }}>لوحة تحكم المالك السرية - مؤسسة مثابة</h3>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={config.marquee.enabled} onChange={e => setConfig({...config, marquee: {...config.marquee, enabled: e.target.checked}})} />
            <span>تشغيل شريط الإعلانات المتحرك</span>
          </label>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <span>ساعات الظهور من: </span>
            <input type="number" min="0" max="23" value={config.marquee.startHour} onChange={e => setConfig({...config, marquee: {...config.marquee, startHour: parseInt(e.target.value) || 0}})} style={{ width: "60px", background: "#333", color: "#fff", border: "1px solid #555" }} />
            <span>إلى: </span>
            <input type="number" min="0" max="24" value={config.marquee.endHour} onChange={e => setConfig({...config, marquee: {...config.marquee, endHour: parseInt(e.target.value) || 0}})} style={{ width: "60px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <input type="text" value={config.marquee.text} onChange={e => setConfig({...config, marquee: {...config.marquee, text: e.target.value}})} style={{ width: "100%", marginTop: "8px", background: "#333", color: "#fff", padding: "6px", border: "1px solid #555" }} />
        </div>

        <hr style={{ borderColor: "#333", margin: "15px 0" }} />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={config.promotionalPopup.enabled} onChange={e => setConfig({...config, promotionalPopup: {...config.promotionalPopup, enabled: e.target.checked}})} />
            <span>تشغيل النافذة المنبثقة الترويجية</span>
          </label>
          <input type="text" value={config.promotionalPopup.title} onChange={e => setConfig({...config, promotionalPopup: {...config.promotionalPopup, title: e.target.value}})} placeholder="عنوان العرض" style={{ width: "100%", marginTop: "8px", background: "#333", color: "#fff", padding: "6px", border: "1px solid #555" }} />
          <textarea value={config.promotionalPopup.description} onChange={e => setConfig({...config, promotionalPopup: {...config.promotionalPopup, description: e.target.value}})} placeholder="تفاصيل العرض" style={{ width: "100%", marginTop: "8px", background: "#333", color: "#fff", padding: "6px", border: "1px solid #555", minHeight: "60px" }} />
        </div>

        <hr style={{ borderColor: "#333", margin: "15px 0" }} />

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginBottom: "10px", color: "#e2e8f0" }}>ظهور أزرار التواصل والخريطة:</h4>
          {Object.keys(config.socialLinks).map(key => (
            <label key={key} style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginLeft: "15px", marginBottom: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={config.socialLinks[key].show} onChange={e => setConfig({...config, socialLinks: {...config.socialLinks, [key]: {...config.socialLinks[key], show: e.target.checked}}})} />
              <span>{key}</span>
            </label>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button onClick={onClose} style={{ padding: "8px 15px", background: "#555", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>إغلاق</button>
          <button onClick={handleSave} style={{ padding: "8px 20px", background: "#d97706", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>حفظ الإعدادات</button>
        </div>
      </div>
    </div>
  );
};
