<template>
    <div class="app-loading">
        <img alt="" src="/img/apple-icon.png" width="100" />
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "app-loading",
    });
</script>

<style>
    .app-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }
</style>
