<template>
  <div>
    <h2>
      <button
        type="button"
        class="flex items-center rounded-t-xl justify-between w-full p-5 font-medium text-left text-xl border border-gray-200 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        :class="{
          'rounded-b-xl': !isOpen,
          'bg-gray-100': isOpen,
          'dark:bg-gray-800': isOpen,
        }"
        @click="isOpen = !isOpen"
      >
        <slot name="title" />
        <vue-feather
          class="w-6 h-6 shrink-0"
          :type="isOpen ? 'chevron-up' : 'chevron-down'"
        ></vue-feather>
      </button>
    </h2>
    <div v-show="isOpen">
      <div
        class="p-3 font-light border rounded-b-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FBAccordionButton",
  data() {
    return {
      isOpen: false,
    };
  },
});
</script>

<style scoped></style>