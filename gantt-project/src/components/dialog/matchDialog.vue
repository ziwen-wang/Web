<template>
  <div class="dialog-wp" v-if="showDialog" @click="showDialog=false">
    <div class="makser" @click.stop>
      <div class="dialog-header">
        <h2 class="fl">新增匹配规则</h2>
        <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
      </div>
      <div class="dialog-center wzw">
        <el-row>
          <el-form :model="ruleForm" ref="ruleForm" label-width="30px" class="demo-ruleForm">
            <el-form-item label=" *">
              <el-select v-model="ruleForm.selectval" placeholder="请选择匹配规则">
                <el-option label="任务名称" value="1"></el-option>
                <el-option label="构件属性" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-show="ruleForm.selectval == 1 || ruleForm.selectval == '任务名称'">
              <el-radio-group v-model="ruleForm.selectn1">
                <el-radio label="构件类型"></el-radio>
                <el-radio label="构件类别"></el-radio>
                <el-radio label="构件名称"></el-radio>
              </el-radio-group>
            </el-form-item>
            <input type="text" placeholder="请输入属性值" class="zdy" v-show="ruleForm.selectval == 2 || ruleForm.selectval == '构件属性'" v-model="ruleForm.inputVal">
          </el-form>
        </el-row>
      </div>
      <div class="dialog-footer">
        <div @click="showDialog = false">取消</div>
        <div @click="submitForm" :class="{'submitOk':(ruleForm.selectval!= '' && ruleForm.selectn1 != '')||(ruleForm.selectval!='' && ruleForm.inputVal!='')}">确定</div>
      </div>
    </div>
  </div>
</template>
<style>
  .submitOk {
    color: #417fcd !important;
  }
  .dialog-wp {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
  form input.zdy {
    width: 322px;
    background: #f5f9fc;
    border: none;
    padding-right: 30px;
    height: 30px;
    line-height: 30px;
    margin-left: 30px;
    padding-left: 15px;
    color: #606266;
  }
  form input.zdy::-webkit-input-placeholder {
    color: #ccc;
  }
  form input:focus {
    outline: none;
  }
  .dialog-wp .makser {
    width: 400px;
    height: 264px;
    background-color: #ffffff;
    box-shadow: 0px 18px 49px -30px rgba(87, 89, 89, 0.5);
    border-radius: 2px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .el-input--suffix .el-input__inner {
    background-color: #f5f9fc;
  }
  .el-form-item__label {
    color: red !important;
  }
  .wzw .el-form-item {
    background: #fff;
  }
  .wzw .el-radio-group {
    display: flex;
    flex-direction: column;
  }
  .el-radio {
    text-align: left;
    margin-top: 15px;
  }
  .wzw .el-radio+.el-radio {
    margin-left: 0;
  }
  .el-radio:first-child {
    margin-top: 0;
  }
  .wzw .el-radio__input.is-checked+.el-radio__label {
    color: #757d8a;
  }
</style>
<script>
  export default {
    props: {
      scheduleId: String,
      ruleForm: {
        type: Object,
        default () {
          return {
            selectval: "",
            selectn1: "",
            inputVal: "",
            judge: null
          };
        }
      }
    },
    data() {
      return {
        showDialog: false
      };
    },
    methods: {
      initForm() {
        this.ruleForm.selectn1 = "";
        this.ruleForm.inputVal = "";
      },
      submitForm() {
        if (
          (this.ruleForm.selectval == "" && this.ruleForm.selectn1 == "") ||
          (this.ruleForm.selectval == "" && this.ruleForm.inputVal == "")
        ) {
          return;
        }
        var formData = new FormData();
        formData.append("ProjectID", window.ProjectID);
        formData.append("ModelID", window.ModelID);
        formData.append("FilterLogic", 1); //写死
        formData.append("ScheduleID", this.$props.scheduleId);
        if (this.$props.ruleForm.selectval == 1) {
          formData.append("FilterType", 1);
          if (this.$props.ruleForm.selectn1 == "构件名称") {
            formData.append("FilterTypeKey", 1);
          } else if (this.$props.ruleForm.selectn1 == "构件类别") {
            formData.append("FilterTypeKey", 2);
          } else if (this.$props.ruleForm.selectn1 == "构件类型") {
            formData.append("FilterTypeKey", 3);
          }
          formData.append("FilterPropertyKey", this.$props.ruleForm.inputVal);
        } else {
          formData.append("FilterType", 2);
          formData.append("FilterPropertyKey", this.$props.ruleForm.inputVal);
          formData.append("FilterTypeKey", 0);
        }
        if (this.$props.ruleForm.judge == 1) { //新建
          this.$axios
            .post(`${window.urlConfig}/api/Prj/AddMatchingRules`, formData)
            .then(res => {
              console.log(res);
              this.$emit("requestItems");
              this.showDialog = false;
            })
            .catch(res => {
              console.log("新增匹配规则" + res);
            });
        } else {
          this.$axios.post(`${window.urlConfig}/api/Prj/UpdateMatchingRules`, formData).then(res => {
            console.log(res)
          }).catch(res => {
            console.log('更新匹配规则失败，原因' + res)
          })
        }
      },
    },
    watch: {
      "ruleForm.selectval": {
        handler: function(val, oldVal) {
          if (this.$props.ruleForm.judge == 2) return
          if (val != oldVal) this.initForm();
        },
        immediate: true
      }
    }
  }
  
</script>
