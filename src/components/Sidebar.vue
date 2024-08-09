<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "warning"]);

const localUsername1 = ref(null);
const localUsername2 = ref(null);

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
    <h1 class="font-bold text-xl p-5 text-center">
      Github Contributions Merger
    </h1>
    <div class="p-5">
      <FloatLabel class="mb-5">
        <InputText id="username1" type="text" v-model="localUsername1" />
        <label for="username1">Username1</label>
      </FloatLabel>
      <FloatLabel class="mt-6">
        <InputText id="username2" type="text" v-model="localUsername2" />
        <label for="username2">Username2</label>
      </FloatLabel>
      <Button class="mt-3" @click="emitSubmit()">Render Graphs</Button>
    </div>
  </div>
</template>

<style scoped></style>
