function pairToJson(pair) {
    let json = JSON.stringify(pair.predicate) + ': ';
    if (pair.object.length > 1) {
        if (typeof pair.object[0] == 'object') {
            json = json.concat('[', objectToJson(pair.object[0]), ',');
        } else json = json.concat('[', JSON.stringify(pair.object[0]), ',');
        let i;
        for (i = 1; i < pair.object.length - 1; i++) {
            if (typeof pair.object[i] == 'object') {
                json = json.concat(objectToJson(pair.object[i]), ',');
            } else json = json.concat(JSON.stringify(pair.object[i]), ',');
        }
        if (typeof pair.object[i] == 'object') {
            json = json.concat(objectToJson(pair.object[i]), ']');
        } else json = json.concat(JSON.stringify(pair.object[i]), ']');
    } else {
        if (typeof pair.object[0] == 'object') {
            json = json.concat(objectToJson(pair.object[0]));
        } else json = json.concat(JSON.stringify(pair.object[0]));
    }
    return json;
}
function objectToJson(rdfaObj) {
    let json = '{';
    let i;
    for (i = 0; i < rdfaObj.list.length - 1; i++) {
        json = json.concat(pairToJson(rdfaObj.list[i]), ',');
    }
    json = json.concat(pairToJson(rdfaObj.list[i]));
    json = json.concat('}');
    return json;
}

function ValidURL(str) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }

function parseRdfa(element, rdfObj) {
    if (element.hasAttribute('vocab')) {
        let context = {
            predicate: '@context',
            object: [element.getAttribute('vocab')]
        };
        rdfObj.addEl(context);
    }
    if (element.hasAttribute('property') && element.hasAttribute('typeof')) {

        let attributes = element.getAttribute('property').split(" ");

        let type;
        if (ValidURL(element.getAttribute("typeof")))
            type = new URL(element.getAttribute("typeof")).pathname.replace('/', '')
        else type = element.getAttribute("typeof");

        attributes.forEach(attr => {
            if (rdfObj.contains(attr) == true) {
                let pred_obj = rdfObj.getPair(attr);
                let currentRdf = {
                    list: [],
                    addEl: function (el) {
                        this.list.push(el);
                    },
                    contains: function (predicate) {
                        for (let i = 0; i < this.list.length; i++)
                            if (this.list[i].predicate == predicate) {
                                return true;
                            }
                        return false;
                    },
                    getPair: function (predicate) {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].predicate == predicate) {
                                return this.list[i];
                            }
                        }
                    }
                };

                let pred_obj2 = {
                    predicate: '@type',
                    object: [type],
                    addEl: function (el) {
                        this.object.push(el);
                    }
                };
                currentRdf.addEl(pred_obj2);
                let children = element.children;
                for (let i = 0; i < children.length; i++) {
                    parseRdfa(children[i], currentRdf);
                }

                pred_obj.addEl(currentRdf);
            } else {
                let pred_obj = {
                    predicate: attr,
                    object: [],
                    addEl: function (el) {
                        this.object.push(el);
                    }
                };
                let pred_obj2 = {
                    predicate: '@type',
                    object: [type],
                    addEl: function (el) {
                        this.object.push(el);
                    }
                };
                let currentRdf = {
                    list: [],
                    addEl: function (el) {
                        this.list.push(el);
                    },
                    contains: function (predicate) {
                        for (let i = 0; i < this.list.length; i++)
                            if (this.list[i].predicate == predicate) {
                                return true;
                            }
                        return false;
                    },
                    getPair: function (predicate) {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].predicate == predicate) {
                                return this.list[i];
                            }
                        }
                    }
                };
                currentRdf.addEl(pred_obj2);
                let children = element.children;
                for (let i = 0; i < children.length; i++) {
                    parseRdfa(children[i], currentRdf);
                }
                pred_obj.addEl(currentRdf);
                rdfObj.addEl(pred_obj);
            }
        });
    } else if (element.hasAttribute('typeof')) {
        let type;
        if (ValidURL(element.getAttribute("typeof")))
                    type = new URL(element.getAttribute("typeof")).pathname.replace('/', '')
                else type = element.getAttribute("typeof");

        let pred_obj = {
            predicate: '@type',
            object: [type]
        };
        rdfObj.addEl(pred_obj);
        let children = element.children;
        for (let i = 0; i < children.length; i++) {
            parseRdfa(children[i], rdfObj);
        }
    } else if (element.hasAttribute('property')) {

        let attributes = element.getAttribute('property').split(" ");

        attributes.forEach(attr => {
            if (rdfObj.contains(attr)) {
                let pred_obj = rdfObj.getPair(attr);
                if (element.hasAttribute('href')) {
                    pred_obj.object.push(element.getAttribute('href'));
                }
                else if (element.hasAttribute('content')) {
                    pred_obj.object.push(element.getAttribute('content'));
                } else {
                    pred_obj.object.push(element.innerText);
                }
            } else {
                let pred_obj = {
                    predicate: '',
                    object: [],
                    addEl: function (el) {
                        this.object.push(el);
                    }
                }
                if (element.hasAttribute('href')) {
                    pred_obj.predicate = attr;
                    pred_obj.object.push(element.getAttribute('href'));
                }
                else if (element.hasAttribute('content')) {
                    pred_obj.predicate = attr;
                    pred_obj.object.push(element.getAttribute('content'));
                } else {
                    pred_obj.predicate = attr;
                    pred_obj.object.push(element.innerText);
                }
                rdfObj.addEl(pred_obj);
            }
            let children = element.children;
            for (let i = 0; i < children.length; i++) {
                parseRdfa(children[i], rdfObj);
            }
        });
    } else {
        let children = element.children;
        for (let i = 0; i < children.length; i++) {
            parseRdfa(children[i], rdfObj);
        }
    }

    if (!element.hasChildNodes)
        return;
}

function startParsing(elemelon) {
    let res = {
        list: [],
        addEl: function (el) {
            this.list.push(el);
        },
        contains: function (predicate) {
            for (let i = 0; i < this.list.length; i++)
                if (this.list[i].predicate == predicate) {
                    return true;
                }
            return false;
        },
        getPair: function (predicate) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].predicate == predicate) {
                    return this.list[i];
                }
            }
        }
    };
    parseRdfa(elemelon, res);
    return JSON.parse(objectToJson(res));
}

function start() {
    let jsons = [];
    schemasName.forEach(scheme => {
        let allTags = Array.prototype.slice.call(document.querySelectorAll('[typeof]'));
        allTags = allTags.concat(Array.prototype.slice.call(document.querySelectorAll('[typeof=\"http://schema.org/' + scheme + '\"]')));
        for (let i = 0; i < allTags.length; i++) {
            json = startParsing(allTags[i]);
            console.log(json);
            jsons.push(json);
        }
    });
    return jsons;
}

chrome.runtime.sendMessage({
    action: "parseRDFa",
    source: start()
});