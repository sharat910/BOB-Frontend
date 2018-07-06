<template>
  <div class="add">
    <div class="container">
    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Teachers'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'TeacherDetails',params: {'id':id}}">Back</router-link>


    <h1 class="page-header">{{mode}} Teacher</h1>
    <br>
    <GenericForm
    @resourceUpdated="redirect()"
    :mode="mode"
    :id="id"
    resource="teacher"
    :relatedResourceMap="relatedResourceMap"
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
    data() {
      return {
        relatedResourceMap: {
          "trained_max_level": "level"
        }
      }
    },
    methods: {
        redirect(){
          if (this.mode == 'Edit') {
            this.$router.push({name: 'TeacherDetails', params:{id:this.id}, query: {alert: 'Teacher details edited succesfully'}});
          }else {
            this.$router.push({name: 'Teachers', query: {alert: 'New teacher added succesfully'}});
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
