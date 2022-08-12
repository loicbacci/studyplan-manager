<script lang="ts">
import { defineComponent } from "vue";
import PageLayout from "./components/layout/PageLayout.vue";

export default defineComponent({
  components: {
    PageLayout,
  },
});
</script>

<template>
  <PageLayout>
    <router-view />
  </PageLayout>
</template>
