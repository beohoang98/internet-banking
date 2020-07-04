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
import { Component } from "vue-property-decorator";
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
    Table,
    TableColumn,
    Tag,
} from "element-ui";
import { Getter } from "vuex-class";

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
Vue.use(Tag);

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
