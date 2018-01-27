function DOMtoString(document_root) {
    var tot = [];
    var temp1;
    var scripts = document_root.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].type == 'application/ld+json') {
            temp1 = getUnscaped(scripts[i].textContent);
            for (var j = 0; j < schemasName.length; j++) {
                if (temp1['@type'] == schemasName[j]) {
                    tot[tot.length] = getUnscaped(scripts[i].textContent);
                }
            }
        }
    }
    return tot;
}


function getUnscaped(target) {
    var r = /\\u([\d\w]{4})/gi;
    target = target.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
    target = unescape(target);
    while (target.indexOf('\\/') !== -1) {
        target = target.replace('\\/', '/')
    }
    return JSON.parse(target);
}

chrome.runtime.sendMessage({
    action: "json-ld",
    source: DOMtoString(document)
});

