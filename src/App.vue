<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import ContributionsChart from "./components/ContributionsChart.vue";
import Sidebar from "./components/Sidebar.vue";

const usernames = ref([]);
const shouldRenderGraph = ref(false);
const toast = useToast();
const theme = ref({
  themeName: "Forest",
  palette: ["#006400", "#228B22", "#32CD32", "#7CFC00", "#FFF3E0"],
});

const renderGraph = async () => {
  const responses = await Promise.all(
    usernames.value.map((username) =>
      fetch(`https://api.github.com/users/${username}`)
    )
  );

  let allValid = true;
  responses.forEach((response, index) => {
    if (response.status === 404) {
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: `${usernames.value[index]}'s github account could not be found`,
        life: 3000,
      });
      allValid = false;
    }
  });

  shouldRenderGraph.value = allValid;
};

const handleSubmit = (usernamesArray) => {
  usernames.value = usernamesArray;
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
      :usernames="usernames"
      :theme="theme"
      class="col-span-10"
    />
  </div>
  <Toast />
</template>

<style scoped></style>
