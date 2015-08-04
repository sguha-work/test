/**
 * This file holds list of all the operations
 * Every operation will have the following attributes
 * config: this attribute holds the priority wise dependency list for the operation
 */
var operationArray = {
    sort: {
        config: [{
            name: 'table',
            methodName: "table",
            displayText: "Please select the table"
        }, {
            name: 'field',
            methodName: "field",
            displayText: "Please select the Field of the table"
        }, {
            name: "order",
            methodName: "list",
            displayText: "Please select the order",
            value: ["DESC", "ASC"]
        }],
        click: function() {
            var operationParam = {},
                index = 0,
                thisOp = operationArray.sort,
                localConfig = thisOp.config,
                config_i = localConfig[index]
            callBack = function() {
                if (index < localConfig.length) {
                    operationParam[config_i.name] = document.getElementById("txt_" + config_i.name + "_" + index).value;
                    index += 1;
                    config_i = localConfig[index];
                    if (index == localConfig.length) {
                        operationArray.sort.operation(operationParam);
                    } else {
                        // put the comment
                        ui.update_comment(config_i.displayText);
                        // create the input
                        ui["create_" + config_i.methodName](operationParam, config_i.name + "_" + index, config_i.value);
                    }
                } else {
                    operationArray.sort.operation(operationParam);
                }
            };
            // clear the ui
            ui.clear_ui();
            // put the comment
            ui.update_comment(config_i.displayText);
            // create the first input
            ui["create_" + config_i.methodName](operationParam, config_i.name + "_" + index, config_i.value);
            // create the button
            ui.create_button(callBack);

        },
        operation: function(config) {


            var b = new Benchmark("sort");
            b.startTimer();
            // do the operation here




            b.stopTimer();
        }
    },
    search: {
        config: [{
            name: 'table',
            methodName: "table",
            displayText: "Please select the table"
        }, {
            name: 'query',
            methodName: "query",
            displayText: "Please enter the query for search"
        }],
        click: function() {
            var operationParam = {},
            index=0,
            callBack=function(){
                if(index==operationArray.search.config.length-1) {
                    operationParam[operationArray.search.config[index].name] = document.getElementById("txt_"+operationArray.search.config[index].name+"_"+index).value;
                    operationArray.search.operation(operationParam);
                } else {
                    operationParam[operationArray.search.config[index].name] = document.getElementById("txt_"+operationArray.search.config[index].name+"_"+index).value;
                    index += 1;
                    ui["create_" + operationArray.search.config[index].methodName](operationParam, operationArray.search.config[index].name+"_"+index);
                }
            };

            ui.clear_ui();
            
            ui["create_" + operationArray.search.config[index].methodName](operationParam,  operationArray.search.config[index].name + "_" + index);

            ui.create_button(callBack, "search");
            
            

        },
        operation: function(config) {
            var b = new Benchmark("search");
            var returnObject = {};
            mainDatabase[config.table].find({}, function(e, r){
                returnObject["data-length"] = r.length;
            });
            b.startTimer();
            mainDatabase[config.table].find(config.query, function(err, records){
                returnObject["effected-row"] = records.length;
                returnObject["remarks"] = "operation performed on  "+returnObject["data-length"]+" rows, "+returnObject["effected-row"]+ " rows effected";
                b.stopTimer(returnObject);
                console.log(records.length);
            })
            

            // do the operation here




            
        }
    },
    // serialize: {
    //     click: function() {
    //         // clear the ui
    //         ui.clear_ui();
    //         operationArray.serialize.operation();
    //     },
    //     operation: function(config) {
    //         var b = new Benchmark("serialize");
    //         b.startTimer();
    //         // do the operation here




    //         b.stopTimer();
    //     }
    // },
    grouping: {
        config: [{
            name: 'table',
            methodName: "table",
            displayText: "Please select the table"
        },{
            name: 'suboperation',
            methodName: "suboperation",
            displayText: "select the sub operation",
            subOperationList: ["sort", "filter", "aggregate", "highlight"]
        }, {
            name: 'attributes',
            methodName: "attributes",
            displayText: "select one attribute to group"
        }, {
            name: 'query',
            methodName: "query",
            displayText: "Please enter the query for search"
        }],
        click: function() {
            var operationParam = {},
            index=0,
            flag=0,
            callBack=function(){
                if(index==operationArray.grouping.config.length-1) {
                    operationParam[operationArray.grouping.config[index].name] = document.getElementById("txt_"+operationArray.grouping.config[index].name+"_"+index).value;
                    operationArray.grouping.operation(operationParam);
                } else {
                    operationParam[operationArray.grouping.config[index].name] = document.getElementById("txt_"+operationArray.grouping.config[index].name+"_"+index).value;
                    index += 1;
                    if(typeof operationParam["suboperation"]!="undefined" && operationParam["suboperation"]!="sort" && !flag) {
                        index+=1;
                        flag = 1;
                    }
                    if(operationArray.grouping.config[index].methodName=="suboperation") {
                        ui["create_" + operationArray.grouping.config[index].methodName](operationParam, operationArray.grouping.config[index].name+"_"+index, operationArray.grouping.config[index].subOperationList);                        
                    } else {
                        ui["create_" + operationArray.grouping.config[index].methodName](operationParam, operationArray.grouping.config[index].name+"_"+index);
                    }
                }
            };
            ui.clear_ui();
            
            ui["create_" + operationArray.grouping.config[index].methodName](operationParam,  operationArray.grouping.config[index].name + "_" + index);

            ui.create_button(callBack, "grouping");
        },
        operation: function(config) {
            
            var returnObject = {};
            
            mainDatabase[config.table].find({}, function(err, records) {
                if(records.length) {
                    
                        switch(config.suboperation) {
                            case "sort":
                                if(!isNaN(records[0][config.attributes])) {
                                    operationArray.grouping.performSort(config, records);
                                } else {
                                     alert("Only numeric sort still now");
                                     return false
                                 }
                            break;
                            case "filter":
                                operationArray.grouping.performFilter(config, records.length);
                            break;
                        }
                } else {
                    alert("please enter table data to perform operation");
                    return false;
                }
            });
            // do the operation here
            

            
        },
        performFilter: function(config, dataLength) {
            var b = new Benchmark("grouping"+"_"+config.suboperation);
            if(config.query.trim() == "") {
                config.query = {};
            }
            var responseObject = {};
            responseObject.remarks = "Filterring operation performed on "+dataLength+" numbers of data";
            b.startTimer();
            mainDatabase[config.table].find(config.query, function(err, records) {
                responseObject.remarks += " Number of effected rows "+(dataLength-records.length);
                b.stopTimer(responseObject);
            });
        },
        performSort: function(config, records) {
            var sortType = (typeof config.query!="undefined"&&config.query.trim()!="")?(config.query.trim()):"bubble";
            var b = new Benchmark("grouping"+"_"+config.suboperation+"_"+sortType);
            var sortObject = new Sort();
            var responseObject = {};
            responseObject.remarks = "operation "+config.suboperation+" performed using "+sortType+" method on"+records.length+" numbers of data";
            b.startTimer();
            sortObject[sortType+"Sort"](records, config.attributes);
            b.stopTimer(responseObject);
        }
    }
}
