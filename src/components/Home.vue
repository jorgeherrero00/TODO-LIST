<script setup>
import { useRouter, useRoute } from 'vue-router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { GithubAuthProvider } from 'firebase/auth';

import { signOut } from 'firebase/auth';
import { ref } from 'vue';

const router = useRouter();
const ruta = useRoute();

const email = ref('');
const password = ref('');
console.log('Recibo idUsuario = ' + ruta.params.idUsuario);
console.log('Recibo nombreUsuario = ' + ruta.params.nombreUsuario);

const usuario = ref(null);
const usuario_foto = ref(null);

if (getAuth().currentUser) {
  usuario.value = getAuth().currentUser.displayName;
  usuario_foto.value = getAuth().currentUser.photoURL;
}

const usuario_id = ref('');

function iniciaSesion() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      // Almacena la información del usuario
      usuario.value = user.displayName;
      usuario_foto.value = user.photoURL;
      // Redirige a la página privada
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error);
    });
}

function cerrarSesion() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Limpia la información del usuario al cerrar sesión
      usuario.value = null;
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
}

function iniciaSesionCorreo(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      usuario.value = user.email;
      router.push('/privada'); // Redirige a la página privada
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error);
    });
}

function registraUsuario(email, password) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      usuario.value = user.email;
      router.push('/privada'); // Redirige a la página privada
    })
    .catch((error) => {
      console.error('Error al registrar usuario:', error);
    });
}

function cerrarSesionCorreo() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      usuario.value = null;
      router.push('/'); // Redirige a la página de inicio
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
}

function iniciaSesionGitHub() {
  const auth = getAuth();
  const provider = new GithubAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      // Almacena la información del usuario
      usuario.value = user.displayName;
      usuario_foto.value = user.photoURL;
      // Redirige a la página privada o realiza otras acciones necesarias
    })
    .catch((error) => {
      console.error('Error al iniciar sesión con GitHub:', error);
    });
}
function cerrarSesionGitHub() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Limpia la información del usuario al cerrar sesión
      usuario.value = null;
      usuario_foto.value = null;
      // Redirige o realiza otras acciones necesarias después de cerrar sesión
    })
    .catch((error) => {
      console.error('Error al cerrar sesión con GitHub:', error);
    });
}

</script>

<template>
    <div>
      
      <h1 v-if="usuario">
        ¡Hola, {{ usuario }}!
        <button @click="cerrarSesion">Cerrar Sesión</button>
        <img :src="usuario_foto" alt="">
      </h1>
      <h1 v-else>PÁGINA DE INICIO</h1>
      <button @click="iniciaSesion">Inicia Sesión con Google</button>
      <form v-if="!usuario">
      <label>Email:</label>
      <input v-model="email" type="email" required>
      <label>Password:</label>
      <input v-model="password" type="password" required>
      <button type="button" @click="iniciaSesionCorreo(email, password)">Inicia Sesión</button>
      <button type="button" @click="registraUsuario(email, password)">Registra Usuario</button>
      <button type="button" @click="cerrarSesionCorreo()">Cerrar Sesión</button>
      <button @click="iniciaSesionGitHub">Iniciar Sesion con GITHUB</button>
      <button @click="cerrarSesionGitHub">Cerrar Sesion con Github</button>
    </form>
    </div>
  </template>
  
