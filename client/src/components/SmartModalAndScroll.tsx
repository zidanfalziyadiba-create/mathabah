// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function SmartModalAndScroll() {
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // تظهر في المنتصف بعد ثانيتين
    const openTimer = setTimeout(() => setShowModal(true), 2000);
    // تغلق تلقائياً بعد 6 ثوانٍ حتى لا تزعج الزائر
    const closeTimer = setTimeout(() => setShowModal(false), 7000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* نافذة العروض الترويجية في منتصف الهاتف والكمبيوتر بدقة */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            padding: "16px",
            boxSizing: "border-box"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              overflow: "hidden",
              maxWidth: "360px",
              width: "100%",
              textAlign: "center",
              direction: "rtl",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              position: "relative",
              border: "1px solid rgba(217, 119, 6, 0.3)"
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              aria-label="إغلاق"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "rgba(0,0,0,0.6)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                zIndex: 10
              }}
            >✕</button>

            <div style={{
              background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
              color: "#ffffff",
              padding: "20px 14px",
              borderBottom: "3px solid #d97706"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>✨🏢</div>
              <span style={{
                backgroundColor: "#d97706",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "bold",
                padding: "3px 10px",
                borderRadius: "12px",
                display: "inline-block",
                marginBottom: "6px"
              }}>
                عروض وخدمات حصرية
              </span>
              <h3 style={{ margin: "2px 0", fontSize: "18px", fontWeight: "bold" }}>
                مؤسسة مثابة
              </h3>
            </div>

            <div style={{ padding: "16px 18px" }}>
              <p style={{ margin: "0 0 14px 0", color: "#4b5563", fontSize: "13px", lineHeight: "1.6" }}>
                نسعد بخدمتكم وتوفير كافة حلول الأعمال والمشاريع المعتمدة بأعلى معايير الجودة.
              </p>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                تصفح الخدمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* زر العودة لأعلى الشاشة - في اليسار لعدم التعارض مع زر الواتساب في اليمين */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="العودة لأعلى"
          style={{
            position: "fixed",
            bottom: "22px",
            left: "20px",
            zIndex: 99998,
            backgroundColor: "#111827",
            color: "#d97706",
            border: "2px solid #d97706",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontSize: "18px"
          }}
        >
          ▲
        </button>
      )}
    </>
  );
}
