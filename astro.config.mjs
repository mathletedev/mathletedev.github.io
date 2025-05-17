// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
    prefetch: true,
    vite: {
        plugins: [tailwindcss()],
    },
});
