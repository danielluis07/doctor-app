import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const secret = process.env.AUTH_SECRET!;
  const token = await getToken({
    req,
    secret,
    salt: "authjs.session-token",
  });
  const role = token?.role as "ADMIN" | "DOCTOR" | "PATIENT";

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(`/dashboard/${role.toLowerCase()}`, nextUrl)
      );
    }
    return undefined;
  }

  if (isLoggedIn) {
    const isPatientRoute = nextUrl.pathname.startsWith("/dashboard/patient");
    const isDoctorRoute = nextUrl.pathname.startsWith("/dashboard/doctor");
    const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin");

    if (role === "PATIENT" && !isPatientRoute) {
      return Response.redirect(new URL("/dashboard/patient", nextUrl));
    }
    if (role === "DOCTOR" && !isDoctorRoute) {
      return Response.redirect(new URL("/dashboard/doctor", nextUrl));
    }
    if (role === "ADMIN" && !isAdminRoute) {
      return Response.redirect(new URL("/dashboard/admin", nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return undefined;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
