<script setup>
import { useCollection } from 'vuefire'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, updateDoc, where, query } from 'firebase/firestore'
import { useFirestore } from 'vuefire';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import {  onMounted } from 'vue';

let contenidoNota = '';
let usuario = ref(null);
let files = [];
const auth = getAuth();
let uid = null;
const db = useFirestore();
let coleccion = collection(db, 'todos');

// Inicializa todos como un ref vacío
const todos = ref([]);

// Usa onMounted para cargar la colección después de la inicialización
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    // Actualiza el valor del ref usuario usando .value
    usuario = user.displayName;
    coleccion = collection(db, 'todos');

    // Actualiza el valor de todos con useCollection
    todos.value = useCollection(query(coleccion, where("idUsuario", "==", uid)));
  }
});

function altaNota() {
  for (let i = 0; i < files.length; i++) {
    const storage = getStorage();
    const storageRef = ref(storage, 'carpeta/' + files[i].name);
    uploadBytes(storageRef, files[i]).then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then(downloadUrl => {
      if (i === files.length - 1) {
        const docRef = addDoc(collection(db, "todos"), {
          texto: contenidoNota,
          prioridad: "baja",
          adjunto: downloadUrl,
          idUsuario: uid // Accede al valor de uid
        });
        contenidoNota = '';
        files = [];
      }
    });
  }
}

function subirAdjunto(e) {
  files = Array.from(e.target.files);
}

function eliminarNota(id) {
  deleteDoc(doc(db, "todos", id));
}

function subirPrioridad(id) {
  updateDoc(doc(db, "todos", id), {
    prioridad: "alta"
  });
}
</script>
<template>
  <input type="text" v-model="contenidoNota">
  <input multiple type="file" name="" id="" @change="subirAdjunto($event)">
  <button @click="altaNota">Alta nota</button> 
  <h3>Notas de {{ usuario }}</h3>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <span>{{ todo.texto }}--{{ todo.prioridad}}-- <a :href="todo.adjunto" target="_blank"><img width="10%" height="10%" src="https://www.shutterstock.com/image-vector/download-icon-vector-illustration-on-600nw-1724759407.jpg" alt=""></a></span>
      <button @click="eliminarNota(todo.id)">Eliminar</button>
      <button @click="subirPrioridad(todo.id)">Subir prioridad</button>
    </li>
  </ul>
</template>
<style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  input {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  button {
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

  }

  button:hover {
    background-color: #45a049;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 10px 0;
    padding: 10px;
    background-color: #201e1e;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  a {
    color: #3498db;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
