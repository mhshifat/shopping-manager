/* eslint-disable no-underscore-dangle */
import api from "../../api";
import { REQUEST_METHODS } from "../../config";

export default {
  namespaced: true,
  state: {
    products: [],
    totalProducts: false
  },
  mutations: {
    addProduct(state, product) {
      state.products.push(product);
    },
    updateProduct(state, product) {
      state.products.splice(
        state.products.findIndex(item => item._id === product._id),
        1,
        product
      );
    },
    removeProduct(state, product) {
      state.products.splice(
        state.products.findIndex(item => item._id === product._id),
        1
      );
    },
    updateProducts(state, value) {
      state.products = value;
    },
    updateTotalProducts(state, value) {
      state.totalProducts = value;
    }
  },
  actions: {
    fetchProducts({ commit }) {
      return api(REQUEST_METHODS.GET, "/products")
        .then(({ data: { products, total } }) => {
          commit("updateProducts", products, { module: "productModule" });
          commit("updateTotalProducts", total, { module: "productModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    createProduct({ commit }, product) {
      return api(REQUEST_METHODS.POST, "/products", {
        name: product.name,
        price: product.price,
        image: product.image,
        shops: product.shops
      })
        .then(({ data }) => {
          commit("addProduct", data, { module: "productModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateProduct({ commit }, product) {
      return api(REQUEST_METHODS.PUT, `/products/${product._id}`, {
        name: product.name,
        price: product.price,
        image: product.image,
        shops: product.shops
      })
        .then(({ data }) => {
          commit("updateProduct", data, { module: "productModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteProduct({ commit }, product) {
      return api(REQUEST_METHODS.DELETE, `/products/${product._id}`)
        .then(({ data }) => {
          commit("removeProduct", data, { module: "productModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateProductQuantities({ commit }, product) {
      return api(REQUEST_METHODS.PATCH, `/products/${product._id}/quantities`, product.quantities)
        .then(({ data }) => {
          commit("updateProduct", data, { module: "productModule" });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
