var data = [
    ["4030", 2000, "EU-tavaraostot"],
    ["2871", -2000, "Ostovelat"],
    ["2980", -480, "EU-tavaraostojen alv"],
    ["1850", 480, "Ostojen alv-saamiset"]
];

function generateAllTables(dat) {    
    var len = dat.length;
    for(t = 0; t < len; t++) {
        generateTable(dat[t][0], 6, dat[t][2]);        
    }
}

function checkAllTables(dat) {
    var len = dat.length;

    for(t = 0; t < len; t++) {
        if(checkSum(dat[t][0]) == dat[t][1]) {
            document.getElementById(dat[t][0]).setAttribute("class", "account table-right");
        } else {
            document.getElementById(dat[t][0]).setAttribute("class", "account table-wrong");
        }        
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); 
}

function drop(ev) {
    ev.preventDefault();
    var src = document.getElementById(ev.dataTransfer.getData("text"));
    var parent = src.parentNode;
    var tar = ev.currentTarget.firstElementChild;
    ev.currentTarget.replaceChild(src, tar);
    parent.appendChild(tar);
   
    calculateValues(src.parentNode.parentNode.parentNode.parentNode);

    // Don't calculate value table
    if(tar.parentNode.parentNode.parentNode.parentNode.id != "val_div") {
        calculateValues(tar.parentNode.parentNode.parentNode.parentNode); 
    }           
}

function checkSum(tname) {
    var tfoot = document.getElementById(tname).getElementsByTagName("TFOOT")[0];
    sum = parseFloat(tfoot.rows[0].cells[0].textContent) - parseFloat(tfoot.rows[0].cells[1].textContent);
    return sum;
}

function calculateValues(tbl) {
    
    tbody = tbl.getElementsByTagName("TBODY")[0];
   
    var len = tbody.rows.length;
    var debetsum = 0;
    var kreditsum = 0;

    for(i = 0; i < len; i++) {
        for(j = 0; j < 2; j++) {
            var temp = parseFloat(tbody.rows[i].cells[j].firstElementChild.textContent);
            if(!isNaN(temp)) {
                if(j == 0) {
                    debetsum = debetsum + temp;
                } else {
                    kreditsum = kreditsum + temp;
                }           
            }   
        }     
    }

    tfoot = tbl.getElementsByTagName("TFOOT")[0];
    tfoot.rows[0].cells[0].innerHTML = debetsum;
    tfoot.rows[0].cells[1].innerHTML = kreditsum;
}

function generateValues(values) {

    var len = values.length;

     // Create table
    var tbl = document.createElement("TABLE");
    tbl.setAttribute("id", "values");
    tbl.setAttribute("class", "table-hover values-padding");
    document.getElementById("val_div").appendChild(tbl);

    var tr = document.createElement("TR");
    tr.setAttribute("id", "values_row");
    document.getElementById("values").appendChild(tr);        

        for(j = 0; j < len; j++) {
            var td = document.createElement("TD");
            var dv = document.createElement("DIV");
            td.setAttribute("ondrop", "drop(event)");
            td.setAttribute("ondragover", "allowDrop(event)");
            td.setAttribute("id", "td_values_" + j);
            dv.setAttribute("class", "cell");
            dv.setAttribute("id", "div_values_" + j);
            dv.setAttribute("draggable", "true");
            dv.setAttribute("ondragstart", "drag(event)");
            var valuetext = document.createTextNode(Math.abs(values[j][1]));
            dv.appendChild(valuetext);
            td.appendChild(dv);

            document.getElementById("values_row").appendChild(td);
        }       
}

function generateTable(tname, rows, text) {
    
    // Create table
    var tbl = document.createElement("TABLE");
    tbl.setAttribute("id", tname);
    tbl.setAttribute("class", "account");
    document.getElementById("tables_div").appendChild(tbl);

    // Create thead
    var thead = document.createElement("THEAD");
    thead.setAttribute("id", tname + "_thead");
    document.getElementById(tname).appendChild(thead);  
    
    var tr = document.createElement("TR");
    tr.setAttribute("id", tname + "_header_tr");
    document.getElementById(tname + "_thead").appendChild(tr);
    
    var th = document.createElement("TH");
    th.setAttribute("id", tname + "_header_th");
    th.setAttribute("colspan", "2");
    document.getElementById(tname + "_header_tr").appendChild(th);
    var htext = document.createTextNode(tname + " " + text);
    document.getElementById(tname + "_header_th").appendChild(htext);
    
    // Create tbody
    var tbody = document.createElement("TBODY");
    tbody.setAttribute("id", tname + "_tbody");
    document.getElementById(tname).appendChild(tbody);

    // Fill tbody with rows and cells
    for(i = 1; i < rows; i++) {
        var tr = document.createElement("TR");
        tr.setAttribute("id", tname + "_row" + i);
        document.getElementById(tname + "_tbody").appendChild(tr);

        for(j = 1; j < 3; j++) {
            var td = document.createElement("TD");
            var dv = document.createElement("DIV");
            td.setAttribute("ondrop", "drop(event)");
            td.setAttribute("ondragover", "allowDrop(event)");
            td.setAttribute("id", "td_" + tname + "_c" + j +"r" + i);
            dv.setAttribute("class", "cell");
            dv.setAttribute("id", "div_" + tname + "_c" + j + "r" + i);
            dv.setAttribute("draggable", "true");
            dv.setAttribute("ondragstart", "drag(event)");
            td.appendChild(dv);
            document.getElementById(tname + "_row" + i).appendChild(td);
        }       
    }   

    // Create tfoot
    var tfoot = document.createElement("TFOOT");
    tfoot.setAttribute("id", tname + "_tfoot");
    document.getElementById(tname).appendChild(tfoot);  
    
    var tr = document.createElement("TR");
    tr.setAttribute("id", tname + "_footer_tr");
    document.getElementById(tname + "_tfoot").appendChild(tr);
    
    var valuetext = document.createTextNode("0");
    var td = document.createElement("TD");
    td.setAttribute("id", tname + "_debetsum");
    document.getElementById(tname + "_footer_tr").appendChild(td);
    document.getElementById(tname + "_debetsum").appendChild(valuetext);

    var valuetext = document.createTextNode("0");
    var td = document.createElement("TD");
    td.setAttribute("id", tname + "_kreditsum");
    document.getElementById(tname + "_footer_tr").appendChild(td);
    document.getElementById(tname + "_kreditsum").appendChild(valuetext);   
}