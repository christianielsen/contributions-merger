import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

// PrimeVue components
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import RadioButton from "primevue/RadioButton";
import InputGroup from "primevue/inputgroup";
import lara from "@primevue/themes/lara";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faDrawPolygon,
  faObjectGroup,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faDrawPolygon, faObjectGroup);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
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
app.component("InputGroup", InputGroup);
app.use(ToastService);

app.mount("#app");
