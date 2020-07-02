<template>
    <div class="user-management">
        <el-form
            v-loading="loading"
            @submit.native.prevent="onSearch"
            inline
            class="user-search"
            label-position="top"
            :model="form"
        >
            <el-form-item autofocus name="emailOrPhoneOrNumber" required>
                <el-input
                    v-model="form.searchTerm"
                    style="width: 300px;"
                    placeholder="Account Number"
                    type="search"
                    clearable
                    prefix-icon="el-icon-search"
                />
            </el-form-item>
            <el-button type="info" native-type="submit">Search</el-button>
        </el-form>
        <div class="user-list-wrapper">
            <ul class="user-list">
                <transition-group name="el-fade-in" tag="li">
                    <li v-for="user in userList" :key="user.accountNumber">
                        <el-card>
                            <template #header>
                                <el-row
                                    type="flex"
                                    justify="space-between"
                                    align="middle"
                                >
                                    <span>{{ user.accountNumber }}</span>
                                    <div>
                                        <el-button
                                            @click="() => handleDeposit(user)"
                                            icon="el-icon-download"
                                            type="primary"
                                            title="Deposit"
                                            circle
                                        />
                                        <el-button
                                            @click="
                                                () =>
                                                    (chosenUserForUpdate = user)
                                            "
                                            title="Update info"
                                            icon="el-icon-info"
                                            type="info"
                                            circle
                                        />
                                    </div>
                                </el-row>
                            </template>
                            <div>
                                <div>
                                    <strong>Name: </strong
                                    ><span>{{ user.name }}</span>
                                </div>
                                <div>
                                    <strong>Email: </strong
                                    ><span>{{ user.email }}</span>
                                </div>
                            </div>
                        </el-card>
                    </li>
                </transition-group>
            </ul>
        </div>
        <el-button
            type="primary"
            round
            icon="el-icon-plus"
            @click="openAdd = true"
            >Add Customer</el-button
        >
        <admin-user-add-modal :visible.sync="openAdd" />
        <admin-user-deposit-modal
            :user="chosenUserForDeposit"
            :visible="!!chosenUserForDeposit"
            @close="chosenUserForDeposit = null"
        />
        <admin-user-update-modal
            :user="chosenUserForUpdate"
            @close="chosenUserForUpdate = null"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import AdminUserAddModal from "@/admins/components/User/UserAddModal.vue";
import AdminUserDepositModal from "@/admins/components/User/UserDepositModal.vue";
import AdminUserUpdateModal from "@/admins/components/User/UserUpdateModal.vue";

@Component({
    name: "admin-user-management",
    components: {
        AdminUserUpdateModal,
        AdminUserDepositModal,
        AdminUserAddModal,
    },
})
export default class UserManagement extends Vue {
    form = {
        searchTerm: "",
    };
    loading = false;
    openAdd = false;

    chosenUserForDeposit: User | null = null;
    chosenUserForUpdate: User | null = null;

    @Getter("users/list") userList!: User[];

    @Action("users/search") search!: (term: string) => Promise<void>;

    onSearch() {
        this.loading = true;
        this.search(this.form.searchTerm)
            .catch((e) => {
                this.$notify({
                    title: "error",
                    type: "error",
                    message: e?.response?.data?.message || e + "",
                });
            })
            .finally(() => (this.loading = false));
    }

    handleDeposit(user: User) {
        this.chosenUserForDeposit = user;
    }
}
</script>

<style lang="scss">
.user-management {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.user-search {
    flex: 0 0 auto;
}
.user-list {
    padding: 1em;
    margin: 0;
    li {
        list-style: none;
        margin-bottom: 1em;
    }
}
.user-list-wrapper {
    flex: 0 1 auto;
    overflow: auto;
    width: 100%;
}
</style>
