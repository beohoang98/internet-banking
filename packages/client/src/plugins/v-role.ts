import { VueConstructor } from "vue";

function VRole(Vue: VueConstructor) {
    Vue.directive("role", {
        bind(el, binding, vnode) {
            if (!binding.value) {
                return;
            }
            if (
                binding.value !==
                vnode.componentInstance?.$store.getters["auth/role"]
            ) {
                el.remove();
            }
        },
    });
}

export default {
    install: VRole,
};
