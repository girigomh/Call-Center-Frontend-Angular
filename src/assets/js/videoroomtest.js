// We import the settings.js file to know which address we should contact
// to talk to Janus, and optionally which STUN/TURN servers should be
// used as well. Specifically, that file defines the "server" and
// "iceServers" properties we'll pass when creating the Janus session.

/* global iceServers:readonly, Janus:readonly, server:readonly */

var janus = null;
var videocall = null;
var opaqueId = 'videocalltest-' + Janus.randomString(12);
let peerChats = [];
var localTracks = {},
  localVideos = 0,
  remoteTracks = {},
  remoteVideos = 0;
var bitrateTimer = null;
var spinner = null;

var audioenabled = false;
var videoenabled = false;

var myusername = null;
var yourusername = null;

var doSimulcast =
  getQueryStringValue('simulcast') === 'yes' ||
  getQueryStringValue('simulcast') === 'true';
var simulcastStarted = false;

$(document).ready(function () {
  // Initialize the library (console debug enabled)
  Janus.init({
    debug: true,
    callback: function () {
      // Use a button to start the demo
      $(this).attr('disabled', true).unbind('click');
      // Make sure the browser supports WebRTC
      if (!Janus.isWebrtcSupported()) {
        bootbox.alert('No WebRTC support... ');
        return;
      }
      // Create session
      janus = new Janus({
        server: server,
        iceServers: iceServers,
        // Should the Janus API require authentication, you can specify either the API secret or user token here too
        //		token: "mytoken",
        //	or
        //		apisecret: "serversecret",
        success: function () {
          // Attach to VideoCall plugin
          janus.attach({
            plugin: 'janus.plugin.videocall',
            opaqueId: opaqueId,
            success: function (pluginHandle) {
              $('#details').remove();
              videocall = pluginHandle;
              Janus.log(
                'Plugin attached! (' +
                  videocall.getPlugin() +
                  ', id=' +
                  videocall.getId() +
                  ')'
              );
              registerUsername();
              // Prepare the username registration
              // $('#videocall').removeClass('hide').show();
              // $('#login').removeClass('hide').show();
              // $('#registernow').removeClass('hide').show();
              // $('#register').click(registerUsername);
              // $('#username').focus();
              // $('#start').removeAttr('disabled').html("Stop")
              // 	.click(function() {
              // 		$(this).attr('disabled', true);
              // 		janus.destroy();
              // 	});
              // $('#start').click(registerUsername)
            },
            error: function (error) {
              Janus.error('  -- Error attaching plugin...', error);
              bootbox.alert('  -- Error attaching plugin... ' + error);
            },
            consentDialog: function (on) {
              Janus.debug(
                'Consent dialog should be ' + (on ? 'on' : 'off') + ' now'
              );
              if (on) {
                // Darken screen and show hint
                // $.blockUI({
                // 	message: '<div><img src="up_arrow.png"/></div>',
                // 	css: {
                // 		border: 'none',
                // 		padding: '15px',
                // 		backgroundColor: 'transparent',
                // 		color: '#aaa',
                // 		top: '10px',
                // 		left: (navigator.mozGetUserMedia ? '-100px' : '300px')
                // 	} });
              } else {
                // Restore screen
                // $.unblockUI();
              }
            },
            iceState: function (state) {
              Janus.log('ICE state changed to ' + state);
            },
            mediaState: function (medium, on, mid) {
              Janus.log(
                'Janus ' +
                  (on ? 'started' : 'stopped') +
                  ' receiving our ' +
                  medium +
                  ' (mid=' +
                  mid +
                  ')'
              );
            },
            webrtcState: function (on) {
              Janus.log(
                'Janus says our WebRTC PeerConnection is ' +
                  (on ? 'up' : 'down') +
                  ' now'
              );
              $('#videoleft').parent().unblock();
            },
            slowLink: function (uplink, lost, mid) {
              Janus.warn(
                'Janus reports problems ' +
                  (uplink ? 'sending' : 'receiving') +
                  ' packets on mid ' +
                  mid +
                  ' (' +
                  lost +
                  ' lost packets)'
              );
            },
            onmessage: function (msg, jsep) {
              Janus.debug(' ::: Got a message :::', msg);
              let result = msg['result'];
              if (result) {
                if (result['list']) {
                  let list = result['list'];
                  Janus.debug('Got a list of registered peers:', list);
                  for (let mp in list) {
                    Janus.debug('  >> [' + list[mp] + ']');
                  }
                } else if (result['event']) {
                  let event = result['event'];
                  Janus.log(result);
                  if (event === 'registered') {
                    myusername = escapeXmlTags(result['username']);
                    Janus.log('Successfully registered as ' + myusername + '!');
                    // $('#youok').removeClass('hide').show().html("Registered as '" + myusername + "'");
                    // Get a list of available peers, just for fun
                    videocall.send({ message: { request: 'list' } });
                    // Enable buttons to call now
                    $('#phone').removeClass('hide').show();
                    // $('#call').unbind('click').click(doCall);
                    $('#peer').focus();
                  } else if (event === 'calling') {
                    Janus.log('Waiting for the peer to answer...');
                    // TODO Any ringtone?
                    $('#ringtone')[0].play();
                    bootbox.alert('Waiting for the peer to answer...');
                  } else if (event === 'incomingcall') {
                    window.toCallPage();
                    Janus.log('Incoming call from ' + result['username'] + '!');
                    yourusername = escapeXmlTags(result['username']);
                    // Notify user
                    bootbox.hideAll();
                    bootbox.dialog({
                      message: 'Incoming call from ' + yourusername + '!',
                      title: 'Incoming call',
                      closeButton: false,

                      buttons: {
                        success: {
                          label: 'Answer',
                          className: 'btn-success',
                          callback: function () {
                            $('#peer')
                              .val(result['username'])
                              .attr('disabled', true);
                            videocall.createAnswer({
                              jsep: jsep,
                              // We want bidirectional audio and video, if offered,
                              // plus data channels too if they were negotiated
                              tracks: [
                                { type: 'audio', capture: true, recv: true },
                                { type: 'video', capture: true, recv: true },
                                { type: 'data' },
                              ],
                              success: function (jsep) {
                                Janus.debug('Got SDP!', jsep);
                                let body = { request: 'accept' };
                                videocall.send({ message: body, jsep: jsep });
                                $('#peer').attr('disabled', true);
                                $('#call')
                                  .removeAttr('disabled')
                                  .html('Hangup')
                                  .removeClass('btn-success')
                                  .addClass('btn-danger')
                                  .unbind('click')
                                  .click(doHangup);
                              },
                              error: function (error) {
                                Janus.error('WebRTC error:', error);
                                bootbox.alert(
                                  'WebRTC error... ' + error.message
                                );
                              },
                            });
                          },
                        },
                        danger: {
                          label: 'Decline',
                          className: 'btn-danger',
                          callback: function () {
                            doHangup();
                          },
                        },
                      },
                    });
                  } else if (event === 'accepted') {
                    bootbox.hideAll();
                    $('#ringtone')[0].pause();
                    $('#ringtone')[0].currentTime = 0;
                    let peer = escapeXmlTags(result['username']);
                    $('#videocall').removeClass('hide');
                    $('#callPageContainer').removeClass('flex-col');
                    $('#callPageContainer').addClass('flex-row-reverse');
                    // $('#messages_container').removeClass('hide')
                    $('#dataSandContainer').removeClass('hide');
                    $('#registerCallForm').addClass('hidden');
                    $('#callTitle').addClass('hidden');
                    $('#callSubTitle').addClass('hidden');
                    $('#stop').click(doHangup);
                    if (!peer) {
                      Janus.log('Call started!');
                    } else {
                      Janus.log(peer + ' accepted the call!');
                      yourusername = peer;
                    }
                    // Video call can start
                    if (jsep) videocall.handleRemoteJsep({ jsep: jsep });
                    $('#call')
                      .removeAttr('disabled')
                      .html('Hangup')
                      .removeClass('btn-success')
                      .addClass('btn-danger')
                      .unbind('click')
                      .click(doHangup);
                  } else if (event === 'update') {
                    // An 'update' event may be used to provide renegotiation attempts
                    if (jsep) {
                      if (jsep.type === 'answer') {
                        videocall.handleRemoteJsep({ jsep: jsep });
                      } else {
                        videocall.createAnswer({
                          jsep: jsep,
                          // We want bidirectional audio and video, if offered,
                          // plus data channels too if they were negotiated
                          tracks: [
                            { type: 'audio', capture: true, recv: true },
                            { type: 'video', capture: true, recv: true },
                            { type: 'data' },
                          ],
                          success: function (jsep) {
                            Janus.debug('Got SDP!', jsep);
                            let body = { request: 'set' };
                            videocall.send({ message: body, jsep: jsep });
                          },
                          error: function (error) {
                            Janus.error('WebRTC error:', error);
                            bootbox.alert('WebRTC error... ' + error.message);
                          },
                        });
                      }
                    }
                  } else if (event === 'hangup') {
                    // window.location.reload()
                    Janus.log(
                      'Call hung up by ' +
                        result['username'] +
                        ' (' +
                        result['reason'] +
                        ')!'
                    );
                    $('#ringtone')[0].pause();
                    $('#ringtone')[0].currentTime = 0;
                    $('#videocall').addClass('hide');
                    $('#registerCallForm').removeClass('hidden');
                    $('#callTitle').removeClass('hidden');
                    $('#callSubTitle').removeClass('hidden');
                    $('#callPageContainer').addClass('flex-col');
                    $('#dataSandContainer').addClass('hide');
                    $('#callPageContainer').removeClass('flex-row-reverse');
                    $('#peer').attr('disabled', false);
                    $('#peer').val('');
                    $('#call').html(
                      '<mat-icon class="text-white">videocam</mat-icon> Start'
                    );

                    // Reset status
                    bootbox.hideAll();
                    videocall.hangup();
                    if (spinner) spinner.stop();
                    $('#waitingvideo').remove();
                    $('#videos').hide();
                    $('#peer').removeAttr('disabled').val('');
                    $('#call')
                      .removeAttr('disabled')
                      .html('Call')
                      .removeClass('btn-danger')
                      .addClass('btn-success')
                      .unbind('click')
                      .click(doCall);
                    $('#toggleaudio').attr('disabled', true);
                    $('#togglevideo').attr('disabled', true);
                    $('#bitrate').attr('disabled', true);
                    $('#curbitrate').hide();
                    $('#curres').hide();
                  } else if (event === 'simulcast') {
                    // Is simulcast in place?
                    let substream = result['substream'];
                    let temporal = result['temporal'];
                    if (
                      (substream !== null && substream !== undefined) ||
                      (temporal !== null && temporal !== undefined)
                    ) {
                      if (!simulcastStarted) {
                        simulcastStarted = true;
                        addSimulcastButtons(result['videocodec'] === 'vp8');
                      }
                      // We just received notice that there's been a switch, update the buttons
                      updateSimulcastButtons(substream, temporal);
                    }
                  }
                }
              } else {
                // FIXME Error?
                let error = msg['error'];
                bootbox.alert(error);
                $('#peer').removeAttr('disabled').val('');
                $('#call').removeAttr('disabled').click(doCall);
                if (error.indexOf('already taken') > 0) {
                  // FIXME Use status codes...
                  $('#register')
                    .removeAttr('disabled')
                    .unbind('click')
                    .click(registerUsername);
                  $('#registerUser').removeClass('hidden');
                }
                $('#username').removeAttr('disabled');
                // TODO Reset status
                // $('#username').removeAttr('disabled').val(makerandomUsername(5));
                // registerUsername()
                console.log(msg);
                videocall.hangup();
                if (spinner) spinner.stop();
                $('#waitingvideo').remove();
                $('#videos').hide();
                $('#peer').removeAttr('disabled').val('');
                $('#call')
                  .removeAttr('disabled')
                  .html('Call')
                  .removeClass('btn-danger')
                  .addClass('btn-success')
                  .unbind('click')
                  .click(doCall);
                $('#toggleaudio').attr('disabled', true);
                $('#togglevideo').attr('disabled', true);
                $('#bitrate').attr('disabled', true);
                $('#curbitrate').hide();
                $('#curres').hide();
                if (bitrateTimer) clearInterval(bitrateTimer);
                bitrateTimer = null;
              }
            },
            onlocaltrack: function (track, on) {
              Janus.debug(
                'Local track ' + (on ? 'added' : 'removed') + ':',
                track
              );
              // We use the track ID as name of the element, but it may contain invalid characters
              let trackId = track.id.replace(/[{}]/g, '');
              if (!on) {
                // Track removed, get rid of the stream and the rendering
                let stream = localTracks[trackId];
                if (stream) {
                  try {
                    let tracks = stream.getTracks();
                    for (let i in tracks) {
                      let mst = tracks[i];
                      if (mst !== null && mst !== undefined) mst.stop();
                    }
                  } catch (e) {}
                }
                if (track.kind === 'video') {
                  $('#myvideo' + trackId).remove();
                  localVideos--;
                  if (localVideos === 0) {
                    // No video, at least for now: show a placeholder
                    if ($('#videoleft .no-video-container').length === 0) {
                      $('#videoleft').append(
                        '<div class="no-video-container">' +
                          '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                          '<span class="no-video-text">No webcam available</span>' +
                          '</div>'
                      );
                    }
                  }
                }
                delete localTracks[trackId];
                return;
              }
              // If we're here, a new track was added
              let stream = localTracks[trackId];
              if (stream) {
                // We've been here already
                return;
              }
              if ($('#videoleft video').length === 0) {
                $('#videos').removeClass('hide').show();
              }
              if (track.kind === 'audio') {
                // We ignore local audio tracks, they'd generate echo anyway
                if (localVideos === 0) {
                  // No video, at least for now: show a placeholder
                  if ($('#videoleft .no-video-container').length === 0) {
                    $('#videoleft').append(
                      '<div class="no-video-container">' +
                        '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                        '<span class="no-video-text">No webcam available</span>' +
                        '</div>'
                    );
                  }
                }
              } else {
                // New video track: create a stream out of it
                localVideos++;
                $('#videoleft .no-video-container').remove();
                stream = new MediaStream([track]);
                localTracks[trackId] = stream;
                Janus.log('Created local stream:', stream);
                $('#videoleft').append(
                  '<video class="rounded-full centered video-left-width object-cover" id="myvideo' +
                    trackId +
                    '" width="100%" height="100%" autoplay playsinline muted="muted"/>'
                );
                Janus.attachMediaStream($('#myvideo' + trackId).get(0), stream);
              }
              if (
                videocall.webrtcStuff.pc.iceConnectionState !== 'completed' &&
                videocall.webrtcStuff.pc.iceConnectionState !== 'connected'
              ) {
                $('#videoleft')
                  .parent()
                  .block({
                    message: '<b>Publishing...</b>',
                    css: {
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                    },
                  });
              }
            },
            onremotetrack: function (track, mid, on, metadata) {
              Janus.debug(
                'Remote track (mid=' +
                  mid +
                  ') ' +
                  (on ? 'added' : 'removed') +
                  (metadata ? ' (' + metadata.reason + ') ' : '') +
                  ':',
                track
              );
              if (!on) {
                // Track removed, get rid of the stream and the rendering
                $('#peervideo' + mid).remove();
                if (track.kind === 'video') {
                  remoteVideos--;
                  if (remoteVideos === 0) {
                    // No video, at least for now: show a placeholder
                    if ($('#videoright .no-video-container').length === 0) {
                      // $('#videoright').append(
                      // 	'<div class="no-video-container">' +
                      // 		'<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                      // 		'<span class="no-video-text">No remote video available</span>' +
                      // 	'</div>');
                      $('#videoright').append(`
														<div class="no-video-container">
															<div class="no-video-container-inner">
																<span>${$('#peer').val()[0].toUpperCase()}</span>
															</div>
														</div>
													`);
                    }
                  }
                }
                delete remoteTracks[mid];
                return;
              }
              if ($('#peervideo' + mid).length > 0) return;
              // If we're here, a new track was added
              let addButtons = false;
              if (
                $('#videoright audio').length === 0 &&
                $('#videoright video').length === 0
              ) {
                addButtons = true;
                $('#videos').removeClass('hide').show();
              }
              if (track.kind === 'audio') {
                // New audio track: create a stream out of it, and use a hidden <audio> element
                let stream = new MediaStream([track]);
                remoteTracks[mid] = stream;
                Janus.log('Created remote audio stream:', stream);
                $('#videoright').append(
                  '<audio class="hide" id="peervideo' +
                    mid +
                    '" autoplay playsinline/>'
                );
                Janus.attachMediaStream($('#peervideo' + mid).get(0), stream);
                if (remoteVideos === 0) {
                  // No video, at least for now: show a placeholder
                  if ($('#videoright .no-video-container').length === 0) {
                    $('#videoright').append(
                      '<div class="no-video-container">' +
                        '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                        '<span class="no-video-text">No webcam available</span>' +
                        '</div>'
                    );
                  }
                }
              } else {
                // New video track: create a stream out of it
                remoteVideos++;
                $('#videoright .no-video-container').remove();
                let stream = new MediaStream([track]);
                remoteTracks[mid] = stream;
                Janus.log('Created remote video stream:', stream);
                $('#videoright').append(
                  '<video class="centered h-full object-cover rounded-none" id="peervideo' +
                    mid +
                    '" width="100%" height="100%" autoplay playsinline/>'
                );
                $('#videoright').append(
                  '<span class="absolute top-1 left-1 inline-flex items-center justify-center px-4 py-2 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded">' +
                    $('#peer').val() +
                    '</span>'
                );
                Janus.attachMediaStream($('#peervideo' + mid).get(0), stream);
                // Note: we'll need this for additional videos too
                if (!bitrateTimer) {
                  $('#curbitrate').removeClass('hide').show();
                  bitrateTimer = setInterval(function () {
                    if (!$('#peervideo' + mid).get(0)) return;
                    // Display updated bitrate, if supported
                    let bitrate = videocall.getBitrate();
                    //~ Janus.debug("Current bitrate is " + videocall.getBitrate());
                    $('#curbitrate').text(bitrate);
                    // Check if the resolution changed too
                    let width = $('#peervideo' + mid).get(0).videoWidth;
                    let height = $('#peervideo' + mid).get(0).videoHeight;
                    if (width > 0 && height > 0)
                      $('#curres')
                        .removeClass('hide')
                        .text(width + 'x' + height)
                        .show();
                  }, 1000);
                }
              }
              if (!addButtons) return;
              // Enable audio/video buttons and bitrate limiter
              audioenabled = true;
              videoenabled = true;
              $('#toggleaudio')
                .removeAttr('disabled')
                .click(function () {
                  audioenabled = !audioenabled;
                  if (audioenabled)
                    $('#toggleaudio')
                      .html(`<svg xmlns="http://www.w3.org/2000/svg" class="fill-white" height="1em"
												viewBox="0 0 384 512">
												<path
												  d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
											  </svg>`);
                  else
                    $('#toggleaudio')
                      .html(`<svg xmlns="http://www.w3.org/2000/svg" class="fill-white"
												height="1em" viewBox="0 0 640 512">
												<path
												  d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z" />
											  </svg>`);
                  videocall.send({
                    message: { request: 'set', audio: audioenabled },
                  });
                });
              $('#togglevideo')
                .removeAttr('disabled')
                .click(function () {
                  videoenabled = !videoenabled;
                  if (videoenabled)
                    $('#togglevideo')
                      .html(`<svg xmlns="http://www.w3.org/2000/svg" class="fill-white"
												height="1em" viewBox="0 0 576 512">
												<path
												  d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
											  </svg>`);
                  else
                    $('#togglevideo')
                      .html(`<svg xmlns="http://www.w3.org/2000/svg" class="fill-white" height="1em"
												viewBox="0 0 640 512">
												<path
												  d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z" />
											  </svg>`);
                  videocall.send({
                    message: { request: 'set', video: videoenabled },
                  });
                });
              $('#toggleaudio').parent().removeClass('hide').show();
              $('#bitrate a')
                .removeAttr('disabled')
                .click(function () {
                  let id = $(this).attr('id');
                  let bitrate = parseInt(id) * 1000;
                  if (bitrate === 0) {
                    Janus.log('Not limiting bandwidth via REMB');
                  } else {
                    Janus.log('Capping bandwidth to ' + bitrate + ' via REMB');
                  }
                  $('#bitrateset')
                    .html($(this).html() + '<span class="caret"></span>')
                    .parent()
                    .removeClass('open');
                  videocall.send({
                    message: { request: 'set', bitrate: bitrate },
                  });
                  return false;
                });
            },
            // eslint-disable-next-line no-unused-vars
            ondataopen: function (label, protocol) {
              Janus.log('The DataChannel is available!');
              $('#videos').removeClass('hide').show();
              $('#datasend').removeAttr('disabled');
            },
            ondata: function (data) {
              Janus.log($('#peer').val());
              Janus.debug('We got data from the DataChannel!', data);
              peerChats.push({ from: $('#peer').val(), message: data });
              $('#messages_container ul').append(
                `<li class="text-left message-text"> ${$(
                  '#peer'
                ).val()} <span>${data}</span></li>`
              );
              sessionStorage.setItem('peerChat', JSON.stringify(peerChats));
              $('#datarecv').val(data);
            },
            oncleanup: function () {
              Janus.log(' ::: Got a cleanup notification :::');
              $('#videoleft').empty().parent().unblock();
              $('#videoright').empty();
              $('#callee').empty().hide();
              yourusername = null;
              $('#curbitrate').hide();
              $('#curres').hide();
              $('#videos').hide();
              $('#toggleaudio').attr('disabled', true);
              $('#togglevideo').attr('disabled', true);
              $('#bitrate').attr('disabled', true);
              $('#curbitrate').hide();
              $('#curres').hide();
              if (bitrateTimer) clearInterval(bitrateTimer);
              bitrateTimer = null;
              $('#videos').hide();
              simulcastStarted = false;
              $('#simulcast').remove();
              $('#peer').removeAttr('disabled').val('');
              $('#call')
                .removeAttr('disabled')
                .html('Call')
                .removeClass('btn-danger')
                .addClass('btn-success')
                .unbind('click')
                .click(doCall);
              localTracks = {};
              localVideos = 0;
              remoteTracks = {};
              remoteVideos = 0;
            },
          });
        },
        error: function (error) {
          Janus.error(error);
          bootbox.alert(error, function () {
            window.location.reload();
          });
        },
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
});

// eslint-disable-next-line no-unused-vars
function checkEnter(field, event) {
  let theCode = event.keyCode
    ? event.keyCode
    : event.which
    ? event.which
    : event.charCode;
  if (theCode == 13) {
    if (field.id == 'username') registerUsername();
    else if (field.id == 'peer') doCall();
    else if (field.id == 'datasend') sendData();
    $('#messages_container ul')[0].scrollIntoView({ behavior: 'smooth' });
    return false;
  } else {
    return true;
  }
}

function registerUsername() {
  let flag = 0;
  // Try a registration
  let userData;
  if (flag == 0) {
    userData = JSON.parse(localStorage.getItem('currentUser'));
    flag = 1;
  } else {
    userData = { firstname: $('#username').val() };
  }
  console.warn(userData, 'userdata');
  let register = {
    request: 'register',
    username: userData.firstName ? userData.firstName.split(' ')[0] : 'admin',
  };
  videocall.send({ message: register });
  return;
  $('#username').attr('disabled', true);
  $('#register').attr('disabled', true).unbind('click');
  let username = $('#username').val();
  if (username === '') {
    bootbox.alert('Insert a username to register (e.g., pippo)');
    $('#username').removeAttr('disabled');
    $('#register').removeAttr('disabled').click(registerUsername);
    return;
  }
  if (/[^a-zA-Z0-9]/.test(username)) {
    bootbox.alert('Input is not alphanumeric');
    $('#username').removeAttr('disabled').val('');
    $('#register').removeAttr('disabled').click(registerUsername);
    return;
  }
}

// function doCall() {
// 	console.log('call')
// 	if(!$("#peer").val().length){
// 		bootbox.alert("Please enter a name whom you want to call.")
// 		return
// 	}
// 	// return
// 	// Call someone
// 	$('#peer').attr('disabled', true);
// 	$('#call').attr('disabled', true).unbind('click');
// 	let username = $('#peer').val();
// 	if(username === "") {
// 		bootbox.alert("Insert a username to call (e.g., pluto)");
// 		$('#peer').removeAttr('disabled');
// 		$('#call').removeAttr('disabled').click(doCall);
// 		return;
// 	}
// 	if(/[^a-zA-Z0-9]/.test(username)) {
// 		bootbox.alert('Input is not alphanumeric');
// 		$('#peer').removeAttr('disabled').val("");
// 		$('#call').removeAttr('disabled').click(doCall);
// 		return;
// 	}
// 	// Call this user
// 	videocall.createOffer(
// 		{
// 			// We want bidirectional audio and video, plus data channels
// 			tracks: [
// 				{ type: 'audio', capture: true, recv: true },
// 				{ type: 'video', capture: true, recv: true, simulcast: doSimulcast },
// 				{ type: 'data' },
// 			],
// 			success: function(jsep) {
// 				Janus.debug("Got SDP!", jsep);
// 				// $('#registerCallForm').addClass('hidden')

// 				let body = { request: "call", username: $('#peer').val() };
// 				videocall.send({ message: body, jsep: jsep });
// 			},
// 			error: function(error) {
// 				$('#registerCallForm').removeClass('hidden')
// 				Janus.error("WebRTC error...", error);
// 				bootbox.alert("WebRTC error... " + error.message);
// 			}
// 		});
// }

function doHangup() {
  // Hangup a call
  // window.location.reload()
  $('#call').attr('disabled', true).unbind('click');
  $('#videocall').addClass('hide');
  $('#registerCallForm').removeClass('hidden');
  $('#callTitle').removeClass('hidden');
  $('#callSubTitle').removeClass('hidden');
  sessionStorage.clear();
  let hangup = { request: 'hangup' };
  videocall.send({ message: hangup });
  videocall.hangup();
  yourusername = null;
  // janus.destory()
}

function sendData() {
  let data = $('#datasend').val();
  if (data === '') {
    return;
  }
  peerChats.push({ from: $('#username').val(), message: data });
  $('#messages_container ul').append(
    `<li class="text-right message-text">you  <span>${data}</span></li>`
  );
  sessionStorage.setItem('peerChat', JSON.stringify(peerChats));
  videocall.data({
    text: data,
    messages: peerChats,
    error: function (reason) {
      bootbox.alert(reason);
    },
    success: function () {
      $('#datasend').val('');
    },
  });
}

// Helper to parse query string
function getQueryStringValue(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Helper to escape XML tags
function escapeXmlTags(value) {
  if (value) {
    let escapedValue = value.replace(new RegExp('<', 'g'), '&lt');
    escapedValue = escapedValue.replace(new RegExp('>', 'g'), '&gt');
    return escapedValue;
  }
}

// Helpers to create Simulcast-related UI, if enabled
function addSimulcastButtons(temporal) {
  $('#curres')
    .parent()
    .append(
      '<div id="simulcast" class="btn-group-vertical btn-group-vertical-xs pull-right">' +
        '	<div class"row">' +
        '		<div class="btn-group btn-group-xs" style="width: 100%">' +
        '			<button id="sl-2" type="button" class="btn btn-primary" data-toggle="tooltip" title="Switch to higher quality" style="width: 33%">SL 2</button>' +
        '			<button id="sl-1" type="button" class="btn btn-primary" data-toggle="tooltip" title="Switch to normal quality" style="width: 33%">SL 1</button>' +
        '			<button id="sl-0" type="button" class="btn btn-primary" data-toggle="tooltip" title="Switch to lower quality" style="width: 34%">SL 0</button>' +
        '		</div>' +
        '	</div>' +
        '	<div class"row">' +
        '		<div class="btn-group btn-group-xs hide" style="width: 100%">' +
        '			<button id="tl-2" type="button" class="btn btn-primary" data-toggle="tooltip" title="Cap to temporal layer 2" style="width: 34%">TL 2</button>' +
        '			<button id="tl-1" type="button" class="btn btn-primary" data-toggle="tooltip" title="Cap to temporal layer 1" style="width: 33%">TL 1</button>' +
        '			<button id="tl-0" type="button" class="btn btn-primary" data-toggle="tooltip" title="Cap to temporal layer 0" style="width: 33%">TL 0</button>' +
        '		</div>' +
        '	</div>' +
        '</div>'
    );
  if (Janus.webRTCAdapter.browserDetails.browser !== 'firefox') {
    // Chromium-based browsers only have two temporal layers
    $('#tl-2').remove();
    $('#tl-1').css('width', '50%');
    $('#tl-0').css('width', '50%');
  }
  // Enable the simulcast selection buttons
  $('#sl-0')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Switching simulcast substream, wait for it... (lower quality)',
        null,
        { timeOut: 2000 }
      );
      if (!$('#sl-2').hasClass('btn-success'))
        $('#sl-2').removeClass('btn-primary btn-info').addClass('btn-primary');
      if (!$('#sl-1').hasClass('btn-success'))
        $('#sl-1').removeClass('btn-primary btn-info').addClass('btn-primary');
      $('#sl-0')
        .removeClass('btn-primary btn-info btn-success')
        .addClass('btn-info');
      videocall.send({ message: { request: 'set', substream: 0 } });
    });
  $('#sl-1')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Switching simulcast substream, wait for it... (normal quality)',
        null,
        { timeOut: 2000 }
      );
      if (!$('#sl-2').hasClass('btn-success'))
        $('#sl-2').removeClass('btn-primary btn-info').addClass('btn-primary');
      $('#sl-1')
        .removeClass('btn-primary btn-info btn-success')
        .addClass('btn-info');
      if (!$('#sl-0').hasClass('btn-success'))
        $('#sl-0').removeClass('btn-primary btn-info').addClass('btn-primary');
      videocall.send({ message: { request: 'set', substream: 1 } });
    });
  $('#sl-2')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Switching simulcast substream, wait for it... (higher quality)',
        null,
        { timeOut: 2000 }
      );
      $('#sl-2')
        .removeClass('btn-primary btn-info btn-success')
        .addClass('btn-info');
      if (!$('#sl-1').hasClass('btn-success'))
        $('#sl-1').removeClass('btn-primary btn-info').addClass('btn-primary');
      if (!$('#sl-0').hasClass('btn-success'))
        $('#sl-0').removeClass('btn-primary btn-info').addClass('btn-primary');
      videocall.send({ message: { request: 'set', substream: 2 } });
    });
  if (!temporal)
    // No temporal layer support
    return;
  $('#tl-0').parent().removeClass('hide');
  $('#tl-0')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Capping simulcast temporal layer, wait for it... (lowest FPS)',
        null,
        { timeOut: 2000 }
      );
      if (!$('#tl-2').hasClass('btn-success'))
        $('#tl-2').removeClass('btn-primary btn-info').addClass('btn-primary');
      if (!$('#tl-1').hasClass('btn-success'))
        $('#tl-1').removeClass('btn-primary btn-info').addClass('btn-primary');
      $('#tl-0')
        .removeClass('btn-primary btn-info btn-success')
        .addClass('btn-info');
      videocall.send({ message: { request: 'set', temporal: 0 } });
    });
  $('#tl-1')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Capping simulcast temporal layer, wait for it... (medium FPS)',
        null,
        { timeOut: 2000 }
      );
      if (!$('#tl-2').hasClass('btn-success'))
        $('#tl-2').removeClass('btn-primary btn-info').addClass('btn-primary');
      $('#tl-1').removeClass('btn-primary btn-info').addClass('btn-info');
      if (!$('#tl-0').hasClass('btn-success'))
        $('#tl-0').removeClass('btn-primary btn-info').addClass('btn-primary');
      videocall.send({ message: { request: 'set', temporal: 1 } });
    });
  $('#tl-2')
    .removeClass('btn-primary btn-success')
    .addClass('btn-primary')
    .unbind('click')
    .click(function () {
      toastr.info(
        'Capping simulcast temporal layer, wait for it... (highest FPS)',
        null,
        { timeOut: 2000 }
      );
      $('#tl-2')
        .removeClass('btn-primary btn-info btn-success')
        .addClass('btn-info');
      if (!$('#tl-1').hasClass('btn-success'))
        $('#tl-1').removeClass('btn-primary btn-info').addClass('btn-primary');
      if (!$('#tl-0').hasClass('btn-success'))
        $('#tl-0').removeClass('btn-primary btn-info').addClass('btn-primary');
      videocall.send({ message: { request: 'set', temporal: 2 } });
    });
}

