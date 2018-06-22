<template>
    <div class="gantt-add-dialog" @click="showDialog = false" v-if="showDialog" >
        <div class="add-center" @click.stop>
            <div class="dialog-header">
                <h2 class="fl">新增任务</h2>
                <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
            </div>
            <div class="dialog-center">
                <el-row>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
                        <el-form-item label=" " prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入进度名称"></el-input>
                        </el-form-item>
                        <el-form-item label=" " prop="actualdate">
                            <el-date-picker v-model="ruleForm.actualdate" type="daterange" align="left" size='small' unlink-panels range-separator="-" start-placeholder="实际开始日期" end-placeholder="实际结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-date-picker v-model="ruleForm.plandate" type="daterange" align="left" size='small' unlink-panels range-separator="-" start-placeholder="计划开始日期" end-placeholder="计划结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-input v-model="ruleForm.additionaltext" placeholder="请填写附加字段"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
          
            <div class="dialog-footer">
                <div  @click="showDialog = false" v-if="!ruleForm.judgeAdd">取消</div>
                <div v-if="ruleForm.judgeAdd">删除</div>
                <div @click="submitForm()">确定</div>
            </div>
        </div>
    </div>
</template>
<style>
    .gantt-add-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5)
    }
    .add-center {
        width: 400px;
        height: 280px;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        box-shadow: 0px 18px 49px -30px rgba(87, 89, 89, 0.5);
    }
    .gantt-add-dialog .el-form-item__content {
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item__label .el-form-item__content {
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item,
    .gantt-add-dialog .el-input,.gantt-add-dialog .el-form-item__content,
    .gantt-add-dialog .el-range-editor--small.el-input__inner {
        height: 30px;
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item {
        margin-bottom: 10px;
    }
    .gantt-del {
        float: left;
    }
</style>
<script>
    export default {
        props: {
            ruleForm: {
                type: Object,
                default () {
                    return {
                        name: "",
                        plandate: "",
                        actualdate: '',
                        additionaltext: "",
                        judgeAdd:null
                    };
                }
            },
             selectScheduleID:String,
            taskDefault:{
                type:Object,
                default(){
                    return{
                        queueGanttTask:null,//待处理队列task
                        taskParentId:''
                    }
                }
            }
            
        },
        data() {
            return {
                showDialog: false,
                rules: {
                    name: [{
                            required: true,
                            message: " ",
                            trigger: "blur"
                        }
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    actualdate: [{
                        required: true,
                        message: " ",
                        trigger: "change"
                    }],
                    region: [{
                        required: true,
                        message: " ",
                        trigger: "blur"
                    }]
                },
            }
        },
        methods:{
            submitForm(){
                var _this = this
                _this.$refs.ruleForm.validate(valid => {
                    if(valid) {
                        var task = {
                            id:this.$props.queueGanttTask,
                            text:this.$props.ruleForm.name,
                            start_date:this.$props.ruleForm.actualdate[0],
                            end_date:this.$props.ruleForm.actualdate[1]
                        }
                       this.$emit('addTaskDialog',task)
                       this.showDialog = false
                       this.$props.ruleForm.judgeAdd = '新增'
                    }
                })
            }
        },
        watch:{
            showDialog:function(val,oldval){
                if(this.$props.ruleForm.judgeAdd == null){
                    if(val == false){
                        this.$emit('delGanttTask')
                    }
                }else{
                    this.$props.judgeAdd = null
                    if(this.$props.taskDefault.taskDefault.taskParentId){
                        console.log(222222222)
                    }
                }
                
            }
        }
    }
</script>
