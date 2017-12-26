var wuapi_NULL = -1;
var wuapi_jsonrpc_version = "2.0";

var wuapi_error_codes_msg = {
	"proto_error" : {
		code : "-40000",
		message : "Protocol error"
	},
	"exception_error" : {
		code : "-40001",
		message : "Exception error"
	},
	"post_error" : {
		code : "-40002",
		message : "Post error"
	}
};

var wuapi_status_codes_msg = {
	0 : "No error",
	1 : "Invalid command",
	2 : "Invalid argument",
	3 : "Method not found",
	4 : "Not found",
	5 : "No data",
	6 : "Permission denied",
	7 : "Timeout",
	8 : "Not supported",
	9 : "Unknown error",
	10 : "Connection failed"
};

var wuapi_networking_modes = {
	"0" : "Ethernet routed",
	"1" : "Ethernet bridged",
	"2" : "Wifi Client routed",
	"3" : "Wifi Client clone",
	"4" : "Wifi Client bridged"
};

/**
 * Parameters of Ethernet Routed networking mode.
 * 
 * @constructor
 * @struct
 */
function wuapi_EthRoutedParams() {
	"use strict";
	/**
	 * Set this field to "dhcp" for dynamic address and "static" for static address.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.proto = wuapi_NULL;
	/**
	 * Static ip configuration.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.ip = wuapi_NULL;
	/**
	 * Static Netmask configuration.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.netmask = wuapi_NULL;
	/**
	 * Static Gateway configuration.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.gateway = wuapi_NULL;
	/**
	 * Static DNS configuration.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.dns = wuapi_NULL;
	/**
	 * MTU configuration.
	 * 
	 * @memberof wuapi_EthRoutedParams
	 * @type String
	 */
	this.mtu = 1500;
}

/**
 * Mtu Object
 * 
 * @constructor
 * @struct
 */
function wuapi_Mtu() {
	/**
	 * MTU configuration.
	 * 
	 * @memberof Mtu
	 * @type String
	 */
	this.mtu = 1500;
}

/**
 * Parameters of Wifi Routed networking mode.
 * 
 * @constructor
 * @struct
 */
function wuapi_WifiRoutedParams() {
	"use strict";
	/**
	 * Set this field to "dhcp" for dynamic address and "static" for static address.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.proto = wuapi_NULL;
	/**
	 * Static address configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.ip = wuapi_NULL;
	/**
	 * Static Netmask configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.netmask = wuapi_NULL;
	/**
	 * Static Gateway configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.gateway = wuapi_NULL;
	/**
	 * Static DNS configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.dns = wuapi_NULL;
	/**
	 * SSID configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.ssid = wuapi_NULL;
	/**
	 * Encryption protocol configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.encryption = wuapi_NULL;
	/**
	 * Encryption Key configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.key = wuapi_NULL;
	/**
	 * Frequency configuration.
	 *
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.freq = wuapi_NULL;
	/**
	 * MTU configuration.
	 * 
	 * @memberof wuapi_WifiRoutedParams
	 * @type String
	 */
	this.mtu = 1500;
}

/**
 * Parameters of Wifi Clone networking mode.
 * 
 * @constructor
 * @struct
 */
function wuapi_WifiCloneParams() {
	"use strict";
	/**
	 * SSID configuration.
	 * 
	 * @memberof wuapi_WifiCloneParams
	 * @type String
	 */
	this.ssid = wuapi_NULL;
	/**
	 * Encryption protocol configuration.
	 * 
	 * @memberof wuapi_WifiCloneParams
	 * @type String
	 */
	this.encryption = wuapi_NULL;
	/**
	 * Encryption Key configuration.
	 * 
	 * @memberof wuapi_WifiCloneParams
	 * @type String
	 */
	this.key = wuapi_NULL;
	/**
	 * Frequency configuration.
	 *
	 * @memberof wuapi_WifiCloneParams
	 * @type String
	 */
	this.freq = wuapi_NULL;
	/**
	 * MTU configuration.
	 * 
	 * @memberof wuapi_WifiCloneParams
	 * @type String
	 */
	this.mtu = 1500;
}

