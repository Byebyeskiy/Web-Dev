<script setup lang="ts">
useHead({
  title: 'Список продуктів'
})

type Product = {
  id: number
  title: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  thumbnail: string
}

const { data } = await useFetch<{ products: Product[] }>(
  'https://dummyjson.com/products'
)

// Search
const searchQuery = ref('')

// Sorting
type SortKey = keyof Pick<Product, 'title' | 'description' | 'price' | 'rating' | 'brand' | 'category'>
const sortKey = ref<SortKey | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

const processedProducts = computed(() => {
  let list = data.value?.products ?? []

  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  if (sortKey.value) {
    const key = sortKey.value
    list = [...list].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortOrder.value === 'asc' ? av - bv : bv - av
      }
      const as = String(av ?? '').toLowerCase()
      const bs = String(bv ?? '').toLowerCase()
      return sortOrder.value === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
    })
  }

  return list
})

const totalPages = computed(() => Math.ceil(processedProducts.value.length / pageSize.value))

watch(searchQuery, () => { currentPage.value = 1 })

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return processedProducts.value.slice(start, start + pageSize.value)
})

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function goToPage(n: number) { currentPage.value = n }

const visiblePages = computed(() => {
  const pages: (number | '...')[] = []
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (cur > 3) pages.push('...')
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
    if (cur < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">Список продуктів</h1>

    <!-- Controls -->
    <div class="controls">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Пошук за назвою, описом, брендом, категорією..."
        />
      </div>
      <select v-model="pageSize" class="page-size-select" @change="currentPage = 1">
        <option :value="5">5 / сторінка</option>
        <option :value="10">10 / сторінка</option>
        <option :value="20">20 / сторінка</option>
        <option :value="50">50 / сторінка</option>
      </select>
    </div>

    <!-- Table card -->
    <div class="table-card">
      <div class="table-wrap">
        <table class="products-table">
          <thead>
          <tr>
            <th class="col-photo">Фото</th>
            <th class="sortable" @click="toggleSort('title')">
              Назва <span class="sort-arrow">{{ sortKey === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('description')">
              Опис <span class="sort-arrow">{{ sortKey === 'description' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('price')">
              Ціна <span class="sort-arrow">{{ sortKey === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('rating')">
              Оцінка <span class="sort-arrow">{{ sortKey === 'rating' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('brand')">
              Бренд <span class="sort-arrow">{{ sortKey === 'brand' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('category')">
              Категорія <span class="sort-arrow">{{ sortKey === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅' }}</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="7" class="no-results">Нічого не знайдено</td>
          </tr>
          <tr v-for="p in paginatedProducts" :key="p.id">
            <td class="col-photo">
              <img :src="p.thumbnail" :alt="p.title" width="100" height="100" />
            </td>
            <td class="col-title">
              <span class="plus-icon">+</span>{{ p.title }}
            </td>
            <td class="col-desc">{{ p.description }}</td>
            <td class="col-price">${{ p.price }}</td>
            <td class="col-rating">
                <span
                  class="rating-badge"
                  :class="p.rating < 4.5 ? 'rating-red' : 'rating-green'"
                >{{ p.rating }}</span>
            </td>
            <td class="col-brand">{{ p.brand }}</td>
            <td>
              <span class="category-tag">{{ p.category }}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar" v-if="totalPages > 1">
        <span class="pagination-info">
          Показано {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, processedProducts.length) }}
          з {{ processedProducts.length }} записів
        </span>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">‹</button>
          <template v-for="p in visiblePages" :key="p">
            <span v-if="p === '...'" class="page-dots">…</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: p === currentPage }"
              @click="goToPage(p as number)"
            >{{ p }}</button>
          </template>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ─────────────────────────────────────────────── */
.page {
  padding: 2rem 2.5rem;
  background: #f4f6f8;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #333;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

/* ── Controls ─────────────────────────────────────────── */
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 260px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.45;
}
.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.4rem;
  border: 1.5px solid #dde2eb;
  border-radius: 8px;
  font-size: 0.92rem;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
}
.search-input:focus {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39,174,96,.12);
}

.page-size-select {
  padding: 0.6rem 0.9rem;
  border: 1.5px solid #dde2eb;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  cursor: pointer;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  transition: border-color 0.2s;
}
.page-size-select:focus { border-color: #27ae60; }

/* ── Table card ───────────────────────────────────────── */
.table-card {
  background: #fff;
  border-radius: 14px;
  /* Green top accent bar, matches the screenshot cards */
  border-top: 4px solid #27ae60;
  box-shadow: 0 4px 24px rgba(0,0,0,.09), 0 1px 4px rgba(0,0,0,.05);
  overflow: hidden;
}

.table-wrap { overflow-x: auto; }

/* ── Table ────────────────────────────────────────────── */
.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.products-table thead tr {
  background: #f9fafb;
  border-bottom: 2px solid #e8ecf0;
}

.products-table th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: #6b7280;
  white-space: nowrap;
}

.products-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;
}
.products-table th.sortable:hover { color: #27ae60; }

.sort-arrow {
  margin-left: 4px;
  font-size: 0.75rem;
  opacity: 0.55;
}

.products-table tbody tr {
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.12s;
}
.products-table tbody tr:last-child { border-bottom: none; }
.products-table tbody tr:hover { background: #f0faf4; }

.products-table td {
  padding: 0.8rem 1rem;
  vertical-align: middle;
  color: #374151;
}

/* ── Columns ──────────────────────────────────────────── */
.col-photo { width: 120px; text-align: center; }
.col-photo img {
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: auto;
  border: 1px solid #e8ecf0;
}

.col-title {
  font-weight: 600;
  color: #1a202c;
  min-width: 140px;
}

/* Green + icon like in the screenshot feature list */
.plus-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: #27ae60;
  color: #fff;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 7px;
  vertical-align: middle;
}

.col-desc {
  max-width: 270px;
  font-size: 0.81rem;
  color: #6b7280;
  line-height: 1.45;
}

.col-price {
  font-weight: 700;
  color: #1a202c;
  white-space: nowrap;
  font-size: 1rem;
}

.col-rating { text-align: center; }
.rating-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.82rem;
}
/* Mirrors the screenshot's savings badge colours */
.rating-green { background: #d1fae5; color: #065f46; }
.rating-red   { background: #fee2e2; color: #991b1b; }

.col-brand { color: #4b5563; font-size: 0.85rem; }

.category-tag {
  display: inline-block;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 20px;
  padding: 4px 11px;
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-style: italic;
}

/* ── Pagination ───────────────────────────────────────── */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f0f2f5;
  background: #fafbfc;
}

.pagination-info {
  font-size: 0.82rem;
  color: #9ca3af;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  background: #fff;
  color: #374151;
  font-size: 0.88rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) {
  background: #f0faf4;
  border-color: #27ae60;
  color: #27ae60;
}
/* Active page — matches the yellow/amber Try It Free button feel but green */
.page-btn.active {
  background: #27ae60;
  border-color: #27ae60;
  color: #fff;
  font-weight: 700;
}
.page-btn:disabled { opacity: 0.3; cursor: default; }

.page-dots { padding: 0 5px; color: #9ca3af; font-size: 1rem; }
</style>
