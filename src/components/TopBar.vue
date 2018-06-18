<template lang="html">
<div class="topbar">
  <nav class="navbar navbar-default">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">{{entity}} Manager</a>
    </div>
    <div id="navbar" class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li><router-link :to="{ name: all_url_name}">All {{entities}}</router-link></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><router-link :to="{ name: add_url_name}">Add {{entity}}</router-link></li>
      </ul>
    </div>
  </div>
</nav>

</div>
</template>

<script>
export default {
  name: 'topbar',
  props: {
    entity: String
  },
  data () {
    return {
      all_url_name : '',
      add_url_name : ''
    }
  },
  methods: {
    setUrls(){
      this.all_url_name = this.entities;
      this.add_url_name = 'Add' + this.entity;
    }
  },
  computed:{
    entities: function(){
      if (this.entity === "Batch") {
        return this.entity + 'es'
      } else {
        return this.entity + 's'
      }
    }
  },
  created: function(){
    this.setUrls();
  }
}
</script>

<style lang="css" scoped>
</style>
