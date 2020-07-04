<template>
    <div class="home">
        <app-payment-account />
    </div>
</template>

<script>
import Vue from "vue";
import AppPaymentAccount from "@/components/BankAccountList/PaymentAccount";
import { Aside, Container, Main } from "element-ui";

Vue.use(Aside);
Vue.use(Main);

export default {
    name: "Home",
    components: {
        AppPaymentAccount,
    },
};
</script>