/**
 * Parameters of Wifi Bridge networking mode.
 * 
 * @constructor
 * @struct
 */
function wuapi_WifiBridgeParams() {
	"use strict";
	/**
	 * SSID configuration.
	 * 
	 * @memberof wuapi_WifiBridgeParams
	 * @type String
	 */
	this.ssid = wuapi_NULL;
	/**
	 * Encryption protocol configuration.
	 * 
	 * @memberof wuapi_WifiBridgeParams
	 * @type String
	 */
	this.encryption = wuapi_NULL;
	/**
	 * Encryption Key configuration.
	 * 
	 * @memberof wuapi_WifiBridgeParams
	 * @type String
	 */
	this.key = wuapi_NULL;
	/**
	 * Frequency configuration.
	 *
	 * @memberof wuapi_WifiBridgeParams
	 * @type String
	 */
	this.freq = wuapi_NULL;
	/**
	 * MTU configuration.
	 * 
	 * @memberof wuapi_WifiBridgeParams
	 * @type String
	 */
	this.mtu = 1500;
}

/**
 * Contains the settings of private interface.
 * 
 * @constructor
 * @struct
 */
function wuapi_WifiPrivate() {
	"use strict";
	/**
	 * Name configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type Integer
	 */
	this.name = "private";
	/**
	 * Device configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.device = wuapi_NULL;
	/**
	 * Network configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.network = wuapi_NULL;
	/**
	 * IP configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.wifimode = wuapi_NULL;
	/**
	 * MAC configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.macaddr = wuapi_NULL;
	/**
	 * Status configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.up = wuapi_NULL;
	/**
	 * SSID configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.ssid = wuapi_NULL;
	/**
	 * Encryption protocol configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.encryption = wuapi_NULL;
	/**
	 * Encryption Key configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.key = wuapi_NULL;
	/**
	 * Mtu configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.mtu = wuapi_NULL;
	/**
	 * MAC Address configuration.
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.macaddr = wuapi_NULL;
	/**
	 * Received bytes counter
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.rx_bytes = wuapi_NULL;
	/**
	 * Received packages counter
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.rx_packets = wuapi_NULL;
	/**
	 * Transmitted bytes counter
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.tx_bytes = wuapi_NULL;
	/**
	 * Transmitted packages counter
	 * 
	 * @memberof wuapi_WifiPrivate
	 * @type String
	 */
	this.tx_packets = wuapi_NULL;
}

function wuapi_BrLanInfo() {
	"use strict";
	/**
	 * Device name configuration
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.name = wuapi_NULL;
	/**
	 * Status configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type Integer
	 */
	this.up = wuapi_NULL;

	/**
	 * Set this field to "dhcp" for dynamic address and "static" for static address.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.proto = wuapi_NULL;
	/**
	 * Static address configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.address = wuapi_NULL;
	/**
	 * Static Netmask configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.netmask = wuapi_NULL;
	/**
	 * Static Gateway configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.gateway = wuapi_NULL;
	/**
	 * Static DNS configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.dns = wuapi_NULL;
	/**
	 * UpTime configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.uptime = wuapi_NULL;
	/**
	 * Mtu configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.mtu = wuapi_NULL;
	/**
	 * MAC Address configuration.
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.macaddr = wuapi_NULL;
	/**
	 * Received bytes counter
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.rx_bytes = wuapi_NULL;
	/**
	 * Received packages counter
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.rx_packets = wuapi_NULL;
	/**
	 * Transmitted bytes counter
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.tx_bytes = wuapi_NULL;
	/**
	 * Transmitted packages counter
	 * 
	 * @memberof wuapi_BrLanInfo
	 * @type String
	 */
	this.tx_packets = wuapi_NULL;
}

