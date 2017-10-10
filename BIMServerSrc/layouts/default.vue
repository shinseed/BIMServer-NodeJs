

<template>

<div>
    <my-header/>
    <nuxt />
    <my-footer/>
</div>

</template>

<script>

import MyFooter from '~/components/layout/Footer.vue'
import MyHeader from '~/components/layout/Header.vue'

export default {
    components: {
        MyFooter,
        MyHeader
    }
}

</script>
