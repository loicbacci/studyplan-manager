<template>
  <div v-if="fetchStatus === 'loaded'" class="flex flex-col space-y-6">
    <span>{{ programme.name }}</span>

    <MajorsList :programme-id="programme.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Programme } from "@/types/data";
import { docRef } from "@/firebase/database";
import type { Unsubscribe } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import MajorsList from "@/components/programmes/MajorsList.vue";

export default defineComponent({
  name: "ProgrammeView",
  components: { MajorsList },
  data() {
    return {
      programme: null as Programme | null,
      fetchStatus: "not loaded" as "not loaded" | "loading" | "loaded",
      lastUnsub: null as Unsubscribe | null,
    };
  },
  created() {
    this.$watch(() => this.$route.params, this.fetchProgramme);
    this.fetchProgramme();
  },
  methods: {
    fetchProgramme() {
      const ref = docRef(`programmes/${this.$route.params.id}`);

      if (this.lastUnsub) this.lastUnsub();

      this.lastUnsub = onSnapshot(ref, (snapshot) => {
        this.programme = null;
        this.fetchStatus = "loading";

        this.programme = {
          id: snapshot.id,
          ...snapshot.data(),
        } as Programme;

        this.fetchStatus = "loaded";
      });
    },
  },
});
</script>