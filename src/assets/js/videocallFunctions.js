$(document).ready(() => {
  $('#call').click(doCall);
});
function doCall() {
  console.log('call', $('#peer'));
  $('#call').hide();
  if (!$('#peer').val().length) {
    bootbox.alert('Please enter a name whom you want to call.');
    return;
  }
  // return
  // Call someone
  $('#peer').attr('disabled', true);
  $('#call').attr('disabled', true).unbind('click');
  let username = $('#peer').val();
  console.log('find username', username);
  if (username === '') {
    bootbox.alert('Insert a username to call (e.g., pluto)');
    $('#peer').removeAttr('disabled');
    $('#call').removeAttr('disabled').click(doCall);
    return;
  }
  if (/[^a-zA-Z0-9]/.test(username)) {
    bootbox.alert('Input is not alphanumeric');
    $('#peer').removeAttr('disabled').val('');
    $('#call').removeAttr('disabled').click(doCall);
    return;
  }
  // Call this user
  console.log('pass----', username);
  videocall.createOffer({
    // We want bidirectional audio and video, plus data channels
    tracks: [
      { type: 'audio', capture: true, recv: true },
      { type: 'video', capture: true, recv: true, simulcast: true },
      { type: 'data' },
    ],

    success: function (jsep) {
      console.log('createoffer----------------');
      Janus.debug('Got SDP!', jsep);
      // $('#registerCallForm').addClass('hidden')

      let body = { request: 'call', username: $('#peer').val() };
      console.log('body-------', body);
      videocall.send({ message: body, jsep: jsep });
      bootbox.alert(body);
    },
    error: function (error) {
      console.log('createoffer------error');
      $('#registerCallForm').removeClass('hidden');

      Janus.error('WebRTC error...', error);
      bootbox.alert('WebRTC error... ' + error.message);
    },
  });
}
