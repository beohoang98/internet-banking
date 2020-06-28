<template>
    <div class="app-payment-account">
        <el-row type="flex" justify="center" align="middle">
            <el-col :md="8">
                <el-card shadow="always">
                    <template #header>
                        Payment Account
                    </template>
                    <h1>{{ 100000 | vndFormat }}</h1>
                    <p><strong>No: </strong>10000000</p>
                </el-card>
            </el-col>
        </el-row>
        <hr />
        <el-row type="flex" justify="space-around">
            <el-col :md="8" v-for="(acc, idx) in testAccounts" :key="idx">
                <el-card shadow="hover">
                    <template #header>Saving Account</template>
                    <h3>{{ acc.balance | vndFormat }}</h3>
                    <p>{{ acc.accountNumber }}</p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component } from "vue-property-decorator";
    import { Card, Row, Col } from "element-ui";

    Vue.component(Card.name, Card);
    Vue.component(Row.name, Row);
    Vue.component(Col.name, Col);

    @Component({
        name: "app-payment-account",
    })
    export default class PaymentAccount extends Vue {
        testAccounts = [
            {
                accountNumber: "123456789",
                balance: 10 ** 6,
            },
        ];
    }
</script>

<style lang="scss"></style>
