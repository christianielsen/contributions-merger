import { createApp } from "vue";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import Aura from "@primevue/themes/aura";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component("InputText", InputText);
app.component("Button", Button);
app.component("FloatLabel", FloatLabel);

app.mount("#app");
