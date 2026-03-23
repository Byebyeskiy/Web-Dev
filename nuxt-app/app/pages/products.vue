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

</script>

<template>
  <div>
    <h1>Список продуктів</h1>

    <table>
      <thead>
      <tr>
        <th>Фото</th>
        <th>Назва</th>
        <th>Опис</th>
        <th>Ціна</th>
        <th>Оцінка</th>
        <th>Бренд</th>
        <th>Категорія</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="p in data?.products" :key="p.id">

        <td>
          <img :src="p.thumbnail" :alt="p.title" width="100" height="100">
        </td>

        <td>{{ p.title }}</td>
        <td>{{ p.description }}</td>
        <td>{{ p.price }}</td>

        <td :style="{color: p.rating < 4.5 ? 'red' : 'green'}">
          {{ p.rating }}
        </td>

        <td>{{ p.brand }}</td>
        <td>{{ p.category }}</td>

      </tr>
      </tbody>
    </table>
  </div>
</template>
