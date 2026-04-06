import { useState } from "react";
import * as React from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected" | "blacklist">("pending");

  // 보안 기능: 우클릭 방지 및 개발자 도구 차단
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

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

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { data: users, isLoading, refetch } = trpc.shark.getUsers.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const updateStatusMutation = trpc.shark.updateUserStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a2e5c] to-[#020b1a]">
        <div className="text-center">
          <p className="text-red-400 text-xl font-semibold mb-4">관리자만 접근 가능합니다.</p>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users?.filter((u: any) => u.status === selectedStatus) || [];

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "approved":
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">승인</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">거절</span>;
      case "blacklist":
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">블랙</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">대기</span>;
    }
  };

  const handleStatusChange = (userId: string, newStatus: "pending" | "approved" | "rejected" | "blacklist") => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a2e5c] to-[#020b1a] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            관리자 패널
          </h1>
          <button
            onClick={() => setLocation("/")}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/15 transition"
          >
            로그아웃
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {["pending", "approved", "rejected", "blacklist"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === status
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 border border-white/20 text-white/70 hover:bg-white/15"
                }`}
              >
                {status === "pending" && "대기 중"}
                {status === "approved" && "승인됨"}
                {status === "rejected" && "거절됨"}
                {status === "blacklist" && "블랙리스트"}
                {users && ` (${users.filter((u: any) => u.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">해당 상태의 사용자가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/80">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">아이디</th>
                  <th className="px-4 py-3 text-left font-semibold">이름</th>
                  <th className="px-4 py-3 text-left font-semibold">닉네임</th>
                  <th className="px-4 py-3 text-left font-semibold">은행</th>
                  <th className="px-4 py-3 text-left font-semibold">계좌</th>
                  <th className="px-4 py-3 text-left font-semibold">휴대폰</th>
                  <th className="px-4 py-3 text-left font-semibold">사이트</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                  <th className="px-4 py-3 text-left font-semibold">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">{user.userId}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.nickname}</td>
                    <td className="px-4 py-3">{user.bank}</td>
                    <td className="px-4 py-3 text-xs">{user.account}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3 text-xs truncate">{user.recentSite}</td>
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {user.status !== "approved" && (
                          <button
                            onClick={() => handleStatusChange(user.userId, "approved")}
                            disabled={updateStatusMutation.isPending}
                            className="p-1 text-green-400 hover:bg-green-500/20 rounded transition disabled:opacity-50"
                            title="승인"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {user.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(user.userId, "rejected")}
                            disabled={updateStatusMutation.isPending}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded transition disabled:opacity-50"
                            title="거절"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        {user.status !== "blacklist" && (
                          <button
                            onClick={() => handleStatusChange(user.userId, "blacklist")}
                            disabled={updateStatusMutation.isPending}
                            className="p-1 text-gray-400 hover:bg-gray-500/20 rounded transition disabled:opacity-50"
                            title="블랙리스트"
                          >
                            <AlertCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
