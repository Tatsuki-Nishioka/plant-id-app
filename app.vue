<template>
  <div id="app">
    <!-- ヘッダー -->
    <header class="app-header">
      <NuxtLink to="/" class="app-title-link">
        <h1 class="app-title">マレシア植物区の同定アプリ</h1>
      </NuxtLink>
      <nav v-if="!isIndexPage" class="app-nav">
        <NuxtLink to="/characterSearch">特徴から検索</NuxtLink>
        <NuxtLink to="/search">名前から検索</NuxtLink>
        <NuxtLink to="/characterDetails">特徴一覧</NuxtLink>
      </nav>
    </header>

    <!-- メインコンテンツ -->
    <main>
      <NuxtPwaManifest />
      <NuxtPage />
    </main>

  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const isIndexPage = computed(() => route.path === '/');

// 植物のマスタデータを取得
usePlantData().loadPlantData();

</script>

<style scoped>
/* ヘッダーのスタイル */
.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4caf50;
  padding: .5rem;
  color: white;
}

.app-title-link {
  text-decoration: none; /* リンクの下線を消す */
}

.app-title {
  font-size: 1.25rem;
  margin: 0;
  color: white;
}

.app-nav {
  display: flex;
  gap: .5rem;
  margin-top: 0.5rem;
}

.app-nav a {
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: #66bb6a;
}

.app-nav a:hover {
  text-decoration: underline;
}

/* メインコンテンツのスタイル */
main {
  padding: 1rem;
  min-height: calc(100vh - 120px); /* ヘッダーとフッターの高さを除く */
}

/* フッターのスタイル */
.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 0.5rem;
}
@media (min-width: 600px) {
  .app-header {
    flex-direction: row;
    justify-content: space-between;
  }

  .app-title {
    font-size: 1.5rem;
  }

  .app-nav {
    margin-top: 0;
  }
}
</style>
