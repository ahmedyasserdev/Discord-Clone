
import { authMiddleware } from "@clerk/nextjs/server";
 
export default authMiddleware({
  publicRoutes: [
   '/sign-in(.*)', '/sign-up(.*)' , "/api/:path*"
  ],
  ignoredRoutes: [
'/sign-in(.*)', '/sign-up(.*)' , "/api/:path*"
  ]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 