function wuapi_InetIfaceInfo() {
	"use strict";
	/**
	 * Network Mode configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.netmode = wuapi_NULL;
	/**
	 * Descripion configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type Integer
	 */
	this.desc = wuapi_NULL;
	/**
	 * Device name configuration
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.name = wuapi_NULL;
	/**
	 * Status configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type Integer
	 */
	this.up = wuapi_NULL;
	/**
	 * Set this field to "dhcp" for dynamic address and "static" for static address.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.proto = wuapi_NULL;
	/**
	 * Static address configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.address = wuapi_NULL;
	/**
	 * Static Netmask configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.netmask = wuapi_NULL;
	/**
	 * Static Gateway configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.gateway = wuapi_NULL;
	/**
	 * Static DNS configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.dns = wuapi_NULL;
	/**
	 * Network configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.network = wuapi_NULL;
	/**
	 * Wifi Mode configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.wifimode = wuapi_NULL;
	/**
	 * SSID configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.ssid = wuapi_NULL;
	/**
	 * Encryption protocol configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.encryption = wuapi_NULL;
	/**
	 * Encryption Key configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.key = wuapi_NULL;
	/**
	 * UpTime configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.uptime = wuapi_NULL;
	/**
	 * Mtu configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.mtu = wuapi_NULL;
	/**
	 * MAC Address configuration.
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.macaddr = wuapi_NULL;
	/**
	 * Received bytes counter
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.rx_bytes = wuapi_NULL;
	/**
	 * Received packages counter
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.rx_packets = wuapi_NULL;
	/**
	 * Transmitted bytes counter
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.tx_bytes = wuapi_NULL;
	/**
	 * Transmitted packages counter
	 * 
	 * @memberof wuapi_InetIfaceInfo
	 * @type String
	 */
	this.tx_packets = wuapi_NULL;
}

/**
 * RPC call user parameters.
 * 
 * @constructor
 * @struct
 */
function wuapi_CallParams() {
	"use strict";
	/**
	 * Callback Function. This function will be called after the RPC call, and
	 * must recive a CallResult object.
	 * 
	 * @memberof wuapi_CallParams
	 * @type Function
	 */
	this.user_cb = wuapi_NULL;
	/**
	 * Extra optional filed that can be setted with addtional information.
	 * 
	 * @memberof wuapi_CallParams
	 * @type Object
	 */
	this.args = new Object();
}

/**
 * RPC call result information.
 * 
 * @constructor
 * @struct
 */
function wuapi_CallResult() {
	"use strict";
	/**
	 * Result status code.
	 * 
	 * @memberof wuapi_CallResult
	 * @type String
	 */
	this.code = wuapi_NULL;
	/**
	 * Result status message.
	 * 
	 * @memberof wuapi_CallResult
	 * @type String
	 */
	this.message = wuapi_NULL;
	/**
	 * Optional field that can be setted with addtional information.
	 * 
	 * @memberof wuapi_CallResult
	 * @type Object
	 */
	this.extra = wuapi_NULL;
}

/**
 * User parameters.
 * 
 * @constructor
 * @struct
 */
function wuapi_Credentials() {
	"use strict";
	/**
	 * Username.
	 * 
	 * @memberof wuapi_Credentials
	 * @type String
	 */
	this.username = wuapi_NULL;
	/**
	 * Password.
	 * 
	 * @memberof wuapi_Credentials
	 * @type String
	 */
	this.password = wuapi_NULL;
}

/**
 * Wlan interface information.
 * 
 * @constructor
 * @struct
 */
function wuapi_IwInfo_Params() {
	"use strict";
	/**
	 * Interface Name.
	 * 
	 * @memberof wuapi_IwInfo_Param
	 * @type String
	 */
	this.iface = wuapi_NULL;
}

