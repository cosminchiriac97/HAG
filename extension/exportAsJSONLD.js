function generateJSONLDs(document_root) {
    var html = '{';
    for (var i = 0; i < extractedJson.length; i++) {
        html += '"' + extractedJson[i]['@type'] + '' + i + '": ';
        html += JSON.stringify(extractedJson[i]);
        if (i != extractedJson.length - 1) { html += ','; }

    }
    html += '}';
    return html;
}
chrome.runtime.sendMessage({
    action: "exportAsJSON-LD",
    source: generateJSONLDs()
});

