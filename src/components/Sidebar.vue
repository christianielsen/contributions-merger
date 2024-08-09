<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["submit", "warning", "theme"]);

const localUsername1 = ref(null);
const localUsername2 = ref(null);
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
    palette: ["#e93e3a", "#e93e3a", "#f3903f", "#fdc70c", "#FFF3E0"],
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

const emitSubmit = () => {
  if (localUsername1.value && localUsername2.value) {
    emit("submit", {
      username1: localUsername1.value,
      username2: localUsername2.value,
    });
  } else {
    emit("warning", "Please enter both usernames");
  }
};
</script>

<template>
  <div>
    <h1 class="font-black text-xl p-5">Github Contributions Merger</h1>
    <div class="p-5">
      <FloatLabel class="mb-5">
        <InputText id="username1" type="text" v-model="localUsername1" />
        <label for="username1">Username1</label>
      </FloatLabel>
      <FloatLabel class="mt-6">
        <InputText id="username2" type="text" v-model="localUsername2" />
        <label for="username2">Username2</label>
      </FloatLabel>
      <Button class="mt-3" icon="pi pi-plus" />
      <br />
      <Button class="mt-3" @click="emitSubmit()" label="Render Graphs" />
    </div>
    <div class="p-5">
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
