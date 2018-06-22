<template>
  <div class="scheduleList-wp">
    <header>进度方案列表</header>
    <main v-on:mouseout="mouseLeaveFun">
      <ul class="list-wp">
        <li v-for="item in items" :key="item.id" 
          	@mouseenter='hoverDialog($event,item)' 
			@mouseleave="hoverDialogLeave" 
			@click="itemClick(item)"
			:class="{select:judgeClickClass(item)}">
          <div class="text">{{item.ScheduleName}}</div><img src="./more.svg" alt="" @click.stop="showNavClick($event)">
        </li>
      </ul>
      <div class="show-bg" v-if="items.length == 0">
        无进度方案<br> 请在模型中新增进度方案
      </div>
      <nav id="navList" :style="{top:navList.styleTop + 'px',left:navList.styleLeft + 'px'}" v-show="navList.showOrHide" v-on:mouseover="navMouseOver" v-on:mouseout="navMouseLeave">
        <div class="sj">
          <div class="sj1"></div>
        </div>
        <ul>
          <li @click="showDialog(3,2)"><img src="./edit.svg">编辑进度</li>
          <li @click="showDialog(2,2)"><img src="./deleteblack.svg">删除进度</li>
          <li @click="showDialog(1,1)" v-show="showAddOrDel"><img src="./addblack.svg">新增匹配规则</li>
          <li @click="showDialog(1,2)" v-show="!showAddOrDel"><img src="./edit.svg">修改匹配规则</li>
          <li @click="showDialog(2,1)" v-show="!showAddOrDel"><img src="./deleteblack.svg">删除匹配规则</li>
        </ul>
      </nav>
      <div class="ppgz-dialog" ref="ppgz" style="top:0;" v-show="ppgzDialog">
        <h2>匹配规则</h2>
        <p>{{ppgzHover.textLeft}} -- {{ppgzHover.textRight}}</p>
      </div>
      <div class="footer-btn" @click="showDialog(3,1)"><img src="./add.svg">新建进度方案</div>
    </main>
    <footer></footer>
    <dialogView ref="dialogView" @addItem="addItem" :ruleForm=dialogAddJd></dialogView>
    <matchDialog ref="matchDialog" :schedule-id="thisScheduleID" @requestItems=requestItems :ruleForm=dialogAddPpgz></matchDialog>
    <delDialogMatch ref="delDialogMatch" :schedule-id="thisScheduleID" @requestItems=requestItems :configText=dialogDelConfig></delDialogMatch>
  </div>
