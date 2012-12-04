window.addEventListener('load', function() {

  var input = document.querySelector('input[type=text]');
  var reception = document.querySelector('.reception');
  var face = document.querySelector('.face');
  var faceTag = '<embed src="/images/faceTag" width="200", height="250" />';
  var reg= new RegExp('((https?):\/\/[0-9a-zA-Z,;:~&=@_\'%?+\-\/\$.!*()#]+)','gi');
  document.querySelector('form').addEventListener('submit', function(e) {
    
    var req = new XMLHttpRequest();
    req.open('POST', '/talk');
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200) {
        var ans = JSON.parse(req.responseText);
        if(ans.glasses=='1'){
            switch(ans.face){
                case '0':
                    face.innerHTML = faceTag.replace("faceTag","default.swf");
                    break;
                case '1':
                    face.innerHTML = faceTag.replace("faceTag","ki.swf");
                    break;
                case '2':
                    face.innerHTML = faceTag.replace("faceTag","ai.swf");
                    break;
                case '3':
                    face.innerHTML = faceTag.replace("faceTag","kyou.swf");
                    break;
                case '4':
                    face.innerHTML = faceTag.replace("faceTag","do.swf");
                    break;
                default:
                    face.innerHTML = faceTag.replace("faceTag","default.swf");
                    break;
           }
       } else {
            switch(ans.face){
                case '0':
                    face.innerHTML = faceTag.replace("faceTag","default_g.swf");
                    break;
                case '1':
                    face.innerHTML = faceTag.replace("faceTag","ki_g.swf");
                    break;
                case '2':
                    face.innerHTML = faceTag.replace("faceTag","ai_g.swf");
                    break;
                case '3':
                    face.innerHTML = faceTag.replace("faceTag","kyou_g.swf");
                    break;
                case '4':
                    face.innerHTML = faceTag.replace("faceTag","do_g.swf");
                    break;
                default:
                    face.innerHTML = faceTag.replace("faceTag","default_g.swf");
                    break;
            }
        }
        var answer = ans.answer.replace(reg,'<a href=' + "$1"+ ' target="_blank">こちらよりご確認ください</a>');
        reception.innerHTML= answer;
        input.value = '';
      }
    };
    
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('input=' + encodeURIComponent(input.value));
    e.preventDefault();
  }, false);
  
  input.focus();

}, false);