<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import ContributionsChart from "./components/ContributionsChart.vue";
import Sidebar from "./components/Sidebar.vue";

const username1 = ref(null);
const username2 = ref(null);
const shouldRenderGraph = ref(false);
const toast = useToast();
const theme = ref({
  themeName: "Forest",
  palette: ["#006400", "#228B22", "#32CD32", "#7CFC00", "#FFF3E0"],
});

const renderGraph = async () => {
  const user1Response = await fetch(
    `https://api.github.com/users/${username1.value}`
  );
  const user2Response = await fetch(
    `https://api.github.com/users/${username2.value}`
  );

  if (user1Response.status === 404) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: `${username1.value}'s github account could not be found`,
      life: 3000,
    });
  }
  if (user2Response.status === 404) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: `${username2.value}'s github account could not be found`,
      life: 3000,
    });
  }
  if (user1Response.status !== 404 && user2Response.status !== 404) {
    shouldRenderGraph.value = true;
  }
};

const handleSubmit = ({ username1: u1, username2: u2 }) => {
  username1.value = u1;
  username2.value = u2;
  renderGraph();
};

const handleWarning = (message) => {
  toast.add({
    severity: "warn",
    summary: "Warning",
    detail: message,
    life: 3000,
  });
};

const handleThemeChange = (newTheme) => {
  theme.value = newTheme;
};
</script>

<template>
  <div class="grid grid-cols-12">
    <Sidebar
      @submit="handleSubmit"
      @warning="handleWarning"
      @theme="handleThemeChange"
      class="col-span-2"
    />
    <ContributionsChart
      v-if="shouldRenderGraph"
      :username1="username1"
      :username2="username2"
      :theme="theme"
      class="col-span-10"
    />
  </div>
  <Toast />
</template>

<style scoped></style>
