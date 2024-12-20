<template>
  <div class="index-page">
    <div class="search-panels">
      <NuxtLink to="/characterSearch" class="search-panel">
        <h2>特徴から検索</h2>
      </NuxtLink>
      <NuxtLink to="/search" class="search-panel">
        <h2>名前から検索</h2>
      </NuxtLink>
      <NuxtLink
        to="/characterDetails" class="search-panel">
        <h2>特徴一覧</h2>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.index-page {
  text-align: center;
  padding: 0;
  /* 余白を消す */
  /* height: 100vh; 画面全体を使用 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 中央に配置 */
  margin: 0;
  /* 余白を消す */
}

.search-panels {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0;
  /* 余白を消す */
  flex-wrap: wrap;
  /* パネルを折り返す */
  max-width: 600px;
}

.search-panel {
  flex: 1 1 calc(50% - 1rem);
  /* パネルを2列に並べる */
  padding: 3.5rem;
  /* パネルを大きくする */
  background-color: #81c784;
  /* ヘッダーよりも明るい色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
  margin-bottom: 0.75em;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  color: white;
  /* 文字を白抜きにする */
  text-decoration: none;
  /* リンクの下線を消す */
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-panel:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}

.search-panel h2 {
  margin: 0;
  font-size: 1.5rem;
  /* 文字を大きくする */
}

@media (max-width: 600px) {
  .search-panel {
    flex: 1 1 100%;
    /* スマホではパネルを縦に並べる */
    margin-bottom: 0.75em;
    /* パネル間の余白を追加 */
  }
}
</style>