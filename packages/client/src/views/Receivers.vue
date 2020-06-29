<template>
    <div class="app-receivers">
        <el-button
            round
            icon="el-icon-circle-plus"
            type="primary"
            @click="dialogFormVisible = true"
        >New Receiver</el-button>
        <hr />
        <el-table border fit show-header :data="data">
            <el-table-column prop="id" label="#" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="desAccountNumber" label="Account Number" />
            <el-table-column prop="bankType" label="Bank" />
            <el-table-column fixed="right" width="auto" label="Actions" align="right">
                <template slot-scope="{ row }">
                    <el-button type="success">Send Money</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        circle
                        icon="el-icon-edit"
                        @click="() => handleEdit(row)"
                    ></el-button>
                    <el-button
                        slot="reference"
                        circle
                        size="small"
                        type="danger"
                        icon="el-icon-delete"
                        @click="() => handleDelete(row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="ADD NEW RECEIVER" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form">
                <el-form-item label="Bank" :label-width="labelWidth">
                    <el-select v-model="form.bankType" placeholder="Please select a bank type">
                        <el-option label="LOCAL" value="LOCAL"></el-option>
                        <el-option label="PGP" value="PGP"></el-option>
                        <el-option label="RSA" value="RSA"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="Account number"
                    :label-width="labelWidth"
                    :rules="[
                     { required: true, message: 'age is required'}
                     ]"
                >
                    <el-input v-model="form.accountNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Name" :label-width="labelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>s
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="submit" @click="submitForm('form')">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
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
} from "element-ui";
import { Getter } from "vuex-class";

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

@Component({
    name: "app-receivers",
})
export default class ReceiversPage extends Vue {
    dialogFormVisible = false;
    accountNumber = "";
    name = "";
    bankType = "";
    labelWidth = "150px";

    form = {
        name: "",
        bankType: "",
        accountNumber: "",
    };
    num = 0;
    @Getter("receiver/data") data!: any;

    handleEdit(row: any) {
        alert(row.name);
    }

    handleDelete(row: any) {
        alert("Delete " + row.name);
    }

    async submitForm() {
        try {
            await this.$store.dispatch("receiver/addReceiver", {
                desAccountNumber: this.form.accountNumber,
                name: this.form.name,
                bankType: this.form.bankType,
            });
            Message({
                showClose: true,
                message: "Add new receiver successful",
                type: "success",
            });
        } catch (e) {
            alert(e);
        }
    }

    mounted(): void {
        this.$store.dispatch("receiver/loadReceiverList");
    }
}
</script>
