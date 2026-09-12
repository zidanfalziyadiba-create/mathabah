// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function SmartModalAndScroll() {
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // إظهار الرسالة المنبثقة بعد ثانيتين في المنتصف
    const openTimer = setTimeout(() => setShowModal(true), 2000);
    // إغلاق الرسالة تلقائياً بعد 6 ثوانٍ من ظهورها حتى لا تزعج الزائر
    const closeTimer = setTimeout(() => setShowModal(false), 8000);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* الرسالة المنبثقة في منتصف الشاشة بدقة مع دعم التجاوب */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px 20px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
            direction: "rtl",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            position: "relative",
            animation: "fadeInCenter 0.3s ease-out"
          }}>
            <button
              onClick={() => setShowModal(false)}
              aria-label="إغلاق"
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#64748b"
              }}
            >✕</button>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏢</div>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "19px", fontWeight: "800" }}>
              مرحباً بكم في مؤسسة مثابة
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
              نسعد بخدمتكم وتوفير كافة حلول الأعمال المعتمدة والمتكاملة.
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "#d97706",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%"
              }}
            >
              متابعة التصفح
            </button>
          </div>
        </div>
      )}

      {/* زر العودة إلى الأعلى الذكي */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="العودة لأعلى الصفحة"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            fontSize: "20px"
          }}
        >
          ▲
        </button>
      )}

      <style>{`
        @keyframes fadeInCenter {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
