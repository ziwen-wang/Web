<template>
    <div class="masker-wp" v-show="showDialog" @click="showDialog = false">
        <div class="dialog" @click.stop>
            <div class="dialog-header">
                <h2 class="fl">新增进度</h2>
                <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
            </div>
            <div class="dialog-center row">
                <el-row>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
                        <el-form-item label=" " prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入进度名称"></el-input>
                        </el-form-item>
                        <el-form-item label=" " prop="date1">
                            <el-date-picker
                                v-model="ruleForm.date1"
                                type="daterange"
                                align="left"
                                size='small'
                                unlink-panels
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" " prop="region">
                            <el-select v-model="ruleForm.region" placeholder="请选择工作日周期">
                            <el-option label="工作日（7天）" value="7"></el-option>
                            <el-option label="工作日（5天）" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                            
                    </el-form>
                </el-row>
            </div>
            <div class="dialog-footer">
                
                <div @click="showDialog = false">取消</div>
                <div @click="submitForm()">确定</div>
            </div>
        </div>
    </div>
</template>
<style>
.idalog-center li {
  height: 30px;
}
.masker-wp {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
.masker-wp .dialog {
  width: 400px;
  height: 300px;
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
.dialog-header img {
  transform: rotate(45deg);
  vertical-align: middle;
  cursor: pointer;
}
.dialog-header h2 {
  font-size: 16px;
  color: rgba(0, 13, 42, 0.64);
}
.dialog-header {
  height: 22px;
  line-height: 22px;
  margin-top: 16px;
  padding: 0 24px;
}
.dialog-center {
  padding: 0 24px;
  margin-top: 30px;
}
.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 24px;
  position: absolute;
  bottom: 24px;
  right: 0;
}
.dialog-footer div {
  cursor: pointer;
  color: rgba(0, 13, 42, 0.5);
}
.dialog-footer div:nth-child(1) {
  margin-right: 20px;
}
.el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-date-editor--daterange.el-input__inner {
  width: 320px;
}
.el-select {
  width: 100%;
}
.el-date-editor .el-range-separator {
  padding: 0;
}
.el-input--suffix .el-input__inner {
  border: none;
}
.el-input__inner {
  border: none;
}
.el-form-item,
.el-form-item input,
.el-range-editor--small .el-range__icon,
.el-date-editor--daterange.el-input__inner {
  background-color: #f5f9fc;
}
.el-form .is-error,
.el-form .is-error input,
.el-form .is-error i {
  background-color: #ffe2d5;
}
.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  background-color: #ffe2d5;
}
</style>
<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default() {
        return {
          name: "",
          date1: "",
          region: "",
          judge: "",
          ScheduleID: null
        };
      }
    }
  },
  data() {
    return {
      // ruleForm: {
      //   name: "",
      //   date1: "",
      //   region: ""
      // },
      rules: {
        name: [
          { required: true, message: "请输入进度名称", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        date1: [{ required: true, message: "请选择日期", trigger: "change" }],
        region: [
          { required: true, message: "请选择工作日周期", trigger: "change" }
        ]
      },
      showDialog: false
    };
  },
  methods: {
    submitForm() {
      var _this = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.$props.ruleForm);
          var formData = new FormData();
          if (this.$props.ruleForm.judge == 2) {
            formData.append("ProjectID", window.ProjectID);
            var data = {
              ScheduleID: this.$props.ruleForm.ScheduleID,
              ScheduleName: this.$props.ruleForm.name,
              ScheduleStartTime: this.$props.ruleForm.date1[0],
              ScheduleEndTime: this.$props.ruleForm.date1[1]
            };
            if (this.$props.ruleForm.region == "工作日(5天)") {
              data.ScheduleCycle = 5;
            } else if (this.$props.ruleForm.region == "工作日(7天)") {
              data.ScheduleCycle = 7;
            }
            formData.append("Schedule", JSON.stringify(data));
            this.$axios
              .post(`${window.urlConfig}/api/Prj/UpdateSchedule`, formData)
              .then(res => {
                console.log(res);
              })
              .catch(res => {
                console.log("更新进度失败，原因" + res);
              });
          } else {
            formData.append("ProjectID", window.ProjectID);
            formData.append("ModelID", window.ModelID);
            formData.append(
              "Schedule",
              JSON.stringify({
                ScheduleName: this.$props.ruleForm.name,
                ScheduleStartTime: this.$props.ruleForm.date1[0],
                ScheduleEndTime: this.$props.ruleForm.date1[1],
                ScheduleCycle: this.$props.ruleForm.region
              })
            );
            this.$axios
              .post(`${window.urlConfig}/api/Prj/AddSchedule`, formData)
              .then(res => {
                console.log(res);
                let item = {
                  ScheduleName: _this.ruleForm.name,
                  ScheduleId: res.data,
                  
                };
                _this.$emit("addItem", item);
                _this.showDialog = false;
              })
              .catch(res => {
                console.log("新增进度接口" + res);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    showDialog: function(val, oldval) {
      if (!val) {
        this.$refs.ruleForm.resetFields();
      }
    }
  }
};
</script>
