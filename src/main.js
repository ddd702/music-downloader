import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import naive from 'naive-ui';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';
import App from './App.vue';
import router from './router';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
const app = createApp(App);
app.use(VMdPreview);
app.use(naive);
app.use(createPinia());
app.use(router);

app.mount('#app');
