/**
 * Returns user loged granted functions
 * 
 * @return {JSon} JSon with the user logged granted functions.
 */
function wuapi_get_grant_functions() {
	return $.cookie("session_grant");
}

/**
 * Aborts pending RPC calls.
 *
 */
function wuapi_abort_calls() {
	for (x in wuapi_request){
		wuapi_request[x].abort;
		wuapi_request[x] = wuapi_NULL;
	}
}

/**
 * Returns the hostname
 * 
 * @return {String} Hostname
 */
function wuapi_get_host() {
	return window.location.host;
}

/**
 * Attemps to open a user sesion on the RPC server.
 * 
 * @param {CallParams}
 *            params This object contains two attributes. The first can be
 *            setted with user callback function. This function is called after
 *            the RPC call ends and must accept a CallResult object as argument.
 *            The CallResult object will contain the status code and message and
 *            the extra field will be wuapi_NULLed. The second contains the RPC call
 *            arguments, it must have a Credentials Object with the username and
 *            password.
 * @example
 * function login_result(result) {
 * 	if (result.code == 0) {
 * 		console.log(result.message + ". Now you are logged");
 * 	} else if (result.code < 0) {
 * 		console.log(result.message);
 * 	} else {
 * 		console.log(result.message + ". Try again");
 * 	}
 * }
 * 
 * function login_user() {
 * 	var credentials = new wuapi_Credentials();
 * 	credentials.username = "username";
 * 	credentials.password = "password";
 * 	var callparams = new wuapi_CallParams();
 * 	callparams.user_cb = login_result;
 * 	callparams.args = credentials;
 * 	wuapi_login(callparams);
 * }
 */
function wuapi_login(params) {

	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_set_session_token;

	data.object = "session";
	data.method = "login";
	data.args = params.args;

	wuapi_clean_cookies();
	wuapi_rpc_call(data);

}

/**
 * Close the current user sesion on RPC server.
 * 
 * @param {CallParams}
 *            params This object contains two attributes. The first can be
 *            setted with user callback function. This function is called after
 *            the RPC call ends and must accept a CallResult object as argument.
 *            The CallResult object will contain the status code and message and
 *            the extra field will be wuapi_NULLed. The second contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function logout_result(result) {
 * 		console.log(result.message);
 * }
 * 
 * function logout_user() {
 * 	var callparams = new wuapi_CallParams();
 * 	callparams.user_cb = logout_result;
 * 	wuapi_logout(callparams);
 * }
 */
function wuapi_logout(params) {
	wuapi_abort_calls();
	wuapi_clean_cookies();
	var result = new wuapi_CallResult();
	result.code = 0;
	result.message = wuapi_status_codes_msg["0"];
	if (params.user_cb != -1) {
		params.user_cb(result);
	}
}

/**
 * Performs a RPC call to get private interface settins.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a WifiPrivate object witch has the
 *            private interface settings. The seccond contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function print_private_iface(result) {
 * 	if (result.code == 0) {
 * 		console.log(result.extra.ssid);
 * 		console.log(result.extra.key);
 * 		console.log(result.extra.encryption);
 * 	} else if (result.code < 0) {
 * 		console.log(result.message);
 * 	} else {
 * 		console.log("Status code " + result.message);
 * 	}
 * }
 * 
 * function get_private_iface() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_private_iface;
 * 	wuapi_get_private_interface(params);
 * }
 */
