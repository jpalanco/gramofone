//############################ Login #############################

var login_result = function login_resultF(result) {
	if (result.code === 0) {
		get_status();
		$("#loginpage").hide();
	} else {
		$("#name, #password").addClass("errorInput");
		$(".login").addClass("ko");
	}
};

var login_user = function login_userF() {
	var cred = new wuapi_Credentials();
	cred.username = "admin";
	cred.password = document.getElementById("password").value;
	var callparams = new wuapi_CallParams();
	callparams.user_cb = login_result;
	callparams.args = cred;
	wuapi_login(callparams);
};

//----------------------------------------------------------------

//############################ Logout ############################

var logout_result = function logout_resultF(result) {
	$("#password").val("");
	show_login();
};

var logout_user = function logout_userF() {
	var callparams = new wuapi_CallParams();
	callparams.user_cb = logout_result;
	wuapi_logout(callparams);
	return false;
};

//----------------------------------------------------------------

//########################## Get Status ##########################

var _ready = 0;
var _old_ssid;
var _old_key;
var _old_enc;
var _old_mode;
var print_wifipriv_status = function print_wifipriv_statusF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$(".privssid").val(result.extra.ssid);
			if (result.extra.encryption !== "none") {
				$(".privpass").val(result.extra.key);
				$(".privpassfield").show();
			} else {
				$(".privpassfield").hide();
			}
			get_gramoname();
		} else {// If error retry again
			get_wifipriv_status();
		}
	}
};

var get_wifipriv_status = function get_wifipriv_statusF() {
	var params = new wuapi_CallParams();
	params.user_cb = print_wifipriv_status;
	wuapi_get_private_interface(params);
};

var print_mode_status = function print_mode_statusF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			_current_mode = result.extra.netmode;
			_old_mode = _current_mode;
			if (_current_mode > 1) {
				_old_ssid = result.extra.ssid;
				_old_key = result.extra.key;
				_old_enc = result.extra.encryption;
			}
			_ready = 1;
			show_homepage();
		} else {// If error retry again
			get_mode_status();
		}
	}
};

var get_mode_status = function get_mode_statusF() {
	var params = new wuapi_CallParams();
	params.user_cb = print_mode_status;
	wuapi_get_inet_info(params);
};

var print_led_status = function print_led_statusF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			switch (result.extra.name) {
				case "wifiwanok":
				case "netok":
					$("#ledstat").html('<p>Status <span class="on"></span> Connected</p>');
					break;
				case "playing":
					$("#ledstat").html('<p>Status <span class="on"></span> playing</p>');
					break;
				case "mute":
					$("#ledstat").html('<p>Status <span class="on"></span> mute</p>');
					break;
				case "action_wps":
				case "wps":
				case "on-wps":
				case "on_wps":
					$("#ledstat").html('<p>Status <span class="on"></span> Sync WPS On</p>');
					break;
				case "action_audio":
					$("#ledstat").html('<p>Status <span class="on"></span> Action Audio</p>');
					break;
				case "":
					break;
				default:
					$("#ledstat").html('<p>Status <span class="off"></span> Disconnected</p>');
					break;
			}
		}
	}
};

var get_led_status = function get_led_statusF() {
	var params = new wuapi_CallParams();
	params.user_cb = print_led_status;
	wuapi_get_ledstatus(params);
};

var print_gramoname = function print_gramoname(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$("#gramoname").html(result.extra.spotifyname);
			get_mode_status();
		} else {// If error retry again
			get_gramoname();
		}
	}
};

var get_gramoname = function get_gramonameF() {
	var params = new wuapi_CallParams();
	params.user_cb = print_gramoname;
	wuapi_get_gramoname(params);
};

var result_set_gramoname = function result_set_gramonameF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$("#gramoname").html($("#gramonameid").val());
			show_homepage();
		} else {
			if (result.code === 2) {
				$(".error").show();
				$(".error").text("Error: Gramofon name size must be between 1 and 63 characters.");
			}
		}
	}
};

