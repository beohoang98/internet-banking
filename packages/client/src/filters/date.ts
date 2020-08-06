import Vue from "vue";
import dayjs from "dayjs";
Vue.filter("date", (value: string | number) => {
    return dayjs(value).format("DD MMM YYYY");
});
Vue.filter("datetime", (value: string | number) => {
    return dayjs(value).format("DD/MM/YY HH:mm:ss");
});
