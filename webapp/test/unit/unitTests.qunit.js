/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comrenesas/zsde990/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
