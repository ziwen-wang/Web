<template>
    <div class="dialog-wp del-wp" v-if="showDialog"  @click="showDialog = false">
        <div class="makser" @click.stop>
            <div class="dialog-header">
                <h2 class="fl">{{configText.title}}</h2>
                <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
            </div>
            <div class="dialog-center del">
                <h2>{{configText.conter}}</h2>
            </div>
            <div class="dialog-footer">
                <div @click="showDialog = false">取消</div>
                <div @click="delBtn" class="submitOk">确定</div>
            </div>
        </div>
    </div>    
</template>
<style scoped>
.dialog-wp.del-wp .makser {
  height: 136px;
}
h2 {
  color: #999eaa;
}
</style>
<script>
export default {
  props: {
    scheduleId: String,
    configText: {
      type: Object,
      default() {
        return {
          title: null,
          conter: null,
          judge: null
        };
      }
    }
  },
  data() {
    return {
      showDialog: false,
      itemId: ""
    };
  },
  methods: {
    delBtn() {
      if (this.$props.configText.judge == 1) {
        //删除匹配规则
        this.$axios
          .get(
            `${window.urlConfig}/api/Prj/DeleteMatchingRules?ProjectID=${
              window.ProjectID
            }&ModelID=${window.ModelID}&ScheduleID=${this.$props.scheduleId}`
          )
          .then(res => {
            this.$emit("requestItems");
            this.showDialog = false;
          })
          .catch(res => {
            console.log("删除报错" + res);
            this.showDialog = false;
          });
      } else {
        this.$axios
          .get(`${window.urlConfig}/api/Prj/DeleteSchedule?ProjectID=${window.ProjectID}&ScheduleID=${this.$props.scheduleId}`)
          .then(res => {
            console.log(res);
            this.$emit("requestItems");
            this.showDialog = false;
          })
          .catch(res => {
            console.log("删除进度失败，原因：" + res);
            this.showDialog = false;
          });
      }
    }
  }
};
</script>

