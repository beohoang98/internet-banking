import Vue from "vue";
// @ts-ignore
import lang from "element-ui/lib/locale/lang/vi";
// @ts-ignore
import locale from "element-ui/lib/locale";
import { Icon } from "element-ui";
// import 'element-theme-dark/lib/index.css';
locale.use(lang);

Vue.component(Icon.name, Icon);
