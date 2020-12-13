import Vue from "vue";
import Vuex from "vuex";
import productModule from "./modules/product";
import shopModule from "./modules/shop";
import userModule from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    userModule,
    productModule,
    shopModule
  }
});
