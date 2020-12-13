<template>
  <div class="wrapper">
    <v-data-table
      :headers="headers"
      :search="search"
      :items="filteredItems"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-select
            v-model="filteredShops"
            :items="shopNames"
            attach
            chips
            multiple
            placeholder="Filter by shops"
          ></v-select>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="search"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <img class="product-image" :src="item.image" :alt="item.name">
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{formatDate(item.createdAt)}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { STORE_NAMES } from "../config";

export default {
  name: "shopping-list",
  data: () => ({
    dialog: false,
    STORE_NAMES,
    filteredShops: [],
    search: "",
    headers: [
      {
        text: "Image", value: "image", align: "center", sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Price ($)", value: "price", align: "right" },
      { text: "Created At", value: "createdAt" },
      {
        text: STORE_NAMES.STORE1, value: `quantities.${STORE_NAMES.STORE1}`, align: "center", sortable: false
      },
      {
        text: STORE_NAMES.STORE2, value: `quantities.${STORE_NAMES.STORE2}`, align: "center", sortable: false
      },
      {
        text: STORE_NAMES.STORE3, value: `quantities.${STORE_NAMES.STORE3}`, align: "center", sortable: false
      },
    ],
  }),
  computed: {
    ...mapState(["productModule", "shopModule"]),
    filteredItems() {
      if (this.filteredShops.length > 0) {
        return this.productModule.products.filter(
          product => product.shops.find(shop => this.filteredShops.includes(shop.name))
        );
      }
      return this.productModule.products;
    },
    shopNames() {
      return this.shopModule.shops.map(shop => shop.name);
    },
  },
  methods: {
    formatDate(date) {
      const newDate = new Date(date);
      const day = newDate.getDate();
      const month = newDate.toLocaleString("en-us", { month: "short" });
      const year = newDate.getFullYear();
      return `${day}, ${month} ${year}`;
    },
  },
  mounted() {
    this.$store.dispatch("productModule/fetchProducts");
    this.$store.dispatch("shopModule/fetchShops");
  },
};
</script>

<style lang="scss">
  .wrapper {
    max-width: 980px;
    width: 80%;
    margin: 0 auto;
    margin-top: 50px;
  }

  .product-image {
    height: 60px;
  }

  .search {
    margin-right: 22px;
  }
</style>
