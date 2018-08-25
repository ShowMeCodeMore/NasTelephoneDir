/**
 * Created by ccdgz on 2018/5/22.
 */


"use strict";

var TelItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.num = obj.num;
        this.content = obj.content;
        this.type = obj.type;
        this.author = obj.author;
    } else {
        this.num = "";
        this.content = "";
        this.type = "";
        this.author = "";
    }
};

TelItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var TelBook = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new TelItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "addr", {
        parse: function (str) {
            return new BigNumber(str);
        },
        stringify: function (obj) {
            return obj.toString();
        }
    });
};

TelBook.prototype = {
    init: function () {
    },

    save: function (num, content, type, author) {

        num = num.trim();
        content = content.trim();
        type = type.trim();
        author = author.trim();


        var from = Blockchain.transaction.from;
        var size = this.addr.get(from);
        if (!size) {
            size = 0;
        }
        size = size + 1;
        this.addr.put(from, size);

        var key = from + size.toString();
        var telItem = new TelItem();
        telItem.num = num;
        telItem.content = content;
        telItem.type = type;
        telItem.author = author;
        this.repo.put(key, telItem);
    },

    get: function () {
        var from = Blockchain.transaction.from;
        var size = this.addr.get(from);
        var list = [];
        for (var i = 1; i <= size; i ++) {
            var key = from + i.toString();
            var telItem = this.repo.get(key);
            if (telItem != null ){
                list.push(telItem);
            }

        }
        return list;
    },

    getMyTels: function (author) {
        //var from = Blockchain.transaction.from;
        var from = author.trim();
        var size = this.addr.get(from);
        var list = [];
        for (var i = 1; i <= size; i ++) {
            var key = from + i.toString();
            var telItem = this.repo.get(key);
            if (telItem != null){
                list.push(telItem);
            }
        }
        return list;
    }

};

module.exports = TelBook;