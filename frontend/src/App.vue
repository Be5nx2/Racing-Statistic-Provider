<template>
  <main class="app">
    <header class="app__header">
      <h1>Racing Statistic Provider</h1>
      <p class="app__subtitle">
        Vue frontend connected to a TypeScript server.
      </p>
    </header>

    <section class="app__content">
      <button @click="loadStats" :disabled="loading">
        {{ loading ? "Loading..." : "Load sample stats" }}
      </button>

      <pre v-if="error" class="app__error">{{ error }}</pre>
      <pre v-else-if="stats" class="app__output">{{ stats }}</pre>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
const stats = ref<string | null>(null);
const error = ref<string | null>(null);

const loadStats = async () => {
  loading.value = true;
  stats.value = null;
  error.value = null;

  try {
    const res = await fetch("/api/stats");
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    stats.value = JSON.stringify(data, null, 2);
  } catch (e: any) {
    error.value = e.message ?? "Unknown error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: radial-gradient(circle at top, #101827, #020617 60%);
  color: #e5e7eb;
}

.app__header {
  text-align: center;
  margin-bottom: 2rem;
}

.app__subtitle {
  color: #9ca3af;
}

.app__content {
  width: 100%;
  max-width: 720px;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

button {
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.35);
}

button:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 45px rgba(34, 197, 94, 0.4);
}

.app__output,
.app__error {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #020617;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
  overflow-x: auto;
}

.app__error {
  border: 1px solid #f97373;
  color: #fecaca;
}
</style>

