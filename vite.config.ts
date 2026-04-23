import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/rows": "http://localhost:3000",
      "/status": "http://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: [
        "offline.html",
        "icons/icon.svg",
        "icons/apple-touch-icon-180x180.png",
        "icons/maskable-icon-512x512.png",
        "icons/favicon.ico",
        "icons/apple-splash-*.png",
      ],
      manifest: {
        name: "Gêmeos Academia",
        short_name: "Gêmeos",
        description: "Sistema administrativo da academia de artes marciais Gêmeos",
        id: "/login",
        start_url: "/login",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        orientation: "portrait",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        lang: "pt-BR",
        dir: "ltr",
        categories: ["business", "productivity", "sports"],
        icons: [
          { src: "icons/pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          { name: "Alunos", short_name: "Alunos", url: "/alunos?source=pwa_shortcut" },
          { name: "Frequência", short_name: "Frequência", url: "/frequencia?source=pwa_shortcut" },
          { name: "Financeiro", short_name: "Financeiro", url: "/financeiro?source=pwa_shortcut" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"],
        // Em SPA, o fallback de navegação precisa ser o app shell.
        // Usar offline.html aqui quebrava o PWA instalado ao abrir /login.
        navigateFallback: "/index.html",
        // Exclui rotas de API do navigate fallback — elas nunca devem retornar HTML.
        navigateFallbackDenylist: [/^\/rows/, /^\/status/, /^\/api/],
        // Apenas rotas SPA usam o navigate fallback (login, dashboard etc.).
        navigateFallbackAllowlist: [/^\/(?!rows|status|api)/],
        ignoreURLParametersMatching: [/^source$/, /^version$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Ignora querystring no match (útil para /rows?type=...)
        runtimeCaching: [
          {
            // Leituras da API — network-first com cache para modo offline.
            // timeout maior para acomodar cold start da Vercel (serverless pode levar 8-10s).
            urlPattern: ({ url, request }) =>
              request.method === "GET" &&
              (url.pathname.startsWith("/rows") || url.pathname === "/status" || url.pathname.startsWith("/api/")),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              // 24h: se offline há tempo, ainda mostra dados
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Escritas da API — fila em background quando offline.
            // Ao voltar online, o Workbox reenvia automaticamente (Background Sync API).
            urlPattern: ({ url, request }) =>
              request.method === "POST" &&
              (url.pathname.startsWith("/rows") || url.pathname.startsWith("/api/")),
            handler: "NetworkOnly",
            method: "POST",
            options: {
              backgroundSync: {
                name: "gemeos-writes-queue",
                options: {
                  // Reter até 24h; depois disso o registro é descartado
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
          {
            // Mesma fila para PUT.
            urlPattern: ({ url, request }) =>
              request.method === "PUT" &&
              (url.pathname.startsWith("/rows") || url.pathname.startsWith("/api/")),
            handler: "NetworkOnly",
            method: "PUT",
            options: {
              backgroundSync: {
                name: "gemeos-writes-queue",
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            // Mesma fila para PATCH.
            urlPattern: ({ url, request }) =>
              request.method === "PATCH" &&
              (url.pathname.startsWith("/rows") || url.pathname.startsWith("/api/")),
            handler: "NetworkOnly",
            method: "PATCH",
            options: {
              backgroundSync: {
                name: "gemeos-writes-queue",
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            // Mesma fila para DELETE.
            urlPattern: ({ url, request }) =>
              request.method === "DELETE" &&
              (url.pathname.startsWith("/rows") || url.pathname.startsWith("/api/")),
            handler: "NetworkOnly",
            method: "DELETE",
            options: {
              backgroundSync: {
                name: "gemeos-writes-queue",
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "img-cache",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "script" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "font-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
