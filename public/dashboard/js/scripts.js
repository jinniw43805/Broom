$(function() {
    "use strict";
    $(function() {
            $(".preloader").fadeOut();
        }),

        jQuery(document).on("click", ".mega-dropdown", function(i) {
            i.stopPropagation();
        });


    var i = function() {
        (window.innerWidth > 0 ? window.innerWidth : this.screen.width) < 1170 ? ($("body").addClass("mini-sidebar"),
            $(".navbar-brand span").hide(), $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible"),
            $(".sidebartoggler i").addClass("ti-menu")) : ($("body").removeClass("mini-sidebar"),
            $(".navbar-brand span").show());
        var i = (window.innerHeight > 0 ? window.innerHeight : this.screen.height) - 1;
        (i -= 70) < 1 && (i = 1), i > 70 && $(".page-wrapper").css("min-height", i + "px");
    };


    $(window).ready(i), $(window).on("resize", i), $(".sidebartoggler").on("click", function() {
            $("body").hasClass("mini-sidebar") ? ($("body").trigger("resize"), $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible"),
                $("body").removeClass("mini-sidebar"), $(".navbar-brand span").show()) : ($("body").trigger("resize"),
                $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible"),
                $("body").addClass("mini-sidebar"), $(".navbar-brand span").hide());
        }),



        $(".fix-header .header").stick_in_parent({}), $(".nav-toggler").click(function() {
            $("body").toggleClass("show-sidebar"), $(".nav-toggler i").toggleClass("mdi mdi-menu"),
                $(".nav-toggler i").addClass("mdi mdi-close");
        }),



        $(".search-box a, .search-box .app-search .srh-btn").on("click", function() {
            $(".app-search").slideToggle(200);
        }),



        $(".floating-labels .form-control").on("focus blur", function(i) {
            $(this).parents(".form-group").toggleClass("focused", "focus" === i.type || this.value.length > 0);
        }).trigger("blur"), $(function() {
            for (var i = window.location, o = $("ul#sidebarnav a").filter(function() {
                    return this.href == i;
                }).addClass("active").parent().addClass("active");;) {
                if (!o.is("li")) break;
                o = o.parent().addClass("in").parent().addClass("active");
            }
        }),

        $(function() {
            $("#sidebarnav").metisMenu();
        }),

        $(".scroll-sidebar").slimScroll({
            position: "left",
            size: "5px",
            height: "100%",
            color: "#dcdcdc"
        }),

        $(".message-center").slimScroll({
            position: "right",
            size: "5px",
            color: "#dcdcdc"
        }),

        $(".aboutscroll").slimScroll({
            position: "right",
            size: "5px",
            height: "80",
            color: "#dcdcdc"
        }),

        $(".message-scroll").slimScroll({
            position: "right",
            size: "5px",
            height: "570",
            color: "#dcdcdc"
        }),

        $(".chat-box").slimScroll({
            position: "right",
            size: "5px",
            height: "470",
            color: "#dcdcdc"
        }),

        $(".slimscrollright").slimScroll({
            height: "100%",
            position: "right",
            size: "5px",
            color: "#dcdcdc"
        }),



        $("body").trigger("resize"), $(".list-task li label").click(function() {
            $(this).toggleClass("task-done");
        }),



        $("#to-recover").on("click", function() {
            $("#loginform").slideUp(), $("#recoverform").fadeIn();
        }),



        $('a[data-action="collapse"]').on("click", function(i) {
            i.preventDefault(), $(this).closest(".card").find('[data-action="collapse"] i').toggleClass("ti-minus ti-plus"),
                $(this).closest(".card").children(".card-body").collapse("toggle");
        }),



        $('a[data-action="expand"]').on("click", function(i) {
            i.preventDefault(), $(this).closest(".card").find('[data-action="expand"] i').toggleClass("mdi-arrow-expand mdi-arrow-compress"),
                $(this).closest(".card").toggleClass("card-fullscreen");
        }),



        $('a[data-action="close"]').on("click", function() {
            $(this).closest(".card").removeClass().slideUp("fast");
        });


        //console.log("helloworld")
});
var roomStatus = [];
var submitInfo = [];
var recordBitArray = [];
var currentDate = "";

