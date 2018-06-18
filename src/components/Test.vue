<template>
  <div class="test">
    <h1>{{title}}</h1>

    <ul>
      <li v-for="item in items">{{item.title}}</li>
    </ul>
    <button v-on:click="greet('Hello World')">Say Greeting</button>
    <br>
    <input type="text" v-on:keyup="pressKey">
    <hr/>
    <label>First Name: </label> <input type="text" v-model="user.firstName">
    <br>
    <label>Last Name: </label> <input type="text" v-model="user.lastName">
    <h3 v-if="showName">{{fullname}}</h3>
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
  export default {
    name: 'test',
    props: {
      msg: {
        type: String,
        default:'Goobar'
      }
    },
    data() {
      return {
        title: 'Hello World',
        user: {
          firstName: 'Sharat',
          lastName: 'Chandra',
        },
        showName: true,
        items: [
          {title: 'Item One'},
          {title: 'Item Two'},
          {title: 'Item Three'},
        ]
      }
    },
    methods: {
      greet: function(greeting){
        alert(greeting);
      },
      pressKey: function(e){
        console.log(e.target.value);
      },
      enterHit:function(){
        console.log('You hit enter');
      }
    },
    computed: {
      fullname: function(){
        return this.user.firstName +' '+ this.user.lastName;
      }
    }
  }
</script>

<style scoped>
</style>
