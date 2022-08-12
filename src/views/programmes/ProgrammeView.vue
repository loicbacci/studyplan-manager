<template>
  <div>
    {{ $route.params.id }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProgrammeView",
});
</script>

<style scoped></style>
