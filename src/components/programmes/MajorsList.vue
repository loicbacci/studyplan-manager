<template>
  <FBAccordionButton v-if="fetchStatus === 'loaded'">
    <template #title>Majors</template>

    <div class="flex flex-col space-y-2">
      <div
        v-for="major in majors"
        :key="major.id"
        class="border-b p-2 rounded border-gray-700 flex justify-between"
      >
        <span class="font-light">{{ major.name }}</span>

        <FBIconButton class="pr-2" @click="() => selectMajor(major.id)">
          <vue-feather class="w-4 h-4" type="edit"></vue-feather>
        </FBIconButton>
      </div>
    </div>
  </FBAccordionButton>

  <FBModal :is-open="isModalOpen" @onClose="isModalOpen = false">
    <template #header>{{ selectedMajor.name }}</template>

    <form class="space-y-6" @submit.prevent>
      <div>
        <label
          for="name"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Enter name"
          required
          v-model="selectedMajorName"
        />
      </div>

      <button
        type="submit"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Edit
      </button>
    </form>
  </FBModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Major } from "@/types/data";
import { collectionRef } from "@/firebase/database";
import type { Unsubscribe } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import FBAccordionButton from "@/components/FlowBite/FBAccordionButton.vue";
import FBIconButton from "@/components/FlowBite/FBIconButton.vue";
import FBModal from "@/components/FlowBite/FBModal.vue";

export default defineComponent({
  name: "MajorsList",
  components: { FBModal, FBAccordionButton, FBIconButton },
  props: {
    programmeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      majors: [] as Major[],
      fetchStatus: "not loaded" as "not loaded" | "loading" | "loaded",
      lastUnsub: null as Unsubscribe | null,
      isOpen: false,
      isModalOpen: false,
      selectedMajorId: "",

      selectedMajorName: "",
    };
  },
  created() {
    this.$watch(() => this.programmeId, this.fetchMajors);
    this.fetchMajors();
  },
  watch: {
    selectedMajorId(newVal) {
      this.selectedMajorName = this.selectedMajor.name;
    },
  },
  computed: {
    selectedMajor() {
      return this.majors.find((m) => m.id === this.selectedMajorId) as Major;
    },
  },
  methods: {
    selectMajor(majorId: string) {
      this.selectedMajorId = majorId;
      this.isModalOpen = true;
    },

    fetchMajors() {
      const ref = collectionRef(`programmes/${this.programmeId}/majors`);

      if (this.lastUnsub) this.lastUnsub();

      this.lastUnsub = onSnapshot(ref, (snapshot) => {
        this.majors = [];
        this.fetchStatus = "loading";

        snapshot.forEach((doc) => {
          const major = {
            id: doc.id,
            ...doc.data(),
          } as Major;

          this.majors.push(major);
        });

        this.fetchStatus = "loaded";
      });
    },
  },
});
</script>

<style scoped></style>