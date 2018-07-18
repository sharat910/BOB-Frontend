<template>
  <div class="add">
    <div class="container">
    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Students'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'StudentDetails',params: {'id':id}}">Back</router-link>


    <h1 class="page-header">{{mode}} Student</h1>
    <br>
    <GenericForm
    @resourceUpdated="redirect()"
    :mode="mode"
    :id="id"
    resource="student"
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
            this.$router.push({name: 'StudentDetails', params:{id:this.id}, query: {alert: 'Student details edited succesfully'}});
          }else {
            this.$router.push({name: 'Students', query: {alert: 'New student added succesfully'}});
          }
        },
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
