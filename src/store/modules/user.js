/* eslint-disable no-underscore-dangle */
import api from "../../api";
import { REQUEST_METHODS } from "../../config";

export default {
  namespaced: true,
  state: {
    isAdmin: false,
    isLoggedIn: false,
    username: "",
    authError: null,
    users: []
  },
  mutations: {
    updateIsAdmin(state, value) {
      state.isAdmin = value;
    },
    updateIsLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
    updateUsername(state, value) {
      state.username = value;
    },
    updateErrMessage(state, value) {
      state.authError = value;
    },
    updateUsers(state, users) {
      state.users = users;
    },
    updateUser(state, user) {
      state.users.splice(
        state.users.findIndex(item => item._id === user._id),
        1,
        user
      );
    },
    removeUser(state, user) {
      state.users.splice(
        state.users.findIndex(item => item._id === user._id),
        1
      );
    }
  },
  actions: {
    login({ commit }, credentials) {
      return api(REQUEST_METHODS.POST, "/auth/login", credentials)
        .then(({ data: { token, user, isAdmin } }) => {
          commit("updateIsLoggedIn", true, { module: "userModule" });
          commit("updateIsAdmin", isAdmin, { module: "userModule" });
          commit("updateUsername", user.username, { module: "userModule" });
          commit("updateErrMessage", null, { module: "userModule" });
          localStorage.token = token;
          return Promise.resolve(true);
        })
        .catch(err => {
          if (err.errorCode) {
            const message = err.errorCode === 400 ? "Invalid username or password" : err.message;
            commit("updateErrMessage", message, { module: "userModule" });
          }
          return Promise.reject(err);
        });
    },
    async loginWithToken() {
      try {
        const { token } = localStorage;
        const res = await api(REQUEST_METHODS.POST, "/auth/login/token", { token });
        return res;
      } catch (err) {
        return err;
      }
    },
    setAsLoggedIn({ commit }, { user, isAdmin }) {
      commit("updateIsLoggedIn", true, { module: "userModule" });
      commit("updateIsAdmin", isAdmin, { module: "userModule" });
      commit("updateUsername", user.username, { module: "userModule" });
      commit("updateErrMessage", null, { module: "userModule" });
    },
    logout({ commit }) {
      commit("updateErrMessage", null, { module: "userModule" });
      commit("updateIsLoggedIn", false, { module: "userModule" });
      commit("updateIsAdmin", false, { module: "userModule" });
      commit("updateUsername", "", { module: "userModule" });
      localStorage.removeItem("token");
    },
    fetchUsers({ commit }) {
      return api(REQUEST_METHODS.GET, "/users")
        .then(({ data }) => {
          commit("updateUsers", data, { module: "userModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    createUser({ dispatch }, user) {
      return api(REQUEST_METHODS.POST, "/users", {
        username: user.username,
        email: user.email,
        password: user.password
      })
        .then(() => {
          dispatch("fetchUsers");
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUser({ commit }, user) {
      return api(REQUEST_METHODS.PUT, `/users/${user._id}`, {
        username: user.username,
        email: user.email,
        ...(user.password ? { password: user.password } : {})
      })
        .then(({ data }) => {
          commit("updateUser", data, { module: "userModule" });
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUser({ commit }, user) {
      return api(REQUEST_METHODS.DELETE, `/users/${user._id}`)
        .then(({ data }) => {
          commit("removeUser", data, { module: "userModule" });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
