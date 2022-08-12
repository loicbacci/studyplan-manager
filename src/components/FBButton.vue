<template>
  <button type="button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FBButton",
});
</script>

<style scoped>
button {
  @apply text-white bg-blue-700 font-medium rounded-lg text-sm px-4 py-2.5;
  @apply dark:bg-blue-600;
}
button:hover {
  @apply hover:bg-blue-800;
  @apply dark:hover:bg-blue-700;
}
button:focus {
  @apply focus:ring-4 focus:ring-blue-300 focus:outline-none;
  @apply dark:focus:ring-blue-800;
}
</style>
