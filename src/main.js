import { createApp } from "vue";
// PrimeVue components
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import RadioButton from "primevue/RadioButton";

import lara from "@primevue/themes/lara";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: lara,
  },
});
app.component("InputText", InputText);
app.component("Button", Button);
app.component("FloatLabel", FloatLabel);
app.component("Toast", Toast);
app.component("RadioButton", RadioButton);
app.use(ToastService);

app.mount("#app");
