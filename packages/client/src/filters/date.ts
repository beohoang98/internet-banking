import { VueConstructor } from "vue";
import dayjs from "dayjs";

export default {
    install: (Vue: VueConstructor) => {
        Vue.filter("date", (value: string | number) => {
            return dayjs(value).format("DD MMM yyyy");
        });
        Vue.filter("datetime", (value: string | number) => {
            return dayjs(value).format("DD/MM/yy HH:mm:ss");
        });
    },
};
