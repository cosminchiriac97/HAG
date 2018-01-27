function createHtml(json, parent) {
    for (let key in json) {
        if (key == '@context') {
            continue;
        } else if (key == '@type') {
            let itemscope = document.createAttribute('itemscope');
            parent.setAttributeNode(itemscope);
            let type = document.createAttribute('itemtype');
            type.value = "http:\\schema.org\\" + json[key];
            parent.setAttributeNode(type);
        } else if (typeof json[key] == 'object') {
            if (typeof json[key].length == 'undefined') {
                let div = document.createElement('div');
                let itemprop = document.createAttribute('itemprop');
                itemprop.value = key
                div.setAttributeNode(itemprop)
                createHtml(json[key], div);
                parent.appendChild(div);
            } else {

                for (let i = 0; i < json[key].length; i++) {
                    if (typeof json[key][i] != 'string') {
                        let div = document.createElement('div');
                        let itemprop = document.createAttribute('itemprop');
                        itemprop.value = key
                        div.setAttributeNode(itemprop)
                        createHtml(json[key][i], div);
                        parent.appendChild(div);
                    } else {
                        let p = document.createElement('p');
                        let itemprop = document.createAttribute('itemprop');
                        let valueNode = document.createTextNode(json[key][i]);
                        itemprop.value = key
                        p.setAttributeNode(itemprop)
                        p.appendChild(valueNode);
                        parent.appendChild(p);
                    }
                }
            }
        } else {
            let p = document.createElement('p');
            let value = document.createTextNode(json[key]);
            let property = document.createAttribute('itemprop');
            property.value = key;
            p.setAttributeNode(property);
            p.appendChild(value);
            parent.appendChild(p);
        }
    }
}


function parseJSONtoMicrodataHtml() {
    var exportDoc = document.implementation.createHTMLDocument("MicrodataHtmlExport");
    extractedJson.forEach(function (element) {
        var parent = document.createElement('div');
        createHtml(element, parent)
        exportDoc.body.appendChild(parent);
    })
    return exportDoc.documentElement.innerHTML;
}


chrome.runtime.sendMessage({
    action: "exportAsMicro",
    source: parseJSONtoMicrodataHtml()
});