var set_gramoname = function set_gramonameF() {
	var params = new wuapi_CallParams();
	params.user_cb = result_set_gramoname;
	params.args = new wuapi_Gramofon_Name();
	params.args.mdnsname = $("#gramonameid").val();
	params.args.spotifyname = $("#gramonameid").val();
	wuapi_set_gramoname(params);
	return false;
};

var get_status = function get_statusF() {
	$(".modal_complete").fadeIn(300);
	$("#fade").fadeIn(300);
	$("#loadingtext").text("Updating Status.");
	get_wifipriv_status();
};

//----------------------------------------------------------------

//########################### Set Mode ###########################

var _current_mode;
var _target_mode;
var _step = 0;
var _changes = false;
var _wcli_tries = 8;
var _wcli_tries_timeout = 1000;

var is_wcli_up_cb = function is_wcli_up_cbF(result) {
	if (_wcli_tries-- > 0) {
		if ( typeof result.extra.address !== 'undefined') {
			if (_step === 0) {
				_step++;
				$(".modal_complete").fadeOut(300);
				$("#fade").fadeOut(300);
				$(".error").hide();
				$("#loadingtext").text("Applying New Settings.");
				$("#setwifiwizzardssid").hide();
				$("#setwifiwizzardsuccess").show();
				$(".msgnewssid").html('Gramofon is connected to internet via <b>"' + $("#ssid_id").val() + '"</b>.');
				$("#finishb").focus();
			}
		} else {
			setTimeout(function() {
				is_wcli_up();
				// Exp function because after n seconds it's more probable be associated
			}, _wcli_tries_timeout);
		}
	} else {
		$(".modal_complete").fadeOut(300);
		$("#fade").fadeOut(300);
		_wcli_tries = 8;
		$(".error").show();
		$(".error").text("Error: Wrong password or poor WiFi Signal.");
	}
};

var is_wcli_up = function is_wcli_upF() {
	var params = new wuapi_CallParams();
	params.user_cb = is_wcli_up_cb;
	wuapi_get_inet_info(params);
};

var is_valid_ssid = function is_valid_keyF(key) {
	if ( typeof key !== 'undefined') {
		return (key.length > 0) && (key.length < 33);
	}
	return false;
};

var is_valid_key = function is_valid_keyF(key) {
	if ( typeof key !== 'undefined') {
		return (key.length > 7) && (key.length < 64);
	}
	return false;
};

var setmode_finished = function setmode_finishedF() {
	if (_target_mode === 0) {
		setTimeout(function() {
			_step = 2;
			_changes = false;
			_old_mode = _current_mode;
			$(".privssid").val($("#privssidc").val());
			$(".privpass").val($("#privpassc").val());
			$(".privpassfield").show();
			show_homepage();
		}, 4000);
	} else {
		switch (_step) {
			case 0:
				setTimeout(function() {
					is_wcli_up();
				}, 10000);
				// Delay average association time
				break;
			case 1:
				_step++;
				_changes = false;
				_old_ssid = $("#ssid_id").val();
				_old_key = $("#wclipassin").val();
				_old_enc = $("#encrypt_id").val();
				_old_mode = _current_mode;

				if (_current_mode === 2) {
					$(".privssid").val($("#privssidw").val());
					$(".privpass").val($("#privpassw").val());
					$(".privpassfield").show();
				} else {
					$(".privssid").val($("#ssid_id").val());
					if ($("#encrypt_id").val() !== "none") {
						$(".privpass").val($("#wclipassin").val());
						$(".privpassfield").show();
					} else {
						$(".privpassfield").hide();
					}
				}
				setTimeout(function() {
					$(".modal_complete").fadeOut(300);
					$("#fade").fadeOut(300);
					$("#setwifiwizzardmode").hide();
					$("#setwifiwizzardclone").hide();
					$("#setwifiwizzardseparate").hide();
					$("#setwifiwizzardconfirm").hide();
					$("#submenu").hide();
					var ssid_nuevo = _current_mode !== 2 ? $("#ssid_id").val() : $("#privssidw").val();
					$(".msgnewssid").html('The configuration is now being applied. <br/> If you were connected to the Gramofon via WiFi you might have been disconnected. Please connect to the <b>"' + ssid_nuevo + '"</b> WiFi signal and press the button below.');
					$("#setwifiwizzardsuccess2").show();
					$("#finishb2").focus();
				}, 10000);
				break;
			case 9999:
				show_homepage();
				break;
		}
	}
};

