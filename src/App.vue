<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dence>
        <v-list-item link to="/users" v-if="userModule.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/products">
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/shops" v-if="userModule.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Shops</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/shopping-list" v-if="userModule.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Shopping List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon
        v-if="userModule.isLoggedIn"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <b>Shopping Manager 🛒</b>
      </div>

      <v-spacer></v-spacer>

      <v-btn text @click="logout()">
        <span v-if="userModule.isLoggedIn" class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import api from "./api";
import { REQUEST_METHODS } from "./config";

export default {
  name: "App",
  components: {
  },
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapState(["userModule"])
  },
  methods: {
    async logout() {
      await this.$store.dispatch("userModule/logout");
      this.drawer = false;
      this.$router.push("/");
    },
  },
  mounted() {
    const { token } = localStorage;
    if (token) {
      api(REQUEST_METHODS.POST, "/auth/login/token", { token })
        .then(({ data }) => {
          this.$store.dispatch("userModule/setAsLoggedIn", data);
        })
        .catch(() => {
          this.$store.dispatch("userModule/logout");
        });
    }
  }
};
</script>
