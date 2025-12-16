import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';

import bootstrap from './core/bootstrap';
import { installThemeProvider } from './core/ThemeProvider';

import '/@/styles/tokens.scss';
import '/@/styles/reset.scss';
import '/@/styles/index.scss';

import Antd from 'ant-design-vue';
import { setupDirectives } from '/@/directives';

const app = createApp(App);

app.use(Antd);
app.use(router);
app.use(piniaStore);
app.use(bootstrap);

// ✅ 两个都要
installThemeProvider(app);
setupDirectives(app);

app.mount('#app');
