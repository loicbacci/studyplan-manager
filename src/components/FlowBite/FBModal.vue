<template>
  <div v-show="isOpen" class="backdrop" />

  <div
    v-show="isOpen"
    class="overflow-y-auto overflow-x-hidden z-50 fixed md:inset-0 md:h-full"
    style="left: 50%; transform: translate(-50%, 25%)"
  >
    <div class="relative p-4 mx-auto w-full max-w-md h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          type="button"
          class="close-button"
          data-modal-toggle="authentication-modal"
          @click="$emit('onClose')"
        >
          <vue-feather type="x"></vue-feather>
        </button>
        <div class="py-6 px-6 lg:px-8">
          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
            <slot name="header" />
          </h3>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FBModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["onClose"],
});
</script>

<style scoped>
.backdrop {
  @apply fixed top-0 right-0 left-0 z-50 w-full h-full z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80;
}

.close-button {
  @apply absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white;
}
</style>