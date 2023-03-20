'use strict';

var obsidian = require('obsidian');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var obsidian__default = /*#__PURE__*/_interopDefaultLegacy(obsidian);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

createCommonjsModule(function (module, exports) {
(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})(typeof self !== 'undefined' ? self : commonjsGlobal, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dist/icons.json":
/*!*************************!*\
  !*** ./dist/icons.json ***!
  \*************************/
/*! exports provided: activity, airplay, alert-circle, alert-octagon, alert-triangle, align-center, align-justify, align-left, align-right, anchor, aperture, archive, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, award, bar-chart-2, bar-chart, battery-charging, battery, bell-off, bell, bluetooth, bold, book-open, book, bookmark, box, briefcase, calendar, camera-off, camera, cast, check-circle, check-square, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, chrome, circle, clipboard, clock, cloud-drizzle, cloud-lightning, cloud-off, cloud-rain, cloud-snow, cloud, code, codepen, codesandbox, coffee, columns, command, compass, copy, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, cpu, credit-card, crop, crosshair, database, delete, disc, divide-circle, divide-square, divide, dollar-sign, download-cloud, download, dribbble, droplet, edit-2, edit-3, edit, external-link, eye-off, eye, facebook, fast-forward, feather, figma, file-minus, file-plus, file-text, file, film, filter, flag, folder-minus, folder-plus, folder, framer, frown, gift, git-branch, git-commit, git-merge, git-pull-request, github, gitlab, globe, grid, hard-drive, hash, headphones, heart, help-circle, hexagon, home, image, inbox, info, instagram, italic, key, layers, layout, life-buoy, link-2, link, linkedin, list, loader, lock, log-in, log-out, mail, map-pin, map, maximize-2, maximize, meh, menu, message-circle, message-square, mic-off, mic, minimize-2, minimize, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, mouse-pointer, move, music, navigation-2, navigation, octagon, package, paperclip, pause-circle, pause, pen-tool, percent, phone-call, phone-forwarded, phone-incoming, phone-missed, phone-off, phone-outgoing, phone, pie-chart, play-circle, play, plus-circle, plus-square, plus, pocket, power, printer, radio, refresh-ccw, refresh-cw, repeat, rewind, rotate-ccw, rotate-cw, rss, save, scissors, search, send, server, settings, share-2, share, shield-off, shield, shopping-bag, shopping-cart, shuffle, sidebar, skip-back, skip-forward, slack, slash, sliders, smartphone, smile, speaker, square, star, stop-circle, sun, sunrise, sunset, table, tablet, tag, target, terminal, thermometer, thumbs-down, thumbs-up, toggle-left, toggle-right, tool, trash-2, trash, trello, trending-down, trending-up, triangle, truck, tv, twitch, twitter, type, umbrella, underline, unlock, upload-cloud, upload, user-check, user-minus, user-plus, user-x, user, users, video-off, video, voicemail, volume-1, volume-2, volume-x, volume, watch, wifi-off, wifi, wind, x-circle, x-octagon, x-square, x, youtube, zap-off, zap, zoom-in, zoom-out, default */
/***/ (function(module) {

module.exports = {"activity":"<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>","airplay":"<path d=\"M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1\"></path><polygon points=\"12 15 17 21 7 21 12 15\"></polygon>","alert-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>","alert-octagon":"<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"></polygon><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>","alert-triangle":"<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"></line><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"></line>","align-center":"<line x1=\"18\" y1=\"10\" x2=\"6\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"18\" y1=\"18\" x2=\"6\" y2=\"18\"></line>","align-justify":"<line x1=\"21\" y1=\"10\" x2=\"3\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"21\" y1=\"18\" x2=\"3\" y2=\"18\"></line>","align-left":"<line x1=\"17\" y1=\"10\" x2=\"3\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"17\" y1=\"18\" x2=\"3\" y2=\"18\"></line>","align-right":"<line x1=\"21\" y1=\"10\" x2=\"7\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"21\" y1=\"18\" x2=\"7\" y2=\"18\"></line>","anchor":"<circle cx=\"12\" cy=\"5\" r=\"3\"></circle><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"8\"></line><path d=\"M5 12H2a10 10 0 0 0 20 0h-3\"></path>","aperture":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"14.31\" y1=\"8\" x2=\"20.05\" y2=\"17.94\"></line><line x1=\"9.69\" y1=\"8\" x2=\"21.17\" y2=\"8\"></line><line x1=\"7.38\" y1=\"12\" x2=\"13.12\" y2=\"2.06\"></line><line x1=\"9.69\" y1=\"16\" x2=\"3.95\" y2=\"6.06\"></line><line x1=\"14.31\" y1=\"16\" x2=\"2.83\" y2=\"16\"></line><line x1=\"16.62\" y1=\"12\" x2=\"10.88\" y2=\"21.94\"></line>","archive":"<polyline points=\"21 8 21 21 3 21 3 8\"></polyline><rect x=\"1\" y=\"3\" width=\"22\" height=\"5\"></rect><line x1=\"10\" y1=\"12\" x2=\"14\" y2=\"12\"></line>","arrow-down-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"8 12 12 16 16 12\"></polyline><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line>","arrow-down-left":"<line x1=\"17\" y1=\"7\" x2=\"7\" y2=\"17\"></line><polyline points=\"17 17 7 17 7 7\"></polyline>","arrow-down-right":"<line x1=\"7\" y1=\"7\" x2=\"17\" y2=\"17\"></line><polyline points=\"17 7 17 17 7 17\"></polyline>","arrow-down":"<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><polyline points=\"19 12 12 19 5 12\"></polyline>","arrow-left-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 8 8 12 12 16\"></polyline><line x1=\"16\" y1=\"12\" x2=\"8\" y2=\"12\"></line>","arrow-left":"<line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"></line><polyline points=\"12 19 5 12 12 5\"></polyline>","arrow-right-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 16 16 12 12 8\"></polyline><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","arrow-right":"<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"12 5 19 12 12 19\"></polyline>","arrow-up-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"16 12 12 8 8 12\"></polyline><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"8\"></line>","arrow-up-left":"<line x1=\"17\" y1=\"17\" x2=\"7\" y2=\"7\"></line><polyline points=\"7 17 7 7 17 7\"></polyline>","arrow-up-right":"<line x1=\"7\" y1=\"17\" x2=\"17\" y2=\"7\"></line><polyline points=\"7 7 17 7 17 17\"></polyline>","arrow-up":"<line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"></line><polyline points=\"5 12 12 5 19 12\"></polyline>","at-sign":"<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94\"></path>","award":"<circle cx=\"12\" cy=\"8\" r=\"7\"></circle><polyline points=\"8.21 13.89 7 23 12 20 17 23 15.79 13.88\"></polyline>","bar-chart-2":"<line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"></line><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"></line>","bar-chart":"<line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"10\"></line><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"16\"></line>","battery-charging":"<path d=\"M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19\"></path><line x1=\"23\" y1=\"13\" x2=\"23\" y2=\"11\"></line><polyline points=\"11 6 7 12 13 12 9 18\"></polyline>","battery":"<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" ry=\"2\"></rect><line x1=\"23\" y1=\"13\" x2=\"23\" y2=\"11\"></line>","bell-off":"<path d=\"M13.73 21a2 2 0 0 1-3.46 0\"></path><path d=\"M18.63 13A17.89 17.89 0 0 1 18 8\"></path><path d=\"M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14\"></path><path d=\"M18 8a6 6 0 0 0-9.33-5\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","bell":"<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"></path><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"></path>","bluetooth":"<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\"></polyline>","bold":"<path d=\"M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path><path d=\"M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path>","book-open":"<path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\"></path><path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\"></path>","book":"<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path>","bookmark":"<path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path>","box":"<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>","briefcase":"<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path>","calendar":"<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>","camera-off":"<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56\"></path>","camera":"<path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"></path><circle cx=\"12\" cy=\"13\" r=\"4\"></circle>","cast":"<path d=\"M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6\"></path><line x1=\"2\" y1=\"20\" x2=\"2.01\" y2=\"20\"></line>","check-circle":"<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline>","check-square":"<polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path>","check":"<polyline points=\"20 6 9 17 4 12\"></polyline>","chevron-down":"<polyline points=\"6 9 12 15 18 9\"></polyline>","chevron-left":"<polyline points=\"15 18 9 12 15 6\"></polyline>","chevron-right":"<polyline points=\"9 18 15 12 9 6\"></polyline>","chevron-up":"<polyline points=\"18 15 12 9 6 15\"></polyline>","chevrons-down":"<polyline points=\"7 13 12 18 17 13\"></polyline><polyline points=\"7 6 12 11 17 6\"></polyline>","chevrons-left":"<polyline points=\"11 17 6 12 11 7\"></polyline><polyline points=\"18 17 13 12 18 7\"></polyline>","chevrons-right":"<polyline points=\"13 17 18 12 13 7\"></polyline><polyline points=\"6 17 11 12 6 7\"></polyline>","chevrons-up":"<polyline points=\"17 11 12 6 7 11\"></polyline><polyline points=\"17 18 12 13 7 18\"></polyline>","chrome":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><line x1=\"21.17\" y1=\"8\" x2=\"12\" y2=\"8\"></line><line x1=\"3.95\" y1=\"6.06\" x2=\"8.54\" y2=\"14\"></line><line x1=\"10.88\" y1=\"21.94\" x2=\"15.46\" y2=\"14\"></line>","circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle>","clipboard":"<path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path><rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"></rect>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>","cloud-drizzle":"<line x1=\"8\" y1=\"19\" x2=\"8\" y2=\"21\"></line><line x1=\"8\" y1=\"13\" x2=\"8\" y2=\"15\"></line><line x1=\"16\" y1=\"19\" x2=\"16\" y2=\"21\"></line><line x1=\"16\" y1=\"13\" x2=\"16\" y2=\"15\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"17\"></line><path d=\"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25\"></path>","cloud-lightning":"<path d=\"M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9\"></path><polyline points=\"13 11 9 17 15 17 11 23\"></polyline>","cloud-off":"<path d=\"M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","cloud-rain":"<line x1=\"16\" y1=\"13\" x2=\"16\" y2=\"21\"></line><line x1=\"8\" y1=\"13\" x2=\"8\" y2=\"21\"></line><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"23\"></line><path d=\"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25\"></path>","cloud-snow":"<path d=\"M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25\"></path><line x1=\"8\" y1=\"16\" x2=\"8.01\" y2=\"16\"></line><line x1=\"8\" y1=\"20\" x2=\"8.01\" y2=\"20\"></line><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"></line><line x1=\"12\" y1=\"22\" x2=\"12.01\" y2=\"22\"></line><line x1=\"16\" y1=\"16\" x2=\"16.01\" y2=\"16\"></line><line x1=\"16\" y1=\"20\" x2=\"16.01\" y2=\"20\"></line>","cloud":"<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\"></path>","code":"<polyline points=\"16 18 22 12 16 6\"></polyline><polyline points=\"8 6 2 12 8 18\"></polyline>","codepen":"<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\"></polygon><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"15.5\"></line><polyline points=\"22 8.5 12 15.5 2 8.5\"></polyline><polyline points=\"2 15.5 12 8.5 22 15.5\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"8.5\"></line>","codesandbox":"<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"7.5 4.21 12 6.81 16.5 4.21\"></polyline><polyline points=\"7.5 19.79 7.5 14.6 3 12\"></polyline><polyline points=\"21 12 16.5 14.6 16.5 19.79\"></polyline><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>","coffee":"<path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"></path><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"></path><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"></line><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"></line>","columns":"<path d=\"M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18\"></path>","command":"<path d=\"M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z\"></path>","compass":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"></polygon>","copy":"<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path>","corner-down-left":"<polyline points=\"9 10 4 15 9 20\"></polyline><path d=\"M20 4v7a4 4 0 0 1-4 4H4\"></path>","corner-down-right":"<polyline points=\"15 10 20 15 15 20\"></polyline><path d=\"M4 4v7a4 4 0 0 0 4 4h12\"></path>","corner-left-down":"<polyline points=\"14 15 9 20 4 15\"></polyline><path d=\"M20 4h-7a4 4 0 0 0-4 4v12\"></path>","corner-left-up":"<polyline points=\"14 9 9 4 4 9\"></polyline><path d=\"M20 20h-7a4 4 0 0 1-4-4V4\"></path>","corner-right-down":"<polyline points=\"10 15 15 20 20 15\"></polyline><path d=\"M4 4h7a4 4 0 0 1 4 4v12\"></path>","corner-right-up":"<polyline points=\"10 9 15 4 20 9\"></polyline><path d=\"M4 20h7a4 4 0 0 0 4-4V4\"></path>","corner-up-left":"<polyline points=\"9 14 4 9 9 4\"></polyline><path d=\"M20 20v-7a4 4 0 0 0-4-4H4\"></path>","corner-up-right":"<polyline points=\"15 14 20 9 15 4\"></polyline><path d=\"M4 20v-7a4 4 0 0 1 4-4h12\"></path>","cpu":"<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" ry=\"2\"></rect><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect><line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"></line><line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"></line><line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"></line><line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"></line><line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"></line><line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"></line><line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"></line><line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"></line>","credit-card":"<rect x=\"1\" y=\"4\" width=\"22\" height=\"16\" rx=\"2\" ry=\"2\"></rect><line x1=\"1\" y1=\"10\" x2=\"23\" y2=\"10\"></line>","crop":"<path d=\"M6.13 1L6 16a2 2 0 0 0 2 2h15\"></path><path d=\"M1 6.13L16 6a2 2 0 0 1 2 2v15\"></path>","crosshair":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"22\" y1=\"12\" x2=\"18\" y2=\"12\"></line><line x1=\"6\" y1=\"12\" x2=\"2\" y2=\"12\"></line><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"2\"></line><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"18\"></line>","database":"<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"></ellipse><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3\"></path><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"></path>","delete":"<path d=\"M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z\"></path><line x1=\"18\" y1=\"9\" x2=\"12\" y2=\"15\"></line><line x1=\"12\" y1=\"9\" x2=\"18\" y2=\"15\"></line>","disc":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","divide-circle":"<line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"16\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"8\"></line><circle cx=\"12\" cy=\"12\" r=\"10\"></circle>","divide-square":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"16\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"8\"></line>","divide":"<circle cx=\"12\" cy=\"6\" r=\"2\"></circle><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><circle cx=\"12\" cy=\"18\" r=\"2\"></circle>","dollar-sign":"<line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"></line><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path>","download-cloud":"<polyline points=\"8 17 12 21 16 17\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29\"></path>","download":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line>","dribbble":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32\"></path>","droplet":"<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\"></path>","edit-2":"<path d=\"M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z\"></path>","edit-3":"<path d=\"M12 20h9\"></path><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\"></path>","edit":"<path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path>","external-link":"<path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>","eye-off":"<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","eye":"<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>","facebook":"<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"></path>","fast-forward":"<polygon points=\"13 19 22 12 13 5 13 19\"></polygon><polygon points=\"2 19 11 12 2 5 2 19\"></polygon>","feather":"<path d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z\"></path><line x1=\"16\" y1=\"8\" x2=\"2\" y2=\"22\"></line><line x1=\"17.5\" y1=\"15\" x2=\"9\" y2=\"15\"></line>","figma":"<path d=\"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z\"></path><path d=\"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z\"></path><path d=\"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z\"></path><path d=\"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z\"></path><path d=\"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z\"></path>","file-minus":"<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"15\"></line>","file-plus":"<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"12\"></line><line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"15\"></line>","file-text":"<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line><polyline points=\"10 9 9 9 8 9\"></polyline>","file":"<path d=\"M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"></path><polyline points=\"13 2 13 9 20 9\"></polyline>","film":"<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"22\"></line><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"22\"></line><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"2\" y1=\"7\" x2=\"7\" y2=\"7\"></line><line x1=\"2\" y1=\"17\" x2=\"7\" y2=\"17\"></line><line x1=\"17\" y1=\"17\" x2=\"22\" y2=\"17\"></line><line x1=\"17\" y1=\"7\" x2=\"22\" y2=\"7\"></line>","filter":"<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"></polygon>","flag":"<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>","folder-minus":"<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path><line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"></line>","folder-plus":"<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path><line x1=\"12\" y1=\"11\" x2=\"12\" y2=\"17\"></line><line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"></line>","folder":"<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path>","framer":"<path d=\"M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7\"></path>","frown":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M16 16s-1.5-2-4-2-4 2-4 2\"></path><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>","gift":"<polyline points=\"20 12 20 22 4 22 4 12\"></polyline><rect x=\"2\" y=\"7\" width=\"20\" height=\"5\"></rect><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"7\"></line><path d=\"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z\"></path><path d=\"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\"></path>","git-branch":"<line x1=\"6\" y1=\"3\" x2=\"6\" y2=\"15\"></line><circle cx=\"18\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><path d=\"M18 9a9 9 0 0 1-9 9\"></path>","git-commit":"<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><line x1=\"1.05\" y1=\"12\" x2=\"7\" y2=\"12\"></line><line x1=\"17.01\" y1=\"12\" x2=\"22.96\" y2=\"12\"></line>","git-merge":"<circle cx=\"18\" cy=\"18\" r=\"3\"></circle><circle cx=\"6\" cy=\"6\" r=\"3\"></circle><path d=\"M6 21V9a9 9 0 0 0 9 9\"></path>","git-pull-request":"<circle cx=\"18\" cy=\"18\" r=\"3\"></circle><circle cx=\"6\" cy=\"6\" r=\"3\"></circle><path d=\"M13 6h3a2 2 0 0 1 2 2v7\"></path><line x1=\"6\" y1=\"9\" x2=\"6\" y2=\"21\"></line>","github":"<path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\"></path>","gitlab":"<path d=\"M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z\"></path>","globe":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path>","grid":"<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect>","hard-drive":"<line x1=\"22\" y1=\"12\" x2=\"2\" y2=\"12\"></line><path d=\"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"></path><line x1=\"6\" y1=\"16\" x2=\"6.01\" y2=\"16\"></line><line x1=\"10\" y1=\"16\" x2=\"10.01\" y2=\"16\"></line>","hash":"<line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\"></line><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\"></line><line x1=\"10\" y1=\"3\" x2=\"8\" y2=\"21\"></line><line x1=\"16\" y1=\"3\" x2=\"14\" y2=\"21\"></line>","headphones":"<path d=\"M3 18v-6a9 9 0 0 1 18 0v6\"></path><path d=\"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z\"></path>","heart":"<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>","help-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"></line>","hexagon":"<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path>","home":"<path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline>","image":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle><polyline points=\"21 15 16 10 5 21\"></polyline>","inbox":"<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"></polyline><path d=\"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"></path>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line>","instagram":"<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"></rect><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"></path><line x1=\"17.5\" y1=\"6.5\" x2=\"17.51\" y2=\"6.5\"></line>","italic":"<line x1=\"19\" y1=\"4\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"20\" x2=\"5\" y2=\"20\"></line><line x1=\"15\" y1=\"4\" x2=\"9\" y2=\"20\"></line>","key":"<path d=\"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4\"></path>","layers":"<polygon points=\"12 2 2 7 12 12 22 7 12 2\"></polygon><polyline points=\"2 17 12 22 22 17\"></polyline><polyline points=\"2 12 12 17 22 12\"></polyline>","layout":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line>","life-buoy":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"9.17\" y2=\"9.17\"></line><line x1=\"14.83\" y1=\"14.83\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"14.83\" y1=\"9.17\" x2=\"19.07\" y2=\"4.93\"></line><line x1=\"14.83\" y1=\"9.17\" x2=\"18.36\" y2=\"5.64\"></line><line x1=\"4.93\" y1=\"19.07\" x2=\"9.17\" y2=\"14.83\"></line>","link-2":"<path d=\"M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3\"></path><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>","linkedin":"<path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z\"></path><rect x=\"2\" y=\"9\" width=\"4\" height=\"12\"></rect><circle cx=\"4\" cy=\"4\" r=\"2\"></circle>","list":"<line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"></line><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"></line>","loader":"<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"6\"></line><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"22\"></line><line x1=\"4.93\" y1=\"4.93\" x2=\"7.76\" y2=\"7.76\"></line><line x1=\"16.24\" y1=\"16.24\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"2\" y1=\"12\" x2=\"6\" y2=\"12\"></line><line x1=\"18\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"4.93\" y1=\"19.07\" x2=\"7.76\" y2=\"16.24\"></line><line x1=\"16.24\" y1=\"7.76\" x2=\"19.07\" y2=\"4.93\"></line>","lock":"<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>","log-in":"<path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\"></path><polyline points=\"10 17 15 12 10 7\"></polyline><line x1=\"15\" y1=\"12\" x2=\"3\" y2=\"12\"></line>","log-out":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"></path><polyline points=\"16 17 21 12 16 7\"></polyline><line x1=\"21\" y1=\"12\" x2=\"9\" y2=\"12\"></line>","mail":"<path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path><polyline points=\"22,6 12,13 2,6\"></polyline>","map-pin":"<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle>","map":"<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\"></polygon><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"18\"></line><line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"22\"></line>","maximize-2":"<polyline points=\"15 3 21 3 21 9\"></polyline><polyline points=\"9 21 3 21 3 15\"></polyline><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"></line><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"></line>","maximize":"<path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"></path>","meh":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"8\" y1=\"15\" x2=\"16\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>","menu":"<line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line>","message-circle":"<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"></path>","message-square":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>","mic-off":"<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6\"></path><path d=\"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>","mic":"<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>","minimize-2":"<polyline points=\"4 14 10 14 10 20\"></polyline><polyline points=\"20 10 14 10 14 4\"></polyline><line x1=\"14\" y1=\"10\" x2=\"21\" y2=\"3\"></line><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"></line>","minimize":"<path d=\"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3\"></path>","minus-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","minus-square":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","minus":"<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>","monitor":"<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"></line><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"></line>","moon":"<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path>","more-horizontal":"<circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle>","more-vertical":"<circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"12\" cy=\"5\" r=\"1\"></circle><circle cx=\"12\" cy=\"19\" r=\"1\"></circle>","mouse-pointer":"<path d=\"M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z\"></path><path d=\"M13 13l6 6\"></path>","move":"<polyline points=\"5 9 2 12 5 15\"></polyline><polyline points=\"9 5 12 2 15 5\"></polyline><polyline points=\"15 19 12 22 9 19\"></polyline><polyline points=\"19 9 22 12 19 15\"></polyline><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"></line>","music":"<path d=\"M9 18V5l12-2v13\"></path><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><circle cx=\"18\" cy=\"16\" r=\"3\"></circle>","navigation-2":"<polygon points=\"12 2 19 21 12 17 5 21 12 2\"></polygon>","navigation":"<polygon points=\"3 11 22 2 13 21 11 13 3 11\"></polygon>","octagon":"<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"></polygon>","package":"<line x1=\"16.5\" y1=\"9.4\" x2=\"7.5\" y2=\"4.21\"></line><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>","paperclip":"<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path>","pause-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"10\" y1=\"15\" x2=\"10\" y2=\"9\"></line><line x1=\"14\" y1=\"15\" x2=\"14\" y2=\"9\"></line>","pause":"<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"></rect><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"></rect>","pen-tool":"<path d=\"M12 19l7-7 3 3-7 7-3-3z\"></path><path d=\"M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\"></path><path d=\"M2 2l7.586 7.586\"></path><circle cx=\"11\" cy=\"11\" r=\"2\"></circle>","percent":"<line x1=\"19\" y1=\"5\" x2=\"5\" y2=\"19\"></line><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"></circle><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"></circle>","phone-call":"<path d=\"M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","phone-forwarded":"<polyline points=\"19 1 23 5 19 9\"></polyline><line x1=\"15\" y1=\"5\" x2=\"23\" y2=\"5\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","phone-incoming":"<polyline points=\"16 2 16 8 22 8\"></polyline><line x1=\"23\" y1=\"1\" x2=\"16\" y2=\"8\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","phone-missed":"<line x1=\"23\" y1=\"1\" x2=\"17\" y2=\"7\"></line><line x1=\"17\" y1=\"1\" x2=\"23\" y2=\"7\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","phone-off":"<path d=\"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91\"></path><line x1=\"23\" y1=\"1\" x2=\"1\" y2=\"23\"></line>","phone-outgoing":"<polyline points=\"23 7 23 1 17 1\"></polyline><line x1=\"16\" y1=\"8\" x2=\"23\" y2=\"1\"></line><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","phone":"<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>","pie-chart":"<path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\"></path><path d=\"M22 12A10 10 0 0 0 12 2v10z\"></path>","play-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"10 8 16 12 10 16 10 8\"></polygon>","play":"<polygon points=\"5 3 19 12 5 21 5 3\"></polygon>","plus-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","plus-square":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>","plus":"<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>","pocket":"<path d=\"M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z\"></path><polyline points=\"8 10 12 14 16 10\"></polyline>","power":"<path d=\"M18.36 6.64a9 9 0 1 1-12.73 0\"></path><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"12\"></line>","printer":"<polyline points=\"6 9 6 2 18 2 18 9\"></polyline><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"></rect>","radio":"<circle cx=\"12\" cy=\"12\" r=\"2\"></circle><path d=\"M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14\"></path>","refresh-ccw":"<polyline points=\"1 4 1 10 7 10\"></polyline><polyline points=\"23 20 23 14 17 14\"></polyline><path d=\"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15\"></path>","refresh-cw":"<polyline points=\"23 4 23 10 17 10\"></polyline><polyline points=\"1 20 1 14 7 14\"></polyline><path d=\"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15\"></path>","repeat":"<polyline points=\"17 1 21 5 17 9\"></polyline><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"></path><polyline points=\"7 23 3 19 7 15\"></polyline><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"></path>","rewind":"<polygon points=\"11 19 2 12 11 5 11 19\"></polygon><polygon points=\"22 19 13 12 22 5 22 19\"></polygon>","rotate-ccw":"<polyline points=\"1 4 1 10 7 10\"></polyline><path d=\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\"></path>","rotate-cw":"<polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path>","rss":"<path d=\"M4 11a9 9 0 0 1 9 9\"></path><path d=\"M4 4a16 16 0 0 1 16 16\"></path><circle cx=\"5\" cy=\"19\" r=\"1\"></circle>","save":"<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"></path><polyline points=\"17 21 17 13 7 13 7 21\"></polyline><polyline points=\"7 3 7 8 15 8\"></polyline>","scissors":"<circle cx=\"6\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><line x1=\"20\" y1=\"4\" x2=\"8.12\" y2=\"15.88\"></line><line x1=\"14.47\" y1=\"14.48\" x2=\"20\" y2=\"20\"></line><line x1=\"8.12\" y1=\"8.12\" x2=\"12\" y2=\"12\"></line>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>","send":"<line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"></line><polygon points=\"22 2 15 22 11 13 2 9 22 2\"></polygon>","server":"<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>","settings":"<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>","share-2":"<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"></line><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"></line>","share":"<path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\"></path><polyline points=\"16 6 12 2 8 6\"></polyline><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"></line>","shield-off":"<path d=\"M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18\"></path><path d=\"M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","shield":"<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path>","shopping-bag":"<path d=\"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"></path><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><path d=\"M16 10a4 4 0 0 1-8 0\"></path>","shopping-cart":"<circle cx=\"9\" cy=\"21\" r=\"1\"></circle><circle cx=\"20\" cy=\"21\" r=\"1\"></circle><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"></path>","shuffle":"<polyline points=\"16 3 21 3 21 8\"></polyline><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\"></line><polyline points=\"21 16 21 21 16 21\"></polyline><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\"></line><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"></line>","sidebar":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"></line>","skip-back":"<polygon points=\"19 20 9 12 19 4 19 20\"></polygon><line x1=\"5\" y1=\"19\" x2=\"5\" y2=\"5\"></line>","skip-forward":"<polygon points=\"5 4 15 12 5 20 5 4\"></polygon><line x1=\"19\" y1=\"5\" x2=\"19\" y2=\"19\"></line>","slack":"<path d=\"M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z\"></path><path d=\"M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z\"></path><path d=\"M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z\"></path><path d=\"M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z\"></path><path d=\"M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z\"></path><path d=\"M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z\"></path><path d=\"M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z\"></path><path d=\"M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z\"></path>","slash":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"></line>","sliders":"<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line>","smartphone":"<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"></line>","smile":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"></path><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>","speaker":"<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"></rect><circle cx=\"12\" cy=\"14\" r=\"4\"></circle><line x1=\"12\" y1=\"6\" x2=\"12.01\" y2=\"6\"></line>","square":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>","star":"<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon>","stop-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect>","sun":"<circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line>","sunrise":"<path d=\"M17 18a5 5 0 0 0-10 0\"></path><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"9\"></line><line x1=\"4.22\" y1=\"10.22\" x2=\"5.64\" y2=\"11.64\"></line><line x1=\"1\" y1=\"18\" x2=\"3\" y2=\"18\"></line><line x1=\"21\" y1=\"18\" x2=\"23\" y2=\"18\"></line><line x1=\"18.36\" y1=\"11.64\" x2=\"19.78\" y2=\"10.22\"></line><line x1=\"23\" y1=\"22\" x2=\"1\" y2=\"22\"></line><polyline points=\"8 6 12 2 16 6\"></polyline>","sunset":"<path d=\"M17 18a5 5 0 0 0-10 0\"></path><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"2\"></line><line x1=\"4.22\" y1=\"10.22\" x2=\"5.64\" y2=\"11.64\"></line><line x1=\"1\" y1=\"18\" x2=\"3\" y2=\"18\"></line><line x1=\"21\" y1=\"18\" x2=\"23\" y2=\"18\"></line><line x1=\"18.36\" y1=\"11.64\" x2=\"19.78\" y2=\"10.22\"></line><line x1=\"23\" y1=\"22\" x2=\"1\" y2=\"22\"></line><polyline points=\"16 5 12 9 8 5\"></polyline>","table":"<path d=\"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18\"></path>","tablet":"<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"></line>","tag":"<path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"></path><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"></line>","target":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle>","terminal":"<polyline points=\"4 17 10 11 4 5\"></polyline><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line>","thermometer":"<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"></path>","thumbs-down":"<path d=\"M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17\"></path>","thumbs-up":"<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\"></path>","toggle-left":"<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"></rect><circle cx=\"8\" cy=\"12\" r=\"3\"></circle>","toggle-right":"<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"></rect><circle cx=\"16\" cy=\"12\" r=\"3\"></circle>","tool":"<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path>","trash-2":"<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line>","trash":"<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>","trello":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><rect x=\"7\" y=\"7\" width=\"3\" height=\"9\"></rect><rect x=\"14\" y=\"7\" width=\"3\" height=\"5\"></rect>","trending-down":"<polyline points=\"23 18 13.5 8.5 8.5 13.5 1 6\"></polyline><polyline points=\"17 18 23 18 23 12\"></polyline>","trending-up":"<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline>","triangle":"<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path>","truck":"<rect x=\"1\" y=\"3\" width=\"15\" height=\"13\"></rect><polygon points=\"16 8 20 8 23 11 23 16 16 16 16 8\"></polygon><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"></circle><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"></circle>","tv":"<rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>","twitch":"<path d=\"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7\"></path>","twitter":"<path d=\"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z\"></path>","type":"<polyline points=\"4 7 4 4 20 4 20 7\"></polyline><line x1=\"9\" y1=\"20\" x2=\"15\" y2=\"20\"></line><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"></line>","umbrella":"<path d=\"M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7\"></path>","underline":"<path d=\"M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3\"></path><line x1=\"4\" y1=\"21\" x2=\"20\" y2=\"21\"></line>","unlock":"<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"></path>","upload-cloud":"<polyline points=\"16 16 12 12 8 16\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3\"></path><polyline points=\"16 16 12 12 8 16\"></polyline>","upload":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"17 8 12 3 7 8\"></polyline><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"></line>","user-check":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><polyline points=\"17 11 19 13 23 9\"></polyline>","user-minus":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"></line>","user-plus":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"20\" y1=\"8\" x2=\"20\" y2=\"14\"></line><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"></line>","user-x":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"8.5\" cy=\"7\" r=\"4\"></circle><line x1=\"18\" y1=\"8\" x2=\"23\" y2=\"13\"></line><line x1=\"23\" y1=\"8\" x2=\"18\" y2=\"13\"></line>","user":"<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>","users":"<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>","video-off":"<path d=\"M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","video":"<polygon points=\"23 7 16 12 23 17 23 7\"></polygon><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"></rect>","voicemail":"<circle cx=\"5.5\" cy=\"11.5\" r=\"4.5\"></circle><circle cx=\"18.5\" cy=\"11.5\" r=\"4.5\"></circle><line x1=\"5.5\" y1=\"16\" x2=\"18.5\" y2=\"16\"></line>","volume-1":"<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"></path>","volume-2":"<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\"></path>","volume-x":"<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><line x1=\"23\" y1=\"9\" x2=\"17\" y2=\"15\"></line><line x1=\"17\" y1=\"9\" x2=\"23\" y2=\"15\"></line>","volume":"<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon>","watch":"<circle cx=\"12\" cy=\"12\" r=\"7\"></circle><polyline points=\"12 9 12 12 13.5 13.5\"></polyline><path d=\"M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83\"></path>","wifi-off":"<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line><path d=\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55\"></path><path d=\"M5 12.55a10.94 10.94 0 0 1 5.17-2.39\"></path><path d=\"M10.71 5.05A16 16 0 0 1 22.58 9\"></path><path d=\"M1.42 9a15.91 15.91 0 0 1 4.7-2.88\"></path><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"></path><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"></line>","wifi":"<path d=\"M5 12.55a11 11 0 0 1 14.08 0\"></path><path d=\"M1.42 9a16 16 0 0 1 21.16 0\"></path><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"></path><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"></line>","wind":"<path d=\"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2\"></path>","x-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line>","x-octagon":"<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"></polygon><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line>","x-square":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line>","x":"<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>","youtube":"<path d=\"M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z\"></path><polygon points=\"9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02\"></polygon>","zap-off":"<polyline points=\"12.41 6.75 13 2 10.57 4.92\"></polyline><polyline points=\"18.57 12.91 21 10 15.66 10\"></polyline><polyline points=\"8 8 3 14 12 14 11 22 16 16\"></polyline><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>","zap":"<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon>","zoom-in":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line>","zoom-out":"<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line>"};

/***/ }),

/***/ "./node_modules/classnames/dedupe.js":
/*!*******************************************!*\
  !*** ./node_modules/classnames/dedupe.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var classNames = (function () {
		// don't inherit from Object so we can skip hasOwnProperty check later
		// http://stackoverflow.com/questions/15518328/creating-js-object-with-object-createnull#answer-21079232
		function StorageObject() {}
		StorageObject.prototype = Object.create(null);

		function _parseArray (resultSet, array) {
			var length = array.length;

			for (var i = 0; i < length; ++i) {
				_parse(resultSet, array[i]);
			}
		}

		var hasOwn = {}.hasOwnProperty;

		function _parseNumber (resultSet, num) {
			resultSet[num] = true;
		}

		function _parseObject (resultSet, object) {
			for (var k in object) {
				if (hasOwn.call(object, k)) {
					// set value to false instead of deleting it to avoid changing object structure
					// https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/#de-referencing-misconceptions
					resultSet[k] = !!object[k];
				}
			}
		}

		var SPACE = /\s+/;
		function _parseString (resultSet, str) {
			var array = str.split(SPACE);
			var length = array.length;

			for (var i = 0; i < length; ++i) {
				resultSet[array[i]] = true;
			}
		}

		function _parse (resultSet, arg) {
			if (!arg) return;
			var argType = typeof arg;

			// 'foo bar'
			if (argType === 'string') {
				_parseString(resultSet, arg);

			// ['foo', 'bar', ...]
			} else if (Array.isArray(arg)) {
				_parseArray(resultSet, arg);

			// { 'foo': true, ... }
			} else if (argType === 'object') {
				_parseObject(resultSet, arg);

			// '130'
			} else if (argType === 'number') {
				_parseNumber(resultSet, arg);
			}
		}

		function _classNames () {
			// don't leak arguments
			// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
			var len = arguments.length;
			var args = Array(len);
			for (var i = 0; i < len; i++) {
				args[i] = arguments[i];
			}

			var classSet = new StorageObject();
			_parseArray(classSet, args);

			var list = [];

			for (var k in classSet) {
				if (classSet[k]) {
					list.push(k);
				}
			}

			return list.join(' ');
		}

		return _classNames;
	})();

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
}());


/***/ }),

/***/ "./node_modules/core-js/es/array/from.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/es/array/from.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__(/*! ../../modules/es.array.from */ "./node_modules/core-js/modules/es.array.from.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js/internals/path.js");

module.exports = path.Array.from;


/***/ }),

/***/ "./node_modules/core-js/internals/a-function.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-function.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-from.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-from.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/bind-context */ "./node_modules/core-js/internals/bind-context.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    result = new C();
    for (;!(step = iterator.next()).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
// false -> Array#indexOf
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
// true  -> Array#includes
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/bind-context.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/bind-context.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/check-correctness-of-iteration.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js/internals/create-iterator-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iterator-constructor.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var IteratorPrototype = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype;
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-iterator.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/create-iterator-constructor */ "./node_modules/core-js/internals/create-iterator-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js");

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var exist = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return exist ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f;
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      hide(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/function-to-string.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");

module.exports = shared('native-function-to-string', Function.toString);


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var O = 'object';
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == O && globalThis) ||
  check(typeof window == O && window) ||
  check(typeof self == O && self) ||
  check(typeof global == O && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")));

/***/ }),

/***/ "./node_modules/core-js/internals/has.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/has.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/hide.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/hide.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var document = global.document;

module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var split = ''.split;

module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/native-weak-map */ "./node_modules/core-js/internals/native-weak-map.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var objectHas = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),

/***/ "./node_modules/core-js/internals/native-weak-map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/native-weak-map.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var nativeFunctionToString = __webpack_require__(/*! ../internals/function-to-string */ "./node_modules/core-js/internals/function-to-string.js");

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var defineProperties = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var key;
  while (length > i) definePropertyModule.f(O, key = keys[i++], Properties[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");

var nativeDefineProperty = Object.defineProperty;

exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var arrayIncludes = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var arrayIndexOf = arrayIncludes(false);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var validateSetPrototypeOfArguments = __webpack_require__(/*! ../internals/validate-set-prototype-of-arguments */ "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js");

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var correctSetter = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    correctSetter = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    validateSetPrototypeOfArguments(O, proto);
    if (correctSetter) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var Reflect = global.Reflect;

// all object keys, includes non-enumerable and symbols
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");


/***/ }),

/***/ "./node_modules/core-js/internals/redefine.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/redefine.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");
var nativeFunctionToString = __webpack_require__(/*! ../internals/function-to-string */ "./node_modules/core-js/internals/function-to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(nativeFunctionToString).split('toString');

shared('inspectSource', function (it) {
  return nativeFunctionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else hide(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || nativeFunctionToString.call(this);
});


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-global.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/set-global.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");

module.exports = function (key, value) {
  try {
    hide(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.1.3',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/internals/string-at.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/string-at.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

// CONVERT_TO_STRING: true  -> String#at
// CONVERT_TO_STRING: false -> String#codePointAt
module.exports = function (that, pos, CONVERT_TO_STRING) {
  var S = String(requireObjectCoercible(that));
  var position = toInteger(pos);
  var size = S.length;
  var first, second;
  if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
  first = S.charCodeAt(position);
  return first < 0xD800 || first > 0xDBFF || position + 1 === size
    || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
      ? CONVERT_TO_STRING ? S.charAt(position) : first
      : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

// 7.1.1 ToPrimitive(input [, PreferredType])
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js/internals/validate-set-prototype-of-arguments.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

module.exports = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) {
    throw TypeError("Can't set " + String(proto) + ' as a prototype');
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

var Symbol = global.Symbol;
var store = shared('wks');

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.from.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.from.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var from = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js/internals/array-from.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var codePointAt = __webpack_require__(/*! ../internals/string-at */ "./node_modules/core-js/internals/string-at.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/define-iterator */ "./node_modules/core-js/internals/define-iterator.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = codePointAt(string, index, true);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/default-attrs.json":
/*!********************************!*\
  !*** ./src/default-attrs.json ***!
  \********************************/
/*! exports provided: xmlns, width, height, viewBox, fill, stroke, stroke-width, stroke-linecap, stroke-linejoin, default */
/***/ (function(module) {

module.exports = {"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};

/***/ }),

/***/ "./src/icon.js":
/*!*********************!*\
  !*** ./src/icon.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dedupe = __webpack_require__(/*! classnames/dedupe */ "./node_modules/classnames/dedupe.js");

var _dedupe2 = _interopRequireDefault(_dedupe);

var _defaultAttrs = __webpack_require__(/*! ./default-attrs.json */ "./src/default-attrs.json");

var _defaultAttrs2 = _interopRequireDefault(_defaultAttrs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Icon = function () {
  function Icon(name, contents) {
    var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Icon);

    this.name = name;
    this.contents = contents;
    this.tags = tags;
    this.attrs = _extends({}, _defaultAttrs2.default, { class: 'feather feather-' + name });
  }

  /**
   * Create an SVG string.
   * @param {Object} attrs
   * @returns {string}
   */


  _createClass(Icon, [{
    key: 'toSvg',
    value: function toSvg() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var combinedAttrs = _extends({}, this.attrs, attrs, { class: (0, _dedupe2.default)(this.attrs.class, attrs.class) });

      return '<svg ' + attrsToString(combinedAttrs) + '>' + this.contents + '</svg>';
    }

    /**
     * Return string representation of an `Icon`.
     *
     * Added for backward compatibility. If old code expects `feather.icons.<name>`
     * to be a string, `toString()` will get implicitly called.
     *
     * @returns {string}
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.contents;
    }
  }]);

  return Icon;
}();

/**
 * Convert attributes object to string of HTML attributes.
 * @param {Object} attrs
 * @returns {string}
 */


function attrsToString(attrs) {
  return Object.keys(attrs).map(function (key) {
    return key + '="' + attrs[key] + '"';
  }).join(' ');
}

exports.default = Icon;

/***/ }),

/***/ "./src/icons.js":
/*!**********************!*\
  !*** ./src/icons.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = __webpack_require__(/*! ./icon */ "./src/icon.js");

var _icon2 = _interopRequireDefault(_icon);

var _icons = __webpack_require__(/*! ../dist/icons.json */ "./dist/icons.json");

var _icons2 = _interopRequireDefault(_icons);

var _tags = __webpack_require__(/*! ./tags.json */ "./src/tags.json");

var _tags2 = _interopRequireDefault(_tags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Object.keys(_icons2.default).map(function (key) {
  return new _icon2.default(key, _icons2.default[key], _tags2.default[key]);
}).reduce(function (object, icon) {
  object[icon.name] = icon;
  return object;
}, {});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var _icons = __webpack_require__(/*! ./icons */ "./src/icons.js");

var _icons2 = _interopRequireDefault(_icons);

var _toSvg = __webpack_require__(/*! ./to-svg */ "./src/to-svg.js");

var _toSvg2 = _interopRequireDefault(_toSvg);

var _replace = __webpack_require__(/*! ./replace */ "./src/replace.js");

var _replace2 = _interopRequireDefault(_replace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = { icons: _icons2.default, toSvg: _toSvg2.default, replace: _replace2.default };

/***/ }),

/***/ "./src/replace.js":
/*!************************!*\
  !*** ./src/replace.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-env browser */


var _dedupe = __webpack_require__(/*! classnames/dedupe */ "./node_modules/classnames/dedupe.js");

var _dedupe2 = _interopRequireDefault(_dedupe);

var _icons = __webpack_require__(/*! ./icons */ "./src/icons.js");

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Replace all HTML elements that have a `data-feather` attribute with SVG markup
 * corresponding to the element's `data-feather` attribute value.
 * @param {Object} attrs
 */
function replace() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (typeof document === 'undefined') {
    throw new Error('`feather.replace()` only works in a browser environment.');
  }

  var elementsToReplace = document.querySelectorAll('[data-feather]');

  Array.from(elementsToReplace).forEach(function (element) {
    return replaceElement(element, attrs);
  });
}

/**
 * Replace a single HTML element with SVG markup
 * corresponding to the element's `data-feather` attribute value.
 * @param {HTMLElement} element
 * @param {Object} attrs
 */
function replaceElement(element) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var elementAttrs = getAttrs(element);
  var name = elementAttrs['data-feather'];
  delete elementAttrs['data-feather'];

  var svgString = _icons2.default[name].toSvg(_extends({}, attrs, elementAttrs, { class: (0, _dedupe2.default)(attrs.class, elementAttrs.class) }));
  var svgDocument = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  var svgElement = svgDocument.querySelector('svg');

  element.parentNode.replaceChild(svgElement, element);
}

/**
 * Get the attributes of an HTML element.
 * @param {HTMLElement} element
 * @returns {Object}
 */
function getAttrs(element) {
  return Array.from(element.attributes).reduce(function (attrs, attr) {
    attrs[attr.name] = attr.value;
    return attrs;
  }, {});
}

exports.default = replace;

/***/ }),

/***/ "./src/tags.json":
/*!***********************!*\
  !*** ./src/tags.json ***!
  \***********************/
/*! exports provided: activity, airplay, alert-circle, alert-octagon, alert-triangle, align-center, align-justify, align-left, align-right, anchor, archive, at-sign, award, aperture, bar-chart, bar-chart-2, battery, battery-charging, bell, bell-off, bluetooth, book-open, book, bookmark, box, briefcase, calendar, camera, cast, chevron-down, chevron-up, circle, clipboard, clock, cloud-drizzle, cloud-lightning, cloud-rain, cloud-snow, cloud, codepen, codesandbox, code, coffee, columns, command, compass, copy, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, cpu, credit-card, crop, crosshair, database, delete, disc, dollar-sign, droplet, edit, edit-2, edit-3, eye, eye-off, external-link, facebook, fast-forward, figma, file-minus, file-plus, file-text, film, filter, flag, folder-minus, folder-plus, folder, framer, frown, gift, git-branch, git-commit, git-merge, git-pull-request, github, gitlab, globe, hard-drive, hash, headphones, heart, help-circle, hexagon, home, image, inbox, instagram, key, layers, layout, life-bouy, link, link-2, linkedin, list, lock, log-in, log-out, mail, map-pin, map, maximize, maximize-2, meh, menu, message-circle, message-square, mic-off, mic, minimize, minimize-2, minus, monitor, moon, more-horizontal, more-vertical, mouse-pointer, move, music, navigation, navigation-2, octagon, package, paperclip, pause, pause-circle, pen-tool, percent, phone-call, phone-forwarded, phone-incoming, phone-missed, phone-off, phone-outgoing, phone, play, pie-chart, play-circle, plus, plus-circle, plus-square, pocket, power, printer, radio, refresh-cw, refresh-ccw, repeat, rewind, rotate-ccw, rotate-cw, rss, save, scissors, search, send, settings, share-2, shield, shield-off, shopping-bag, shopping-cart, shuffle, skip-back, skip-forward, slack, slash, sliders, smartphone, smile, speaker, star, stop-circle, sun, sunrise, sunset, tablet, tag, target, terminal, thermometer, thumbs-down, thumbs-up, toggle-left, toggle-right, tool, trash, trash-2, triangle, truck, tv, twitch, twitter, type, umbrella, unlock, user-check, user-minus, user-plus, user-x, user, users, video-off, video, voicemail, volume, volume-1, volume-2, volume-x, watch, wifi-off, wifi, wind, x-circle, x-octagon, x-square, x, youtube, zap-off, zap, zoom-in, zoom-out, default */
/***/ (function(module) {

module.exports = {"activity":["pulse","health","action","motion"],"airplay":["stream","cast","mirroring"],"alert-circle":["warning","alert","danger"],"alert-octagon":["warning","alert","danger"],"alert-triangle":["warning","alert","danger"],"align-center":["text alignment","center"],"align-justify":["text alignment","justified"],"align-left":["text alignment","left"],"align-right":["text alignment","right"],"anchor":[],"archive":["index","box"],"at-sign":["mention","at","email","message"],"award":["achievement","badge"],"aperture":["camera","photo"],"bar-chart":["statistics","diagram","graph"],"bar-chart-2":["statistics","diagram","graph"],"battery":["power","electricity"],"battery-charging":["power","electricity"],"bell":["alarm","notification","sound"],"bell-off":["alarm","notification","silent"],"bluetooth":["wireless"],"book-open":["read","library"],"book":["read","dictionary","booklet","magazine","library"],"bookmark":["read","clip","marker","tag"],"box":["cube"],"briefcase":["work","bag","baggage","folder"],"calendar":["date"],"camera":["photo"],"cast":["chromecast","airplay"],"chevron-down":["expand"],"chevron-up":["collapse"],"circle":["off","zero","record"],"clipboard":["copy"],"clock":["time","watch","alarm"],"cloud-drizzle":["weather","shower"],"cloud-lightning":["weather","bolt"],"cloud-rain":["weather"],"cloud-snow":["weather","blizzard"],"cloud":["weather"],"codepen":["logo"],"codesandbox":["logo"],"code":["source","programming"],"coffee":["drink","cup","mug","tea","cafe","hot","beverage"],"columns":["layout"],"command":["keyboard","cmd","terminal","prompt"],"compass":["navigation","safari","travel","direction"],"copy":["clone","duplicate"],"corner-down-left":["arrow","return"],"corner-down-right":["arrow"],"corner-left-down":["arrow"],"corner-left-up":["arrow"],"corner-right-down":["arrow"],"corner-right-up":["arrow"],"corner-up-left":["arrow"],"corner-up-right":["arrow"],"cpu":["processor","technology"],"credit-card":["purchase","payment","cc"],"crop":["photo","image"],"crosshair":["aim","target"],"database":["storage","memory"],"delete":["remove"],"disc":["album","cd","dvd","music"],"dollar-sign":["currency","money","payment"],"droplet":["water"],"edit":["pencil","change"],"edit-2":["pencil","change"],"edit-3":["pencil","change"],"eye":["view","watch"],"eye-off":["view","watch","hide","hidden"],"external-link":["outbound"],"facebook":["logo","social"],"fast-forward":["music"],"figma":["logo","design","tool"],"file-minus":["delete","remove","erase"],"file-plus":["add","create","new"],"file-text":["data","txt","pdf"],"film":["movie","video"],"filter":["funnel","hopper"],"flag":["report"],"folder-minus":["directory"],"folder-plus":["directory"],"folder":["directory"],"framer":["logo","design","tool"],"frown":["emoji","face","bad","sad","emotion"],"gift":["present","box","birthday","party"],"git-branch":["code","version control"],"git-commit":["code","version control"],"git-merge":["code","version control"],"git-pull-request":["code","version control"],"github":["logo","version control"],"gitlab":["logo","version control"],"globe":["world","browser","language","translate"],"hard-drive":["computer","server","memory","data"],"hash":["hashtag","number","pound"],"headphones":["music","audio","sound"],"heart":["like","love","emotion"],"help-circle":["question mark"],"hexagon":["shape","node.js","logo"],"home":["house","living"],"image":["picture"],"inbox":["email"],"instagram":["logo","camera"],"key":["password","login","authentication","secure"],"layers":["stack"],"layout":["window","webpage"],"life-bouy":["help","life ring","support"],"link":["chain","url"],"link-2":["chain","url"],"linkedin":["logo","social media"],"list":["options"],"lock":["security","password","secure"],"log-in":["sign in","arrow","enter"],"log-out":["sign out","arrow","exit"],"mail":["email","message"],"map-pin":["location","navigation","travel","marker"],"map":["location","navigation","travel"],"maximize":["fullscreen"],"maximize-2":["fullscreen","arrows","expand"],"meh":["emoji","face","neutral","emotion"],"menu":["bars","navigation","hamburger"],"message-circle":["comment","chat"],"message-square":["comment","chat"],"mic-off":["record","sound","mute"],"mic":["record","sound","listen"],"minimize":["exit fullscreen","close"],"minimize-2":["exit fullscreen","arrows","close"],"minus":["subtract"],"monitor":["tv","screen","display"],"moon":["dark","night"],"more-horizontal":["ellipsis"],"more-vertical":["ellipsis"],"mouse-pointer":["arrow","cursor"],"move":["arrows"],"music":["note"],"navigation":["location","travel"],"navigation-2":["location","travel"],"octagon":["stop"],"package":["box","container"],"paperclip":["attachment"],"pause":["music","stop"],"pause-circle":["music","audio","stop"],"pen-tool":["vector","drawing"],"percent":["discount"],"phone-call":["ring"],"phone-forwarded":["call"],"phone-incoming":["call"],"phone-missed":["call"],"phone-off":["call","mute"],"phone-outgoing":["call"],"phone":["call"],"play":["music","start"],"pie-chart":["statistics","diagram"],"play-circle":["music","start"],"plus":["add","new"],"plus-circle":["add","new"],"plus-square":["add","new"],"pocket":["logo","save"],"power":["on","off"],"printer":["fax","office","device"],"radio":["signal"],"refresh-cw":["synchronise","arrows"],"refresh-ccw":["arrows"],"repeat":["loop","arrows"],"rewind":["music"],"rotate-ccw":["arrow"],"rotate-cw":["arrow"],"rss":["feed","subscribe"],"save":["floppy disk"],"scissors":["cut"],"search":["find","magnifier","magnifying glass"],"send":["message","mail","email","paper airplane","paper aeroplane"],"settings":["cog","edit","gear","preferences"],"share-2":["network","connections"],"shield":["security","secure"],"shield-off":["security","insecure"],"shopping-bag":["ecommerce","cart","purchase","store"],"shopping-cart":["ecommerce","cart","purchase","store"],"shuffle":["music"],"skip-back":["music"],"skip-forward":["music"],"slack":["logo"],"slash":["ban","no"],"sliders":["settings","controls"],"smartphone":["cellphone","device"],"smile":["emoji","face","happy","good","emotion"],"speaker":["audio","music"],"star":["bookmark","favorite","like"],"stop-circle":["media","music"],"sun":["brightness","weather","light"],"sunrise":["weather","time","morning","day"],"sunset":["weather","time","evening","night"],"tablet":["device"],"tag":["label"],"target":["logo","bullseye"],"terminal":["code","command line","prompt"],"thermometer":["temperature","celsius","fahrenheit","weather"],"thumbs-down":["dislike","bad","emotion"],"thumbs-up":["like","good","emotion"],"toggle-left":["on","off","switch"],"toggle-right":["on","off","switch"],"tool":["settings","spanner"],"trash":["garbage","delete","remove","bin"],"trash-2":["garbage","delete","remove","bin"],"triangle":["delta"],"truck":["delivery","van","shipping","transport","lorry"],"tv":["television","stream"],"twitch":["logo"],"twitter":["logo","social"],"type":["text"],"umbrella":["rain","weather"],"unlock":["security"],"user-check":["followed","subscribed"],"user-minus":["delete","remove","unfollow","unsubscribe"],"user-plus":["new","add","create","follow","subscribe"],"user-x":["delete","remove","unfollow","unsubscribe","unavailable"],"user":["person","account"],"users":["group"],"video-off":["camera","movie","film"],"video":["camera","movie","film"],"voicemail":["phone"],"volume":["music","sound","mute"],"volume-1":["music","sound"],"volume-2":["music","sound"],"volume-x":["music","sound","mute"],"watch":["clock","time"],"wifi-off":["disabled"],"wifi":["connection","signal","wireless"],"wind":["weather","air"],"x-circle":["cancel","close","delete","remove","times","clear"],"x-octagon":["delete","stop","alert","warning","times","clear"],"x-square":["cancel","close","delete","remove","times","clear"],"x":["cancel","close","delete","remove","times","clear"],"youtube":["logo","video","play"],"zap-off":["flash","camera","lightning"],"zap":["flash","camera","lightning"],"zoom-in":["magnifying glass"],"zoom-out":["magnifying glass"]};

/***/ }),

/***/ "./src/to-svg.js":
/*!***********************!*\
  !*** ./src/to-svg.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icons = __webpack_require__(/*! ./icons */ "./src/icons.js");

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an SVG string.
 * @deprecated
 * @param {string} name
 * @param {Object} attrs
 * @returns {string}
 */
function toSvg(name) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  console.warn('feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead.');

  if (!name) {
    throw new Error('The required `key` (icon name) parameter is missing.');
  }

  if (!_icons2.default[name]) {
    throw new Error('No icon matching \'' + name + '\'. See the complete list of icons at https://feathericons.com');
  }

  return _icons2.default[name].toSvg(attrs);
}

exports.default = toSvg;

/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi core-js/es/array/from ./src/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/es/array/from */"./node_modules/core-js/es/array/from.js");
module.exports = __webpack_require__(/*! /home/runner/work/feather/feather/src/index.js */"./src/index.js");


/***/ })

/******/ });
});

});

/**
 * This module contains various utility functions commonly used in Obsidian plugins.
 * @module obsidian-community-lib
 */
/**
 * Strip '.md' off the end of a note name to get its basename.
 *
 * Works with the edgecase where a note has '.md' in its basename: `Obsidian.md.md`, for example.
 * @param  {string} noteName with or without '.md' on the end.
 * @returns {string} noteName without '.md'
 */
const stripMD = (noteName) => {
    if (noteName.match(/\.MD$|\.md$/m)) {
        return noteName.split(/\.MD$|\.md$/m).slice(0, -1).join(".md");
    }
    else
        return noteName;
};

var main = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });



const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
const DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
const DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";

function shouldUsePeriodicNotesSettings(periodicity) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
}
/**
 * Read the user settings for the `daily-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getDailyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
            const { format, folder, template } = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
            return {
                format: format || DEFAULT_DAILY_NOTE_FORMAT,
                folder: folder?.trim() || "",
                template: template?.trim() || "",
            };
        }
        const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
        return {
            format: format || DEFAULT_DAILY_NOTE_FORMAT,
            folder: folder?.trim() || "",
            template: template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom daily note settings found!", err);
    }
}
/**
 * Read the user settings for the `weekly-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getWeeklyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        const calendarSettings = pluginManager.getPlugin("calendar")?.options;
        const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")?.settings?.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
            return {
                format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: periodicNotesSettings.folder?.trim() || "",
                template: periodicNotesSettings.template?.trim() || "",
            };
        }
        const settings = calendarSettings || {};
        return {
            format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: settings.weeklyNoteFolder?.trim() || "",
            template: settings.weeklyNoteTemplate?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom weekly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getMonthlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("monthly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
            {};
        return {
            format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom monthly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getQuarterlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("quarterly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.quarterly) ||
            {};
        return {
            format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom quarterly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getYearlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("yearly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.yearly) ||
            {};
        return {
            format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom yearly note settings found!", err);
    }
}

// Credit: @creationix/path.js
function join(...partSegments) {
    // Split the inputs into a list of path commands.
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
function basename(fullPath) {
    let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
    if (base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
    return base;
}
async function ensureFolderExists(path) {
    const dirs = path.replace(/\\/g, "/").split("/");
    dirs.pop(); // remove basename
    if (dirs.length) {
        const dir = join(...dirs);
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}
async function getNotePath(directory, filename) {
    if (!filename.endsWith(".md")) {
        filename += ".md";
    }
    const path = obsidian__default["default"].normalizePath(join(directory, filename));
    await ensureFolderExists(path);
    return path;
}
async function getTemplateInfo(template) {
    const { metadataCache, vault } = window.app;
    const templatePath = obsidian__default["default"].normalizePath(template);
    if (templatePath === "/") {
        return Promise.resolve(["", null]);
    }
    try {
        const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
        const contents = await vault.cachedRead(templateFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IFoldInfo = window.app.foldManager.load(templateFile);
        return [contents, IFoldInfo];
    }
    catch (err) {
        console.error(`Failed to read the daily note template '${templatePath}'`, err);
        new obsidian__default["default"].Notice("Failed to read the daily note template");
        return ["", null];
    }
}

/**
 * dateUID is a way of weekly identifying daily/weekly/monthly notes.
 * They are prefixed with the granularity to avoid ambiguity.
 */
function getDateUID(date, granularity = "day") {
    const ts = date.clone().startOf(granularity).format();
    return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
    return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
}
/**
 * XXX: When parsing dates that contain both week numbers and months,
 * Moment choses to ignore the week numbers. For the week dateUID, we
 * want the opposite behavior. Strip the MMM from the format to patch.
 */
function isFormatAmbiguous(format, granularity) {
    if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return (/w{1,2}/i.test(cleanFormat) &&
            (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
    }
    return false;
}
function getDateFromFile(file, granularity) {
    return getDateFromFilename(file.basename, granularity);
}
function getDateFromPath(path, granularity) {
    return getDateFromFilename(basename(path), granularity);
}
function getDateFromFilename(filename, granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings,
    };
    const format = getSettings[granularity]().format.split("/").pop();
    const noteDate = window.moment(filename, format, true);
    if (!noteDate.isValid()) {
        return null;
    }
    if (isFormatAmbiguous(format, granularity)) {
        if (granularity === "week") {
            const cleanFormat = removeEscapedCharacters(format);
            if (/w{1,2}/i.test(cleanFormat)) {
                return window.moment(filename, 
                // If format contains week, remove day & month formatting
                format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
            }
        }
    }
    return noteDate;
}

class DailyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createDailyNote(date) {
    const app = window.app;
    const { vault } = app;
    const moment = window.moment;
    const { template, format, folder } = getDailyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
            .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default["default"].Notice("Unable to create new file.");
    }
}
function getDailyNote(date, dailyNotes) {
    return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
    /**
     * Find all daily notes in the daily note folder
     */
    const { vault } = window.app;
    const { folder } = getDailyNoteSettings();
    const dailyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
    if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
    }
    const dailyNotes = {};
    obsidian__default["default"].Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian__default["default"].TFile) {
            const date = getDateFromFile(note, "day");
            if (date) {
                const dateString = getDateUID(date, "day");
                dailyNotes[dateString] = note;
            }
        }
    });
    return dailyNotes;
}

class WeeklyNotesFolderMissingError extends Error {
}
function getDaysOfWeek() {
    const { moment } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let weekStart = moment.localeData()._week.dow;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    while (weekStart) {
        daysOfWeek.push(daysOfWeek.shift());
        weekStart--;
    }
    return daysOfWeek;
}
function getDayOfWeekNumericalValue(dayOfWeekName) {
    return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
}
async function createWeeklyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getWeeklyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
            const day = getDayOfWeekNumericalValue(dayOfWeek);
            return date.weekday(day).format(momentFormat.trim());
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default["default"].Notice("Unable to create new file.");
    }
}
function getWeeklyNote(date, weeklyNotes) {
    return weeklyNotes[getDateUID(date, "week")] ?? null;
}
function getAllWeeklyNotes() {
    const weeklyNotes = {};
    if (!appHasWeeklyNotesPluginLoaded()) {
        return weeklyNotes;
    }
    const { vault } = window.app;
    const { folder } = getWeeklyNoteSettings();
    const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
    if (!weeklyNotesFolder) {
        throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
    }
    obsidian__default["default"].Vault.recurseChildren(weeklyNotesFolder, (note) => {
        if (note instanceof obsidian__default["default"].TFile) {
            const date = getDateFromFile(note, "week");
            if (date) {
                const dateString = getDateUID(date, "week");
                weeklyNotes[dateString] = note;
            }
        }
    });
    return weeklyNotes;
}

class MonthlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createMonthlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getMonthlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default["default"].Notice("Unable to create new file.");
    }
}
function getMonthlyNote(date, monthlyNotes) {
    return monthlyNotes[getDateUID(date, "month")] ?? null;
}
function getAllMonthlyNotes() {
    const monthlyNotes = {};
    if (!appHasMonthlyNotesPluginLoaded()) {
        return monthlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getMonthlyNoteSettings();
    const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
    if (!monthlyNotesFolder) {
        throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
    }
    obsidian__default["default"].Vault.recurseChildren(monthlyNotesFolder, (note) => {
        if (note instanceof obsidian__default["default"].TFile) {
            const date = getDateFromFile(note, "month");
            if (date) {
                const dateString = getDateUID(date, "month");
                monthlyNotes[dateString] = note;
            }
        }
    });
    return monthlyNotes;
}

class QuarterlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createQuarterlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getQuarterlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default["default"].Notice("Unable to create new file.");
    }
}
function getQuarterlyNote(date, quarterly) {
    return quarterly[getDateUID(date, "quarter")] ?? null;
}
function getAllQuarterlyNotes() {
    const quarterly = {};
    if (!appHasQuarterlyNotesPluginLoaded()) {
        return quarterly;
    }
    const { vault } = window.app;
    const { folder } = getQuarterlyNoteSettings();
    const quarterlyFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
    if (!quarterlyFolder) {
        throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
    }
    obsidian__default["default"].Vault.recurseChildren(quarterlyFolder, (note) => {
        if (note instanceof obsidian__default["default"].TFile) {
            const date = getDateFromFile(note, "quarter");
            if (date) {
                const dateString = getDateUID(date, "quarter");
                quarterly[dateString] = note;
            }
        }
    });
    return quarterly;
}

class YearlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createYearlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getYearlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default["default"].Notice("Unable to create new file.");
    }
}
function getYearlyNote(date, yearlyNotes) {
    return yearlyNotes[getDateUID(date, "year")] ?? null;
}
function getAllYearlyNotes() {
    const yearlyNotes = {};
    if (!appHasYearlyNotesPluginLoaded()) {
        return yearlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getYearlyNoteSettings();
    const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian__default["default"].normalizePath(folder));
    if (!yearlyNotesFolder) {
        throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
    }
    obsidian__default["default"].Vault.recurseChildren(yearlyNotesFolder, (note) => {
        if (note instanceof obsidian__default["default"].TFile) {
            const date = getDateFromFile(note, "year");
            if (date) {
                const dateString = getDateUID(date, "year");
                yearlyNotes[dateString] = note;
            }
        }
    });
    return yearlyNotes;
}

function appHasDailyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
    if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.daily?.enabled;
}
/**
 * XXX: "Weekly Notes" live in either the Calendar plugin or the periodic-notes plugin.
 * Check both until the weekly notes feature is removed from the Calendar plugin.
 */
function appHasWeeklyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (app.plugins.getPlugin("calendar")) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.weekly?.enabled;
}
function appHasMonthlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.monthly?.enabled;
}
function appHasQuarterlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.quarterly?.enabled;
}
function appHasYearlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.yearly?.enabled;
}
function getPeriodicNoteSettings(granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings,
    }[granularity];
    return getSettings();
}
function createPeriodicNote(granularity, date) {
    const createFn = {
        day: createDailyNote,
        month: createMonthlyNote,
        week: createWeeklyNote,
    };
    return createFn[granularity](date);
}

exports.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
exports.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
exports.DEFAULT_QUARTERLY_NOTE_FORMAT = DEFAULT_QUARTERLY_NOTE_FORMAT;
exports.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
exports.DEFAULT_YEARLY_NOTE_FORMAT = DEFAULT_YEARLY_NOTE_FORMAT;
exports.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
exports.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
exports.appHasQuarterlyNotesPluginLoaded = appHasQuarterlyNotesPluginLoaded;
exports.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
exports.appHasYearlyNotesPluginLoaded = appHasYearlyNotesPluginLoaded;
exports.createDailyNote = createDailyNote;
exports.createMonthlyNote = createMonthlyNote;
exports.createPeriodicNote = createPeriodicNote;
exports.createQuarterlyNote = createQuarterlyNote;
exports.createWeeklyNote = createWeeklyNote;
exports.createYearlyNote = createYearlyNote;
exports.getAllDailyNotes = getAllDailyNotes;
exports.getAllMonthlyNotes = getAllMonthlyNotes;
exports.getAllQuarterlyNotes = getAllQuarterlyNotes;
exports.getAllWeeklyNotes = getAllWeeklyNotes;
exports.getAllYearlyNotes = getAllYearlyNotes;
exports.getDailyNote = getDailyNote;
exports.getDailyNoteSettings = getDailyNoteSettings;
exports.getDateFromFile = getDateFromFile;
exports.getDateFromPath = getDateFromPath;
exports.getDateUID = getDateUID;
exports.getMonthlyNote = getMonthlyNote;
exports.getMonthlyNoteSettings = getMonthlyNoteSettings;
exports.getPeriodicNoteSettings = getPeriodicNoteSettings;
exports.getQuarterlyNote = getQuarterlyNote;
exports.getQuarterlyNoteSettings = getQuarterlyNoteSettings;
exports.getTemplateInfo = getTemplateInfo;
exports.getWeeklyNote = getWeeklyNote;
exports.getWeeklyNoteSettings = getWeeklyNoteSettings;
exports.getYearlyNote = getYearlyNote;
exports.getYearlyNoteSettings = getYearlyNoteSettings;
});

var BlockUtils = /** @class */ (function () {
    function BlockUtils() {
    }
    BlockUtils.getBlock = function (editor, file) {
        var _a, _b;
        var cursor = editor.getCursor("to");
        var fileCache = app.metadataCache.getFileCache(file);
        var currentBlock = (_a = fileCache === null || fileCache === void 0 ? void 0 : fileCache.sections) === null || _a === void 0 ? void 0 : _a.find(function (section) {
            return section.position.start.line <= cursor.line &&
                section.position.end.line >= cursor.line;
        });
        if (currentBlock.type == "list") {
            currentBlock = (_b = fileCache.listItems) === null || _b === void 0 ? void 0 : _b.find(function (list) {
                if (list.position.start.line <= cursor.line &&
                    list.position.end.line >= cursor.line) {
                    return list;
                }
            });
        }
        return currentBlock;
    };
    BlockUtils.getIdOfBlock = function (editor, block) {
        var blockId = block.id;
        if (blockId) {
            return blockId;
        }
        // Add a block id
        var sectionEnd = block.position.end;
        var pos = {
            ch: sectionEnd.col,
            line: sectionEnd.line,
        };
        var newId = Math.random().toString(36).substring(2, 8);
        var spacer = BlockUtils.shouldInsertAfter(block) ? "\n\n" : " ";
        editor.replaceRange(spacer + "^" + newId, pos);
        return newId;
    };
    BlockUtils.shouldInsertAfter = function (block) {
        if (block.type) {
            return [
                "blockquote",
                "code",
                "table",
                "heading",
                "comment",
                "footnoteDefinition",
            ].includes(block.type);
        }
    };
    BlockUtils.getBlockId = function () {
        var view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view) {
            var editor = view.editor;
            var file = view.file;
            var block = this.getBlock(editor, file);
            if (block)
                return this.getIdOfBlock(editor, block);
        }
    };
    return BlockUtils;
}());

var DEFAULT_SETTINGS = {
    openFileOnWrite: true,
    openDailyInNewPane: false,
    openFileOnWriteInNewPane: false,
    openFileWithoutWriteInNewPane: false,
    idField: "id",
    useUID: false,
    addFilepathWhenUsingUID: false,
    allowEval: false,
};

//! All of these methods are taken from https://www.npmjs.com/package/obsidian-daily-notes-interface.
function join() {
    var partSegments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        partSegments[_i] = arguments[_i];
    }
    // Split the inputs into a list of path commands.
    var parts = [];
    for (var i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    var newParts = [];
    for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
function getNotePath(directory, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!filename.endsWith(".md")) {
                        filename += ".md";
                    }
                    path = obsidian.normalizePath(join(directory, filename));
                    return [4 /*yield*/, ensureFolderExists(path)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, path];
            }
        });
    });
}
function ensureFolderExists(path) {
    return __awaiter(this, void 0, void 0, function () {
        var dirs, dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dirs = path.replace(/\\/g, "/").split("/");
                    dirs.pop(); // remove basename
                    if (!dirs.length) return [3 /*break*/, 2];
                    dir = join.apply(void 0, dirs);
                    if (!!window.app.vault.getAbstractFileByPath(dir)) return [3 /*break*/, 2];
                    return [4 /*yield*/, window.app.vault.createFolder(dir)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function getDailyNotePath(date) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, format, folder, filename, normalizedPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = main.getDailyNoteSettings(), format = _a.format, folder = _a.folder;
                    filename = date.format(format);
                    return [4 /*yield*/, getNotePath(folder, filename)];
                case 1:
                    normalizedPath = _b.sent();
                    return [2 /*return*/, normalizedPath];
            }
        });
    });
}

var EnterDataModal = /** @class */ (function (_super) {
    __extends(EnterDataModal, _super);
    function EnterDataModal(plugin, file) {
        var _this = _super.call(this, plugin.app) || this;
        _this.file = file;
        //null if for normal write mode, its not associated with a special mode like "append" or "prepend"
        _this.modes = [null, "overwrite", "append", "prepend"];
        _this.plugin = plugin;
        _this.setPlaceholder("Type your data to be written to the file or leave it empty to just open it");
        return _this;
    }
    EnterDataModal.prototype.getSuggestions = function (query) {
        var _this = this;
        if (query == "")
            query = null;
        var suggestions = [];
        var _loop_1 = function (mode) {
            if (!(mode === "overwrite" && !query)) {
                var display = void 0;
                if (query) {
                    if (mode) {
                        display = "Write \"" + query + "\" in " + mode + " mode";
                    }
                    else {
                        display = "Write \"" + query + "\"";
                    }
                }
                else {
                    if (mode) {
                        display = "Open in " + mode + " mode";
                    }
                    else {
                        display = "Open";
                    }
                }
                suggestions.push({
                    data: query,
                    display: display,
                    mode: mode,
                    func: function () {
                        if (_this.file) {
                            _this.plugin.tools.copyURI({
                                filepath: _this.file,
                                data: query,
                                mode: mode,
                            });
                        }
                        else {
                            _this.plugin.tools.copyURI({
                                daily: "true",
                                data: query,
                                mode: mode,
                            });
                        }
                    },
                });
            }
        };
        for (var _i = 0, _a = this.modes; _i < _a.length; _i++) {
            var mode = _a[_i];
            _loop_1(mode);
        }
        return suggestions;
    };
    EnterDataModal.prototype.renderSuggestion = function (value, el) {
        el.innerText = value.display;
    };
    EnterDataModal.prototype.onChooseSuggestion = function (item, _) {
        item.func();
    };
    return EnterDataModal;
}(obsidian.SuggestModal));

var FileModal = /** @class */ (function (_super) {
    __extends(FileModal, _super);
    function FileModal(plugin, placeHolder, allowNoFile) {
        if (allowNoFile === void 0) { allowNoFile = true; }
        var _this = _super.call(this, plugin.app) || this;
        _this.placeHolder = placeHolder;
        _this.allowNoFile = allowNoFile;
        _this.plugin = plugin;
        _this.setPlaceholder(_this.placeHolder);
        return _this;
    }
    FileModal.prototype.getItems = function () {
        var specialItems = [];
        if (this.allowNoFile) {
            specialItems.push({
                display: "<Don't specify a file>",
                source: undefined,
            });
        }
        var file = this.app.workspace.getActiveFile();
        if (file) {
            specialItems.push({ display: "<Current file>", source: file.path });
        }
        return __spreadArray(__spreadArray([], specialItems), this.app.vault.getFiles().map(function (e) {
            return { display: e.path, source: e.path };
        }));
    };
    FileModal.prototype.getItemText = function (item) {
        return item.display;
    };
    FileModal.prototype.onChooseItem = function (item, evt) { };
    return FileModal;
}(obsidian.FuzzySuggestModal));

function getViewStateFromMode(parameters) {
    return parameters.viewmode
        ? {
            state: {
                mode: parameters.viewmode,
                source: parameters.viewmode == "source",
            },
        }
        : undefined;
}
function copyText(text) {
    return navigator.clipboard.writeText(text);
}
function getAlternativeFilePath(file) {
    var _a;
    var dir = (_a = file.parent) === null || _a === void 0 ? void 0 : _a.path;
    var formattedDir = dir === "/" ? "" : dir;
    var name = file.name;
    for (var index = 1; index < 100; index++) {
        var base = stripMD(name);
        var alternative = formattedDir +
            (formattedDir == "" ? "" : "/") +
            base +
            (" " + index + ".md");
        var exists = app.vault.getAbstractFileByPath(alternative) !== null;
        if (!exists) {
            return alternative;
        }
    }
}
function getFileUri(file) {
    var url = new URL(app.vault.getResourcePath(file));
    url.host = "localhosthostlocal";
    url.protocol = "file";
    url.search = "";
    url.pathname = decodeURIComponent(url.pathname);
    var res = url.toString().replace("/localhosthostlocal/", "/");
    return res;
}
function getEndAndBeginningOfHeading(file, heading) {
    var _a, _b;
    var cache = app.metadataCache.getFileCache(file);
    var sections = cache.sections;
    var foundHeading = (_a = cache.headings) === null || _a === void 0 ? void 0 : _a.find(function (e) { return e.heading === heading; });
    if (foundHeading) {
        var foundSectionIndex = sections.findIndex(function (section) {
            return section.type === "heading" &&
                section.position.start.line === foundHeading.position.start.line;
        });
        var restSections = sections.slice(foundSectionIndex + 1);
        var nextHeadingIndex = restSections === null || restSections === void 0 ? void 0 : restSections.findIndex(function (e) { return e.type === "heading"; });
        var lastSection = (_b = restSections[(nextHeadingIndex !== -1
            ? nextHeadingIndex
            : restSections.length) - 1]) !== null && _b !== void 0 ? _b : sections[foundSectionIndex];
        var lastLine = lastSection.position.end.line + 1;
        return {
            lastLine: lastLine,
            firstLine: sections[foundSectionIndex].position.end.line + 1,
        };
    }
    else {
        new obsidian.Notice("Can't find heading");
    }
}

var Handlers = /** @class */ (function () {
    function Handlers(plugin) {
        this.plugin = plugin;
    }
    Object.defineProperty(Handlers.prototype, "tools", {
        get: function () {
            return this.plugin.tools;
        },
        enumerable: false,
        configurable: true
    });
    Handlers.prototype.handlePluginManagement = function (parameters) {
        if (parameters["enable-plugin"]) {
            var pluginId = parameters["enable-plugin"];
            app.plugins.enablePluginAndSave(pluginId);
            new obsidian.Notice("Enabled " + pluginId);
        }
        else if (parameters["disable-plugin"]) {
            var pluginId = parameters["disable-plugin"];
            app.plugins.disablePluginAndSave(pluginId);
            new obsidian.Notice("Disabled " + pluginId);
        }
    };
    Handlers.prototype.handleFrontmatterKey = function (parameters) {
        var _a;
        var key = parameters.frontmatterkey;
        var frontmatter = app.metadataCache.getCache((_a = parameters.filepath) !== null && _a !== void 0 ? _a : app.workspace.getActiveFile().path).frontmatter;
        var res;
        if (key.startsWith("[") && key.endsWith("]")) {
            var list = key.substring(1, key.length - 1).split(",");
            var cache = frontmatter;
            var _loop_1 = function (item) {
                if (cache instanceof Array) {
                    var index = parseInt(item);
                    if (Number.isNaN(index)) {
                        cache = cache.find(function (e) { return e == item; });
                    }
                    cache = cache[parseInt(item)];
                }
                else {
                    cache = cache[item];
                }
            };
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                _loop_1(item);
            }
            res = cache;
        }
        else {
            res = frontmatter[key];
        }
        copyText(res);
    };
    Handlers.prototype.handleWorkspace = function (parameters) {
        var _a, _b;
        var workspaces = (_b = (_a = app.internalPlugins) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b.workspaces;
        if (!workspaces) {
            new obsidian.Notice("Cannot find Workspaces plugin. Please file an issue.");
            this.plugin.failure(parameters);
        }
        else if (workspaces.enabled) {
            if (parameters.saveworkspace == "true") {
                var active = workspaces.instance.activeWorkspace;
                workspaces.instance.saveWorkspace(active);
                new obsidian.Notice("Saved current workspace to " + active);
            }
            if (parameters.workspace != undefined) {
                workspaces.instance.loadWorkspace(parameters.workspace);
            }
            this.plugin.success(parameters);
        }
        else {
            new obsidian.Notice("Workspaces plugin is not enabled");
            this.plugin.failure(parameters);
        }
    };
    Handlers.prototype.handleCommand = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var file, view, editor, data, lines, rawCommands, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parameters.filepath) return [3 /*break*/, 6];
                        if (!parameters.mode) return [3 /*break*/, 2];
                        if (parameters.mode == "new") {
                            file = app.metadataCache.getFirstLinkpathDest(parameters.filepath, "/");
                            if (file instanceof obsidian.TFile) {
                                parameters.filepath = getAlternativeFilePath(file);
                            }
                        }
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath,
                                mode: "source",
                                parameters: parameters,
                            })];
                    case 1:
                        _a.sent();
                        view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (view) {
                            editor = view.editor;
                            data = editor.getValue();
                            if (parameters.mode === "append") {
                                editor.setValue(data + "\n");
                                lines = editor.lineCount();
                                editor.setCursor({ ch: 0, line: lines });
                            }
                            else if (parameters.mode === "prepend") {
                                editor.setValue("\n" + data);
                                editor.setCursor({ ch: 0, line: 0 });
                            }
                            else if (parameters.mode === "overwrite") {
                                editor.setValue("");
                            }
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        if (!parameters.line) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath,
                                mode: "source",
                                parameters: parameters,
                            })];
                    case 3:
                        _a.sent();
                        this.plugin.setCursorInLine(parameters.line);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.plugin.open({
                            file: parameters.filepath,
                            setting: this.plugin.settings.openFileWithoutWriteInNewPane,
                            parameters: parameters,
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (parameters.commandid) {
                            app.commands.executeCommandById(parameters.commandid);
                        }
                        else if (parameters.commandname) {
                            rawCommands = app.commands.commands;
                            for (command in rawCommands) {
                                if (rawCommands[command].name === parameters.commandname) {
                                    if (rawCommands[command].callback) {
                                        rawCommands[command].callback();
                                    }
                                    else {
                                        rawCommands[command].checkCallback(false);
                                    }
                                    break;
                                }
                            }
                        }
                        this.plugin.success(parameters);
                        return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleEval = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var file, view, editor, data, lines, eval2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parameters.filepath) return [3 /*break*/, 6];
                        if (!parameters.mode) return [3 /*break*/, 2];
                        if (parameters.mode == "new") {
                            file = app.metadataCache.getFirstLinkpathDest(parameters.filepath, "/");
                            if (file instanceof obsidian.TFile) {
                                parameters.filepath = getAlternativeFilePath(file);
                            }
                        }
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath,
                                mode: "source",
                                parameters: parameters,
                            })];
                    case 1:
                        _a.sent();
                        view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (view) {
                            editor = view.editor;
                            data = editor.getValue();
                            if (parameters.mode === "append") {
                                editor.setValue(data + "\n");
                                lines = editor.lineCount();
                                editor.setCursor({ ch: 0, line: lines });
                            }
                            else if (parameters.mode === "prepend") {
                                editor.setValue("\n" + data);
                                editor.setCursor({ ch: 0, line: 0 });
                            }
                            else if (parameters.mode === "overwrite") {
                                editor.setValue("");
                            }
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        if (!parameters.line) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath,
                                mode: "source",
                                parameters: parameters,
                            })];
                    case 3:
                        _a.sent();
                        this.plugin.setCursorInLine(parameters.line);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.plugin.open({
                            file: parameters.filepath,
                            setting: this.plugin.settings.openFileWithoutWriteInNewPane,
                            parameters: parameters,
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (this.plugin.settings.allowEval) {
                            eval2 = eval;
                            eval2(parameters.eval);
                            this.plugin.success(parameters);
                        }
                        else {
                            new obsidian.Notice("Eval is not allowed. Please enable it in the settings.");
                            this.plugin.failure(parameters);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleDoesFileExist = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app.vault.adapter.exists(parameters.filepath)];
                    case 1:
                        exists = _a.sent();
                        copyText((exists ? 1 : 0).toString());
                        this.plugin.success(parameters);
                        return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleSearchAndReplace = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var file, abstractFile, data, _a, pattern, flags, regex;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (parameters.filepath) {
                            abstractFile = app.vault.getAbstractFileByPath(parameters.filepath);
                            if (abstractFile instanceof obsidian.TFile) {
                                file = abstractFile;
                            }
                        }
                        else {
                            file = app.workspace.getActiveFile();
                        }
                        if (!file) return [3 /*break*/, 3];
                        return [4 /*yield*/, app.vault.read(file)];
                    case 1:
                        data = _b.sent();
                        if (parameters.searchregex) {
                            try {
                                _a = parameters.searchregex.match(/(\/?)(.+)\1([a-z]*)/i), pattern = _a[2], flags = _a[3];
                                regex = new RegExp(pattern, flags);
                                data = data.replace(regex, parameters.replace);
                                this.plugin.success(parameters);
                            }
                            catch (error) {
                                new obsidian.Notice("Can't parse " + parameters.searchregex + " as RegEx");
                                this.plugin.failure(parameters);
                            }
                        }
                        else {
                            data = data.replaceAll(parameters.search, parameters.replace);
                            this.plugin.success(parameters);
                        }
                        return [4 /*yield*/, this.plugin.writeAndOpenFile(file.path, data, parameters)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        new obsidian.Notice("Cannot find file");
                        this.plugin.failure(parameters);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleSearch = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var view, search;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parameters.filepath) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath,
                                parameters: parameters,
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        view = app.workspace.getActiveViewOfType(obsidian.FileView);
                        view.currentMode.showSearch();
                        search = view.currentMode.search;
                        search.searchInputEl.value = parameters.search;
                        search.searchInputEl.dispatchEvent(new Event("input"));
                        return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleWrite = function (parameters, createdDailyNote) {
        var _a;
        if (createdDailyNote === void 0) { createdDailyNote = false; }
        return __awaiter(this, void 0, void 0, function () {
            var file, outFile, path;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (parameters.filepath) {
                            file = app.vault.getAbstractFileByPath(parameters.filepath);
                        }
                        else {
                            file = app.workspace.getActiveFile();
                        }
                        if (!(parameters.filepath || file)) return [3 /*break*/, 21];
                        outFile = void 0;
                        path = (_a = parameters.filepath) !== null && _a !== void 0 ? _a : file.path;
                        if (!(parameters.mode === "overwrite")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.plugin.writeAndOpenFile(path, parameters.data, parameters)];
                    case 1:
                        outFile = _b.sent();
                        this.plugin.success(parameters);
                        return [3 /*break*/, 20];
                    case 2:
                        if (!(parameters.mode === "prepend")) return [3 /*break*/, 7];
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.plugin.prepend(file, parameters)];
                    case 3:
                        outFile = _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.plugin.prepend(path, parameters)];
                    case 5:
                        outFile = _b.sent();
                        _b.label = 6;
                    case 6:
                        this.plugin.success(parameters);
                        return [3 /*break*/, 20];
                    case 7:
                        if (!(parameters.mode === "append")) return [3 /*break*/, 12];
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.plugin.append(file, parameters)];
                    case 8:
                        outFile = _b.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.plugin.append(path, parameters)];
                    case 10:
                        outFile = _b.sent();
                        _b.label = 11;
                    case 11:
                        this.plugin.success(parameters);
                        return [3 /*break*/, 20];
                    case 12:
                        if (!(parameters.mode === "new")) return [3 /*break*/, 17];
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.plugin.writeAndOpenFile(getAlternativeFilePath(file), parameters.data, parameters)];
                    case 13:
                        outFile = _b.sent();
                        this.plugin.hookSuccess(parameters, outFile);
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, this.plugin.writeAndOpenFile(path, parameters.data, parameters)];
                    case 15:
                        outFile = _b.sent();
                        this.plugin.hookSuccess(parameters, outFile);
                        _b.label = 16;
                    case 16: return [3 /*break*/, 20];
                    case 17:
                        if (!(!createdDailyNote && file instanceof obsidian.TFile)) return [3 /*break*/, 18];
                        new obsidian.Notice("File already exists");
                        this.plugin.openExistingFileAndSetCursor(file.path, parameters);
                        this.plugin.failure(parameters);
                        return [3 /*break*/, 20];
                    case 18: return [4 /*yield*/, this.plugin.writeAndOpenFile(path, parameters.data, parameters)];
                    case 19:
                        outFile = _b.sent();
                        this.plugin.success(parameters);
                        _b.label = 20;
                    case 20:
                        if (parameters.uid) {
                            this.tools.writeUIDToFile(outFile, parameters.uid);
                        }
                        return [3 /*break*/, 22];
                    case 21:
                        new obsidian.Notice("Cannot find file");
                        this.plugin.failure(parameters);
                        _b.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleOpen = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var view, cache, heading, view, cache, block, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(parameters.heading != undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath + "#" + parameters.heading,
                                setting: this.plugin.settings.openFileWithoutWriteInNewPane,
                                parameters: parameters,
                                supportPopover: false,
                            })];
                    case 1:
                        _a.sent();
                        view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (!view)
                            return [2 /*return*/];
                        cache = app.metadataCache.getFileCache(view.file);
                        heading = cache.headings.find(function (e) { return e.heading === parameters.heading; });
                        view.editor.focus();
                        view.editor.setCursor({
                            line: heading.position.start.line + 1,
                            ch: 0,
                        });
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(parameters.block != undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.plugin.open({
                                file: parameters.filepath + "#^" + parameters.block,
                                setting: this.plugin.settings.openFileWithoutWriteInNewPane,
                                parameters: parameters,
                                supportPopover: false,
                            })];
                    case 3:
                        _a.sent();
                        view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (!view)
                            return [2 /*return*/];
                        cache = app.metadataCache.getFileCache(view.file);
                        block = cache.blocks[parameters.block];
                        view.editor.focus();
                        view.editor.setCursor({ line: block.position.start.line, ch: 0 });
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.plugin.open({
                            file: parameters.filepath,
                            setting: this.plugin.settings.openFileWithoutWriteInNewPane,
                            parameters: parameters,
                            mode: parameters.line != undefined ? "source" : undefined,
                        })];
                    case 5:
                        _a.sent();
                        if (parameters.line != undefined) {
                            this.plugin.setCursorInLine(parameters.line);
                        }
                        _a.label = 6;
                    case 6:
                        if (!(parameters.mode != undefined)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.plugin.setCursor(parameters.mode)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (parameters.uid) {
                            view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                            this.tools.writeUIDToFile(view.file, parameters.uid);
                        }
                        this.plugin.success(parameters);
                        return [2 /*return*/];
                }
            });
        });
    };
    Handlers.prototype.handleCopyFileURI = function (withoutData, file) {
        var _this = this;
        var view = app.workspace.getActiveViewOfType(obsidian.FileView);
        if (!view && !file)
            return;
        if (view instanceof obsidian.MarkdownView) {
            var pos = view.editor.getCursor();
            var cache = app.metadataCache.getFileCache(view.file);
            if (cache.headings) {
                for (var _i = 0, _a = cache.headings; _i < _a.length; _i++) {
                    var heading = _a[_i];
                    if (heading.position.start.line <= pos.line &&
                        heading.position.end.line >= pos.line) {
                        this.tools.copyURI({
                            filepath: view.file.path,
                            heading: heading.heading,
                        });
                        return;
                    }
                }
            }
            if (cache.blocks) {
                for (var _b = 0, _c = Object.keys(cache.blocks); _b < _c.length; _b++) {
                    var blockID = _c[_b];
                    var block = cache.blocks[blockID];
                    if (block.position.start.line <= pos.line &&
                        block.position.end.line >= pos.line) {
                        this.tools.copyURI({
                            filepath: view.file.path,
                            block: blockID,
                        });
                        return;
                    }
                }
            }
        }
        if (withoutData) {
            var file2 = file !== null && file !== void 0 ? file : app.workspace.getActiveFile();
            if (!file2) {
                new obsidian.Notice("No file opened");
                return;
            }
            this.tools.copyURI({
                filepath: file2.path,
            });
        }
        else {
            var fileModal = new FileModal(this.plugin, "Choose a file", false);
            fileModal.open();
            fileModal.onChooseItem = function (item, _) {
                new EnterDataModal(_this.plugin, item.source).open();
            };
        }
    };
    Handlers.prototype.handleOpenSettings = function (parameters) {
        if (app.setting.containerEl.parentElement === null) {
            app.setting.open();
        }
        if (parameters.settingid == "plugin-browser") {
            app.setting.openTabById("community-plugins");
            app.setting.activeTab.containerEl.find(".mod-cta").click();
        }
        else if (parameters.settingid == "theme-browser") {
            app.setting.openTabById("appearance");
            app.setting.activeTab.containerEl.find(".mod-cta").click();
        }
        else {
            app.setting.openTabById(parameters.settingid);
        }
        if (parameters.settingsection) {
            var elements = app.setting.tabContentContainer.querySelectorAll("*");
            var heading = Array.prototype.find.call(elements, function (e) { return e.textContent == parameters.settingsection; });
            if (heading) {
                heading.scrollIntoView();
            }
        }
        this.plugin.success(parameters);
    };
    Handlers.prototype.handleUpdatePlugins = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters.settingid = "community-plugins";
                        this.handleOpenSettings(parameters);
                        app.setting.activeTab.containerEl.findAll(".mod-cta").last().click();
                        new obsidian.Notice("Waiting 10 seconds");
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10 * 1000); })];
                    case 1:
                        _a.sent();
                        if (Object.keys(app.plugins.updates).length !== 0) {
                            app.setting.activeTab.containerEl
                                .findAll(".mod-cta")
                                .last()
                                .click();
                        }
                        this.plugin.success(parameters);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Handlers;
}());

var CommandModal = /** @class */ (function (_super) {
    __extends(CommandModal, _super);
    function CommandModal(plugin, file) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.file = file;
        return _this;
    }
    CommandModal.prototype.getItems = function () {
        var rawCommands = this.app.commands.commands;
        var commands = Object.keys(rawCommands).map(function (e) {
            return { id: rawCommands[e].id, name: rawCommands[e].name };
        });
        return commands;
    };
    CommandModal.prototype.getItemText = function (item) {
        return item.name;
    };
    CommandModal.prototype.onChooseItem = function (item, _) {
        this.plugin.tools.copyURI({
            filepath: this.file,
            commandid: item.id,
        });
    };
    return CommandModal;
}(obsidian.FuzzySuggestModal));

var ReplaceModal = /** @class */ (function (_super) {
    __extends(ReplaceModal, _super);
    function ReplaceModal(plugin, search, filepath) {
        var _this = _super.call(this, plugin.app) || this;
        _this.search = search;
        _this.filepath = filepath;
        _this.emptyText = "Empty text (replace with nothing)";
        _this.plugin = plugin;
        _this.setPlaceholder("Replacement text");
        return _this;
    }
    ReplaceModal.prototype.getSuggestions = function (query) {
        if (query === "") {
            query = this.emptyText;
        }
        return [query];
    };
    ReplaceModal.prototype.renderSuggestion = function (value, el) {
        el.innerText = value;
    };
    ReplaceModal.prototype.onChooseSuggestion = function (item, _) {
        if (this.search.isRegEx) {
            this.plugin.tools.copyURI({
                filepath: this.filepath,
                searchregex: this.search.source,
                replace: item == this.emptyText ? "" : item,
            });
        }
        else {
            this.plugin.tools.copyURI({
                filepath: this.filepath,
                search: this.search.source,
                replace: item == this.emptyText ? "" : item,
            });
        }
    };
    return ReplaceModal;
}(obsidian.SuggestModal));

var SearchModal = /** @class */ (function (_super) {
    __extends(SearchModal, _super);
    function SearchModal(plugin) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.setPlaceholder("Searched text. RegEx is supported");
        return _this;
    }
    SearchModal.prototype.getSuggestions = function (query) {
        if (query === "") {
            query = "...";
        }
        var regex;
        try {
            regex = new RegExp(query);
        }
        catch (error) { }
        return [
            {
                source: query,
                isRegEx: false,
                display: query,
            },
            {
                source: query,
                display: regex ? "As RegEx: " + query : "Can't parse RegEx",
                isRegEx: true,
            },
        ];
    };
    SearchModal.prototype.renderSuggestion = function (value, el) {
        el.innerText = value.display;
    };
    SearchModal.prototype.onChooseSuggestion = function (item, _) { };
    return SearchModal;
}(obsidian.SuggestModal));

var SettingsTab = /** @class */ (function (_super) {
    __extends(SettingsTab, _super);
    function SettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl("h2", { text: this.plugin.manifest.name });
        new obsidian.Setting(containerEl).setName("Open file on write").addToggle(function (cb) {
            return cb
                .setValue(_this.plugin.settings.openFileOnWrite)
                .onChange(function (value) {
                _this.plugin.settings.openFileOnWrite = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Open file on write in a new pane")
            .setDisabled(this.plugin.settings.openFileOnWrite)
            .addToggle(function (cb) {
            return cb
                .setValue(_this.plugin.settings.openFileOnWriteInNewPane)
                .onChange(function (value) {
                _this.plugin.settings.openFileOnWriteInNewPane = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Open daily note in a new pane")
            .addToggle(function (cb) {
            return cb
                .setValue(_this.plugin.settings.openDailyInNewPane)
                .onChange(function (value) {
                _this.plugin.settings.openDailyInNewPane = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Open file without write in new pane")
            .addToggle(function (cb) {
            return cb
                .setValue(_this.plugin.settings.openFileWithoutWriteInNewPane)
                .onChange(function (value) {
                _this.plugin.settings.openFileWithoutWriteInNewPane =
                    value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Use UID instead of file paths")
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.useUID).onChange(function (value) {
                _this.plugin.settings.useUID = value;
                _this.plugin.saveSettings();
                _this.display();
            });
        });
        if (this.plugin.settings.useUID) {
            new obsidian.Setting(containerEl)
                .setName("Add filepath parameter")
                .setDesc("When using UID instead of file paths, you can still add the filepath parameter to know what this URI is about. It's NOT actually used.")
                .addToggle(function (cb) {
                return cb
                    .setValue(_this.plugin.settings.addFilepathWhenUsingUID)
                    .onChange(function (value) {
                    _this.plugin.settings.addFilepathWhenUsingUID =
                        value;
                    _this.plugin.saveSettings();
                });
            });
        }
        new obsidian.Setting(containerEl)
            .setName("UID field in frontmatter")
            .addText(function (cb) {
            return cb.setValue(_this.plugin.settings.idField).onChange(function (value) {
                _this.plugin.settings.idField = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Allow executing arbitrary code via eval")
            .setDesc("⚠️ This can be dangerous as it allows executing arbitrary code. Only enable this if you trust the source of the URIs you are using and know what you are doing. ⚠️")
            .addToggle(function (cb) {
            return cb
                .setValue(_this.plugin.settings.allowEval)
                .onChange(function (value) {
                _this.plugin.settings.allowEval = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Donate")
            .setDesc("If you like this Plugin, consider donating to support continued development.")
            .addButton(function (bt) {
            bt.buttonEl.outerHTML =
                "<a href='https://ko-fi.com/F1F195IQ5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>";
        });
    };
    return SettingsTab;
}(obsidian.PluginSettingTab));

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

/**
 * These methods depend on the plugins settings in contrast to the utils.ts file, which's functions are independent of the plugins settings.
 */
var Tools = /** @class */ (function () {
    function Tools(plugin) {
        this.plugin = plugin;
    }
    Object.defineProperty(Tools.prototype, "settings", {
        get: function () {
            return this.plugin.settings;
        },
        enumerable: false,
        configurable: true
    });
    Tools.prototype.writeUIDToFile = function (file, uid) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var frontmatter, fileContent, isYamlEmpty, splitContent, newFileContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        frontmatter = (_a = app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
                        return [4 /*yield*/, app.vault.read(file)];
                    case 1:
                        fileContent = _b.sent();
                        isYamlEmpty = (!frontmatter || frontmatter.length === 0) &&
                            !fileContent.match(/^-{3}\s*\n*\r*-{3}/);
                        splitContent = fileContent.split("\n");
                        if (isYamlEmpty) {
                            splitContent.unshift("---");
                            splitContent.unshift(this.plugin.settings.idField + ": " + uid);
                            splitContent.unshift("---");
                        }
                        else {
                            splitContent.splice(1, 0, this.plugin.settings.idField + ": " + uid);
                        }
                        newFileContent = splitContent.join("\n");
                        return [4 /*yield*/, app.vault.modify(file, newFileContent)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, uid];
                }
            });
        });
    };
    Tools.prototype.getUIDFromFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, i, uid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i <= 20)) return [3 /*break*/, 4];
                        cache = app.metadataCache.getFileCache(file);
                        if (cache !== undefined)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 150); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        uid = obsidian.parseFrontMatterEntry(cache.frontmatter, this.plugin.settings.idField);
                        if (uid != undefined)
                            return [2 /*return*/, uid];
                        return [4 /*yield*/, this.writeUIDToFile(file, v4())];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tools.prototype.generateURI = function (parameters, doubleEncode) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, suffix, file, _a, parameter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prefix = "obsidian://advanced-uri?vault=" + encodeURIComponent(app.vault.getName());
                        suffix = "";
                        file = app.vault.getAbstractFileByPath(parameters.filepath);
                        if (!(this.settings.useUID && file instanceof obsidian.TFile)) return [3 /*break*/, 2];
                        if (!this.settings.addFilepathWhenUsingUID)
                            parameters.filepath = undefined;
                        _a = parameters;
                        return [4 /*yield*/, this.getUIDFromFile(file)];
                    case 1:
                        _a.uid = _b.sent();
                        _b.label = 2;
                    case 2:
                        for (parameter in parameters) {
                            if (parameters[parameter] != undefined) {
                                suffix =
                                    suffix +
                                        ("&" + parameter + "=" + encodeURIComponent(parameters[parameter]));
                            }
                        }
                        if (doubleEncode) {
                            return [2 /*return*/, prefix + encodeURI(suffix)];
                        }
                        else {
                            return [2 /*return*/, prefix + suffix];
                        }
                }
            });
        });
    };
    Tools.prototype.copyURI = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateURI(parameters, true)];
                    case 1:
                        uri = _a.sent();
                        return [4 /*yield*/, copyText(uri)];
                    case 2:
                        _a.sent();
                        new obsidian.Notice("Advanced URI copied to your clipboard");
                        return [2 /*return*/];
                }
            });
        });
    };
    return Tools;
}());

var AdvancedURI = /** @class */ (function (_super) {
    __extends(AdvancedURI, _super);
    function AdvancedURI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handlers = new Handlers(_this);
        _this.tools = new Tools(_this);
        return _this;
    }
    AdvancedURI.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new SettingsTab(this.app, this));
                        this.addCommand({
                            id: "copy-uri-current-file",
                            name: "copy URI for file with options",
                            callback: function () { return _this.handlers.handleCopyFileURI(false); },
                        });
                        this.addCommand({
                            id: "copy-uri-current-file-simple",
                            name: "copy URI for current file",
                            callback: function () { return _this.handlers.handleCopyFileURI(true); },
                        });
                        this.addCommand({
                            id: "copy-uri-daily",
                            name: "copy URI for daily note",
                            callback: function () { return new EnterDataModal(_this).open(); },
                        });
                        this.addCommand({
                            id: "copy-uri-search-and-replace",
                            name: "copy URI for search and replace",
                            callback: function () {
                                var fileModal = new FileModal(_this, "Used file for search and replace");
                                fileModal.open();
                                fileModal.onChooseItem = function (filePath) {
                                    var searchModal = new SearchModal(_this);
                                    searchModal.open();
                                    searchModal.onChooseSuggestion = function (item) {
                                        new ReplaceModal(_this, item, filePath === null || filePath === void 0 ? void 0 : filePath.source).open();
                                    };
                                };
                            },
                        });
                        this.addCommand({
                            id: "copy-uri-command",
                            name: "copy URI for command",
                            callback: function () {
                                var fileModal = new FileModal(_this, "Select a file to be opened before executing the command");
                                fileModal.open();
                                fileModal.onChooseItem = function (item) {
                                    new CommandModal(_this, item === null || item === void 0 ? void 0 : item.source).open();
                                };
                            },
                        });
                        this.addCommand({
                            id: "copy-uri-block",
                            name: "copy URI for current block",
                            checkCallback: function (checking) {
                                var view = _this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                                if (checking)
                                    return view != undefined;
                                var id = BlockUtils.getBlockId();
                                if (id) {
                                    _this.tools.copyURI({
                                        filepath: view.file.path,
                                        block: id,
                                    });
                                }
                            },
                        });
                        this.registerObsidianProtocolHandler("advanced-uri", function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var parameters, createdDailyNote, parameter, res, file, parentFolder, parentFolderPath, index, extension, moment_1, allDailyNotes, dailyNote, _a, _b;
                            var _this = this;
                            var _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        parameters = e;
                                        createdDailyNote = false;
                                        for (parameter in parameters) {
                                            parameters[parameter] = decodeURIComponent(parameters[parameter]);
                                        }
                                        this.lastParameters = __assign({}, parameters);
                                        if (parameters.uid) {
                                            res = (_c = this.getFileFromUID(parameters.uid)) === null || _c === void 0 ? void 0 : _c.path;
                                            if (res != undefined) {
                                                parameters.filepath = res;
                                                parameters.uid = undefined;
                                            }
                                        }
                                        else if (parameters.filename) {
                                            file = this.app.metadataCache.getFirstLinkpathDest(parameters.filename, "");
                                            if (!file) {
                                                file = this.app.vault
                                                    .getMarkdownFiles()
                                                    .find(function (file) {
                                                    var _a;
                                                    return (_a = obsidian.parseFrontMatterAliases(_this.app.metadataCache.getFileCache(file)
                                                        .frontmatter)) === null || _a === void 0 ? void 0 : _a.includes(parameters.filename);
                                                });
                                            }
                                            parentFolder = this.app.fileManager.getNewFileParent((_d = this.app.workspace.activeLeaf.view.file) === null || _d === void 0 ? void 0 : _d.path);
                                            parentFolderPath = parentFolder.isRoot()
                                                ? ""
                                                : parentFolder.path + "/";
                                            parameters.filepath =
                                                (_e = file === null || file === void 0 ? void 0 : file.path) !== null && _e !== void 0 ? _e : parentFolderPath + obsidian.normalizePath(parameters.filename);
                                        }
                                        if (!parameters.filepath) return [3 /*break*/, 1];
                                        parameters.filepath = obsidian.normalizePath(parameters.filepath);
                                        index = parameters.filepath.lastIndexOf(".");
                                        extension = parameters.filepath.substring(index < 0 ? parameters.filepath.length : index);
                                        if (extension === "") {
                                            parameters.filepath = parameters.filepath + ".md";
                                        }
                                        return [3 /*break*/, 7];
                                    case 1:
                                        if (!(parameters.daily === "true")) return [3 /*break*/, 7];
                                        if (!main.appHasDailyNotesPluginLoaded()) {
                                            new obsidian.Notice("Daily notes plugin is not loaded");
                                            return [2 /*return*/];
                                        }
                                        moment_1 = window.moment(Date.now());
                                        allDailyNotes = main.getAllDailyNotes();
                                        dailyNote = main.getDailyNote(moment_1, allDailyNotes);
                                        if (!!dailyNote) return [3 /*break*/, 6];
                                        if (!(parameters.exists === "true")) return [3 /*break*/, 3];
                                        _a = parameters;
                                        return [4 /*yield*/, getDailyNotePath(moment_1)];
                                    case 2:
                                        _a.filepath = _f.sent();
                                        return [3 /*break*/, 6];
                                    case 3: return [4 /*yield*/, main.createDailyNote(moment_1)];
                                    case 4:
                                        dailyNote = _f.sent();
                                        // delay to let Obsidian index and generate CachedMetadata
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                                    case 5:
                                        // delay to let Obsidian index and generate CachedMetadata
                                        _f.sent();
                                        createdDailyNote = true;
                                        _f.label = 6;
                                    case 6:
                                        if (dailyNote !== undefined) {
                                            parameters.filepath = dailyNote.path;
                                        }
                                        _f.label = 7;
                                    case 7:
                                        if (!(parameters.clipboard === "true")) return [3 /*break*/, 9];
                                        _b = parameters;
                                        return [4 /*yield*/, navigator.clipboard.readText()];
                                    case 8:
                                        _b.data = _f.sent();
                                        _f.label = 9;
                                    case 9:
                                        if (parameters["enable-plugin"] || parameters["disable-plugin"]) {
                                            this.handlers.handlePluginManagement(parameters);
                                        }
                                        else if (parameters.frontmatterkey) {
                                            this.handlers.handleFrontmatterKey(parameters);
                                        }
                                        else if (parameters.workspace ||
                                            parameters.saveworkspace == "true") {
                                            this.handlers.handleWorkspace(parameters);
                                        }
                                        else if (parameters.commandname || parameters.commandid) {
                                            this.handlers.handleCommand(parameters);
                                        }
                                        else if (parameters.eval) {
                                            this.handlers.handleEval(parameters);
                                        }
                                        else if (parameters.filepath && parameters.exists === "true") {
                                            this.handlers.handleDoesFileExist(parameters);
                                        }
                                        else if (parameters.data) {
                                            this.handlers.handleWrite(parameters, createdDailyNote);
                                        }
                                        else if (parameters.filepath && parameters.heading) {
                                            this.handlers.handleOpen(parameters);
                                        }
                                        else if (parameters.filepath && parameters.block) {
                                            this.handlers.handleOpen(parameters);
                                        }
                                        else if ((parameters.search || parameters.searchregex) &&
                                            parameters.replace != undefined) {
                                            this.handlers.handleSearchAndReplace(parameters);
                                        }
                                        else if (parameters.search) {
                                            this.handlers.handleSearch(parameters);
                                        }
                                        else if (parameters.filepath) {
                                            this.handlers.handleOpen(parameters);
                                        }
                                        else if (parameters.settingid) {
                                            this.handlers.handleOpenSettings(parameters);
                                        }
                                        else if (parameters.updateplugins) {
                                            this.handlers.handleUpdatePlugins(parameters);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.registerObsidianProtocolHandler("hook-get-advanced-uri", function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var parameters, parameter, activeLeaf, file;
                            return __generator(this, function (_a) {
                                parameters = e;
                                for (parameter in parameters) {
                                    parameters[parameter] = decodeURIComponent(parameters[parameter]);
                                }
                                activeLeaf = this.app.workspace.activeLeaf;
                                file = activeLeaf.view.file;
                                if (activeLeaf && file) {
                                    this.hookSuccess(parameters, file);
                                }
                                else {
                                    this.failure(parameters, {
                                        errorMessage: "No file opened",
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        this.registerEvent(this.app.workspace.on("file-menu", function (menu, file, source) {
                            console.log(source);
                            if (!(source === "more-options" ||
                                source === "tab-header" ||
                                source == "file-explorer-context-menu")) {
                                return;
                            }
                            if (!(file instanceof obsidian.TFile)) {
                                return;
                            }
                            menu.addItem(function (item) {
                                item.setTitle("Copy Advanced URI")
                                    .setIcon("link")
                                    .setSection("info")
                                    .onClick(function (_) {
                                    return _this.handlers.handleCopyFileURI(true, file);
                                });
                            });
                        }));
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedURI.prototype.hookSuccess = function (parameters, file) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!parameters["x-success"])
                            return [2 /*return*/];
                        _a = {
                            title: stripMD(file.name)
                        };
                        return [4 /*yield*/, this.tools.generateURI({ filepath: file.path }, false)];
                    case 1:
                        options = (_a.advanceduri = _b.sent(),
                            _a.urlkey = "advanceduri",
                            _a.fileuri = getFileUri(file),
                            _a);
                        this.success(parameters, options);
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedURI.prototype.success = function (parameters, options) {
        if (parameters["x-success"]) {
            var url = new URL(parameters["x-success"]);
            for (var param in options) {
                url.searchParams.set(param, options[param]);
            }
            window.open(url.toString());
        }
    };
    AdvancedURI.prototype.failure = function (parameters, options) {
        if (parameters["x-error"]) {
            var url = new URL(parameters["x-error"]);
            for (var param in options) {
                url.searchParams.set(param, options[param]);
            }
            window.open(url.toString());
        }
    };
    AdvancedURI.prototype.getFileFromUID = function (uid) {
        var _this = this;
        var files = this.app.vault.getFiles();
        var idKey = this.settings.idField;
        return files.find(function (file) {
            var _a;
            return obsidian.parseFrontMatterEntry((_a = _this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter, idKey) == uid;
        });
    };
    AdvancedURI.prototype.append = function (file, parameters) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var path, dataToWrite, line, data, lines, fileData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!parameters.heading) return [3 /*break*/, 3];
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 2];
                        path = file.path;
                        line = (_a = getEndAndBeginningOfHeading(file, parameters.heading)) === null || _a === void 0 ? void 0 : _a.lastLine;
                        if (line === undefined)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.app.vault.read(file)];
                    case 1:
                        data = _b.sent();
                        lines = data.split("\n");
                        lines.splice.apply(lines, __spreadArray([line, 0], parameters.data.split("\n")));
                        dataToWrite = lines.join("\n");
                        _b.label = 2;
                    case 2: return [3 /*break*/, 7];
                    case 3:
                        fileData = void 0;
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.app.vault.read(file)];
                    case 4:
                        fileData = _b.sent();
                        path = file.path;
                        return [3 /*break*/, 6];
                    case 5:
                        path = file;
                        fileData = "";
                        _b.label = 6;
                    case 6:
                        dataToWrite = fileData + "\n" + parameters.data;
                        _b.label = 7;
                    case 7: return [2 /*return*/, this.writeAndOpenFile(path, dataToWrite, parameters)];
                }
            });
        });
    };
    AdvancedURI.prototype.prepend = function (file, parameters) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var path, dataToWrite, line, data, lines, fileData, cache, line, first, last;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!parameters.heading) return [3 /*break*/, 3];
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 2];
                        path = file.path;
                        line = (_a = getEndAndBeginningOfHeading(file, parameters.heading)) === null || _a === void 0 ? void 0 : _a.firstLine;
                        if (line === undefined)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.app.vault.read(file)];
                    case 1:
                        data = _b.sent();
                        lines = data.split("\n");
                        lines.splice.apply(lines, __spreadArray([line, 0], parameters.data.split("\n")));
                        dataToWrite = lines.join("\n");
                        _b.label = 2;
                    case 2: return [3 /*break*/, 6];
                    case 3:
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.app.vault.read(file)];
                    case 4:
                        fileData = _b.sent();
                        cache = this.app.metadataCache.getFileCache(file);
                        if (cache.frontmatter) {
                            line = cache.frontmatter.position.end.line;
                            first = fileData
                                .split("\n")
                                .slice(0, line + 1)
                                .join("\n");
                            last = fileData
                                .split("\n")
                                .slice(line + 1)
                                .join("\n");
                            dataToWrite = first + "\n" + parameters.data + "\n" + last;
                        }
                        else {
                            dataToWrite = parameters.data + "\n" + fileData;
                        }
                        path = file.path;
                        return [3 /*break*/, 6];
                    case 5:
                        path = file;
                        dataToWrite = parameters.data;
                        _b.label = 6;
                    case 6: return [2 /*return*/, this.writeAndOpenFile(path, dataToWrite, parameters)];
                }
            });
        });
    };
    AdvancedURI.prototype.writeAndOpenFile = function (outputFileName, text, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var file, parts, dir, base64regex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.app.vault.getAbstractFileByPath(outputFileName);
                        if (!(file instanceof obsidian.TFile)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.app.vault.modify(file, text)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        parts = outputFileName.split("/");
                        dir = parts.slice(0, parts.length - 1).join("/");
                        if (!(parts.length > 1 &&
                            !(this.app.vault.getAbstractFileByPath(dir) instanceof obsidian.TFolder))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.app.vault.createFolder(dir)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
                        if (!base64regex.test(text)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.app.vault.createBinary(outputFileName, obsidian.base64ToArrayBuffer(text))];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.app.vault.create(outputFileName, text)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        this.openExistingFileAndSetCursor(outputFileName, parameters);
                        return [2 /*return*/, this.app.vault.getAbstractFileByPath(outputFileName)];
                }
            });
        });
    };
    AdvancedURI.prototype.openExistingFileAndSetCursor = function (file, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (parameters.openmode == "silent")
                            return [2 /*return*/];
                        if (!this.settings.openFileOnWrite) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.open({
                                file: file,
                                setting: this.settings.openFileOnWriteInNewPane,
                                parameters: parameters,
                            })];
                    case 1:
                        _a.sent();
                        if (parameters.line != undefined) {
                            this.setCursorInLine(parameters.line);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    AdvancedURI.prototype.open = function (_a) {
        var file = _a.file, setting = _a.setting, parameters = _a.parameters, supportPopover = _a.supportPopover, mode = _a.mode;
        return __awaiter(this, void 0, void 0, function () {
            var hoverEditor, leaf_1, tfile, openMode, fileIsAlreadyOpened_1;
            var _this = this;
            return __generator(this, function (_b) {
                if (parameters.openmode == "popover" && (supportPopover !== null && supportPopover !== void 0 ? supportPopover : true)) {
                    hoverEditor = this.app.plugins.plugins["obsidian-hover-editor"];
                    if (!hoverEditor) {
                        new obsidian.Notice("Cannot find Hover Editor plugin. Please file an issue.");
                        this.failure(parameters);
                    }
                    leaf_1 = hoverEditor.spawnPopover(undefined, function () {
                        _this.app.workspace.setActiveLeaf(leaf_1, { focus: true });
                    });
                    tfile = file instanceof obsidian.TFile
                        ? file
                        : this.app.vault.getAbstractFileByPath(file);
                    leaf_1.openFile(tfile);
                }
                else {
                    openMode = setting;
                    if (parameters.newpane !== undefined) {
                        openMode = parameters.newpane == "true";
                    }
                    if (parameters.openmode !== undefined) {
                        if (parameters.openmode == "true" ||
                            parameters.openmode == "false") {
                            openMode = parameters.openmode == "true";
                        }
                        else if (parameters.openmode == "popover") {
                            openMode = false;
                        }
                        else {
                            openMode = parameters.openmode;
                        }
                    }
                    if (openMode == "silent") {
                        return [2 /*return*/];
                    }
                    fileIsAlreadyOpened_1 = false;
                    if (isBoolean(openMode)) {
                        app.workspace.iterateAllLeaves(function (leaf) {
                            var _a;
                            if (((_a = leaf.view.file) === null || _a === void 0 ? void 0 : _a.path) === parameters.filepath) {
                                if (fileIsAlreadyOpened_1 && leaf.width == 0)
                                    return;
                                fileIsAlreadyOpened_1 = true;
                                app.workspace.setActiveLeaf(leaf, { focus: true });
                            }
                        });
                    }
                    return [2 /*return*/, this.app.workspace.openLinkText(file instanceof obsidian.TFile ? file.path : file, "/", fileIsAlreadyOpened_1 ? false : openMode, mode != undefined
                            ? { state: { mode: mode } }
                            : getViewStateFromMode(parameters))];
                }
                return [2 /*return*/];
            });
        });
    };
    AdvancedURI.prototype.setCursor = function (mode) {
        return __awaiter(this, void 0, void 0, function () {
            var view, editor, viewState, lastLine, lastLineLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (!view) return [3 /*break*/, 4];
                        editor = view.editor;
                        viewState = view.leaf.getViewState();
                        viewState.state.mode = "source";
                        if (!(mode === "append")) return [3 /*break*/, 2];
                        lastLine = editor.lastLine();
                        lastLineLength = editor.getLine(lastLine).length;
                        return [4 /*yield*/, view.leaf.setViewState(viewState, { focus: true })];
                    case 1:
                        _a.sent();
                        editor.setCursor({ ch: lastLineLength, line: lastLine });
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(mode === "prepend")) return [3 /*break*/, 4];
                        return [4 /*yield*/, view.leaf.setViewState(viewState, { focus: true })];
                    case 3:
                        _a.sent();
                        editor.setCursor({ ch: 0, line: 0 });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdvancedURI.prototype.setCursorInLine = function (rawLine) {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view)
            return;
        var viewState = view.leaf.getViewState();
        if (viewState.state.mode !== "source") {
            viewState.state.mode = "source";
            view.leaf.setViewState(viewState);
        }
        var line = Math.min(rawLine - 1, view.editor.lineCount() - 1);
        view.editor.focus();
        view.editor.setCursor({
            line: line,
            ch: view.editor.getLine(line).length,
        });
    };
    AdvancedURI.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvancedURI.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AdvancedURI;
}(obsidian.Plugin));

module.exports = AdvancedURI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9mZWF0aGVyLWljb25zL2Rpc3QvZmVhdGhlci5qcyIsIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1jb21tdW5pdHktbGliL2Rpc3QvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvb2JzaWRpYW4tZGFpbHktbm90ZXMtaW50ZXJmYWNlL2Rpc3QvbWFpbi5qcyIsInNyYy9ibG9ja191dGlscy50cyIsInNyYy9jb25zdGFudHMudHMiLCJzcmMvZGFpbHlfbm90ZV91dGlscy50cyIsInNyYy9tb2RhbHMvZW50ZXJfZGF0YV9tb2RhbC50cyIsInNyYy9tb2RhbHMvZmlsZV9tb2RhbC50cyIsInNyYy91dGlscy50cyIsInNyYy9oYW5kbGVycy50cyIsInNyYy9tb2RhbHMvY29tbWFuZF9tb2RhbC50cyIsInNyYy9tb2RhbHMvcmVwbGFjZV9tb2RhbC50cyIsInNyYy9tb2RhbHMvc2VhcmNoX21vZGFsLnRzIiwic3JjL3NldHRpbmdzLnRzIiwibm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsInNyYy90b29scy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19lc0RlY29yYXRlKGN0b3IsIGRlc2NyaXB0b3JJbiwgZGVjb3JhdG9ycywgY29udGV4dEluLCBpbml0aWFsaXplcnMsIGV4dHJhSW5pdGlhbGl6ZXJzKSB7XHJcbiAgICBmdW5jdGlvbiBhY2NlcHQoZikgeyBpZiAoZiAhPT0gdm9pZCAwICYmIHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbiBleHBlY3RlZFwiKTsgcmV0dXJuIGY7IH1cclxuICAgIHZhciBraW5kID0gY29udGV4dEluLmtpbmQsIGtleSA9IGtpbmQgPT09IFwiZ2V0dGVyXCIgPyBcImdldFwiIDoga2luZCA9PT0gXCJzZXR0ZXJcIiA/IFwic2V0XCIgOiBcInZhbHVlXCI7XHJcbiAgICB2YXIgdGFyZ2V0ID0gIWRlc2NyaXB0b3JJbiAmJiBjdG9yID8gY29udGV4dEluW1wic3RhdGljXCJdID8gY3RvciA6IGN0b3IucHJvdG90eXBlIDogbnVsbDtcclxuICAgIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckluIHx8ICh0YXJnZXQgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgY29udGV4dEluLm5hbWUpIDoge30pO1xyXG4gICAgdmFyIF8sIGRvbmUgPSBmYWxzZTtcclxuICAgIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbikgY29udGV4dFtwXSA9IHAgPT09IFwiYWNjZXNzXCIgPyB7fSA6IGNvbnRleHRJbltwXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbi5hY2Nlc3MpIGNvbnRleHQuYWNjZXNzW3BdID0gY29udGV4dEluLmFjY2Vzc1twXTtcclxuICAgICAgICBjb250ZXh0LmFkZEluaXRpYWxpemVyID0gZnVuY3Rpb24gKGYpIHsgaWYgKGRvbmUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgYWRkIGluaXRpYWxpemVycyBhZnRlciBkZWNvcmF0aW9uIGhhcyBjb21wbGV0ZWRcIik7IGV4dHJhSW5pdGlhbGl6ZXJzLnB1c2goYWNjZXB0KGYgfHwgbnVsbCkpOyB9O1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAoMCwgZGVjb3JhdG9yc1tpXSkoa2luZCA9PT0gXCJhY2Nlc3NvclwiID8geyBnZXQ6IGRlc2NyaXB0b3IuZ2V0LCBzZXQ6IGRlc2NyaXB0b3Iuc2V0IH0gOiBkZXNjcmlwdG9yW2tleV0sIGNvbnRleHQpO1xyXG4gICAgICAgIGlmIChraW5kID09PSBcImFjY2Vzc29yXCIpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzdWx0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGV4cGVjdGVkXCIpO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuZ2V0KSkgZGVzY3JpcHRvci5nZXQgPSBfO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuc2V0KSkgZGVzY3JpcHRvci5zZXQgPSBfO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuaW5pdCkpIGluaXRpYWxpemVycy5wdXNoKF8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfID0gYWNjZXB0KHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgaWYgKGtpbmQgPT09IFwiZmllbGRcIikgaW5pdGlhbGl6ZXJzLnB1c2goXyk7XHJcbiAgICAgICAgICAgIGVsc2UgZGVzY3JpcHRvcltrZXldID0gXztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGFyZ2V0KSBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSwgZGVzY3JpcHRvcik7XHJcbiAgICBkb25lID0gdHJ1ZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3J1bkluaXRpYWxpemVycyh0aGlzQXJnLCBpbml0aWFsaXplcnMsIHZhbHVlKSB7XHJcbiAgICB2YXIgdXNlVmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUgPSB1c2VWYWx1ZSA/IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcsIHZhbHVlKSA6IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVzZVZhbHVlID8gdmFsdWUgOiB2b2lkIDA7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wcm9wS2V5KHgpIHtcclxuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIiA/IHggOiBcIlwiLmNvbmNhdCh4KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NldEZ1bmN0aW9uTmFtZShmLCBuYW1lLCBwcmVmaXgpIHtcclxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgbmFtZSA9IG5hbWUuZGVzY3JpcHRpb24gPyBcIltcIi5jb25jYXQobmFtZS5kZXNjcmlwdGlvbiwgXCJdXCIpIDogXCJcIjtcclxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgXCJuYW1lXCIsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogcHJlZml4ID8gXCJcIi5jb25jYXQocHJlZml4LCBcIiBcIiwgbmFtZSkgOiBuYW1lIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogZmFsc2UgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZmVhdGhlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJmZWF0aGVyXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0aTogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4vKioqKioqLyBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbi8qKioqKiovIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbi8qKioqKiovIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbi8qKioqKiovIFx0XHRcdH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuLyoqKioqKi8gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoe1xuXG4vKioqLyBcIi4vZGlzdC9pY29ucy5qc29uXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vZGlzdC9pY29ucy5qc29uICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IGFjdGl2aXR5LCBhaXJwbGF5LCBhbGVydC1jaXJjbGUsIGFsZXJ0LW9jdGFnb24sIGFsZXJ0LXRyaWFuZ2xlLCBhbGlnbi1jZW50ZXIsIGFsaWduLWp1c3RpZnksIGFsaWduLWxlZnQsIGFsaWduLXJpZ2h0LCBhbmNob3IsIGFwZXJ0dXJlLCBhcmNoaXZlLCBhcnJvdy1kb3duLWNpcmNsZSwgYXJyb3ctZG93bi1sZWZ0LCBhcnJvdy1kb3duLXJpZ2h0LCBhcnJvdy1kb3duLCBhcnJvdy1sZWZ0LWNpcmNsZSwgYXJyb3ctbGVmdCwgYXJyb3ctcmlnaHQtY2lyY2xlLCBhcnJvdy1yaWdodCwgYXJyb3ctdXAtY2lyY2xlLCBhcnJvdy11cC1sZWZ0LCBhcnJvdy11cC1yaWdodCwgYXJyb3ctdXAsIGF0LXNpZ24sIGF3YXJkLCBiYXItY2hhcnQtMiwgYmFyLWNoYXJ0LCBiYXR0ZXJ5LWNoYXJnaW5nLCBiYXR0ZXJ5LCBiZWxsLW9mZiwgYmVsbCwgYmx1ZXRvb3RoLCBib2xkLCBib29rLW9wZW4sIGJvb2ssIGJvb2ttYXJrLCBib3gsIGJyaWVmY2FzZSwgY2FsZW5kYXIsIGNhbWVyYS1vZmYsIGNhbWVyYSwgY2FzdCwgY2hlY2stY2lyY2xlLCBjaGVjay1zcXVhcmUsIGNoZWNrLCBjaGV2cm9uLWRvd24sIGNoZXZyb24tbGVmdCwgY2hldnJvbi1yaWdodCwgY2hldnJvbi11cCwgY2hldnJvbnMtZG93biwgY2hldnJvbnMtbGVmdCwgY2hldnJvbnMtcmlnaHQsIGNoZXZyb25zLXVwLCBjaHJvbWUsIGNpcmNsZSwgY2xpcGJvYXJkLCBjbG9jaywgY2xvdWQtZHJpenpsZSwgY2xvdWQtbGlnaHRuaW5nLCBjbG91ZC1vZmYsIGNsb3VkLXJhaW4sIGNsb3VkLXNub3csIGNsb3VkLCBjb2RlLCBjb2RlcGVuLCBjb2Rlc2FuZGJveCwgY29mZmVlLCBjb2x1bW5zLCBjb21tYW5kLCBjb21wYXNzLCBjb3B5LCBjb3JuZXItZG93bi1sZWZ0LCBjb3JuZXItZG93bi1yaWdodCwgY29ybmVyLWxlZnQtZG93biwgY29ybmVyLWxlZnQtdXAsIGNvcm5lci1yaWdodC1kb3duLCBjb3JuZXItcmlnaHQtdXAsIGNvcm5lci11cC1sZWZ0LCBjb3JuZXItdXAtcmlnaHQsIGNwdSwgY3JlZGl0LWNhcmQsIGNyb3AsIGNyb3NzaGFpciwgZGF0YWJhc2UsIGRlbGV0ZSwgZGlzYywgZGl2aWRlLWNpcmNsZSwgZGl2aWRlLXNxdWFyZSwgZGl2aWRlLCBkb2xsYXItc2lnbiwgZG93bmxvYWQtY2xvdWQsIGRvd25sb2FkLCBkcmliYmJsZSwgZHJvcGxldCwgZWRpdC0yLCBlZGl0LTMsIGVkaXQsIGV4dGVybmFsLWxpbmssIGV5ZS1vZmYsIGV5ZSwgZmFjZWJvb2ssIGZhc3QtZm9yd2FyZCwgZmVhdGhlciwgZmlnbWEsIGZpbGUtbWludXMsIGZpbGUtcGx1cywgZmlsZS10ZXh0LCBmaWxlLCBmaWxtLCBmaWx0ZXIsIGZsYWcsIGZvbGRlci1taW51cywgZm9sZGVyLXBsdXMsIGZvbGRlciwgZnJhbWVyLCBmcm93biwgZ2lmdCwgZ2l0LWJyYW5jaCwgZ2l0LWNvbW1pdCwgZ2l0LW1lcmdlLCBnaXQtcHVsbC1yZXF1ZXN0LCBnaXRodWIsIGdpdGxhYiwgZ2xvYmUsIGdyaWQsIGhhcmQtZHJpdmUsIGhhc2gsIGhlYWRwaG9uZXMsIGhlYXJ0LCBoZWxwLWNpcmNsZSwgaGV4YWdvbiwgaG9tZSwgaW1hZ2UsIGluYm94LCBpbmZvLCBpbnN0YWdyYW0sIGl0YWxpYywga2V5LCBsYXllcnMsIGxheW91dCwgbGlmZS1idW95LCBsaW5rLTIsIGxpbmssIGxpbmtlZGluLCBsaXN0LCBsb2FkZXIsIGxvY2ssIGxvZy1pbiwgbG9nLW91dCwgbWFpbCwgbWFwLXBpbiwgbWFwLCBtYXhpbWl6ZS0yLCBtYXhpbWl6ZSwgbWVoLCBtZW51LCBtZXNzYWdlLWNpcmNsZSwgbWVzc2FnZS1zcXVhcmUsIG1pYy1vZmYsIG1pYywgbWluaW1pemUtMiwgbWluaW1pemUsIG1pbnVzLWNpcmNsZSwgbWludXMtc3F1YXJlLCBtaW51cywgbW9uaXRvciwgbW9vbiwgbW9yZS1ob3Jpem9udGFsLCBtb3JlLXZlcnRpY2FsLCBtb3VzZS1wb2ludGVyLCBtb3ZlLCBtdXNpYywgbmF2aWdhdGlvbi0yLCBuYXZpZ2F0aW9uLCBvY3RhZ29uLCBwYWNrYWdlLCBwYXBlcmNsaXAsIHBhdXNlLWNpcmNsZSwgcGF1c2UsIHBlbi10b29sLCBwZXJjZW50LCBwaG9uZS1jYWxsLCBwaG9uZS1mb3J3YXJkZWQsIHBob25lLWluY29taW5nLCBwaG9uZS1taXNzZWQsIHBob25lLW9mZiwgcGhvbmUtb3V0Z29pbmcsIHBob25lLCBwaWUtY2hhcnQsIHBsYXktY2lyY2xlLCBwbGF5LCBwbHVzLWNpcmNsZSwgcGx1cy1zcXVhcmUsIHBsdXMsIHBvY2tldCwgcG93ZXIsIHByaW50ZXIsIHJhZGlvLCByZWZyZXNoLWNjdywgcmVmcmVzaC1jdywgcmVwZWF0LCByZXdpbmQsIHJvdGF0ZS1jY3csIHJvdGF0ZS1jdywgcnNzLCBzYXZlLCBzY2lzc29ycywgc2VhcmNoLCBzZW5kLCBzZXJ2ZXIsIHNldHRpbmdzLCBzaGFyZS0yLCBzaGFyZSwgc2hpZWxkLW9mZiwgc2hpZWxkLCBzaG9wcGluZy1iYWcsIHNob3BwaW5nLWNhcnQsIHNodWZmbGUsIHNpZGViYXIsIHNraXAtYmFjaywgc2tpcC1mb3J3YXJkLCBzbGFjaywgc2xhc2gsIHNsaWRlcnMsIHNtYXJ0cGhvbmUsIHNtaWxlLCBzcGVha2VyLCBzcXVhcmUsIHN0YXIsIHN0b3AtY2lyY2xlLCBzdW4sIHN1bnJpc2UsIHN1bnNldCwgdGFibGUsIHRhYmxldCwgdGFnLCB0YXJnZXQsIHRlcm1pbmFsLCB0aGVybW9tZXRlciwgdGh1bWJzLWRvd24sIHRodW1icy11cCwgdG9nZ2xlLWxlZnQsIHRvZ2dsZS1yaWdodCwgdG9vbCwgdHJhc2gtMiwgdHJhc2gsIHRyZWxsbywgdHJlbmRpbmctZG93biwgdHJlbmRpbmctdXAsIHRyaWFuZ2xlLCB0cnVjaywgdHYsIHR3aXRjaCwgdHdpdHRlciwgdHlwZSwgdW1icmVsbGEsIHVuZGVybGluZSwgdW5sb2NrLCB1cGxvYWQtY2xvdWQsIHVwbG9hZCwgdXNlci1jaGVjaywgdXNlci1taW51cywgdXNlci1wbHVzLCB1c2VyLXgsIHVzZXIsIHVzZXJzLCB2aWRlby1vZmYsIHZpZGVvLCB2b2ljZW1haWwsIHZvbHVtZS0xLCB2b2x1bWUtMiwgdm9sdW1lLXgsIHZvbHVtZSwgd2F0Y2gsIHdpZmktb2ZmLCB3aWZpLCB3aW5kLCB4LWNpcmNsZSwgeC1vY3RhZ29uLCB4LXNxdWFyZSwgeCwgeW91dHViZSwgemFwLW9mZiwgemFwLCB6b29tLWluLCB6b29tLW91dCwgZGVmYXVsdCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSkge1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcImFjdGl2aXR5XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIyMiAxMiAxOCAxMiAxNSAyMSA5IDMgNiAxMiAyIDEyXFxcIj48L3BvbHlsaW5lPlwiLFwiYWlycGxheVwiOlwiPHBhdGggZD1cXFwiTTUgMTdINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmgxNmEyIDIgMCAwIDEgMiAydjEwYTIgMiAwIDAgMS0yIDJoLTFcXFwiPjwvcGF0aD48cG9seWdvbiBwb2ludHM9XFxcIjEyIDE1IDE3IDIxIDcgMjEgMTIgMTVcXFwiPjwvcG9seWdvbj5cIixcImFsZXJ0LWNpcmNsZVwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIxMi4wMVxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+XCIsXCJhbGVydC1vY3RhZ29uXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjcuODYgMiAxNi4xNCAyIDIyIDcuODYgMjIgMTYuMTQgMTYuMTQgMjIgNy44NiAyMiAyIDE2LjE0IDIgNy44NiA3Ljg2IDJcXFwiPjwvcG9seWdvbj48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE2XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIxNlxcXCI+PC9saW5lPlwiLFwiYWxlcnQtdHJpYW5nbGVcIjpcIjxwYXRoIGQ9XFxcIk0xMC4yOSAzLjg2TDEuODIgMThhMiAyIDAgMCAwIDEuNzEgM2gxNi45NGEyIDIgMCAwIDAgMS43MS0zTDEzLjcxIDMuODZhMiAyIDAgMCAwLTMuNDIgMHpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI5XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxM1xcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE3XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIxN1xcXCI+PC9saW5lPlwiLFwiYWxpZ24tY2VudGVyXCI6XCI8bGluZSB4MT1cXFwiMThcXFwiIHkxPVxcXCIxMFxcXCIgeDI9XFxcIjZcXFwiIHkyPVxcXCIxMFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyMVxcXCIgeTE9XFxcIjZcXFwiIHgyPVxcXCIzXFxcIiB5Mj1cXFwiNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyMVxcXCIgeTE9XFxcIjE0XFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE4XFxcIiB5MT1cXFwiMThcXFwiIHgyPVxcXCI2XFxcIiB5Mj1cXFwiMThcXFwiPjwvbGluZT5cIixcImFsaWduLWp1c3RpZnlcIjpcIjxsaW5lIHgxPVxcXCIyMVxcXCIgeTE9XFxcIjEwXFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjEwXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiNlxcXCIgeDI9XFxcIjNcXFwiIHkyPVxcXCI2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMTRcXFwiIHgyPVxcXCIzXFxcIiB5Mj1cXFwiMTRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCIxOFxcXCIgeDI9XFxcIjNcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPlwiLFwiYWxpZ24tbGVmdFwiOlwiPGxpbmUgeDE9XFxcIjE3XFxcIiB5MT1cXFwiMTBcXFwiIHgyPVxcXCIzXFxcIiB5Mj1cXFwiMTBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCIxNFxcXCIgeDI9XFxcIjNcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxN1xcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+XCIsXCJhbGlnbi1yaWdodFwiOlwiPGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMTBcXFwiIHgyPVxcXCI3XFxcIiB5Mj1cXFwiMTBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCIxNFxcXCIgeDI9XFxcIjNcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyMVxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+XCIsXCJhbmNob3JcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiNVxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMjJcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjhcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNNSAxMkgyYTEwIDEwIDAgMCAwIDIwIDBoLTNcXFwiPjwvcGF0aD5cIixcImFwZXJ0dXJlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjE0LjMxXFxcIiB5MT1cXFwiOFxcXCIgeDI9XFxcIjIwLjA1XFxcIiB5Mj1cXFwiMTcuOTRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOS42OVxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIyMS4xN1xcXCIgeTI9XFxcIjhcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiNy4zOFxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMTMuMTJcXFwiIHkyPVxcXCIyLjA2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjkuNjlcXFwiIHkxPVxcXCIxNlxcXCIgeDI9XFxcIjMuOTVcXFwiIHkyPVxcXCI2LjA2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE0LjMxXFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIyLjgzXFxcIiB5Mj1cXFwiMTZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTYuNjJcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjEwLjg4XFxcIiB5Mj1cXFwiMjEuOTRcXFwiPjwvbGluZT5cIixcImFyY2hpdmVcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjIxIDggMjEgMjEgMyAyMSAzIDhcXFwiPjwvcG9seWxpbmU+PHJlY3QgeD1cXFwiMVxcXCIgeT1cXFwiM1xcXCIgd2lkdGg9XFxcIjIyXFxcIiBoZWlnaHQ9XFxcIjVcXFwiPjwvcmVjdD48bGluZSB4MT1cXFwiMTBcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE0XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImFycm93LWRvd24tY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOCAxMiAxMiAxNiAxNiAxMlxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxNlxcXCI+PC9saW5lPlwiLFwiYXJyb3ctZG93bi1sZWZ0XCI6XCI8bGluZSB4MT1cXFwiMTdcXFwiIHkxPVxcXCI3XFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjE3XFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTcgMTcgNyAxNyA3IDdcXFwiPjwvcG9seWxpbmU+XCIsXCJhcnJvdy1kb3duLXJpZ2h0XCI6XCI8bGluZSB4MT1cXFwiN1xcXCIgeTE9XFxcIjdcXFwiIHgyPVxcXCIxN1xcXCIgeTI9XFxcIjE3XFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTcgNyAxNyAxNyA3IDE3XFxcIj48L3BvbHlsaW5lPlwiLFwiYXJyb3ctZG93blwiOlwiPGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiNVxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTlcXFwiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxOSAxMiAxMiAxOSA1IDEyXFxcIj48L3BvbHlsaW5lPlwiLFwiYXJyb3ctbGVmdC1jaXJjbGVcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxMiA4IDggMTIgMTIgMTZcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjE2XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCI4XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImFycm93LWxlZnRcIjpcIjxsaW5lIHgxPVxcXCIxOVxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiNVxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTIgMTkgNSAxMiAxMiA1XFxcIj48L3BvbHlsaW5lPlwiLFwiYXJyb3ctcmlnaHQtY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTIgMTYgMTYgMTIgMTIgOFxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPlwiLFwiYXJyb3ctcmlnaHRcIjpcIjxsaW5lIHgxPVxcXCI1XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIxOVxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTIgNSAxOSAxMiAxMiAxOVxcXCI+PC9wb2x5bGluZT5cIixcImFycm93LXVwLWNpcmNsZVwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9XFxcIjE2IDEyIDEyIDggOCAxMlxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxNlxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiOFxcXCI+PC9saW5lPlwiLFwiYXJyb3ctdXAtbGVmdFwiOlwiPGxpbmUgeDE9XFxcIjE3XFxcIiB5MT1cXFwiMTdcXFwiIHgyPVxcXCI3XFxcIiB5Mj1cXFwiN1xcXCI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjcgMTcgNyA3IDE3IDdcXFwiPjwvcG9seWxpbmU+XCIsXCJhcnJvdy11cC1yaWdodFwiOlwiPGxpbmUgeDE9XFxcIjdcXFwiIHkxPVxcXCIxN1xcXCIgeDI9XFxcIjE3XFxcIiB5Mj1cXFwiN1xcXCI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjcgNyAxNyA3IDE3IDE3XFxcIj48L3BvbHlsaW5lPlwiLFwiYXJyb3ctdXBcIjpcIjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE5XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCI1XFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiNSAxMiAxMiA1IDE5IDEyXFxcIj48L3BvbHlsaW5lPlwiLFwiYXQtc2lnblwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiNFxcXCI+PC9jaXJjbGU+PHBhdGggZD1cXFwiTTE2IDh2NWEzIDMgMCAwIDAgNiAwdi0xYTEwIDEwIDAgMSAwLTMuOTIgNy45NFxcXCI+PC9wYXRoPlwiLFwiYXdhcmRcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiOFxcXCIgcj1cXFwiN1xcXCI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOC4yMSAxMy44OSA3IDIzIDEyIDIwIDE3IDIzIDE1Ljc5IDEzLjg4XFxcIj48L3BvbHlsaW5lPlwiLFwiYmFyLWNoYXJ0LTJcIjpcIjxsaW5lIHgxPVxcXCIxOFxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiMThcXFwiIHkyPVxcXCIxMFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCI0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjZcXFwiIHkxPVxcXCIyMFxcXCIgeDI9XFxcIjZcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPlwiLFwiYmFyLWNoYXJ0XCI6XCI8bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyMFxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMThcXFwiIHkxPVxcXCIyMFxcXCIgeDI9XFxcIjE4XFxcIiB5Mj1cXFwiNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI2XFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCI2XFxcIiB5Mj1cXFwiMTZcXFwiPjwvbGluZT5cIixcImJhdHRlcnktY2hhcmdpbmdcIjpcIjxwYXRoIGQ9XFxcIk01IDE4SDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoMy4xOU0xNSA2aDJhMiAyIDAgMCAxIDIgMnY4YTIgMiAwIDAgMS0yIDJoLTMuMTlcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMjNcXFwiIHkxPVxcXCIxM1xcXCIgeDI9XFxcIjIzXFxcIiB5Mj1cXFwiMTFcXFwiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxMSA2IDcgMTIgMTMgMTIgOSAxOFxcXCI+PC9wb2x5bGluZT5cIixcImJhdHRlcnlcIjpcIjxyZWN0IHg9XFxcIjFcXFwiIHk9XFxcIjZcXFwiIHdpZHRoPVxcXCIxOFxcXCIgaGVpZ2h0PVxcXCIxMlxcXCIgcng9XFxcIjJcXFwiIHJ5PVxcXCIyXFxcIj48L3JlY3Q+PGxpbmUgeDE9XFxcIjIzXFxcIiB5MT1cXFwiMTNcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjExXFxcIj48L2xpbmU+XCIsXCJiZWxsLW9mZlwiOlwiPHBhdGggZD1cXFwiTTEzLjczIDIxYTIgMiAwIDAgMS0zLjQ2IDBcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMTguNjMgMTNBMTcuODkgMTcuODkgMCAwIDEgMTggOFxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk02LjI2IDYuMjZBNS44NiA1Ljg2IDAgMCAwIDYgOGMwIDctMyA5LTMgOWgxNFxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xOCA4YTYgNiAwIDAgMC05LjMzLTVcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+XCIsXCJiZWxsXCI6XCI8cGF0aCBkPVxcXCJNMTggOEE2IDYgMCAwIDAgNiA4YzAgNy0zIDktMyA5aDE4cy0zLTItMy05XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTEzLjczIDIxYTIgMiAwIDAgMS0zLjQ2IDBcXFwiPjwvcGF0aD5cIixcImJsdWV0b290aFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiNi41IDYuNSAxNy41IDE3LjUgMTIgMjMgMTIgMSAxNy41IDYuNSA2LjUgMTcuNVxcXCI+PC9wb2x5bGluZT5cIixcImJvbGRcIjpcIjxwYXRoIGQ9XFxcIk02IDRoOGE0IDQgMCAwIDEgNCA0IDQgNCAwIDAgMS00IDRINnpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNNiAxMmg5YTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxLTQgNEg2elxcXCI+PC9wYXRoPlwiLFwiYm9vay1vcGVuXCI6XCI8cGF0aCBkPVxcXCJNMiAzaDZhNCA0IDAgMCAxIDQgNHYxNGEzIDMgMCAwIDAtMy0zSDJ6XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTIyIDNoLTZhNCA0IDAgMCAwLTQgNHYxNGEzIDMgMCAwIDEgMy0zaDd6XFxcIj48L3BhdGg+XCIsXCJib29rXCI6XCI8cGF0aCBkPVxcXCJNNCAxOS41QTIuNSAyLjUgMCAwIDEgNi41IDE3SDIwXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTYuNSAySDIwdjIwSDYuNUEyLjUgMi41IDAgMCAxIDQgMTkuNXYtMTVBMi41IDIuNSAwIDAgMSA2LjUgMnpcXFwiPjwvcGF0aD5cIixcImJvb2ttYXJrXCI6XCI8cGF0aCBkPVxcXCJNMTkgMjFsLTctNS03IDVWNWEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6XFxcIj48L3BhdGg+XCIsXCJib3hcIjpcIjxwYXRoIGQ9XFxcIk0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNnpcXFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVxcXCIzLjI3IDYuOTYgMTIgMTIuMDEgMjAuNzMgNi45NlxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyMi4wOFxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImJyaWVmY2FzZVwiOlwiPHJlY3QgeD1cXFwiMlxcXCIgeT1cXFwiN1xcXCIgd2lkdGg9XFxcIjIwXFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48cGF0aCBkPVxcXCJNMTYgMjFWNWEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MTZcXFwiPjwvcGF0aD5cIixcImNhbGVuZGFyXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCI0XFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIxNlxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCIxNlxcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCI4XFxcIiB5Mj1cXFwiNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIzXFxcIiB5MT1cXFwiMTBcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjEwXFxcIj48L2xpbmU+XCIsXCJjYW1lcmEtb2ZmXCI6XCI8bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTIxIDIxSDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoM20zLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAydjkuMzRtLTcuNzItMi4wNmE0IDQgMCAxIDEtNS41Ni01LjU2XFxcIj48L3BhdGg+XCIsXCJjYW1lcmFcIjpcIjxwYXRoIGQ9XFxcIk0yMyAxOWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNGwyLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAyelxcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTNcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPlwiLFwiY2FzdFwiOlwiPHBhdGggZD1cXFwiTTIgMTYuMUE1IDUgMCAwIDEgNS45IDIwTTIgMTIuMDVBOSA5IDAgMCAxIDkuOTUgMjBNMiA4VjZhMiAyIDAgMCAxIDItMmgxNmEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMS0yIDJoLTZcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMlxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiMi4wMVxcXCIgeTI9XFxcIjIwXFxcIj48L2xpbmU+XCIsXCJjaGVjay1jaXJjbGVcIjpcIjxwYXRoIGQ9XFxcIk0yMiAxMS4wOFYxMmExMCAxMCAwIDEgMS01LjkzLTkuMTRcXFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVxcXCIyMiA0IDEyIDE0LjAxIDkgMTEuMDFcXFwiPjwvcG9seWxpbmU+XCIsXCJjaGVjay1zcXVhcmVcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjkgMTEgMTIgMTQgMjIgNFxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNMjEgMTJ2N2EyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTFcXFwiPjwvcGF0aD5cIixcImNoZWNrXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIyMCA2IDkgMTcgNCAxMlxcXCI+PC9wb2x5bGluZT5cIixcImNoZXZyb24tZG93blwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiNiA5IDEyIDE1IDE4IDlcXFwiPjwvcG9seWxpbmU+XCIsXCJjaGV2cm9uLWxlZnRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE1IDE4IDkgMTIgMTUgNlxcXCI+PC9wb2x5bGluZT5cIixcImNoZXZyb24tcmlnaHRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjkgMTggMTUgMTIgOSA2XFxcIj48L3BvbHlsaW5lPlwiLFwiY2hldnJvbi11cFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTggMTUgMTIgOSA2IDE1XFxcIj48L3BvbHlsaW5lPlwiLFwiY2hldnJvbnMtZG93blwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiNyAxMyAxMiAxOCAxNyAxM1xcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCI3IDYgMTIgMTEgMTcgNlxcXCI+PC9wb2x5bGluZT5cIixcImNoZXZyb25zLWxlZnRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjExIDE3IDYgMTIgMTEgN1xcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxOCAxNyAxMyAxMiAxOCA3XFxcIj48L3BvbHlsaW5lPlwiLFwiY2hldnJvbnMtcmlnaHRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjEzIDE3IDE4IDEyIDEzIDdcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiNiAxNyAxMSAxMiA2IDdcXFwiPjwvcG9seWxpbmU+XCIsXCJjaGV2cm9ucy11cFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTcgMTEgMTIgNiA3IDExXFxcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjE3IDE4IDEyIDEzIDcgMThcXFwiPjwvcG9seWxpbmU+XCIsXCJjaHJvbWVcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT48Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCI0XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiMjEuMTdcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCI4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjMuOTVcXFwiIHkxPVxcXCI2LjA2XFxcIiB4Mj1cXFwiOC41NFxcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEwLjg4XFxcIiB5MT1cXFwiMjEuOTRcXFwiIHgyPVxcXCIxNS40NlxcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+XCIsXCJjaXJjbGVcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT5cIixcImNsaXBib2FyZFwiOlwiPHBhdGggZD1cXFwiTTE2IDRoMmEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINmEyIDIgMCAwIDEtMi0yVjZhMiAyIDAgMCAxIDItMmgyXFxcIj48L3BhdGg+PHJlY3QgeD1cXFwiOFxcXCIgeT1cXFwiMlxcXCIgd2lkdGg9XFxcIjhcXFwiIGhlaWdodD1cXFwiNFxcXCIgcng9XFxcIjFcXFwiIHJ5PVxcXCIxXFxcIj48L3JlY3Q+XCIsXCJjbG9ja1wiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9XFxcIjEyIDYgMTIgMTIgMTYgMTRcXFwiPjwvcG9seWxpbmU+XCIsXCJjbG91ZC1kcml6emxlXCI6XCI8bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjE5XFxcIiB4Mj1cXFwiOFxcXCIgeTI9XFxcIjIxXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxM1xcXCIgeDI9XFxcIjhcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNlxcXCIgeTE9XFxcIjE5XFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNlxcXCIgeTE9XFxcIjEzXFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIxXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE1XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxN1xcXCI+PC9saW5lPjxwYXRoIGQ9XFxcIk0yMCAxNi41OEE1IDUgMCAwIDAgMTggN2gtMS4yNkE4IDggMCAxIDAgNCAxNS4yNVxcXCI+PC9wYXRoPlwiLFwiY2xvdWQtbGlnaHRuaW5nXCI6XCI8cGF0aCBkPVxcXCJNMTkgMTYuOUE1IDUgMCAwIDAgMTggN2gtMS4yNmE4IDggMCAxIDAtMTEuNjIgOVxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjEzIDExIDkgMTcgMTUgMTcgMTEgMjNcXFwiPjwvcG9seWxpbmU+XCIsXCJjbG91ZC1vZmZcIjpcIjxwYXRoIGQ9XFxcIk0yMi42MSAxNi45NUE1IDUgMCAwIDAgMTggMTBoLTEuMjZhOCA4IDAgMCAwLTcuMDUtNk01IDVhOCA4IDAgMCAwIDQgMTVoOWE1IDUgMCAwIDAgMS43LS4zXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPlwiLFwiY2xvdWQtcmFpblwiOlwiPGxpbmUgeDE9XFxcIjE2XFxcIiB5MT1cXFwiMTNcXFwiIHgyPVxcXCIxNlxcXCIgeTI9XFxcIjIxXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxM1xcXCIgeDI9XFxcIjhcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE1XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPjxwYXRoIGQ9XFxcIk0yMCAxNi41OEE1IDUgMCAwIDAgMTggN2gtMS4yNkE4IDggMCAxIDAgNCAxNS4yNVxcXCI+PC9wYXRoPlwiLFwiY2xvdWQtc25vd1wiOlwiPHBhdGggZD1cXFwiTTIwIDE3LjU4QTUgNSAwIDAgMCAxOCA4aC0xLjI2QTggOCAwIDEgMCA0IDE2LjI1XFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxNlxcXCIgeDI9XFxcIjguMDFcXFwiIHkyPVxcXCIxNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI4XFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCI4LjAxXFxcIiB5Mj1cXFwiMjBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxOFxcXCIgeDI9XFxcIjEyLjAxXFxcIiB5Mj1cXFwiMThcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyMlxcXCIgeDI9XFxcIjEyLjAxXFxcIiB5Mj1cXFwiMjJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCIxNlxcXCIgeDI9XFxcIjE2LjAxXFxcIiB5Mj1cXFwiMTZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCIyMFxcXCIgeDI9XFxcIjE2LjAxXFxcIiB5Mj1cXFwiMjBcXFwiPjwvbGluZT5cIixcImNsb3VkXCI6XCI8cGF0aCBkPVxcXCJNMTggMTBoLTEuMjZBOCA4IDAgMSAwIDkgMjBoOWE1IDUgMCAwIDAgMC0xMHpcXFwiPjwvcGF0aD5cIixcImNvZGVcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE2IDE4IDIyIDEyIDE2IDZcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOCA2IDIgMTIgOCAxOFxcXCI+PC9wb2x5bGluZT5cIixcImNvZGVwZW5cIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMTIgMiAyMiA4LjUgMjIgMTUuNSAxMiAyMiAyIDE1LjUgMiA4LjUgMTIgMlxcXCI+PC9wb2x5Z29uPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxNS41XFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMjIgOC41IDEyIDE1LjUgMiA4LjVcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMiAxNS41IDEyIDguNSAyMiAxNS41XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjguNVxcXCI+PC9saW5lPlwiLFwiY29kZXNhbmRib3hcIjpcIjxwYXRoIGQ9XFxcIk0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNnpcXFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVxcXCI3LjUgNC4yMSAxMiA2LjgxIDE2LjUgNC4yMVxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCI3LjUgMTkuNzkgNy41IDE0LjYgMyAxMlxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIyMSAxMiAxNi41IDE0LjYgMTYuNSAxOS43OVxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIzLjI3IDYuOTYgMTIgMTIuMDEgMjAuNzMgNi45NlxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyMi4wOFxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImNvZmZlZVwiOlwiPHBhdGggZD1cXFwiTTE4IDhoMWE0IDQgMCAwIDEgMCA4aC0xXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTIgOGgxNnY5YTQgNCAwIDAgMS00IDRINmE0IDQgMCAwIDEtNC00Vjh6XFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjZcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiNlxcXCIgeTI9XFxcIjRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTBcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMTBcXFwiIHkyPVxcXCI0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE0XFxcIiB5MT1cXFwiMVxcXCIgeDI9XFxcIjE0XFxcIiB5Mj1cXFwiNFxcXCI+PC9saW5lPlwiLFwiY29sdW1uc1wiOlwiPHBhdGggZD1cXFwiTTEyIDNoN2EyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJoLTdtMC0xOEg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmg3bTAtMTh2MThcXFwiPjwvcGF0aD5cIixcImNvbW1hbmRcIjpcIjxwYXRoIGQ9XFxcIk0xOCAzYTMgMyAwIDAgMC0zIDN2MTJhMyAzIDAgMCAwIDMgMyAzIDMgMCAwIDAgMy0zIDMgMyAwIDAgMC0zLTNINmEzIDMgMCAwIDAtMyAzIDMgMyAwIDAgMCAzIDMgMyAzIDAgMCAwIDMtM1Y2YTMgMyAwIDAgMC0zLTMgMyAzIDAgMCAwLTMgMyAzIDMgMCAwIDAgMyAzaDEyYTMgMyAwIDAgMCAzLTMgMyAzIDAgMCAwLTMtM3pcXFwiPjwvcGF0aD5cIixcImNvbXBhc3NcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT48cG9seWdvbiBwb2ludHM9XFxcIjE2LjI0IDcuNzYgMTQuMTIgMTQuMTIgNy43NiAxNi4yNCA5Ljg4IDkuODggMTYuMjQgNy43NlxcXCI+PC9wb2x5Z29uPlwiLFwiY29weVwiOlwiPHJlY3QgeD1cXFwiOVxcXCIgeT1cXFwiOVxcXCIgd2lkdGg9XFxcIjEzXFxcIiBoZWlnaHQ9XFxcIjEzXFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48cGF0aCBkPVxcXCJNNSAxNUg0YTIgMiAwIDAgMS0yLTJWNGEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxXFxcIj48L3BhdGg+XCIsXCJjb3JuZXItZG93bi1sZWZ0XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCI5IDEwIDQgMTUgOSAyMFxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNMjAgNHY3YTQgNCAwIDAgMS00IDRINFxcXCI+PC9wYXRoPlwiLFwiY29ybmVyLWRvd24tcmlnaHRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE1IDEwIDIwIDE1IDE1IDIwXFxcIj48L3BvbHlsaW5lPjxwYXRoIGQ9XFxcIk00IDR2N2E0IDQgMCAwIDAgNCA0aDEyXFxcIj48L3BhdGg+XCIsXCJjb3JuZXItbGVmdC1kb3duXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxNCAxNSA5IDIwIDQgMTVcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTIwIDRoLTdhNCA0IDAgMCAwLTQgNHYxMlxcXCI+PC9wYXRoPlwiLFwiY29ybmVyLWxlZnQtdXBcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE0IDkgOSA0IDQgOVxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNMjAgMjBoLTdhNCA0IDAgMCAxLTQtNFY0XFxcIj48L3BhdGg+XCIsXCJjb3JuZXItcmlnaHQtZG93blwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTAgMTUgMTUgMjAgMjAgMTVcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTQgNGg3YTQgNCAwIDAgMSA0IDR2MTJcXFwiPjwvcGF0aD5cIixcImNvcm5lci1yaWdodC11cFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTAgOSAxNSA0IDIwIDlcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTQgMjBoN2E0IDQgMCAwIDAgNC00VjRcXFwiPjwvcGF0aD5cIixcImNvcm5lci11cC1sZWZ0XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCI5IDE0IDQgOSA5IDRcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTIwIDIwdi03YTQgNCAwIDAgMC00LTRINFxcXCI+PC9wYXRoPlwiLFwiY29ybmVyLXVwLXJpZ2h0XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxNSAxNCAyMCA5IDE1IDRcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTQgMjB2LTdhNCA0IDAgMCAxIDQtNGgxMlxcXCI+PC9wYXRoPlwiLFwiY3B1XCI6XCI8cmVjdCB4PVxcXCI0XFxcIiB5PVxcXCI0XFxcIiB3aWR0aD1cXFwiMTZcXFwiIGhlaWdodD1cXFwiMTZcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxyZWN0IHg9XFxcIjlcXFwiIHk9XFxcIjlcXFwiIHdpZHRoPVxcXCI2XFxcIiBoZWlnaHQ9XFxcIjZcXFwiPjwvcmVjdD48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCI5XFxcIiB5Mj1cXFwiNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIxNVxcXCIgeTI9XFxcIjRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiOVxcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE1XFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCIxNVxcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIwXFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjIzXFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyMFxcXCIgeTE9XFxcIjE0XFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxXFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjRcXFwiIHkyPVxcXCI5XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxNFxcXCIgeDI9XFxcIjRcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPlwiLFwiY3JlZGl0LWNhcmRcIjpcIjxyZWN0IHg9XFxcIjFcXFwiIHk9XFxcIjRcXFwiIHdpZHRoPVxcXCIyMlxcXCIgaGVpZ2h0PVxcXCIxNlxcXCIgcng9XFxcIjJcXFwiIHJ5PVxcXCIyXFxcIj48L3JlY3Q+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxMFxcXCIgeDI9XFxcIjIzXFxcIiB5Mj1cXFwiMTBcXFwiPjwvbGluZT5cIixcImNyb3BcIjpcIjxwYXRoIGQ9XFxcIk02LjEzIDFMNiAxNmEyIDIgMCAwIDAgMiAyaDE1XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTEgNi4xM0wxNiA2YTIgMiAwIDAgMSAyIDJ2MTVcXFwiPjwvcGF0aD5cIixcImNyb3NzaGFpclwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCIyMlxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMThcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI2XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMjJcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+XCIsXCJkYXRhYmFzZVwiOlwiPGVsbGlwc2UgY3g9XFxcIjEyXFxcIiBjeT1cXFwiNVxcXCIgcng9XFxcIjlcXFwiIHJ5PVxcXCIzXFxcIj48L2VsbGlwc2U+PHBhdGggZD1cXFwiTTIxIDEyYzAgMS42Ni00IDMtOSAzcy05LTEuMzQtOS0zXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTMgNXYxNGMwIDEuNjYgNCAzIDkgM3M5LTEuMzQgOS0zVjVcXFwiPjwvcGF0aD5cIixcImRlbGV0ZVwiOlwiPHBhdGggZD1cXFwiTTIxIDRIOGwtNyA4IDcgOGgxM2EyIDIgMCAwIDAgMi0yVjZhMiAyIDAgMCAwLTItMnpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMThcXFwiIHkxPVxcXCI5XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCIxOFxcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJkaXNjXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+XCIsXCJkaXZpZGUtY2lyY2xlXCI6XCI8bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE2XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjhcXFwiPjwvbGluZT48Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+XCIsXCJkaXZpZGUtc3F1YXJlXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCI4XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIxNlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiOFxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiOFxcXCI+PC9saW5lPlwiLFwiZGl2aWRlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjZcXFwiIHI9XFxcIjJcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCI1XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIxOVxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxOFxcXCIgcj1cXFwiMlxcXCI+PC9jaXJjbGU+XCIsXCJkb2xsYXItc2lnblwiOlwiPGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMVxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMjNcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2XFxcIj48L3BhdGg+XCIsXCJkb3dubG9hZC1jbG91ZFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiOCAxNyAxMiAyMSAxNiAxN1xcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNMjAuODggMTguMDlBNSA1IDAgMCAwIDE4IDloLTEuMjZBOCA4IDAgMSAwIDMgMTYuMjlcXFwiPjwvcGF0aD5cIixcImRvd25sb2FkXCI6XCI8cGF0aCBkPVxcXCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjcgMTAgMTIgMTUgMTcgMTBcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTVcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjNcXFwiPjwvbGluZT5cIixcImRyaWJiYmxlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PHBhdGggZD1cXFwiTTguNTYgMi43NWM0LjM3IDYuMDMgNi4wMiA5LjQyIDguMDMgMTcuNzJtMi41NC0xNS4zOGMtMy43MiA0LjM1LTguOTQgNS42Ni0xNi44OCA1Ljg1bTE5LjUgMS45Yy0zLjUtLjkzLTYuNjMtLjgyLTguOTQgMC0yLjU4LjkyLTUuMDEgMi44Ni03LjQ0IDYuMzJcXFwiPjwvcGF0aD5cIixcImRyb3BsZXRcIjpcIjxwYXRoIGQ9XFxcIk0xMiAyLjY5bDUuNjYgNS42NmE4IDggMCAxIDEtMTEuMzEgMHpcXFwiPjwvcGF0aD5cIixcImVkaXQtMlwiOlwiPHBhdGggZD1cXFwiTTE3IDNhMi44MjggMi44MjggMCAxIDEgNCA0TDcuNSAyMC41IDIgMjJsMS41LTUuNUwxNyAzelxcXCI+PC9wYXRoPlwiLFwiZWRpdC0zXCI6XCI8cGF0aCBkPVxcXCJNMTIgMjBoOVxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcXFwiPjwvcGF0aD5cIixcImVkaXRcIjpcIjxwYXRoIGQ9XFxcIk0xMSA0SDRhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJ2LTdcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMTguNSAyLjVhMi4xMjEgMi4xMjEgMCAwIDEgMyAzTDEyIDE1bC00IDEgMS00IDkuNS05LjV6XFxcIj48L3BhdGg+XCIsXCJleHRlcm5hbC1saW5rXCI6XCI8cGF0aCBkPVxcXCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjE1IDMgMjEgMyAyMSA5XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMFxcXCIgeTE9XFxcIjE0XFxcIiB4Mj1cXFwiMjFcXFwiIHkyPVxcXCIzXFxcIj48L2xpbmU+XCIsXCJleWUtb2ZmXCI6XCI8cGF0aCBkPVxcXCJNMTcuOTQgMTcuOTRBMTAuMDcgMTAuMDcgMCAwIDEgMTIgMjBjLTcgMC0xMS04LTExLThhMTguNDUgMTguNDUgMCAwIDEgNS4wNi01Ljk0TTkuOSA0LjI0QTkuMTIgOS4xMiAwIDAgMSAxMiA0YzcgMCAxMSA4IDExIDhhMTguNSAxOC41IDAgMCAxLTIuMTYgMy4xOW0tNi43Mi0xLjA3YTMgMyAwIDEgMS00LjI0LTQuMjRcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+XCIsXCJleWVcIjpcIjxwYXRoIGQ9XFxcIk0xIDEyczQtOCAxMS04IDExIDggMTEgOC00IDgtMTEgOC0xMS04LTExLTh6XFxcIj48L3BhdGg+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+XCIsXCJmYWNlYm9va1wiOlwiPHBhdGggZD1cXFwiTTE4IDJoLTNhNSA1IDAgMCAwLTUgNXYzSDd2NGgzdjhoNHYtOGgzbDEtNGgtNFY3YTEgMSAwIDAgMSAxLTFoM3pcXFwiPjwvcGF0aD5cIixcImZhc3QtZm9yd2FyZFwiOlwiPHBvbHlnb24gcG9pbnRzPVxcXCIxMyAxOSAyMiAxMiAxMyA1IDEzIDE5XFxcIj48L3BvbHlnb24+PHBvbHlnb24gcG9pbnRzPVxcXCIyIDE5IDExIDEyIDIgNSAyIDE5XFxcIj48L3BvbHlnb24+XCIsXCJmZWF0aGVyXCI6XCI8cGF0aCBkPVxcXCJNMjAuMjQgMTIuMjRhNiA2IDAgMCAwLTguNDktOC40OUw1IDEwLjVWMTloOC41elxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxNlxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIyXFxcIiB5Mj1cXFwiMjJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTcuNVxcXCIgeTE9XFxcIjE1XFxcIiB4Mj1cXFwiOVxcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJmaWdtYVwiOlwiPHBhdGggZD1cXFwiTTUgNS41QTMuNSAzLjUgMCAwIDEgOC41IDJIMTJ2N0g4LjVBMy41IDMuNSAwIDAgMSA1IDUuNXpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMTIgMmgzLjVhMy41IDMuNSAwIDEgMSAwIDdIMTJWMnpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMTIgMTIuNWEzLjUgMy41IDAgMSAxIDcgMCAzLjUgMy41IDAgMSAxLTcgMHpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNNSAxOS41QTMuNSAzLjUgMCAwIDEgOC41IDE2SDEydjMuNWEzLjUgMy41IDAgMSAxLTcgMHpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNNSAxMi41QTMuNSAzLjUgMCAwIDEgOC41IDlIMTJ2N0g4LjVBMy41IDMuNSAwIDAgMSA1IDEyLjV6XFxcIj48L3BhdGg+XCIsXCJmaWxlLW1pbnVzXCI6XCI8cGF0aCBkPVxcXCJNMTQgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjh6XFxcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTQgMiAxNCA4IDIwIDhcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjlcXFwiIHkxPVxcXCIxNVxcXCIgeDI9XFxcIjE1XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT5cIixcImZpbGUtcGx1c1wiOlwiPHBhdGggZD1cXFwiTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4elxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjE0IDIgMTQgOCAyMCA4XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiMTVcXFwiIHgyPVxcXCIxNVxcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJmaWxlLXRleHRcIjpcIjxwYXRoIGQ9XFxcIk0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHpcXFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVxcXCIxNCAyIDE0IDggMjAgOFxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCIxM1xcXCIgeDI9XFxcIjhcXFwiIHkyPVxcXCIxM1xcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNlxcXCIgeTE9XFxcIjE3XFxcIiB4Mj1cXFwiOFxcXCIgeTI9XFxcIjE3XFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTAgOSA5IDkgOCA5XFxcIj48L3BvbHlsaW5lPlwiLFwiZmlsZVwiOlwiPHBhdGggZD1cXFwiTTEzIDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY5elxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjEzIDIgMTMgOSAyMCA5XFxcIj48L3BvbHlsaW5lPlwiLFwiZmlsbVwiOlwiPHJlY3QgeD1cXFwiMlxcXCIgeT1cXFwiMlxcXCIgd2lkdGg9XFxcIjIwXFxcIiBoZWlnaHQ9XFxcIjIwXFxcIiByeD1cXFwiMi4xOFxcXCIgcnk9XFxcIjIuMThcXFwiPjwvcmVjdD48bGluZSB4MT1cXFwiN1xcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCI3XFxcIiB5Mj1cXFwiMjJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTdcXFwiIHkxPVxcXCIyXFxcIiB4Mj1cXFwiMTdcXFwiIHkyPVxcXCIyMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyMlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjJcXFwiIHkxPVxcXCI3XFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMlxcXCIgeTE9XFxcIjE3XFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjE3XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE3XFxcIiB5MT1cXFwiMTdcXFwiIHgyPVxcXCIyMlxcXCIgeTI9XFxcIjE3XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE3XFxcIiB5MT1cXFwiN1xcXCIgeDI9XFxcIjIyXFxcIiB5Mj1cXFwiN1xcXCI+PC9saW5lPlwiLFwiZmlsdGVyXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjIyIDMgMiAzIDEwIDEyLjQ2IDEwIDE5IDE0IDIxIDE0IDEyLjQ2IDIyIDNcXFwiPjwvcG9seWdvbj5cIixcImZsYWdcIjpcIjxwYXRoIGQ9XFxcIk00IDE1czEtMSA0LTEgNSAyIDggMiA0LTEgNC0xVjNzLTEgMS00IDEtNS0yLTgtMi00IDEtNCAxelxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCI0XFxcIiB5MT1cXFwiMjJcXFwiIHgyPVxcXCI0XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT5cIixcImZvbGRlci1taW51c1wiOlwiPHBhdGggZD1cXFwiTTIyIDE5YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmg1bDIgM2g5YTIgMiAwIDAgMSAyIDJ6XFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjlcXFwiIHkxPVxcXCIxNFxcXCIgeDI9XFxcIjE1XFxcIiB5Mj1cXFwiMTRcXFwiPjwvbGluZT5cIixcImZvbGRlci1wbHVzXCI6XCI8cGF0aCBkPVxcXCJNMjIgMTlhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDVsMiAzaDlhMiAyIDAgMCAxIDIgMnpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxMVxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjE0XFxcIiB4Mj1cXFwiMTVcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPlwiLFwiZm9sZGVyXCI6XCI8cGF0aCBkPVxcXCJNMjIgMTlhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDVsMiAzaDlhMiAyIDAgMCAxIDIgMnpcXFwiPjwvcGF0aD5cIixcImZyYW1lclwiOlwiPHBhdGggZD1cXFwiTTUgMTZWOWgxNFYySDVsMTQgMTRoLTdtLTcgMGw3IDd2LTdtLTcgMGg3XFxcIj48L3BhdGg+XCIsXCJmcm93blwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxwYXRoIGQ9XFxcIk0xNiAxNnMtMS41LTItNC0yLTQgMi00IDJcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCI5LjAxXFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNVxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCIxNS4wMVxcXCIgeTI9XFxcIjlcXFwiPjwvbGluZT5cIixcImdpZnRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjIwIDEyIDIwIDIyIDQgMjIgNCAxMlxcXCI+PC9wb2x5bGluZT48cmVjdCB4PVxcXCIyXFxcIiB5PVxcXCI3XFxcIiB3aWR0aD1cXFwiMjBcXFwiIGhlaWdodD1cXFwiNVxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCI3XFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTEyIDdINy41YTIuNSAyLjUgMCAwIDEgMC01QzExIDIgMTIgNyAxMiA3elxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xMiA3aDQuNWEyLjUgMi41IDAgMCAwIDAtNUMxMyAyIDEyIDcgMTIgN3pcXFwiPjwvcGF0aD5cIixcImdpdC1icmFuY2hcIjpcIjxsaW5lIHgxPVxcXCI2XFxcIiB5MT1cXFwiM1xcXCIgeDI9XFxcIjZcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxjaXJjbGUgY3g9XFxcIjE4XFxcIiBjeT1cXFwiNlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiNlxcXCIgY3k9XFxcIjE4XFxcIiByPVxcXCIzXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNMTggOWE5IDkgMCAwIDEtOSA5XFxcIj48L3BhdGg+XCIsXCJnaXQtY29tbWl0XCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCI0XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiMS4wNVxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE3LjAxXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyMi45NlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+XCIsXCJnaXQtbWVyZ2VcIjpcIjxjaXJjbGUgY3g9XFxcIjE4XFxcIiBjeT1cXFwiMThcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjZcXFwiIGN5PVxcXCI2XFxcIiByPVxcXCIzXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNNiAyMVY5YTkgOSAwIDAgMCA5IDlcXFwiPjwvcGF0aD5cIixcImdpdC1wdWxsLXJlcXVlc3RcIjpcIjxjaXJjbGUgY3g9XFxcIjE4XFxcIiBjeT1cXFwiMThcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjZcXFwiIGN5PVxcXCI2XFxcIiByPVxcXCIzXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNMTMgNmgzYTIgMiAwIDAgMSAyIDJ2N1xcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCI2XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjZcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPlwiLFwiZ2l0aHViXCI6XCI8cGF0aCBkPVxcXCJNOSAxOWMtNSAxLjUtNS0yLjUtNy0zbTE0IDZ2LTMuODdhMy4zNyAzLjM3IDAgMCAwLS45NC0yLjYxYzMuMTQtLjM1IDYuNDQtMS41NCA2LjQ0LTdBNS40NCA1LjQ0IDAgMCAwIDIwIDQuNzcgNS4wNyA1LjA3IDAgMCAwIDE5LjkxIDFTMTguNzMuNjUgMTYgMi40OGExMy4zOCAxMy4zOCAwIDAgMC03IDBDNi4yNy42NSA1LjA5IDEgNS4wOSAxQTUuMDcgNS4wNyAwIDAgMCA1IDQuNzdhNS40NCA1LjQ0IDAgMCAwLTEuNSAzLjc4YzAgNS40MiAzLjMgNi42MSA2LjQ0IDdBMy4zNyAzLjM3IDAgMCAwIDkgMTguMTNWMjJcXFwiPjwvcGF0aD5cIixcImdpdGxhYlwiOlwiPHBhdGggZD1cXFwiTTIyLjY1IDE0LjM5TDEyIDIyLjEzIDEuMzUgMTQuMzlhLjg0Ljg0IDAgMCAxLS4zLS45NGwxLjIyLTMuNzggMi40NC03LjUxQS40Mi40MiAwIDAgMSA0LjgyIDJhLjQzLjQzIDAgMCAxIC41OCAwIC40Mi40MiAwIDAgMSAuMTEuMThsMi40NCA3LjQ5aDguMWwyLjQ0LTcuNTFBLjQyLjQyIDAgMCAxIDE4LjYgMmEuNDMuNDMgMCAwIDEgLjU4IDAgLjQyLjQyIDAgMCAxIC4xMS4xOGwyLjQ0IDcuNTFMMjMgMTMuNDVhLjg0Ljg0IDAgMCAxLS4zNS45NHpcXFwiPjwvcGF0aD5cIixcImdsb2JlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjJcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjIyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNMTIgMmExNS4zIDE1LjMgMCAwIDEgNCAxMCAxNS4zIDE1LjMgMCAwIDEtNCAxMCAxNS4zIDE1LjMgMCAwIDEtNC0xMCAxNS4zIDE1LjMgMCAwIDEgNC0xMHpcXFwiPjwvcGF0aD5cIixcImdyaWRcIjpcIjxyZWN0IHg9XFxcIjNcXFwiIHk9XFxcIjNcXFwiIHdpZHRoPVxcXCI3XFxcIiBoZWlnaHQ9XFxcIjdcXFwiPjwvcmVjdD48cmVjdCB4PVxcXCIxNFxcXCIgeT1cXFwiM1xcXCIgd2lkdGg9XFxcIjdcXFwiIGhlaWdodD1cXFwiN1xcXCI+PC9yZWN0PjxyZWN0IHg9XFxcIjE0XFxcIiB5PVxcXCIxNFxcXCIgd2lkdGg9XFxcIjdcXFwiIGhlaWdodD1cXFwiN1xcXCI+PC9yZWN0PjxyZWN0IHg9XFxcIjNcXFwiIHk9XFxcIjE0XFxcIiB3aWR0aD1cXFwiN1xcXCIgaGVpZ2h0PVxcXCI3XFxcIj48L3JlY3Q+XCIsXCJoYXJkLWRyaXZlXCI6XCI8bGluZSB4MT1cXFwiMjJcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjJcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxwYXRoIGQ9XFxcIk01LjQ1IDUuMTFMMiAxMnY2YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtNmwtMy40NS02Ljg5QTIgMiAwIDAgMCAxNi43NiA0SDcuMjRhMiAyIDAgMCAwLTEuNzkgMS4xMXpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiNlxcXCIgeTE9XFxcIjE2XFxcIiB4Mj1cXFwiNi4wMVxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEwXFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIxMC4wMVxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+XCIsXCJoYXNoXCI6XCI8bGluZSB4MT1cXFwiNFxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCIyMFxcXCIgeTI9XFxcIjlcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiNFxcXCIgeTE9XFxcIjE1XFxcIiB4Mj1cXFwiMjBcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMFxcXCIgeTE9XFxcIjNcXFwiIHgyPVxcXCI4XFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCIzXFxcIiB4Mj1cXFwiMTRcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPlwiLFwiaGVhZHBob25lc1wiOlwiPHBhdGggZD1cXFwiTTMgMTh2LTZhOSA5IDAgMCAxIDE4IDB2NlxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0yMSAxOWEyIDIgMCAwIDEtMiAyaC0xYTIgMiAwIDAgMS0yLTJ2LTNhMiAyIDAgMCAxIDItMmgzek0zIDE5YTIgMiAwIDAgMCAyIDJoMWEyIDIgMCAwIDAgMi0ydi0zYTIgMiAwIDAgMC0yLTJIM3pcXFwiPjwvcGF0aD5cIixcImhlYXJ0XCI6XCI8cGF0aCBkPVxcXCJNMjAuODQgNC42MWE1LjUgNS41IDAgMCAwLTcuNzggMEwxMiA1LjY3bC0xLjA2LTEuMDZhNS41IDUuNSAwIDAgMC03Ljc4IDcuNzhsMS4wNiAxLjA2TDEyIDIxLjIzbDcuNzgtNy43OCAxLjA2LTEuMDZhNS41IDUuNSAwIDAgMCAwLTcuNzh6XFxcIj48L3BhdGg+XCIsXCJoZWxwLWNpcmNsZVwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxwYXRoIGQ9XFxcIk05LjA5IDlhMyAzIDAgMCAxIDUuODMgMWMwIDItMyAzLTMgM1xcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE3XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIxN1xcXCI+PC9saW5lPlwiLFwiaGV4YWdvblwiOlwiPHBhdGggZD1cXFwiTTIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2elxcXCI+PC9wYXRoPlwiLFwiaG9tZVwiOlwiPHBhdGggZD1cXFwiTTMgOWw5LTcgOSA3djExYTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yelxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjkgMjIgOSAxMiAxNSAxMiAxNSAyMlxcXCI+PC9wb2x5bGluZT5cIixcImltYWdlXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxjaXJjbGUgY3g9XFxcIjguNVxcXCIgY3k9XFxcIjguNVxcXCIgcj1cXFwiMS41XFxcIj48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPVxcXCIyMSAxNSAxNiAxMCA1IDIxXFxcIj48L3BvbHlsaW5lPlwiLFwiaW5ib3hcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjIyIDEyIDE2IDEyIDE0IDE1IDEwIDE1IDggMTIgMiAxMlxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNNS40NSA1LjExTDIgMTJ2NmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTZsLTMuNDUtNi44OUEyIDIgMCAwIDAgMTYuNzYgNEg3LjI0YTIgMiAwIDAgMC0xLjc5IDEuMTF6XFxcIj48L3BhdGg+XCIsXCJpbmZvXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiOFxcXCIgeDI9XFxcIjEyLjAxXFxcIiB5Mj1cXFwiOFxcXCI+PC9saW5lPlwiLFwiaW5zdGFncmFtXCI6XCI8cmVjdCB4PVxcXCIyXFxcIiB5PVxcXCIyXFxcIiB3aWR0aD1cXFwiMjBcXFwiIGhlaWdodD1cXFwiMjBcXFwiIHJ4PVxcXCI1XFxcIiByeT1cXFwiNVxcXCI+PC9yZWN0PjxwYXRoIGQ9XFxcIk0xNiAxMS4zN0E0IDQgMCAxIDEgMTIuNjMgOCA0IDQgMCAwIDEgMTYgMTEuMzd6XFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjE3LjVcXFwiIHkxPVxcXCI2LjVcXFwiIHgyPVxcXCIxNy41MVxcXCIgeTI9XFxcIjYuNVxcXCI+PC9saW5lPlwiLFwiaXRhbGljXCI6XCI8bGluZSB4MT1cXFwiMTlcXFwiIHkxPVxcXCI0XFxcIiB4Mj1cXFwiMTBcXFwiIHkyPVxcXCI0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE0XFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCI1XFxcIiB5Mj1cXFwiMjBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTVcXFwiIHkxPVxcXCI0XFxcIiB4Mj1cXFwiOVxcXCIgeTI9XFxcIjIwXFxcIj48L2xpbmU+XCIsXCJrZXlcIjpcIjxwYXRoIGQ9XFxcIk0yMSAybC0yIDJtLTcuNjEgNy42MWE1LjUgNS41IDAgMSAxLTcuNzc4IDcuNzc4IDUuNSA1LjUgMCAwIDEgNy43NzctNy43Nzd6bTAgMEwxNS41IDcuNW0wIDBsMyAzTDIyIDdsLTMtM20tMy41IDMuNUwxOSA0XFxcIj48L3BhdGg+XCIsXCJsYXllcnNcIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyXFxcIj48L3BvbHlnb24+PHBvbHlsaW5lIHBvaW50cz1cXFwiMiAxNyAxMiAyMiAyMiAxN1xcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIyIDEyIDEyIDE3IDIyIDEyXFxcIj48L3BvbHlsaW5lPlwiLFwibGF5b3V0XCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIzXFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjIxXFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCI5XFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPlwiLFwibGlmZS1idW95XCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiNFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjQuOTNcXFwiIHkxPVxcXCI0LjkzXFxcIiB4Mj1cXFwiOS4xN1xcXCIgeTI9XFxcIjkuMTdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTQuODNcXFwiIHkxPVxcXCIxNC44M1xcXCIgeDI9XFxcIjE5LjA3XFxcIiB5Mj1cXFwiMTkuMDdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTQuODNcXFwiIHkxPVxcXCI5LjE3XFxcIiB4Mj1cXFwiMTkuMDdcXFwiIHkyPVxcXCI0LjkzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE0LjgzXFxcIiB5MT1cXFwiOS4xN1xcXCIgeDI9XFxcIjE4LjM2XFxcIiB5Mj1cXFwiNS42NFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI0LjkzXFxcIiB5MT1cXFwiMTkuMDdcXFwiIHgyPVxcXCI5LjE3XFxcIiB5Mj1cXFwiMTQuODNcXFwiPjwvbGluZT5cIixcImxpbmstMlwiOlwiPHBhdGggZD1cXFwiTTE1IDdoM2E1IDUgMCAwIDEgNSA1IDUgNSAwIDAgMS01IDVoLTNtLTYgMEg2YTUgNSAwIDAgMS01LTUgNSA1IDAgMCAxIDUtNWgzXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImxpbmtcIjpcIjxwYXRoIGQ9XFxcIk0xMCAxM2E1IDUgMCAwIDAgNy41NC41NGwzLTNhNSA1IDAgMCAwLTcuMDctNy4wN2wtMS43MiAxLjcxXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXFxcIj48L3BhdGg+XCIsXCJsaW5rZWRpblwiOlwiPHBhdGggZD1cXFwiTTE2IDhhNiA2IDAgMCAxIDYgNnY3aC00di03YTIgMiAwIDAgMC0yLTIgMiAyIDAgMCAwLTIgMnY3aC00di03YTYgNiAwIDAgMSA2LTZ6XFxcIj48L3BhdGg+PHJlY3QgeD1cXFwiMlxcXCIgeT1cXFwiOVxcXCIgd2lkdGg9XFxcIjRcXFwiIGhlaWdodD1cXFwiMTJcXFwiPjwvcmVjdD48Y2lyY2xlIGN4PVxcXCI0XFxcIiBjeT1cXFwiNFxcXCIgcj1cXFwiMlxcXCI+PC9jaXJjbGU+XCIsXCJsaXN0XCI6XCI8bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjZcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMjFcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI4XFxcIiB5MT1cXFwiMThcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjNcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMy4wMVxcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiM1xcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMy4wMVxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjNcXFwiIHkxPVxcXCIxOFxcXCIgeDI9XFxcIjMuMDFcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPlwiLFwibG9hZGVyXCI6XCI8bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCI2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMThcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjIyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjQuOTNcXFwiIHkxPVxcXCI0LjkzXFxcIiB4Mj1cXFwiNy43NlxcXCIgeTI9XFxcIjcuNzZcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTYuMjRcXFwiIHkxPVxcXCIxNi4yNFxcXCIgeDI9XFxcIjE5LjA3XFxcIiB5Mj1cXFwiMTkuMDdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMlxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiNlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE4XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyMlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjQuOTNcXFwiIHkxPVxcXCIxOS4wN1xcXCIgeDI9XFxcIjcuNzZcXFwiIHkyPVxcXCIxNi4yNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNi4yNFxcXCIgeTE9XFxcIjcuNzZcXFwiIHgyPVxcXCIxOS4wN1xcXCIgeTI9XFxcIjQuOTNcXFwiPjwvbGluZT5cIixcImxvY2tcIjpcIjxyZWN0IHg9XFxcIjNcXFwiIHk9XFxcIjExXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMTFcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxwYXRoIGQ9XFxcIk03IDExVjdhNSA1IDAgMCAxIDEwIDB2NFxcXCI+PC9wYXRoPlwiLFwibG9nLWluXCI6XCI8cGF0aCBkPVxcXCJNMTUgM2g0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMmgtNFxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjEwIDE3IDE1IDEyIDEwIDdcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjE1XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIzXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcImxvZy1vdXRcIjpcIjxwYXRoIGQ9XFxcIk05IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNFxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjE2IDE3IDIxIDEyIDE2IDdcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCI5XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcIm1haWxcIjpcIjxwYXRoIGQ9XFxcIk00IDRoMTZjMS4xIDAgMiAuOSAyIDJ2MTJjMCAxLjEtLjkgMi0yIDJINGMtMS4xIDAtMi0uOS0yLTJWNmMwLTEuMS45LTIgMi0yelxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjIyLDYgMTIsMTMgMiw2XFxcIj48L3BvbHlsaW5lPlwiLFwibWFwLXBpblwiOlwiPHBhdGggZD1cXFwiTTIxIDEwYzAgNy05IDEzLTkgMTNzLTktNi05LTEzYTkgOSAwIDAgMSAxOCAwelxcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTBcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPlwiLFwibWFwXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjEgNiAxIDIyIDggMTggMTYgMjIgMjMgMTggMjMgMiAxNiA2IDggMiAxIDZcXFwiPjwvcG9seWdvbj48bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCI4XFxcIiB5Mj1cXFwiMThcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIyMlxcXCI+PC9saW5lPlwiLFwibWF4aW1pemUtMlwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTUgMyAyMSAzIDIxIDlcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOSAyMSAzIDIxIDMgMTVcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiM1xcXCIgeDI9XFxcIjE0XFxcIiB5Mj1cXFwiMTBcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiM1xcXCIgeTE9XFxcIjIxXFxcIiB4Mj1cXFwiMTBcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPlwiLFwibWF4aW1pemVcIjpcIjxwYXRoIGQ9XFxcIk04IDNINWEyIDIgMCAwIDAtMiAydjNtMTggMFY1YTIgMiAwIDAgMC0yLTJoLTNtMCAxOGgzYTIgMiAwIDAgMCAyLTJ2LTNNMyAxNnYzYTIgMiAwIDAgMCAyIDJoM1xcXCI+PC9wYXRoPlwiLFwibWVoXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxNVxcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCI5LjAxXFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNVxcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCIxNS4wMVxcXCIgeTI9XFxcIjlcXFwiPjwvbGluZT5cIixcIm1lbnVcIjpcIjxsaW5lIHgxPVxcXCIzXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjNcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMjFcXFwiIHkyPVxcXCI2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjNcXFwiIHkxPVxcXCIxOFxcXCIgeDI9XFxcIjIxXFxcIiB5Mj1cXFwiMThcXFwiPjwvbGluZT5cIixcIm1lc3NhZ2UtY2lyY2xlXCI6XCI8cGF0aCBkPVxcXCJNMjEgMTEuNWE4LjM4IDguMzggMCAwIDEtLjkgMy44IDguNSA4LjUgMCAwIDEtNy42IDQuNyA4LjM4IDguMzggMCAwIDEtMy44LS45TDMgMjFsMS45LTUuN2E4LjM4IDguMzggMCAwIDEtLjktMy44IDguNSA4LjUgMCAwIDEgNC43LTcuNiA4LjM4IDguMzggMCAwIDEgMy44LS45aC41YTguNDggOC40OCAwIDAgMSA4IDh2LjV6XFxcIj48L3BhdGg+XCIsXCJtZXNzYWdlLXNxdWFyZVwiOlwiPHBhdGggZD1cXFwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelxcXCI+PC9wYXRoPlwiLFwibWljLW9mZlwiOlwiPGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPjxwYXRoIGQ9XFxcIk05IDl2M2EzIDMgMCAwIDAgNS4xMiAyLjEyTTE1IDkuMzRWNGEzIDMgMCAwIDAtNS45NC0uNlxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xNyAxNi45NUE3IDcgMCAwIDEgNSAxMnYtMm0xNCAwdjJhNyA3IDAgMCAxLS4xMSAxLjIzXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTlcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIyM1xcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMjNcXFwiPjwvbGluZT5cIixcIm1pY1wiOlwiPHBhdGggZD1cXFwiTTEyIDFhMyAzIDAgMCAwLTMgM3Y4YTMgMyAwIDAgMCA2IDBWNGEzIDMgMCAwIDAtMy0zelxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xOSAxMHYyYTcgNyAwIDAgMS0xNCAwdi0yXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTlcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIyM1xcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMjNcXFwiPjwvbGluZT5cIixcIm1pbmltaXplLTJcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjQgMTQgMTAgMTQgMTAgMjBcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMjAgMTAgMTQgMTAgMTQgNFxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTRcXFwiIHkxPVxcXCIxMFxcXCIgeDI9XFxcIjIxXFxcIiB5Mj1cXFwiM1xcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIzXFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCIxMFxcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+XCIsXCJtaW5pbWl6ZVwiOlwiPHBhdGggZD1cXFwiTTggM3YzYTIgMiAwIDAgMS0yIDJIM20xOCAwaC0zYTIgMiAwIDAgMS0yLTJWM20wIDE4di0zYTIgMiAwIDAgMSAyLTJoM00zIDE2aDNhMiAyIDAgMCAxIDIgMnYzXFxcIj48L3BhdGg+XCIsXCJtaW51cy1jaXJjbGVcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiOFxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPlwiLFwibWludXMtc3F1YXJlXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCI4XFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIxNlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+XCIsXCJtaW51c1wiOlwiPGxpbmUgeDE9XFxcIjVcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE5XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcIm1vbml0b3JcIjpcIjxyZWN0IHg9XFxcIjJcXFwiIHk9XFxcIjNcXFwiIHdpZHRoPVxcXCIyMFxcXCIgaGVpZ2h0PVxcXCIxNFxcXCIgcng9XFxcIjJcXFwiIHJ5PVxcXCIyXFxcIj48L3JlY3Q+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIyMVxcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxN1xcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT5cIixcIm1vb25cIjpcIjxwYXRoIGQ9XFxcIk0yMSAxMi43OUE5IDkgMCAxIDEgMTEuMjEgMyA3IDcgMCAwIDAgMjEgMTIuNzl6XFxcIj48L3BhdGg+XCIsXCJtb3JlLWhvcml6b250YWxcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjFcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjE5XFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjFcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjVcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMVxcXCI+PC9jaXJjbGU+XCIsXCJtb3JlLXZlcnRpY2FsXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxXFxcIj48L2NpcmNsZT48Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjVcXFwiIHI9XFxcIjFcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTlcXFwiIHI9XFxcIjFcXFwiPjwvY2lyY2xlPlwiLFwibW91c2UtcG9pbnRlclwiOlwiPHBhdGggZD1cXFwiTTMgM2w3LjA3IDE2Ljk3IDIuNTEtNy4zOSA3LjM5LTIuNTFMMyAzelxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xMyAxM2w2IDZcXFwiPjwvcGF0aD5cIixcIm1vdmVcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjUgOSAyIDEyIDUgMTVcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOSA1IDEyIDIgMTUgNVxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxNSAxOSAxMiAyMiA5IDE5XFxcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjE5IDkgMjIgMTIgMTkgMTVcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjJcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjIyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIyMlxcXCI+PC9saW5lPlwiLFwibXVzaWNcIjpcIjxwYXRoIGQ9XFxcIk05IDE4VjVsMTItMnYxM1xcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjZcXFwiIGN5PVxcXCIxOFxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMThcXFwiIGN5PVxcXCIxNlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+XCIsXCJuYXZpZ2F0aW9uLTJcIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMTIgMiAxOSAyMSAxMiAxNyA1IDIxIDEyIDJcXFwiPjwvcG9seWdvbj5cIixcIm5hdmlnYXRpb25cIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMyAxMSAyMiAyIDEzIDIxIDExIDEzIDMgMTFcXFwiPjwvcG9seWdvbj5cIixcIm9jdGFnb25cIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiNy44NiAyIDE2LjE0IDIgMjIgNy44NiAyMiAxNi4xNCAxNi4xNCAyMiA3Ljg2IDIyIDIgMTYuMTQgMiA3Ljg2IDcuODYgMlxcXCI+PC9wb2x5Z29uPlwiLFwicGFja2FnZVwiOlwiPGxpbmUgeDE9XFxcIjE2LjVcXFwiIHkxPVxcXCI5LjRcXFwiIHgyPVxcXCI3LjVcXFwiIHkyPVxcXCI0LjIxXFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2elxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjMuMjcgNi45NiAxMiAxMi4wMSAyMC43MyA2Ljk2XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIyLjA4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxMlxcXCI+PC9saW5lPlwiLFwicGFwZXJjbGlwXCI6XCI8cGF0aCBkPVxcXCJNMjEuNDQgMTEuMDVsLTkuMTkgOS4xOWE2IDYgMCAwIDEtOC40OS04LjQ5bDkuMTktOS4xOWE0IDQgMCAwIDEgNS42NiA1LjY2bC05LjIgOS4xOWEyIDIgMCAwIDEtMi44My0yLjgzbDguNDktOC40OFxcXCI+PC9wYXRoPlwiLFwicGF1c2UtY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjEwXFxcIiB5MT1cXFwiMTVcXFwiIHgyPVxcXCIxMFxcXCIgeTI9XFxcIjlcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTRcXFwiIHkxPVxcXCIxNVxcXCIgeDI9XFxcIjE0XFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPlwiLFwicGF1c2VcIjpcIjxyZWN0IHg9XFxcIjZcXFwiIHk9XFxcIjRcXFwiIHdpZHRoPVxcXCI0XFxcIiBoZWlnaHQ9XFxcIjE2XFxcIj48L3JlY3Q+PHJlY3QgeD1cXFwiMTRcXFwiIHk9XFxcIjRcXFwiIHdpZHRoPVxcXCI0XFxcIiBoZWlnaHQ9XFxcIjE2XFxcIj48L3JlY3Q+XCIsXCJwZW4tdG9vbFwiOlwiPHBhdGggZD1cXFwiTTEyIDE5bDctNyAzIDMtNyA3LTMtM3pcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMTggMTNsLTEuNS03LjVMMiAybDMuNSAxNC41TDEzIDE4bDUtNXpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMiAybDcuNTg2IDcuNTg2XFxcIj48L3BhdGg+PGNpcmNsZSBjeD1cXFwiMTFcXFwiIGN5PVxcXCIxMVxcXCIgcj1cXFwiMlxcXCI+PC9jaXJjbGU+XCIsXCJwZXJjZW50XCI6XCI8bGluZSB4MT1cXFwiMTlcXFwiIHkxPVxcXCI1XFxcIiB4Mj1cXFwiNVxcXCIgeTI9XFxcIjE5XFxcIj48L2xpbmU+PGNpcmNsZSBjeD1cXFwiNi41XFxcIiBjeT1cXFwiNi41XFxcIiByPVxcXCIyLjVcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjE3LjVcXFwiIGN5PVxcXCIxNy41XFxcIiByPVxcXCIyLjVcXFwiPjwvY2lyY2xlPlwiLFwicGhvbmUtY2FsbFwiOlwiPHBhdGggZD1cXFwiTTE1LjA1IDVBNSA1IDAgMCAxIDE5IDguOTVNMTUuMDUgMUE5IDkgMCAwIDEgMjMgOC45NG0tMSA3Ljk4djNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6XFxcIj48L3BhdGg+XCIsXCJwaG9uZS1mb3J3YXJkZWRcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE5IDEgMjMgNSAxOSA5XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxNVxcXCIgeTE9XFxcIjVcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjVcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNMjIgMTYuOTJ2M2EyIDIgMCAwIDEtMi4xOCAyIDE5Ljc5IDE5Ljc5IDAgMCAxLTguNjMtMy4wNyAxOS41IDE5LjUgMCAwIDEtNi02IDE5Ljc5IDE5Ljc5IDAgMCAxLTMuMDctOC42N0EyIDIgMCAwIDEgNC4xMSAyaDNhMiAyIDAgMCAxIDIgMS43MiAxMi44NCAxMi44NCAwIDAgMCAuNyAyLjgxIDIgMiAwIDAgMS0uNDUgMi4xMUw4LjA5IDkuOTFhMTYgMTYgMCAwIDAgNiA2bDEuMjctMS4yN2EyIDIgMCAwIDEgMi4xMS0uNDUgMTIuODQgMTIuODQgMCAwIDAgMi44MS43QTIgMiAwIDAgMSAyMiAxNi45MnpcXFwiPjwvcGF0aD5cIixcInBob25lLWluY29taW5nXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxNiAyIDE2IDggMjIgOFxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMjNcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMTZcXFwiIHkyPVxcXCI4XFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTIyIDE2LjkydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6XFxcIj48L3BhdGg+XCIsXCJwaG9uZS1taXNzZWRcIjpcIjxsaW5lIHgxPVxcXCIyM1xcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIxN1xcXCIgeTI9XFxcIjdcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTdcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCI3XFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTIyIDE2LjkydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6XFxcIj48L3BhdGg+XCIsXCJwaG9uZS1vZmZcIjpcIjxwYXRoIGQ9XFxcIk0xMC42OCAxMy4zMWExNiAxNiAwIDAgMCAzLjQxIDIuNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuNyAyIDIgMCAwIDEgMS43MiAydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNDIgMTkuNDIgMCAwIDEtMy4zMy0yLjY3bS0yLjY3LTMuMzRhMTkuNzkgMTkuNzkgMCAwIDEtMy4wNy04LjYzQTIgMiAwIDAgMSA0LjExIDJoM2EyIDIgMCAwIDEgMiAxLjcyIDEyLjg0IDEyLjg0IDAgMCAwIC43IDIuODEgMiAyIDAgMCAxLS40NSAyLjExTDguMDkgOS45MVxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIyM1xcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIxXFxcIiB5Mj1cXFwiMjNcXFwiPjwvbGluZT5cIixcInBob25lLW91dGdvaW5nXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIyMyA3IDIzIDEgMTcgMVxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTZcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIxXFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTIyIDE2LjkydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6XFxcIj48L3BhdGg+XCIsXCJwaG9uZVwiOlwiPHBhdGggZD1cXFwiTTIyIDE2LjkydjNhMiAyIDAgMCAxLTIuMTggMiAxOS43OSAxOS43OSAwIDAgMS04LjYzLTMuMDcgMTkuNSAxOS41IDAgMCAxLTYtNiAxOS43OSAxOS43OSAwIDAgMS0zLjA3LTguNjdBMiAyIDAgMCAxIDQuMTEgMmgzYTIgMiAwIDAgMSAyIDEuNzIgMTIuODQgMTIuODQgMCAwIDAgLjcgMi44MSAyIDIgMCAwIDEtLjQ1IDIuMTFMOC4wOSA5LjkxYTE2IDE2IDAgMCAwIDYgNmwxLjI3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6XFxcIj48L3BhdGg+XCIsXCJwaWUtY2hhcnRcIjpcIjxwYXRoIGQ9XFxcIk0yMS4yMSAxNS44OUExMCAxMCAwIDEgMSA4IDIuODNcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNMjIgMTJBMTAgMTAgMCAwIDAgMTIgMnYxMHpcXFwiPjwvcGF0aD5cIixcInBsYXktY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PHBvbHlnb24gcG9pbnRzPVxcXCIxMCA4IDE2IDEyIDEwIDE2IDEwIDhcXFwiPjwvcG9seWdvbj5cIixcInBsYXlcIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiNSAzIDE5IDEyIDUgMjEgNSAzXFxcIj48L3BvbHlnb24+XCIsXCJwbHVzLWNpcmNsZVwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcInBsdXMtc3F1YXJlXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE2XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcInBsdXNcIjpcIjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjVcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE5XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjVcXFwiIHkxPVxcXCIxMlxcXCIgeDI9XFxcIjE5XFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcInBvY2tldFwiOlwiPHBhdGggZD1cXFwiTTQgM2gxNmEyIDIgMCAwIDEgMiAydjZhMTAgMTAgMCAwIDEtMTAgMTBBMTAgMTAgMCAwIDEgMiAxMVY1YTIgMiAwIDAgMSAyLTJ6XFxcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cXFwiOCAxMCAxMiAxNCAxNiAxMFxcXCI+PC9wb2x5bGluZT5cIixcInBvd2VyXCI6XCI8cGF0aCBkPVxcXCJNMTguMzYgNi42NGE5IDkgMCAxIDEtMTIuNzMgMFxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+XCIsXCJwcmludGVyXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCI2IDkgNiAyIDE4IDIgMTggOVxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNNiAxOEg0YTIgMiAwIDAgMS0yLTJ2LTVhMiAyIDAgMCAxIDItMmgxNmEyIDIgMCAwIDEgMiAydjVhMiAyIDAgMCAxLTIgMmgtMlxcXCI+PC9wYXRoPjxyZWN0IHg9XFxcIjZcXFwiIHk9XFxcIjE0XFxcIiB3aWR0aD1cXFwiMTJcXFwiIGhlaWdodD1cXFwiOFxcXCI+PC9yZWN0PlwiLFwicmFkaW9cIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjJcXFwiPjwvY2lyY2xlPjxwYXRoIGQ9XFxcIk0xNi4yNCA3Ljc2YTYgNiAwIDAgMSAwIDguNDltLTguNDgtLjAxYTYgNiAwIDAgMSAwLTguNDltMTEuMzEtMi44MmExMCAxMCAwIDAgMSAwIDE0LjE0bS0xNC4xNCAwYTEwIDEwIDAgMCAxIDAtMTQuMTRcXFwiPjwvcGF0aD5cIixcInJlZnJlc2gtY2N3XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxIDQgMSAxMCA3IDEwXFxcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjIzIDIwIDIzIDE0IDE3IDE0XFxcIj48L3BvbHlsaW5lPjxwYXRoIGQ9XFxcIk0yMC40OSA5QTkgOSAwIDAgMCA1LjY0IDUuNjRMMSAxMG0yMiA0bC00LjY0IDQuMzZBOSA5IDAgMCAxIDMuNTEgMTVcXFwiPjwvcGF0aD5cIixcInJlZnJlc2gtY3dcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjIzIDQgMjMgMTAgMTcgMTBcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMSAyMCAxIDE0IDcgMTRcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTMuNTEgOWE5IDkgMCAwIDEgMTQuODUtMy4zNkwyMyAxME0xIDE0bDQuNjQgNC4zNkE5IDkgMCAwIDAgMjAuNDkgMTVcXFwiPjwvcGF0aD5cIixcInJlcGVhdFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTcgMSAyMSA1IDE3IDlcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTMgMTFWOWE0IDQgMCAwIDEgNC00aDE0XFxcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cXFwiNyAyMyAzIDE5IDcgMTVcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTIxIDEzdjJhNCA0IDAgMCAxLTQgNEgzXFxcIj48L3BhdGg+XCIsXCJyZXdpbmRcIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMTEgMTkgMiAxMiAxMSA1IDExIDE5XFxcIj48L3BvbHlnb24+PHBvbHlnb24gcG9pbnRzPVxcXCIyMiAxOSAxMyAxMiAyMiA1IDIyIDE5XFxcIj48L3BvbHlnb24+XCIsXCJyb3RhdGUtY2N3XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxIDQgMSAxMCA3IDEwXFxcIj48L3BvbHlsaW5lPjxwYXRoIGQ9XFxcIk0zLjUxIDE1YTkgOSAwIDEgMCAyLjEzLTkuMzZMMSAxMFxcXCI+PC9wYXRoPlwiLFwicm90YXRlLWN3XCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIyMyA0IDIzIDEwIDE3IDEwXFxcIj48L3BvbHlsaW5lPjxwYXRoIGQ9XFxcIk0yMC40OSAxNWE5IDkgMCAxIDEtMi4xMi05LjM2TDIzIDEwXFxcIj48L3BhdGg+XCIsXCJyc3NcIjpcIjxwYXRoIGQ9XFxcIk00IDExYTkgOSAwIDAgMSA5IDlcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNNCA0YTE2IDE2IDAgMCAxIDE2IDE2XFxcIj48L3BhdGg+PGNpcmNsZSBjeD1cXFwiNVxcXCIgY3k9XFxcIjE5XFxcIiByPVxcXCIxXFxcIj48L2NpcmNsZT5cIixcInNhdmVcIjpcIjxwYXRoIGQ9XFxcIk0xOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDExbDUgNXYxMWEyIDIgMCAwIDEtMiAyelxcXCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9XFxcIjE3IDIxIDE3IDEzIDcgMTMgNyAyMVxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCI3IDMgNyA4IDE1IDhcXFwiPjwvcG9seWxpbmU+XCIsXCJzY2lzc29yc1wiOlwiPGNpcmNsZSBjeD1cXFwiNlxcXCIgY3k9XFxcIjZcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjZcXFwiIGN5PVxcXCIxOFxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjIwXFxcIiB5MT1cXFwiNFxcXCIgeDI9XFxcIjguMTJcXFwiIHkyPVxcXCIxNS44OFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNC40N1xcXCIgeTE9XFxcIjE0LjQ4XFxcIiB4Mj1cXFwiMjBcXFwiIHkyPVxcXCIyMFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI4LjEyXFxcIiB5MT1cXFwiOC4xMlxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT5cIixcInNlYXJjaFwiOlwiPGNpcmNsZSBjeD1cXFwiMTFcXFwiIGN5PVxcXCIxMVxcXCIgcj1cXFwiOFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCIxNi42NVxcXCIgeTI9XFxcIjE2LjY1XFxcIj48L2xpbmU+XCIsXCJzZW5kXCI6XCI8bGluZSB4MT1cXFwiMjJcXFwiIHkxPVxcXCIyXFxcIiB4Mj1cXFwiMTFcXFwiIHkyPVxcXCIxM1xcXCI+PC9saW5lPjxwb2x5Z29uIHBvaW50cz1cXFwiMjIgMiAxNSAyMiAxMSAxMyAyIDkgMjIgMlxcXCI+PC9wb2x5Z29uPlwiLFwic2VydmVyXCI6XCI8cmVjdCB4PVxcXCIyXFxcIiB5PVxcXCIyXFxcIiB3aWR0aD1cXFwiMjBcXFwiIGhlaWdodD1cXFwiOFxcXCIgcng9XFxcIjJcXFwiIHJ5PVxcXCIyXFxcIj48L3JlY3Q+PHJlY3QgeD1cXFwiMlxcXCIgeT1cXFwiMTRcXFwiIHdpZHRoPVxcXCIyMFxcXCIgaGVpZ2h0PVxcXCI4XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48bGluZSB4MT1cXFwiNlxcXCIgeTE9XFxcIjZcXFwiIHgyPVxcXCI2LjAxXFxcIiB5Mj1cXFwiNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI2XFxcIiB5MT1cXFwiMThcXFwiIHgyPVxcXCI2LjAxXFxcIiB5Mj1cXFwiMThcXFwiPjwvbGluZT5cIixcInNldHRpbmdzXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIzXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNMTkuNCAxNWExLjY1IDEuNjUgMCAwIDAgLjMzIDEuODJsLjA2LjA2YTIgMiAwIDAgMSAwIDIuODMgMiAyIDAgMCAxLTIuODMgMGwtLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAtMS44Mi0uMzMgMS42NSAxLjY1IDAgMCAwLTEgMS41MVYyMWEyIDIgMCAwIDEtMiAyIDIgMiAwIDAgMS0yLTJ2LS4wOUExLjY1IDEuNjUgMCAwIDAgOSAxOS40YTEuNjUgMS42NSAwIDAgMC0xLjgyLjMzbC0uMDYuMDZhMiAyIDAgMCAxLTIuODMgMCAyIDIgMCAwIDEgMC0yLjgzbC4wNi0uMDZhMS42NSAxLjY1IDAgMCAwIC4zMy0xLjgyIDEuNjUgMS42NSAwIDAgMC0xLjUxLTFIM2EyIDIgMCAwIDEtMi0yIDIgMiAwIDAgMSAyLTJoLjA5QTEuNjUgMS42NSAwIDAgMCA0LjYgOWExLjY1IDEuNjUgMCAwIDAtLjMzLTEuODJsLS4wNi0uMDZhMiAyIDAgMCAxIDAtMi44MyAyIDIgMCAwIDEgMi44MyAwbC4wNi4wNmExLjY1IDEuNjUgMCAwIDAgMS44Mi4zM0g5YTEuNjUgMS42NSAwIDAgMCAxLTEuNTFWM2EyIDIgMCAwIDEgMi0yIDIgMiAwIDAgMSAyIDJ2LjA5YTEuNjUgMS42NSAwIDAgMCAxIDEuNTEgMS42NSAxLjY1IDAgMCAwIDEuODItLjMzbC4wNi0uMDZhMiAyIDAgMCAxIDIuODMgMCAyIDIgMCAwIDEgMCAyLjgzbC0uMDYuMDZhMS42NSAxLjY1IDAgMCAwLS4zMyAxLjgyVjlhMS42NSAxLjY1IDAgMCAwIDEuNTEgMUgyMWEyIDIgMCAwIDEgMiAyIDIgMiAwIDAgMS0yIDJoLS4wOWExLjY1IDEuNjUgMCAwIDAtMS41MSAxelxcXCI+PC9wYXRoPlwiLFwic2hhcmUtMlwiOlwiPGNpcmNsZSBjeD1cXFwiMThcXFwiIGN5PVxcXCI1XFxcIiByPVxcXCIzXFxcIj48L2NpcmNsZT48Y2lyY2xlIGN4PVxcXCI2XFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPjxjaXJjbGUgY3g9XFxcIjE4XFxcIiBjeT1cXFwiMTlcXFwiIHI9XFxcIjNcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCI4LjU5XFxcIiB5MT1cXFwiMTMuNTFcXFwiIHgyPVxcXCIxNS40MlxcXCIgeTI9XFxcIjE3LjQ5XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE1LjQxXFxcIiB5MT1cXFwiNi41MVxcXCIgeDI9XFxcIjguNTlcXFwiIHkyPVxcXCIxMC40OVxcXCI+PC9saW5lPlwiLFwic2hhcmVcIjpcIjxwYXRoIGQ9XFxcIk00IDEydjhhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0ydi04XFxcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTYgNiAxMiAyIDggNlxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPlwiLFwic2hpZWxkLW9mZlwiOlwiPHBhdGggZD1cXFwiTTE5LjY5IDE0YTYuOSA2LjkgMCAwIDAgLjMxLTJWNWwtOC0zLTMuMTYgMS4xOFxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk00LjczIDQuNzNMNCA1djdjMCA2IDggMTAgOCAxMGEyMC4yOSAyMC4yOSAwIDAgMCA1LjYyLTQuMzhcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+XCIsXCJzaGllbGRcIjpcIjxwYXRoIGQ9XFxcIk0xMiAyMnM4LTQgOC0xMFY1bC04LTMtOCAzdjdjMCA2IDggMTAgOCAxMHpcXFwiPjwvcGF0aD5cIixcInNob3BwaW5nLWJhZ1wiOlwiPHBhdGggZD1cXFwiTTYgMkwzIDZ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjZsLTMtNHpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiM1xcXCIgeTE9XFxcIjZcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjZcXFwiPjwvbGluZT48cGF0aCBkPVxcXCJNMTYgMTBhNCA0IDAgMCAxLTggMFxcXCI+PC9wYXRoPlwiLFwic2hvcHBpbmctY2FydFwiOlwiPGNpcmNsZSBjeD1cXFwiOVxcXCIgY3k9XFxcIjIxXFxcIiByPVxcXCIxXFxcIj48L2NpcmNsZT48Y2lyY2xlIGN4PVxcXCIyMFxcXCIgY3k9XFxcIjIxXFxcIiByPVxcXCIxXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDkuNzJhMiAyIDAgMCAwIDItMS42MUwyMyA2SDZcXFwiPjwvcGF0aD5cIixcInNodWZmbGVcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjE2IDMgMjEgMyAyMSA4XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCI0XFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCIyMVxcXCIgeTI9XFxcIjNcXFwiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIyMSAxNiAyMSAyMSAxNiAyMVxcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiMTVcXFwiIHkxPVxcXCIxNVxcXCIgeDI9XFxcIjIxXFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiNFxcXCIgeTE9XFxcIjRcXFwiIHgyPVxcXCI5XFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPlwiLFwic2lkZWJhclwiOlwiPHJlY3QgeD1cXFwiM1xcXCIgeT1cXFwiM1xcXCIgd2lkdGg9XFxcIjE4XFxcIiBoZWlnaHQ9XFxcIjE4XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjNcXFwiIHgyPVxcXCI5XFxcIiB5Mj1cXFwiMjFcXFwiPjwvbGluZT5cIixcInNraXAtYmFja1wiOlwiPHBvbHlnb24gcG9pbnRzPVxcXCIxOSAyMCA5IDEyIDE5IDQgMTkgMjBcXFwiPjwvcG9seWdvbj48bGluZSB4MT1cXFwiNVxcXCIgeTE9XFxcIjE5XFxcIiB4Mj1cXFwiNVxcXCIgeTI9XFxcIjVcXFwiPjwvbGluZT5cIixcInNraXAtZm9yd2FyZFwiOlwiPHBvbHlnb24gcG9pbnRzPVxcXCI1IDQgMTUgMTIgNSAyMCA1IDRcXFwiPjwvcG9seWdvbj48bGluZSB4MT1cXFwiMTlcXFwiIHkxPVxcXCI1XFxcIiB4Mj1cXFwiMTlcXFwiIHkyPVxcXCIxOVxcXCI+PC9saW5lPlwiLFwic2xhY2tcIjpcIjxwYXRoIGQ9XFxcIk0xNC41IDEwYy0uODMgMC0xLjUtLjY3LTEuNS0xLjV2LTVjMC0uODMuNjctMS41IDEuNS0xLjVzMS41LjY3IDEuNSAxLjV2NWMwIC44My0uNjcgMS41LTEuNSAxLjV6XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTIwLjUgMTBIMTlWOC41YzAtLjgzLjY3LTEuNSAxLjUtMS41czEuNS42NyAxLjUgMS41LS42NyAxLjUtMS41IDEuNXpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNOS41IDE0Yy44MyAwIDEuNS42NyAxLjUgMS41djVjMCAuODMtLjY3IDEuNS0xLjUgMS41UzggMjEuMzMgOCAyMC41di01YzAtLjgzLjY3LTEuNSAxLjUtMS41elxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0zLjUgMTRINXYxLjVjMCAuODMtLjY3IDEuNS0xLjUgMS41UzIgMTYuMzMgMiAxNS41IDIuNjcgMTQgMy41IDE0elxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xNCAxNC41YzAtLjgzLjY3LTEuNSAxLjUtMS41aDVjLjgzIDAgMS41LjY3IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNWgtNWMtLjgzIDAtMS41LS42Ny0xLjUtMS41elxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xNS41IDE5SDE0djEuNWMwIC44My42NyAxLjUgMS41IDEuNXMxLjUtLjY3IDEuNS0xLjUtLjY3LTEuNS0xLjUtMS41elxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xMCA5LjVDMTAgOC42NyA5LjMzIDggOC41IDhoLTVDMi42NyA4IDIgOC42NyAyIDkuNVMyLjY3IDExIDMuNSAxMWg1Yy44MyAwIDEuNS0uNjcgMS41LTEuNXpcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNOC41IDVIMTBWMy41QzEwIDIuNjcgOS4zMyAyIDguNSAyUzcgMi42NyA3IDMuNSA3LjY3IDUgOC41IDV6XFxcIj48L3BhdGg+XCIsXCJzbGFzaFwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMTBcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCI0LjkzXFxcIiB5MT1cXFwiNC45M1xcXCIgeDI9XFxcIjE5LjA3XFxcIiB5Mj1cXFwiMTkuMDdcXFwiPjwvbGluZT5cIixcInNsaWRlcnNcIjpcIjxsaW5lIHgxPVxcXCI0XFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCI0XFxcIiB5Mj1cXFwiMTRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiNFxcXCIgeTE9XFxcIjEwXFxcIiB4Mj1cXFwiNFxcXCIgeTI9XFxcIjNcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIyMVxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMTJcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIwXFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCIyMFxcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIwXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyMFxcXCIgeTI9XFxcIjNcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjE0XFxcIiB4Mj1cXFwiN1xcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjlcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTVcXFwiIHkyPVxcXCI4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE3XFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjE2XFxcIj48L2xpbmU+XCIsXCJzbWFydHBob25lXCI6XCI8cmVjdCB4PVxcXCI1XFxcIiB5PVxcXCIyXFxcIiB3aWR0aD1cXFwiMTRcXFwiIGhlaWdodD1cXFwiMjBcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPlwiLFwic21pbGVcIjpcIjxjaXJjbGUgY3g9XFxcIjEyXFxcIiBjeT1cXFwiMTJcXFwiIHI9XFxcIjEwXFxcIj48L2NpcmNsZT48cGF0aCBkPVxcXCJNOCAxNHMxLjUgMiA0IDIgNC0yIDQtMlxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjkuMDFcXFwiIHkyPVxcXCI5XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE1XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjE1LjAxXFxcIiB5Mj1cXFwiOVxcXCI+PC9saW5lPlwiLFwic3BlYWtlclwiOlwiPHJlY3QgeD1cXFwiNFxcXCIgeT1cXFwiMlxcXCIgd2lkdGg9XFxcIjE2XFxcIiBoZWlnaHQ9XFxcIjIwXFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjE0XFxcIiByPVxcXCI0XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCI2XFxcIj48L2xpbmU+XCIsXCJzcXVhcmVcIjpcIjxyZWN0IHg9XFxcIjNcXFwiIHk9XFxcIjNcXFwiIHdpZHRoPVxcXCIxOFxcXCIgaGVpZ2h0PVxcXCIxOFxcXCIgcng9XFxcIjJcXFwiIHJ5PVxcXCIyXFxcIj48L3JlY3Q+XCIsXCJzdGFyXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcXFwiPjwvcG9seWdvbj5cIixcInN0b3AtY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PHJlY3QgeD1cXFwiOVxcXCIgeT1cXFwiOVxcXCIgd2lkdGg9XFxcIjZcXFwiIGhlaWdodD1cXFwiNlxcXCI+PC9yZWN0PlwiLFwic3VuXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCI1XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiMTJcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjQuMjJcXFwiIHkxPVxcXCI0LjIyXFxcIiB4Mj1cXFwiNS42NFxcXCIgeTI9XFxcIjUuNjRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTguMzZcXFwiIHkxPVxcXCIxOC4zNlxcXCIgeDI9XFxcIjE5Ljc4XFxcIiB5Mj1cXFwiMTkuNzhcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMTJcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjEyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjQuMjJcXFwiIHkxPVxcXCIxOS43OFxcXCIgeDI9XFxcIjUuNjRcXFwiIHkyPVxcXCIxOC4zNlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxOC4zNlxcXCIgeTE9XFxcIjUuNjRcXFwiIHgyPVxcXCIxOS43OFxcXCIgeTI9XFxcIjQuMjJcXFwiPjwvbGluZT5cIixcInN1bnJpc2VcIjpcIjxwYXRoIGQ9XFxcIk0xNyAxOGE1IDUgMCAwIDAtMTAgMFxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjJcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjlcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiNC4yMlxcXCIgeTE9XFxcIjEwLjIyXFxcIiB4Mj1cXFwiNS42NFxcXCIgeTI9XFxcIjExLjY0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxOFxcXCIgeDI9XFxcIjNcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyMVxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxOC4zNlxcXCIgeTE9XFxcIjExLjY0XFxcIiB4Mj1cXFwiMTkuNzhcXFwiIHkyPVxcXCIxMC4yMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIyM1xcXCIgeTE9XFxcIjIyXFxcIiB4Mj1cXFwiMVxcXCIgeTI9XFxcIjIyXFxcIj48L2xpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOCA2IDEyIDIgMTYgNlxcXCI+PC9wb2x5bGluZT5cIixcInN1bnNldFwiOlwiPHBhdGggZD1cXFwiTTE3IDE4YTUgNSAwIDAgMC0xMCAwXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjEyXFxcIiB5Mj1cXFwiMlxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI0LjIyXFxcIiB5MT1cXFwiMTAuMjJcXFwiIHgyPVxcXCI1LjY0XFxcIiB5Mj1cXFwiMTEuNjRcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiM1xcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMThcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjE4LjM2XFxcIiB5MT1cXFwiMTEuNjRcXFwiIHgyPVxcXCIxOS43OFxcXCIgeTI9XFxcIjEwLjIyXFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIzXFxcIiB5MT1cXFwiMjJcXFwiIHgyPVxcXCIxXFxcIiB5Mj1cXFwiMjJcXFwiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxNiA1IDEyIDkgOCA1XFxcIj48L3BvbHlsaW5lPlwiLFwidGFibGVcIjpcIjxwYXRoIGQ9XFxcIk05IDNINWEyIDIgMCAwIDAtMiAydjRtNi02aDEwYTIgMiAwIDAgMSAyIDJ2NE05IDN2MThtMCAwaDEwYTIgMiAwIDAgMCAyLTJWOU05IDIxSDVhMiAyIDAgMCAxLTItMlY5bTAgMGgxOFxcXCI+PC9wYXRoPlwiLFwidGFibGV0XCI6XCI8cmVjdCB4PVxcXCI0XFxcIiB5PVxcXCIyXFxcIiB3aWR0aD1cXFwiMTZcXFwiIGhlaWdodD1cXFwiMjBcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjE4XFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPlwiLFwidGFnXCI6XCI8cGF0aCBkPVxcXCJNMjAuNTkgMTMuNDFsLTcuMTcgNy4xN2EyIDIgMCAwIDEtMi44MyAwTDIgMTJWMmgxMGw4LjU5IDguNTlhMiAyIDAgMCAxIDAgMi44MnpcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiN1xcXCIgeTE9XFxcIjdcXFwiIHgyPVxcXCI3LjAxXFxcIiB5Mj1cXFwiN1xcXCI+PC9saW5lPlwiLFwidGFyZ2V0XCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiNlxcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiMlxcXCI+PC9jaXJjbGU+XCIsXCJ0ZXJtaW5hbFwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiNCAxNyAxMCAxMSA0IDVcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMTlcXFwiIHgyPVxcXCIyMFxcXCIgeTI9XFxcIjE5XFxcIj48L2xpbmU+XCIsXCJ0aGVybW9tZXRlclwiOlwiPHBhdGggZD1cXFwiTTE0IDE0Ljc2VjMuNWEyLjUgMi41IDAgMCAwLTUgMHYxMS4yNmE0LjUgNC41IDAgMSAwIDUgMHpcXFwiPjwvcGF0aD5cIixcInRodW1icy1kb3duXCI6XCI8cGF0aCBkPVxcXCJNMTAgMTV2NGEzIDMgMCAwIDAgMyAzbDQtOVYySDUuNzJhMiAyIDAgMCAwLTIgMS43bC0xLjM4IDlhMiAyIDAgMCAwIDIgMi4zem03LTEzaDIuNjdBMi4zMSAyLjMxIDAgMCAxIDIyIDR2N2EyLjMxIDIuMzEgMCAwIDEtMi4zMyAySDE3XFxcIj48L3BhdGg+XCIsXCJ0aHVtYnMtdXBcIjpcIjxwYXRoIGQ9XFxcIk0xNCA5VjVhMyAzIDAgMCAwLTMtM2wtNCA5djExaDExLjI4YTIgMiAwIDAgMCAyLTEuN2wxLjM4LTlhMiAyIDAgMCAwLTItMi4zek03IDIySDRhMiAyIDAgMCAxLTItMnYtN2EyIDIgMCAwIDEgMi0yaDNcXFwiPjwvcGF0aD5cIixcInRvZ2dsZS1sZWZ0XCI6XCI8cmVjdCB4PVxcXCIxXFxcIiB5PVxcXCI1XFxcIiB3aWR0aD1cXFwiMjJcXFwiIGhlaWdodD1cXFwiMTRcXFwiIHJ4PVxcXCI3XFxcIiByeT1cXFwiN1xcXCI+PC9yZWN0PjxjaXJjbGUgY3g9XFxcIjhcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+XCIsXCJ0b2dnbGUtcmlnaHRcIjpcIjxyZWN0IHg9XFxcIjFcXFwiIHk9XFxcIjVcXFwiIHdpZHRoPVxcXCIyMlxcXCIgaGVpZ2h0PVxcXCIxNFxcXCIgcng9XFxcIjdcXFwiIHJ5PVxcXCI3XFxcIj48L3JlY3Q+PGNpcmNsZSBjeD1cXFwiMTZcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiM1xcXCI+PC9jaXJjbGU+XCIsXCJ0b29sXCI6XCI8cGF0aCBkPVxcXCJNMTQuNyA2LjNhMSAxIDAgMCAwIDAgMS40bDEuNiAxLjZhMSAxIDAgMCAwIDEuNCAwbDMuNzctMy43N2E2IDYgMCAwIDEtNy45NCA3Ljk0bC02LjkxIDYuOTFhMi4xMiAyLjEyIDAgMCAxLTMtM2w2LjkxLTYuOTFhNiA2IDAgMCAxIDcuOTQtNy45NGwtMy43NiAzLjc2elxcXCI+PC9wYXRoPlwiLFwidHJhc2gtMlwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMyA2IDUgNiAyMSA2XFxcIj48L3BvbHlsaW5lPjxwYXRoIGQ9XFxcIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxMFxcXCIgeTE9XFxcIjExXFxcIiB4Mj1cXFwiMTBcXFwiIHkyPVxcXCIxN1xcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxNFxcXCIgeTE9XFxcIjExXFxcIiB4Mj1cXFwiMTRcXFwiIHkyPVxcXCIxN1xcXCI+PC9saW5lPlwiLFwidHJhc2hcIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjMgNiA1IDYgMjEgNlxcXCI+PC9wb2x5bGluZT48cGF0aCBkPVxcXCJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2bTMgMFY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjJcXFwiPjwvcGF0aD5cIixcInRyZWxsb1wiOlwiPHJlY3QgeD1cXFwiM1xcXCIgeT1cXFwiM1xcXCIgd2lkdGg9XFxcIjE4XFxcIiBoZWlnaHQ9XFxcIjE4XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48cmVjdCB4PVxcXCI3XFxcIiB5PVxcXCI3XFxcIiB3aWR0aD1cXFwiM1xcXCIgaGVpZ2h0PVxcXCI5XFxcIj48L3JlY3Q+PHJlY3QgeD1cXFwiMTRcXFwiIHk9XFxcIjdcXFwiIHdpZHRoPVxcXCIzXFxcIiBoZWlnaHQ9XFxcIjVcXFwiPjwvcmVjdD5cIixcInRyZW5kaW5nLWRvd25cIjpcIjxwb2x5bGluZSBwb2ludHM9XFxcIjIzIDE4IDEzLjUgOC41IDguNSAxMy41IDEgNlxcXCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVxcXCIxNyAxOCAyMyAxOCAyMyAxMlxcXCI+PC9wb2x5bGluZT5cIixcInRyZW5kaW5nLXVwXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIyMyA2IDEzLjUgMTUuNSA4LjUgMTAuNSAxIDE4XFxcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XFxcIjE3IDYgMjMgNiAyMyAxMlxcXCI+PC9wb2x5bGluZT5cIixcInRyaWFuZ2xlXCI6XCI8cGF0aCBkPVxcXCJNMTAuMjkgMy44NkwxLjgyIDE4YTIgMiAwIDAgMCAxLjcxIDNoMTYuOTRhMiAyIDAgMCAwIDEuNzEtM0wxMy43MSAzLjg2YTIgMiAwIDAgMC0zLjQyIDB6XFxcIj48L3BhdGg+XCIsXCJ0cnVja1wiOlwiPHJlY3QgeD1cXFwiMVxcXCIgeT1cXFwiM1xcXCIgd2lkdGg9XFxcIjE1XFxcIiBoZWlnaHQ9XFxcIjEzXFxcIj48L3JlY3Q+PHBvbHlnb24gcG9pbnRzPVxcXCIxNiA4IDIwIDggMjMgMTEgMjMgMTYgMTYgMTYgMTYgOFxcXCI+PC9wb2x5Z29uPjxjaXJjbGUgY3g9XFxcIjUuNVxcXCIgY3k9XFxcIjE4LjVcXFwiIHI9XFxcIjIuNVxcXCI+PC9jaXJjbGU+PGNpcmNsZSBjeD1cXFwiMTguNVxcXCIgY3k9XFxcIjE4LjVcXFwiIHI9XFxcIjIuNVxcXCI+PC9jaXJjbGU+XCIsXCJ0dlwiOlwiPHJlY3QgeD1cXFwiMlxcXCIgeT1cXFwiN1xcXCIgd2lkdGg9XFxcIjIwXFxcIiBoZWlnaHQ9XFxcIjE1XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48cG9seWxpbmUgcG9pbnRzPVxcXCIxNyAyIDEyIDcgNyAyXFxcIj48L3BvbHlsaW5lPlwiLFwidHdpdGNoXCI6XCI8cGF0aCBkPVxcXCJNMjEgMkgzdjE2aDV2NGw0LTRoNWw0LTRWMnptLTEwIDlWN201IDRWN1xcXCI+PC9wYXRoPlwiLFwidHdpdHRlclwiOlwiPHBhdGggZD1cXFwiTTIzIDNhMTAuOSAxMC45IDAgMCAxLTMuMTQgMS41MyA0LjQ4IDQuNDggMCAwIDAtNy44NiAzdjFBMTAuNjYgMTAuNjYgMCAwIDEgMyA0cy00IDkgNSAxM2ExMS42NCAxMS42NCAwIDAgMS03IDJjOSA1IDIwIDAgMjAtMTEuNWE0LjUgNC41IDAgMCAwLS4wOC0uODNBNy43MiA3LjcyIDAgMCAwIDIzIDN6XFxcIj48L3BhdGg+XCIsXCJ0eXBlXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCI0IDcgNCA0IDIwIDQgMjAgN1xcXCI+PC9wb2x5bGluZT48bGluZSB4MT1cXFwiOVxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiMTVcXFwiIHkyPVxcXCIyMFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjRcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjIwXFxcIj48L2xpbmU+XCIsXCJ1bWJyZWxsYVwiOlwiPHBhdGggZD1cXFwiTTIzIDEyYTExLjA1IDExLjA1IDAgMCAwLTIyIDB6bS01IDdhMyAzIDAgMCAxLTYgMHYtN1xcXCI+PC9wYXRoPlwiLFwidW5kZXJsaW5lXCI6XCI8cGF0aCBkPVxcXCJNNiAzdjdhNiA2IDAgMCAwIDYgNiA2IDYgMCAwIDAgNi02VjNcXFwiPjwvcGF0aD48bGluZSB4MT1cXFwiNFxcXCIgeTE9XFxcIjIxXFxcIiB4Mj1cXFwiMjBcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPlwiLFwidW5sb2NrXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIxMVxcXCIgd2lkdGg9XFxcIjE4XFxcIiBoZWlnaHQ9XFxcIjExXFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD48cGF0aCBkPVxcXCJNNyAxMVY3YTUgNSAwIDAgMSA5LjktMVxcXCI+PC9wYXRoPlwiLFwidXBsb2FkLWNsb3VkXCI6XCI8cG9seWxpbmUgcG9pbnRzPVxcXCIxNiAxNiAxMiAxMiA4IDE2XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjEyXFxcIiB4Mj1cXFwiMTJcXFwiIHkyPVxcXCIyMVxcXCI+PC9saW5lPjxwYXRoIGQ9XFxcIk0yMC4zOSAxOC4zOUE1IDUgMCAwIDAgMTggOWgtMS4yNkE4IDggMCAxIDAgMyAxNi4zXFxcIj48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTYgMTYgMTIgMTIgOCAxNlxcXCI+PC9wb2x5bGluZT5cIixcInVwbG9hZFwiOlwiPHBhdGggZD1cXFwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcXFwiPjwvcGF0aD48cG9seWxpbmUgcG9pbnRzPVxcXCIxNyA4IDEyIDMgNyA4XFxcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjNcXFwiIHgyPVxcXCIxMlxcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJ1c2VyLWNoZWNrXCI6XCI8cGF0aCBkPVxcXCJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MlxcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjguNVxcXCIgY3k9XFxcIjdcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9XFxcIjE3IDExIDE5IDEzIDIzIDlcXFwiPjwvcG9seWxpbmU+XCIsXCJ1c2VyLW1pbnVzXCI6XCI8cGF0aCBkPVxcXCJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MlxcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjguNVxcXCIgY3k9XFxcIjdcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCIyM1xcXCIgeTE9XFxcIjExXFxcIiB4Mj1cXFwiMTdcXFwiIHkyPVxcXCIxMVxcXCI+PC9saW5lPlwiLFwidXNlci1wbHVzXCI6XCI8cGF0aCBkPVxcXCJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MlxcXCI+PC9wYXRoPjxjaXJjbGUgY3g9XFxcIjguNVxcXCIgY3k9XFxcIjdcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPjxsaW5lIHgxPVxcXCIyMFxcXCIgeTE9XFxcIjhcXFwiIHgyPVxcXCIyMFxcXCIgeTI9XFxcIjE0XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjIzXFxcIiB5MT1cXFwiMTFcXFwiIHgyPVxcXCIxN1xcXCIgeTI9XFxcIjExXFxcIj48L2xpbmU+XCIsXCJ1c2VyLXhcIjpcIjxwYXRoIGQ9XFxcIk0xNiAyMXYtMmE0IDQgMCAwIDAtNC00SDVhNCA0IDAgMCAwLTQgNHYyXFxcIj48L3BhdGg+PGNpcmNsZSBjeD1cXFwiOC41XFxcIiBjeT1cXFwiN1xcXCIgcj1cXFwiNFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjE4XFxcIiB5MT1cXFwiOFxcXCIgeDI9XFxcIjIzXFxcIiB5Mj1cXFwiMTNcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMjNcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMThcXFwiIHkyPVxcXCIxM1xcXCI+PC9saW5lPlwiLFwidXNlclwiOlwiPHBhdGggZD1cXFwiTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djJcXFwiPjwvcGF0aD48Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjdcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPlwiLFwidXNlcnNcIjpcIjxwYXRoIGQ9XFxcIk0xNyAyMXYtMmE0IDQgMCAwIDAtNC00SDVhNCA0IDAgMCAwLTQgNHYyXFxcIj48L3BhdGg+PGNpcmNsZSBjeD1cXFwiOVxcXCIgY3k9XFxcIjdcXFwiIHI9XFxcIjRcXFwiPjwvY2lyY2xlPjxwYXRoIGQ9XFxcIk0yMyAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTE2IDMuMTNhNCA0IDAgMCAxIDAgNy43NVxcXCI+PC9wYXRoPlwiLFwidmlkZW8tb2ZmXCI6XCI8cGF0aCBkPVxcXCJNMTYgMTZ2MWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY3YTIgMiAwIDAgMSAyLTJoMm01LjY2IDBIMTRhMiAyIDAgMCAxIDIgMnYzLjM0bDEgMUwyMyA3djEwXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPlwiLFwidmlkZW9cIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMjMgNyAxNiAxMiAyMyAxNyAyMyA3XFxcIj48L3BvbHlnb24+PHJlY3QgeD1cXFwiMVxcXCIgeT1cXFwiNVxcXCIgd2lkdGg9XFxcIjE1XFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiByeD1cXFwiMlxcXCIgcnk9XFxcIjJcXFwiPjwvcmVjdD5cIixcInZvaWNlbWFpbFwiOlwiPGNpcmNsZSBjeD1cXFwiNS41XFxcIiBjeT1cXFwiMTEuNVxcXCIgcj1cXFwiNC41XFxcIj48L2NpcmNsZT48Y2lyY2xlIGN4PVxcXCIxOC41XFxcIiBjeT1cXFwiMTEuNVxcXCIgcj1cXFwiNC41XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiNS41XFxcIiB5MT1cXFwiMTZcXFwiIHgyPVxcXCIxOC41XFxcIiB5Mj1cXFwiMTZcXFwiPjwvbGluZT5cIixcInZvbHVtZS0xXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjExIDUgNiA5IDIgOSAyIDE1IDYgMTUgMTEgMTkgMTEgNVxcXCI+PC9wb2x5Z29uPjxwYXRoIGQ9XFxcIk0xNS41NCA4LjQ2YTUgNSAwIDAgMSAwIDcuMDdcXFwiPjwvcGF0aD5cIixcInZvbHVtZS0yXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjExIDUgNiA5IDIgOSAyIDE1IDYgMTUgMTEgMTkgMTEgNVxcXCI+PC9wb2x5Z29uPjxwYXRoIGQ9XFxcIk0xOS4wNyA0LjkzYTEwIDEwIDAgMCAxIDAgMTQuMTRNMTUuNTQgOC40NmE1IDUgMCAwIDEgMCA3LjA3XFxcIj48L3BhdGg+XCIsXCJ2b2x1bWUteFwiOlwiPHBvbHlnb24gcG9pbnRzPVxcXCIxMSA1IDYgOSAyIDkgMiAxNSA2IDE1IDExIDE5IDExIDVcXFwiPjwvcG9seWdvbj48bGluZSB4MT1cXFwiMjNcXFwiIHkxPVxcXCI5XFxcIiB4Mj1cXFwiMTdcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCIxN1xcXCIgeTE9XFxcIjlcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJ2b2x1bWVcIjpcIjxwb2x5Z29uIHBvaW50cz1cXFwiMTEgNSA2IDkgMiA5IDIgMTUgNiAxNSAxMSAxOSAxMSA1XFxcIj48L3BvbHlnb24+XCIsXCJ3YXRjaFwiOlwiPGNpcmNsZSBjeD1cXFwiMTJcXFwiIGN5PVxcXCIxMlxcXCIgcj1cXFwiN1xcXCI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTIgOSAxMiAxMiAxMy41IDEzLjVcXFwiPjwvcG9seWxpbmU+PHBhdGggZD1cXFwiTTE2LjUxIDE3LjM1bC0uMzUgMy44M2EyIDIgMCAwIDEtMiAxLjgySDkuODNhMiAyIDAgMCAxLTItMS44MmwtLjM1LTMuODNtLjAxLTEwLjdsLjM1LTMuODNBMiAyIDAgMCAxIDkuODMgMWg0LjM1YTIgMiAwIDAgMSAyIDEuODJsLjM1IDMuODNcXFwiPjwvcGF0aD5cIixcIndpZmktb2ZmXCI6XCI8bGluZSB4MT1cXFwiMVxcXCIgeTE9XFxcIjFcXFwiIHgyPVxcXCIyM1xcXCIgeTI9XFxcIjIzXFxcIj48L2xpbmU+PHBhdGggZD1cXFwiTTE2LjcyIDExLjA2QTEwLjk0IDEwLjk0IDAgMCAxIDE5IDEyLjU1XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTUgMTIuNTVhMTAuOTQgMTAuOTQgMCAwIDEgNS4xNy0yLjM5XFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTEwLjcxIDUuMDVBMTYgMTYgMCAwIDEgMjIuNTggOVxcXCI+PC9wYXRoPjxwYXRoIGQ9XFxcIk0xLjQyIDlhMTUuOTEgMTUuOTEgMCAwIDEgNC43LTIuODhcXFwiPjwvcGF0aD48cGF0aCBkPVxcXCJNOC41MyAxNi4xMWE2IDYgMCAwIDEgNi45NSAwXFxcIj48L3BhdGg+PGxpbmUgeDE9XFxcIjEyXFxcIiB5MT1cXFwiMjBcXFwiIHgyPVxcXCIxMi4wMVxcXCIgeTI9XFxcIjIwXFxcIj48L2xpbmU+XCIsXCJ3aWZpXCI6XCI8cGF0aCBkPVxcXCJNNSAxMi41NWExMSAxMSAwIDAgMSAxNC4wOCAwXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTEuNDIgOWExNiAxNiAwIDAgMSAyMS4xNiAwXFxcIj48L3BhdGg+PHBhdGggZD1cXFwiTTguNTMgMTYuMTFhNiA2IDAgMCAxIDYuOTUgMFxcXCI+PC9wYXRoPjxsaW5lIHgxPVxcXCIxMlxcXCIgeTE9XFxcIjIwXFxcIiB4Mj1cXFwiMTIuMDFcXFwiIHkyPVxcXCIyMFxcXCI+PC9saW5lPlwiLFwid2luZFwiOlwiPHBhdGggZD1cXFwiTTkuNTkgNC41OUEyIDIgMCAxIDEgMTEgOEgybTEwLjU5IDExLjQxQTIgMiAwIDEgMCAxNCAxNkgybTE1LjczLTguMjdBMi41IDIuNSAwIDEgMSAxOS41IDEySDJcXFwiPjwvcGF0aD5cIixcIngtY2lyY2xlXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMlxcXCIgY3k9XFxcIjEyXFxcIiByPVxcXCIxMFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjE1XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjlcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjE1XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT5cIixcIngtb2N0YWdvblwiOlwiPHBvbHlnb24gcG9pbnRzPVxcXCI3Ljg2IDIgMTYuMTQgMiAyMiA3Ljg2IDIyIDE2LjE0IDE2LjE0IDIyIDcuODYgMjIgMiAxNi4xNCAyIDcuODYgNy44NiAyXFxcIj48L3BvbHlnb24+PGxpbmUgeDE9XFxcIjE1XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjlcXFwiIHkyPVxcXCIxNVxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjE1XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT5cIixcIngtc3F1YXJlXCI6XCI8cmVjdCB4PVxcXCIzXFxcIiB5PVxcXCIzXFxcIiB3aWR0aD1cXFwiMThcXFwiIGhlaWdodD1cXFwiMThcXFwiIHJ4PVxcXCIyXFxcIiByeT1cXFwiMlxcXCI+PC9yZWN0PjxsaW5lIHgxPVxcXCI5XFxcIiB5MT1cXFwiOVxcXCIgeDI9XFxcIjE1XFxcIiB5Mj1cXFwiMTVcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTVcXFwiIHkxPVxcXCI5XFxcIiB4Mj1cXFwiOVxcXCIgeTI9XFxcIjE1XFxcIj48L2xpbmU+XCIsXCJ4XCI6XCI8bGluZSB4MT1cXFwiMThcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiNlxcXCIgeTI9XFxcIjE4XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjZcXFwiIHkxPVxcXCI2XFxcIiB4Mj1cXFwiMThcXFwiIHkyPVxcXCIxOFxcXCI+PC9saW5lPlwiLFwieW91dHViZVwiOlwiPHBhdGggZD1cXFwiTTIyLjU0IDYuNDJhMi43OCAyLjc4IDAgMCAwLTEuOTQtMkMxOC44OCA0IDEyIDQgMTIgNHMtNi44OCAwLTguNi40NmEyLjc4IDIuNzggMCAwIDAtMS45NCAyQTI5IDI5IDAgMCAwIDEgMTEuNzVhMjkgMjkgMCAwIDAgLjQ2IDUuMzNBMi43OCAyLjc4IDAgMCAwIDMuNCAxOWMxLjcyLjQ2IDguNi40NiA4LjYuNDZzNi44OCAwIDguNi0uNDZhMi43OCAyLjc4IDAgMCAwIDEuOTQtMiAyOSAyOSAwIDAgMCAuNDYtNS4yNSAyOSAyOSAwIDAgMC0uNDYtNS4zM3pcXFwiPjwvcGF0aD48cG9seWdvbiBwb2ludHM9XFxcIjkuNzUgMTUuMDIgMTUuNSAxMS43NSA5Ljc1IDguNDggOS43NSAxNS4wMlxcXCI+PC9wb2x5Z29uPlwiLFwiemFwLW9mZlwiOlwiPHBvbHlsaW5lIHBvaW50cz1cXFwiMTIuNDEgNi43NSAxMyAyIDEwLjU3IDQuOTJcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiMTguNTcgMTIuOTEgMjEgMTAgMTUuNjYgMTBcXFwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cXFwiOCA4IDMgMTQgMTIgMTQgMTEgMjIgMTYgMTZcXFwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XFxcIjFcXFwiIHkxPVxcXCIxXFxcIiB4Mj1cXFwiMjNcXFwiIHkyPVxcXCIyM1xcXCI+PC9saW5lPlwiLFwiemFwXCI6XCI8cG9seWdvbiBwb2ludHM9XFxcIjEzIDIgMyAxNCAxMiAxNCAxMSAyMiAyMSAxMCAxMiAxMCAxMyAyXFxcIj48L3BvbHlnb24+XCIsXCJ6b29tLWluXCI6XCI8Y2lyY2xlIGN4PVxcXCIxMVxcXCIgY3k9XFxcIjExXFxcIiByPVxcXCI4XFxcIj48L2NpcmNsZT48bGluZSB4MT1cXFwiMjFcXFwiIHkxPVxcXCIyMVxcXCIgeDI9XFxcIjE2LjY1XFxcIiB5Mj1cXFwiMTYuNjVcXFwiPjwvbGluZT48bGluZSB4MT1cXFwiMTFcXFwiIHkxPVxcXCI4XFxcIiB4Mj1cXFwiMTFcXFwiIHkyPVxcXCIxNFxcXCI+PC9saW5lPjxsaW5lIHgxPVxcXCI4XFxcIiB5MT1cXFwiMTFcXFwiIHgyPVxcXCIxNFxcXCIgeTI9XFxcIjExXFxcIj48L2xpbmU+XCIsXCJ6b29tLW91dFwiOlwiPGNpcmNsZSBjeD1cXFwiMTFcXFwiIGN5PVxcXCIxMVxcXCIgcj1cXFwiOFxcXCI+PC9jaXJjbGU+PGxpbmUgeDE9XFxcIjIxXFxcIiB5MT1cXFwiMjFcXFwiIHgyPVxcXCIxNi42NVxcXCIgeTI9XFxcIjE2LjY1XFxcIj48L2xpbmU+PGxpbmUgeDE9XFxcIjhcXFwiIHkxPVxcXCIxMVxcXCIgeDI9XFxcIjE0XFxcIiB5Mj1cXFwiMTFcXFwiPjwvbGluZT5cIn07XG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvZGVkdXBlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvZGVkdXBlLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXzsvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgY2xhc3NOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gZG9uJ3QgaW5oZXJpdCBmcm9tIE9iamVjdCBzbyB3ZSBjYW4gc2tpcCBoYXNPd25Qcm9wZXJ0eSBjaGVjayBsYXRlclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTU1MTgzMjgvY3JlYXRpbmctanMtb2JqZWN0LXdpdGgtb2JqZWN0LWNyZWF0ZW51bGwjYW5zd2VyLTIxMDc5MjMyXG5cdFx0ZnVuY3Rpb24gU3RvcmFnZU9iamVjdCgpIHt9XG5cdFx0U3RvcmFnZU9iamVjdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdFx0ZnVuY3Rpb24gX3BhcnNlQXJyYXkgKHJlc3VsdFNldCwgYXJyYXkpIHtcblx0XHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0X3BhcnNlKHJlc3VsdFNldCwgYXJyYXlbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRcdGZ1bmN0aW9uIF9wYXJzZU51bWJlciAocmVzdWx0U2V0LCBudW0pIHtcblx0XHRcdHJlc3VsdFNldFtudW1dID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfcGFyc2VPYmplY3QgKHJlc3VsdFNldCwgb2JqZWN0KSB7XG5cdFx0XHRmb3IgKHZhciBrIGluIG9iamVjdCkge1xuXHRcdFx0XHRpZiAoaGFzT3duLmNhbGwob2JqZWN0LCBrKSkge1xuXHRcdFx0XHRcdC8vIHNldCB2YWx1ZSB0byBmYWxzZSBpbnN0ZWFkIG9mIGRlbGV0aW5nIGl0IHRvIGF2b2lkIGNoYW5naW5nIG9iamVjdCBzdHJ1Y3R1cmVcblx0XHRcdFx0XHQvLyBodHRwczovL3d3dy5zbWFzaGluZ21hZ2F6aW5lLmNvbS8yMDEyLzExL3dyaXRpbmctZmFzdC1tZW1vcnktZWZmaWNpZW50LWphdmFzY3JpcHQvI2RlLXJlZmVyZW5jaW5nLW1pc2NvbmNlcHRpb25zXG5cdFx0XHRcdFx0cmVzdWx0U2V0W2tdID0gISFvYmplY3Rba107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgU1BBQ0UgPSAvXFxzKy87XG5cdFx0ZnVuY3Rpb24gX3BhcnNlU3RyaW5nIChyZXN1bHRTZXQsIHN0cikge1xuXHRcdFx0dmFyIGFycmF5ID0gc3RyLnNwbGl0KFNQQUNFKTtcblx0XHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0cmVzdWx0U2V0W2FycmF5W2ldXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX3BhcnNlIChyZXN1bHRTZXQsIGFyZykge1xuXHRcdFx0aWYgKCFhcmcpIHJldHVybjtcblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0Ly8gJ2ZvbyBiYXInXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0X3BhcnNlU3RyaW5nKHJlc3VsdFNldCwgYXJnKTtcblxuXHRcdFx0Ly8gWydmb28nLCAnYmFyJywgLi4uXVxuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0X3BhcnNlQXJyYXkocmVzdWx0U2V0LCBhcmcpO1xuXG5cdFx0XHQvLyB7ICdmb28nOiB0cnVlLCAuLi4gfVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRfcGFyc2VPYmplY3QocmVzdWx0U2V0LCBhcmcpO1xuXG5cdFx0XHQvLyAnMTMwJ1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRfcGFyc2VOdW1iZXIocmVzdWx0U2V0LCBhcmcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9jbGFzc05hbWVzICgpIHtcblx0XHRcdC8vIGRvbid0IGxlYWsgYXJndW1lbnRzXG5cdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL3dpa2kvT3B0aW1pemF0aW9uLWtpbGxlcnMjMzItbGVha2luZy1hcmd1bWVudHNcblx0XHRcdHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdFx0dmFyIGFyZ3MgPSBBcnJheShsZW4pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgY2xhc3NTZXQgPSBuZXcgU3RvcmFnZU9iamVjdCgpO1xuXHRcdFx0X3BhcnNlQXJyYXkoY2xhc3NTZXQsIGFyZ3MpO1xuXG5cdFx0XHR2YXIgbGlzdCA9IFtdO1xuXG5cdFx0XHRmb3IgKHZhciBrIGluIGNsYXNzU2V0KSB7XG5cdFx0XHRcdGlmIChjbGFzc1NldFtrXSkge1xuXHRcdFx0XHRcdGxpc3QucHVzaChrKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsaXN0LmpvaW4oJyAnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gX2NsYXNzTmFtZXM7XG5cdH0pKCk7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHRydWUpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0IShfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fID0gW10sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pLmFwcGx5KGV4cG9ydHMsIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18pLFxuXHRcdFx0XHRfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyAhPT0gdW5kZWZpbmVkICYmIChtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fKSk7XG5cdH0gZWxzZSB7fVxufSgpKTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzL2FycmF5L2Zyb20uanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvZXMvYXJyYXkvZnJvbS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vLi4vbW9kdWxlcy9lcy5zdHJpbmcuaXRlcmF0b3IgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLml0ZXJhdG9yLmpzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vLi4vbW9kdWxlcy9lcy5hcnJheS5mcm9tICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmZyb20uanNcIik7XG52YXIgcGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uLy4uL2ludGVybmFscy9wYXRoICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXRoLkFycmF5LmZyb207XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1mdW5jdGlvbi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtZnVuY3Rpb24uanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgaXNPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihTdHJpbmcoaXQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1mcm9tLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZnJvbS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgYmluZCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9iaW5kLWNvbnRleHQgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9iaW5kLWNvbnRleHQuanNcIik7XG52YXIgdG9PYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdG8tb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tb2JqZWN0LmpzXCIpO1xudmFyIGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvY2FsbC13aXRoLXNhZmUtaXRlcmF0aW9uLWNsb3NpbmcgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jYWxsLXdpdGgtc2FmZS1pdGVyYXRpb24tY2xvc2luZy5qc1wiKTtcbnZhciBpc0FycmF5SXRlcmF0b3JNZXRob2QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtYXJyYXktaXRlcmF0b3ItbWV0aG9kICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtYXJyYXktaXRlcmF0b3ItbWV0aG9kLmpzXCIpO1xudmFyIHRvTGVuZ3RoID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWxlbmd0aC5qc1wiKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkuanNcIik7XG52YXIgZ2V0SXRlcmF0b3JNZXRob2QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZ2V0LWl0ZXJhdG9yLW1ldGhvZCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QuanNcIik7XG5cbi8vIGBBcnJheS5mcm9tYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LmZyb21cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgdmFyIGFyZ3VtZW50c0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBtYXBmbiA9IGFyZ3VtZW50c0xlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gZ2V0SXRlcmF0b3JNZXRob2QoTyk7XG4gIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gIGlmIChtYXBwaW5nKSBtYXBmbiA9IGJpbmQobWFwZm4sIGFyZ3VtZW50c0xlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAvLyBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBpdGVyYWJsZSBvciBpdCdzIGFuIGFycmF5IHdpdGggdGhlIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2UgYSBzaW1wbGUgY2FzZVxuICBpZiAoaXRlcmF0b3JNZXRob2QgIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcmF0b3JNZXRob2QoaXRlcmF0b3JNZXRob2QpKSkge1xuICAgIGl0ZXJhdG9yID0gaXRlcmF0b3JNZXRob2QuY2FsbChPKTtcbiAgICByZXN1bHQgPSBuZXcgQygpO1xuICAgIGZvciAoOyEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZ1xuICAgICAgICA/IGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKVxuICAgICAgICA6IHN0ZXAudmFsdWVcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICByZXN1bHQgPSBuZXcgQyhsZW5ndGgpO1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICB9XG4gIH1cbiAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgdG9JbmRleGVkT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanNcIik7XG52YXIgdG9MZW5ndGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzXCIpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4LmpzXCIpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgaW5kZXhPZiwgaW5jbHVkZXMgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxuLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2JpbmQtY29udGV4dC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYmluZC1jb250ZXh0LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgYUZ1bmN0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2EtZnVuY3Rpb24gKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLWZ1bmN0aW9uLmpzXCIpO1xuXG4vLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQpO1xuICAgIH07XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBhbk9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9hbi1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1vYmplY3QuanNcIik7XG5cbi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3Jcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIEVOVFJJRVMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRU5UUklFUyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHZhciByZXR1cm5NZXRob2QgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldHVybk1ldGhvZCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXR1cm5NZXRob2QuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NoZWNrLWNvcnJlY3RuZXNzLW9mLWl0ZXJhdGlvbi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2hlY2stY29ycmVjdG5lc3Mtb2YtaXRlcmF0aW9uLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgd2VsbEtub3duU3ltYm9sID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanNcIik7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIGNhbGxlZCA9IDA7XG4gIHZhciBpdGVyYXRvcldpdGhSZXR1cm4gPSB7XG4gICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogISFjYWxsZWQrKyB9O1xuICAgIH0sXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uICgpIHtcbiAgICAgIFNBRkVfQ0xPU0lORyA9IHRydWU7XG4gICAgfVxuICB9O1xuICBpdGVyYXRvcldpdGhSZXR1cm5bSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKGl0ZXJhdG9yV2l0aFJldHVybiwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgU0tJUF9DTE9TSU5HKSB7XG4gIGlmICghU0tJUF9DTE9TSU5HICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIElURVJBVElPTl9TVVBQT1JUID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIG9iamVjdFtJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogSVRFUkFUSU9OX1NVUFBPUlQgPSB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBleGVjKG9iamVjdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIElURVJBVElPTl9TVVBQT1JUO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgY2xhc3NvZlJhdyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jbGFzc29mLXJhdyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YtcmF3LmpzXCIpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzXCIpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQ09SUkVDVF9BUkdVTUVOVFMgPSBjbGFzc29mUmF3KGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG4vLyBnZXR0aW5nIHRhZyBmcm9tIEVTNisgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgdGFnLCByZXN1bHQ7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mICh0YWcgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRPX1NUUklOR19UQUcpKSA9PSAnc3RyaW5nJyA/IHRhZ1xuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQ09SUkVDVF9BUkdVTUVOVFMgPyBjbGFzc29mUmF3KE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKHJlc3VsdCA9IGNsYXNzb2ZSYXcoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgaGFzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hhcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiKTtcbnZhciBvd25LZXlzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL293bi1rZXlzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3duLWtleXMuanNcIik7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzXCIpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhcyh0YXJnZXQsIGtleSkpIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgfVxufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXIuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcnJlY3QtcHJvdG90eXBlLWdldHRlci5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGZhaWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2ZhaWxzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICBGLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG51bGw7XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IEYoKSkgIT09IEYucHJvdG90eXBlO1xufSk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLWl0ZXJhdG9yLWNvbnN0cnVjdG9yLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtaXRlcmF0b3ItY29uc3RydWN0b3IuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvcnMtY29yZS5qc1wiKS5JdGVyYXRvclByb3RvdHlwZTtcbnZhciBjcmVhdGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1jcmVhdGUuanNcIik7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcIik7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvc2V0LXRvLXN0cmluZy10YWcgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtdG8tc3RyaW5nLXRhZy5qc1wiKTtcbnZhciBJdGVyYXRvcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXRlcmF0b3JzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzXCIpO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEl0ZXJhdG9yQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgdmFyIFRPX1NUUklOR19UQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIEl0ZXJhdG9yQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JDb25zdHJ1Y3RvciwgVE9fU1RSSU5HX1RBRywgZmFsc2UsIHRydWUpO1xuICBJdGVyYXRvcnNbVE9fU1RSSU5HX1RBR10gPSByZXR1cm5UaGlzO1xuICByZXR1cm4gSXRlcmF0b3JDb25zdHJ1Y3Rvcjtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0b1ByaW1pdGl2ZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1wcmltaXRpdmUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanNcIik7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanNcIik7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgcHJvcGVydHlLZXkgPSB0b1ByaW1pdGl2ZShrZXkpO1xuICBpZiAocHJvcGVydHlLZXkgaW4gb2JqZWN0KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKG9iamVjdCwgcHJvcGVydHlLZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtwcm9wZXJ0eUtleV0gPSB2YWx1ZTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVmaW5lLWl0ZXJhdG9yLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZWZpbmUtaXRlcmF0b3IuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgJCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9leHBvcnQgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9leHBvcnQuanNcIik7XG52YXIgY3JlYXRlSXRlcmF0b3JDb25zdHJ1Y3RvciA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jcmVhdGUtaXRlcmF0b3ItY29uc3RydWN0b3IgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtaXRlcmF0b3ItY29uc3RydWN0b3IuanNcIik7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LXByb3RvdHlwZS1vZi5qc1wiKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZiAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzXCIpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LXRvLXN0cmluZy10YWcuanNcIik7XG52YXIgaGlkZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oaWRlICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZS5qc1wiKTtcbnZhciByZWRlZmluZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9yZWRlZmluZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZGVmaW5lLmpzXCIpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzXCIpO1xudmFyIElTX1BVUkUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtcHVyZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanNcIik7XG52YXIgSXRlcmF0b3JzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9ycy5qc1wiKTtcbnZhciBJdGVyYXRvcnNDb3JlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUuanNcIik7XG5cbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IEl0ZXJhdG9yc0NvcmUuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyA9IEl0ZXJhdG9yc0NvcmUuQlVHR1lfU0FGQVJJX0lURVJBVE9SUztcbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xudmFyIEVOVFJJRVMgPSAnZW50cmllcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSXRlcmFibGUsIE5BTUUsIEl0ZXJhdG9yQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gIGNyZWF0ZUl0ZXJhdG9yQ29uc3RydWN0b3IoSXRlcmF0b3JDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG5cbiAgdmFyIGdldEl0ZXJhdGlvbk1ldGhvZCA9IGZ1bmN0aW9uIChLSU5EKSB7XG4gICAgaWYgKEtJTkQgPT09IERFRkFVTFQgJiYgZGVmYXVsdEl0ZXJhdG9yKSByZXR1cm4gZGVmYXVsdEl0ZXJhdG9yO1xuICAgIGlmICghQlVHR1lfU0FGQVJJX0lURVJBVE9SUyAmJiBLSU5EIGluIEl0ZXJhYmxlUHJvdG90eXBlKSByZXR1cm4gSXRlcmFibGVQcm90b3R5cGVbS0lORF07XG4gICAgc3dpdGNoIChLSU5EKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgICAgY2FzZSBFTlRSSUVTOiByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMpOyB9O1xuICB9O1xuXG4gIHZhciBUT19TVFJJTkdfVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgSU5DT1JSRUNUX1ZBTFVFU19OQU1FID0gZmFsc2U7XG4gIHZhciBJdGVyYWJsZVByb3RvdHlwZSA9IEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgdmFyIG5hdGl2ZUl0ZXJhdG9yID0gSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JdXG4gICAgfHwgSXRlcmFibGVQcm90b3R5cGVbJ0BAaXRlcmF0b3InXVxuICAgIHx8IERFRkFVTFQgJiYgSXRlcmFibGVQcm90b3R5cGVbREVGQVVMVF07XG4gIHZhciBkZWZhdWx0SXRlcmF0b3IgPSAhQlVHR1lfU0FGQVJJX0lURVJBVE9SUyAmJiBuYXRpdmVJdGVyYXRvciB8fCBnZXRJdGVyYXRpb25NZXRob2QoREVGQVVMVCk7XG4gIHZhciBhbnlOYXRpdmVJdGVyYXRvciA9IE5BTUUgPT0gJ0FycmF5JyA/IEl0ZXJhYmxlUHJvdG90eXBlLmVudHJpZXMgfHwgbmF0aXZlSXRlcmF0b3IgOiBuYXRpdmVJdGVyYXRvcjtcbiAgdmFyIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgbWV0aG9kcywgS0VZO1xuXG4gIC8vIGZpeCBuYXRpdmVcbiAgaWYgKGFueU5hdGl2ZUl0ZXJhdG9yKSB7XG4gICAgQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoYW55TmF0aXZlSXRlcmF0b3IuY2FsbChuZXcgSXRlcmFibGUoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgaWYgKCFJU19QVVJFICYmIGdldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSkgIT09IEl0ZXJhdG9yUHJvdG90eXBlKSB7XG4gICAgICAgIGlmIChzZXRQcm90b3R5cGVPZikge1xuICAgICAgICAgIHNldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgSXRlcmF0b3JQcm90b3R5cGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBoaWRlKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUsIFRPX1NUUklOR19UQUcsIHRydWUsIHRydWUpO1xuICAgICAgaWYgKElTX1BVUkUpIEl0ZXJhdG9yc1tUT19TVFJJTkdfVEFHXSA9IHJldHVyblRoaXM7XG4gICAgfVxuICB9XG5cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGQVVMVCA9PSBWQUxVRVMgJiYgbmF0aXZlSXRlcmF0b3IgJiYgbmF0aXZlSXRlcmF0b3IubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgSU5DT1JSRUNUX1ZBTFVFU19OQU1FID0gdHJ1ZTtcbiAgICBkZWZhdWx0SXRlcmF0b3IgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuYXRpdmVJdGVyYXRvci5jYWxsKHRoaXMpOyB9O1xuICB9XG5cbiAgLy8gZGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUlTX1BVUkUgfHwgRk9SQ0VEKSAmJiBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUl0gIT09IGRlZmF1bHRJdGVyYXRvcikge1xuICAgIGhpZGUoSXRlcmFibGVQcm90b3R5cGUsIElURVJBVE9SLCBkZWZhdWx0SXRlcmF0b3IpO1xuICB9XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IGRlZmF1bHRJdGVyYXRvcjtcblxuICAvLyBleHBvcnQgYWRkaXRpb25hbCBtZXRob2RzXG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogZ2V0SXRlcmF0aW9uTWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyBkZWZhdWx0SXRlcmF0b3IgOiBnZXRJdGVyYXRpb25NZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiBnZXRJdGVyYXRpb25NZXRob2QoRU5UUklFUylcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoS0VZIGluIG1ldGhvZHMpIHtcbiAgICAgIGlmIChCVUdHWV9TQUZBUklfSVRFUkFUT1JTIHx8IElOQ09SUkVDVF9WQUxVRVNfTkFNRSB8fCAhKEtFWSBpbiBJdGVyYWJsZVByb3RvdHlwZSkpIHtcbiAgICAgICAgcmVkZWZpbmUoSXRlcmFibGVQcm90b3R5cGUsIEtFWSwgbWV0aG9kc1tLRVldKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgJCh7IHRhcmdldDogTkFNRSwgcHJvdG86IHRydWUsIGZvcmNlZDogQlVHR1lfU0FGQVJJX0lURVJBVE9SUyB8fCBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgfSwgbWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gbWV0aG9kcztcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGZhaWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2ZhaWxzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanNcIik7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgZ2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2dsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qc1wiKTtcbnZhciBpc09iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9pcy1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1vYmplY3QuanNcIik7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGV4aXN0ID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gZXhpc3QgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2V4cG9ydC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgZ2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2dsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qc1wiKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvciAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcIikuZjtcbnZhciBoaWRlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hpZGUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRlLmpzXCIpO1xudmFyIHJlZGVmaW5lID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3JlZGVmaW5lICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanNcIik7XG52YXIgc2V0R2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtZ2xvYmFsLmpzXCIpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzLmpzXCIpO1xudmFyIGlzRm9yY2VkID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWZvcmNlZC5qc1wiKTtcblxuLypcbiAgb3B0aW9ucy50YXJnZXQgICAgICAtIG5hbWUgb2YgdGhlIHRhcmdldCBvYmplY3RcbiAgb3B0aW9ucy5nbG9iYWwgICAgICAtIHRhcmdldCBpcyB0aGUgZ2xvYmFsIG9iamVjdFxuICBvcHRpb25zLnN0YXQgICAgICAgIC0gZXhwb3J0IGFzIHN0YXRpYyBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnByb3RvICAgICAgIC0gZXhwb3J0IGFzIHByb3RvdHlwZSBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnJlYWwgICAgICAgIC0gcmVhbCBwcm90b3R5cGUgbWV0aG9kIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy5mb3JjZWQgICAgICAtIGV4cG9ydCBldmVuIGlmIHRoZSBuYXRpdmUgZmVhdHVyZSBpcyBhdmFpbGFibGVcbiAgb3B0aW9ucy5iaW5kICAgICAgICAtIGJpbmQgbWV0aG9kcyB0byB0aGUgdGFyZ2V0LCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMud3JhcCAgICAgICAgLSB3cmFwIGNvbnN0cnVjdG9ycyB0byBwcmV2ZW50aW5nIGdsb2JhbCBwb2xsdXRpb24sIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy51bnNhZmUgICAgICAtIHVzZSB0aGUgc2ltcGxlIGFzc2lnbm1lbnQgb2YgcHJvcGVydHkgaW5zdGVhZCBvZiBkZWxldGUgKyBkZWZpbmVQcm9wZXJ0eVxuICBvcHRpb25zLnNoYW0gICAgICAgIC0gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICBvcHRpb25zLmVudW1lcmFibGUgIC0gZXhwb3J0IGFzIGVudW1lcmFibGUgcHJvcGVydHlcbiAgb3B0aW9ucy5ub1RhcmdldEdldCAtIHByZXZlbnQgY2FsbGluZyBhIGdldHRlciBvbiB0YXJnZXRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcbiAgdmFyIFRBUkdFVCA9IG9wdGlvbnMudGFyZ2V0O1xuICB2YXIgR0xPQkFMID0gb3B0aW9ucy5nbG9iYWw7XG4gIHZhciBTVEFUSUMgPSBvcHRpb25zLnN0YXQ7XG4gIHZhciBGT1JDRUQsIHRhcmdldCwga2V5LCB0YXJnZXRQcm9wZXJ0eSwgc291cmNlUHJvcGVydHksIGRlc2NyaXB0b3I7XG4gIGlmIChHTE9CQUwpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAoU1RBVElDKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsW1RBUkdFVF0gfHwgc2V0R2xvYmFsKFRBUkdFVCwge30pO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IChnbG9iYWxbVEFSR0VUXSB8fCB7fSkucHJvdG90eXBlO1xuICB9XG4gIGlmICh0YXJnZXQpIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIHNvdXJjZVByb3BlcnR5ID0gc291cmNlW2tleV07XG4gICAgaWYgKG9wdGlvbnMubm9UYXJnZXRHZXQpIHtcbiAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgdGFyZ2V0UHJvcGVydHkgPSBkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfSBlbHNlIHRhcmdldFByb3BlcnR5ID0gdGFyZ2V0W2tleV07XG4gICAgRk9SQ0VEID0gaXNGb3JjZWQoR0xPQkFMID8ga2V5IDogVEFSR0VUICsgKFNUQVRJQyA/ICcuJyA6ICcjJykgKyBrZXksIG9wdGlvbnMuZm9yY2VkKTtcbiAgICAvLyBjb250YWluZWQgaW4gdGFyZ2V0XG4gICAgaWYgKCFGT1JDRUQgJiYgdGFyZ2V0UHJvcGVydHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzb3VyY2VQcm9wZXJ0eSA9PT0gdHlwZW9mIHRhcmdldFByb3BlcnR5KSBjb250aW51ZTtcbiAgICAgIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoc291cmNlUHJvcGVydHksIHRhcmdldFByb3BlcnR5KTtcbiAgICB9XG4gICAgLy8gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICAgIGlmIChvcHRpb25zLnNoYW0gfHwgKHRhcmdldFByb3BlcnR5ICYmIHRhcmdldFByb3BlcnR5LnNoYW0pKSB7XG4gICAgICBoaWRlKHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLXRvLXN0cmluZy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZnVuY3Rpb24tdG8tc3RyaW5nLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgc2hhcmVkID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NoYXJlZCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzaGFyZWQoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgY2xhc3NvZiA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jbGFzc29mICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qc1wiKTtcbnZhciBJdGVyYXRvcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXRlcmF0b3JzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzXCIpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzXCIpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihnbG9iYWwpIHt2YXIgTyA9ICdvYmplY3QnO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gTyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09IE8gJiYgd2luZG93KSB8fFxuICBjaGVjayh0eXBlb2Ygc2VsZiA9PSBPICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gTyAmJiBnbG9iYWwpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwodGhpcywgX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi8uLi8uLi93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzICovIFwiLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1wiKSkpXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZGVuLWtleXMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZGVuLWtleXMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBERVNDUklQVE9SUyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9kZXNjcmlwdG9ycyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Rlc2NyaXB0b3JzLmpzXCIpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzXCIpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvciAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHlNb2R1bGUuZihvYmplY3QsIGtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9odG1sLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBnbG9iYWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZ2xvYmFsICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzXCIpO1xuXG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBERVNDUklQVE9SUyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9kZXNjcmlwdG9ycyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Rlc2NyaXB0b3JzLmpzXCIpO1xudmFyIGZhaWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2ZhaWxzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanNcIik7XG52YXIgY3JlYXRlRWxlbWVudCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzXCIpO1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFERVNDUklQVE9SUyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH1cbiAgfSkuYSAhPSA3O1xufSk7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBmYWlscyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9mYWlscyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ZhaWxzLmpzXCIpO1xudmFyIGNsYXNzb2YgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qc1wiKTtcblxudmFyIHNwbGl0ID0gJycuc3BsaXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgcmV0dXJuICFPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mKGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0LmNhbGwoaXQsICcnKSA6IE9iamVjdChpdCk7XG59IDogT2JqZWN0O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBOQVRJVkVfV0VBS19NQVAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwLmpzXCIpO1xudmFyIGdsb2JhbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9nbG9iYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanNcIik7XG52YXIgaXNPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzXCIpO1xudmFyIGhpZGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaGlkZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGUuanNcIik7XG52YXIgb2JqZWN0SGFzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hhcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiKTtcbnZhciBzaGFyZWRLZXkgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvc2hhcmVkLWtleSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1rZXkuanNcIik7XG52YXIgaGlkZGVuS2V5cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oaWRkZW4ta2V5cyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGRlbi1rZXlzLmpzXCIpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXM7XG5cbnZhciBlbmZvcmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBoYXMoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCkge1xuICB2YXIgc3RvcmUgPSBuZXcgV2Vha01hcCgpO1xuICB2YXIgd21nZXQgPSBzdG9yZS5nZXQ7XG4gIHZhciB3bWhhcyA9IHN0b3JlLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgd21zZXQuY2FsbChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldC5jYWxsKHN0b3JlLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlLCBpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGhpZGUoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gb2JqZWN0SGFzKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIG9iamVjdEhhcyhpdCwgU1RBVEUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyxcbiAgZW5mb3JjZTogZW5mb3JjZSxcbiAgZ2V0dGVyRm9yOiBnZXR0ZXJGb3Jcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtYXJyYXktaXRlcmF0b3ItbWV0aG9kLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1hcnJheS1pdGVyYXRvci1tZXRob2QuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciB3ZWxsS25vd25TeW1ib2wgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qc1wiKTtcbnZhciBJdGVyYXRvcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXRlcmF0b3JzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzXCIpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGU7XG5cbi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3Jcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG90eXBlW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWZvcmNlZC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGZhaWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2ZhaWxzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanNcIik7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1vYmplY3QuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1wdXJlLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvcnMtY29yZS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvcnMtY29yZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGdldFByb3RvdHlwZU9mID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YuanNcIik7XG52YXIgaGlkZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oaWRlICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZS5qc1wiKTtcbnZhciBoYXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaGFzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLmpzXCIpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzXCIpO1xudmFyIElTX1BVUkUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtcHVyZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanNcIik7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBCVUdHWV9TQUZBUklfSVRFUkFUT1JTID0gZmFsc2U7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxuLy8gYCVJdGVyYXRvclByb3RvdHlwZSVgIG9iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtJWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3RcbnZhciBJdGVyYXRvclByb3RvdHlwZSwgUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlLCBhcnJheUl0ZXJhdG9yO1xuXG5pZiAoW10ua2V5cykge1xuICBhcnJheUl0ZXJhdG9yID0gW10ua2V5cygpO1xuICAvLyBTYWZhcmkgOCBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgaWYgKCEoJ25leHQnIGluIGFycmF5SXRlcmF0b3IpKSBCVUdHWV9TQUZBUklfSVRFUkFUT1JTID0gdHJ1ZTtcbiAgZWxzZSB7XG4gICAgUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoZ2V0UHJvdG90eXBlT2YoYXJyYXlJdGVyYXRvcikpO1xuICAgIGlmIChQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpIEl0ZXJhdG9yUHJvdG90eXBlID0gUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG59XG5cbmlmIChJdGVyYXRvclByb3RvdHlwZSA9PSB1bmRlZmluZWQpIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5pZiAoIUlTX1BVUkUgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJdGVyYXRvclByb3RvdHlwZTogSXRlcmF0b3JQcm90b3R5cGUsXG4gIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlM6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlNcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvcnMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0ge307XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgZmFpbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZmFpbHMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ2hyb21lIDM4IFN5bWJvbCBoYXMgaW5jb3JyZWN0IHRvU3RyaW5nIGNvbnZlcnNpb25cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHJldHVybiAhU3RyaW5nKFN5bWJvbCgpKTtcbn0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgZ2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2dsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qc1wiKTtcbnZhciBuYXRpdmVGdW5jdGlvblRvU3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXRvLXN0cmluZyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLXRvLXN0cmluZy5qc1wiKTtcblxudmFyIFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyAmJiAvbmF0aXZlIGNvZGUvLnRlc3QobmF0aXZlRnVuY3Rpb25Ub1N0cmluZy5jYWxsKFdlYWtNYXApKTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtY3JlYXRlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBhbk9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9hbi1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1vYmplY3QuanNcIik7XG52YXIgZGVmaW5lUHJvcGVydGllcyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanNcIik7XG52YXIgZW51bUJ1Z0tleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VudW0tYnVnLWtleXMuanNcIik7XG52YXIgaGlkZGVuS2V5cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oaWRkZW4ta2V5cyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGRlbi1rZXlzLmpzXCIpO1xudmFyIGh0bWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaHRtbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2h0bWwuanNcIik7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQuanNcIik7XG52YXIgc2hhcmVkS2V5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzXCIpO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIGxlbmd0aCA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgc2NyaXB0ID0gJ3NjcmlwdCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGpzID0gJ2phdmEnICsgc2NyaXB0ICsgJzonO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoanMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgc2NyaXB0ICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnLycgKyBzY3JpcHQgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAobGVuZ3RoLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbbGVuZ3RoXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0aWVzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBERVNDUklQVE9SUyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9kZXNjcmlwdG9ycyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Rlc2NyaXB0b3JzLmpzXCIpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzXCIpO1xudmFyIGFuT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2FuLW9iamVjdCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qc1wiKTtcbnZhciBvYmplY3RLZXlzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYoTywga2V5ID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW2tleV0pO1xuICByZXR1cm4gTztcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgREVTQ1JJUFRPUlMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZXNjcmlwdG9ycy5qc1wiKTtcbnZhciBJRThfRE9NX0RFRklORSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzXCIpO1xudmFyIGFuT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2FuLW9iamVjdCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qc1wiKTtcbnZhciB0b1ByaW1pdGl2ZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1wcmltaXRpdmUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanNcIik7XG5cbnZhciBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIERFU0NSSVBUT1JTID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanNcIik7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qc1wiKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qc1wiKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdC5qc1wiKTtcbnZhciB0b1ByaW1pdGl2ZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1wcmltaXRpdmUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanNcIik7XG52YXIgaGFzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hhcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiKTtcbnZhciBJRThfRE9NX0RFRklORSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzXCIpO1xuXG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXMoTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIXByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciBpbnRlcm5hbE9iamVjdEtleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbC5qc1wiKTtcbnZhciBlbnVtQnVnS2V5cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qc1wiKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LXByb3RvdHlwZS1vZi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LXByb3RvdHlwZS1vZi5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgaGFzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hhcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiKTtcbnZhciB0b09iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1vYmplY3QuanNcIik7XG52YXIgc2hhcmVkS2V5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXkgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzXCIpO1xudmFyIENPUlJFQ1RfUFJPVE9UWVBFX0dFVFRFUiA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXIgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXIuanNcIik7XG5cbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxubW9kdWxlLmV4cG9ydHMgPSBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG90eXBlIDogbnVsbDtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGhhcyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oYXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMuanNcIik7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanNcIik7XG52YXIgYXJyYXlJbmNsdWRlcyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzLmpzXCIpO1xudmFyIGhpZGRlbktleXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qc1wiKTtcblxudmFyIGFycmF5SW5kZXhPZiA9IGFycmF5SW5jbHVkZXMoZmFsc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzKGhpZGRlbktleXMsIGtleSkgJiYgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGludGVybmFsT2JqZWN0S2V5cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsLmpzXCIpO1xudmFyIGVudW1CdWdLZXlzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzLmpzXCIpO1xuXG4vLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gTmFzaG9ybiB+IEpESzggYnVnXG52YXIgTkFTSE9STl9CVUcgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgIW5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAxOiAyIH0sIDEpO1xuXG5leHBvcnRzLmYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6IG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciB2YWxpZGF0ZVNldFByb3RvdHlwZU9mQXJndW1lbnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3ZhbGlkYXRlLXNldC1wcm90b3R5cGUtb2YtYXJndW1lbnRzICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdmFsaWRhdGUtc2V0LXByb3RvdHlwZS1vZi1hcmd1bWVudHMuanNcIik7XG5cbi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvcnJlY3RTZXR0ZXIgPSBmYWxzZTtcbiAgdmFyIHRlc3QgPSB7fTtcbiAgdmFyIHNldHRlcjtcbiAgdHJ5IHtcbiAgICBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgc2V0dGVyLmNhbGwodGVzdCwgW10pO1xuICAgIGNvcnJlY3RTZXR0ZXIgPSB0ZXN0IGluc3RhbmNlb2YgQXJyYXk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgdmFsaWRhdGVTZXRQcm90b3R5cGVPZkFyZ3VtZW50cyhPLCBwcm90byk7XG4gICAgaWYgKGNvcnJlY3RTZXR0ZXIpIHNldHRlci5jYWxsKE8sIHByb3RvKTtcbiAgICBlbHNlIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgcmV0dXJuIE87XG4gIH07XG59KCkgOiB1bmRlZmluZWQpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBnbG9iYWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZ2xvYmFsICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzXCIpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qc1wiKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanNcIik7XG52YXIgYW5PYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvYW4tb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzXCIpO1xuXG52YXIgUmVmbGVjdCA9IGdsb2JhbC5SZWZsZWN0O1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG5tb2R1bGUuZXhwb3J0cyA9IFJlZmxlY3QgJiYgUmVmbGVjdC5vd25LZXlzIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSkgOiBrZXlzO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9wYXRoLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2dsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qc1wiKTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWRlZmluZS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWRlZmluZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgZ2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2dsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qc1wiKTtcbnZhciBzaGFyZWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvc2hhcmVkICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzXCIpO1xudmFyIGhpZGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaGlkZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGUuanNcIik7XG52YXIgaGFzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2hhcyAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qc1wiKTtcbnZhciBzZXRHbG9iYWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC1nbG9iYWwuanNcIik7XG52YXIgbmF0aXZlRnVuY3Rpb25Ub1N0cmluZyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9mdW5jdGlvbi10by1zdHJpbmcgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi10by1zdHJpbmcuanNcIik7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzXCIpO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKG5hdGl2ZUZ1bmN0aW9uVG9TdHJpbmcpLnNwbGl0KCd0b1N0cmluZycpO1xuXG5zaGFyZWQoJ2luc3BlY3RTb3VyY2UnLCBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uVG9TdHJpbmcuY2FsbChpdCk7XG59KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJyAmJiAhaGFzKHZhbHVlLCAnbmFtZScpKSBoaWRlKHZhbHVlLCAnbmFtZScsIGtleSk7XG4gICAgZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpLnNvdXJjZSA9IFRFTVBMQVRFLmpvaW4odHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGtleSA6ICcnKTtcbiAgfVxuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gICAgZWxzZSBzZXRHbG9iYWwoa2V5LCB2YWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9IGVsc2UgaWYgKCF1bnNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICB9IGVsc2UgaWYgKCFub1RhcmdldEdldCAmJiBPW2tleV0pIHtcbiAgICBzaW1wbGUgPSB0cnVlO1xuICB9XG4gIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICBlbHNlIGhpZGUoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IG5hdGl2ZUZ1bmN0aW9uVG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG4vLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZXF1aXJlb2JqZWN0Y29lcmNpYmxlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtZ2xvYmFsLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBnbG9iYWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvZ2xvYmFsICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzXCIpO1xudmFyIGhpZGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaGlkZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBoaWRlKGdsb2JhbCwga2V5LCB2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qc1wiKS5mO1xudmFyIGhhcyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9oYXMgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMuanNcIik7XG52YXIgd2VsbEtub3duU3ltYm9sID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanNcIik7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVEFHLCBTVEFUSUMpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBTVEFUSUMgPyBpdCA6IGl0LnByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRykpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShpdCwgVE9fU1RSSU5HX1RBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBUQUcgfSk7XG4gIH1cbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLWtleS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1rZXkuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgc2hhcmVkID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NoYXJlZCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qc1wiKTtcbnZhciB1aWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdWlkICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzXCIpO1xuXG52YXIga2V5cyA9IHNoYXJlZCgna2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIGtleXNba2V5XSB8fCAoa2V5c1trZXldID0gdWlkKGtleSkpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGdsb2JhbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9nbG9iYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanNcIik7XG52YXIgc2V0R2xvYmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtZ2xvYmFsLmpzXCIpO1xudmFyIElTX1BVUkUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvaXMtcHVyZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanNcIik7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IHNldEdsb2JhbChTSEFSRUQsIHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjEuMycsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOSBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy1hdC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3RyaW5nLWF0LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgdG9JbnRlZ2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3RvLWludGVnZXIgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbnRlZ2VyLmpzXCIpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzXCIpO1xuXG4vLyBDT05WRVJUX1RPX1NUUklORzogdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBDT05WRVJUX1RPX1NUUklORzogZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCBwb3MsIENPTlZFUlRfVE9fU1RSSU5HKSB7XG4gIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhhdCkpO1xuICB2YXIgcG9zaXRpb24gPSB0b0ludGVnZXIocG9zKTtcbiAgdmFyIHNpemUgPSBTLmxlbmd0aDtcbiAgdmFyIGZpcnN0LCBzZWNvbmQ7XG4gIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gc2l6ZSkgcmV0dXJuIENPTlZFUlRfVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gIGZpcnN0ID0gUy5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcbiAgcmV0dXJuIGZpcnN0IDwgMHhEODAwIHx8IGZpcnN0ID4gMHhEQkZGIHx8IHBvc2l0aW9uICsgMSA9PT0gc2l6ZVxuICAgIHx8IChzZWNvbmQgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKSkgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGXG4gICAgICA/IENPTlZFUlRfVE9fU1RSSU5HID8gUy5jaGFyQXQocG9zaXRpb24pIDogZmlyc3RcbiAgICAgIDogQ09OVkVSVF9UT19TVFJJTkcgPyBTLnNsaWNlKHBvc2l0aW9uLCBwb3NpdGlvbiArIDIpIDogKGZpcnN0IC0gMHhEODAwIDw8IDEwKSArIChzZWNvbmQgLSAweERDMDApICsgMHgxMDAwMDtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIHRvSW50ZWdlciA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy90by1pbnRlZ2VyICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci5qc1wiKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBIZWxwZXIgZm9yIGEgcG9wdWxhciByZXBlYXRpbmcgY2FzZSBvZiB0aGUgc3BlYzpcbi8vIExldCBpbnRlZ2VyIGJlID8gVG9JbnRlZ2VyKGluZGV4KS5cbi8vIElmIGludGVnZXIgPCAwLCBsZXQgcmVzdWx0IGJlIG1heCgobGVuZ3RoICsgaW50ZWdlciksIDApOyBlbHNlIGxldCByZXN1bHQgYmUgbWluKGxlbmd0aCwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW50ZWdlciA8IDAgPyBtYXgoaW50ZWdlciArIGxlbmd0aCwgMCkgOiBtaW4oaW50ZWdlciwgbGVuZ3RoKTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0ICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanNcIik7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXIuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNOYU4oYXJndW1lbnQgPSArYXJndW1lbnQpID8gMCA6IChhcmd1bWVudCA+IDAgPyBmbG9vciA6IGNlaWwpKGFyZ3VtZW50KTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbnZhciB0b0ludGVnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdG8taW50ZWdlciAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXIuanNcIik7XG5cbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gYFRvTGVuZ3RoYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gYXJndW1lbnQgPiAwID8gbWluKHRvSW50ZWdlcihhcmd1bWVudCksIDB4MUZGRkZGRkZGRkZGRkYpIDogMDsgLy8gMiAqKiA1MyAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1vYmplY3QuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzXCIpO1xuXG4vLyBgVG9PYmplY3RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9vYmplY3Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByaW1pdGl2ZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGlzT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2lzLW9iamVjdCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qc1wiKTtcblxuLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91aWQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxudmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcG9zdGZpeCkudG9TdHJpbmcoMzYpKTtcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdmFsaWRhdGUtc2V0LXByb3RvdHlwZS1vZi1hcmd1bWVudHMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdmFsaWRhdGUtc2V0LXByb3RvdHlwZS1vZi1hcmd1bWVudHMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGlzT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2lzLW9iamVjdCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qc1wiKTtcbnZhciBhbk9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9hbi1vYmplY3QgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1vYmplY3QuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBpZiAoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbid0IHNldCBcIiArIFN0cmluZyhwcm90bykgKyAnIGFzIGEgcHJvdG90eXBlJyk7XG4gIH1cbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxudmFyIGdsb2JhbCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9nbG9iYWwgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanNcIik7XG52YXIgc2hhcmVkID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL3NoYXJlZCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qc1wiKTtcbnZhciB1aWQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvdWlkICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzXCIpO1xudmFyIE5BVElWRV9TWU1CT0wgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wuanNcIik7XG5cbnZhciBTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyIHN0b3JlID0gc2hhcmVkKCd3a3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID0gTkFUSVZFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV1cbiAgICB8fCAoTkFUSVZFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZnJvbS5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZnJvbS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG52YXIgJCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9leHBvcnQgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9leHBvcnQuanNcIik7XG52YXIgZnJvbSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9hcnJheS1mcm9tICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZnJvbS5qc1wiKTtcbnZhciBjaGVja0NvcnJlY3RuZXNzT2ZJdGVyYXRpb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi9pbnRlcm5hbHMvY2hlY2stY29ycmVjdG5lc3Mtb2YtaXRlcmF0aW9uICovIFwiLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2hlY2stY29ycmVjdG5lc3Mtb2YtaXRlcmF0aW9uLmpzXCIpO1xuXG52YXIgSU5DT1JSRUNUX0lURVJBVElPTiA9ICFjaGVja0NvcnJlY3RuZXNzT2ZJdGVyYXRpb24oZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gIEFycmF5LmZyb20oaXRlcmFibGUpO1xufSk7XG5cbi8vIGBBcnJheS5mcm9tYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LmZyb21cbiQoeyB0YXJnZXQ6ICdBcnJheScsIHN0YXQ6IHRydWUsIGZvcmNlZDogSU5DT1JSRUNUX0lURVJBVElPTiB9LCB7XG4gIGZyb206IGZyb21cbn0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuaXRlcmF0b3IuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLml0ZXJhdG9yLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb2RlUG9pbnRBdCA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9zdHJpbmctYXQgKi8gXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zdHJpbmctYXQuanNcIik7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZSAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzXCIpO1xudmFyIGRlZmluZUl0ZXJhdG9yID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvciAqLyBcIi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvci5qc1wiKTtcblxudmFyIFNUUklOR19JVEVSQVRPUiA9ICdTdHJpbmcgSXRlcmF0b3InO1xudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXR0ZXJGb3IoU1RSSU5HX0lURVJBVE9SKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl1gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS1AQGl0ZXJhdG9yXG5kZWZpbmVJdGVyYXRvcihTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgc2V0SW50ZXJuYWxTdGF0ZSh0aGlzLCB7XG4gICAgdHlwZTogU1RSSU5HX0lURVJBVE9SLFxuICAgIHN0cmluZzogU3RyaW5nKGl0ZXJhdGVkKSxcbiAgICBpbmRleDogMFxuICB9KTtcbi8vIGAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtJXN0cmluZ2l0ZXJhdG9ycHJvdG90eXBlJS5uZXh0XG59LCBmdW5jdGlvbiBuZXh0KCkge1xuICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICB2YXIgc3RyaW5nID0gc3RhdGUuc3RyaW5nO1xuICB2YXIgaW5kZXggPSBzdGF0ZS5pbmRleDtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gc3RyaW5nLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9IGNvZGVQb2ludEF0KHN0cmluZywgaW5kZXgsIHRydWUpO1xuICBzdGF0ZS5pbmRleCArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9nbG9iYWwuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxudmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsIGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaCAoZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvZGVmYXVsdC1hdHRycy5qc29uXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9kZWZhdWx0LWF0dHJzLmpzb24gKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IHhtbG5zLCB3aWR0aCwgaGVpZ2h0LCB2aWV3Qm94LCBmaWxsLCBzdHJva2UsIHN0cm9rZS13aWR0aCwgc3Ryb2tlLWxpbmVjYXAsIHN0cm9rZS1saW5lam9pbiwgZGVmYXVsdCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSkge1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcInhtbG5zXCI6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwid2lkdGhcIjoyNCxcImhlaWdodFwiOjI0LFwidmlld0JveFwiOlwiMCAwIDI0IDI0XCIsXCJmaWxsXCI6XCJub25lXCIsXCJzdHJva2VcIjpcImN1cnJlbnRDb2xvclwiLFwic3Ryb2tlLXdpZHRoXCI6MixcInN0cm9rZS1saW5lY2FwXCI6XCJyb3VuZFwiLFwic3Ryb2tlLWxpbmVqb2luXCI6XCJyb3VuZFwifTtcblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvaWNvbi5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2ljb24uanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2RlZHVwZSA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIGNsYXNzbmFtZXMvZGVkdXBlICovIFwiLi9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9kZWR1cGUuanNcIik7XG5cbnZhciBfZGVkdXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZHVwZSk7XG5cbnZhciBfZGVmYXVsdEF0dHJzID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9kZWZhdWx0LWF0dHJzLmpzb24gKi8gXCIuL3NyYy9kZWZhdWx0LWF0dHJzLmpzb25cIik7XG5cbnZhciBfZGVmYXVsdEF0dHJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRBdHRycyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBJY29uID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBJY29uKG5hbWUsIGNvbnRlbnRzKSB7XG4gICAgdmFyIHRhZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEljb24pO1xuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmNvbnRlbnRzID0gY29udGVudHM7XG4gICAgdGhpcy50YWdzID0gdGFncztcbiAgICB0aGlzLmF0dHJzID0gX2V4dGVuZHMoe30sIF9kZWZhdWx0QXR0cnMyLmRlZmF1bHQsIHsgY2xhc3M6ICdmZWF0aGVyIGZlYXRoZXItJyArIG5hbWUgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIFNWRyBzdHJpbmcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhJY29uLCBbe1xuICAgIGtleTogJ3RvU3ZnJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdmcoKSB7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgICB2YXIgY29tYmluZWRBdHRycyA9IF9leHRlbmRzKHt9LCB0aGlzLmF0dHJzLCBhdHRycywgeyBjbGFzczogKDAsIF9kZWR1cGUyLmRlZmF1bHQpKHRoaXMuYXR0cnMuY2xhc3MsIGF0dHJzLmNsYXNzKSB9KTtcblxuICAgICAgcmV0dXJuICc8c3ZnICcgKyBhdHRyc1RvU3RyaW5nKGNvbWJpbmVkQXR0cnMpICsgJz4nICsgdGhpcy5jb250ZW50cyArICc8L3N2Zz4nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYW4gYEljb25gLlxuICAgICAqXG4gICAgICogQWRkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuIElmIG9sZCBjb2RlIGV4cGVjdHMgYGZlYXRoZXIuaWNvbnMuPG5hbWU+YFxuICAgICAqIHRvIGJlIGEgc3RyaW5nLCBgdG9TdHJpbmcoKWAgd2lsbCBnZXQgaW1wbGljaXRseSBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0b1N0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudHM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEljb247XG59KCk7XG5cbi8qKlxuICogQ29udmVydCBhdHRyaWJ1dGVzIG9iamVjdCB0byBzdHJpbmcgb2YgSFRNTCBhdHRyaWJ1dGVzLlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gYXR0cnNUb1N0cmluZyhhdHRycykge1xuICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cnMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleSArICc9XCInICsgYXR0cnNba2V5XSArICdcIic7XG4gIH0pLmpvaW4oJyAnKTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gSWNvbjtcblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvaWNvbnMuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvaWNvbnMuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9pY29uID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9pY29uICovIFwiLi9zcmMvaWNvbi5qc1wiKTtcblxudmFyIF9pY29uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ljb24pO1xuXG52YXIgX2ljb25zID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi4vZGlzdC9pY29ucy5qc29uICovIFwiLi9kaXN0L2ljb25zLmpzb25cIik7XG5cbnZhciBfaWNvbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaWNvbnMpO1xuXG52YXIgX3RhZ3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL3RhZ3MuanNvbiAqLyBcIi4vc3JjL3RhZ3MuanNvblwiKTtcblxudmFyIF90YWdzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RhZ3MpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBPYmplY3Qua2V5cyhfaWNvbnMyLmRlZmF1bHQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBuZXcgX2ljb24yLmRlZmF1bHQoa2V5LCBfaWNvbnMyLmRlZmF1bHRba2V5XSwgX3RhZ3MyLmRlZmF1bHRba2V5XSk7XG59KS5yZWR1Y2UoZnVuY3Rpb24gKG9iamVjdCwgaWNvbikge1xuICBvYmplY3RbaWNvbi5uYW1lXSA9IGljb247XG4gIHJldHVybiBvYmplY3Q7XG59LCB7fSk7XG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL2luZGV4LmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBfaWNvbnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2ljb25zICovIFwiLi9zcmMvaWNvbnMuanNcIik7XG5cbnZhciBfaWNvbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaWNvbnMpO1xuXG52YXIgX3RvU3ZnID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi90by1zdmcgKi8gXCIuL3NyYy90by1zdmcuanNcIik7XG5cbnZhciBfdG9TdmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdG9TdmcpO1xuXG52YXIgX3JlcGxhY2UgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL3JlcGxhY2UgKi8gXCIuL3NyYy9yZXBsYWNlLmpzXCIpO1xuXG52YXIgX3JlcGxhY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVwbGFjZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0geyBpY29uczogX2ljb25zMi5kZWZhdWx0LCB0b1N2ZzogX3RvU3ZnMi5kZWZhdWx0LCByZXBsYWNlOiBfcmVwbGFjZTIuZGVmYXVsdCB9O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy9yZXBsYWNlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvcmVwbGFjZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5cbnZhciBfZGVkdXBlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgY2xhc3NuYW1lcy9kZWR1cGUgKi8gXCIuL25vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2RlZHVwZS5qc1wiKTtcblxudmFyIF9kZWR1cGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVkdXBlKTtcblxudmFyIF9pY29ucyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vaWNvbnMgKi8gXCIuL3NyYy9pY29ucy5qc1wiKTtcblxudmFyIF9pY29uczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pY29ucyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogUmVwbGFjZSBhbGwgSFRNTCBlbGVtZW50cyB0aGF0IGhhdmUgYSBgZGF0YS1mZWF0aGVyYCBhdHRyaWJ1dGUgd2l0aCBTVkcgbWFya3VwXG4gKiBjb3JyZXNwb25kaW5nIHRvIHRoZSBlbGVtZW50J3MgYGRhdGEtZmVhdGhlcmAgYXR0cmlidXRlIHZhbHVlLlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2UoKSB7XG4gIHZhciBhdHRycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmZWF0aGVyLnJlcGxhY2UoKWAgb25seSB3b3JrcyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnQuJyk7XG4gIH1cblxuICB2YXIgZWxlbWVudHNUb1JlcGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mZWF0aGVyXScpO1xuXG4gIEFycmF5LmZyb20oZWxlbWVudHNUb1JlcGxhY2UpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gcmVwbGFjZUVsZW1lbnQoZWxlbWVudCwgYXR0cnMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIGEgc2luZ2xlIEhUTUwgZWxlbWVudCB3aXRoIFNWRyBtYXJrdXBcbiAqIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGVsZW1lbnQncyBgZGF0YS1mZWF0aGVyYCBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gYXR0cnNcbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUVsZW1lbnQoZWxlbWVudCkge1xuICB2YXIgYXR0cnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIHZhciBlbGVtZW50QXR0cnMgPSBnZXRBdHRycyhlbGVtZW50KTtcbiAgdmFyIG5hbWUgPSBlbGVtZW50QXR0cnNbJ2RhdGEtZmVhdGhlciddO1xuICBkZWxldGUgZWxlbWVudEF0dHJzWydkYXRhLWZlYXRoZXInXTtcblxuICB2YXIgc3ZnU3RyaW5nID0gX2ljb25zMi5kZWZhdWx0W25hbWVdLnRvU3ZnKF9leHRlbmRzKHt9LCBhdHRycywgZWxlbWVudEF0dHJzLCB7IGNsYXNzOiAoMCwgX2RlZHVwZTIuZGVmYXVsdCkoYXR0cnMuY2xhc3MsIGVsZW1lbnRBdHRycy5jbGFzcykgfSkpO1xuICB2YXIgc3ZnRG9jdW1lbnQgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHN2Z1N0cmluZywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgdmFyIHN2Z0VsZW1lbnQgPSBzdmdEb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcblxuICBlbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHN2Z0VsZW1lbnQsIGVsZW1lbnQpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgYXR0cmlidXRlcyBvZiBhbiBIVE1MIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBnZXRBdHRycyhlbGVtZW50KSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuYXR0cmlidXRlcykucmVkdWNlKGZ1bmN0aW9uIChhdHRycywgYXR0cikge1xuICAgIGF0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgIHJldHVybiBhdHRycztcbiAgfSwge30pO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSByZXBsYWNlO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy90YWdzLmpzb25cIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3RhZ3MuanNvbiAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgZXhwb3J0cyBwcm92aWRlZDogYWN0aXZpdHksIGFpcnBsYXksIGFsZXJ0LWNpcmNsZSwgYWxlcnQtb2N0YWdvbiwgYWxlcnQtdHJpYW5nbGUsIGFsaWduLWNlbnRlciwgYWxpZ24tanVzdGlmeSwgYWxpZ24tbGVmdCwgYWxpZ24tcmlnaHQsIGFuY2hvciwgYXJjaGl2ZSwgYXQtc2lnbiwgYXdhcmQsIGFwZXJ0dXJlLCBiYXItY2hhcnQsIGJhci1jaGFydC0yLCBiYXR0ZXJ5LCBiYXR0ZXJ5LWNoYXJnaW5nLCBiZWxsLCBiZWxsLW9mZiwgYmx1ZXRvb3RoLCBib29rLW9wZW4sIGJvb2ssIGJvb2ttYXJrLCBib3gsIGJyaWVmY2FzZSwgY2FsZW5kYXIsIGNhbWVyYSwgY2FzdCwgY2hldnJvbi1kb3duLCBjaGV2cm9uLXVwLCBjaXJjbGUsIGNsaXBib2FyZCwgY2xvY2ssIGNsb3VkLWRyaXp6bGUsIGNsb3VkLWxpZ2h0bmluZywgY2xvdWQtcmFpbiwgY2xvdWQtc25vdywgY2xvdWQsIGNvZGVwZW4sIGNvZGVzYW5kYm94LCBjb2RlLCBjb2ZmZWUsIGNvbHVtbnMsIGNvbW1hbmQsIGNvbXBhc3MsIGNvcHksIGNvcm5lci1kb3duLWxlZnQsIGNvcm5lci1kb3duLXJpZ2h0LCBjb3JuZXItbGVmdC1kb3duLCBjb3JuZXItbGVmdC11cCwgY29ybmVyLXJpZ2h0LWRvd24sIGNvcm5lci1yaWdodC11cCwgY29ybmVyLXVwLWxlZnQsIGNvcm5lci11cC1yaWdodCwgY3B1LCBjcmVkaXQtY2FyZCwgY3JvcCwgY3Jvc3NoYWlyLCBkYXRhYmFzZSwgZGVsZXRlLCBkaXNjLCBkb2xsYXItc2lnbiwgZHJvcGxldCwgZWRpdCwgZWRpdC0yLCBlZGl0LTMsIGV5ZSwgZXllLW9mZiwgZXh0ZXJuYWwtbGluaywgZmFjZWJvb2ssIGZhc3QtZm9yd2FyZCwgZmlnbWEsIGZpbGUtbWludXMsIGZpbGUtcGx1cywgZmlsZS10ZXh0LCBmaWxtLCBmaWx0ZXIsIGZsYWcsIGZvbGRlci1taW51cywgZm9sZGVyLXBsdXMsIGZvbGRlciwgZnJhbWVyLCBmcm93biwgZ2lmdCwgZ2l0LWJyYW5jaCwgZ2l0LWNvbW1pdCwgZ2l0LW1lcmdlLCBnaXQtcHVsbC1yZXF1ZXN0LCBnaXRodWIsIGdpdGxhYiwgZ2xvYmUsIGhhcmQtZHJpdmUsIGhhc2gsIGhlYWRwaG9uZXMsIGhlYXJ0LCBoZWxwLWNpcmNsZSwgaGV4YWdvbiwgaG9tZSwgaW1hZ2UsIGluYm94LCBpbnN0YWdyYW0sIGtleSwgbGF5ZXJzLCBsYXlvdXQsIGxpZmUtYm91eSwgbGluaywgbGluay0yLCBsaW5rZWRpbiwgbGlzdCwgbG9jaywgbG9nLWluLCBsb2ctb3V0LCBtYWlsLCBtYXAtcGluLCBtYXAsIG1heGltaXplLCBtYXhpbWl6ZS0yLCBtZWgsIG1lbnUsIG1lc3NhZ2UtY2lyY2xlLCBtZXNzYWdlLXNxdWFyZSwgbWljLW9mZiwgbWljLCBtaW5pbWl6ZSwgbWluaW1pemUtMiwgbWludXMsIG1vbml0b3IsIG1vb24sIG1vcmUtaG9yaXpvbnRhbCwgbW9yZS12ZXJ0aWNhbCwgbW91c2UtcG9pbnRlciwgbW92ZSwgbXVzaWMsIG5hdmlnYXRpb24sIG5hdmlnYXRpb24tMiwgb2N0YWdvbiwgcGFja2FnZSwgcGFwZXJjbGlwLCBwYXVzZSwgcGF1c2UtY2lyY2xlLCBwZW4tdG9vbCwgcGVyY2VudCwgcGhvbmUtY2FsbCwgcGhvbmUtZm9yd2FyZGVkLCBwaG9uZS1pbmNvbWluZywgcGhvbmUtbWlzc2VkLCBwaG9uZS1vZmYsIHBob25lLW91dGdvaW5nLCBwaG9uZSwgcGxheSwgcGllLWNoYXJ0LCBwbGF5LWNpcmNsZSwgcGx1cywgcGx1cy1jaXJjbGUsIHBsdXMtc3F1YXJlLCBwb2NrZXQsIHBvd2VyLCBwcmludGVyLCByYWRpbywgcmVmcmVzaC1jdywgcmVmcmVzaC1jY3csIHJlcGVhdCwgcmV3aW5kLCByb3RhdGUtY2N3LCByb3RhdGUtY3csIHJzcywgc2F2ZSwgc2Npc3NvcnMsIHNlYXJjaCwgc2VuZCwgc2V0dGluZ3MsIHNoYXJlLTIsIHNoaWVsZCwgc2hpZWxkLW9mZiwgc2hvcHBpbmctYmFnLCBzaG9wcGluZy1jYXJ0LCBzaHVmZmxlLCBza2lwLWJhY2ssIHNraXAtZm9yd2FyZCwgc2xhY2ssIHNsYXNoLCBzbGlkZXJzLCBzbWFydHBob25lLCBzbWlsZSwgc3BlYWtlciwgc3Rhciwgc3RvcC1jaXJjbGUsIHN1biwgc3VucmlzZSwgc3Vuc2V0LCB0YWJsZXQsIHRhZywgdGFyZ2V0LCB0ZXJtaW5hbCwgdGhlcm1vbWV0ZXIsIHRodW1icy1kb3duLCB0aHVtYnMtdXAsIHRvZ2dsZS1sZWZ0LCB0b2dnbGUtcmlnaHQsIHRvb2wsIHRyYXNoLCB0cmFzaC0yLCB0cmlhbmdsZSwgdHJ1Y2ssIHR2LCB0d2l0Y2gsIHR3aXR0ZXIsIHR5cGUsIHVtYnJlbGxhLCB1bmxvY2ssIHVzZXItY2hlY2ssIHVzZXItbWludXMsIHVzZXItcGx1cywgdXNlci14LCB1c2VyLCB1c2VycywgdmlkZW8tb2ZmLCB2aWRlbywgdm9pY2VtYWlsLCB2b2x1bWUsIHZvbHVtZS0xLCB2b2x1bWUtMiwgdm9sdW1lLXgsIHdhdGNoLCB3aWZpLW9mZiwgd2lmaSwgd2luZCwgeC1jaXJjbGUsIHgtb2N0YWdvbiwgeC1zcXVhcmUsIHgsIHlvdXR1YmUsIHphcC1vZmYsIHphcCwgem9vbS1pbiwgem9vbS1vdXQsIGRlZmF1bHQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUpIHtcblxubW9kdWxlLmV4cG9ydHMgPSB7XCJhY3Rpdml0eVwiOltcInB1bHNlXCIsXCJoZWFsdGhcIixcImFjdGlvblwiLFwibW90aW9uXCJdLFwiYWlycGxheVwiOltcInN0cmVhbVwiLFwiY2FzdFwiLFwibWlycm9yaW5nXCJdLFwiYWxlcnQtY2lyY2xlXCI6W1wid2FybmluZ1wiLFwiYWxlcnRcIixcImRhbmdlclwiXSxcImFsZXJ0LW9jdGFnb25cIjpbXCJ3YXJuaW5nXCIsXCJhbGVydFwiLFwiZGFuZ2VyXCJdLFwiYWxlcnQtdHJpYW5nbGVcIjpbXCJ3YXJuaW5nXCIsXCJhbGVydFwiLFwiZGFuZ2VyXCJdLFwiYWxpZ24tY2VudGVyXCI6W1widGV4dCBhbGlnbm1lbnRcIixcImNlbnRlclwiXSxcImFsaWduLWp1c3RpZnlcIjpbXCJ0ZXh0IGFsaWdubWVudFwiLFwianVzdGlmaWVkXCJdLFwiYWxpZ24tbGVmdFwiOltcInRleHQgYWxpZ25tZW50XCIsXCJsZWZ0XCJdLFwiYWxpZ24tcmlnaHRcIjpbXCJ0ZXh0IGFsaWdubWVudFwiLFwicmlnaHRcIl0sXCJhbmNob3JcIjpbXSxcImFyY2hpdmVcIjpbXCJpbmRleFwiLFwiYm94XCJdLFwiYXQtc2lnblwiOltcIm1lbnRpb25cIixcImF0XCIsXCJlbWFpbFwiLFwibWVzc2FnZVwiXSxcImF3YXJkXCI6W1wiYWNoaWV2ZW1lbnRcIixcImJhZGdlXCJdLFwiYXBlcnR1cmVcIjpbXCJjYW1lcmFcIixcInBob3RvXCJdLFwiYmFyLWNoYXJ0XCI6W1wic3RhdGlzdGljc1wiLFwiZGlhZ3JhbVwiLFwiZ3JhcGhcIl0sXCJiYXItY2hhcnQtMlwiOltcInN0YXRpc3RpY3NcIixcImRpYWdyYW1cIixcImdyYXBoXCJdLFwiYmF0dGVyeVwiOltcInBvd2VyXCIsXCJlbGVjdHJpY2l0eVwiXSxcImJhdHRlcnktY2hhcmdpbmdcIjpbXCJwb3dlclwiLFwiZWxlY3RyaWNpdHlcIl0sXCJiZWxsXCI6W1wiYWxhcm1cIixcIm5vdGlmaWNhdGlvblwiLFwic291bmRcIl0sXCJiZWxsLW9mZlwiOltcImFsYXJtXCIsXCJub3RpZmljYXRpb25cIixcInNpbGVudFwiXSxcImJsdWV0b290aFwiOltcIndpcmVsZXNzXCJdLFwiYm9vay1vcGVuXCI6W1wicmVhZFwiLFwibGlicmFyeVwiXSxcImJvb2tcIjpbXCJyZWFkXCIsXCJkaWN0aW9uYXJ5XCIsXCJib29rbGV0XCIsXCJtYWdhemluZVwiLFwibGlicmFyeVwiXSxcImJvb2ttYXJrXCI6W1wicmVhZFwiLFwiY2xpcFwiLFwibWFya2VyXCIsXCJ0YWdcIl0sXCJib3hcIjpbXCJjdWJlXCJdLFwiYnJpZWZjYXNlXCI6W1wid29ya1wiLFwiYmFnXCIsXCJiYWdnYWdlXCIsXCJmb2xkZXJcIl0sXCJjYWxlbmRhclwiOltcImRhdGVcIl0sXCJjYW1lcmFcIjpbXCJwaG90b1wiXSxcImNhc3RcIjpbXCJjaHJvbWVjYXN0XCIsXCJhaXJwbGF5XCJdLFwiY2hldnJvbi1kb3duXCI6W1wiZXhwYW5kXCJdLFwiY2hldnJvbi11cFwiOltcImNvbGxhcHNlXCJdLFwiY2lyY2xlXCI6W1wib2ZmXCIsXCJ6ZXJvXCIsXCJyZWNvcmRcIl0sXCJjbGlwYm9hcmRcIjpbXCJjb3B5XCJdLFwiY2xvY2tcIjpbXCJ0aW1lXCIsXCJ3YXRjaFwiLFwiYWxhcm1cIl0sXCJjbG91ZC1kcml6emxlXCI6W1wid2VhdGhlclwiLFwic2hvd2VyXCJdLFwiY2xvdWQtbGlnaHRuaW5nXCI6W1wid2VhdGhlclwiLFwiYm9sdFwiXSxcImNsb3VkLXJhaW5cIjpbXCJ3ZWF0aGVyXCJdLFwiY2xvdWQtc25vd1wiOltcIndlYXRoZXJcIixcImJsaXp6YXJkXCJdLFwiY2xvdWRcIjpbXCJ3ZWF0aGVyXCJdLFwiY29kZXBlblwiOltcImxvZ29cIl0sXCJjb2Rlc2FuZGJveFwiOltcImxvZ29cIl0sXCJjb2RlXCI6W1wic291cmNlXCIsXCJwcm9ncmFtbWluZ1wiXSxcImNvZmZlZVwiOltcImRyaW5rXCIsXCJjdXBcIixcIm11Z1wiLFwidGVhXCIsXCJjYWZlXCIsXCJob3RcIixcImJldmVyYWdlXCJdLFwiY29sdW1uc1wiOltcImxheW91dFwiXSxcImNvbW1hbmRcIjpbXCJrZXlib2FyZFwiLFwiY21kXCIsXCJ0ZXJtaW5hbFwiLFwicHJvbXB0XCJdLFwiY29tcGFzc1wiOltcIm5hdmlnYXRpb25cIixcInNhZmFyaVwiLFwidHJhdmVsXCIsXCJkaXJlY3Rpb25cIl0sXCJjb3B5XCI6W1wiY2xvbmVcIixcImR1cGxpY2F0ZVwiXSxcImNvcm5lci1kb3duLWxlZnRcIjpbXCJhcnJvd1wiLFwicmV0dXJuXCJdLFwiY29ybmVyLWRvd24tcmlnaHRcIjpbXCJhcnJvd1wiXSxcImNvcm5lci1sZWZ0LWRvd25cIjpbXCJhcnJvd1wiXSxcImNvcm5lci1sZWZ0LXVwXCI6W1wiYXJyb3dcIl0sXCJjb3JuZXItcmlnaHQtZG93blwiOltcImFycm93XCJdLFwiY29ybmVyLXJpZ2h0LXVwXCI6W1wiYXJyb3dcIl0sXCJjb3JuZXItdXAtbGVmdFwiOltcImFycm93XCJdLFwiY29ybmVyLXVwLXJpZ2h0XCI6W1wiYXJyb3dcIl0sXCJjcHVcIjpbXCJwcm9jZXNzb3JcIixcInRlY2hub2xvZ3lcIl0sXCJjcmVkaXQtY2FyZFwiOltcInB1cmNoYXNlXCIsXCJwYXltZW50XCIsXCJjY1wiXSxcImNyb3BcIjpbXCJwaG90b1wiLFwiaW1hZ2VcIl0sXCJjcm9zc2hhaXJcIjpbXCJhaW1cIixcInRhcmdldFwiXSxcImRhdGFiYXNlXCI6W1wic3RvcmFnZVwiLFwibWVtb3J5XCJdLFwiZGVsZXRlXCI6W1wicmVtb3ZlXCJdLFwiZGlzY1wiOltcImFsYnVtXCIsXCJjZFwiLFwiZHZkXCIsXCJtdXNpY1wiXSxcImRvbGxhci1zaWduXCI6W1wiY3VycmVuY3lcIixcIm1vbmV5XCIsXCJwYXltZW50XCJdLFwiZHJvcGxldFwiOltcIndhdGVyXCJdLFwiZWRpdFwiOltcInBlbmNpbFwiLFwiY2hhbmdlXCJdLFwiZWRpdC0yXCI6W1wicGVuY2lsXCIsXCJjaGFuZ2VcIl0sXCJlZGl0LTNcIjpbXCJwZW5jaWxcIixcImNoYW5nZVwiXSxcImV5ZVwiOltcInZpZXdcIixcIndhdGNoXCJdLFwiZXllLW9mZlwiOltcInZpZXdcIixcIndhdGNoXCIsXCJoaWRlXCIsXCJoaWRkZW5cIl0sXCJleHRlcm5hbC1saW5rXCI6W1wib3V0Ym91bmRcIl0sXCJmYWNlYm9va1wiOltcImxvZ29cIixcInNvY2lhbFwiXSxcImZhc3QtZm9yd2FyZFwiOltcIm11c2ljXCJdLFwiZmlnbWFcIjpbXCJsb2dvXCIsXCJkZXNpZ25cIixcInRvb2xcIl0sXCJmaWxlLW1pbnVzXCI6W1wiZGVsZXRlXCIsXCJyZW1vdmVcIixcImVyYXNlXCJdLFwiZmlsZS1wbHVzXCI6W1wiYWRkXCIsXCJjcmVhdGVcIixcIm5ld1wiXSxcImZpbGUtdGV4dFwiOltcImRhdGFcIixcInR4dFwiLFwicGRmXCJdLFwiZmlsbVwiOltcIm1vdmllXCIsXCJ2aWRlb1wiXSxcImZpbHRlclwiOltcImZ1bm5lbFwiLFwiaG9wcGVyXCJdLFwiZmxhZ1wiOltcInJlcG9ydFwiXSxcImZvbGRlci1taW51c1wiOltcImRpcmVjdG9yeVwiXSxcImZvbGRlci1wbHVzXCI6W1wiZGlyZWN0b3J5XCJdLFwiZm9sZGVyXCI6W1wiZGlyZWN0b3J5XCJdLFwiZnJhbWVyXCI6W1wibG9nb1wiLFwiZGVzaWduXCIsXCJ0b29sXCJdLFwiZnJvd25cIjpbXCJlbW9qaVwiLFwiZmFjZVwiLFwiYmFkXCIsXCJzYWRcIixcImVtb3Rpb25cIl0sXCJnaWZ0XCI6W1wicHJlc2VudFwiLFwiYm94XCIsXCJiaXJ0aGRheVwiLFwicGFydHlcIl0sXCJnaXQtYnJhbmNoXCI6W1wiY29kZVwiLFwidmVyc2lvbiBjb250cm9sXCJdLFwiZ2l0LWNvbW1pdFwiOltcImNvZGVcIixcInZlcnNpb24gY29udHJvbFwiXSxcImdpdC1tZXJnZVwiOltcImNvZGVcIixcInZlcnNpb24gY29udHJvbFwiXSxcImdpdC1wdWxsLXJlcXVlc3RcIjpbXCJjb2RlXCIsXCJ2ZXJzaW9uIGNvbnRyb2xcIl0sXCJnaXRodWJcIjpbXCJsb2dvXCIsXCJ2ZXJzaW9uIGNvbnRyb2xcIl0sXCJnaXRsYWJcIjpbXCJsb2dvXCIsXCJ2ZXJzaW9uIGNvbnRyb2xcIl0sXCJnbG9iZVwiOltcIndvcmxkXCIsXCJicm93c2VyXCIsXCJsYW5ndWFnZVwiLFwidHJhbnNsYXRlXCJdLFwiaGFyZC1kcml2ZVwiOltcImNvbXB1dGVyXCIsXCJzZXJ2ZXJcIixcIm1lbW9yeVwiLFwiZGF0YVwiXSxcImhhc2hcIjpbXCJoYXNodGFnXCIsXCJudW1iZXJcIixcInBvdW5kXCJdLFwiaGVhZHBob25lc1wiOltcIm11c2ljXCIsXCJhdWRpb1wiLFwic291bmRcIl0sXCJoZWFydFwiOltcImxpa2VcIixcImxvdmVcIixcImVtb3Rpb25cIl0sXCJoZWxwLWNpcmNsZVwiOltcInF1ZXN0aW9uIG1hcmtcIl0sXCJoZXhhZ29uXCI6W1wic2hhcGVcIixcIm5vZGUuanNcIixcImxvZ29cIl0sXCJob21lXCI6W1wiaG91c2VcIixcImxpdmluZ1wiXSxcImltYWdlXCI6W1wicGljdHVyZVwiXSxcImluYm94XCI6W1wiZW1haWxcIl0sXCJpbnN0YWdyYW1cIjpbXCJsb2dvXCIsXCJjYW1lcmFcIl0sXCJrZXlcIjpbXCJwYXNzd29yZFwiLFwibG9naW5cIixcImF1dGhlbnRpY2F0aW9uXCIsXCJzZWN1cmVcIl0sXCJsYXllcnNcIjpbXCJzdGFja1wiXSxcImxheW91dFwiOltcIndpbmRvd1wiLFwid2VicGFnZVwiXSxcImxpZmUtYm91eVwiOltcImhlbHBcIixcImxpZmUgcmluZ1wiLFwic3VwcG9ydFwiXSxcImxpbmtcIjpbXCJjaGFpblwiLFwidXJsXCJdLFwibGluay0yXCI6W1wiY2hhaW5cIixcInVybFwiXSxcImxpbmtlZGluXCI6W1wibG9nb1wiLFwic29jaWFsIG1lZGlhXCJdLFwibGlzdFwiOltcIm9wdGlvbnNcIl0sXCJsb2NrXCI6W1wic2VjdXJpdHlcIixcInBhc3N3b3JkXCIsXCJzZWN1cmVcIl0sXCJsb2ctaW5cIjpbXCJzaWduIGluXCIsXCJhcnJvd1wiLFwiZW50ZXJcIl0sXCJsb2ctb3V0XCI6W1wic2lnbiBvdXRcIixcImFycm93XCIsXCJleGl0XCJdLFwibWFpbFwiOltcImVtYWlsXCIsXCJtZXNzYWdlXCJdLFwibWFwLXBpblwiOltcImxvY2F0aW9uXCIsXCJuYXZpZ2F0aW9uXCIsXCJ0cmF2ZWxcIixcIm1hcmtlclwiXSxcIm1hcFwiOltcImxvY2F0aW9uXCIsXCJuYXZpZ2F0aW9uXCIsXCJ0cmF2ZWxcIl0sXCJtYXhpbWl6ZVwiOltcImZ1bGxzY3JlZW5cIl0sXCJtYXhpbWl6ZS0yXCI6W1wiZnVsbHNjcmVlblwiLFwiYXJyb3dzXCIsXCJleHBhbmRcIl0sXCJtZWhcIjpbXCJlbW9qaVwiLFwiZmFjZVwiLFwibmV1dHJhbFwiLFwiZW1vdGlvblwiXSxcIm1lbnVcIjpbXCJiYXJzXCIsXCJuYXZpZ2F0aW9uXCIsXCJoYW1idXJnZXJcIl0sXCJtZXNzYWdlLWNpcmNsZVwiOltcImNvbW1lbnRcIixcImNoYXRcIl0sXCJtZXNzYWdlLXNxdWFyZVwiOltcImNvbW1lbnRcIixcImNoYXRcIl0sXCJtaWMtb2ZmXCI6W1wicmVjb3JkXCIsXCJzb3VuZFwiLFwibXV0ZVwiXSxcIm1pY1wiOltcInJlY29yZFwiLFwic291bmRcIixcImxpc3RlblwiXSxcIm1pbmltaXplXCI6W1wiZXhpdCBmdWxsc2NyZWVuXCIsXCJjbG9zZVwiXSxcIm1pbmltaXplLTJcIjpbXCJleGl0IGZ1bGxzY3JlZW5cIixcImFycm93c1wiLFwiY2xvc2VcIl0sXCJtaW51c1wiOltcInN1YnRyYWN0XCJdLFwibW9uaXRvclwiOltcInR2XCIsXCJzY3JlZW5cIixcImRpc3BsYXlcIl0sXCJtb29uXCI6W1wiZGFya1wiLFwibmlnaHRcIl0sXCJtb3JlLWhvcml6b250YWxcIjpbXCJlbGxpcHNpc1wiXSxcIm1vcmUtdmVydGljYWxcIjpbXCJlbGxpcHNpc1wiXSxcIm1vdXNlLXBvaW50ZXJcIjpbXCJhcnJvd1wiLFwiY3Vyc29yXCJdLFwibW92ZVwiOltcImFycm93c1wiXSxcIm11c2ljXCI6W1wibm90ZVwiXSxcIm5hdmlnYXRpb25cIjpbXCJsb2NhdGlvblwiLFwidHJhdmVsXCJdLFwibmF2aWdhdGlvbi0yXCI6W1wibG9jYXRpb25cIixcInRyYXZlbFwiXSxcIm9jdGFnb25cIjpbXCJzdG9wXCJdLFwicGFja2FnZVwiOltcImJveFwiLFwiY29udGFpbmVyXCJdLFwicGFwZXJjbGlwXCI6W1wiYXR0YWNobWVudFwiXSxcInBhdXNlXCI6W1wibXVzaWNcIixcInN0b3BcIl0sXCJwYXVzZS1jaXJjbGVcIjpbXCJtdXNpY1wiLFwiYXVkaW9cIixcInN0b3BcIl0sXCJwZW4tdG9vbFwiOltcInZlY3RvclwiLFwiZHJhd2luZ1wiXSxcInBlcmNlbnRcIjpbXCJkaXNjb3VudFwiXSxcInBob25lLWNhbGxcIjpbXCJyaW5nXCJdLFwicGhvbmUtZm9yd2FyZGVkXCI6W1wiY2FsbFwiXSxcInBob25lLWluY29taW5nXCI6W1wiY2FsbFwiXSxcInBob25lLW1pc3NlZFwiOltcImNhbGxcIl0sXCJwaG9uZS1vZmZcIjpbXCJjYWxsXCIsXCJtdXRlXCJdLFwicGhvbmUtb3V0Z29pbmdcIjpbXCJjYWxsXCJdLFwicGhvbmVcIjpbXCJjYWxsXCJdLFwicGxheVwiOltcIm11c2ljXCIsXCJzdGFydFwiXSxcInBpZS1jaGFydFwiOltcInN0YXRpc3RpY3NcIixcImRpYWdyYW1cIl0sXCJwbGF5LWNpcmNsZVwiOltcIm11c2ljXCIsXCJzdGFydFwiXSxcInBsdXNcIjpbXCJhZGRcIixcIm5ld1wiXSxcInBsdXMtY2lyY2xlXCI6W1wiYWRkXCIsXCJuZXdcIl0sXCJwbHVzLXNxdWFyZVwiOltcImFkZFwiLFwibmV3XCJdLFwicG9ja2V0XCI6W1wibG9nb1wiLFwic2F2ZVwiXSxcInBvd2VyXCI6W1wib25cIixcIm9mZlwiXSxcInByaW50ZXJcIjpbXCJmYXhcIixcIm9mZmljZVwiLFwiZGV2aWNlXCJdLFwicmFkaW9cIjpbXCJzaWduYWxcIl0sXCJyZWZyZXNoLWN3XCI6W1wic3luY2hyb25pc2VcIixcImFycm93c1wiXSxcInJlZnJlc2gtY2N3XCI6W1wiYXJyb3dzXCJdLFwicmVwZWF0XCI6W1wibG9vcFwiLFwiYXJyb3dzXCJdLFwicmV3aW5kXCI6W1wibXVzaWNcIl0sXCJyb3RhdGUtY2N3XCI6W1wiYXJyb3dcIl0sXCJyb3RhdGUtY3dcIjpbXCJhcnJvd1wiXSxcInJzc1wiOltcImZlZWRcIixcInN1YnNjcmliZVwiXSxcInNhdmVcIjpbXCJmbG9wcHkgZGlza1wiXSxcInNjaXNzb3JzXCI6W1wiY3V0XCJdLFwic2VhcmNoXCI6W1wiZmluZFwiLFwibWFnbmlmaWVyXCIsXCJtYWduaWZ5aW5nIGdsYXNzXCJdLFwic2VuZFwiOltcIm1lc3NhZ2VcIixcIm1haWxcIixcImVtYWlsXCIsXCJwYXBlciBhaXJwbGFuZVwiLFwicGFwZXIgYWVyb3BsYW5lXCJdLFwic2V0dGluZ3NcIjpbXCJjb2dcIixcImVkaXRcIixcImdlYXJcIixcInByZWZlcmVuY2VzXCJdLFwic2hhcmUtMlwiOltcIm5ldHdvcmtcIixcImNvbm5lY3Rpb25zXCJdLFwic2hpZWxkXCI6W1wic2VjdXJpdHlcIixcInNlY3VyZVwiXSxcInNoaWVsZC1vZmZcIjpbXCJzZWN1cml0eVwiLFwiaW5zZWN1cmVcIl0sXCJzaG9wcGluZy1iYWdcIjpbXCJlY29tbWVyY2VcIixcImNhcnRcIixcInB1cmNoYXNlXCIsXCJzdG9yZVwiXSxcInNob3BwaW5nLWNhcnRcIjpbXCJlY29tbWVyY2VcIixcImNhcnRcIixcInB1cmNoYXNlXCIsXCJzdG9yZVwiXSxcInNodWZmbGVcIjpbXCJtdXNpY1wiXSxcInNraXAtYmFja1wiOltcIm11c2ljXCJdLFwic2tpcC1mb3J3YXJkXCI6W1wibXVzaWNcIl0sXCJzbGFja1wiOltcImxvZ29cIl0sXCJzbGFzaFwiOltcImJhblwiLFwibm9cIl0sXCJzbGlkZXJzXCI6W1wic2V0dGluZ3NcIixcImNvbnRyb2xzXCJdLFwic21hcnRwaG9uZVwiOltcImNlbGxwaG9uZVwiLFwiZGV2aWNlXCJdLFwic21pbGVcIjpbXCJlbW9qaVwiLFwiZmFjZVwiLFwiaGFwcHlcIixcImdvb2RcIixcImVtb3Rpb25cIl0sXCJzcGVha2VyXCI6W1wiYXVkaW9cIixcIm11c2ljXCJdLFwic3RhclwiOltcImJvb2ttYXJrXCIsXCJmYXZvcml0ZVwiLFwibGlrZVwiXSxcInN0b3AtY2lyY2xlXCI6W1wibWVkaWFcIixcIm11c2ljXCJdLFwic3VuXCI6W1wiYnJpZ2h0bmVzc1wiLFwid2VhdGhlclwiLFwibGlnaHRcIl0sXCJzdW5yaXNlXCI6W1wid2VhdGhlclwiLFwidGltZVwiLFwibW9ybmluZ1wiLFwiZGF5XCJdLFwic3Vuc2V0XCI6W1wid2VhdGhlclwiLFwidGltZVwiLFwiZXZlbmluZ1wiLFwibmlnaHRcIl0sXCJ0YWJsZXRcIjpbXCJkZXZpY2VcIl0sXCJ0YWdcIjpbXCJsYWJlbFwiXSxcInRhcmdldFwiOltcImxvZ29cIixcImJ1bGxzZXllXCJdLFwidGVybWluYWxcIjpbXCJjb2RlXCIsXCJjb21tYW5kIGxpbmVcIixcInByb21wdFwiXSxcInRoZXJtb21ldGVyXCI6W1widGVtcGVyYXR1cmVcIixcImNlbHNpdXNcIixcImZhaHJlbmhlaXRcIixcIndlYXRoZXJcIl0sXCJ0aHVtYnMtZG93blwiOltcImRpc2xpa2VcIixcImJhZFwiLFwiZW1vdGlvblwiXSxcInRodW1icy11cFwiOltcImxpa2VcIixcImdvb2RcIixcImVtb3Rpb25cIl0sXCJ0b2dnbGUtbGVmdFwiOltcIm9uXCIsXCJvZmZcIixcInN3aXRjaFwiXSxcInRvZ2dsZS1yaWdodFwiOltcIm9uXCIsXCJvZmZcIixcInN3aXRjaFwiXSxcInRvb2xcIjpbXCJzZXR0aW5nc1wiLFwic3Bhbm5lclwiXSxcInRyYXNoXCI6W1wiZ2FyYmFnZVwiLFwiZGVsZXRlXCIsXCJyZW1vdmVcIixcImJpblwiXSxcInRyYXNoLTJcIjpbXCJnYXJiYWdlXCIsXCJkZWxldGVcIixcInJlbW92ZVwiLFwiYmluXCJdLFwidHJpYW5nbGVcIjpbXCJkZWx0YVwiXSxcInRydWNrXCI6W1wiZGVsaXZlcnlcIixcInZhblwiLFwic2hpcHBpbmdcIixcInRyYW5zcG9ydFwiLFwibG9ycnlcIl0sXCJ0dlwiOltcInRlbGV2aXNpb25cIixcInN0cmVhbVwiXSxcInR3aXRjaFwiOltcImxvZ29cIl0sXCJ0d2l0dGVyXCI6W1wibG9nb1wiLFwic29jaWFsXCJdLFwidHlwZVwiOltcInRleHRcIl0sXCJ1bWJyZWxsYVwiOltcInJhaW5cIixcIndlYXRoZXJcIl0sXCJ1bmxvY2tcIjpbXCJzZWN1cml0eVwiXSxcInVzZXItY2hlY2tcIjpbXCJmb2xsb3dlZFwiLFwic3Vic2NyaWJlZFwiXSxcInVzZXItbWludXNcIjpbXCJkZWxldGVcIixcInJlbW92ZVwiLFwidW5mb2xsb3dcIixcInVuc3Vic2NyaWJlXCJdLFwidXNlci1wbHVzXCI6W1wibmV3XCIsXCJhZGRcIixcImNyZWF0ZVwiLFwiZm9sbG93XCIsXCJzdWJzY3JpYmVcIl0sXCJ1c2VyLXhcIjpbXCJkZWxldGVcIixcInJlbW92ZVwiLFwidW5mb2xsb3dcIixcInVuc3Vic2NyaWJlXCIsXCJ1bmF2YWlsYWJsZVwiXSxcInVzZXJcIjpbXCJwZXJzb25cIixcImFjY291bnRcIl0sXCJ1c2Vyc1wiOltcImdyb3VwXCJdLFwidmlkZW8tb2ZmXCI6W1wiY2FtZXJhXCIsXCJtb3ZpZVwiLFwiZmlsbVwiXSxcInZpZGVvXCI6W1wiY2FtZXJhXCIsXCJtb3ZpZVwiLFwiZmlsbVwiXSxcInZvaWNlbWFpbFwiOltcInBob25lXCJdLFwidm9sdW1lXCI6W1wibXVzaWNcIixcInNvdW5kXCIsXCJtdXRlXCJdLFwidm9sdW1lLTFcIjpbXCJtdXNpY1wiLFwic291bmRcIl0sXCJ2b2x1bWUtMlwiOltcIm11c2ljXCIsXCJzb3VuZFwiXSxcInZvbHVtZS14XCI6W1wibXVzaWNcIixcInNvdW5kXCIsXCJtdXRlXCJdLFwid2F0Y2hcIjpbXCJjbG9ja1wiLFwidGltZVwiXSxcIndpZmktb2ZmXCI6W1wiZGlzYWJsZWRcIl0sXCJ3aWZpXCI6W1wiY29ubmVjdGlvblwiLFwic2lnbmFsXCIsXCJ3aXJlbGVzc1wiXSxcIndpbmRcIjpbXCJ3ZWF0aGVyXCIsXCJhaXJcIl0sXCJ4LWNpcmNsZVwiOltcImNhbmNlbFwiLFwiY2xvc2VcIixcImRlbGV0ZVwiLFwicmVtb3ZlXCIsXCJ0aW1lc1wiLFwiY2xlYXJcIl0sXCJ4LW9jdGFnb25cIjpbXCJkZWxldGVcIixcInN0b3BcIixcImFsZXJ0XCIsXCJ3YXJuaW5nXCIsXCJ0aW1lc1wiLFwiY2xlYXJcIl0sXCJ4LXNxdWFyZVwiOltcImNhbmNlbFwiLFwiY2xvc2VcIixcImRlbGV0ZVwiLFwicmVtb3ZlXCIsXCJ0aW1lc1wiLFwiY2xlYXJcIl0sXCJ4XCI6W1wiY2FuY2VsXCIsXCJjbG9zZVwiLFwiZGVsZXRlXCIsXCJyZW1vdmVcIixcInRpbWVzXCIsXCJjbGVhclwiXSxcInlvdXR1YmVcIjpbXCJsb2dvXCIsXCJ2aWRlb1wiLFwicGxheVwiXSxcInphcC1vZmZcIjpbXCJmbGFzaFwiLFwiY2FtZXJhXCIsXCJsaWdodG5pbmdcIl0sXCJ6YXBcIjpbXCJmbGFzaFwiLFwiY2FtZXJhXCIsXCJsaWdodG5pbmdcIl0sXCJ6b29tLWluXCI6W1wibWFnbmlmeWluZyBnbGFzc1wiXSxcInpvb20tb3V0XCI6W1wibWFnbmlmeWluZyBnbGFzc1wiXX07XG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL3RvLXN2Zy5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvdG8tc3ZnLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2ljb25zID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9pY29ucyAqLyBcIi4vc3JjL2ljb25zLmpzXCIpO1xuXG52YXIgX2ljb25zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ljb25zKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBDcmVhdGUgYW4gU1ZHIHN0cmluZy5cbiAqIEBkZXByZWNhdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB0b1N2ZyhuYW1lKSB7XG4gIHZhciBhdHRycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgY29uc29sZS53YXJuKCdmZWF0aGVyLnRvU3ZnKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBmZWF0aGVyLmljb25zW25hbWVdLnRvU3ZnKCkgaW5zdGVhZC4nKTtcblxuICBpZiAoIW5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZXF1aXJlZCBga2V5YCAoaWNvbiBuYW1lKSBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKTtcbiAgfVxuXG4gIGlmICghX2ljb25zMi5kZWZhdWx0W25hbWVdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBpY29uIG1hdGNoaW5nIFxcJycgKyBuYW1lICsgJ1xcJy4gU2VlIHRoZSBjb21wbGV0ZSBsaXN0IG9mIGljb25zIGF0IGh0dHBzOi8vZmVhdGhlcmljb25zLmNvbScpO1xuICB9XG5cbiAgcmV0dXJuIF9pY29uczIuZGVmYXVsdFtuYW1lXS50b1N2ZyhhdHRycyk7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRvU3ZnO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gMDpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIG11bHRpIGNvcmUtanMvZXMvYXJyYXkvZnJvbSAuL3NyYy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgY29yZS1qcy9lcy9hcnJheS9mcm9tICovXCIuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzL2FycmF5L2Zyb20uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC9ob21lL3J1bm5lci93b3JrL2ZlYXRoZXIvZmVhdGhlci9zcmMvaW5kZXguanMgKi9cIi4vc3JjL2luZGV4LmpzXCIpO1xuXG5cbi8qKiovIH0pXG5cbi8qKioqKiovIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mZWF0aGVyLmpzLm1hcCIsIi8qKlxyXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyB2YXJpb3VzIHV0aWxpdHkgZnVuY3Rpb25zIGNvbW1vbmx5IHVzZWQgaW4gT2JzaWRpYW4gcGx1Z2lucy5cclxuICogQG1vZHVsZSBvYnNpZGlhbi1jb21tdW5pdHktbGliXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBmZWF0aGVyIGZyb20gXCJmZWF0aGVyLWljb25zXCI7XHJcbmltcG9ydCB7IGFkZEljb24sIE1hcmtkb3duUmVuZGVyZXIsIE1hcmtkb3duVmlldywgTW9kYWwsIG5vcm1hbGl6ZVBhdGgsIE5vdGljZSwgcmVxdWVzdCwgVEZpbGUsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbi8qKlxyXG4gKiBZb3UgY2FuIGF3YWl0IHRoaXMgRnVuY3Rpb24gdG8gZGVsYXkgZXhlY3V0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBkZWxheSBUaGUgZGVsYXkgaW4gbXNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0KGRlbGF5KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcclxufVxyXG4vKipcclxuICogQWRkcyBhbGwgb2ZmaWNpYWwgRmVhdGhlciBJY29ucyB0byBPYnNpZGlhbi5cclxuICogaHR0cHM6Ly9mZWF0aGVyaWNvbnMuY29tL1xyXG4gKlxyXG4gKiBAcGFyYW0gYXR0ciBTVkcgQXR0cmlidXRlcyBmb3IgdGhlIEljb24uIFRoZSBkZWZhdWx0IHNob3VsZCB3b3JrIGZvciBtb3N0IHVzZWNhc2VzLlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBBcyBvZiBPYnNpZGlhbiAwLjEzLjI3IHRoaXMgaXMgbm8gbG9uZ2VyIG5lZWRlZCwgYmVjYXVzZSBPYnNpZGlhbiBzaGlwcyB3aXRoIGBsdWNpZGVgLCBhIG1haW50YWluZWQgZm9yayBvZiBmZWF0aGVyLiAoaHR0cHM6Ly9sdWNpZGUuZGV2LylcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBbGxGZWF0aGVySWNvbnMoYXR0ciA9IHsgdmlld0JveDogXCIwIDAgMjQgMjRcIiwgd2lkdGg6IFwiMTAwXCIsIGhlaWdodDogXCIxMDBcIiB9KSB7XHJcbiAgICBPYmplY3QudmFsdWVzKGZlYXRoZXIuaWNvbnMpLmZvckVhY2goKGkpID0+IHtcclxuICAgICAgICBjb25zdCBzdmcgPSBpLnRvU3ZnKGF0dHIpO1xyXG4gICAgICAgIGFkZEljb24oYGZlYXRoZXItJHtpLm5hbWV9YCwgc3ZnKTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBBZGRzIGEgc3BlY2lmaWMgRmVhdGhlciBJY29uIHRvIE9ic2lkaWFuLlxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSBvZmZpY2lhbCBOYW1lIG9mIHRoZSBJY29uIChodHRwczovL2ZlYXRoZXJpY29ucy5jb20vKVxyXG4gKiBAcGFyYW0gYXR0ciBTVkcgQXR0cmlidXRlcyBmb3IgdGhlIEljb24uIFRoZSBkZWZhdWx0IHNob3VsZCB3b3JrIGZvciBtb3N0IHVzZWNhc2VzLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBJY29uIG5hbWVcclxuICpcclxuICogQGRlcHJlY2F0ZWQgQXMgb2YgT2JzaWRpYW4gMC4xMy4yNyB0aGlzIGlzIG5vIGxvbmdlciBuZWVkZWQsIGJlY2F1c2UgT2JzaWRpYW4gc2hpcHMgd2l0aCBgbHVjaWRlYCwgYSBtYWludGFpbmVkIGZvcmsgb2YgZmVhdGhlci4gKGh0dHBzOi8vbHVjaWRlLmRldi8pXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkRmVhdGhlckljb24obmFtZSwgYXR0ciA9IHsgdmlld0JveDogXCIwIDAgMjQgMjRcIiwgd2lkdGg6IFwiMTAwXCIsIGhlaWdodDogXCIxMDBcIiB9KSB7XHJcbiAgICBpZiAoZmVhdGhlci5pY29uc1tuYW1lXSkge1xyXG4gICAgICAgIGNvbnN0IGljb25OYW1lID0gYGZlYXRoZXItJHtuYW1lfWA7XHJcbiAgICAgICAgYWRkSWNvbihpY29uTmFtZSwgZmVhdGhlci5pY29uc1tuYW1lXS50b1N2ZyhhdHRyKSk7XHJcbiAgICAgICAgcmV0dXJuIGljb25OYW1lO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoYFRoaXMgSWNvbiAoJHtuYW1lfSkgZG9lc24ndCBleGlzdCBpbiB0aGUgRmVhdGhlciBMaWJyYXJ5LmApO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgYmFzZTY0IFN0cmluZyB0byBhbiBBcnJheUJ1ZmZlci5cclxuICogWW91IGNhbiB0aGVuIHVzZSB0aGUgQXJyYXlCdWZmZXIgdG8gc2F2ZSB0aGUgYXNzZXQgdG8gZGlzay5cclxuICpcclxuICogQHBhcmFtIGJhc2U2NCBiYXNlNjQgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cclxuICogQHJldHVybnMgQXJyYXlCdWZmZXJcclxuICogQGRlcHJlY2F0ZWQgT2JzaWRpYW4gb2ZmZXJzIGl0J3Mgb3duIG1ldGhvZCBhcyBvZiAwLjE0LjVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkge1xyXG4gICAgY29uc3QgYmluYXJ5X3N0cmluZyA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XHJcbiAgICBjb25zdCBsZW4gPSBiaW5hcnlfc3RyaW5nLmxlbmd0aDtcclxuICAgIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlfc3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnl0ZXMuYnVmZmVyO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIGlzIGEgaGVscGVyIG1ldGhvZCBmb3IgYW4gdW5kb2N1bWVudGVkIEFQSSBvZiBPYnNpZGlhbi5cclxuICpcclxuICogQHBhcmFtIGZpbGVOYW1lIFRoZSBGaWxlbmFtZSBmb3IgeW91ciBBdHRhY2htZW50XHJcbiAqIEBwYXJhbSBmb3JtYXQgVGhlIEZpbGVmb3JtYXQgb2YgeW91ciBBdHRhY2htZW50XHJcbiAqIEBwYXJhbSBzb3VyY2VGaWxlIFRoZSBTb3VyY2VmaWxlIGZyb20gd2hlcmUgdGhlIEF0dGFjaG1lbnQgZ2V0cyBhZGRlZCwgdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgQXR0YWNobWVudCBGb2xkZXIgbWlnaHQgYmUgZGlmZmVyZW50IGJhc2VkIG9uIHdoZXJlIGl0IGdldHMgaW5zZXJ0ZWQuXHJcbiAqIEByZXR1cm5zIFRoZSBBdHRhY2htZW50IFBhdGhcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVQYXRoRm9yQXR0YWNobWVudHMoZmlsZU5hbWUsIGZvcm1hdCwgc291cmNlRmlsZSkge1xyXG4gICAgLy9AdHMtZXhwZWN0LWVycm9yXHJcbiAgICByZXR1cm4gYXBwLnZhdWx0LmdldEF2YWlsYWJsZVBhdGhGb3JBdHRhY2htZW50cyhmaWxlTmFtZSwgZm9ybWF0LCBzb3VyY2VGaWxlKTtcclxufVxyXG4vKipcclxuICogQ29weSBgY29udGVudGAgdG8gdGhlIHVzZXJzIGNsaXBib2FyZC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgVGhlIGNvbnRlbnQgdG8gYmUgY29waWVkIHRvIGNsaXBib2FyZC5cclxuICogQHBhcmFtIHsoKSA9PiBhbnl9IHN1Y2Nlc3MgVGhlIGNhbGxiYWNrIHRvIHJ1biB3aGVuIHRleHQgaXMgc3VjY2Vzc2Z1bGx5IGNvcGllZC4gRGVmYXVsdCB0aHJvd3MgYSBuZXcgYE5vdGljZWBcclxuICogQHBhcmFtIHsocmVhc29uPykgPT4gYW55fSBmYWlsdXJlIFRoZSBjYWxsYmFjayB0byBydW4gd2hlbiB0ZXh0IHdhcyBub3QgYWJsZSB0byBiZSBjb3BpZWQuIERlZmF1bHQgdGhyb3dzIGEgbmV3IGBOb3RpY2VgLCBhbmQgY29uc29sZSBsb2dzIHRoZSBlcnJvci5gXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weShjb250ZW50LCBzdWNjZXNzID0gKCkgPT4gbmV3IE5vdGljZShcIkNvcGllZCB0byBjbGlwYm9hcmRcIiksIGZhaWx1cmUgPSAocmVhc29uKSA9PiB7XHJcbiAgICBuZXcgTm90aWNlKFwiQ291bGQgbm90IGNvcHkgdG8gY2xpcGJvYXJkXCIpO1xyXG4gICAgY29uc29sZS5sb2coeyByZWFzb24gfSk7XHJcbn0pIHtcclxuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGNvbnRlbnQpLnRoZW4oc3VjY2VzcywgZmFpbHVyZSk7XHJcbn1cclxuLyoqXHJcbiAqIEdpdmVuIGFuIGVkaXRvciwgY2hlY2sgaWYgc29tZXRoaW5nIGlzIHNlbGVjdGVkIGFuZCByZXR1cm4gdGhhdCBzZWxlY3Rpb24sIG90aGVyd2lzZSByZXR1cm4gdGhlIGVudGlyZSBjb250ZW50IG9mIHRoZSBlZGl0b3JcclxuICogQHBhcmFtICB7RWRpdG9yfSBlZGl0b3JcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3Rpb25Gcm9tRWRpdG9yKGVkaXRvcikge1xyXG4gICAgaWYgKGVkaXRvci5zb21ldGhpbmdTZWxlY3RlZCgpKVxyXG4gICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGVkaXRvci5nZXRWYWx1ZSgpO1xyXG59XHJcbi8qKlxyXG4gKiBDaGVjayBpZiBzb21ldGhpbmcgaXMgc2VsZWN0ZWQgaW4gdGhlIGN1cnJlbnQgZmlsZSBhbmQgcmV0dXJuIHRoYXQgc2VsZWN0aW9uLCBvdGhlcndpc2UgcmV0dXJuIHRoZSBlbnRpcmUgY29udGVudCBvZiB0aGUgY3VycmVudCBmaWxlLlxyXG4gKiBAcGFyYW0gIHtib29sZWFufSBbY2FjaGVkPXRydWVdIFVzZSBgY2FjaGVkUmVhZGAgb3IgYHJlYWRgLiBgY2FjaGVkUmVhZGAgYnkgZGVmYXVsdC5cclxuICogQHJldHVybnMge3N0cmluZyB8IG51bGx9IGBudWxsYCBpZiBub3QgZm9jdXNzZWQgb24gYSBtYXJrZG93biBmaWxlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uRnJvbUN1cnJGaWxlKGNhY2hlZCA9IHRydWUpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IHRleHQgPSAoX2EgPSB3aW5kb3cgPT09IG51bGwgfHwgd2luZG93ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b1N0cmluZygpO1xyXG4gICAgaWYgKHRleHQpXHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IGdldEFjdGl2ZUZpbGVDb250ZW50KGNhY2hlZCk7XHJcbn1cclxuLyoqXHJcbiAqIENoZWNrIGlmIGBub3RlTmFtZWAgaXMgdGhlIG5hbWUgb2YgYSBub3RlIHRoYXQgZXhpc3RzIGluIHRoZSB2YXVsdC5cclxuICogQHBhcmFtICB7c3RyaW5nfSBub3RlTmFtZSBCYXNlbmFtZSBvZiB0aGUgbm90ZSB0byBzZWFyY2ggZm9yLlxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtzb3VyY2VQYXRoPVwiXCJdIE9wdGlvbmFsIGZpbGUgcGF0aCB0byBzdGFydCBzZWFyY2hpbmcgZnJvbS4gRGVmYXVsdCBpcyB0aGUgY3VycmVudCBmaWxlLlxyXG4gKiBAcmV0dXJucyBib29sZWFuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaXNJblZhdWx0ID0gKG5vdGVOYW1lLCBzb3VyY2VQYXRoID0gXCJcIikgPT4gISFhcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChub3RlTmFtZSwgc291cmNlUGF0aCk7XHJcbi8qKlxyXG4gKiBXaGVuIGhvdmVyaW5nIGEgbGluayBnb2luZyB0byBgdG9gLCBzaG93IHRoZSBPYnNpZGlhbiBob3Zlci1wcmV2aWV3IG9mIHRoYXQgbm90ZS5cclxuICpcclxuICogWW91IHByb2JhYmx5IGhhdmUgdG8gaG9sZCBkb3duIGBDdHJsYCB3aGVuIGhvdmVyaW5nIHRoZSBsaW5rIGZvciB0aGUgcHJldmlldyB0byBhcHBlYXIhXHJcbiAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGV2ZW50XHJcbiAqIEBwYXJhbSAge1lvdXJWaWV3fSB2aWV3IFRoZSB2aWV3IHdpdGggdGhlIGxpbmsgYmVpbmcgaG92ZXJlZFxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHRvIFRoZSBiYXNlbmFtZSBvZiB0aGUgbm90ZSB0byBwcmV2aWV3LlxyXG4gKiBAdGVtcGxhdGUgWW91clZpZXcgVGhlIFZpZXdUeXBlIG9mIHlvdXIgdmlld1xyXG4gKiBAcmV0dXJucyB2b2lkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaG92ZXJQcmV2aWV3KGV2ZW50LCB2aWV3LCB0bykge1xyXG4gICAgY29uc3QgdGFyZ2V0RWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBhcHAud29ya3NwYWNlLnRyaWdnZXIoXCJob3Zlci1saW5rXCIsIHtcclxuICAgICAgICBldmVudCxcclxuICAgICAgICBzb3VyY2U6IHZpZXcuZ2V0Vmlld1R5cGUoKSxcclxuICAgICAgICBob3ZlclBhcmVudDogdmlldyxcclxuICAgICAgICB0YXJnZXRFbCxcclxuICAgICAgICBsaW5rdGV4dDogdG8sXHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IG1hcmtkb3duIG5vdGUgbmFtZWQgYG5ld05hbWVgIGluIHRoZSB1c2VyJ3MgcHJlZmZlcmVkIG5ldy1ub3RlLWZvbGRlci5cclxuICogQHBhcmFtICB7c3RyaW5nfSBuZXdOYW1lIE5hbWUgb2YgbmV3IG5vdGUgKHdpdGggb3Igd2l0aG91dCAnLm1kJylcclxuICogQHBhcmFtICB7c3RyaW5nfSBbY3VyckZpbGVQYXRoPVwiXCJdIEZpbGUgcGF0aCBvZiB0aGUgY3VycmVudCBub3RlLiBVc2UgYW4gZW1wdHkgc3RyaW5nIGlmIHRoZXJlIGlzIG5vIGFjdGl2ZSBmaWxlLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxURmlsZT59IG5ldyBURmlsZVxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU5ld01ETm90ZShuZXdOYW1lLCBjdXJyRmlsZVBhdGggPSBcIlwiKSB7XHJcbiAgICBjb25zdCBuZXdGaWxlRm9sZGVyID0gYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoY3VyckZpbGVQYXRoKS5wYXRoO1xyXG4gICAgY29uc3QgbmV3RmlsZVBhdGggPSBub3JtYWxpemVQYXRoKGAke25ld0ZpbGVGb2xkZXJ9JHtuZXdGaWxlRm9sZGVyID09PSBcIi9cIiA/IFwiXCIgOiBcIi9cIn0ke2FkZE1EKG5ld05hbWUpfWApO1xyXG4gICAgcmV0dXJuIGF3YWl0IGFwcC52YXVsdC5jcmVhdGUobmV3RmlsZVBhdGgsIFwiXCIpO1xyXG59XHJcbi8qKlxyXG4gKiBBZGQgJy5tZCcgdG8gYG5vdGVOYW1lYCBpZiBpdCBpc24ndCBhbHJlYWR5IHRoZXJlLlxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IG5vdGVOYW1lIHdpdGggb3Igd2l0aG91dCAnLm1kJyBvbiB0aGUgZW5kLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBub3RlTmFtZSB3aXRoICcubWQnIG9uIHRoZSBlbmQuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYWRkTUQgPSAobm90ZU5hbWUpID0+IHtcclxuICAgIHJldHVybiBub3RlTmFtZS5tYXRjaCgvXFwuTUQkfFxcLm1kJC9tKSA/IG5vdGVOYW1lIDogbm90ZU5hbWUgKyBcIi5tZFwiO1xyXG59O1xyXG4vKipcclxuICogU3RyaXAgJy5tZCcgb2ZmIHRoZSBlbmQgb2YgYSBub3RlIG5hbWUgdG8gZ2V0IGl0cyBiYXNlbmFtZS5cclxuICpcclxuICogV29ya3Mgd2l0aCB0aGUgZWRnZWNhc2Ugd2hlcmUgYSBub3RlIGhhcyAnLm1kJyBpbiBpdHMgYmFzZW5hbWU6IGBPYnNpZGlhbi5tZC5tZGAsIGZvciBleGFtcGxlLlxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IG5vdGVOYW1lIHdpdGggb3Igd2l0aG91dCAnLm1kJyBvbiB0aGUgZW5kLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBub3RlTmFtZSB3aXRob3V0ICcubWQnXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgc3RyaXBNRCA9IChub3RlTmFtZSkgPT4ge1xyXG4gICAgaWYgKG5vdGVOYW1lLm1hdGNoKC9cXC5NRCR8XFwubWQkL20pKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vdGVOYW1lLnNwbGl0KC9cXC5NRCR8XFwubWQkL20pLnNsaWNlKDAsIC0xKS5qb2luKFwiLm1kXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBub3RlTmFtZTtcclxufTtcclxuLyoqXHJcbiAqIFdoZW4gY2xpY2tpbmcgYSBsaW5rLCBjaGVjayBpZiB0aGF0IG5vdGUgaXMgYWxyZWFkeSBvcGVuIGluIGFub3RoZXIgbGVhZiwgYW5kIHN3aXRjaCB0byB0aGF0IGxlYWYsIGlmIHNvLiBPdGhlcndpc2UsIG9wZW4gdGhlIG5vdGUgaW4gYSBuZXcgcGFuZS5cclxuICogQHBhcmFtICB7c3RyaW5nfSBkZXN0IE5hbWUgb2Ygbm90ZSB0byBvcGVuLiBJZiB5b3Ugd2FudCB0byBvcGVuIGEgbm9uLW1kIG5vdGUsIGJlIHN1cmUgdG8gYWRkIHRoZSBmaWxlIGV4dGVuc2lvbi5cclxuICogQHBhcmFtICB7TW91c2VFdmVudH0gZXZlbnRcclxuICogQHBhcmFtICB7e2NyZWF0ZU5ld0ZpbGU6Ym9vbGVhbn19IFtvcHRpb25zPXtjcmVhdGVOZXdGaWxlOnRydWV9XSBXaGV0aGVyIG9yIG5vdCB0byBjcmVhdGUgYGRlc3RgIGZpbGUgaWYgaXQgZG9lc24ndCBleGlzdC4gSWYgYGZhbHNlYCwgc2ltcGx5IHJldHVybiBmcm9tIHRoZSBmdW5jdGlvbi5cclxuICogQHJldHVybnMgUHJvbWlzZVxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5PclN3aXRjaChkZXN0LCBldmVudCwgb3B0aW9ucyA9IHsgY3JlYXRlTmV3RmlsZTogdHJ1ZSB9KSB7XHJcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gYXBwO1xyXG4gICAgbGV0IGRlc3RGaWxlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoZGVzdCwgXCJcIik7XHJcbiAgICAvLyBJZiBkZXN0IGRvZXNuJ3QgZXhpc3QsIG1ha2UgaXRcclxuICAgIGlmICghZGVzdEZpbGUgJiYgb3B0aW9ucy5jcmVhdGVOZXdGaWxlKSB7XHJcbiAgICAgICAgZGVzdEZpbGUgPSBhd2FpdCBjcmVhdGVOZXdNRE5vdGUoZGVzdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghZGVzdEZpbGUgJiYgIW9wdGlvbnMuY3JlYXRlTmV3RmlsZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAvLyBDaGVjayBpZiBpdCdzIGFscmVhZHkgb3BlblxyXG4gICAgY29uc3QgbGVhdmVzV2l0aERlc3RBbHJlYWR5T3BlbiA9IFtdO1xyXG4gICAgLy8gRm9yIGFsbCBvcGVuIGxlYXZlcywgaWYgdGhlIGxlYXZlJ3MgYmFzZW5hbWUgaXMgZXF1YWwgdG8gdGhlIGxpbmsgZGVzdGluYXRpb24sIHJhdGhlciBhY3RpdmF0ZSB0aGF0IGxlYWYgaW5zdGVhZCBvZiBvcGVuaW5nIGl0IGluIHR3byBwYW5lc1xyXG4gICAgd29ya3NwYWNlLml0ZXJhdGVBbGxMZWF2ZXMoKGxlYWYpID0+IHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlldykge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gKF9hID0gbGVhZi52aWV3KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmlsZTtcclxuICAgICAgICAgICAgaWYgKGZpbGUgJiYgZmlsZS5iYXNlbmFtZSArIFwiLlwiICsgZmlsZS5leHRlbnNpb24gPT09IGRlc3QpIHtcclxuICAgICAgICAgICAgICAgIGxlYXZlc1dpdGhEZXN0QWxyZWFkeU9wZW4ucHVzaChsZWFmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gUmF0aGVyIHN3aXRjaCB0byBpdCBpZiBpdCBpcyBvcGVuXHJcbiAgICBpZiAobGVhdmVzV2l0aERlc3RBbHJlYWR5T3Blbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgd29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhdmVzV2l0aERlc3RBbHJlYWR5T3BlblswXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgbW9kZSA9IGFwcC52YXVsdC5nZXRDb25maWcoXCJkZWZhdWx0Vmlld01vZGVcIik7XHJcbiAgICAgICAgY29uc3QgbGVhZiA9IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuZ2V0TW9kaWZpZXJTdGF0ZShcIk1ldGFcIilcclxuICAgICAgICAgICAgPyB3b3Jrc3BhY2Uuc3BsaXRBY3RpdmVMZWFmKClcclxuICAgICAgICAgICAgOiB3b3Jrc3BhY2UuZ2V0VW5waW5uZWRMZWFmKCk7XHJcbiAgICAgICAgLy9AdHMtZXhwZWN0LWVycm9yXHJcbiAgICAgICAgYXdhaXQgbGVhZi5vcGVuRmlsZShkZXN0RmlsZSwgeyBhY3RpdmU6IHRydWUsIG1vZGUgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdpdmVuIGEgbGlzdCBvZiByZXNvbHZlZCBsaW5rcyBmcm9tIGFwcC5tZXRhZGF0YUNhY2hlLCBjaGVjayBpZiBgZnJvbWAgaGFzIGEgbGluayB0byBgdG9gXHJcbiAqIEBwYXJhbSAge1Jlc29sdmVkTGlua3N9IHJlc29sdmVkTGlua3NcclxuICogQHBhcmFtICB7c3RyaW5nfSBmcm9tIE5vdGUgbmFtZSB3aXRoIGxpbmsgbGVhdmluZyAoV2l0aCBvciB3aXRob3V0ICcubWQnKVxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHRvIE5vdGUgbmFtZSB3aXRoIGxpbmsgYXJyaXZpbmcgKFdpdGggb3Igd2l0aG91dCAnLm1kJylcclxuICogQHBhcmFtIHtib29sZWFufSBbZGlyZWN0ZWQ9dHJ1ZV0gT25seSBjaGVjayBpZiBgZnJvbWAgaGFzIGEgbGluayB0byBgdG9gLiBJZiBub3QgZGlyZWN0ZWQsIGNoZWNrIGluIGJvdGggZGlyZWN0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTGlua2VkKHJlc29sdmVkTGlua3MsIGZyb20sIHRvLCBkaXJlY3RlZCA9IHRydWUpIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBmcm9tID0gYWRkTUQoZnJvbSk7XHJcbiAgICB0byA9IGFkZE1EKHRvKTtcclxuICAgIGNvbnN0IGZyb21UbyA9IChfYSA9IHJlc29sdmVkTGlua3NbZnJvbV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5oYXNPd25Qcm9wZXJ0eSh0byk7XHJcbiAgICBpZiAoIWZyb21UbyAmJiAhZGlyZWN0ZWQpIHtcclxuICAgICAgICBjb25zdCB0b0Zyb20gPSAoX2IgPSByZXNvbHZlZExpbmtzW3RvXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhhc093blByb3BlcnR5KGZyb20pO1xyXG4gICAgICAgIHJldHVybiB0b0Zyb207XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGZyb21UbztcclxufVxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGxpbmsgYGZyb21gIOKGkiBgdG9gIGlzIHJlc29sdmVkIG9yIG5vdC5cclxuICogQHBhcmFtICB7c3RyaW5nfSB0b1xyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGZyb21cclxuICogQHJldHVybnMgYm9vbGVhblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzb2x2ZWQodG8sIGZyb20pIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IHsgcmVzb2x2ZWRMaW5rcyB9ID0gYXBwLm1ldGFkYXRhQ2FjaGU7XHJcbiAgICByZXR1cm4gKChfYSA9IHJlc29sdmVkTGlua3MgPT09IG51bGwgfHwgcmVzb2x2ZWRMaW5rcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVzb2x2ZWRMaW5rc1thZGRNRChmcm9tKV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVthZGRNRCh0byldKSA+IDA7XHJcbn1cclxuLyoqXHJcbiAqIE9wZW4geW91ciB2aWV3IG9uIHRoZSBjaG9zZW4gYHNpZGVgIGlmIGl0IGlzbid0IGFscmVhZHkgb3BlblxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHZpZXdUeXBlXHJcbiAqIEBwYXJhbSAge0NvbnN0cnVjdG9yPFlvdXJWaWV3Pn0gdmlld0NsYXNzIFRoZSBjbGFzcyBjb25zdHJ1Y3RvciBvZiB5b3VyIHZpZXdcclxuICogQHBhcmFtICB7XCJsZWZ0XCJ8XCJyaWdodFwifSBbc2lkZT1cInJpZ2h0XCJdXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPFlvdXJWaWV3Pn0gVGhlIG9wZW5lZCB2aWV3XHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3BlblZpZXcodmlld1R5cGUsIHZpZXdDbGFzcywgc2lkZSA9IFwicmlnaHRcIikge1xyXG4gICAgbGV0IGxlYWYgPSBudWxsO1xyXG4gICAgZm9yIChsZWFmIG9mIGFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKHZpZXdUeXBlKSkge1xyXG4gICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiB2aWV3Q2xhc3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlYWYudmlldztcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBcImVtcHR5XCIgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBsZWFmID1cclxuICAgICAgICAobGVhZiAhPT0gbnVsbCAmJiBsZWFmICE9PSB2b2lkIDAgPyBsZWFmIDogc2lkZSA9PT0gXCJyaWdodFwiKVxyXG4gICAgICAgICAgICA/IGFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKVxyXG4gICAgICAgICAgICA6IGFwcC53b3Jrc3BhY2UuZ2V0TGVmdExlYWYoZmFsc2UpO1xyXG4gICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xyXG4gICAgICAgIHR5cGU6IHZpZXdUeXBlLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGxlYWYudmlldztcclxufVxyXG4vKipcclxuICogQ2hlY2sgd2hpY2ggc2lkZSBvZiB0aGUgd29ya3NwYWNlIHlvdXIgYHZpZXdUeXBlYCBpcyBvbiwgYW5kIHNhdmUgaXQgaW50byBgcGx1Z2luLnNldHRpbmdzW3NldHRpbmdOYW1lXWAuXHJcbiAqXHJcbiAqICoqVGlwKio6IFJ1biB0aGlzIGZ1bmN0aW9uIG9uIGBwbHVnaW4udW5sb2FkYCB0byBzYXZlIHRoZSBsYXN0IHNpZGUgeW91ciB2aWV3IHdhcyBvbiB3aGVuIGNsb3NpbmcsIHRoZW4ge0BsaW5rIG9wZW5WaWV3fSBvbiB0aGUgc2FtZSBzaWRlIGl0IHdhcyBsYXN0LlxyXG4gKiBAcGFyYW0gIHtZb3VyUGx1Z2lufSBwbHVnaW5cclxuICogQHBhcmFtICB7c3RyaW5nfSB2aWV3VHlwZVxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHNldHRpbmdOYW1lXHJcbiAqIEByZXR1cm5zIHtcImxlZnRcIiB8IFwicmlnaHRcIn0gYHNpZGVgXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZVZpZXdTaWRlKHBsdWdpbiwgdmlld1R5cGUsIHNldHRpbmdOYW1lKSB7XHJcbiAgICBjb25zdCBsZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUodmlld1R5cGUpWzBdO1xyXG4gICAgaWYgKCFsZWFmKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBPYnNpZGlhbi1Db21tdW5pdHktTGliOiBObyBpbnN0YW5jZSBvZiAnJHt2aWV3VHlwZX0nIG9wZW4sIGNhbm5vdCBzYXZlIHNpZGVgKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvL0B0cy1pZ25vcmVcclxuICAgIGNvbnN0IHNpZGUgPSBsZWFmLmdldFJvb3QoKS5zaWRlO1xyXG4gICAgLy9AdHMtaWdub3JlXHJcbiAgICBwbHVnaW4uc2V0dGluZ3Nbc2V0dGluZ05hbWVdID0gc2lkZTtcclxuICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgcmV0dXJuIHNpZGU7XHJcbn1cclxuLyoqXHJcbiAqIEEgTW9kYWwgdXNlZCBpbiB7QGxpbmsgYWRkUmVuZGVyZWRNYXJrZG93bkJ1dHRvbn0gdG8gZGlzcGxheSByZW5kZXJlZCBtYXJrZG93biBmcm9tIGEgcmF3IHN0cmluZywgb3IgZmV0Y2hlZCBmcm9tIGEgcHJvdmlkZWQgdXJsLlxyXG4gKlxyXG4gKiAhW10oaHR0cHM6Ly9pLmltZ3VyLmNvbS9OTXdNNTBFLnBuZylcclxuICogQHBhcmFtICB7WW91clBsdWdpbn0gcGx1Z2luXHJcbiAqIEBwYXJhbSAge3N0cmluZ30gc291cmNlIFJhdyBtYXJrZG93biBjb250ZW50IG9yIHVybCB0byBmaW5kIHJhdyBtYXJrZG93bi5cclxuICogQHBhcmFtICB7Ym9vbGVhbn0gZmV0Y2ggVHJ1ZSDihpIgZmV0Y2ggbWFya2Rvd24gZnJvbSBgc291cmNlYCBhcyB1cmwuIEZhbHNlIOKGkiBgc291cmNlYCBpcyBhbHJlYWR5IGEgbWFya2Rvd24gc3RyaW5nLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbmRlcmVkTWFya2Rvd25Nb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbiwgc291cmNlLCBmZXRjaCkge1xyXG4gICAgICAgIHN1cGVyKGFwcCk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5mZXRjaCA9IGZldGNoO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgb25PcGVuKCkge1xyXG4gICAgICAgIGxldCB7IGNvbnRlbnRFbCwgc291cmNlLCBwbHVnaW4sIGZldGNoIH0gPSB0aGlzO1xyXG4gICAgICAgIGxldCBjb250ZW50ID0gc291cmNlO1xyXG4gICAgICAgIGlmIChmZXRjaCkge1xyXG4gICAgICAgICAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgdGV4dDogYFdhaXRpbmcgZm9yIGNvbnRlbnQgZnJvbTogJyR7c291cmNlfSdgIH0pO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gYXdhaXQgcmVxdWVzdCh7IHVybDogc291cmNlIH0pO1xyXG4gICAgICAgICAgICBjb250ZW50RWwuZW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbG9nRGl2ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJPQ0wtUmVuZGVyZWRNYXJrZG93bk1vZGFsXCIgfSk7XHJcbiAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bihjb250ZW50LCBsb2dEaXYsIFwiXCIsIHBsdWdpbik7XHJcbiAgICB9XHJcbiAgICBvbkNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEFkZCBhIGJ1dHRvbiB0byBhbiBIVE1MRUxlbWVudCwgd2hpY2gsIHdoZW4gY2xpY2tlZCwgcG9wcyB1cCBhIHtAbGluayBSZW5kZXJlZE1hcmtkb3duTW9kYWx9IHNob3dpbmcgcmVuZGVyZWQgbWFya2Rvd24uXHJcbiAqXHJcbiAqIFVzZSBgZmV0Y2hgIHRvIGluZGljYXRlIHdoZXRoZXIgdGhlIG1hcmtkb3duIHN0cmluZyBuZWVkcyB0byBiZSBmZXRjaGVkLCBvciBpZiBpdCBoYXMgYmVlbiBwcm92aWRlZCBhcyBhIHN0cmluZyBhbHJlYWR5LlxyXG4gKlxyXG4gKiAhW10oaHR0cHM6Ly9pLmltZ3VyLmNvbS9IaTRneXl2LnBuZylcclxuICogQHBhcmFtICB7WW91clBsdWdpbn0gcGx1Z2luXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBjb250YWluZXJFbCBIVE1MRWxlbWVudCB0byBhZGQgdGhlIGJ1dHRvbiB0b1xyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZSBSYXcgbWFya2Rvd24gY29udGVudCBvciB1cmwgdG8gZmluZCByYXcgbWFya2Rvd24uXHJcbiAqIEBwYXJhbSAge2Jvb2xlYW59IGZldGNoIFRydWUg4oaSIGZldGNoIG1hcmtkb3duIGZyb20gYHNvdXJjZWAgYXMgdXJsLiBGYWxzZSDihpIgYHNvdXJjZWAgaXMgYWxyZWFkeSBhIG1hcmtkb3duIHN0cmluZy5cclxuICogQHBhcmFtICB7c3RyaW5nfSBkaXNwbGF5VGV4dCBUZXh0IHRvIGRpc3BsYXkgaW4gdGhlIGJ1dHRvbi5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRSZW5kZXJlZE1hcmtkb3duQnV0dG9uKHBsdWdpbiwgY29udGFpbmVyRWwsIHNvdXJjZSwgZmV0Y2gsIGRpc3BsYXlUZXh0KSB7XHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IGRpc3BsYXlUZXh0IH0sIChidXQpID0+IGJ1dC5vbkNsaWNrRXZlbnQoKCkgPT4ge1xyXG4gICAgICAgIG5ldyBSZW5kZXJlZE1hcmtkb3duTW9kYWwocGx1Z2luLCBzb3VyY2UsIGZldGNoKS5vcGVuKCk7XHJcbiAgICB9KSk7XHJcbn1cclxuLyoqXHJcbiAqIENoZWNrIGlmIGBhcHAubWV0YWRhdGFDYWNoZS5SZXNvbHZlZExpbmtzYCBoYXZlIGZ1bGx5IGluaXRhbGlzZWQuXHJcbiAqXHJcbiAqIFVzZWQgd2l0aCB7QGxpbmsgd2FpdEZvclJlc29sdmVkTGlua3N9LlxyXG4gKiBAcGFyYW0gIHtudW1iZXJ9IG5vRmlsZXMgTnVtYmVyIG9mIGZpbGVzIGluIHlvdXIgdmF1bHQuXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVkTGlua3NDb21wbGV0ZShub0ZpbGVzKSB7XHJcbiAgICBjb25zdCB7IHJlc29sdmVkTGlua3MgfSA9IGFwcC5tZXRhZGF0YUNhY2hlO1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJlc29sdmVkTGlua3MpLmxlbmd0aCA9PT0gbm9GaWxlcztcclxufVxyXG4vKipcclxuICogV2FpdCBmb3IgYGFwcC5tZXRhZGF0YUNhY2hlLlJlc29sdmVkTGlua3NgIHRvIGhhdmUgZnVsbHkgaW5pdGlhbGlzZWQuXHJcbiAqIEBwYXJhbSAge251bWJlcn0gW2RlbGF5PTEwMDBdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZXR3ZWVuIGVhY2ggY2hlY2suXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbWF4PTUwXSBNYXhpbXVtIG51bWJlciBvZiBpdGVyYXRpb25zIHRvIGNoZWNrIGJlZm9yZSB0aHJvd2luZyBhbiBlcnJvciBhbmQgYnJlYWtpbmcgb3V0IG9mIHRoZSBsb29wLlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JSZXNvbHZlZExpbmtzKGRlbGF5ID0gMTAwMCwgbWF4ID0gNTApIHtcclxuICAgIGNvbnN0IG5vRmlsZXMgPSBhcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLmxlbmd0aDtcclxuICAgIGxldCBpID0gMDtcclxuICAgIHdoaWxlICghcmVzb2x2ZWRMaW5rc0NvbXBsZXRlKG5vRmlsZXMpICYmIGkgPCBtYXgpIHtcclxuICAgICAgICBhd2FpdCB3YWl0KGRlbGF5KTtcclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbiAgICBpZiAoaSA9PT0gbWF4KSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJPYnNpZGlhbi1Db21tdW5pdHktTGliOiBSZXNvbHZlZExpbmtzIGRpZCBub3QgZmluaXNoIGluaXRpYWxpc2luZy4gYG1heGAgaXRlcmF0aW9ucyB3YXMgcmVhY2hlZCBmaXJzdC5cIik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBjb250ZW50IG9mIGEgbm90ZSBoYXMgWUFNTC4gSWYgc28sIHJldHVybiBhbiBhcnJheSBvZiB0aGUgWUFNTCBhbmQgdGhlIHJlc3Qgb2YgdGhlIG5vdGUuIElmIG5vdCwgcmV0dXJuIGBbJycsIGNvbnRlbnRdYFxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGNvbnRlbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEF0WWFtbChjb250ZW50KSB7XHJcbiAgICBpZiAoIS9eLS0tXFxuLy50ZXN0KGNvbnRlbnQpKVxyXG4gICAgICAgIHJldHVybiBbXCJcIiwgY29udGVudF07XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBzcGxpdHMgPSBjb250ZW50LnNwbGl0KFwiLS0tXCIpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHNwbGl0cy5zbGljZSgwLCAyKS5qb2luKFwiLS0tXCIpICsgXCItLS1cIixcclxuICAgICAgICAgICAgc3BsaXRzLnNsaWNlKDIpLmpvaW4oXCItLS1cIiksXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIHtib29sZWFufSBjYWNoZWQgUmV0dXJuIGNhY2hlZCBmaWxlIGNvbnRlbnQgKipvcioqIHJldHVybiB3aGF0J3Mgb24gZGlzay5cclxuICogQHJldHVybnNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBY3RpdmVGaWxlQ29udGVudChjYWNoZWQgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBjdXJyRmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG4gICAgaWYgKCEoY3VyckZpbGUgaW5zdGFuY2VvZiBURmlsZSkpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBpZiAoY2FjaGVkKVxyXG4gICAgICAgIHJldHVybiBhd2FpdCBhcHAudmF1bHQuY2FjaGVkUmVhZChjdXJyRmlsZSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IGFwcC52YXVsdC5yZWFkKGN1cnJGaWxlKTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBvYnNpZGlhbiA9IHJlcXVpcmUoJ29ic2lkaWFuJyk7XG5cbmNvbnN0IERFRkFVTFRfREFJTFlfTk9URV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcbmNvbnN0IERFRkFVTFRfV0VFS0xZX05PVEVfRk9STUFUID0gXCJnZ2dnLVtXXXd3XCI7XG5jb25zdCBERUZBVUxUX01PTlRITFlfTk9URV9GT1JNQVQgPSBcIllZWVktTU1cIjtcbmNvbnN0IERFRkFVTFRfUVVBUlRFUkxZX05PVEVfRk9STUFUID0gXCJZWVlZLVtRXVFcIjtcbmNvbnN0IERFRkFVTFRfWUVBUkxZX05PVEVfRk9STUFUID0gXCJZWVlZXCI7XG5cbmZ1bmN0aW9uIHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhwZXJpb2RpY2l0eSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IHdpbmRvdy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKTtcbiAgICByZXR1cm4gcGVyaW9kaWNOb3RlcyAmJiBwZXJpb2RpY05vdGVzLnNldHRpbmdzPy5bcGVyaW9kaWNpdHldPy5lbmFibGVkO1xufVxuLyoqXG4gKiBSZWFkIHRoZSB1c2VyIHNldHRpbmdzIGZvciB0aGUgYGRhaWx5LW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXREYWlseU5vdGVTZXR0aW5ncygpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCB7IGludGVybmFsUGx1Z2lucywgcGx1Z2lucyB9ID0gd2luZG93LmFwcDtcbiAgICAgICAgaWYgKHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhcImRhaWx5XCIpKSB7XG4gICAgICAgICAgICBjb25zdCB7IGZvcm1hdCwgZm9sZGVyLCB0ZW1wbGF0ZSB9ID0gcGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKT8uc2V0dGluZ3M/LmRhaWx5IHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCB8fCBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgICAgIGZvbGRlcjogZm9sZGVyPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGU/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGZvbGRlciwgZm9ybWF0LCB0ZW1wbGF0ZSB9ID0gaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJkYWlseS1ub3Rlc1wiKT8uaW5zdGFuY2U/Lm9wdGlvbnMgfHwge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCB8fCBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgZm9sZGVyOiBmb2xkZXI/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJObyBjdXN0b20gZGFpbHkgbm90ZSBzZXR0aW5ncyBmb3VuZCFcIiwgZXJyKTtcbiAgICB9XG59XG4vKipcbiAqIFJlYWQgdGhlIHVzZXIgc2V0dGluZ3MgZm9yIHRoZSBgd2Vla2x5LW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXRXZWVrbHlOb3RlU2V0dGluZ3MoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgY29uc3QgcGx1Z2luTWFuYWdlciA9IHdpbmRvdy5hcHAucGx1Z2lucztcbiAgICAgICAgY29uc3QgY2FsZW5kYXJTZXR0aW5ncyA9IHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwiY2FsZW5kYXJcIik/Lm9wdGlvbnM7XG4gICAgICAgIGNvbnN0IHBlcmlvZGljTm90ZXNTZXR0aW5ncyA9IHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwicGVyaW9kaWMtbm90ZXNcIik/LnNldHRpbmdzPy53ZWVrbHk7XG4gICAgICAgIGlmIChzaG91bGRVc2VQZXJpb2RpY05vdGVzU2V0dGluZ3MoXCJ3ZWVrbHlcIikpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBwZXJpb2RpY05vdGVzU2V0dGluZ3MuZm9ybWF0IHx8IERFRkFVTFRfV0VFS0xZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgICAgIGZvbGRlcjogcGVyaW9kaWNOb3Rlc1NldHRpbmdzLmZvbGRlcj8udHJpbSgpIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHBlcmlvZGljTm90ZXNTZXR0aW5ncy50ZW1wbGF0ZT8udHJpbSgpIHx8IFwiXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gY2FsZW5kYXJTZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZvcm1hdDogc2V0dGluZ3Mud2Vla2x5Tm90ZUZvcm1hdCB8fCBERUZBVUxUX1dFRUtMWV9OT1RFX0ZPUk1BVCxcbiAgICAgICAgICAgIGZvbGRlcjogc2V0dGluZ3Mud2Vla2x5Tm90ZUZvbGRlcj8udHJpbSgpIHx8IFwiXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogc2V0dGluZ3Mud2Vla2x5Tm90ZVRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJObyBjdXN0b20gd2Vla2x5IG5vdGUgc2V0dGluZ3MgZm91bmQhXCIsIGVycik7XG4gICAgfVxufVxuLyoqXG4gKiBSZWFkIHRoZSB1c2VyIHNldHRpbmdzIGZvciB0aGUgYHBlcmlvZGljLW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXRNb250aGx5Tm90ZVNldHRpbmdzKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGx1Z2luTWFuYWdlciA9IHdpbmRvdy5hcHAucGx1Z2lucztcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IChzaG91bGRVc2VQZXJpb2RpY05vdGVzU2V0dGluZ3MoXCJtb250aGx5XCIpICYmXG4gICAgICAgICAgICBwbHVnaW5NYW5hZ2VyLmdldFBsdWdpbihcInBlcmlvZGljLW5vdGVzXCIpPy5zZXR0aW5ncz8ubW9udGhseSkgfHxcbiAgICAgICAgICAgIHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9ybWF0OiBzZXR0aW5ncy5mb3JtYXQgfHwgREVGQVVMVF9NT05USExZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgZm9sZGVyOiBzZXR0aW5ncy5mb2xkZXI/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHNldHRpbmdzLnRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJObyBjdXN0b20gbW9udGhseSBub3RlIHNldHRpbmdzIGZvdW5kIVwiLCBlcnIpO1xuICAgIH1cbn1cbi8qKlxuICogUmVhZCB0aGUgdXNlciBzZXR0aW5ncyBmb3IgdGhlIGBwZXJpb2RpYy1ub3Rlc2AgcGx1Z2luXG4gKiB0byBrZWVwIGJlaGF2aW9yIG9mIGNyZWF0aW5nIGEgbmV3IG5vdGUgaW4tc3luYy5cbiAqL1xuZnVuY3Rpb24gZ2V0UXVhcnRlcmx5Tm90ZVNldHRpbmdzKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGx1Z2luTWFuYWdlciA9IHdpbmRvdy5hcHAucGx1Z2lucztcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IChzaG91bGRVc2VQZXJpb2RpY05vdGVzU2V0dGluZ3MoXCJxdWFydGVybHlcIikgJiZcbiAgICAgICAgICAgIHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwicGVyaW9kaWMtbm90ZXNcIik/LnNldHRpbmdzPy5xdWFydGVybHkpIHx8XG4gICAgICAgICAgICB7fTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZvcm1hdDogc2V0dGluZ3MuZm9ybWF0IHx8IERFRkFVTFRfUVVBUlRFUkxZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgZm9sZGVyOiBzZXR0aW5ncy5mb2xkZXI/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHNldHRpbmdzLnRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJObyBjdXN0b20gcXVhcnRlcmx5IG5vdGUgc2V0dGluZ3MgZm91bmQhXCIsIGVycik7XG4gICAgfVxufVxuLyoqXG4gKiBSZWFkIHRoZSB1c2VyIHNldHRpbmdzIGZvciB0aGUgYHBlcmlvZGljLW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXRZZWFybHlOb3RlU2V0dGluZ3MoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBwbHVnaW5NYW5hZ2VyID0gd2luZG93LmFwcC5wbHVnaW5zO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gKHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhcInllYXJseVwiKSAmJlxuICAgICAgICAgICAgcGx1Z2luTWFuYWdlci5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKT8uc2V0dGluZ3M/LnllYXJseSkgfHxcbiAgICAgICAgICAgIHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9ybWF0OiBzZXR0aW5ncy5mb3JtYXQgfHwgREVGQVVMVF9ZRUFSTFlfTk9URV9GT1JNQVQsXG4gICAgICAgICAgICBmb2xkZXI6IHNldHRpbmdzLmZvbGRlcj8udHJpbSgpIHx8IFwiXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogc2V0dGluZ3MudGVtcGxhdGU/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIk5vIGN1c3RvbSB5ZWFybHkgbm90ZSBzZXR0aW5ncyBmb3VuZCFcIiwgZXJyKTtcbiAgICB9XG59XG5cbi8vIENyZWRpdDogQGNyZWF0aW9uaXgvcGF0aC5qc1xuZnVuY3Rpb24gam9pbiguLi5wYXJ0U2VnbWVudHMpIHtcbiAgICAvLyBTcGxpdCB0aGUgaW5wdXRzIGludG8gYSBsaXN0IG9mIHBhdGggY29tbWFuZHMuXG4gICAgbGV0IHBhcnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXJ0U2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHBhcnRzID0gcGFydHMuY29uY2F0KHBhcnRTZWdtZW50c1tpXS5zcGxpdChcIi9cIikpO1xuICAgIH1cbiAgICAvLyBJbnRlcnByZXQgdGhlIHBhdGggY29tbWFuZHMgdG8gZ2V0IHRoZSBuZXcgcmVzb2x2ZWQgcGF0aC5cbiAgICBjb25zdCBuZXdQYXJ0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXNcbiAgICAgICAgLy8gQWxzbyByZW1vdmUgXCIuXCIgc2VnbWVudHNcbiAgICAgICAgaWYgKCFwYXJ0IHx8IHBhcnQgPT09IFwiLlwiKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIC8vIFB1c2ggbmV3IHBhdGggc2VnbWVudHMuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld1BhcnRzLnB1c2gocGFydCk7XG4gICAgfVxuICAgIC8vIFByZXNlcnZlIHRoZSBpbml0aWFsIHNsYXNoIGlmIHRoZXJlIHdhcyBvbmUuXG4gICAgaWYgKHBhcnRzWzBdID09PSBcIlwiKVxuICAgICAgICBuZXdQYXJ0cy51bnNoaWZ0KFwiXCIpO1xuICAgIC8vIFR1cm4gYmFjayBpbnRvIGEgc2luZ2xlIHN0cmluZyBwYXRoLlxuICAgIHJldHVybiBuZXdQYXJ0cy5qb2luKFwiL1wiKTtcbn1cbmZ1bmN0aW9uIGJhc2VuYW1lKGZ1bGxQYXRoKSB7XG4gICAgbGV0IGJhc2UgPSBmdWxsUGF0aC5zdWJzdHJpbmcoZnVsbFBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XG4gICAgaWYgKGJhc2UubGFzdEluZGV4T2YoXCIuXCIpICE9IC0xKVxuICAgICAgICBiYXNlID0gYmFzZS5zdWJzdHJpbmcoMCwgYmFzZS5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgIHJldHVybiBiYXNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlRm9sZGVyRXhpc3RzKHBhdGgpIHtcbiAgICBjb25zdCBkaXJzID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKS5zcGxpdChcIi9cIik7XG4gICAgZGlycy5wb3AoKTsgLy8gcmVtb3ZlIGJhc2VuYW1lXG4gICAgaWYgKGRpcnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGpvaW4oLi4uZGlycyk7XG4gICAgICAgIGlmICghd2luZG93LmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGlyKSkge1xuICAgICAgICAgICAgYXdhaXQgd2luZG93LmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZGlyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGdldE5vdGVQYXRoKGRpcmVjdG9yeSwgZmlsZW5hbWUpIHtcbiAgICBpZiAoIWZpbGVuYW1lLmVuZHNXaXRoKFwiLm1kXCIpKSB7XG4gICAgICAgIGZpbGVuYW1lICs9IFwiLm1kXCI7XG4gICAgfVxuICAgIGNvbnN0IHBhdGggPSBvYnNpZGlhbi5ub3JtYWxpemVQYXRoKGpvaW4oZGlyZWN0b3J5LCBmaWxlbmFtZSkpO1xuICAgIGF3YWl0IGVuc3VyZUZvbGRlckV4aXN0cyhwYXRoKTtcbiAgICByZXR1cm4gcGF0aDtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlSW5mbyh0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHsgbWV0YWRhdGFDYWNoZSwgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgdGVtcGxhdGVQYXRoID0gb2JzaWRpYW4ubm9ybWFsaXplUGF0aCh0ZW1wbGF0ZSk7XG4gICAgaWYgKHRlbXBsYXRlUGF0aCA9PT0gXCIvXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXCJcIiwgbnVsbF0pO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZUZpbGUgPSBtZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KHRlbXBsYXRlUGF0aCwgXCJcIik7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgdmF1bHQuY2FjaGVkUmVhZCh0ZW1wbGF0ZUZpbGUpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCBJRm9sZEluZm8gPSB3aW5kb3cuYXBwLmZvbGRNYW5hZ2VyLmxvYWQodGVtcGxhdGVGaWxlKTtcbiAgICAgICAgcmV0dXJuIFtjb250ZW50cywgSUZvbGRJbmZvXTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcmVhZCB0aGUgZGFpbHkgbm90ZSB0ZW1wbGF0ZSAnJHt0ZW1wbGF0ZVBhdGh9J2AsIGVycik7XG4gICAgICAgIG5ldyBvYnNpZGlhbi5Ob3RpY2UoXCJGYWlsZWQgdG8gcmVhZCB0aGUgZGFpbHkgbm90ZSB0ZW1wbGF0ZVwiKTtcbiAgICAgICAgcmV0dXJuIFtcIlwiLCBudWxsXTtcbiAgICB9XG59XG5cbi8qKlxuICogZGF0ZVVJRCBpcyBhIHdheSBvZiB3ZWVrbHkgaWRlbnRpZnlpbmcgZGFpbHkvd2Vla2x5L21vbnRobHkgbm90ZXMuXG4gKiBUaGV5IGFyZSBwcmVmaXhlZCB3aXRoIHRoZSBncmFudWxhcml0eSB0byBhdm9pZCBhbWJpZ3VpdHkuXG4gKi9cbmZ1bmN0aW9uIGdldERhdGVVSUQoZGF0ZSwgZ3JhbnVsYXJpdHkgPSBcImRheVwiKSB7XG4gICAgY29uc3QgdHMgPSBkYXRlLmNsb25lKCkuc3RhcnRPZihncmFudWxhcml0eSkuZm9ybWF0KCk7XG4gICAgcmV0dXJuIGAke2dyYW51bGFyaXR5fS0ke3RzfWA7XG59XG5mdW5jdGlvbiByZW1vdmVFc2NhcGVkQ2hhcmFjdGVycyhmb3JtYXQpIHtcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL1xcW1teXFxdXSpcXF0vZywgXCJcIik7IC8vIHJlbW92ZSBldmVyeXRoaW5nIHdpdGhpbiBicmFja2V0c1xufVxuLyoqXG4gKiBYWFg6IFdoZW4gcGFyc2luZyBkYXRlcyB0aGF0IGNvbnRhaW4gYm90aCB3ZWVrIG51bWJlcnMgYW5kIG1vbnRocyxcbiAqIE1vbWVudCBjaG9zZXMgdG8gaWdub3JlIHRoZSB3ZWVrIG51bWJlcnMuIEZvciB0aGUgd2VlayBkYXRlVUlELCB3ZVxuICogd2FudCB0aGUgb3Bwb3NpdGUgYmVoYXZpb3IuIFN0cmlwIHRoZSBNTU0gZnJvbSB0aGUgZm9ybWF0IHRvIHBhdGNoLlxuICovXG5mdW5jdGlvbiBpc0Zvcm1hdEFtYmlndW91cyhmb3JtYXQsIGdyYW51bGFyaXR5KSB7XG4gICAgaWYgKGdyYW51bGFyaXR5ID09PSBcIndlZWtcIikge1xuICAgICAgICBjb25zdCBjbGVhbkZvcm1hdCA9IHJlbW92ZUVzY2FwZWRDaGFyYWN0ZXJzKGZvcm1hdCk7XG4gICAgICAgIHJldHVybiAoL3d7MSwyfS9pLnRlc3QoY2xlYW5Gb3JtYXQpICYmXG4gICAgICAgICAgICAoL017MSw0fS8udGVzdChjbGVhbkZvcm1hdCkgfHwgL0R7MSw0fS8udGVzdChjbGVhbkZvcm1hdCkpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0RGF0ZUZyb21GaWxlKGZpbGUsIGdyYW51bGFyaXR5KSB7XG4gICAgcmV0dXJuIGdldERhdGVGcm9tRmlsZW5hbWUoZmlsZS5iYXNlbmFtZSwgZ3JhbnVsYXJpdHkpO1xufVxuZnVuY3Rpb24gZ2V0RGF0ZUZyb21QYXRoKHBhdGgsIGdyYW51bGFyaXR5KSB7XG4gICAgcmV0dXJuIGdldERhdGVGcm9tRmlsZW5hbWUoYmFzZW5hbWUocGF0aCksIGdyYW51bGFyaXR5KTtcbn1cbmZ1bmN0aW9uIGdldERhdGVGcm9tRmlsZW5hbWUoZmlsZW5hbWUsIGdyYW51bGFyaXR5KSB7XG4gICAgY29uc3QgZ2V0U2V0dGluZ3MgPSB7XG4gICAgICAgIGRheTogZ2V0RGFpbHlOb3RlU2V0dGluZ3MsXG4gICAgICAgIHdlZWs6IGdldFdlZWtseU5vdGVTZXR0aW5ncyxcbiAgICAgICAgbW9udGg6IGdldE1vbnRobHlOb3RlU2V0dGluZ3MsXG4gICAgICAgIHF1YXJ0ZXI6IGdldFF1YXJ0ZXJseU5vdGVTZXR0aW5ncyxcbiAgICAgICAgeWVhcjogZ2V0WWVhcmx5Tm90ZVNldHRpbmdzLFxuICAgIH07XG4gICAgY29uc3QgZm9ybWF0ID0gZ2V0U2V0dGluZ3NbZ3JhbnVsYXJpdHldKCkuZm9ybWF0LnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICBjb25zdCBub3RlRGF0ZSA9IHdpbmRvdy5tb21lbnQoZmlsZW5hbWUsIGZvcm1hdCwgdHJ1ZSk7XG4gICAgaWYgKCFub3RlRGF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc0Zvcm1hdEFtYmlndW91cyhmb3JtYXQsIGdyYW51bGFyaXR5KSkge1xuICAgICAgICBpZiAoZ3JhbnVsYXJpdHkgPT09IFwid2Vla1wiKSB7XG4gICAgICAgICAgICBjb25zdCBjbGVhbkZvcm1hdCA9IHJlbW92ZUVzY2FwZWRDaGFyYWN0ZXJzKGZvcm1hdCk7XG4gICAgICAgICAgICBpZiAoL3d7MSwyfS9pLnRlc3QoY2xlYW5Gb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoZmlsZW5hbWUsIFxuICAgICAgICAgICAgICAgIC8vIElmIGZvcm1hdCBjb250YWlucyB3ZWVrLCByZW1vdmUgZGF5ICYgbW9udGggZm9ybWF0dGluZ1xuICAgICAgICAgICAgICAgIGZvcm1hdC5yZXBsYWNlKC9NezEsNH0vZywgXCJcIikucmVwbGFjZSgvRHsxLDR9L2csIFwiXCIpLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vdGVEYXRlO1xufVxuXG5jbGFzcyBEYWlseU5vdGVzRm9sZGVyTWlzc2luZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIG1pbWljcyB0aGUgYmVoYXZpb3Igb2YgdGhlIGRhaWx5LW5vdGVzIHBsdWdpblxuICogc28gaXQgd2lsbCByZXBsYWNlIHt7ZGF0ZX19LCB7e3RpdGxlfX0sIGFuZCB7e3RpbWV9fSB3aXRoIHRoZVxuICogZm9ybWF0dGVkIHRpbWVzdGFtcC5cbiAqXG4gKiBOb3RlOiBpdCBoYXMgYW4gYWRkZWQgYm9udXMgdGhhdCBpdCdzIG5vdCAndG9kYXknIHNwZWNpZmljLlxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVEYWlseU5vdGUoZGF0ZSkge1xuICAgIGNvbnN0IGFwcCA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gYXBwO1xuICAgIGNvbnN0IG1vbWVudCA9IHdpbmRvdy5tb21lbnQ7XG4gICAgY29uc3QgeyB0ZW1wbGF0ZSwgZm9ybWF0LCBmb2xkZXIgfSA9IGdldERhaWx5Tm90ZVNldHRpbmdzKCk7XG4gICAgY29uc3QgW3RlbXBsYXRlQ29udGVudHMsIElGb2xkSW5mb10gPSBhd2FpdCBnZXRUZW1wbGF0ZUluZm8odGVtcGxhdGUpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZGF0ZS5mb3JtYXQoZm9ybWF0KTtcbiAgICBjb25zdCBub3JtYWxpemVkUGF0aCA9IGF3YWl0IGdldE5vdGVQYXRoKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRGaWxlID0gYXdhaXQgdmF1bHQuY3JlYXRlKG5vcm1hbGl6ZWRQYXRoLCB0ZW1wbGF0ZUNvbnRlbnRzXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqZGF0ZVxccyp9fS9naSwgZmlsZW5hbWUpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGltZVxccyp9fS9naSwgbW9tZW50KCkuZm9ybWF0KFwiSEg6bW1cIikpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGl0bGVcXHMqfX0vZ2ksIGZpbGVuYW1lKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKihkYXRlfHRpbWUpXFxzKigoWystXVxcZCspKFt5cW13ZGhzXSkpP1xccyooOi4rPyk/fX0vZ2ksIChfLCBfdGltZU9yRGF0ZSwgY2FsYywgdGltZURlbHRhLCB1bml0LCBtb21lbnRGb3JtYXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBkYXRlLmNsb25lKCkuc2V0KHtcbiAgICAgICAgICAgICAgICBob3VyOiBub3cuZ2V0KFwiaG91clwiKSxcbiAgICAgICAgICAgICAgICBtaW51dGU6IG5vdy5nZXQoXCJtaW51dGVcIiksXG4gICAgICAgICAgICAgICAgc2Vjb25kOiBub3cuZ2V0KFwic2Vjb25kXCIpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY2FsYykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLmFkZChwYXJzZUludCh0aW1lRGVsdGEsIDEwKSwgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW9tZW50Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRlLmZvcm1hdChtb21lbnRGb3JtYXQuc3Vic3RyaW5nKDEpLnRyaW0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudERhdGUuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqeWVzdGVyZGF5XFxzKn19L2dpLCBkYXRlLmNsb25lKCkuc3VidHJhY3QoMSwgXCJkYXlcIikuZm9ybWF0KGZvcm1hdCkpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdG9tb3Jyb3dcXHMqfX0vZ2ksIGRhdGUuY2xvbmUoKS5hZGQoMSwgXCJkXCIpLmZvcm1hdChmb3JtYXQpKSk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgIGFwcC5mb2xkTWFuYWdlci5zYXZlKGNyZWF0ZWRGaWxlLCBJRm9sZEluZm8pO1xuICAgICAgICByZXR1cm4gY3JlYXRlZEZpbGU7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSBmaWxlOiAnJHtub3JtYWxpemVkUGF0aH0nYCwgZXJyKTtcbiAgICAgICAgbmV3IG9ic2lkaWFuLk5vdGljZShcIlVuYWJsZSB0byBjcmVhdGUgbmV3IGZpbGUuXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldERhaWx5Tm90ZShkYXRlLCBkYWlseU5vdGVzKSB7XG4gICAgcmV0dXJuIGRhaWx5Tm90ZXNbZ2V0RGF0ZVVJRChkYXRlLCBcImRheVwiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbERhaWx5Tm90ZXMoKSB7XG4gICAgLyoqXG4gICAgICogRmluZCBhbGwgZGFpbHkgbm90ZXMgaW4gdGhlIGRhaWx5IG5vdGUgZm9sZGVyXG4gICAgICovXG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IGZvbGRlciB9ID0gZ2V0RGFpbHlOb3RlU2V0dGluZ3MoKTtcbiAgICBjb25zdCBkYWlseU5vdGVzRm9sZGVyID0gdmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG9ic2lkaWFuLm5vcm1hbGl6ZVBhdGgoZm9sZGVyKSk7XG4gICAgaWYgKCFkYWlseU5vdGVzRm9sZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBEYWlseU5vdGVzRm9sZGVyTWlzc2luZ0Vycm9yKFwiRmFpbGVkIHRvIGZpbmQgZGFpbHkgbm90ZXMgZm9sZGVyXCIpO1xuICAgIH1cbiAgICBjb25zdCBkYWlseU5vdGVzID0ge307XG4gICAgb2JzaWRpYW4uVmF1bHQucmVjdXJzZUNoaWxkcmVuKGRhaWx5Tm90ZXNGb2xkZXIsIChub3RlKSA9PiB7XG4gICAgICAgIGlmIChub3RlIGluc3RhbmNlb2Ygb2JzaWRpYW4uVEZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBnZXREYXRlRnJvbUZpbGUobm90ZSwgXCJkYXlcIik7XG4gICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREYXRlVUlEKGRhdGUsIFwiZGF5XCIpO1xuICAgICAgICAgICAgICAgIGRhaWx5Tm90ZXNbZGF0ZVN0cmluZ10gPSBub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhaWx5Tm90ZXM7XG59XG5cbmNsYXNzIFdlZWtseU5vdGVzRm9sZGVyTWlzc2luZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuZnVuY3Rpb24gZ2V0RGF5c09mV2VlaygpIHtcbiAgICBjb25zdCB7IG1vbWVudCB9ID0gd2luZG93O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgbGV0IHdlZWtTdGFydCA9IG1vbWVudC5sb2NhbGVEYXRhKCkuX3dlZWsuZG93O1xuICAgIGNvbnN0IGRheXNPZldlZWsgPSBbXG4gICAgICAgIFwic3VuZGF5XCIsXG4gICAgICAgIFwibW9uZGF5XCIsXG4gICAgICAgIFwidHVlc2RheVwiLFxuICAgICAgICBcIndlZG5lc2RheVwiLFxuICAgICAgICBcInRodXJzZGF5XCIsXG4gICAgICAgIFwiZnJpZGF5XCIsXG4gICAgICAgIFwic2F0dXJkYXlcIixcbiAgICBdO1xuICAgIHdoaWxlICh3ZWVrU3RhcnQpIHtcbiAgICAgICAgZGF5c09mV2Vlay5wdXNoKGRheXNPZldlZWsuc2hpZnQoKSk7XG4gICAgICAgIHdlZWtTdGFydC0tO1xuICAgIH1cbiAgICByZXR1cm4gZGF5c09mV2Vlaztcbn1cbmZ1bmN0aW9uIGdldERheU9mV2Vla051bWVyaWNhbFZhbHVlKGRheU9mV2Vla05hbWUpIHtcbiAgICByZXR1cm4gZ2V0RGF5c09mV2VlaygpLmluZGV4T2YoZGF5T2ZXZWVrTmFtZS50b0xvd2VyQ2FzZSgpKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdlZWtseU5vdGUoZGF0ZSkge1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyB0ZW1wbGF0ZSwgZm9ybWF0LCBmb2xkZXIgfSA9IGdldFdlZWtseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IFt0ZW1wbGF0ZUNvbnRlbnRzLCBJRm9sZEluZm9dID0gYXdhaXQgZ2V0VGVtcGxhdGVJbmZvKHRlbXBsYXRlKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGRhdGUuZm9ybWF0KGZvcm1hdCk7XG4gICAgY29uc3Qgbm9ybWFsaXplZFBhdGggPSBhd2FpdCBnZXROb3RlUGF0aChmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjcmVhdGVkRmlsZSA9IGF3YWl0IHZhdWx0LmNyZWF0ZShub3JtYWxpemVkUGF0aCwgdGVtcGxhdGVDb250ZW50c1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKihkYXRlfHRpbWUpXFxzKigoWystXVxcZCspKFt5cW13ZGhzXSkpP1xccyooOi4rPyk/fX0vZ2ksIChfLCBfdGltZU9yRGF0ZSwgY2FsYywgdGltZURlbHRhLCB1bml0LCBtb21lbnRGb3JtYXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHdpbmRvdy5tb21lbnQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gZGF0ZS5jbG9uZSgpLnNldCh7XG4gICAgICAgICAgICAgICAgaG91cjogbm93LmdldChcImhvdXJcIiksXG4gICAgICAgICAgICAgICAgbWludXRlOiBub3cuZ2V0KFwibWludXRlXCIpLFxuICAgICAgICAgICAgICAgIHNlY29uZDogbm93LmdldChcInNlY29uZFwiKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNhbGMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZS5hZGQocGFyc2VJbnQodGltZURlbHRhLCAxMCksIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vbWVudEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50RGF0ZS5mb3JtYXQobW9tZW50Rm9ybWF0LnN1YnN0cmluZygxKS50cmltKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRlLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKnRpdGxlXFxzKn19L2dpLCBmaWxlbmFtZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyp0aW1lXFxzKn19L2dpLCB3aW5kb3cubW9tZW50KCkuZm9ybWF0KFwiSEg6bW1cIikpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqKHN1bmRheXxtb25kYXl8dHVlc2RheXx3ZWRuZXNkYXl8dGh1cnNkYXl8ZnJpZGF5fHNhdHVyZGF5KVxccyo6KC4qPyl9fS9naSwgKF8sIGRheU9mV2VlaywgbW9tZW50Rm9ybWF0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkYXkgPSBnZXREYXlPZldlZWtOdW1lcmljYWxWYWx1ZShkYXlPZldlZWspO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGUud2Vla2RheShkYXkpLmZvcm1hdChtb21lbnRGb3JtYXQudHJpbSgpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICB3aW5kb3cuYXBwLmZvbGRNYW5hZ2VyLnNhdmUoY3JlYXRlZEZpbGUsIElGb2xkSW5mbyk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkRmlsZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGZpbGU6ICcke25vcm1hbGl6ZWRQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiVW5hYmxlIHRvIGNyZWF0ZSBuZXcgZmlsZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0V2Vla2x5Tm90ZShkYXRlLCB3ZWVrbHlOb3Rlcykge1xuICAgIHJldHVybiB3ZWVrbHlOb3Rlc1tnZXREYXRlVUlEKGRhdGUsIFwid2Vla1wiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbFdlZWtseU5vdGVzKCkge1xuICAgIGNvbnN0IHdlZWtseU5vdGVzID0ge307XG4gICAgaWYgKCFhcHBIYXNXZWVrbHlOb3Rlc1BsdWdpbkxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiB3ZWVrbHlOb3RlcztcbiAgICB9XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IGZvbGRlciB9ID0gZ2V0V2Vla2x5Tm90ZVNldHRpbmdzKCk7XG4gICAgY29uc3Qgd2Vla2x5Tm90ZXNGb2xkZXIgPSB2YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob2JzaWRpYW4ubm9ybWFsaXplUGF0aChmb2xkZXIpKTtcbiAgICBpZiAoIXdlZWtseU5vdGVzRm9sZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBXZWVrbHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvcihcIkZhaWxlZCB0byBmaW5kIHdlZWtseSBub3RlcyBmb2xkZXJcIik7XG4gICAgfVxuICAgIG9ic2lkaWFuLlZhdWx0LnJlY3Vyc2VDaGlsZHJlbih3ZWVrbHlOb3Rlc0ZvbGRlciwgKG5vdGUpID0+IHtcbiAgICAgICAgaWYgKG5vdGUgaW5zdGFuY2VvZiBvYnNpZGlhbi5URmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldERhdGVGcm9tRmlsZShub3RlLCBcIndlZWtcIik7XG4gICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREYXRlVUlEKGRhdGUsIFwid2Vla1wiKTtcbiAgICAgICAgICAgICAgICB3ZWVrbHlOb3Rlc1tkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gd2Vla2x5Tm90ZXM7XG59XG5cbmNsYXNzIE1vbnRobHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBtaW1pY3MgdGhlIGJlaGF2aW9yIG9mIHRoZSBkYWlseS1ub3RlcyBwbHVnaW5cbiAqIHNvIGl0IHdpbGwgcmVwbGFjZSB7e2RhdGV9fSwge3t0aXRsZX19LCBhbmQge3t0aW1lfX0gd2l0aCB0aGVcbiAqIGZvcm1hdHRlZCB0aW1lc3RhbXAuXG4gKlxuICogTm90ZTogaXQgaGFzIGFuIGFkZGVkIGJvbnVzIHRoYXQgaXQncyBub3QgJ3RvZGF5JyBzcGVjaWZpYy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTW9udGhseU5vdGUoZGF0ZSkge1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyB0ZW1wbGF0ZSwgZm9ybWF0LCBmb2xkZXIgfSA9IGdldE1vbnRobHlOb3RlU2V0dGluZ3MoKTtcbiAgICBjb25zdCBbdGVtcGxhdGVDb250ZW50cywgSUZvbGRJbmZvXSA9IGF3YWl0IGdldFRlbXBsYXRlSW5mbyh0ZW1wbGF0ZSk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBkYXRlLmZvcm1hdChmb3JtYXQpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gYXdhaXQgZ2V0Tm90ZVBhdGgoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY3JlYXRlZEZpbGUgPSBhd2FpdCB2YXVsdC5jcmVhdGUobm9ybWFsaXplZFBhdGgsIHRlbXBsYXRlQ29udGVudHNcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyooZGF0ZXx0aW1lKVxccyooKFsrLV1cXGQrKShbeXFtd2Roc10pKT9cXHMqKDouKz8pP319L2dpLCAoXywgX3RpbWVPckRhdGUsIGNhbGMsIHRpbWVEZWx0YSwgdW5pdCwgbW9tZW50Rm9ybWF0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSB3aW5kb3cubW9tZW50KCk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGRhdGUuY2xvbmUoKS5zZXQoe1xuICAgICAgICAgICAgICAgIGhvdXI6IG5vdy5nZXQoXCJob3VyXCIpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogbm93LmdldChcIm1pbnV0ZVwiKSxcbiAgICAgICAgICAgICAgICBzZWNvbmQ6IG5vdy5nZXQoXCJzZWNvbmRcIiksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjYWxjKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGUuYWRkKHBhcnNlSW50KHRpbWVEZWx0YSwgMTApLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb21lbnRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudERhdGUuZm9ybWF0KG1vbWVudEZvcm1hdC5zdWJzdHJpbmcoMSkudHJpbSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50RGF0ZS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccypkYXRlXFxzKn19L2dpLCBmaWxlbmFtZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyp0aW1lXFxzKn19L2dpLCB3aW5kb3cubW9tZW50KCkuZm9ybWF0KFwiSEg6bW1cIikpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGl0bGVcXHMqfX0vZ2ksIGZpbGVuYW1lKSk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgIHdpbmRvdy5hcHAuZm9sZE1hbmFnZXIuc2F2ZShjcmVhdGVkRmlsZSwgSUZvbGRJbmZvKTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWRGaWxlO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjcmVhdGUgZmlsZTogJyR7bm9ybWFsaXplZFBhdGh9J2AsIGVycik7XG4gICAgICAgIG5ldyBvYnNpZGlhbi5Ob3RpY2UoXCJVbmFibGUgdG8gY3JlYXRlIG5ldyBmaWxlLlwiKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRNb250aGx5Tm90ZShkYXRlLCBtb250aGx5Tm90ZXMpIHtcbiAgICByZXR1cm4gbW9udGhseU5vdGVzW2dldERhdGVVSUQoZGF0ZSwgXCJtb250aFwiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbE1vbnRobHlOb3RlcygpIHtcbiAgICBjb25zdCBtb250aGx5Tm90ZXMgPSB7fTtcbiAgICBpZiAoIWFwcEhhc01vbnRobHlOb3Rlc1BsdWdpbkxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiBtb250aGx5Tm90ZXM7XG4gICAgfVxuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyBmb2xkZXIgfSA9IGdldE1vbnRobHlOb3RlU2V0dGluZ3MoKTtcbiAgICBjb25zdCBtb250aGx5Tm90ZXNGb2xkZXIgPSB2YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob2JzaWRpYW4ubm9ybWFsaXplUGF0aChmb2xkZXIpKTtcbiAgICBpZiAoIW1vbnRobHlOb3Rlc0ZvbGRlcikge1xuICAgICAgICB0aHJvdyBuZXcgTW9udGhseU5vdGVzRm9sZGVyTWlzc2luZ0Vycm9yKFwiRmFpbGVkIHRvIGZpbmQgbW9udGhseSBub3RlcyBmb2xkZXJcIik7XG4gICAgfVxuICAgIG9ic2lkaWFuLlZhdWx0LnJlY3Vyc2VDaGlsZHJlbihtb250aGx5Tm90ZXNGb2xkZXIsIChub3RlKSA9PiB7XG4gICAgICAgIGlmIChub3RlIGluc3RhbmNlb2Ygb2JzaWRpYW4uVEZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBnZXREYXRlRnJvbUZpbGUobm90ZSwgXCJtb250aFwiKTtcbiAgICAgICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGdldERhdGVVSUQoZGF0ZSwgXCJtb250aFwiKTtcbiAgICAgICAgICAgICAgICBtb250aGx5Tm90ZXNbZGF0ZVN0cmluZ10gPSBub3RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1vbnRobHlOb3Rlcztcbn1cblxuY2xhc3MgUXVhcnRlcmx5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gbWltaWNzIHRoZSBiZWhhdmlvciBvZiB0aGUgZGFpbHktbm90ZXMgcGx1Z2luXG4gKiBzbyBpdCB3aWxsIHJlcGxhY2Uge3tkYXRlfX0sIHt7dGl0bGV9fSwgYW5kIHt7dGltZX19IHdpdGggdGhlXG4gKiBmb3JtYXR0ZWQgdGltZXN0YW1wLlxuICpcbiAqIE5vdGU6IGl0IGhhcyBhbiBhZGRlZCBib251cyB0aGF0IGl0J3Mgbm90ICd0b2RheScgc3BlY2lmaWMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVF1YXJ0ZXJseU5vdGUoZGF0ZSkge1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyB0ZW1wbGF0ZSwgZm9ybWF0LCBmb2xkZXIgfSA9IGdldFF1YXJ0ZXJseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IFt0ZW1wbGF0ZUNvbnRlbnRzLCBJRm9sZEluZm9dID0gYXdhaXQgZ2V0VGVtcGxhdGVJbmZvKHRlbXBsYXRlKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGRhdGUuZm9ybWF0KGZvcm1hdCk7XG4gICAgY29uc3Qgbm9ybWFsaXplZFBhdGggPSBhd2FpdCBnZXROb3RlUGF0aChmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjcmVhdGVkRmlsZSA9IGF3YWl0IHZhdWx0LmNyZWF0ZShub3JtYWxpemVkUGF0aCwgdGVtcGxhdGVDb250ZW50c1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKihkYXRlfHRpbWUpXFxzKigoWystXVxcZCspKFt5cW13ZGhzXSkpP1xccyooOi4rPyk/fX0vZ2ksIChfLCBfdGltZU9yRGF0ZSwgY2FsYywgdGltZURlbHRhLCB1bml0LCBtb21lbnRGb3JtYXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHdpbmRvdy5tb21lbnQoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gZGF0ZS5jbG9uZSgpLnNldCh7XG4gICAgICAgICAgICAgICAgaG91cjogbm93LmdldChcImhvdXJcIiksXG4gICAgICAgICAgICAgICAgbWludXRlOiBub3cuZ2V0KFwibWludXRlXCIpLFxuICAgICAgICAgICAgICAgIHNlY29uZDogbm93LmdldChcInNlY29uZFwiKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNhbGMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZS5hZGQocGFyc2VJbnQodGltZURlbHRhLCAxMCksIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vbWVudEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50RGF0ZS5mb3JtYXQobW9tZW50Rm9ybWF0LnN1YnN0cmluZygxKS50cmltKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRlLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKmRhdGVcXHMqfX0vZ2ksIGZpbGVuYW1lKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKnRpbWVcXHMqfX0vZ2ksIHdpbmRvdy5tb21lbnQoKS5mb3JtYXQoXCJISDptbVwiKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyp0aXRsZVxccyp9fS9naSwgZmlsZW5hbWUpKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgd2luZG93LmFwcC5mb2xkTWFuYWdlci5zYXZlKGNyZWF0ZWRGaWxlLCBJRm9sZEluZm8pO1xuICAgICAgICByZXR1cm4gY3JlYXRlZEZpbGU7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSBmaWxlOiAnJHtub3JtYWxpemVkUGF0aH0nYCwgZXJyKTtcbiAgICAgICAgbmV3IG9ic2lkaWFuLk5vdGljZShcIlVuYWJsZSB0byBjcmVhdGUgbmV3IGZpbGUuXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFF1YXJ0ZXJseU5vdGUoZGF0ZSwgcXVhcnRlcmx5KSB7XG4gICAgcmV0dXJuIHF1YXJ0ZXJseVtnZXREYXRlVUlEKGRhdGUsIFwicXVhcnRlclwiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbFF1YXJ0ZXJseU5vdGVzKCkge1xuICAgIGNvbnN0IHF1YXJ0ZXJseSA9IHt9O1xuICAgIGlmICghYXBwSGFzUXVhcnRlcmx5Tm90ZXNQbHVnaW5Mb2FkZWQoKSkge1xuICAgICAgICByZXR1cm4gcXVhcnRlcmx5O1xuICAgIH1cbiAgICBjb25zdCB7IHZhdWx0IH0gPSB3aW5kb3cuYXBwO1xuICAgIGNvbnN0IHsgZm9sZGVyIH0gPSBnZXRRdWFydGVybHlOb3RlU2V0dGluZ3MoKTtcbiAgICBjb25zdCBxdWFydGVybHlGb2xkZXIgPSB2YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob2JzaWRpYW4ubm9ybWFsaXplUGF0aChmb2xkZXIpKTtcbiAgICBpZiAoIXF1YXJ0ZXJseUZvbGRlcikge1xuICAgICAgICB0aHJvdyBuZXcgUXVhcnRlcmx5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IoXCJGYWlsZWQgdG8gZmluZCBxdWFydGVybHkgbm90ZXMgZm9sZGVyXCIpO1xuICAgIH1cbiAgICBvYnNpZGlhbi5WYXVsdC5yZWN1cnNlQ2hpbGRyZW4ocXVhcnRlcmx5Rm9sZGVyLCAobm90ZSkgPT4ge1xuICAgICAgICBpZiAobm90ZSBpbnN0YW5jZW9mIG9ic2lkaWFuLlRGaWxlKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlID0gZ2V0RGF0ZUZyb21GaWxlKG5vdGUsIFwicXVhcnRlclwiKTtcbiAgICAgICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGdldERhdGVVSUQoZGF0ZSwgXCJxdWFydGVyXCIpO1xuICAgICAgICAgICAgICAgIHF1YXJ0ZXJseVtkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcXVhcnRlcmx5O1xufVxuXG5jbGFzcyBZZWFybHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBtaW1pY3MgdGhlIGJlaGF2aW9yIG9mIHRoZSBkYWlseS1ub3RlcyBwbHVnaW5cbiAqIHNvIGl0IHdpbGwgcmVwbGFjZSB7e2RhdGV9fSwge3t0aXRsZX19LCBhbmQge3t0aW1lfX0gd2l0aCB0aGVcbiAqIGZvcm1hdHRlZCB0aW1lc3RhbXAuXG4gKlxuICogTm90ZTogaXQgaGFzIGFuIGFkZGVkIGJvbnVzIHRoYXQgaXQncyBub3QgJ3RvZGF5JyBzcGVjaWZpYy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlWWVhcmx5Tm90ZShkYXRlKSB7XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IHRlbXBsYXRlLCBmb3JtYXQsIGZvbGRlciB9ID0gZ2V0WWVhcmx5Tm90ZVNldHRpbmdzKCk7XG4gICAgY29uc3QgW3RlbXBsYXRlQ29udGVudHMsIElGb2xkSW5mb10gPSBhd2FpdCBnZXRUZW1wbGF0ZUluZm8odGVtcGxhdGUpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZGF0ZS5mb3JtYXQoZm9ybWF0KTtcbiAgICBjb25zdCBub3JtYWxpemVkUGF0aCA9IGF3YWl0IGdldE5vdGVQYXRoKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRGaWxlID0gYXdhaXQgdmF1bHQuY3JlYXRlKG5vcm1hbGl6ZWRQYXRoLCB0ZW1wbGF0ZUNvbnRlbnRzXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqKGRhdGV8dGltZSlcXHMqKChbKy1dXFxkKykoW3lxbXdkaHNdKSk/XFxzKig6Lis/KT99fS9naSwgKF8sIF90aW1lT3JEYXRlLCBjYWxjLCB0aW1lRGVsdGEsIHVuaXQsIG1vbWVudEZvcm1hdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gd2luZG93Lm1vbWVudCgpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBkYXRlLmNsb25lKCkuc2V0KHtcbiAgICAgICAgICAgICAgICBob3VyOiBub3cuZ2V0KFwiaG91clwiKSxcbiAgICAgICAgICAgICAgICBtaW51dGU6IG5vdy5nZXQoXCJtaW51dGVcIiksXG4gICAgICAgICAgICAgICAgc2Vjb25kOiBub3cuZ2V0KFwic2Vjb25kXCIpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY2FsYykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLmFkZChwYXJzZUludCh0aW1lRGVsdGEsIDEwKSwgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW9tZW50Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRlLmZvcm1hdChtb21lbnRGb3JtYXQuc3Vic3RyaW5nKDEpLnRyaW0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudERhdGUuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqZGF0ZVxccyp9fS9naSwgZmlsZW5hbWUpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGltZVxccyp9fS9naSwgd2luZG93Lm1vbWVudCgpLmZvcm1hdChcIkhIOm1tXCIpKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKnRpdGxlXFxzKn19L2dpLCBmaWxlbmFtZSkpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICB3aW5kb3cuYXBwLmZvbGRNYW5hZ2VyLnNhdmUoY3JlYXRlZEZpbGUsIElGb2xkSW5mbyk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkRmlsZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGZpbGU6ICcke25vcm1hbGl6ZWRQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiVW5hYmxlIHRvIGNyZWF0ZSBuZXcgZmlsZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0WWVhcmx5Tm90ZShkYXRlLCB5ZWFybHlOb3Rlcykge1xuICAgIHJldHVybiB5ZWFybHlOb3Rlc1tnZXREYXRlVUlEKGRhdGUsIFwieWVhclwiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbFllYXJseU5vdGVzKCkge1xuICAgIGNvbnN0IHllYXJseU5vdGVzID0ge307XG4gICAgaWYgKCFhcHBIYXNZZWFybHlOb3Rlc1BsdWdpbkxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiB5ZWFybHlOb3RlcztcbiAgICB9XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IGZvbGRlciB9ID0gZ2V0WWVhcmx5Tm90ZVNldHRpbmdzKCk7XG4gICAgY29uc3QgeWVhcmx5Tm90ZXNGb2xkZXIgPSB2YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob2JzaWRpYW4ubm9ybWFsaXplUGF0aChmb2xkZXIpKTtcbiAgICBpZiAoIXllYXJseU5vdGVzRm9sZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBZZWFybHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvcihcIkZhaWxlZCB0byBmaW5kIHllYXJseSBub3RlcyBmb2xkZXJcIik7XG4gICAgfVxuICAgIG9ic2lkaWFuLlZhdWx0LnJlY3Vyc2VDaGlsZHJlbih5ZWFybHlOb3Rlc0ZvbGRlciwgKG5vdGUpID0+IHtcbiAgICAgICAgaWYgKG5vdGUgaW5zdGFuY2VvZiBvYnNpZGlhbi5URmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldERhdGVGcm9tRmlsZShub3RlLCBcInllYXJcIik7XG4gICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREYXRlVUlEKGRhdGUsIFwieWVhclwiKTtcbiAgICAgICAgICAgICAgICB5ZWFybHlOb3Rlc1tkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4geWVhcmx5Tm90ZXM7XG59XG5cbmZ1bmN0aW9uIGFwcEhhc0RhaWx5Tm90ZXNQbHVnaW5Mb2FkZWQoKSB7XG4gICAgY29uc3QgeyBhcHAgfSA9IHdpbmRvdztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IGRhaWx5Tm90ZXNQbHVnaW4gPSBhcHAuaW50ZXJuYWxQbHVnaW5zLnBsdWdpbnNbXCJkYWlseS1ub3Rlc1wiXTtcbiAgICBpZiAoZGFpbHlOb3Rlc1BsdWdpbiAmJiBkYWlseU5vdGVzUGx1Z2luLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IGFwcC5wbHVnaW5zLmdldFBsdWdpbihcInBlcmlvZGljLW5vdGVzXCIpO1xuICAgIHJldHVybiBwZXJpb2RpY05vdGVzICYmIHBlcmlvZGljTm90ZXMuc2V0dGluZ3M/LmRhaWx5Py5lbmFibGVkO1xufVxuLyoqXG4gKiBYWFg6IFwiV2Vla2x5IE5vdGVzXCIgbGl2ZSBpbiBlaXRoZXIgdGhlIENhbGVuZGFyIHBsdWdpbiBvciB0aGUgcGVyaW9kaWMtbm90ZXMgcGx1Z2luLlxuICogQ2hlY2sgYm90aCB1bnRpbCB0aGUgd2Vla2x5IG5vdGVzIGZlYXR1cmUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBDYWxlbmRhciBwbHVnaW4uXG4gKi9cbmZ1bmN0aW9uIGFwcEhhc1dlZWtseU5vdGVzUGx1Z2luTG9hZGVkKCkge1xuICAgIGNvbnN0IHsgYXBwIH0gPSB3aW5kb3c7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBpZiAoYXBwLnBsdWdpbnMuZ2V0UGx1Z2luKFwiY2FsZW5kYXJcIikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IGFwcC5wbHVnaW5zLmdldFBsdWdpbihcInBlcmlvZGljLW5vdGVzXCIpO1xuICAgIHJldHVybiBwZXJpb2RpY05vdGVzICYmIHBlcmlvZGljTm90ZXMuc2V0dGluZ3M/LndlZWtseT8uZW5hYmxlZDtcbn1cbmZ1bmN0aW9uIGFwcEhhc01vbnRobHlOb3Rlc1BsdWdpbkxvYWRlZCgpIHtcbiAgICBjb25zdCB7IGFwcCB9ID0gd2luZG93O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IGFwcC5wbHVnaW5zLmdldFBsdWdpbihcInBlcmlvZGljLW5vdGVzXCIpO1xuICAgIHJldHVybiBwZXJpb2RpY05vdGVzICYmIHBlcmlvZGljTm90ZXMuc2V0dGluZ3M/Lm1vbnRobHk/LmVuYWJsZWQ7XG59XG5mdW5jdGlvbiBhcHBIYXNRdWFydGVybHlOb3Rlc1BsdWdpbkxvYWRlZCgpIHtcbiAgICBjb25zdCB7IGFwcCB9ID0gd2luZG93O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IGFwcC5wbHVnaW5zLmdldFBsdWdpbihcInBlcmlvZGljLW5vdGVzXCIpO1xuICAgIHJldHVybiBwZXJpb2RpY05vdGVzICYmIHBlcmlvZGljTm90ZXMuc2V0dGluZ3M/LnF1YXJ0ZXJseT8uZW5hYmxlZDtcbn1cbmZ1bmN0aW9uIGFwcEhhc1llYXJseU5vdGVzUGx1Z2luTG9hZGVkKCkge1xuICAgIGNvbnN0IHsgYXBwIH0gPSB3aW5kb3c7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBwZXJpb2RpY05vdGVzID0gYXBwLnBsdWdpbnMuZ2V0UGx1Z2luKFwicGVyaW9kaWMtbm90ZXNcIik7XG4gICAgcmV0dXJuIHBlcmlvZGljTm90ZXMgJiYgcGVyaW9kaWNOb3Rlcy5zZXR0aW5ncz8ueWVhcmx5Py5lbmFibGVkO1xufVxuZnVuY3Rpb24gZ2V0UGVyaW9kaWNOb3RlU2V0dGluZ3MoZ3JhbnVsYXJpdHkpIHtcbiAgICBjb25zdCBnZXRTZXR0aW5ncyA9IHtcbiAgICAgICAgZGF5OiBnZXREYWlseU5vdGVTZXR0aW5ncyxcbiAgICAgICAgd2VlazogZ2V0V2Vla2x5Tm90ZVNldHRpbmdzLFxuICAgICAgICBtb250aDogZ2V0TW9udGhseU5vdGVTZXR0aW5ncyxcbiAgICAgICAgcXVhcnRlcjogZ2V0UXVhcnRlcmx5Tm90ZVNldHRpbmdzLFxuICAgICAgICB5ZWFyOiBnZXRZZWFybHlOb3RlU2V0dGluZ3MsXG4gICAgfVtncmFudWxhcml0eV07XG4gICAgcmV0dXJuIGdldFNldHRpbmdzKCk7XG59XG5mdW5jdGlvbiBjcmVhdGVQZXJpb2RpY05vdGUoZ3JhbnVsYXJpdHksIGRhdGUpIHtcbiAgICBjb25zdCBjcmVhdGVGbiA9IHtcbiAgICAgICAgZGF5OiBjcmVhdGVEYWlseU5vdGUsXG4gICAgICAgIG1vbnRoOiBjcmVhdGVNb250aGx5Tm90ZSxcbiAgICAgICAgd2VlazogY3JlYXRlV2Vla2x5Tm90ZSxcbiAgICB9O1xuICAgIHJldHVybiBjcmVhdGVGbltncmFudWxhcml0eV0oZGF0ZSk7XG59XG5cbmV4cG9ydHMuREVGQVVMVF9EQUlMWV9OT1RFX0ZPUk1BVCA9IERFRkFVTFRfREFJTFlfTk9URV9GT1JNQVQ7XG5leHBvcnRzLkRFRkFVTFRfTU9OVEhMWV9OT1RFX0ZPUk1BVCA9IERFRkFVTFRfTU9OVEhMWV9OT1RFX0ZPUk1BVDtcbmV4cG9ydHMuREVGQVVMVF9RVUFSVEVSTFlfTk9URV9GT1JNQVQgPSBERUZBVUxUX1FVQVJURVJMWV9OT1RFX0ZPUk1BVDtcbmV4cG9ydHMuREVGQVVMVF9XRUVLTFlfTk9URV9GT1JNQVQgPSBERUZBVUxUX1dFRUtMWV9OT1RFX0ZPUk1BVDtcbmV4cG9ydHMuREVGQVVMVF9ZRUFSTFlfTk9URV9GT1JNQVQgPSBERUZBVUxUX1lFQVJMWV9OT1RFX0ZPUk1BVDtcbmV4cG9ydHMuYXBwSGFzRGFpbHlOb3Rlc1BsdWdpbkxvYWRlZCA9IGFwcEhhc0RhaWx5Tm90ZXNQbHVnaW5Mb2FkZWQ7XG5leHBvcnRzLmFwcEhhc01vbnRobHlOb3Rlc1BsdWdpbkxvYWRlZCA9IGFwcEhhc01vbnRobHlOb3Rlc1BsdWdpbkxvYWRlZDtcbmV4cG9ydHMuYXBwSGFzUXVhcnRlcmx5Tm90ZXNQbHVnaW5Mb2FkZWQgPSBhcHBIYXNRdWFydGVybHlOb3Rlc1BsdWdpbkxvYWRlZDtcbmV4cG9ydHMuYXBwSGFzV2Vla2x5Tm90ZXNQbHVnaW5Mb2FkZWQgPSBhcHBIYXNXZWVrbHlOb3Rlc1BsdWdpbkxvYWRlZDtcbmV4cG9ydHMuYXBwSGFzWWVhcmx5Tm90ZXNQbHVnaW5Mb2FkZWQgPSBhcHBIYXNZZWFybHlOb3Rlc1BsdWdpbkxvYWRlZDtcbmV4cG9ydHMuY3JlYXRlRGFpbHlOb3RlID0gY3JlYXRlRGFpbHlOb3RlO1xuZXhwb3J0cy5jcmVhdGVNb250aGx5Tm90ZSA9IGNyZWF0ZU1vbnRobHlOb3RlO1xuZXhwb3J0cy5jcmVhdGVQZXJpb2RpY05vdGUgPSBjcmVhdGVQZXJpb2RpY05vdGU7XG5leHBvcnRzLmNyZWF0ZVF1YXJ0ZXJseU5vdGUgPSBjcmVhdGVRdWFydGVybHlOb3RlO1xuZXhwb3J0cy5jcmVhdGVXZWVrbHlOb3RlID0gY3JlYXRlV2Vla2x5Tm90ZTtcbmV4cG9ydHMuY3JlYXRlWWVhcmx5Tm90ZSA9IGNyZWF0ZVllYXJseU5vdGU7XG5leHBvcnRzLmdldEFsbERhaWx5Tm90ZXMgPSBnZXRBbGxEYWlseU5vdGVzO1xuZXhwb3J0cy5nZXRBbGxNb250aGx5Tm90ZXMgPSBnZXRBbGxNb250aGx5Tm90ZXM7XG5leHBvcnRzLmdldEFsbFF1YXJ0ZXJseU5vdGVzID0gZ2V0QWxsUXVhcnRlcmx5Tm90ZXM7XG5leHBvcnRzLmdldEFsbFdlZWtseU5vdGVzID0gZ2V0QWxsV2Vla2x5Tm90ZXM7XG5leHBvcnRzLmdldEFsbFllYXJseU5vdGVzID0gZ2V0QWxsWWVhcmx5Tm90ZXM7XG5leHBvcnRzLmdldERhaWx5Tm90ZSA9IGdldERhaWx5Tm90ZTtcbmV4cG9ydHMuZ2V0RGFpbHlOb3RlU2V0dGluZ3MgPSBnZXREYWlseU5vdGVTZXR0aW5ncztcbmV4cG9ydHMuZ2V0RGF0ZUZyb21GaWxlID0gZ2V0RGF0ZUZyb21GaWxlO1xuZXhwb3J0cy5nZXREYXRlRnJvbVBhdGggPSBnZXREYXRlRnJvbVBhdGg7XG5leHBvcnRzLmdldERhdGVVSUQgPSBnZXREYXRlVUlEO1xuZXhwb3J0cy5nZXRNb250aGx5Tm90ZSA9IGdldE1vbnRobHlOb3RlO1xuZXhwb3J0cy5nZXRNb250aGx5Tm90ZVNldHRpbmdzID0gZ2V0TW9udGhseU5vdGVTZXR0aW5ncztcbmV4cG9ydHMuZ2V0UGVyaW9kaWNOb3RlU2V0dGluZ3MgPSBnZXRQZXJpb2RpY05vdGVTZXR0aW5ncztcbmV4cG9ydHMuZ2V0UXVhcnRlcmx5Tm90ZSA9IGdldFF1YXJ0ZXJseU5vdGU7XG5leHBvcnRzLmdldFF1YXJ0ZXJseU5vdGVTZXR0aW5ncyA9IGdldFF1YXJ0ZXJseU5vdGVTZXR0aW5ncztcbmV4cG9ydHMuZ2V0VGVtcGxhdGVJbmZvID0gZ2V0VGVtcGxhdGVJbmZvO1xuZXhwb3J0cy5nZXRXZWVrbHlOb3RlID0gZ2V0V2Vla2x5Tm90ZTtcbmV4cG9ydHMuZ2V0V2Vla2x5Tm90ZVNldHRpbmdzID0gZ2V0V2Vla2x5Tm90ZVNldHRpbmdzO1xuZXhwb3J0cy5nZXRZZWFybHlOb3RlID0gZ2V0WWVhcmx5Tm90ZTtcbmV4cG9ydHMuZ2V0WWVhcmx5Tm90ZVNldHRpbmdzID0gZ2V0WWVhcmx5Tm90ZVNldHRpbmdzO1xuIiwiaW1wb3J0IHtcbiAgICBFZGl0b3IsXG4gICAgTGlzdEl0ZW1DYWNoZSxcbiAgICBNYXJrZG93blZpZXcsXG4gICAgU2VjdGlvbkNhY2hlLFxuICAgIFRGaWxlLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJsb2NrVXRpbHMge1xuICAgIHByaXZhdGUgc3RhdGljIGdldEJsb2NrKFxuICAgICAgICBlZGl0b3I6IEVkaXRvcixcbiAgICAgICAgZmlsZTogVEZpbGVcbiAgICApOiAoU2VjdGlvbkNhY2hlIHwgTGlzdEl0ZW1DYWNoZSkgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKFwidG9cIik7XG4gICAgICAgIGNvbnN0IGZpbGVDYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcblxuICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBTZWN0aW9uQ2FjaGUgfCBMaXN0SXRlbUNhY2hlID1cbiAgICAgICAgICAgIGZpbGVDYWNoZT8uc2VjdGlvbnM/LmZpbmQoXG4gICAgICAgICAgICAgICAgKHNlY3Rpb24pID0+XG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb24ucG9zaXRpb24uc3RhcnQubGluZSA8PSBjdXJzb3IubGluZSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLnBvc2l0aW9uLmVuZC5saW5lID49IGN1cnNvci5saW5lXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGlmIChjdXJyZW50QmxvY2sudHlwZSA9PSBcImxpc3RcIikge1xuICAgICAgICAgICAgY3VycmVudEJsb2NrID0gZmlsZUNhY2hlLmxpc3RJdGVtcz8uZmluZCgobGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wb3NpdGlvbi5zdGFydC5saW5lIDw9IGN1cnNvci5saW5lICYmXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucG9zaXRpb24uZW5kLmxpbmUgPj0gY3Vyc29yLmxpbmVcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRCbG9jaztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRJZE9mQmxvY2soXG4gICAgICAgIGVkaXRvcjogRWRpdG9yLFxuICAgICAgICBibG9jazogU2VjdGlvbkNhY2hlIHwgTGlzdEl0ZW1DYWNoZVxuICAgICk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGJsb2NrSWQgPSBibG9jay5pZDtcblxuICAgICAgICBpZiAoYmxvY2tJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2NrSWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYSBibG9jayBpZFxuICAgICAgICBjb25zdCBzZWN0aW9uRW5kID0gYmxvY2sucG9zaXRpb24uZW5kO1xuICAgICAgICBjb25zdCBwb3MgPSB7XG4gICAgICAgICAgICBjaDogc2VjdGlvbkVuZC5jb2wsXG4gICAgICAgICAgICBsaW5lOiBzZWN0aW9uRW5kLmxpbmUsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgbmV3SWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgOCk7XG4gICAgICAgIGNvbnN0IHNwYWNlciA9IEJsb2NrVXRpbHMuc2hvdWxkSW5zZXJ0QWZ0ZXIoYmxvY2spID8gXCJcXG5cXG5cIiA6IFwiIFwiO1xuXG4gICAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoYCR7c3BhY2VyfV4ke25ld0lkfWAsIHBvcyk7XG4gICAgICAgIHJldHVybiBuZXdJZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzaG91bGRJbnNlcnRBZnRlcihcbiAgICAgICAgYmxvY2s6IFNlY3Rpb25DYWNoZSB8IExpc3RJdGVtQ2FjaGVcbiAgICApOiBib29sZWFuIHtcbiAgICAgICAgaWYgKChibG9jayBhcyBhbnkpLnR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgXCJibG9ja3F1b3RlXCIsXG4gICAgICAgICAgICAgICAgXCJjb2RlXCIsXG4gICAgICAgICAgICAgICAgXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgIFwiaGVhZGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiY29tbWVudFwiLFxuICAgICAgICAgICAgICAgIFwiZm9vdG5vdGVEZWZpbml0aW9uXCIsXG4gICAgICAgICAgICBdLmluY2x1ZGVzKChibG9jayBhcyBhbnkpLnR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRCbG9ja0lkKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHZpZXcuZmlsZTtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhlZGl0b3IsIGZpbGUpO1xuICAgICAgICAgICAgaWYgKGJsb2NrKSByZXR1cm4gdGhpcy5nZXRJZE9mQmxvY2soZWRpdG9yLCBibG9jayk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBZHZhbmNlZFVSSVNldHRpbmdzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEFkdmFuY2VkVVJJU2V0dGluZ3MgPSB7XG4gICAgb3BlbkZpbGVPbldyaXRlOiB0cnVlLFxuICAgIG9wZW5EYWlseUluTmV3UGFuZTogZmFsc2UsXG4gICAgb3BlbkZpbGVPbldyaXRlSW5OZXdQYW5lOiBmYWxzZSxcbiAgICBvcGVuRmlsZVdpdGhvdXRXcml0ZUluTmV3UGFuZTogZmFsc2UsXG4gICAgaWRGaWVsZDogXCJpZFwiLFxuICAgIHVzZVVJRDogZmFsc2UsXG4gICAgYWRkRmlsZXBhdGhXaGVuVXNpbmdVSUQ6IGZhbHNlLFxuICAgIGFsbG93RXZhbDogZmFsc2UsXG59O1xuIiwiaW1wb3J0IHsgbm9ybWFsaXplUGF0aCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ2V0RGFpbHlOb3RlU2V0dGluZ3MgfSBmcm9tIFwib2JzaWRpYW4tZGFpbHktbm90ZXMtaW50ZXJmYWNlXCI7XG5cbi8vISBBbGwgb2YgdGhlc2UgbWV0aG9kcyBhcmUgdGFrZW4gZnJvbSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9vYnNpZGlhbi1kYWlseS1ub3Rlcy1pbnRlcmZhY2UuXG5mdW5jdGlvbiBqb2luKC4uLnBhcnRTZWdtZW50czogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIC8vIFNwbGl0IHRoZSBpbnB1dHMgaW50byBhIGxpc3Qgb2YgcGF0aCBjb21tYW5kcy5cbiAgICBsZXQgcGFydHM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXJ0U2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHBhcnRzID0gcGFydHMuY29uY2F0KHBhcnRTZWdtZW50c1tpXS5zcGxpdChcIi9cIikpO1xuICAgIH1cbiAgICAvLyBJbnRlcnByZXQgdGhlIHBhdGggY29tbWFuZHMgdG8gZ2V0IHRoZSBuZXcgcmVzb2x2ZWQgcGF0aC5cbiAgICBjb25zdCBuZXdQYXJ0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXNcbiAgICAgICAgLy8gQWxzbyByZW1vdmUgXCIuXCIgc2VnbWVudHNcbiAgICAgICAgaWYgKCFwYXJ0IHx8IHBhcnQgPT09IFwiLlwiKSBjb250aW51ZTtcbiAgICAgICAgLy8gUHVzaCBuZXcgcGF0aCBzZWdtZW50cy5cbiAgICAgICAgZWxzZSBuZXdQYXJ0cy5wdXNoKHBhcnQpO1xuICAgIH1cbiAgICAvLyBQcmVzZXJ2ZSB0aGUgaW5pdGlhbCBzbGFzaCBpZiB0aGVyZSB3YXMgb25lLlxuICAgIGlmIChwYXJ0c1swXSA9PT0gXCJcIikgbmV3UGFydHMudW5zaGlmdChcIlwiKTtcbiAgICAvLyBUdXJuIGJhY2sgaW50byBhIHNpbmdsZSBzdHJpbmcgcGF0aC5cbiAgICByZXR1cm4gbmV3UGFydHMuam9pbihcIi9cIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE5vdGVQYXRoKFxuICAgIGRpcmVjdG9yeTogc3RyaW5nLFxuICAgIGZpbGVuYW1lOiBzdHJpbmdcbik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKCFmaWxlbmFtZS5lbmRzV2l0aChcIi5tZFwiKSkge1xuICAgICAgICBmaWxlbmFtZSArPSBcIi5tZFwiO1xuICAgIH1cbiAgICBjb25zdCBwYXRoID0gbm9ybWFsaXplUGF0aChqb2luKGRpcmVjdG9yeSwgZmlsZW5hbWUpKTtcblxuICAgIGF3YWl0IGVuc3VyZUZvbGRlckV4aXN0cyhwYXRoKTtcblxuICAgIHJldHVybiBwYXRoO1xufVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVGb2xkZXJFeGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGlycyA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCBcIi9cIikuc3BsaXQoXCIvXCIpO1xuICAgIGRpcnMucG9wKCk7IC8vIHJlbW92ZSBiYXNlbmFtZVxuXG4gICAgaWYgKGRpcnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGpvaW4oLi4uZGlycyk7XG4gICAgICAgIGlmICghKHdpbmRvdyBhcyBhbnkpLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGlyKSkge1xuICAgICAgICAgICAgYXdhaXQgKHdpbmRvdyBhcyBhbnkpLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZGlyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhaWx5Tm90ZVBhdGgoZGF0ZTogYW55KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCB7IGZvcm1hdCwgZm9sZGVyIH0gPSBnZXREYWlseU5vdGVTZXR0aW5ncygpO1xuXG4gICAgY29uc3QgZmlsZW5hbWUgPSBkYXRlLmZvcm1hdChmb3JtYXQpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gYXdhaXQgZ2V0Tm90ZVBhdGgoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRQYXRoO1xufVxuIiwiaW1wb3J0IHsgU3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgQWR2YW5jZWRVUkkgZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IEVudGVyRGF0YSwgUGFyYW1ldGVycyB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgRW50ZXJEYXRhTW9kYWwgZXh0ZW5kcyBTdWdnZXN0TW9kYWw8RW50ZXJEYXRhPiB7XG4gICAgcGx1Z2luOiBBZHZhbmNlZFVSSTtcbiAgICAvL251bGwgaWYgZm9yIG5vcm1hbCB3cml0ZSBtb2RlLCBpdHMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIHNwZWNpYWwgbW9kZSBsaWtlIFwiYXBwZW5kXCIgb3IgXCJwcmVwZW5kXCJcbiAgICBtb2RlcyA9IFtudWxsLCBcIm92ZXJ3cml0ZVwiLCBcImFwcGVuZFwiLCBcInByZXBlbmRcIl07XG5cbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IEFkdmFuY2VkVVJJLCBwcml2YXRlIGZpbGU/OiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIocGx1Z2luLmFwcCk7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFxuICAgICAgICAgICAgXCJUeXBlIHlvdXIgZGF0YSB0byBiZSB3cml0dGVuIHRvIHRoZSBmaWxlIG9yIGxlYXZlIGl0IGVtcHR5IHRvIGp1c3Qgb3BlbiBpdFwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0U3VnZ2VzdGlvbnMocXVlcnk6IHN0cmluZyk6IEVudGVyRGF0YVtdIHtcbiAgICAgICAgaWYgKHF1ZXJ5ID09IFwiXCIpIHF1ZXJ5ID0gbnVsbDtcblxuICAgICAgICBsZXQgc3VnZ2VzdGlvbnM6IEVudGVyRGF0YVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbW9kZSBvZiB0aGlzLm1vZGVzKSB7XG4gICAgICAgICAgICBpZiAoIShtb2RlID09PSBcIm92ZXJ3cml0ZVwiICYmICFxdWVyeSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGlzcGxheTogc3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheSA9IGBXcml0ZSBcIiR7cXVlcnl9XCIgaW4gJHttb2RlfSBtb2RlYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSBgV3JpdGUgXCIke3F1ZXJ5fVwiYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ID0gYE9wZW4gaW4gJHttb2RlfSBtb2RlYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkgPSBgT3BlbmA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBkaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udG9vbHMuY29weVVSSSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVwYXRoOiB0aGlzLmZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlIGFzIFBhcmFtZXRlcnNbXCJtb2RlXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50b29scy5jb3B5VVJJKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFpbHk6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogbW9kZSBhcyBQYXJhbWV0ZXJzW1wibW9kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9ucztcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKHZhbHVlOiBFbnRlckRhdGEsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5pbm5lclRleHQgPSB2YWx1ZS5kaXNwbGF5O1xuICAgIH1cblxuICAgIG9uQ2hvb3NlU3VnZ2VzdGlvbihpdGVtOiBFbnRlckRhdGEsIF86IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGl0ZW0uZnVuYygpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEZ1enp5U3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgQWR2YW5jZWRVUkkgZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IEZpbGVNb2RhbERhdGEgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVNb2RhbCBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPEZpbGVNb2RhbERhdGE+IHtcbiAgICBwbHVnaW46IEFkdmFuY2VkVVJJO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwbHVnaW46IEFkdmFuY2VkVVJJLFxuICAgICAgICBwcml2YXRlIHBsYWNlSG9sZGVyOiBzdHJpbmcsXG4gICAgICAgIHByaXZhdGUgYWxsb3dOb0ZpbGU6IGJvb2xlYW4gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHBsdWdpbi5hcHApO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcih0aGlzLnBsYWNlSG9sZGVyKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtcygpOiBGaWxlTW9kYWxEYXRhW10ge1xuICAgICAgICBsZXQgc3BlY2lhbEl0ZW1zOiBGaWxlTW9kYWxEYXRhW10gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuYWxsb3dOb0ZpbGUpIHtcbiAgICAgICAgICAgIHNwZWNpYWxJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIjxEb24ndCBzcGVjaWZ5IGEgZmlsZT5cIixcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgc3BlY2lhbEl0ZW1zLnB1c2goeyBkaXNwbGF5OiBcIjxDdXJyZW50IGZpbGU+XCIsIHNvdXJjZTogZmlsZS5wYXRoIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAuLi5zcGVjaWFsSXRlbXMsXG4gICAgICAgICAgICAuLi50aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLm1hcCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRpc3BsYXk6IGUucGF0aCwgc291cmNlOiBlLnBhdGggfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGdldEl0ZW1UZXh0KGl0ZW06IEZpbGVNb2RhbERhdGEpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5kaXNwbGF5O1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBGaWxlTW9kYWxEYXRhLCBldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7fVxufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgc3RyaXBNRCB9IGZyb20gXCJvYnNpZGlhbi1jb21tdW5pdHktbGliXCI7XG5pbXBvcnQgeyBQYXJhbWV0ZXJzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpZXdTdGF0ZUZyb21Nb2RlKHBhcmFtZXRlcnM6IFBhcmFtZXRlcnMpIHtcbiAgICByZXR1cm4gcGFyYW1ldGVycy52aWV3bW9kZVxuICAgICAgICA/IHtcbiAgICAgICAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgICAgICAgIG1vZGU6IHBhcmFtZXRlcnMudmlld21vZGUsXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6IHBhcmFtZXRlcnMudmlld21vZGUgPT0gXCJzb3VyY2VcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWx0ZXJuYXRpdmVGaWxlUGF0aChmaWxlOiBURmlsZSk6IHN0cmluZyB7XG4gICAgY29uc3QgZGlyID0gZmlsZS5wYXJlbnQ/LnBhdGg7XG4gICAgY29uc3QgZm9ybWF0dGVkRGlyID0gZGlyID09PSBcIi9cIiA/IFwiXCIgOiBkaXI7XG4gICAgY29uc3QgbmFtZSA9IGZpbGUubmFtZTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgMTAwOyBpbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGJhc2UgPSBzdHJpcE1EKG5hbWUpO1xuICAgICAgICBjb25zdCBhbHRlcm5hdGl2ZSA9XG4gICAgICAgICAgICBmb3JtYXR0ZWREaXIgK1xuICAgICAgICAgICAgKGZvcm1hdHRlZERpciA9PSBcIlwiID8gXCJcIiA6IFwiL1wiKSArXG4gICAgICAgICAgICBiYXNlICtcbiAgICAgICAgICAgIGAgJHtpbmRleH0ubWRgO1xuXG4gICAgICAgIGNvbnN0IGV4aXN0cyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYWx0ZXJuYXRpdmUpICE9PSBudWxsO1xuICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgcmV0dXJuIGFsdGVybmF0aXZlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVVyaShmaWxlOiBURmlsZSk6IHN0cmluZyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKGZpbGUpKTtcbiAgICB1cmwuaG9zdCA9IFwibG9jYWxob3N0aG9zdGxvY2FsXCI7XG4gICAgdXJsLnByb3RvY29sID0gXCJmaWxlXCI7XG4gICAgdXJsLnNlYXJjaCA9IFwiXCI7XG5cbiAgICB1cmwucGF0aG5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodXJsLnBhdGhuYW1lKTtcbiAgICBjb25zdCByZXMgPSB1cmwudG9TdHJpbmcoKS5yZXBsYWNlKFwiL2xvY2FsaG9zdGhvc3Rsb2NhbC9cIiwgXCIvXCIpO1xuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmRBbmRCZWdpbm5pbmdPZkhlYWRpbmcoXG4gICAgZmlsZTogVEZpbGUsXG4gICAgaGVhZGluZzogc3RyaW5nXG4pOiB7IGxhc3RMaW5lOiBudW1iZXI7IGZpcnN0TGluZTogbnVtYmVyIH0ge1xuICAgIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gY2FjaGUuc2VjdGlvbnM7XG4gICAgY29uc3QgZm91bmRIZWFkaW5nID0gY2FjaGUuaGVhZGluZ3M/LmZpbmQoKGUpID0+IGUuaGVhZGluZyA9PT0gaGVhZGluZyk7XG5cbiAgICBpZiAoZm91bmRIZWFkaW5nKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kU2VjdGlvbkluZGV4ID0gc2VjdGlvbnMuZmluZEluZGV4KFxuICAgICAgICAgICAgKHNlY3Rpb24pID0+XG4gICAgICAgICAgICAgICAgc2VjdGlvbi50eXBlID09PSBcImhlYWRpbmdcIiAmJlxuICAgICAgICAgICAgICAgIHNlY3Rpb24ucG9zaXRpb24uc3RhcnQubGluZSA9PT0gZm91bmRIZWFkaW5nLnBvc2l0aW9uLnN0YXJ0LmxpbmVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmVzdFNlY3Rpb25zID0gc2VjdGlvbnMuc2xpY2UoZm91bmRTZWN0aW9uSW5kZXggKyAxKTtcblxuICAgICAgICBjb25zdCBuZXh0SGVhZGluZ0luZGV4ID0gcmVzdFNlY3Rpb25zPy5maW5kSW5kZXgoXG4gICAgICAgICAgICAoZSkgPT4gZS50eXBlID09PSBcImhlYWRpbmdcIlxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGxhc3RTZWN0aW9uID1cbiAgICAgICAgICAgIHJlc3RTZWN0aW9uc1tcbiAgICAgICAgICAgICAgICAobmV4dEhlYWRpbmdJbmRleCAhPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgPyBuZXh0SGVhZGluZ0luZGV4XG4gICAgICAgICAgICAgICAgICAgIDogcmVzdFNlY3Rpb25zLmxlbmd0aCkgLSAxXG4gICAgICAgICAgICBdID8/IHNlY3Rpb25zW2ZvdW5kU2VjdGlvbkluZGV4XTtcbiAgICAgICAgY29uc3QgbGFzdExpbmUgPSBsYXN0U2VjdGlvbi5wb3NpdGlvbi5lbmQubGluZSArIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhc3RMaW5lOiBsYXN0TGluZSxcbiAgICAgICAgICAgIGZpcnN0TGluZTogc2VjdGlvbnNbZm91bmRTZWN0aW9uSW5kZXhdLnBvc2l0aW9uLmVuZC5saW5lICsgMSxcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgTm90aWNlKFwiQ2FuJ3QgZmluZCBoZWFkaW5nXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEZpbGVWaWV3LCBNYXJrZG93blZpZXcsIE5vdGljZSwgVEFic3RyYWN0RmlsZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBBZHZhbmNlZFVSSSBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBFbnRlckRhdGFNb2RhbCB9IGZyb20gXCIuL21vZGFscy9lbnRlcl9kYXRhX21vZGFsXCI7XG5pbXBvcnQgeyBGaWxlTW9kYWwgfSBmcm9tIFwiLi9tb2RhbHMvZmlsZV9tb2RhbFwiO1xuaW1wb3J0IFRvb2xzIGZyb20gXCIuL3Rvb2xzXCI7XG5pbXBvcnQgeyBQYXJhbWV0ZXJzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGNvcHlUZXh0LCBnZXRBbHRlcm5hdGl2ZUZpbGVQYXRoIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhhbmRsZXJzIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogQWR2YW5jZWRVUkkpIHt9XG5cbiAgICBwdWJsaWMgZ2V0IHRvb2xzKCk6IFRvb2xzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLnRvb2xzO1xuICAgIH1cblxuICAgIGhhbmRsZVBsdWdpbk1hbmFnZW1lbnQocGFyYW1ldGVyczogUGFyYW1ldGVycyk6IHZvaWQge1xuICAgICAgICBpZiAocGFyYW1ldGVyc1tcImVuYWJsZS1wbHVnaW5cIl0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpbklkID0gcGFyYW1ldGVyc1tcImVuYWJsZS1wbHVnaW5cIl07XG4gICAgICAgICAgICBhcHAucGx1Z2lucy5lbmFibGVQbHVnaW5BbmRTYXZlKHBsdWdpbklkKTtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYEVuYWJsZWQgJHtwbHVnaW5JZH1gKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzW1wiZGlzYWJsZS1wbHVnaW5cIl0pIHtcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpbklkID0gcGFyYW1ldGVyc1tcImRpc2FibGUtcGx1Z2luXCJdO1xuICAgICAgICAgICAgYXBwLnBsdWdpbnMuZGlzYWJsZVBsdWdpbkFuZFNhdmUocGx1Z2luSWQpO1xuICAgICAgICAgICAgbmV3IE5vdGljZShgRGlzYWJsZWQgJHtwbHVnaW5JZH1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoYW5kbGVGcm9udG1hdHRlcktleShwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHBhcmFtZXRlcnMuZnJvbnRtYXR0ZXJrZXk7XG4gICAgICAgIGNvbnN0IGZyb250bWF0dGVyID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmZpbGVwYXRoID8/IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpLnBhdGhcbiAgICAgICAgKS5mcm9udG1hdHRlcjtcblxuICAgICAgICBsZXQgcmVzOiBzdHJpbmc7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIltcIikgJiYga2V5LmVuZHNXaXRoKFwiXVwiKSkge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGtleS5zdWJzdHJpbmcoMSwga2V5Lmxlbmd0aCAtIDEpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIGxldCBjYWNoZTogYW55ID0gZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgbGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IGNhY2hlLmZpbmQoKGUpID0+IGUgPT0gaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBjYWNoZVtwYXJzZUludChpdGVtKV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUgPSBjYWNoZVtpdGVtXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMgPSBjYWNoZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IGZyb250bWF0dGVyW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBjb3B5VGV4dChyZXMpO1xuICAgIH1cblxuICAgIGhhbmRsZVdvcmtzcGFjZShwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZXMgPSBhcHAuaW50ZXJuYWxQbHVnaW5zPy5wbHVnaW5zPy53b3Jrc3BhY2VzO1xuICAgICAgICBpZiAoIXdvcmtzcGFjZXMpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJDYW5ub3QgZmluZCBXb3Jrc3BhY2VzIHBsdWdpbi4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuXCIpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZmFpbHVyZShwYXJhbWV0ZXJzKTtcbiAgICAgICAgfSBlbHNlIGlmICh3b3Jrc3BhY2VzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLnNhdmV3b3Jrc3BhY2UgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSB3b3Jrc3BhY2VzLmluc3RhbmNlLmFjdGl2ZVdvcmtzcGFjZTtcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VzLmluc3RhbmNlLnNhdmVXb3Jrc3BhY2UoYWN0aXZlKTtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGBTYXZlZCBjdXJyZW50IHdvcmtzcGFjZSB0byAke2FjdGl2ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLndvcmtzcGFjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VzLmluc3RhbmNlLmxvYWRXb3Jrc3BhY2UocGFyYW1ldGVycy53b3Jrc3BhY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJXb3Jrc3BhY2VzIHBsdWdpbiBpcyBub3QgZW5hYmxlZFwiKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmZhaWx1cmUocGFyYW1ldGVycyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBoYW5kbGVDb21tYW5kKHBhcmFtZXRlcnM6IFBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMuZmlsZXBhdGgpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLm1vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1ldGVycy5tb2RlID09IFwibmV3XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5maWxlcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiL1wiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZmlsZXBhdGggPSBnZXRBbHRlcm5hdGl2ZUZpbGVQYXRoKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiBwYXJhbWV0ZXJzLmZpbGVwYXRoLFxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgICAgICAgICBpZiAodmlldykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1ldGVycy5tb2RlID09PSBcImFwcGVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoZGF0YSArIFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBlZGl0b3IubGluZUNvdW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHsgY2g6IDAsIGxpbmU6IGxpbmVzIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMubW9kZSA9PT0gXCJwcmVwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlxcblwiICsgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHsgY2g6IDAsIGxpbmU6IDAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1ldGVycy5tb2RlID09PSBcIm92ZXJ3cml0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMubGluZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiBwYXJhbWV0ZXJzLmZpbGVwYXRoLFxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0Q3Vyc29ySW5MaW5lKHBhcmFtZXRlcnMubGluZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiBwYXJhbWV0ZXJzLmZpbGVwYXRoLFxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nOiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuRmlsZVdpdGhvdXRXcml0ZUluTmV3UGFuZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1ldGVycy5jb21tYW5kaWQpIHtcbiAgICAgICAgICAgIGFwcC5jb21tYW5kcy5leGVjdXRlQ29tbWFuZEJ5SWQocGFyYW1ldGVycy5jb21tYW5kaWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuY29tbWFuZG5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd0NvbW1hbmRzID0gYXBwLmNvbW1hbmRzLmNvbW1hbmRzO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjb21tYW5kIGluIHJhd0NvbW1hbmRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJhd0NvbW1hbmRzW2NvbW1hbmRdLm5hbWUgPT09IHBhcmFtZXRlcnMuY29tbWFuZG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhd0NvbW1hbmRzW2NvbW1hbmRdLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYXdDb21tYW5kc1tjb21tYW5kXS5jYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF3Q29tbWFuZHNbY29tbWFuZF0uY2hlY2tDYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGx1Z2luLnN1Y2Nlc3MocGFyYW1ldGVycyk7XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlRXZhbChwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmIChwYXJhbWV0ZXJzLmZpbGVwYXRoKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5tb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMubW9kZSA9PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZmlsZXBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIi9cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmZpbGVwYXRoID0gZ2V0QWx0ZXJuYXRpdmVGaWxlUGF0aChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogcGFyYW1ldGVycy5maWxlcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJzb3VyY2VcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWRpdG9yID0gdmlldy5lZGl0b3I7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMubW9kZSA9PT0gXCJhcHBlbmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKGRhdGEgKyBcIlxcblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gZWRpdG9yLmxpbmVDb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvcih7IGNoOiAwLCBsaW5lOiBsaW5lcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLm1vZGUgPT09IFwicHJlcGVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcXG5cIiArIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvcih7IGNoOiAwLCBsaW5lOiAwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMubW9kZSA9PT0gXCJvdmVyd3JpdGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmxpbmUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogcGFyYW1ldGVycy5maWxlcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJzb3VyY2VcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldEN1cnNvckluTGluZShwYXJhbWV0ZXJzLmxpbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogcGFyYW1ldGVycy5maWxlcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZzogdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVXaXRob3V0V3JpdGVJbk5ld1BhbmUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHBhcmFtZXRlcnMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmFsbG93RXZhbCkge1xuICAgICAgICAgICAgLy9DYWxsIGV2YWwgaW4gYSBnbG9iYWwgc2NvcGVcbiAgICAgICAgICAgIGNvbnN0IGV2YWwyID0gZXZhbDtcbiAgICAgICAgICAgIGV2YWwyKHBhcmFtZXRlcnMuZXZhbCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zdWNjZXNzKHBhcmFtZXRlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICBcIkV2YWwgaXMgbm90IGFsbG93ZWQuIFBsZWFzZSBlbmFibGUgaXQgaW4gdGhlIHNldHRpbmdzLlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZmFpbHVyZShwYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZURvZXNGaWxlRXhpc3QocGFyYW1ldGVyczogUGFyYW1ldGVycykge1xuICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci5leGlzdHMocGFyYW1ldGVycy5maWxlcGF0aCk7XG5cbiAgICAgICAgY29weVRleHQoKGV4aXN0cyA/IDEgOiAwKS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICB9XG4gICAgYXN5bmMgaGFuZGxlU2VhcmNoQW5kUmVwbGFjZShwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGxldCBmaWxlOiBURmlsZTtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMuZmlsZXBhdGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGFic3RyYWN0RmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5maWxlcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChhYnN0cmFjdEZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIGZpbGUgPSBhYnN0cmFjdEZpbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBhcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLnNlYXJjaHJlZ2V4KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgWywgLCBwYXR0ZXJuLCBmbGFnc10gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5zZWFyY2hyZWdleC5tYXRjaCgvKFxcLz8pKC4rKVxcMShbYS16XSopL2kpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocGF0dGVybiwgZmxhZ3MpO1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKHJlZ2V4LCBwYXJhbWV0ZXJzLnJlcGxhY2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zdWNjZXNzKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBgQ2FuJ3QgcGFyc2UgJHtwYXJhbWV0ZXJzLnNlYXJjaHJlZ2V4fSBhcyBSZWdFeGBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZmFpbHVyZShwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2VBbGwocGFyYW1ldGVycy5zZWFyY2gsIHBhcmFtZXRlcnMucmVwbGFjZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ud3JpdGVBbmRPcGVuRmlsZShmaWxlLnBhdGgsIGRhdGEsIHBhcmFtZXRlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIkNhbm5vdCBmaW5kIGZpbGVcIik7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5mYWlsdXJlKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlU2VhcmNoKHBhcmFtZXRlcnM6IFBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMuZmlsZXBhdGgpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLm9wZW4oe1xuICAgICAgICAgICAgICAgIGZpbGU6IHBhcmFtZXRlcnMuZmlsZXBhdGgsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoRmlsZVZpZXcpO1xuICAgICAgICB2aWV3LmN1cnJlbnRNb2RlLnNob3dTZWFyY2goKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gdmlldy5jdXJyZW50TW9kZS5zZWFyY2g7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hJbnB1dEVsLnZhbHVlID0gcGFyYW1ldGVycy5zZWFyY2g7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hJbnB1dEVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIikpO1xuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZVdyaXRlKFxuICAgICAgICBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzLFxuICAgICAgICBjcmVhdGVkRGFpbHlOb3RlOiBib29sZWFuID0gZmFsc2VcbiAgICApIHtcbiAgICAgICAgbGV0IGZpbGU6IFRBYnN0cmFjdEZpbGUgfCBudWxsO1xuICAgICAgICBpZiAocGFyYW1ldGVycy5maWxlcGF0aCkge1xuICAgICAgICAgICAgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGFyYW1ldGVycy5maWxlcGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1ldGVycy5maWxlcGF0aCB8fCBmaWxlKSB7XG4gICAgICAgICAgICBsZXQgb3V0RmlsZTogVEZpbGU7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHBhcmFtZXRlcnMuZmlsZXBhdGggPz8gZmlsZS5wYXRoO1xuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMubW9kZSA9PT0gXCJvdmVyd3JpdGVcIikge1xuICAgICAgICAgICAgICAgIG91dEZpbGUgPSBhd2FpdCB0aGlzLnBsdWdpbi53cml0ZUFuZE9wZW5GaWxlKFxuICAgICAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnN1Y2Nlc3MocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMubW9kZSA9PT0gXCJwcmVwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEZpbGUgPSBhd2FpdCB0aGlzLnBsdWdpbi5wcmVwZW5kKGZpbGUsIHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEZpbGUgPSBhd2FpdCB0aGlzLnBsdWdpbi5wcmVwZW5kKHBhdGgsIHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zdWNjZXNzKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLm1vZGUgPT09IFwiYXBwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEZpbGUgPSBhd2FpdCB0aGlzLnBsdWdpbi5hcHBlbmQoZmlsZSwgcGFyYW1ldGVycyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0RmlsZSA9IGF3YWl0IHRoaXMucGx1Z2luLmFwcGVuZChwYXRoLCBwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1ldGVycy5tb2RlID09PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRGaWxlID0gYXdhaXQgdGhpcy5wbHVnaW4ud3JpdGVBbmRPcGVuRmlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEFsdGVybmF0aXZlRmlsZVBhdGgoZmlsZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmhvb2tTdWNjZXNzKHBhcmFtZXRlcnMsIG91dEZpbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dEZpbGUgPSBhd2FpdCB0aGlzLnBsdWdpbi53cml0ZUFuZE9wZW5GaWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uaG9va1N1Y2Nlc3MocGFyYW1ldGVycywgb3V0RmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY3JlYXRlZERhaWx5Tm90ZSAmJiBmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiRmlsZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5vcGVuRXhpc3RpbmdGaWxlQW5kU2V0Q3Vyc29yKGZpbGUucGF0aCwgcGFyYW1ldGVycyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZmFpbHVyZShwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0RmlsZSA9IGF3YWl0IHRoaXMucGx1Z2luLndyaXRlQW5kT3BlbkZpbGUoXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLnVpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbHMud3JpdGVVSURUb0ZpbGUob3V0RmlsZSwgcGFyYW1ldGVycy51aWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIkNhbm5vdCBmaW5kIGZpbGVcIik7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5mYWlsdXJlKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlT3BlbihwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmIChwYXJhbWV0ZXJzLmhlYWRpbmcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5vcGVuKHtcbiAgICAgICAgICAgICAgICBmaWxlOiBwYXJhbWV0ZXJzLmZpbGVwYXRoICsgXCIjXCIgKyBwYXJhbWV0ZXJzLmhlYWRpbmcsXG4gICAgICAgICAgICAgICAgc2V0dGluZzogdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVXaXRob3V0V3JpdGVJbk5ld1BhbmUsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICBzdXBwb3J0UG9wb3ZlcjogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgICAgIGlmICghdmlldykgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodmlldy5maWxlKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmcgPSBjYWNoZS5oZWFkaW5ncy5maW5kKFxuICAgICAgICAgICAgICAgIChlKSA9PiBlLmhlYWRpbmcgPT09IHBhcmFtZXRlcnMuaGVhZGluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZpZXcuZWRpdG9yLmZvY3VzKCk7XG4gICAgICAgICAgICB2aWV3LmVkaXRvci5zZXRDdXJzb3Ioe1xuICAgICAgICAgICAgICAgIGxpbmU6IGhlYWRpbmcucG9zaXRpb24uc3RhcnQubGluZSArIDEsXG4gICAgICAgICAgICAgICAgY2g6IDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmJsb2NrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ub3Blbih7XG4gICAgICAgICAgICAgICAgZmlsZTogcGFyYW1ldGVycy5maWxlcGF0aCArIFwiI15cIiArIHBhcmFtZXRlcnMuYmxvY2ssXG4gICAgICAgICAgICAgICAgc2V0dGluZzogdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVXaXRob3V0V3JpdGVJbk5ld1BhbmUsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICBzdXBwb3J0UG9wb3ZlcjogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgICAgIGlmICghdmlldykgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodmlldy5maWxlKTtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gY2FjaGUuYmxvY2tzW3BhcmFtZXRlcnMuYmxvY2tdO1xuICAgICAgICAgICAgdmlldy5lZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgICAgIHZpZXcuZWRpdG9yLnNldEN1cnNvcih7IGxpbmU6IGJsb2NrLnBvc2l0aW9uLnN0YXJ0LmxpbmUsIGNoOiAwIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ub3Blbih7XG4gICAgICAgICAgICAgICAgZmlsZTogcGFyYW1ldGVycy5maWxlcGF0aCxcbiAgICAgICAgICAgICAgICBzZXR0aW5nOiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuRmlsZVdpdGhvdXRXcml0ZUluTmV3UGFuZSxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgIG1vZGU6IHBhcmFtZXRlcnMubGluZSAhPSB1bmRlZmluZWQgPyBcInNvdXJjZVwiIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5saW5lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldEN1cnNvckluTGluZShwYXJhbWV0ZXJzLmxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbWV0ZXJzLm1vZGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zZXRDdXJzb3IocGFyYW1ldGVycy5tb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1ldGVycy51aWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblxuICAgICAgICAgICAgdGhpcy50b29scy53cml0ZVVJRFRvRmlsZSh2aWV3LmZpbGUsIHBhcmFtZXRlcnMudWlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsdWdpbi5zdWNjZXNzKHBhcmFtZXRlcnMpO1xuICAgIH1cblxuICAgIGhhbmRsZUNvcHlGaWxlVVJJKHdpdGhvdXREYXRhOiBib29sZWFuLCBmaWxlPzogVEZpbGUpIHtcbiAgICAgICAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShGaWxlVmlldyk7XG4gICAgICAgIGlmICghdmlldyAmJiAhZmlsZSkgcmV0dXJuO1xuICAgICAgICBpZiAodmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlldykge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gdmlldy5lZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZSh2aWV3LmZpbGUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlLmhlYWRpbmdzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBoZWFkaW5nIG9mIGNhY2hlLmhlYWRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmcucG9zaXRpb24uc3RhcnQubGluZSA8PSBwb3MubGluZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGluZy5wb3NpdGlvbi5lbmQubGluZSA+PSBwb3MubGluZVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHMuY29weVVSSSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXBhdGg6IHZpZXcuZmlsZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmc6IGhlYWRpbmcuaGVhZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhY2hlLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmxvY2tJRCBvZiBPYmplY3Qua2V5cyhjYWNoZS5ibG9ja3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gY2FjaGUuYmxvY2tzW2Jsb2NrSURdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbi5zdGFydC5saW5lIDw9IHBvcy5saW5lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbi5lbmQubGluZSA+PSBwb3MubGluZVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHMuY29weVVSSSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXBhdGg6IHZpZXcuZmlsZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiBibG9ja0lELFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2l0aG91dERhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUyID0gZmlsZSA/PyBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgICAgIGlmICghZmlsZTIpIHtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiTm8gZmlsZSBvcGVuZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50b29scy5jb3B5VVJJKHtcbiAgICAgICAgICAgICAgICBmaWxlcGF0aDogZmlsZTIucGF0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmlsZU1vZGFsID0gbmV3IEZpbGVNb2RhbChcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICBcIkNob29zZSBhIGZpbGVcIixcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZpbGVNb2RhbC5vcGVuKCk7XG4gICAgICAgICAgICBmaWxlTW9kYWwub25DaG9vc2VJdGVtID0gKGl0ZW0sIF8pID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgRW50ZXJEYXRhTW9kYWwodGhpcy5wbHVnaW4sIGl0ZW0uc291cmNlKS5vcGVuKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlT3BlblNldHRpbmdzKHBhcmFtZXRlcnM6IFBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKGFwcC5zZXR0aW5nLmNvbnRhaW5lckVsLnBhcmVudEVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGFwcC5zZXR0aW5nLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1ldGVycy5zZXR0aW5naWQgPT0gXCJwbHVnaW4tYnJvd3NlclwiKSB7XG4gICAgICAgICAgICBhcHAuc2V0dGluZy5vcGVuVGFiQnlJZChcImNvbW11bml0eS1wbHVnaW5zXCIpO1xuICAgICAgICAgICAgYXBwLnNldHRpbmcuYWN0aXZlVGFiLmNvbnRhaW5lckVsLmZpbmQoXCIubW9kLWN0YVwiKS5jbGljaygpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuc2V0dGluZ2lkID09IFwidGhlbWUtYnJvd3NlclwiKSB7XG4gICAgICAgICAgICBhcHAuc2V0dGluZy5vcGVuVGFiQnlJZChcImFwcGVhcmFuY2VcIik7XG4gICAgICAgICAgICBhcHAuc2V0dGluZy5hY3RpdmVUYWIuY29udGFpbmVyRWwuZmluZChcIi5tb2QtY3RhXCIpLmNsaWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHAuc2V0dGluZy5vcGVuVGFiQnlJZChwYXJhbWV0ZXJzLnNldHRpbmdpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1ldGVycy5zZXR0aW5nc2VjdGlvbikge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPVxuICAgICAgICAgICAgICAgIGFwcC5zZXR0aW5nLnRhYkNvbnRlbnRDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIipcIik7XG4gICAgICAgICAgICBjb25zdCBoZWFkaW5nOiBFbGVtZW50ID0gQXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChcbiAgICAgICAgICAgICAgICBlbGVtZW50cyxcbiAgICAgICAgICAgICAgICAoZTogRWxlbWVudCkgPT4gZS50ZXh0Q29udGVudCA9PSBwYXJhbWV0ZXJzLnNldHRpbmdzZWN0aW9uXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoaGVhZGluZykge1xuICAgICAgICAgICAgICAgIGhlYWRpbmcuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsdWdpbi5zdWNjZXNzKHBhcmFtZXRlcnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZVVwZGF0ZVBsdWdpbnMocGFyYW1ldGVyczogUGFyYW1ldGVycykge1xuICAgICAgICBwYXJhbWV0ZXJzLnNldHRpbmdpZCA9IFwiY29tbXVuaXR5LXBsdWdpbnNcIjtcbiAgICAgICAgdGhpcy5oYW5kbGVPcGVuU2V0dGluZ3MocGFyYW1ldGVycyk7XG4gICAgICAgIGFwcC5zZXR0aW5nLmFjdGl2ZVRhYi5jb250YWluZXJFbC5maW5kQWxsKFwiLm1vZC1jdGFcIikubGFzdCgpLmNsaWNrKCk7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJXYWl0aW5nIDEwIHNlY29uZHNcIik7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwICogMTAwMCkpO1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cygoYXBwIGFzIGFueSkucGx1Z2lucy51cGRhdGVzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGFwcC5zZXR0aW5nLmFjdGl2ZVRhYi5jb250YWluZXJFbFxuICAgICAgICAgICAgICAgIC5maW5kQWxsKFwiLm1vZC1jdGFcIilcbiAgICAgICAgICAgICAgICAubGFzdCgpXG4gICAgICAgICAgICAgICAgLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbHVnaW4uc3VjY2VzcyhwYXJhbWV0ZXJzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21tYW5kLCBGdXp6eVN1Z2dlc3RNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IEFkdmFuY2VkVVJJIGZyb20gXCIuLi9tYWluXCI7XG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kTW9kYWwgZXh0ZW5kcyBGdXp6eVN1Z2dlc3RNb2RhbDxDb21tYW5kPiB7XG4gICAgcGx1Z2luOiBBZHZhbmNlZFVSSTtcbiAgICBmaWxlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBBZHZhbmNlZFVSSSwgZmlsZT86IHN0cmluZykge1xuICAgICAgICBzdXBlcihwbHVnaW4uYXBwKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogQ29tbWFuZFtdIHtcbiAgICAgICAgY29uc3QgcmF3Q29tbWFuZHMgPSB0aGlzLmFwcC5jb21tYW5kcy5jb21tYW5kcztcbiAgICAgICAgY29uc3QgY29tbWFuZHM6IENvbW1hbmRbXSA9IE9iamVjdC5rZXlzKHJhd0NvbW1hbmRzKS5tYXAoKGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IGlkOiByYXdDb21tYW5kc1tlXS5pZCwgbmFtZTogcmF3Q29tbWFuZHNbZV0ubmFtZSB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRzO1xuICAgIH1cblxuICAgIGdldEl0ZW1UZXh0KGl0ZW06IENvbW1hbmQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBDb21tYW5kLCBfOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsdWdpbi50b29scy5jb3B5VVJJKHtcbiAgICAgICAgICAgIGZpbGVwYXRoOiB0aGlzLmZpbGUsXG4gICAgICAgICAgICBjb21tYW5kaWQ6IGl0ZW0uaWQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFN1Z2dlc3RNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IEFkdmFuY2VkVVJJIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBTZWFyY2hNb2RhbERhdGEgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VNb2RhbCBleHRlbmRzIFN1Z2dlc3RNb2RhbDxzdHJpbmc+IHtcbiAgICBwbHVnaW46IEFkdmFuY2VkVVJJO1xuICAgIGVtcHR5VGV4dCA9IFwiRW1wdHkgdGV4dCAocmVwbGFjZSB3aXRoIG5vdGhpbmcpXCI7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBsdWdpbjogQWR2YW5jZWRVUkksXG4gICAgICAgIHByaXZhdGUgc2VhcmNoOiBTZWFyY2hNb2RhbERhdGEsXG4gICAgICAgIHByaXZhdGUgZmlsZXBhdGg6IHN0cmluZ1xuICAgICkge1xuICAgICAgICBzdXBlcihwbHVnaW4uYXBwKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoXCJSZXBsYWNlbWVudCB0ZXh0XCIpO1xuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKHF1ZXJ5OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgIGlmIChxdWVyeSA9PT0gXCJcIikge1xuICAgICAgICAgICAgcXVlcnkgPSB0aGlzLmVtcHR5VGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3F1ZXJ5XTtcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKHZhbHVlOiBzdHJpbmcsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBvbkNob29zZVN1Z2dlc3Rpb24oaXRlbTogc3RyaW5nLCBfOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zZWFyY2guaXNSZWdFeCkge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4udG9vbHMuY29weVVSSSh7XG4gICAgICAgICAgICAgICAgZmlsZXBhdGg6IHRoaXMuZmlsZXBhdGgsXG4gICAgICAgICAgICAgICAgc2VhcmNocmVnZXg6IHRoaXMuc2VhcmNoLnNvdXJjZSxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiBpdGVtID09IHRoaXMuZW1wdHlUZXh0ID8gXCJcIiA6IGl0ZW0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnRvb2xzLmNvcHlVUkkoe1xuICAgICAgICAgICAgICAgIGZpbGVwYXRoOiB0aGlzLmZpbGVwYXRoLFxuICAgICAgICAgICAgICAgIHNlYXJjaDogdGhpcy5zZWFyY2guc291cmNlLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IGl0ZW0gPT0gdGhpcy5lbXB0eVRleHQgPyBcIlwiIDogaXRlbSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgQWR2YW5jZWRVUkkgZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNlYXJjaE1vZGFsRGF0YSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoTW9kYWwgZXh0ZW5kcyBTdWdnZXN0TW9kYWw8U2VhcmNoTW9kYWxEYXRhPiB7XG4gICAgcGx1Z2luOiBBZHZhbmNlZFVSSTtcblxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogQWR2YW5jZWRVUkkpIHtcbiAgICAgICAgc3VwZXIocGx1Z2luLmFwcCk7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFwiU2VhcmNoZWQgdGV4dC4gUmVnRXggaXMgc3VwcG9ydGVkXCIpO1xuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKHF1ZXJ5OiBzdHJpbmcpOiBTZWFyY2hNb2RhbERhdGFbXSB7XG4gICAgICAgIGlmIChxdWVyeSA9PT0gXCJcIikge1xuICAgICAgICAgICAgcXVlcnkgPSBcIi4uLlwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZWdleDogUmVnRXhwO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHF1ZXJ5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc291cmNlOiBxdWVyeSxcbiAgICAgICAgICAgICAgICBpc1JlZ0V4OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBxdWVyeSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc291cmNlOiBxdWVyeSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiByZWdleCA/IGBBcyBSZWdFeDogJHtxdWVyeX1gIDogYENhbid0IHBhcnNlIFJlZ0V4YCxcbiAgICAgICAgICAgICAgICBpc1JlZ0V4OiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKHZhbHVlOiBTZWFyY2hNb2RhbERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5pbm5lclRleHQgPSB2YWx1ZS5kaXNwbGF5O1xuICAgIH1cblxuICAgIG9uQ2hvb3NlU3VnZ2VzdGlvbihcbiAgICAgICAgaXRlbTogU2VhcmNoTW9kYWxEYXRhLFxuICAgICAgICBfOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudFxuICAgICk6IHZvaWQge31cbn1cbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IEFkdmFuY2VkVVJJIGZyb20gXCIuL21haW5cIjtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICAgcGx1Z2luOiBBZHZhbmNlZFVSSTtcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBBZHZhbmNlZFVSSSkge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogdGhpcy5wbHVnaW4ubWFuaWZlc3QubmFtZSB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIk9wZW4gZmlsZSBvbiB3cml0ZVwiKS5hZGRUb2dnbGUoKGNiKSA9PlxuICAgICAgICAgICAgY2JcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVPbldyaXRlKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVPbldyaXRlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIk9wZW4gZmlsZSBvbiB3cml0ZSBpbiBhIG5ldyBwYW5lXCIpXG4gICAgICAgICAgICAuc2V0RGlzYWJsZWQodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVPbldyaXRlKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgICAgICAgICAgY2JcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9wZW5GaWxlT25Xcml0ZUluTmV3UGFuZSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVPbldyaXRlSW5OZXdQYW5lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIk9wZW4gZGFpbHkgbm90ZSBpbiBhIG5ldyBwYW5lXCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKChjYikgPT5cbiAgICAgICAgICAgICAgICBjYlxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkRhaWx5SW5OZXdQYW5lKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuRGFpbHlJbk5ld1BhbmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiT3BlbiBmaWxlIHdpdGhvdXQgd3JpdGUgaW4gbmV3IHBhbmVcIilcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKGNiKSA9PlxuICAgICAgICAgICAgICAgIGNiXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9wZW5GaWxlV2l0aG91dFdyaXRlSW5OZXdQYW5lXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlbkZpbGVXaXRob3V0V3JpdGVJbk5ld1BhbmUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJVc2UgVUlEIGluc3RlYWQgb2YgZmlsZSBwYXRoc1wiKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgICAgICAgICAgY2Iuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlVUlEKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlVUlEID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlVUlEKSB7XG4gICAgICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAuc2V0TmFtZShcIkFkZCBmaWxlcGF0aCBwYXJhbWV0ZXJcIilcbiAgICAgICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICAgICAgXCJXaGVuIHVzaW5nIFVJRCBpbnN0ZWFkIG9mIGZpbGUgcGF0aHMsIHlvdSBjYW4gc3RpbGwgYWRkIHRoZSBmaWxlcGF0aCBwYXJhbWV0ZXIgdG8ga25vdyB3aGF0IHRoaXMgVVJJIGlzIGFib3V0LiBJdCdzIE5PVCBhY3R1YWxseSB1c2VkLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5hZGRUb2dnbGUoKGNiKSA9PlxuICAgICAgICAgICAgICAgICAgICBjYlxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmFkZEZpbGVwYXRoV2hlblVzaW5nVUlEKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmFkZEZpbGVwYXRoV2hlblVzaW5nVUlEID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlVJRCBmaWVsZCBpbiBmcm9udG1hdHRlclwiKVxuICAgICAgICAgICAgLmFkZFRleHQoKGNiKSA9PlxuICAgICAgICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmlkRmllbGQpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZEZpZWxkID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJBbGxvdyBleGVjdXRpbmcgYXJiaXRyYXJ5IGNvZGUgdmlhIGV2YWxcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIFwi4pqg77iPIFRoaXMgY2FuIGJlIGRhbmdlcm91cyBhcyBpdCBhbGxvd3MgZXhlY3V0aW5nIGFyYml0cmFyeSBjb2RlLiBPbmx5IGVuYWJsZSB0aGlzIGlmIHlvdSB0cnVzdCB0aGUgc291cmNlIG9mIHRoZSBVUklzIHlvdSBhcmUgdXNpbmcgYW5kIGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLiDimqDvuI9cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgICAgICAgICAgY2JcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmFsbG93RXZhbClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWxsb3dFdmFsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkRvbmF0ZVwiKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgXCJJZiB5b3UgbGlrZSB0aGlzIFBsdWdpbiwgY29uc2lkZXIgZG9uYXRpbmcgdG8gc3VwcG9ydCBjb250aW51ZWQgZGV2ZWxvcG1lbnQuXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRCdXR0b24oKGJ0KSA9PiB7XG4gICAgICAgICAgICAgICAgYnQuYnV0dG9uRWwub3V0ZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgXCI8YSBocmVmPSdodHRwczovL2tvLWZpLmNvbS9GMUYxOTVJUTUnIHRhcmdldD0nX2JsYW5rJz48aW1nIGhlaWdodD0nMzYnIHN0eWxlPSdib3JkZXI6MHB4O2hlaWdodDozNnB4Oycgc3JjPSdodHRwczovL2Nkbi5rby1maS5jb20vY2RuL2tvZmkzLnBuZz92PTMnIGJvcmRlcj0nMCcgYWx0PSdCdXkgTWUgYSBDb2ZmZWUgYXQga28tZmkuY29tJyAvPjwvYT5cIjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHsgQ2FjaGVkTWV0YWRhdGEsIE5vdGljZSwgcGFyc2VGcm9udE1hdHRlckVudHJ5LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIjtcbmltcG9ydCBBZHZhbmNlZFVSSSBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBBZHZhbmNlZFVSSVNldHRpbmdzLCBQYXJhbWV0ZXJzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGNvcHlUZXh0IH0gZnJvbSBcIi4vdXRpbHNcIjtcbi8qKlxuICogVGhlc2UgbWV0aG9kcyBkZXBlbmQgb24gdGhlIHBsdWdpbnMgc2V0dGluZ3MgaW4gY29udHJhc3QgdG8gdGhlIHV0aWxzLnRzIGZpbGUsIHdoaWNoJ3MgZnVuY3Rpb25zIGFyZSBpbmRlcGVuZGVudCBvZiB0aGUgcGx1Z2lucyBzZXR0aW5ncy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbHMge1xuICAgIHB1YmxpYyBnZXQgc2V0dGluZ3MoKTogQWR2YW5jZWRVUklTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogQWR2YW5jZWRVUkkpIHt9XG5cbiAgICBhc3luYyB3cml0ZVVJRFRvRmlsZShmaWxlOiBURmlsZSwgdWlkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBmcm9udG1hdHRlciA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50OiBzdHJpbmcgPSBhd2FpdCBhcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgY29uc3QgaXNZYW1sRW1wdHk6IGJvb2xlYW4gPVxuICAgICAgICAgICAgKCFmcm9udG1hdHRlciB8fCBmcm9udG1hdHRlci5sZW5ndGggPT09IDApICYmXG4gICAgICAgICAgICAhZmlsZUNvbnRlbnQubWF0Y2goL14tezN9XFxzKlxcbipcXHIqLXszfS8pO1xuICAgICAgICBsZXQgc3BsaXRDb250ZW50ID0gZmlsZUNvbnRlbnQuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIGlmIChpc1lhbWxFbXB0eSkge1xuICAgICAgICAgICAgc3BsaXRDb250ZW50LnVuc2hpZnQoXCItLS1cIik7XG4gICAgICAgICAgICBzcGxpdENvbnRlbnQudW5zaGlmdChgJHt0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZEZpZWxkfTogJHt1aWR9YCk7XG4gICAgICAgICAgICBzcGxpdENvbnRlbnQudW5zaGlmdChcIi0tLVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwbGl0Q29udGVudC5zcGxpY2UoXG4gICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIGAke3RoaXMucGx1Z2luLnNldHRpbmdzLmlkRmllbGR9OiAke3VpZH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3RmlsZUNvbnRlbnQgPSBzcGxpdENvbnRlbnQuam9pbihcIlxcblwiKTtcbiAgICAgICAgYXdhaXQgYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdGaWxlQ29udGVudCk7XG4gICAgICAgIHJldHVybiB1aWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VUlERnJvbUZpbGUoZmlsZTogVEZpbGUpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgY2FjaGU6IENhY2hlZE1ldGFkYXRhO1xuXG4gICAgICAgIC8vYXdhaXQgcGFyc2luZyBvZiBmcm9udG1hdHRlclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSAyMDsgaSsrKSB7XG4gICAgICAgICAgICBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcblxuICAgICAgICAgICAgaWYgKGNhY2hlICE9PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTUwKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdWlkID0gcGFyc2VGcm9udE1hdHRlckVudHJ5KFxuICAgICAgICAgICAgY2FjaGUuZnJvbnRtYXR0ZXIsXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZEZpZWxkXG4gICAgICAgICk7XG4gICAgICAgIGlmICh1aWQgIT0gdW5kZWZpbmVkKSByZXR1cm4gdWlkO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy53cml0ZVVJRFRvRmlsZShmaWxlLCB1dWlkdjQoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVVUkkocGFyYW1ldGVyczogUGFyYW1ldGVycywgZG91YmxlRW5jb2RlOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGBvYnNpZGlhbjovL2FkdmFuY2VkLXVyaT92YXVsdD0ke2VuY29kZVVSSUNvbXBvbmVudChcbiAgICAgICAgICAgIGFwcC52YXVsdC5nZXROYW1lKClcbiAgICAgICAgKX1gO1xuICAgICAgICBsZXQgc3VmZml4ID0gXCJcIjtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGFyYW1ldGVycy5maWxlcGF0aCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudXNlVUlEICYmIGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmFkZEZpbGVwYXRoV2hlblVzaW5nVUlEKVxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZmlsZXBhdGggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnVpZCA9IGF3YWl0IHRoaXMuZ2V0VUlERnJvbUZpbGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBwYXJhbWV0ZXIgaW4gcGFyYW1ldGVycykge1xuICAgICAgICAgICAgaWYgKChwYXJhbWV0ZXJzIGFzIGFueSlbcGFyYW1ldGVyXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzdWZmaXggPVxuICAgICAgICAgICAgICAgICAgICBzdWZmaXggK1xuICAgICAgICAgICAgICAgICAgICBgJiR7cGFyYW1ldGVyfT0ke2VuY29kZVVSSUNvbXBvbmVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIChwYXJhbWV0ZXJzIGFzIGFueSlbcGFyYW1ldGVyXVxuICAgICAgICAgICAgICAgICAgICApfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvdWJsZUVuY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIGVuY29kZVVSSShzdWZmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGNvcHlVUkkocGFyYW1ldGVyczogUGFyYW1ldGVycykge1xuICAgICAgICBjb25zdCB1cmkgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVVJJKHBhcmFtZXRlcnMsIHRydWUpO1xuICAgICAgICBhd2FpdCBjb3B5VGV4dCh1cmkpO1xuXG4gICAgICAgIG5ldyBOb3RpY2UoXCJBZHZhbmNlZCBVUkkgY29waWVkIHRvIHlvdXIgY2xpcGJvYXJkXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgYmFzZTY0VG9BcnJheUJ1ZmZlcixcbiAgICBNYXJrZG93blZpZXcsXG4gICAgbm9ybWFsaXplUGF0aCxcbiAgICBOb3RpY2UsXG4gICAgcGFyc2VGcm9udE1hdHRlckFsaWFzZXMsXG4gICAgcGFyc2VGcm9udE1hdHRlckVudHJ5LFxuICAgIFBsdWdpbixcbiAgICBURmlsZSxcbiAgICBURm9sZGVyLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHN0cmlwTUQgfSBmcm9tIFwib2JzaWRpYW4tY29tbXVuaXR5LWxpYlwiO1xuaW1wb3J0IHtcbiAgICBhcHBIYXNEYWlseU5vdGVzUGx1Z2luTG9hZGVkLFxuICAgIGNyZWF0ZURhaWx5Tm90ZSxcbiAgICBnZXRBbGxEYWlseU5vdGVzLFxuICAgIGdldERhaWx5Tm90ZSxcbn0gZnJvbSBcIm9ic2lkaWFuLWRhaWx5LW5vdGVzLWludGVyZmFjZVwiO1xuaW1wb3J0IHsgQmxvY2tVdGlscyB9IGZyb20gXCIuL2Jsb2NrX3V0aWxzXCI7XG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXREYWlseU5vdGVQYXRoIH0gZnJvbSBcIi4vZGFpbHlfbm90ZV91dGlsc1wiO1xuaW1wb3J0IEhhbmRsZXJzIGZyb20gXCIuL2hhbmRsZXJzXCI7XG5pbXBvcnQgeyBDb21tYW5kTW9kYWwgfSBmcm9tIFwiLi9tb2RhbHMvY29tbWFuZF9tb2RhbFwiO1xuaW1wb3J0IHsgRW50ZXJEYXRhTW9kYWwgfSBmcm9tIFwiLi9tb2RhbHMvZW50ZXJfZGF0YV9tb2RhbFwiO1xuaW1wb3J0IHsgRmlsZU1vZGFsIH0gZnJvbSBcIi4vbW9kYWxzL2ZpbGVfbW9kYWxcIjtcbmltcG9ydCB7IFJlcGxhY2VNb2RhbCB9IGZyb20gXCIuL21vZGFscy9yZXBsYWNlX21vZGFsXCI7XG5pbXBvcnQgeyBTZWFyY2hNb2RhbCB9IGZyb20gXCIuL21vZGFscy9zZWFyY2hfbW9kYWxcIjtcbmltcG9ydCB7IFNldHRpbmdzVGFiIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcbmltcG9ydCBUb29scyBmcm9tIFwiLi90b29sc1wiO1xuaW1wb3J0IHtcbiAgICBBZHZhbmNlZFVSSVNldHRpbmdzLFxuICAgIEZpbGVNb2RhbERhdGEsXG4gICAgSG9va1BhcmFtZXRlcnMsXG4gICAgT3Blbk1vZGUsXG4gICAgUGFyYW1ldGVycyxcbiAgICBTZWFyY2hNb2RhbERhdGEsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge1xuICAgIGdldEVuZEFuZEJlZ2lubmluZ09mSGVhZGluZyxcbiAgICBnZXRGaWxlVXJpLFxuICAgIGdldFZpZXdTdGF0ZUZyb21Nb2RlLFxufSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZHZhbmNlZFVSSSBleHRlbmRzIFBsdWdpbiB7XG4gICAgc2V0dGluZ3M6IEFkdmFuY2VkVVJJU2V0dGluZ3M7XG4gICAgbGFzdFBhcmFtZXRlcnM/OiBPYmplY3Q7XG4gICAgaGFuZGxlcnMgPSBuZXcgSGFuZGxlcnModGhpcyk7XG4gICAgdG9vbHMgPSBuZXcgVG9vbHModGhpcyk7XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiY29weS11cmktY3VycmVudC1maWxlXCIsXG4gICAgICAgICAgICBuYW1lOiBcImNvcHkgVVJJIGZvciBmaWxlIHdpdGggb3B0aW9uc1wiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuaGFuZGxlcnMuaGFuZGxlQ29weUZpbGVVUkkoZmFsc2UpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiY29weS11cmktY3VycmVudC1maWxlLXNpbXBsZVwiLFxuICAgICAgICAgICAgbmFtZTogXCJjb3B5IFVSSSBmb3IgY3VycmVudCBmaWxlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5oYW5kbGVycy5oYW5kbGVDb3B5RmlsZVVSSSh0cnVlKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImNvcHktdXJpLWRhaWx5XCIsXG4gICAgICAgICAgICBuYW1lOiBcImNvcHkgVVJJIGZvciBkYWlseSBub3RlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gbmV3IEVudGVyRGF0YU1vZGFsKHRoaXMpLm9wZW4oKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImNvcHktdXJpLXNlYXJjaC1hbmQtcmVwbGFjZVwiLFxuICAgICAgICAgICAgbmFtZTogXCJjb3B5IFVSSSBmb3Igc2VhcmNoIGFuZCByZXBsYWNlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVNb2RhbCA9IG5ldyBGaWxlTW9kYWwoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlZCBmaWxlIGZvciBzZWFyY2ggYW5kIHJlcGxhY2VcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZmlsZU1vZGFsLm9wZW4oKTtcbiAgICAgICAgICAgICAgICBmaWxlTW9kYWwub25DaG9vc2VJdGVtID0gKGZpbGVQYXRoOiBGaWxlTW9kYWxEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaE1vZGFsID0gbmV3IFNlYXJjaE1vZGFsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hNb2RhbC5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaE1vZGFsLm9uQ2hvb3NlU3VnZ2VzdGlvbiA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW06IFNlYXJjaE1vZGFsRGF0YVxuICAgICAgICAgICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZXBsYWNlTW9kYWwodGhpcywgaXRlbSwgZmlsZVBhdGg/LnNvdXJjZSkub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiY29weS11cmktY29tbWFuZFwiLFxuICAgICAgICAgICAgbmFtZTogXCJjb3B5IFVSSSBmb3IgY29tbWFuZFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTW9kYWwgPSBuZXcgRmlsZU1vZGFsKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBcIlNlbGVjdCBhIGZpbGUgdG8gYmUgb3BlbmVkIGJlZm9yZSBleGVjdXRpbmcgdGhlIGNvbW1hbmRcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZmlsZU1vZGFsLm9wZW4oKTtcbiAgICAgICAgICAgICAgICBmaWxlTW9kYWwub25DaG9vc2VJdGVtID0gKGl0ZW06IEZpbGVNb2RhbERhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbW1hbmRNb2RhbCh0aGlzLCBpdGVtPy5zb3VyY2UpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImNvcHktdXJpLWJsb2NrXCIsXG4gICAgICAgICAgICBuYW1lOiBcImNvcHkgVVJJIGZvciBjdXJyZW50IGJsb2NrXCIsXG4gICAgICAgICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tpbmcpIHJldHVybiB2aWV3ICE9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IEJsb2NrVXRpbHMuZ2V0QmxvY2tJZCgpO1xuICAgICAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvb2xzLmNvcHlVUkkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXBhdGg6IHZpZXcuZmlsZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IGlkLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyT2JzaWRpYW5Qcm90b2NvbEhhbmRsZXIoXCJhZHZhbmNlZC11cmlcIiwgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBlIGFzIHVua25vd24gYXMgUGFyYW1ldGVycztcblxuICAgICAgICAgICAgLyoqIEFsbG93cyB3cml0aW5nIHRvIG5ldyBjcmVhdGVkIGRhaWx5IG5vdGUgd2l0aG91dCBhbnkgYFBhcmFtZXRlcnMubW9kZWAgKi9cbiAgICAgICAgICAgIGxldCBjcmVhdGVkRGFpbHlOb3RlID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhcmFtZXRlciBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgKHBhcmFtZXRlcnMgYXMgYW55KVtwYXJhbWV0ZXJdID0gZGVjb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICAgICAgICAgICAgICAocGFyYW1ldGVycyBhcyBhbnkpW3BhcmFtZXRlcl1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0UGFyYW1ldGVycyA9IHsgLi4ucGFyYW1ldGVycyB9O1xuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMudWlkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gdGhpcy5nZXRGaWxlRnJvbVVJRChwYXJhbWV0ZXJzLnVpZCk/LnBhdGg7XG4gICAgICAgICAgICAgICAgaWYgKHJlcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5maWxlcGF0aCA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy51aWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmZpbGVuYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IHRoaXMuYXBwLnZhdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0TWFya2Rvd25GaWxlcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgoZmlsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZyb250TWF0dGVyQWxpYXNlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mcm9udG1hdHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk/LmluY2x1ZGVzKHBhcmFtZXRlcnMuZmlsZW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRGb2xkZXIgPSB0aGlzLmFwcC5maWxlTWFuYWdlci5nZXROZXdGaWxlUGFyZW50KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3LmZpbGU/LnBhdGhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEZvbGRlclBhdGggPSBwYXJlbnRGb2xkZXIuaXNSb290KClcbiAgICAgICAgICAgICAgICAgICAgPyBcIlwiXG4gICAgICAgICAgICAgICAgICAgIDogcGFyZW50Rm9sZGVyLnBhdGggKyBcIi9cIjtcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLmZpbGVwYXRoID1cbiAgICAgICAgICAgICAgICAgICAgZmlsZT8ucGF0aCA/P1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRGb2xkZXJQYXRoICsgbm9ybWFsaXplUGF0aChwYXJhbWV0ZXJzLmZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLmZpbGVwYXRoKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5maWxlcGF0aCA9IG5vcm1hbGl6ZVBhdGgocGFyYW1ldGVycy5maWxlcGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJhbWV0ZXJzLmZpbGVwYXRoLmxhc3RJbmRleE9mKFwiLlwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSBwYXJhbWV0ZXJzLmZpbGVwYXRoLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPCAwID8gcGFyYW1ldGVycy5maWxlcGF0aC5sZW5ndGggOiBpbmRleFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9uID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZmlsZXBhdGggPSBwYXJhbWV0ZXJzLmZpbGVwYXRoICsgXCIubWRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuZGFpbHkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhcHBIYXNEYWlseU5vdGVzUGx1Z2luTG9hZGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIkRhaWx5IG5vdGVzIHBsdWdpbiBpcyBub3QgbG9hZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG1vbWVudCA9IHdpbmRvdy5tb21lbnQoRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsRGFpbHlOb3RlcyA9IGdldEFsbERhaWx5Tm90ZXMoKTtcbiAgICAgICAgICAgICAgICBsZXQgZGFpbHlOb3RlID0gZ2V0RGFpbHlOb3RlKG1vbWVudCwgYWxsRGFpbHlOb3Rlcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFkYWlseU5vdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8vIFByZXZlbnQgZGFpbHkgbm90ZSBmcm9tIGJlaW5nIGNyZWF0ZWQgb24gZXhpc3RpbmcgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMuZXhpc3RzID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5maWxlcGF0aCA9IGF3YWl0IGdldERhaWx5Tm90ZVBhdGgobW9tZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhaWx5Tm90ZSA9IGF3YWl0IGNyZWF0ZURhaWx5Tm90ZShtb21lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWxheSB0byBsZXQgT2JzaWRpYW4gaW5kZXggYW5kIGdlbmVyYXRlIENhY2hlZE1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCA1MDApKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZERhaWx5Tm90ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhaWx5Tm90ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuZmlsZXBhdGggPSBkYWlseU5vdGUucGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5jbGlwYm9hcmQgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5kYXRhID0gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVyc1tcImVuYWJsZS1wbHVnaW5cIl0gfHwgcGFyYW1ldGVyc1tcImRpc2FibGUtcGx1Z2luXCJdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVQbHVnaW5NYW5hZ2VtZW50KHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmZyb250bWF0dGVya2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVGcm9udG1hdHRlcktleShwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy53b3Jrc3BhY2UgfHxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLnNhdmV3b3Jrc3BhY2UgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMuaGFuZGxlV29ya3NwYWNlKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmNvbW1hbmRuYW1lIHx8IHBhcmFtZXRlcnMuY29tbWFuZGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVDb21tYW5kKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmV2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLmhhbmRsZUV2YWwocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuZmlsZXBhdGggJiYgcGFyYW1ldGVycy5leGlzdHMgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVEb2VzRmlsZUV4aXN0KHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLmhhbmRsZVdyaXRlKHBhcmFtZXRlcnMsIGNyZWF0ZWREYWlseU5vdGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0ZXJzLmZpbGVwYXRoICYmIHBhcmFtZXRlcnMuaGVhZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMuaGFuZGxlT3BlbihwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1ldGVycy5maWxlcGF0aCAmJiBwYXJhbWV0ZXJzLmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVPcGVuKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAocGFyYW1ldGVycy5zZWFyY2ggfHwgcGFyYW1ldGVycy5zZWFyY2hyZWdleCkgJiZcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLnJlcGxhY2UgIT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLmhhbmRsZVNlYXJjaEFuZFJlcGxhY2UocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuc2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVTZWFyY2gocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuZmlsZXBhdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLmhhbmRsZU9wZW4ocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuc2V0dGluZ2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVPcGVuU2V0dGluZ3MocGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMudXBkYXRlcGx1Z2lucykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMuaGFuZGxlVXBkYXRlUGx1Z2lucyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJPYnNpZGlhblByb3RvY29sSGFuZGxlcihcbiAgICAgICAgICAgIFwiaG9vay1nZXQtYWR2YW5jZWQtdXJpXCIsXG4gICAgICAgICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBlIGFzIHVua25vd24gYXMgSG9va1BhcmFtZXRlcnM7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbWV0ZXIgaW4gcGFyYW1ldGVycykge1xuICAgICAgICAgICAgICAgICAgICAocGFyYW1ldGVycyBhcyBhbnkpW3BhcmFtZXRlcl0gPSBkZWNvZGVVUklDb21wb25lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAocGFyYW1ldGVycyBhcyBhbnkpW3BhcmFtZXRlcl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhY3RpdmVMZWFmLnZpZXcuZmlsZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlTGVhZiAmJiBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9va1N1Y2Nlc3MocGFyYW1ldGVycywgZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsdXJlKHBhcmFtZXRlcnMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJObyBmaWxlIG9wZW5lZFwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51LCBmaWxlLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzb3VyY2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlID09PSBcIm1vcmUtb3B0aW9uc1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPT09IFwidGFiLWhlYWRlclwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPT0gXCJmaWxlLWV4cGxvcmVyLWNvbnRleHQtbWVudVwiXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKGBDb3B5IEFkdmFuY2VkIFVSSWApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcImxpbmtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRTZWN0aW9uKFwiaW5mb1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKF8pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5oYW5kbGVDb3B5RmlsZVVSSSh0cnVlLCBmaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgaG9va1N1Y2Nlc3MocGFyYW1ldGVyczogUGFyYW1ldGVycywgZmlsZTogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCFwYXJhbWV0ZXJzW1wieC1zdWNjZXNzXCJdKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBzdHJpcE1EKGZpbGUubmFtZSksXG4gICAgICAgICAgICBhZHZhbmNlZHVyaTogYXdhaXQgdGhpcy50b29scy5nZW5lcmF0ZVVSSShcbiAgICAgICAgICAgICAgICB7IGZpbGVwYXRoOiBmaWxlLnBhdGggfSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHVybGtleTogXCJhZHZhbmNlZHVyaVwiLFxuICAgICAgICAgICAgZmlsZXVyaTogZ2V0RmlsZVVyaShmaWxlKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdWNjZXNzKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN1Y2Nlc3MocGFyYW1ldGVyczogUGFyYW1ldGVycywgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnNbXCJ4LXN1Y2Nlc3NcIl0pIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGFyYW1ldGVyc1tcIngtc3VjY2Vzc1wiXSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhcmFtIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChwYXJhbSwgb3B0aW9uc1twYXJhbV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFpbHVyZShwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgICAgICBpZiAocGFyYW1ldGVyc1tcIngtZXJyb3JcIl0pIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGFyYW1ldGVyc1tcIngtZXJyb3JcIl0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQocGFyYW0sIG9wdGlvbnNbcGFyYW1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEZpbGVGcm9tVUlEKHVpZDogc3RyaW5nKTogVEZpbGUgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKCk7XG4gICAgICAgIGNvbnN0IGlkS2V5ID0gdGhpcy5zZXR0aW5ncy5pZEZpZWxkO1xuICAgICAgICByZXR1cm4gZmlsZXMuZmluZChcbiAgICAgICAgICAgIChmaWxlKSA9PlxuICAgICAgICAgICAgICAgIHBhcnNlRnJvbnRNYXR0ZXJFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk/LmZyb250bWF0dGVyLFxuICAgICAgICAgICAgICAgICAgICBpZEtleVxuICAgICAgICAgICAgICAgICkgPT0gdWlkXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgYXBwZW5kKGZpbGU6IFRGaWxlIHwgc3RyaW5nLCBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKTogUHJvbWlzZTxURmlsZT4ge1xuICAgICAgICBsZXQgcGF0aDogc3RyaW5nO1xuICAgICAgICBsZXQgZGF0YVRvV3JpdGU6IHN0cmluZztcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMuaGVhZGluZykge1xuICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGdldEVuZEFuZEJlZ2lubmluZ09mSGVhZGluZyhcbiAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5oZWFkaW5nXG4gICAgICAgICAgICAgICAgKT8ubGFzdExpbmU7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBkYXRhLnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgICAgICAgICAgbGluZXMuc3BsaWNlKGxpbmUsIDAsIC4uLnBhcmFtZXRlcnMuZGF0YS5zcGxpdChcIlxcblwiKSk7XG4gICAgICAgICAgICAgICAgZGF0YVRvV3JpdGUgPSBsaW5lcy5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZpbGVEYXRhOiBzdHJpbmc7XG4gICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgZmlsZURhdGEgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuICAgICAgICAgICAgICAgIHBhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhdGggPSBmaWxlO1xuICAgICAgICAgICAgICAgIGZpbGVEYXRhID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGFUb1dyaXRlID0gZmlsZURhdGEgKyBcIlxcblwiICsgcGFyYW1ldGVycy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLndyaXRlQW5kT3BlbkZpbGUocGF0aCwgZGF0YVRvV3JpdGUsIHBhcmFtZXRlcnMpO1xuICAgIH1cblxuICAgIGFzeW5jIHByZXBlbmQoXG4gICAgICAgIGZpbGU6IFRGaWxlIHwgc3RyaW5nLFxuICAgICAgICBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzXG4gICAgKTogUHJvbWlzZTxURmlsZT4ge1xuICAgICAgICBsZXQgcGF0aDogc3RyaW5nO1xuICAgICAgICBsZXQgZGF0YVRvV3JpdGU6IHN0cmluZztcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMuaGVhZGluZykge1xuICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGdldEVuZEFuZEJlZ2lubmluZ09mSGVhZGluZyhcbiAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5oZWFkaW5nXG4gICAgICAgICAgICAgICAgKT8uZmlyc3RMaW5lO1xuICAgICAgICAgICAgICAgIGlmIChsaW5lID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gZGF0YS5zcGxpdChcIlxcblwiKTtcblxuICAgICAgICAgICAgICAgIGxpbmVzLnNwbGljZShsaW5lLCAwLCAuLi5wYXJhbWV0ZXJzLmRhdGEuc3BsaXQoXCJcXG5cIikpO1xuICAgICAgICAgICAgICAgIGRhdGFUb1dyaXRlID0gbGluZXMuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5mcm9udG1hdHRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0gY2FjaGUuZnJvbnRtYXR0ZXIucG9zaXRpb24uZW5kLmxpbmU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gZmlsZURhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIGxpbmUgKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBmaWxlRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UobGluZSArIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVRvV3JpdGUgPSBmaXJzdCArIFwiXFxuXCIgKyBwYXJhbWV0ZXJzLmRhdGEgKyBcIlxcblwiICsgbGFzdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhVG9Xcml0ZSA9IHBhcmFtZXRlcnMuZGF0YSArIFwiXFxuXCIgKyBmaWxlRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGF0aCA9IGZpbGUucGF0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aCA9IGZpbGU7XG4gICAgICAgICAgICAgICAgZGF0YVRvV3JpdGUgPSBwYXJhbWV0ZXJzLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy53cml0ZUFuZE9wZW5GaWxlKHBhdGgsIGRhdGFUb1dyaXRlLCBwYXJhbWV0ZXJzKTtcbiAgICB9XG5cbiAgICBhc3luYyB3cml0ZUFuZE9wZW5GaWxlKFxuICAgICAgICBvdXRwdXRGaWxlTmFtZTogc3RyaW5nLFxuICAgICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICAgIHBhcmFtZXRlcnM6IFBhcmFtZXRlcnNcbiAgICApOiBQcm9taXNlPFRGaWxlPiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob3V0cHV0RmlsZU5hbWUpO1xuXG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCB0ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gb3V0cHV0RmlsZU5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgY29uc3QgZGlyID0gcGFydHMuc2xpY2UoMCwgcGFydHMubGVuZ3RoIC0gMSkuam9pbihcIi9cIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcGFydHMubGVuZ3RoID4gMSAmJlxuICAgICAgICAgICAgICAgICEodGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGRpcikgaW5zdGFuY2VvZiBURm9sZGVyKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiYXNlNjRyZWdleCA9XG4gICAgICAgICAgICAgICAgL14oWzAtOWEtekEtWisvXXs0fSkqKChbMC05YS16QS1aKy9dezJ9PT0pfChbMC05YS16QS1aKy9dezN9PSkpPyQvO1xuICAgICAgICAgICAgaWYgKGJhc2U2NHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVCaW5hcnkoXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBiYXNlNjRUb0FycmF5QnVmZmVyKHRleHQpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKG91dHB1dEZpbGVOYW1lLCB0ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZW5FeGlzdGluZ0ZpbGVBbmRTZXRDdXJzb3Iob3V0cHV0RmlsZU5hbWUsIHBhcmFtZXRlcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob3V0cHV0RmlsZU5hbWUpIGFzIFRGaWxlO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5FeGlzdGluZ0ZpbGVBbmRTZXRDdXJzb3IoZmlsZTogc3RyaW5nLCBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmIChwYXJhbWV0ZXJzLm9wZW5tb2RlID09IFwic2lsZW50XCIpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Mub3BlbkZpbGVPbldyaXRlKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9wZW4oe1xuICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgc2V0dGluZzogdGhpcy5zZXR0aW5ncy5vcGVuRmlsZU9uV3JpdGVJbk5ld1BhbmUsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMubGluZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvckluTGluZShwYXJhbWV0ZXJzLmxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgb3Blbih7XG4gICAgICAgIGZpbGUsXG4gICAgICAgIHNldHRpbmcsXG4gICAgICAgIHBhcmFtZXRlcnMsXG4gICAgICAgIHN1cHBvcnRQb3BvdmVyLFxuICAgICAgICBtb2RlLFxuICAgIH06IHtcbiAgICAgICAgZmlsZTogc3RyaW5nIHwgVEZpbGU7XG4gICAgICAgIHNldHRpbmc/OiBib29sZWFuO1xuICAgICAgICBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJzO1xuICAgICAgICBzdXBwb3J0UG9wb3Zlcj86IGJvb2xlYW47XG4gICAgICAgIG1vZGU/OiBcInNvdXJjZVwiO1xuICAgIH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMub3Blbm1vZGUgPT0gXCJwb3BvdmVyXCIgJiYgKHN1cHBvcnRQb3BvdmVyID8/IHRydWUpKSB7XG4gICAgICAgICAgICBjb25zdCBob3ZlckVkaXRvciA9XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAucGx1Z2lucy5wbHVnaW5zW1wib2JzaWRpYW4taG92ZXItZWRpdG9yXCJdO1xuICAgICAgICAgICAgaWYgKCFob3ZlckVkaXRvcikge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgICAgICAgIFwiQ2Fubm90IGZpbmQgSG92ZXIgRWRpdG9yIHBsdWdpbi4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuZmFpbHVyZShwYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbGVhZiA9IGhvdmVyRWRpdG9yLnNwYXduUG9wb3Zlcih1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCB7IGZvY3VzOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCB0ZmlsZSA9XG4gICAgICAgICAgICAgICAgZmlsZSBpbnN0YW5jZW9mIFRGaWxlXG4gICAgICAgICAgICAgICAgICAgID8gZmlsZVxuICAgICAgICAgICAgICAgICAgICA6ICh0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZSkgYXMgVEZpbGUpO1xuICAgICAgICAgICAgbGVhZi5vcGVuRmlsZSh0ZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3Blbk1vZGU6IE9wZW5Nb2RlIHwgYm9vbGVhbiA9IHNldHRpbmc7XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5uZXdwYW5lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcGVuTW9kZSA9IHBhcmFtZXRlcnMubmV3cGFuZSA9PSBcInRydWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLm9wZW5tb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMub3Blbm1vZGUgPT0gXCJ0cnVlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycy5vcGVubW9kZSA9PSBcImZhbHNlXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgb3Blbk1vZGUgPSBwYXJhbWV0ZXJzLm9wZW5tb2RlID09IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1ldGVycy5vcGVubW9kZSA9PSBcInBvcG92ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBvcGVuTW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5Nb2RlID0gcGFyYW1ldGVycy5vcGVubW9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3Blbk1vZGUgPT0gXCJzaWxlbnRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZpbGVJc0FscmVhZHlPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChpc0Jvb2xlYW4ob3Blbk1vZGUpKSB7XG4gICAgICAgICAgICAgICAgYXBwLndvcmtzcGFjZS5pdGVyYXRlQWxsTGVhdmVzKChsZWFmKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWFmLnZpZXcuZmlsZT8ucGF0aCA9PT0gcGFyYW1ldGVycy5maWxlcGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVJc0FscmVhZHlPcGVuZWQgJiYgbGVhZi53aWR0aCA9PSAwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlSXNBbHJlYWR5T3BlbmVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHsgZm9jdXM6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KFxuICAgICAgICAgICAgICAgIGZpbGUgaW5zdGFuY2VvZiBURmlsZSA/IGZpbGUucGF0aCA6IGZpbGUsXG4gICAgICAgICAgICAgICAgXCIvXCIsXG4gICAgICAgICAgICAgICAgZmlsZUlzQWxyZWFkeU9wZW5lZCA/IGZhbHNlIDogb3Blbk1vZGUsXG4gICAgICAgICAgICAgICAgbW9kZSAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyB7IHN0YXRlOiB7IG1vZGU6IG1vZGUgfSB9XG4gICAgICAgICAgICAgICAgICAgIDogZ2V0Vmlld1N0YXRlRnJvbU1vZGUocGFyYW1ldGVycylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBzZXRDdXJzb3IobW9kZTogUGFyYW1ldGVyc1tcIm1vZGVcIl0pIHtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcblxuICAgICAgICAgICAgbGV0IHZpZXdTdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgICAgICAgIHZpZXdTdGF0ZS5zdGF0ZS5tb2RlID0gXCJzb3VyY2VcIjtcblxuICAgICAgICAgICAgaWYgKG1vZGUgPT09IFwiYXBwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0TGluZSA9IGVkaXRvci5sYXN0TGluZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RMaW5lTGVuZ3RoID0gZWRpdG9yLmdldExpbmUobGFzdExpbmUpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBhd2FpdCB2aWV3LmxlYWYuc2V0Vmlld1N0YXRlKHZpZXdTdGF0ZSwgeyBmb2N1czogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IoeyBjaDogbGFzdExpbmVMZW5ndGgsIGxpbmU6IGxhc3RMaW5lIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSBcInByZXBlbmRcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUodmlld1N0YXRlLCB7IGZvY3VzOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvcih7IGNoOiAwLCBsaW5lOiAwIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29ySW5MaW5lKHJhd0xpbmU6IG51bWJlcikge1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCF2aWV3KSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXdTdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgICAgaWYgKHZpZXdTdGF0ZS5zdGF0ZS5tb2RlICE9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICB2aWV3U3RhdGUuc3RhdGUubW9kZSA9IFwic291cmNlXCI7XG4gICAgICAgICAgICB2aWV3LmxlYWYuc2V0Vmlld1N0YXRlKHZpZXdTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaW5lID0gTWF0aC5taW4ocmF3TGluZSAtIDEsIHZpZXcuZWRpdG9yLmxpbmVDb3VudCgpIC0gMSk7XG4gICAgICAgIHZpZXcuZWRpdG9yLmZvY3VzKCk7XG4gICAgICAgIHZpZXcuZWRpdG9yLnNldEN1cnNvcih7XG4gICAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgICAgY2g6IHZpZXcuZWRpdG9yLmdldExpbmUobGluZSkubGVuZ3RoLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ0aGlzIiwib2JzaWRpYW4iLCJNYXJrZG93blZpZXciLCJub3JtYWxpemVQYXRoIiwiZ2V0RGFpbHlOb3RlU2V0dGluZ3MiLCJTdWdnZXN0TW9kYWwiLCJGdXp6eVN1Z2dlc3RNb2RhbCIsIk5vdGljZSIsIlRGaWxlIiwiRmlsZVZpZXciLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiIsInBhcnNlRnJvbnRNYXR0ZXJFbnRyeSIsInV1aWR2NCIsInBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzIiwiYXBwSGFzRGFpbHlOb3Rlc1BsdWdpbkxvYWRlZCIsImdldEFsbERhaWx5Tm90ZXMiLCJnZXREYWlseU5vdGUiLCJjcmVhdGVEYWlseU5vdGUiLCJURm9sZGVyIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFD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Q0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtBQUN0RCxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FB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Q0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFD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LENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUM7QUFDemdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsSUFBSSxNQUFNLFNBQVMsQ0FBQyw2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
