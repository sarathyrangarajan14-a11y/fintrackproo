/**
 * Advanced Client-Side Route & Data Pre-fetching Engine
 * Pre-loads JavaScript component chunks and pre-warms critical API data
 * during browser idle time or on user hover/touch intent.
 */

type RouteLoader = () => Promise<any>;

// Map of route path prefixes to lazy import chunk loaders
const routeLoaders: Record<string, RouteLoader> = {
  "/": () => import("../pages/client/Home"),
  "/explore": () => import("../pages/client/Explore"),
  "/funds": () => import("../pages/client/SchemeDetailView"),
  "/dashboard": () => import("../pages/client/Dashboard"),
  "/goals": () => import("../pages/client/GoalPlanner"),
  "/kyc": () => import("../pages/client/KYC"),
  "/calculators": () => import("../pages/calculators/CalculatorsDashboard"),
  "/calculators/sip": () => import("../pages/calculators/CalculatorsDashboard"),
  "/login": () => import("../pages/client/Login"),
  "/about": () => import("../pages/client/AboutUs"),
  "/contact": () => import("../pages/client/Contact"),
  "/verify-phone": () => import("../pages/client/VerifyPhone"),
  "/profile-setup": () => import("../pages/client/ProfileSetup"),
  "/learn/what-is-mutual-fund": () => import("../pages/learn/WhatIsMutualFund"),
  "/learn/sip-vs-lumpsum": () => import("../pages/learn/SipVsLumpsum"),
  "/learn/taxation": () => import("../pages/learn/TaxationBasics"),
  
  // Partner portal routes
  "/partner/login": () => import("../pages/partner/Login"),
  "/partner/dashboard": () => import("../pages/partner/Dashboard"),
  "/partner/clients": () => import("../pages/partner/Clients"),
  "/partner/client": () => import("../pages/partner/ClientDetail"),
  "/partner/products": () => import("../pages/partner/Products"),
  "/partner/transactions": () => import("../pages/partner/Transactions"),
  "/partner/portfolio": () => import("../pages/partner/Portfolio"),
  "/partner/reports": () => import("../pages/partner/Reports"),
  "/partner/email-logs": () => import("../pages/partner/EmailLogs"),
  "/partner/research": () => import("../pages/partner/Research"),
  "/partner/analytics": () => import("../pages/partner/Analytics"),
  "/partner/tasks": () => import("../pages/partner/Tasks"),
  "/partner/settings": () => import("../pages/partner/Settings"),
  
  // Admin portal routes
  "/admin/login": () => import("../pages/admin/Login"),
  "/admin/dashboard": () => import("../pages/admin/Dashboard"),
};

// Set to avoid redundant network requests
const prefetchedRoutes = new Set<string>();
const prefetchedDataEndpoints = new Set<string>();

/**
 * Matches a URL path (e.g. "/funds/120503" or "/partner/client/2") to the correct loader
 */
function findLoader(path: string): RouteLoader | undefined {
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";
  
  // Exact match
  if (routeLoaders[cleanPath]) {
    return routeLoaders[cleanPath];
  }
  
  // Parameterized prefix match (e.g. /funds/120503 -> /funds)
  for (const prefix of Object.keys(routeLoaders)) {
    if (prefix !== "/" && cleanPath.startsWith(prefix)) {
      return routeLoaders[prefix];
    }
  }
  return undefined;
}

/**
 * Pre-fetches the JavaScript bundle for a given route URL
 */
export function prefetchRoute(path: string): void {
  if (!path) return;
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";
  if (prefetchedRoutes.has(cleanPath)) return;

  const loader = findLoader(cleanPath);
  if (loader) {
    prefetchedRoutes.add(cleanPath);
    // Execute loader in next microtask
    Promise.resolve().then(() => {
      loader().catch((err) => {
        console.warn(`[Prefetch] Chunk prefetch failed for ${cleanPath}:`, err);
        prefetchedRoutes.delete(cleanPath); // allow retry
      });
    });
  }
}

/**
 * Pre-fetches essential data endpoints into browser cache
 */
export function prefetchData(url: string, token?: string): void {
  if (prefetchedDataEndpoints.has(url)) return;
  prefetchedDataEndpoints.add(url);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  fetch(url, { headers, priority: "low" as any }).catch((err) => {
    console.warn(`[Prefetch] Data prefetch failed for ${url}:`, err);
    prefetchedDataEndpoints.delete(url);
  });
}

/**
 * Idle scheduler: automatically pre-fetches high-frequency routes
 * when the browser is idle after initial load.
 */
export function scheduleIdlePrefetch(isPartner = false): void {
  const runPrefetch = () => {
    if (isPartner) {
      const partnerRoutes = [
        "/partner/dashboard",
        "/partner/clients",
        "/partner/products",
        "/partner/transactions",
        "/partner/portfolio",
      ];
      partnerRoutes.forEach((route, idx) => {
        setTimeout(() => prefetchRoute(route), idx * 250);
      });
    } else {
      const coreClientRoutes = [
        "/explore",
        "/dashboard",
        "/goals",
        "/kyc",
        "/calculators",
        "/about",
      ];
      coreClientRoutes.forEach((route, idx) => {
        setTimeout(() => prefetchRoute(route), idx * 300);
      });
      // Also prefetch top mutual funds cache for Explore
      setTimeout(() => {
        prefetchData("/api/instruments?search=fund&limit=12");
      }, 1500);
    }
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(() => {
      setTimeout(runPrefetch, 800);
    }, { timeout: 3000 });
  } else {
    setTimeout(runPrefetch, 1200);
  }
}
