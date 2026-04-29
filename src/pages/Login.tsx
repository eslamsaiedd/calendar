import { useState } from "react";
import { CalendarDays } from 'lucide-react';
// import ThemeToggle from "../ThemeToggle";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: "#0d0f1a",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Purple glow orb */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(100,60,220,0.38) 0%, rgba(80,40,180,0.18) 45%, transparent 72%)",
        }}
      />


        {/* Glow ring */}
        <div
            className="absolute w-[460px] h-[460px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
                /* Creates a soft ring of light without a hard border */
                background: "radial-gradient(circle, transparent 65%, rgba(120, 80, 230, 0.4) 95%, transparent 100%)",
                
                /* Massive, layered shadows to create the "glow" density of the image */
                boxShadow: `
                rgba(110, 60, 255, 0.4) 0px 0px 20px 30px,
                rgba(100, 50, 240, 0.2) 0px 0px 100px 0px,
                rgba(80, 40, 200, 0.1) 0px 0px 300px 10px,
                rgba(110, 60, 255, 0.3) 0px 0px 40px 20px inset
                `,
                /* Softens the entire element to match the 'out of focus' look */
                filter: "blur(8px)", 
            }}
        />


      {/* Card */}
      <div
        className="relative z-10 w-[380px] rounded-2xl px-9 pt-7 pb-7"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgb(175 169 190 / 73%)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-1">
          <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-lg"
           >
            {/* <CalendarDays /> */}
            <CalendarDays className=" text-[#5936d9] w-7 h-7"/>
          </div>
          <span className="text-[30px] font-bold text-[#f0eeff]" style={{ fontFamily: "Syne, sans-serif" }}>
            Chronos
          </span>
        </div>
        <p className="text-center text-[#cac6ea] text-[17px] mb-4">Welcome back</p>

        {/* Inputs */}
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-[10px] px-4 py-3 text-[13px] text-[#f0eeff] placeholder-[#8a87a8] outline-none transition focus:ring-2"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-[10px] px-4 py-3 pr-10 text-[13px] text-[#f0eeff] placeholder-[#8a87a8] outline-none transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer text-[#cac6ea] hover:text-[#f0eeff] transition"
            >
              {/* eye-off icon */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Sign In */}
        <button
          className="w-full py-3 rounded-[10px] text-white hover:cursor-pointer text-[14px] font-bold mb-4 transition hover:opacity-90"
          style={{
            background: "linear-gradient(90deg,#6f4ef2,#9b7ff8)",
            boxShadow: "0 4px 22px rgba(110,70,240,0.42)",
            fontFamily: "Syne, sans-serif",
          }}
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-3.5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[#cac6ea] text-[12px]">or continue with</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Social */}
        <div className="flex gap-2.5 mb-5">
          {["Google", "GitHub"].map((p) => (
            <button
              key={p}
              className="flex-1 flex items-center justify-center hover:cursor-pointer gap-2 py-2.5 rounded-[10px] text-[#f0eeff] text-[13px] font-medium transition hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {p === "Google" ? (
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#f0eeff">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              )}
              {p}
            </button>
          ))}
        </div>

        <p className="text-center text-[13px] text-[#cac6ea]">
          Don't have an account?{" "}
          <a href="#" className="text-[#9b7ff8] font-medium hover:text-white transition">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}