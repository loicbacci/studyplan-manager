<script lang="ts">
import { auth, isLoggedIn } from "@/firebase/auth";
import { defineComponent } from "vue";
import FBButton from "@/components/FlowBite/FBButton.vue";
import FBIconButton from "@/components/FlowBite/FBIconButton.vue";

export default defineComponent({
  components: { FBIconButton, FBButton },
  data() {
    return {
      isOpen: false,
      loggedIn: isLoggedIn(),
      isMenuOpen: false,
    };
  },

  mounted() {
    auth.onAuthStateChanged((user) => {
      this.loggedIn = !!user;
      this.isMenuOpen = false;
    });
  },

  methods: {
    async signOut() {
      this.isMenuOpen = false;
      await auth.signOut();
      this.$router.push({ name: "login" });
    },
  },
});
</script>

<template>
  <nav
    class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900"
  >
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <span
        class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
      >
        Study Plan Manager
      </span>

      <FBIconButton
        class="md:hidden"
        v-show="loggedIn"
        @click="isMenuOpen = !isMenuOpen"
      >
        <vue-feather class="w-6 h-6" type="menu"></vue-feather>
      </FBIconButton>

      <div
        class="w-full md:block md:w-auto"
        :class="{ hidden: !isMenuOpen }"
        v-show="loggedIn"
      >
        <ul class="ul-links">
          <li>
            <router-link class="link" to="/" @click="isMenuOpen = false">
              Home
            </router-link>
          </li>
          <li>
            <router-link class="link" to="/about" @click="isMenuOpen = false">
              About
            </router-link>
          </li>
          <li>
            <router-link
              class="link"
              to="/programmes"
              @click="isMenuOpen = false"
            >
              Programmes
            </router-link>
          </li>
          <li class="mt-2 md:mt-0">
            <FBButton @click="signOut">Sign Out</FBButton>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .current-link {
    @apply block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white;
  }

  .link {
    @apply block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent;
  }

  .ul-links {
    @apply flex flex-col items-start md:items-center p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700;
  }

  .nav-btn {
    @apply inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600;
  }
}
</style>
