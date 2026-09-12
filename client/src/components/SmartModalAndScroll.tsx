// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function SmartModalAndScroll() {
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // تظهر النافذة بعد ثانية ونصف
    const openTimer = setTimeout(() => setShowModal(true), 1500);
    // تختفي تلقائياً بعد 7 ثوانٍ حتى لا تزعج الزائر
    const closeTimer = setTimeout(() => setShowModal(false), 8500);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999999,
          padding: "16px",
          boxSizing: "border-box"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            direction: "rtl",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            position: "relative",
            animation: "popupAnim 0.35s ease-out"
          }}>
            {/* زر إغلاق دائري وسهل */}
            <button
              onClick={() => setShowModal(false)}
              aria-label="إغلاق"
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(0,0,0,0.5)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                zIndex: 10
              }}
            >✕</button>

            {/* بانر العرض / المناسبات - يمكنك تغيير الصورة أو الألوان لاحقاً */}
            <div style={{
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "24px 16px",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderBottom: "3px solid #d97706"
            }}>
              <div style={{ fontSize: "38px", marginBottom: "6px" }}>🇸🇦✨</div>
              <span style={{
                backgroundColor: "#d97706",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "3px 12px",
                borderRadius: "20px",
                display: "inline-block",
                marginBottom: "8px"
              }}>
                عرض خاص بمناسبة اليوم الوطني
              </span>
              <h3 style={{ margin: "4px 0", fontSize: "20px", fontWeight: "800", color: "#f8fafc" }}>
                مؤسسة مثابة لخدمات الأعمال
              </h3>
            </div>

            {/* تفاصيل العرض */}
            <div style={{ padding: "20px 24px" }}>
              <p style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "14px", lineHeight: "1.7", fontWeight: "500" }}>
                خصومات وعروض حصرية على كافة الحلول المعتمدة وتجهيز المشاريع. نسعد بتواصلكم معنا للاستفادة من الباقات الحالية.
              </p>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                  transition: "background 0.2s"
                }}
              >
                تصفح الخدمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* زر العودة إلى الأعلى */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="العودة لأعلى الصفحة"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            backgroundColor: "#0f172a",
            color: "#ffffff",
            border: "2px solid #d97706",
            borderRadius: "50%",
            width: "46px",
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            fontSize: "20px"
          }}
        >
          ▲
        </button>
      )}

      <style>{`
        @keyframes popupAnim {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
