import vinext from "vinext";
import { defineConfig } from "vite";

const basePath = process.env.BASE_PATH ?? "";

export default defineConfig({
  plugins: [vinext()],
  base: basePath ? `${basePath}/` : "/",
});
