<template>
    <div class="add-debt">
        <el-dialog
            title="New Debt"
            :visible.sync="visible"
            @close="handleClose()"
            ref="dialog"
        >
            <el-form :model="form" ref="form" v-loading="isLoading">
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
    Dialog,
    Form,
    FormItem,
    Icon,
    Input,
    InputNumber,
    Message,
    Option,
    Popconfirm,
    Select,
    Switch,
    Table,
    TableColumn,
} from "element-ui";
import { axiosInstance } from "@/utils/axios";

Vue.use(Container);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Popconfirm);
Vue.use(Icon);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Popconfirm);
Vue.use(Switch);
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
    isLoading = false;
    handleClose() {
        this.visible = false;
        this.resetForm();
        this.isLoading = false;
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
            this.isLoading = true;
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
        } finally {
            this.isLoading = false;
        }
    }

    async getName() {
        try {
            this.isLoading = true;
            const { data: data } = await axiosInstance.get(
                "user/profile/account-number?number=" + this.form.accountNumber,
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
        } finally {
            this.isLoading = false;
        }
    }
}
</script>
