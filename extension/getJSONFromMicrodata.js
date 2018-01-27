function getSchemasJson(document_root){
    var result = {};
    var items = [];
    schemasName.forEach(function(element){
        getSchemaJson(document_root,"http://schema.org/"+element).forEach(function(elSchema){
            items.push(elSchema);
        });
    });
    result.items = items;
    return result.items;
}

function getSchemaJson(document_root,schemaName) {
    
    var items = [];
    var query = "[itemscope][itemtype=" + "'" + schemaName + "'" + "]";
    var nodesArray = [].slice.call(document_root.querySelectorAll("[itemscope][itemtype=" + "'" + schemaName + "'" + "]"));


    while (nodesArray.length > 0) {
        var item = {
            "@context": "http://schema.org",
            "@type": new URL(nodesArray[0].getAttribute("itemtype")).pathname.replace('/', '')
        };

        getElementsFromSchema(nodesArray[0], item);
        items.push(item);
        remove(nodesArray, nodesArray[0]);
    }

    function getElementsFromSchema(node, item) {
        var props = node.querySelectorAll("[itemprop]");
        var _item;
        props.forEach(function (prop) {
            var itemType = prop.matches("[itemtype]")
            var itemprop = prop.matches("[itemprop]")
            var hrefprop = prop.matches("[href]")
            var contentprop = prop.matches("[content]");
            if (itemType && itemprop && !hrefprop && !contentprop) {
                _item = {
                    "@type": new URL(prop.getAttribute("itemtype")).pathname.replace('/', '')
                };
                getElementsFromSchema(prop, _item);
            }

            if (check(node, prop) && ((!itemType && itemprop) || (itemType && itemprop && hrefprop)|| (itemType && itemprop && contentprop))) {
                if (item[prop.getAttribute("itemprop")] == null)
                    item[prop.getAttribute("itemprop")] = prop.getAttribute("href") || prop.getAttribute("content") || prop.innerText || prop.src;
                else {
                    if (Array.isArray(item[prop.getAttribute("itemprop")])) {
                        item[prop.getAttribute("itemprop")].push(prop.getAttribute("href") || prop.getAttribute("content") || prop.innerText || prop.src || prop.href);
                    } else {
                        item[prop.getAttribute("itemprop")] = [item[prop.getAttribute("itemprop")], prop.getAttribute("href") || prop.getAttribute("content") || prop.innerText || prop.src || prop.href]
                    }
                }
            }
            if (check(node, prop) && itemType && itemprop && !hrefprop && !contentprop) {
                if (item[prop.getAttribute("itemprop")] == null)
                    item[prop.getAttribute("itemprop")] = _item;
                else {
                    if (Array.isArray(item[prop.getAttribute("itemprop")])) {
                        item[prop.getAttribute("itemprop")].push(_item);
                    } else {
                        item[prop.getAttribute("itemprop")] = [item[prop.getAttribute("itemprop")], _item]
                    }
                }
            }

        });
    }
    return items;
}

function check(parent, child) {
    while (true) {
        if (typeof child.parentNode === undefined || typeof child === undefined)
            return false;
        if (child.parentNode.hasAttribute("itemtype")) {
            if (child.parentNode === parent)
                return true;
            else {
                return false;
            }
        }

        if (child.parentNode.hasAttribute("itemprop") && parent.hasAttribute("itemprop"))
            if (child.parentNode.getAttributeNode("itemprop").value === parent.getAttributeNode("itemprop").value)
                return false;

        child = child.parentNode;
    }
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

chrome.runtime.sendMessage({
    action: "microdata",
    source: getSchemasJson(document)
});