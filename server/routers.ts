import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

const JOIN_CODE = "2025";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  shark: router({
    signup: publicProcedure
      .input(z.object({
        userId: z.string().min(4),
        password: z.string().min(4),
        nickname: z.string(),
        name: z.string(),
        bank: z.string(),
        account: z.string(),
        exchangePw: z.string(),
        phone: z.string(),
        joinCode: z.string(),
        recentSite: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        if (input.joinCode !== JOIN_CODE) {
          throw new Error("가입 코드가 일치하지 않습니다.");
        }

        // Check if user already exists
        const existing = await db.select().from(users).where(eq(users.userId, input.userId)).limit(1);
        if (existing.length > 0) {
          throw new Error("이미 존재하는 아이디입니다.");
        }

        // Hash passwords
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const hashedExchangePw = await bcrypt.hash(input.exchangePw, 10);

        // Insert user
        await (db as any).insert(users).values({
          userId: input.userId,
          password: hashedPassword,
          nickname: input.nickname,
          name: input.name,
          bank: input.bank,
          account: input.account,
          exchangePw: hashedExchangePw,
          phone: input.phone,
          recentSite: input.recentSite,
          status: "pending",
        });

        return { success: true, message: "회원가입이 완료되었습니다!" };
      }),

    login: publicProcedure
      .input(z.object({
        userId: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const userList = await db.select().from(users).where(eq(users.userId, input.userId)).limit(1);
        const user = userList[0];

        if (!user) {
          throw new Error("아이디 또는 비밀번호가 틀립니다.");
        }

        if (!user.password) {
          throw new Error("아이디 또는 비밀번호가 틀립니다.");
        }

        const isMatch = await bcrypt.compare(input.password, user.password);
        if (!isMatch) {
          throw new Error("아이디 또는 비밀번호가 틀립니다.");
        }

        if (user.status === "approved") {
          return { success: true, message: "로그인 되었습니다.", status: "approved" };
        } else if (user.status === "rejected") {
          return { success: false, message: "가입 거절되었습니다.", status: "rejected" };
        } else if (user.status === "blacklist") {
          return { success: false, message: "블랙리스트로 등록된 사용자입니다.", status: "blacklist" };
        } else {
          return { success: false, message: "가입 승인 대기 중입니다.", status: "pending" };
        }
      }),

    getUsers: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("관리자만 접근 가능합니다.");
      }

      const allUsers = await (db as any).select().from(users);
      return allUsers.map((u: typeof users.$inferSelect) => ({
        id: u.id,
        userId: u.userId,
        nickname: u.nickname,
        name: u.name,
        bank: u.bank,
        account: u.account,
        phone: u.phone,
        recentSite: u.recentSite,
        status: u.status,
        createdAt: u.createdAt,
      }));
    }),

    updateUserStatus: protectedProcedure
      .input(z.object({
        userId: z.string(),
        status: z.enum(["pending", "approved", "rejected", "blacklist"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        if (ctx.user?.role !== "admin") {
          throw new Error("관리자만 접근 가능합니다.");
        }

        await (db as any).update(users).set({ status: input.status }).where(eq(users.userId, input.userId));

        return { success: true, message: "상태가 변경되었습니다." };
      }),
  }),
});

export type AppRouter = typeof appRouter;
