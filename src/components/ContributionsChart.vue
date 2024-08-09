<script setup>
import { ref, onMounted } from "vue";
import { ContributionsService } from "../services/ContributionsService";
import Chart from "chart.js/auto";
import ContributionsGraph from "./ContributionsGraph.vue";

const props = defineProps({
  username1: String,
  username2: String,
  theme: Object,
});

const user1Contributions = ref(null);
const user2Contributions = ref(null);
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
  Promise.all([
    fetchContributions(props.username1),
    fetchContributions(props.username2),
  ]).then(([user1Data, user2Data]) => {
    user1Contributions.value = user1Data;
    user2Contributions.value = user2Data;

    const tempCombinedContributions = user1Data.contributions.map(
      (count, index) => count + user2Data.contributions[index]
    );

    combinedContributions.value = {
      dates: user1Data.dates,
      contributions: tempCombinedContributions,
    };

    const datasets = [
      {
        label: `${props.username1} Contributions`,
        data: user1Data.contributions,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: `${props.username2} Contributions`,
        data: user2Data.contributions,
        borderColor: "rgba(192, 75, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Combined Contributions",
        data: tempCombinedContributions,
        borderColor: "rgba(192, 192, 75, 1)",
        borderWidth: 1,
        fill: false,
      },
    ];

    const contributionsGraph = document
      .getElementById("contributionsGraph")
      .getContext("2d");

    createChart(contributionsGraph, user1Data.dates, datasets);

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
      <h1>Combined Contributions</h1>
      <ContributionsGraph
        v-if="!isLoading"
        :contributions="combinedContributions"
        :theme="theme"
      />
    </div>
    <div>
      <h1>{{ props.username1 }}</h1>
      <ContributionsGraph
        v-if="!isLoading"
        :contributions="user1Contributions"
        :theme="theme"
      />
    </div>
    <div>
      <h1>{{ props.username2 }}</h1>
      <ContributionsGraph
        v-if="!isLoading"
        :contributions="user2Contributions"
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
