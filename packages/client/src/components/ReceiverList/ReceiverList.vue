<template>
    <div class="app-receiver-list">
        <el-table :data="tableData" style="width: 100%;">
            <el-table-column
                prop="date"
                label="Date"
                width="180"
            ></el-table-column>
            <el-table-column
                prop="name"
                label="Name"
                width="180"
            ></el-table-column>
            <el-table-column prop="address" label="Address"></el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component } from "vue-property-decorator";
    import { Table, TableColumn } from "element-ui";

    Vue.component(Table.name, Table);
    Vue.component(TableColumn.name, TableColumn);

    @Component({
        name: "app-payment-account",
    })
    export default class ReceiverList extends Vue {
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
    }
</script>

<style lang="scss"></style>
