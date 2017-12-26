/** ********************* Private API Global Variables *********************** */
/**
 * Pending request array
 *
 * @private
 */
var wuapi_request = new Array();

/**
 * Free request id counter.
 *
 * @private
 */
var wuapi_request_id = 1;

/** ************************************************************************** */

/** *************************** Private API Types **************************** */

/**
 * This type is used to hold the session information in an RPC call.
 *
 * @constructor
 * @struct
 * @private
 */
function wuapi_Session() {"use strict";
	/**
	 * RPC call arguments.
	 *
	 * @memberof wuapi_Session
	 * @type wuapi_CallData
	 */
	this.params = -1;
	/**
	 * Contains the RPC call information.
	 *
	 * @memberof wuapi_Session
	 * @type RPC_Call
	 */
	this.session_data = -1;
}

/**
 * This type is used to hold the private and user arguments of the RPC call.
 *
 * @constructor
 * @struct
 * @private
 */
function wuapi_CallData() {"use strict";
	/**
	 * User Callback Function. This function will be called after the RPC call,
	 * and must recive a CallResult object. this function can be setted by the
	 * API user using a CallParams object.
	 *
	 * @memberof wuapi_CallData
	 * @type Function
	 */
	this.user_cb = -1;
	/**
	 * This function is used must translate the JSON reponse in a CallResult
	 * object. Futhermore this function will call the User Callback Function if
	 * procced.
	 *
	 * @memberof wuapi_CallData
	 * @type Function
	 */
	this.translate_cb = -1;
	/**
	 * RPC object to be called.
	 *
	 * @memberof wuapi_CallData
	 * @type String
	 */
	this.object = -1;
	/**
	 * RPC method to be called.
	 *
	 * @memberof wuapi_CallData
	 * @type String
	 */
	this.method = -1;
	/**
	 * Optional filed that the API user can set with the needed arguments to
	 * perform the RPC call. The type will depends of the RPC call.
	 *
	 * @memberof wuapi_CallData
	 * @type Object
	 */
	this.args = new Object();
}

/**
 * This type is used to hold a RPC call.
 *
 * @constructor
 * @struct
 * @private
 */
function wuapi_RPC_Call() {"use strict";
	/**
	 * JSonRPC Version.
	 *
	 * @memberof RPC_Call
	 * @type String
	 */
	this.jsonrpc = wuapi_jsonrpc_version;
	/**
	 * RPC call identification.
	 *
	 * @memberof RPC_Call
	 * @type Integer
	 */
	this.id = wuapi_request_id++;
	/**
	 * RPC method to be called.
	 *
	 * @memberof RPC_Call
	 * @type String
	 */
	this.method = "call";
	/**
	 * RPC method parameters.
	 *
	 * @memberof RPC_Call
	 * @type Object
	 */
	this.params = -1;
}

/**
 * This type is used to hold a UCI settings.
 *
 * @constructor
 * @struct
 * @private
 */
function wuapi_UCI_Settings() {"use strict";
	/**
	 * Config File Name.
	 *
	 * @memberof UCI_Settings
	 * @type String
	 */
	this.config = "";
	/**
	 * UCI Section.
	 *
	 * @memberof UCI_Settings
	 * @type String
	 */
	this.section = "";
	/**
	 * UCI values.
	 *
	 * @memberof UCI_Settings.
	 * @type Object
	 */
	this.values = -1;
}

/** ************************************************************************** */

/** ************************* Private API Functions ************************** */

function wuapi_isdef(variable) {
	if ( typeof variable === 'undefined') {
		return wuapi_NULL;
	};
	return variable;
}

/**
 * Builds the RPC call information.
 *
 * @param {wuapi_CallData}
 *            Arguments of the RPC call.
 * @return {RPC_Call} RPC call information.
 * @private
 */
function wuapi_build_info_request(data) {
	var rpccall = new wuapi_RPC_Call();
	for (var key in data.args) {
		if (data.args[key] === wuapi_NULL) {
			delete data.args[key];
		}
	}
	rpccall.params = [data.object, data.method, data.args];
	return rpccall;
}

/**
 * Returns the pending RPC call index.
 *
 * @return {Integer} Pending RPC call index.
 * @private
 */
function wuapi_get_request_index() {
	return wuapi_request.length;
}

