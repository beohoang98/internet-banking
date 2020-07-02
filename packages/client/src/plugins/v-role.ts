import {VNode, VueConstructor} from 'vue';

function VRole(Vue: VueConstructor) {
    function commentNode(el: HTMLElement, vnode: VNode) {
        const commentEl = document.createComment("not in role");
        vnode.elm = commentEl;
        vnode.text = '';
        vnode.isComment = true;
        el.parentNode?.replaceChild(commentEl, el);
    }
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
                commentNode(el, vnode);
            }
            if (
                Array.isArray(binding.value) &&
                !binding.value.includes(
                    vnode.componentInstance?.$store.getters["auth/role"],
                )
            ) {
                commentNode(el, vnode);
            }
        },
    });
}

export default {
    install: VRole,
};