/**
 * DHCP Lease Entry.
 * 
 * @constructor
 * @struct
 */
function wuapi_DHCP_Lease_Entry() {
	"use strict";
	/**
	 * Time to expire.
	 * 
	 * @memberof wuapi_DHCP_Lease_Entry
	 * @type Integer
	 */
	this.expires = wuapi_NULL;
	/**
	 * Mac Address.
	 * 
	 * @memberof wuapi_DHCP_Lease_Entry
	 * @type String
	 */
	this.macaddr = wuapi_NULL;	
	/**
	 * IP Address.
	 * 
	 * @memberof wuapi_DHCP_Lease_Entry
	 * @type String
	 */
	this.ipaddr = wuapi_NULL;
	/**
	 * Hostname.
	 * 
	 * @memberof wuapi_DHCP_Lease_Entry
	 * @type String
	 */
	this.hostname = wuapi_NULL;
}

/**
 * Routes Entry
 * 
 * @constructor
 * @struct
 */
function wuapi_Routes_Entry() {
	"use strict";
	/**
	 * Target.
	 * 
	 * @memberof wuapi_Routes_Entry
	 * @type String
	 */
	this.target = wuapi_NULL;
	/**
	 * Next Hop.
	 * 
	 * @memberof wuapi_Routes_Entry
	 * @type String
	 */
	this.nexthop = wuapi_NULL;	
	/**
	 * Metric.
	 * 
	 * @memberof wuapi_Routes_Entry
	 * @type Integer
	 */
	this.metric = wuapi_NULL;
	/**
	 * Device.
	 * 
	 * @memberof wuapi_Routes_Entry
	 * @type String
	 */
	this.device = wuapi_NULL;
}

/**
 * ARP Entry
 * 
 * @constructor
 * @struct
 */
function wuapi_ARP_Entry() {
	"use strict";
	/**
	 * IP Address.
	 * 
	 * @memberof wuapi_ARP_Entry
	 * @type String
	 */
	this.ipaddr = wuapi_NULL;
	/**
	 * Mac Address.
	 * 
	 * @memberof wuapi_ARP_Entry
	 * @type String
	 */
	this.macaddr = wuapi_NULL;	
	/**
	 * Device.
	 * 
	 * @memberof wuapi_ARP_Entry
	 * @type String
	 */
	this.device = wuapi_NULL;
}

/**
 * Radio Information
 * 
 * @constructor
 * @struct
 */
function wuapi_Radio_Info() {
	"use strict";
	/**
	 * IP Address.
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.channel = wuapi_NULL;
	/**
	 * HW Mode
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.hwmode = wuapi_NULL;	
	/**
	 * HT Mode.
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.htmode = wuapi_NULL;
	/**
	 * Transmition power.
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.txpower = wuapi_NULL;
	/**
	 * Country Code.
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.country = wuapi_NULL;
	/**
	 * Distance.
	 * 
	 * @memberof wuapi_Radio_Info
	 * @type String
	 */
	this.distance = wuapi_NULL;
}

/**
 * DHCP Server Information
 * 
 * @constructor
 * @struct
 */
function wuapi_DHCP_Info() {
	"use strict";
	/**
	 * Network from lease IPs
	 * 
	 * @memberof wuapi_DHCP_Info
	 * @type String
	 */
	this.network = wuapi_NULL;
	/**
	 * Start Host to lease IP.
	 * 
	 * @memberof wuapi_DHCP_Info
	 * @type String
	 */
	this.starthost = wuapi_NULL;
	/**
	 * Maximun Number leases IPs
	 * 
	 * @memberof wuapi_DHCP_Info
	 * @type String
	 */
	this.maxleases = wuapi_NULL;
	/**
	 * Maximun leases time.
	 * 
	 * @memberof wuapi_DHCP_Info
	 * @type String
	 */
	this.leasetime = wuapi_NULL;
}

/**
 * Generic List Entry Number
 * 
 * @constructor
 * @struct
 */