/**
 * Calls to RPC tranlator if there is anyone defined.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the translate function
 *            pointer.
 * @private
 */
function wuapi_call_translate_callback(in_json, session) {
	if (session.params && (session.params.translate_cb != -1)) {
		session.params.translate_cb(in_json, session);
	}
}

/**
 * Calls to the user callback funtion if there is anyone defined.
 *
 * @param {CallResult}
 *            result Object that contains the RPC call result.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_call_user_callback(result, session) {
	if (session.params && (session.params.user_cb != -1)) {
		session.params.user_cb(result);
	}
}

/**
 * If RPC JSON response is correct calls the translate function, else builds a
 * CallResult error and calls to the user callback function to inform about the
 * error.
 *
 * @param {JSon}
 *            in_json JSon response from RPC server.
 * @param {Session}
 *            session RPC call session information.
 * @private
 */
function wuapi_translate_fonera(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		if (in_json.result) {
			wuapi_call_translate_callback(in_json, session);
		} else if (in_json.error) {
			result.code = in_json.error.code;
			result.message = in_json.error.message;
			wuapi_call_user_callback(result, session);
		} else {
			result.code = wuapi_error_codes_msg["proto_error"].code;
			result.message = wuapi_error_codes_msg["proto_error"].message;
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Performs a RPC call to the RPC server. On success calls to translate_fonera
 * else builds a CallResult error and calls to the user callback function to
 * inform about the error.
 *
 * @param {Session}
 *            session RPC call session information.
 * @private
 */
function wuapi_call_fonera(session) {
	var pathname = wuapi_get_host();
	var sid = wuapi_get_session_token();
	var path = "http://" + pathname + "/api/" + sid;
	var index = wuapi_get_request_index();
	wuapi_request[index] = $.ajax({
		type : 'POST',
		cache : false,
		timeout: 10000,
		url : path,
		async : true,
		data : JSON.stringify(session.session_data)
	}).done(function() {
		wuapi_translate_fonera(wuapi_request[index].responseJSON, session);
	}).fail(function() {
		if (wuapi_request[index] !== wuapi_NULL) {
			var result = new wuapi_CallResult();
			result.code = wuapi_error_codes_msg["post_error"].code;
			result.message = wuapi_error_codes_msg["post_error"].message;
			wuapi_call_user_callback(result, session);
		}
	});
}

/**
 * Creates the session cookies if the loggin RPC call is successful.
 *
 * @param {JSon}
 *            in_json json result from RPC server.
 * @param {Session}
 *            session session struct with the session info.
 * @private
 */
function wuapi_set_session_token(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		if (in_json.result) {
			var in_code = in_json.result[0];

			if (in_code === 0) {
				$.cookie("session_sid", in_json.result[1].sid);

				if (in_json.result[1].acls.ubus) {
					$.cookie("session_grant", JSON.stringify(in_json.result[1].acls.ubus));
				}
			}

			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
		} else if (in_json.error) {
			result.code = in_json.error.code;
			result.message = in_json.error.message;
		} else {
			result.code = wuapi_error_codes_msg["proto_error"].code;
			result.message = wuapi_error_codes_msg["proto_error"].message;
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Gets the current session token, return 00000000000000000000000000000000 if
 * client is not logged yet.
 *
 * @returns {String} Session token.
 * @private
 */
function wuapi_get_session_token() {
	if ($.cookie("session_sid")) {
		return $.cookie("session_sid");
	} else {
		return "00000000000000000000000000000000";
	}
}

/**
 * Remove current session cookies
 *
 * @private
 */
function wuapi_clean_cookies() {
	$.removeCookie("session_sid");
	$.removeCookie("session_grant");
}

/**
 * Translate the JSon response that contains the WAN interface settings into
 * CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_wan_interface(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var data = in_json.result[1];
			session.params.args.proto = data.proto;
			session.params.args.name = data.device;
			session.params.args.up = data.up;
			try {
				session.params.args.address = data["ipv4-address"][0].address;
				session.params.args.netmask = data["ipv4-address"][0].mask;
			} catch (err) {
				console.log("No address information.");
			}
			try {
				session.params.args.gateway = data.route[0].nexthop;
			} catch (err) {
				console.log("No gateway information.");
			}
			session.params.args.dns = data["dns-server"];
			session.params.args.uptime = data["uptime"];
			wuapi_get_device_info(session.params);
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains the WWAN interface settings into
 * CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_wwan_interface(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var in_data = in_json.result[1];
			session.params.args.proto = in_data.proto;

			try {
				session.params.args.gateway = in_data["route"][0].nexthop;
			} catch (err) {
				console.log("No gateway information.");
			}
			try {
				session.params.args.address = in_data["ipv4-address"][0].address;
				session.params.args.netmask = in_data["ipv4-address"][0].mask;
			} catch (err) {
				console.log("No address information.");
			}
			session.params.args.dns = in_data["dns-server"];
			session.params.args.uptime = in_data["uptime"];
			wuapi_get_device_info(session.params);
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains the WCLI interface settings into
 * CallResult object and calls get_wwan_interface in order to get addtional WWAN
 * settings.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information.
 * @private
 */
function wuapi_translate_wcli_interface(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var in_data = in_json.result[1];
			session.params.args.name = "wcli";
			session.params.args.network = in_data.network;
			session.params.args.wifimode = in_data.mode;
			session.params.args.ssid = in_data.ssid;
			session.params.args.key = in_data.key;
			session.params.args.encryption = in_data.encryption;
			wuapi_get_wwan_interface(session.params);
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains the WAN interface settings into
 * CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_brlan(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var data = in_json.result[1];
			session.params.args.proto = new wuapi_BrLanInfo();
			session.params.args.proto = data.proto;
			session.params.args.name = data.device;
			session.params.args.up = data.up;

			try {
				session.params.args.address = data["ipv4-address"][0].address;
				session.params.args.netmask = data["ipv4-address"][0].mask;
			} catch (err) {
				console.log("No address information.");
			}
			session.params.args.dns = data["dns-server"];
			session.params.args.uptime = data["uptime"];
			wuapi_get_device_info(session.params);
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains the networking mode settings into a
 * CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_networking_mode(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var net_code = in_json.result[1].mode.code;
			switch (net_code) {
				case 0:
					// ethrouted
					session.params.args = new wuapi_InetIfaceInfo();
					session.params.args.netmode = net_code;
					session.params.args.desc = wuapi_networking_modes[net_code];
					wuapi_get_wan_interface(session.params);
					break;

				case 1:
					// ethbridged
					session.params.args = new wuapi_InetIfaceInfo();
					session.params.args.netmode = net_code;
					session.params.args.desc = wuapi_networking_modes[net_code];
					session.params.args.name = "eth0";
					wuapi_get_device_info(session.params);
					break;

				case 2:
				// wclirouted
				case 3:
				// wcliclone
				case 4:
					// wclibridged
					session.params.args = new wuapi_InetIfaceInfo();
					session.params.args.netmode = net_code;
					session.params.args.desc = wuapi_networking_modes[net_code];
					wuapi_get_wcli_interface(session.params);
					break;

				default:
					result.code = wuapi_error_codes_msg["proto_error"].code;
					result.message = wuapi_error_codes_msg["proto_error"].message;
					wuapi_call_user_callback(result, session);
					break;
			}
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_get_device_info(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_device;

	data.object = "network.device";
	data.method = "status";
	data.args = params.args;

	wuapi_rpc_call(data);
}

function wuapi_translate_device(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var params = new wuapi_CallParams();
			var in_data = in_json.result[1];
			session.params.args.up = in_data.up;
			session.params.args.mtu = in_data.mtu;
			session.params.args.macaddr = in_data.macaddr;
			session.params.args.rx_bytes = in_data.statistics.rx_bytes;
			session.params.args.rx_packets = in_data.statistics.rx_packets;
			session.params.args.tx_bytes = in_data.statistics.tx_bytes;
			session.params.args.tx_packets = in_data.statistics.tx_packets;
			result.extra = session.params.args;
		}
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
		wuapi_call_user_callback(result, session);
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_radio(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var radio = new wuapi_Radio_Info();
			radio.channel = wuapi_isdef(in_json.result[1].channel);
			radio.hwmode = wuapi_isdef(in_json.result[1].hwmode);
			radio.htmode = wuapi_isdef(in_json.result[1].htmode);
			radio.txpower = wuapi_isdef(in_json.result[1].txpower);
			radio.country = wuapi_isdef(in_json.result[1].country);
			radio.distance = wuapi_isdef(in_json.result[1].distance);
			result.extra = radio;
		}
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
		wuapi_call_user_callback(result, session);
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_ledstatus(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			var led = new wuapi_LED_Info();
			led.name = in_json.result[1].name;
			led.color = in_json.result[1].color;
			led.mode = in_json.result[1].mode;
			result.extra = led;
		}
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
		wuapi_call_user_callback(result, session);
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_set_radio(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		if (in_code === 0) {
			wuapi_reload_wifi(session.params);
		}
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
		wuapi_call_user_callback(result, session);
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_Network_Param(params) {
	this._params = params;
	this.wuapi_set_mtu_cb = function(result) {
		aux = params;
		switch (result.extra.netmode) {
			case 0:
				var ethroutedparams = new wuapi_EthRoutedParams();
				ethroutedparams.proto = result.extra.proto;
				ethroutedparams.ip = result.extra.address;
				ethroutedparams.netmask = result.extra.netmask;
				ethroutedparams.gateway = result.extra.gateway;
				ethroutedparams.dns = result.extra.dns[0];
				ethroutedparams.mtu = aux.args.mtu;
				params.user_cb = aux.user_cb;
				params.args = ethroutedparams;
				wuapi_set_networking_ethrouted(params);
				break;

			case 1:
				params.user_cb = aux.user_cb;
				wuapi_set_networking_ethbridge(params);
				break;

			case 2:
				var wifiroutedparams = new wuapi_WifiRoutedParams();
				wifiroutedparams.proto = result.extra.proto;
				wifiroutedparams.ip = result.extra.address;
				wifiroutedparams.netmask = result.extra.netmask;
				wifiroutedparams.gateway = result.extra.gateway;
				wifiroutedparams.dns = result.extra.dns[0];
				wifiroutedparams.ssid = result.extra.ssid;
				wifiroutedparams.key = result.extra.key;
				wifiroutedparams.encryption = result.extra.encryption;
				wifiroutedparams.mtu = aux.args.mtu;
				params.user_cb = aux.user_cb;
				params.args = wifiroutedparams;
				wuapi_set_networking_wifirouted(params);
				break;

			case 3:
				var wificloneparams = new wuapi_WifiCloneParams();
				wificloneparams.ssid = result.extra.ssid;
				wificloneparams.key = result.extra.key;
				wificloneparams.encryption = result.extra.encryption;
				wificloneparams.mtu = aux.args.mtu;
				params.user_cb = aux.user_cb;
				params.args = wificloneparams;
				wuapi_set_networking_wificlone(params);
				break;

			case 4:
				var wifibridgeparams = new wuapi_WifiBridgeParams();
				wifibridgeparams.ssid = result.extra.ssid;
				wifibridgeparams.key = result.extra.key;
				wifibridgeparams.encryption = result.extra.encryption;
				wifibridgeparams.mtu = aux.args.mtu;
				params.user_cb = aux.user_cb;
				params.args = wifibridgeparams;
				wuapi_set_networking_wifibridge(params);
				break;
		}
	};
}

/**
 * Translate the JSon response that contains the private wifi interface settings
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_get_private_interface(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			session.params.args = new wuapi_WifiPrivate();
			session.params.args.name = "wpriv";
			session.params.args.device = in_json.result[1].device;
			session.params.args.network = in_json.result[1].network;
			session.params.args.wifimode = in_json.result[1].mode;
			session.params.args.macaddr = in_json.result[1].macaddr;
			session.params.args.ssid = in_json.result[1].ssid;
			session.params.args.key = in_json.result[1].key;
			session.params.args.encryption = in_json.result[1].encryption;
			wuapi_get_device_info(session.params);
		} else {
			result.code = in_code;
			result.message = wuapi_status_codes_msg[in_code];
			wuapi_call_user_callback(result, session);
		}
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
		wuapi_call_user_callback(result, session);
	}

}

/**
 * Translate empty JSon response (for instance, reboot responses)
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_easy(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains a list of SSIDs
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_ssids(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = in_json.result[1].results;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains a ARP table
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_arp_table(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = in_json.result[1].entries;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains a IP Routes table
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_routes(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = in_json.result[1].routes;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains a IP Routes table
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_dhcp_leases(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = in_json.result[1].leases;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_nameresolv(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new Array();
			aux = new wuapi_Resolv_Info();
			for (var i = 0; i < in_json.result[1].nameresolvs.length; i++) {
				aux.name = in_json.result[1].nameresolvs[i].name;
				aux.ip = in_json.result[1].nameresolvs[i].ip;
				result.extra.push(aux);
			}
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_forwardrule(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new Array();
			aux = new wuapi_Forward_Info();
			for (var i = 0; i < in_json.result[1].forwardrules.length; i++) {
				aux.proto = in_json.result[1].forwardrules[i].proto;
				aux.src_dport = in_json.result[1].forwardrules[i].src_dport;
				aux.dest_ip = in_json.result[1].forwardrules[i].dest_ip;
				aux.dest_port = in_json.result[1].forwardrules[i].dest_port;
				aux.name = in_json.result[1].forwardrules[i].name;
				result.extra.push(aux);
			}
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_dhcp(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new wuapi_DHCP_Info();
			result.extra.network = in_json.result[1].network;
			result.extra.starthost = in_json.result[1].starthost;
			result.extra.maxleases = in_json.result[1].maxleases;
			result.extra.leasetime = in_json.result[1].leasetime;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_gramoname(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new wuapi_Gramofon_Name();
			result.extra.mdnsname = in_json.result[1].mdnsname;
			result.extra.spotifyname = in_json.result[1].spotifyname;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

function wuapi_translate_gramoversion(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new wuapi_Gramofon_Version();
			result.extra.fw_version = in_json.result[1].fw_version;
		}

		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Translate the JSon response that contains a user info
 * into CallResult object and calls to the user callback function.
 *
 * @param {JSon}
 *            in_json Json response to be translated.
 * @param {Session}
 *            session Session information. Constains the callback function
 *            pointer.
 * @private
 */
function wuapi_translate_user(in_json, session) {
	var result = new wuapi_CallResult();
	try {
		var in_code = in_json.result[0];

		if (in_code === 0) {
			result.extra = new wuapi_Credentials();
			result.extra.username = in_json.result[1].values[".name"];
			result.extra.password = in_json.result[1].values["password"];
		}
		result.code = in_code;
		result.message = wuapi_status_codes_msg[in_code];
	} catch (err) {
		result.code = wuapi_error_codes_msg["exception_error"].code;
		result.message = wuapi_error_codes_msg["exception_error"].message + ". " + err.message;
	} finally {
		wuapi_call_user_callback(result, session);
	}
}

/**
 * Aux function used to perform the get interface settings RPC calls.
 *
 * @param {wuapi_CallData}
 *            arguments of the RPC call.
 * @private
 */
function wuapi_rpc_call(data) {
	var session = new wuapi_Session();
	session.params = data;
	session.session_data = wuapi_build_info_request(data);

	wuapi_call_fonera(session);
}

/**
 * Performs a RPC call to get WAN interface settins.
 *
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a WanStatus object witch has the WAN
 *            interface settings. The seccond contains the RPC call arguments,
 *            in this case must be leaved unsetted.
 */
function wuapi_get_wan_interface(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_wan_interface;

	data.object = "network.interface.wan";
	data.method = "status";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to get WCLI interface settins.
 *
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a WCliStatus object witch has the WCLI
 *            interface settings. The seccond contains the RPC call arguments,
 *            in this case must be leaved unsetted.
 */
function wuapi_get_wcli_interface(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_wcli_interface;

	data.object = "wifid";
	data.method = "get_wiface";
	data.args = params.args;
	data.args.name = "wcli";

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to get WWAN interface settings.
 *
 * @param {CallParams}
 *            params This object contains two attributes. The first can be
 *            setted with user callback function. This function is called after
 *            the RPC call ends and must accept a CallResult object as argument.
 *            The CallResult object will contain the status code and message and
 *            in the extra field will have a WWanStatus object witch has the
 *            WWAN interface settings. The second contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 */
function wuapi_get_wwan_interface(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_wwan_interface;

	data.object = "network.interface.wwan";
	data.method = "status";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/** ************************************************************************** */