var result_setmode = function result_setmodeF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		setmode_finished();
	}
};

var set_to_ethrouted = function set_to_ethroutedF() {
	var ethroutedparams = new wuapi_EthRoutedParams();
	var params = new wuapi_CallParams();
	ethroutedparams.proto = "dhcp";
	params.args = ethroutedparams;
	params.user_cb = result_setmode;
	wuapi_set_networking_ethrouted(params);
};

var set_to_wifirouted = function set_to_wifiroutedF() {
	var wifiroutedparams = new wuapi_WifiRoutedParams();
	var params = new wuapi_CallParams();
	wifiroutedparams.proto = "dhcp";
	wifiroutedparams.ssid = $("#ssid_id").val();
	wifiroutedparams.encryption = ($("#encrypt_id").val() === "psk") ? "psk-mixed" : $("#encrypt_id").val();
	if ($("#encrypt_id").val() !== "none") {
		wifiroutedparams.key = $("#wclipassin").val();
	}
	if ($("#freq_id").val() !== "") {
		wifiroutedparams.freq = $("#freq_id").val();
	}
	params.user_cb = result_setmode;
	params.args = wifiroutedparams;
	wuapi_set_networking_wifirouted(params);
};

var set_to_wificlone = function set_to_wificlonedF() {
	var wificlonedparams = new wuapi_WifiCloneParams();
	var params = new wuapi_CallParams();
	wificlonedparams.ssid = $("#ssid_id").val();
	wificlonedparams.encryption = ($("#encrypt_id").val() === "psk") ? "psk-mixed" : $("#encrypt_id").val();
	if ($("#encrypt_id").val() !== "none") {
		wificlonedparams.key = $("#wclipassin").val();
	}
	if ($("#freq_id").val() !== "") {
		wificlonedparams.freq = $("#freq_id").val();
	}
	params.user_cb = result_setmode;
	params.args = wificlonedparams;
	wuapi_set_networking_wificlone(params);
};

var set_mode = function set_modeF(mode) {
	_changes = true;
	switch (mode) {
		case 0:
			_current_mode = 0;
			$("#loadingtext").text("Applying New Settings.");
			$(".modal_complete").fadeIn(300);
			$("#fade").fadeIn(300);
			set_to_ethrouted();
			break;
		case 2:
			_current_mode = 2;
			$("#loadingtext").text('Trying to connect to "' + $("#ssid_id").val() + '"');
			$(".modal_complete").fadeIn(300);
			$("#fade").fadeIn(300);
			set_to_wifirouted();
			break;
		case 3:
			_current_mode = 3;
			$("#loadingtext").text('Trying to connect to "' + $("#ssid_id").val() + '"');
			$(".modal_complete").fadeIn(300);
			$("#fade").fadeIn(300);
			set_to_wificlone();
			break;
	}
};

var result_set_wifipriv = function result_set_wifiprivF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			if (_current_mode !== _target_mode) {
				set_mode(_target_mode);
			} else {
				reload_wifi();
			}
		} else {
			set_wifipriv_settings();
		}
	}
};

var set_wifipriv_settings = function set_wifipriv_settingsF() {
	var privssid = $(_target_mode < 2 ? "#privssidc" : "#privssidw").val();
	var privpass = $(_target_mode < 2 ? "#privpassc" : "#privpassw").val();
	var flag;
	if (( flag = is_valid_ssid(privssid)) && is_valid_key(privpass)) {
		var wifiprivate = new wuapi_WifiPrivate();
		var params = new wuapi_CallParams();
		wifiprivate.ssid = privssid;
		wifiprivate.key = privpass;
		wifiprivate.encryption = "psk2";
		params.user_cb = result_set_wifipriv;
		params.args = wifiprivate;
		wuapi_set_private_interface(params);
	} else {
		if (!flag) {
			$(".error").text("Error: The ssid size must be between 1 and 32 characters.");
		} else {
			$(".error").text("Error: The password size must be between 8 and 63 characters.");
		}
		$(".error").show();
	}
};

