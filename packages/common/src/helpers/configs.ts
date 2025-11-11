export const StaticConfig = {
  clientRoutes: ["/", "/chars", "/pols"],
  serverRoutes: ["/api", "/api/chars", "/api/pols"],

  clientRootSelector: "app-root",

  serverRoutesPrefix: "/api",
  serverAllowedMethods: ["get", "post", "put", "delete"],
  serverPreloadFlag: "preload",

  commonHostname: "localhost",
  commonPort: 5000,
  commonSecPort: 5001,
};
