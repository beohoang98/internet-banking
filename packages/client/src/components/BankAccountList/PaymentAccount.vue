<template>
    <div class="app-payment-account">
        <el-row type="flex" justify="center" align="middle">
            <el-col :md="8">
                <el-card shadow="always">
                    <template #header>Payment Account</template>
                    <h1>{{ profile.balance | vndFormat }}</h1>
                    <p>
                        <strong>Account Number:</strong>
                        {{ profile.accountNumber }}
                    </p>
                </el-card>
            </el-col>
        </el-row>
        <hr />
        <el-row type="flex" justify="space-around">
            <el-col :md="8" v-for="(acc, idx) in testAccounts" :key="idx">
                <el-card shadow="hover">
                    <template #header>Saving Account</template>
                    <h3>Name</h3>
                    <h3>{{ acc.balance | vndFormat }}</h3>
                    <p>{{ acc.accountNumber }}</p>
                </el-card>
            </el-col>
        </el-row>
        <br />
        <el-row>
            <el-col :span="12" :offset="12">
                <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="dialogFormVisible = true"
                    circle
                ></el-button>
            </el-col>
        </el-row>
        <el-dialog
            title="ADD NEW SAVING ACCOUNT"
            :visible.sync="dialogFormVisible"
        >
            <el-form :model="form">
                <el-form-item label="Name" :label-width="labelWidth">
                    <el-input v-model="name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Amount" :label-width="labelWidth">
                    <el-input-number
                        v-model="num"
                        controls-position="right"
                        :min="1"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="Time" :label-width="labelWidth">
                    <el-select
                        v-model="region"
                        placeholder="Please select a zone"
                    >
                        <el-option
                            label="Zone No.1"
                            value="shanghai"
                        ></el-option>
                        <el-option
                            label="Zone No.2"
                            value="beijing"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogFormVisible = false"
                    >Confirm</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
    Card,
    Row,
    Col,
    Button,
    Dialog,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    InputNumber,
} from "element-ui";
import { Getter } from "vuex-class";

Vue.component(Card.name, Card);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Button.name, Button);
Vue.component(Dialog.name, Dialog);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(InputNumber.name, InputNumber);

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
    dialogFormVisible = false;
    name = "";
    region = "";
    labelWidth = "120px";
    num = 0;
    @Getter("auth/profile") profile!: any;
}
</script>

<style lang="scss"></style>
