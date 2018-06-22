<template>
    <div class="index-wp">
        <matchDialog></matchDialog>
        <scheduleList class="scheduleList-wp" @requestData=requestData></scheduleList>
        <div class="gantt-nav">
            <div class="gantt-head">
                <div class="gantt-left">任务列表</div>
                <div class="gantt-right">
                    <div class="fl">
                        <ul>
                            <li @click="toggle3D()"> <img src="./model.svg"><span id="show3DText">显示模型</span></li>
                            <li style="margin-left:40px;" :class="{'no-click':!show3d}" @click="">附加选中对象</li>
                        </ul>
                    </div>
                    <div class="fr">
                        <ul>
                            <li><img src="./mock.svg">模拟</li>
                            <li><img src="./import.svg">导入</li>
                            <li @click='toggleGantt'><img src="./table.svg">网络图/甘特图</li>
                            <li><img src="./export.svg">导出</li>
                        </ul>
                    </div>
                </div>
            </div>
            <gantt class="gantt-wp" v-if="showGantt" :tasks="tasks" :class="{'show3D':show3d}" :selectScheduleID="selectScheduleID" ref="ganttView" @ganttAddShow=ganttAddShow></gantt>
            <chats v-if="!showGantt" class="chats-wp" :class="{'show3D':show3d}" ref="chats"></chats>
            <div class="iframe-wp" v-if="show3d"></div>
            <ganttAdd ref="ganttAdd" 
                @delGanttTask=delGanttTask 
                :selectScheduleID=selectScheduleID 
                @addTaskDialog=addTaskDialog
                :taskDefault=taskDefault
                ></ganttAdd>
        </div>
    </div>
</template>
<style>
    .no-click{
        color: #ccc;
        cursor: no-drop;
    }
    .iframe-wp {
        background: red;
        width: 100%;
        flex: 1;
    }
    .gantt-wp.show3D,
    .chats-wp.show3D {
        width: 100%;
        height: 340px !important;
        overflow: hidden;
    }
    .gantt-head .gantt-right div:nth-child(2) li {
        color: #fff;
        cursor: pointer;
        line-height: 30px;
        margin-right: 24px;
    }
    .gantt-head .gantt-right div:nth-child(1) li {
        line-height: 30px;
        margin-right: 24px;
    }
    .gantt-head .gantt-right div:nth-child(1) li:first-child {
        margin-left: 24px;
    }
    .gantt-head .gantt-right div ul {
        display: flex;
        cursor: pointer;
    }
    .gantt-head .gantt-right div img {
        vertical-align: middle;
        margin-right: 10px;
    }
    .index-wp {
        height: 100%;
        display: flex;
    }
    .gantt-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .gantt-head {
        height: 30px;
        background-color: #5e6a86;
        line-height: 30px;
        color: #fff;
        width: 100%;
        min-height: 30px;
        display: flex;
    }
    .gantt-head .gantt-left {
        width: 359px;
    }
    .gantt-head .gantt-right {
        flex: 1;
    }
    .gantt-wp,
    .chats-wp {
        height: calc(100% - 30px) !important;
        margin-left: -1px;
        position: relative;
        z-index: 2;
    }
    .scheduleList-wp {
        position: relative;
        z-index: 9;
    }
</style>
<script>
    window.urlConfig = 'https://bimcomposer.probim.cn'
    window.ProjectID = '7e951a17-556b-46ee-9fb8-634d97940635'
    window.ModelID = 'c1e76e74-220c-4bee-93ce-b1779fa3e70c'
    import scheduleList from './scheduleList/scheduleList'
    import gantt from './gantt/gantt'
    import chats from './chats/chats'
    import matchDialog from './dialog/delDialogMatch'
    import ganttAdd from './dialog/ganttAddDialog'
    export default {
        components: {
            scheduleList,
            gantt,
            chats,
            ganttAdd,
            // matchDialog:resolve => {require(['./dialog/delDialogMatch'], resolve)},
            matchDialog
        },
        data() {
            return {
                showGantt: true,
                tasks: {
                    data: [],
                    links: []
                    // data: [
                    //     {id: '123', text: 'demo #2', start_date: '18-06-2018', duration: 3, progress: 0.4},
                    //     {id: '33333', text: 'demo #3', start_date: '18-06-2018', duration: 3, progress: 0.4,parent:'123'}
                    // ],
                    // links: [
                    //      {id: 1, source: 2, target: 3, type: '0'}
                    // ]
                },
                show3d: false,
                selectScheduleID: '', //已选中进度id
                taskDefault:{
                    queueGanttTask:null,//待处理队列task
                    taskParentId:'',
                },
                ruleForm:{//新增修改甘特数据
                    name: "",
                    plandate: "",
                    actualdate: '',
                    additionaltext: "",
                    judgeAdd:null
                }
                
            }
        },
        methods: {
            addTaskDialog(task){
                console.log(task)
                task.start_date = this.initDate(task.start_date)
                task.end_date = this.initDate(task.end_date)
                this.$refs.ganttView.addTask(task)
            },
            isRealNum(val){
                if(val === "" || val ==null){
                    return false;
                }
                if(!isNaN(val)){
                    return true;
                }else{
                    return false;
                }
            },
            ganttAddShow(obj){
                if(obj.id){
                     this.taskDefault.queueGanttTask = obj.id
                     this.taskDefault.ParentID = ''
                }
               if(obj.ParentID){
                    this.taskDefault.taskParentId = obj.ParentID,
                    this.taskDefault.queueGanttTask = ''
               }
                this.$refs.ganttAdd.showDialog = true
            },
            delGanttTask(){
                if(this.isRealNum(this.taskDefault.queueGanttTask)){
                    this.$refs.ganttView.delTask(this.taskDefault.queueGanttTask)
                   this.taskDefault.queueGanttTask = ''
                }else{
                }
            },
            additionalClick(){
                var formData = new FormData()
                formData.append('ProjectID',window.ProjectID)
                formData.append('ModelID',window.ModelID)

            },
            initDate(time) {
                var date = new Date(time)
                return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
            },
            requestData(item) {
                if (!item) {
                    return
                }
                var _this = this
                this.selectScheduleID = item.ScheduleID
                this.$axios.get(`${window.urlConfig}/api/Prj/GetScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${item.ScheduleID}`).then(res => {
                    if (res.data.length == 0) {
                        _this.tasks.data=res.data
                    } else {
                        _this.tasks.data.length = 0
                        res.data.forEach((item, index) => {
                            var data1 = {
                                id: item.TaskID,
                                text: item.TaskName,
                                start_date: _this.initDate(item.TaskStartTime),
                                end_date: _this.initDate(item.TaskEndTime),
                                parent: item.ParentID
                            }
                            _this.tasks.data.push(data1)
                        });
                    }
                    
                        _this.$refs.ganttView.Repaint()
                }).catch(res => {
                    console.log('请求甘特图数据错误，原因' + res)
                })
            },
            toggleGantt() {
                this.showGantt = !this.showGantt
            },
            toggle3D() {
                this.show3d = !this.show3d
                var show3DBtn = document.getElementById('show3DText')
                if (this.show3d) {
                    show3DBtn.innerText = '隐藏模型'
                } else {
                    show3DBtn.innerText = '显示模型'
                }
                if (this.$refs.chats) {
                    this.$nextTick(function() {
                        this.$refs.chats.reLoadChat()
                    })
                }
            }
        },
        mounted() {}
    }
</script>
