<template>
    <div class="add-debt">
        <el-dialog
            title="New Debt"
            :visible.sync="visible"
            @close="handleClose()"
            ref="dialog"
        >
            <el-form :model="form" ref="form">
                <el-form-item
                    label="Account number"
                    :label-width="labelWidth"
                    v-on:change.native="getName()"
                >
                    <el-input
                        v-model="form.accountNumber"
                        autocomplete="off"
                        :disabled="isChoose"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Name" :label-width="labelWidth">
                    <el-input
                        v-model="form.name"
                        autocomplete="off"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Amount" :label-width="labelWidth">
                    <el-input
                        v-model="form.amount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Note" :label-width="labelWidth">
                    <el-input v-model="form.note" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">Close</el-button>
                <el-button type="primary" @click="createDebt()"
                    >Submit</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import { Component, Prop, Watch } from "vue-property-decorator";
    import {
        Button,
        Container,
        Table,
        TableColumn,
        Icon,
        Popconfirm,
        Dialog,
        Form,
        FormItem,
        Input,
        InputNumber,
        Select,
        Option,
        Message,
        Switch,
    } from "element-ui";
    import { axiosInstance } from "../../utils/axios";
    Vue.component(Container.name, Container);
    Vue.component(Table.name, Table);
    Vue.component(TableColumn.name, TableColumn);
    Vue.component(Button.name, Button);
    Vue.component(Popconfirm.name, Popconfirm);
    Vue.component(Icon.name, Icon);
    Vue.component(Dialog.name, Dialog);
    Vue.component(Form.name, Form);
    Vue.component(FormItem.name, FormItem);
    Vue.component(Input.name, Input);
    Vue.component(Select.name, Select);
    Vue.component(Option.name, Option);
    Vue.component(InputNumber.name, InputNumber);
    Vue.component(Message.name, Message);
    Vue.component(Popconfirm.name, Popconfirm);
    Vue.component(Switch.name, Switch);
    @Component({
        name: "add-debt",
    })
    export default class AddDebt extends Vue {
        @Prop({ default: false, type: Boolean }) visible!: boolean;
        @Prop({ default: "", type: String }) accountNumber!: string;
        @Prop({ default: "", type: String }) name!: string;
        @Prop({ default: false, type: Boolean }) isChoose!: boolean;

        @Watch("accountNumber", { immediate: true })
        changeAccountNumber() {
            this.form.accountNumber = this.accountNumber;
        }

        @Watch("name", { immediate: true })
        changeName() {
            this.form.name = this.name;
        }

        labelWidth = "120px";
        form = {
            accountNumber: this.accountNumber,
            name: this.name,
            amount: "",
            note: "",
        };
        handleClose() {
            this.visible = false;
            this.resetForm();
            this.$emit("close-dialog");
        }

        resetForm() {
            this.accountNumber = "";
            this.name = "";
            this.form.amount = "";
            this.form.note = "";
        }

        async createDebt() {
            try {
                await this.$store.dispatch("debt/addDebt", {
                    desAccountNumber: this.form.accountNumber,
                    note: this.form.note,
                    amount: this.form.amount,
                });
                Message({
                    showClose: true,
                    message: "Add new debt successful",
                    type: "success",
                });

                this.handleClose();
            } catch (e) {
                Message({
                    showClose: true,
                    message: e,
                    type: "error",
                });
            }
        }

        async getName() {
            try {
                const { data: data } = await axiosInstance.get(
                    "user/profile/accountnumber?number=" +
                        this.form.accountNumber,
                );
                if (!data) {
                    Message({
                        showClose: true,
                        message: "Cant find account number",
                        type: "error",
                    });
                }
                this.form.name = data.name;
            } catch (e) {
                Message({
                    showClose: true,
                    message: e,
                    type: "error",
                });
            }
        }
    }
</script>
