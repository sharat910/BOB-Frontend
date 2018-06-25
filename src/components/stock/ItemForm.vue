<template>
    <div class="salaryform">
    <!-- <TopBar entity='Salary'/> -->
    <!-- <div class="container"> -->
    <Alert v-if="alert" v-bind:message="alert" />
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postSalary">

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Description
        </label>


        <div class="col-sm-10">
          <input name="description" class="form-control" type="text" v-model="item.description" value="">
        </div>
      </div>

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Type
        </label>


        <div class="col-sm-10">
          <select class="form-control" name="type" v-model="item.type">
                  <option value="Kit">Kit</option>
                  <option value="Book">Book</option>
                  <option value="Bookset">Bookset</option>
                  <option value="Question Paper">Question Paper</option>
          </select>
        </div>
      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Level
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="level" v-model="item.level">

              <option value="" selected="">--------</option>
                  <option value="1">Level-1</option>
                  <option value="2">Level-2</option>
                  <option value="3">Level-3</option>
                  <option value="4">Level-4</option>
                  <option value="5">Level-5</option>
                  <option value="6">Level-6</option>
                  <option value="7">Level-7</option>
                  <option value="8">Level-8</option>
                  <option value="9">Level-9</option>
                  <option value="10">Level-10</option>
                  <option value="11">Module-1</option>
                  <option value="12">Module-2</option>
                  <option value="13">Module-3</option>
                  <option value="14">Module-4</option>
          </select>
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Reserve Quantity Max
        </label>


        <div class="col-sm-10">
          <input name="reserve_quantity_max" class="form-control" type="number" v-model="item.reserve_quantity_max" value="5">
        </div>
      </div>

        <div class="form-actions">
          <button class="btn btn-primary" title="Save details">Save</button>
        </div>


    </form>

  </div>
<!-- </div> -->
</template>

<script>
    import Alert from '@/components/Alert';

    export default {
    name: 'itemform',
    props: {
      mode: String,
      item_id: Number
    },
    data () {
        return {
        item: {},
        alert:'',
      }
    },
    methods: {
        postSalary(e){
            if(!this.item.level || !this.item.type ||
                !this.item.description || !this.item.reserve_quantity_max){
                this.alert = 'Please fill in all the fields';
            } else {

              if (this.mode === 'Add') {
                  this.item.quantity = 0;
                  this.item.reserve_quantity = 0;
                  this.$http.post('http://localhost:8000/api/item/', this.item)
                      .then(function(response){
                          this.alert = 'Item Record added succesfully';
                          this.$emit('itemUpdated');
                          // this.$router.push({name: 'StudentDetails', params: {id: this.teacher_id},query: {alert: 'Salary Added'}});
                      });

                } else if (this.mode === 'Edit'){
                  this.$http.put('http://localhost:8000/api/item/' + this.item_id + '/', this.item)
                      .then(function(response){
                          this.alert = 'Item Record edited succesfully';
                          this.$emit('itemUpdated');
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchItem(id){
            this.$http.get('http://127.0.0.1:8000/api/item/'+id + '/')
            .then(function(response){
              this.item = response.body;
            });
        },
    },
    created: function(){
        if (this.mode === 'Edit'){
          this.fetchItem(this.item_id);
        }
    },

    components: {
        Alert
    },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
