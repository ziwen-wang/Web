<template>
    <div ref="gantt" style="width:100%;height:100%;"></div>
</template>

<script>
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/locale/locale_cn.js";
import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js";
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return {
          data: [],
          links: [],
          todayMarker: null
        };
      }
    },
    selectScheduleID:String
  },

  methods: {
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
    Repaint(){
		gantt.clearAll()
		gantt.parse(this.$props.tasks);
        gantt.render()
        gantt.setSizes()
    },
    $_initGanttEvents: function() {
      var _this = this
      if (gantt.$_eventsInitialized) return;
      gantt.attachEvent("onTaskSelected", id => {
        let task = gantt.getTask(id);
        this.$emit("task-selected", task);
      });
      gantt.attachEvent("onTaskCreated", (task) => {//点击加号
        if(task.parent){
          console.log('demo添加')
        }else{
			console.log('root添加')
        }
         console.log('点击',task)
      });
      gantt.attachEvent("onTaskDblClick", function(id, el) {
          console.log(gantt.getTask(id))
      });
      // gantt.attachEvent("onTaskClick", function(id, el) {
      //   _this.$emit('ganttAddShow',{parentId:id})
      //     console.log('点击',id)
      // });
      gantt.attachEvent("onAfterTaskAdd", (id, task) => {

        console.log(task)
        console.log(gantt.getParent(task))
        var formData = new FormData()
        var data = {
          ScheduleID:_this.$props.selectScheduleID,
          TaskName:task.text,
          TaskStartTime:task.start_date,
          TaskEndTime:task.end_date,
        }
        if(task.parent == 0){

          data.ParentId = ''
        }else{
          data.ParentID = task.parent
        }
        formData.append('ProjectID',window.ProjectID)
        formData.append('ModelID',window.ModelID)
         formData.append('ScheduleTask',JSON.stringify(data))
         this.$axios.post(`${window.urlConfig}/api/Prj/AddOrUpdateScheduleTask`,formData).then(res=>{
           gantt.changeTaskId(id, res.data);
         }).catch(res=>{
           console.log('甘特图新增任务失败，原因：' + res)
         })
        this.$emit("task-updated", id, "inserted", task);
        task.progress = task.progress || 0;
        if (gantt.getSelectedId() == id) {
          this.$emit("task-selected", task);
        }
      });

      gantt.attachEvent("onAfterTaskUpdate", (id, task) => {

        // this.$emit("task-updated", id, "updated", task);
      });

      gantt.attachEvent("onAfterTaskDelete", id => {
        if(!_this.isRealNum(id)){
            this.$axios.get(`${window.urlConfig}/api/Prj/DeleteScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${this.$props.selectScheduleID}&ScheduleTaskID=${id}`).then(res=>{
            console.log('成功删除任务' + res)
          }).catch(res=>{
            console.log('甘特图删除错误，原因' + res)
          })
        }else{
          console.log('无接口删除')
        }
        
      });

      gantt.attachEvent("onAfterLinkAdd", (id, link) => {
        console.log(1)
        this.$emit("link-updated", id, "inserted", link);
      });

      gantt.attachEvent("onAfterLinkUpdate", (id, link) => {
        console.log(1)
        this.$emit("link-updated", id, "updated", link);
      });

      gantt.attachEvent("onAfterLinkDelete", (id, link) => {
        console.log(1)
      
        this.$emit("link-updated", id, "deleted");
      });
      gantt.attachEvent('onBeforeLightbox',(id)=>{//禁用系统弹层
        _this.$emit('ganttAddShow',{id:id,parentId:0})
        return false
      })
      gantt.$_eventsInitialized = true;
    },
    delTask(id){
      console.log(id)
       gantt.deleteTask(id)
    },
    addTask(task){
      gantt.addTask(task)
      console.log(gantt.getParent(task))
    }
  },

  mounted() {
    var _this = this;
    gantt.config.scale_unit = "day";
    gantt.config.date_scale = "%d, %M,%Y";
    this.$_initGanttEvents();

    gantt.config.autoscroll = true;
    gantt.config.autoscroll_speed = 50;
    gantt.init(this.$refs.gantt);
    gantt.parse(this.$props.tasks);

    var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
    // var id = gantt.addMarker({
    //   start_date: new Date(),
    //   css: "gantt-today",
    //   title: date_to_str(new Date())
    // });
    // var i = 0,
    //   arr = ["2018-6-13", "2018-6-14", "2018-6-15", "2018-6-16", "2018-6-17"];
    // var timer = setInterval(function() {
    //   var today = gantt.getMarker(id);
    //   today.start_date = new Date(arr[i]);
    //   today.title = date_to_str(today.start_date);
    //   gantt.updateMarker(id);
    //   i += 1;
    //   if (i == arr.length) {
    //     clearInterval(timer);
    //   }
    // }, 1000);
  }
};
</script>

<style>
@import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
.gantt-today {
  height: 300px;
  width: 1px;
  background: red;
}
.gantt-add-dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
}
</style>
