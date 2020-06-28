<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
    @import "styles/common";
    body {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #app,
    #app-loader {
        height: 100vh;
        overflow: auto;
    }
</style>
