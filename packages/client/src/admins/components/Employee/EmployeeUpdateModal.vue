<template>
    <el-dialog :visible="!!employee" @close="handleClose" title="Add Employee">
        <el-form
            v-loading="loading"
            ref="form"
            :model="form"
            :rules="rules"
            @submit.native.prevent="handleSubmit"
        >
            <el-form-item prop="name" label="Name">
                <el-input prefix-icon="el-icon-user" v-model="form.name" />
            </el-form-item>
            <el-form-item prop="email" label="Email">
                <el-input prefix-icon="el-icon-message" v-model="form.email" />
            </el-form-item>
            <!--            <el-form-item prop="password" label="Password">-->
            <!--                <el-input-->
            <!--                    prefix-icon="el-icon-lock"-->
            <!--                    type="password"-->
            <!--                    show-password-->
            <!--                    v-model="form.password"-->
            <!--                />-->
            <!--            </el-form-item>-->
            <el-divider />
            <el-button type="primary" native-type="submit">Update</el-button>
        </el-form>
        <el-collapse>
            <el-collapse-item title="More Actions">
                <el-popconfirm
                    title="Are you sure to delete?"
                    icon="el-icon-warning"
                    cancel-button-type="info"
                    cancel-button-text="No"
                    confirm-button-text="Sure"
                    confirm-button-type="danger"
                    @onConfirm="handleDelete"
                >
                    <el-button
                        slot="reference"
                        type="danger"
                        icon="el-icon-delete-solid"
                        >Delete</el-button
                    >
                </el-popconfirm>
            </el-collapse-item>
        </el-collapse>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { Form } from "element-ui";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "admin-employee-update-modal",
})
export default class AdminEmployeeUpdateModal extends Vue {
    @Prop({ type: Object, default: null }) employee!: Admin;
    @Ref("form") formRef: Form;

    form = {
        name: "",
        email: "",
        // password: "",
    };

    rules = {
        name: [{ type: "string", required: true, min: 6 }],
        email: [{ type: "email", require: true }],
        // password: [{ type: "string", require: true, min: 6 }],
    };

    loading = false;

    @Watch("employee", { immediate: true })
    onEmployeeChange(employee: Admin | null) {
        this.form = {
            name: employee?.name || "",
            email: employee?.email || "",
        };
    }

    async handleSubmit() {
        this.loading = true;
        try {
            const valid = await this.formRef.validate();
            if (!valid) return;
            await axiosInstance.put<Admin>(
                `/admin/employee/${this.employee.id}`,
                this.form,
            );

            this.$notify({
                title: `Update Employee successful`,
                type: "success",
                message: "",
            });
            this.handleClose();
        } catch (e) {
            this.$notify({
                type: "error",
                title: "Error",
                message: e?.response?.data?.message || e + "",
            });
        } finally {
            this.loading = false;
        }
    }

    handleClose() {
        this.formRef.resetFields();
        this.$emit("close");
    }

    handleDelete() {
        this.$prompt("Type this employee's name again", "Security Check", {
            type: "info",
            inputType: "text",
            inputValidator: (value) => value === this.employee.name,
        })
            .then(() => {
                return axiosInstance.delete(
                    `/admin/employee/${this.employee.id}`,
                );
            })
            .then(() => {
                this.$notify({
                    title: `Delete Employee successful`,
                    type: "success",
                    message: `${this.employee.name} was deleted`,
                });
                this.handleClose();
            })
            .catch((e) => {
                this.$notify({
                    type: "error",
                    title: "Error",
                    message: e?.response?.data?.message || e + "",
                });
            });
    }
}
</script>

<style lang="scss"></style>
