import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    nickname: "",
    name: "",
    bank: "",
    account: "",
    exchangePw: "",
    phone: "",
    joinCode: "",
    recentSite: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [, setLocation] = useLocation();

  const signupMutation = trpc.shark.signup.useMutation({
    onSuccess: (data) => {
      setMessageType("success");
      setMessage(data.message);
      setTimeout(() => setLocation("/"), 2000);
    },
    onError: (error) => {
      setMessageType("error");
      setMessage(error.message || "회원가입 실패");
    },
  });

  const validateForm = (): boolean => {
    if (!formData.userId || formData.userId.length < 4) {
      setMessageType("error");
      setMessage("아이디는 4글자 이상이어야 합니다.");
      return false;
    }
    if (!formData.password || formData.password.length < 4) {
      setMessageType("error");
      setMessage("비밀번호는 4글자 이상이어야 합니다.");
      return false;
    }
    if (formData.userId === formData.password) {
      setMessageType("error");
      setMessage("아이디와 비밀번호는 동일할 수 없습니다.");
      return false;
    }
    if (!formData.nickname) {
      setMessageType("error");
      setMessage("닉네임을 입력해주세요.");
      return false;
    }
    if (!formData.name || formData.name.length < 2 || formData.name.length > 10) {
      setMessageType("error");
      setMessage("이름은 2~10글자여야 합니다.");
      return false;
    }
    if (!formData.bank) {
      setMessageType("error");
      setMessage("은행을 선택해주세요.");
      return false;
    }
    if (!formData.account || formData.account.length < 8) {
      setMessageType("error");
      setMessage("계좌번호는 8자리 이상이어야 합니다.");
      return false;
    }
    if (!formData.exchangePw) {
      setMessageType("error");
      setMessage("환전 비밀번호를 입력해주세요.");
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setMessageType("error");
      setMessage("올바른 휴대폰번호를 입력해주세요.");
      return false;
    }
    if (!formData.joinCode) {
      setMessageType("error");
      setMessage("가입 코드를 입력해주세요.");
      return false;
    }
    if (!formData.recentSite) {
      setMessageType("error");
      setMessage("최근 이용중인 사이트를 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if ((name === "account" || name === "phone") && value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    signupMutation.mutate(formData);
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
    <div className="min-h-screen flex flex-col justify-start items-center p-5 bg-gradient-to-b from-[#0a2e5c] to-[#020b1a] relative overflow-y-auto pt-20 pb-10">
      <style>{`
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
      `}</style>

      <div className="ocean" id="ocean"></div>

      <div className="w-full max-w-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        <h1 className="text-center text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          SHARK
        </h1>
        <p className="text-center text-cyan-200/70 text-lg md:text-xl mb-8 font-light tracking-wider">
          회원가입
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                아이디
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">영문/숫자/._- 조합, 4글자 이상</p>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">4글자 이상 입력해주세요.</p>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">한글/영문 2~10자</p>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                은행
              </label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              >
                <option value="">은행을 선택하세요</option>
                <option value="국민은행">국민은행</option>
                <option value="신한은행">신한은행</option>
                <option value="우리은행">우리은행</option>
                <option value="하나은행">하나은행</option>
                <option value="농협은행">농협은행</option>
                <option value="기업은행">기업은행</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="토스뱅크">토스뱅크</option>
                <option value="케이뱅크">케이뱅크</option>
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                계좌번호
              </label>
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="계좌번호를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">숫자만 8자리 이상</p>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                환전 비밀번호
              </label>
              <input
                type="password"
                name="exchangePw"
                value={formData.exchangePw}
                onChange={handleChange}
                placeholder="환전 비밀번호를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                휴대폰번호
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="휴대폰번호를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">숫자만 (예: 01012345678)</p>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                가입 코드
              </label>
              <input
                type="password"
                name="joinCode"
                value={formData.joinCode}
                onChange={handleChange}
                placeholder="가입 코드를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">가입 코드를 정확히 입력해야 회원가입이 완료됩니다.</p>
            </div>

            <div className="md:col-span-2">
              <div className="text-center text-cyan-400 font-bold mb-4 tracking-widest animate-pulse">
                ㅡㅡㅡㅡ이사비 신청하기ㅡㅡㅡㅡ
              </div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                최근 이용중인 사이트
              </label>
              <input
                type="text"
                name="recentSite"
                value={formData.recentSite}
                onChange={handleChange}
                placeholder="최근 이용중인 사이트를 입력하세요"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/15 focus:border-cyan-400/50 transition-all text-sm"
              />
              <p className="text-white/40 text-xs mt-1">최근 이용중인 사이트명을 반드시 입력해주세요.</p>
            </div>
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

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {signupMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              회원가입 완료
            </button>
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="w-full h-14 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/15 transition-all"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
