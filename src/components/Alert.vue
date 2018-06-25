<template>
  <div v-if="show" :class="'alert alert-' + type + ' alert-dismissible'" role="alert">
  <button type="button" class="close" @click="show=false;" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    message: String,
    type: String,
    show: Boolean
  },
  data () {
    return {
      // alert_type: 'alert-info',
      // show: true
    }
  },
  // watch: {
  //   type: function(val){
  //     this.alert_type = 'alert-' + val;
  //   },
  // },
  // beforeUpdate() {
  //   this.show = true;
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
