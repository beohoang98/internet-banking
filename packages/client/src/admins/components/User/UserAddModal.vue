<template>
    <el-dialog
        :visible="visible"
        append-to-body
        destroy-on-close
        title="Add new User"
        @close="() => $emit('update:visible', false)"
    >
        <el-form
            ref="form"
            autocomplete="off"
            v-loading="isSubmitting"
            @submit.native.prevent="onAdd"
            :rules="rules"
            :model="form"
        >
            <el-form-item label="Name" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item prop="phone" label="Phone">
                <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input name="no-fill-email" v-model="form.email" />
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input name="no-fill-password" v-model="form.password">
                </el-input>
                <el-button
                    icon="el-icon-refresh"
                    size="small"
                    circle
                    title="Generate"
                    @click="generatePassword"
                />
            </el-form-item>
            <el-button native-type="submit" type="primary">
                Add
            </el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { axiosInstance } from "@/utils/axios";
import { ElForm } from "element-ui/types/form";

@Component({
    name: "admin-user-add-modal",
})
export default class UserAddModal extends Vue {
    @Prop({ required: true, type: Boolean }) visible!: boolean;

    form = {
        name: "",
        phone: "",
        email: "",
        password: "",
    };

    showPass = false;
    isSubmitting = false;

    rules = {
        name: [
            {
                type: "string",
                min: 5,
                required: true,
            },
        ],
        phone: [
            {
                type: "string",
                required: true,
            },
            {
                type: "regexp",
                pattern: /(09|01[2|6|8|9])+([0-9]{8})\b/g,
                required: true,
            },
        ],
        email: [
            {
                type: "email",
                required: true,
            },
        ],
        password: [
            {
                required: true,
                type: "string",
                min: 6,
            },
        ],
    };

    generatePassword() {
        const arr = new Int8Array(6);
        this.form.password = Array.from(window.crypto.getRandomValues(arr))
            .map((code) => (code + 127).toString(16))
            .join("");
    }

    onAdd() {
        (this.$refs["form"] as ElForm).validate(async (valid) => {
            if (!valid) return;
            this.isSubmitting = true;
            try {
                const { user } = await axiosInstance.post("/user", this.form);
                console.debug(user);
                this.$emit("update:visible", false);
                for (const key in this.form) {
                    (this.form as any)[key] = "";
                }
            } catch (e) {
                this.$message.error({
                    message: e?.response?.data?.message || e + "",
                });
            } finally {
                this.isSubmitting = false;
            }
        });
    }
}
</script>
