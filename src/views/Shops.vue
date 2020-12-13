<template>
  <div class="wrapper">
    <v-data-table
      :headers="headers"
      :items="shopModule.shops"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Shops</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" small dark class="mb-2" v-bind="attrs" v-on="on">
                New Shop
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.name" label="Shop Name"></v-text-field>
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
                >Are you sure you want to delete this shop?</v-card-title
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{formatDate(item.createdAt)}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Shops",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Created At", value: "createdAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
    },
    defaultItem: {
      name: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Shop" : "Edit Shop";
    },
    ...mapState(["shopModule"])
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
    formatDate(date) {
      const newDate = new Date(date);
      const day = newDate.getDate();
      const month = newDate.toLocaleString("en-us", { month: "short" });
      const year = newDate.getFullYear();
      return `${day}, ${month} ${year}`;
    },
    editItem(item) {
      this.editedIndex = this.shopModule.shops.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.shopModule.shops.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      const shop = this.shopModule.shops[this.editedIndex];
      await this.$store.dispatch("shopModule/deleteShop", shop);
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
      if (this.editedIndex > -1) {
        this.$store.dispatch("shopModule/updateShop", this.editedItem);
      } else {
        this.$store.dispatch("shopModule/createShop", this.editedItem);
      }
      this.close();
    },
  },
  mounted() {
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
</style>
