/*chrome.tabs.query({active:true, currentWindow:true}, function(tab){
    console.log(tab[0].getElementsByTagName("p")[0]);
});
*/

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getEmails") {
      var arr_result = request.source;
      var text = '';
      arr_result.forEach(function(element) {
        text += element +'\n';
      });
      message.innerText = text;
    }
  });
  
  function onWindowLoad() {
  
    var message = document.querySelector('#message');
  
    chrome.tabs.executeScript(null, {
      file: "getEmails.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  
  }
  
  window.onload = onWindowLoad;
