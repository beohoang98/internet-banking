<template>
    <div class="history">
        <el-select
            v-model="type"
            placeholder="Please select a type"
            @change="resetList()"
        >
            <el-option label="SEND" value="send"></el-option>
            <el-option label="RECEIVE" value="receive"></el-option>
            <el-option label="DEBT" value="debt"></el-option>
        </el-select>
        <hr />
        <el-table border fit show-header :data="data" height="800">
            <el-table-column type="index" label="#" />
            <el-table-column prop="createAt" label="Time" />
            <el-table-column prop="account" label="Account Number" />
            <el-table-column prop="amount" label="Amount" />
            <el-table-column prop="note" label="Note" />
            <el-table-column prop="bankType" label="Bank Type" />
        </el-table>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
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
    Tag,
} from "element-ui";
import { Getter } from "vuex-class";
import AddDebt from "@/components/Debt/AddDebt.vue";
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
Vue.component(Tag.name, Tag);

@Component({
    name: "history",
})
export default class History extends Vue {
    @Getter("history/data") data!: any;
    type = "send";

    async resetList() {
        await this.$store.dispatch("history/loadHistoryList", this.type);
    }
    mounted(): void {
        this.$store.dispatch("history/loadHistoryList", "send");
    }
}
</script>
