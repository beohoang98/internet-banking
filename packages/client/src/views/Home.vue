<template>
    <div class="home">
        <app-payment-account />
    </div>
</template>

<script>
import Vue from "vue";
import AppPaymentAccount from "@/components/BankAccountList/PaymentAccount";
import { Aside, Container, Main } from "element-ui";

Vue.component(Container.name, Container);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);

export default {
    name: "Home",
    components: {
        AppPaymentAccount,
    },
};
</script>
