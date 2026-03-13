"use client";

import Link from "next/link";

export default function HojePage() {
  return (
    <div className="relative min-h-screen">

      {/* LOGO FULLSCREEN */}

      <img
        src="/logo.png"
        alt="Portal No Secreto"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* CAMADA DE LEITURA */}

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(249,245,233,0.65)",
          zIndex: 1,
        }}
      />

      {/* CONTEÚDO */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 32px",
          color: "#70412d",
        }}
      >

        <p style={{ fontSize: "22px", marginBottom: "80px", fontFamily: "serif" }}>
          “Não é sobre fazer perfeito.
          <br />
          É sobre não desistir.”
        </p>

        <Link
          href="/secreto/1"
          style={{
            padding: "16px 32px",
            background: "#70412d",
            color: "#f9f5e9",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Iniciar meu tempo com Deus
        </Link>

      </div>

    </div>
  );
}