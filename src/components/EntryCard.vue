<template>
  <FBCard class="py-2 pl-4 pr-2">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <router-link :to="linkTo" class="hover:underline" v-if="linkTo">
          <slot />
        </router-link>
        <span v-else><slot /></span>

        <span v-show="showSub" class="text-gray-500 dark:text-gray-400">
          <slot name="sub" />
        </span>
      </div>

      <FBIconButton class="pr-2" @click="$emit('edit')" v-if="onEdit">
        <vue-feather class="w-4 h-4" type="edit"></vue-feather>
      </FBIconButton>
    </div>
  </FBCard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FBCard from "@/components/FlowBite/FBCard.vue";
import FBIconButton from "@/components/FlowBite/FBIconButton.vue";

export default defineComponent({
  name: "EntryCard",
  components: {
    FBCard,
    FBIconButton,
  },
  props: {
    linkTo: String,
    onEdit: Function,
  },
  computed: {
    showSub() {
      return !!this.$slots.sub;
    },
  },
});
</script>