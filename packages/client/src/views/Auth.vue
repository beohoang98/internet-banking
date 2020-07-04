<template>
    <div class="app-auth-wrapper">
        <div class="app-auth-form-wrapper">
            <div class="app-auth-form-title text-shadow">
                {{ $route.meta.title }}
            </div>
            <transition :name="transName">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

@Component({
    name: "AuthPage",
})
export default class AuthPage extends Vue {
    transName = "slide-right";

    @Watch("$route")
    watchRoute(to: Route): void {
        const name = to.path.split("/").pop();
        if (name === "login") {
            this.transName = "slide-right";
        } else {
            this.transName = "slide-left";
        }
    }
}
</script>

<style lang="scss">
.app-auth {
    &-wrapper {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
            30deg,
            unquote("rgb(var(--vs-primary, #00c))"),
            #00cccc
        );
    }
    &-form-wrapper {
        max-width: 100%;
        width: 400px;
        text-align: center;
    }
    &-form {
        background-color: white;
        animation: authFormShow both ease-in-out 0.4s;
        overflow: hidden;
        padding-bottom: 100px;

        &-title {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 8px;
        }
    }
}
@keyframes authFormShow {
    0% {
        transform: scale(0.2);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
