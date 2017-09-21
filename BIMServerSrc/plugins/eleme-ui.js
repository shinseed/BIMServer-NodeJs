import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import ElTreeGrid from '~/components/eleme-tree-grid/table-column'
import Icon from 'vue-awesome-for-toolbar'

Vue.component('icon',Icon)
Vue.component(ElTreeGrid.name,ElTreeGrid);
Vue.use(ElementUI);
