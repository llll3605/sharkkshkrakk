import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [, setLocation] = useLocation();

  const loginMutation = trpc.shark.login.useMutation({
    onSuccess: (data) => {
      if (data.status === "approved") {
        setMessageType("success");
        setMessage(data.message);
        setTimeout(() => setLocation("/admin"), 1500);
      } else {
        setMessageType("error");
        setMessage(data.message);
      }
    },
    onError: (error) => {
      setMessageType("error");
      setMessage(error.message || "로그인 실패");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setMessageType("error");
      setMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    loginMutation.mutate({ userId, password });
  };

  useEffect(() => {
    // 보안 기능: 우클릭 방지
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 보안 기능: 개발자 도구 단축키 차단
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // 거품 생성
    const ocean = document.getElementById("ocean");
    if (ocean) {
      for (let i = 0; i < 20; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        const size = Math.random() * 15 + 5 + "px";
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + "vw";
        bubble.style.animationDuration = Math.random() * 5 + 5 + "s";
        bubble.style.animationDelay = Math.random() * 5 + "s";
        ocean.appendChild(bubble);
      }
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 bg-gradient-to-b from-[#0a2e5c] to-[#020b1a] relative overflow-hidden">
      <style>{`
        @keyframes swim-path {
          0% { left: -200px; top: 20%; transform: scaleX(1) rotate(5deg); }
          45% { left: 120%; top: 50%; transform: scaleX(1) rotate(-5deg); }
          50% { left: 120%; top: 50%; transform: scaleX(-1) rotate(-5deg); }
          95% { left: -200px; top: 80%; transform: scaleX(-1) rotate(5deg); }
          100% { left: -200px; top: 20%; transform: scaleX(1) rotate(5deg); }
        }
        @keyframes tail-wag {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.9) skewX(2deg); }
        }
        @keyframes rise {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        .ocean {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
        }
        .bubble {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
          animation: rise 10s infinite ease-in;
        }
        .shark-container {
          position: absolute;
          width: 150px;
          height: 80px;
          z-index: 0;
          pointer-events: none;
          filter: drop-shadow(0 0 15px rgba(0, 242, 255, 0.4));
          animation: swim-path 30s infinite linear;
        }
        .shark-body {
          width: 100%;
          height: 100%;
          fill: #00f2ff;
          opacity: 0.2;
          animation: tail-wag 0.8s infinite ease-in-out;
        }
      `}</style>

      <div className="ocean" id="ocean"></div>

      <div className="shark-container">
        <svg className="shark-body" viewBox="0 0 512 512">
          <path d="M444.8 212.7c-13.6-1.3-32.5-3.9-50.2-3.9-34.6 0-66.5 10.3-89.2 26.5-23.3-15.6-54.3-24.5-89.4-24.5-88.4 0-160 57.3-160 128s71.6 128 160 128c35.1 0 66.1-8.9 89.4-24.5 22.7 16.2 54.6 26.5 89.2 26.5 17.7 0 36.6-2.6 50.2-3.9 11.2-1.1 19.2-10.5 19.2-21.7v-182.2c0-11.2-8-20.6-19.2-21.7zM352 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/>
          <path d="M256 128c15.6 0 31.2 3.1 45.7 9.2 11.3 4.7 24.3-0.7 29-12s-0.7-24.3-12-29C300.3 88.6 278.4 85.3 256 85.3s-44.3 3.3-62.7 10.9c-11.3 4.7-16.7 17.7-12 29s17.7 16.7 29 12c14.5-6.1 30.1-9.2 45.7-9.2z"/>
        </svg>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        <h1 className="text-center text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          SHARK
        </h1>
        <p className="text-center text-cyan-200/70 text-lg md:text-xl mb-8 font-light tracking-wider">
          PREMIUM SYSTEM
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/90 font-semibold text-sm mb-3">
              아이디
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full h-16 bg-white/10 border border-white/20 rounded-2xl px-5 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-white/90 font-semibold text-sm mb-3">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-16 bg-white/10 border border-white/20 rounded-2xl px-5 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-base"
            />
          </div>

          {message && (
            <div
              className={`text-center p-3 rounded-lg text-sm font-medium ${
                messageType === "error"
                  ? "text-red-400 bg-red-500/10"
                  : "text-green-400 bg-green-500/10"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              로그인
            </button>
            <button
              type="button"
              onClick={() => setLocation("/signup")}
              className="w-full h-16 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/15 transition-all"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