var set_wcli = function set_wcliF() {
	if (_target_mode === 3) {
		if (_current_mode !== _target_mode) {
			set_mode(_target_mode);
		} else {
			$("#loadingtext").text("Applying New Settings.");
			$(".modal_complete").fadeIn(300);
			$("#fade").fadeIn(300);
			setmode_finished();
		}
	} else {
		set_wifipriv_settings();
	}

};

var revert_mode = function revert_ssidF() {
	if ((_changes) && (_step !== 2)) {
		_changes = false;
		$("#loadingtext").text('Reverting Changes.');
		$(".modal_complete").fadeIn(300);
		$("#fade").fadeIn(300);
		_step = 9999;
		_target_mode = 9999;
		_current_mode = _old_mode;
		switch (_old_mode) {
			case 0:
				set_to_ethrouted();
				break;
			case 2:
				$("#ssid_id").val(_old_ssid);
				$("#encrypt_id").val(_old_enc);
				$("#wclipassin").val(_old_key);
				set_to_wifirouted();
				break;
			case 3:
				$("#ssid_id").val(_old_ssid);
				$("#encrypt_id").val(_old_enc);
				$("#wclipassin").val(_old_key);
				set_to_wificlone();
				break;
		}
	}
};

var reload_wifi = function reload_wifiF() {
	var params = new wuapi_CallParams();
	params.user_cb = result_setmode;

	$(".modal_complete").fadeIn(300);
	$("#fade").fadeIn(300);
	wuapi_reload_wifi(params);
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//########################### Get SSIDs ##########################

var set_wifi_ssid = function set_wifi_ssidF() {
	$("#ssid_id").remove();
	$("#encrypt_id").remove();
	$("#freq_id").remove();

	$("#wclissidl").remove();
	$("#wclipassl").remove();
	$("#wclipassin").remove();
	$("#wclipassd").remove();

	if ($("#selectSsid option:selected").val().length) {

		var ssidhidden = $("#selectSsid option:selected").attr('id') === "custom";

		if (!ssidhidden) {
			var ssid = $("#selectSsid option:selected").attr('name');
			var value = JSON.parse($("#selectSsid option:selected").val());
			$("#wcliform").append('<input id="encrypt_id" type="hidden"  value="' + value.enc + '" />');
			$("#wcliform").append('<input id="ssid_id" type="hidden" value="' + ssid + '" />');
			$("#wcliform").append('<input id="freq_id" type="hidden" value="' + value.freq + '" />');
		} else {
			$("#wclipassf").append('<label id="wclissidl" for="ssid_id">Home WiFi Name</label>');
			$("#wclipassf").append('<input id="ssid_id" type="text"/>');
			$("#wcliform").append('<input id="freq_id" type="hidden" value="" />');

			// Default encrypt. type is psk2. will change if no password is set
			$("#wcliform").append('<input id="encrypt_id" type="hidden" value="psk2" />');
		}

		if (ssidhidden || ((value.enc !== "") && (value.enc !== "none"))) {
			$("#wclipassf").append('<label id="wclipassl" for="password">Home WiFi Password</label>');
			$("#wclipassf").append('<div id="wclipassd" class="inputCell">');
			$("#wclipassd").append('<input type="text" id="wclipassin" name="name" />');
			$("#wclipassin").val("");
			$('#wclipassin').keypress(function(event) {
				if (event.keyCode == 13) {
					$('#ssidbutton').click();
				}
			});
		}

	}
};

var print_wifi_ssids = function print_wifi_ssidsF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$ssids = $('#selectSsid');
			var data = result.extra;
			if (data.length) {
				var is_first_enc = true;
				data.sort(compare);
				$("#selectSsid").find('option').remove().end();
				$ssids.append('<option value = "">Select your Home WiFi...</option>');
				$ssids.append('<option value = ""></option>');
				$ssids.append('<option value = "">Open Wifis...</option>');
				for (var i = 0; i < result.extra.length; i++) {
					var enc;
					if (data[i].encryption.enabled) {
						if (is_first_enc) {
							$ssids.append('<option value = ""></option>');
							$ssids.append('<option value = "">Encrypted Wifis...</option>');
							is_first_enc = false;
						}
						if ( typeof data[i].encryption["wpa"] === 'undefined') {
							continue;
						}
						enc = "psk" + (data[i].encryption["wpa"][0] === 2 ? 2 : "");

					} else {
						enc = "none";
					}
					var ssid = data[i].ssid;
					var freq;
					if (data[i].channel === 14) {
						freq = 2484;
					} else {
						freq = 2412 + (5 * (data[i].channel - 1));
					}
					var quality = ((data[i].quality / data[i].quality_max) * 100).toFixed(2);
					$ssids.append('"<option name = "' + ssid + '" value = \'{"enc":"' + enc + '", "freq":' + freq + '}\'>' + ssid + " (" + enc + ") " + quality + "% </option>");
				}
				$ssids.append('<option value = ""></option>');
				$ssids.append('<option id = "custom" name = "custom"  value= "custom">Custom...</option>');
			} else {
				$ssids.append("<option>No WiFis detected</option>");
			}
		} else {
			if (result.code === 1) {// There wasn't running a previous scan.
				scan_close_ssids();
			} else {
				if (result.code === 5) {
					setTimeout(function() {// Wait a litle bit before ask again
						get_ssids();
					}, 500);
				} else {
					$("#selectSsid").find('option').remove().end();
					$ssids.append('<option value = "">Scan Fail</option>');
				}
			}
		}
	}
};

