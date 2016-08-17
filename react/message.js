(function(){
    $.Message={
        Alert:function(message,fn,iconType){
            var obj={};
            var paramLen=arguments.length;
            if(paramLen===0){
                obj.iconType="info";
            }else if(paramLen===1){
                var param=arguments[0];
                if(typeof param !=='function'){
                    obj.message=param;
                }else{
                    obj.confirmFun=param;
                }
            }else if(paramLen===2){
                var param1=arguments[0],param2=arguments[1];
                if(typeof param1 ==='function'){
                    //第一个参数不能是函数
                    throw new Error("the first param can't be fun");
                    return;
                }else{
                    obj.message=param1;
                }
                if(typeof param2 ==='function'){
                    obj.confirmFun=param2;
                }else{
                    obj.iconType=param2;
                }
            }else if(paramLen===3){
                var param1=arguments[0],param2=arguments[1],param3=arguments[2];
                if(typeof param1 ==='function'){
                    //第一个参数不能是函数
                    throw new Error("the first param can't be fun");
                    return;
                }else{
                    obj.message=param1;
                }
                if(typeof param2 !=='function'){
                    //第二个参数必须是函数
                    throw new Error("the second param must be fun");
                    return;
                }else{
                    obj.confirmFun=param2;
                }
                if(typeof param3 ==='function'){
                    //第三个参数不能是函数
                    throw new Error("the third param can't be fun");
                    return;
                }else{
                    obj.iconType=param3;
                }
            }
            this.renderHtml(obj);

        },
        Confirm:function(){
            var obj={};
            var paramLen=arguments.length;
            var param1=arguments[0] || "",param2=arguments[1] || new Function(),param3=arguments[2] || new Function(),param4=arguments[3] || "";
            obj.message=param1;
            obj.confirmFun=param2;
            obj.cancelFun=param3;
            obj.iconType=param4;
            obj.messType="confirm";
            this.renderHtml(obj);
        },
        renderHtml:function(obj){
            var strMaskHtml='<div style="position:fixed;left:0;top:0;width:100%;height:100%;background: #000;opacity: .2;"></div>';


            var iconType=obj.iconType|| "info";
            var position="";
            switch(iconType){
                case "info":position='background-position: 0 0;';break;
                case "success":position='background-position: -24px 0;';break;
                case "warn":position='background-position: -48px 0;';break;
                case "error":position='background-position: -72px 0;';break;
                default:position='background-position: 0 0;';
            }
            var message=obj.message || "";
            var strConHtml='<div><i style="display:inline-block;width:24px;height:24px;background-image:url(images/messageBackground.png);'+position+'vertical-align: middle;"></i><span style="margin:0 20px;display:inline-block;max-width: 300px;text-align: center;vertical-align: middle;">'+message+'</span><i style="font-style: normal;cursor: pointer;" id="messClose">X</i></div>';

            var strBtn=obj.messType;
            var btnGroup='<button style="background:#6cb5f4;border:1px solid #54a9f2;border-radius: 4px;padding:5px 12px;color:#fff;outline: none;cursor: pointer;margin:0 5px;" class="M_confirmBtn">确定</button>';
            if(strBtn==="confirm"){
                btnGroup+='<button style="background:#fff;border:1px solid #ccc;border-radius: 4px;padding:5px 12px;color:#000;outline: none;cursor: pointer;margin:0 5px;" class="M_cancelBtn">取消</button>';
            }
            var btnBoxHtml='<div style="text-align: center;margin-top:20px;">'+btnGroup+'</div>';

            var messBodyBoxHtml='<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);padding:15px 20px;background:#fff;border-radius: 7px;">'+
                strConHtml+btnBoxHtml+'</div>';

            var messHtml='<div class="M_messBox">'+strMaskHtml+messBodyBoxHtml+'</div>';
            $("body").append(messHtml);

            //点击x关闭提示框
            $("#messClose").click(function(){
                $(this).parents(".M_messBox").remove();
            });
            //确定按钮回调函数
            $(".M_confirmBtn").click(function(){
                var fun=obj.confirmFun || new Function();
                (fun)();
                $(this).parents(".M_messBox").remove();
            });
            //取消按钮回调函数
            $(".M_cancelBtn") && $(".M_cancelBtn").click(function(){
                var fun=obj.cancelFun || new Function();
                (fun)();
                $(this).parents(".M_messBox").remove();
            });

        }
    }
})()
