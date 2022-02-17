import { createStore } from 'vuex';
import start from './modules/start'



export default createStore({
    modules: {
        start,
    }
})