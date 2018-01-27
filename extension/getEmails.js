function DOMtoString(document_root) {
    var arrEmails = [];
    var node = document_root.firstChild;
    var html='';
    var all = document_root.getElementsByTagName("*");
    var ok=0;
    
    for (var i=0, max=all.length; i < max; i++) {
     if(all[i].nodeType===1){
        if (all[i].hasAttributes()) {
            var attrs = all[i].attributes;
            for(var j = attrs.length - 1; j >= 0; j--) {
                if(extractEmails(attrs[j].value)!=null){
                    var arr_result = extractEmails(attrs[j].value);
                    
                    if(typeof arr_result !== "undefined")
                    arr_result.forEach(function(element) {
                        arrEmails.push(element)
                    });
                }
            }             
        } 
     }
     if(all[i].textContent!=null)
        if(extractEmails(all[i].textContent)!=null && ok==0){
            var arr_result = extractEmails(all[i].textContent);
            if(typeof arr_result !== "undefined")
                arr_result.forEach(function(element) {
                    arrEmails.push(element)
                });
            ok=1;
        }
    }
    if(arrEmails!=null)
        arrEmails = uniq(arrEmails);
    return arrEmails;
}
chrome.runtime.sendMessage({
    action: "getEmails",
    source: DOMtoString(document)
});

//extractEmails(text).join('\n')

function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}