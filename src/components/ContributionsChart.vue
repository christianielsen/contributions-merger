<script setup>
import { ref, onMounted } from "vue";
import { ContributionsService } from "../services/ContributionsService";
import Chart from "chart.js/auto";
import ContributionsGraph from "./ContributionsGraph.vue";

const props = defineProps({
  usernames: Array,
  theme: Object,
});

const userContributions = ref([]);
const combinedContributions = ref(null);
const isLoading = ref(true);

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

const createChart = (ctx, dates, datasets) => {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  Promise.all(
    props.usernames.map((username) => fetchContributions(username))
  ).then((contributionsData) => {
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

    const datasets = contributionsData.map((data, index) => ({
      label: `${props.usernames[index]} Contributions`,
      data: data.contributions,
      borderColor: `rgba(${75 + index * 50}, ${192 - index * 50}, ${
        192 - index * 50
      }, 1)`,
      borderWidth: 1,
      fill: false,
    }));

    datasets.push({
      label: "Combined Contributions",
      data: tempCombinedContributions,
      borderColor: "rgba(192, 192, 75, 1)",
      borderWidth: 1,
      fill: false,
    });

    const contributionsGraph = document
      .getElementById("contributionsGraph")
      .getContext("2d");

    createChart(contributionsGraph, contributionsData[0].dates, datasets);

    isLoading.value = false;
  });
});
</script>

<template>
  <div class="grid grid-rows-4 gap-4 text-center px-64 pt-5">
    <div>
      <div class="color-squares justify-center float-right">
        <span class="mr-2">more</span>
        <li
          v-for="colour in props.theme.palette"
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
        v-if="!isLoading"
        :contributions="combinedContributions"
        :theme="theme"
      />
    </div>
    <div v-for="(contribution, index) in userContributions" :key="index">
      <h1>
        {{ props.usernames[index] }}
      </h1>
      <ContributionsGraph
        v-if="!isLoading"
        :contributions="contribution"
        :theme="theme"
      />
    </div>

    <div>
      <canvas id="contributionsGraph" class="chart pl-5 pr-5"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  max-height: 300px;
}

.color-squares {
  display: flex;
}

.color-square {
  width: 15px;
  height: 15px;
  list-style-type: none;
}
</style>
