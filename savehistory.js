(function($,window){
    //历史记录插件
    //默认参数
    // 存储格式saveHistory,{'time':3600,'history':['a.html','b.html']}
    var defaults={
        expire:3600,//过期时间,单位秒，默认一个小时
        exclude:null,//排除历史记录，array
        name:'saveHistory',//存储电脑localStorage的名字
        historyName:'history',//存储电脑localStorage中历史记录的名字
        timeName:'time',//存储电脑localStorage中时间名字
        useCurrentTime:true,//是否使用当前时间戳
        repeat:true,//是否代替重复的地址
        useExact:true,//精确查找url,默认false
        historyLength:-1//最大历史记录存储，-1代表无限
    };
    var SaveHistory=function(options){
        //参数与默认值替换
        this.settings=$.extend({},defaults,options || {});
        this.init();
    }
    SaveHistory.prototype={
        init:function(){
            try{
                if(!('localStorage' in window)&&!(window['localStorage'] !== null)){
                    console.error("您的浏览器不支持h5的window.localStorage本地存储，请使用其他现代浏览器");
                    return;
                }
                this.saveUrl2Array();
            }
            catch(error){
                this.removeStorage();
            }
        },
        saveUrl2Array:function(){
            var currentUrl=encodeURIComponent(window.location.href);
            var currentTime=(new Date()).getTime();
            var storage={};
            if(this.existStorageName()){
                //存在
                storage=this.getLocalStorage();
                storage[this.settings.timeName]=this.useCurrentTime?currentTime:storage[this.settings.timeName];
                if(!this.isMax()){
                    storage[this.settings.historyName].push(currentUrl);
                    this.removeStorage();
                }
                else{
                    console.warn("历史记录数达到了最大值！");
                }
            }
            else{
                //不存在
                storage[this.settings.timeName]=currentTime;
                storage[this.settings.historyName]=[];
                storage[this.settings.historyName].push(currentUrl);
            }
            console.dirxml(storage);
            window.localStorage.setItem(this.settings.name,JSON.stringify(storage));
        },
        isMax:function(his){
            if(this.settings.historyLength=='-1'){
                return false;
            }
            return this.getLocalStorage()[this.settings.historyName].length>=this.settings.historyLength?true:false;
        },
        existUrl:function(){

        },
        go:function(){
            window.history.go(-1);
        },
        getLocalStorage:function(){
            return JSON.parse(window.localStorage.getItem(this.settings.name));
        },
        removeStorage:function(){
            window.localStorage.removeItem(this.settings.name);
        },
        existStorageName:function(){
            //是否存在localStorage的名字
            return window.localStorage.getItem(this.settings.name)===null?false:true;
        }
    }
    var saveHistory=function(options){
        return new SaveHistory(options);
    }
    window.saveHistory=$.saveHistory=saveHistory;
})(window.jQuery||window.Zepto,window);