function compare(a, b) {
	if ( typeof a.ssid === 'undefined')
		return "-1";
	if ( typeof b.ssid === 'undefined')
		return "1";
	if (a.encryption.enabled === b.encryption.enabled)// Both are open or encrypted
		return (a.ssid.toLowerCase() < b.ssid.toLowerCase() ? "-1" : "1");
	else
		return (!a.encryption.enabled ? "-1" : "1");
}

var get_ssids = function get_ssidsF() {
	var params = new wuapi_CallParams();
	params.user_cb = print_wifi_ssids;
	wuapi_get_ssids(params);
};

var wait_for_scan = function wait_for_scanF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code < 2) {// If the scan started fine or there was a pedding to read scan.
			setTimeout(function() {// Wait a litle bit before ask.
				get_ssids();
			}, 500);
		}
	}
};

var scan_close_ssids = function scan_close_ssidsF() {
	$("#ssid_id").remove();
	$("#encrypt_id").remove();
	$("#freq_id").remove();

	$("#wclissidl").remove();
	$("#wclipassl").remove();
	$("#wclipassin").remove();
	$("#wclipassd").remove();

	var params = new wuapi_CallParams();
	var scanparams = new wuapi_IwInfo_Params();
	scanparams.iface = "radio";
	params.user_cb = wait_for_scan;
	params.args = scanparams;
	$("#selectSsid").find('option').remove().end();
	$("#selectSsid").append('<option value = "">Scanning for WiFis</option>');
	wuapi_scan_ssid(params);
};

//----------------------------------------------------------------

//########################## Admin Funcs #########################

var setadminpass_result = function setadminpass_resultF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$("#setpasserrormsg").hide();
			$("#setpasssuccessmsg").show();
		} else {
			$("#setpasssuccessmsg").hide();
			$("#setpasserrormsg").show();
		}
	}
};

var set_adminpass = function set_adminpassF() {
	var cred = new wuapi_Credentials();
	cred.username = "admin";
	cred.password = $("#adminpass").val();
	if ((cred.password.length < 1) || (cred.password.length > 32)) {
		$("#setpasssuccessmsg").hide();
		$("#setpasserrormsg").show();
		return false;
	}
	var callparams = new wuapi_CallParams();
	callparams.user_cb = setadminpass_result;
	callparams.args = cred;
	wuapi_fonera_set_password(callparams);
	return false;
};

var getadminpass_result = function getadminpass_resultF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$("#adminpass").val(result.extra.password);
		} else {
			get_adminpass();
		}
	}
};

