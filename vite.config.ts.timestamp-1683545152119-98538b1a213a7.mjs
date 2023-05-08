// vite.config.ts
import replace from "file:///C:/Users/Arta/Desktop/artaaa/repos/kite-c/node_modules/@rollup/plugin-replace/dist/es/index.js";
import react from "file:///C:/Users/Arta/Desktop/artaaa/repos/kite-c/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/Arta/Desktop/artaaa/repos/kite-c/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///C:/Users/Arta/Desktop/artaaa/repos/kite-c/node_modules/vite-plugin-pwa/dist/index.mjs";
var pwaOptions = {
  manifest: {
    name: "Kite",
    short_name: "Kite",
    description: "Kite | A Better Bluesky Web Client",
    theme_color: "#111",
    icons: [
      {
        src: "192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  registerType: "prompt",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}"]
  },
  devOptions: {
    enabled: false
  }
};
var replaceOptions = { __DATE__: (/* @__PURE__ */ new Date()).toISOString() };
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions),
    replace(replaceOptions)
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBcnRhXFxcXERlc2t0b3BcXFxcYXJ0YWFhXFxcXHJlcG9zXFxcXGtpdGUtY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQXJ0YVxcXFxEZXNrdG9wXFxcXGFydGFhYVxcXFxyZXBvc1xcXFxraXRlLWNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FydGEvRGVza3RvcC9hcnRhYWEvcmVwb3Mva2l0ZS1jL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBWaXRlUFdBLCBWaXRlUFdBT3B0aW9ucyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcblxyXG5jb25zdCBwd2FPcHRpb25zOiBQYXJ0aWFsPFZpdGVQV0FPcHRpb25zPiA9IHtcclxuICBtYW5pZmVzdDoge1xyXG4gICAgbmFtZTogXCJLaXRlXCIsXHJcbiAgICBzaG9ydF9uYW1lOiBcIktpdGVcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIktpdGUgfCBBIEJldHRlciBCbHVlc2t5IFdlYiBDbGllbnRcIixcclxuICAgIHRoZW1lX2NvbG9yOiBcIiMxMTFcIixcclxuICAgIGljb25zOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6ICcxOTJ4MTkyLnBuZycsXHJcbiAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcclxuICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiAnNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgcmVnaXN0ZXJUeXBlOiBcInByb21wdFwiLFxyXG4gIHdvcmtib3g6IHtcclxuICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmLHdvZmYyLHR0Zixlb3R9J11cclxuICB9LFxyXG4gIGRldk9wdGlvbnM6IHtcclxuICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVwbGFjZU9wdGlvbnMgPSB7IF9fREFURV9fOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQShwd2FPcHRpb25zKSxcclxuICAgIHJlcGxhY2UocmVwbGFjZU9wdGlvbnMpXHJcbiAgXSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVCxPQUFPLGFBQWE7QUFDL1UsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBK0I7QUFFeEMsSUFBTSxhQUFzQztBQUFBLEVBQzFDLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxFQUNkLFNBQVM7QUFBQSxJQUNQLGNBQWMsQ0FBQyxtREFBbUQ7QUFBQSxFQUNwRTtBQUFBLEVBQ0EsWUFBWTtBQUFBLElBQ1YsU0FBUztBQUFBLEVBQ1g7QUFDRjtBQUVBLElBQU0saUJBQWlCLEVBQUUsV0FBVSxvQkFBSSxLQUFLLEdBQUUsWUFBWSxFQUFFO0FBRzVELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVEsVUFBVTtBQUFBLElBQ2xCLFFBQVEsY0FBYztBQUFBLEVBQ3hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
