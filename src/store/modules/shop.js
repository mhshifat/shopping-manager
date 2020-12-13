/* eslint-disable no-underscore-dangle */
import api from "../../api";
import { REQUEST_METHODS } from "../../config";

export default {
  namespaced: true,
  state: {
    shopError: null,
    shops: []
  },
  mutations: {
    updateShopError(state, value) {
      state.shopError = value;
    },
    updateShops(state, shops) {
      state.shops = shops;
    },
    updateShop(state, shop) {
      state.shops.splice(
        state.shops.findIndex(item => item._id === shop._id),
        1,
        shop
      );
    },
    removeShop(state, shop) {
      state.shops.splice(
        state.shops.findIndex(item => item._id === shop._id),
        1
      );
    }
  },
  actions: {
    fetchShops({ commit }) {
      return api(REQUEST_METHODS.GET, "/shops")
        .then(({ data: { shops } }) => {
          commit("updateShops", shops, { module: "shopModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    createShop({ dispatch }, shop) {
      return api(REQUEST_METHODS.POST, "/shops", {
        name: shop.name
      })
        .then(() => {
          dispatch("fetchShops");
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateShop({ commit }, shop) {
      return api(REQUEST_METHODS.PUT, `/shops/${shop._id}`, {
        name: shop.name
      })
        .then(({ data }) => {
          commit("updateShop", data, { module: "shopModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteShop({ commit }, shop) {
      return api(REQUEST_METHODS.DELETE, `/shops/${shop._id}`)
        .then(({ data }) => {
          commit("removeShop", data, { module: "shopModule" });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
