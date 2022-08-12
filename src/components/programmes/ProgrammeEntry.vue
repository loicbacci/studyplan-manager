<template>
  <FBCard class="py-2 pl-4 pr-2">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <router-link
          :to="`/programmes/${programme.id}`"
          class="hover:underline"
        >
          {{ programme.name }}
        </router-link>
        <span v-show="programme.notes" class="text-gray-500 dark:text-gray-400">
          {{ programme.notes }}
        </span>
      </div>

      <FBIconButton class="pr-2" @click="isModalOpen = true">
        <vue-feather class="w-4 h-4" type="edit"></vue-feather>
      </FBIconButton>
    </div>
  </FBCard>

  <div
    v-show="isModalOpen"
    class="overflow-y-auto overflow-x-hidden fixed md:inset-0 md:h-full"
    style="left: 50%; transform: translate(-50%, 25%)"
  >
    <div class="relative p-4 mx-auto w-full max-w-md h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-toggle="authentication-modal"
          @click="isModalOpen = false"
        >
          <vue-feather type="x"></vue-feather>
        </button>
        <div class="py-6 px-6 lg:px-8">
          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
            {{ programme.name }}
          </h3>
          <form class="space-y-6" action="#">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Programme } from "@/types/data";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import FBCard from "@/components/FBCard.vue";
import FBIconButton from "@/components/FBIconButton.vue";

export default defineComponent({
  components: { FBCard, FBIconButton },
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
