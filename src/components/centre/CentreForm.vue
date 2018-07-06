<template>
    <div class="centreform">
    <GenericForm
    @resourceUpdated="$emit('centreUpdated')"
    :mode="mode"
    :id="centre_id"
    resource="centre"
    />

  </div>
</template>

<script>
    import GenericForm from '@/components/GenericForm'

    export default {
    name: 'centreform',
    props: {
      mode: String,
      centre_id: Number
    },
    components: {
      GenericForm
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