function wuapi_get_private_interface(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_get_private_interface;

	data.object = "wifid";
	data.method = "get_wiface";
	data.args = params.args;
	data.args.name = "private";

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to get the networking mode settings.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a the networking mode settins. The type
 *            of the extra field will depend of the networking mode WCliStatus
 *            WanStatus WWanStatus. The seccond contains the RPC call arguments,
 *            in this case must be leaved unsetted.
 * @example
 * function print_networking_mode(result) {
 * 	switch (result.extra.netmode) {
 * 	case 0:
 * 		console.log("Cable routed");
 * 		console.log(result.extra.proto);
 * 		console.log(result.extra.address);
 * 		console.log(result.extra.netmask);
 * 		console.log(result.extra.gateway);
 * 		console.log(result.extra.dns);
 * 		break;
 * 
 * 	case 1:
 * 		console.log("Cable bridge");
 * 		break;
 * 
 * 	case 2:
 * 		console.log("Wifi routed");
 * 		console.log(result.extra.proto);
 * 		console.log(result.extra.address);
 * 		console.log(result.extra.netmask);
 * 		console.log(result.extra.gateway);
 * 		console.log(result.extra.dns);
 * 		console.log(result.extra.ssid);
 * 		console.log(result.extra.key);
 * 		console.log(result.extra.encryption);
 * 		break;
 * 
 * 	case 3:
 * 		console.log("Wifi clone");
 * 		console.log(result.extra.ssid);
 * 		console.log(result.extra.key);
 * 		console.log(result.extra.encryption);
 * 		break;
 * 	case 4:
 * 		console.log("Wifi bridge");
 * 		console.log(result.extra.ssid);
 * 		console.log(result.extra.key);
 * 		console.log(result.extra.encryption);
 * 		break;
 * 	}
 * }
 * 
 * function get_networking() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_networking_mode;
 * 	wuapi_wuapi_get_inet_info(params);
 * }
 */
