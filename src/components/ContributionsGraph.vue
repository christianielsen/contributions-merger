<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  contributions: Object,
  theme: Object,
});

const highestContribution = ref("");
const months = ref([]);

const getColor = (level) => {
  const normalizedLevel = level / highestContribution.value;
  const paletteIndex = Math.floor(
    (1 - normalizedLevel) * (props.theme.palette.length - 1)
  );
  return { backgroundColor: props.theme.palette[paletteIndex] };
};

onMounted(() => {
  const tempMonths = [];
  props.contributions.dates.forEach((date) => {
    const shortDate = new Date(date).toLocaleString("default", {
      month: "short",
    });
    if (!tempMonths.includes(shortDate)) {
      tempMonths.push(shortDate);
    }
  });

  months.value = tempMonths;

  highestContribution.value = Math.max(...props.contributions.contributions);
});
</script>

<template>
  <div class="graph">
    <ul class="months">
      <li v-for="month in months">{{ month }}</li>
    </ul>
    <ul class="days">
      <li>Sun</li>
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thu</li>
      <li>Fri</li>
      <li>Sat</li>
    </ul>
    <ul class="squares">
      <li
        v-for="(contribution, index) in props.contributions.contributions"
        :style="getColor(contribution)"
        :data-title="`Contributions on ${props.contributions.dates[index]}: ${contribution}`"
        class="tooltip"
      ></li>
    </ul>
  </div>
</template>

<style scoped>
.months {
  grid-area: months;
}
.days {
  grid-area: days;
}
.squares {
  grid-area: squares;
}

.graph {
  display: inline-grid;
  grid-template-areas:
    "empty months"
    "days squares";
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
}

.months {
  display: grid;
  grid-template-columns:
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 5)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 5)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 5)
    calc(var(--week-width) * 4)
    calc(var(--week-width) * 5);
}

.days,
.squares {
  display: grid;
  grid-gap: var(--square-gap);
  grid-template-rows: repeat(7, var(--square-size));
}

.squares {
  grid-auto-flow: column;
  grid-auto-columns: var(--square-size);
}

ul {
  list-style-type: none;
}

.graph {
  padding-top: 25px;
  padding-right: 20px;
  padding-left: 0px;
  padding-bottom: 15px;
}

.squares li {
  background-color: #ffeaed;
}

.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-title);
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  z-index: 1;
}

.tooltip:hover::after {
  opacity: 1;
}
</style>
