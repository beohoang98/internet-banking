import { VueConstructor } from "vue";

function VRole(Vue: VueConstructor) {
    Vue.directive("role", {
        bind(el, binding, vnode) {
            if (!binding.value) {
                return;
            }
            if (
                typeof binding.value === "string" &&
                binding.value !==
                    vnode.componentInstance?.$store.getters["auth/role"]
            ) {
                el.remove();
            }
            if (
                Array.isArray(binding.value) &&
                !binding.value.includes(
                    vnode.componentInstance?.$store.getters["auth/role"],
                )
            ) {
                el.remove();
            }
        },
    });
}

export default {
    install: VRole,
};
