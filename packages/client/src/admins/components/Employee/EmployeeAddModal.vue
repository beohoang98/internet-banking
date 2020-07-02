<template>
    <el-dialog :visible="visible" @close="handleClose" title="Add Employee">
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
            <el-form-item prop="password" label="Password">
                <el-input
                    prefix-icon="el-icon-lock"
                    type="password"
                    show-password
                    v-model="form.password"
                />
            </el-form-item>
            <el-divider />
            <el-button type="primary" native-type="submit">Add</el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { Form } from "element-ui";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "admin-employee-add-modal",
})
export default class AdminEmployeeAddModal extends Vue {
    @Prop({ type: Boolean, required: true }) visible!: boolean;
    @Ref("form") formRef: Form;

    form = {
        name: "",
        email: "",
        password: "",
    };

    rules = {
        name: [{ type: "string", required: true, min: 6 }],
        email: [{ type: "email", require: true }],
        password: [{ type: "string", require: true, min: 6 }],
    };

    loading = false;

    async handleSubmit() {
        this.loading = true;
        try {
            const valid = await this.formRef.validate();
            if (!valid) return;
            const { data } = await axiosInstance.post<Admin>(
                "/admin/employee",
                this.form,
            );

            this.$notify({
                title: `Add Employee ${data.id} successful`,
                type: "success",
                message: `
                    <div><strong>Name: </strong>${data.name}</div>
                    <div><strong>Email: </strong>${data.email}</div>
                    `,
                dangerouslyUseHTMLString: true,
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
        this.$emit("update:visible", false);
    }
}
</script>

<style lang="scss"></style>
