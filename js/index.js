//新增商品浮层组件
var Dialog=React.createClass({
    //限制商品数量和单价只能输入数字,商品编码不能是汉字
    handleKeyUp:function(e){
        var text=$(e.target).attr("data-value");
        var value=$(e.target).val();
        if(text==="gPrice"){

            var $amountInput = $(e.target);
            //响应鼠标事件，允许左右方向键移动
            //event = window.event || event;
            if (e.keyCode == 37 || e.keyCode == 39) {
                return;
            }
            //先把非数字的都替换掉，除了数字和.
            $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
            //只允许一个小数点
                replace(/^\./g, "").replace(/\.{2,}/g, ".").
            //只能输入小数点后两位
                replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));

        }else if(text==="gCount"){
            $(e.target).val(value.replace(/\D/g,''));
        }else if(text==="gCodes"){
            $(e.target).val(value.replace(/\W/g,''));
        }
    },
    //商品单价如果最后一位是.将其移除
    handleBlur:function(e){
        var $amountInput = $(e.target);
        //最后一位是小数点的话，移除
        $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
    },


    handleChange:function(e){
        var text=$(e.target).attr("data-value");
        this.props.onUserInput(text,e.target.value);
    },
    handleConClick:function(e){
        e.preventDefault();
        var arr=this.props.goods,countArr=this.props.count;
        var obj={};
        obj.gcode=this.refs.D_gcode.value.trim();
        obj.gname=this.refs.D_gname.value.trim();
        obj.gdetails=this.refs.D_gdetails.value.trim();
        obj.price=this.refs.D_gprice.value.trim();
        obj.count=this.refs.D_gcount.value.trim();

        //验证
        if(obj.gcode===""){$.Message.Alert("商品编码不能为空","error");return;}
        if(obj.gname===""){$.Message.Alert("商品名称不能为空","error");return;}
        if(obj.price===""){$.Message.Alert("商品单价不能为空","error");return;}
        if(obj.count===""){$.Message.Alert("商品数量不能为空","error");return;}

        $.ajax({
            url:"json/addGoods.json",
            data:obj,
            dataType:"json",
            success:function(data){
                if(data.success){
                    arr.push(obj);
                    countArr.push(obj.count);
                    this.props.onUserSubmit(arr,countArr);
                    $.Message.Alert("新增商品成功",function(){
                        $(".J_diaContainer").hide(400);
                    },"success");
                }
            }.bind(this),
            error:function(){

            }
        });
    },
    handleCancelClick:function(e){
        e.preventDefault();
        $(".J_diaContainer").hide(400);
    },
    render:function(){
        return(
            <div className="J_diaContainer">
                <div style={{position:"fixed",left:0,top:0,width:"100%",height:"100%",background:"#000",opacity:"0.2"}}>
                </div>
                <div className="dislogCon">
                    <div className="disTit">新增商品</div>
                    <form action="">
                        <div className="goodsMessage-items">
                            <label for="">商品编码：</label>
                            <input type="text" value={this.props.gCodes} onChange={this.handleChange} data-value="gCodes" ref="D_gcode" onKeyUp={this.handleKeyUp}/>
                        </div>
                        <div className="goodsMessage-items">
                            <label for="">商品名称：</label>
                            <input type="text" value={this.props.gName} onChange={this.handleChange} data-value="gName" ref="D_gname"/>
                        </div>
                        <div className="goodsMessage-items">
                            <label for="">商品信息：</label>
                            <input type="text" value={this.props.gDetails} onChange={this.handleChange} data-value="gDetails" ref="D_gdetails"/>
                        </div>
                        <div className="goodsMessage-items">
                            <label for="">单价&yen;：</label>
                            <input type="text" value={this.props.gPrice} onChange={this.handleChange} data-value="gPrice" ref="D_gprice" onKeyUp={this.handleKeyUp} onBlur={this.handleBlur}/>
                        </div>
                        <div className="goodsMessage-items">
                            <label for="">数量：</label>
                            <input type="text" value={this.props.gCount} onChange={this.handleChange} data-value="gCount" ref="D_gcount" onKeyUp={this.handleKeyUp}/>
                        </div>
                        <div className="btnGroup">
                            <button className="confirmBtn" type="submit" onClick={this.handleConClick}>确定</button>
                            <button className="cancelBtn" onClick={this.handleCancelClick}>取消</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
});

