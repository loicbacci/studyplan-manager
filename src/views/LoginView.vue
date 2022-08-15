<template>
  <FBCard class="p-4 w-full max-w-sm mx-auto">
    <form class="space-y-6" @submit.prevent="submitForm">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Sign in</h5>
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Your email</label
        >
        <input
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@company.com"
          v-model="email"
          required
        />
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Your password</label
        >
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
          v-model="password"
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  </FBCard>

  <p v-if="errorCode">{{ errorCode }}</p>
</template>

<script lang="ts">
import { auth, isLoggedIn, logIn } from "@/firebase/auth";
import type { AuthError } from "firebase/auth";
import { defineComponent } from "vue";
import FBCard from "@/components/FlowBite/FBCard.vue";

export default defineComponent({
  components: { FBCard },
  mounted() {
    if (this.isLoggedIn) {
      this.redirect();
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      });
    }
  },

  data() {
    return {
      isLoggedIn: isLoggedIn(),
      errorCode: "",
      email: "",
      password: "",

      emailError: "",
      passwordError: "",
    };
  },

  methods: {
    async submitForm() {
      let hasError = false;
      this.passwordError = this.emailError = "";
      if (this.password === "") {
        this.passwordError = "Please enter password";
        hasError = true;
      }
      if (this.email === "") {
        this.emailError = "Please enter email";
        hasError = true;
      }

      if (hasError) return;

      try {
        await logIn(this.email, this.password);
        this.redirect();
      } catch (err) {
        const error = err as AuthError;
        this.errorCode = error.code;
      }
    },

    redirect() {
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect as string });
      } else {
        this.$router.push("/");
      }
    },
  },

  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.redirect();
      }
    },
    errorCode(newVal) {
      this.passwordError = this.emailError = "";

      if (newVal === "auth/wrong-password") {
        this.passwordError = "Wrong password";
      } else if (newVal === "auth/user-not-found") {
        this.emailError = "Wrong email";
      }
    },
  },
});
</script>

<style></style>
