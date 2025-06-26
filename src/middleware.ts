import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import axios from "axios";
// import { useSession } from "./lib/auth";

const protectedPrefixes = ["/dashboard", "/characters", "/personas", "/profile", "/chat"];
const adminRoutes = ["/admin", "/admin/:path*"]; 
export async function middleware(request: NextRequest) {
	console.log("Middleware triggered for request:", request);
	const sessionCookie = getSessionCookie(request);
	console.log("Session Cookie:", sessionCookie);
	const url = request.nextUrl;
    
	if (
		sessionCookie &&
		(url.pathname === "/auth/login" || url.pathname === "/auth/register" || url.pathname === "/auth/signup")
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}
	if(!sessionCookie&&(url.pathname==="/login"|| url.pathname==="/register" || url.pathname==="/signup")){
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
 
	const isProtected = protectedPrefixes.some(prefix => url.pathname === prefix || url.pathname.startsWith(prefix + "/"));
    const isAdminRoute = adminRoutes.some(route => {
		const prefix = route.replace(":path*", "");
		return url.pathname === prefix || url.pathname.startsWith(prefix + "/");
	});
	
	if (
		!sessionCookie &&
		(isProtected || isAdminRoute)
	) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	if (isAdminRoute && sessionCookie) {
		const cookieHeader = request.headers.get("cookie") || "";
		const backendUrl = process.env.NEXT_PUBLIC_API_URL;
		const response = await axios.get(`${backendUrl}/api/custom-auth/session`, {
			headers: { cookie: cookieHeader }
		});
		if (response.status !== 200 || !response.data) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
        console.log("Admin check response:", response.data);
		const role = response.data?.user?.role;
		if (role !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}
 
export const config = {
	matcher: [
		"/auth/:path*",
		"/dashboard",
		"/characters/:path*",
		"/personas/:path*",
		"/profile",
		"/chat",
		"/admin",
		"/admin/:path*",
		"/login",       // Add these short routes
        "/register",    // to the matcher
        "/signup"
	], // Specify the routes the middleware applies to
};