var FormGoods=React.createClass({
    handleClick:function(){
        //show之前初始化 新增商品 表单数据
        this.props.onUserAdd();
        $(".J_diaContainer").show(400);
    },
    handleSearClick:function(e){
        e.preventDefault();
        var text=this.refs.D_search.value.trim();
        this.props.onUserSearch(text);
    },
    handleChange:function(e){
        var text=e.target.value;
        this.props.onUserSearchChange(text);
    },

    //搜索商品ul交互,input keyup事件,和focus事件
    exChangeShow:function(el){
        var value=el.val().trim();
        if(value){
            $("#listBox").show();
        }else{
            $("#listBox").hide();
        }
    },
    handleOnkeyup:function(e){
        this.exChangeShow($(e.target));
    },
    //搜索框单击事件
    handleSClick:function(event){
        event.cancelBubble=true;
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        //return false;也无效
        console.log(555);

    },
    //搜索框获得焦点的事件
    handleFocus:function(e){
        this.exChangeShow($(e.target));
    },
    //搜索框失去焦点的事件
    handleBlur:function(){
        //$("#listBox").hide();//如果失去焦点将其隐藏，则li无法选中，解决方法，绑在body的click事件上。但是react 又绑不上,只能另写一个script标签，放进去即可
    },
    //用户选择li的单击事件
    handleUChooseClick:function(e){
        var str=$(e.target).html();
        this.refs.D_search.value=str;
        $("#listBox").hide();
    },

    render:function(){
        var dataArr=[];
        var arr=this.props.goods;
        arr.map(function(goods){
            dataArr.push({gcode:goods.gcode,gname:goods.gname});
        });
        var lisArr=[],searVal=this.props.searVal;
        var reg=new RegExp(searVal,"ig");
        for(var i=0;i<dataArr.length;i++){
            for(var key in dataArr[i]){
                if(dataArr[i][key].search(reg)===-1){continue;}
                lisArr.push(<li key={dataArr[i][key]}>{dataArr[i][key]}</li>);
            }

        }
        return(
            <div className="form-part">
                <button ref="addGoods" onClick={this.handleClick}>新增商品</button>
                <form action="">
                    <input type="text" placeholder="请输入商品名称或商品编号" className="sercon" value={this.props.searVal} onChange={this.handleChange} ref="D_search" onKeyUp={this.handleOnkeyup}  onFocus={this.handleFocus} onBlur={this.handleBlur} id="D_search"/>
                    <input type="submit" value="搜索" className="searSub" onClick={this.handleSearClick}/>
                    <ul className="listBox" id="listBox" onClick={this.handleUChooseClick}>
                        {lisArr}
                    </ul>
                </form>
            </div>
        );
    }
});

