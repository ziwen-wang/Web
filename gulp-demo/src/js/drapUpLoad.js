var vm = new Vue({
    el: '#app',
    data() {
        return {
            upLoadView: false,
            // items: [{
            //     text: '测试文档测试文档测试文档测试文档测试文档测试文档',
            //     file: '',
            //     upload: '', //是否上传成功
            //     timeStamp:'' //事件戳,
            //      uploading:'',//是否正在上传
            // }]
            items: [],
            indexFile: 0, //已上传文件
            postUrl: '',
            CurrentUserName: '',
            judgeUploadState: true,
            CurrentUserId: '',
            inputVal:''
        }
    },
    methods: {
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        selectFileUpLoad(e) {
            var _this = this
            var files = e.target.files
            for (let i = 0; i < files.length; i++) {
                _this.pushItemView(files[i])
            }
            
            
            
        },
        pushItemView(file) {
            let timer = new Date()
            if (!this.judgeUploadState) {
                this.upLoadView = false
                this.items.length = 0
                this.judgeUploadState =  true
            }
            
            this.items.push({
                file: file,
                upload: false,
                timeStamp: 'F_0_' + timer.getTime(),
                uploading:false
            })
        },
        listRemove(item, index) {
            this.items.splice(index, 1)
            this.inputVal = ''
        },
        reUpLoad(item) {
            var _this = this
            item.upload = false
            item.timeStamp = 'F_0_' + new Date().getTime()
            uploading = true
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            }
            let formData = new FormData();
            formData.append("ProjectID", this.getUrlParms('BIMComposerID'));
            formData.append("FolderID", this.getUrlParms('FolderID'));                            // 提交上传时，所处的文件夹ID
            formData.append("CreateUserID", this.CurrentUserId);                   // TODO: 地址栏参数：当前人
            formData.append("NormalOrDrawings", ((this.getUrlParms('IsPdf')) * 1 == 0 ? "Normal" : "Drawings"));
            // TODO: 地址栏参数：当前人姓名
            formData.append("IsSaveVersion", 1);
            formData.append("CreateUserName", _this.CurrentUserName);
            formData.append(item.timeStamp, item.file)
            axios.post(_this.postUrl, formData, config).then((res) => {
                _this.upLoadView = true
                if (res.data == "success" || res.data == 'fail') {
                   
                    item.uploading = false
                    item.upload = true
                }
                
            }).catch((res) => {
                _this.upLoadView = true
                console.log('请求失败原因：' + res)
                item.uploading = false
                item.upload = false
            })
        },
        upLoadSubmit() {
            if (this.items.length < 1) {
                return false
            }
            this.judgeUploadState = false
            var _this =this
            // 上传文件的提交动作
           
            
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            }
            if (_this.postUrl == '') {
                axios.get('/FileComm/GetVars').then(res => {
                    _this.postUrl += res.data.DocumentHost
                    _this.postUrl += res.data.UploadFile
                    _this.CurrentUserId = res.data.CurrentUserId
                    _this.CurrentUserName = res.data.CurrentUserName
                                    // TODO: 地址栏参数：当前人
                    //formData.append(_this.items[indexFile].timeStamp, _this.items[indexFile].file)
                    _this.items.map((item, index) => {
                        item.uploading = true
                        let formData = new FormData();
                        formData.append("ProjectID", this.getUrlParms('BIMComposerID'));
                        formData.append("FolderID", this.getUrlParms('FolderID'));                            // 提交上传时，所处的文件夹ID
                        formData.append("CreateUserName", _this.CurrentUserName);
                        formData.append("CreateUserID", _this.CurrentUserId);   
                        formData.append("NormalOrDrawings", ((this.getUrlParms('IsPdf')) * 1 == 0 ? "Normal" : "Drawings"));
                        // TODO: 地址栏参数：当前人姓名
                        formData.append("IsSaveVersion", 1);

                        formData.append(item.timeStamp, item.file)
                        _this.axiosFiles(formData, index, item)
                        
                       
                    })
                }).catch(res => {
                    console.log('请求失败原因：' + res)
                })
            } else {
                
                _this.items.map((item, index) => {
                    item.uploading = true
                    let formData = new FormData();
                    formData.append("ProjectID", this.getUrlParms('BIMComposerID'));
                    formData.append("FolderID", this.getUrlParms('FolderID'));                            // 提交上传时，所处的文件夹ID
                    formData.append("CreateUserName", _this.CurrentUserName);
                    formData.append("CreateUserID", _this.CurrentUserId);
                    formData.append("NormalOrDrawings", ((this.getUrlParms('IsPdf')) * 1 == 0 ? "Normal" : "Drawings"));
                    // TODO: 地址栏参数：当前人姓名
                    formData.append("IsSaveVersion", 1);
                    formData.append("CreateUserName", _this.CurrentUserName);
                    formData.append(item.timeStamp, item.file)
                    _this.axiosFiles(formData, index, item)
                })
            }
        },
        axiosFiles(data, index, item) {
            let _this = this
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            let index1 = index
            axios.post(_this.postUrl, data, config).then((res) => {
                _this.upLoadView = true
                if (res.data == "success" || res.data == 'fail') {
                        _this.items[index].uploading = false
                        _this.items[index].upload = true
                    
                }
                
            }).catch((res) => {
                console.log('请求失败原因：' + res)
                _this.upLoadView = true
                item.uploading = false
                item.upload = false

                
            })
        },
        getUrlParms(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }
    },
    mounted() {
        var _this = this
        var dragView = document.getElementById('dragView')
        dragView.addEventListener('dragover', function (e) {
            e.preventDefault();
        }, false);
        dragView.addEventListener("drop", function (e) {
            e.preventDefault(); //禁止浏览器默认行为
            var dt = e.dataTransfer
            var files = dt.files;
            for (let i = 0; i < files.length; i++) {
                _this.pushItemView(files[i])
            }
           
        }, false);

    }
})