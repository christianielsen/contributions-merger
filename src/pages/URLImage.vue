<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import ContributionsGraph from "../components/ContributionsGraph.vue";
import { ContributionsService } from "../services/ContributionsService";
import { useRoute } from "vue-router";
import html2canvas from "html2canvas";

const route = useRoute();

const userContributions = ref([]);
const combinedContributions = ref(null);
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

  if (allValid) {
    const contributionsData = await Promise.all(
      usernames.value.map((username) => fetchContributions(username))
    );

    userContributions.value = contributionsData;

    const tempCombinedContributions = contributionsData[0].contributions.map(
      (count, index) =>
        contributionsData.reduce(
          (sum, data) => sum + data.contributions[index],
          0
        )
    );

    combinedContributions.value = {
      dates: contributionsData[0].dates,
      contributions: tempCombinedContributions,
    };

    shouldRenderGraph.value = allValid;

    setTimeout(() => {
      createImage();
    }, 1000);
  }
};

const fetchContributions = async (username) => {
  const data = await ContributionsService.getContributions(username);
  const dates = [];
  const contributions = [];

  data.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
    (week) => {
      week.contributionDays.forEach((day) => {
        dates.push(day.date);
        contributions.push(day.contributionCount);
      });
    }
  );

  return { dates, contributions };
};

onMounted(() => {
  const query = route.query;
  if (query.usernames) {
    usernames.value = query.usernames.split(",");
  }
  //   if (query.theme) {
  //     theme.value = JSON.parse(query.theme);
  //   }
  renderGraph();
});

const createImage = () => {
  const graphElement = document.querySelector("#graph-container");
  html2canvas(graphElement, { backgroundColor: null }).then((canvas) => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    document.querySelector("#graph-container").innerHTML = "";
    document.querySelector("#graph-container").appendChild(img);
  });
};
</script>

<template>
  <div
    class="grid grid-rows-4 gap-4 text-center px-64 pt-5"
    id="graph-container"
    v-if="shouldRenderGraph"
  >
    <div>
      <div class="color-squares justify-center float-right">
        <span class="mr-2">more</span>
        <li
          v-for="colour in theme.palette"
          :key="colour"
          :style="{ 'background-color': colour }"
          class="color-square m-1"
        ></li>
        <span class="ml-2">less</span>
      </div>
      <h1>
        Combined Contributions
        <font-awesome-icon icon="fa-solid fa-object-group" />
      </h1>

      <ContributionsGraph
        :contributions="combinedContributions"
        :theme="theme"
      />
    </div>
    <div v-for="(contribution, index) in userContributions" :key="index">
      <h1>
        {{ usernames[index] }}
      </h1>
      <ContributionsGraph :contributions="contribution" :theme="theme" />
    </div>
  </div>
</template>

<style scoped>
.color-squares {
  display: flex;
}

.color-square {
  width: 15px;
  height: 15px;
  list-style-type: none;
}
</style>
