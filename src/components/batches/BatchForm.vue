<template>
  <div class="add">
    <div class="container">
    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'BatchDetails',params: {'id':id}}">Back</router-link>


    <h1 class="page-header">{{mode}} Batch</h1>
    <br>
    <GenericForm
    @resourceUpdated="redirect()"
    :mode="mode"
    :id="id"
    resource="batch"
    />
  </div>
</div>
</template>

<script>
  import GenericForm from '@/components/GenericForm';

  export default {
    name: 'add',
    props: {
      mode: String
    },
    data () {
        return {

        }
    },
    methods: {
        redirect(){
          if (this.mode == 'Edit') {
            this.$router.push({name: 'BatchDetails', params:{id:this.id}, query: {alert: 'Batch details edited succesfully'}});
          }else {
            this.$router.push({name: 'Batches', query: {alert: 'New batch added succesfully'}});
          }
        },
        raiseAlert(message,type){
          this.alert.message = message;
          this.alert.type = type;
          this.alert.raised = true;
        },
        closeAlert(){
          this.alert.message = '';
          this.alert.type = '';
          this.alert.raised = false
        }
    },
    created: function(){

    },
    computed: {
      id: function(){
        return parseInt(this.$route.params.id)
      }
    },
    components: {
        GenericForm
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
