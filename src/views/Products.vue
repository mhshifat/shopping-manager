<template>
  <div class="about">
    <v-data-table
      :headers="headers"
      :search="search"
      :items="productModule.products"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="search"
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Product
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.name" label="Product name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.price"
                        type="number"
                        label="Price"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.image" label="Image"></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-select
                        v-model="editedItem.shops"
                        :items="shopNames"
                        attach
                        chips
                        label="Chips"
                        multiple
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <img class="product-image" :src="item.image" :alt="item.name">
      </template>
      <template v-slot:[`item.quantities.${STORE_NAMES.STORE1}`]="{ item }">
        <input
          v-model="item.quantities[`${STORE_NAMES.STORE1}`]"
          type="number"
          class="productInput"
        />
      </template>
      <template v-slot:[`item.quantities.${STORE_NAMES.STORE2}`]="{ item }">
        <input
          v-model="item.quantities[`${STORE_NAMES.STORE2}`]"
          type="number"
          class="productInput"
        />
      </template>
      <template v-slot:[`item.quantities.${STORE_NAMES.STORE3}`]="{ item }">
        <input
          v-model="item.quantities[`${STORE_NAMES.STORE3}`]"
          type="number"
          class="productInput"
        />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="saveQuantity(item)">
          mdi-check
        </v-icon>
        <v-icon small class="mr-2" @click="editItem(item)" v-if="userModule.isAdmin">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)" v-if="userModule.isAdmin">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { STORE_NAMES } from "../config";

export default {
  name: "Products",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    STORE_NAMES,
    search: "",
    headers: [
      {
        text: "Product", value: "image", align: "center", sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Price", value: "price", align: "right" },
      {
        text: STORE_NAMES.STORE1, value: `quantities.${STORE_NAMES.STORE1}`, align: "center", sortable: false
      },
      {
        text: STORE_NAMES.STORE2, value: `quantities.${STORE_NAMES.STORE2}`, align: "center", sortable: false
      },
      {
        text: STORE_NAMES.STORE3, value: `quantities.${STORE_NAMES.STORE3}`, align: "center", sortable: false
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      price: null,
      image: "",
      shops: []
    },
    defaultItem: {
      name: "",
      price: null,
      image: "",
      shops: []
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Product" : "Edit Product";
    },
    shopNames() {
      return this.shopModule.shops.map(shop => shop.name);
    },
    ...mapState(["userModule", "productModule", "shopModule"])
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.close();
    },
    dialogDelete(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.closeDelete();
    },
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.productModule.products.indexOf(item);
      this.editedItem = { ...item };
      this.editedItem.shops = this.shopModule.shops.map(
        shop => (item.shops.includes(shop._id) ? shop.name : undefined)
      ).filter(
        itemStr => itemStr !== undefined
      );
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.productModule.products.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const product = this.productModule.products[this.editedIndex];
      await this.$store.dispatch("productModule/deleteProduct", product);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedItem.shops.length > 0) {
        this.editedItem.shops = this.shopModule.shops.map(
          shop => (this.editedItem.shops.includes(shop.name) ? shop._id : undefined)
        ).filter(
          item => item !== undefined
        );
      }

      if (this.editedIndex > -1) {
        this.$store.dispatch("productModule/updateProduct", this.editedItem);
      } else {
        this.$store.dispatch("productModule/createProduct", this.editedItem);
      }
      this.close();
    },
    saveQuantity(item) {
      this.$store.dispatch("productModule/updateProductQuantities", item);
    }
  },
  async mounted() {
    await this.$store.dispatch("productModule/fetchProducts");
    await this.$store.dispatch("shopModule/fetchShops");
  },
};
</script>

<style lang="scss">
  .about {
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

  .productInput {
    text-align: center;
    max-width: 60px;
    padding: 5px 10px;
    border-bottom: 1px solid #000;
    -moz-appearance: textfield;
  }

  .productInput::-webkit-outer-spin-button,
  .productInput::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