function updateSimulcastButtons(substream, temporal) {
  // Check the substream
  if (substream === 0) {
    toastr.success('Switched simulcast substream! (lower quality)', null, {
      timeOut: 2000,
    });
    $('#sl-2').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#sl-1').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#sl-0')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
  } else if (substream === 1) {
    toastr.success('Switched simulcast substream! (normal quality)', null, {
      timeOut: 2000,
    });
    $('#sl-2').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#sl-1')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
    $('#sl-0').removeClass('btn-primary btn-success').addClass('btn-primary');
  } else if (substream === 2) {
    toastr.success('Switched simulcast substream! (higher quality)', null, {
      timeOut: 2000,
    });
    $('#sl-2')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
    $('#sl-1').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#sl-0').removeClass('btn-primary btn-success').addClass('btn-primary');
  }
  // Check the temporal layer
  if (temporal === 0) {
    toastr.success('Capped simulcast temporal layer! (lowest FPS)', null, {
      timeOut: 2000,
    });
    $('#tl-2').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#tl-1').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#tl-0')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
  } else if (temporal === 1) {
    toastr.success('Capped simulcast temporal layer! (medium FPS)', null, {
      timeOut: 2000,
    });
    $('#tl-2').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#tl-1')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
    $('#tl-0').removeClass('btn-primary btn-success').addClass('btn-primary');
  } else if (temporal === 2) {
    toastr.success('Capped simulcast temporal layer! (highest FPS)', null, {
      timeOut: 2000,
    });
    $('#tl-2')
      .removeClass('btn-primary btn-info btn-success')
      .addClass('btn-success');
    $('#tl-1').removeClass('btn-primary btn-success').addClass('btn-primary');
    $('#tl-0').removeClass('btn-primary btn-success').addClass('btn-primary');
  }

  function makerandomUsername(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