function wuapi_EntryList() {
	"use strict";
	/**
	 * Maximun leases time.
	 * 
	 * @memberof wuapi_EntryList
	 * @type String
	 */
	this.nentry = wuapi_NULL;
}

/**
 * Resolv Entry Configuration
 * 
 * @constructor
 * @struct
 */
function wuapi_Resolv_Info() {
	"use strict";
	/**
	 * Host Name
	 * 
	 * @memberof wuapi_Resolv_Info
	 * @type String
	 */
	this.name = wuapi_NULL;
	/**
	 * Host IP
	 * 
	 * @memberof wuapi_Resolv_Info
	 * @type String
	 */
	this.ip = wuapi_NULL;
}

/**
 * Forward Entry Configuration
 * 
 * @constructor
 * @struct
 */
function wuapi_Forward_Info() {
	"use_strict";
	/**
	 * Port Protocol to Forward
	 * 
	 * @memberof wuapi_Forward_Info
	 * @type String
	 */
	this.proto = wuapi_NULL;
	/**
	 * Source Port
	 * 
	 * @memberof wuapi_Forward_Info
	 * @type String
	 */
	this.src_dport = wuapi_NULL;
	/**
 	 * Destination Host IP.
	 * 
	 * @memberof wuapi_Forward_Info
	 * @type String
	 */
	this.dest_ip = wuapi_NULL;
	/**
	 * Destination Port
	 * 
	 * @memberof wuapi_Forward_Info
	 * @type String
	 */
	this.dest_port = wuapi_NULL;
	/**
	 * Forward Rule Name
	 * 
	 * @memberof wuapi_Forward_Info
	 * @type String
	 */
	this.name = wuapi_NULL;
}

/**
 * Static Lease Entry Configuration
 * 
 * @constructor
 * @struct
 */
function wuapi_Lease_Info() {
	"use_strict";
	/**
	 * Mac to give a static lease
	 * 
	 * @memberof wuapi_Lease_Info
	 * @type String
	 */
	this.maclease = wuapi_NULL;
	/**
	 * Static lease Address
	 * 
	 * @memberof wuapi_Lease_Info
	 * @type String
	 */
	this.addlease = wuapi_NULL;
	/**
	 * Static Lease Name
	 * 
	 * @memberof wuapi_Lease_Info
	 * @type String
	 */
	this.namelease = wuapi_NULL;
}

/**
 * Gramofon Led Status Information
 * 
 * @constructor
 * @struct
 */
function wuapi_LED_Info() {
	"use strict";
	/**
	 * Status Name
	 * 
	 * @memberof wuapi_LED_Info
	 * @type String
	 */	
	this.name = wuapi_NULL;
	/**
	 * Color
	 * 
	 * @memberof wuapi_LED_Info
	 * @type String
	 */
	this.color = wuapi_NULL;
	/**
	 * Light mode
	 * 
	 * @memberof wuapi_LED_Info
	 * @type String
	 */
	this.mode = wuapi_NULL;
}

/**
 * Gramofon Name
 * 
 * @constructor
 * @struct
 */
function wuapi_Gramofon_Name() {
	"use strict";
	/**
	 * mDNS Services Name
	 * 
	 * @memberof wuapi_Gramofon_Name
	 * @type String
	 */
	this.mdnsname = wuapi_NULL;
	/**
	 * Spotify Display Name
	 * 
	 * @memberof wuapi_Gramofon_Name
	 * @type String
	 */
	this.spotifyname = wuapi_NULL;
}

/**
 * Gramofon Firmware Version
 * 
 * @constructor
 * @struct
 */
function wuapi_Gramofon_Version() {
	"use strict";
	/**
	 * Gramofon Firmware Version.
	 * 
	 * @memberof wuapi_Gramofon_Version
	 * @type String
	 */
	this.fw_version = wuapi_NULL;
}

