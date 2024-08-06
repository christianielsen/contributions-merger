<script setup>
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import ContributionsChart from "./components/ContributionsChart.vue";

const username1 = ref(null);
const username2 = ref(null);
const shouldRenderGraph = ref(false);
const toast = useToast();

const canRenderGraph = computed(() => {
  return username1.value && username2.value;
});

const renderGraph = () => {
  if (canRenderGraph.value) {
    shouldRenderGraph.value = true;
  } else {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Please enter both usernames",
      life: 3000,
    });
  }
};
</script>

<template>
  <Toast />
  <div class="flex items-stretch p-5">
    <FloatLabel class="m-2">
      <InputText id="username1" type="text" v-model="username1" />
      <label for="username1">Username1</label>
    </FloatLabel>
    <FloatLabel class="m-2">
      <InputText id="username2" type="text" v-model="username2" />
      <label for="username2">Username2</label>
    </FloatLabel>
    <Button class="m-2" @click="renderGraph()">Render Graphs</Button>
  </div>
  <ContributionsChart
    v-if="shouldRenderGraph"
    :username1="username1"
    :username2="username2"
  />
</template>

<style scoped></style>
