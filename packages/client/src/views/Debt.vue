<template>
    <div class="Debt">
        <DebtHome />
    </div>
</template>

<script>
    import Vue from "vue";
    import DebtHome from "@/components/Debt/DebtHome.vue";

    export default {
        name: "Debt",
        components: {
            DebtHome,
        },
    };
</script>
