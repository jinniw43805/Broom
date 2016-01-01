$(document).ready(function() {


    noteDataBaseRegister=  (function() {
        var getExampleRef= function () {

            var ref = new Firebase('https://coconutdata.firebaseio.com/');
            var hash = window.location.hash.replace(/#/g, '');
            if (hash) {
                ref = ref.child(hash);
            } else {
                ref = ref.push(); // generate unique location.
                window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
            }
            if (typeof console !== 'undefined')
                console.log('Firebase data: ', ref.toString());
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

    hello = function (){

    };

    $('.RenderNote').click(function(event) {
        console.log("are u call me ?"+this.id);

        cocoPadRef.path.o[0]= this.id ;
        //// Create CodeMirror (with lineWrapping on).

        var container =document.getElementById('firepad-container'); 

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

        //cocoPad init
        cocoPadRef = noteDataBaseRegister.getExampleRef();

    }());
});