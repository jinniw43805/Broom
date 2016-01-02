$(document).ready(function() {
    noteDataBaseRegister=  (function() {
        var getExampleRef= function () {

            var ref = new Firebase('https://coconutdata.firebaseio.com/');
            // var hash = window.location.hash.replace(/#/g, '');
            // if (hash) {
            //     ref = ref.child(hash);
            // } else {
            //     ref = ref.push(); // generate unique location.
            //     window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
            // }
            // if (typeof console !== 'undefined')
            //     console.log('Firebase data: ', ref.toString());
            return ref;
        }
        var helloworld = function(){
            return "helloworld";
        }
        return{
            getExampleRef:getExampleRef,
            helloworld:helloworld
        };
    }());
    

    cocoPadRef = noteDataBaseRegister.getExampleRef();


    $('.RenderNote').click(function(event) {

        renderCheck.renderPad(this.id,'firepad-container');

    });
    testCourse2 = new EJS({url: 'views/dialog'}).render("123");

    $('#addNewCourseBtn').click(function(event) {
        CourseData = {
            name : "",
            ownerFBuid : userData.oauthID,
            ownerName: userData.name,
            member: [],
            created : ""
        }; 
        // var testCourse = new EJS({url: 'views/dialogs/addCourse'}).render(CourseData);
        console.log(CourseData);
        // var updateme= new EJS({url: 'views/dialogs/addCourse'}).update('deleteme','fuck');
        // var courseContainer = new EJS({url: 'views/dialogs/addCourse'}).render(CourseData);
        // console.log("courseContainer : "+courseContainer);
        // $('#dataDialog').empty();
        // $('#dataDialog').append(courseContainer);

        var ownerName = document.getElementById('AddCouserInputOwnerName');
        var ownerFBuid = document.getElementById('AddCouserInputOwnerFBuid');

        ownerName.value = CourseData.ownerName;
        ownerFBuid.value = CourseData.ownerFBuid;
        $('#addCourseModal').modal('toggle');
    }); 

    $('#addJoinCourseBtn').click(function(event) {
        var userID = userData.oauthID;

        var ownerFBuid = document.getElementById('JoinCouserInputOwnerFBuid');
        ownerFBuid.value = userID;
        $('#addJoinCourseModal').modal('toggle');

    });

    $('.CourseAddNote').click(function(event) {
        console.log("hello world:"+this.id);


        var courseID = document.getElementById('AddNoteInputCourseID');
        var courseName = document.getElementById("AddNoteInputCourseName");


        courseID.value = this.id;

        $('#addNoteModal').modal('toggle');
    });

    var init = (function(){
        var regDiaLoader = (function() {
            if(isRegCompletely===true){

            }else{
                console.log("showReg");
                $('#myModal').modal('toggle');
                // $('#example').tooltip(options)
            }
        }());

        var deHashFbBug = (function() {
                if (window.location.hash && window.location.hash == '#_=_') {
                    if (window.history && history.pushState) {
                        window.history.pushState("", document.title, window.location.pathname);
                    } else {
                        // Prevent scrolling by storing the page's current scroll offset
                        var scroll = {
                            top: document.body.scrollTop,
                            left: document.body.scrollLeft
                        };
                        window.location.hash = '';
                        // Restore the scroll offset, should be flicker free
                        document.body.scrollTop = scroll.top;
                        document.body.scrollLeft = scroll.left;
                    }
                }
        }());

        var noteHashProcess = (function() {
            var para = renderCheck.getHash();

            console.log("Hash is : "+renderCheck.getHash());
            console.log("Current Course is : "+JSON.stringify(CourseData,null,2));

            if(para===undefined){
                console.log("hash is undefined");
            }else{
                var flag = 0 ;

                //check own data
                for (var i = 0; i < CourseData.datas.ownCourses.length; i++) {
                    for (var j = 0; j < CourseData.datas.ownCourses[i].NoteData.length; j++) {
                        if(CourseData.datas.ownCourses[i].NoteData[j].noteID === para){
                            flag = 1 ;
                            break;
                        }
                    }
                    if(flag == 1 ){
                        break;
                    }
                }

                //check join data
                for (var i = 0; i < CourseData.datas.joinCourses.length; i++) {
                    for (var j = 0; j < CourseData.datas.joinCourses[i].NoteData.length; j++) {
                        if(CourseData.datas.joinCourses[i].NoteData[j].noteID === para){
                            flag = 1 ;
                            break;
                        }
                    }
                    if(flag == 1 ){
                        break;
                    }
                }

                if(flag === 1) {
                    console.log("find data");
                    // render 
                    renderCheck.renderPad(para,'firepad-container');


                }else{
                    console.log("not find data!!");
                    //
                    // alert("you dont have the right");
                    $.ajax({
                        url: '/isExistCourse',
                        type: 'POST',
                        dataType: 'json',
                        data: {noteid: para,
                            userid: userData.oauthID
                            }
                    })
                    .done(function(data) {
                        console.log("success");
                        console.log(data);
                        // window.location.reload();
                        var userID = userData.oauthID;
                        var courseID = data.data.courseId;
                        var ownerFBuid = document.getElementById('JoinCouserInputOwnerFBuid');
                        ownerFBuid.value = userID;
                        var joinCourseID = document.getElementById('joincourseId');
                        joinCourseID.value = courseID;
                        $('#addJoinCourseModal').modal('toggle');

                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                    });
                    
                }
            }

        })();



        //cocoPad init
        cocoPadRef = noteDataBaseRegister.getExampleRef();

        var states = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.whitespace,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          // `states` is an array of state names defined in "The Basics"
          local: ['淡江大學', '東海大學'
            ]
        });    
        $('#university').typeahead({
             hint: true,
              highlight: true,
              minLength: 1
            },
            {
            name: 'countries',
            source: states
        });


    }());
});

