<template>
    <div class="app-receivers">
        <el-button round icon="el-icon-circle-plus" type="primary">
            New Receiver
        </el-button>
        <hr />
        <el-table border fit show-header :data="tableData">
            <el-table-column prop="id" label="#" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="accountNumber" label="Account Number" />
            <el-table-column
                fixed="right"
                width="auto"
                label="Actions"
                align="right"
            >
                <template slot-scope="{ row }">
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
} from "element-ui";

Vue.component(Container.name, Container);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Button.name, Button);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(Icon.name, Icon);

@Component({
    name: "app-receivers",
})
export default class ReceiversPage extends Vue {
    get tableData() {
        return [
            {
                id: 0,
                name: "Test 1",
                accountNumber: "123456789",
            },
            {
                id: 1,
                name: "Test 2",
                accountNumber: "987654321",
            },
        ];
    }

    handleEdit(row: any) {
        alert(row.name);
    }

    handleDelete(row: any) {
        alert("Delete " + row.name);
    }
}
</script>
