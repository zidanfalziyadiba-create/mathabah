// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function SmartModalAndScroll() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // إغلاق النافذة المنبثقة تلقائياً بعد 6 ثوانٍ
    const timer = setTimeout(() => setShowModal(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", zIndex: 2147483647 }}>
      {/* النافذة المنبثقة الترويجية في منتصف الشاشة */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 2147483646
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "340px",
              textAlign: "center",
              direction: "rtl",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                backgroundColor: "#e2e8f0",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >✕</button>

            <div style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "18px 12px" }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>🏢✨</div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#f8fafc" }}>مؤسسة مثابة</h3>
            </div>

            <div style={{ padding: "16px" }}>
              <p style={{ margin: "0 0 14px 0", color: "#334155", fontSize: "13px", lineHeight: "1.6" }}>
                أهلاً بكم في مؤسسة مثابة، نسعد بخدمتكم وتوفير أفضل حلول الأعمال المعتمدة.
              </p>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                تصفح الموقع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* زر العودة لأعلى - ثابت في أسفل اليسار بشكل دائم وبارز */}
      <button
        onClick={goToTop}
        aria-label="العودة لأعلى الصفحة"
        style={{
          position: "fixed",
          bottom: "30px",
          left: "20px",
          zIndex: 2147483647,
          backgroundColor: "#0f172a",
          color: "#d97706",
          border: "2px solid #d97706",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          fontSize: "20px"
        }}
      >
        ▲
      </button>
    </div>
  );
}