var Pagination=React.createClass({
    handleClick:function(e){
        var elName=e.target.nodeName.toLowerCase();
        if(elName==="li"){
            var thisEl=$(e.target),clsName=thisEl.attr("data-value");

            var lis=$(this.refs.paginaUl).children(),currentI=lis.filter(".active").attr("data-index");
            var totalPage=this.props.totalPage;

            if(clsName==="J_pageList"){
                lis.removeClass("active");
                thisEl.addClass("active");

                var i=thisEl.attr("data-index");
                $("#tableBox>tbody").addClass("fn-hide");
                $("[data-page="+i+"]").removeClass("fn-hide");

                //如果点击的是第一页，将上一页隐藏掉
                if(i==="1"){
                    lis.eq(0).hide();
                }else{
                    lis.eq(0).show();
                }

                //如果点击的是最后一页，将下一页隐藏掉
                if(i==totalPage){
                    lis.eq(parseInt(totalPage)+1).hide();
                }else{
                    lis.eq(parseInt(totalPage)+1).show();
                }

            }else if(clsName==="J_previous"){
                //点击上一页
                if(currentI>1){
                    lis.eq(currentI-1).trigger("click");
                }
            }else if(clsName==="J_next"){
                //点击下一页
                if(currentI<totalPage){
                    var index=parseInt(currentI)+1;
                    lis.eq(index).trigger("click");
                }
            }
        }
    },
    render:function(){
        var arr=[];
        for(var i=1;i<=this.props.totalPage;i++){
            if(i===1){
                arr.push(<li key={i} data-index={i} className="active" data-value="J_pageList">{i}</li>)
            }else{
                arr.push(<li key={i} data-index={i} data-value="J_pageList">{i}</li>)
            }
        }
        var pArr=[],nArr=[];
        if(this.props.totalPage>this.props.perPageCount){
            pArr.push(<li data-value="J_previous" className="fn-hide" key="J_previous">上一页</li>);
            nArr.push(<li data-value="J_next" key="J_next">下一页</li>);
        }else{
            arr=[];
        }
        return(
            <div className="paginationBox">
                <ul onClick={this.handleClick} ref="paginaUl">
                    {pArr}
                        {arr}
                    {nArr}
                </ul>
            </div>
        );

    }
});
var Tablelist=React.createClass({
    cancelGoods:function(e){
        var self=this;
        var arr=this.props.goods,cArr=this.props.count;
        var codeText=$(e.target).parent('td').siblings(".J_gcode").html();
        $.Message.Confirm("您确认要删除该商品吗？",function(){
            var obj={"gcode":codeText};
            $.ajax({
                url:"json/addGoods.json",
                data:obj,
                dataType:"json",
                success:function(data){
                    if(data.success){
                        //删除数组中对应的商品编号
                        var goodsArr=[],countArr=[];
                        var index=-1;
                        for(var i=0;i<arr.length;i++){
                            if(arr[i].gcode===obj.gcode){
                                index=i;
                                break;
                            }
                        }
                        if(index>-1){
                            goodsArr=arr.slice(0,index).concat(arr.slice(index+1,arr.length));
                            countArr=cArr.slice(0,index).concat(cArr.slice(index+1,cArr.length));
                        }
                        self.props.onUserCancel(goodsArr,countArr);
                        $.Message.Alert("删除成功","success");
                    }
                }.bind(this),
                error:function(){

                }
            });
        },function(){},"info");

    },

    //商品数量不允许输入数字以外的字符
    handleKeyup:function(e){
        var val=$(e.target).val();
        $(e.target).val(val.replace(/\D/g,''));
    },
    //商品数量input chang事件回调
    onUserCount:function(e){
        var text=e.target.value;
        var index=$(e.target).attr("data-index");
        this.props.onUserCountChange(text,index);
    },
    //加减商品数量回调函数
    handleAutoCount:function(e){
        var auto=$(e.target).attr("data-auto");
        var index=$(e.target).parent("td").attr("data-index")
        var value=$(e.target).siblings(".J_autoCount").val();
        if(auto==="+"){
            ++value;
            value>99 &&(value=99);
        }else if(auto==="-"){
            --value;
            value<0 && (value=0);
        }
        var countArr=this.props.count,arr=this.props.goods;
        countArr[index]=value;
        arr[index].count=value;
        this.props.onUserAutoInp(arr,countArr);
    },

    //修改商品信息交互
    handleEditDetails:function(e){
        var thisEl=$(e.target);
        thisEl.next().toggle();
    },
    //修改商品 点击取消事件
    handleEditCancel:function(e){
        var thisEl=$(e.target);

        //点击取消将textArea框置为原来的信息
        var text=thisEl.parents(".J_editBox").siblings(".J_detailsInner").html();
        thisEl.parent().prev().children("textarea").val(text);

        thisEl.parents(".J_editBox").hide();
    },
    //修改商品 点击确定回调函数
    handleEditOk:function(e){
        var thisEl=$(e.target),
            text=thisEl.parent().prev().children("textarea").val(),
            index=thisEl.parents("tr").attr("data-index"),
            goodsArr=this.props.goods;
        goodsArr[index].gdetails=text;
        this.props.onUserEditDetails(goodsArr);
        thisEl.parents(".J_editBox").hide();
    },


    render:function(){
        var self=this;
        var goodsList=[],goodsArr=this.props.goods;
        var filterText=this.props.filterText;
        goodsArr.map(function(goods,index){
            if(goods.gcode.indexOf(filterText)===-1 && (goods.gname.indexOf(filterText)===-1)){
                return;
            }
            var substotal=goods.price*goods.count;
            goodsList.push(
                <tr key={goods.gcode} data-index={index}>
                    <td className="J_gcode">{goods.gcode}</td>
                    <td>{goods.gname}</td>
                    <td className="goods-details">
                        <div className="goods-details-inner J_detailsInner" title={goods.gdetails}>{goods.gdetails}</div>
                        <span className="edit" onClick={self.handleEditDetails}>修改</span>
                        <div className="editBox J_editBox">
                            <div className="textareaBox">
                               <textarea name="" id="" cols="30" rows="10" defaultValue={goods.gdetails} maxLength="1000">
                                </textarea>
                            </div>
                            <div className="editBoxBtn">
                                <a href="javascript:;" className="okBtn" onClick={self.handleEditOk}>确定</a>
                                <a href="javascript:;" className="cancelBtn" onClick={self.handleEditCancel}>取消</a>
                            </div>
                        </div>
                    </td>
                    <td><span>&yen;</span>{goods.price}</td>
                    <td data-index={index}>
                        <a className="autoCount reduce" href="javascript:;" data-auto="-" onClick={self.handleAutoCount}>-</a>
                        <input type="text" className="count J_autoCount" value={self.props.count[index]} onChange={self.onUserCount} data-index={index} maxLength="2" onKeyUp={self.handleKeyup}/>
                        <a className="autoCount add" href="javascript:;" data-auto="+" onClick={self.handleAutoCount}>+</a>
                    </td>
                    <td>{substotal.toFixed(2)}</td>
                    <td>
                        <span className="delete" onClick={self.cancelGoods}>删除</span>
                    </td>
                </tr>
            )
        });

        var perPageCount=5;
        var totalPage=parseInt((goodsList.length+(perPageCount-1))/perPageCount);

        //console.log(goodsList);
        //遍历goodsList，将其 perPageCount 为一组放在一个tbody中。push到pageGLArr中。
        var pageGLArr=[]; var n=0;//n用来控制当前到第几页了。
        if(goodsList.length>perPageCount){
            //如果总条数大于每页的个数
            for(var i=0;i<goodsList.length;i++){
                if((i+1)%perPageCount===0){
                    ++n;
                    var newTelArr=[];
                    for(var j=1;j<=perPageCount;j++){
                        newTelArr.push(goodsList[i-j+1]);
                    }
                    if(n===1){
                        pageGLArr.push(
                            <tbody data-page={n} key={n}>
                            {newTelArr}
                            </tbody>
                        );
                    }else{
                        pageGLArr.push(
                            <tbody data-page={n} className="fn-hide" key={n}>
                            {newTelArr}
                            </tbody>
                        );
                    }

                }
            }

            //判断总的条数/perPageCount是否有余数，如果有余数pageGLArr继续push剩余的。
            var yu=goodsList.length%perPageCount;
            var z=parseInt(goodsList.length/perPageCount);//取整
            if(yu>0){
                ++n;
                var telArr=[];
                for(var i=perPageCount*z;i<=perPageCount*z+yu-1;i++){
                    telArr.push(goodsList[i]);
                }
                pageGLArr.push(
                    <tbody data-page={n} className="fn-hide" key={n}>
                    {telArr}
                    </tbody>
                )
            }
        }else{
            //如果总条数小于每页的个数
            ++n;
            var telArr=[];
            for(var i=0;i<goodsList.length;i++){
                telArr.push(goodsList[i]);
            }
            pageGLArr.push(
                <tbody data-page={n} key={n}>
                    {telArr}
                </tbody>
            );
        }


        return(
            <div className="table-part">
                <table id="tableBox">
                    <thead>
                        <tr>
                            <th>商品编码</th>
                            <th>商品名称</th>
                            <th>商品信息</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    {pageGLArr}
                </table>
                <Pagination totalPage={totalPage} perPageCount={perPageCount}/>
            </div>
        );
    }
});



