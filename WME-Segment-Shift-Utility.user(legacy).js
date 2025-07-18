// ==UserScript==
// @name         WME Segment Shift Utility
// @namespace    https://github.com/kid4rm90s/Segment-Shift-Utility
// @version      2025.05.26.02
// @description  Utility for shifting street segments in WME without disconnecting nodes
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/*
// @author       kid4rm90s
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL  https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js
// @updateURL    https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.meta.js
// @license      MIT
// ==/UserScript==

/*Scripts modified from WME RA Util (https://greasyfork.org/en/scripts/23616-wme-ra-util)
orgianl author: JustinS83 Waze*/
(function() {
	let sdkVersion = "";
	unsafeWindow.SDK_INITIALIZED.then(() => {
    let sdk = unsafeWindow.getWmeSdk({
    scriptId: "wme-ss-util",
    scriptName: "WME Segment Shift Utility",
    });
    sdkVersion = sdk.getSDKVersion()
});
    var SSUtilWindow = null;
    var UpdateSegmentGeometry;
    var MoveNode, MultiAction;
	var drc_layer;
	let wEvents;
    const SSUTIL_VERSION = `${GM_info.script.version}`;
    //const SCRIPT_NAME = GM_info.script.name;
	const GF_LINK = 'https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js';
    const DOWNLOAD_URL = 'https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js';
    //var totalActions = 0;
    var _settings;
    const updateMessage = "Minor changes:<br><br>Minor updates!<br><br>Thanks for using it!";

    function bootstrap(tries = 1) {

		if (W.map && W.model && require && WazeWrap.Ready){	
            startScriptUpdateMonitor();
            init();
        }
        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    bootstrap();

	function startScriptUpdateMonitor() {
		let updateMonitor;
		try {
			updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(GM_info.script.name, GM_info.script.version, DOWNLOAD_URL, GM_xmlhttpRequest, DOWNLOAD_URL);
			updateMonitor.start();
		} catch (ex) {
			// Report, but don't stop if ScriptUpdateMonitor fails.
			console.error('WME SSUtil:', ex);
		}
	}

    function init(){
        injectCss();
        UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
        MoveNode = require("Waze/Action/MoveNode");
        MultiAction = require("Waze/Action/MultiAction");

        console.log("SS UTIL");
        console.log(GM_info.script);
        if(W.map.events)
		    wEvents = W.map.events;
	    else
		    wEvents = W.map.getMapEventsListener();

        SSUtilWindow = document.createElement('div');
        SSUtilWindow.id = "SSUtilWindow";
        SSUtilWindow.style.position = 'fixed';
        SSUtilWindow.style.visibility = 'hidden';
        SSUtilWindow.style.top = '15%';
        SSUtilWindow.style.left = '25%';
        SSUtilWindow.style.width = '250px';
        SSUtilWindow.style.zIndex = 100;
        SSUtilWindow.style.backgroundColor = '#FFFFFE';
        SSUtilWindow.style.borderWidth = '0px';
        SSUtilWindow.style.borderStyle = 'solid';
        SSUtilWindow.style.borderRadius = '10px';
        SSUtilWindow.style.boxShadow = '5px 5px 10px Silver';
        SSUtilWindow.style.padding = '4px';

        var alertsHTML = '<div id="header" style="padding: 4px; background-color:#92C3D3; border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; color: white; font-weight: bold; text-align:center; letter-spacing: 1px;text-shadow: black 0.1em 0.1em 0.2em;"><img src="https://storage.googleapis.com/wazeopedia-files/1/1e/RA_Util.png" style="float:left"></img> Segment Shift Utility <a data-toggle="collapse" href="#divWrappers1" id="collapserLink1" style="float:right"><span id="collapser1" style="cursor:pointer;padding:2px;color:white;" class="fa fa-caret-square-o-up"></a></span></div>';
        // start collapse // I put it al the beginning
      alertsHTML += '<div id="divWrappers1" class="collapse in">';
         //***************** Disconnect Nodes Checkbox **************************
         alertsHTML += '<p style="margin: 10px 0px 0px 20px;"><input type="checkbox" id="chkDisconnectNodes"> Disconnect Nodes</p>';
         //***************** Shift Amount **************************
         // Define BOX
         alertsHTML += '<div id="contentShift" style="text-align:center;float:left; width: 120px;max-width: 49%;height: 170px;margin: 1em 5px 0px 0px;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;}">';
         alertsHTML += '<b>Shift amount</b></br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" value="1"/> <div style="margin: 5px 4px;">Metre(s)';
            // Shift amount controls
            alertsHTML += '<div id="controls" style="text-align:center; padding:06px 4px;width=100px; height=100px;margin: 5px 0px;border-style:solid; border-width: 2px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1); background:#92C3D3;align:center;">';
            //Single Shift Up Button
            alertsHTML += '<span id="SSShiftUpBtn" style="cursor:pointer;font-size:14px;">';
            alertsHTML += '<i class="fa fa-angle-double-up fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: top;"> </i>';
            alertsHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span><br>';
            //Single Shift Left Button
            alertsHTML += '<span id="SSShiftLeftBtn" style="cursor:pointer;font-size:14px;margin-left:-40px;">';
            alertsHTML += '<i class="fa fa-angle-double-left fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: middle"> </i>';
            alertsHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span>';
            //Single Shift Right Button
            alertsHTML += '<span id="SSShiftRightBtn" style="float: right;cursor:pointer;font-size:14px;margin-right:5px;">';
            alertsHTML += '<i class="fa fa-angle-double-right fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
            alertsHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span><br>';
            //Single Shift Down Button
            alertsHTML += '<span id="SSShiftDownBtn" style="cursor:pointer;font-size:14px;margin-top:0px;">';
            alertsHTML += '<i class="fa fa-angle-double-down fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
            alertsHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
            alertsHTML += '</span>';
         alertsHTML += '</div></div></div>';

        SSUtilWindow.innerHTML = alertsHTML;
        document.body.appendChild(SSUtilWindow);

        $('#SSShiftLeftBtn').click(SSShiftLeftBtnClick);
        $('#SSShiftRightBtn').click(SSShiftRightBtnClick);
        $('#SSShiftUpBtn').click(SSShiftUpBtnClick);
        $('#SSShiftDownBtn').click(SSShiftDownBtnClick);

        $('#shiftAmount').keypress(function(event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
                event.preventDefault();
        });

        $('#collapserLink1').click(function(){
			$("#divWrappers1").slideToggle("fast");
            if($('#collapser1').attr('class') == "fa fa-caret-square-o-down"){
                $("#collapser1").removeClass("fa-caret-square-o-down");
                $("#collapser1").addClass("fa-caret-square-o-up");
            }
            else{
                $("#collapser1").removeClass("fa-caret-square-o-up");
                $("#collapser1").addClass("fa-caret-square-o-down");
            }
            saveSettingsToStorage();
        });

        W.selectionManager.events.register("selectionchanged", null, checkDisplayTool);

        var loadedSettings = $.parseJSON(localStorage.getItem("WME_SSUtil"));
        var defaultSettings = {
            divTop: "15%",
            divLeft: "25%",
            Expanded: true,
            DisconnectNodes: false // default to false (normal behavior)
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;

        $('#SSUtilWindow').css('left', _settings.divLeft);
        $('#SSUtilWindow').css('top', _settings.divTop);
        $('#chkDisconnectNodes').prop('checked', _settings.DisconnectNodes); // Set checkbox state from settings

        if(!_settings.Expanded){
            // $("#divWrappers1").removeClass("in");
            // $("#divWrappers1").addClass("collapse");
			$("#divWrappers1").hide();
            $("#collapser1").removeClass("fa-caret-square-o-up");
            $("#collapser1").addClass("fa-caret-square-o-down");
        }

        WazeWrap.Interface.ShowScriptUpdate("WME SS Util", GM_info.script.version, updateMessage, "https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js", "https://github.com/kid4rm90s/Segment-Shift-Utility");
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                divTop: "15%",
                divLeft: "25%",
                Expanded: true,
                DisconnectNodes: false // default value
            };

            settings.divLeft = $('#SSUtilWindow').css('left');
            settings.divTop = $('#SSUtilWindow').css('top');
            settings.Expanded = $("#collapser1").attr('class').indexOf("fa-caret-square-o-up") > -1;
            settings.DisconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Save checkbox state
            localStorage.setItem("WME_SSUtil", JSON.stringify(settings));
        }
    }

    function checkDisplayTool(){
        if(WazeWrap.hasSelectedFeatures() && WazeWrap.getSelectedFeatures()[0].WW.getType() === 'segment'){
            if(WazeWrap.getSelectedFeatures().length === 0)
                $('#SSUtilWindow').css({'visibility': 'hidden'});
            else{
                $('#SSUtilWindow').css({'visibility': 'visible'});
                if(typeof jQuery.ui !== 'undefined')
                    $('#SSUtilWindow' ).draggable({ //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
                        stop: function(event, ui) {
                            $('#SSUtilWindow').css("height", "");
                            saveSettingsToStorage();
                        }
                    });
            }
        }
        else{
            $('#SSUtilWindow').css({'visibility': 'hidden'});
            if(typeof jQuery.ui !== 'undefined')
                $('#SSUtilWindow' ).draggable({
                    stop: function(event, ui) {
                        $('#SSUtilWindow').css("height", "");
                        saveSettingsToStorage();
                    }
                });
        }
    }

    function ShiftSegmentNodesLat(latOffset) {
        var multiaction = new MultiAction();
        var selectedFeatures = WazeWrap.getSelectedFeatures();
        var disconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Checkbox state

        if (!disconnectNodes) {
            // Normal behavior: Shift segments and connected nodes

            var uniqueNodes = new Set();

            // 1. Collect Unique Nodes from Selected Segments
            for (let i = 0; i < selectedFeatures.length; i++) {
                var segObj = W.model.segments.getObjectById(selectedFeatures[i].WW.getObjectModel().attributes.id);
                if (!segObj) continue;
                uniqueNodes.add(segObj.attributes.fromNodeID);
                uniqueNodes.add(segObj.attributes.toNodeID);
            }

            // 2. Shift Unique Nodes
            for (let nodeId of uniqueNodes) {
                var node = W.model.nodes.objects[nodeId];
                if (!node) continue;

                var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
                newNodeGeometry.coordinates[1] += latOffset;

                var connectedSegObjs = {};
                var emptyObj = {};
                for (let j = 0; j < node.attributes.segIDs.length; j++) {
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = structuredClone(W.model.segments.getObjectById(segid).attributes.geoJSONGeometry);
                }
                multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, emptyObj));
            }
        } // else - if disconnectNodes is checked, we skip node shifting

        // 3. Update Segment Geometries (always update segment geometry)
        for (let i = 0; i < selectedFeatures.length; i++) {
            var segObj = W.model.segments.getObjectById(selectedFeatures[i].WW.getObjectModel().attributes.id);
            if (!segObj) continue;
            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            var originalLength = segObj.attributes.geoJSONGeometry.coordinates.length;

            if (disconnectNodes) {
                // Shift all points when disconnecting
                for (let j = 0; j < originalLength; j++) {
                    newGeometry.coordinates[j][1] += latOffset;
                }
            } else {
                // Shift only inner points when not disconnecting (normal behavior)
                for (let j = 1; j < originalLength - 1; j++) {
                    newGeometry.coordinates[j][1] += latOffset;
                }
            }
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
        }


        W.model.actionManager.add(multiaction);
    }


    function ShiftSegmentsNodesLong(longOffset) {
        var multiaction = new MultiAction();
        var selectedFeatures = WazeWrap.getSelectedFeatures();
        var disconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Checkbox state

        if (!disconnectNodes) {
            // Normal behavior: Shift segments and connected nodes

            var uniqueNodes = new Set();

            // 1. Collect Unique Nodes from Selected Segments
            for (let i = 0; i < selectedFeatures.length; i++) {
                var segObj = W.model.segments.getObjectById(selectedFeatures[i].WW.getObjectModel().attributes.id);
                if (!segObj) continue;
                uniqueNodes.add(segObj.attributes.fromNodeID);
                uniqueNodes.add(segObj.attributes.toNodeID);
            }

            // 2. Shift Unique Nodes
            for (let nodeId of uniqueNodes) {
                var node = W.model.nodes.objects[nodeId];
                if (!node) continue;

                var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
                newNodeGeometry.coordinates[0] += longOffset;

                var connectedSegObjs = {};
                var emptyObj = {};
                for (let j = 0; j < node.attributes.segIDs.length; j++) {
                    var segid = node.attributes.segIDs[j];
                    connectedSegObjs[segid] = structuredClone(W.model.segments.getObjectById(segid).attributes.geoJSONGeometry);
                }
                multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, emptyObj));
            }
        } // else - if disconnectNodes is checked, we skip node shifting


        // 3. Update Segment Geometries (always update segment geometry)
        for (let i = 0; i < selectedFeatures.length; i++) {
            var segObj = W.model.segments.getObjectById(selectedFeatures[i].WW.getObjectModel().attributes.id);
            if (!segObj) continue;

            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            var originalLength = segObj.attributes.geoJSONGeometry.coordinates.length;

            if (disconnectNodes) {
                // Shift all points when disconnecting
                for (let j = 0; j < originalLength; j++) {
                    newGeometry.coordinates[j][0] += longOffset;
                }
            } else {
                // Shift only inner points when not disconnecting (normal behavior)
                for (let j = 1; j < originalLength - 1; j++) {
                    newGeometry.coordinates[j][0] += longOffset;
                }
            }
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
        }

        W.model.actionManager.add(multiaction);
    }


    //Left
    function SSShiftLeftBtnClick(e){
        e.stopPropagation();
        var segObj = WazeWrap.getSelectedFeatures()[0];
         if (!segObj) return;
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS(-$('#shiftAmount').val(), convertedCoords.lon, convertedCoords.lat);
        ShiftSegmentsNodesLong(gpsOffsetAmount);
		WazeWrap.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the left.`, false, false, 2000);		
    }
    //Right
    function SSShiftRightBtnClick(e){
        e.stopPropagation();
         var segObj = WazeWrap.getSelectedFeatures()[0];
         if (!segObj) return;
        var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]);
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLongOffsetGPS($('#shiftAmount').val(), convertedCoords.lon, convertedCoords.lat);
        ShiftSegmentsNodesLong(gpsOffsetAmount);
		WazeWrap.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the right.`, false, false, 2000);
    }
    //Up
    function SSShiftUpBtnClick(e){
       e.stopPropagation();
       var segObj = WazeWrap.getSelectedFeatures()[0];
        if (!segObj) return;
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS($('#shiftAmount').val(), WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]));
        ShiftSegmentNodesLat(gpsOffsetAmount);
		WazeWrap.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the up.`, false, false, 2000);
    }
    //Down
    function SSShiftDownBtnClick(e){
        e.stopPropagation();
       var segObj = WazeWrap.getSelectedFeatures()[0];
        if (!segObj) return;
        var gpsOffsetAmount = WazeWrap.Geometry.CalculateLatOffsetGPS(-$('#shiftAmount').val(), WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]));
        ShiftSegmentNodesLat(gpsOffsetAmount);
		WazeWrap.Alerts.info('WME Segment Shift Utility', `The segments are shifted by <b>${$('#shiftAmount').val()} Metres</b> to the down.`, false, false, 2000);
    }

    function injectCss() {
        var css = [
            '.btnMoveNode {width=25px; height=25px; background-color:#92C3D3; cursor:pointer; padding:5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius:50%; -moz-border-radius:50%; -webkit-border-radius:50%; box-shadow:inset 0px 0px 20px -14px rgba(0,0,0,1); -moz-box-shadow:inset 0px 0px 20px -14px rgba(0,0,0,1); -webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);}',
            '.btnRotate { width=45px; height=45px; background-color:#92C3D3; cursor:pointer; padding: 5px; font-size:14px; border:thin outset black; border-style:solid; border-width: 1px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 20px -14px rgba(0,0,0,1);}'
        ].join(' ');
        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }

})();
