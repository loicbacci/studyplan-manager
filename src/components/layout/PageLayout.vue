<template>
  <LayoutHeader />

  <div class="container mx-auto pt-4 pb-6 px-2">
    <slot @modalOpen="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LayoutHeader from "@/components/layout/LayoutHeader.vue";

export default defineComponent({
  components: {
    LayoutHeader,
  },

});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  body {
    @apply bg-white dark:bg-gray-900 dark:text-white;
  }
}

</style>
