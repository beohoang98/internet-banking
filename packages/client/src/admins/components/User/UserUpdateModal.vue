<template>
    <el-dialog
        :visible="!!user"
        append-to-body
        destroy-on-close
        :title="modalTitle"
        @close="handleClose"
    >
        <el-form
            ref="form"
            autocomplete="off"
            v-loading="isSubmitting"
            @submit.native.prevent="onAdd"
            :rules="rules"
            :model="form"
        >
            <el-form-item label="Balance">
                <el-input
                    :value="balance | vndFormat"
                    prefix-icon="el-icon-money"
                    :type="showBalance ? 'text' : 'password'"
                >
                    <template #suffix>
                        <el-switch
                            v-model="showBalance"
                            title="toggle visible"
                        />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="Name" prop="name">
                <el-input v-model="form.name" prefix-icon="el-icon-user" />
            </el-form-item>
            <el-form-item prop="phone" label="Phone">
                <el-input v-model="form.phone" prefix-icon="el-icon-phone" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input
                    name="no-fill-email"
                    v-model="form.email"
                    prefix-icon="el-icon-message"
                />
            </el-form-item>
            <!--            <el-form-item label="Password" prop="password">-->
            <!--                <el-input-->
            <!--                    name="no-fill-password"-->
            <!--                    prefix-icon="el-icon-lock"-->
            <!--                    v-model="form.password"-->
            <!--                >-->
            <!--                </el-input>-->
            <!--                <el-button-->
            <!--                    icon="el-icon-refresh"-->
            <!--                    size="small"-->
            <!--                    circle-->
            <!--                    title="Generate"-->
            <!--                    @click="generatePassword"-->
            <!--                />-->
            <!--            </el-form-item>-->
            <el-button native-type="submit" type="primary">
                Update
            </el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import { axiosInstance } from "@/utils/axios";
import { Form } from "element-ui";

@Component({
    name: "admin-user-update-modal",
})
export default class UserUpdateModal extends Vue {
    @Prop({ type: Object, default: null }) user: User | null = null;
    @Ref("form") formRef!: Form;

    form = {
        name: "",
        phone: "",
        email: "",
        // password: "",
    };

    showBalance = false;
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
        // password: [
        //     {
        //         required: true,
        //         type: "string",
        //         min: 6,
        //     },
        // ],
    };

    // generatePassword() {
    //     const arr = new Int8Array(6);
    //     this.form.password = Array.from(window.crypto.getRandomValues(arr))
    //         .map((code) => (code + 127).toString(16))
    //         .join("");
    // }

    @Watch("user", { immediate: true })
    onUserChange(user: User | null) {
        this.form = {
            email: user?.email || "",
            name: user?.name || "",
            phone: user?.phone || "",
        };
    }

    get balance() {
        return this.user?.balance || 0;
    }

    get modalTitle() {
        return `Update customer no.${this.user?.id}`;
    }

    onAdd() {
        this.formRef.validate(async (valid) => {
            if (!valid) return;
            this.isSubmitting = true;
            try {
                const { user } = await axiosInstance.put(
                    `/user/${this.user?.id}`,
                    this.form,
                );
                console.debug(user);
                this.formRef.resetFields();
                this.handleClose();
            } catch (e) {
                this.$message.error({
                    message: e?.response?.data?.message || e + "",
                });
            } finally {
                this.isSubmitting = false;
            }
        });
    }

    handleClose() {
        this.$emit("close");
    }
}
</script>