function wuapi_get_inet_info(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_networking_mode;

	data.object = "anet";
	data.method = "status";

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set private interface settins.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, this field must be setted with a WifiPrivate object
 *            with the new private interface settins.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_private_iface() {
 * 	var wifiprivate = new wuapi_WifiPrivate();
 * 	var params = new wuapi_CallParams();
 * 	wifiprivate.ssid = "private_ssid";
 * 	wifiprivate.key = "private_pass";
 * 	wifiprivate.encryption = "private_encrypt";
 * 	params.user_cb = set_callback;
 * 	params.args = wifiprivate;
 * 
 * 	wuapi_set_private_interface(params);
 * }
 */
function wuapi_set_private_interface(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "wifid";
	data.method = "set_wiface";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to get brlan bridge settins.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a BrLanInfo object witch has the
 *            brlan bridge settings. The seccond contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function print_brlan_bridge(result) {
 * 	if (result.code == 0) {
 * 		console.log(result.extra);
 * 	} else if (result.code < 0) {
 * 		console.log(result.message);
 * 	} else {
 * 		console.log("Status code " + result.message);
 * 	}
 * }
 * 
 * function get_brlan_bridge() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_brlan_bridge;
 * 	wuapi_get_brlan(params);
 * }
 */
function wuapi_get_brlan(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_brlan;

	data.object = "network.interface.lan";
	data.method = "status";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to get the LED status.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and in
 *            the extra field will have a wuapi_LED_Info object witch has the
 *            brlan bridge settings. The seccond contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function print_led_status(result) {
 * 	if (result.code == 0) {
 * 		console.log(result.extra);
 * 	} else if (result.code < 0) {
 * 		console.log(result.message);
 * 	} else {
 * 		console.log("Status code " + result.message);
 * 	}
 * }
 * 
 * function get_brlan_bridge() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_led_status;
 * 	wuapi_get_ledstatus(params);
 * }
 */
function wuapi_get_ledstatus(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_ledstatus;

	data.object = "ledd";
	data.method = "get";

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set networking mode to Ethernet Routed mode.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, this field must be setted with a EthRoutedParams object
 *            with the new Ethernet Routed settins.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_ethrouted() {
 * 	var ethroutedparams = new wuapi_EthRoutedParams();
 * 	ethroutedparams.proto = "static";
 * 	ethroutedparams.address = "192.168.1.2";
 * 	ethroutedparams.netmask = "255.255.255.0";
 * 	ethroutedparams.gateway = "192.168.1.1";
 * 	ethroutedparams.dns = "8.8.8.8";
 * 	params.user_cb = set_callback;
 * 	params.args = ethroutedparams;
 * 	wuapi_set_networking_ethrouted(params);
 * }
 */
function wuapi_set_networking_ethrouted(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "ethrouted";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set networking mode to Ethernet Bridged mode.
 * 
 * @param {CallParams}
 *            params This object contains two attributes. The first can be
 *            setted with user callback function. This function is called after
 *            the RPC call ends and must accept a CallResult object as argument.
 *            The CallResult object will contain the status code and message and
 *            the extra field will be wuapi_NULLed. The second contains the RPC call
 *            arguments, this field must be leaved unseted.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_ethbridge() {
 * 	params.user_cb = set_callback;
 * 	wuapi_set_networking_ethbridge(params);
 * }
 */
function wuapi_set_networking_ethbridge(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "ethbridged";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set networking mode to Wifi Routed mode.
 * 
 * @param {CallParams}
 *            params This object contains two attributes. The first can be
 *            setted with user callback function. This function is called after
 *            the RPC call ends and must accept a wuapi_CallResult object as argument.
 *            The wuapi_CallResult object will contain the status code and message and
 *            the extra field will be wuapi_NULLed. The second contains the RPC call
 *            arguments, this field must be setted with a wuapi_WifiRoutedParams
 *            object with the new Wifi Routed settings.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_wifirouted() {
 * 	var wifiroutedparams = new wuapi_WifiRoutedParams();
 * 	wifiroutedparams.proto = "static";
 * 	wifiroutedparams.ip = "192.168.1.2";
 * 	wifiroutedparams.netmask = "255.255.255.0";
 * 	wifiroutedparams.gateway = "192.168.1.1";
 * 	wifiroutedparams.dns = "8.8.8.8";
 * 	wifiroutedparams.ssid = "FriendlyArmInn";
 * 	wifiroutedparams.encryption = "wpa2";
 * 	wifiroutedparams.key = "Gorion";
 * 	wifiroutedparams.freq = "2457";
 * 	params.user_cb = set_callback;
 * 	params.args = wifiroutedparams;
 * 	wuapi_set_networking_wifirouted(params);
 * }
 */
function wuapi_set_networking_wifirouted(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "wclirouted";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set networking mode to Wifi Bridged mode.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, this field must be setted with a WifiBridgeParams
 *            object with the new Wifi Bridged settins.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_wifibridge() {
 * 	var wifibridgeparams = new wuapi_WifiBridgeParams();
 * 	wifibridgeparams.ssid = "FriendlyArmInn";
 * 	wifibridgeparams.encryption = "wpa2";
 * 	wifibridgeparams.key = "Gorion";
 * 	wifibridgeparams.freq = "2457";
 * 	params.user_cb = set_callback;
 * 	params.args = wifibridgeparams;
 * 	wuapi_set_networking_wifibridge(params);
 * }
 */
function wuapi_set_networking_wifibridge(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "wclibridged";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Performs a RPC call to set networking mode to Wifi Cloned mode.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, this field must be setted with a WifiCloneParams object
 *            with the new Wifi Clone settins.
 * @example
 * function set_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Set OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_wificloned() {
 * 	var wificloneparams = new wuapi_WifiCloneParams();
 * 	wificloneparams.ssid = "FriendlyArmInn";
 * 	wificloneparams.encryption = "wpa2";
 * 	wificloneparams.key = "Gorion";
 * 	wificloneparams.freq = "2457";
 * 	params.user_cb = set_callback;
 * 	params.args = wificloneparams;
 * 	wuapi_set_networking_wificlone(params);
 * }
 */
function wuapi_set_networking_wificlone(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "wcliclone";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Reboots the Fonera.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function reset_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Performing Reboot");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function reboot() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = reset_callback;
 * 	wuapi_fonera_reboot(params);
 * }
 */
function wuapi_fonera_reboot(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "mfgd";
	data.method = "reboot";

	wuapi_rpc_call(data);
}

/**
 * Reset the Fonera setings to defaults.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, in this case must be leaved unsetted.
 * @example
 * function reset_conf_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Reset Defaults OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function reset_defaults() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = reset_conf_callback;
 * 	wuapi_fonera_reset(params);
 * }
 */
function wuapi_fonera_reset(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "mfgd";
	data.method = "reset_defaults";

	wuapi_rpc_call(data);
}

/**
 * Get a user's password.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain a wuapi_Credentials object. The seccond
 *            contains the RPC call arguments, in this case must be setted with
 *            a credentials object, with only the username setted.
 * @example
 * function uci_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Admin Pass is: ", result.extra.password);
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_password() {
 * 	var params = new wuapi_CallParams();
 * 	var credentials = new Credentials();
 * 	credentials.username = "admin";
 * 	params.user_cb = uci_callback;
 * 	params.args = credentials;
 * 	wuapi_fonera_set_password(params);
 * }
 */
function wuapi_fonera_get_password(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_user;

	var ucisettings = new wuapi_UCI_Settings();
	ucisettings.config = "rpcd";
	ucisettings.section = params.args.username;	

	data.object = "uci";
	data.method = "get";
	data.args = ucisettings;

	wuapi_rpc_call(data);
}

/**
 * Set a user's password.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be wuapi_NULLed. The seccond contains the RPC call
 *            arguments, in this case must be setted with a credentials object.
 * @example
 * function uci_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Password Setted OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function set_password() {
 * 	var params = new wuapi_CallParams();
 * 	var credentials = new Credentials();
 * 	credentials.username = "admin";
 * 	credentials.password = "admin";
 * 	params.user_cb = uci_callback;
 * 	params.args = credentials;
 * 	wuapi_fonera_set_password(params);
 * }
 */
function wuapi_fonera_set_password(params) {

	if (params.args.password.length === 0) {
		var result = new wuapi_CallResult();
		result.code = 2;
		result.message = wuapi_status_codes_msg[2];
		if (params.user_cb != -1) {
			params.user_cb(result);
		}
		return false;
		
	}
	
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	var ucisettings = new wuapi_UCI_Settings();
	ucisettings.config = "rpcd";
	ucisettings.section = params.args.username;	
	ucisettings.values = new Object();
	ucisettings.values.password = params.args.password;

	data.object = "uci";
	data.method = "set";
	data.args = ucisettings;

	wuapi_rpc_call(data);
}

/**
 * Gets a SSID list of close wifi networks.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain the information of the scaned WiFis.
 *            The seccond contains the RPC call arguments, in this case must be
 *            setted with a Interface_Info object.
 * @example
 * function ssid_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("SSID: "+result.extra[i]);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function get_close_ssids() {
 * 	var params = new wuapi_CallParams();
 * 	var interfaceinfo = new wuapi_IwInfo_Params();
 * 	interfaceinfo.device = "wpriv";
 * 	params.user_cb = ssid_callback;
 * 	params.args = interfaceinfo;
 * 	wuapi_get_ssids(params);
 * }
 */
function wuapi_scan_ssid(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "ssid_scan";
	data.args = params.args;

	wuapi_rpc_call(data);
}

function wuapi_get_ssids(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_ssids;

	data.object = "anet";
	data.method = "get_ssids";

	wuapi_rpc_call(data);
}

/**
 * Gets the ARP table.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain an array of ARP_Entry. The seccond contains 
 *            the RPC call arguments, in this case must be leaved unsetted.
 * @example
 * function arp_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("IPAddr: "+result.extra[i].ipaddr);
 *				console.log("MACAddr: "+result.extra[i].macaddr);
 *				console.log("Device: "+result.extra[i].device);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function get_arp() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = arp_callback;
 * 	wuapi_get_arp_table(params);
 * }
 */
function wuapi_get_arp_table(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_arp_table;

	data.object = "luci2.network";
	data.method = "arp_table";

	wuapi_rpc_call(data);
}


/**
 * Gets the IP routes.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain a SSIDs_List object. The seccond contains 
 *            the RPC call arguments, in this case must be leaved unsetted.
 * @example
 * function routes_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("Target: "+result.extra[i].target);
 *				console.log("Next Hop: "+result.extra[i].nexthop);
 *				console.log("Metric: "+result.extra[i].metric);
 *				console.log("Device: "+result.extra[i].device);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function get_routes() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = routes_callback;
 * 	wuapi_get_net_routes(params);
 * }
 */
function wuapi_get_net_routes(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_routes;

	data.object = "luci2.network";
	data.method = "routes";

	wuapi_rpc_call(data);
}

/**
 * Get a DHCP leases table.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain a SSIDs_List object. The seccond contains 
 *            the RPC call arguments, in this case must be leaved unsetted.
 * @example
 * function leases_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("Expires: "+result.extra[i].expires);
 *				console.log("Mac Address: "+result.extra[i].macaddr);
 *				console.log("IP Address: "+result.extra[i].ipaddr);
 *				console.log("Hostname: "+result.extra[i].hostname);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 * 
 * function get_leases() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = leases_callback;
 * 	wuapi_get_dhcp_leases(params);
 * }
 */
function wuapi_get_dhcp_leases(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_dhcp_leases;

	data.object = "luci2.network";
	data.method = "dhcp_leases";

	wuapi_rpc_call(data);
}

/**
 * Set the inet iface MTU.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the MTU.
 * @example
 * function mtu_callback(result) {
 * 	if (result.code == 0) {
 * 			console.log("Set MTU OK");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function set_mtu() {
 * 	var params = new wuapi_CallParams();
 * 	var mtu = new wuapi_Mtu();
 * 	mtu.mtu = "1200";
 * 	params.user_cb = mtu_callback;
 * 	params.args = mtu;
 * 	wuapi_set_mtu(params);
 * }
 */
function wuapi_set_mtu(params) {
	var netparam = new wuapi_Network_Param(params); 
	var data = new wuapi_CallData();

	data.user_cb = netparam.wuapi_set_mtu_cb;
	data.translate_cb = wuapi_translate_networking_mode;

	data.object = "anet";
	data.method = "status";

	wuapi_rpc_call(data);
}

/**
 * Gets the radio settings.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain the radio information. The seccond contains
 *            the RPC call arguments, in this case must be unsetted.
 * @example
 * function radio_callback(result) {
 * 	if (result.code == 0) {
 * 			console.log(result.extra);
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function get_radio_info() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = radio_callback;
 * 	wuapi_get_radio(params);
 * }
 */
function wuapi_get_radio(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_radio;

	data.object = "wifid";
	data.method = "get_wdev";
	data.args.name = "radio";

	wuapi_rpc_call(data);
}

/**
 * Sets the radio settings.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the radio settings.
 * @example
 * function radio_callback(result) {
 * 	if (result.code == 0) {
 * 			console.log(result.extra);
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function set_radio_info() {
 * 	var radio = new wuapi_Radio_Info();
 * 	var params = new wuapi_CallParams();
 * 	radio.channel = 2;
 * 	radio.country = "ES";
 * 	radio.distance = "8";
 * 	radio.htmode = 7;
 * 	radio.hwmode = "11ng";
 * 	radio.txpower = 20;
 * 	params.user_cb = radio_callback;
 * 	params.args = radio;
 * 	wuapi_set_radio(params);
 */
function wuapi_set_radio(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_set_radio;

	data.object = "wifid";
	data.method = "set_wdev";
	data.args.name = "radio";

	radio = params.args;
	if (radio.channel != wuapi_NULL)
		data.args.channel = radio.channel;
	if (radio.hwmode != wuapi_NULL)
		data.args.hwmode = radio.hwmode;
	if (radio.htmode != wuapi_NULL)
		data.args.htmode = radio.htmode;
	if (radio.txpower != wuapi_NULL)
		data.args.txpower = radio.txpower;
	if (radio.country != wuapi_NULL)
		data.args.country = radio.country;
	if (radio.distance != wuapi_NULL)
		data.args.distance = radio.distance;
	wuapi_rpc_call(data);
}

/**
 * Realoas the wireless configuration.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must be unsetted.
 * @example
 * function reload_wifi_callback(result) {
 * 	if (result.code == 0) {
 * 			console.log("Reloading WIFI Interfaces);
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function set_radio_info() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = reload_wifi_callback;
 * 	wuapi_set_radio(params);
 */
function wuapi_reload_wifi(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "wifid";
	data.method = "reload";

	wuapi_rpc_call(data);
}

/**
 * Gets a port forward list.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain an array of port fowards rules. The seccond 
 *            contains the RPC call arguments, in this case must be unsetted.
 * @example
 * function forward_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("Proto: "+result.extra[i].proto);
 * 			console.log("Src Dport: "+result.extra[i].src_dport);
 * 			console.log("Dest IP: "+result.extra[i].dest_ip);
 * 			console.log("Dest Port: "+result.extra[i].dest_port);
 * 			console.log("Name: "+result.extra[i].name);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function get_forwards() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = forward_callback;
 * 	wuapi_get_forwards(params);
 * }
 */
function wuapi_get_forwards(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_forwardrule;

	data.object = "anet";
	data.method = "get_forwardrule";

	wuapi_rpc_call(data);
}

/**
 * Adds a port forward rule.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the forward rule information
 *            to add.
 * @example
 * function forward_add_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Forward Added");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function open_port_5000() {
 * 	var params = new wuapi_CallParams();
 * 	var forward_info = new wuapi_Forward_Info();
 * 	forward_info.proto = "tcp udp";
 * 	forward_info.src_dport = "5000";
 * 	forward_info.dest_ip = "192.168.10.120";
 * 	forward_info.dest_port = "5000";
 * 	forward_info.name = "NOMBRE";
 * 	params.user_cb = forward_add_callback;
 * 	params.args = forward_info;
 * 	wuapi_add_forward(params);
 * }
 */
function wuapi_add_forward(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "add_forwardrule";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Delete a port forward rule.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the forward rule entry
 *            number to remove.
 * @example
 * function forward_del_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Forward Deleted");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function del_forwards_0() {
 * 	var params = new wuapi_CallParams();
 * 	var entries = new wuapi_EntryList();
 * 	params.user_cb = forward_del_callback;
 * 	entries.nentry = 0;
 * 	params.args = entries;
 * 	wuapi_del_forward(params);
 * }
 */
function wuapi_del_forward(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "del_forwardrule";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Gets a hostname resolv list.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain an array of hostnames with theis IPs.
 *            The seccond contains the RPC call arguments, in this case must be 
 *            unsetted.
 * @example
 * function nameresolv_callback(result) {
 * 	if (result.code == 0) {
 * 		for (var i = 0; i < result.extra.length; i++) {
 * 			console.log("Name: "+result.extra[i].name);
 * 			console.log("IP: "+result.extra[i].ip);
 * 		}
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function get_resolvs() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = nameresolv_callback;
 * 	wuapi_get_nameresolv(params);
 * }
 */
function wuapi_get_nameresolv(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_nameresolv;

	data.object = "anet";
	data.method = "get_nameresolv";

	wuapi_rpc_call(data);
}

/**
 * Adds a hostname resolv.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the hostname resolv 
 *            information to add.
 * @example
 * function resolv_add_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Resolv Added");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function resolv_wololo() {
 * 	var params = new wuapi_CallParams();
 * 	var resolv_info = new wuapi_Resolv_Info();
 * 	resolv_info.name = "wololo";
 * 	resolv_info.ip = "127.0.0.1";
 * 	params.user_cb = resolv_add_callback;
 * 	params.args = resolv_info;
 * 	wuapi_add_nameresolv(params);
 * }
 */
function wuapi_add_nameresolv(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "add_nameresolv";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Delete a hostname resolv.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the hostname resolv entry
 *            number to remove.
 * @example
 * function resolv_del_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Resolv Deleted");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function del_resolv_0() {
 * 	var params = new wuapi_CallParams();
 * 	var entries = new wuapi_EntryList();
 * 	params.user_cb = resolv_del_callback;
 * 	entries.nentry = 0;
 * 	params.args = entries;
 * 	wuapi_del_nameresolv(params);
 * }
 */
function wuapi_del_nameresolv(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "del_nameresolv";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Adds a DHCP static lease entry.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the dhcp information to add.
 * @example
 * function lease_add_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Lease Added");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function add_lease_FF() {
 * 	var params = new wuapi_CallParams();
 * 	var lease = new wuapi_Lease_Info();
 * 	lease.maclease = "FF:FF:FF:FF:FF:FF:";
 * 	lease.addlease = "255.255.255.255";
 * 	lease.namelease = "FFLEASE";
 * 	params.user_cb = lease_add_callback;
 * 	params.args = lease;
 * 	wuapi_add_lease(params);
 * }
 */
function wuapi_add_lease(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "add_lease";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Delete a DHCP static lease entry.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains the RPC call
 *            arguments, in this case must contain the dhcp entry number to remove.
 * @example
 * function lease_del_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("Lease Deleted");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function del_lease_0() {
 * 	var params = new wuapi_CallParams();
 * 	var entries = new wuapi_EntryList();
 * 	params.user_cb = resolv_del_callback;
 * 	entries.nentry = 0;
 * 	params.args = entries;
 * 	wuapi_del_lease(params);
 * }
 */
function wuapi_del_lease(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "del_lease";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Get DHCP Server Config.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain the DHCP settings. The seccond contains 
 *            the RPC call arguments, in this case must be unsetted.
 * @example
 * function get_dhcp_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log(result.extra);
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function get_dhcp() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = get_dhcp_callback;
 * 	wuapi_get_dhcp(params);
 * }
 */
function wuapi_get_dhcp(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_dhcp;

	data.object = "anet";
	data.method = "get_dhcp";

	wuapi_rpc_call(data);
}

/**
 * Set DHCP Server Config.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains 
 *            the RPC call arguments, in this case must contain the DHCP server
 *            parameters.
 * @example
 * function set_dhcp_callback(result) {
 * 	if (result.code == 0) {
 * 		console.log("DHCP Setted");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function set_dhcp() {
 * 	var params = new wuapi_CallParams();
 * 	var dhcp_info = new wuapi_DHCP_Info();
 * 
 * 	dhcp_info.network = "192.168.10.1";
 * 	dhcp_info.starthost = "50";
 * 	dhcp_info.maxleases = "64";
 * 	dhcp_info.leasetime = "500s";
 * 
 * 	params.user_cb = set_dhcp_callback;
 * 	params.args = dhcp_info;
 * 	wuapi_set_dhcp(params);
 * }
 */
function wuapi_set_dhcp(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "set_dhcp";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Set Gramofon Name.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will be unsetted. The seccond contains 
 *            the RPC call arguments, in this case must contain the mDNSname and
 *            Spotify diplay name
 * @example
 * function result_set_gramoname(result) {
 * 	if (result.code == 0) {
 * 		console.log("Gramofon Name Setted");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * }
 *
 * function set_gramoname() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = result_set_gramoname;
 * 	params.args = new wuapi_Gramofon_Name();
 * 	params.args.mdnsname = "Rincewind";
 * 	params.args.spotifyname = "Rincewind";
 * 	wuapi_set_gramoname(params);
 * 	return false;
 * };
 */
function wuapi_set_gramoname(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_easy;

	data.object = "anet";
	data.method = "set_gramofonname";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Get Gramofon Name.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain the mDNSname and Spotify diplay name. The
 *            seccond contains the RPC call arguments, in this case will be unsetted.
 * @example
 * var print_gramoname = function print_gramoname(result) {
 * 	if (result.code == 0) {
 * 		console.log("result.extra.mdnsname");
 * 		console.log("result.extra.spotifyname");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * };
 * 
 * var get_gramoname = function get_gramonameF() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_gramoname;
 * 	wuapi_get_gramoname(params);
 * };
 */
function wuapi_get_gramoname(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_gramoname;

	data.object = "anet";
	data.method = "get_gramofonname";
	data.args = params.args;

	wuapi_rpc_call(data);
}

/**
 * Get Gramofon Firmware Version.
 * 
 * @param {CallParams}
 *            params This object contains two attibutes. The first can be setted
 *            with user callback function. This function is called after the RPC
 *            call ends and must accept a CallResult object as argument. The
 *            CallResult object will contain the status code and message and the
 *            extra field will contain an string with firmware version. The
 *            seccond contains the RPC call arguments, in this case will be unsetted.
 * @example
 * var print_gramoversion = function print_gramoname(result) {
 * 	if (result.code == 0) {
 * 		console.log("result.extra.fw_version");
 * 	} else if (result.code < 0) {
 * 		console.log("Error: " + result.message);
 * 	} else {
 * 		console.log("Status codes: " + result.message);
 * 	}
 * };
 * 
 * var get_gramoname = function get_gramonameF() {
 * 	var params = new wuapi_CallParams();
 * 	params.user_cb = print_gramoversion;
 * 	wuapi_get_gramoversion(params);
 * };
 */
function wuapi_get_gramoversion(params) {
	var data = new wuapi_CallData();
	data.user_cb = params.user_cb;
	data.translate_cb = wuapi_translate_gramoversion;

	data.object = "mfgd";
	data.method = "get_fw_version";
	data.args = params.args;

	wuapi_rpc_call(data);
}