</template>
<script>
  import dialogView from "../dialog/dialog.vue";
  import matchDialog from "../dialog/matchDialog";
  import delDialogMatch from "../dialog/delDialogMatch";
  export default {
    name: "scheduleList",
    components: {
      dialogView,
      matchDialog,
      delDialogMatch
    },
    data() {
      return {
        dialogAddJd: {
          name: "",
          date1: "",
          region: "",
          judge: "",
          ScheduleID: null
        },
        dialogAddPpgz: {
          selectval: "",
          selectn1: "",
          inputVal: "",
          judge: null
        },
        dialogDelConfig: {
          title: "",
          conter: "",
          judge: null
        },
        items: [],
        navList: {
          showOrHide: false,
          styleTop: 0,
          styleLeft: 0,
          hoverJudge: false
        },
        ppgzDialog: false, //列表hover显示匹配规则
        thisScheduleID: "",
        ppgzHover: {
          textLeft: "",
          textRight: ""
        },
        thisItem: "",
        clickItem:null,
        showAddOrDel:true,//是否显示列表新建删除
      };
    },
    methods: {
		judgeClickClass(item){
			if(this.clickItem){
				if(item.ScheduleID == this.clickItem.ScheduleID){
					console.log()
					return true
				}else{
					return false
				}
			}
		},
      itemClick(item) {
        this.clickItem = item
        this.$emit("requestData", item);
      },
      addItem(item) {
        this.items.push(item);
      },
      hoverDialog(e, item) {
        this.thisItem = item;
        if (this.thisScheduleID != item.ScheduleID)
          this.thisScheduleID = item.ScheduleID;
        if (item.FilterType == 0 || item.FilterType == undefined) {
          this.ppgzDialog = false;
          this.showAddOrDel = true
          return false;
        }else if (item.FilterType == 1) {
          this.ppgzHover.textLeft = "任务名称";
          if (item.FilterTypeValue == 1) {
            this.ppgzHover.textRight = "构件名称";
          } else if (item.FilterTypeValue == 2) {
            this.ppgzHover.textRight = "构件类别";
          } else {
            this.ppgzHover.textRight = "构件类型";
          }
        } else {
          this.ppgzHover.textLeft = "构件属性";
          this.ppgzHover.textRight = item.FilterPropertyKey;
          
        }
        this.ppgzDialog = true;
        this.showAddOrDel = false
        var li = e.target;
        this.$refs.ppgz.style.top = li.offsetTop + "px";
        
      },
      hoverDialogLeave() {
        this.ppgzDialog = false;
      },
      //传1显示匹配规则 传3新建方案 2删除确认
      //judgeConter 判断类型 1删除匹配 2删除进度
      //judgeConter 传1新增  2 修改
      showDialog(nub, judgeConter) {
        if (nub == 1) {
          if (judgeConter == 1) {
            //新建
            this.dialogAddPpgz.selectval = "";
            this.dialogAddPpgz.selectn1 = "";
            this.dialogAddPpgz.inputVal = "";
            this.dialogAddPpgz.judge = 1;
          } else if (judgeConter == 2) {
            //修改
            this.dialogAddPpgz.judge = 2;
            if (this.thisItem.FilterType == 1) {
              this.dialogAddPpgz.selectval = "任务名称";
            } else if (this.thisItem.FilterType == 2) {
              this.dialogAddPpgz.selectval = "构件属性";
            }
            if (this.thisItem.FilterTypeValue == 1) {
              this.dialogAddPpgz.selectn1 = "构件名称";
            } else if (this.thisItem.FilterTypeValue == 2) {
              this.dialogAddPpgz.selectn1 = "构件类别";
            } else if (this.thisItem.FilterTypeValue == 3) {
              this.dialogAddPpgz.selectn1 = "构件类型";
            }
            this.dialogAddPpgz.inputVal = this.thisItem.FilterPropertyKey;
          }
          this.$refs.matchDialog.showDialog = true;
        } else if (nub == 2) {
          if (judgeConter == 1) {
            this.dialogDelConfig.title = "删除匹配规则";
            this.dialogDelConfig.conter = "确定删除匹配规则?";
            this.dialogDelConfig.judge = 1;
          } else {
            this.dialogDelConfig.title = "删除进度方案";
            this.dialogDelConfig.conter = "确定删除进度方案?";
            this.dialogDelConfig.judge = 2;
          }
          this.$refs.delDialogMatch.showDialog = true;
        } else if (nub == 3) {
          if (judgeConter == 1) {
            this.dialogAddJd.name = "";
            this.dialogAddJd.date1 = [];
            this.dialogAddJd.region = "";
            this.dialogAddJd.judge = 1;
          } else {
            console.log(this.thisItem);
            if (this.thisItem) {
              this.dialogAddJd.name = this.thisItem.ScheduleName;
              this.dialogAddJd.date1 = [
                this.thisItem.ScheduleStartTime,
                this.thisItem.ScheduleEndTime
              ];
              if (this.thisItem.ScheduleCycle == 7) {
                this.dialogAddJd.region = "工作日(7天)";
              } else if (this.thisItem.ScheduleCycle == 5) {
                this.dialogAddJd.region = "工作日(5天)";
              }
              this.dialogAddJd.judge = 2;
              this.dialogAddJd.ScheduleID = this.thisItem.ScheduleID;
            }
          }
          this.$refs.dialogView.showDialog = true;
        }
      },
      showNavClick(e) {
        this.navList.showOrHide = true;
        this.navList.styleTop = e.pageY - 20;
        this.navList.styleLeft = e.pageX - 20;
      },
      mouseLeaveFun() {
        setTimeout(() => {
          if (!this.navList.hoverJudge) {
            if (this.navList.showOrHide) {
              this.navList.showOrHide = false;
            }
          }
        }, 300);
      },
      navMouseOver() {
        this.navList.hoverJudge = true;
      },
      navMouseLeave() {
        this.navList.hoverJudge = false;
      },
      requestItems() {
        this.$axios(
          `${window.urlConfig}/api/Prj/GetModelSchedules?ProjectID=${ window.ProjectID}&ModelID=${window.ModelID}`
        ).then(res => {
          console.log(res.data);
          if (res.data.length > 0) {
            this.items = res.data;
          }
        });
      }
    },
    mounted() {
      this.requestItems();
    },
    watch: {
      // thisItem:function(val,oldval){
      //   console.log(val,oldval)
      // }
    }
  };
