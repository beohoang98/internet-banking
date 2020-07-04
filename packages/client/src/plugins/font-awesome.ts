import { VueConstructor } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
    install(Vue: VueConstructor) {
        Vue.component("font-awesome-icon", FontAwesomeIcon);
    },
};
