<script lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { auth, isLoggedIn } from "@/firebase/auth";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    TheWelcome,
  },
  methods: {
    loggedIn() {
      return isLoggedIn() ? "yes" : "no";
    },
    async onSignOut() {
      console.log("what ?");
      await auth.signOut();
      this.$router.push({ name: "login" });
    },
  },
});
</script>

<template>
  <main>
    <TheWelcome />

    <div>{{ loggedIn() }}</div>
    <br />
    <button @click="onSignOut">Sign Out</button>
  </main>
</template>