</script>
<style lang="css" scoped>
  .ppgz-dialog {
    width: 200px;
    min-height: 72px;
    background-color: #ffffff;
    box-shadow: 0px 18px 49px -30px rgba(87, 89, 89, 0.5);
    border-radius: 2px;
    border: solid 1px #c5d1ed;
    position: absolute;
    top: 0;
    right: -201px;
    padding: 15px;
  }
  .ppgz-dialog h2 {
    color: #b0bcd0;
    text-align: left;
  }
  .ppgz-dialog p {
    text-align: left;
    margin-top: 15px;
    color: #417fcd;
  }
  .footer-btn {
    width: 110px;
    height: 24px;
    background-color: #f7a500;
    box-shadow: 0px 2px 2px -1px #cfa95d;
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 3px;
    line-height: 24px;
    color: #fff;
    padding-left: 20px;
    cursor: pointer;
  }
  .footer-btn img {
    width: 12px;
    height: 12px;
    text-align: center;
    line-height: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 10px;
    margin: auto;
  }
  header {
    height: 30px;
    line-height: 30px;
    width: 100%;
    text-align: center;
    background-color: #f5f9fc;
    border: solid 1px #d9d9d9;
  }
  main {
    margin-top: -1px;
    width: 100%;
    flex: 1;
    background-color: #f9f9f9;
    border: solid 1px #e5e5e5;
    position: relative;
  }
  main nav {
    padding: 5px 0;
    width: 120px;
    position: absolute;
    left: 160px;
    border: 1px solid #d9d9d9;
    box-shadow: 10px 10px 5px #888888;
    background: #fff;
  }
  main nav .sj {
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #a3adc4 transparent;
    position: absolute;
    top: -19px;
    left: 10px;
    z-index: 1;
  }
  main nav .sj .sj1 {
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 2;
  }
  main nav li {
    height: 25px;
    line-height: 25px;
    width: 119px;
    position: relative;
    padding-left: 39px;
    text-align: left;
    cursor: pointer;
  }
  main nav li img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 9px;
    margin: auto;
  }
  main nav li:hover {
    background-color: #edeff2;
    color: #417fcd;
  }
  main .show-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 40px;
    text-align: center;
  }
  main .list-wp li {
    width: 100%;
    height: 20px;
    position: relative;
    background-color: #fff;
    text-align: left;
    padding-left: 18px;
	cursor: pointer;
  }
  main .list-wp li img {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    bottom: 0;
    right: 8px;
    margin: auto;
    display: none;
  }
  main .list-wp li.select {
    background-color: #9fbdd7 !important;
  }
  main .list-wp li:hover img {
    display: inline-block;
    cursor: pointer;
  }
  main .list-wp li .text {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 100%;
    line-height: 20px;
  }
  main .list-wp li:nth-child(even) {
    background-color: #e3ebf3;
  }
  .scheduleList-wp {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  }
</style>