renderCheck = (function() {
    var getHash = function () {
        return window.location.hash.split('#')[1];
    }
    var renderPad = function (id,contain) {

        var noteID = id;
        var container = contain;

        cocoPadRef.path.o[0]= noteID ;
        //// Create CodeMirror (with lineWrapping on).

        // var container =document.getElementById('firepad-container'); 
        var container =document.getElementById(container); 

        container.innerHTML="";

        var codeMirror = CodeMirror(container, { lineWrapping: true });

        var cocopad = Firepad.fromCodeMirror(cocoPadRef, codeMirror,
        { richTextToolbar: true, richTextShortcuts: true });

        cocopad.on('ready', function() {
            if (cocopad.isHistoryEmpty()) {
                cocopad.setHtml(
                    '<span style="font-size: 24px;">Rich-text editing with <span style="color: red">cocopad!</span></span><br/>\n' +
                    '<br/>' +
                  '<div style="font-size: 18px">' +
                  'Supports:<br/>' +
                  '<ul>' +
                    '<li>Different ' +
                      '<span style="font-family: impact">fonts,</span>' +
                      '<span style="font-size: 24px;"> sizes, </span>' +
                      '<span style="color: blue">and colors.</span>' +
                    '</li>' +
                    '<li>' +
                      '<b>Bold, </b>' +
                      '<i>italic, </i>' +
                      '<u>and underline.</u>' +
                    '</li>' +
                    '<li>Lists' +
                      '<ol>' +
                        '<li>One</li>' +
                        '<li>Two</li>' +
                      '</ol>' +
                    '</li>' +
                    '<li>Undo / redo</li>' +
                    '<li>Cursor / selection synchronization.</li>' +
                    '<li><checkbox></checkbox> It supports customized entities.</li>' +
                    '<li>And it\'s all fully collaborative!</li>' +
                  '</ul>' +
                  '</div>');
            }
        });

        cocopad.registerEntity('checkbox', {
            render: function(info, entityHandler) {
                var inputElement = document.createElement('input');
                inputElement.setAttribute('type', 'checkbox');
                if (info.checked) {
                    inputElement.checked = 'checked';
                }
                inputElement.addEventListener('click', function() {
                    entityHandler.replace({
                        checked: this.checked
                    });
                });
                return inputElement;
            }.bind(this),
            fromElement: function(element) {
                var info = {};
                if (element.hasAttribute('checked')) {
                    info.checked = true;
                }
                return info;
            },
            update: function(info, element) {
                if (info.checked) {
                    element.checked = 'checked';
                } else {
                    element.checked = null;
                }
            },
            export: function(info) {
                var inputElement = document.createElement('checkbox');
                if (info.checked) {
                    inputElement.setAttribute('checked', true);
                }
                return inputElement;
            }
        });
            
    }
    return{
        getHash : getHash,
        renderPad : renderPad
    }
})();