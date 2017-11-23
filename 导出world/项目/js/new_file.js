var vm = new Vue({
    el: "#att",
    data: {
        removebtn: true,
        isAddEntries: true, //添加附件显示隐藏
        isMask: false,
        imgselect: false,
        isLeft: false,
        //添加复检
        isfjshow: false,

        unit: true, //知晓单位
        flag: false,
        items: '',
        defaultValue: {
            Evt_ID: '',
            MB_Guid: '',
            P_Guid: '',
        },
        startPage: 0,
        judgeRequest: true,
        loadTxt: '加载中...',
        loadView: false,
        selectAllNub: '',
        selectNub: 0,
        selectAllBtn: true,
        judgeSeletAll: true,
        selectGuid: [],//选中
        RemoveListGuid: [],
        judgeScreen: '', //判断筛选条件变化
        //新增
        starX: 0,
        moveX: 0,
        FilterModel: '',
        selectStorage: '',
        allItemsNub: 0,
        textall: "全部",
        titleViewRemind: false,
        reduceNub: 0,
        nav1Judge: false,
        okbut: '确认调整',
        zfok: false,
        navListText: ['转发'],
        reportSelectText: [{ txt: '工作联系单', select: false }, { txt: '监理日记' }, { txt: '监理日志' }, { txt: '监理通知' }, { txt: '数据记录表' }],
        reportSelectView:false,
    },
    methods: {
        readSelectStorage: function () {
            var _this = this
            //if (this.allItemsNub == 1) {
            //    alert(1)
            //} else {
            //    alert(2)
            //}
            this.selectStorage = JSON.parse(window.localStorage.getItem('RIP_Guid'))
            if (this.selectStorage == null || this.selectStorage == '' || this.selectStorage == undefined) {
                return false
            }
            var a = 0;
            _this.items.forEach(function (item) {
                _this.selectStorage.forEach(function (select) {
                    if (item.RIP_Guid == select) {
                        a += 1
                        if (typeof item.select == 'undefined') {
                            vm.$set(item, 'select', true)
                        } else {
                            item.select = true
                        }
                        //_this.selectNub = _this.selectNub + 1
                        //if (_this.selectNub == _this.selectAllNub) {
                        //    _this.selectAllBtn = true
                        //}
                    }
                })
            })
            //_this.selectNub = _this.selectStorage.length;
            _this.selectNub = a
            if (_this.selectNub == _this.selectAllNub) {
                _this.selectAllBtn = true
            }


        },
        ForwardFun: function (index) {
            if (index == 1) {
                this.okbut = '确定导出'
                this.zfok = false
            } else {
                this.okbut = '确定转发'
                this.zfok = true
            }
            var _this = this
            var that = this
            $('.hclick>img').hide()
            //_this.isMask = true
            
            _this.selectNub=0
            this.removebtn = !this.removebtn
            _this.selectAllBtn = false
            _this.items.forEach(function (e) {
                if (typeof e.select == 'undefined') {
                    vm.$set(e, 'select', false)
                } else {
                    e.select = false
                }
            })
            this.imgselect = true
            this.nav1Judge = !this.nav1Judge
            
            // this.isLeft = !this.isLeft
            $(".list-contet").toggleClass("left-m")
            $(".biaoqianone").toggleClass("left-b")
            this.flag = !this.flag
        },
        DateFormat: function (cellval) {
            var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            var miseconds = date.getMilliseconds();
            var misstr = "";
            if (miseconds < 10) {
                misstr = "00";
            } else if (miseconds < 100) {
                misstr = "0";
            } else {

            }
            misstr = misstr + miseconds;
            return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes
        },
        touchstart: function (e) {
            starX = e.touches[0].clientX;
        },
        touchMove: function (e) {
            if (this.imgselect) {
                return false
            }
            moveX = e.touches[0].clientX;
            var $e = e.target;
            if (moveX - starX < -30) {
                if (this.hasClass(e.currentTarget, 'animation')) {
                    return
                } else {
                    this.addClass(e.currentTarget, 'animation')

                }
            } else if (moveX - starX > 30) {
                if (this.hasClass(e.currentTarget, 'animation')) {
                    this.removeClass(e.currentTarget, 'animation')

                }
            }
        },
        hasClass: function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function (obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        removeClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },
        //获取url 地址栏
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null
        },
        //问题删除按钮
        //删除按钮操作 和取消
        slectAllClick: function () {
            var _this = this
            this.judgeSeletAll = !this.judgeSeletAll
            this.selectAllBtn = !this.selectAllBtn
            if (this.selectAllBtn) {
                _this.items.forEach(function (e) {
                    if (typeof e.select == 'undefined') {
                        vm.$set(e, 'select', true)
                    } else {
                        e.select = true
                    }
                })
            } else {
                _this.items.forEach(function (e) {
                    if (e.select) {
                        e.select = false
                    }
                })
            }
            if (_this.selectAllBtn) {
                this.selectNub = this.selectAllNub
            } else {
                this.selectNub = 0
            }


        },
        toggleremove: function () {
            this.okbut='确定调整'
            var _this = this
            var that = this
            this.zfok = false
            //_this.isMask = true
            this.removebtn = !this.removebtn
            this.imgselect = !this.imgselect
            // this.isLeft = !this.isLeft
            $(".list-contet").toggleClass("left-m")
            $(".biaoqianone").toggleClass("left-b")
            this.flag = !this.flag
            if (that.imgselect == true) {
                _this.titleViewRemind = true
                that.unit = true
                $(".btnunit").addClass("disabled")
            } else {
                _this.titleViewRemind = false
                $(".btnunit").removeClass("disabled")
                _this.items.forEach(function (e) {//点击取消 重置数据
                    if (!e.select) {
                        e.select = true
                    }
                })
                _this.selectNub = _this.selectAllNub
                _this.selectAllBtn = true
                _this.judgeSeletAll = true

            }
            this.items.forEach(function (e) {
                if (e.click) {
                    e.click = false
                }
            })
            if (_this.getQueryString('allInspect') == 1) {
                Vue.nextTick(function () {
                    $('.hclick>img').show()
                    $('.hclick>span.tzBtn').hide()
                })
               
            }
            //所有li 清除旋转
            $('.heightl').each(function (index, el) {
                if ($(el).hasClass('animation')) {
                    $(el).removeClass('animation')
                }
            })
        },
        toggleremoveok: function () {
            var _this = this
            //韩彦斌加
            if (this.zfok==true) {//转发用
                var RIP_Guids = ',',
                 indexs = [];
                this.items.forEach(function (el) {  
                    console.log(el)
                    if (el.select) {
                        indexs.push(el.RIP_Guid)
                        RIP_Guids += el.RIP_Guid + ','
                    }
                })
                if (_this.selectAllBtn == true) { //全选的Guid   _this.selectGuid                                                    
                    if (window.Android) {
                        var loc = window.location.host
                        window.Android.startNewWebActivity('http://' + loc + '/CreateEvt/ThreeCreate', 1, 1, 'P_Guid=' + this.defaultValue.P_Guid + '&MB_Guid=' + this.defaultValue.MB_Guid + '&RIP_Guids=' + _this.selectGuid + '&Chart=1')
                    }
                } else {
                    if (window.Android) {
                        var loc = window.location.host
                        window.Android.startNewWebActivity('http://' + loc + '/CreateEvt/ThreeCreate', 1, 1, 'P_Guid=' + this.defaultValue.P_Guid + '&MB_Guid=' + this.defaultValue.MB_Guid + '&RIP_Guids=' + RIP_Guids + '&Chart=1')
                    }
                }
             
            } else { 
                if (_this.getQueryString('allInspect') == 1) {//导出
                    this.reportSelectView = true
                    
                } else {//调整用
                    this.flag = !this.flag

                    var judgeArrLen = true
                    for (var i = 0; i < _this.items.length; i++) {
                        if (_this.items[i].select) {
                            judgeArrLen = false
                            break;
                        }
                    }
                    _this.isMask = true
                    $(".list-contet").toggleClass("left-m")
                    $(".btnunit").removeClass("disabled")
                    $(".biaoqianone").toggleClass("left-b")
                    var that = this

                    this.removebtn = !this.removebtn
                    this.imgselect = !this.imgselect
                //报告  
                }
                
            }
           
           
        },
        SubmitForm: function () {
            var _this = this
            var txt = JSON.stringify(_this.FilterModel)
            localStorage.setItem('FilterModel',txt)
            if (_this.allItemsNub == 1) {//全部
                if (_this.items.length == _this.selectAllNub) {//全选状态
                    var arr = JSON.stringify(_this.selectGuid)
                    localStorage.setItem('RIP_Guid', arr)
                    
                } else {//非全选
                    var arr = []
                    _this.items.forEach(function (e) {
                        if (!e.select) {
                            arr.push(e.RIP_Guid)
                        }
                    })
                    _this.selectGuid.forEach(function (guid) {
                        arr.forEach(function (ar) {
                            if (guid == ar) {
                                _this._this.select.splice(_this.selectGuid.indexOf(guid), 1)
                            }
                        })
                    })
                    
                    var selectGuid = JSON.stringify(_this.selectGuid)
                    localStorage.setItem('RIP_Guid', selectGuid)
                }
            } else {
                //if (window.localStorage.RIP_Guid != '' && window.localStorage.RIP_Guid != null) {
                //    _this.selectStorage = JSON.parse(window.localStorage.getItem('RIP_Guid'))
                //}
               

                //if (_this.selectAllBtn) {//全选状态
                //    if (_this.selectStorage != null && _this.selectStorage != '' && _this.selectStorage != undefined) {
                //        _this.selectGuid = _this.selectStorage.concat(_this.selectGuid)
                //    }
                //    var arr = JSON.stringify(_this.selectGuid.unique())
                //    localStorage.setItem('RIP_Guid', arr)
                //} else {//非全选
                //    var arr = [], reArr = [];
                //    _this.items.forEach(function (e) {
                //        if (e.select) {
                //            arr.push(e.RIP_Guid)
                //        } else {
                //            reArr.push(e.RIP_Guid)
                //        }
                //    })
                //    if (_this.selectStorage != null && _this.selectStorage != '') {
                //        arr = arr.concat(_this.selectStorage)
                //    }
                //    _this.selectGuid.forEach(function (guid) {
                //        reArr.forEach(function (rea) {
                //            if (guid == rea) {
                //                _this.selectGuid.splice(_this.selectGuid.indexOf(guid),1)
                //            }
                //        })
                //    })
                //    //arr = _this.diffArr(arr.unique(), reArr)
                //    //arr = JSON.stringify(arr)
                //    localStorage.setItem('RIP_Guid', arr)
                //}
                var selectGuid = JSON.stringify(_this.selectGuid)
                localStorage.setItem('RIP_Guid', selectGuid)

                if (window.Android) {
                    window.Android.finishActivity()
                }
            }
            //_this.isMask = false
            //$('.loading-wp').show()
            //重置
            //_this.selectAllBtn = true
            //_this.judgeSeletAll = true
            //_this.selectNub = _this.selectAllBtn
            //_this.items.forEach(function (e) {//点击完成 重置数据
            //    if (e.select) {
            //        e.select = true
            //    }
            //})
        },
        //导出二期
        hoverAnmiate: function (el, cla) {
            $(el.target).addClass(cla)
        },
        hoverAnmiateEnd: function (el, cla) {
            $(el.target).removeClass(cla)
        },
        reportSelectLi: function (item, index) {
            if (typeof item.select == 'undefined') {
                vm.$set(item, 'select', true)
            } else {
                item.select = !item.select
            }
            this.reportSelectText.forEach(function (item, itemindex) {
                if (itemindex == index) {

                } else {
                    if (typeof item.select == 'undefined') {
                        vm.$set(item, 'select', false)
                    } else {
                        item.select = false
                    }
                }
            })
        },
        toggleunit: function (item, $event) {
            var el = $event.target
            if (!this.removebtn) {
                return
            }
            var _this = this
            if (typeof item.click == 'undefined') {
                var data = {
                    MB_Guid: _this.defaultValue.MB_Guid,
                    P_Guid: _this.defaultValue.P_Guid,
                    RIP_Guid: item.RIP_Guid
                }
                $.post('/Evt_EventProblem/GetEvtInsiderList', data, function (data) {
                    if (typeof item.childPage == 'undefined') {
                        vm.$set(item, 'childPage', data)
                        //Vue.nextTick(function () {
                        //    var height = $(el).parents(".list-contet").find(".know-unit").height()+20;
                        //    $(el).parents("li.heightl").css("margin-bottom", height + 'px')
                        //})
                    }

                }, 'json')
                vm.$set(item, 'click', true)
            } else {
                item.click = !item.click
                // var height = $(el).parents(".list-contet").find(".know-unit").height();
                //if (item.click) {
                //    $(el).parents("li.heightl").css("margin-bottom", height + 'px')
                //} else {
                //    $(el).parents("li.heightl").css("margin-bottom", ".2rem")
                //}

            }
        },
        reportSubmit: function () {
            var _this = this
            //this.selectGuid = this.selectGuid.unique()
            var data = {
                MB_Guid: _this.getQueryString('MB_Guid'),
                P_Guid: _this.getQueryString('P_Guid'),
                ReportType: 1,
                RIPGuidList: '8367F52B-7753-40C7-8E05-715B703EFA19;'
            }
            _this.reportSelectText.forEach(function (el) {
                if (el.select) {
                    data.ReportType = _this.reportSelectText.indexOf(el) +1
                }
            })
            if (data.ReportType == '') {
                return false
            }
            var RIPGuidList = ''
            if (this.selectNub > this.items.length) {
                _this.selectGuid.forEach(function (guid) {
                    RIPGuidList += guid +';'
                })
            } else {
                _this.items.forEach(function (item) {
                    if (item.select) {
                        RIPGuidList += item.RIP_Guid + ';'
                    }
                })
            }
            var date = new Date()
            var fileName = date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth() + 1) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds())
            data.RIPGuidList = RIPGuidList
            if (data.ReportType == 5) {//导出excel
                $('.loading-wp').show()
                $.post('/Pro_File/GetExcel', data, function (rep) {
                    console.log(rep)
                    if (window.Android) {
                        window.Android.exportFile(rep.URL, '数据记录表' + fileName)
                    }
                    $('.loading-wp').hide()
                }, 'json')
            } else {//word
                $('.loading-wp').show()
                $.post('/Pro_File/GetReportFile', data, function (rep) {
                    console.log(rep)
                    if (rep.list.Table.length == 0) {
                        _this.reportSelectView = false
                        _this.toggleremove()
                        _this.toggleremove()
                        $('.loading-wp').hide()
                        return false
                    }
                    
                    
                    if (data.ReportType == 1) {//工作联系单
                        var word = {
                            P_Name: rep.list.Table[0].P_Name,
                            MaxStr: rep.list.Table[0].CP_ShortName + rep.list.Table[0].MaxStr,
                            RIP_Names: [],//事由
                            center: [],
                            CP_Name: rep.list.Table[0].CP_Name,
                            newTime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                            jindu: [],
                            anquan: [],
                            zhiliang: [],
                            wu: [],
                            tmplStr: '',
                            ripGuid:''
                        }
                        rep.list.Table.forEach(function (tab, index) {
                            

                            if (word.ripGuid == tab.RIP_Guid) {//true

                            } else {
                                word.RIP_Names.push(tab.RIP_Name + ',')
                                word.center.push({
                                    txt: tab.RIP_Position + tab.RIP_Name + ';' + tab.TreatmentMethod,
                                    index: index
                                })
                            }
                            word.ripGuid = tab.RIP_Guid
                             
                            if (tab.PB_Order == 2) {
                                word.anquan.push({
                                    PF_Url: window.pfUrl+tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else if (tab.PB_Order == 3) {
                                word.zhiliang.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else if (tab.PB_Order == 1) {
                                word.jindu.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else {
                                word.wu.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            }
                        })
                        var nub = word.zhiliang.length + word.jindu.length + word.wu.length + word.anquan.length;
                        for (var i = 0; i < nub; i++) {
                            word.tmplStr +=',27,32,24,36'
                        }
                        XDoc.to(baidu.template('tmpl', word), 'docx', { "_filename": '工作联系单' + fileName }, "_self");
                        if (window.Android) {
                            window.Android.setExportFileName('工作联系单' + fileName+'.docx')
                        }
                        setTimeout(function () {
                            $('.loading-wp').hide()
                        }, 1000)
                    } else if (data.ReportType == 2) {//监理日记
                        var word = {
                            P_Name: rep.list.Table[0].P_Name,
                            conter: {
                                jindu: [],
                                zhiliang: [],
                                qita: [],
                                anquan:[]
                            },
                            MB_Name: rep.list.Table[0].MB_Name,
                            newTime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                            ripGuid: []
                        }
                        rep.list.Table.forEach(function (tab, index) {
                            

                            if (word.ripGuid == tab.RIP_Guid) {//true

                            } else {
                                if (tab.PB_Order == 1) {
                                    word.conter.jindu.push(tab.RIP_Position + tab.RIP_Name + tab.CompletionRatio + ';' + tab.TreatmentMethod)
                                } else if (tab.PB_Order == 3) {
                                    word.conter.zhiliang.push(tab.RIP_Position + tab.RIP_Name + tab.RIP_ResultType + ';' + tab.TreatmentMethod)
                                } else if (tab.PB_Order == 2) {
                                    word.conter.anquan.push(tab.RIP_Position + tab.RIP_Name + tab.RIP_ResultType + ';' + tab.TreatmentMethod)
                                }else {
                                    word.conter.qita.push(tab.RIP_Position + tab.RIP_Name + tab.RIP_ResultType + ';' + tab.TreatmentMethod)
                                }
                            }
                            word.ripGuid = tab.RIP_Guid
                           
                        })
                        
                        XDoc.to(baidu.template('jianliriji', word), 'docx', { "_filename": '监理日记' + fileName }, "_self");
                        if (window.Android) {
                            window.Android.setExportFileName('监理日记' + fileName + '.docx')
                        }
                        $('.loading-wp').hide()
                    } else if (data.ReportType == 3) {//日志
                        var dayArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
                        var word = {
                            newTime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                            newTimeDate: dayArr[date.getDay()],
                            mb_name: rep.list.Table[0].MB_Name,
                            zhihou1: [],
                            zhihou2: [],
                            zhengchang: [],
                            weipanding: [],
                            anquan: [],
                            zhiliang: [],
                            wu: [],
                            ripGuid: [],
                            P_name: rep.list.Table[0].P_Name

                        }
                        rep.list.Table.forEach(function (tab, index) {
                           

                            if (word.ripGuid == tab.RIP_Guid) {//true

                            } else {
                                //PB_Order  进度 1  安全 2 质量 3 其他4
                                if (tab.PB_Order == 1 && tab.RIP_ResultType == '滞后' && tab.PlanDegree == '在施工') {
                                    word.zhihou1.push(tab.RIP_Position + tab.RIP_Name + ';' + tab.PlanDegree)
                                } else if (tab.PB_Order == 1 && tab.RIP_ResultType == '滞后' && tab.PlanDegree == '已完成') {
                                    word.zhihou2.push(tab.RIP_Position + tab.RIP_Name + ';' + tab.PlanDegree)
                                } else if (tab.PB_Order == 1 && tab.RIP_ResultType == '正常') {
                                    word.zhengchang.push(tab.RIP_Position + tab.RIP_Name + ';' + tab.PlanDegree)
                                } else if (tab.PB_Order == 1 && tab.RIP_ResultType == '无定论') {
                                    word.weipanding.push(tab.RIP_Position + tab.RIP_Name + ';' + tab.PlanDegree)
                                }
                                if (tab.PB_Order == 2) {
                                    word.anquan.push(tab.MB_Name + tab.RIP_Position + tab.RIP_Name + tab.TreatmentMethod)
                                } else if (tab.PB_Order == 3) {
                                    word.zhiliang.push(tab.MB_Name + tab.RIP_Position + tab.RIP_Name + tab.TreatmentMethod)
                                } else if (tab.PB_Order == 4) {
                                    word.wu.push(tab.MB_Name + tab.RIP_Position + tab.RIP_Name + tab.TreatmentMethod)
                                }
                            }
                            word.ripGuid = tab.RIP_Guid
                            
                        })

                        XDoc.to(baidu.template('rizhi', word), 'docx', { "_filename": '监理日志' + fileName }, "_self");
                        if (window.Android) {
                            window.Android.setExportFileName('监理日志' + fileName + '.docx')
                        }
                        setTimeout(function () {
                            $('.loading-wp').hide()
                        }, 1000)
                    } else if (data.ReportType == 4) {//通知
                        var word = {
                            P_Name: rep.list.Table[0].P_Name,
                            MaxStr: rep.list.Table[0].CP_ShortName + rep.list.Table[0].MaxStr,
                            RIP_Names:[],//事由
                            center: [],
                            CP_Name: rep.list.Table[0].CP_Name,
                            newTime: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
                            jindu: [],
                            anquan: [],
                            zhiliang: [],
                            wu: [],
                            tmplStr: '',
                            ripGuid: []
                        }
                        rep.list.Table.forEach(function (tab, index) {

                            if (word.ripGuid == tab.RIP_Guid) {//true

                            } else {
                                word.RIP_Names.push(tab.RIP_Name + ',')
                                word.center.push({
                                    txt: tab.RIP_Position + tab.RIP_Name + tab.RIP_ResultType + ';' + tab.TreatmentMethod,
                                    index: index
                                })
                            }
                            word.ripGuid = tab.RIP_Guid

                            if (tab.PB_Order == 2) {
                                word.anquan.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else if (tab.PB_Order == 3) {
                                word.zhiliang.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else if (tab.PB_Order == 1) {
                                word.jindu.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            } else {
                                word.wu.push({
                                    PF_Url: window.pfUrl + tab.PF_Url,
                                    RIP_Severity: tab.RIP_Severity,//严重程度
                                    HCIC_AddDate: tab.HCIC_AddDate.replace('T', ' '),//整改时间
                                    RIP_Position: tab.RIP_Position,
                                    RIP_Name: tab.RIP_Name
                                })
                            }
                        })
                        var nub = word.zhiliang.length + word.jindu.length + word.wu.length + word.anquan.length;
                        for (var i = 0; i < nub; i++) {
                            word.tmplStr += ',27,32,24,36'
                        }
                        XDoc.to(baidu.template('tongzhi', word), 'docx', { "_filename": '监理通知' + fileName }, "_self");
                        if (window.Android) {
                            window.Android.setExportFileName('监理通知' + fileName + '.docx')
                        }
                        setTimeout(function () {
                            $('.loading-wp').hide()
                        }, 1000)
                        
                    }
                }, 'json')
            }
            
            this.reportSelectView = false
            this.toggleremove()
        },
        selectList: function (item) {

            var _this = this
            if (!_this.imgselect) {
                if (window.Android) {
                    window.Android.openProblemDetail(item.RIP_Guid, 0)
                }
                return false
            }
            if (typeof item.select == 'undefined') {
                vm.$set(item, 'select', true)
            } else {
                item.select = !item.select
            }
            if (item.select) {
                _this.selectNub += 1
                if (this.selectNub == this.selectAllNub) {
                    this.selectAllBtn = true
                } else {
                    this.selectAllBtn = false
                }
                _this.selectGuid.push(item.RIP_Guid)//检查结果
                _this.RemoveListGuid.splice(_this.RemoveListGuid.indexOf(item.RIP_Guid), 1)
            } else {
                _this.selectNub -= 1
                if (this.selectNub == this.selectAllNub) {
                    this.selectAllBtn = true
                } else {
                    this.selectAllBtn = false
                }
                if (_this.selectAllBtn) {
                    _this.selectAllBtn = false
                }
                    _this.selectGuid.splice(_this.selectGuid.indexOf(item.RIP_Guid), 1)//检查结果
                    _this.RemoveListGuid.push(item.RIP_Guid)
            }
            //var c = []
            //this.items.forEach(function (e) {
            //    if (e.select) {
            //        c.push(e)
            //    }
            //})
            
        },
        ChangeDateFormat: function (cellval, item) {
            var oldDate = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
            var newDate = new Date().getTime();
            if (newDate - oldDate >= 0) {

            } else if (newDate - oldDate < 0) {
                if (typeof item.overTime == 'undefined') {
                    vm.$set(item, 'overTime', true)
                }
            }
            var nTime = Math.abs(newDate - oldDate) / 1000
            var day = Math.floor(nTime / 86400);
            var hour = Math.floor(nTime % 86400 / 3600);
            var minute = Math.floor(nTime % 86400 % 3600 / 60);
            return day + '天' + hour + '时' + minute + '分'



        },
        clearScreen: function () {
            $('.clearBtn').hide()
            if (window.Android) {
                window.Android.clearScreen()
            }
            
            this.requestPage('')
        },
        requestPage: function (FilterModel) {
            var _this = this
            
            //if (FilterModel) {
            //    _this.FilterModel = FilterModel
            //}
            _this.FilterModel = FilterModel
            var IsRight = 0
            if (this.getQueryString('IsRight')!=null) {
                IsRight=this.getQueryString('IsRight')
            }
            FilterModel ? FilterModel : FilterModel = ''
            if (_this.FilterModel == '') {
                $('.clearBtn').hide()
                _this.textall = "全部"
            } else {
                $('.clearBtn').show()
                _this.textall = "筛选结果"
            }
            var datas = {
                MB_Guid: this.defaultValue.MB_Guid,
                PB_Guid: -1,// 传入的大类类别参数,APP获取（-1，-2 ，guid）
                statType: _this.getQueryString('statType'),
                StartIndex: this.startPage,
                PageSize: 10,
                IsGetCount: "1",
                FilterModel: FilterModel ? FilterModel : '',
                SelectType: this.allItemsNub,//是否全选
                P_Guid: this.getQueryString('P_Guid'),
                IsRight: IsRight,
                sTime: this.getQueryString('sTime'),
                eTime: this.getQueryString('eTime'),
            }                        
            
            console.log(_this.judgeScreen, FilterModel)
            if (_this.judgeScreen != FilterModel) {//判断筛选条件是否相等
                _this.items = ''
                datas.StartIndex = 0
                _this.startPage = 0
            }
            _this.judgeScreen = FilterModel
            console.log('当前第' + this.startPage)
            var tem = datas;
            datas = JSON.stringify(datas)
            $.ajax({
                type: 'POST',
                url: "/Stat/GetStatRIPData",
                data: { "FModel": datas },
                dataType: "json",
                success: function (data) {
                    var statType = _this.getQueryString('statType') * 1
                    if (_this.getQueryString('allInspect') == 1) {
                        $('title').text('全部检查结果')
                    } else {
                        if (statType == 0) {
                            $('title').text('综合统计数据')
                        } else if (statType == 1) {
                            $('title').text('进度统计数据')
                        } else if (statType == 2) {
                            $('title').text('质量统计数据')
                        } else {
                            $('title').text('安全统计数据')
                        }
                    }
                    
                    if (_this.items instanceof Array) {
                        data.RIP_Model.forEach(function (item) {
                            if (_this.zfok ==true) {
                                if (typeof item.select == 'undefined') {
                                    vm.$set(item, 'select', false)
                                } else {
                                    item.select = false
                                }
                            } else {
                                if (typeof item.select == 'undefined') {
                                    vm.$set(item, 'select', true)
                                } else {
                                    item.select = true
                                }
                            }
                           
                            _this.items.push(item)
                            

                        })
                    } else {
                        _this.items = data.RIP_Model
                        _this.selectAllNub = data.Count
                        _this.selectNub = data.Count
                        _this.selectGuid = data.RIP_Guids
                        //var a = JSON.stringify(_this.selectGuid)
                        //localStorage.setItem('RIP_Guid', a)
                        if (_this.getQueryString('type')) {

                        } else {
                            _this.items.forEach(function (item) {
                              
                                if (typeof item.select == 'undefined') {
                                    vm.$set(item,'select',true)
                                }
                            })
                            //_this.readSelectStorage()//默认选中
                        }

                    }
                    _this.startPage += 10
                    if (data.RIP_Model.length < 10) {
                        _this.judgeRequest = false
                    }
                    _this.loadView = false
                },
                error: function () {
                    //请求出错处理
                    console.log('请求出错处理')
                }
            })
        },
        Screen: function () {//调用安卓综合筛选
            if (window.Android) {
                window.Android.openScreen(2, -1, '')
            }

        },
        newWebView: function () {
            var _this = this
            var date = new Date()
            date.setDate(date.getDate() + 1)
            var timer = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())
            if (window.Android) {
                var locHost = window.location.host
                window.Android.startNewWebActivity('http://' + locHost + '/Stat/StatRIP', '?MB_Guid=' + _this.getQueryString('MB_Guid') + '&P_Guid=' + _this.getQueryString('P_Guid') + '&sTime=1970-01-01&eTime=' + timer + '&statType=0' + '&allInspect=1&IsRight=0')
            }
        },
        diffArr: function (a, b) {
            for (var i = 0; i < b.length; i++) {
                for (var j = 0; j < a.length; j++) {
                    if (a[j] == b[i]) {
                        a.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
            return a;
        },
        imgCao: function (b) {
            if (b == "复检") {
                return '/img/chukifj@2x.png'
            } else if (b == "审核") {
                return '/img/dun@2x (3).png'
            }
            else if (b == "忽略") {
                return '/img/dun@2x (3).png'
            }
            else if (b == "发起事项") {
                return '/img/jia@2x.png'
            }
            else if (b == "报验") {
                return '/img/baoyanpressed.png'
            }
            else if (b == "修改时限") {
                return '/img/xiugaishixian.png'
            }
        },

    },
    filters: {

    },
    mounted: function () {

        var _this = this
        window.localStorage.clear('FilterModel')
        if (_this.getQueryString('allInspect') == 1) {
            //$('.hclick>img').hide()
            $('.hclick>span').hide()
            _this.navListText.push('导出')
            if (window.Android) {
                window.Android.cancleLoadingAnim()//关闭loading动画
                window.Android.setCommpleteBackText('', '返回')
                window.Android.setCommpleteMethod('vm.newWebView()')
                window.Android.setRefresh(0)
            }
        } else {
            if (window.Android) {
                window.Android.cancleLoadingAnim()//关闭loading动画
                window.Android.showOrHideRightBtn(0)
                window.Android.setCommpleteBackText('全部', '返回')
                window.Android.setCommpleteMethod('vm.newWebView()')
                window.Android.setRefresh(0)
            }
        }
        $(window).scroll(function () {
            var $this = $(this),
                viewH = $(this).height(),
                contentH = $('.main').get(0).scrollHeight,
                scrollTop = $(this).scrollTop();
            if (scrollTop / (contentH - viewH) >= 0.95) {
                if (_this.loadView) {
                    return
                }
                _this.loadView = true
                if (!_this.judgeRequest) {
                    _this.loadTxt = '没有更多了..'
                    return false

                }
                _this.requestPage(_this.judgeScreen)
            }


        });

        
        //给arr添加原型方法 去重
        Array.prototype.unique = function () {
            var res = [];
            var json = {};
            for (var i = 0; i < this.length; i++) {
                if (!json[this[i]]) {
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }


    },
    created: function () {
        var _this = this
        this.defaultValue.MB_Guid = this.getQueryString('MB_Guid')
        this.defaultValue.Evt_ID = this.getQueryString('Evt_ID')
        this.defaultValue.P_Guid = this.getQueryString('P_Guid')
        this.requestPage('')
        var _this = this
        _this.textall = "全部"

    },
    watch: {
        titleViewRemind: function (curVal, oldVal) {
            if (curVal) {
                $('.hclick').css('top', '.9rem')
                $('.data-information').css('margin-top', '1rem')
                $('.nav.sen').css('top','1.8rem')
            } else {
                $('.hclick').css('top', '0')
                $('.data-information').css('margin-top', '1rem')
                $('.nav.sen').css('top', '9rem')
            }
        }
    }



})