var get_adminpass = function get_adminpassF() {
	var cred = new wuapi_Credentials();
	cred.username = "admin";
	var callparams = new wuapi_CallParams();
	callparams.user_cb = getadminpass_result;
	callparams.args = cred;
	wuapi_fonera_get_password(callparams);
	return false;
};

var reboot_result = function reboot_resultF(result) {
	show_login();
};

var gramo_reboot = function gramo_rebootF() {
	var callparams = new wuapi_CallParams();
	callparams.user_cb = reboot_result;
	wuapi_fonera_reboot(callparams);
};

var factoryreset_result = function factoryreset_resultF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		gramo_reboot();
	}
};

var gramo_factoryreset = function gramo_factoryresetF() {
	var callparams = new wuapi_CallParams();
	callparams.user_cb = factoryreset_result;
	wuapi_fonera_reset(callparams);
};

var gramoversion_result = function gramoversion_resultF(result) {
	if (result.code === -32002) {// If denied access return to login
		_changes = false;
		show_login();
	} else {
		if (result.code === 0) {
			$("#fwversionfield").text(result.extra.fw_version);
		} else {
			get_gramoversion();
		}
	}
};

var get_gramoversion = function get_gramoversionF() {
	var callparams = new wuapi_CallParams();
	callparams.user_cb = gramoversion_result;
	wuapi_get_gramoversion(callparams);
};

//----------------------------------------------------------------

//######################### Sauron Funcs #########################

var ledRefreshInterval;
var hide_all = function hide_allF() {
	$(".modal_complete").fadeOut(300);
	$("#fade").fadeOut(300);
	clearInterval(ledRefreshInterval);
	$("#setpasssuccessmsg").hide();
	$("#setpasserrormsg").hide();
	$("#loginpage").hide();
	$("#submenu").hide();
	$("#statuspage").hide();
	$("#setcablewizzard").hide();
	$("#setwifiwizzardssid").hide();
	$("#setwifiwizzard").hide();
	$("#setwifiwizzard2").hide();
	$("#setwifiwizzardmode").hide();
	$("#setwifiwizzardclone").hide();
	$("#setwifiwizzardseparate").hide();
	$("#setwifiwizzardconfirm").hide();
	$("#setwifiwizzardsuccess").hide();
	$("#setwifiwizzardsuccess2").hide();
	$("#setnamedevpage").hide();
	$("#setadvancedpage").hide();
	$("#dropmenu").hide();
	$(".down").hide();
	$(".error").hide();
	$("#setpasssuccessmsg").hide();
	$("#setpasserrormsg").hide();
	$(".login").removeClass("ko");
	$("#name, #password").removeClass("errorInput");
	$("#wclipassl").remove();
	$("#wclipassin").remove();
	$("#wclipassd").remove();
	$("#modeswizardbutton").hide();
};

var show_login = function show_lofinF() {
	$("#loadingtext").text("Updating Status.");
	hide_all();
	_ready = 0;
	_step = 0;
	_changes = false;
	_wcli_tries = 20;
	$("#loginpage").show();
	$('#password').focus();
	$('#password').select();
};

var show_wizard = function show_wizardF(wizard) {
	if (_ready === 1) {
		hide_all();
		revert_mode();
		// If is needed
		_step = 0;
		$("#submenu").show();
		$("#dropmenu").show();
		if (wizard === "cable") {
			_target_mode = 0;
			$("#setcablewizzard").show();
			$("#cablelink").addClass("act");
			$("#wifilink").removeClass("act");
			$('#privssidc').focus();
			$('#privssidc').select();
		} else {
			_target_mode = -1;
			$("#setwifiwizzard").show();
			$("#setwifiwizzardssid").show();
			$("#wifilink").addClass("act");
			$("#cablelink").removeClass("act");
			$('#selectSsid').focus();
			scan_close_ssids();
		}
	} else {
		setTimeout(function() {
			show_wizard(wizard);
		}, 100);
	}
};

