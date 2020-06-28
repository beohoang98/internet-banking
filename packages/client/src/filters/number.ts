import Vue from "vue";

Vue.filter("numberFormat", (value?: number) => {
    if (!value) return "";
    return new Intl.NumberFormat().format(value);
});

Vue.filter("vndFormat", (value?: number) => {
    if (!value) return "";
    return new Intl.NumberFormat().format(value) + " VND";
});
