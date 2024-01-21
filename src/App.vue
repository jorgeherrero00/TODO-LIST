<script setup>

import Inicio from '@/components/Home.vue'
</script>

<template>
    <RouterLink to="/Home">Inicio</RouterLink>
    <RouterLink to="/privada">Privada</RouterLink>
    <RouterView></RouterView>
</template>
