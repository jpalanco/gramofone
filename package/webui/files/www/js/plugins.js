// JavaScript Document
$(document).ready(function() {
	$('#password').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#loginbtn').click();
		}
	});

	$('#privssidc').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttoncablewizzard').click();
		}
	});

	$('#privpassc').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttoncablewizzard').click();
		}
	});

	$('#privssidw').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttonwifiwizzard').click();

		}
	});

	$('#privpassw').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttonwifiwizzard').click();
		}
	});

	$('#gramonameid').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttongramoname').click();
		}
	});

	$('#adminpass').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#bttonadminpass').click();
		}
	});

	$('#selectSsid').keypress(function(event) {
		if (event.keyCode == 13) {
			$('#ssidbutton').click();
		}
	});

	$("ul.lang li").click(function() {
		// $(this).addClass("hidden");
		var k = $(this).text();
		$(".langSelect").html(k);
		$("ul.lang").hide();
	});

	$("input").click(function() {// Placeholder action =>
		if ($(this).val() == '') {
			var k = $(this).attr('placeholder');
			$(this).attr('placeholder', '');
		}
		$(this).focusout(function() {
			$(this).attr('placeholder', k);
		});
	});

	$("input:not(.readonly)").focusin(function() {
		$(this).css("border-bottom", "1px solid orange");
	});

	$("input:not(.readonly)").focusout(function() {
		$(this).css("border-bottom", "1px solid #D6D6D6");
	});

	$(".down").hide();
	// Hide Dropdown menu

	$('.close_modal').click(function() {
		$(".modal_complete").fadeOut(300);
		$("#fade").fadeOut(300);
	});

	$('.view').click(function() {
		$(".modal_complete").fadeIn(300);
		$("#fade").fadeIn(300);
	});

	$(".dropdown").click(function() {// Dropdown menu
		$(".down").slideToggle("fast");
	});

	// Wifi Page
	$(".cancel").click(function() {
		if (confirm('Are you sure that do you want to cancel?')) {
			show_homepage();
		}
	});

	$(".next").click(function() {
		var ssid_nuevo;
		if (_target_mode !== 2) {
			ssid_nuevo = $("#ssid_id").val();
		} else {
			var flag;
			if (( flag = is_valid_ssid($("#privssidw").val())) && is_valid_key($("#privpassw").val())) {
				ssid_nuevo = $("#privssidw").val();
				$(".success").show();
			} else {
				if (!flag) {
					$(".error").text("Error: The ssid size must be between 1 and 32 characters.");
				} else {
					$(".error").text("Error: The password size must be between 8 and 63 characters.");
				}
				$(".error").show();
				return false;
			}
		}
		$("#setwifiwizzardmode").hide();
		$("#setwifiwizzardclone").hide();
		$("#setwifiwizzardseparate").hide();
		$(".msgnewssid").html('After clicking Finish your settings will be applied and you might be disconnected from WiFi. Wait a few seconds and connect to the <b>"' + ssid_nuevo + '"</b> WiFi');

		$("#setwifiwizzardconfirm").show();
		$("#confirmb").focus();
		return true;
	});

	$("#ssidbutton").click(function() {
		// If password is empty and ssid is custom assume encryption is none.
		if ($("#selectSsid option:selected").attr('id') === "custom") {
			if ($("#wclipassin").val() === "") {
				$("#encrypt_id").val("none");
			}
		}
		var flag;
		if (( flag = is_valid_ssid($("#ssid_id").val())) && (is_valid_key($("#wclipassin").val()) || ($("#encrypt_id").val() === "none"))) {
			switch (_current_mode) {
				case 0:
				case 2:
					set_mode(2);
					break;
				case 3:
					set_mode(3);
					break;
			}
		} else {
			$(".error").show();
			if (!flag) {
				$(".error").text("Error: The ssid size must be between 1 and 32 characters.");
			} else {
				$(".error").text("Error: The password size must be between 8 and 63 characters.");
			}
		}
	});
	// Clone & Separate mode
	$(".clone").click(function() {
		$(".clone").addClass("act");
		$(".clone").removeClass("dis");
		$(".separate").removeClass("act");
		$(".separate").addClass("dis");
		$("#setwifiwizzardclone").show();
		$("#setwifiwizzardseparate").hide();
		$("#ssidclone").val($("#ssid_id").val());
		if ($("#encrypt_id").val() !== "none") {
			$("#passwordclone").val($("#wclipassin").val());
			$("#wificlonepass").show();
		}
		$("#bttonclonewifiwizzard").focus();
		_target_mode = 3;
	});
	$(".separate").click(function() {
		$(".separate").addClass("act");
		$(".separate").removeClass("dis");
		$(".clone").removeClass("act");
		$(".clone").addClass("dis");
		$("#setwifiwizzardseparate").show();
		$("#setwifiwizzardclone").hide();
		$("#privssidw").focus();
		_target_mode = 2;
	});	

});

$(document).keyup(function(e) {
	if ((e.keyCode == 27) && ($(".modal_complete").is(":hidden"))) {
		$('.cancel:visible').click();
	}
});
