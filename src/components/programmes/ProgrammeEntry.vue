<template>
  <EntryCard
    :link-to="`/programmes/${programme.id}`"
    @edit="isModalOpen = true"
  >
    {{ programme.name }}

    <template #sub v-if="programme.notes">
      {{ programme.notes }}
    </template>
  </EntryCard>

  <FBModal :isOpen="isModalOpen" @onClose="isModalOpen = false">
    <template #header>{{ programme.name }}</template>
    <template #default>
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
            v-model="name"
          />
        </div>

        <div>
          <label
            for="notes"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Name
          </label>
          <textarea
            id="notes"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter notes..."
            v-model="notes"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Edit
        </button>
      </form>
    </template>
  </FBModal>
</template>

<script lang="ts">
import type { Programme } from "@/types/data";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import FBModal from "@/components/FlowBite/FBModal.vue";
import EntryCard from "@/components/EntryCard.vue";

export default defineComponent({
  components: { EntryCard, FBModal },
  props: {
    programme: {
      type: Object as PropType<Programme>,
      required: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
      name: this.programme.name,
      notes: this.programme.notes,
    };
  },
  watch: {
    isModalOpen(newVal) {
      console.log(newVal);
    },
  },
});
</script>