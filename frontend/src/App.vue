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
        {{ loading ? "Loading..." : "Load statistics" }}
      </button>

      <p v-if="error" class="app__error">{{ error }}</p>

      <div v-else-if="statsResult" class="app__stats">
        <p class="app__filter-info">
          Valid lap range: <strong>{{ formatTime(statsResult.minLapTime) }} s</strong>
          – <strong>{{ formatTime(statsResult.maxLapTime) }} s</strong>
        </p>
        <div v-if="statsResult.userStats.length" class="app__table-wrap">
          <table class="app__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Best lap (s)</th>
              <th>Avg lap (s)</th>
              <th>Avg 10 best (s)</th>
              <th>Laps</th>
              <th>10 best lap times</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in statsResult.userStats" :key="row.userName">
              <td class="app__cell-user">{{ row.userName }}</td>
              <td>{{ formatTime(row.bestLapTime) }}</td>
              <td>{{ formatTime(row.averageLapTime) }}</td>
              <td>{{ formatTime(row.averageTenBestLapTimes) }}</td>
              <td>{{ row.lapNumber }}</td>
              <td>
                <ul class="app__lap-list">
                  <li v-for="(t, i) in row.tenBestLapTimes" :key="i">
                    {{ formatTime(t) }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <p v-else class="app__empty">No user statistics in this range.</p>
      </div>

      <p v-else-if="loaded && !statsResult" class="app__empty">No statistics yet.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface StatsResult {
  userStats: UserStatsResult[];
  minLapTime: number;
  maxLapTime: number;
}

interface UserStatsResult {
  userName: string;
  bestLapTime: number;
  averageLapTime: number;
  averageTenBestLapTimes: number;
  tenBestLapTimes: number[];
  lapNumber: number;
}

const loading = ref(false);
const loaded = ref(false);
const statsResult = ref<StatsResult | null>(null);
const error = ref<string | null>(null);

function formatTime(seconds: number): string {
  if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return "–";
  return seconds.toFixed(3);
}

const loadStats = async () => {
  loading.value = true;
  statsResult.value = null;
  error.value = null;

  try {
    const res = await fetch("/api/stats/statistics");
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (data && typeof data.minLapTime === "number" && typeof data.maxLapTime === "number" && Array.isArray(data.userStats)) {
      statsResult.value = data;
    } else {
      statsResult.value = null;
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
    loaded.value = true;
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

.app__error {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #f97373;
  color: #fecaca;
  background: rgba(248, 113, 113, 0.1);
}

.app__empty {
  margin-top: 1.5rem;
  color: #9ca3af;
}

.app__stats {
  margin-top: 1.5rem;
  width: 100%;
}

.app__filter-info {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 0.9rem;
  color: #cbd5e1;
}

.app__filter-info strong {
  color: #e5e7eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.app__table-wrap {
  margin-top: 0;
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.app__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.app__table th,
.app__table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.app__table th {
  font-weight: 600;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.6);
}

.app__table tbody tr:hover {
  background: rgba(30, 41, 59, 0.5);
}

.app__cell-user {
  font-weight: 500;
  color: #e5e7eb;
}

.app__lap-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 0.25rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
}

@media (min-width: 420px) {
  .app__lap-list {
    grid-template-columns: repeat(4, auto);
  }
}

.app__lap-list li {
  padding: 0.15rem 0;
}

.app__lap-list li::before {
  content: "";
  margin-right: 0.35rem;
  color: #64748b;
}
</style>

