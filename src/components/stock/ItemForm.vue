<template>
    <div class="salaryform">
    <!-- <TopBar entity='Salary'/> -->
    <!-- <div class="container"> -->
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
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
    import {restAPI} from '@/services/rest-api';

    export default {
    name: 'itemform',
    props: {
      mode: String,
      item_id: Number
    },
    data () {
        return {
        item: {},
        alert:{
          message: '',
          type: '',
          raised: false
        },
      }
    },
    methods: {
        postSalary(e){
            if(!this.item.level || !this.item.type ||
                !this.item.description || !this.item.reserve_quantity_max){
                this.raiseAlert('Please fill in all the fields','danger');
            } else {

              if (this.mode === 'Add') {
                  this.item.quantity = 0;
                  this.item.reserve_quantity = 0;
                  restAPI.post('item/', this.item)
                      .then(response => {
                          this.raiseAlert('Item Record added succesfully','success');
                          this.$emit('itemUpdated');
                          // this.$router.push({name: 'StudentDetails', params: {id: this.teacher_id},query: {alert: 'Salary Added'}});
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                      })

                } else if (this.mode === 'Edit'){
                  restAPI.put('item/' + this.item_id + '/', this.item)
                      .then(response => {
                          this.raiseAlert('Item Record edited succesfully','success');
                          this.$emit('itemUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                      })
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchItem(id){
            restAPI.get('item/'+id + '/')
            .then(response => {
              this.item = response.data;
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
            })
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