var Shopping=React.createClass({
    getInitialState:function(){
        return{
            goods:[],

            count:[],


            searVal:"",
            filterText:"",

            gCodes:"",
            gName:"",
            gDetails:"",
            gPrice:"",
            gCount:1
        }
    },

    handleUserInput:function(text,value){
        switch (text){
            case "gCodes":this.setState({gCodes:value});break;
            case "gName":this.setState({gName:value});break;
            case "gDetails":this.setState({gDetails:value});break;
            case "gPrice":this.setState({gPrice:value});break;
            case "gCount":this.setState({gCount:value});break;
        }
    },
    onUserAdd:function(){
        this.setState({
            gCodes:"",
            gName:"",
            gDetails:"",
            gPrice:"",
            gCount:1
        })
    },

    //表格中 商品数量 input change事件
    onUserCountChange:function(text,index){
        var count=this.state.count;
        var goods=this.state.goods;
        count[index]=text;
        goods[index].count=text;
        this.setState({count:count,goods:goods});
    },
    setStateCommone:function(goodsArr,countArr){
        //抽出的公共方法
        //浮层中新增商品点击确定逻辑
        //表格中删除商品的业务逻辑
        //表格中商品数量加减逻辑
        this.setState({goods:goodsArr,count:countArr});
    },

    //表格中修改商品信息回调函数
    onUserEditDetails:function(goodsArr){
        this.setState({goods:goodsArr});
    },

    //搜索商品input框change事件
    onUserSearchChange:function(text){
        this.setState({searVal:text});
    },
    //搜索商品按钮业务逻辑
    onUserSearch:function(text){
        this.setState({filterText:text});
    },

    componentDidMount:function(){
        $.ajax({
            url:this.props.url,
            dataType:'json',
            cache:false,
            success:function(data){
                this.setState({goods:data});
                var arr=[];
                data.map(function(goods){
                    arr.push(goods.count);
                });
                this.setState({count:arr});
            }.bind(this),
            error:function(){

            }
        });
    },
    render:function(){
        return(
            <div>
                <FormGoods onUserAdd={this.onUserAdd} searVal={this.state.searVal} onUserSearchChange={this.onUserSearchChange} onUserSearch={this.onUserSearch} goods={this.state.goods}/>
                <Tablelist goods={this.state.goods} onUserCancel={this.setStateCommone} onUserEditCount={this.onUserEditCount} filterText={this.state.filterText} count={this.state.count} onUserCountChange={this.onUserCountChange} onUserAutoInp={this.setStateCommone} onUserEditDetails={this.onUserEditDetails}/>
                <Dialog gCodes={this.state.gCodes} gName={this.state.gName} gDetails={this.state.gDetails} gPrice={this.state.gPrice} gCount={this.state.gCount} onUserInput={this.handleUserInput} onUserSubmit={this.setStateCommone} goods={this.state.goods} count={this.state.count}/>
            </div>
        );
    }
});

ReactDOM.render(<Shopping url="json/goods.json"/>,$("#container").get(0));

