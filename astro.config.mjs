// @ts-check
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
    integrations: [svelte()],
    prefetch: true,
    vite: {
        plugins: [tailwindcss()],
    },
});