$(document).ready(function() {

    //Custom javascripts
    //
    var limitCount = 4;
    var count = 0;
    var rowIdCollector = [];
    var renderRoomStatus = (function() {
        var table = $('#example23').DataTable({
            dom: 'Bfrtip',
            ordering: false,
            select: {
                style : 'os',
                items: 'cell'
            },
            buttons: [
                'copy', 'csv',  'print'
            ]
        });

      $.post( "/getAllRoomStatus", function( data ) {
        //$( ".result" ).html( data );
        roomStatus = data
        console.log(data)
        tableHead();
        var date = new Date();
        currentDate = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()));

        // for(var i = 0; i< data.length; i++){

        // }
        data.forEach(function(room){
            var appendRow = '<tr><td class="notClickAble" id="'+room.data[0]._id+'">'+room.data[0].roomLocation+" "+room.data[0].roomNumber+'</td>'
            rowIdCollector.push(room.data[0].info);
            room.data[0].occupys.forEach(function(element){
                console.log(element.date);
                console.log(currentDate);
                if(element.date == currentDate){
                    // append
                    var subrecordBitArray = {
                        'date': element.data,
                        'oStatus' : element.oStatus,
                        'roomId' : element._id,
                        'motherRoomId' : room.data[0]._id
                    }

                    recordBitArray.push(subrecordBitArray);

                    for(var i = 0; i < element.oStatus.length; i++){
                        appendRow = appendRow + '<td motherRoomId="'+room.data[0]._id+'" '+'roomId="' + element._id + '" hourBit="'+i+'">' + element.oStatus[i] + '</td>';
                    }
                    console.log(typeof(element.oStatus[0]));
                    // element.oStatus = "111111111111111";
                    // table.row.add( {

                    //     sevenToEight : "hello",
                    //     eightToNine : "world",
                    //     // "9-10" : element.oStatus[2],
                    //     // "10-11" : element.oStatus[3],
                    //     // "11-12" : element.oStatus[4],
                    //     // "12-13" : element.oStatus[5],
                    //     // "13-14" : element.oStatus[6],
                    //     // "14-15" : element.oStatus[7],
                    //     // "15-16" : element.oStatus[8],
                    //     // "16-17" : element.oStatus[9],
                    //     // "17-18" : element.oStatus[10],
                    //     // "18-19" : element.oStatus[11],
                    //     // "19-20" : element.oStatus[12],
                    //     // "20-21" : element.oStatus[13],
                    //     // "21-22" : element.oStatus[14],
                    // }).draw();

                }
            })  
            appendRow = appendRow + '/tr>';

            $("#tableBody").append(appendRow);

        })
        var isMouseDown = false,
        isHighlighted;
        $("#myTable td")
        .mousedown(function () {
            if($(this).hasClass("notClickAble")){
                console.log("not Clickable")
                return false;
            }
            else{
                isHighlighted = $(this).hasClass("highlighted");
                if(isHighlighted){
                    console.log("cancel this one")
                    isMouseDown = true;
                    $(this).toggleClass("highlighted");
                    count -= 1;

                    for(var i = 0; i<recordBitArray.length; i++){
                        if(recordBitArray[i].motherRoomId == $(this).attr('motherroomid')){
                            recordBitArray[i].oStatus = recordBitArray[i].oStatus.replaceAt(parseInt($(this).attr('hourBit')),"0")
                        }
                    }
                    // remove(submitInfo, {
                    //     'roomId' : $(this).attr('roomId'),
                    //     'hourBit' : $(this).attr('hourBit')   
                    // })
                    for(var i = 0; i < submitInfo.length; i++){
                        if(submitInfo[i].roomId == $(this).attr('roomId') && submitInfo[i].hourBit == $(this).attr('hourBit')){
                            console.log("find remove index");
                            submitInfo.splice(i, 1);

                        }
                    }

                }else{
                    console.log("try to add");
                    if(count == limitCount){
                        return false;
                    }else{
                        // Add success
                    isMouseDown = true;
                    $(this).toggleClass("highlighted");
                    count += 1;

                    addInfo = {
                        'roomId' : $(this).attr('motherroomid'),
                        'hourBit' : $(this).attr('hourBit'),
                        'motherRoomId' : $(this).attr('motherroomid')
                    }

                    submitInfo.push(addInfo);

                    console.log($(this).attr('motherroomid'))
                    for(var i = 0; i<recordBitArray.length; i++){
                        if(recordBitArray[i].motherRoomId == $(this).attr('motherroomid')){
                            recordBitArray[i].oStatus = recordBitArray[i].oStatus.replaceAt(parseInt($(this).attr('hourBit')),"1")
                        }
                    }
                    
                    }

                    // if(recordBitArray.length == 0){
                    //     newObj = {

                    //     }
                    // }
                
                }
                return false;
            }
        })
        .mouseover(function () {
          if (isMouseDown) {
            $(this).toggleClass("highlighted", isHighlighted);
          }
        });

        $(document)
        .mouseup(function () {
          isMouseDown = false;
        });

        function tableHead(){
            var appendHead = '<tr><th>Name</th>'
            for (var i = 7; i < 22; i++) {
                appendHead = appendHead + '<th>' + i + '-' + (i + 1) + '</th>'
                
            }
            appendHead = appendHead + '</tr>';
            $("#tableHead").append(appendHead);

        }
        function insertRoomDetail(rowIdCollector){
            rowIdCollector.forEach(function(element){

            })
        }

        function remove(array, element) {
            const index = array.indexOf(element);
            
            if (index !== -1) {
                array.splice(index, 1);
            }
        }
      });

    }());
    




    $("#submitBtn").click(function(err){
        console.log("send info to db");
        // obj = {
        //     ""
        // }
        console.log("getCookie")
        // console.log(getCookie('userName'))
        // userName = getCookie('userName')
        data = {
            "username" : username,
            "submitInfo" : submitInfo
        }

        console.log(data)

        //  $.post("/addUserRecord",
        //     data: JSON.stringify(data),
        //     // , contentType: 'application/json'
        //     // , dataType: 'json',

        //     function(data, status){
        //         // alert("Data: " + data + "\nStatus: " + status);
        //         console.log("return:"+data);
        // });
    // $.post("demo_test_post.asp",
    // {
    //     name: "Donald Duck",
    //     city: "Duckburg"
    // },
    // function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });
// Calculate changed bit total
// based on roomstatus
// 
        roomStatus.forEach(function(element){
            var roomOstatus = "";
            element.data[0].occupys.forEach(function(time){
                if(time.data == currentDate){
                    console.log(currentDate)
                    roomOstatus = time.oStatus  
                }
            })

            submitInfo.forEach(function(element2){
                if(element2.motherRoomId == element.data[0]._id){
                    roomOstatus[element2.hourBit] = "1"
                }
            })

            console.log(roomOstatus);
        })


// see who needs the result
        submitInfo.forEach(function(element){
            recordBitArray.forEach(function(element2){
                if(element2.motherRoomId == element.motherRoomId){
                    element.totalBit = element2.oStatus
                }
            })
        })


        submitInfo.forEach(function(element){

            // findroomID

            console.log(element.totalBit);
            $.post("/addUserRecord",
            {
                username: username,
                roomId: element.roomId,
                hourBit: element.hourBit,
                date: currentDate,
                totalBit : element.totalBit

            },
            function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
            });
        })
    });

});

function getCookie(cname) {
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
}
return "";
}


String.prototype.replaceAt=function(index, char) {return this.substr(0, index) + char + this.substr(index+char.length);}

