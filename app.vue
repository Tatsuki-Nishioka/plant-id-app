<template>
  <div id="app">
    <!-- ヘッダー -->
    <header class="app-header">
      <h1 class="app-title">植物同定アプリ</h1>
            <button @click="toggleDarkMode">
        {{ isDarkMode ? "ライトモード" : "ダークモード" }}
      </button>
      <nav class="app-nav">
        <NuxtLink to="/">特徴から検索</NuxtLink>
        <NuxtLink to="/search">名前から検索</NuxtLink>
      </nav>
    </header>

    <!-- メインコンテンツ -->
    <main>
      <NuxtPage />
    </main>

    <!-- フッター -->
    <footer class="app-footer">
      <p>&copy; 2024 植物同定アプリ. All rights reserved.</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
/* ヘッダーのスタイル */
.app-header {
  background-color: #4caf50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
}

.app-nav a {
  color: white;
  margin: 0 0.5rem;
  text-decoration: none;
}

.app-nav a:hover {
  text-decoration: underline;
}

/* メインコンテンツのスタイル */
main {
  padding: 2rem;
  min-height: calc(100vh - 120px); /* ヘッダーとフッターの高さを除く */
}

/* フッターのスタイル */
.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
