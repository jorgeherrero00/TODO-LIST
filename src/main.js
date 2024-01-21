import './assets/main.css'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Inicio from '@/components/Home.vue';
import privado from '@/components/Privada.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const routes = [
  { path: '/Home', component: Inicio },
  { path: '/privada', component: privado },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

let estasIdentificado = false;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    estasIdentificado = true;
    // ...

  } else {
    // User is signed out
    // ...
    estasIdentificado = false;
  }
});

router.beforeEach((to, from) => {
  // ...
  // explicitly return false to cancel the navigation
  if (to.path=='/privada' && !estasIdentificado) {
    return false;
  }
  console.log(to.path);
})

const app = createApp(App)
app.use(router);
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

app.mount('#app')