var show_wizard_mode = function show_wizard_modeF() {
	if (_ready === 1) {
		hide_all();
		revert_mode();
		// If is needed
		_step = 1;
		$("#submenu").show();
		$("#dropmenu").show();
		$("#setwifiwizzard2").show();
		$("#setwifiwizzardmode").show();

		$("#setwifiwizzardmode").append('<input id="encrypt_id" type="hidden"  value="' + _old_enc + '" />');
		$("#setwifiwizzardmode").append('<input id="ssid_id" type="hidden" value="' + _old_ssid + '" />');
		$("#setwifiwizzardmode").append('<input id="wclipassin" type="hidden" value="' + _old_key + '" />');

		switch (_current_mode) {
			case 2:
				$(".separate").addClass("act");
				$(".separate").removeClass("dis");
				$(".clone").addClass("dis");
				$(".clone").removeClass("act");
				$("#setwifiwizzardseparate").show();
				$("#privssidw").focus();
				$("#setwifiwizzardclone").hide();
				_target_mode = 2;
				break;
			case 3:
				$(".clone").addClass("act");
				$(".clone").removeClass("dis");
				$(".separate").addClass("dis");
				$(".separate").removeClass("act");
				$("#setwifiwizzardclone").show();
				$("#setwifiwizzardseparate").hide();
				$("#ssidclone").val($("#ssid_id").val());
				if ($("#encrypt_id").val() !== "none") {
					$("#passwordclone").val($("#wclipassin").val());
					$("#wificlonepass").show();
				}
				$("#bttonclonewifiwizzard").focus();
				_target_mode = 3;
				break;
		}
	} else {
		setTimeout(function() {
			show_wizard(wizard);
		}, 100);
	}
};

var show_homepage = function show_homepageF() {
	if (_ready === 1) {
		hide_all();
		revert_mode();
		if (_current_mode < 2) {
			$("#cablelink").addClass("act");
			$("#wifilink").removeClass("act");
			$("#wifilink").attr("href", "javascript:void(0)");
			$("#wifilink").attr("onclick", "show_wizard('wifi');");
			$("#conectedto").html('<h2> Connected to: Router via Cable </h2>');
			$("#wizardbutton").text('WiFi settings');
			$("#wizardbutton").removeClass("left");
			$("#wizardbutton").attr("onclick", "show_wizard('cable'); return true;");
			$("#connectionscheme").attr("src", "images/cable_gris.png");
		} else {
			$("#wifilink").addClass("act");
			$("#cablelink").removeClass("act");
			$("#cablelink").attr("href", "javascript:void(0)");
			$("#cablelink").attr("onclick", "show_wizard('cable');");
			$("#conectedto").html('<h2> Connected to: ' + _old_ssid + '</h2>');
			$("#wizardbutton").attr("onclick", "show_wizard('wifi'); return true;");
			$("#wizardbutton").text('Internet settings');
			$("#connectionscheme").attr("src", "images/wifi_todo_gris.png");
			$("#modeswizardbutton").show();
			$("#wizardbutton").addClass("left");
		}

		// If is needed
		get_led_status();
		ledRefreshInterval = setInterval(function() {
			get_led_status();
		}, 5000);
		$("#submenu").show();
		$("#dropmenu").show();
		$("#statuspage").show();
	} else {
		setTimeout(function() {
			show_homepage();
		}, 100);
	}
};

var show_advancedpage = function show_advancedpageF() {
	if (_ready === 1) {
		hide_all();
		revert_mode();
		// If is needed
		get_adminpass();
		$("#dropmenu").show();
		$("#setadvancedpage").show();
		$("#adminpass").focus();
		setTimeout(function() {
			get_gramoversion();
		}, 300);
	} else {
		setTimeout(function() {
			show_advancedpage();
		}, 100);
	}
};

var show_gramonamepage = function show_gramonamepageF() {
	if (_ready === 1) {
		hide_all();
		revert_mode();
		$("#gramonameid").val($("#gramoname").html());
		// If is needed
		$("#dropmenu").show();
		$("#setnamedevpage").show();
		$("#gramonameid").focus();
	} else {
		setTimeout(function() {
			show_gramonamepage();
		}, 100);
	}
};

//----------------------------------------------------------------
