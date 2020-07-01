<template>
    <el-dialog :visible="visible" @close="handleClose">
        <el-form
            v-loading="submitting"
            ref="form"
            :model="form"
            label-position="top"
            :rules="rules"
            @submit.native.prevent="handleSubmit"
        >
            <el-form-item label="Account Number" size="small">
                <el-input readonly :value="user && user.accountNumber" />
            </el-form-item>
            <el-form-item label="Name" size="small">
                <el-input readonly :value="user && user.name" />
            </el-form-item>
            <el-form-item autofocus label="Amount" prop="amount">
                <el-input v-model="amountFormatted" style="font-size: 24px;">
                    <template #append>
                        <strong>VNĐ</strong>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="Employee/Admin Password" prop="password">
                <el-input type="password" v-model="form.password" />
            </el-form-item>
            <vue-recaptcha
                ref="captcha"
                size="invisible"
                loadRecaptchaScript
                :sitekey="sitekey"
            />
            <el-button
                native-type="submit"
                style="display: block;"
                type="warning"
                >Deposit</el-button
            >
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VueRecaptcha from "vue-recaptcha";
import { ElForm } from "element-ui/types/form";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "admin-user-deposit-modal",
    components: { VueRecaptcha },
})
export default class UserDepositModal extends Vue {
    @Prop({ type: Object, default: () => ({}) }) user!: User;
    @Prop({ required: true, type: Boolean }) visible!: boolean;

    submitting = false;

    form = {
        amount: 0,
        password: "",
    };

    rules = {
        amount: [{ type: "integer", min: 1000, required: true }],
        password: [
            {
                type: "string",
                required: true,
            },
        ],
    };

    get sitekey() {
        return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    }

    get amountFormatted(): string {
        return new Intl.NumberFormat().format(this.form.amount);
    }
    set amountFormatted(value: string) {
        const number = Number.parseInt(String(value).replace(/\D+/g, ""));
        if (isNaN(number)) {
            this.form.amount = 0;
            return;
        }
        this.form.amount = number;
    }

    async handleSubmit() {
        this.submitting = true;
        try {
            await (this.$refs.captcha as VueRecaptcha).execute();
            const valid = await (this.$refs.form as ElForm).validate();
            if (!valid) return;

            const { data: transaction } = await axiosInstance.post<Transaction>(
                "/admin/deposit",
                {
                    accountNumber: this.user.accountNumber + "",
                    amount: this.form.amount,
                    password: this.form.password,
                },
            );

            this.$notify({
                type: "success",
                title: "Deposit successful",
                message: `Account ID: ${transaction.id}`,
                onClose: () => {
                    this.handleClose();
                },
            });
        } catch (e) {
            this.$message.error({
                message: e?.response?.data?.message || e + "",
            });
        } finally {
            this.submitting = false;
        }
    }

    handleClose() {
        (this.$refs.form as ElForm).resetFields();
        this.$emit("close");
    }
}
</script>
