// ==UserScript==
// @name         WME Streets Shift Utility
// @namespace    
// @version      2025.01.14.00
// @description  Utility for shifting street segments in WME without disconnecting nodes
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @license      MIT
// ==/UserScript==

/*Scripts modified from WME RA Util (https://greasyfork.org/en/scripts/23616-wme-ra-util) 
orgianl author: JustinS83 Waze*/ 
 
(function() {
    'use strict';

    let StreetsUtilWindow = null;
    let UpdateSegmentGeometry;
    let MoveNode;
    let MultiAction;
	let wEvents;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_NAME = GM_info.script.name;
    const DOWNLOAD_URL = GM_info.scriptUpdateURL;
	
    //var totalActions = 0;
    var _settings;
    const updateMessage = "Testing<br><br>Thanks for the update!";	

    function bootstrap(tries = 1) {
        if (W && W.map && W.model && require && WazeWrap.Ready) {
            loadScriptUpdateMonitor();			
            init();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(++tries), 200);
        }
    }

    bootstrap();

    function loadScriptUpdateMonitor() {
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function init() {
        injectCss();
        UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
        MoveNode = require('Waze/Action/MoveNode');
        MultiAction = require('Waze/Action/MultiAction');

        console.log("STREETS UTIL");
        console.log(GM_info.script);
        if(W.map.events)
		    wEvents = W.map.events;
	    else
		    wEvents = W.map.getMapEventsListener();		

		StreetsUtilWindow = document.createElement('div');
        StreetsUtilWindow.id = "StreetsUtilWindow";
        StreetsUtilWindow.style.position = 'fixed';
        StreetsUtilWindow.style.visibility = 'hidden';
        StreetsUtilWindow.style.top = '15%';
        StreetsUtilWindow.style.left = '25%';
        StreetsUtilWindow.style.width = '250px';
        StreetsUtilWindow.style.zIndex = 100;
        StreetsUtilWindow.style.backgroundColor = '#FFFFFE';
        StreetsUtilWindow.style.borderWidth = '0px';
        StreetsUtilWindow.style.borderStyle = 'solid';
        StreetsUtilWindow.style.borderRadius = '10px';
        StreetsUtilWindow.style.boxShadow = '5px 5px 10px Silver';
        StreetsUtilWindow.style.padding = '4px';
        var alertsHTML = '<div id="header" style="padding: 4px; background-color:#92C3D3; border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; color: white; font-weight: bold; text-align:center; letter-spacing: 1px;text-shadow: black 0.1em 0.1em 0.2em;"><img src="https://storage.googleapis.com/wazeopedia-files/1/1e/RA_Util.png" style="float:left"></img> Streets Shift Utility <a data-toggle="collapse" href="#divWrappers" id="collapserLink" style="float:right"><span id="collapser" style="cursor:pointer;padding:2px;color:white;" class="fa fa-caret-square-o-up"></a></span></div>';
        // start collapse // I put it al the beginning
      alertsHTML += '<div id="divWrappers" class="collapse in">';
         //***************** Shift Amount **************************
         // Define BOX
         alertsHTML += '<div id="contentShift" style="text-align:center;float:left; width: 120px;max-width: 49%;height: 170px;margin: 1em 5px 0px 0px;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;}">';
         alertsHTML += '<b>Shift amount</b></br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" classs="form-control" autocomplete="off" value=""> <div style="margin: 5px 4px;">Metre(s)';
            // Shift amount controls
            alertsHTML += '<div id="controls" style="text-align:center; padding:06px 4px;width=100px; height=100px;margin: 5px 0px;border-style:solid; border-width: 2px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1); background:#92C3D3;align:center;">';
            //Single Shift Up Button
            alertsHTML += '<span id="ShiftUpBtn" style="cursor:pointer;font-size:14px;">';
            alertsHTML += '<i class="fa fa-angle-double-up fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: top;"> </i>';
            alertsHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span><br>';
            //Single Shift Left Button
            alertsHTML += '<span id="ShiftLeftBtn" style="cursor:pointer;font-size:14px;margin-left:-40px;">';
            alertsHTML += '<i class="fa fa-angle-double-left fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: middle"> </i>';
            alertsHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span>';
            //Single Shift Right Button
            alertsHTML += '<span id="ShiftRightBtn" style="float: right;cursor:pointer;font-size:14px;margin-right:5px;">';
            alertsHTML += '<i class="fa fa-angle-double-right fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
            alertsHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span><br>';
            //Single Shift Down Button
            alertsHTML += '<span id="ShiftDownBtn" style="cursor:pointer;font-size:14px;margin-top:0px;">';
            alertsHTML += '<i class="fa fa-angle-double-down fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
            alertsHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span>';
         alertsHTML += '</div></div></div>';

        StreetsUtilWindow.innerHTML = alertsHTML;
        document.body.appendChild(StreetsUtilWindow);
		
        $('#ShiftUpBtn').click(() => shiftSegments('up'));
        $('#ShiftDownBtn').click(() => shiftSegments('down'));
        $('#ShiftLeftBtn').click(() => shiftSegments('left'));
        $('#ShiftRightBtn').click(() => shiftSegments('right'));
		
        $('#shiftAmount').keypress(function(event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
                event.preventDefault();
        });		

        W.selectionManager.events.register('selectionchanged', null, checkDisplayTool);

        var loadedSettings = $.parseJSON(localStorage.getItem("WME_StreetsUtil"));
        var defaultSettings = {
            divTop: "15%",
            divLeft: "25%",
        };	
        _settings = loadedSettings ? loadedSettings : defaultSettings;	
        $('#StreetsUtilWindow').css('left', _settings.divLeft);
        $('#StreetsUtilWindow').css('top', _settings.divTop);	

        WazeWrap.Interface.ShowScriptUpdate("WME Streets Shift Util", GM_info.script.version, updateMessage, "https://greasyfork.org/en/scripts/-wme-util", "https://www.waze.com/forum/viewtopic.php?");		
		
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                divTop: "15%",
                divLeft: "25%",
            };

            settings.divLeft = $('#StreetsUtilWindow').css('left');
            settings.divTop = $('#StreetsUtilWindow').css('top');
            localStorage.setItem("WME_StreetsUtil", JSON.stringify(settings));
        }
    }
    function injectCss() {
        const css = [' '].join(' ');
        
        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }
    function checkDisplayTool(){
        if(WazeWrap.hasSelectedFeatures() && WazeWrap.getSelectedFeatures()[0].WW.getType() === 'segment'){
            if(WazeWrap.getSelectedFeatures().length === 0)
                $('#StreetsUtilWindow').css({'visibility': 'hidden'});
            else{
                $('#StreetsUtilWindow').css({'visibility': 'visible'});
                if(typeof jQuery.ui !== 'undefined')
                    $('#StreetsUtilWindow' ).draggable({ //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
                        stop: function(event, ui) {
                            $('#StreetsUtilWindow').css("height", "");
                            saveSettingsToStorage();
                        }
                    });
                //checkSaveChanges();
            }
        }
        else{
            $('#StreetsUtilWindow').css({'visibility': 'hidden'});
            if(typeof jQuery.ui !== 'undefined')
                $('#StreetsUtilWindow' ).draggable({
                    stop: function(event, ui) {
                        $('#StreetsUtilWindow').css("height", "");
                        saveSettingsToStorage();
                    }
                });
        }
    }

    function shiftSegments(direction) {
        var shiftAmount = parseFloat($('#shiftAmount').val());
        if (isNaN(shiftAmount) || shiftAmount <= 0) {
            alert("Please enter a valid shift amount.");
            return;
        }

        const selectedFeatures = WazeWrap.getSelectedFeatures();
        if (!selectedFeatures || !selectedFeatures.length) {
            alert("No segments selected.");
            return;
        }

        const multiaction = new MultiAction();
        const nodeAdjustments = {};

        selectedFeatures.forEach(feature => {
            const segment = feature.WW.getObjectModel();
            const newGeometry = structuredClone(segment.attributes.geoJSONGeometry);
            const segmentCoords = newGeometry.coordinates;

            // Adjust each segment's geometry based on the direction
            segmentCoords.forEach(coord => {
                switch (direction) {
                    case "up":
                        coord[1] += shiftAmount / 111320; // Shift in latitude
                        break;
                    case "down":
                        coord[1] -= shiftAmount / 111320;
                        break;
                    case "left":
                        coord[0] -= shiftAmount / (111320 * Math.cos(coord[1] * Math.PI / 180)); // Shift in longitude
                        break;
                    case "right":
                        coord[0] += shiftAmount / (111320 * Math.cos(coord[1] * Math.PI / 180));
                        break;
                }
            });

            multiaction.doSubAction(
                W.model,
                new UpdateSegmentGeometry(segment, segment.attributes.geoJSONGeometry, newGeometry)
            );

            // Track node adjustments to avoid disconnections
            adjustNode(segment.attributes.fromNodeID, direction, shiftAmount, nodeAdjustments, multiaction);
            adjustNode(segment.attributes.toNodeID, direction, shiftAmount, nodeAdjustments, multiaction);
        });

        W.model.actionManager.add(multiaction);
        alert(`Segments shifted ${direction} by ${shiftAmount} metres.`);
    }

    function adjustNode(nodeId, direction, shiftAmount, nodeAdjustments, multiaction) {
        if (!nodeId || nodeAdjustments[nodeId]) return;

        const node = W.model.nodes.objects[nodeId];
        if (!node) return;

        const newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
        switch (direction) {
            case "up":
                newNodeGeometry.coordinates[1] += shiftAmount / 111320;
                break;
            case "down":
                newNodeGeometry.coordinates[1] -= shiftAmount / 111320;
                break;
            case "left":
                newNodeGeometry.coordinates[0] -= shiftAmount / (111320 * Math.cos(newNodeGeometry.coordinates[1] * Math.PI / 180));
                break;
            case "right":
                newNodeGeometry.coordinates[0] += shiftAmount / (111320 * Math.cos(newNodeGeometry.coordinates[1] * Math.PI / 180));
                break;
        }

        nodeAdjustments[nodeId] = true;

        const connectedSegObjs = {};
        for (const segId of node.attributes.segIDs) {
            connectedSegObjs[segId] = structuredClone(W.model.segments.getObjectById(segId).attributes.geoJSONGeometry);
        }

        multiaction.doSubAction(
            W.model,
            new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {})
        );
    }
})();
