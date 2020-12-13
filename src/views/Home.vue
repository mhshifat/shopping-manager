<template>
  <div class="home">
    <h1>Login</h1>
    <p class="error" v-if="userModule.authError">{{userModule.authError}}</p>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        type="email"
        v-model="email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>

      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        :counter="15"
        :rules="passwordRules"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        label="Password"
        required
      ></v-text-field>

      <br />
      <v-btn
        :disabled="!valid"
        :depressed="!valid"
        color="dark"
        :dark="valid ? true : false"
        class="mr-4"
        @click="validate()"
      >
        Submit
      </v-btn>

      <v-btn
        text
        class="mr-4"
        @click="reset()"
      >
        Clear
      </v-btn>

      <v-btn text @click="fillUpFormAsAdmin()">Login as admin</v-btn>
      <v-btn text @click="fillUpFormAsUser()">Login as user</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  ADMIN_EMAIL, ADMIN_PASS, DEMO_USER_EMAIL, DEMO_USER_PASS
} from "../config";

export default {
  name: "Home",
  components: {
  },
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length <= 15) || "Password must be less than 15 characters",
    ],
    showPassword: false,
  }),
  computed: {
    ...mapState(["userModule"])
  },
  methods: {
    fillUpFormAsAdmin() {
      this.email = ADMIN_EMAIL;
      this.password = ADMIN_PASS;
    },
    fillUpFormAsUser() {
      this.email = DEMO_USER_EMAIL;
      this.password = DEMO_USER_PASS;
    },
    async validate() {
      if (!this.$refs.form.validate()) return;
      try {
        const res = await this.$store.dispatch("userModule/login", {
          email: this.email,
          password: this.password,
        });
        if (res) {
          this.$router.push("/products");
        }
      } catch (err) {
        console.log(err);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
  .home {
    min-width: 400px;
    width: 55%;
    margin: 100px auto;
  }

  .error {
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 5px;
    font-weight: normal;
    margin-top: 5px;
  }
</style>
