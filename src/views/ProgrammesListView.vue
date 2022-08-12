<template>
  <div>
    <div v-if="fetchStatus === 'loaded'" class="flex flex-col space-y-2">
      <div v-for="programme in programmes" :key="programme.id">
        <ProgrammeEntry :programme="programme" />
      </div>
    </div>
    <div v-else-if="fetchStatus === 'loading'">Loading</div>
  </div>
</template>

<script lang="ts">
import type { Programme } from "@/types/data";
import { defineComponent } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth } from "@/firebase/auth";
import ProgrammeEntry from "@/components/programmes/ProgrammeEntry.vue";

export default defineComponent({
  components: {
    ProgrammeEntry,
  },
  data() {
    return {
      programmes: [] as Programme[],
      fetchStatus: "not loaded" as "not loaded" | "loading" | "loaded",
    };
  },
  created() {
    this.fetchProgrammes();
  },
  methods: {
    isLoading() {
      return this.fetchStatus === "loading";
    },

    async fetchProgrammes() {
      if (!auth.currentUser) return;

      const ref = collection(db, "users", auth.currentUser?.uid, "programmes");

      onSnapshot(ref, (snapshot) => {
        this.programmes = [];
        this.fetchStatus = "loading";

        snapshot.forEach((doc) => {
          const programme = {
            id: doc.id,
            ...doc.data(),
          } as Programme;

          this.programmes.push(programme);
        });

        this.fetchStatus = "loaded";
      });
    },
  },
});
</script>
