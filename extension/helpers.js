function createHtml(json, parent) {
    for (let key in json) {
        if (key == '@context') {
            let vocab = document.createAttribute('vocab');
            vocab.value = json[key];
            parent.setAttributeNode(vocab);
        } else if (key == '@type') {
            let type = document.createAttribute('typeof');
            type.value = json[key];
            parent.setAttributeNode(type);
        } else if (typeof json[key] == 'object') {
            if (typeof json[key].length == 'undefined') {
                let div = document.createElement('div');
                let property = document.createAttribute('property');
                property.value = key;
                div.setAttributeNode(property);
                createHtml(json[key], div);
                parent.appendChild(div);
            } else {
                for (let i = 0; i < json[key].length; i++) {
                    if (typeof json[key][i] == 'string') {
                        let p = document.createElement('p');
                        let property = document.createAttribute('property');
                        property.value = key;
                        let value = document.createTextNode(json[key][i]);
                        p.setAttributeNode(property);
                        p.appendChild(value);
                        parent.appendChild(p);
                    } else {
                        let div = document.createElement('div');
                        let property = document.createAttribute('property');
                        property.value = key;
                        div.setAttributeNode(property);
                        createHtml(json[key][i], div);
                        parent.appendChild(div);
                    }
                }
            }
        } else {
            let p = document.createElement('p');
            let value = document.createTextNode(json[key]);
            let property = document.createAttribute('property');
            property.value = key;
            p.setAttributeNode(property);
            p.appendChild(value);
            parent.appendChild(p);
        }
    }
}

function parseJSONToRDFaHTML(jsons){
    var exportDoc = document.implementation.createHTMLDocument("RDFa-HTML-Export");
    jsons.forEach(json => {
        let div = document.createElement('div');
        createHtml(json, div);
        exportDoc.body.appendChild(div);
    });
    return exportDoc;
}