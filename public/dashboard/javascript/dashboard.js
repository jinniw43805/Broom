$(document).ready(function() {

    var regDiaLoader = (function() {
        if(isRegCompletely===true){

        }else{
            console.log("showReg");
            $('#myModal').modal('toggle');
            $('#example').tooltip(options)

        }
    }());


    hello = function (){
        function init() {
          //// Initialize Firebase.
          var firepadRef = getExampleRef();
          // TODO: Replace above line with:
          // var firepadRef = new Firebase('<YOUR FIREBASE URL>');

          firepadRef.path.o[0]="-K6Z7eYU_ij57V0cW1C3"
          console.log(firepadRef.path.o[0]);


          //// Create CodeMirror (with lineWrapping on).
          var codeMirror = CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });

          //// Create Firepad (with rich text toolbar and shortcuts enabled).
          var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
              { richTextToolbar: true, richTextShortcuts: true });

          //// Initialize contents.
          firepad.on('ready', function() {
            if (firepad.isHistoryEmpty()) {
              firepad.setHtml(
                  '<span style="font-size: 24px;">Rich-text editing with <span style="color: red">Firepad!</span></span><br/>\n' +
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

          // An example of a complex custom entity.
          firepad.registerEntity('checkbox', {
            render: function (info, entityHandler) {
              var inputElement = document.createElement('input');
              inputElement.setAttribute('type', 'checkbox');
              if(info.checked) {
                inputElement.checked = 'checked';
              }
              inputElement.addEventListener('click', function () {
                entityHandler.replace({checked:this.checked});
              });
              return inputElement;
            }.bind(this),
            fromElement: function (element) {
              var info = {};
              if(element.hasAttribute('checked')) {
                info.checked = true;
              }
              return info;
            },
            update: function (info, element) {
              if (info.checked) {
                element.checked = 'checked';
              } else {
                element.checked = null;
              }
            },
            export: function (info) {
              var inputElement = document.createElement('checkbox');
              if(info.checked) {
                inputElement.setAttribute('checked', true);
              }
              return inputElement;
            }
          });
        }
        function getExampleRef() {
          var ref = new Firebase('https://firepad.firebaseio-demo.com');
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
        init();

    };  
});