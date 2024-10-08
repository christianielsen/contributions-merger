<script setup>
import { ref, watch } from "vue";
import html2canvas from "html2canvas";

const emit = defineEmits(["submit", "warning", "theme"]);

const graphsRendered = ref(false);
const localUsernames = ref([
  { id: Date.now(), value: null },
  { id: Date.now() + 1, value: null },
]);
const themes = ref([
  {
    themeName: "Forest",
    palette: ["#006400", "#228B22", "#32CD32", "#7CFC00", "#FFF3E0"],
  },
  {
    themeName: "Warm",
    palette: ["#FF5733", "#FF8D1A", "#FFC300", "#FFDA79", "#FFF3E0"],
  },
  {
    themeName: "Warmer",
    palette: ["#FF0000", "#e93e3a", "#f3903f", "#fdc70c", "#FFF3E0"],
  },
  {
    themeName: "Cool",
    palette: ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#FFF3E0"],
  },
  {
    themeName: "Sunset",
    palette: ["#ff6e54", "#ffa600", "#ff8c42", "#ff6361", "#FFF3E0"],
  },
  {
    themeName: "Other",
    palette: ["#1d4877", "#1b8a5a", "#fbb021", "#f68838", "#FFF3E0"],
  },
  {
    themeName: "Sage",
    palette: ["#002A26", "#00544d", "#759c8a", "#cbdbcd", "#FFF3E0"],
  },
]);

const selectedTheme = ref(themes.value[0]);

watch(selectedTheme, async (newTheme) => {
  emit("theme", newTheme);
});

const addUsernameField = () => {
  localUsernames.value.push({ id: Date.now(), value: null });
};

const emitSubmit = () => {
  const usernamesArray = localUsernames.value
    .map((u) => u.value)
    .filter(Boolean);
  if (usernamesArray.length > 0) {
    emit("submit", usernamesArray);
    graphsRendered.value = true;
  } else {
    emit("warning", "Please enter at least one username");
  }
};

const removeUsername = (index) => {
  localUsernames.value.splice(index, 1);
};

const exportGraph = () => {
  const graphElement = document.querySelector("#graph-container");
  html2canvas(graphElement, { backgroundColor: null }).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "contributions-graph.png";
    link.click();
  });
};
</script>

<template>
  <div>
    <h1 class="font-black text-xl p-5">Github Contributions Merger</h1>
    <div class="p-5">
      <div
        v-for="(username, index) in localUsernames"
        :key="username.id"
        class="mb-5"
      >
        <FloatLabel>
          <InputGroup>
            <InputText
              :id="'username' + index"
              type="text"
              v-model="username.value"
              :disabled="graphsRendered"
            />
            <Button
              icon="pi pi-minus"
              severity="danger"
              v-if="index !== 0 && index !== 1"
              @click="removeUsername(index)"
              :disabled="graphsRendered"
            />
          </InputGroup>
          <label :for="'username' + index">Username {{ index + 1 }}</label>
        </FloatLabel>
      </div>
      <Button
        class="mt-3"
        icon="pi pi-plus"
        @click="addUsernameField"
        label="Add Username"
        :disabled="graphsRendered"
      />
      <br />
      <Button
        class="mt-3"
        @click="emitSubmit()"
        label="Render Graphs"
        :disabled="graphsRendered"
      >
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-draw-polygon" /></template
      ></Button>
      <br />
      <Button
        class="mt-3"
        icon="pi pi-download"
        label="Export"
        @click="exportGraph()"
        v-if="graphsRendered"
      />
    </div>
    <div class="p-5" v-if="graphsRendered">
      <h2 class="font-bold text-lg">Themes</h2>
      <div
        v-for="theme in themes"
        :key="theme.themeName"
        class="theme-container"
      >
        <RadioButton
          v-model="selectedTheme"
          :inputId="theme.themeName"
          :name="theme.themeName"
          :value="theme"
          class="mr-2"
        />
        <label :for="theme.themeName" class="theme-name pr-5 min-w-20">{{
          theme.themeName
        }}</label>
        <div class="color-squares">
          <li
            v-for="colour in theme.palette"
            :key="colour"
            :style="{ 'background-color': colour }"
            class="color-square"
          ></li>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-squares {
  display: flex;
  margin-right: 10px;
}

.color-square {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  list-style-type: none;
}

.theme-name {
  font-size: 16px;
}
</style>
