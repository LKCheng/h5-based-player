Namespace.register("U.Control.video");   


U.Control.video = (function () {

    //VIO 主函数
    var VIO, _VO = function (OPT) {
        return new VIO.init(OPT);
    }

    VIO = _VO.prototype = {

        // 初始化函数
        init: function (OPT) {
            this.config(OPT);
            this.Lview();
        },

        // 配置文件
        config: function (OPT) {
            this.width = OPT.width || ""; this.height = OPT.height || ""; this.src = OPT.src || underfind; this.play = OPT.autoplay || false;
            this.tool = OPT.controls || false; this.pos = OPT.pos || $("body"); this.time = 1;
        },

        //播放器视图
        Lview: function () {

            var _this = this;
            var vstorage, vbox, vbar, vplay, vpause, vreplay, vprogem, vprogfp, vtime, vstime, vetime, vshu, vsound, vsoundpb, vsoundem, vsoundfp, vfull;


            vbox = $$("div", { "className": "vbox" }, this.pos);
            this.elm = $$("video", { "src": this.src, "controls": this.tool, "height": "1px", "autoplay": this.play, "width": "1px" }, vbox);

            var o = this.Oapi();

            vbar = $$("div", { "className": "vbar" }, vbox);
            vplay = $$("div", { "className": "vicon vplay", "onclick": [[o.play]] }, vbar);
            vreplay = $$("div", { "className": "vicon vreplay", "onclick": [[o.replay]] }, vbar);
            this.vprog = $$("div", { "className": "vicon vprog" }, vbar);
            vprogem = $$("div", { "className": "vprogem" }, this.vprog);
            vprogfp = $$("div", { "className": "vicon vprogfp" }, vprogem);
            vtime = $$("div", { "className": "vtime" }, vbar);
            vstime = $$("span", { "className": "vstime", "innerHTML": "00:00" }, vtime);
            vshu = $$("span", { "className": "vshu", "innerHTML": "/" }, vtime);
            vetime = $$("span", { "className": "vetime", "innerHTML": "04:10" }, vtime);
            vsound = $$("div", { "className": "vicon vsound" }, vbar);
            vsoundpb = $$("div", { "className": "vsoundpb" }, vbar);
            vsoundem = $$("div", { "className": "vsoundem" }, vsoundpb);
            vsoundfp = $$("div", { "className": "vicon vsoundfp" }, vsoundem);
            vfull = $$("div", { "className": "vicon vfull" }, vbar);

            a = this.AFun();
            a.ratioVideo(this.elm, this.width, this.height, vbox, vfull);   //视频加载
            o.metadata(vstime, vetime, vprogem);                            //加载视频状态
            o.scheduleRef(this.vprog, 1);                                   //进度条功能
            o.scheduleRef(vsoundpb, 2);                                     //声音功能

        },


        AFun: function () {

            var _this = this;
            var time = null, time2 = null, canvas = null, inbox = 0, eX, eY, aX, aY, n = 0, m = 0;

            //绘制画布
            var drawVideo = function (ELMC, ELM, EW, EH) {
                var content = ELMC.getContext("2d");
                clearInterval(time);
                time = setInterval(function () { content.drawImage(ELM, 0, 0, EW, EH); }, 20);
            }

            //视频比例
            var ratioVideo = function (ELM, EWH, EHI, EVB, EFULL) {
                var cw = $("body").width(), bw = window.screen.width;
                var ch = $("body").height(), bh = window.screen.height;

                U.M.AddEvent("loadedmetadata", ELM, function () {

                    var gw = 0, gh = 0, gv = 0;
                    var w = _this.otime = this.videoWidth;   //426
                    var h = this.videoHeight;  //240 
                    var p = h / w;     //比例  0.56

                    //如果只给了宽
                    if (EWH && EHI == "") {
                        EWH >= cw ? (gw = cw, gh = ch) : (gw = EWH, gh = gw * p);
                    }

                    //如果只给了高
                    if (EHI && EWH == "") {
                        EHI >= ch ? (gh = ch, gw = cw) : (gh = EHI, gw = gh / p);
                    }

                    //如果给了宽高  
                    if (EWH && EHI) {

                        //如果宽大。。250   比例是  0.58
                        //如果高大。。436   比例是  0.55

                        gh = EHI; gw = gh / p;

                        if (gh >= ch) {
                            gh = ch;
                            gw = gh / p;
                        }

                        if (gw >= cw) {
                            gw = cw;
                            gh = gw * p;
                        }
                    }

                    if (EWH == "" && EHI == "") {
                        gw = 300; gh = 300;
                    }


                    if (gw >= 1000) {
                        gv = (gw - 1000) / 100;
                        $(_this.vprog).css({ "width": 55 + gv + "%" });
                    } else {
                        gv = (1000 - gw) / 25;
                        $(_this.vprog).css({ "width": 55 - gv + "%" });
                    }

                    $(EVB).css({ "width": gw + "px", "height": gh + "px" });         //大框

                    if (!$("canvas")[0]) {
                        canvas = $$("canvas", { "width": gw, "height": gh }, EVB);       //canvas
                    } else {
                        canvas = $("canvas");
                    }

                    drawVideo(canvas, ELM, gw, gh);

                    EFULL.onclick = function () {
                        if (m % 2 == 0) {
                            gv = (bw - 1000) / 100;
                            $(_this.vprog).css({ "width": 55 + gv + "%" });
                            $(EVB).css({ "width": bw + "px", "height": bh + "px" }); canvas.width = bw; canvas.height = bh;
                            drawVideo(canvas, ELM, bw, bh);
                            U.M.fullScreen(EVB);
                        } else {
                            gv = (gw - 1000) / 100;
                            $(_this.vprog).css({ "width": 55 + gv + "%" });
                            $(EVB).css({ "width": gw + "px", "height": gh + "px" }); canvas.width = gw; canvas.height = gh;
                            drawVideo(canvas, ELM, gw, gh);
                            document.webkitCancelFullScreen();
                        }
                        m++;
                    }


                    U.M.AddEvent("mousemove", EVB, function (e) {
                        eX = e.clientX;
                        eY = e.clientY;
                        if (aX != eX && aY != eY) {
                            inbox = 1;
                            $(".vbar").show();
                        }
                    })

                    U.M.AddEvent("mouseover", EVB, function (e) {
                        time2 = setInterval(function () {
                            aX = eX;
                            aY = eY;
                            if (inbox == 0) {
                                $(".vbar").hide();
                            }
                            inbox = 0;
                        }, 3000);

                    })
                    U.M.AddEvent("mouseout", EVB, function () {
                        clearInterval(time2);
                    })
                });
            }

            return {
                drawVideo: drawVideo,    //绘制画布
                ratioVideo: ratioVideo
            }

        },

        //视频播放api
        Oapi: function () {

            var _this = this, n = 0;

            //可播放的类型
            var type = { "ogg": 'video/ogg; codecs="theora, vorbis"', "mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', "webm": 'audio/webm; codecs="vorbis"' };

            //转换分
            var timeStom = function (TIME) {
                var m = Math.floor(TIME / 60);
                m < 10 && (m = '0' + m);
                return m + ':' + (TIME % 60 / 100).toFixed(2).slice(-2);
            }

            //元数据事件
            var metadata = function (SVUl, EVUl, VEM) {
                U.M.AddEvent("timeupdate", _this.elm, function () {
                    $(SVUl)[0].innerHTML = timeStom(this.currentTime);
                    $(VEM).css('width', this.currentTime / this.duration * 100 + "%");
                });
                U.M.AddEvent("loadedmetadata", _this.elm, function () {
                    $(EVUl)[0].innerHTML = timeStom(this.duration);
                    this.volume = 0.5;
                });
            };

            //更改数据
            var updatabar = function (ELM, SHIF, snum) {
                var endtime = _this.elm.duration;
                var postion = SHIF - U.M.GetElementInfo(ELM).BCRL;
                var percent = postion / $(ELM).width() * 100;
                percent >= 100 ? percent = 100 : (percent <= 0 ? percent = 0 : percent = percent);
                $(ELM.childNodes).css("width", percent + "%");
                if (snum == 1) {
                    _this.elm.currentTime = endtime * percent / 100;
                } else {
                    _this.elm.volume = percent / 100;
                }
            }

            //进度调整
            var scheduleRef = function (ELM, SEL) {
                var state = false, snum;
                SEL == 1 ? snum = 1 : snum = 2;
                U.M.AddEvent("mousedown", ELM, function (e) {
                    state = true; updatabar(ELM, e.pageX, snum);
                });
                U.M.AddEvent("mouseup", document, function (e) {
                    if (state) { state = false; updatabar(ELM, e.pageX, snum); }
                });
                U.M.AddEvent("mousemove", document, function (e) {
                    if (state) { updatabar(ELM, e.pageX, snum); }
                });
            }

            //播放速度
            var backRate = function (UVE) {
                return _this.elm.playbackRate = UVE;
            }

            /* 是否可以播放
            *  apply: probably  and maybe 
            *  "" 空串表示不支持
            */
            var isPaly = function (UTF, UDOD) {
                return _this.elm.canPlayType(type[UTF.toLowerCase()]);
            }

            var play = function () {
                if (n % 2 == 0) {
                    _this.elm.play();
                    $(this).removeClass("vplay").addClass("vpause");
                } else {
                    pause();
                    $(this).removeClass("vpause").addClass("vplay");
                }
                n++;

            }

            var pause = function () {
                _this.elm.pause();

            }

            var load = function () {
                _this.elm.load();

            }

            var replay = function () {
                _this.elm.currentTime = 0;
            }

            var canPlayType = function () {
                if (_this.elm.canPlayType) { return true; } else { return false; }
            }

            //全屏
            var full = function (CLM) {
                U.M.fullScreen(CLM);
            }

            var exitfull = function (a) {
                U.M.fullScreen(true);
            }

            return {
                play: play,                                                //播放
                pause: pause,                                              //暂停
                load: load,                                                //重新加载视频元素 
                replay: replay,                                            //重播
                backRate: backRate,                                       //速度
                canPlayType: canPlayType,                                 //判断是否支持浏览器 
                isPaly: isPaly,                                           //判断是否可以播放
                full: full,                                                //是否全屏
                exitfull: exitfull,
                metadata: metadata,                                        //视频长度
                scheduleRef: scheduleRef                                  //调整进度  

            };
        }
    }

    VIO.init.prototype = VIO; return _VO;

})();



