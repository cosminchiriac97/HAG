function generateJSONLDs(document_root) {
    var html = '';
    for (var i = 0; i < extractedJson.length; i++) {
        html += '<script type="application/ld+json">';
        html += JSON.stringify(extractedJson[i]);
        html += '</script>';
    }
    return html;
}
chrome.runtime.sendMessage({
    action: "exportAsJSON-LD",
    source: generateJSONLDs()
});

