<template>
  <div v-if="fetchStatus === 'loaded'" class="flex flex-col space-y-2">
    <div v-for="programme in programmes" :key="programme.id">
      <ProgrammeEntry :programme="programme" />
    </div>
  </div>
  <div v-else-if="fetchStatus === 'loading'">Loading</div>
</template>

<script lang="ts">
import type { Programme } from "@/types/data";
import { defineComponent } from "vue";
import { onSnapshot } from "firebase/firestore";
import ProgrammeEntry from "@/components/programmes/ProgrammeEntry.vue";
import { collectionRef } from "@/firebase/database";

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
    fetchProgrammes() {
      const ref = collectionRef("programmes");

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