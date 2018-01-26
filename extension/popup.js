/*chrome.tabs.query({active:true, currentWindow:true}, function(tab){
    console.log(tab[0].getElementsByTagName("p")[0]);
});
*/

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSchemas") {
      message.insertAdjacentHTML("beforeend", "<pre>" + JSON.stringify(request.source, null, 2) + "<pre>");
    }
  });
  
  function onWindowLoad() {
    var message = document.querySelector('#message');
    var array = ["Event","Organization","TouristAttraction"]
    chrome.tabs.executeScript(null, {
      code: 'var schemasName =' + JSON.stringify(array)
    });

    chrome.tabs.executeScript(null, {
      file: "getJSONFromMicrodata.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
}
  
  window.onload = onWindowLoad;
