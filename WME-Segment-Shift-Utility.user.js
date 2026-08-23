// ==UserScript==
// @name         WME Segment Shift Utility
// @namespace    https://github.com/kid4rm90s/Segment-Shift-Utility
// @version      2026.08.23.02
// @description  Utility for shifting street segments in WME without disconnecting nodes
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/*
// @author       kid4rm90s
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @icon         data:image/png;base64,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
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @require      https://cdn.jsdelivr.net/gh/wazeSpace/wme-sdk-plus@06108853094d40f67e923ba0fe0de31b1cec4412/wme-sdk-plus.js
// @exclude      https://cdn.jsdelivr.net/gh/WazeSpace/wme-sdk-plus@latest/wme-sdk-plus.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @downloadURL  https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.user.js
// @updateURL    https://update.greasyfork.org/scripts/537258/WME%20Segment%20Shift%20Utility.meta.js
// @license      MIT
// ==/UserScript==

/* global getWmeSdk */
/* global initWmeSdkPlus */
/* global WazeToastr */
/* global turf */
/* global $ */
/* global jQuery */
/* global I18n */
/* eslint curly: ["warn", "multi-or-nest"] */

/*Scripts modified from WME RA Util (https://greasyfork.org/en/scripts/23616-wme-ra-util)
orgianl author: JustinS83 Waze*/
(function () {
  const updateMessage = ' <strong>Fixed :</strong><br> - Added support for shifting node A/B only.';
  const scriptVersion = GM_info.script.version.toString();
  const scriptName = GM_info.script.name;
  const downloadUrl = GM_info.script.downloadURL;
  const forumURL = 'https://greasyfork.org/scripts/537258-segment-shift-utility/feedback';

  const DIRECTION = {
    NORTH: 0,
    EAST: 90,
    SOUTH: 180,
    WEST: 270,
  };

  let sdk;
  let _settings;

  async function bootstrap() {
    const wmeSdk = getWmeSdk({ scriptId: 'wme-ss-util', scriptName: 'WME SS Util' });
    // NOTE: wme-sdk-plus is required ONLY for sdk.Editing.doActions() grouped-undo.
    // The base WME SDK has no transaction API (only save/undo/undoAll/redo), so
    // without SDK+ each moveNode/updateSegment becomes a separate undo step.
    const sdkPlus = await initWmeSdkPlus(wmeSdk, {
      hooks: ['Editing.Transactions'],
    });
    sdk = sdkPlus || wmeSdk;
    sdk.Events.once({ eventName: 'wme-ready' }).then(() => {
      init();
    });
  }

  function waitForWME() {
    if (!unsafeWindow.SDK_INITIALIZED) {
      setTimeout(waitForWME, 500);
      return;
    }
    unsafeWindow.SDK_INITIALIZED.then(bootstrap);
  }
  waitForWME();

function scriptupdatemonitor() {
  if (WazeToastr?.Ready) {
    // Create and start the ScriptUpdateMonitor
    const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);

    // Check immediately on page load, then every 2 hours
    updateMonitor.start(2, true); // checkImmediately = true

    // Show the update dialog for the current version
    WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl);
  } else {
    setTimeout(scriptupdatemonitor, 250);
  }
}
  scriptupdatemonitor();
  
  function init() {
    console.log('SS UTIL', GM_info.script);
    injectCss();
    // UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry'); // Replaced by SDK
    // MoveNode = require("Waze/Action/MoveNode"); // Replaced by SDK
    // MultiAction = require("Waze/Action/MultiAction"); // Replaced by SDK

    SSUtilWindow = document.createElement('div');
    SSUtilWindow.id = 'SSUtilWindow'; // Consistent ID
    SSUtilWindow.style.position = 'fixed';
    SSUtilWindow.style.visibility = 'hidden';
    SSUtilWindow.style.top = '15%';
    SSUtilWindow.style.left = '25%';
    SSUtilWindow.style.width = '285px';
    SSUtilWindow.style.zIndex = 100;
    SSUtilWindow.style.backgroundColor = '#FFFFFE';
    SSUtilWindow.style.borderWidth = '0px';
    SSUtilWindow.style.borderStyle = 'solid';
    SSUtilWindow.style.borderRadius = '10px';
    SSUtilWindow.style.boxShadow = '5px 5px 10px Silver';
    SSUtilWindow.style.padding = '4px';

    let SSUtilWindowHTML =
      '<div id="header" style="padding: 4px; background-color:#92C3D3; border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; color: white; font-weight: bold; text-align:center; letter-spacing: 1px;text-shadow: black 0.1em 0.1em 0.2em;"><img src="https://storage.googleapis.com/wazeopedia-files/1/1e/RA_Util.png" style="float:left"></img> Segment Shift Utility <a data-toggle="collapse" href="#divWrappers1" id="collapserLink1" style="float:right"><span id="collapser1" style="cursor:pointer;padding:2px;color:white;" class="fa fa-caret-square-o-up"></a></span></div>';
    // start collapse // I put it al the beginning
    SSUtilWindowHTML += '<div id="divWrappers1" class="collapse in">';

    //***************** Shift Amount **************************
    // Define BOX
    SSUtilWindowHTML += '<div style="display:flex; align-items:flex-start; gap:5px; flex-wrap:nowrap;">';
    SSUtilWindowHTML +=
      '<div id="contentShift" style="text-align:center; width: 120px;height: 170px;margin: 1em 5px 0px 0px;opacity:1;border-radius: 2px;-moz-border-radius: 2px;-webkit-border-radius: 4px;border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;}">';
    SSUtilWindowHTML +=
      '<b>Shift amount</b></br><input type="text" name="shiftAmount" id="shiftAmount" size="1" style="float: left; text-align: center;font: inherit; line-height: normal; width: 30px; height: 20px; margin: 5px 4px; box-sizing: border-box; display: block; padding-left: 0; border-bottom-color: rgba(black,.3); background: transparent; outline: none; color: black;" value="1"/> <div style="margin: 5px 4px;">Metre(s)';
    // Shift amount controls
    SSUtilWindowHTML +=
      '<div id="controls" style="text-align:center; padding:06px 4px;width=100px; height=100px;margin: 5px 0px;border-style:solid; border-width: 2px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-moz-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1);-webkit-box-shadow: inset 0px 0px 50px -14px rgba(0,0,0,1); background:#92C3D3;align:center;">';
    //Single Shift Up Button
    SSUtilWindowHTML += '<span id="SSShiftUpBtn" style="cursor:pointer;font-size:14px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-up fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: top;"> </i>';
    SSUtilWindowHTML += '<span id="UpBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span><br>';
    //Single Shift Left Button
    SSUtilWindowHTML += '<span id="SSShiftLeftBtn" style="cursor:pointer;font-size:14px;margin-left:-40px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-left fa-2x" style="color: white; text-shadow: black 0.1em 0.1em 0.2em; vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="LeftBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span>';
    //Single Shift Right Button
    SSUtilWindowHTML += '<span id="SSShiftRightBtn" style="float: right;cursor:pointer;font-size:14px;margin-right:5px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-right fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="RightBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span><br>';
    //Single Shift Down Button
    SSUtilWindowHTML += '<span id="SSShiftDownBtn" style="cursor:pointer;font-size:14px;margin-top:0px;">';
    SSUtilWindowHTML += '<i class="fa fa-angle-double-down fa-2x" style="color: white;text-shadow: black 0.1em 0.1em 0.2em;  vertical-align: middle"> </i>';
    SSUtilWindowHTML += '<span id="DownBtnCaption" style="font-weight: bold;"></span>';
    SSUtilWindowHTML += '</span>';
    SSUtilWindowHTML += '</div></div></div>'; // close #controls, #Metre(s), and #contentShift
    //***************** Shift Target (right side) & Disconnect Nodes **************************
    SSUtilWindowHTML +=
      '<div id="contentTarget" style="flex:1; min-width:0; text-align:left; margin: 1em 0px 0px 0px; border-radius: 2px; border-width:1px;border-style:solid;border-color:#92C3D3;padding:2px;">';
    SSUtilWindowHTML += '<b>Shift target</b><br>';
    SSUtilWindowHTML += '<label style="white-space: nowrap;"><input type="radio" name="shiftTarget" value="whole" checked> Whole Segment</label><br>';
    SSUtilWindowHTML += '<label style="white-space: nowrap;"><input type="radio" name="shiftTarget" value="nodeA"> Shift Node A</label><br>';
    SSUtilWindowHTML += '<label style="white-space: nowrap;"><input type="radio" name="shiftTarget" value="nodeB"> Shift Node B</label>';
    SSUtilWindowHTML += '<p style="margin: 8px 0px 0px 0px;"><input type="checkbox" id="chkDisconnectNodes"> Disconnect Nodes</p>';
    SSUtilWindowHTML += '</div>'; // close #contentTarget
    SSUtilWindowHTML += '</div>'; // close flex wrapper
    SSUtilWindowHTML += '</div>'; // close #divWrappers1

    SSUtilWindow.innerHTML = SSUtilWindowHTML;
    document.body.appendChild(SSUtilWindow);

    $('#SSShiftLeftBtn').click(SSShiftLeftClick);
    $('#SSShiftRightBtn').click(SSShiftRightClick);
    $('#SSShiftUpBtn').click(SSShiftUpClick);
    $('#SSShiftDownBtn').click(SSShiftDownClick);

    $('#shiftAmount').keypress(function (event) {
      if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
    });

    // Keyboard shortcut support for direction shift (Alt+Arrow)
    document.addEventListener(
      'keydown',
      function (e) {
        if (!e.altKey) return;
        // Prevent triggering only while typing in a text field (e.g. shift amount),
        // but allow shortcuts when focus is on radio buttons / checkboxes.
        const t = e.target;
        const isTextEntry =
          t &&
          (t.tagName === 'TEXTAREA' ||
            (t.tagName === 'INPUT' && /^(text|number|search|email|password|url|tel)$/i.test(t.type || '')));
        if (isTextEntry) return;
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            SSShiftLeftClick(e);
            break;
          case 'ArrowRight':
            e.preventDefault();
            SSShiftRightClick(e);
            break;
          case 'ArrowUp':
            e.preventDefault();
            SSShiftUpClick(e);
            break;
          case 'ArrowDown':
            e.preventDefault();
            SSShiftDownClick(e);
            break;
        }
      },
      false
    );

    $('#collapserLink1').click(function () {
      $('#divWrappers1').slideToggle('fast');
      if ($('#collapser1').attr('class') == 'fa fa-caret-square-o-down') {
        $('#collapser1').removeClass('fa-caret-square-o-down');
        $('#collapser1').addClass('fa-caret-square-o-up');
      } else {
        $('#collapser1').removeClass('fa-caret-square-o-up');
        $('#collapser1').addClass('fa-caret-square-o-down');
      }
      saveSettingsToStorage();
    });

    const loadedSettings = JSON.parse(localStorage.getItem('WME_SSUtil'));
    const defaultSettings = {
      divTop: '15%',
      divLeft: '25%',
      Expanded: true,
      DisconnectNodes: false, // default to false (normal behavior)
    };
    _settings = loadedSettings ?? defaultSettings;

    $('#SSUtilWindow').css('left', _settings.divLeft);
    $('#SSUtilWindow').css('top', _settings.divTop);
    $('#chkDisconnectNodes').prop('checked', _settings.DisconnectNodes); // Set checkbox state from settings
    $('input[name=shiftTarget][value="whole"]').prop('checked', true); // Always start on Whole Segment
    updateDisconnectEnabled(); // Apply auto-disable based on current mode
    $('input[name=shiftTarget]').on('change', updateDisconnectEnabled);

    if (!_settings.Expanded) {
      $('#divWrappers1').hide();
      $('#collapser1').removeClass('fa-caret-square-o-up');
      $('#collapser1').addClass('fa-caret-square-o-down');
    }

    sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: checkDisplayTool });
  }

  function saveSettingsToStorage() {
    if (localStorage) {
      _settings.divLeft = $('#SSUtilWindow').css('left');
      _settings.divTop = $('#SSUtilWindow').css('top');
      _settings.Expanded = $('#collapser1').attr('class').indexOf('fa-caret-square-o-up') > -1;
      _settings.DisconnectNodes = $('#chkDisconnectNodes').is(':checked'); // Save checkbox state
      localStorage.setItem('WME_SSUtil', JSON.stringify(_settings));
    }
  }

  function updateDisconnectEnabled() {
    const isWhole = $('input[name=shiftTarget]:checked').val() === 'whole';
    $('#chkDisconnectNodes').prop('disabled', !isWhole);
  }

  function checkDisplayTool() {
    if (sdk.Editing.getSelection()?.objectType === 'segment') {
      if (sdk.Editing.getSelection().length === 0) {
        $('#SSUtilWindow').css({ visibility: 'hidden' });
      } else {
        $('#SSUtilWindow').css({ visibility: 'visible' });
        if (typeof jQuery.ui !== 'undefined') {
          $('#SSUtilWindow').draggable({
            //Gotta nuke the height setting the dragging inserts otherwise the panel cannot collapse
            stop: () => {
              $('#SSUtilWindow').css('height', '');
              saveSettingsToStorage();
            },
          });
        }
      }
    } else {
      $('#SSUtilWindow').css({ visibility: 'hidden' });
      if (typeof jQuery.ui !== 'undefined') {
        $('#SSUtilWindow').draggable({
          stop: () => {
            $('#SSUtilWindow').css('height', '');
            saveSettingsToStorage();
          },
        });
      }
    }
  }

  function performShift(shiftBearing) {
    const selectedSegmentIds = sdk.Editing.getSelection()?.ids;
    if (!selectedSegmentIds || selectedSegmentIds.length === 0) {
      return;
    }

    const numOffset = parseFloat($('#shiftAmount').val());
    if (isNaN(numOffset)) {
      console.error('SS UTIL: Invalid shift amount.');
      return;
    }

    const shiftDistance = Math.abs(numOffset);
    const mode = $('input[name=shiftTarget]:checked').val(); // 'whole' | 'nodeA' | 'nodeB'
    const disconnectNodes = mode === 'whole' && $('#chkDisconnectNodes').is(':checked');
    const description =
      mode === 'whole' ? 'Shifted segments' : `Shifted node ${mode === 'nodeA' ? 'A' : 'B'}`;

    sdk.Editing.doActions(() => {
      if (mode === 'whole') {
        // ----- Whole Segment: shift entire segment(s) -----
        const uniqueNodeIds = new Set();

        if (!disconnectNodes) {
          // Collect unique nodes from selected segments
          for (const segmentId of selectedSegmentIds) {
            const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
            if (currentSegment) {
              uniqueNodeIds.add(currentSegment.fromNodeId);
              uniqueNodeIds.add(currentSegment.toNodeId);
            }
          }

          // Shift unique nodes
          for (const nodeId of uniqueNodeIds) {
            const node = sdk.DataModel.Nodes.getById({ nodeId });
            if (node) {
              const newNodeGeometry = structuredClone(node.geometry);
              const currentNodePoint = node.geometry.coordinates;
              const newNodePoint = turf.destination(currentNodePoint, shiftDistance, shiftBearing, { units: 'meters' });
              newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;
              sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
            }
          }
        }

        // Update Segment Geometries
        for (const segmentId of selectedSegmentIds) {
          const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
          if (currentSegment) {
            const newGeometry = structuredClone(currentSegment.geometry);
            const originalLength = currentSegment.geometry.coordinates.length;

            if (disconnectNodes) {
              // Shift all points including end nodes
              for (let j = 0; j < originalLength; j++) {
                const currentPoint = currentSegment.geometry.coordinates[j];
                const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
                newGeometry.coordinates[j] = newPoint.geometry.coordinates;
              }
            } else {
              // Shift only inner points
              for (let j = 1; j < originalLength - 1; j++) {
                const currentPoint = currentSegment.geometry.coordinates[j];
                const newPoint = turf.destination(currentPoint, shiftDistance, shiftBearing, { units: 'meters' });
                newGeometry.coordinates[j] = newPoint.geometry.coordinates;
              }
              // Update end points to match (potentially) moved nodes
              const fromNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.fromNodeId });
              const toNodeAfterMove = sdk.DataModel.Nodes.getById({ nodeId: currentSegment.toNodeId });

              if (fromNodeAfterMove && newGeometry.coordinates.length > 0) {
                newGeometry.coordinates[0] = fromNodeAfterMove.geometry.coordinates;
              }
              if (toNodeAfterMove && newGeometry.coordinates.length > 1) {
                newGeometry.coordinates[originalLength - 1] = toNodeAfterMove.geometry.coordinates;
              }
            }
            sdk.DataModel.Segments.updateSegment({ segmentId: currentSegment.id, geometry: newGeometry });
          }
        }
      } else {
        // ----- Node A / Node B: move only the chosen node -----
        const isNodeA = mode === 'nodeA';
        const pickNodeId = (seg) => (isNodeA ? seg.fromNodeId : seg.toNodeId);
        const nodeIdSet = new Set();

        for (const segmentId of selectedSegmentIds) {
          const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
          if (currentSegment) {
            const nodeId = pickNodeId(currentSegment);
            if (nodeId) nodeIdSet.add(nodeId);
          }
        }

        // Move unique nodes
        for (const nodeId of nodeIdSet) {
          const node = sdk.DataModel.Nodes.getById({ nodeId });
          if (node) {
            const newNodeGeometry = structuredClone(node.geometry);
            const newNodePoint = turf.destination(node.geometry.coordinates, shiftDistance, shiftBearing, { units: 'meters' });
            newNodeGeometry.coordinates = newNodePoint.geometry.coordinates;
            sdk.DataModel.Nodes.moveNode({ id: node.id, geometry: newNodeGeometry });
          }
        }

        // Snap each segment's corresponding endpoint to the moved node
        for (const segmentId of selectedSegmentIds) {
          const currentSegment = sdk.DataModel.Segments.getById({ segmentId });
          if (currentSegment) {
            const nodeId = pickNodeId(currentSegment);
            const movedNode = nodeId ? sdk.DataModel.Nodes.getById({ nodeId }) : null;
            if (!movedNode) continue;

            const newGeometry = structuredClone(currentSegment.geometry);
            const idx = isNodeA ? 0 : currentSegment.geometry.coordinates.length - 1;
            newGeometry.coordinates[idx] = movedNode.geometry.coordinates;
            sdk.DataModel.Segments.updateSegment({ segmentId: currentSegment.id, geometry: newGeometry });
          }
        }
      }
    }, description);
  }

  function getShiftAlertMessage(directionText) {
    const mode = $('input[name=shiftTarget]:checked').val();
    const amount = $('#shiftAmount').val();
    if (mode === 'whole') {
      return `The segments are shifted by <b>${amount}</b> Metres ${directionText}.`;
    }
    const nodeLabel = mode === 'nodeA' ? 'Node A' : 'Node B';
    return `${nodeLabel} is shifted by <b>${amount}</b> Metres ${directionText}.`;
  }

  //Left
  function SSShiftLeftClick(e) {
    e.stopPropagation();
    performShift(DIRECTION.WEST);
    WazeToastr.Alerts.info('WME Segment Shift Utility', getShiftAlertMessage('to the left'), false, false, 1500);
  }
  //Right
  function SSShiftRightClick(e) {
    e.stopPropagation();
    performShift(DIRECTION.EAST);
    WazeToastr.Alerts.info('WME Segment Shift Utility', getShiftAlertMessage('to the right'), false, false, 1500);
  }
  //Up
  function SSShiftUpClick(e) {
    e.stopPropagation();
    performShift(DIRECTION.NORTH);
    WazeToastr.Alerts.info('WME Segment Shift Utility', getShiftAlertMessage('to the up'), false, false, 1500);
  }
  //Down
  function SSShiftDownClick(e) {
    e.stopPropagation();
    performShift(DIRECTION.SOUTH);
    WazeToastr.Alerts.info('WME Segment Shift Utility', getShiftAlertMessage('to the down'), false, false, 1500);
  }

  function injectCss() {
    const css = [].join(' '); // No custom CSS needed if these were the only ones
    $('<style type="text/css">' + css + '</style>').appendTo('head');
  }
  /*
  Changelog
  2026.08.23.02
  - Added support for shifting node A/B only.
  2025.07.04.01
  -  Added keyboard shortcuts (Alt + Arrow keys) for quick segment shifting in all four directions. This improves workflow speed and matches the behavior of other WME utility scripts.
  */
})();
