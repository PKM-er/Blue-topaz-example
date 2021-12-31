'use strict';

var obsidian_module = require('obsidian');
var child_process = require('child_process');
var util = require('util');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var obsidian_module__namespace = /*#__PURE__*/_interopNamespace(obsidian_module);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

/*! *****************************************************************************
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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function log_error(e) {
    const notice = new obsidian_module.Notice("", 8000);
    if (e instanceof TemplaterError && e.console_msg) {
        // TODO: Find a better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}<br/>Check console for more informations`;
        console.error(`Templater Error:`, e.message, "\n", e.console_msg);
    }
    else {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}`;
    }
}

class TemplaterError extends Error {
    constructor(msg, console_msg) {
        super(msg);
        this.console_msg = console_msg;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
function errorWrapper(fn, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (e) {
            if (!(e instanceof TemplaterError)) {
                log_error(new TemplaterError(msg, e.message));
            }
            else {
                log_error(e);
            }
            return null;
        }
    });
}
function errorWrapperSync(fn, msg) {
    try {
        return fn();
    }
    catch (e) {
        log_error(new TemplaterError(msg, e.message));
        return null;
    }
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

// import { isHTMLElement } from './instanceOf';
function getBoundingClientRect(element, // eslint-disable-next-line unused-imports/no-unused-vars
includeScale) {

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1; // FIXME:
  // `offsetWidth` returns an integer while `getBoundingClientRect`
  // returns a float. This results in `scaleX` or `scaleY` being
  // non-1 when it should be for elements that aren't a full pixel in
  // width or height.
  // if (isHTMLElement(element) && includeScale) {
  //   const offsetHeight = element.offsetHeight;
  //   const offsetWidth = element.offsetWidth;
  //   // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
  //   // Fallback to 1 in case both values are `0`
  //   if (offsetWidth > 0) {
  //     scaleX = rect.width / offsetWidth || 1;
  //   }
  //   if (offsetHeight > 0) {
  //     scaleY = rect.height / offsetHeight || 1;
  //   }
  // }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
const wrapAround = (value, size) => {
    return ((value % size) + size) % size;
};
class Suggest {
    constructor(owner, containerEl, scope) {
        this.owner = owner;
        this.containerEl = containerEl;
        containerEl.on("click", ".suggestion-item", this.onSuggestionClick.bind(this));
        containerEl.on("mousemove", ".suggestion-item", this.onSuggestionMouseover.bind(this));
        scope.register([], "ArrowUp", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem - 1, true);
                return false;
            }
        });
        scope.register([], "ArrowDown", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem + 1, true);
                return false;
            }
        });
        scope.register([], "Enter", (event) => {
            if (!event.isComposing) {
                this.useSelectedItem(event);
                return false;
            }
        });
    }
    onSuggestionClick(event, el) {
        event.preventDefault();
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
        this.useSelectedItem(event);
    }
    onSuggestionMouseover(_event, el) {
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
    }
    setSuggestions(values) {
        this.containerEl.empty();
        const suggestionEls = [];
        values.forEach((value) => {
            const suggestionEl = this.containerEl.createDiv("suggestion-item");
            this.owner.renderSuggestion(value, suggestionEl);
            suggestionEls.push(suggestionEl);
        });
        this.values = values;
        this.suggestions = suggestionEls;
        this.setSelectedItem(0, false);
    }
    useSelectedItem(event) {
        const currentValue = this.values[this.selectedItem];
        if (currentValue) {
            this.owner.selectSuggestion(currentValue, event);
        }
    }
    setSelectedItem(selectedIndex, scrollIntoView) {
        const normalizedIndex = wrapAround(selectedIndex, this.suggestions.length);
        const prevSelectedSuggestion = this.suggestions[this.selectedItem];
        const selectedSuggestion = this.suggestions[normalizedIndex];
        prevSelectedSuggestion === null || prevSelectedSuggestion === void 0 ? void 0 : prevSelectedSuggestion.removeClass("is-selected");
        selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.addClass("is-selected");
        this.selectedItem = normalizedIndex;
        if (scrollIntoView) {
            selectedSuggestion.scrollIntoView(false);
        }
    }
}
class TextInputSuggest {
    constructor(app, inputEl) {
        this.app = app;
        this.inputEl = inputEl;
        this.scope = new obsidian_module.Scope();
        this.suggestEl = createDiv("suggestion-container");
        const suggestion = this.suggestEl.createDiv("suggestion");
        this.suggest = new Suggest(this, suggestion, this.scope);
        this.scope.register([], "Escape", this.close.bind(this));
        this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("blur", this.close.bind(this));
        this.suggestEl.on("mousedown", ".suggestion-container", (event) => {
            event.preventDefault();
        });
    }
    onInputChanged() {
        const inputStr = this.inputEl.value;
        const suggestions = this.getSuggestions(inputStr);
        if (!suggestions) {
            this.close();
            return;
        }
        if (suggestions.length > 0) {
            this.suggest.setSuggestions(suggestions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.open(this.app.dom.appContainerEl, this.inputEl);
        }
        else {
            this.close();
        }
    }
    open(container, inputEl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.pushScope(this.scope);
        container.appendChild(this.suggestEl);
        this.popper = createPopper(inputEl, this.suggestEl, {
            placement: "bottom-start",
            modifiers: [
                {
                    name: "sameWidth",
                    enabled: true,
                    fn: ({ state, instance }) => {
                        // Note: positioning needs to be calculated twice -
                        // first pass - positioning it according to the width of the popper
                        // second pass - position it with the width bound to the reference element
                        // we need to early exit to avoid an infinite loop
                        const targetWidth = `${state.rects.reference.width}px`;
                        if (state.styles.popper.width === targetWidth) {
                            return;
                        }
                        state.styles.popper.width = targetWidth;
                        instance.update();
                    },
                    phase: "beforeWrite",
                    requires: ["computeStyles"],
                },
            ],
        });
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.popScope(this.scope);
        this.suggest.setSuggestions([]);
        if (this.popper)
            this.popper.destroy();
        this.suggestEl.detach();
    }
}

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
class FolderSuggest extends TextInputSuggest {
    getSuggestions(inputStr) {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders = [];
        const lowerCaseInputStr = inputStr.toLowerCase();
        abstractFiles.forEach((folder) => {
            if (folder instanceof obsidian_module.TFolder &&
                folder.path.toLowerCase().contains(lowerCaseInputStr)) {
                folders.push(folder);
            }
        });
        return folders;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function escape_RegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function resolve_tfolder(app, folder_str) {
    folder_str = obsidian_module.normalizePath(folder_str);
    const folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new TemplaterError(`Folder "${folder_str}" doesn't exist`);
    }
    if (!(folder instanceof obsidian_module.TFolder)) {
        throw new TemplaterError(`${folder_str} is a file, not a folder`);
    }
    return folder;
}
function resolve_tfile(app, file_str) {
    file_str = obsidian_module.normalizePath(file_str);
    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new TemplaterError(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof obsidian_module.TFile)) {
        throw new TemplaterError(`${file_str} is a folder, not a file`);
    }
    return file;
}
function get_tfiles_from_folder(app, folder_str) {
    const folder = resolve_tfolder(app, folder_str);
    const files = [];
    obsidian_module.Vault.recurseChildren(folder, (file) => {
        if (file instanceof obsidian_module.TFile) {
            files.push(file);
        }
    });
    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });
    return files;
}
function arraymove(arr, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex === arr.length) {
        return;
    }
    const element = arr[fromIndex];
    arr[fromIndex] = arr[toIndex];
    arr[toIndex] = element;
}

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
var FileSuggestMode;
(function (FileSuggestMode) {
    FileSuggestMode[FileSuggestMode["TemplateFiles"] = 0] = "TemplateFiles";
    FileSuggestMode[FileSuggestMode["ScriptFiles"] = 1] = "ScriptFiles";
})(FileSuggestMode || (FileSuggestMode = {}));
class FileSuggest extends TextInputSuggest {
    constructor(app, inputEl, plugin, mode) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.plugin = plugin;
        this.mode = mode;
    }
    get_folder(mode) {
        switch (mode) {
            case FileSuggestMode.TemplateFiles:
                return this.plugin.settings.templates_folder;
            case FileSuggestMode.ScriptFiles:
                return this.plugin.settings.user_scripts_folder;
        }
    }
    get_error_msg(mode) {
        switch (mode) {
            case FileSuggestMode.TemplateFiles:
                return `Templates folder doesn't exist`;
            case FileSuggestMode.ScriptFiles:
                return `User Scripts folder doesn't exist`;
        }
    }
    getSuggestions(input_str) {
        const all_files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.get_folder(this.mode)), this.get_error_msg(this.mode));
        if (!all_files) {
            return [];
        }
        const files = [];
        const lower_input_str = input_str.toLowerCase();
        all_files.forEach((file) => {
            if (file instanceof obsidian_module.TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str)) {
                files.push(file);
            }
        });
        return files;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}

const DEFAULT_SETTINGS = {
    command_timeout: 5,
    templates_folder: "",
    templates_pairs: [["", ""]],
    trigger_on_file_creation: false,
    auto_jump_to_cursor: false,
    enable_system_commands: false,
    shell_path: "",
    user_scripts_folder: "",
    enable_folder_templates: true,
    folder_templates: [{ folder: "", template: "" }],
    syntax_highlighting: true,
    enabled_templates_hotkeys: [""],
    startup_templates: [""],
};
class TemplaterSettingTab extends obsidian_module.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        this.containerEl.empty();
        this.add_general_setting_header();
        this.add_template_folder_setting();
        this.add_internal_functions_setting();
        this.add_syntax_highlighting_setting();
        this.add_auto_jump_to_cursor();
        this.add_trigger_on_new_file_creation_setting();
        this.add_templates_hotkeys_setting();
        if (this.plugin.settings.trigger_on_file_creation) {
            this.add_folder_templates_setting();
        }
        this.add_startup_templates_setting();
        this.add_user_script_functions_setting();
        this.add_user_system_command_functions_setting();
    }
    add_general_setting_header() {
        this.containerEl.createEl("h2", { text: "General Settings" });
    }
    add_template_folder_setting() {
        new obsidian_module.Setting(this.containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addSearch((cb) => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.templates_folder)
                .onChange((new_folder) => {
                this.plugin.settings.templates_folder = new_folder;
                this.plugin.save_settings();
            });
            // @ts-ignore
            cb.containerEl.addClass("templater_search");
        });
    }
    add_internal_functions_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Templater provides multiples predefined variables / functions that you can use.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation",
        }), " to get a list of all the available internal variables / functions.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(desc);
    }
    add_syntax_highlighting_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Adds syntax highlighting for Templater commands in edit mode.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Syntax Highlighting")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.syntax_highlighting)
                .onChange((syntax_highlighting) => {
                this.plugin.settings.syntax_highlighting =
                    syntax_highlighting;
                this.plugin.save_settings();
                this.plugin.event_handler.update_syntax_highlighting();
            });
        });
    }
    add_auto_jump_to_cursor() {
        const desc = document.createDocumentFragment();
        desc.append("Automatically triggers ", desc.createEl("code", { text: "tp.file.cursor" }), " after inserting a template.", desc.createEl("br"), "You can also set a hotkey to manually trigger ", desc.createEl("code", { text: "tp.file.cursor" }), ".");
        new obsidian_module.Setting(this.containerEl)
            .setName("Automatic jump to cursor")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.auto_jump_to_cursor)
                .onChange((auto_jump_to_cursor) => {
                this.plugin.settings.auto_jump_to_cursor =
                    auto_jump_to_cursor;
                this.plugin.save_settings();
            });
        });
    }
    add_trigger_on_new_file_creation_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Templater will listen for the new file creation event, and replace every command it finds in the new file's content.", desc.createEl("br"), "This makes Templater compatible with other plugins like the Daily note core plugin, Calendar plugin, Review plugin, Note refactor plugin, ...", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: ",
        }), "This can be dangerous if you create new files with unknown / unsafe content on creation. Make sure that every new file's content is safe on creation.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Trigger Templater on new file creation")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.trigger_on_file_creation)
                .onChange((trigger_on_file_creation) => {
                this.plugin.settings.trigger_on_file_creation =
                    trigger_on_file_creation;
                this.plugin.save_settings();
                this.plugin.event_handler.update_trigger_file_on_creation();
                // Force refresh
                this.display();
            });
        });
    }
    add_templates_hotkeys_setting() {
        this.containerEl.createEl("h2", { text: "Template Hotkeys" });
        const desc = document.createDocumentFragment();
        desc.append("Template Hotkeys allows you to bind a template to a hotkey.");
        new obsidian_module.Setting(this.containerEl).setDesc(desc);
        this.plugin.settings.enabled_templates_hotkeys.forEach((template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template &&
                        this.plugin.settings.enabled_templates_hotkeys.contains(new_template)) {
                        log_error(new TemplaterError("This template is already bound to a hotkey"));
                        return;
                    }
                    this.plugin.command_handler.add_template_hotkey(this.plugin.settings
                        .enabled_templates_hotkeys[index], new_template);
                    this.plugin.settings.enabled_templates_hotkeys[index] = new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
                cb.setIcon("any-key")
                    .setTooltip("Configure Hotkey")
                    .onClick(() => {
                    // TODO: Replace with future "official" way to do this
                    // @ts-ignore
                    this.app.setting.openTabById("hotkeys");
                    // @ts-ignore
                    const tab = this.app.setting.activeTab;
                    tab.searchInputEl.value = "Templater: Insert";
                    tab.updateHotkeyVisibility();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("up-chevron-glyph")
                    .setTooltip("Move up")
                    .onClick(() => {
                    arraymove(this.plugin.settings
                        .enabled_templates_hotkeys, index, index - 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("down-chevron-glyph")
                    .setTooltip("Move down")
                    .onClick(() => {
                    arraymove(this.plugin.settings
                        .enabled_templates_hotkeys, index, index + 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.command_handler.remove_template_hotkey(this.plugin.settings
                        .enabled_templates_hotkeys[index]);
                    this.plugin.settings.enabled_templates_hotkeys.splice(index, 1);
                    this.plugin.save_settings();
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian_module.Setting(this.containerEl).addButton((cb) => {
            cb.setButtonText("Add new hotkey for template")
                .setCta()
                .onClick(() => {
                this.plugin.settings.enabled_templates_hotkeys.push("");
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
    }
    add_folder_templates_setting() {
        this.containerEl.createEl("h2", { text: "Folder Templates" });
        const descHeading = document.createDocumentFragment();
        descHeading.append("Folder Templates are triggered when a new ", descHeading.createEl("strong", { text: "empty " }), "file is created in a given folder.", descHeading.createEl("br"), "Templater will fill the empty file with the specified template.", descHeading.createEl("br"), "The deepest match is used. A global default template would be defined on the root ", descHeading.createEl("code", { text: "/" }), ".");
        new obsidian_module.Setting(this.containerEl).setDesc(descHeading);
        const descUseNewFileTemplate = document.createDocumentFragment();
        descUseNewFileTemplate.append("When enabled Templater will make use of the folder templates defined below.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Enable Folder Templates")
            .setDesc(descUseNewFileTemplate)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.enable_folder_templates)
                .onChange((use_new_file_templates) => {
                this.plugin.settings.enable_folder_templates =
                    use_new_file_templates;
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
        if (!this.plugin.settings.enable_folder_templates) {
            return;
        }
        new obsidian_module.Setting(this.containerEl)
            .setName("Add New")
            .setDesc("Add new folder template")
            .addButton((button) => {
            button
                .setTooltip("Add additional folder template")
                .setButtonText("+")
                .setCta()
                .onClick(() => {
                this.plugin.settings.folder_templates.push({
                    folder: "",
                    template: "",
                });
                this.plugin.save_settings();
                this.display();
            });
        });
        this.plugin.settings.folder_templates.forEach((folder_template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FolderSuggest(this.app, cb.inputEl);
                cb.setPlaceholder("Folder")
                    .setValue(folder_template.folder)
                    .onChange((new_folder) => {
                    if (new_folder &&
                        this.plugin.settings.folder_templates.some((e) => e.folder == new_folder)) {
                        log_error(new TemplaterError("This folder already has a template associated with it"));
                        return;
                    }
                    this.plugin.settings.folder_templates[index].folder = new_folder;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Template")
                    .setValue(folder_template.template)
                    .onChange((new_template) => {
                    this.plugin.settings.folder_templates[index].template = new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
                cb.setIcon("up-chevron-glyph")
                    .setTooltip("Move up")
                    .onClick(() => {
                    arraymove(this.plugin.settings.folder_templates, index, index - 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("down-chevron-glyph")
                    .setTooltip("Move down")
                    .onClick(() => {
                    arraymove(this.plugin.settings.folder_templates, index, index + 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.settings.folder_templates.splice(index, 1);
                    this.plugin.save_settings();
                    this.display();
                });
            });
            s.infoEl.remove();
        });
    }
    add_startup_templates_setting() {
        this.containerEl.createEl("h2", { text: "Startup Templates" });
        const desc = document.createDocumentFragment();
        desc.append("Startup Templates are templates that will get executed once when Templater starts.", desc.createEl("br"), "These templates won't output anything.", desc.createEl("br"), "This can be useful to set up templates adding hooks to obsidian events for example.");
        new obsidian_module.Setting(this.containerEl).setDesc(desc);
        this.plugin.settings.startup_templates.forEach((template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template &&
                        this.plugin.settings.startup_templates.contains(new_template)) {
                        log_error(new TemplaterError("This startup template already exist"));
                        return;
                    }
                    this.plugin.settings.startup_templates[index] =
                        new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.settings.startup_templates.splice(index, 1);
                    this.plugin.save_settings();
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian_module.Setting(this.containerEl).addButton((cb) => {
            cb.setButtonText("Add new startup template")
                .setCta()
                .onClick(() => {
                this.plugin.settings.startup_templates.push("");
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
    }
    add_user_script_functions_setting() {
        this.containerEl.createEl("h2", { text: "User Script Functions" });
        let desc = document.createDocumentFragment();
        desc.append("All JavaScript files in this folder will be loaded as CommonJS modules, to import custom user functions.", desc.createEl("br"), "The folder needs to be accessible from the vault.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation",
        }), " for more informations.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Script files folder location")
            .setDesc(desc)
            .addSearch((cb) => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.user_scripts_folder)
                .onChange((new_folder) => {
                this.plugin.settings.user_scripts_folder = new_folder;
                this.plugin.save_settings();
            });
            // @ts-ignore
            cb.containerEl.addClass("templater_search");
        });
        desc = document.createDocumentFragment();
        let name;
        if (!this.plugin.settings.user_scripts_folder) {
            name = "No User Scripts folder set";
        }
        else {
            const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `User Scripts folder doesn't exist`);
            if (!files || files.length === 0) {
                name = "No User Scripts detected";
            }
            else {
                let count = 0;
                for (const file of files) {
                    if (file.extension === "js") {
                        count++;
                        desc.append(desc.createEl("li", {
                            text: `tp.user.${file.basename}`,
                        }));
                    }
                }
                name = `Detected ${count} User Script(s)`;
            }
        }
        new obsidian_module.Setting(this.containerEl)
            .setName(name)
            .setDesc(desc)
            .addExtraButton((extra) => {
            extra
                .setIcon("sync")
                .setTooltip("Refresh")
                .onClick(() => {
                // Force refresh
                this.display();
            });
        });
    }
    add_user_system_command_functions_setting() {
        let desc = document.createDocumentFragment();
        desc.append("Allows you to create user functions linked to system commands.", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: ",
        }), "It can be dangerous to execute arbitrary system commands from untrusted sources. Only run system commands that you understand, from trusted sources.");
        this.containerEl.createEl("h2", {
            text: "User System Command Functions",
        });
        new obsidian_module.Setting(this.containerEl)
            .setName("Enable User System Command Functions")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.enable_system_commands)
                .onChange((enable_system_commands) => {
                this.plugin.settings.enable_system_commands =
                    enable_system_commands;
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
        if (this.plugin.settings.enable_system_commands) {
            new obsidian_module.Setting(this.containerEl)
                .setName("Timeout")
                .setDesc("Maximum timeout in seconds for a system command.")
                .addText((text) => {
                text.setPlaceholder("Timeout")
                    .setValue(this.plugin.settings.command_timeout.toString())
                    .onChange((new_value) => {
                    const new_timeout = Number(new_value);
                    if (isNaN(new_timeout)) {
                        log_error(new TemplaterError("Timeout must be a number"));
                        return;
                    }
                    this.plugin.settings.command_timeout = new_timeout;
                    this.plugin.save_settings();
                });
            });
            desc = document.createDocumentFragment();
            desc.append("Full path to the shell binary to execute the command with.", desc.createEl("br"), "This setting is optional and will default to the system's default shell if not specified.", desc.createEl("br"), "You can use forward slashes ('/') as path separators on all platforms if in doubt.");
            new obsidian_module.Setting(this.containerEl)
                .setName("Shell binary location")
                .setDesc(desc)
                .addText((text) => {
                text.setPlaceholder("Example: /bin/bash, ...")
                    .setValue(this.plugin.settings.shell_path)
                    .onChange((shell_path) => {
                    this.plugin.settings.shell_path = shell_path;
                    this.plugin.save_settings();
                });
            });
            let i = 1;
            this.plugin.settings.templates_pairs.forEach((template_pair) => {
                const div = this.containerEl.createEl("div");
                div.addClass("templater_div");
                const title = this.containerEl.createEl("h4", {
                    text: "User Function n°" + i,
                });
                title.addClass("templater_title");
                const setting = new obsidian_module.Setting(this.containerEl)
                    .addExtraButton((extra) => {
                    extra
                        .setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs.splice(index, 1);
                            this.plugin.save_settings();
                            // Force refresh
                            this.display();
                        }
                    });
                })
                    .addText((text) => {
                    const t = text
                        .setPlaceholder("Function name")
                        .setValue(template_pair[0])
                        .onChange((new_value) => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][0] = new_value;
                            this.plugin.save_settings();
                        }
                    });
                    t.inputEl.addClass("templater_template");
                    return t;
                })
                    .addTextArea((text) => {
                    const t = text
                        .setPlaceholder("System Command")
                        .setValue(template_pair[1])
                        .onChange((new_cmd) => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][1] = new_cmd;
                            this.plugin.save_settings();
                        }
                    });
                    t.inputEl.setAttr("rows", 2);
                    t.inputEl.addClass("templater_cmd");
                    return t;
                });
                setting.infoEl.remove();
                div.appendChild(title);
                div.appendChild(this.containerEl.lastChild);
                i += 1;
            });
            const div = this.containerEl.createEl("div");
            div.addClass("templater_div2");
            const setting = new obsidian_module.Setting(this.containerEl).addButton((button) => {
                button
                    .setButtonText("Add New User Function")
                    .setCta()
                    .onClick(() => {
                    this.plugin.settings.templates_pairs.push(["", ""]);
                    this.plugin.save_settings();
                    // Force refresh
                    this.display();
                });
            });
            setting.infoEl.remove();
            div.appendChild(this.containerEl.lastChild);
        }
    }
}

var OpenMode;
(function (OpenMode) {
    OpenMode[OpenMode["InsertTemplate"] = 0] = "InsertTemplate";
    OpenMode[OpenMode["CreateNoteTemplate"] = 1] = "CreateNoteTemplate";
})(OpenMode || (OpenMode = {}));
class FuzzySuggester extends obsidian_module.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
        this.setPlaceholder("Type name of a template...");
    }
    getItems() {
        if (!this.plugin.settings.templates_folder) {
            return this.app.vault.getMarkdownFiles();
        }
        const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.templates_folder), `Couldn't retrieve template files from templates folder ${this.plugin.settings.templates_folder}`);
        if (!files) {
            return [];
        }
        return files;
    }
    getItemText(item) {
        return item.basename;
    }
    onChooseItem(item) {
        switch (this.open_mode) {
            case OpenMode.InsertTemplate:
                this.plugin.templater.append_template_to_active_file(item);
                break;
            case OpenMode.CreateNoteTemplate:
                this.plugin.templater.create_new_note_from_template(item, this.creation_folder);
                break;
        }
    }
    start() {
        try {
            this.open();
        }
        catch (e) {
            log_error(e);
        }
    }
    insert_template() {
        this.open_mode = OpenMode.InsertTemplate;
        this.start();
    }
    create_new_note_from_template(folder) {
        this.creation_folder = folder;
        this.open_mode = OpenMode.CreateNoteTemplate;
        this.start();
    }
}

const UNSUPPORTED_MOBILE_TEMPLATE = "Error_MobileUnsupportedTemplate";
const ICON_DATA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.1328 28.7"><path d="M0 15.14 0 10.15 18.67 1.51 18.67 6.03 4.72 12.33 4.72 12.76 18.67 19.22 18.67 23.74 0 15.14ZM33.6928 1.84C33.6928 1.84 33.9761 2.1467 34.5428 2.76C35.1094 3.38 35.3928 4.56 35.3928 6.3C35.3928 8.0466 34.8195 9.54 33.6728 10.78C32.5261 12.02 31.0995 12.64 29.3928 12.64C27.6862 12.64 26.2661 12.0267 25.1328 10.8C23.9928 9.5733 23.4228 8.0867 23.4228 6.34C23.4228 4.6 23.9995 3.1066 25.1528 1.86C26.2994.62 27.7261 0 29.4328 0C31.1395 0 32.5594.6133 33.6928 1.84M49.8228.67 29.5328 28.38 24.4128 28.38 44.7128.67 49.8228.67M31.0328 8.38C31.0328 8.38 31.1395 8.2467 31.3528 7.98C31.5662 7.7067 31.6728 7.1733 31.6728 6.38C31.6728 5.5867 31.4461 4.92 30.9928 4.38C30.5461 3.84 29.9995 3.57 29.3528 3.57C28.7061 3.57 28.1695 3.84 27.7428 4.38C27.3228 4.92 27.1128 5.5867 27.1128 6.38C27.1128 7.1733 27.3361 7.84 27.7828 8.38C28.2361 8.9267 28.7861 9.2 29.4328 9.2C30.0795 9.2 30.6128 8.9267 31.0328 8.38M49.4328 17.9C49.4328 17.9 49.7161 18.2067 50.2828 18.82C50.8495 19.4333 51.1328 20.6133 51.1328 22.36C51.1328 24.1 50.5594 25.59 49.4128 26.83C48.2595 28.0766 46.8295 28.7 45.1228 28.7C43.4228 28.7 42.0028 28.0833 40.8628 26.85C39.7295 25.6233 39.1628 24.1366 39.1628 22.39C39.1628 20.65 39.7361 19.16 40.8828 17.92C42.0361 16.6733 43.4628 16.05 45.1628 16.05C46.8694 16.05 48.2928 16.6667 49.4328 17.9M46.8528 24.52C46.8528 24.52 46.9595 24.3833 47.1728 24.11C47.3795 23.8367 47.4828 23.3033 47.4828 22.51C47.4828 21.7167 47.2595 21.05 46.8128 20.51C46.3661 19.97 45.8162 19.7 45.1628 19.7C44.5161 19.7 43.9828 19.97 43.5628 20.51C43.1428 21.05 42.9328 21.7167 42.9328 22.51C42.9328 23.3033 43.1561 23.9733 43.6028 24.52C44.0494 25.06 44.5961 25.33 45.2428 25.33C45.8895 25.33 46.4261 25.06 46.8528 24.52Z" fill="currentColor"/></svg>`;

class InternalModule {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.static_functions = new Map();
        this.dynamic_functions = new Map();
    }
    getName() {
        return this.name;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.create_static_templates();
            this.static_object = Object.fromEntries(this.static_functions);
        });
    }
    generate_object(new_config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = new_config;
            yield this.create_dynamic_templates();
            return Object.assign(Object.assign({}, this.static_object), Object.fromEntries(this.dynamic_functions));
        });
    }
}

class InternalModuleDate extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "date";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("now", this.generate_now());
            this.static_functions.set("tomorrow", this.generate_tomorrow());
            this.static_functions.set("weekday", this.generate_weekday());
            this.static_functions.set("yesterday", this.generate_yesterday());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_now() {
        return (format = "YYYY-MM-DD", offset, reference, reference_format) => {
            if (reference &&
                !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            let duration;
            if (typeof offset === "string") {
                duration = window.moment.duration(offset);
            }
            else if (typeof offset === "number") {
                duration = window.moment.duration(offset, "days");
            }
            return window
                .moment(reference, reference_format)
                .add(duration)
                .format(format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(1, "days").format(format);
        };
    }
    generate_weekday() {
        return (format = "YYYY-MM-DD", weekday, reference, reference_format) => {
            if (reference &&
                !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            return window
                .moment(reference, reference_format)
                .weekday(weekday)
                .format(format);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(-1, "days").format(format);
        };
    }
}

const DEPTH_LIMIT = 10;
class InternalModuleFile extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "file";
        this.include_depth = 0;
        this.create_new_depth = 0;
        this.linkpath_regex = new RegExp("^\\[\\[(.*)\\]\\]$");
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("creation_date", this.generate_creation_date());
            this.static_functions.set("create_new", this.generate_create_new());
            this.static_functions.set("cursor", this.generate_cursor());
            this.static_functions.set("cursor_append", this.generate_cursor_append());
            this.static_functions.set("exists", this.generate_exists());
            this.static_functions.set("find_tfile", this.generate_find_tfile());
            this.static_functions.set("folder", this.generate_folder());
            this.static_functions.set("include", this.generate_include());
            this.static_functions.set("last_modified_date", this.generate_last_modified_date());
            this.static_functions.set("move", this.generate_move());
            this.static_functions.set("path", this.generate_path());
            this.static_functions.set("rename", this.generate_rename());
            this.static_functions.set("selection", this.generate_selection());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dynamic_functions.set("content", yield this.generate_content());
            this.dynamic_functions.set("tags", this.generate_tags());
            this.dynamic_functions.set("title", this.generate_title());
        });
    }
    generate_content() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.app.vault.read(this.config.target_file);
        });
    }
    generate_create_new() {
        return (template, filename, open_new = false, folder) => __awaiter(this, void 0, void 0, function* () {
            this.create_new_depth += 1;
            if (this.create_new_depth > DEPTH_LIMIT) {
                this.create_new_depth = 0;
                throw new TemplaterError("Reached create_new depth limit (max = 10)");
            }
            const new_file = yield this.plugin.templater.create_new_note_from_template(template, folder, filename, open_new);
            this.create_new_depth -= 1;
            return new_file;
        });
    }
    generate_creation_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window
                .moment(this.config.target_file.stat.ctime)
                .format(format);
        };
    }
    generate_cursor() {
        return (order) => {
            // Hack to prevent empty output
            return `<% tp.file.cursor(${order !== null && order !== void 0 ? order : ""}) %>`;
        };
    }
    generate_cursor_append() {
        return (content) => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
            if (active_view === null) {
                this.plugin.log_error(new TemplaterError("No active view, can't append to cursor."));
                return;
            }
            const editor = active_view.editor;
            const doc = editor.getDoc();
            doc.replaceSelection(content);
            return "";
        };
    }
    generate_exists() {
        return (filename) => {
            // TODO: Remove this, only here to support the old way
            let match;
            if ((match = this.linkpath_regex.exec(filename)) !== null) {
                filename = match[1];
            }
            const file = this.app.metadataCache.getFirstLinkpathDest(filename, "");
            return file != null;
        };
    }
    generate_find_tfile() {
        return (filename) => {
            const path = obsidian_module.normalizePath(filename);
            return this.app.metadataCache.getFirstLinkpathDest(path, "");
        };
    }
    generate_folder() {
        return (relative = false) => {
            const parent = this.config.target_file.parent;
            let folder;
            if (relative) {
                folder = parent.path;
            }
            else {
                folder = parent.name;
            }
            return folder;
        };
    }
    generate_include() {
        return (include_link) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // TODO: Add mutex for this, this may currently lead to a race condition.
            // While not very impactful, that could still be annoying.
            this.include_depth += 1;
            if (this.include_depth > DEPTH_LIMIT) {
                this.include_depth -= 1;
                throw new TemplaterError("Reached inclusion depth limit (max = 10)");
            }
            let inc_file_content;
            if (include_link instanceof obsidian_module.TFile) {
                inc_file_content = yield this.app.vault.read(include_link);
            }
            else {
                let match;
                if ((match = this.linkpath_regex.exec(include_link)) === null) {
                    this.include_depth -= 1;
                    throw new TemplaterError("Invalid file format, provide an obsidian link between quotes.");
                }
                const { path, subpath } = obsidian_module.parseLinktext(match[1]);
                const inc_file = this.app.metadataCache.getFirstLinkpathDest(path, "");
                if (!inc_file) {
                    this.include_depth -= 1;
                    throw new TemplaterError(`File ${include_link} doesn't exist`);
                }
                inc_file_content = yield this.app.vault.read(inc_file);
                if (subpath) {
                    const cache = this.app.metadataCache.getFileCache(inc_file);
                    if (cache) {
                        const result = obsidian_module.resolveSubpath(cache, subpath);
                        if (result) {
                            inc_file_content = inc_file_content.slice(result.start.offset, (_a = result.end) === null || _a === void 0 ? void 0 : _a.offset);
                        }
                    }
                }
            }
            try {
                const parsed_content = yield this.plugin.templater.parser.parse_commands(inc_file_content, this.plugin.templater.current_functions_object);
                this.include_depth -= 1;
                return parsed_content;
            }
            catch (e) {
                this.include_depth -= 1;
                throw e;
            }
        });
    }
    generate_last_modified_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window
                .moment(this.config.target_file.stat.mtime)
                .format(format);
        };
    }
    generate_move() {
        return (path) => __awaiter(this, void 0, void 0, function* () {
            const new_path = obsidian_module.normalizePath(`${path}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (obsidian_module.Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
                throw new TemplaterError("app.vault is not a FileSystemAdapter instance");
            }
            const vault_path = this.app.vault.adapter.getBasePath();
            if (relative) {
                return this.config.target_file.path;
            }
            else {
                return `${vault_path}/${this.config.target_file.path}`;
            }
        };
    }
    generate_rename() {
        return (new_title) => __awaiter(this, void 0, void 0, function* () {
            if (new_title.match(/[\\/:]+/g)) {
                throw new TemplaterError("File name cannot contain any of these characters: \\ / :");
            }
            const new_path = obsidian_module.normalizePath(`${this.config.target_file.parent.path}/${new_title}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
            if (active_view == null) {
                throw new TemplaterError("Active view is null, can't read selection.");
            }
            const editor = active_view.editor;
            return editor.getSelection();
        };
    }
    // TODO: Turn this into a function
    generate_tags() {
        const cache = this.app.metadataCache.getFileCache(this.config.target_file);
        return obsidian_module.getAllTags(cache);
    }
    // TODO: Turn this into a function
    generate_title() {
        return this.config.target_file.basename;
    }
}

class InternalModuleWeb extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "web";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("daily_quote", this.generate_daily_quote());
            this.static_functions.set("random_picture", this.generate_random_picture());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new TemplaterError("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getRequest("https://quotes.rest/qod");
            const json = yield response.json();
            const author = json.contents.quotes[0].author;
            const quote = json.contents.quotes[0].quote;
            const new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size, query) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getRequest(`https://source.unsplash.com/random/${size !== null && size !== void 0 ? size : ""}?${query !== null && query !== void 0 ? query : ""}`);
            const url = response.url;
            return `![tp.web.random_picture](${url})`;
        });
    }
}

class InternalModuleFrontmatter extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "frontmatter";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.app.metadataCache.getFileCache(this.config.target_file);
            this.dynamic_functions = new Map(Object.entries((cache === null || cache === void 0 ? void 0 : cache.frontmatter) || {}));
        });
    }
}

class PromptModal extends obsidian_module.Modal {
    constructor(app, prompt_text, default_value) {
        super(app);
        this.prompt_text = prompt_text;
        this.default_value = default_value;
        this.submitted = false;
    }
    onOpen() {
        this.titleEl.setText(this.prompt_text);
        this.createForm();
    }
    onClose() {
        this.contentEl.empty();
        if (!this.submitted) {
            this.reject(new TemplaterError("Cancelled prompt"));
        }
    }
    createForm() {
        var _a;
        const div = this.contentEl.createDiv();
        div.addClass("templater-prompt-div");
        const form = div.createEl("form");
        form.addClass("templater-prompt-form");
        form.type = "submit";
        form.onsubmit = (e) => {
            this.submitted = true;
            e.preventDefault();
            this.resolve(this.promptEl.value);
            this.close();
        };
        this.promptEl = form.createEl("input");
        this.promptEl.type = "text";
        this.promptEl.placeholder = "Type text here...";
        this.promptEl.value = (_a = this.default_value) !== null && _a !== void 0 ? _a : "";
        this.promptEl.addClass("templater-prompt-input");
        this.promptEl.select();
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class SuggesterModal extends obsidian_module.FuzzySuggestModal {
    constructor(app, text_items, items, placeholder) {
        super(app);
        this.text_items = text_items;
        this.items = items;
        this.submitted = false;
        this.setPlaceholder(placeholder);
    }
    getItems() {
        return this.items;
    }
    onClose() {
        if (!this.submitted) {
            this.reject(new TemplaterError("Cancelled prompt"));
        }
    }
    selectSuggestion(value, evt) {
        this.submitted = true;
        this.close();
        this.onChooseSuggestion(value, evt);
    }
    getItemText(item) {
        if (this.text_items instanceof Function) {
            return this.text_items(item);
        }
        return (this.text_items[this.items.indexOf(item)] || "Undefined Text Item");
    }
    onChooseItem(item) {
        this.resolve(item);
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class InternalModuleSystem extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "system";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("clipboard", this.generate_clipboard());
            this.static_functions.set("prompt", this.generate_prompt());
            this.static_functions.set("suggester", this.generate_suggester());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_clipboard() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // TODO: Add mobile support
            if (obsidian_module.Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return yield navigator.clipboard.readText();
        });
    }
    generate_prompt() {
        return (prompt_text, default_value, throw_on_cancel = false) => __awaiter(this, void 0, void 0, function* () {
            const prompt = new PromptModal(this.app, prompt_text, default_value);
            const promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
    generate_suggester() {
        return (text_items, items, throw_on_cancel = false, placeholder = "") => __awaiter(this, void 0, void 0, function* () {
            const suggester = new SuggesterModal(this.app, text_items, items, placeholder);
            const promise = new Promise((resolve, reject) => suggester.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
}

class InternalModuleConfig extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "config";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return config;
        });
    }
}

class InternalFunctions {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.modules_array = [];
        this.modules_array.push(new InternalModuleDate(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFile(this.app, this.plugin));
        this.modules_array.push(new InternalModuleWeb(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFrontmatter(this.app, this.plugin));
        this.modules_array.push(new InternalModuleSystem(this.app, this.plugin));
        this.modules_array.push(new InternalModuleConfig(this.app, this.plugin));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const mod of this.modules_array) {
                yield mod.init();
            }
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const internal_functions_object = {};
            for (const mod of this.modules_array) {
                internal_functions_object[mod.getName()] =
                    yield mod.generate_object(config);
            }
            return internal_functions_object;
        });
    }
}

class UserSystemFunctions {
    constructor(app, plugin) {
        this.plugin = plugin;
        if (obsidian_module.Platform.isMobileApp ||
            !(app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
            this.cwd = "";
        }
        else {
            this.cwd = app.vault.adapter.getBasePath();
            this.exec_promise = util.promisify(child_process.exec);
        }
    }
    // TODO: Add mobile support
    generate_system_functions(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_system_functions = new Map();
            const internal_functions_object = yield this.plugin.templater.functions_generator.generate_object(config, FunctionsMode.INTERNAL);
            for (const template_pair of this.plugin.settings.templates_pairs) {
                const template = template_pair[0];
                let cmd = template_pair[1];
                if (!template || !cmd) {
                    continue;
                }
                if (obsidian_module.Platform.isMobileApp) {
                    user_system_functions.set(template, () => {
                        return new Promise((resolve) => resolve(UNSUPPORTED_MOBILE_TEMPLATE));
                    });
                }
                else {
                    cmd = yield this.plugin.templater.parser.parse_commands(cmd, internal_functions_object);
                    user_system_functions.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                        const process_env = Object.assign(Object.assign({}, process.env), user_args);
                        const cmd_options = Object.assign({ timeout: this.plugin.settings.command_timeout * 1000, cwd: this.cwd, env: process_env }, (this.plugin.settings.shell_path && {
                            shell: this.plugin.settings.shell_path,
                        }));
                        try {
                            const { stdout } = yield this.exec_promise(cmd, cmd_options);
                            return stdout.trimRight();
                        }
                        catch (error) {
                            throw new TemplaterError(`Error with User Template ${template}`, error);
                        }
                    }));
                }
            }
            return user_system_functions;
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_system_functions = yield this.generate_system_functions(config);
            return Object.fromEntries(user_system_functions);
        });
    }
}

class UserScriptFunctions {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    generate_user_script_functions(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_script_functions = new Map();
            const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `Couldn't find user script folder "${this.plugin.settings.user_scripts_folder}"`);
            if (!files) {
                return new Map();
            }
            for (const file of files) {
                if (file.extension.toLowerCase() === "js") {
                    yield this.load_user_script_function(config, file, user_script_functions);
                }
            }
            return user_script_functions;
        });
    }
    load_user_script_function(config, file, user_script_functions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(this.app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
                throw new TemplaterError("app.vault is not a FileSystemAdapter instance");
            }
            const vault_path = this.app.vault.adapter.getBasePath();
            const file_path = `${vault_path}/${file.path}`;
            // https://stackoverflow.com/questions/26633901/reload-module-at-runtime
            // https://stackoverflow.com/questions/1972242/how-to-auto-reload-files-in-node-js
            if (Object.keys(window.require.cache).contains(file_path)) {
                delete window.require.cache[window.require.resolve(file_path)];
            }
            const user_function = yield Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(file_path)); });
            if (!user_function.default) {
                throw new TemplaterError(`Failed to load user script ${file_path}. No exports detected.`);
            }
            if (!(user_function.default instanceof Function)) {
                throw new TemplaterError(`Failed to load user script ${file_path}. Default export is not a function.`);
            }
            user_script_functions.set(`${file.basename}`, user_function.default);
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_script_functions = yield this.generate_user_script_functions(config);
            return Object.fromEntries(user_script_functions);
        });
    }
}

class UserFunctions {
    constructor(app, plugin) {
        this.plugin = plugin;
        this.user_system_functions = new UserSystemFunctions(app, plugin);
        this.user_script_functions = new UserScriptFunctions(app, plugin);
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_system_functions = {};
            let user_script_functions = {};
            if (this.plugin.settings.enable_system_commands) {
                user_system_functions =
                    yield this.user_system_functions.generate_object(config);
            }
            // TODO: Add mobile support
            // user_scripts_folder needs to be explicitly set to '/' to query from root
            if (obsidian_module.Platform.isDesktopApp && this.plugin.settings.user_scripts_folder) {
                user_script_functions =
                    yield this.user_script_functions.generate_object(config);
            }
            return Object.assign(Object.assign({}, user_system_functions), user_script_functions);
        });
    }
}

var FunctionsMode;
(function (FunctionsMode) {
    FunctionsMode[FunctionsMode["INTERNAL"] = 0] = "INTERNAL";
    FunctionsMode[FunctionsMode["USER_INTERNAL"] = 1] = "USER_INTERNAL";
})(FunctionsMode || (FunctionsMode = {}));
class FunctionsGenerator {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.internal_functions = new InternalFunctions(this.app, this.plugin);
        this.user_functions = new UserFunctions(this.app, this.plugin);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internal_functions.init();
        });
    }
    additional_functions() {
        return {
            obsidian: obsidian_module__namespace,
        };
    }
    generate_object(config, functions_mode = FunctionsMode.USER_INTERNAL) {
        return __awaiter(this, void 0, void 0, function* () {
            const final_object = {};
            const additional_functions_object = this.additional_functions();
            const internal_functions_object = yield this.internal_functions.generate_object(config);
            let user_functions_object = {};
            Object.assign(final_object, additional_functions_object);
            switch (functions_mode) {
                case FunctionsMode.INTERNAL:
                    Object.assign(final_object, internal_functions_object);
                    break;
                case FunctionsMode.USER_INTERNAL:
                    user_functions_object =
                        yield this.user_functions.generate_object(config);
                    Object.assign(final_object, Object.assign(Object.assign({}, internal_functions_object), { user: user_functions_object }));
                    break;
            }
            return final_object;
        });
    }
}

class CursorJumper {
    constructor(app) {
        this.app = app;
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
            if (!active_view) {
                return;
            }
            const active_file = active_view.file;
            yield active_view.save();
            const content = yield this.app.vault.read(active_file);
            const { new_content, positions } = this.replace_and_get_cursor_positions(content);
            if (positions) {
                yield this.app.vault.modify(active_file, new_content);
                this.set_cursor_location(positions);
            }
        });
    }
    get_editor_position_from_index(content, index) {
        const substr = content.substr(0, index);
        let l = 0;
        let offset = -1;
        let r = -1;
        for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
            ;
        offset += 1;
        const ch = content.substr(offset, index - offset).length;
        return { line: l, ch: ch };
    }
    replace_and_get_cursor_positions(content) {
        let cursor_matches = [];
        let match;
        const cursor_regex = new RegExp("<%\\s*tp.file.cursor\\((?<order>[0-9]{0,2})\\)\\s*%>", "g");
        while ((match = cursor_regex.exec(content)) != null) {
            cursor_matches.push(match);
        }
        if (cursor_matches.length === 0) {
            return {};
        }
        cursor_matches.sort((m1, m2) => {
            return Number(m1.groups["order"]) - Number(m2.groups["order"]);
        });
        const match_str = cursor_matches[0][0];
        cursor_matches = cursor_matches.filter((m) => {
            return m[0] === match_str;
        });
        const positions = [];
        let index_offset = 0;
        for (const match of cursor_matches) {
            const index = match.index - index_offset;
            positions.push(this.get_editor_position_from_index(content, index));
            content = content.replace(new RegExp(escape_RegExp(match[0])), "");
            index_offset += match[0].length;
            // For tp.file.cursor(), we keep the default top to bottom
            if (match[1] === "") {
                break;
            }
        }
        return { new_content: content, positions: positions };
    }
    set_cursor_location(positions) {
        const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
        if (!active_view) {
            return;
        }
        const editor = active_view.editor;
        editor.focus();
        const selections = [];
        for (const pos of positions) {
            selections.push({ from: pos });
        }
        const transaction = {
            selections: selections,
        };
        editor.transaction(transaction);
    }
}

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/* eslint-disable */

(function (mod) {
    mod(window.CodeMirror);
})(function (CodeMirror) {

    CodeMirror.defineMode("javascript", function (config, parserConfig) {
        var indentUnit = config.indentUnit;
        var statementIndent = parserConfig.statementIndent;
        var jsonldMode = parserConfig.jsonld;
        var jsonMode = parserConfig.json || jsonldMode;
        var trackScope = parserConfig.trackScope !== false;
        var isTS = parserConfig.typescript;
        var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

        // Tokenizer

        var keywords = (function () {
            function kw(type) {
                return { type: type, style: "keyword" };
            }
            var A = kw("keyword a"),
                B = kw("keyword b"),
                C = kw("keyword c"),
                D = kw("keyword d");
            var operator = kw("operator"),
                atom = { type: "atom", style: "atom" };

            return {
                if: kw("if"),
                while: A,
                with: A,
                else: B,
                do: B,
                try: B,
                finally: B,
                return: D,
                break: D,
                continue: D,
                new: kw("new"),
                delete: C,
                void: C,
                throw: C,
                debugger: kw("debugger"),
                var: kw("var"),
                const: kw("var"),
                let: kw("var"),
                function: kw("function"),
                catch: kw("catch"),
                for: kw("for"),
                switch: kw("switch"),
                case: kw("case"),
                default: kw("default"),
                in: operator,
                typeof: operator,
                instanceof: operator,
                true: atom,
                false: atom,
                null: atom,
                undefined: atom,
                NaN: atom,
                Infinity: atom,
                this: kw("this"),
                class: kw("class"),
                super: kw("atom"),
                yield: C,
                export: kw("export"),
                import: kw("import"),
                extends: C,
                await: C,
            };
        })();

        var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
        var isJsonldKeyword =
            /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

        function readRegexp(stream) {
            var escaped = false,
                next,
                inSet = false;
            while ((next = stream.next()) != null) {
                if (!escaped) {
                    if (next == "/" && !inSet) return;
                    if (next == "[") inSet = true;
                    else if (inSet && next == "]") inSet = false;
                }
                escaped = !escaped && next == "\\";
            }
        }

        // Used as scratch variables to communicate multiple values without
        // consing up tons of objects.
        var type, content;
        function ret(tp, style, cont) {
            type = tp;
            content = cont;
            return style;
        }
        function tokenBase(stream, state) {
            var ch = stream.next();
            if (ch == '"' || ch == "'") {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state);
            } else if (
                ch == "." &&
                stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)
            ) {
                return ret("number", "number");
            } else if (ch == "." && stream.match("..")) {
                return ret("spread", "meta");
            } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
                return ret(ch);
            } else if (ch == "=" && stream.eat(">")) {
                return ret("=>", "operator");
            } else if (
                ch == "0" &&
                stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)
            ) {
                return ret("number", "number");
            } else if (/\d/.test(ch)) {
                stream.match(
                    /^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/
                );
                return ret("number", "number");
            } else if (ch == "/") {
                if (stream.eat("*")) {
                    state.tokenize = tokenComment;
                    return tokenComment(stream, state);
                } else if (stream.eat("/")) {
                    stream.skipToEnd();
                    return ret("comment", "comment");
                } else if (expressionAllowed(stream, state, 1)) {
                    readRegexp(stream);
                    stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
                    return ret("regexp", "string-2");
                } else {
                    stream.eat("=");
                    return ret("operator", "operator", stream.current());
                }
            } else if (ch == "`") {
                state.tokenize = tokenQuasi;
                return tokenQuasi(stream, state);
            } else if (ch == "#" && stream.peek() == "!") {
                stream.skipToEnd();
                return ret("meta", "meta");
            } else if (ch == "#" && stream.eatWhile(wordRE)) {
                return ret("variable", "property");
            } else if (
                (ch == "<" && stream.match("!--")) ||
                (ch == "-" &&
                    stream.match("->") &&
                    !/\S/.test(stream.string.slice(0, stream.start)))
            ) {
                stream.skipToEnd();
                return ret("comment", "comment");
            } else if (isOperatorChar.test(ch)) {
                if (ch != ">" || !state.lexical || state.lexical.type != ">") {
                    if (stream.eat("=")) {
                        if (ch == "!" || ch == "=") stream.eat("=");
                    } else if (/[<>*+\-|&?]/.test(ch)) {
                        stream.eat(ch);
                        if (ch == ">") stream.eat(ch);
                    }
                }
                if (ch == "?" && stream.eat(".")) return ret(".");
                return ret("operator", "operator", stream.current());
            } else if (wordRE.test(ch)) {
                stream.eatWhile(wordRE);
                var word = stream.current();
                if (state.lastType != ".") {
                    if (keywords.propertyIsEnumerable(word)) {
                        var kw = keywords[word];
                        return ret(kw.type, kw.style, word);
                    }
                    if (
                        word == "async" &&
                        stream.match(
                            /^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/,
                            false
                        )
                    )
                        return ret("async", "keyword", word);
                }
                return ret("variable", "variable", word);
            }
        }

        function tokenString(quote) {
            return function (stream, state) {
                var escaped = false,
                    next;
                if (
                    jsonldMode &&
                    stream.peek() == "@" &&
                    stream.match(isJsonldKeyword)
                ) {
                    state.tokenize = tokenBase;
                    return ret("jsonld-keyword", "meta");
                }
                while ((next = stream.next()) != null) {
                    if (next == quote && !escaped) break;
                    escaped = !escaped && next == "\\";
                }
                if (!escaped) state.tokenize = tokenBase;
                return ret("string", "string");
            };
        }

        function tokenComment(stream, state) {
            var maybeEnd = false,
                ch;
            while ((ch = stream.next())) {
                if (ch == "/" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = ch == "*";
            }
            return ret("comment", "comment");
        }

        function tokenQuasi(stream, state) {
            var escaped = false,
                next;
            while ((next = stream.next()) != null) {
                if (
                    !escaped &&
                    (next == "`" || (next == "$" && stream.eat("{")))
                ) {
                    state.tokenize = tokenBase;
                    break;
                }
                escaped = !escaped && next == "\\";
            }
            return ret("quasi", "string-2", stream.current());
        }

        var brackets = "([{}])";
        // This is a crude lookahead trick to try and notice that we're
        // parsing the argument patterns for a fat-arrow function before we
        // actually hit the arrow token. It only works if the arrow is on
        // the same line as the arguments and there's no strange noise
        // (comments) in between. Fallback is to only notice when we hit the
        // arrow, and not declare the arguments as locals for the arrow
        // body.
        function findFatArrow(stream, state) {
            if (state.fatArrowAt) state.fatArrowAt = null;
            var arrow = stream.string.indexOf("=>", stream.start);
            if (arrow < 0) return;

            if (isTS) {
                // Try to skip TypeScript return type declarations after the arguments
                var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(
                    stream.string.slice(stream.start, arrow)
                );
                if (m) arrow = m.index;
            }

            var depth = 0,
                sawSomething = false;
            for (var pos = arrow - 1; pos >= 0; --pos) {
                var ch = stream.string.charAt(pos);
                var bracket = brackets.indexOf(ch);
                if (bracket >= 0 && bracket < 3) {
                    if (!depth) {
                        ++pos;
                        break;
                    }
                    if (--depth == 0) {
                        if (ch == "(") sawSomething = true;
                        break;
                    }
                } else if (bracket >= 3 && bracket < 6) {
                    ++depth;
                } else if (wordRE.test(ch)) {
                    sawSomething = true;
                } else if (/["'\/`]/.test(ch)) {
                    for (; ; --pos) {
                        if (pos == 0) return;
                        var next = stream.string.charAt(pos - 1);
                        if (
                            next == ch &&
                            stream.string.charAt(pos - 2) != "\\"
                        ) {
                            pos--;
                            break;
                        }
                    }
                } else if (sawSomething && !depth) {
                    ++pos;
                    break;
                }
            }
            if (sawSomething && !depth) state.fatArrowAt = pos;
        }

        // Parser

        var atomicTypes = {
            atom: true,
            number: true,
            variable: true,
            string: true,
            regexp: true,
            this: true,
            import: true,
            "jsonld-keyword": true,
        };

        function JSLexical(indented, column, type, align, prev, info) {
            this.indented = indented;
            this.column = column;
            this.type = type;
            this.prev = prev;
            this.info = info;
            if (align != null) this.align = align;
        }

        function inScope(state, varname) {
            if (!trackScope) return false;
            for (var v = state.localVars; v; v = v.next)
                if (v.name == varname) return true;
            for (var cx = state.context; cx; cx = cx.prev) {
                for (var v = cx.vars; v; v = v.next)
                    if (v.name == varname) return true;
            }
        }

        function parseJS(state, style, type, content, stream) {
            var cc = state.cc;
            // Communicate our context to the combinators.
            // (Less wasteful than consing up a hundred closures on every call.)
            cx.state = state;
            cx.stream = stream;
            (cx.marked = null), (cx.cc = cc);
            cx.style = style;

            if (!state.lexical.hasOwnProperty("align"))
                state.lexical.align = true;

            while (true) {
                var combinator = cc.length
                    ? cc.pop()
                    : jsonMode
                    ? expression
                    : statement;
                if (combinator(type, content)) {
                    while (cc.length && cc[cc.length - 1].lex) cc.pop()();
                    if (cx.marked) return cx.marked;
                    if (type == "variable" && inScope(state, content))
                        return "variable-2";
                    return style;
                }
            }
        }

        // Combinator utils

        var cx = { state: null, column: null, marked: null, cc: null };
        function pass() {
            for (var i = arguments.length - 1; i >= 0; i--)
                cx.cc.push(arguments[i]);
        }
        function cont() {
            pass.apply(null, arguments);
            return true;
        }
        function inList(name, list) {
            for (var v = list; v; v = v.next) if (v.name == name) return true;
            return false;
        }
        function register(varname) {
            var state = cx.state;
            cx.marked = "def";
            if (!trackScope) return;
            if (state.context) {
                if (
                    state.lexical.info == "var" &&
                    state.context &&
                    state.context.block
                ) {
                    // FIXME function decls are also not block scoped
                    var newContext = registerVarScoped(varname, state.context);
                    if (newContext != null) {
                        state.context = newContext;
                        return;
                    }
                } else if (!inList(varname, state.localVars)) {
                    state.localVars = new Var(varname, state.localVars);
                    return;
                }
            }
            // Fall through means this is global
            if (parserConfig.globalVars && !inList(varname, state.globalVars))
                state.globalVars = new Var(varname, state.globalVars);
        }
        function registerVarScoped(varname, context) {
            if (!context) {
                return null;
            } else if (context.block) {
                var inner = registerVarScoped(varname, context.prev);
                if (!inner) return null;
                if (inner == context.prev) return context;
                return new Context(inner, context.vars, true);
            } else if (inList(varname, context.vars)) {
                return context;
            } else {
                return new Context(
                    context.prev,
                    new Var(varname, context.vars),
                    false
                );
            }
        }

        function isModifier(name) {
            return (
                name == "public" ||
                name == "private" ||
                name == "protected" ||
                name == "abstract" ||
                name == "readonly"
            );
        }

        // Combinators

        function Context(prev, vars, block) {
            this.prev = prev;
            this.vars = vars;
            this.block = block;
        }
        function Var(name, next) {
            this.name = name;
            this.next = next;
        }

        var defaultVars = new Var("this", new Var("arguments", null));
        function pushcontext() {
            cx.state.context = new Context(
                cx.state.context,
                cx.state.localVars,
                false
            );
            cx.state.localVars = defaultVars;
        }
        function pushblockcontext() {
            cx.state.context = new Context(
                cx.state.context,
                cx.state.localVars,
                true
            );
            cx.state.localVars = null;
        }
        function popcontext() {
            cx.state.localVars = cx.state.context.vars;
            cx.state.context = cx.state.context.prev;
        }
        popcontext.lex = true;
        function pushlex(type, info) {
            var result = function () {
                var state = cx.state,
                    indent = state.indented;
                if (state.lexical.type == "stat")
                    indent = state.lexical.indented;
                else
                    for (
                        var outer = state.lexical;
                        outer && outer.type == ")" && outer.align;
                        outer = outer.prev
                    )
                        indent = outer.indented;
                state.lexical = new JSLexical(
                    indent,
                    cx.stream.column(),
                    type,
                    null,
                    state.lexical,
                    info
                );
            };
            result.lex = true;
            return result;
        }
        function poplex() {
            var state = cx.state;
            if (state.lexical.prev) {
                if (state.lexical.type == ")")
                    state.indented = state.lexical.indented;
                state.lexical = state.lexical.prev;
            }
        }
        poplex.lex = true;

        function expect(wanted) {
            function exp(type) {
                if (type == wanted) return cont();
                else if (
                    wanted == ";" ||
                    type == "}" ||
                    type == ")" ||
                    type == "]"
                )
                    return pass();
                else return cont(exp);
            }
            return exp;
        }

        function statement(type, value) {
            if (type == "var")
                return cont(
                    pushlex("vardef", value),
                    vardef,
                    expect(";"),
                    poplex
                );
            if (type == "keyword a")
                return cont(pushlex("form"), parenExpr, statement, poplex);
            if (type == "keyword b")
                return cont(pushlex("form"), statement, poplex);
            if (type == "keyword d")
                return cx.stream.match(/^\s*$/, false)
                    ? cont()
                    : cont(
                          pushlex("stat"),
                          maybeexpression,
                          expect(";"),
                          poplex
                      );
            if (type == "debugger") return cont(expect(";"));
            if (type == "{")
                return cont(
                    pushlex("}"),
                    pushblockcontext,
                    block,
                    poplex,
                    popcontext
                );
            if (type == ";") return cont();
            if (type == "if") {
                if (
                    cx.state.lexical.info == "else" &&
                    cx.state.cc[cx.state.cc.length - 1] == poplex
                )
                    cx.state.cc.pop()();
                return cont(
                    pushlex("form"),
                    parenExpr,
                    statement,
                    poplex,
                    maybeelse
                );
            }
            if (type == "function") return cont(functiondef);
            if (type == "for")
                return cont(
                    pushlex("form"),
                    pushblockcontext,
                    forspec,
                    statement,
                    popcontext,
                    poplex
                );
            if (type == "class" || (isTS && value == "interface")) {
                cx.marked = "keyword";
                return cont(
                    pushlex("form", type == "class" ? type : value),
                    className,
                    poplex
                );
            }
            if (type == "variable") {
                if (isTS && value == "declare") {
                    cx.marked = "keyword";
                    return cont(statement);
                } else if (
                    isTS &&
                    (value == "module" || value == "enum" || value == "type") &&
                    cx.stream.match(/^\s*\w/, false)
                ) {
                    cx.marked = "keyword";
                    if (value == "enum") return cont(enumdef);
                    else if (value == "type")
                        return cont(
                            typename,
                            expect("operator"),
                            typeexpr,
                            expect(";")
                        );
                    else
                        return cont(
                            pushlex("form"),
                            pattern,
                            expect("{"),
                            pushlex("}"),
                            block,
                            poplex,
                            poplex
                        );
                } else if (isTS && value == "namespace") {
                    cx.marked = "keyword";
                    return cont(pushlex("form"), expression, statement, poplex);
                } else if (isTS && value == "abstract") {
                    cx.marked = "keyword";
                    return cont(statement);
                } else {
                    return cont(pushlex("stat"), maybelabel);
                }
            }
            if (type == "switch")
                return cont(
                    pushlex("form"),
                    parenExpr,
                    expect("{"),
                    pushlex("}", "switch"),
                    pushblockcontext,
                    block,
                    poplex,
                    poplex,
                    popcontext
                );
            if (type == "case") return cont(expression, expect(":"));
            if (type == "default") return cont(expect(":"));
            if (type == "catch")
                return cont(
                    pushlex("form"),
                    pushcontext,
                    maybeCatchBinding,
                    statement,
                    poplex,
                    popcontext
                );
            if (type == "export")
                return cont(pushlex("stat"), afterExport, poplex);
            if (type == "import")
                return cont(pushlex("stat"), afterImport, poplex);
            if (type == "async") return cont(statement);
            if (value == "@") return cont(expression, statement);
            return pass(pushlex("stat"), expression, expect(";"), poplex);
        }
        function maybeCatchBinding(type) {
            if (type == "(") return cont(funarg, expect(")"));
        }
        function expression(type, value) {
            return expressionInner(type, value, false);
        }
        function expressionNoComma(type, value) {
            return expressionInner(type, value, true);
        }
        function parenExpr(type) {
            if (type != "(") return pass();
            return cont(pushlex(")"), maybeexpression, expect(")"), poplex);
        }
        function expressionInner(type, value, noComma) {
            if (cx.state.fatArrowAt == cx.stream.start) {
                var body = noComma ? arrowBodyNoComma : arrowBody;
                if (type == "(")
                    return cont(
                        pushcontext,
                        pushlex(")"),
                        commasep(funarg, ")"),
                        poplex,
                        expect("=>"),
                        body,
                        popcontext
                    );
                else if (type == "variable")
                    return pass(
                        pushcontext,
                        pattern,
                        expect("=>"),
                        body,
                        popcontext
                    );
            }

            var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
            if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
            if (type == "function") return cont(functiondef, maybeop);
            if (type == "class" || (isTS && value == "interface")) {
                cx.marked = "keyword";
                return cont(pushlex("form"), classExpression, poplex);
            }
            if (type == "keyword c" || type == "async")
                return cont(noComma ? expressionNoComma : expression);
            if (type == "(")
                return cont(
                    pushlex(")"),
                    maybeexpression,
                    expect(")"),
                    poplex,
                    maybeop
                );
            if (type == "operator" || type == "spread")
                return cont(noComma ? expressionNoComma : expression);
            if (type == "[")
                return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
            if (type == "{") return contCommasep(objprop, "}", null, maybeop);
            if (type == "quasi") return pass(quasi, maybeop);
            if (type == "new") return cont(maybeTarget(noComma));
            return cont();
        }
        function maybeexpression(type) {
            if (type.match(/[;\}\)\],]/)) return pass();
            return pass(expression);
        }

        function maybeoperatorComma(type, value) {
            if (type == ",") return cont(maybeexpression);
            return maybeoperatorNoComma(type, value, false);
        }
        function maybeoperatorNoComma(type, value, noComma) {
            var me =
                noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
            var expr = noComma == false ? expression : expressionNoComma;
            if (type == "=>")
                return cont(
                    pushcontext,
                    noComma ? arrowBodyNoComma : arrowBody,
                    popcontext
                );
            if (type == "operator") {
                if (/\+\+|--/.test(value) || (isTS && value == "!"))
                    return cont(me);
                if (
                    isTS &&
                    value == "<" &&
                    cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false)
                )
                    return cont(
                        pushlex(">"),
                        commasep(typeexpr, ">"),
                        poplex,
                        me
                    );
                if (value == "?") return cont(expression, expect(":"), expr);
                return cont(expr);
            }
            if (type == "quasi") {
                return pass(quasi, me);
            }
            if (type == ";") return;
            if (type == "(")
                return contCommasep(expressionNoComma, ")", "call", me);
            if (type == ".") return cont(property, me);
            if (type == "[")
                return cont(
                    pushlex("]"),
                    maybeexpression,
                    expect("]"),
                    poplex,
                    me
                );
            if (isTS && value == "as") {
                cx.marked = "keyword";
                return cont(typeexpr, me);
            }
            if (type == "regexp") {
                cx.state.lastType = cx.marked = "operator";
                cx.stream.backUp(cx.stream.pos - cx.stream.start - 1);
                return cont(expr);
            }
        }
        function quasi(type, value) {
            if (type != "quasi") return pass();
            if (value.slice(value.length - 2) != "${") return cont(quasi);
            return cont(maybeexpression, continueQuasi);
        }
        function continueQuasi(type) {
            if (type == "}") {
                cx.marked = "string-2";
                cx.state.tokenize = tokenQuasi;
                return cont(quasi);
            }
        }
        function arrowBody(type) {
            findFatArrow(cx.stream, cx.state);
            return pass(type == "{" ? statement : expression);
        }
        function arrowBodyNoComma(type) {
            findFatArrow(cx.stream, cx.state);
            return pass(type == "{" ? statement : expressionNoComma);
        }
        function maybeTarget(noComma) {
            return function (type) {
                if (type == ".") return cont(noComma ? targetNoComma : target);
                else if (type == "variable" && isTS)
                    return cont(
                        maybeTypeArgs,
                        noComma ? maybeoperatorNoComma : maybeoperatorComma
                    );
                else return pass(noComma ? expressionNoComma : expression);
            };
        }
        function target(_, value) {
            if (value == "target") {
                cx.marked = "keyword";
                return cont(maybeoperatorComma);
            }
        }
        function targetNoComma(_, value) {
            if (value == "target") {
                cx.marked = "keyword";
                return cont(maybeoperatorNoComma);
            }
        }
        function maybelabel(type) {
            if (type == ":") return cont(poplex, statement);
            return pass(maybeoperatorComma, expect(";"), poplex);
        }
        function property(type) {
            if (type == "variable") {
                cx.marked = "property";
                return cont();
            }
        }
        function objprop(type, value) {
            if (type == "async") {
                cx.marked = "property";
                return cont(objprop);
            } else if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                if (value == "get" || value == "set") return cont(getterSetter);
                var m; // Work around fat-arrow-detection complication for detecting typescript typed arrow params
                if (
                    isTS &&
                    cx.state.fatArrowAt == cx.stream.start &&
                    (m = cx.stream.match(/^\s*:\s*/, false))
                )
                    cx.state.fatArrowAt = cx.stream.pos + m[0].length;
                return cont(afterprop);
            } else if (type == "number" || type == "string") {
                cx.marked = jsonldMode ? "property" : cx.style + " property";
                return cont(afterprop);
            } else if (type == "jsonld-keyword") {
                return cont(afterprop);
            } else if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(objprop);
            } else if (type == "[") {
                return cont(expression, maybetype, expect("]"), afterprop);
            } else if (type == "spread") {
                return cont(expressionNoComma, afterprop);
            } else if (value == "*") {
                cx.marked = "keyword";
                return cont(objprop);
            } else if (type == ":") {
                return pass(afterprop);
            }
        }
        function getterSetter(type) {
            if (type != "variable") return pass(afterprop);
            cx.marked = "property";
            return cont(functiondef);
        }
        function afterprop(type) {
            if (type == ":") return cont(expressionNoComma);
            if (type == "(") return pass(functiondef);
        }
        function commasep(what, end, sep) {
            function proceed(type, value) {
                if (sep ? sep.indexOf(type) > -1 : type == ",") {
                    var lex = cx.state.lexical;
                    if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
                    return cont(function (type, value) {
                        if (type == end || value == end) return pass();
                        return pass(what);
                    }, proceed);
                }
                if (type == end || value == end) return cont();
                if (sep && sep.indexOf(";") > -1) return pass(what);
                return cont(expect(end));
            }
            return function (type, value) {
                if (type == end || value == end) return cont();
                return pass(what, proceed);
            };
        }
        function contCommasep(what, end, info) {
            for (var i = 3; i < arguments.length; i++) cx.cc.push(arguments[i]);
            return cont(pushlex(end, info), commasep(what, end), poplex);
        }
        function block(type) {
            if (type == "}") return cont();
            return pass(statement, block);
        }
        function maybetype(type, value) {
            if (isTS) {
                if (type == ":") return cont(typeexpr);
                if (value == "?") return cont(maybetype);
            }
        }
        function maybetypeOrIn(type, value) {
            if (isTS && (type == ":" || value == "in")) return cont(typeexpr);
        }
        function mayberettype(type) {
            if (isTS && type == ":") {
                if (cx.stream.match(/^\s*\w+\s+is\b/, false))
                    return cont(expression, isKW, typeexpr);
                else return cont(typeexpr);
            }
        }
        function isKW(_, value) {
            if (value == "is") {
                cx.marked = "keyword";
                return cont();
            }
        }
        function typeexpr(type, value) {
            if (
                value == "keyof" ||
                value == "typeof" ||
                value == "infer" ||
                value == "readonly"
            ) {
                cx.marked = "keyword";
                return cont(value == "typeof" ? expressionNoComma : typeexpr);
            }
            if (type == "variable" || value == "void") {
                cx.marked = "type";
                return cont(afterType);
            }
            if (value == "|" || value == "&") return cont(typeexpr);
            if (type == "string" || type == "number" || type == "atom")
                return cont(afterType);
            if (type == "[")
                return cont(
                    pushlex("]"),
                    commasep(typeexpr, "]", ","),
                    poplex,
                    afterType
                );
            if (type == "{")
                return cont(pushlex("}"), typeprops, poplex, afterType);
            if (type == "(")
                return cont(commasep(typearg, ")"), maybeReturnType, afterType);
            if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr);
            if (type == "quasi") {
                return pass(quasiType, afterType);
            }
        }
        function maybeReturnType(type) {
            if (type == "=>") return cont(typeexpr);
        }
        function typeprops(type) {
            if (type.match(/[\}\)\]]/)) return cont();
            if (type == "," || type == ";") return cont(typeprops);
            return pass(typeprop, typeprops);
        }
        function typeprop(type, value) {
            if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                return cont(typeprop);
            } else if (value == "?" || type == "number" || type == "string") {
                return cont(typeprop);
            } else if (type == ":") {
                return cont(typeexpr);
            } else if (type == "[") {
                return cont(
                    expect("variable"),
                    maybetypeOrIn,
                    expect("]"),
                    typeprop
                );
            } else if (type == "(") {
                return pass(functiondecl, typeprop);
            } else if (!type.match(/[;\}\)\],]/)) {
                return cont();
            }
        }
        function quasiType(type, value) {
            if (type != "quasi") return pass();
            if (value.slice(value.length - 2) != "${") return cont(quasiType);
            return cont(typeexpr, continueQuasiType);
        }
        function continueQuasiType(type) {
            if (type == "}") {
                cx.marked = "string-2";
                cx.state.tokenize = tokenQuasi;
                return cont(quasiType);
            }
        }
        function typearg(type, value) {
            if (
                (type == "variable" && cx.stream.match(/^\s*[?:]/, false)) ||
                value == "?"
            )
                return cont(typearg);
            if (type == ":") return cont(typeexpr);
            if (type == "spread") return cont(typearg);
            return pass(typeexpr);
        }
        function afterType(type, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeexpr, ">"),
                    poplex,
                    afterType
                );
            if (value == "|" || type == "." || value == "&")
                return cont(typeexpr);
            if (type == "[") return cont(typeexpr, expect("]"), afterType);
            if (value == "extends" || value == "implements") {
                cx.marked = "keyword";
                return cont(typeexpr);
            }
            if (value == "?") return cont(typeexpr, expect(":"), typeexpr);
        }
        function maybeTypeArgs(_, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeexpr, ">"),
                    poplex,
                    afterType
                );
        }
        function typeparam() {
            return pass(typeexpr, maybeTypeDefault);
        }
        function maybeTypeDefault(_, value) {
            if (value == "=") return cont(typeexpr);
        }
        function vardef(_, value) {
            if (value == "enum") {
                cx.marked = "keyword";
                return cont(enumdef);
            }
            return pass(pattern, maybetype, maybeAssign, vardefCont);
        }
        function pattern(type, value) {
            if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(pattern);
            }
            if (type == "variable") {
                register(value);
                return cont();
            }
            if (type == "spread") return cont(pattern);
            if (type == "[") return contCommasep(eltpattern, "]");
            if (type == "{") return contCommasep(proppattern, "}");
        }
        function proppattern(type, value) {
            if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
                register(value);
                return cont(maybeAssign);
            }
            if (type == "variable") cx.marked = "property";
            if (type == "spread") return cont(pattern);
            if (type == "}") return pass();
            if (type == "[")
                return cont(expression, expect("]"), expect(":"), proppattern);
            return cont(expect(":"), pattern, maybeAssign);
        }
        function eltpattern() {
            return pass(pattern, maybeAssign);
        }
        function maybeAssign(_type, value) {
            if (value == "=") return cont(expressionNoComma);
        }
        function vardefCont(type) {
            if (type == ",") return cont(vardef);
        }
        function maybeelse(type, value) {
            if (type == "keyword b" && value == "else")
                return cont(pushlex("form", "else"), statement, poplex);
        }
        function forspec(type, value) {
            if (value == "await") return cont(forspec);
            if (type == "(") return cont(pushlex(")"), forspec1, poplex);
        }
        function forspec1(type) {
            if (type == "var") return cont(vardef, forspec2);
            if (type == "variable") return cont(forspec2);
            return pass(forspec2);
        }
        function forspec2(type, value) {
            if (type == ")") return cont();
            if (type == ";") return cont(forspec2);
            if (value == "in" || value == "of") {
                cx.marked = "keyword";
                return cont(expression, forspec2);
            }
            return pass(expression, forspec2);
        }
        function functiondef(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(functiondef);
            }
            if (type == "variable") {
                register(value);
                return cont(functiondef);
            }
            if (type == "(")
                return cont(
                    pushcontext,
                    pushlex(")"),
                    commasep(funarg, ")"),
                    poplex,
                    mayberettype,
                    statement,
                    popcontext
                );
            if (isTS && value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    functiondef
                );
        }
        function functiondecl(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(functiondecl);
            }
            if (type == "variable") {
                register(value);
                return cont(functiondecl);
            }
            if (type == "(")
                return cont(
                    pushcontext,
                    pushlex(")"),
                    commasep(funarg, ")"),
                    poplex,
                    mayberettype,
                    popcontext
                );
            if (isTS && value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    functiondecl
                );
        }
        function typename(type, value) {
            if (type == "keyword" || type == "variable") {
                cx.marked = "type";
                return cont(typename);
            } else if (value == "<") {
                return cont(pushlex(">"), commasep(typeparam, ">"), poplex);
            }
        }
        function funarg(type, value) {
            if (value == "@") cont(expression, funarg);
            if (type == "spread") return cont(funarg);
            if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(funarg);
            }
            if (isTS && type == "this") return cont(maybetype, maybeAssign);
            return pass(pattern, maybetype, maybeAssign);
        }
        function classExpression(type, value) {
            // Class expressions may have an optional name.
            if (type == "variable") return className(type, value);
            return classNameAfter(type, value);
        }
        function className(type, value) {
            if (type == "variable") {
                register(value);
                return cont(classNameAfter);
            }
        }
        function classNameAfter(type, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    classNameAfter
                );
            if (
                value == "extends" ||
                value == "implements" ||
                (isTS && type == ",")
            ) {
                if (value == "implements") cx.marked = "keyword";
                return cont(isTS ? typeexpr : expression, classNameAfter);
            }
            if (type == "{") return cont(pushlex("}"), classBody, poplex);
        }
        function classBody(type, value) {
            if (
                type == "async" ||
                (type == "variable" &&
                    (value == "static" ||
                        value == "get" ||
                        value == "set" ||
                        (isTS && isModifier(value))) &&
                    cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))
            ) {
                cx.marked = "keyword";
                return cont(classBody);
            }
            if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                return cont(classfield, classBody);
            }
            if (type == "number" || type == "string")
                return cont(classfield, classBody);
            if (type == "[")
                return cont(
                    expression,
                    maybetype,
                    expect("]"),
                    classfield,
                    classBody
                );
            if (value == "*") {
                cx.marked = "keyword";
                return cont(classBody);
            }
            if (isTS && type == "(") return pass(functiondecl, classBody);
            if (type == ";" || type == ",") return cont(classBody);
            if (type == "}") return cont();
            if (value == "@") return cont(expression, classBody);
        }
        function classfield(type, value) {
            if (value == "!") return cont(classfield);
            if (value == "?") return cont(classfield);
            if (type == ":") return cont(typeexpr, maybeAssign);
            if (value == "=") return cont(expressionNoComma);
            var context = cx.state.lexical.prev,
                isInterface = context && context.info == "interface";
            return pass(isInterface ? functiondecl : functiondef);
        }
        function afterExport(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(maybeFrom, expect(";"));
            }
            if (value == "default") {
                cx.marked = "keyword";
                return cont(expression, expect(";"));
            }
            if (type == "{")
                return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
            return pass(statement);
        }
        function exportField(type, value) {
            if (value == "as") {
                cx.marked = "keyword";
                return cont(expect("variable"));
            }
            if (type == "variable") return pass(expressionNoComma, exportField);
        }
        function afterImport(type) {
            if (type == "string") return cont();
            if (type == "(") return pass(expression);
            if (type == ".") return pass(maybeoperatorComma);
            return pass(importSpec, maybeMoreImports, maybeFrom);
        }
        function importSpec(type, value) {
            if (type == "{") return contCommasep(importSpec, "}");
            if (type == "variable") register(value);
            if (value == "*") cx.marked = "keyword";
            return cont(maybeAs);
        }
        function maybeMoreImports(type) {
            if (type == ",") return cont(importSpec, maybeMoreImports);
        }
        function maybeAs(_type, value) {
            if (value == "as") {
                cx.marked = "keyword";
                return cont(importSpec);
            }
        }
        function maybeFrom(_type, value) {
            if (value == "from") {
                cx.marked = "keyword";
                return cont(expression);
            }
        }
        function arrayLiteral(type) {
            if (type == "]") return cont();
            return pass(commasep(expressionNoComma, "]"));
        }
        function enumdef() {
            return pass(
                pushlex("form"),
                pattern,
                expect("{"),
                pushlex("}"),
                commasep(enummember, "}"),
                poplex,
                poplex
            );
        }
        function enummember() {
            return pass(pattern, maybeAssign);
        }

        function isContinuedStatement(state, textAfter) {
            return (
                state.lastType == "operator" ||
                state.lastType == "," ||
                isOperatorChar.test(textAfter.charAt(0)) ||
                /[,.]/.test(textAfter.charAt(0))
            );
        }

        function expressionAllowed(stream, state, backUp) {
            return (
                (state.tokenize == tokenBase &&
                    /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(
                        state.lastType
                    )) ||
                (state.lastType == "quasi" &&
                    /\{\s*$/.test(
                        stream.string.slice(0, stream.pos - (backUp || 0))
                    ))
            );
        }

        // Interface

        return {
            startState: function (basecolumn) {
                var state = {
                    tokenize: tokenBase,
                    lastType: "sof",
                    cc: [],
                    lexical: new JSLexical(
                        (basecolumn || 0) - indentUnit,
                        0,
                        "block",
                        false
                    ),
                    localVars: parserConfig.localVars,
                    context:
                        parserConfig.localVars &&
                        new Context(null, null, false),
                    indented: basecolumn || 0,
                };
                if (
                    parserConfig.globalVars &&
                    typeof parserConfig.globalVars == "object"
                )
                    state.globalVars = parserConfig.globalVars;
                return state;
            },

            token: function (stream, state) {
                if (stream.sol()) {
                    if (!state.lexical.hasOwnProperty("align"))
                        state.lexical.align = false;
                    state.indented = stream.indentation();
                    findFatArrow(stream, state);
                }
                if (state.tokenize != tokenComment && stream.eatSpace())
                    return null;
                var style = state.tokenize(stream, state);
                if (type == "comment") return style;
                state.lastType =
                    type == "operator" && (content == "++" || content == "--")
                        ? "incdec"
                        : type;
                return parseJS(state, style, type, content, stream);
            },

            indent: function (state, textAfter) {
                if (
                    state.tokenize == tokenComment ||
                    state.tokenize == tokenQuasi
                )
                    return CodeMirror.Pass;
                if (state.tokenize != tokenBase) return 0;
                var firstChar = textAfter && textAfter.charAt(0),
                    lexical = state.lexical,
                    top;
                // Kludge to prevent 'maybelse' from blocking lexical scope pops
                if (!/^\s*else\b/.test(textAfter))
                    for (var i = state.cc.length - 1; i >= 0; --i) {
                        var c = state.cc[i];
                        if (c == poplex) lexical = lexical.prev;
                        else if (c != maybeelse && c != popcontext) break;
                    }
                while (
                    (lexical.type == "stat" || lexical.type == "form") &&
                    (firstChar == "}" ||
                        ((top = state.cc[state.cc.length - 1]) &&
                            (top == maybeoperatorComma ||
                                top == maybeoperatorNoComma) &&
                            !/^[,\.=+\-*:?[\(]/.test(textAfter)))
                )
                    lexical = lexical.prev;
                if (
                    statementIndent &&
                    lexical.type == ")" &&
                    lexical.prev.type == "stat"
                )
                    lexical = lexical.prev;
                var type = lexical.type,
                    closing = firstChar == type;

                if (type == "vardef")
                    return (
                        lexical.indented +
                        (state.lastType == "operator" || state.lastType == ","
                            ? lexical.info.length + 1
                            : 0)
                    );
                else if (type == "form" && firstChar == "{")
                    return lexical.indented;
                else if (type == "form") return lexical.indented + indentUnit;
                else if (type == "stat")
                    return (
                        lexical.indented +
                        (isContinuedStatement(state, textAfter)
                            ? statementIndent || indentUnit
                            : 0)
                    );
                else if (
                    lexical.info == "switch" &&
                    !closing &&
                    parserConfig.doubleIndentSwitch != false
                )
                    return (
                        lexical.indented +
                        (/^(?:case|default)\b/.test(textAfter)
                            ? indentUnit
                            : 2 * indentUnit)
                    );
                else if (lexical.align)
                    return lexical.column + (closing ? 0 : 1);
                else return lexical.indented + (closing ? 0 : indentUnit);
            },

            electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
            blockCommentStart: jsonMode ? null : "/*",
            blockCommentEnd: jsonMode ? null : "*/",
            blockCommentContinue: jsonMode ? null : " * ",
            lineComment: jsonMode ? null : "//",
            fold: "brace",
            closeBrackets: "()[]{}''\"\"``",

            helperType: jsonMode ? "json" : "javascript",
            jsonldMode: jsonldMode,
            jsonMode: jsonMode,

            expressionAllowed: expressionAllowed,

            skipExpression: function (state) {
                parseJS(
                    state,
                    "atom",
                    "atom",
                    "true",
                    new CodeMirror.StringStream("", 2, null)
                );
            },
        };
    });

    CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

    CodeMirror.defineMIME("text/javascript", "javascript");
    CodeMirror.defineMIME("text/ecmascript", "javascript");
    CodeMirror.defineMIME("application/javascript", "javascript");
    CodeMirror.defineMIME("application/x-javascript", "javascript");
    CodeMirror.defineMIME("application/ecmascript", "javascript");
    CodeMirror.defineMIME("application/json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/x-json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/manifest+json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/ld+json", {
        name: "javascript",
        jsonld: true,
    });
    CodeMirror.defineMIME("text/typescript", {
        name: "javascript",
        typescript: true,
    });
    CodeMirror.defineMIME("application/typescript", {
        name: "javascript",
        typescript: true,
    });
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.

(function (mod) {
    mod(window.CodeMirror);
})(function (CodeMirror) {

    CodeMirror.customOverlayMode = function (base, overlay, combine) {
        return {
            startState: function () {
                return {
                    base: CodeMirror.startState(base),
                    overlay: CodeMirror.startState(overlay),
                    basePos: 0,
                    baseCur: null,
                    overlayPos: 0,
                    overlayCur: null,
                    streamSeen: null,
                };
            },
            copyState: function (state) {
                return {
                    base: CodeMirror.copyState(base, state.base),
                    overlay: CodeMirror.copyState(overlay, state.overlay),
                    basePos: state.basePos,
                    baseCur: null,
                    overlayPos: state.overlayPos,
                    overlayCur: null,
                };
            },

            token: function (stream, state) {
                if (
                    stream != state.streamSeen ||
                    Math.min(state.basePos, state.overlayPos) < stream.start
                ) {
                    state.streamSeen = stream;
                    state.basePos = state.overlayPos = stream.start;
                }

                if (stream.start == state.basePos) {
                    state.baseCur = base.token(stream, state.base);
                    state.basePos = stream.pos;
                }
                if (stream.start == state.overlayPos) {
                    stream.pos = stream.start;
                    state.overlayCur = overlay.token(stream, state.overlay);
                    state.overlayPos = stream.pos;
                }
                stream.pos = Math.min(state.basePos, state.overlayPos);

                // Edge case for codeblocks in templater mode
                if (
                    state.baseCur &&
                    state.overlayCur &&
                    state.baseCur.contains("line-HyperMD-codeblock")
                ) {
                    state.overlayCur = state.overlayCur.replace(
                        "line-templater-inline",
                        ""
                    );
                    state.overlayCur += ` line-background-HyperMD-codeblock-bg`;
                }

                // state.overlay.combineTokens always takes precedence over combine,
                // unless set to null
                if (state.overlayCur == null) return state.baseCur;
                else if (
                    (state.baseCur != null && state.overlay.combineTokens) ||
                    (combine && state.overlay.combineTokens == null)
                )
                    return state.baseCur + " " + state.overlayCur;
                else return state.overlayCur;
            },

            indent:
                base.indent &&
                function (state, textAfter, line) {
                    return base.indent(state.base, textAfter, line);
                },
            electricChars: base.electricChars,

            innerMode: function (state) {
                return { state: state.base, mode: base };
            },

            blankLine: function (state) {
                var baseToken, overlayToken;
                if (base.blankLine) baseToken = base.blankLine(state.base);
                if (overlay.blankLine)
                    overlayToken = overlay.blankLine(state.overlay);

                return overlayToken == null
                    ? baseToken
                    : combine && baseToken != null
                    ? baseToken + " " + overlayToken
                    : overlayToken;
            },
        };
    };
});

//import "editor/mode/show-hint";
const TP_CMD_TOKEN_CLASS = "templater-command";
const TP_INLINE_CLASS = "templater-inline";
const TP_OPENING_TAG_TOKEN_CLASS = "templater-opening-tag";
const TP_CLOSING_TAG_TOKEN_CLASS = "templater-closing-tag";
const TP_INTERPOLATION_TAG_TOKEN_CLASS = "templater-interpolation-tag";
const TP_RAW_TAG_TOKEN_CLASS = "templater-raw-tag";
const TP_EXEC_TAG_TOKEN_CLASS = "templater-execution-tag";
class Editor {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.cursor_jumper = new CursorJumper(this.app);
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registerCodeMirrorMode();
            //await this.registerHinter();
        });
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cursor_jumper.jump_to_next_cursor_location();
        });
    }
    registerCodeMirrorMode() {
        return __awaiter(this, void 0, void 0, function* () {
            // cm-editor-syntax-highlight-obsidian plugin
            // https://codemirror.net/doc/manual.html#modeapi
            // https://codemirror.net/mode/diff/diff.js
            // https://codemirror.net/demo/mustache.html
            // https://marijnhaverbeke.nl/blog/codemirror-mode-system.html
            if (!this.plugin.settings.syntax_highlighting) {
                return;
            }
            // TODO: Add mobile support
            if (obsidian_module.Platform.isMobileApp) {
                return;
            }
            const js_mode = window.CodeMirror.getMode({}, "javascript");
            if (js_mode.name === "null") {
                log_error(new TemplaterError("Javascript syntax mode couldn't be found, can't enable syntax highlighting."));
                return;
            }
            // Custom overlay mode used to handle edge cases
            // @ts-ignore
            const overlay_mode = window.CodeMirror.customOverlayMode;
            if (overlay_mode == null) {
                log_error(new TemplaterError("Couldn't find customOverlayMode, can't enable syntax highlighting."));
                return;
            }
            window.CodeMirror.defineMode("templater", function (config) {
                const templaterOverlay = {
                    startState: function () {
                        const js_state = window.CodeMirror.startState(js_mode);
                        return Object.assign(Object.assign({}, js_state), { inCommand: false, tag_class: "", freeLine: false });
                    },
                    copyState: function (state) {
                        const js_state = window.CodeMirror.startState(js_mode);
                        const new_state = Object.assign(Object.assign({}, js_state), { inCommand: state.inCommand, tag_class: state.tag_class, freeLine: state.freeLine });
                        return new_state;
                    },
                    blankLine: function (state) {
                        if (state.inCommand) {
                            return `line-background-templater-command-bg`;
                        }
                        return null;
                    },
                    token: function (stream, state) {
                        if (stream.sol() && state.inCommand) {
                            state.freeLine = true;
                        }
                        if (state.inCommand) {
                            let keywords = "";
                            if (stream.match(/[-_]{0,1}%>/, true)) {
                                state.inCommand = false;
                                state.freeLine = false;
                                const tag_class = state.tag_class;
                                state.tag_class = "";
                                return `line-${TP_INLINE_CLASS} ${TP_CMD_TOKEN_CLASS} ${TP_CLOSING_TAG_TOKEN_CLASS} ${tag_class}`;
                            }
                            const js_result = js_mode.token(stream, state);
                            if (stream.peek() == null && state.freeLine) {
                                keywords += ` line-background-templater-command-bg`;
                            }
                            if (!state.freeLine) {
                                keywords += ` line-${TP_INLINE_CLASS}`;
                            }
                            return `${keywords} ${TP_CMD_TOKEN_CLASS} ${js_result}`;
                        }
                        const match = stream.match(/<%[-_]{0,1}\s*([*~+]{0,1})/, true);
                        if (match != null) {
                            switch (match[1]) {
                                case "*":
                                    state.tag_class = TP_EXEC_TAG_TOKEN_CLASS;
                                    break;
                                case "~":
                                    state.tag_class = TP_RAW_TAG_TOKEN_CLASS;
                                    break;
                                default:
                                    state.tag_class =
                                        TP_INTERPOLATION_TAG_TOKEN_CLASS;
                                    break;
                            }
                            state.inCommand = true;
                            return `line-${TP_INLINE_CLASS} ${TP_CMD_TOKEN_CLASS} ${TP_OPENING_TAG_TOKEN_CLASS} ${state.tag_class}`;
                        }
                        while (stream.next() != null && !stream.match(/<%/, false))
                            ;
                        return null;
                    },
                };
                return overlay_mode(window.CodeMirror.getMode(config, "hypermd"), templaterOverlay);
            });
        });
    }
    registerHinter() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
            /*
            await delay(1000);
    
            var comp = [
                ["here", "hither"],
                ["asynchronous", "nonsynchronous"],
                ["completion", "achievement", "conclusion", "culmination", "expirations"],
                ["hinting", "advise", "broach", "imply"],
                ["function","action"],
                ["provide", "add", "bring", "give"],
                ["synonyms", "equivalents"],
                ["words", "token"],
                ["each", "every"],
            ];
        
            function synonyms(cm: any, option: any) {
                return new Promise(function(accept) {
                    setTimeout(function() {
                        var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
                        var start = cursor.ch, end = cursor.ch
                        while (start && /\w/.test(line.charAt(start - 1))) --start
                        while (end < line.length && /\w/.test(line.charAt(end))) ++end
                        var word = line.slice(start, end).toLowerCase()
                        for (var i = 0; i < comp.length; i++) {
                            if (comp[i].indexOf(word) != -1) {
                                return accept({
                                    list: comp[i],
                                    from: window.CodeMirror.Pos(cursor.line, start),
                                    to: window.CodeMirror.Pos(cursor.line, end)
                                });
                            }
                        }
                        return accept(null);
                    }, 100)
                });
            }
    
            this.app.workspace.on("codemirror", cm => {
                cm.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
                cm.setOption("hintOptions", {hint: synonyms});
            });
    
            this.app.workspace.iterateCodeMirrors(cm => {
                console.log("CM:", cm);
                cm.setOption("extraKeys", {"Space": "autocomplete"});
                cm.setOption("hintOptions", {hint: synonyms});
            });
            */
        });
    }
}

function setPrototypeOf(obj, proto) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
// This is pretty much the only way to get nice, extended Errors
// without using ES6
/**
 * This returns a new Error with a custom prototype. Note that it's _not_ a constructor
 *
 * @param message Error message
 *
 * **Example**
 *
 * ```js
 * throw EtaErr("template not found")
 * ```
 */
function EtaErr(message) {
    var err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Eta Error', enumerable: false }
});
/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */
function ParseErr(message, str, indx) {
    var whitespace = str.slice(0, indx).split(/\n/);
    var lineNo = whitespace.length;
    var colNo = whitespace[lineNo - 1].length + 1;
    message +=
        ' at line ' +
            lineNo +
            ' col ' +
            colNo +
            ':\n\n' +
            '  ' +
            str.split(/\n/)[lineNo - 1] +
            '\n' +
            '  ' +
            Array(colNo).join(' ') +
            '^';
    throw EtaErr(message);
}

/**
 * @returns The global Promise function
 */
var promiseImpl = new Function('return this')().Promise;
/**
 * @returns A new AsyncFunction constuctor
 */
function getAsyncFunctionConstructor() {
    try {
        return new Function('return (async function(){}).constructor')();
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr("This environment doesn't support async/await");
        }
        else {
            throw e;
        }
    }
}
/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */
function trimLeft(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimLeft) {
        return str.trimLeft();
    }
    else {
        return str.replace(/^\s+/, '');
    }
}
/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */
function trimRight(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimRight) {
        return str.trimRight();
    }
    else {
        return str.replace(/\s+$/, ''); // TODO: do we really need to replace BOM's?
    }
}

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
/* END TYPES */
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj) {
    for (var key in fromObj) {
        if (hasOwnProp(fromObj, key)) {
            toObj[key] = fromObj[key];
        }
    }
    return toObj;
}
/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */
function trimWS(str, config, wsLeft, wsRight) {
    var leftTrim;
    var rightTrim;
    if (Array.isArray(config.autoTrim)) {
        // kinda confusing
        // but _}} will trim the left side of the following string
        leftTrim = config.autoTrim[1];
        rightTrim = config.autoTrim[0];
    }
    else {
        leftTrim = rightTrim = config.autoTrim;
    }
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (!rightTrim && !leftTrim) {
        return str;
    }
    if (leftTrim === 'slurp' && rightTrim === 'slurp') {
        return str.trim();
    }
    if (leftTrim === '_' || leftTrim === 'slurp') {
        // console.log('trimming left' + leftTrim)
        // full slurp
        str = trimLeft(str);
    }
    else if (leftTrim === '-' || leftTrim === 'nl') {
        // nl trim
        str = str.replace(/^(?:\r\n|\n|\r)/, '');
    }
    if (rightTrim === '_' || rightTrim === 'slurp') {
        // full slurp
        str = trimRight(str);
    }
    else if (rightTrim === '-' || rightTrim === 'nl') {
        // nl trim
        str = str.replace(/(?:\r\n|\n|\r)$/, ''); // TODO: make sure this gets \r\n
    }
    return str;
}
/**
 * A map of special HTML characters to their XML-escaped equivalents
 */
var escMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
function replaceChar(s) {
    return escMap[s];
}
/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */
function XMLEscape(str) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    var newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}

/* END TYPES */
var templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
/** Escape special regular expression characters inside a string */
function escapeRegExp(string) {
    // From MDN
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function parse(str, config) {
    var buffer = [];
    var trimLeftOfNextStr = false;
    var lastIndex = 0;
    var parseOptions = config.parse;
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processTemplate) {
                str = plugin.processTemplate(str, config);
            }
        }
    }
    /* Adding for EJS compatibility */
    if (config.rmWhitespace) {
        // Code taken directly from EJS
        // Have to use two separate replaces here as `^` and `$` operators don't
        // work well with `\r` and empty lines don't work well with the `m` flag.
        // Essentially, this replaces the whitespace at the beginning and end of
        // each line and removes multiple newlines.
        str = str.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }
    /* End rmWhitespace option */
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            // if string is truthy it must be of type 'string'
            strng = trimWS(strng, config, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
            shouldTrimRightOfString);
            if (strng) {
                // replace \ with \\, ' with \'
                // we're going to convert all CRLF to LF so it doesn't take more than one replace
                strng = strng.replace(/\\|'/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n');
                buffer.push(strng);
            }
        }
    }
    var prefixes = [parseOptions.exec, parseOptions.interpolate, parseOptions.raw].reduce(function (accumulator, prefix) {
        if (accumulator && prefix) {
            return accumulator + '|' + escapeRegExp(prefix);
        }
        else if (prefix) {
            // accumulator is falsy
            return escapeRegExp(prefix);
        }
        else {
            // prefix and accumulator are both falsy
            return accumulator;
        }
    }, '');
    var parseOpenReg = new RegExp('([^]*?)' + escapeRegExp(config.tags[0]) + '(-|_)?\\s*(' + prefixes + ')?\\s*(?![\\s+\\-_' + prefixes + '])', 'g');
    var parseCloseReg = new RegExp('\'|"|`|\\/\\*|(\\s*(-|_)?' + escapeRegExp(config.tags[1]) + ')', 'g');
    // TODO: benchmark having the \s* on either side vs using str.trim()
    var m;
    while ((m = parseOpenReg.exec(str))) {
        lastIndex = m[0].length + m.index;
        var precedingString = m[1];
        var wsLeft = m[2];
        var prefix = m[3] || ''; // by default either ~, =, or empty
        pushString(precedingString, wsLeft);
        parseCloseReg.lastIndex = lastIndex;
        var closeTag = void 0;
        var currentObj = false;
        while ((closeTag = parseCloseReg.exec(str))) {
            if (closeTag[1]) {
                var content = str.slice(lastIndex, closeTag.index);
                parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                trimLeftOfNextStr = closeTag[2];
                var currentType = prefix === parseOptions.exec
                    ? 'e'
                    : prefix === parseOptions.raw
                        ? 'r'
                        : prefix === parseOptions.interpolate
                            ? 'i'
                            : '';
                currentObj = { t: currentType, val: content };
                break;
            }
            else {
                var char = closeTag[0];
                if (char === '/*') {
                    var commentCloseInd = str.indexOf('*/', parseCloseReg.lastIndex);
                    if (commentCloseInd === -1) {
                        ParseErr('unclosed comment', str, closeTag.index);
                    }
                    parseCloseReg.lastIndex = commentCloseInd;
                }
                else if (char === "'") {
                    singleQuoteReg.lastIndex = closeTag.index;
                    var singleQuoteMatch = singleQuoteReg.exec(str);
                    if (singleQuoteMatch) {
                        parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '"') {
                    doubleQuoteReg.lastIndex = closeTag.index;
                    var doubleQuoteMatch = doubleQuoteReg.exec(str);
                    if (doubleQuoteMatch) {
                        parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '`') {
                    templateLitReg.lastIndex = closeTag.index;
                    var templateLitMatch = templateLitReg.exec(str);
                    if (templateLitMatch) {
                        parseCloseReg.lastIndex = templateLitReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
            }
        }
        if (currentObj) {
            buffer.push(currentObj);
        }
        else {
            ParseErr('unclosed tag', str, m.index + precedingString.length);
        }
    }
    pushString(str.slice(lastIndex, str.length), false);
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processAST) {
                buffer = plugin.processAST(buffer, config);
            }
        }
    }
    return buffer;
}

/* END TYPES */
/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */
function compileToString(str, config) {
    var buffer = parse(str, config);
    var res = "var tR='',__l,__lP" +
        (config.include ? ',include=E.include.bind(E)' : '') +
        (config.includeFile ? ',includeFile=E.includeFile.bind(E)' : '') +
        '\nfunction layout(p,d){__l=p;__lP=d}\n' +
        (config.globalAwait ? 'const _prs = [];\n' : '') +
        (config.useWith ? 'with(' + config.varName + '||{}){' : '') +
        compileScope(buffer, config) +
        (config.includeFile
            ? 'if(__l)tR=' +
                (config.async ? 'await ' : '') +
                ("includeFile(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
            : config.include
                ? 'if(__l)tR=' +
                    (config.async ? 'await ' : '') +
                    ("include(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
                : '') +
        'if(cb){cb(null,tR)} return tR' +
        (config.useWith ? '}' : '');
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processFnString) {
                res = plugin.processFnString(res, config);
            }
        }
    }
    return res;
}
/**
 * Loops through the AST generated by `parse` and transform each item into JS calls
 *
 * **Example**
 *
 * ```js
 * // AST version of 'Hi <%= it.user %>'
 * let templateAST = ['Hi ', { val: 'it.user', t: 'i' }]
 * compileScope(templateAST, eta.config)
 * // "tR+='Hi ';tR+=E.e(it.user);"
 * ```
 */
function compileScope(buff, config) {
    var i;
    var buffLength = buff.length;
    var returnStr = '';
    var REPLACEMENT_STR = "rJ2KqXzxQg";
    for (i = 0; i < buffLength; i++) {
        var currentBlock = buff[i];
        if (typeof currentBlock === 'string') {
            var str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str + "'\n";
        }
        else {
            var type = currentBlock.t; // ~, s, !, ?, r
            var content = currentBlock.val || '';
            if (type === 'r') {
                // raw
                if (config.globalAwait) {
                    returnStr += "_prs.push(" + content + ");\n";
                    returnStr += "tR+='" + REPLACEMENT_STR + "'\n";
                }
                else {
                    if (config.filter) {
                        content = 'E.filter(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                }
            }
            else if (type === 'i') {
                // interpolate
                if (config.globalAwait) {
                    returnStr += "_prs.push(" + content + ");\n";
                    returnStr += "tR+='" + REPLACEMENT_STR + "'\n";
                }
                else {
                    if (config.filter) {
                        content = 'E.filter(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                    if (config.autoEscape) {
                        content = 'E.e(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                }
            }
            else if (type === 'e') {
                // execute
                returnStr += content + '\n'; // you need a \n in case you have <% } %>
            }
        }
    }
    if (config.globalAwait) {
        returnStr += "const _rst = await Promise.all(_prs);\ntR = tR.replace(/" + REPLACEMENT_STR + "/g, () => _rst.shift());\n";
    }
    return returnStr;
}

/**
 * Handles storage and accessing of values
 *
 * In this case, we use it to store compiled template functions
 * Indexed by their `name` or `filename`
 */
var Cacher = /** @class */ (function () {
    function Cacher(cache) {
        this.cache = cache;
    }
    Cacher.prototype.define = function (key, val) {
        this.cache[key] = val;
    };
    Cacher.prototype.get = function (key) {
        // string | array.
        // TODO: allow array of keys to look down
        // TODO: create plugin to allow referencing helpers, filters with dot notation
        return this.cache[key];
    };
    Cacher.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Cacher.prototype.reset = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        copyProps(this.cache, cacheObj);
    };
    return Cacher;
}());

/* END TYPES */
/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */
var templates = new Cacher({});

/* END TYPES */
/**
 * Include a template based on its name (or filepath, if it's already been cached).
 *
 * Called like `include(templateNameOrPath, data)`
 */
function includeHelper(templateNameOrPath, data) {
    var template = this.templates.get(templateNameOrPath);
    if (!template) {
        throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
    }
    return template(data, this);
}
/** Eta's base (global) configuration */
var config = {
    async: false,
    autoEscape: true,
    autoTrim: [false, 'nl'],
    cache: false,
    e: XMLEscape,
    include: includeHelper,
    parse: {
        exec: '',
        interpolate: '=',
        raw: '~'
    },
    plugins: [],
    rmWhitespace: false,
    tags: ['<%', '%>'],
    templates: templates,
    useWith: false,
    varName: 'it'
};
/**
 * Takes one or two partial (not necessarily complete) configuration objects, merges them 1 layer deep into eta.config, and returns the result
 *
 * @param override Partial configuration object
 * @param baseConfig Partial configuration object to merge before `override`
 *
 * **Example**
 *
 * ```js
 * let customConfig = getConfig({tags: ['!#', '#!']})
 * ```
 */
function getConfig(override, baseConfig) {
    // TODO: run more tests on this
    var res = {}; // Linked
    copyProps(res, config); // Creates deep clone of eta.config, 1 layer deep
    if (baseConfig) {
        copyProps(res, baseConfig);
    }
    if (override) {
        copyProps(res, override);
    }
    return res;
}

/* END TYPES */
/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 *
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */
function compile(str, config) {
    var options = getConfig(config || {});
    /* ASYNC HANDLING */
    // The below code is modified from mde/ejs. All credit should go to them.
    var ctor = options.async ? getAsyncFunctionConstructor() : Function;
    /* END ASYNC HANDLING */
    try {
        return new ctor(options.varName, 'E', // EtaConfig
        'cb', // optional callback
        compileToString(str, options)); // eslint-disable-line no-new-func
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr('Bad template syntax\n\n' +
                e.message +
                '\n' +
                Array(e.message.length + 1).join('=') +
                '\n' +
                compileToString(str, options) +
                '\n' // This will put an extra newline before the callstack for extra readability
            );
        }
        else {
            throw e;
        }
    }
}

var _BOM = /^\uFEFF/;
/* END TYPES */
/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * If `name` does not have an extension, it will default to `.eta`
 *
 * @param name specified path
 * @param parentfile parent file path
 * @param isDirectory whether parentfile is a directory
 * @return absolute path to template
 */
function getWholeFilePath(name, parentfile, isDirectory) {
    var includePath = path__namespace.resolve(isDirectory ? parentfile : path__namespace.dirname(parentfile), // returns directory the parent file is in
    name // file
    ) + (path__namespace.extname(name) ? '' : '.eta');
    return includePath;
}
/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\')
 * then Eta will attempt to resolve the absolute path within options.views. If it cannot,
 * Eta will fallback to options.root or '/'
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * Note: if Eta is unable to find a template using path and options, it will throw an error.
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */
function getPath(path, options) {
    var includePath = false;
    var views = options.views;
    var searchedPaths = [];
    // If these four values are the same,
    // getPath() will return the same result every time.
    // We can cache the result to avoid expensive
    // file operations.
    var pathOptions = JSON.stringify({
        filename: options.filename,
        path: path,
        root: options.root,
        views: options.views
    });
    if (options.cache && options.filepathCache && options.filepathCache[pathOptions]) {
        // Use the cached filepath
        return options.filepathCache[pathOptions];
    }
    /** Add a filepath to the list of paths we've checked for a template */
    function addPathToSearched(pathSearched) {
        if (!searchedPaths.includes(pathSearched)) {
            searchedPaths.push(pathSearched);
        }
    }
    /**
     * Take a filepath (like 'partials/mypartial.eta'). Attempt to find the template file inside `views`;
     * return the resulting template file path, or `false` to indicate that the template was not found.
     *
     * @param views the filepath that holds templates, or an array of filepaths that hold templates
     * @param path the path to the template
     */
    function searchViews(views, path) {
        var filePath;
        // If views is an array, then loop through each directory
        // And attempt to find the template
        if (Array.isArray(views) &&
            views.some(function (v) {
                filePath = getWholeFilePath(path, v, true);
                addPathToSearched(filePath);
                return fs.existsSync(filePath);
            })) {
            // If the above returned true, we know that the filePath was just set to a path
            // That exists (Array.some() returns as soon as it finds a valid element)
            return filePath;
        }
        else if (typeof views === 'string') {
            // Search for the file if views is a single directory
            filePath = getWholeFilePath(path, views, true);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
        // Unable to find a file
        return false;
    }
    // Path starts with '/', 'C:\', etc.
    var match = /^[A-Za-z]+:\\|^\//.exec(path);
    // Absolute path, like /partials/partial.eta
    if (match && match.length) {
        // We have to trim the beginning '/' off the path, or else
        // path.resolve(dir, path) will always resolve to just path
        var formattedPath = path.replace(/^\/*/, '');
        // First, try to resolve the path within options.views
        includePath = searchViews(views, formattedPath);
        if (!includePath) {
            // If that fails, searchViews will return false. Try to find the path
            // inside options.root (by default '/', the base of the filesystem)
            var pathFromRoot = getWholeFilePath(formattedPath, options.root || '/', true);
            addPathToSearched(pathFromRoot);
            includePath = pathFromRoot;
        }
    }
    else {
        // Relative paths
        // Look relative to a passed filename first
        if (options.filename) {
            var filePath = getWholeFilePath(path, options.filename);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                includePath = filePath;
            }
        }
        // Then look for the template in options.views
        if (!includePath) {
            includePath = searchViews(views, path);
        }
        if (!includePath) {
            throw EtaErr('Could not find the template "' + path + '". Paths tried: ' + searchedPaths);
        }
    }
    // If caching and filepathCache are enabled,
    // cache the input & output of this function.
    if (options.cache && options.filepathCache) {
        options.filepathCache[pathOptions] = includePath;
    }
    return includePath;
}
/**
 * Reads a file synchronously
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath).toString().replace(_BOM, ''); // TODO: is replacing BOM's necessary?
    }
    catch (_a) {
        throw EtaErr("Failed to read template at '" + filePath + "'");
    }
}

// express is set like: app.engine('html', require('eta').renderFile)
/* END TYPES */
/**
 * Reads a template, compiles it into a function, caches it if caching isn't disabled, returns the function
 *
 * @param filePath Absolute path to template file
 * @param options Eta configuration overrides
 * @param noCache Optionally, make Eta not cache the template
 */
function loadFile(filePath, options, noCache) {
    var config = getConfig(options);
    var template = readFile(filePath);
    try {
        var compiledTemplate = compile(template, config);
        if (!noCache) {
            config.templates.define(config.filename, compiledTemplate);
        }
        return compiledTemplate;
    }
    catch (e) {
        throw EtaErr('Loading file: ' + filePath + ' failed:\n\n' + e.message);
    }
}
/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param options   compilation options
 * @return Eta template function
 */
function handleCache$1(options) {
    var filename = options.filename;
    if (options.cache) {
        var func = options.templates.get(filename);
        if (func) {
            return func;
        }
        return loadFile(filename, options);
    }
    // Caching is disabled, so pass noCache = true
    return loadFile(filename, options, true);
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * This returns a template function and the config object with which that template function should be called.
 *
 * @remarks
 *
 * It's important that this returns a config object with `filename` set.
 * Otherwise, the included file would not be able to use relative paths
 *
 * @param path path for the specified file (if relative, specify `views` on `options`)
 * @param options compilation options
 * @return [Eta template function, new config object]
 */
function includeFile(path, options) {
    // the below creates a new options object, using the parent filepath of the old options object and the path
    var newFileOptions = getConfig({ filename: getPath(path, options) }, options);
    // TODO: make sure properties are currectly copied over
    return [handleCache$1(newFileOptions), newFileOptions];
}

/* END TYPES */
/**
 * Called with `includeFile(path, data)`
 */
function includeFileHelper(path, data) {
    var templateAndConfig = includeFile(path, this);
    return templateAndConfig[0](data, templateAndConfig[1]);
}

/* END TYPES */
function handleCache(template, options) {
    if (options.cache && options.name && options.templates.get(options.name)) {
        return options.templates.get(options.name);
    }
    var templateFunc = typeof template === 'function' ? template : compile(template, options);
    // Note that we don't have to check if it already exists in the cache;
    // it would have returned earlier if it had
    if (options.cache && options.name) {
        options.templates.define(options.name, templateFunc);
    }
    return templateFunc;
}
/**
 * Render a template
 *
 * If `template` is a string, Eta will compile it to a function and then call it with the provided data.
 * If `template` is a template function, Eta will call it with the provided data.
 *
 * If `config.async` is `false`, Eta will return the rendered template.
 *
 * If `config.async` is `true` and there's a callback function, Eta will call the callback with `(err, renderedTemplate)`.
 * If `config.async` is `true` and there's not a callback function, Eta will return a Promise that resolves to the rendered template.
 *
 * If `config.cache` is `true` and `config` has a `name` or `filename` property, Eta will cache the template on the first render and use the cached template for all subsequent renders.
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function render(template, data, config, cb) {
    var options = getConfig(config || {});
    if (options.async) {
        if (cb) {
            // If user passes callback
            try {
                // Note: if there is an error while rendering the template,
                // It will bubble up and be caught here
                var templateFn = handleCache(template, options);
                templateFn(data, options, cb);
            }
            catch (err) {
                return cb(err);
            }
        }
        else {
            // No callback, try returning a promise
            if (typeof promiseImpl === 'function') {
                return new promiseImpl(function (resolve, reject) {
                    try {
                        resolve(handleCache(template, options)(data, options));
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            else {
                throw EtaErr("Please provide a callback function, this env doesn't support Promises");
            }
        }
    }
    else {
        return handleCache(template, options)(data, options);
    }
}
/**
 * Render a template asynchronously
 *
 * If `template` is a string, Eta will compile it to a function and call it with the provided data.
 * If `template` is a function, Eta will call it with the provided data.
 *
 * If there is a callback function, Eta will call it with `(err, renderedTemplate)`.
 * If there is not a callback function, Eta will return a Promise that resolves to the rendered template
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function renderAsync(template, data, config, cb) {
    // Using Object.assign to lower bundle size, using spread operator makes it larger because of typescript injected polyfills
    return render(template, data, Object.assign({}, config, { async: true }), cb);
}

// @denoify-ignore
config.includeFile = includeFileHelper;
config.filepathCache = {};

class Parser {
    parse_commands(content, object) {
        return __awaiter(this, void 0, void 0, function* () {
            content = (yield renderAsync(content, object, {
                varName: "tp",
                parse: {
                    exec: "*",
                    interpolate: "~",
                    raw: "",
                },
                autoTrim: false,
                globalAwait: true,
            }));
            return content;
        });
    }
}

var RunMode;
(function (RunMode) {
    RunMode[RunMode["CreateNewFromTemplate"] = 0] = "CreateNewFromTemplate";
    RunMode[RunMode["AppendActiveFile"] = 1] = "AppendActiveFile";
    RunMode[RunMode["OverwriteFile"] = 2] = "OverwriteFile";
    RunMode[RunMode["OverwriteActiveFile"] = 3] = "OverwriteActiveFile";
    RunMode[RunMode["DynamicProcessor"] = 4] = "DynamicProcessor";
    RunMode[RunMode["StartupTemplate"] = 5] = "StartupTemplate";
})(RunMode || (RunMode = {}));
class Templater {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.functions_generator = new FunctionsGenerator(this.app, this.plugin);
        this.editor = new Editor(this.app, this.plugin);
        this.parser = new Parser();
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.editor.setup();
            yield this.functions_generator.init();
            this.plugin.registerMarkdownPostProcessor((el, ctx) => this.process_dynamic_templates(el, ctx));
        });
    }
    create_running_config(template_file, target_file, run_mode) {
        const active_file = this.app.workspace.getActiveFile();
        return {
            template_file: template_file,
            target_file: target_file,
            run_mode: run_mode,
            active_file: active_file,
        };
    }
    read_and_parse_template(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const template_content = yield this.app.vault.read(config.template_file);
            return this.parse_template(config, template_content);
        });
    }
    parse_template(config, template_content) {
        return __awaiter(this, void 0, void 0, function* () {
            const functions_object = yield this.functions_generator.generate_object(config, FunctionsMode.USER_INTERNAL);
            this.current_functions_object = functions_object;
            const content = yield this.parser.parse_commands(template_content, functions_object);
            return content;
        });
    }
    jump_to_next_cursor_location(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.plugin.settings.auto_jump_to_cursor &&
                this.app.workspace.getActiveFile() === file) {
                yield this.editor.jump_to_next_cursor_location();
            }
        });
    }
    create_new_note_from_template(template, folder, filename, open_new_note = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Maybe there is an obsidian API function for that
            if (!folder) {
                // TODO: Fix that
                // @ts-ignore
                const new_file_location = this.app.vault.getConfig("newFileLocation");
                switch (new_file_location) {
                    case "current": {
                        const active_file = this.app.workspace.getActiveFile();
                        if (active_file) {
                            folder = active_file.parent;
                        }
                        break;
                    }
                    case "folder":
                        folder = this.app.fileManager.getNewFileParent("");
                        break;
                    case "root":
                        folder = this.app.vault.getRoot();
                        break;
                }
            }
            // TODO: Change that, not stable atm
            // @ts-ignore
            const created_note = yield this.app.fileManager.createNewMarkdownFile(folder, filename !== null && filename !== void 0 ? filename : "Untitled");
            let running_config;
            let output_content;
            if (template instanceof obsidian_module.TFile) {
                running_config = this.create_running_config(template, created_note, RunMode.CreateNewFromTemplate);
                output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            }
            else {
                running_config = this.create_running_config(undefined, created_note, RunMode.CreateNewFromTemplate);
                output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.parse_template(running_config, template); }), "Template parsing error, aborting.");
            }
            if (output_content == null) {
                yield this.app.vault.delete(created_note);
                return;
            }
            yield this.app.vault.modify(created_note, output_content);
            if (open_new_note) {
                const active_leaf = this.app.workspace.activeLeaf;
                if (!active_leaf) {
                    log_error(new TemplaterError("No active leaf"));
                    return;
                }
                yield active_leaf.openFile(created_note, {
                    state: { mode: "source" },
                    eState: { rename: "all" },
                });
                yield this.jump_to_next_cursor_location(created_note);
            }
            return created_note;
        });
    }
    append_template_to_active_file(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
            if (active_view === null) {
                log_error(new TemplaterError("No active view, can't append templates."));
                return;
            }
            const running_config = this.create_running_config(template_file, active_view.file, RunMode.AppendActiveFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed
            if (output_content == null) {
                return;
            }
            const editor = active_view.editor;
            const doc = editor.getDoc();
            doc.replaceSelection(output_content);
            yield this.jump_to_next_cursor_location(active_view.file);
        });
    }
    write_template_to_file(template_file, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const running_config = this.create_running_config(template_file, file, RunMode.OverwriteFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed
            if (output_content == null) {
                return;
            }
            yield this.app.vault.modify(file, output_content);
            yield this.jump_to_next_cursor_location(file);
        });
    }
    overwrite_active_file_commands() {
        const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
        if (active_view === null) {
            log_error(new TemplaterError("Active view is null, can't overwrite content"));
            return;
        }
        this.overwrite_file_commands(active_view.file, true);
    }
    overwrite_file_commands(file, active_file = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const running_config = this.create_running_config(file, file, active_file ? RunMode.OverwriteActiveFile : RunMode.OverwriteFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed
            if (output_content == null) {
                return;
            }
            yield this.app.vault.modify(file, output_content);
            yield this.jump_to_next_cursor_location(file);
        });
    }
    process_dynamic_templates(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const dynamic_command_regex = /(<%(?:-|_)?\s*[*~]{0,1})\+((?:.|\s)*?%>)/g;
            const walker = document.createNodeIterator(el, NodeFilter.SHOW_TEXT);
            let node;
            let pass = false;
            let functions_object;
            while ((node = walker.nextNode())) {
                let content = node.nodeValue;
                let match;
                if ((match = dynamic_command_regex.exec(content)) != null) {
                    const file = this.app.metadataCache.getFirstLinkpathDest("", ctx.sourcePath);
                    if (!file || !(file instanceof obsidian_module.TFile)) {
                        return;
                    }
                    if (!pass) {
                        pass = true;
                        const config = this.create_running_config(file, file, RunMode.DynamicProcessor);
                        functions_object =
                            yield this.functions_generator.generate_object(config, FunctionsMode.USER_INTERNAL);
                        this.current_functions_object = functions_object;
                    }
                    while (match != null) {
                        // Not the most efficient way to exclude the '+' from the command but I couldn't find something better
                        const complete_command = match[1] + match[2];
                        const command_output = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () {
                            return yield this.parser.parse_commands(complete_command, functions_object);
                        }), `Command Parsing error in dynamic command '${complete_command}'`);
                        if (command_output == null) {
                            return;
                        }
                        const start = dynamic_command_regex.lastIndex - match[0].length;
                        const end = dynamic_command_regex.lastIndex;
                        content =
                            content.substring(0, start) +
                                command_output +
                                content.substring(end);
                        dynamic_command_regex.lastIndex +=
                            command_output.length - match[0].length;
                        match = dynamic_command_regex.exec(content);
                    }
                    node.nodeValue = content;
                }
            }
        });
    }
    get_new_file_template_for_folder(folder) {
        do {
            const match = this.plugin.settings.folder_templates.find((e) => e.folder == folder.path);
            if (match && match.template) {
                return match.template;
            }
            folder = folder.parent;
        } while (folder);
    }
    static on_file_creation(templater, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(file instanceof obsidian_module.TFile) || file.extension !== "md") {
                return;
            }
            // Avoids template replacement when syncing template files
            const template_folder = obsidian_module.normalizePath(templater.plugin.settings.templates_folder);
            if (file.path.includes(template_folder) && template_folder !== "/") {
                return;
            }
            // TODO: find a better way to do this
            // Currently, I have to wait for the daily note plugin to add the file content before replacing
            // Not a problem with Calendar however since it creates the file with the existing content
            yield delay(300);
            if (file.stat.size == 0 &&
                templater.plugin.settings.enable_folder_templates) {
                const folder_template_match = templater.get_new_file_template_for_folder(file.parent);
                if (!folder_template_match) {
                    return;
                }
                const template_file = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () {
                    return resolve_tfile(templater.app, folder_template_match);
                }), `Couldn't find template ${folder_template_match}`);
                // errorWrapper failed
                if (template_file == null) {
                    return;
                }
                yield templater.write_template_to_file(template_file, file);
            }
            else {
                yield templater.overwrite_file_commands(file);
            }
        });
    }
    execute_startup_scripts() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const template of this.plugin.settings.startup_templates) {
                if (!template) {
                    continue;
                }
                const file = errorWrapperSync(() => resolve_tfile(this.app, template), `Couldn't find startup template "${template}"`);
                if (!file) {
                    continue;
                }
                const running_config = this.create_running_config(file, file, RunMode.StartupTemplate);
                yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), `Startup Template parsing error, aborting.`);
            }
        });
    }
}

class EventHandler {
    constructor(app, plugin, templater, settings) {
        this.app = app;
        this.plugin = plugin;
        this.templater = templater;
        this.settings = settings;
    }
    setup() {
        this.app.workspace.onLayoutReady(() => {
            this.update_trigger_file_on_creation();
        });
        this.update_syntax_highlighting();
        this.update_file_menu();
    }
    update_syntax_highlighting() {
        if (this.plugin.settings.syntax_highlighting) {
            this.syntax_highlighting_event = this.app.workspace.on("codemirror", (cm) => {
                cm.setOption("mode", "templater");
            });
            this.app.workspace.iterateCodeMirrors((cm) => {
                cm.setOption("mode", "templater");
            });
            this.plugin.registerEvent(this.syntax_highlighting_event);
        }
        else {
            if (this.syntax_highlighting_event) {
                this.app.vault.offref(this.syntax_highlighting_event);
            }
            this.app.workspace.iterateCodeMirrors((cm) => {
                cm.setOption("mode", "hypermd");
            });
        }
    }
    update_trigger_file_on_creation() {
        if (this.settings.trigger_on_file_creation) {
            this.trigger_on_file_creation_event = this.app.vault.on("create", (file) => Templater.on_file_creation(this.templater, file));
            this.plugin.registerEvent(this.trigger_on_file_creation_event);
        }
        else {
            if (this.trigger_on_file_creation_event) {
                this.app.vault.offref(this.trigger_on_file_creation_event);
                this.trigger_on_file_creation_event = undefined;
            }
        }
    }
    update_file_menu() {
        this.plugin.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
            if (file instanceof obsidian_module.TFolder) {
                menu.addItem((item) => {
                    item.setTitle("Create new note from template")
                        .setIcon("templater-icon")
                        .onClick(() => {
                        this.plugin.fuzzy_suggester.create_new_note_from_template(file);
                    });
                });
            }
        }));
    }
}

class CommandHandler {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    setup() {
        this.plugin.addCommand({
            id: "insert-templater",
            name: "Open Insert Template modal",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "e",
                },
            ],
            callback: () => {
                this.plugin.fuzzy_suggester.insert_template();
            },
        });
        this.plugin.addCommand({
            id: "replace-in-file-templater",
            name: "Replace templates in the active file",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "r",
                },
            ],
            callback: () => {
                this.plugin.templater.overwrite_active_file_commands();
            },
        });
        this.plugin.addCommand({
            id: "jump-to-next-cursor-location",
            name: "Jump to next cursor location",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "Tab",
                },
            ],
            callback: () => {
                this.plugin.templater.editor.jump_to_next_cursor_location();
            },
        });
        this.plugin.addCommand({
            id: "create-new-note-from-template",
            name: "Create new note from template",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "n",
                },
            ],
            callback: () => {
                this.plugin.fuzzy_suggester.create_new_note_from_template();
            },
        });
        this.register_templates_hotkeys();
    }
    register_templates_hotkeys() {
        this.plugin.settings.enabled_templates_hotkeys.forEach((template) => {
            if (template) {
                this.add_template_hotkey(null, template);
            }
        });
    }
    add_template_hotkey(old_template, new_template) {
        this.remove_template_hotkey(old_template);
        if (new_template) {
            this.plugin.addCommand({
                id: new_template,
                name: `Insert ${new_template}`,
                callback: () => {
                    const template = errorWrapperSync(() => resolve_tfile(this.app, new_template), `Couldn't find the template file associated with this hotkey`);
                    if (!template) {
                        return;
                    }
                    this.plugin.templater.append_template_to_active_file(template);
                },
            });
        }
    }
    remove_template_hotkey(template) {
        if (template) {
            // TODO: Find official way to do this
            // @ts-ignore
            this.app.commands.removeCommand(`${this.plugin.manifest.id}:${template}`);
        }
    }
}

class TemplaterPlugin extends obsidian_module.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load_settings();
            this.templater = new Templater(this.app, this);
            yield this.templater.setup();
            this.fuzzy_suggester = new FuzzySuggester(this.app, this);
            this.event_handler = new EventHandler(this.app, this, this.templater, this.settings);
            this.event_handler.setup();
            this.command_handler = new CommandHandler(this.app, this);
            this.command_handler.setup();
            obsidian_module.addIcon("templater-icon", ICON_DATA);
            this.addRibbonIcon("templater-icon", "Templater", () => __awaiter(this, void 0, void 0, function* () {
                this.fuzzy_suggester.insert_template();
            }));
            this.addSettingTab(new TemplaterSettingTab(this.app, this));
            // Files might not be created yet
            this.app.workspace.onLayoutReady(() => {
                this.templater.execute_startup_scripts();
            });
        });
    }
    save_settings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    load_settings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
}

module.exports = TemplaterPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9Mb2cudHMiLCJzcmMvRXJyb3IudHMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2VudW1zLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXBwbHlTdHlsZXMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaXNUYWJsZUVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRQYXJlbnROb2RlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL21hdGguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3dpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2Fycm93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRWaWV3cG9ydFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFNjcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlT2Zmc2V0cy5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZmxpcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9vZmZzZXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvb3JkZXJNb2RpZmllcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy91bmlxdWVCeS5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2NyZWF0ZVBvcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLmpzIiwic3JjL3N1Z2dlc3RlcnMvc3VnZ2VzdC50cyIsInNyYy9zdWdnZXN0ZXJzL0ZvbGRlclN1Z2dlc3Rlci50cyIsInNyYy9VdGlscy50cyIsInNyYy9zdWdnZXN0ZXJzL0ZpbGVTdWdnZXN0ZXIudHMiLCJzcmMvU2V0dGluZ3MudHMiLCJzcmMvRnV6enlTdWdnZXN0ZXIudHMiLCJzcmMvQ29uc3RhbnRzLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvd2ViL0ludGVybmFsTW9kdWxlV2ViLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9Qcm9tcHRNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9TdWdnZXN0ZXJNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9JbnRlcm5hbE1vZHVsZVN5c3RlbS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2NvbmZpZy9JbnRlcm5hbE1vZHVsZUNvbmZpZy50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU3lzdGVtRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU2NyaXB0RnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3IudHMiLCJzcmMvZWRpdG9yL0N1cnNvckp1bXBlci50cyIsInNyYy9lZGl0b3IvbW9kZS9qYXZhc2NyaXB0LmpzIiwic3JjL2VkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5LmpzIiwic3JjL2VkaXRvci9FZGl0b3IudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLmVzLmpzIiwic3JjL3BhcnNlci9QYXJzZXIudHMiLCJzcmMvVGVtcGxhdGVyLnRzIiwic3JjL0V2ZW50SGFuZGxlci50cyIsInNyYy9Db21tYW5kSGFuZGxlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nX3VwZGF0ZShtc2c6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vdGljZSA9IG5ldyBOb3RpY2UoXCJcIiwgMTUwMDApO1xuICAgIC8vIFRPRE86IEZpbmQgYmV0dGVyIHdheSBmb3IgdGhpc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciB1cGRhdGU8L2I+Ojxici8+JHttc2d9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ19lcnJvcihlOiBFcnJvciB8IFRlbXBsYXRlckVycm9yKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCA4MDAwKTtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yICYmIGUuY29uc29sZV9tc2cpIHtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgZm9yIHRoaXNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX08YnIvPkNoZWNrIGNvbnNvbGUgZm9yIG1vcmUgaW5mb3JtYXRpb25zYDtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVGVtcGxhdGVyIEVycm9yOmAsIGUubWVzc2FnZSwgXCJcXG5cIiwgZS5jb25zb2xlX21zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX1gO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gXCJMb2dcIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1zZzogc3RyaW5nLCBwdWJsaWMgY29uc29sZV9tc2c/OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIobXNnKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlcnJvcldyYXBwZXI8VD4oXG4gICAgZm46ICgpID0+IFByb21pc2U8VD4sXG4gICAgbXNnOiBzdHJpbmdcbik6IFByb21pc2U8VD4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yKSkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihtc2csIGUubWVzc2FnZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nX2Vycm9yKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVycm9yV3JhcHBlclN5bmM8VD4oZm46ICgpID0+IFQsIG1zZzogc3RyaW5nKTogVCB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKG1zZywgZS5tZXNzYWdlKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbiIsImV4cG9ydCB2YXIgdG9wID0gJ3RvcCc7XG5leHBvcnQgdmFyIGJvdHRvbSA9ICdib3R0b20nO1xuZXhwb3J0IHZhciByaWdodCA9ICdyaWdodCc7XG5leHBvcnQgdmFyIGxlZnQgPSAnbGVmdCc7XG5leHBvcnQgdmFyIGF1dG8gPSAnYXV0byc7XG5leHBvcnQgdmFyIGJhc2VQbGFjZW1lbnRzID0gW3RvcCwgYm90dG9tLCByaWdodCwgbGVmdF07XG5leHBvcnQgdmFyIHN0YXJ0ID0gJ3N0YXJ0JztcbmV4cG9ydCB2YXIgZW5kID0gJ2VuZCc7XG5leHBvcnQgdmFyIGNsaXBwaW5nUGFyZW50cyA9ICdjbGlwcGluZ1BhcmVudHMnO1xuZXhwb3J0IHZhciB2aWV3cG9ydCA9ICd2aWV3cG9ydCc7XG5leHBvcnQgdmFyIHBvcHBlciA9ICdwb3BwZXInO1xuZXhwb3J0IHZhciByZWZlcmVuY2UgPSAncmVmZXJlbmNlJztcbmV4cG9ydCB2YXIgdmFyaWF0aW9uUGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9iYXNlUGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pO1xuZXhwb3J0IHZhciBwbGFjZW1lbnRzID0gLyojX19QVVJFX18qL1tdLmNvbmNhdChiYXNlUGxhY2VtZW50cywgW2F1dG9dKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQsIHBsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7IC8vIG1vZGlmaWVycyB0aGF0IG5lZWQgdG8gcmVhZCB0aGUgRE9NXG5cbmV4cG9ydCB2YXIgYmVmb3JlUmVhZCA9ICdiZWZvcmVSZWFkJztcbmV4cG9ydCB2YXIgcmVhZCA9ICdyZWFkJztcbmV4cG9ydCB2YXIgYWZ0ZXJSZWFkID0gJ2FmdGVyUmVhZCc7IC8vIHB1cmUtbG9naWMgbW9kaWZpZXJzXG5cbmV4cG9ydCB2YXIgYmVmb3JlTWFpbiA9ICdiZWZvcmVNYWluJztcbmV4cG9ydCB2YXIgbWFpbiA9ICdtYWluJztcbmV4cG9ydCB2YXIgYWZ0ZXJNYWluID0gJ2FmdGVyTWFpbic7IC8vIG1vZGlmaWVyIHdpdGggdGhlIHB1cnBvc2UgdG8gd3JpdGUgdG8gdGhlIERPTSAob3Igd3JpdGUgaW50byBhIGZyYW1ld29yayBzdGF0ZSlcblxuZXhwb3J0IHZhciBiZWZvcmVXcml0ZSA9ICdiZWZvcmVXcml0ZSc7XG5leHBvcnQgdmFyIHdyaXRlID0gJ3dyaXRlJztcbmV4cG9ydCB2YXIgYWZ0ZXJXcml0ZSA9ICdhZnRlcldyaXRlJztcbmV4cG9ydCB2YXIgbW9kaWZpZXJQaGFzZXMgPSBbYmVmb3JlUmVhZCwgcmVhZCwgYWZ0ZXJSZWFkLCBiZWZvcmVNYWluLCBtYWluLCBhZnRlck1haW4sIGJlZm9yZVdyaXRlLCB3cml0ZSwgYWZ0ZXJXcml0ZV07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCA/IChlbGVtZW50Lm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmIChub2RlLnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdyA6IHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkhUTUxFbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1NoYWRvd1Jvb3Qobm9kZSkge1xuICAvLyBJRSAxMSBoYXMgbm8gU2hhZG93Um9vdFxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuU2hhZG93Um9vdDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290O1xufVxuXG5leHBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9OyIsImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7IC8vIFRoaXMgbW9kaWZpZXIgdGFrZXMgdGhlIHN0eWxlcyBwcmVwYXJlZCBieSB0aGUgYGNvbXB1dGVTdHlsZXNgIG1vZGlmaWVyXG4vLyBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBIVE1MRWxlbWVudHMgc3VjaCBhcyBwb3BwZXIgYW5kIGFycm93XG5cbmZ1bmN0aW9uIGFwcGx5U3R5bGVzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc3R5bGUgPSBzdGF0ZS5zdHlsZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gRmxvdyBkb2Vzbid0IHN1cHBvcnQgdG8gZXh0ZW5kIHRoaXMgcHJvcGVydHksIGJ1dCBpdCdzIHRoZSBtb3N0XG4gICAgLy8gZWZmZWN0aXZlIHdheSB0byBhcHBseSBzdHlsZXMgdG8gYW4gSFRNTEVsZW1lbnRcbiAgICAvLyAkRmxvd0ZpeE1lW2Nhbm5vdC13cml0ZV1cblxuXG4gICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcblxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlID09PSB0cnVlID8gJycgOiB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGU7XG4gIHZhciBpbml0aWFsU3R5bGVzID0ge1xuICAgIHBvcHBlcjoge1xuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIG1hcmdpbjogJzAnXG4gICAgfSxcbiAgICBhcnJvdzoge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICB9LFxuICAgIHJlZmVyZW5jZToge31cbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5wb3BwZXIuc3R5bGUsIGluaXRpYWxTdHlsZXMucG9wcGVyKTtcbiAgc3RhdGUuc3R5bGVzID0gaW5pdGlhbFN0eWxlcztcblxuICBpZiAoc3RhdGUuZWxlbWVudHMuYXJyb3cpIHtcbiAgICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLmFycm93LnN0eWxlLCBpbml0aWFsU3R5bGVzLmFycm93KTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgICB2YXIgc3R5bGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc3RhdGUuc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpID8gc3RhdGUuc3R5bGVzW25hbWVdIDogaW5pdGlhbFN0eWxlc1tuYW1lXSk7IC8vIFNldCBhbGwgdmFsdWVzIHRvIGFuIGVtcHR5IHN0cmluZyB0byB1bnNldCB0aGVtXG5cbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHN0eWxlLCBwcm9wZXJ0eSkge1xuICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgfSwge30pOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2FwcGx5U3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBhcHBseVN0eWxlcyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ2NvbXB1dGVTdHlsZXMnXVxufTsiLCJpbXBvcnQgeyBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG59IiwiLy8gaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gJy4vaW5zdGFuY2VPZic7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVudXNlZC1pbXBvcnRzL25vLXVudXNlZC12YXJzXG5pbmNsdWRlU2NhbGUpIHtcbiAgaWYgKGluY2x1ZGVTY2FsZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5jbHVkZVNjYWxlID0gZmFsc2U7XG4gIH1cblxuICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSAxO1xuICB2YXIgc2NhbGVZID0gMTsgLy8gRklYTUU6XG4gIC8vIGBvZmZzZXRXaWR0aGAgcmV0dXJucyBhbiBpbnRlZ2VyIHdoaWxlIGBnZXRCb3VuZGluZ0NsaWVudFJlY3RgXG4gIC8vIHJldHVybnMgYSBmbG9hdC4gVGhpcyByZXN1bHRzIGluIGBzY2FsZVhgIG9yIGBzY2FsZVlgIGJlaW5nXG4gIC8vIG5vbi0xIHdoZW4gaXQgc2hvdWxkIGJlIGZvciBlbGVtZW50cyB0aGF0IGFyZW4ndCBhIGZ1bGwgcGl4ZWwgaW5cbiAgLy8gd2lkdGggb3IgaGVpZ2h0LlxuICAvLyBpZiAoaXNIVE1MRWxlbWVudChlbGVtZW50KSAmJiBpbmNsdWRlU2NhbGUpIHtcbiAgLy8gICBjb25zdCBvZmZzZXRIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgLy8gICBjb25zdCBvZmZzZXRXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gIC8vICAgLy8gRG8gbm90IGF0dGVtcHQgdG8gZGl2aWRlIGJ5IDAsIG90aGVyd2lzZSB3ZSBnZXQgYEluZmluaXR5YCBhcyBzY2FsZVxuICAvLyAgIC8vIEZhbGxiYWNrIHRvIDEgaW4gY2FzZSBib3RoIHZhbHVlcyBhcmUgYDBgXG4gIC8vICAgaWYgKG9mZnNldFdpZHRoID4gMCkge1xuICAvLyAgICAgc2NhbGVYID0gcmVjdC53aWR0aCAvIG9mZnNldFdpZHRoIHx8IDE7XG4gIC8vICAgfVxuICAvLyAgIGlmIChvZmZzZXRIZWlnaHQgPiAwKSB7XG4gIC8vICAgICBzY2FsZVkgPSByZWN0LmhlaWdodCAvIG9mZnNldEhlaWdodCB8fCAxO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHJlY3Qud2lkdGggLyBzY2FsZVgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodCAvIHNjYWxlWSxcbiAgICB0b3A6IHJlY3QudG9wIC8gc2NhbGVZLFxuICAgIHJpZ2h0OiByZWN0LnJpZ2h0IC8gc2NhbGVYLFxuICAgIGJvdHRvbTogcmVjdC5ib3R0b20gLyBzY2FsZVksXG4gICAgbGVmdDogcmVjdC5sZWZ0IC8gc2NhbGVYLFxuICAgIHg6IHJlY3QubGVmdCAvIHNjYWxlWCxcbiAgICB5OiByZWN0LnRvcCAvIHNjYWxlWVxuICB9O1xufSIsImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7IC8vIFJldHVybnMgdGhlIGxheW91dCByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC4gTGF5b3V0XG4vLyBtZWFucyBpdCBkb2Vzbid0IHRha2UgaW50byBhY2NvdW50IHRyYW5zZm9ybXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldExheW91dFJlY3QoZWxlbWVudCkge1xuICB2YXIgY2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTsgLy8gVXNlIHRoZSBjbGllbnRSZWN0IHNpemVzIGlmIGl0J3Mgbm90IGJlZW4gdHJhbnNmb3JtZWQuXG4gIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTIyM1xuXG4gIHZhciB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gIHZhciBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC53aWR0aCAtIHdpZHRoKSA8PSAxKSB7XG4gICAgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3QuaGVpZ2h0IC0gaGVpZ2h0KSA8PSAxKSB7XG4gICAgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICB5OiBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn0iLCJpbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciByb290Tm9kZSA9IGNoaWxkLmdldFJvb3ROb2RlICYmIGNoaWxkLmdldFJvb3ROb2RlKCk7IC8vIEZpcnN0LCBhdHRlbXB0IHdpdGggZmFzdGVyIG5hdGl2ZSBtZXRob2RcblxuICBpZiAocGFyZW50LmNvbnRhaW5zKGNoaWxkKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIHRoZW4gZmFsbGJhY2sgdG8gY3VzdG9tIGltcGxlbWVudGF0aW9uIHdpdGggU2hhZG93IERPTSBzdXBwb3J0XG4gIGVsc2UgaWYgKHJvb3ROb2RlICYmIGlzU2hhZG93Um9vdChyb290Tm9kZSkpIHtcbiAgICAgIHZhciBuZXh0ID0gY2hpbGQ7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5leHQgJiYgcGFyZW50LmlzU2FtZU5vZGUobmV4dCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ106IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzLi4uXG5cblxuICAgICAgICBuZXh0ID0gbmV4dC5wYXJlbnROb2RlIHx8IG5leHQuaG9zdDtcbiAgICAgIH0gd2hpbGUgKG5leHQpO1xuICAgIH0gLy8gR2l2ZSB1cCwgdGhlIHJlc3VsdCBpcyBmYWxzZVxuXG5cbiAgcmV0dXJuIGZhbHNlO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldFdpbmRvdyhlbGVtZW50KS5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xufSIsImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gWyd0YWJsZScsICd0ZCcsICd0aCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoZWxlbWVudCkpID49IDA7XG59IiwiaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICByZXR1cm4gKChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgZWxlbWVudC5kb2N1bWVudCkgfHwgd2luZG93LmRvY3VtZW50KS5kb2N1bWVudEVsZW1lbnQ7XG59IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmIChnZXROb2RlTmFtZShlbGVtZW50KSA9PT0gJ2h0bWwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gKC8vIHRoaXMgaXMgYSBxdWlja2VyIChidXQgbGVzcyB0eXBlIHNhZmUpIHdheSB0byBzYXZlIHF1aXRlIHNvbWUgYnl0ZXMgZnJvbSB0aGUgYnVuZGxlXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXVxuICAgIC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgIGVsZW1lbnQuYXNzaWduZWRTbG90IHx8IC8vIHN0ZXAgaW50byB0aGUgc2hhZG93IERPTSBvZiB0aGUgcGFyZW50IG9mIGEgc2xvdHRlZCBub2RlXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIHx8ICggLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWRcbiAgICBpc1NoYWRvd1Jvb3QoZWxlbWVudCkgPyBlbGVtZW50Lmhvc3QgOiBudWxsKSB8fCAvLyBTaGFkb3dSb290IGRldGVjdGVkXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IEhUTUxFbGVtZW50IGlzIGEgTm9kZVxuICAgIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSAvLyBmYWxsYmFja1xuXG4gICk7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBpc1RhYmxlRWxlbWVudCBmcm9tIFwiLi9pc1RhYmxlRWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuXG5mdW5jdGlvbiBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvODM3XG4gIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Lm9mZnNldFBhcmVudDtcbn0gLy8gYC5vZmZzZXRQYXJlbnRgIHJlcG9ydHMgYG51bGxgIGZvciBmaXhlZCBlbGVtZW50cywgd2hpbGUgYWJzb2x1dGUgZWxlbWVudHNcbi8vIHJldHVybiB0aGUgY29udGFpbmluZyBibG9ja1xuXG5cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIHZhciBpc0ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpICE9PSAtMTtcbiAgdmFyIGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSAhPT0gLTE7XG5cbiAgaWYgKGlzSUUgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSkge1xuICAgIC8vIEluIElFIDksIDEwIGFuZCAxMSBmaXhlZCBlbGVtZW50cyBjb250YWluaW5nIGJsb2NrIGlzIGFsd2F5cyBlc3RhYmxpc2hlZCBieSB0aGUgdmlld3BvcnRcbiAgICB2YXIgZWxlbWVudENzcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICBpZiAoZWxlbWVudENzcy5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgdmFyIGN1cnJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShlbGVtZW50KTtcblxuICB3aGlsZSAoaXNIVE1MRWxlbWVudChjdXJyZW50Tm9kZSkgJiYgWydodG1sJywgJ2JvZHknXS5pbmRleE9mKGdldE5vZGVOYW1lKGN1cnJlbnROb2RlKSkgPCAwKSB7XG4gICAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpOyAvLyBUaGlzIGlzIG5vbi1leGhhdXN0aXZlIGJ1dCBjb3ZlcnMgdGhlIG1vc3QgY29tbW9uIENTUyBwcm9wZXJ0aWVzIHRoYXRcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGJsb2NrLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG5cbiAgICBpZiAoY3NzLnRyYW5zZm9ybSAhPT0gJ25vbmUnIHx8IGNzcy5wZXJzcGVjdGl2ZSAhPT0gJ25vbmUnIHx8IGNzcy5jb250YWluID09PSAncGFpbnQnIHx8IFsndHJhbnNmb3JtJywgJ3BlcnNwZWN0aXZlJ10uaW5kZXhPZihjc3Mud2lsbENoYW5nZSkgIT09IC0xIHx8IGlzRmlyZWZveCAmJiBjc3Mud2lsbENoYW5nZSA9PT0gJ2ZpbHRlcicgfHwgaXNGaXJlZm94ICYmIGNzcy5maWx0ZXIgJiYgY3NzLmZpbHRlciAhPT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0gLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIGlzVGFibGVFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmIChvZmZzZXRQYXJlbnQgJiYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdodG1sJyB8fCBnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnYm9keScgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkgfHwgd2luZG93O1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSA+PSAwID8gJ3gnIDogJ3knO1xufSIsImV4cG9ydCB2YXIgbWF4ID0gTWF0aC5tYXg7XG5leHBvcnQgdmFyIG1pbiA9IE1hdGgubWluO1xuZXhwb3J0IHZhciByb3VuZCA9IE1hdGgucm91bmQ7IiwiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2l0aGluKG1pbiwgdmFsdWUsIG1heCkge1xuICByZXR1cm4gbWF0aE1heChtaW4sIG1hdGhNaW4odmFsdWUsIG1heCkpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyZXNoU2lkZU9iamVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDBcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmRUb0hhc2hNYXAodmFsdWUsIGtleXMpIHtcbiAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChoYXNoTWFwLCBrZXkpIHtcbiAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gaGFzaE1hcDtcbiAgfSwge30pO1xufSIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi4vZG9tLXV0aWxzL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB3aXRoaW4gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi4vdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuLi91dGlscy9leHBhbmRUb0hhc2hNYXAuanNcIjtcbmltcG9ydCB7IGxlZnQsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdG9wLCBib3R0b20gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdG9QYWRkaW5nT2JqZWN0ID0gZnVuY3Rpb24gdG9QYWRkaW5nT2JqZWN0KHBhZGRpbmcsIHN0YXRlKSB7XG4gIHBhZGRpbmcgPSB0eXBlb2YgcGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IHBhZGRpbmcoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiBwYWRkaW5nO1xuICByZXR1cm4gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbn07XG5cbmZ1bmN0aW9uIGFycm93KF9yZWYpIHtcbiAgdmFyIF9zdGF0ZSRtb2RpZmllcnNEYXRhJDtcblxuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgYXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGlzVmVydGljYWwgPSBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgaWYgKCFhcnJvd0VsZW1lbnQgfHwgIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFkZGluZ09iamVjdCA9IHRvUGFkZGluZ09iamVjdChvcHRpb25zLnBhZGRpbmcsIHN0YXRlKTtcbiAgdmFyIGFycm93UmVjdCA9IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KTtcbiAgdmFyIG1pblByb3AgPSBheGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICB2YXIgbWF4UHJvcCA9IGF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICB2YXIgZW5kRGlmZiA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtsZW5dICsgc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdIC0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnBvcHBlcltsZW5dO1xuICB2YXIgc3RhcnREaWZmID0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGFycm93RWxlbWVudCk7XG4gIHZhciBjbGllbnRTaXplID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBheGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRIZWlnaHQgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoIHx8IDAgOiAwO1xuICB2YXIgY2VudGVyVG9SZWZlcmVuY2UgPSBlbmREaWZmIC8gMiAtIHN0YXJ0RGlmZiAvIDI7IC8vIE1ha2Ugc3VyZSB0aGUgYXJyb3cgZG9lc24ndCBvdmVyZmxvdyB0aGUgcG9wcGVyIGlmIHRoZSBjZW50ZXIgcG9pbnQgaXNcbiAgLy8gb3V0c2lkZSBvZiB0aGUgcG9wcGVyIGJvdW5kc1xuXG4gIHZhciBtaW4gPSBwYWRkaW5nT2JqZWN0W21pblByb3BdO1xuICB2YXIgbWF4ID0gY2xpZW50U2l6ZSAtIGFycm93UmVjdFtsZW5dIC0gcGFkZGluZ09iamVjdFttYXhQcm9wXTtcbiAgdmFyIGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dSZWN0W2xlbl0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gIHZhciBvZmZzZXQgPSB3aXRoaW4obWluLCBjZW50ZXIsIG1heCk7IC8vIFByZXZlbnRzIGJyZWFraW5nIHN5bnRheCBoaWdobGlnaHRpbmcuLi5cblxuICB2YXIgYXhpc1Byb3AgPSBheGlzO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gKF9zdGF0ZSRtb2RpZmllcnNEYXRhJCA9IHt9LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSRbYXhpc1Byb3BdID0gb2Zmc2V0LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQuY2VudGVyT2Zmc2V0ID0gb2Zmc2V0IC0gY2VudGVyLCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQpO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQsXG4gICAgICBhcnJvd0VsZW1lbnQgPSBfb3B0aW9ucyRlbGVtZW50ID09PSB2b2lkIDAgPyAnW2RhdGEtcG9wcGVyLWFycm93XScgOiBfb3B0aW9ucyRlbGVtZW50O1xuXG4gIGlmIChhcnJvd0VsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBDU1Mgc2VsZWN0b3JcblxuXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoYXJyb3dFbGVtZW50KSkge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIGVsZW1lbnQgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCAobm90IGFuIFNWR0VsZW1lbnQpLicsICdUbyB1c2UgYW4gU1ZHIGFycm93LCB3cmFwIGl0IGluIGFuIEhUTUxFbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGFzJywgJ3RoZSBhcnJvdy4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGFpbnMoc3RhdGUuZWxlbWVudHMucG9wcGVyLCBhcnJvd0VsZW1lbnQpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIG1vZGlmaWVyXFwncyBgZWxlbWVudGAgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBwb3BwZXInLCAnZWxlbWVudC4nXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRlLmVsZW1lbnRzLmFycm93ID0gYXJyb3dFbGVtZW50O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXJyb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogYXJyb3csXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J11cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB1bnNldFNpZGVzID0ge1xuICB0b3A6ICdhdXRvJyxcbiAgcmlnaHQ6ICdhdXRvJyxcbiAgYm90dG9tOiAnYXV0bycsXG4gIGxlZnQ6ICdhdXRvJ1xufTsgLy8gUm91bmQgdGhlIG9mZnNldHMgdG8gdGhlIG5lYXJlc3Qgc3VpdGFibGUgc3VicGl4ZWwgYmFzZWQgb24gdGhlIERQUi5cbi8vIFpvb21pbmcgY2FuIGNoYW5nZSB0aGUgRFBSLCBidXQgaXQgc2VlbXMgdG8gcmVwb3J0IGEgdmFsdWUgdGhhdCB3aWxsXG4vLyBjbGVhbmx5IGRpdmlkZSB0aGUgdmFsdWVzIGludG8gdGhlIGFwcHJvcHJpYXRlIHN1YnBpeGVscy5cblxuZnVuY3Rpb24gcm91bmRPZmZzZXRzQnlEUFIoX3JlZikge1xuICB2YXIgeCA9IF9yZWYueCxcbiAgICAgIHkgPSBfcmVmLnk7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG4gIHZhciBkcHIgPSB3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICByZXR1cm4ge1xuICAgIHg6IHJvdW5kKHJvdW5kKHggKiBkcHIpIC8gZHByKSB8fCAwLFxuICAgIHk6IHJvdW5kKHJvdW5kKHkgKiBkcHIpIC8gZHByKSB8fCAwXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBUb1N0eWxlcyhfcmVmMikge1xuICB2YXIgX09iamVjdCRhc3NpZ24yO1xuXG4gIHZhciBwb3BwZXIgPSBfcmVmMi5wb3BwZXIsXG4gICAgICBwb3BwZXJSZWN0ID0gX3JlZjIucG9wcGVyUmVjdCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYyLnBsYWNlbWVudCxcbiAgICAgIHZhcmlhdGlvbiA9IF9yZWYyLnZhcmlhdGlvbixcbiAgICAgIG9mZnNldHMgPSBfcmVmMi5vZmZzZXRzLFxuICAgICAgcG9zaXRpb24gPSBfcmVmMi5wb3NpdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9yZWYyLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGFkYXB0aXZlID0gX3JlZjIuYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHMgPSBfcmVmMi5yb3VuZE9mZnNldHM7XG5cbiAgdmFyIF9yZWYzID0gcm91bmRPZmZzZXRzID09PSB0cnVlID8gcm91bmRPZmZzZXRzQnlEUFIob2Zmc2V0cykgOiB0eXBlb2Ygcm91bmRPZmZzZXRzID09PSAnZnVuY3Rpb24nID8gcm91bmRPZmZzZXRzKG9mZnNldHMpIDogb2Zmc2V0cyxcbiAgICAgIF9yZWYzJHggPSBfcmVmMy54LFxuICAgICAgeCA9IF9yZWYzJHggPT09IHZvaWQgMCA/IDAgOiBfcmVmMyR4LFxuICAgICAgX3JlZjMkeSA9IF9yZWYzLnksXG4gICAgICB5ID0gX3JlZjMkeSA9PT0gdm9pZCAwID8gMCA6IF9yZWYzJHk7XG5cbiAgdmFyIGhhc1ggPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd4Jyk7XG4gIHZhciBoYXNZID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneScpO1xuICB2YXIgc2lkZVggPSBsZWZ0O1xuICB2YXIgc2lkZVkgPSB0b3A7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgaWYgKGFkYXB0aXZlKSB7XG4gICAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChwb3BwZXIpO1xuICAgIHZhciBoZWlnaHRQcm9wID0gJ2NsaWVudEhlaWdodCc7XG4gICAgdmFyIHdpZHRoUHJvcCA9ICdjbGllbnRXaWR0aCc7XG5cbiAgICBpZiAob2Zmc2V0UGFyZW50ID09PSBnZXRXaW5kb3cocG9wcGVyKSkge1xuICAgICAgb2Zmc2V0UGFyZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KHBvcHBlcik7XG5cbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gIT09ICdzdGF0aWMnICYmIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgIGhlaWdodFByb3AgPSAnc2Nyb2xsSGVpZ2h0JztcbiAgICAgICAgd2lkdGhQcm9wID0gJ3Njcm9sbFdpZHRoJztcbiAgICAgIH1cbiAgICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhc3RdOiBmb3JjZSB0eXBlIHJlZmluZW1lbnQsIHdlIGNvbXBhcmUgb2Zmc2V0UGFyZW50IHdpdGggd2luZG93IGFib3ZlLCBidXQgRmxvdyBkb2Vzbid0IGRldGVjdCBpdFxuXG5cbiAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQ7XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSB0b3AgfHwgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCBwbGFjZW1lbnQgPT09IHJpZ2h0KSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVkgPSBib3R0b207IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuXG4gICAgICB5IC09IG9mZnNldFBhcmVudFtoZWlnaHRQcm9wXSAtIHBvcHBlclJlY3QuaGVpZ2h0O1xuICAgICAgeSAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCAocGxhY2VtZW50ID09PSB0b3AgfHwgcGxhY2VtZW50ID09PSBib3R0b20pICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWCA9IHJpZ2h0OyAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cblxuICAgICAgeCAtPSBvZmZzZXRQYXJlbnRbd2lkdGhQcm9wXSAtIHBvcHBlclJlY3Qud2lkdGg7XG4gICAgICB4ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgcG9zaXRpb246IHBvc2l0aW9uXG4gIH0sIGFkYXB0aXZlICYmIHVuc2V0U2lkZXMpO1xuXG4gIGlmIChncHVBY2NlbGVyYXRpb24pIHtcbiAgICB2YXIgX09iamVjdCRhc3NpZ247XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24gPSB7fSwgX09iamVjdCRhc3NpZ25bc2lkZVldID0gaGFzWSA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbltzaWRlWF0gPSBoYXNYID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduLnRyYW5zZm9ybSA9ICh3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSA8PSAxID8gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweCwgMClcIiwgX09iamVjdCRhc3NpZ24pKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbjIgPSB7fSwgX09iamVjdCRhc3NpZ24yW3NpZGVZXSA9IGhhc1kgPyB5ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMltzaWRlWF0gPSBoYXNYID8geCArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjIudHJhbnNmb3JtID0gJycsIF9PYmplY3QkYXNzaWduMikpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3R5bGVzKF9yZWY0KSB7XG4gIHZhciBzdGF0ZSA9IF9yZWY0LnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWY0Lm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPSBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGdwdUFjY2VsZXJhdCxcbiAgICAgIF9vcHRpb25zJGFkYXB0aXZlID0gb3B0aW9ucy5hZGFwdGl2ZSxcbiAgICAgIGFkYXB0aXZlID0gX29wdGlvbnMkYWRhcHRpdmUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhZGFwdGl2ZSxcbiAgICAgIF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9IG9wdGlvbnMucm91bmRPZmZzZXRzLFxuICAgICAgcm91bmRPZmZzZXRzID0gX29wdGlvbnMkcm91bmRPZmZzZXRzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcm91bmRPZmZzZXRzO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICB2YXIgdHJhbnNpdGlvblByb3BlcnR5ID0gZ2V0Q29tcHV0ZWRTdHlsZShzdGF0ZS5lbGVtZW50cy5wb3BwZXIpLnRyYW5zaXRpb25Qcm9wZXJ0eSB8fCAnJztcblxuICAgIGlmIChhZGFwdGl2ZSAmJiBbJ3RyYW5zZm9ybScsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5zb21lKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25Qcm9wZXJ0eS5pbmRleE9mKHByb3BlcnR5KSA+PSAwO1xuICAgIH0pKSB7XG4gICAgICBjb25zb2xlLndhcm4oWydQb3BwZXI6IERldGVjdGVkIENTUyB0cmFuc2l0aW9ucyBvbiBhdCBsZWFzdCBvbmUgb2YgdGhlIGZvbGxvd2luZycsICdDU1MgcHJvcGVydGllczogXCJ0cmFuc2Zvcm1cIiwgXCJ0b3BcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIi4nLCAnXFxuXFxuJywgJ0Rpc2FibGUgdGhlIFwiY29tcHV0ZVN0eWxlc1wiIG1vZGlmaWVyXFwncyBgYWRhcHRpdmVgIG9wdGlvbiB0byBhbGxvdycsICdmb3Igc21vb3RoIHRyYW5zaXRpb25zLCBvciByZW1vdmUgdGhlc2UgcHJvcGVydGllcyBmcm9tIHRoZSBDU1MnLCAndHJhbnNpdGlvbiBkZWNsYXJhdGlvbiBvbiB0aGUgcG9wcGVyIGVsZW1lbnQgaWYgb25seSB0cmFuc2l0aW9uaW5nJywgJ29wYWNpdHkgb3IgYmFja2dyb3VuZC1jb2xvciBmb3IgZXhhbXBsZS4nLCAnXFxuXFxuJywgJ1dlIHJlY29tbWVuZCB1c2luZyB0aGUgcG9wcGVyIGVsZW1lbnQgYXMgYSB3cmFwcGVyIGFyb3VuZCBhbiBpbm5lcicsICdlbGVtZW50IHRoYXQgY2FuIGhhdmUgYW55IENTUyBwcm9wZXJ0eSB0cmFuc2l0aW9uZWQgZm9yIGFuaW1hdGlvbnMuJ10uam9pbignICcpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0ge1xuICAgIHBsYWNlbWVudDogZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHZhcmlhdGlvbjogZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCksXG4gICAgcG9wcGVyOiBzdGF0ZS5lbGVtZW50cy5wb3BwZXIsXG4gICAgcG9wcGVyUmVjdDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIGdwdUFjY2VsZXJhdGlvbjogZ3B1QWNjZWxlcmF0aW9uXG4gIH07XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5wb3BwZXIsIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLFxuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBhZGFwdGl2ZTogYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLmFycm93ID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLmFycm93LCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3csXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGFkYXB0aXZlOiBmYWxzZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcGxhY2VtZW50Jzogc3RhdGUucGxhY2VtZW50XG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnY29tcHV0ZVN0eWxlcycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnYmVmb3JlV3JpdGUnLFxuICBmbjogY29tcHV0ZVN0eWxlcyxcbiAgZGF0YToge31cbn07IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciBwYXNzaXZlID0ge1xuICBwYXNzaXZlOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgaW5zdGFuY2UgPSBfcmVmLmluc3RhbmNlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJHNjcm9sbCA9IG9wdGlvbnMuc2Nyb2xsLFxuICAgICAgc2Nyb2xsID0gX29wdGlvbnMkc2Nyb2xsID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2Nyb2xsLFxuICAgICAgX29wdGlvbnMkcmVzaXplID0gb3B0aW9ucy5yZXNpemUsXG4gICAgICByZXNpemUgPSBfb3B0aW9ucyRyZXNpemUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyZXNpemU7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coc3RhdGUuZWxlbWVudHMucG9wcGVyKTtcbiAgdmFyIHNjcm9sbFBhcmVudHMgPSBbXS5jb25jYXQoc3RhdGUuc2Nyb2xsUGFyZW50cy5yZWZlcmVuY2UsIHN0YXRlLnNjcm9sbFBhcmVudHMucG9wcGVyKTtcblxuICBpZiAoc2Nyb2xsKSB7XG4gICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgIHNjcm9sbFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlc2l6ZSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgICBzY3JvbGxQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXNpemUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH1cbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2V2ZW50TGlzdGVuZXJzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBmdW5jdGlvbiBmbigpIHt9LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgZGF0YToge31cbn07IiwidmFyIGhhc2ggPSB7XG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCcsXG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbSdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwidmFyIGhhc2ggPSB7XG4gIHN0YXJ0OiAnZW5kJyxcbiAgZW5kOiAnc3RhcnQnXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvc3RhcnR8ZW5kL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XG4gIH0pO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwobm9kZSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KG5vZGUpO1xuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbi5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFRvcCA9IHdpbi5wYWdlWU9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBzY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gIH07XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSB7XG4gIC8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbiAgLy8gaW5jb3JyZWN0IGZvciBSVEwuXG4gIC8vIFBvcHBlciAxIGlzIGJyb2tlbiBpbiB0aGlzIGNhc2UgYW5kIG5ldmVyIGhhZCBhIGJ1ZyByZXBvcnQgc28gbGV0J3MgYXNzdW1lXG4gIC8vIGl0J3Mgbm90IGFuIGlzc3VlLiBJIGRvbid0IHRoaW5rIGFueW9uZSBldmVyIHNwZWNpZmllcyB3aWR0aCBvbiA8aHRtbD5cbiAgLy8gYW55d2F5LlxuICAvLyBCcm93c2VycyB3aGVyZSB0aGUgbGVmdCBzY3JvbGxiYXIgZG9lc24ndCBjYXVzZSBhbiBpc3N1ZSByZXBvcnQgYDBgIGZvclxuICAvLyB0aGlzIChlLmcuIEVkZ2UgMjAxOSwgSUUxMSwgU2FmYXJpKVxuICByZXR1cm4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkubGVmdCArIGdldFdpbmRvd1Njcm9sbChlbGVtZW50KS5zY3JvbGxMZWZ0O1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB2aXN1YWxWaWV3cG9ydCA9IHdpbi52aXN1YWxWaWV3cG9ydDtcbiAgdmFyIHdpZHRoID0gaHRtbC5jbGllbnRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGh0bWwuY2xpZW50SGVpZ2h0O1xuICB2YXIgeCA9IDA7XG4gIHZhciB5ID0gMDsgLy8gTkI6IFRoaXMgaXNuJ3Qgc3VwcG9ydGVkIG9uIGlPUyA8PSAxMi4gSWYgdGhlIGtleWJvYXJkIGlzIG9wZW4sIHRoZSBwb3BwZXJcbiAgLy8gY2FuIGJlIG9ic2N1cmVkIHVuZGVybmVhdGggaXQuXG4gIC8vIEFsc28sIGBodG1sLmNsaWVudEhlaWdodGAgYWRkcyB0aGUgYm90dG9tIGJhciBoZWlnaHQgaW4gU2FmYXJpIGlPUywgZXZlblxuICAvLyBpZiBpdCBpc24ndCBvcGVuLCBzbyBpZiB0aGlzIGlzbid0IGF2YWlsYWJsZSwgdGhlIHBvcHBlciB3aWxsIGJlIGRldGVjdGVkXG4gIC8vIHRvIG92ZXJmbG93IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbiB0b28gZWFybHkuXG5cbiAgaWYgKHZpc3VhbFZpZXdwb3J0KSB7XG4gICAgd2lkdGggPSB2aXN1YWxWaWV3cG9ydC53aWR0aDtcbiAgICBoZWlnaHQgPSB2aXN1YWxWaWV3cG9ydC5oZWlnaHQ7IC8vIFVzZXMgTGF5b3V0IFZpZXdwb3J0IChsaWtlIENocm9tZTsgU2FmYXJpIGRvZXMgbm90IGN1cnJlbnRseSlcbiAgICAvLyBJbiBDaHJvbWUsIGl0IHJldHVybnMgYSB2YWx1ZSB2ZXJ5IGNsb3NlIHRvIDAgKCsvLSkgYnV0IGNvbnRhaW5zIHJvdW5kaW5nXG4gICAgLy8gZXJyb3JzIGR1ZSB0byBmbG9hdGluZyBwb2ludCBudW1iZXJzLCBzbyB3ZSBuZWVkIHRvIGNoZWNrIHByZWNpc2lvbi5cbiAgICAvLyBTYWZhcmkgcmV0dXJucyBhIG51bWJlciA8PSAwLCB1c3VhbGx5IDwgLTEgd2hlbiBwaW5jaC16b29tZWRcbiAgICAvLyBGZWF0dXJlIGRldGVjdGlvbiBmYWlscyBpbiBtb2JpbGUgZW11bGF0aW9uIG1vZGUgaW4gQ2hyb21lLlxuICAgIC8vIE1hdGguYWJzKHdpbi5pbm5lcldpZHRoIC8gdmlzdWFsVmlld3BvcnQuc2NhbGUgLSB2aXN1YWxWaWV3cG9ydC53aWR0aCkgPFxuICAgIC8vIDAuMDAxXG4gICAgLy8gRmFsbGJhY2sgaGVyZTogXCJOb3QgU2FmYXJpXCIgdXNlckFnZW50XG5cbiAgICBpZiAoIS9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgIHggPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0O1xuICAgICAgeSA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSxcbiAgICB5OiB5XG4gIH07XG59IiwiaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgeyBtYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBHZXRzIHRoZSBlbnRpcmUgc2l6ZSBvZiB0aGUgc2Nyb2xsYWJsZSBkb2N1bWVudCBhcmVhLCBldmVuIGV4dGVuZGluZyBvdXRzaWRlXG4vLyBvZiB0aGUgYDxodG1sPmAgYW5kIGA8Ym9keT5gIHJlY3QgYm91bmRzIGlmIGhvcml6b250YWxseSBzY3JvbGxhYmxlXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB3aW5TY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCk7XG4gIHZhciBib2R5ID0gKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5O1xuICB2YXIgd2lkdGggPSBtYXgoaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuc2Nyb2xsV2lkdGggOiAwLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApO1xuICB2YXIgaGVpZ2h0ID0gbWF4KGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgYm9keSA/IGJvZHkuc2Nyb2xsSGVpZ2h0IDogMCwgYm9keSA/IGJvZHkuY2xpZW50SGVpZ2h0IDogMCk7XG4gIHZhciB4ID0gLXdpblNjcm9sbC5zY3JvbGxMZWZ0ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KTtcbiAgdmFyIHkgPSAtd2luU2Nyb2xsLnNjcm9sbFRvcDtcblxuICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShib2R5IHx8IGh0bWwpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICB4ICs9IG1heChodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApIC0gd2lkdGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1Njcm9sbFBhcmVudChlbGVtZW50KSB7XG4gIC8vIEZpcmVmb3ggd2FudHMgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcbiAgdmFyIF9nZXRDb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgIG92ZXJmbG93ID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3csXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1gsXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1k7XG5cbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCk7XG59IiwiaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQobm9kZSkge1xuICBpZiAoWydodG1sJywgJ2JvZHknLCAnI2RvY3VtZW50J10uaW5kZXhPZihnZXROb2RlTmFtZShub2RlKSkgPj0gMCkge1xuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBpZiAoaXNIVE1MRWxlbWVudChub2RlKSAmJiBpc1Njcm9sbFBhcmVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKG5vZGUpKTtcbn0iLCJpbXBvcnQgZ2V0U2Nyb2xsUGFyZW50IGZyb20gXCIuL2dldFNjcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuLypcbmdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHVybiB0aGUgbGlzdCBvZiBhbGwgc2Nyb2xsIHBhcmVudHMsIHVwIHRoZSBsaXN0IG9mIGFuY2Vzb3JzXG51bnRpbCB3ZSBnZXQgdG8gdGhlIHRvcCB3aW5kb3cgb2JqZWN0LiBUaGlzIGxpc3QgaXMgd2hhdCB3ZSBhdHRhY2ggc2Nyb2xsIGxpc3RlbmVyc1xudG8sIGJlY2F1c2UgaWYgYW55IG9mIHRoZXNlIHBhcmVudCBlbGVtZW50cyBzY3JvbGwsIHdlJ2xsIG5lZWQgdG8gcmUtY2FsY3VsYXRlIHRoZVxucmVmZXJlbmNlIGVsZW1lbnQncyBwb3NpdGlvbi5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxpc3RTY3JvbGxQYXJlbnRzKGVsZW1lbnQsIGxpc3QpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICBpZiAobGlzdCA9PT0gdm9pZCAwKSB7XG4gICAgbGlzdCA9IFtdO1xuICB9XG5cbiAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChlbGVtZW50KTtcbiAgdmFyIGlzQm9keSA9IHNjcm9sbFBhcmVudCA9PT0gKChfZWxlbWVudCRvd25lckRvY3VtZW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keSk7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3coc2Nyb2xsUGFyZW50KTtcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IFt3aW5dLmNvbmNhdCh3aW4udmlzdWFsVmlld3BvcnQgfHwgW10sIGlzU2Nyb2xsUGFyZW50KHNjcm9sbFBhcmVudCkgPyBzY3JvbGxQYXJlbnQgOiBbXSkgOiBzY3JvbGxQYXJlbnQ7XG4gIHZhciB1cGRhdGVkTGlzdCA9IGxpc3QuY29uY2F0KHRhcmdldCk7XG4gIHJldHVybiBpc0JvZHkgPyB1cGRhdGVkTGlzdCA6IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhbGxdOiBpc0JvZHkgdGVsbHMgdXMgdGFyZ2V0IHdpbGwgYmUgYW4gSFRNTEVsZW1lbnQgaGVyZVxuICB1cGRhdGVkTGlzdC5jb25jYXQobGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZSh0YXJnZXQpKSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZWN0LCB7XG4gICAgbGVmdDogcmVjdC54LFxuICAgIHRvcDogcmVjdC55LFxuICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgfSk7XG59IiwiaW1wb3J0IHsgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWaWV3cG9ydFJlY3QgZnJvbSBcIi4vZ2V0Vmlld3BvcnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRSZWN0IGZyb20gXCIuL2dldERvY3VtZW50UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4vY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4uL3V0aWxzL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IG1heCwgbWluIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCkge1xuICB2YXIgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTtcbiAgcmVjdC50b3AgPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50VG9wO1xuICByZWN0LmxlZnQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudExlZnQ7XG4gIHJlY3QuYm90dG9tID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC5yaWdodCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3Qud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LmhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnggPSByZWN0LmxlZnQ7XG4gIHJlY3QueSA9IHJlY3QudG9wO1xuICByZXR1cm4gcmVjdDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50ID09PSB2aWV3cG9ydCA/IHJlY3RUb0NsaWVudFJlY3QoZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQpKSA6IGlzSFRNTEVsZW1lbnQoY2xpcHBpbmdQYXJlbnQpID8gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoY2xpcHBpbmdQYXJlbnQpIDogcmVjdFRvQ2xpZW50UmVjdChnZXREb2N1bWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKSk7XG59IC8vIEEgXCJjbGlwcGluZyBwYXJlbnRcIiBpcyBhbiBvdmVyZmxvd2FibGUgY29udGFpbmVyIHdpdGggdGhlIGNoYXJhY3RlcmlzdGljIG9mXG4vLyBjbGlwcGluZyAob3IgaGlkaW5nKSBvdmVyZmxvd2luZyBlbGVtZW50cyB3aXRoIGEgcG9zaXRpb24gZGlmZmVyZW50IGZyb21cbi8vIGBpbml0aWFsYFxuXG5cbmZ1bmN0aW9uIGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSB7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbiAgdmFyIGNhbkVzY2FwZUNsaXBwaW5nID0gWydhYnNvbHV0ZScsICdmaXhlZCddLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbikgPj0gMDtcbiAgdmFyIGNsaXBwZXJFbGVtZW50ID0gY2FuRXNjYXBlQ2xpcHBpbmcgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSA/IGdldE9mZnNldFBhcmVudChlbGVtZW50KSA6IGVsZW1lbnQ7XG5cbiAgaWYgKCFpc0VsZW1lbnQoY2xpcHBlckVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8xNDE0XG5cblxuICByZXR1cm4gY2xpcHBpbmdQYXJlbnRzLmZpbHRlcihmdW5jdGlvbiAoY2xpcHBpbmdQYXJlbnQpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSAmJiBjb250YWlucyhjbGlwcGluZ1BhcmVudCwgY2xpcHBlckVsZW1lbnQpICYmIGdldE5vZGVOYW1lKGNsaXBwaW5nUGFyZW50KSAhPT0gJ2JvZHknO1xuICB9KTtcbn0gLy8gR2V0cyB0aGUgbWF4aW11bSBhcmVhIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiBkdWUgdG8gYW55IG51bWJlciBvZlxuLy8gY2xpcHBpbmcgcGFyZW50c1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENsaXBwaW5nUmVjdChlbGVtZW50LCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5KSB7XG4gIHZhciBtYWluQ2xpcHBpbmdQYXJlbnRzID0gYm91bmRhcnkgPT09ICdjbGlwcGluZ1BhcmVudHMnID8gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIDogW10uY29uY2F0KGJvdW5kYXJ5KTtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IFtdLmNvbmNhdChtYWluQ2xpcHBpbmdQYXJlbnRzLCBbcm9vdEJvdW5kYXJ5XSk7XG4gIHZhciBmaXJzdENsaXBwaW5nUGFyZW50ID0gY2xpcHBpbmdQYXJlbnRzWzBdO1xuICB2YXIgY2xpcHBpbmdSZWN0ID0gY2xpcHBpbmdQYXJlbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjUmVjdCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50KTtcbiAgICBhY2NSZWN0LnRvcCA9IG1heChyZWN0LnRvcCwgYWNjUmVjdC50b3ApO1xuICAgIGFjY1JlY3QucmlnaHQgPSBtaW4ocmVjdC5yaWdodCwgYWNjUmVjdC5yaWdodCk7XG4gICAgYWNjUmVjdC5ib3R0b20gPSBtaW4ocmVjdC5ib3R0b20sIGFjY1JlY3QuYm90dG9tKTtcbiAgICBhY2NSZWN0LmxlZnQgPSBtYXgocmVjdC5sZWZ0LCBhY2NSZWN0LmxlZnQpO1xuICAgIHJldHVybiBhY2NSZWN0O1xuICB9LCBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBmaXJzdENsaXBwaW5nUGFyZW50KSk7XG4gIGNsaXBwaW5nUmVjdC53aWR0aCA9IGNsaXBwaW5nUmVjdC5yaWdodCAtIGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QuaGVpZ2h0ID0gY2xpcHBpbmdSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC50b3A7XG4gIGNsaXBwaW5nUmVjdC54ID0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC55ID0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgcmV0dXJuIGNsaXBwaW5nUmVjdDtcbn0iLCJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgc3RhcnQsIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZU9mZnNldHMoX3JlZikge1xuICB2YXIgcmVmZXJlbmNlID0gX3JlZi5yZWZlcmVuY2UsXG4gICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZi5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50ID8gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudCA/IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIGNvbW1vblggPSByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCAvIDIgLSBlbGVtZW50LndpZHRoIC8gMjtcbiAgdmFyIGNvbW1vblkgPSByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHQgLyAyIC0gZWxlbWVudC5oZWlnaHQgLyAyO1xuICB2YXIgb2Zmc2V0cztcblxuICBzd2l0Y2ggKGJhc2VQbGFjZW1lbnQpIHtcbiAgICBjYXNlIHRvcDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55IC0gZWxlbWVudC5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYm90dG9tOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIHJpZ2h0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgbGVmdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54IC0gZWxlbWVudC53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuXG4gIHZhciBtYWluQXhpcyA9IGJhc2VQbGFjZW1lbnQgPyBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCkgOiBudWxsO1xuXG4gIGlmIChtYWluQXhpcyAhPSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICBzd2l0Y2ggKHZhcmlhdGlvbikge1xuICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSAtIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZW5kOlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdICsgKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0cztcbn0iLCJpbXBvcnQgZ2V0Q2xpcHBpbmdSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgY29tcHV0ZU9mZnNldHMgZnJvbSBcIi4vY29tcHV0ZU9mZnNldHMuanNcIjtcbmltcG9ydCByZWN0VG9DbGllbnRSZWN0IGZyb20gXCIuL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IGNsaXBwaW5nUGFyZW50cywgcmVmZXJlbmNlLCBwb3BwZXIsIGJvdHRvbSwgdG9wLCByaWdodCwgYmFzZVBsYWNlbWVudHMsIHZpZXdwb3J0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBtZXJnZVBhZGRpbmdPYmplY3QgZnJvbSBcIi4vbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuL2V4cGFuZFRvSGFzaE1hcC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRldGVjdE92ZXJmbG93KHN0YXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMkcGxhY2VtZW50ID0gX29wdGlvbnMucGxhY2VtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX29wdGlvbnMkcGxhY2VtZW50ID09PSB2b2lkIDAgPyBzdGF0ZS5wbGFjZW1lbnQgOiBfb3B0aW9ucyRwbGFjZW1lbnQsXG4gICAgICBfb3B0aW9ucyRib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucyRib3VuZGFyeSA9PT0gdm9pZCAwID8gY2xpcHBpbmdQYXJlbnRzIDogX29wdGlvbnMkYm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRyb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucyRyb290Qm91bmRhcnkgPT09IHZvaWQgMCA/IHZpZXdwb3J0IDogX29wdGlvbnMkcm9vdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZWxlbWVudENvbnRlID0gX29wdGlvbnMuZWxlbWVudENvbnRleHQsXG4gICAgICBlbGVtZW50Q29udGV4dCA9IF9vcHRpb25zJGVsZW1lbnRDb250ZSA9PT0gdm9pZCAwID8gcG9wcGVyIDogX29wdGlvbnMkZWxlbWVudENvbnRlLFxuICAgICAgX29wdGlvbnMkYWx0Qm91bmRhcnkgPSBfb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMkYWx0Qm91bmRhcnkgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucyRwYWRkaW5nID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkcGFkZGluZztcbiAgdmFyIHBhZGRpbmdPYmplY3QgPSBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xuICB2YXIgYWx0Q29udGV4dCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyByZWZlcmVuY2UgOiBwb3BwZXI7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW2FsdEJvdW5kYXJ5ID8gYWx0Q29udGV4dCA6IGVsZW1lbnRDb250ZXh0XTtcbiAgdmFyIGNsaXBwaW5nQ2xpZW50UmVjdCA9IGdldENsaXBwaW5nUmVjdChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50IDogZWxlbWVudC5jb250ZXh0RWxlbWVudCB8fCBnZXREb2N1bWVudEVsZW1lbnQoc3RhdGUuZWxlbWVudHMucG9wcGVyKSwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSk7XG4gIHZhciByZWZlcmVuY2VDbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHN0YXRlLmVsZW1lbnRzLnJlZmVyZW5jZSk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlQ2xpZW50UmVjdCxcbiAgICBlbGVtZW50OiBwb3BwZXJSZWN0LFxuICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pO1xuICB2YXIgcG9wcGVyQ2xpZW50UmVjdCA9IHJlY3RUb0NsaWVudFJlY3QoT2JqZWN0LmFzc2lnbih7fSwgcG9wcGVyUmVjdCwgcG9wcGVyT2Zmc2V0cykpO1xuICB2YXIgZWxlbWVudENsaWVudFJlY3QgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcG9wcGVyQ2xpZW50UmVjdCA6IHJlZmVyZW5jZUNsaWVudFJlY3Q7IC8vIHBvc2l0aXZlID0gb3ZlcmZsb3dpbmcgdGhlIGNsaXBwaW5nIHJlY3RcbiAgLy8gMCBvciBuZWdhdGl2ZSA9IHdpdGhpbiB0aGUgY2xpcHBpbmcgcmVjdFxuXG4gIHZhciBvdmVyZmxvd09mZnNldHMgPSB7XG4gICAgdG9wOiBjbGlwcGluZ0NsaWVudFJlY3QudG9wIC0gZWxlbWVudENsaWVudFJlY3QudG9wICsgcGFkZGluZ09iamVjdC50b3AsXG4gICAgYm90dG9tOiBlbGVtZW50Q2xpZW50UmVjdC5ib3R0b20gLSBjbGlwcGluZ0NsaWVudFJlY3QuYm90dG9tICsgcGFkZGluZ09iamVjdC5ib3R0b20sXG4gICAgbGVmdDogY2xpcHBpbmdDbGllbnRSZWN0LmxlZnQgLSBlbGVtZW50Q2xpZW50UmVjdC5sZWZ0ICsgcGFkZGluZ09iamVjdC5sZWZ0LFxuICAgIHJpZ2h0OiBlbGVtZW50Q2xpZW50UmVjdC5yaWdodCAtIGNsaXBwaW5nQ2xpZW50UmVjdC5yaWdodCArIHBhZGRpbmdPYmplY3QucmlnaHRcbiAgfTtcbiAgdmFyIG9mZnNldERhdGEgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldDsgLy8gT2Zmc2V0cyBjYW4gYmUgYXBwbGllZCBvbmx5IHRvIHRoZSBwb3BwZXIgZWxlbWVudFxuXG4gIGlmIChlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyICYmIG9mZnNldERhdGEpIHtcbiAgICB2YXIgb2Zmc2V0ID0gb2Zmc2V0RGF0YVtwbGFjZW1lbnRdO1xuICAgIE9iamVjdC5rZXlzKG92ZXJmbG93T2Zmc2V0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgbXVsdGlwbHkgPSBbcmlnaHQsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAxIDogLTE7XG4gICAgICB2YXIgYXhpcyA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAneScgOiAneCc7XG4gICAgICBvdmVyZmxvd09mZnNldHNba2V5XSArPSBvZmZzZXRbYXhpc10gKiBtdWx0aXBseTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBvdmVyZmxvd09mZnNldHM7XG59IiwiaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHZhcmlhdGlvblBsYWNlbWVudHMsIGJhc2VQbGFjZW1lbnRzLCBwbGFjZW1lbnRzIGFzIGFsbFBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgX29wdGlvbnMkYWxsb3dlZEF1dG9QID0gX29wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gX29wdGlvbnMkYWxsb3dlZEF1dG9QID09PSB2b2lkIDAgPyBhbGxQbGFjZW1lbnRzIDogX29wdGlvbnMkYWxsb3dlZEF1dG9QO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCk7XG4gIHZhciBwbGFjZW1lbnRzID0gdmFyaWF0aW9uID8gZmxpcFZhcmlhdGlvbnMgPyB2YXJpYXRpb25QbGFjZW1lbnRzIDogdmFyaWF0aW9uUGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gdmFyaWF0aW9uO1xuICB9KSA6IGJhc2VQbGFjZW1lbnRzO1xuICB2YXIgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFsbG93ZWRBdXRvUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCkgPj0gMDtcbiAgfSk7XG5cbiAgaWYgKGFsbG93ZWRQbGFjZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cztcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoWydQb3BwZXI6IFRoZSBgYWxsb3dlZEF1dG9QbGFjZW1lbnRzYCBvcHRpb24gZGlkIG5vdCBhbGxvdyBhbnknLCAncGxhY2VtZW50cy4gRW5zdXJlIHRoZSBgcGxhY2VtZW50YCBvcHRpb24gbWF0Y2hlcyB0aGUgdmFyaWF0aW9uJywgJ29mIHRoZSBhbGxvd2VkIHBsYWNlbWVudHMuJywgJ0ZvciBleGFtcGxlLCBcImF1dG9cIiBjYW5ub3QgYmUgdXNlZCB0byBhbGxvdyBcImJvdHRvbS1zdGFydFwiLicsICdVc2UgXCJhdXRvLXN0YXJ0XCIgaW5zdGVhZC4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS10eXBlXTogRmxvdyBzZWVtcyB0byBoYXZlIHByb2JsZW1zIHdpdGggdHdvIGFycmF5IHVuaW9ucy4uLlxuXG5cbiAgdmFyIG92ZXJmbG93cyA9IGFsbG93ZWRQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pW2dldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KV07XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3ZlcmZsb3dzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93c1thXSAtIG92ZXJmbG93c1tiXTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldE9wcG9zaXRlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBjb21wdXRlQXV0b1BsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZUF1dG9QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IGJvdHRvbSwgdG9wLCBzdGFydCwgcmlnaHQsIGxlZnQsIGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmZ1bmN0aW9uIGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBpZiAoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9wcG9zaXRlUGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgcmV0dXJuIFtnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpLCBvcHBvc2l0ZVBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQob3Bwb3NpdGVQbGFjZW1lbnQpXTtcbn1cblxuZnVuY3Rpb24gZmxpcChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyA9IG9wdGlvbnMuZmFsbGJhY2tQbGFjZW1lbnRzLFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZmxpcFZhcmlhdGlvID0gb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMkZmxpcFZhcmlhdGlvID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZmxpcFZhcmlhdGlvLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHM7XG4gIHZhciBwcmVmZXJyZWRQbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSBiYXNlUGxhY2VtZW50ID09PSBwcmVmZXJyZWRQbGFjZW1lbnQ7XG4gIHZhciBmYWxsYmFja1BsYWNlbWVudHMgPSBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgfHwgKGlzQmFzZVBsYWNlbWVudCB8fCAhZmxpcFZhcmlhdGlvbnMgPyBbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KV0gOiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwcmVmZXJyZWRQbGFjZW1lbnQpKTtcbiAgdmFyIHBsYWNlbWVudHMgPSBbcHJlZmVycmVkUGxhY2VtZW50XS5jb25jYXQoZmFsbGJhY2tQbGFjZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvID8gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnM6IGZsaXBWYXJpYXRpb25zLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzOiBhbGxvd2VkQXV0b1BsYWNlbWVudHNcbiAgICB9KSA6IHBsYWNlbWVudCk7XG4gIH0sIFtdKTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgY2hlY2tzTWFwID0gbmV3IE1hcCgpO1xuICB2YXIgbWFrZUZhbGxiYWNrQ2hlY2tzID0gdHJ1ZTtcbiAgdmFyIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHNbMF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBsYWNlbWVudCA9IHBsYWNlbWVudHNbaV07XG5cbiAgICB2YXIgX2Jhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICB2YXIgaXNTdGFydFZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSBzdGFydDtcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihfYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KTtcbiAgICB2YXIgbWFpblZhcmlhdGlvblNpZGUgPSBpc1ZlcnRpY2FsID8gaXNTdGFydFZhcmlhdGlvbiA/IHJpZ2h0IDogbGVmdCA6IGlzU3RhcnRWYXJpYXRpb24gPyBib3R0b20gOiB0b3A7XG5cbiAgICBpZiAocmVmZXJlbmNlUmVjdFtsZW5dID4gcG9wcGVyUmVjdFtsZW5dKSB7XG4gICAgICBtYWluVmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB9XG5cbiAgICB2YXIgYWx0VmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB2YXIgY2hlY2tzID0gW107XG5cbiAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbX2Jhc2VQbGFjZW1lbnRdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W21haW5WYXJpYXRpb25TaWRlXSA8PSAwLCBvdmVyZmxvd1thbHRWYXJpYXRpb25TaWRlXSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tzLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH0pKSB7XG4gICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gICAgICBtYWtlRmFsbGJhY2tDaGVja3MgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNoZWNrc01hcC5zZXQocGxhY2VtZW50LCBjaGVja3MpO1xuICB9XG5cbiAgaWYgKG1ha2VGYWxsYmFja0NoZWNrcykge1xuICAgIC8vIGAyYCBtYXkgYmUgZGVzaXJlZCBpbiBzb21lIGNhc2VzIOKAkyByZXNlYXJjaCBsYXRlclxuICAgIHZhciBudW1iZXJPZkNoZWNrcyA9IGZsaXBWYXJpYXRpb25zID8gMyA6IDE7XG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChfaSkge1xuICAgICAgdmFyIGZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzLmZpbmQoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgICAgICB2YXIgY2hlY2tzID0gY2hlY2tzTWFwLmdldChwbGFjZW1lbnQpO1xuXG4gICAgICAgIGlmIChjaGVja3MpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tzLnNsaWNlKDAsIF9pKS5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVjaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IGZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pID0gbnVtYmVyT2ZDaGVja3M7IF9pID4gMDsgX2ktLSkge1xuICAgICAgdmFyIF9yZXQgPSBfbG9vcChfaSk7XG5cbiAgICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5wbGFjZW1lbnQgIT09IGZpcnN0Rml0dGluZ1BsYWNlbWVudCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXAgPSB0cnVlO1xuICAgIHN0YXRlLnBsYWNlbWVudCA9IGZpcnN0Rml0dGluZ1BsYWNlbWVudDtcbiAgICBzdGF0ZS5yZXNldCA9IHRydWU7XG4gIH1cbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2ZsaXAnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogZmxpcCxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXSxcbiAgZGF0YToge1xuICAgIF9za2lwOiBmYWxzZVxuICB9XG59OyIsImltcG9ydCB7IHRvcCwgYm90dG9tLCBsZWZ0LCByaWdodCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuXG5mdW5jdGlvbiBnZXRTaWRlT2Zmc2V0cyhvdmVyZmxvdywgcmVjdCwgcHJldmVudGVkT2Zmc2V0cykge1xuICBpZiAocHJldmVudGVkT2Zmc2V0cyA9PT0gdm9pZCAwKSB7XG4gICAgcHJldmVudGVkT2Zmc2V0cyA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiBvdmVyZmxvdy50b3AgLSByZWN0LmhlaWdodCAtIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICByaWdodDogb3ZlcmZsb3cucmlnaHQgLSByZWN0LndpZHRoICsgcHJldmVudGVkT2Zmc2V0cy54LFxuICAgIGJvdHRvbTogb3ZlcmZsb3cuYm90dG9tIC0gcmVjdC5oZWlnaHQgKyBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgbGVmdDogb3ZlcmZsb3cubGVmdCAtIHJlY3Qud2lkdGggLSBwcmV2ZW50ZWRPZmZzZXRzLnhcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKG92ZXJmbG93KSB7XG4gIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XS5zb21lKGZ1bmN0aW9uIChzaWRlKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93W3NpZGVdID49IDA7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoaWRlKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHByZXZlbnRlZE9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnByZXZlbnRPdmVyZmxvdztcbiAgdmFyIHJlZmVyZW5jZU92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBlbGVtZW50Q29udGV4dDogJ3JlZmVyZW5jZSdcbiAgfSk7XG4gIHZhciBwb3BwZXJBbHRPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYWx0Qm91bmRhcnk6IHRydWVcbiAgfSk7XG4gIHZhciByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhyZWZlcmVuY2VPdmVyZmxvdywgcmVmZXJlbmNlUmVjdCk7XG4gIHZhciBwb3BwZXJFc2NhcGVPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocG9wcGVyQWx0T3ZlcmZsb3csIHBvcHBlclJlY3QsIHByZXZlbnRlZE9mZnNldHMpO1xuICB2YXIgaXNSZWZlcmVuY2VIaWRkZW4gPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzKTtcbiAgdmFyIGhhc1BvcHBlckVzY2FwZWQgPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocG9wcGVyRXNjYXBlT2Zmc2V0cyk7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSB7XG4gICAgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzOiByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMsXG4gICAgcG9wcGVyRXNjYXBlT2Zmc2V0czogcG9wcGVyRXNjYXBlT2Zmc2V0cyxcbiAgICBpc1JlZmVyZW5jZUhpZGRlbjogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgaGFzUG9wcGVyRXNjYXBlZDogaGFzUG9wcGVyRXNjYXBlZFxuICB9O1xuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXJlZmVyZW5jZS1oaWRkZW4nOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICAnZGF0YS1wb3BwZXItZXNjYXBlZCc6IGhhc1BvcHBlckVzY2FwZWRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdoaWRlJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXSxcbiAgZm46IGhpZGVcbn07IiwiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIHBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHJlY3RzLCBvZmZzZXQpIHtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHZhciBpbnZlcnREaXN0YW5jZSA9IFtsZWZ0LCB0b3BdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IC0xIDogMTtcblxuICB2YXIgX3JlZiA9IHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicgPyBvZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgcmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KSkgOiBvZmZzZXQsXG4gICAgICBza2lkZGluZyA9IF9yZWZbMF0sXG4gICAgICBkaXN0YW5jZSA9IF9yZWZbMV07XG5cbiAgc2tpZGRpbmcgPSBza2lkZGluZyB8fCAwO1xuICBkaXN0YW5jZSA9IChkaXN0YW5jZSB8fCAwKSAqIGludmVydERpc3RhbmNlO1xuICByZXR1cm4gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyB7XG4gICAgeDogZGlzdGFuY2UsXG4gICAgeTogc2tpZGRpbmdcbiAgfSA6IHtcbiAgICB4OiBza2lkZGluZyxcbiAgICB5OiBkaXN0YW5jZVxuICB9O1xufVxuXG5mdW5jdGlvbiBvZmZzZXQoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmMi5uYW1lO1xuICB2YXIgX29wdGlvbnMkb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQsXG4gICAgICBvZmZzZXQgPSBfb3B0aW9ucyRvZmZzZXQgPT09IHZvaWQgMCA/IFswLCAwXSA6IF9vcHRpb25zJG9mZnNldDtcbiAgdmFyIGRhdGEgPSBwbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgc3RhdGUucmVjdHMsIG9mZnNldCk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICB2YXIgX2RhdGEkc3RhdGUkcGxhY2VtZW50ID0gZGF0YVtzdGF0ZS5wbGFjZW1lbnRdLFxuICAgICAgeCA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC54LFxuICAgICAgeSA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC55O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy54ICs9IHg7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnkgKz0geTtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb2Zmc2V0JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICBmbjogb2Zmc2V0XG59OyIsImltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZU9mZnNldHMuanNcIjtcblxuZnVuY3Rpb24gcG9wcGVyT2Zmc2V0cyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICAvLyBPZmZzZXRzIGFyZSB0aGUgYWN0dWFsIHBvc2l0aW9uIHRoZSBwb3BwZXIgbmVlZHMgdG8gaGF2ZSB0byBiZVxuICAvLyBwcm9wZXJseSBwb3NpdGlvbmVkIG5lYXIgaXRzIHJlZmVyZW5jZSBlbGVtZW50XG4gIC8vIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgcGxhY2VtZW50LCBhbmQgd2lsbCBiZSBhZGp1c3RlZCBieVxuICAvLyB0aGUgbW9kaWZpZXJzIGluIHRoZSBuZXh0IHN0ZXBcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHN0YXRlLnJlY3RzLnJlZmVyZW5jZSxcbiAgICBlbGVtZW50OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwb3BwZXJPZmZzZXRzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdyZWFkJyxcbiAgZm46IHBvcHBlck9mZnNldHMsXG4gIGRhdGE6IHt9XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEFsdEF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufSIsImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgc3RhcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRBbHRBeGlzIGZyb20gXCIuLi91dGlscy9nZXRBbHRBeGlzLmpzXCI7XG5pbXBvcnQgd2l0aGluIGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuLi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanNcIjtcbmltcG9ydCB7IG1heCBhcyBtYXRoTWF4LCBtaW4gYXMgbWF0aE1pbiB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIF9vcHRpb25zJHRldGhlciA9IG9wdGlvbnMudGV0aGVyLFxuICAgICAgdGV0aGVyID0gX29wdGlvbnMkdGV0aGVyID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkdGV0aGVyLFxuICAgICAgX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID0gb3B0aW9ucy50ZXRoZXJPZmZzZXQsXG4gICAgICB0ZXRoZXJPZmZzZXQgPSBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQ7XG4gIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5XG4gIH0pO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gIXZhcmlhdGlvbjtcbiAgdmFyIG1haW5BeGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgYWx0QXhpcyA9IGdldEFsdEF4aXMobWFpbkF4aXMpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgdGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gdGV0aGVyT2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogdGV0aGVyT2Zmc2V0O1xuICB2YXIgZGF0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hlY2tNYWluQXhpcyB8fCBjaGVja0FsdEF4aXMpIHtcbiAgICB2YXIgbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgICB2YXIgYWx0U2lkZSA9IG1haW5BeGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc107XG4gICAgdmFyIG1pbiA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdICsgb3ZlcmZsb3dbbWFpblNpZGVdO1xuICAgIHZhciBtYXggPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSAtIG92ZXJmbG93W2FsdFNpZGVdO1xuICAgIHZhciBhZGRpdGl2ZSA9IHRldGhlciA/IC1wb3BwZXJSZWN0W2xlbl0gLyAyIDogMDtcbiAgICB2YXIgbWluTGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IHJlZmVyZW5jZVJlY3RbbGVuXSA6IHBvcHBlclJlY3RbbGVuXTtcbiAgICB2YXIgbWF4TGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IC1wb3BwZXJSZWN0W2xlbl0gOiAtcmVmZXJlbmNlUmVjdFtsZW5dOyAvLyBXZSBuZWVkIHRvIGluY2x1ZGUgdGhlIGFycm93IGluIHRoZSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJyb3cgZG9lc24ndCBnb1xuICAgIC8vIG91dHNpZGUgdGhlIHJlZmVyZW5jZSBib3VuZHNcblxuICAgIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgICB2YXIgYXJyb3dSZWN0ID0gdGV0aGVyICYmIGFycm93RWxlbWVudCA/IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KSA6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nT2JqZWN0ID0gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddID8gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddLnBhZGRpbmcgOiBnZXRGcmVzaFNpZGVPYmplY3QoKTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWluID0gYXJyb3dQYWRkaW5nT2JqZWN0W21haW5TaWRlXTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWF4ID0gYXJyb3dQYWRkaW5nT2JqZWN0W2FsdFNpZGVdOyAvLyBJZiB0aGUgcmVmZXJlbmNlIGxlbmd0aCBpcyBzbWFsbGVyIHRoYW4gdGhlIGFycm93IGxlbmd0aCwgd2UgZG9uJ3Qgd2FudFxuICAgIC8vIHRvIGluY2x1ZGUgaXRzIGZ1bGwgc2l6ZSBpbiB0aGUgY2FsY3VsYXRpb24uIElmIHRoZSByZWZlcmVuY2UgaXMgc21hbGxcbiAgICAvLyBhbmQgbmVhciB0aGUgZWRnZSBvZiBhIGJvdW5kYXJ5LCB0aGUgcG9wcGVyIGNhbiBvdmVyZmxvdyBldmVuIGlmIHRoZVxuICAgIC8vIHJlZmVyZW5jZSBpcyBub3Qgb3ZlcmZsb3dpbmcgYXMgd2VsbCAoZS5nLiB2aXJ0dWFsIGVsZW1lbnRzIHdpdGggbm9cbiAgICAvLyB3aWR0aCBvciBoZWlnaHQpXG5cbiAgICB2YXIgYXJyb3dMZW4gPSB3aXRoaW4oMCwgcmVmZXJlbmNlUmVjdFtsZW5dLCBhcnJvd1JlY3RbbGVuXSk7XG4gICAgdmFyIG1pbk9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IHJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgLSBhZGRpdGl2ZSAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gdGV0aGVyT2Zmc2V0VmFsdWUgOiBtaW5MZW4gLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIHRldGhlck9mZnNldFZhbHVlO1xuICAgIHZhciBtYXhPZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyAtcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiArIGFkZGl0aXZlICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyB0ZXRoZXJPZmZzZXRWYWx1ZSA6IG1heExlbiArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgdGV0aGVyT2Zmc2V0VmFsdWU7XG4gICAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3cgJiYgZ2V0T2Zmc2V0UGFyZW50KHN0YXRlLmVsZW1lbnRzLmFycm93KTtcbiAgICB2YXIgY2xpZW50T2Zmc2V0ID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBtYWluQXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50VG9wIHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRMZWZ0IHx8IDAgOiAwO1xuICAgIHZhciBvZmZzZXRNb2RpZmllclZhbHVlID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQgPyBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldFtzdGF0ZS5wbGFjZW1lbnRdW21haW5BeGlzXSA6IDA7XG4gICAgdmFyIHRldGhlck1pbiA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdICsgbWluT2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIGNsaWVudE9mZnNldDtcbiAgICB2YXIgdGV0aGVyTWF4ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gKyBtYXhPZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIHZhciBwcmV2ZW50ZWRPZmZzZXQgPSB3aXRoaW4odGV0aGVyID8gbWF0aE1pbihtaW4sIHRldGhlck1pbikgOiBtaW4sIG9mZnNldCwgdGV0aGVyID8gbWF0aE1heChtYXgsIHRldGhlck1heCkgOiBtYXgpO1xuICAgICAgcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQ7XG4gICAgICBkYXRhW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldCAtIG9mZnNldDtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICB2YXIgX21haW5TaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IHRvcCA6IGxlZnQ7XG5cbiAgICAgIHZhciBfYWx0U2lkZSA9IG1haW5BeGlzID09PSAneCcgPyBib3R0b20gOiByaWdodDtcblxuICAgICAgdmFyIF9vZmZzZXQgPSBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdO1xuXG4gICAgICB2YXIgX21pbiA9IF9vZmZzZXQgKyBvdmVyZmxvd1tfbWFpblNpZGVdO1xuXG4gICAgICB2YXIgX21heCA9IF9vZmZzZXQgLSBvdmVyZmxvd1tfYWx0U2lkZV07XG5cbiAgICAgIHZhciBfcHJldmVudGVkT2Zmc2V0ID0gd2l0aGluKHRldGhlciA/IG1hdGhNaW4oX21pbiwgdGV0aGVyTWluKSA6IF9taW4sIF9vZmZzZXQsIHRldGhlciA/IG1hdGhNYXgoX21heCwgdGV0aGVyTWF4KSA6IF9tYXgpO1xuXG4gICAgICBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldDtcbiAgICAgIGRhdGFbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0IC0gX29mZnNldDtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBwcmV2ZW50T3ZlcmZsb3csXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J11cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0SFRNTEVsZW1lbnRTY3JvbGwoZWxlbWVudCkge1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3A6IGVsZW1lbnQuc2Nyb2xsVG9wXG4gIH07XG59IiwiaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEhUTUxFbGVtZW50U2Nyb2xsIGZyb20gXCIuL2dldEhUTUxFbGVtZW50U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlU2Nyb2xsKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IGdldFdpbmRvdyhub2RlKSB8fCAhaXNIVE1MRWxlbWVudChub2RlKSkge1xuICAgIHJldHVybiBnZXRXaW5kb3dTY3JvbGwobm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldEhUTUxFbGVtZW50U2Nyb2xsKG5vZGUpO1xuICB9XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXROb2RlU2Nyb2xsIGZyb20gXCIuL2dldE5vZGVTY3JvbGwuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50U2NhbGVkKGVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gcmVjdC53aWR0aCAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMTtcbiAgdmFyIHNjYWxlWSA9IHJlY3QuaGVpZ2h0IC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMTtcbiAgcmV0dXJuIHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDE7XG59IC8vIFJldHVybnMgdGhlIGNvbXBvc2l0ZSByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC5cbi8vIENvbXBvc2l0ZSBtZWFucyBpdCB0YWtlcyBpbnRvIGFjY291bnQgdHJhbnNmb3JtcyBhcyB3ZWxsIGFzIGxheW91dC5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wb3NpdGVSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnQsIGlzRml4ZWQpIHtcbiAgaWYgKGlzRml4ZWQgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudElzU2NhbGVkID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzRWxlbWVudFNjYWxlZChvZmZzZXRQYXJlbnQpO1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnRJc1NjYWxlZCk7XG4gIHZhciBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgdmFyIG9mZnNldHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50IHx8ICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCkge1xuICAgIGlmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpICE9PSAnYm9keScgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMDc4XG4gICAgaXNTY3JvbGxQYXJlbnQoZG9jdW1lbnRFbGVtZW50KSkge1xuICAgICAgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChvZmZzZXRQYXJlbnQpO1xuICAgIH1cblxuICAgIGlmIChpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkpIHtcbiAgICAgIG9mZnNldHMgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50LCB0cnVlKTtcbiAgICAgIG9mZnNldHMueCArPSBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgIG9mZnNldHMueSArPSBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBvZmZzZXRzLnggPSBnZXRXaW5kb3dTY3JvbGxCYXJYKGRvY3VtZW50RWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiByZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIG9mZnNldHMueCxcbiAgICB5OiByZWN0LnRvcCArIHNjcm9sbC5zY3JvbGxUb3AgLSBvZmZzZXRzLnksXG4gICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICB9O1xufSIsImltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIHNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk4NzUyNTVcblxuZnVuY3Rpb24gb3JkZXIobW9kaWZpZXJzKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwKCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IFNldCgpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIG1hcC5zZXQobW9kaWZpZXIubmFtZSwgbW9kaWZpZXIpO1xuICB9KTsgLy8gT24gdmlzaXRpbmcgb2JqZWN0LCBjaGVjayBmb3IgaXRzIGRlcGVuZGVuY2llcyBhbmQgdmlzaXQgdGhlbSByZWN1cnNpdmVseVxuXG4gIGZ1bmN0aW9uIHNvcnQobW9kaWZpZXIpIHtcbiAgICB2aXNpdGVkLmFkZChtb2RpZmllci5uYW1lKTtcbiAgICB2YXIgcmVxdWlyZXMgPSBbXS5jb25jYXQobW9kaWZpZXIucmVxdWlyZXMgfHwgW10sIG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMgfHwgW10pO1xuICAgIHJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKGRlcCkge1xuICAgICAgaWYgKCF2aXNpdGVkLmhhcyhkZXApKSB7XG4gICAgICAgIHZhciBkZXBNb2RpZmllciA9IG1hcC5nZXQoZGVwKTtcblxuICAgICAgICBpZiAoZGVwTW9kaWZpZXIpIHtcbiAgICAgICAgICBzb3J0KGRlcE1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKG1vZGlmaWVyKTtcbiAgfVxuXG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmICghdmlzaXRlZC5oYXMobW9kaWZpZXIubmFtZSkpIHtcbiAgICAgIC8vIGNoZWNrIGZvciB2aXNpdGVkIG9iamVjdFxuICAgICAgc29ydChtb2RpZmllcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkZXJNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIC8vIG9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xuICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyKG1vZGlmaWVycyk7IC8vIG9yZGVyIGJhc2VkIG9uIHBoYXNlXG5cbiAgcmV0dXJuIG1vZGlmaWVyUGhhc2VzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwaGFzZSkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLnBoYXNlID09PSBwaGFzZTtcbiAgICB9KSk7XG4gIH0sIFtdKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0KHN0cikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KGFyZ3MpLnJlZHVjZShmdW5jdGlvbiAocCwgYykge1xuICAgIHJldHVybiBwLnJlcGxhY2UoLyVzLywgYyk7XG4gIH0sIHN0cik7XG59IiwiaW1wb3J0IGZvcm1hdCBmcm9tIFwiLi9mb3JtYXQuanNcIjtcbmltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9NT0RJRklFUl9FUlJPUiA9ICdQb3BwZXI6IG1vZGlmaWVyIFwiJXNcIiBwcm92aWRlZCBhbiBpbnZhbGlkICVzIHByb3BlcnR5LCBleHBlY3RlZCAlcyBidXQgZ290ICVzJztcbnZhciBNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IgPSAnUG9wcGVyOiBtb2RpZmllciBcIiVzXCIgcmVxdWlyZXMgXCIlc1wiLCBidXQgXCIlc1wiIG1vZGlmaWVyIGlzIG5vdCBhdmFpbGFibGUnO1xudmFyIFZBTElEX1BST1BFUlRJRVMgPSBbJ25hbWUnLCAnZW5hYmxlZCcsICdwaGFzZScsICdmbicsICdlZmZlY3QnLCAncmVxdWlyZXMnLCAnb3B0aW9ucyddO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmFsaWRhdGVNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIFtdLmNvbmNhdChPYmplY3Qua2V5cyhtb2RpZmllciksIFZBTElEX1BST1BFUlRJRVMpIC8vIElFMTEtY29tcGF0aWJsZSByZXBsYWNlbWVudCBmb3IgYG5ldyBTZXQoaXRlcmFibGUpYFxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmllci5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgU3RyaW5nKG1vZGlmaWVyLm5hbWUpLCAnXCJuYW1lXCInLCAnXCJzdHJpbmdcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLm5hbWUpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmVuYWJsZWQgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZW5hYmxlZFwiJywgJ1wiYm9vbGVhblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZW5hYmxlZCkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3BoYXNlJzpcbiAgICAgICAgICBpZiAobW9kaWZpZXJQaGFzZXMuaW5kZXhPZihtb2RpZmllci5waGFzZSkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJwaGFzZVwiJywgXCJlaXRoZXIgXCIgKyBtb2RpZmllclBoYXNlcy5qb2luKCcsICcpLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5waGFzZSkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2ZuJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJmblwiJywgJ1wiZnVuY3Rpb25cIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLmZuKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZWZmZWN0JzpcbiAgICAgICAgICBpZiAobW9kaWZpZXIuZWZmZWN0ICE9IG51bGwgJiYgdHlwZW9mIG1vZGlmaWVyLmVmZmVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZWZmZWN0XCInLCAnXCJmdW5jdGlvblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZm4pICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdyZXF1aXJlcyc6XG4gICAgICAgICAgaWYgKG1vZGlmaWVyLnJlcXVpcmVzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobW9kaWZpZXIucmVxdWlyZXMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc1wiJywgJ1wiYXJyYXlcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLnJlcXVpcmVzKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncmVxdWlyZXNJZkV4aXN0cyc6XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc0lmRXhpc3RzXCInLCAnXCJhcnJheVwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cykgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ29wdGlvbnMnOlxuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQb3BwZXJKUzogYW4gaW52YWxpZCBwcm9wZXJ0eSBoYXMgYmVlbiBwcm92aWRlZCB0byB0aGUgXFxcIlwiICsgbW9kaWZpZXIubmFtZSArIFwiXFxcIiBtb2RpZmllciwgdmFsaWQgcHJvcGVydGllcyBhcmUgXCIgKyBWQUxJRF9QUk9QRVJUSUVTLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgcmV0dXJuIFwiXFxcIlwiICsgcyArIFwiXFxcIlwiO1xuICAgICAgICAgIH0pLmpvaW4oJywgJykgKyBcIjsgYnV0IFxcXCJcIiArIGtleSArIFwiXFxcIiB3YXMgcHJvdmlkZWQuXCIpO1xuICAgICAgfVxuXG4gICAgICBtb2RpZmllci5yZXF1aXJlcyAmJiBtb2RpZmllci5yZXF1aXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXF1aXJlbWVudCkge1xuICAgICAgICBpZiAobW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgIHJldHVybiBtb2QubmFtZSA9PT0gcmVxdWlyZW1lbnQ7XG4gICAgICAgIH0pID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IsIFN0cmluZyhtb2RpZmllci5uYW1lKSwgcmVxdWlyZW1lbnQsIHJlcXVpcmVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1bmlxdWVCeShhcnIsIGZuKSB7XG4gIHZhciBpZGVudGlmaWVycyA9IG5ldyBTZXQoKTtcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB2YXIgaWRlbnRpZmllciA9IGZuKGl0ZW0pO1xuXG4gICAgaWYgKCFpZGVudGlmaWVycy5oYXMoaWRlbnRpZmllcikpIHtcbiAgICAgIGlkZW50aWZpZXJzLmFkZChpZGVudGlmaWVyKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VCeU5hbWUobW9kaWZpZXJzKSB7XG4gIHZhciBtZXJnZWQgPSBtb2RpZmllcnMucmVkdWNlKGZ1bmN0aW9uIChtZXJnZWQsIGN1cnJlbnQpIHtcbiAgICB2YXIgZXhpc3RpbmcgPSBtZXJnZWRbY3VycmVudC5uYW1lXTtcbiAgICBtZXJnZWRbY3VycmVudC5uYW1lXSA9IGV4aXN0aW5nID8gT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcsIGN1cnJlbnQsIHtcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLm9wdGlvbnMsIGN1cnJlbnQub3B0aW9ucyksXG4gICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5kYXRhLCBjdXJyZW50LmRhdGEpXG4gICAgfSkgOiBjdXJyZW50O1xuICAgIHJldHVybiBtZXJnZWQ7XG4gIH0sIHt9KTsgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IE9iamVjdC52YWx1ZXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VkKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBtZXJnZWRba2V5XTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldENvbXBvc2l0ZVJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgb3JkZXJNb2RpZmllcnMgZnJvbSBcIi4vdXRpbHMvb3JkZXJNb2RpZmllcnMuanNcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiLi91dGlscy9kZWJvdW5jZS5qc1wiO1xuaW1wb3J0IHZhbGlkYXRlTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgdW5pcXVlQnkgZnJvbSBcIi4vdXRpbHMvdW5pcXVlQnkuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBtZXJnZUJ5TmFtZSBmcm9tIFwiLi91dGlscy9tZXJnZUJ5TmFtZS5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9FTEVNRU5UX0VSUk9SID0gJ1BvcHBlcjogSW52YWxpZCByZWZlcmVuY2Ugb3IgcG9wcGVyIGFyZ3VtZW50IHByb3ZpZGVkLiBUaGV5IG11c3QgYmUgZWl0aGVyIGEgRE9NIGVsZW1lbnQgb3IgdmlydHVhbCBlbGVtZW50Lic7XG52YXIgSU5GSU5JVEVfTE9PUF9FUlJPUiA9ICdQb3BwZXI6IEFuIGluZmluaXRlIGxvb3AgaW4gdGhlIG1vZGlmaWVycyBjeWNsZSBoYXMgYmVlbiBkZXRlY3RlZCEgVGhlIGN5Y2xlIGhhcyBiZWVuIGludGVycnVwdGVkIHRvIHByZXZlbnQgYSBicm93c2VyIGNyYXNoLic7XG52YXIgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBtb2RpZmllcnM6IFtdLFxuICBzdHJhdGVneTogJ2Fic29sdXRlJ1xufTtcblxuZnVuY3Rpb24gYXJlVmFsaWRFbGVtZW50cygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiAhYXJncy5zb21lKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuICEoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHBlckdlbmVyYXRvcihnZW5lcmF0b3JPcHRpb25zKSB7XG4gIGlmIChnZW5lcmF0b3JPcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBnZW5lcmF0b3JPcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX2dlbmVyYXRvck9wdGlvbnMgPSBnZW5lcmF0b3JPcHRpb25zLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE1vZGlmaWVycyxcbiAgICAgIGRlZmF1bHRNb2RpZmllcnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPT09IHZvaWQgMCA/IFtdIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuICAgICAgZGVmYXVsdE9wdGlvbnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID09PSB2b2lkIDAgPyBERUZBVUxUX09QVElPTlMgOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyO1xuICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICBvcmRlcmVkTW9kaWZpZXJzOiBbXSxcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMpLFxuICAgICAgbW9kaWZpZXJzRGF0YToge30sXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcbiAgICAgICAgcG9wcGVyOiBwb3BwZXJcbiAgICAgIH0sXG4gICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgIHN0eWxlczoge31cbiAgICB9O1xuICAgIHZhciBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgdmFyIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgc2V0T3B0aW9uczogZnVuY3Rpb24gc2V0T3B0aW9ucyhzZXRPcHRpb25zQWN0aW9uKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIHNldE9wdGlvbnNBY3Rpb24gPT09ICdmdW5jdGlvbicgPyBzZXRPcHRpb25zQWN0aW9uKHN0YXRlLm9wdGlvbnMpIDogc2V0T3B0aW9uc0FjdGlvbjtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBzdGF0ZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHN0YXRlLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogaXNFbGVtZW50KHJlZmVyZW5jZSkgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UpIDogcmVmZXJlbmNlLmNvbnRleHRFbGVtZW50ID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlLmNvbnRleHRFbGVtZW50KSA6IFtdLFxuICAgICAgICAgIHBvcHBlcjogbGlzdFNjcm9sbFBhcmVudHMocG9wcGVyKVxuICAgICAgICB9OyAvLyBPcmRlcnMgdGhlIG1vZGlmaWVycyBiYXNlZCBvbiB0aGVpciBkZXBlbmRlbmNpZXMgYW5kIGBwaGFzZWBcbiAgICAgICAgLy8gcHJvcGVydGllc1xuXG4gICAgICAgIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJNb2RpZmllcnMobWVyZ2VCeU5hbWUoW10uY29uY2F0KGRlZmF1bHRNb2RpZmllcnMsIHN0YXRlLm9wdGlvbnMubW9kaWZpZXJzKSkpOyAvLyBTdHJpcCBvdXQgZGlzYWJsZWQgbW9kaWZpZXJzXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uZW5hYmxlZDtcbiAgICAgICAgfSk7IC8vIFZhbGlkYXRlIHRoZSBwcm92aWRlZCBtb2RpZmllcnMgc28gdGhhdCB0aGUgY29uc3VtZXIgd2lsbCBnZXQgd2FybmVkXG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgbW9kaWZpZXJzIGlzIGludmFsaWQgZm9yIGFueSByZWFzb25cblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgdmFyIG1vZGlmaWVycyA9IHVuaXF1ZUJ5KFtdLmNvbmNhdChvcmRlcmVkTW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycyksIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZTtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhbGlkYXRlTW9kaWZpZXJzKG1vZGlmaWVycyk7XG5cbiAgICAgICAgICBpZiAoZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5vcHRpb25zLnBsYWNlbWVudCkgPT09IGF1dG8pIHtcbiAgICAgICAgICAgIHZhciBmbGlwTW9kaWZpZXIgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICAgICAgICAgIHZhciBuYW1lID0gX3JlZjIubmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT09ICdmbGlwJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWZsaXBNb2RpZmllcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBcImF1dG9cIiBwbGFjZW1lbnRzIHJlcXVpcmUgdGhlIFwiZmxpcFwiIG1vZGlmaWVyIGJlJywgJ3ByZXNlbnQgYW5kIGVuYWJsZWQgdG8gd29yay4nXS5qb2luKCcgJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZ2V0Q29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUocG9wcGVyKSxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luVG9wLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodCA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpblJpZ2h0LFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgICAgIG1hcmdpbkxlZnQgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5MZWZ0OyAvLyBXZSBubyBsb25nZXIgdGFrZSBpbnRvIGFjY291bnQgYG1hcmdpbnNgIG9uIHRoZSBwb3BwZXIsIGFuZCBpdCBjYW5cbiAgICAgICAgICAvLyBjYXVzZSBidWdzIHdpdGggcG9zaXRpb25pbmcsIHNvIHdlJ2xsIHdhcm4gdGhlIGNvbnN1bWVyXG5cblxuICAgICAgICAgIGlmIChbbWFyZ2luVG9wLCBtYXJnaW5SaWdodCwgbWFyZ2luQm90dG9tLCBtYXJnaW5MZWZ0XS5zb21lKGZ1bmN0aW9uIChtYXJnaW4pIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG1hcmdpbik7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihbJ1BvcHBlcjogQ1NTIFwibWFyZ2luXCIgc3R5bGVzIGNhbm5vdCBiZSB1c2VkIHRvIGFwcGx5IHBhZGRpbmcnLCAnYmV0d2VlbiB0aGUgcG9wcGVyIGFuZCBpdHMgcmVmZXJlbmNlIGVsZW1lbnQgb3IgYm91bmRhcnkuJywgJ1RvIHJlcGxpY2F0ZSBtYXJnaW4sIHVzZSB0aGUgYG9mZnNldGAgbW9kaWZpZXIsIGFzIHdlbGwgYXMnLCAndGhlIGBwYWRkaW5nYCBvcHRpb24gaW4gdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIGFuZCBgZmxpcGAnLCAnbW9kaWZpZXJzLiddLmpvaW4oJyAnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcnVuTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIH0sXG4gICAgICAvLyBTeW5jIHVwZGF0ZSDigJMgaXQgd2lsbCBhbHdheXMgYmUgZXhlY3V0ZWQsIGV2ZW4gaWYgbm90IG5lY2Vzc2FyeS4gVGhpc1xuICAgICAgLy8gaXMgdXNlZnVsIGZvciBsb3cgZnJlcXVlbmN5IHVwZGF0ZXMgd2hlcmUgc3luYyBiZWhhdmlvciBzaW1wbGlmaWVzIHRoZVxuICAgICAgLy8gbG9naWMuXG4gICAgICAvLyBGb3IgaGlnaCBmcmVxdWVuY3kgdXBkYXRlcyAoZS5nLiBgcmVzaXplYCBhbmQgYHNjcm9sbGAgZXZlbnRzKSwgYWx3YXlzXG4gICAgICAvLyBwcmVmZXIgdGhlIGFzeW5jIFBvcHBlciN1cGRhdGUgbWV0aG9kXG4gICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gICAgICAgIGlmIChpc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3RhdGUkZWxlbWVudHMgPSBzdGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IF9zdGF0ZSRlbGVtZW50cy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBwb3BwZXIgPSBfc3RhdGUkZWxlbWVudHMucG9wcGVyOyAvLyBEb24ndCBwcm9jZWVkIGlmIGByZWZlcmVuY2VgIG9yIGBwb3BwZXJgIGFyZSBub3QgdmFsaWQgZWxlbWVudHNcbiAgICAgICAgLy8gYW55bW9yZVxuXG4gICAgICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKElOVkFMSURfRUxFTUVOVF9FUlJPUik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgYW5kIHBvcHBlciByZWN0cyB0byBiZSByZWFkIGJ5IG1vZGlmaWVyc1xuXG5cbiAgICAgICAgc3RhdGUucmVjdHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBnZXRDb21wb3NpdGVSZWN0KHJlZmVyZW5jZSwgZ2V0T2Zmc2V0UGFyZW50KHBvcHBlciksIHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCcpLFxuICAgICAgICAgIHBvcHBlcjogZ2V0TGF5b3V0UmVjdChwb3BwZXIpXG4gICAgICAgIH07IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIHJlc2V0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZS4gVGhlXG4gICAgICAgIC8vIG1vc3QgY29tbW9uIHVzZSBjYXNlIGZvciB0aGlzIGlzIHRoZSBgZmxpcGAgbW9kaWZpZXIgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIHBsYWNlbWVudCwgd2hpY2ggdGhlbiBuZWVkcyB0byByZS1ydW4gYWxsIHRoZSBtb2RpZmllcnMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIGxvZ2ljIHdhcyBwcmV2aW91c2x5IHJhbiBmb3IgdGhlIHByZXZpb3VzIHBsYWNlbWVudCBhbmQgaXMgdGhlcmVmb3JlXG4gICAgICAgIC8vIHN0YWxlL2luY29ycmVjdFxuXG4gICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50OyAvLyBPbiBlYWNoIHVwZGF0ZSBjeWNsZSwgdGhlIGBtb2RpZmllcnNEYXRhYCBwcm9wZXJ0eSBmb3IgZWFjaCBtb2RpZmllclxuICAgICAgICAvLyBpcyBmaWxsZWQgd2l0aCB0aGUgaW5pdGlhbCBkYXRhIHNwZWNpZmllZCBieSB0aGUgbW9kaWZpZXIuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gaXQgZG9lc24ndCBwZXJzaXN0IGFuZCBpcyBmcmVzaCBvbiBlYWNoIHVwZGF0ZS5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHBlcnNpc3RlbnQgZGF0YSwgdXNlIGAke25hbWV9I3BlcnNpc3RlbnRgXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5tb2RpZmllcnNEYXRhW21vZGlmaWVyLm5hbWVdID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kaWZpZXIuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgX19kZWJ1Z19sb29wc19fID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBfX2RlYnVnX2xvb3BzX18gKz0gMTtcblxuICAgICAgICAgICAgaWYgKF9fZGVidWdfbG9vcHNfXyA+IDEwMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKElORklOSVRFX0xPT1BfRVJST1IpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdGUucmVzZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICBpbmRleCA9IC0xO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZSA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnNbaW5kZXhdLFxuICAgICAgICAgICAgICBmbiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5mbixcbiAgICAgICAgICAgICAgX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5vcHRpb25zLFxuICAgICAgICAgICAgICBfb3B0aW9ucyA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPT09IHZvaWQgMCA/IHt9IDogX3N0YXRlJG9yZGVyZWRNb2RpZmllMixcbiAgICAgICAgICAgICAgbmFtZSA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5uYW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RhdGUgPSBmbih7XG4gICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgb3B0aW9uczogX29wdGlvbnMsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICAgICAgfSkgfHwgc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQXN5bmMgYW5kIG9wdGltaXN0aWNhbGx5IG9wdGltaXplZCB1cGRhdGUg4oCTIGl0IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IChkZWJvdW5jZWQgdG8gcnVuIGF0IG1vc3Qgb25jZS1wZXItdGljaylcbiAgICAgIHVwZGF0ZTogZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBpc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihJTlZBTElEX0VMRU1FTlRfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKCFpc0Rlc3Ryb3llZCAmJiBvcHRpb25zLm9uRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSBiZWZvcmUgdGhlIGZpcnN0XG4gICAgLy8gdXBkYXRlIGN5Y2xlIHJ1bnMuIFRoZXkgd2lsbCBiZSBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdXBkYXRlXG4gICAgLy8gY3ljbGUuIFRoaXMgaXMgdXNlZnVsIHdoZW4gYSBtb2RpZmllciBhZGRzIHNvbWUgcGVyc2lzdGVudCBkYXRhIHRoYXRcbiAgICAvLyBvdGhlciBtb2RpZmllcnMgbmVlZCB0byB1c2UsIGJ1dCB0aGUgbW9kaWZpZXIgaXMgcnVuIGFmdGVyIHRoZSBkZXBlbmRlbnRcbiAgICAvLyBvbmUuXG5cbiAgICBmdW5jdGlvbiBydW5Nb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgICAgIHZhciBuYW1lID0gX3JlZjMubmFtZSxcbiAgICAgICAgICAgIF9yZWYzJG9wdGlvbnMgPSBfcmVmMy5vcHRpb25zLFxuICAgICAgICAgICAgb3B0aW9ucyA9IF9yZWYzJG9wdGlvbnMgPT09IHZvaWQgMCA/IHt9IDogX3JlZjMkb3B0aW9ucyxcbiAgICAgICAgICAgIGVmZmVjdCA9IF9yZWYzLmVmZmVjdDtcblxuICAgICAgICBpZiAodHlwZW9mIGVmZmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhciBjbGVhbnVwRm4gPSBlZmZlY3Qoe1xuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBub29wRm4gPSBmdW5jdGlvbiBub29wRm4oKSB7fTtcblxuICAgICAgICAgIGVmZmVjdENsZWFudXBGbnMucHVzaChjbGVhbnVwRm4gfHwgbm9vcEZuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KTtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG59XG5leHBvcnQgdmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3IoKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBkZXRlY3RPdmVyZmxvdyB9OyIsImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xuaW1wb3J0IG9mZnNldCBmcm9tIFwiLi9tb2RpZmllcnMvb2Zmc2V0LmpzXCI7XG5pbXBvcnQgZmxpcCBmcm9tIFwiLi9tb2RpZmllcnMvZmxpcC5qc1wiO1xuaW1wb3J0IHByZXZlbnRPdmVyZmxvdyBmcm9tIFwiLi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgYXJyb3cgZnJvbSBcIi4vbW9kaWZpZXJzL2Fycm93LmpzXCI7XG5pbXBvcnQgaGlkZSBmcm9tIFwiLi9tb2RpZmllcnMvaGlkZS5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzLCBvZmZzZXQsIGZsaXAsIHByZXZlbnRPdmVyZmxvdywgYXJyb3csIGhpZGVdO1xudmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3Ioe1xuICBkZWZhdWx0TW9kaWZpZXJzOiBkZWZhdWx0TW9kaWZpZXJzXG59KTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIsIHBvcHBlckdlbmVyYXRvciwgZGVmYXVsdE1vZGlmaWVycywgZGV0ZWN0T3ZlcmZsb3cgfTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyTGl0ZSB9IGZyb20gXCIuL3BvcHBlci1saXRlLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0ICogZnJvbSBcIi4vbW9kaWZpZXJzL2luZGV4LmpzXCI7IiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHsgQXBwLCBJU3VnZ2VzdE93bmVyLCBTY29wZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlUG9wcGVyLCBJbnN0YW5jZSBhcyBQb3BwZXJJbnN0YW5jZSB9IGZyb20gXCJAcG9wcGVyanMvY29yZVwiO1xuXG5jb25zdCB3cmFwQXJvdW5kID0gKHZhbHVlOiBudW1iZXIsIHNpemU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICgodmFsdWUgJSBzaXplKSArIHNpemUpICUgc2l6ZTtcbn07XG5cbmNsYXNzIFN1Z2dlc3Q8VD4ge1xuICAgIHByaXZhdGUgb3duZXI6IElTdWdnZXN0T3duZXI8VD47XG4gICAgcHJpdmF0ZSB2YWx1ZXM6IFRbXTtcbiAgICBwcml2YXRlIHN1Z2dlc3Rpb25zOiBIVE1MRGl2RWxlbWVudFtdO1xuICAgIHByaXZhdGUgc2VsZWN0ZWRJdGVtOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgb3duZXI6IElTdWdnZXN0T3duZXI8VD4sXG4gICAgICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgc2NvcGU6IFNjb3BlXG4gICAgKSB7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbCA9IGNvbnRhaW5lckVsO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLm9uKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgXCIuc3VnZ2VzdGlvbi1pdGVtXCIsXG4gICAgICAgICAgICB0aGlzLm9uU3VnZ2VzdGlvbkNsaWNrLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgY29udGFpbmVyRWwub24oXG4gICAgICAgICAgICBcIm1vdXNlbW92ZVwiLFxuICAgICAgICAgICAgXCIuc3VnZ2VzdGlvbi1pdGVtXCIsXG4gICAgICAgICAgICB0aGlzLm9uU3VnZ2VzdGlvbk1vdXNlb3Zlci5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dVcFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaXNDb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbSh0aGlzLnNlbGVjdGVkSXRlbSAtIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dEb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pc0NvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKHRoaXMuc2VsZWN0ZWRJdGVtICsgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS5yZWdpc3RlcihbXSwgXCJFbnRlclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaXNDb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZVNlbGVjdGVkSXRlbShldmVudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN1Z2dlc3Rpb25DbGljayhldmVudDogTW91c2VFdmVudCwgZWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3VnZ2VzdGlvbnMuaW5kZXhPZihlbCk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKGl0ZW0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy51c2VTZWxlY3RlZEl0ZW0oZXZlbnQpO1xuICAgIH1cblxuICAgIG9uU3VnZ2VzdGlvbk1vdXNlb3ZlcihfZXZlbnQ6IE1vdXNlRXZlbnQsIGVsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdWdnZXN0aW9ucy5pbmRleE9mKGVsKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0oaXRlbSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHNldFN1Z2dlc3Rpb25zKHZhbHVlczogVFtdKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkVsczogSFRNTERpdkVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkVsID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoXCJzdWdnZXN0aW9uLWl0ZW1cIik7XG4gICAgICAgICAgICB0aGlzLm93bmVyLnJlbmRlclN1Z2dlc3Rpb24odmFsdWUsIHN1Z2dlc3Rpb25FbCk7XG4gICAgICAgICAgICBzdWdnZXN0aW9uRWxzLnB1c2goc3VnZ2VzdGlvbkVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uRWxzO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbSgwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdXNlU2VsZWN0ZWRJdGVtKGV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0aGlzLnZhbHVlc1t0aGlzLnNlbGVjdGVkSXRlbV07XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMub3duZXIuc2VsZWN0U3VnZ2VzdGlvbihjdXJyZW50VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNlbGVjdGVkSXRlbShzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEludG9WaWV3OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbmRleCA9IHdyYXBBcm91bmQoXG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGhcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zZWxlY3RlZEl0ZW1dO1xuICAgICAgICBjb25zdCBzZWxlY3RlZFN1Z2dlc3Rpb24gPSB0aGlzLnN1Z2dlc3Rpb25zW25vcm1hbGl6ZWRJbmRleF07XG5cbiAgICAgICAgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbj8ucmVtb3ZlQ2xhc3MoXCJpcy1zZWxlY3RlZFwiKTtcbiAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uPy5hZGRDbGFzcyhcImlzLXNlbGVjdGVkXCIpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gbm9ybWFsaXplZEluZGV4O1xuXG4gICAgICAgIGlmIChzY3JvbGxJbnRvVmlldykge1xuICAgICAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uLnNjcm9sbEludG9WaWV3KGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRleHRJbnB1dFN1Z2dlc3Q8VD4gaW1wbGVtZW50cyBJU3VnZ2VzdE93bmVyPFQ+IHtcbiAgICBwcm90ZWN0ZWQgYXBwOiBBcHA7XG4gICAgcHJvdGVjdGVkIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBwb3BwZXI6IFBvcHBlckluc3RhbmNlO1xuICAgIHByaXZhdGUgc2NvcGU6IFNjb3BlO1xuICAgIHByaXZhdGUgc3VnZ2VzdEVsOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHN1Z2dlc3Q6IFN1Z2dlc3Q8VD47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaW5wdXRFbDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoKTtcblxuICAgICAgICB0aGlzLnN1Z2dlc3RFbCA9IGNyZWF0ZURpdihcInN1Z2dlc3Rpb24tY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBzdWdnZXN0aW9uID0gdGhpcy5zdWdnZXN0RWwuY3JlYXRlRGl2KFwic3VnZ2VzdGlvblwiKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0ID0gbmV3IFN1Z2dlc3QodGhpcywgc3VnZ2VzdGlvbiwgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFc2NhcGVcIiwgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHRoaXMub25JbnB1dENoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5vbklucHV0Q2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc3VnZ2VzdEVsLm9uKFxuICAgICAgICAgICAgXCJtb3VzZWRvd25cIixcbiAgICAgICAgICAgIFwiLnN1Z2dlc3Rpb24tY29udGFpbmVyXCIsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2VkKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbnB1dFN0ciA9IHRoaXMuaW5wdXRFbC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSB0aGlzLmdldFN1Z2dlc3Rpb25zKGlucHV0U3RyKTtcblxuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0LnNldFN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICB0aGlzLm9wZW4oKDxhbnk+dGhpcy5hcHApLmRvbS5hcHBDb250YWluZXJFbCwgdGhpcy5pbnB1dEVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4oY29udGFpbmVyOiBIVE1MRWxlbWVudCwgaW5wdXRFbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgKDxhbnk+dGhpcy5hcHApLmtleW1hcC5wdXNoU2NvcGUodGhpcy5zY29wZSk7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc3VnZ2VzdEVsKTtcbiAgICAgICAgdGhpcy5wb3BwZXIgPSBjcmVhdGVQb3BwZXIoaW5wdXRFbCwgdGhpcy5zdWdnZXN0RWwsIHtcbiAgICAgICAgICAgIHBsYWNlbWVudDogXCJib3R0b20tc3RhcnRcIixcbiAgICAgICAgICAgIG1vZGlmaWVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzYW1lV2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZm46ICh7IHN0YXRlLCBpbnN0YW5jZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlOiBwb3NpdGlvbmluZyBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIHR3aWNlIC1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IHBhc3MgLSBwb3NpdGlvbmluZyBpdCBhY2NvcmRpbmcgdG8gdGhlIHdpZHRoIG9mIHRoZSBwb3BwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlY29uZCBwYXNzIC0gcG9zaXRpb24gaXQgd2l0aCB0aGUgd2lkdGggYm91bmQgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGVhcmx5IGV4aXQgdG8gYXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0V2lkdGggPSBgJHtzdGF0ZS5yZWN0cy5yZWZlcmVuY2Uud2lkdGh9cHhgO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnN0eWxlcy5wb3BwZXIud2lkdGggPT09IHRhcmdldFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuc3R5bGVzLnBvcHBlci53aWR0aCA9IHRhcmdldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiBcImJlZm9yZVdyaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzOiBbXCJjb21wdXRlU3R5bGVzXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgKDxhbnk+dGhpcy5hcHApLmtleW1hcC5wb3BTY29wZSh0aGlzLnNjb3BlKTtcblxuICAgICAgICB0aGlzLnN1Z2dlc3Quc2V0U3VnZ2VzdGlvbnMoW10pO1xuICAgICAgICBpZiAodGhpcy5wb3BwZXIpIHRoaXMucG9wcGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0RWwuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRbXTtcbiAgICBhYnN0cmFjdCByZW5kZXJTdWdnZXN0aW9uKGl0ZW06IFQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG4gICAgYWJzdHJhY3Qgc2VsZWN0U3VnZ2VzdGlvbihpdGVtOiBUKTogdm9pZDtcbn1cbiIsIi8vIENyZWRpdHMgZ28gdG8gTGlhbSdzIFBlcmlvZGljIE5vdGVzIFBsdWdpbjogaHR0cHM6Ly9naXRodWIuY29tL2xpYW1jYWluL29ic2lkaWFuLXBlcmlvZGljLW5vdGVzXG5cbmltcG9ydCB7IFRBYnN0cmFjdEZpbGUsIFRGb2xkZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRleHRJbnB1dFN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9zdWdnZXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJTdWdnZXN0IGV4dGVuZHMgVGV4dElucHV0U3VnZ2VzdDxURm9sZGVyPiB7XG4gICAgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRGb2xkZXJbXSB7XG4gICAgICAgIGNvbnN0IGFic3RyYWN0RmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRBbGxMb2FkZWRGaWxlcygpO1xuICAgICAgICBjb25zdCBmb2xkZXJzOiBURm9sZGVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJDYXNlSW5wdXRTdHIgPSBpbnB1dFN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGFic3RyYWN0RmlsZXMuZm9yRWFjaCgoZm9sZGVyOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlciAmJlxuICAgICAgICAgICAgICAgIGZvbGRlci5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJDYXNlSW5wdXRTdHIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb2xkZXJzLnB1c2goZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvbGRlcnM7XG4gICAgfVxuXG4gICAgcmVuZGVyU3VnZ2VzdGlvbihmaWxlOiBURm9sZGVyLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZWwuc2V0VGV4dChmaWxlLnBhdGgpO1xuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24oZmlsZTogVEZvbGRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgbm9ybWFsaXplUGF0aCxcbiAgICBUQWJzdHJhY3RGaWxlLFxuICAgIFRGaWxlLFxuICAgIFRGb2xkZXIsXG4gICAgVmF1bHQsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlX1JlZ0V4cChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZV90Zm9sZGVyKGFwcDogQXBwLCBmb2xkZXJfc3RyOiBzdHJpbmcpOiBURm9sZGVyIHtcbiAgICBmb2xkZXJfc3RyID0gbm9ybWFsaXplUGF0aChmb2xkZXJfc3RyKTtcblxuICAgIGNvbnN0IGZvbGRlciA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyX3N0cik7XG4gICAgaWYgKCFmb2xkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKGBGb2xkZXIgXCIke2ZvbGRlcl9zdHJ9XCIgZG9lc24ndCBleGlzdGApO1xuICAgIH1cbiAgICBpZiAoIShmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYCR7Zm9sZGVyX3N0cn0gaXMgYSBmaWxlLCBub3QgYSBmb2xkZXJgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZV90ZmlsZShhcHA6IEFwcCwgZmlsZV9zdHI6IHN0cmluZyk6IFRGaWxlIHtcbiAgICBmaWxlX3N0ciA9IG5vcm1hbGl6ZVBhdGgoZmlsZV9zdHIpO1xuXG4gICAgY29uc3QgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZV9zdHIpO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYEZpbGUgXCIke2ZpbGVfc3RyfVwiIGRvZXNuJ3QgZXhpc3RgKTtcbiAgICB9XG4gICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYCR7ZmlsZV9zdHJ9IGlzIGEgZm9sZGVyLCBub3QgYSBmaWxlYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgIGFwcDogQXBwLFxuICAgIGZvbGRlcl9zdHI6IHN0cmluZ1xuKTogQXJyYXk8VEZpbGU+IHtcbiAgICBjb25zdCBmb2xkZXIgPSByZXNvbHZlX3Rmb2xkZXIoYXBwLCBmb2xkZXJfc3RyKTtcblxuICAgIGNvbnN0IGZpbGVzOiBBcnJheTxURmlsZT4gPSBbXTtcbiAgICBWYXVsdC5yZWN1cnNlQ2hpbGRyZW4oZm9sZGVyLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmaWxlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhLmJhc2VuYW1lLmxvY2FsZUNvbXBhcmUoYi5iYXNlbmFtZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheW1vdmU8VD4oXG4gICAgYXJyOiBUW10sXG4gICAgZnJvbUluZGV4OiBudW1iZXIsXG4gICAgdG9JbmRleDogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAodG9JbmRleCA8IDAgfHwgdG9JbmRleCA9PT0gYXJyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGVsZW1lbnQgPSBhcnJbZnJvbUluZGV4XTtcbiAgICBhcnJbZnJvbUluZGV4XSA9IGFyclt0b0luZGV4XTtcbiAgICBhcnJbdG9JbmRleF0gPSBlbGVtZW50O1xufVxuIiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHsgQXBwLCBUQWJzdHJhY3RGaWxlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgVGV4dElucHV0U3VnZ2VzdCB9IGZyb20gXCJzdWdnZXN0ZXJzL3N1Z2dlc3RcIjtcbmltcG9ydCB7IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGVudW0gRmlsZVN1Z2dlc3RNb2RlIHtcbiAgICBUZW1wbGF0ZUZpbGVzLFxuICAgIFNjcmlwdEZpbGVzLFxufVxuXG5leHBvcnQgY2xhc3MgRmlsZVN1Z2dlc3QgZXh0ZW5kcyBUZXh0SW5wdXRTdWdnZXN0PFRGaWxlPiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBhcHA6IEFwcCxcbiAgICAgICAgcHVibGljIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4sXG4gICAgICAgIHByaXZhdGUgbW9kZTogRmlsZVN1Z2dlc3RNb2RlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgaW5wdXRFbCk7XG4gICAgfVxuXG4gICAgZ2V0X2ZvbGRlcihtb2RlOiBGaWxlU3VnZ2VzdE1vZGUpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRmlsZVN1Z2dlc3RNb2RlLlRlbXBsYXRlRmlsZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXI7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5TY3JpcHRGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9lcnJvcl9tc2cobW9kZTogRmlsZVN1Z2dlc3RNb2RlKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiBgVGVtcGxhdGVzIGZvbGRlciBkb2Vzbid0IGV4aXN0YDtcbiAgICAgICAgICAgIGNhc2UgRmlsZVN1Z2dlc3RNb2RlLlNjcmlwdEZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiBgVXNlciBTY3JpcHRzIGZvbGRlciBkb2Vzbid0IGV4aXN0YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKGlucHV0X3N0cjogc3RyaW5nKTogVEZpbGVbXSB7XG4gICAgICAgIGNvbnN0IGFsbF9maWxlcyA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAoKSA9PiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKHRoaXMuYXBwLCB0aGlzLmdldF9mb2xkZXIodGhpcy5tb2RlKSksXG4gICAgICAgICAgICB0aGlzLmdldF9lcnJvcl9tc2codGhpcy5tb2RlKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWFsbF9maWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJfaW5wdXRfc3RyID0gaW5wdXRfc3RyLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgYWxsX2ZpbGVzLmZvckVhY2goKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBmaWxlIGluc3RhbmNlb2YgVEZpbGUgJiZcbiAgICAgICAgICAgICAgICBmaWxlLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmXG4gICAgICAgICAgICAgICAgZmlsZS5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJfaW5wdXRfc3RyKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIHJlbmRlclN1Z2dlc3Rpb24oZmlsZTogVEZpbGUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5zZXRUZXh0KGZpbGUucGF0aCk7XG4gICAgfVxuXG4gICAgc2VsZWN0U3VnZ2VzdGlvbihmaWxlOiBURmlsZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEJ1dHRvbkNvbXBvbmVudCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEZvbGRlclN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9Gb2xkZXJTdWdnZXN0ZXJcIjtcbmltcG9ydCB7IEZpbGVTdWdnZXN0LCBGaWxlU3VnZ2VzdE1vZGUgfSBmcm9tIFwic3VnZ2VzdGVycy9GaWxlU3VnZ2VzdGVyXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IGFycmF5bW92ZSwgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSBcIkxvZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvbGRlclRlbXBsYXRlIHtcbiAgICBmb2xkZXI6IHN0cmluZztcbiAgICB0ZW1wbGF0ZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogU2V0dGluZ3MgPSB7XG4gICAgY29tbWFuZF90aW1lb3V0OiA1LFxuICAgIHRlbXBsYXRlc19mb2xkZXI6IFwiXCIsXG4gICAgdGVtcGxhdGVzX3BhaXJzOiBbW1wiXCIsIFwiXCJdXSxcbiAgICB0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb246IGZhbHNlLFxuICAgIGF1dG9fanVtcF90b19jdXJzb3I6IGZhbHNlLFxuICAgIGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM6IGZhbHNlLFxuICAgIHNoZWxsX3BhdGg6IFwiXCIsXG4gICAgdXNlcl9zY3JpcHRzX2ZvbGRlcjogXCJcIixcbiAgICBlbmFibGVfZm9sZGVyX3RlbXBsYXRlczogdHJ1ZSxcbiAgICBmb2xkZXJfdGVtcGxhdGVzOiBbeyBmb2xkZXI6IFwiXCIsIHRlbXBsYXRlOiBcIlwiIH1dLFxuICAgIHN5bnRheF9oaWdobGlnaHRpbmc6IHRydWUsXG4gICAgZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5czogW1wiXCJdLFxuICAgIHN0YXJ0dXBfdGVtcGxhdGVzOiBbXCJcIl0sXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcbiAgICBjb21tYW5kX3RpbWVvdXQ6IG51bWJlcjtcbiAgICB0ZW1wbGF0ZXNfZm9sZGVyOiBzdHJpbmc7XG4gICAgdGVtcGxhdGVzX3BhaXJzOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPjtcbiAgICB0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb246IGJvb2xlYW47XG4gICAgYXV0b19qdW1wX3RvX2N1cnNvcjogYm9vbGVhbjtcbiAgICBlbmFibGVfc3lzdGVtX2NvbW1hbmRzOiBib29sZWFuO1xuICAgIHNoZWxsX3BhdGg6IHN0cmluZztcbiAgICB1c2VyX3NjcmlwdHNfZm9sZGVyOiBzdHJpbmc7XG4gICAgZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXM6IGJvb2xlYW47XG4gICAgZm9sZGVyX3RlbXBsYXRlczogQXJyYXk8Rm9sZGVyVGVtcGxhdGU+O1xuICAgIHN5bnRheF9oaWdobGlnaHRpbmc6IGJvb2xlYW47XG4gICAgZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5czogQXJyYXk8c3RyaW5nPjtcbiAgICBzdGFydHVwX3RlbXBsYXRlczogQXJyYXk8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICB0aGlzLmFkZF9nZW5lcmFsX3NldHRpbmdfaGVhZGVyKCk7XG4gICAgICAgIHRoaXMuYWRkX3RlbXBsYXRlX2ZvbGRlcl9zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX2ludGVybmFsX2Z1bmN0aW9uc19zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX3N5bnRheF9oaWdobGlnaHRpbmdfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF9hdXRvX2p1bXBfdG9fY3Vyc29yKCk7XG4gICAgICAgIHRoaXMuYWRkX3RyaWdnZXJfb25fbmV3X2ZpbGVfY3JlYXRpb25fc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF90ZW1wbGF0ZXNfaG90a2V5c19zZXR0aW5nKCk7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYWRkX2ZvbGRlcl90ZW1wbGF0ZXNfc2V0dGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkX3N0YXJ0dXBfdGVtcGxhdGVzX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zY3JpcHRfZnVuY3Rpb25zX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zeXN0ZW1fY29tbWFuZF9mdW5jdGlvbnNfc2V0dGluZygpO1xuICAgIH1cblxuICAgIGFkZF9nZW5lcmFsX3NldHRpbmdfaGVhZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkdlbmVyYWwgU2V0dGluZ3NcIiB9KTtcbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVfZm9sZGVyX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlRlbXBsYXRlIGZvbGRlciBsb2NhdGlvblwiKVxuICAgICAgICAgICAgLnNldERlc2MoXCJGaWxlcyBpbiB0aGlzIGZvbGRlciB3aWxsIGJlIGF2YWlsYWJsZSBhcyB0ZW1wbGF0ZXMuXCIpXG4gICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICBjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyID0gbmV3X2ZvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF9pbnRlcm5hbF9mdW5jdGlvbnNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlciBwcm92aWRlcyBtdWx0aXBsZXMgcHJlZGVmaW5lZCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMgdGhhdCB5b3UgY2FuIHVzZS5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiQ2hlY2sgdGhlIFwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImFcIiwge1xuICAgICAgICAgICAgICAgIGhyZWY6IFwiaHR0cHM6Ly9zaWxlbnR2b2lkMTMuZ2l0aHViLmlvL1RlbXBsYXRlci9cIixcbiAgICAgICAgICAgICAgICB0ZXh0OiBcImRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXCIgdG8gZ2V0IGEgbGlzdCBvZiBhbGwgdGhlIGF2YWlsYWJsZSBpbnRlcm5hbCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJJbnRlcm5hbCBWYXJpYWJsZXMgYW5kIEZ1bmN0aW9uc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYyk7XG4gICAgfVxuXG4gICAgYWRkX3N5bnRheF9oaWdobGlnaHRpbmdfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkFkZHMgc3ludGF4IGhpZ2hsaWdodGluZyBmb3IgVGVtcGxhdGVyIGNvbW1hbmRzIGluIGVkaXQgbW9kZS5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlN5bnRheCBIaWdobGlnaHRpbmdcIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgoc3ludGF4X2hpZ2hsaWdodGluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3ludGF4X2hpZ2hsaWdodGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4X2hpZ2hsaWdodGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfYXV0b19qdW1wX3RvX2N1cnNvcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkF1dG9tYXRpY2FsbHkgdHJpZ2dlcnMgXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiY29kZVwiLCB7IHRleHQ6IFwidHAuZmlsZS5jdXJzb3JcIiB9KSxcbiAgICAgICAgICAgIFwiIGFmdGVyIGluc2VydGluZyBhIHRlbXBsYXRlLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJZb3UgY2FuIGFsc28gc2V0IGEgaG90a2V5IHRvIG1hbnVhbGx5IHRyaWdnZXIgXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiY29kZVwiLCB7IHRleHQ6IFwidHAuZmlsZS5jdXJzb3JcIiB9KSxcbiAgICAgICAgICAgIFwiLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQXV0b21hdGljIGp1bXAgdG8gY3Vyc29yXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvX2p1bXBfdG9fY3Vyc29yKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKGF1dG9fanVtcF90b19jdXJzb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9fanVtcF90b19jdXJzb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9fanVtcF90b19jdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RyaWdnZXJfb25fbmV3X2ZpbGVfY3JlYXRpb25fc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlciB3aWxsIGxpc3RlbiBmb3IgdGhlIG5ldyBmaWxlIGNyZWF0aW9uIGV2ZW50LCBhbmQgcmVwbGFjZSBldmVyeSBjb21tYW5kIGl0IGZpbmRzIGluIHRoZSBuZXcgZmlsZSdzIGNvbnRlbnQuXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIlRoaXMgbWFrZXMgVGVtcGxhdGVyIGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zIGxpa2UgdGhlIERhaWx5IG5vdGUgY29yZSBwbHVnaW4sIENhbGVuZGFyIHBsdWdpbiwgUmV2aWV3IHBsdWdpbiwgTm90ZSByZWZhY3RvciBwbHVnaW4sIC4uLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJcIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiV2FybmluZzogXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFwiVGhpcyBjYW4gYmUgZGFuZ2Vyb3VzIGlmIHlvdSBjcmVhdGUgbmV3IGZpbGVzIHdpdGggdW5rbm93biAvIHVuc2FmZSBjb250ZW50IG9uIGNyZWF0aW9uLiBNYWtlIHN1cmUgdGhhdCBldmVyeSBuZXcgZmlsZSdzIGNvbnRlbnQgaXMgc2FmZSBvbiBjcmVhdGlvbi5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlRyaWdnZXIgVGVtcGxhdGVyIG9uIG5ldyBmaWxlIGNyZWF0aW9uXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RlbXBsYXRlc19ob3RrZXlzX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVGVtcGxhdGUgSG90a2V5c1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBIb3RrZXlzIGFsbG93cyB5b3UgdG8gYmluZCBhIHRlbXBsYXRlIHRvIGEgaG90a2V5LlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0RGVzYyhkZXNjKTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLmZvckVhY2goXG4gICAgICAgICAgICAodGVtcGxhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuaW5wdXRFbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld190ZW1wbGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5jb250YWlucyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRoaXMgdGVtcGxhdGUgaXMgYWxyZWFkeSBib3VuZCB0byBhIGhvdGtleVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb21tYW5kX2hhbmRsZXIuYWRkX3RlbXBsYXRlX2hvdGtleShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbaW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJhbnkta2V5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJDb25maWd1cmUgSG90a2V5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHdpdGggZnV0dXJlIFwib2ZmaWNpYWxcIiB3YXkgdG8gZG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLnNldHRpbmcub3BlblRhYkJ5SWQoXCJob3RrZXlzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuYXBwLnNldHRpbmcuYWN0aXZlVGFiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWIuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IFwiVGVtcGxhdGVyOiBJbnNlcnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiLnVwZGF0ZUhvdGtleVZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcInVwLWNoZXZyb24tZ2x5cGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIk1vdmUgdXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4IC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiZG93bi1jaGV2cm9uLWdseXBoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJNb3ZlIGRvd25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiY3Jvc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29tbWFuZF9oYW5kbGVyLnJlbW92ZV90ZW1wbGF0ZV9ob3RrZXkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpLmFkZEJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgIGNiLnNldEJ1dHRvblRleHQoXCJBZGQgbmV3IGhvdGtleSBmb3IgdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfZm9sZGVyX3RlbXBsYXRlc19zZXR0aW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkZvbGRlciBUZW1wbGF0ZXNcIiB9KTtcblxuICAgICAgICBjb25zdCBkZXNjSGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzY0hlYWRpbmcuYXBwZW5kKFxuICAgICAgICAgICAgXCJGb2xkZXIgVGVtcGxhdGVzIGFyZSB0cmlnZ2VyZWQgd2hlbiBhIG5ldyBcIixcbiAgICAgICAgICAgIGRlc2NIZWFkaW5nLmNyZWF0ZUVsKFwic3Ryb25nXCIsIHsgdGV4dDogXCJlbXB0eSBcIiB9KSxcbiAgICAgICAgICAgIFwiZmlsZSBpcyBjcmVhdGVkIGluIGEgZ2l2ZW4gZm9sZGVyLlwiLFxuICAgICAgICAgICAgZGVzY0hlYWRpbmcuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGVtcGxhdGVyIHdpbGwgZmlsbCB0aGUgZW1wdHkgZmlsZSB3aXRoIHRoZSBzcGVjaWZpZWQgdGVtcGxhdGUuXCIsXG4gICAgICAgICAgICBkZXNjSGVhZGluZy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGUgZGVlcGVzdCBtYXRjaCBpcyB1c2VkLiBBIGdsb2JhbCBkZWZhdWx0IHRlbXBsYXRlIHdvdWxkIGJlIGRlZmluZWQgb24gdGhlIHJvb3QgXCIsXG4gICAgICAgICAgICBkZXNjSGVhZGluZy5jcmVhdGVFbChcImNvZGVcIiwgeyB0ZXh0OiBcIi9cIiB9KSxcbiAgICAgICAgICAgIFwiLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0RGVzYyhkZXNjSGVhZGluZyk7XG5cbiAgICAgICAgY29uc3QgZGVzY1VzZU5ld0ZpbGVUZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzY1VzZU5ld0ZpbGVUZW1wbGF0ZS5hcHBlbmQoXG4gICAgICAgICAgICBcIldoZW4gZW5hYmxlZCBUZW1wbGF0ZXIgd2lsbCBtYWtlIHVzZSBvZiB0aGUgZm9sZGVyIHRlbXBsYXRlcyBkZWZpbmVkIGJlbG93LlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEZvbGRlciBUZW1wbGF0ZXNcIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2NVc2VOZXdGaWxlVGVtcGxhdGUpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHVzZV9uZXdfZmlsZV90ZW1wbGF0ZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VfbmV3X2ZpbGVfdGVtcGxhdGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfZm9sZGVyX3RlbXBsYXRlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQWRkIE5ld1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXCJBZGQgbmV3IGZvbGRlciB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJBZGQgYWRkaXRpb25hbCBmb2xkZXIgdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCIrXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGZvbGRlcl90ZW1wbGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAgICAgLmFkZFNlYXJjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRm9sZGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKGZvbGRlcl90ZW1wbGF0ZS5mb2xkZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19mb2xkZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZSkgPT4gZS5mb2xkZXIgPT0gbmV3X2ZvbGRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhpcyBmb2xkZXIgYWxyZWFkeSBoYXMgYSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggaXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5mb2xkZXIgPSBuZXdfZm9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuaW5wdXRFbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiVGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoZm9sZGVyX3RlbXBsYXRlLnRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLnRlbXBsYXRlID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJ1cC1jaGV2cm9uLWdseXBoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJNb3ZlIHVwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheW1vdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAtIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImRvd24tY2hldnJvbi1nbHlwaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiTW92ZSBkb3duXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheW1vdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImNyb3NzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJEZWxldGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFkZF9zdGFydHVwX3RlbXBsYXRlc19zZXR0aW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIlN0YXJ0dXAgVGVtcGxhdGVzXCIgfSk7XG5cbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlN0YXJ0dXAgVGVtcGxhdGVzIGFyZSB0ZW1wbGF0ZXMgdGhhdCB3aWxsIGdldCBleGVjdXRlZCBvbmNlIHdoZW4gVGVtcGxhdGVyIHN0YXJ0cy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGhlc2UgdGVtcGxhdGVzIHdvbid0IG91dHB1dCBhbnl0aGluZy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGhpcyBjYW4gYmUgdXNlZnVsIHRvIHNldCB1cCB0ZW1wbGF0ZXMgYWRkaW5nIGhvb2tzIHRvIG9ic2lkaWFuIGV2ZW50cyBmb3IgZXhhbXBsZS5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpLnNldERlc2MoZGVzYyk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMuZm9yRWFjaCgodGVtcGxhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmlucHV0RWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld190ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzLmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhpcyBzdGFydHVwIHRlbXBsYXRlIGFscmVhZHkgZXhpc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzW2luZGV4XSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld190ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJEZWxldGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcy5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzLmluZm9FbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuYWRkQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgY2Iuc2V0QnV0dG9uVGV4dChcIkFkZCBuZXcgc3RhcnR1cCB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdXNlcl9zY3JpcHRfZnVuY3Rpb25zX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVXNlciBTY3JpcHQgRnVuY3Rpb25zXCIgfSk7XG5cbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgXCJBbGwgSmF2YVNjcmlwdCBmaWxlcyBpbiB0aGlzIGZvbGRlciB3aWxsIGJlIGxvYWRlZCBhcyBDb21tb25KUyBtb2R1bGVzLCB0byBpbXBvcnQgY3VzdG9tIHVzZXIgZnVuY3Rpb25zLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGUgZm9sZGVyIG5lZWRzIHRvIGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgdmF1bHQuXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIkNoZWNrIHRoZSBcIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICBocmVmOiBcImh0dHBzOi8vc2lsZW50dm9pZDEzLmdpdGh1Yi5pby9UZW1wbGF0ZXIvXCIsXG4gICAgICAgICAgICAgICAgdGV4dDogXCJkb2N1bWVudGF0aW9uXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFwiIGZvciBtb3JlIGluZm9ybWF0aW9ucy5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlNjcmlwdCBmaWxlcyBmb2xkZXIgbG9jYXRpb25cIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICBjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyID0gbmV3X2ZvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmc7XG4gICAgICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcikge1xuICAgICAgICAgICAgbmFtZSA9IFwiTm8gVXNlciBTY3JpcHRzIGZvbGRlciBzZXRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZXJyb3JXcmFwcGVyU3luYyhcbiAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgYFVzZXIgU2NyaXB0cyBmb2xkZXIgZG9lc24ndCBleGlzdGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBcIk5vIFVzZXIgU2NyaXB0cyBkZXRlY3RlZFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS5leHRlbnNpb24gPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJsaVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGB0cC51c2VyLiR7ZmlsZS5iYXNlbmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5hbWUgPSBgRGV0ZWN0ZWQgJHtjb3VudH0gVXNlciBTY3JpcHQocylgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKG5hbWUpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChleHRyYSkgPT4ge1xuICAgICAgICAgICAgICAgIGV4dHJhXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwic3luY1wiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIlJlZnJlc2hcIilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3VzZXJfc3lzdGVtX2NvbW1hbmRfZnVuY3Rpb25zX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIGxldCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjLmFwcGVuZChcbiAgICAgICAgICAgIFwiQWxsb3dzIHlvdSB0byBjcmVhdGUgdXNlciBmdW5jdGlvbnMgbGlua2VkIHRvIHN5c3RlbSBjb21tYW5kcy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiXCIsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIldhcm5pbmc6IFwiLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBcIkl0IGNhbiBiZSBkYW5nZXJvdXMgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgc3lzdGVtIGNvbW1hbmRzIGZyb20gdW50cnVzdGVkIHNvdXJjZXMuIE9ubHkgcnVuIHN5c3RlbSBjb21tYW5kcyB0aGF0IHlvdSB1bmRlcnN0YW5kLCBmcm9tIHRydXN0ZWQgc291cmNlcy5cIlxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7XG4gICAgICAgICAgICB0ZXh0OiBcIlVzZXIgU3lzdGVtIENvbW1hbmQgRnVuY3Rpb25zXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkVuYWJsZSBVc2VyIFN5c3RlbSBDb21tYW5kIEZ1bmN0aW9uc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYylcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChlbmFibGVfc3lzdGVtX2NvbW1hbmRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfc3lzdGVtX2NvbW1hbmRzID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVfc3lzdGVtX2NvbW1hbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpIHtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoXCJUaW1lb3V0XCIpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoXCJNYXhpbXVtIHRpbWVvdXQgaW4gc2Vjb25kcyBmb3IgYSBzeXN0ZW0gY29tbWFuZC5cIilcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKFwiVGltZW91dFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld192YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld190aW1lb3V0ID0gTnVtYmVyKG5ld192YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKG5ld190aW1lb3V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaW1lb3V0IG11c3QgYmUgYSBudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCA9IG5ld190aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgXCJGdWxsIHBhdGggdG8gdGhlIHNoZWxsIGJpbmFyeSB0byBleGVjdXRlIHRoZSBjb21tYW5kIHdpdGguXCIsXG4gICAgICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgICAgIFwiVGhpcyBzZXR0aW5nIGlzIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIHN5c3RlbSdzIGRlZmF1bHQgc2hlbGwgaWYgbm90IHNwZWNpZmllZC5cIixcbiAgICAgICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICAgICAgXCJZb3UgY2FuIHVzZSBmb3J3YXJkIHNsYXNoZXMgKCcvJykgYXMgcGF0aCBzZXBhcmF0b3JzIG9uIGFsbCBwbGF0Zm9ybXMgaWYgaW4gZG91YnQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKFwiU2hlbGwgYmluYXJ5IGxvY2F0aW9uXCIpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoZGVzYylcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogL2Jpbi9iYXNoLCAuLi5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChzaGVsbF9wYXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGxfcGF0aCA9IHNoZWxsX3BhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5mb3JFYWNoKCh0ZW1wbGF0ZV9wYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDRcIiwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlVzZXIgRnVuY3Rpb24gbsKwXCIgKyBpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRpdGxlLmFkZENsYXNzKFwidGVtcGxhdGVyX3RpdGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoZXh0cmEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiRGVsZXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9wYWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSB0ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRnVuY3Rpb24gbmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZV9wYWlyWzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlX3BhaXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1bMF0gPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuaW5wdXRFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl90ZW1wbGF0ZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IHRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJTeXN0ZW0gQ29tbWFuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZV9wYWlyWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X2NtZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9wYWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWzFdID0gbmV3X2NtZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0LmlucHV0RWwuc2V0QXR0cihcInJvd3NcIiwgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfY21kXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwubGFzdENoaWxkKTtcblxuICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBkaXYgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiZGl2XCIpO1xuICAgICAgICAgICAgZGl2LmFkZENsYXNzKFwidGVtcGxhdGVyX2RpdjJcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKS5hZGRCdXR0b24oXG4gICAgICAgICAgICAgICAgKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KFwiQWRkIE5ldyBVc2VyIEZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMucHVzaChbXCJcIiwgXCJcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2V0dGluZy5pbmZvRWwucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lckVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEZ1enp5U3VnZ2VzdE1vZGFsLCBURmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tIFwiTG9nXCI7XG5cbmV4cG9ydCBlbnVtIE9wZW5Nb2RlIHtcbiAgICBJbnNlcnRUZW1wbGF0ZSxcbiAgICBDcmVhdGVOb3RlVGVtcGxhdGUsXG59XG5cbmV4cG9ydCBjbGFzcyBGdXp6eVN1Z2dlc3RlciBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFRGaWxlPiB7XG4gICAgcHVibGljIGFwcDogQXBwO1xuICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW47XG4gICAgcHJpdmF0ZSBvcGVuX21vZGU6IE9wZW5Nb2RlO1xuICAgIHByaXZhdGUgY3JlYXRpb25fZm9sZGVyOiBURm9sZGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcihcIlR5cGUgbmFtZSBvZiBhIHRlbXBsYXRlLi4uXCIpO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IFRGaWxlW10ge1xuICAgICAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlclxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBgQ291bGRuJ3QgcmV0cmlldmUgdGVtcGxhdGUgZmlsZXMgZnJvbSB0ZW1wbGF0ZXMgZm9sZGVyICR7dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcn1gXG4gICAgICAgICk7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5iYXNlbmFtZTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVEZpbGUpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0aW9uX2ZvbGRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRfdGVtcGxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3Blbl9tb2RlID0gT3Blbk1vZGUuSW5zZXJ0VGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShmb2xkZXI/OiBURm9sZGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRpb25fZm9sZGVyID0gZm9sZGVyO1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgPSBcIkVycm9yX01vYmlsZVVuc3VwcG9ydGVkVGVtcGxhdGVcIjtcbmV4cG9ydCBjb25zdCBJQ09OX0RBVEEgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MS4xMzI4IDI4LjdcIj48cGF0aCBkPVwiTTAgMTUuMTQgMCAxMC4xNSAxOC42NyAxLjUxIDE4LjY3IDYuMDMgNC43MiAxMi4zMyA0LjcyIDEyLjc2IDE4LjY3IDE5LjIyIDE4LjY3IDIzLjc0IDAgMTUuMTRaTTMzLjY5MjggMS44NEMzMy42OTI4IDEuODQgMzMuOTc2MSAyLjE0NjcgMzQuNTQyOCAyLjc2QzM1LjEwOTQgMy4zOCAzNS4zOTI4IDQuNTYgMzUuMzkyOCA2LjNDMzUuMzkyOCA4LjA0NjYgMzQuODE5NSA5LjU0IDMzLjY3MjggMTAuNzhDMzIuNTI2MSAxMi4wMiAzMS4wOTk1IDEyLjY0IDI5LjM5MjggMTIuNjRDMjcuNjg2MiAxMi42NCAyNi4yNjYxIDEyLjAyNjcgMjUuMTMyOCAxMC44QzIzLjk5MjggOS41NzMzIDIzLjQyMjggOC4wODY3IDIzLjQyMjggNi4zNEMyMy40MjI4IDQuNiAyMy45OTk1IDMuMTA2NiAyNS4xNTI4IDEuODZDMjYuMjk5NC42MiAyNy43MjYxIDAgMjkuNDMyOCAwQzMxLjEzOTUgMCAzMi41NTk0LjYxMzMgMzMuNjkyOCAxLjg0TTQ5LjgyMjguNjcgMjkuNTMyOCAyOC4zOCAyNC40MTI4IDI4LjM4IDQ0LjcxMjguNjcgNDkuODIyOC42N00zMS4wMzI4IDguMzhDMzEuMDMyOCA4LjM4IDMxLjEzOTUgOC4yNDY3IDMxLjM1MjggNy45OEMzMS41NjYyIDcuNzA2NyAzMS42NzI4IDcuMTczMyAzMS42NzI4IDYuMzhDMzEuNjcyOCA1LjU4NjcgMzEuNDQ2MSA0LjkyIDMwLjk5MjggNC4zOEMzMC41NDYxIDMuODQgMjkuOTk5NSAzLjU3IDI5LjM1MjggMy41N0MyOC43MDYxIDMuNTcgMjguMTY5NSAzLjg0IDI3Ljc0MjggNC4zOEMyNy4zMjI4IDQuOTIgMjcuMTEyOCA1LjU4NjcgMjcuMTEyOCA2LjM4QzI3LjExMjggNy4xNzMzIDI3LjMzNjEgNy44NCAyNy43ODI4IDguMzhDMjguMjM2MSA4LjkyNjcgMjguNzg2MSA5LjIgMjkuNDMyOCA5LjJDMzAuMDc5NSA5LjIgMzAuNjEyOCA4LjkyNjcgMzEuMDMyOCA4LjM4TTQ5LjQzMjggMTcuOUM0OS40MzI4IDE3LjkgNDkuNzE2MSAxOC4yMDY3IDUwLjI4MjggMTguODJDNTAuODQ5NSAxOS40MzMzIDUxLjEzMjggMjAuNjEzMyA1MS4xMzI4IDIyLjM2QzUxLjEzMjggMjQuMSA1MC41NTk0IDI1LjU5IDQ5LjQxMjggMjYuODNDNDguMjU5NSAyOC4wNzY2IDQ2LjgyOTUgMjguNyA0NS4xMjI4IDI4LjdDNDMuNDIyOCAyOC43IDQyLjAwMjggMjguMDgzMyA0MC44NjI4IDI2Ljg1QzM5LjcyOTUgMjUuNjIzMyAzOS4xNjI4IDI0LjEzNjYgMzkuMTYyOCAyMi4zOUMzOS4xNjI4IDIwLjY1IDM5LjczNjEgMTkuMTYgNDAuODgyOCAxNy45MkM0Mi4wMzYxIDE2LjY3MzMgNDMuNDYyOCAxNi4wNSA0NS4xNjI4IDE2LjA1QzQ2Ljg2OTQgMTYuMDUgNDguMjkyOCAxNi42NjY3IDQ5LjQzMjggMTcuOU00Ni44NTI4IDI0LjUyQzQ2Ljg1MjggMjQuNTIgNDYuOTU5NSAyNC4zODMzIDQ3LjE3MjggMjQuMTFDNDcuMzc5NSAyMy44MzY3IDQ3LjQ4MjggMjMuMzAzMyA0Ny40ODI4IDIyLjUxQzQ3LjQ4MjggMjEuNzE2NyA0Ny4yNTk1IDIxLjA1IDQ2LjgxMjggMjAuNTFDNDYuMzY2MSAxOS45NyA0NS44MTYyIDE5LjcgNDUuMTYyOCAxOS43QzQ0LjUxNjEgMTkuNyA0My45ODI4IDE5Ljk3IDQzLjU2MjggMjAuNTFDNDMuMTQyOCAyMS4wNSA0Mi45MzI4IDIxLjcxNjcgNDIuOTMyOCAyMi41MUM0Mi45MzI4IDIzLjMwMzMgNDMuMTU2MSAyMy45NzMzIDQzLjYwMjggMjQuNTJDNDQuMDQ5NCAyNS4wNiA0NC41OTYxIDI1LjMzIDQ1LjI0MjggMjUuMzNDNDUuODg5NSAyNS4zMyA0Ni40MjYxIDI1LjA2IDQ2Ljg1MjggMjQuNTJaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz48L3N2Zz5gO1xuIiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEludGVybmFsTW9kdWxlIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwdWJsaWMgYWJzdHJhY3QgbmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBzdGF0aWNfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCB1bmtub3duPiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgZHluYW1pY19mdW5jdGlvbnM6IE1hcDxzdHJpbmcsIHVua25vd24+ID0gbmV3IE1hcCgpO1xuICAgIHByb3RlY3RlZCBjb25maWc6IFJ1bm5pbmdDb25maWc7XG4gICAgcHJvdGVjdGVkIHN0YXRpY19vYmplY3Q6IHsgW3g6IHN0cmluZ106IHVua25vd24gfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IEFwcCwgcHJvdGVjdGVkIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7fVxuXG4gICAgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG4gICAgYWJzdHJhY3QgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk7XG4gICAgICAgIHRoaXMuc3RhdGljX29iamVjdCA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLnN0YXRpY19mdW5jdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgbmV3X2NvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXdfY29uZmlnO1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRpY19vYmplY3QsXG4gICAgICAgICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXModGhpcy5keW5hbWljX2Z1bmN0aW9ucyksXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZURhdGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImRhdGVcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwibm93XCIsIHRoaXMuZ2VuZXJhdGVfbm93KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwidG9tb3Jyb3dcIiwgdGhpcy5nZW5lcmF0ZV90b21vcnJvdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcIndlZWtkYXlcIiwgdGhpcy5nZW5lcmF0ZV93ZWVrZGF5KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwieWVzdGVyZGF5XCIsIHRoaXMuZ2VuZXJhdGVfeWVzdGVyZGF5KCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBnZW5lcmF0ZV9ub3coKTogKFxuICAgICAgICBmb3JtYXQ/OiBzdHJpbmcsXG4gICAgICAgIG9mZnNldD86IG51bWJlciB8IHN0cmluZyxcbiAgICAgICAgcmVmZXJlbmNlPzogc3RyaW5nLFxuICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCIsXG4gICAgICAgICAgICBvZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSAmJlxuICAgICAgICAgICAgICAgICF3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkuaXNWYWxpZCgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCByZWZlcmVuY2UgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlX2Zvcm1hdCdcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gd2luZG93Lm1vbWVudC5kdXJhdGlvbihvZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB3aW5kb3cubW9tZW50LmR1cmF0aW9uKG9mZnNldCwgXCJkYXlzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpXG4gICAgICAgICAgICAgICAgLmFkZChkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdG9tb3Jyb3coKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoMSwgXCJkYXlzXCIpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3dlZWtkYXkoKTogKFxuICAgICAgICBmb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgd2Vla2RheTogbnVtYmVyLFxuICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICApID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIixcbiAgICAgICAgICAgIHdlZWtkYXk6IG51bWJlcixcbiAgICAgICAgICAgIHJlZmVyZW5jZT86IHN0cmluZyxcbiAgICAgICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlICYmXG4gICAgICAgICAgICAgICAgIXdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5pc1ZhbGlkKClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIHJlZmVyZW5jZSBkYXRlIGZvcm1hdCwgdHJ5IHNwZWNpZnlpbmcgb25lIHdpdGggdGhlIGFyZ3VtZW50ICdyZWZlcmVuY2VfZm9ybWF0J1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3dcbiAgICAgICAgICAgICAgICAubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdClcbiAgICAgICAgICAgICAgICAud2Vla2RheSh3ZWVrZGF5KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoLTEsIFwiZGF5c1wiKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5pbXBvcnQge1xuICAgIEZpbGVTeXN0ZW1BZGFwdGVyLFxuICAgIGdldEFsbFRhZ3MsXG4gICAgTWFya2Rvd25WaWV3LFxuICAgIG5vcm1hbGl6ZVBhdGgsXG4gICAgcGFyc2VMaW5rdGV4dCxcbiAgICBQbGF0Zm9ybSxcbiAgICByZXNvbHZlU3VicGF0aCxcbiAgICBURmlsZSxcbiAgICBURm9sZGVyLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjb25zdCBERVBUSF9MSU1JVCA9IDEwO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGaWxlIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJmaWxlXCI7XG4gICAgcHJpdmF0ZSBpbmNsdWRlX2RlcHRoID0gMDtcbiAgICBwcml2YXRlIGNyZWF0ZV9uZXdfZGVwdGggPSAwO1xuICAgIHByaXZhdGUgbGlua3BhdGhfcmVnZXggPSBuZXcgUmVnRXhwKFwiXlxcXFxbXFxcXFsoLiopXFxcXF1cXFxcXSRcIik7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwiY3JlYXRpb25fZGF0ZVwiLFxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZV9jcmVhdGlvbl9kYXRlKClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImNyZWF0ZV9uZXdcIiwgdGhpcy5nZW5lcmF0ZV9jcmVhdGVfbmV3KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY3Vyc29yXCIsIHRoaXMuZ2VuZXJhdGVfY3Vyc29yKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFxuICAgICAgICAgICAgXCJjdXJzb3JfYXBwZW5kXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2N1cnNvcl9hcHBlbmQoKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZXhpc3RzXCIsIHRoaXMuZ2VuZXJhdGVfZXhpc3RzKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZmluZF90ZmlsZVwiLCB0aGlzLmdlbmVyYXRlX2ZpbmRfdGZpbGUoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJmb2xkZXJcIiwgdGhpcy5nZW5lcmF0ZV9mb2xkZXIoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJpbmNsdWRlXCIsIHRoaXMuZ2VuZXJhdGVfaW5jbHVkZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwibGFzdF9tb2RpZmllZF9kYXRlXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJtb3ZlXCIsIHRoaXMuZ2VuZXJhdGVfbW92ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInBhdGhcIiwgdGhpcy5nZW5lcmF0ZV9wYXRoKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicmVuYW1lXCIsIHRoaXMuZ2VuZXJhdGVfcmVuYW1lKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwic2VsZWN0aW9uXCIsIHRoaXMuZ2VuZXJhdGVfc2VsZWN0aW9uKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJjb250ZW50XCIsIGF3YWl0IHRoaXMuZ2VuZXJhdGVfY29udGVudCgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0YWdzXCIsIHRoaXMuZ2VuZXJhdGVfdGFncygpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0aXRsZVwiLCB0aGlzLmdlbmVyYXRlX3RpdGxlKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX2NvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0ZV9uZXcoKTogKFxuICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wZW5fbmV3OiBib29sZWFuLFxuICAgICAgICBmb2xkZXI/OiBURm9sZGVyXG4gICAgKSA9PiBQcm9taXNlPFRGaWxlPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoXG4gICAgICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgb3Blbl9uZXcgPSBmYWxzZSxcbiAgICAgICAgICAgIGZvbGRlcj86IFRGb2xkZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZV9uZXdfZGVwdGggPiBERVBUSF9MSU1JVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlX25ld19kZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIlJlYWNoZWQgY3JlYXRlX25ldyBkZXB0aCBsaW1pdCAobWF4ID0gMTApXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdfZmlsZSA9XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb3Blbl9uZXdcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ld19maWxlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1xuICAgICAgICAgICAgICAgIC5tb21lbnQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuc3RhdC5jdGltZSlcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yKCk6IChvcmRlcj86IG51bWJlcikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChvcmRlcj86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy8gSGFjayB0byBwcmV2ZW50IGVtcHR5IG91dHB1dFxuICAgICAgICAgICAgcmV0dXJuIGA8JSB0cC5maWxlLmN1cnNvcigke29yZGVyID8/IFwiXCJ9KSAlPmA7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yX2FwcGVuZCgpOiAoY29udGVudDogc3RyaW5nKSA9PiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIChjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0byBjdXJzb3IuXCJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgICAgICAgICBkb2MucmVwbGFjZVNlbGVjdGlvbihjb250ZW50KTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2V4aXN0cygpOiAoZmlsZW5hbWU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMsIG9ubHkgaGVyZSB0byBzdXBwb3J0IHRoZSBvbGQgd2F5XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdGhpcy5saW5rcGF0aF9yZWdleC5leGVjKGZpbGVuYW1lKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgIT0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9maW5kX3RmaWxlKCk6IChmaWxlbmFtZTogc3RyaW5nKSA9PiBURmlsZSB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5vcm1hbGl6ZVBhdGgoZmlsZW5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QocGF0aCwgXCJcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCk6IChyZWxhdGl2ZT86IGJvb2xlYW4pID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmUgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvbGRlciA9IHBhcmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9sZGVyO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKTogKGluY2x1ZGVfbGluazogc3RyaW5nIHwgVEZpbGUpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoaW5jbHVkZV9saW5rOiBzdHJpbmcgfCBURmlsZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG11dGV4IGZvciB0aGlzLCB0aGlzIG1heSBjdXJyZW50bHkgbGVhZCB0byBhIHJhY2UgY29uZGl0aW9uLlxuICAgICAgICAgICAgLy8gV2hpbGUgbm90IHZlcnkgaW1wYWN0ZnVsLCB0aGF0IGNvdWxkIHN0aWxsIGJlIGFubm95aW5nLlxuICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlX2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiUmVhY2hlZCBpbmNsdXNpb24gZGVwdGggbGltaXQgKG1heCA9IDEwKVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluY19maWxlX2NvbnRlbnQ6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVfbGluayBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoaW5jbHVkZV9saW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgICAgIGlmICgobWF0Y2ggPSB0aGlzLmxpbmtwYXRoX3JlZ2V4LmV4ZWMoaW5jbHVkZV9saW5rKSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBmaWxlIGZvcm1hdCwgcHJvdmlkZSBhbiBvYnNpZGlhbiBsaW5rIGJldHdlZW4gcXVvdGVzLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGF0aCwgc3VicGF0aCB9ID0gcGFyc2VMaW5rdGV4dChtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmNfZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICghaW5jX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBGaWxlICR7aW5jbHVkZV9saW5rfSBkb2Vzbid0IGV4aXN0YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3VicGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGluY19maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlU3VicGF0aChjYWNoZSwgc3VicGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGluY19maWxlX2NvbnRlbnQuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQ/Lm9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkX2NvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIucGFyc2VyLnBhcnNlX2NvbW1hbmRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2NvbnRlbnQ7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9sYXN0X21vZGlmaWVkX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudCh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5zdGF0Lm10aW1lKVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9tb3ZlKCk6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7cGF0aH0uJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5leHRlbnNpb259YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUoXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUsXG4gICAgICAgICAgICAgICAgbmV3X3BhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9wYXRoKCk6IChyZWxhdGl2ZTogYm9vbGVhbikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChyZWxhdGl2ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZUFwcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhdWx0X3BhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG5cbiAgICAgICAgICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRofWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCk6IChuZXdfdGl0bGU6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChuZXdfdGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKG5ld190aXRsZS5tYXRjaCgvW1xcXFwvOl0rL2cpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkZpbGUgbmFtZSBjYW5ub3QgY29udGFpbiBhbnkgb2YgdGhlc2UgY2hhcmFjdGVyczogXFxcXCAvIDpcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50LnBhdGh9LyR7bmV3X3RpdGxlfS4ke3RoaXMuY29uZmlnLnRhcmdldF9maWxlLmV4dGVuc2lvbn1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucmVuYW1lRmlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZSxcbiAgICAgICAgICAgICAgICBuZXdfcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpOiAoKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCByZWFkIHNlbGVjdGlvbi5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVHVybiB0aGlzIGludG8gYSBmdW5jdGlvblxuICAgIGdlbmVyYXRlX3RhZ3MoKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGdldEFsbFRhZ3MoY2FjaGUpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFR1cm4gdGhpcyBpbnRvIGEgZnVuY3Rpb25cbiAgICBnZW5lcmF0ZV90aXRsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuYmFzZW5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVdlYiBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJ3ZWJcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZGFpbHlfcXVvdGVcIiwgdGhpcy5nZW5lcmF0ZV9kYWlseV9xdW90ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwicmFuZG9tX3BpY3R1cmVcIixcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVfcmFuZG9tX3BpY3R1cmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBnZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcIkVycm9yIHBlcmZvcm1pbmcgR0VUIHJlcXVlc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2RhaWx5X3F1b3RlKCk6ICgpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcImh0dHBzOi8vcXVvdGVzLnJlc3QvcW9kXCIpO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0ganNvbi5jb250ZW50cy5xdW90ZXNbMF0uYXV0aG9yO1xuICAgICAgICAgICAgY29uc3QgcXVvdGUgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5xdW90ZTtcbiAgICAgICAgICAgIGNvbnN0IG5ld19jb250ZW50ID0gYD4gJHtxdW90ZX1cXG4+ICZtZGFzaDsgPGNpdGU+JHthdXRob3J9PC9jaXRlPmA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXdfY29udGVudDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpOiAoXG4gICAgICAgIHNpemU6IHN0cmluZyxcbiAgICAgICAgcXVlcnk/OiBzdHJpbmdcbiAgICApID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoc2l6ZTogc3RyaW5nLCBxdWVyeT86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vc291cmNlLnVuc3BsYXNoLmNvbS9yYW5kb20vJHtzaXplID8/IFwiXCJ9PyR7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID8/IFwiXCJcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgICAgIHJldHVybiBgIVt0cC53ZWIucmFuZG9tX3BpY3R1cmVdKCR7dXJsfSlgO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJmcm9udG1hdHRlclwiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucyA9IG5ldyBNYXAoXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhjYWNoZT8uZnJvbnRtYXR0ZXIgfHwge30pXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGNsYXNzIFByb21wdE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICAgIHByaXZhdGUgcHJvbXB0RWw6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgc3VibWl0dGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXBwOiBBcHAsXG4gICAgICAgIHByaXZhdGUgcHJvbXB0X3RleHQ6IHN0cmluZyxcbiAgICAgICAgcHJpdmF0ZSBkZWZhdWx0X3ZhbHVlOiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICB9XG5cbiAgICBvbk9wZW4oKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGl0bGVFbC5zZXRUZXh0KHRoaXMucHJvbXB0X3RleHQpO1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm0oKTtcbiAgICB9XG5cbiAgICBvbkNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlamVjdChuZXcgVGVtcGxhdGVyRXJyb3IoXCJDYW5jZWxsZWQgcHJvbXB0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUZvcm0oKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRpdiA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdigpO1xuICAgICAgICBkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXItcHJvbXB0LWRpdlwiKTtcblxuICAgICAgICBjb25zdCBmb3JtID0gZGl2LmNyZWF0ZUVsKFwiZm9ybVwiKTtcbiAgICAgICAgZm9ybS5hZGRDbGFzcyhcInRlbXBsYXRlci1wcm9tcHQtZm9ybVwiKTtcbiAgICAgICAgZm9ybS50eXBlID0gXCJzdWJtaXRcIjtcbiAgICAgICAgZm9ybS5vbnN1Ym1pdCA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHRoaXMucHJvbXB0RWwudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucHJvbXB0RWwgPSBmb3JtLmNyZWF0ZUVsKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMucHJvbXB0RWwudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICB0aGlzLnByb21wdEVsLnBsYWNlaG9sZGVyID0gXCJUeXBlIHRleHQgaGVyZS4uLlwiO1xuICAgICAgICB0aGlzLnByb21wdEVsLnZhbHVlID0gdGhpcy5kZWZhdWx0X3ZhbHVlID8/IFwiXCI7XG4gICAgICAgIHRoaXMucHJvbXB0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXItcHJvbXB0LWlucHV0XCIpO1xuICAgICAgICB0aGlzLnByb21wdEVsLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5BbmRHZXRWYWx1ZShcbiAgICAgICAgcmVzb2x2ZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgICAgIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgQXBwLCBGdXp6eU1hdGNoLCBGdXp6eVN1Z2dlc3RNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgY2xhc3MgU3VnZ2VzdGVyTW9kYWw8VD4gZXh0ZW5kcyBGdXp6eVN1Z2dlc3RNb2RhbDxUPiB7XG4gICAgcHJpdmF0ZSByZXNvbHZlOiAodmFsdWU6IFQpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSByZWplY3Q6IChyZWFzb24/OiBUZW1wbGF0ZXJFcnJvcikgPT4gdm9pZDtcbiAgICBwcml2YXRlIHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFwcDogQXBwLFxuICAgICAgICBwcml2YXRlIHRleHRfaXRlbXM6IHN0cmluZ1tdIHwgKChpdGVtOiBUKSA9PiBzdHJpbmcpLFxuICAgICAgICBwcml2YXRlIGl0ZW1zOiBUW10sXG4gICAgICAgIHBsYWNlaG9sZGVyOiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcihwbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1Ym1pdHRlZCkge1xuICAgICAgICAgICAgdGhpcy5yZWplY3QobmV3IFRlbXBsYXRlckVycm9yKFwiQ2FuY2VsbGVkIHByb21wdFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RTdWdnZXN0aW9uKFxuICAgICAgICB2YWx1ZTogRnV6enlNYXRjaDxUPixcbiAgICAgICAgZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5vbkNob29zZVN1Z2dlc3Rpb24odmFsdWUsIGV2dCk7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnRleHRfaXRlbXMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dF9pdGVtcyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy50ZXh0X2l0ZW1zW3RoaXMuaXRlbXMuaW5kZXhPZihpdGVtKV0gfHwgXCJVbmRlZmluZWQgVGV4dCBJdGVtXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc29sdmUoaXRlbSk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlbkFuZEdldFZhbHVlKFxuICAgICAgICByZXNvbHZlOiAodmFsdWU6IFQpID0+IHZvaWQsXG4gICAgICAgIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFByb21wdE1vZGFsIH0gZnJvbSBcIi4vUHJvbXB0TW9kYWxcIjtcbmltcG9ydCB7IFN1Z2dlc3Rlck1vZGFsIH0gZnJvbSBcIi4vU3VnZ2VzdGVyTW9kYWxcIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVN5c3RlbSBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBwdWJsaWMgbmFtZSA9IFwic3lzdGVtXCI7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImNsaXBib2FyZFwiLCB0aGlzLmdlbmVyYXRlX2NsaXBib2FyZCgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInByb21wdFwiLCB0aGlzLmdlbmVyYXRlX3Byb21wdCgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInN1Z2dlc3RlclwiLCB0aGlzLmdlbmVyYXRlX3N1Z2dlc3RlcigpKTtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVfZHluYW1pY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgZ2VuZXJhdGVfY2xpcGJvYXJkKCk6ICgpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZUFwcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3Byb21wdCgpOiAoXG4gICAgICAgIHByb21wdF90ZXh0OiBzdHJpbmcsXG4gICAgICAgIGRlZmF1bHRfdmFsdWU6IHN0cmluZyxcbiAgICAgICAgdGhyb3dfb25fY2FuY2VsOiBib29sZWFuXG4gICAgKSA9PiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gYXN5bmMgKFxuICAgICAgICAgICAgcHJvbXB0X3RleHQ6IHN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHRfdmFsdWU6IHN0cmluZyxcbiAgICAgICAgICAgIHRocm93X29uX2NhbmNlbCA9IGZhbHNlXG4gICAgICAgICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9tcHQgPSBuZXcgUHJvbXB0TW9kYWwoXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgcHJvbXB0X3RleHQsXG4gICAgICAgICAgICAgICAgZGVmYXVsdF92YWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICByZWplY3Q6IChyZWFzb24/OiBUZW1wbGF0ZXJFcnJvcikgPT4gdm9pZFxuICAgICAgICAgICAgICAgICkgPT4gcHJvbXB0Lm9wZW5BbmRHZXRWYWx1ZShyZXNvbHZlLCByZWplY3QpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRocm93X29uX2NhbmNlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfc3VnZ2VzdGVyKCk6IDxUPihcbiAgICAgICAgdGV4dF9pdGVtczogc3RyaW5nW10gfCAoKGl0ZW06IFQpID0+IHN0cmluZyksXG4gICAgICAgIGl0ZW1zOiBUW10sXG4gICAgICAgIHRocm93X29uX2NhbmNlbDogYm9vbGVhbixcbiAgICAgICAgcGxhY2Vob2xkZXI6IHN0cmluZ1xuICAgICkgPT4gUHJvbWlzZTxUPiB7XG4gICAgICAgIHJldHVybiBhc3luYyA8VD4oXG4gICAgICAgICAgICB0ZXh0X2l0ZW1zOiBzdHJpbmdbXSB8ICgoaXRlbTogVCkgPT4gc3RyaW5nKSxcbiAgICAgICAgICAgIGl0ZW1zOiBUW10sXG4gICAgICAgICAgICB0aHJvd19vbl9jYW5jZWwgPSBmYWxzZSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gXCJcIlxuICAgICAgICApOiBQcm9taXNlPFQ+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3RlciA9IG5ldyBTdWdnZXN0ZXJNb2RhbChcbiAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICB0ZXh0X2l0ZW1zLFxuICAgICAgICAgICAgICAgIGl0ZW1zLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICByZWplY3Q6IChyZWFzb24/OiBUZW1wbGF0ZXJFcnJvcikgPT4gdm9pZFxuICAgICAgICAgICAgICAgICkgPT4gc3VnZ2VzdGVyLm9wZW5BbmRHZXRWYWx1ZShyZXNvbHZlLCByZWplY3QpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRocm93X29uX2NhbmNlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgUnVubmluZ0NvbmZpZyB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlQ29uZmlnIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJjb25maWdcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge31cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4vSW50ZXJuYWxNb2R1bGVcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRGF0ZSB9IGZyb20gXCIuL2RhdGUvSW50ZXJuYWxNb2R1bGVEYXRlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUZpbGUgfSBmcm9tIFwiLi9maWxlL0ludGVybmFsTW9kdWxlRmlsZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVXZWIgfSBmcm9tIFwiLi93ZWIvSW50ZXJuYWxNb2R1bGVXZWJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi9mcm9udG1hdHRlci9JbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbS9JbnRlcm5hbE1vZHVsZVN5c3RlbVwiO1xuaW1wb3J0IHsgUnVubmluZ0NvbmZpZyB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnL0ludGVybmFsTW9kdWxlQ29uZmlnXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbEZ1bmN0aW9ucyBpbXBsZW1lbnRzIElHZW5lcmF0ZU9iamVjdCB7XG4gICAgcHJpdmF0ZSBtb2R1bGVzX2FycmF5OiBBcnJheTxJbnRlcm5hbE1vZHVsZT4gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IEFwcCwgcHJvdGVjdGVkIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZURhdGUodGhpcy5hcHAsIHRoaXMucGx1Z2luKSk7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZUZpbGUodGhpcy5hcHAsIHRoaXMucGx1Z2luKSk7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZVdlYih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2goXG4gICAgICAgICAgICBuZXcgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKFxuICAgICAgICAgICAgbmV3IEludGVybmFsTW9kdWxlU3lzdGVtKHRoaXMuYXBwLCB0aGlzLnBsdWdpbilcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2goXG4gICAgICAgICAgICBuZXcgSW50ZXJuYWxNb2R1bGVDb25maWcodGhpcy5hcHAsIHRoaXMucGx1Z2luKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGZvciAoY29uc3QgbW9kIG9mIHRoaXMubW9kdWxlc19hcnJheSkge1xuICAgICAgICAgICAgYXdhaXQgbW9kLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0OiB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgbW9kIG9mIHRoaXMubW9kdWxlc19hcnJheSkge1xuICAgICAgICAgICAgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdFttb2QuZ2V0TmFtZSgpXSA9XG4gICAgICAgICAgICAgICAgYXdhaXQgbW9kLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGludGVybmFsX2Z1bmN0aW9uc19vYmplY3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZXhlYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiO1xuaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSwgRmlsZVN5c3RlbUFkYXB0ZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgeyBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgRnVuY3Rpb25zTW9kZSB9IGZyb20gXCJmdW5jdGlvbnMvRnVuY3Rpb25zR2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBVc2VyU3lzdGVtRnVuY3Rpb25zIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwcml2YXRlIGN3ZDogc3RyaW5nO1xuICAgIHByaXZhdGUgZXhlY19wcm9taXNlOiAoXG4gICAgICAgIGFyZzE6IHN0cmluZyxcbiAgICAgICAgYXJnMjogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICApID0+IFByb21pc2U8eyBzdGRvdXQ6IHN0cmluZzsgc3RkZXJyOiBzdHJpbmcgfT47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBQbGF0Zm9ybS5pc01vYmlsZUFwcCB8fFxuICAgICAgICAgICAgIShhcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMuZXhlY19wcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgYXN5bmMgZ2VuZXJhdGVfc3lzdGVtX2Z1bmN0aW9ucyhcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxcbiAgICAgICAgTWFwPHN0cmluZywgKHVzZXJfYXJncz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHN0cmluZz4+XG4gICAgPiB7XG4gICAgICAgIGNvbnN0IHVzZXJfc3lzdGVtX2Z1bmN0aW9uczogTWFwPFxuICAgICAgICAgICAgc3RyaW5nLFxuICAgICAgICAgICAgKHVzZXJfYXJncz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHN0cmluZz5cbiAgICAgICAgPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCA9XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuZnVuY3Rpb25zX2dlbmVyYXRvci5nZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgIEZ1bmN0aW9uc01vZGUuSU5URVJOQUxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZV9wYWlyIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycykge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0ZW1wbGF0ZV9wYWlyWzBdO1xuICAgICAgICAgICAgbGV0IGNtZCA9IHRlbXBsYXRlX3BhaXJbMV07XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlIHx8ICFjbWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlQXBwKSB7XG4gICAgICAgICAgICAgICAgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zLnNldCh0ZW1wbGF0ZSwgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbWQgPSBhd2FpdCB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIucGFyc2VyLnBhcnNlX2NvbW1hbmRzKFxuICAgICAgICAgICAgICAgICAgICBjbWQsXG4gICAgICAgICAgICAgICAgICAgIGludGVybmFsX2Z1bmN0aW9uc19vYmplY3RcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfYXJncz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgICAgICAgICAgICAgICAgICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9jZXNzX2VudiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyX2FyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbWRfb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kX3RpbWVvdXQgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZDogdGhpcy5jd2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52OiBwcm9jZXNzX2VudixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi4odGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGxfcGF0aCAmJiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoZWxsOiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHN0ZG91dCB9ID0gYXdhaXQgdGhpcy5leGVjX3Byb21pc2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY21kX29wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQudHJpbVJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIHdpdGggVXNlciBUZW1wbGF0ZSAke3RlbXBsYXRlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucztcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgY29uc3QgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zID0gYXdhaXQgdGhpcy5nZW5lcmF0ZV9zeXN0ZW1fZnVuY3Rpb25zKFxuICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXModXNlcl9zeXN0ZW1fZnVuY3Rpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEZpbGVTeXN0ZW1BZGFwdGVyLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBJR2VuZXJhdGVPYmplY3QgfSBmcm9tIFwiZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdFwiO1xuaW1wb3J0IHsgUnVubmluZ0NvbmZpZyB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCB7IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMsIFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBVc2VyU2NyaXB0RnVuY3Rpb25zIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7fVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfdXNlcl9zY3JpcHRfZnVuY3Rpb25zKFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWdcbiAgICApOiBQcm9taXNlPE1hcDxzdHJpbmcsIEZ1bmN0aW9uPj4ge1xuICAgICAgICBjb25zdCB1c2VyX3NjcmlwdF9mdW5jdGlvbnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlclxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBgQ291bGRuJ3QgZmluZCB1c2VyIHNjcmlwdCBmb2xkZXIgXCIke3RoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJfc2NyaXB0c19mb2xkZXJ9XCJgXG4gICAgICAgICk7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWFwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSBcImpzXCIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRfdXNlcl9zY3JpcHRfZnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9zY3JpcHRfZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlcl9zY3JpcHRfZnVuY3Rpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRfdXNlcl9zY3JpcHRfZnVuY3Rpb24oXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZyxcbiAgICAgICAgZmlsZTogVEZpbGUsXG4gICAgICAgIHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogTWFwPHN0cmluZywgRnVuY3Rpb24+XG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICBcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhdWx0X3BhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVfcGF0aCA9IGAke3ZhdWx0X3BhdGh9LyR7ZmlsZS5wYXRofWA7XG5cbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjY2MzM5MDEvcmVsb2FkLW1vZHVsZS1hdC1ydW50aW1lXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5NzIyNDIvaG93LXRvLWF1dG8tcmVsb2FkLWZpbGVzLWluLW5vZGUtanNcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHdpbmRvdy5yZXF1aXJlLmNhY2hlKS5jb250YWlucyhmaWxlX3BhdGgpKSB7XG4gICAgICAgICAgICBkZWxldGUgd2luZG93LnJlcXVpcmUuY2FjaGVbd2luZG93LnJlcXVpcmUucmVzb2x2ZShmaWxlX3BhdGgpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXJfZnVuY3Rpb24gPSBhd2FpdCBpbXBvcnQoZmlsZV9wYXRoKTtcbiAgICAgICAgaWYgKCF1c2VyX2Z1bmN0aW9uLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICBgRmFpbGVkIHRvIGxvYWQgdXNlciBzY3JpcHQgJHtmaWxlX3BhdGh9LiBObyBleHBvcnRzIGRldGVjdGVkLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEodXNlcl9mdW5jdGlvbi5kZWZhdWx0IGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgYEZhaWxlZCB0byBsb2FkIHVzZXIgc2NyaXB0ICR7ZmlsZV9wYXRofS4gRGVmYXVsdCBleHBvcnQgaXMgbm90IGEgZnVuY3Rpb24uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnMuc2V0KGAke2ZpbGUuYmFzZW5hbWV9YCwgdXNlcl9mdW5jdGlvbi5kZWZhdWx0KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgY29uc3QgdXNlcl9zY3JpcHRfZnVuY3Rpb25zID0gYXdhaXQgdGhpcy5nZW5lcmF0ZV91c2VyX3NjcmlwdF9mdW5jdGlvbnMoXG4gICAgICAgICAgICBjb25maWdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh1c2VyX3NjcmlwdF9mdW5jdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgUGxhdGZvcm0gfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgUnVubmluZ0NvbmZpZyB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCB7IElHZW5lcmF0ZU9iamVjdCB9IGZyb20gXCJmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0XCI7XG5pbXBvcnQgeyBVc2VyU3lzdGVtRnVuY3Rpb25zIH0gZnJvbSBcImZ1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU3lzdGVtRnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBVc2VyU2NyaXB0RnVuY3Rpb25zIH0gZnJvbSBcImZ1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU2NyaXB0RnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBjbGFzcyBVc2VyRnVuY3Rpb25zIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwcml2YXRlIHVzZXJfc3lzdGVtX2Z1bmN0aW9uczogVXNlclN5c3RlbUZ1bmN0aW9ucztcbiAgICBwcml2YXRlIHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogVXNlclNjcmlwdEZ1bmN0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMudXNlcl9zeXN0ZW1fZnVuY3Rpb25zID0gbmV3IFVzZXJTeXN0ZW1GdW5jdGlvbnMoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnVzZXJfc2NyaXB0X2Z1bmN0aW9ucyA9IG5ldyBVc2VyU2NyaXB0RnVuY3Rpb25zKGFwcCwgcGx1Z2luKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgbGV0IHVzZXJfc3lzdGVtX2Z1bmN0aW9ucyA9IHt9O1xuICAgICAgICBsZXQgdXNlcl9zY3JpcHRfZnVuY3Rpb25zID0ge307XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpIHtcbiAgICAgICAgICAgIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucyA9XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51c2VyX3N5c3RlbV9mdW5jdGlvbnMuZ2VuZXJhdGVfb2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgLy8gdXNlcl9zY3JpcHRzX2ZvbGRlciBuZWVkcyB0byBiZSBleHBsaWNpdGx5IHNldCB0byAnLycgdG8gcXVlcnkgZnJvbSByb290XG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc0Rlc2t0b3BBcHAgJiYgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcikge1xuICAgICAgICAgICAgdXNlcl9zY3JpcHRfZnVuY3Rpb25zID1cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJfc2NyaXB0X2Z1bmN0aW9ucy5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi51c2VyX3N5c3RlbV9mdW5jdGlvbnMsXG4gICAgICAgICAgICAuLi51c2VyX3NjcmlwdF9mdW5jdGlvbnMsXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEludGVybmFsRnVuY3Rpb25zIH0gZnJvbSBcImZ1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxGdW5jdGlvbnNcIjtcbmltcG9ydCB7IFVzZXJGdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJGdW5jdGlvbnNcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IElHZW5lcmF0ZU9iamVjdCB9IGZyb20gXCJmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0XCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0ICogYXMgb2JzaWRpYW5fbW9kdWxlIGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZW51bSBGdW5jdGlvbnNNb2RlIHtcbiAgICBJTlRFUk5BTCxcbiAgICBVU0VSX0lOVEVSTkFMLFxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25zR2VuZXJhdG9yIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwdWJsaWMgaW50ZXJuYWxfZnVuY3Rpb25zOiBJbnRlcm5hbEZ1bmN0aW9ucztcbiAgICBwdWJsaWMgdXNlcl9mdW5jdGlvbnM6IFVzZXJGdW5jdGlvbnM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxfZnVuY3Rpb25zID0gbmV3IEludGVybmFsRnVuY3Rpb25zKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgICAgIHRoaXMudXNlcl9mdW5jdGlvbnMgPSBuZXcgVXNlckZ1bmN0aW9ucyh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxfZnVuY3Rpb25zLmluaXQoKTtcbiAgICB9XG5cbiAgICBhZGRpdGlvbmFsX2Z1bmN0aW9ucygpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvYnNpZGlhbjogb2JzaWRpYW5fbW9kdWxlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnLFxuICAgICAgICBmdW5jdGlvbnNfbW9kZTogRnVuY3Rpb25zTW9kZSA9IEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTFxuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgY29uc3QgZmluYWxfb2JqZWN0ID0ge307XG4gICAgICAgIGNvbnN0IGFkZGl0aW9uYWxfZnVuY3Rpb25zX29iamVjdCA9IHRoaXMuYWRkaXRpb25hbF9mdW5jdGlvbnMoKTtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCA9XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmludGVybmFsX2Z1bmN0aW9ucy5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgbGV0IHVzZXJfZnVuY3Rpb25zX29iamVjdCA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZmluYWxfb2JqZWN0LCBhZGRpdGlvbmFsX2Z1bmN0aW9uc19vYmplY3QpO1xuICAgICAgICBzd2l0Y2ggKGZ1bmN0aW9uc19tb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEZ1bmN0aW9uc01vZGUuSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihmaW5hbF9vYmplY3QsIGludGVybmFsX2Z1bmN0aW9uc19vYmplY3QpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBGdW5jdGlvbnNNb2RlLlVTRVJfSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgdXNlcl9mdW5jdGlvbnNfb2JqZWN0ID1cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51c2VyX2Z1bmN0aW9ucy5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZpbmFsX29iamVjdCwge1xuICAgICAgICAgICAgICAgICAgICAuLi5pbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2Z1bmN0aW9uc19vYmplY3QsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluYWxfb2JqZWN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgQXBwLFxuICAgIEVkaXRvclBvc2l0aW9uLFxuICAgIEVkaXRvclJhbmdlT3JDYXJldCxcbiAgICBFZGl0b3JUcmFuc2FjdGlvbixcbiAgICBNYXJrZG93blZpZXcsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZXNjYXBlX1JlZ0V4cCB9IGZyb20gXCJVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgQ3Vyc29ySnVtcGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwKSB7fVxuXG4gICAgYXN5bmMganVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCFhY3RpdmVfdmlldykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFjdGl2ZV9maWxlID0gYWN0aXZlX3ZpZXcuZmlsZTtcbiAgICAgICAgYXdhaXQgYWN0aXZlX3ZpZXcuc2F2ZSgpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGFjdGl2ZV9maWxlKTtcblxuICAgICAgICBjb25zdCB7IG5ld19jb250ZW50LCBwb3NpdGlvbnMgfSA9XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VfYW5kX2dldF9jdXJzb3JfcG9zaXRpb25zKGNvbnRlbnQpO1xuICAgICAgICBpZiAocG9zaXRpb25zKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoYWN0aXZlX2ZpbGUsIG5ld19jb250ZW50KTtcbiAgICAgICAgICAgIHRoaXMuc2V0X2N1cnNvcl9sb2NhdGlvbihwb3NpdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0X2VkaXRvcl9wb3NpdGlvbl9mcm9tX2luZGV4KFxuICAgICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgICAgIGluZGV4OiBudW1iZXJcbiAgICApOiBFZGl0b3JQb3NpdGlvbiB7XG4gICAgICAgIGNvbnN0IHN1YnN0ciA9IGNvbnRlbnQuc3Vic3RyKDAsIGluZGV4KTtcblxuICAgICAgICBsZXQgbCA9IDA7XG4gICAgICAgIGxldCBvZmZzZXQgPSAtMTtcbiAgICAgICAgbGV0IHIgPSAtMTtcbiAgICAgICAgZm9yICg7IChyID0gc3Vic3RyLmluZGV4T2YoXCJcXG5cIiwgciArIDEpKSAhPT0gLTE7IGwrKywgb2Zmc2V0ID0gcik7XG4gICAgICAgIG9mZnNldCArPSAxO1xuXG4gICAgICAgIGNvbnN0IGNoID0gY29udGVudC5zdWJzdHIob2Zmc2V0LCBpbmRleCAtIG9mZnNldCkubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiB7IGxpbmU6IGwsIGNoOiBjaCB9O1xuICAgIH1cblxuICAgIHJlcGxhY2VfYW5kX2dldF9jdXJzb3JfcG9zaXRpb25zKGNvbnRlbnQ6IHN0cmluZyk6IHtcbiAgICAgICAgbmV3X2NvbnRlbnQ/OiBzdHJpbmc7XG4gICAgICAgIHBvc2l0aW9ucz86IEVkaXRvclBvc2l0aW9uW107XG4gICAgfSB7XG4gICAgICAgIGxldCBjdXJzb3JfbWF0Y2hlcyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIGNvbnN0IGN1cnNvcl9yZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICBcIjwlXFxcXHMqdHAuZmlsZS5jdXJzb3JcXFxcKCg/PG9yZGVyPlswLTldezAsMn0pXFxcXClcXFxccyolPlwiLFxuICAgICAgICAgICAgXCJnXCJcbiAgICAgICAgKTtcblxuICAgICAgICB3aGlsZSAoKG1hdGNoID0gY3Vyc29yX3JlZ2V4LmV4ZWMoY29udGVudCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnNvcl9tYXRjaGVzLnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJzb3JfbWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnNvcl9tYXRjaGVzLnNvcnQoKG0xLCBtMikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihtMS5ncm91cHNbXCJvcmRlclwiXSkgLSBOdW1iZXIobTIuZ3JvdXBzW1wib3JkZXJcIl0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWF0Y2hfc3RyID0gY3Vyc29yX21hdGNoZXNbMF1bMF07XG5cbiAgICAgICAgY3Vyc29yX21hdGNoZXMgPSBjdXJzb3JfbWF0Y2hlcy5maWx0ZXIoKG0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtWzBdID09PSBtYXRjaF9zdHI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgaW5kZXhfb2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBjdXJzb3JfbWF0Y2hlcykge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleCAtIGluZGV4X29mZnNldDtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuZ2V0X2VkaXRvcl9wb3NpdGlvbl9mcm9tX2luZGV4KGNvbnRlbnQsIGluZGV4KSk7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVfUmVnRXhwKG1hdGNoWzBdKSksIFwiXCIpO1xuICAgICAgICAgICAgaW5kZXhfb2Zmc2V0ICs9IG1hdGNoWzBdLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gRm9yIHRwLmZpbGUuY3Vyc29yKCksIHdlIGtlZXAgdGhlIGRlZmF1bHQgdG9wIHRvIGJvdHRvbVxuICAgICAgICAgICAgaWYgKG1hdGNoWzFdID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBuZXdfY29udGVudDogY29udGVudCwgcG9zaXRpb25zOiBwb3NpdGlvbnMgfTtcbiAgICB9XG5cbiAgICBzZXRfY3Vyc29yX2xvY2F0aW9uKHBvc2l0aW9uczogRWRpdG9yUG9zaXRpb25bXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIWFjdGl2ZV92aWV3KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgIGVkaXRvci5mb2N1cygpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbnM6IEFycmF5PEVkaXRvclJhbmdlT3JDYXJldD4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwb3Mgb2YgcG9zaXRpb25zKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zLnB1c2goeyBmcm9tOiBwb3MgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmFuc2FjdGlvbjogRWRpdG9yVHJhbnNhY3Rpb24gPSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBzZWxlY3Rpb25zLFxuICAgICAgICB9O1xuICAgICAgICBlZGl0b3IudHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICAgIH1cbn1cbiIsIi8vIENvZGVNaXJyb3IsIGNvcHlyaWdodCAoYykgYnkgTWFyaWpuIEhhdmVyYmVrZSBhbmQgb3RoZXJzXG4vLyBEaXN0cmlidXRlZCB1bmRlciBhbiBNSVQgbGljZW5zZTogaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9MSUNFTlNFXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbihmdW5jdGlvbiAobW9kKSB7XG4gICAgbW9kKHdpbmRvdy5Db2RlTWlycm9yKTtcbn0pKGZ1bmN0aW9uIChDb2RlTWlycm9yKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBDb2RlTWlycm9yLmRlZmluZU1vZGUoXCJqYXZhc2NyaXB0XCIsIGZ1bmN0aW9uIChjb25maWcsIHBhcnNlckNvbmZpZykge1xuICAgICAgICB2YXIgaW5kZW50VW5pdCA9IGNvbmZpZy5pbmRlbnRVbml0O1xuICAgICAgICB2YXIgc3RhdGVtZW50SW5kZW50ID0gcGFyc2VyQ29uZmlnLnN0YXRlbWVudEluZGVudDtcbiAgICAgICAgdmFyIGpzb25sZE1vZGUgPSBwYXJzZXJDb25maWcuanNvbmxkO1xuICAgICAgICB2YXIganNvbk1vZGUgPSBwYXJzZXJDb25maWcuanNvbiB8fCBqc29ubGRNb2RlO1xuICAgICAgICB2YXIgdHJhY2tTY29wZSA9IHBhcnNlckNvbmZpZy50cmFja1Njb3BlICE9PSBmYWxzZTtcbiAgICAgICAgdmFyIGlzVFMgPSBwYXJzZXJDb25maWcudHlwZXNjcmlwdDtcbiAgICAgICAgdmFyIHdvcmRSRSA9IHBhcnNlckNvbmZpZy53b3JkQ2hhcmFjdGVycyB8fCAvW1xcdyRcXHhhMS1cXHVmZmZmXS87XG5cbiAgICAgICAgLy8gVG9rZW5pemVyXG5cbiAgICAgICAgdmFyIGtleXdvcmRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGt3KHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB0eXBlOiB0eXBlLCBzdHlsZTogXCJrZXl3b3JkXCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBBID0ga3coXCJrZXl3b3JkIGFcIiksXG4gICAgICAgICAgICAgICAgQiA9IGt3KFwia2V5d29yZCBiXCIpLFxuICAgICAgICAgICAgICAgIEMgPSBrdyhcImtleXdvcmQgY1wiKSxcbiAgICAgICAgICAgICAgICBEID0ga3coXCJrZXl3b3JkIGRcIik7XG4gICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBrdyhcIm9wZXJhdG9yXCIpLFxuICAgICAgICAgICAgICAgIGF0b20gPSB7IHR5cGU6IFwiYXRvbVwiLCBzdHlsZTogXCJhdG9tXCIgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZjoga3coXCJpZlwiKSxcbiAgICAgICAgICAgICAgICB3aGlsZTogQSxcbiAgICAgICAgICAgICAgICB3aXRoOiBBLFxuICAgICAgICAgICAgICAgIGVsc2U6IEIsXG4gICAgICAgICAgICAgICAgZG86IEIsXG4gICAgICAgICAgICAgICAgdHJ5OiBCLFxuICAgICAgICAgICAgICAgIGZpbmFsbHk6IEIsXG4gICAgICAgICAgICAgICAgcmV0dXJuOiBELFxuICAgICAgICAgICAgICAgIGJyZWFrOiBELFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlOiBELFxuICAgICAgICAgICAgICAgIG5ldzoga3coXCJuZXdcIiksXG4gICAgICAgICAgICAgICAgZGVsZXRlOiBDLFxuICAgICAgICAgICAgICAgIHZvaWQ6IEMsXG4gICAgICAgICAgICAgICAgdGhyb3c6IEMsXG4gICAgICAgICAgICAgICAgZGVidWdnZXI6IGt3KFwiZGVidWdnZXJcIiksXG4gICAgICAgICAgICAgICAgdmFyOiBrdyhcInZhclwiKSxcbiAgICAgICAgICAgICAgICBjb25zdDoga3coXCJ2YXJcIiksXG4gICAgICAgICAgICAgICAgbGV0OiBrdyhcInZhclwiKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbjoga3coXCJmdW5jdGlvblwiKSxcbiAgICAgICAgICAgICAgICBjYXRjaDoga3coXCJjYXRjaFwiKSxcbiAgICAgICAgICAgICAgICBmb3I6IGt3KFwiZm9yXCIpLFxuICAgICAgICAgICAgICAgIHN3aXRjaDoga3coXCJzd2l0Y2hcIiksXG4gICAgICAgICAgICAgICAgY2FzZToga3coXCJjYXNlXCIpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGt3KFwiZGVmYXVsdFwiKSxcbiAgICAgICAgICAgICAgICBpbjogb3BlcmF0b3IsXG4gICAgICAgICAgICAgICAgdHlwZW9mOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICBpbnN0YW5jZW9mOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICB0cnVlOiBhdG9tLFxuICAgICAgICAgICAgICAgIGZhbHNlOiBhdG9tLFxuICAgICAgICAgICAgICAgIG51bGw6IGF0b20sXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkOiBhdG9tLFxuICAgICAgICAgICAgICAgIE5hTjogYXRvbSxcbiAgICAgICAgICAgICAgICBJbmZpbml0eTogYXRvbSxcbiAgICAgICAgICAgICAgICB0aGlzOiBrdyhcInRoaXNcIiksXG4gICAgICAgICAgICAgICAgY2xhc3M6IGt3KFwiY2xhc3NcIiksXG4gICAgICAgICAgICAgICAgc3VwZXI6IGt3KFwiYXRvbVwiKSxcbiAgICAgICAgICAgICAgICB5aWVsZDogQyxcbiAgICAgICAgICAgICAgICBleHBvcnQ6IGt3KFwiZXhwb3J0XCIpLFxuICAgICAgICAgICAgICAgIGltcG9ydDoga3coXCJpbXBvcnRcIiksXG4gICAgICAgICAgICAgICAgZXh0ZW5kczogQyxcbiAgICAgICAgICAgICAgICBhd2FpdDogQyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgdmFyIGlzT3BlcmF0b3JDaGFyID0gL1srXFwtKiYlPTw+IT98fl5AXS87XG4gICAgICAgIHZhciBpc0pzb25sZEtleXdvcmQgPVxuICAgICAgICAgICAgL15AKGNvbnRleHR8aWR8dmFsdWV8bGFuZ3VhZ2V8dHlwZXxjb250YWluZXJ8bGlzdHxzZXR8cmV2ZXJzZXxpbmRleHxiYXNlfHZvY2FifGdyYXBoKVwiLztcblxuICAgICAgICBmdW5jdGlvbiByZWFkUmVnZXhwKHN0cmVhbSkge1xuICAgICAgICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgICAgIGluU2V0ID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlc2NhcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09IFwiL1wiICYmICFpblNldCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PSBcIltcIikgaW5TZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpblNldCAmJiBuZXh0ID09IFwiXVwiKSBpblNldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSBcIlxcXFxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZWQgYXMgc2NyYXRjaCB2YXJpYWJsZXMgdG8gY29tbXVuaWNhdGUgbXVsdGlwbGUgdmFsdWVzIHdpdGhvdXRcbiAgICAgICAgLy8gY29uc2luZyB1cCB0b25zIG9mIG9iamVjdHMuXG4gICAgICAgIHZhciB0eXBlLCBjb250ZW50O1xuICAgICAgICBmdW5jdGlvbiByZXQodHAsIHN0eWxlLCBjb250KSB7XG4gICAgICAgICAgICB0eXBlID0gdHA7XG4gICAgICAgICAgICBjb250ZW50ID0gY29udDtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0b2tlbkJhc2Uoc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgICAgICAgdmFyIGNoID0gc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChjaCA9PSAnXCInIHx8IGNoID09IFwiJ1wiKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblN0cmluZyhjaCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBjaCA9PSBcIi5cIiAmJlxuICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaCgvXlxcZFtcXGRfXSooPzpbZUVdWytcXC1dP1tcXGRfXSspPy8pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PSBcIi5cIiAmJiBzdHJlYW0ubWF0Y2goXCIuLlwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJzcHJlYWRcIiwgXCJtZXRhXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvW1xcW1xcXXt9XFwoXFwpLDtcXDpcXC5dLy50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoY2gpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PSBcIj1cIiAmJiBzdHJlYW0uZWF0KFwiPlwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCI9PlwiLCBcIm9wZXJhdG9yXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBjaCA9PSBcIjBcIiAmJlxuICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaCgvXig/OnhbXFxkQS1GYS1mX10rfG9bMC03X10rfGJbMDFfXSspbj8vKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIm51bWJlclwiLCBcIm51bWJlclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcZC8udGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICBzdHJlYW0ubWF0Y2goXG4gICAgICAgICAgICAgICAgICAgIC9eW1xcZF9dKig/Om58KD86XFwuW1xcZF9dKik/KD86W2VFXVsrXFwtXT9bXFxkX10rKT8pPy9cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJudW1iZXJcIiwgXCJudW1iZXJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiL1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5lYXQoXCIqXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5Db21tZW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyZWFtLmVhdChcIi9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLnNraXBUb0VuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwiY29tbWVudFwiLCBcImNvbW1lbnRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uQWxsb3dlZChzdHJlYW0sIHN0YXRlLCAxKSkge1xuICAgICAgICAgICAgICAgICAgICByZWFkUmVnZXhwKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaCgvXlxcYigoW2dpbXl1c10pKD8hW2dpbXl1c10qXFwyKSkrXFxiLyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJyZWdleHBcIiwgXCJzdHJpbmctMlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uZWF0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIm9wZXJhdG9yXCIsIFwib3BlcmF0b3JcIiwgc3RyZWFtLmN1cnJlbnQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PSBcImBcIikge1xuICAgICAgICAgICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW5RdWFzaShzdHJlYW0sIHN0YXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIjXCIgJiYgc3RyZWFtLnBlZWsoKSA9PSBcIiFcIikge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwibWV0YVwiLCBcIm1ldGFcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiI1wiICYmIHN0cmVhbS5lYXRXaGlsZSh3b3JkUkUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInZhcmlhYmxlXCIsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIChjaCA9PSBcIjxcIiAmJiBzdHJlYW0ubWF0Y2goXCIhLS1cIikpIHx8XG4gICAgICAgICAgICAgICAgKGNoID09IFwiLVwiICYmXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaChcIi0+XCIpICYmXG4gICAgICAgICAgICAgICAgICAgICEvXFxTLy50ZXN0KHN0cmVhbS5zdHJpbmcuc2xpY2UoMCwgc3RyZWFtLnN0YXJ0KSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcImNvbW1lbnRcIiwgXCJjb21tZW50XCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc09wZXJhdG9yQ2hhci50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgIGlmIChjaCAhPSBcIj5cIiB8fCAhc3RhdGUubGV4aWNhbCB8fCBzdGF0ZS5sZXhpY2FsLnR5cGUgIT0gXCI+XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5lYXQoXCI9XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT0gXCIhXCIgfHwgY2ggPT0gXCI9XCIpIHN0cmVhbS5lYXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9bPD4qK1xcLXwmP10vLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJlYW0uZWF0KGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PSBcIj5cIikgc3RyZWFtLmVhdChjaCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoID09IFwiP1wiICYmIHN0cmVhbS5lYXQoXCIuXCIpKSByZXR1cm4gcmV0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwib3BlcmF0b3JcIiwgXCJvcGVyYXRvclwiLCBzdHJlYW0uY3VycmVudCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLmVhdFdoaWxlKHdvcmRSRSk7XG4gICAgICAgICAgICAgICAgdmFyIHdvcmQgPSBzdHJlYW0uY3VycmVudCgpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5sYXN0VHlwZSAhPSBcIi5cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5d29yZHMucHJvcGVydHlJc0VudW1lcmFibGUod29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrdyA9IGtleXdvcmRzW3dvcmRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChrdy50eXBlLCBrdy5zdHlsZSwgd29yZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgd29yZCA9PSBcImFzeW5jXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXihcXHN8XFwvXFwqKFteKl18XFwqKD8hXFwvKSkqP1xcKlxcLykqW1xcW1xcKFxcd10vLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJhc3luY1wiLCBcImtleXdvcmRcIiwgd29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJ2YXJpYWJsZVwiLCBcInZhcmlhYmxlXCIsIHdvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9rZW5TdHJpbmcocXVvdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG5leHQ7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBqc29ubGRNb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5wZWVrKCkgPT0gXCJAXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKGlzSnNvbmxkS2V5d29yZClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJqc29ubGQta2V5d29yZFwiLCBcIm1ldGFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT0gcXVvdGUgJiYgIWVzY2FwZWQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSBcIlxcXFxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFlc2NhcGVkKSBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwic3RyaW5nXCIsIFwic3RyaW5nXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRva2VuQ29tbWVudChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICB2YXIgbWF5YmVFbmQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaDtcbiAgICAgICAgICAgIHdoaWxlICgoY2ggPSBzdHJlYW0ubmV4dCgpKSkge1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PSBcIi9cIiAmJiBtYXliZUVuZCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1heWJlRW5kID0gY2ggPT0gXCIqXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0KFwiY29tbWVudFwiLCBcImNvbW1lbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2tlblF1YXNpKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgbmV4dDtcbiAgICAgICAgICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICFlc2NhcGVkICYmXG4gICAgICAgICAgICAgICAgICAgIChuZXh0ID09IFwiYFwiIHx8IChuZXh0ID09IFwiJFwiICYmIHN0cmVhbS5lYXQoXCJ7XCIpKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSBcIlxcXFxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQoXCJxdWFzaVwiLCBcInN0cmluZy0yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJyYWNrZXRzID0gXCIoW3t9XSlcIjtcbiAgICAgICAgLy8gVGhpcyBpcyBhIGNydWRlIGxvb2thaGVhZCB0cmljayB0byB0cnkgYW5kIG5vdGljZSB0aGF0IHdlJ3JlXG4gICAgICAgIC8vIHBhcnNpbmcgdGhlIGFyZ3VtZW50IHBhdHRlcm5zIGZvciBhIGZhdC1hcnJvdyBmdW5jdGlvbiBiZWZvcmUgd2VcbiAgICAgICAgLy8gYWN0dWFsbHkgaGl0IHRoZSBhcnJvdyB0b2tlbi4gSXQgb25seSB3b3JrcyBpZiB0aGUgYXJyb3cgaXMgb25cbiAgICAgICAgLy8gdGhlIHNhbWUgbGluZSBhcyB0aGUgYXJndW1lbnRzIGFuZCB0aGVyZSdzIG5vIHN0cmFuZ2Ugbm9pc2VcbiAgICAgICAgLy8gKGNvbW1lbnRzKSBpbiBiZXR3ZWVuLiBGYWxsYmFjayBpcyB0byBvbmx5IG5vdGljZSB3aGVuIHdlIGhpdCB0aGVcbiAgICAgICAgLy8gYXJyb3csIGFuZCBub3QgZGVjbGFyZSB0aGUgYXJndW1lbnRzIGFzIGxvY2FscyBmb3IgdGhlIGFycm93XG4gICAgICAgIC8vIGJvZHkuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRGYXRBcnJvdyhzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUuZmF0QXJyb3dBdCkgc3RhdGUuZmF0QXJyb3dBdCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgYXJyb3cgPSBzdHJlYW0uc3RyaW5nLmluZGV4T2YoXCI9PlwiLCBzdHJlYW0uc3RhcnQpO1xuICAgICAgICAgICAgaWYgKGFycm93IDwgMCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoaXNUUykge1xuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBza2lwIFR5cGVTY3JpcHQgcmV0dXJuIHR5cGUgZGVjbGFyYXRpb25zIGFmdGVyIHRoZSBhcmd1bWVudHNcbiAgICAgICAgICAgICAgICB2YXIgbSA9IC86XFxzKig/OlxcdysoPzo8W14+XSo+fFxcW1xcXSk/fFxce1tefV0qXFx9KVxccyokLy5leGVjKFxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc3RyaW5nLnNsaWNlKHN0cmVhbS5zdGFydCwgYXJyb3cpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAobSkgYXJyb3cgPSBtLmluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVwdGggPSAwLFxuICAgICAgICAgICAgICAgIHNhd1NvbWV0aGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgcG9zID0gYXJyb3cgLSAxOyBwb3MgPj0gMDsgLS1wb3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2ggPSBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICAgIHZhciBicmFja2V0ID0gYnJhY2tldHMuaW5kZXhPZihjaCk7XG4gICAgICAgICAgICAgICAgaWYgKGJyYWNrZXQgPj0gMCAmJiBicmFja2V0IDwgMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRlcHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK3BvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgtLWRlcHRoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PSBcIihcIikgc2F3U29tZXRoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChicmFja2V0ID49IDMgJiYgYnJhY2tldCA8IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgKytkZXB0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHdvcmRSRS50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgICAgICBzYXdTb21ldGhpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL1tcIidcXC9gXS8udGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IDsgLS1wb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MgPT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID09IGNoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWFtLnN0cmluZy5jaGFyQXQocG9zIC0gMikgIT0gXCJcXFxcXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2F3U29tZXRoaW5nICYmICFkZXB0aCkgc3RhdGUuZmF0QXJyb3dBdCA9IHBvcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhcnNlclxuXG4gICAgICAgIHZhciBhdG9taWNUeXBlcyA9IHtcbiAgICAgICAgICAgIGF0b206IHRydWUsXG4gICAgICAgICAgICBudW1iZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmluZzogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2V4cDogdHJ1ZSxcbiAgICAgICAgICAgIHRoaXM6IHRydWUsXG4gICAgICAgICAgICBpbXBvcnQ6IHRydWUsXG4gICAgICAgICAgICBcImpzb25sZC1rZXl3b3JkXCI6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gSlNMZXhpY2FsKGluZGVudGVkLCBjb2x1bW4sIHR5cGUsIGFsaWduLCBwcmV2LCBpbmZvKSB7XG4gICAgICAgICAgICB0aGlzLmluZGVudGVkID0gaW5kZW50ZWQ7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB0aGlzLnByZXYgPSBwcmV2O1xuICAgICAgICAgICAgdGhpcy5pbmZvID0gaW5mbztcbiAgICAgICAgICAgIGlmIChhbGlnbiAhPSBudWxsKSB0aGlzLmFsaWduID0gYWxpZ247XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpblNjb3BlKHN0YXRlLCB2YXJuYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXRyYWNrU2NvcGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIHYgPSBzdGF0ZS5sb2NhbFZhcnM7IHY7IHYgPSB2Lm5leHQpXG4gICAgICAgICAgICAgICAgaWYgKHYubmFtZSA9PSB2YXJuYW1lKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAodmFyIGN4ID0gc3RhdGUuY29udGV4dDsgY3g7IGN4ID0gY3gucHJldikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgPSBjeC52YXJzOyB2OyB2ID0gdi5uZXh0KVxuICAgICAgICAgICAgICAgICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGFyc2VKUyhzdGF0ZSwgc3R5bGUsIHR5cGUsIGNvbnRlbnQsIHN0cmVhbSkge1xuICAgICAgICAgICAgdmFyIGNjID0gc3RhdGUuY2M7XG4gICAgICAgICAgICAvLyBDb21tdW5pY2F0ZSBvdXIgY29udGV4dCB0byB0aGUgY29tYmluYXRvcnMuXG4gICAgICAgICAgICAvLyAoTGVzcyB3YXN0ZWZ1bCB0aGFuIGNvbnNpbmcgdXAgYSBodW5kcmVkIGNsb3N1cmVzIG9uIGV2ZXJ5IGNhbGwuKVxuICAgICAgICAgICAgY3guc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIGN4LnN0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgICAgIChjeC5tYXJrZWQgPSBudWxsKSwgKGN4LmNjID0gY2MpO1xuICAgICAgICAgICAgY3guc3R5bGUgPSBzdHlsZTtcblxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5sZXhpY2FsLmhhc093blByb3BlcnR5KFwiYWxpZ25cIikpXG4gICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbC5hbGlnbiA9IHRydWU7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbWJpbmF0b3IgPSBjYy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgPyBjYy5wb3AoKVxuICAgICAgICAgICAgICAgICAgICA6IGpzb25Nb2RlXG4gICAgICAgICAgICAgICAgICAgID8gZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICA6IHN0YXRlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoY29tYmluYXRvcih0eXBlLCBjb250ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY2MubGVuZ3RoICYmIGNjW2NjLmxlbmd0aCAtIDFdLmxleCkgY2MucG9wKCkoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN4Lm1hcmtlZCkgcmV0dXJuIGN4Lm1hcmtlZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmIGluU2NvcGUoc3RhdGUsIGNvbnRlbnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidmFyaWFibGUtMlwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tYmluYXRvciB1dGlsc1xuXG4gICAgICAgIHZhciBjeCA9IHsgc3RhdGU6IG51bGwsIGNvbHVtbjogbnVsbCwgbWFya2VkOiBudWxsLCBjYzogbnVsbCB9O1xuICAgICAgICBmdW5jdGlvbiBwYXNzKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICBjeC5jYy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29udCgpIHtcbiAgICAgICAgICAgIHBhc3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGluTGlzdChuYW1lLCBsaXN0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB2ID0gbGlzdDsgdjsgdiA9IHYubmV4dCkgaWYgKHYubmFtZSA9PSBuYW1lKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZWdpc3Rlcih2YXJuYW1lKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBjeC5zdGF0ZTtcbiAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwiZGVmXCI7XG4gICAgICAgICAgICBpZiAoIXRyYWNrU2NvcGUpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsLmluZm8gPT0gXCJ2YXJcIiAmJlxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5jb250ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbnRleHQuYmxvY2tcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRklYTUUgZnVuY3Rpb24gZGVjbHMgYXJlIGFsc28gbm90IGJsb2NrIHNjb3BlZFxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Q29udGV4dCA9IHJlZ2lzdGVyVmFyU2NvcGVkKHZhcm5hbWUsIHN0YXRlLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5jb250ZXh0ID0gbmV3Q29udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWluTGlzdCh2YXJuYW1lLCBzdGF0ZS5sb2NhbFZhcnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmxvY2FsVmFycyA9IG5ldyBWYXIodmFybmFtZSwgc3RhdGUubG9jYWxWYXJzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZhbGwgdGhyb3VnaCBtZWFucyB0aGlzIGlzIGdsb2JhbFxuICAgICAgICAgICAgaWYgKHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzICYmICFpbkxpc3QodmFybmFtZSwgc3RhdGUuZ2xvYmFsVmFycykpXG4gICAgICAgICAgICAgICAgc3RhdGUuZ2xvYmFsVmFycyA9IG5ldyBWYXIodmFybmFtZSwgc3RhdGUuZ2xvYmFsVmFycyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJWYXJTY29wZWQodmFybmFtZSwgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuYmxvY2spIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXIgPSByZWdpc3RlclZhclNjb3BlZCh2YXJuYW1lLCBjb250ZXh0LnByZXYpO1xuICAgICAgICAgICAgICAgIGlmICghaW5uZXIpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChpbm5lciA9PSBjb250ZXh0LnByZXYpIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGV4dChpbm5lciwgY29udGV4dC52YXJzLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5MaXN0KHZhcm5hbWUsIGNvbnRleHQudmFycykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250ZXh0KFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnByZXYsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWYXIodmFybmFtZSwgY29udGV4dC52YXJzKSxcbiAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNNb2RpZmllcihuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJwdWJsaWNcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJwcml2YXRlXCIgfHxcbiAgICAgICAgICAgICAgICBuYW1lID09IFwicHJvdGVjdGVkXCIgfHxcbiAgICAgICAgICAgICAgICBuYW1lID09IFwiYWJzdHJhY3RcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJyZWFkb25seVwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tYmluYXRvcnNcblxuICAgICAgICBmdW5jdGlvbiBDb250ZXh0KHByZXYsIHZhcnMsIGJsb2NrKSB7XG4gICAgICAgICAgICB0aGlzLnByZXYgPSBwcmV2O1xuICAgICAgICAgICAgdGhpcy52YXJzID0gdmFycztcbiAgICAgICAgICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBWYXIobmFtZSwgbmV4dCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdFZhcnMgPSBuZXcgVmFyKFwidGhpc1wiLCBuZXcgVmFyKFwiYXJndW1lbnRzXCIsIG51bGwpKTtcbiAgICAgICAgZnVuY3Rpb24gcHVzaGNvbnRleHQoKSB7XG4gICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0ID0gbmV3IENvbnRleHQoXG4gICAgICAgICAgICAgICAgY3guc3RhdGUuY29udGV4dCxcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMgPSBkZWZhdWx0VmFycztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwdXNoYmxvY2tjb250ZXh0KCkge1xuICAgICAgICAgICAgY3guc3RhdGUuY29udGV4dCA9IG5ldyBDb250ZXh0KFxuICAgICAgICAgICAgICAgIGN4LnN0YXRlLmNvbnRleHQsXG4gICAgICAgICAgICAgICAgY3guc3RhdGUubG9jYWxWYXJzLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBvcGNvbnRleHQoKSB7XG4gICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMgPSBjeC5zdGF0ZS5jb250ZXh0LnZhcnM7XG4gICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0ID0gY3guc3RhdGUuY29udGV4dC5wcmV2O1xuICAgICAgICB9XG4gICAgICAgIHBvcGNvbnRleHQubGV4ID0gdHJ1ZTtcbiAgICAgICAgZnVuY3Rpb24gcHVzaGxleCh0eXBlLCBpbmZvKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBzdGF0ZS5pbmRlbnRlZDtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUubGV4aWNhbC50eXBlID09IFwic3RhdFwiKVxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdXRlciA9IHN0YXRlLmxleGljYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRlciAmJiBvdXRlci50eXBlID09IFwiKVwiICYmIG91dGVyLmFsaWduO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXIgPSBvdXRlci5wcmV2XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudCA9IG91dGVyLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwgPSBuZXcgSlNMZXhpY2FsKFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0cmVhbS5jb2x1bW4oKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbCxcbiAgICAgICAgICAgICAgICAgICAgaW5mb1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzdWx0LmxleCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBvcGxleCgpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmxleGljYWwucHJldikge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gXCIpXCIpXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmluZGVudGVkID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsID0gc3RhdGUubGV4aWNhbC5wcmV2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBvcGxleC5sZXggPSB0cnVlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGVjdCh3YW50ZWQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4cCh0eXBlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gd2FudGVkKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB3YW50ZWQgPT0gXCI7XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9PSBcIn1cIiB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlID09IFwiKVwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPT0gXCJdXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gY29udChleHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGV4cDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0YXRlbWVudCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcInZhcmRlZlwiLCB2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIHZhcmRlZixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiO1wiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwia2V5d29yZCBhXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHBhcmVuRXhwciwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGJcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY3guc3RyZWFtLm1hdGNoKC9eXFxzKiQvLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgPyBjb250KClcbiAgICAgICAgICAgICAgICAgICAgOiBjb250KFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwic3RhdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXhcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJkZWJ1Z2dlclwiKSByZXR1cm4gY29udChleHBlY3QoXCI7XCIpKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwifVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGJsb2NrY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgYmxvY2ssXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiaWZcIikge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgY3guc3RhdGUubGV4aWNhbC5pbmZvID09IFwiZWxzZVwiICYmXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0YXRlLmNjW2N4LnN0YXRlLmNjLmxlbmd0aCAtIDFdID09IHBvcGxleFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgY3guc3RhdGUuY2MucG9wKCkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgIHBhcmVuRXhwcixcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1heWJlZWxzZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZm9yXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoYmxvY2tjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBmb3JzcGVjLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImNsYXNzXCIgfHwgKGlzVFMgJiYgdmFsdWUgPT0gXCJpbnRlcmZhY2VcIikpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiwgdHlwZSA9PSBcImNsYXNzXCIgPyB0eXBlIDogdmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcImRlY2xhcmVcIikge1xuICAgICAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBpc1RTICYmXG4gICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PSBcIm1vZHVsZVwiIHx8IHZhbHVlID09IFwiZW51bVwiIHx8IHZhbHVlID09IFwidHlwZVwiKSAmJlxuICAgICAgICAgICAgICAgICAgICBjeC5zdHJlYW0ubWF0Y2goL15cXHMqXFx3LywgZmFsc2UpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJlbnVtXCIpIHJldHVybiBjb250KGVudW1kZWYpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PSBcInR5cGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIm9wZXJhdG9yXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVleHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIjtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwie1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwifVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcIm5hbWVzcGFjZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgZXhwcmVzc2lvbiwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcImFic3RyYWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KHN0YXRlbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcInN0YXRcIiksIG1heWJlbGFiZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3dpdGNoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbkV4cHIsXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIntcIiksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIsIFwic3dpdGNoXCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoYmxvY2tjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBibG9jayxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJjYXNlXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdChcIjpcIikpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJkZWZhdWx0XCIpIHJldHVybiBjb250KGV4cGVjdChcIjpcIikpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJjYXRjaFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiZm9ybVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIG1heWJlQ2F0Y2hCaW5kaW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImV4cG9ydFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJzdGF0XCIpLCBhZnRlckV4cG9ydCwgcG9wbGV4KTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiaW1wb3J0XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcInN0YXRcIiksIGFmdGVySW1wb3J0LCBwb3BsZXgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJhc3luY1wiKSByZXR1cm4gY29udChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiQFwiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MocHVzaGxleChcInN0YXRcIiksIGV4cHJlc3Npb24sIGV4cGVjdChcIjtcIiksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVDYXRjaEJpbmRpbmcodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KGZ1bmFyZywgZXhwZWN0KFwiKVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25Jbm5lcih0eXBlLCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4cHJlc3Npb25Ob0NvbW1hKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwYXJlbkV4cHIodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT0gXCIoXCIpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiKVwiKSwgbWF5YmVleHByZXNzaW9uLCBleHBlY3QoXCIpXCIpLCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4cHJlc3Npb25Jbm5lcih0eXBlLCB2YWx1ZSwgbm9Db21tYSkge1xuICAgICAgICAgICAgaWYgKGN4LnN0YXRlLmZhdEFycm93QXQgPT0gY3guc3RyZWFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJvZHkgPSBub0NvbW1hID8gYXJyb3dCb2R5Tm9Db21tYSA6IGFycm93Qm9keTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI9PlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiPT5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWF5YmVvcCA9IG5vQ29tbWEgPyBtYXliZW9wZXJhdG9yTm9Db21tYSA6IG1heWJlb3BlcmF0b3JDb21tYTtcbiAgICAgICAgICAgIGlmIChhdG9taWNUeXBlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgcmV0dXJuIGNvbnQobWF5YmVvcCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb250KGZ1bmN0aW9uZGVmLCBtYXliZW9wKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiY2xhc3NcIiB8fCAoaXNUUyAmJiB2YWx1ZSA9PSBcImludGVyZmFjZVwiKSkge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBjbGFzc0V4cHJlc3Npb24sIHBvcGxleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgY1wiIHx8IHR5cGUgPT0gXCJhc3luY1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG5vQ29tbWEgPyBleHByZXNzaW9uTm9Db21tYSA6IGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICBtYXliZWV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVvcFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgdHlwZSA9PSBcInNwcmVhZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG5vQ29tbWEgPyBleHByZXNzaW9uTm9Db21tYSA6IGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIl1cIiksIGFycmF5TGl0ZXJhbCwgcG9wbGV4LCBtYXliZW9wKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKG9ianByb3AsIFwifVwiLCBudWxsLCBtYXliZW9wKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwicXVhc2lcIikgcmV0dXJuIHBhc3MocXVhc2ksIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJuZXdcIikgcmV0dXJuIGNvbnQobWF5YmVUYXJnZXQobm9Db21tYSkpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZWV4cHJlc3Npb24odHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUubWF0Y2goL1s7XFx9XFwpXFxdLF0vKSkgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVvcGVyYXRvckNvbW1hKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQobWF5YmVleHByZXNzaW9uKTtcbiAgICAgICAgICAgIHJldHVybiBtYXliZW9wZXJhdG9yTm9Db21tYSh0eXBlLCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBub0NvbW1hKSB7XG4gICAgICAgICAgICB2YXIgbWUgPVxuICAgICAgICAgICAgICAgIG5vQ29tbWEgPT0gZmFsc2UgPyBtYXliZW9wZXJhdG9yQ29tbWEgOiBtYXliZW9wZXJhdG9yTm9Db21tYTtcbiAgICAgICAgICAgIHZhciBleHByID0gbm9Db21tYSA9PSBmYWxzZSA/IGV4cHJlc3Npb24gOiBleHByZXNzaW9uTm9Db21tYTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiPT5cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwib3BlcmF0b3JcIikge1xuICAgICAgICAgICAgICAgIGlmICgvXFwrXFwrfC0tLy50ZXN0KHZhbHVlKSB8fCAoaXNUUyAmJiB2YWx1ZSA9PSBcIiFcIikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KG1lKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzVFMgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPT0gXCI8XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RyZWFtLm1hdGNoKC9eKFtePD5dfDxbXjw+XSo+KSo+XFxzKlxcKC8sIGZhbHNlKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiOlwiKSwgZXhwcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInF1YXNpXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFzcyhxdWFzaSwgbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI7XCIpIHJldHVybjtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250Q29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsIFwiKVwiLCBcImNhbGxcIiwgbWUpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIuXCIpIHJldHVybiBjb250KHByb3BlcnR5LCBtZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIl1cIiksXG4gICAgICAgICAgICAgICAgICAgIG1heWJlZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBtZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcImFzXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlZXhwciwgbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJyZWdleHBcIikge1xuICAgICAgICAgICAgICAgIGN4LnN0YXRlLmxhc3RUeXBlID0gY3gubWFya2VkID0gXCJvcGVyYXRvclwiO1xuICAgICAgICAgICAgICAgIGN4LnN0cmVhbS5iYWNrVXAoY3guc3RyZWFtLnBvcyAtIGN4LnN0cmVhbS5zdGFydCAtIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHF1YXNpKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPSBcInF1YXNpXCIpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICBpZiAodmFsdWUuc2xpY2UodmFsdWUubGVuZ3RoIC0gMikgIT0gXCIke1wiKSByZXR1cm4gY29udChxdWFzaSk7XG4gICAgICAgICAgICByZXR1cm4gY29udChtYXliZWV4cHJlc3Npb24sIGNvbnRpbnVlUXVhc2kpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbnRpbnVlUXVhc2kodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInN0cmluZy0yXCI7XG4gICAgICAgICAgICAgICAgY3guc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHF1YXNpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhcnJvd0JvZHkodHlwZSkge1xuICAgICAgICAgICAgZmluZEZhdEFycm93KGN4LnN0cmVhbSwgY3guc3RhdGUpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZSA9PSBcIntcIiA/IHN0YXRlbWVudCA6IGV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFycm93Qm9keU5vQ29tbWEodHlwZSkge1xuICAgICAgICAgICAgZmluZEZhdEFycm93KGN4LnN0cmVhbSwgY3guc3RhdGUpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZSA9PSBcIntcIiA/IHN0YXRlbWVudCA6IGV4cHJlc3Npb25Ob0NvbW1hKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZVRhcmdldChub0NvbW1hKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIGNvbnQobm9Db21tYSA/IHRhcmdldE5vQ29tbWEgOiB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmIGlzVFMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVUeXBlQXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vQ29tbWEgPyBtYXliZW9wZXJhdG9yTm9Db21tYSA6IG1heWJlb3BlcmF0b3JDb21tYVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHBhc3Mobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRhcmdldChfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwidGFyZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZW9wZXJhdG9yQ29tbWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRhcmdldE5vQ29tbWEoXywgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcInRhcmdldFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvck5vQ29tbWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlbGFiZWwodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHBvcGxleCwgc3RhdGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKG1heWJlb3BlcmF0b3JDb21tYSwgZXhwZWN0KFwiO1wiKSwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwcm9wZXJ0eSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvYmpwcm9wKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImFzeW5jXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImdldFwiIHx8IHZhbHVlID09IFwic2V0XCIpIHJldHVybiBjb250KGdldHRlclNldHRlcik7XG4gICAgICAgICAgICAgICAgdmFyIG07IC8vIFdvcmsgYXJvdW5kIGZhdC1hcnJvdy1kZXRlY3Rpb24gY29tcGxpY2F0aW9uIGZvciBkZXRlY3RpbmcgdHlwZXNjcmlwdCB0eXBlZCBhcnJvdyBwYXJhbXNcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzVFMgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RhdGUuZmF0QXJyb3dBdCA9PSBjeC5zdHJlYW0uc3RhcnQgJiZcbiAgICAgICAgICAgICAgICAgICAgKG0gPSBjeC5zdHJlYW0ubWF0Y2goL15cXHMqOlxccyovLCBmYWxzZSkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5mYXRBcnJvd0F0ID0gY3guc3RyZWFtLnBvcyArIG1bMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGFmdGVycHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBqc29ubGRNb2RlID8gXCJwcm9wZXJ0eVwiIDogY3guc3R5bGUgKyBcIiBwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGFmdGVycHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJqc29ubGQta2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUUyAmJiBpc01vZGlmaWVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG9ianByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiW1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgbWF5YmV0eXBlLCBleHBlY3QoXCJdXCIpLCBhZnRlcnByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uTm9Db21tYSwgYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChvYmpwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIjpcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKGFmdGVycHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0dGVyU2V0dGVyKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9IFwidmFyaWFibGVcIikgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZnRlcnByb3AodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gcGFzcyhmdW5jdGlvbmRlZik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29tbWFzZXAod2hhdCwgZW5kLCBzZXApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHByb2NlZWQodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VwID8gc2VwLmluZGV4T2YodHlwZSkgPiAtMSA6IHR5cGUgPT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxleCA9IGN4LnN0YXRlLmxleGljYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXguaW5mbyA9PSBcImNhbGxcIikgbGV4LnBvcyA9IChsZXgucG9zIHx8IDApICsgMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhc3Mod2hhdCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHByb2NlZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgICAgIGlmIChzZXAgJiYgc2VwLmluZGV4T2YoXCI7XCIpID4gLTEpIHJldHVybiBwYXNzKHdoYXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cGVjdChlbmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKHdoYXQsIHByb2NlZWQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb250Q29tbWFzZXAod2hhdCwgZW5kLCBpbmZvKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgY3guY2MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChlbmQsIGluZm8pLCBjb21tYXNlcCh3aGF0LCBlbmQpLCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGJsb2NrKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwifVwiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50LCBibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmV0eXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNUUykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiOlwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udChtYXliZXR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJldHlwZU9ySW4odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc1RTICYmICh0eXBlID09IFwiOlwiIHx8IHZhbHVlID09IFwiaW5cIikpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZXJldHR5cGUodHlwZSkge1xuICAgICAgICAgICAgaWYgKGlzVFMgJiYgdHlwZSA9PSBcIjpcIikge1xuICAgICAgICAgICAgICAgIGlmIChjeC5zdHJlYW0ubWF0Y2goL15cXHMqXFx3K1xccytpc1xcYi8sIGZhbHNlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgaXNLVywgdHlwZWV4cHIpO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzS1coXywgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImlzXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHR5cGVleHByKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJrZXlvZlwiIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJ0eXBlb2ZcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlID09IFwiaW5mZXJcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlID09IFwicmVhZG9ubHlcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodmFsdWUgPT0gXCJ0eXBlb2ZcIiA/IGV4cHJlc3Npb25Ob0NvbW1hIDogdHlwZWV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IHZhbHVlID09IFwidm9pZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJ0eXBlXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB2YWx1ZSA9PSBcIiZcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJzdHJpbmdcIiB8fCB0eXBlID09IFwibnVtYmVyXCIgfHwgdHlwZSA9PSBcImF0b21cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChhZnRlclR5cGUpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJdXCIpLFxuICAgICAgICAgICAgICAgICAgICBjb21tYXNlcCh0eXBlZXhwciwgXCJdXCIsIFwiLFwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBhZnRlclR5cGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIn1cIiksIHR5cGVwcm9wcywgcG9wbGV4LCBhZnRlclR5cGUpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoY29tbWFzZXAodHlwZWFyZywgXCIpXCIpLCBtYXliZVJldHVyblR5cGUsIGFmdGVyVHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjxcIikgcmV0dXJuIGNvbnQoY29tbWFzZXAodHlwZWV4cHIsIFwiPlwiKSwgdHlwZWV4cHIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJxdWFzaVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MocXVhc2lUeXBlLCBhZnRlclR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlUmV0dXJuVHlwZSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIj0+XCIpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlcHJvcHModHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUubWF0Y2goL1tcXH1cXClcXF1dLykpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIixcIiB8fCB0eXBlID09IFwiO1wiKSByZXR1cm4gY29udCh0eXBlcHJvcHMpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZXByb3AsIHR5cGVwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZXByb3AodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIiB8fCBjeC5zdHlsZSA9PSBcImtleXdvcmRcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09IFwiP1wiIHx8IHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJbXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwidmFyaWFibGVcIiksXG4gICAgICAgICAgICAgICAgICAgIG1heWJldHlwZU9ySW4sXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIl1cIiksXG4gICAgICAgICAgICAgICAgICAgIHR5cGVwcm9wXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIihcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVjbCwgdHlwZXByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdHlwZS5tYXRjaCgvWztcXH1cXClcXF0sXS8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBxdWFzaVR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9IFwicXVhc2lcIikgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSAyKSAhPSBcIiR7XCIpIHJldHVybiBjb250KHF1YXNpVHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gY29udCh0eXBlZXhwciwgY29udGludWVRdWFzaVR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbnRpbnVlUXVhc2lUeXBlKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwifVwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJzdHJpbmctMlwiO1xuICAgICAgICAgICAgICAgIGN4LnN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChxdWFzaVR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHR5cGVhcmcodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgY3guc3RyZWFtLm1hdGNoKC9eXFxzKls/Ol0vLCBmYWxzZSkpIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCI/XCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlYXJnKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiOlwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udCh0eXBlYXJnKTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKHR5cGVleHByKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZnRlclR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJUeXBlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB0eXBlID09IFwiLlwiIHx8IHZhbHVlID09IFwiJlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiW1wiKSByZXR1cm4gY29udCh0eXBlZXhwciwgZXhwZWN0KFwiXVwiKSwgYWZ0ZXJUeXBlKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImV4dGVuZHNcIiB8fCB2YWx1ZSA9PSBcImltcGxlbWVudHNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQodHlwZWV4cHIsIGV4cGVjdChcIjpcIiksIHR5cGVleHByKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZVR5cGVBcmdzKF8sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI8XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBjb21tYXNlcCh0eXBlZXhwciwgXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyVHlwZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZXBhcmFtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZWV4cHIsIG1heWJlVHlwZURlZmF1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlVHlwZURlZmF1bHQoXywgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHZhcmRlZihfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZW51bVwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZW51bWRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZXR5cGUsIG1heWJlQXNzaWduLCB2YXJkZWZDb250KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwYXR0ZXJuKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiBpc01vZGlmaWVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udChwYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiW1wiKSByZXR1cm4gY29udENvbW1hc2VwKGVsdHBhdHRlcm4sIFwiXVwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKHByb3BwYXR0ZXJuLCBcIn1cIik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcHJvcHBhdHRlcm4odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIiAmJiAhY3guc3RyZWFtLm1hdGNoKC9eXFxzKjovLCBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobWF5YmVBc3NpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udChwYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwifVwiKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiXVwiKSwgZXhwZWN0KFwiOlwiKSwgcHJvcHBhdHRlcm4pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSwgcGF0dGVybiwgbWF5YmVBc3NpZ24pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVsdHBhdHRlcm4oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVBc3NpZ24oX3R5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI9XCIpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB2YXJkZWZDb250KHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiLFwiKSByZXR1cm4gY29udCh2YXJkZWYpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlZWxzZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGJcIiAmJiB2YWx1ZSA9PSBcImVsc2VcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiLCBcImVsc2VcIiksIHN0YXRlbWVudCwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3JzcGVjKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJhd2FpdFwiKSByZXR1cm4gY29udChmb3JzcGVjKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiKVwiKSwgZm9yc3BlYzEsIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZm9yc3BlYzEodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJcIikgcmV0dXJuIGNvbnQodmFyZGVmLCBmb3JzcGVjMik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHJldHVybiBjb250KGZvcnNwZWMyKTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKGZvcnNwZWMyKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3JzcGVjMih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIpXCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiaW5cIiB8fCB2YWx1ZSA9PSBcIm9mXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBmb3JzcGVjMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uLCBmb3JzcGVjMik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZnVuY3Rpb25kZWYodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbmRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICBjb21tYXNlcChmdW5hcmcsIFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBtYXliZXJldHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uZGVmXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmdW5jdGlvbmRlY2wodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uZGVjbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWNsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKGZ1bmFyZywgXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1heWJlcmV0dHlwZSxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uZGVjbFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZW5hbWUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwia2V5d29yZFwiIHx8IHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJ0eXBlXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodHlwZW5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIjxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCI+XCIpLCBjb21tYXNlcCh0eXBlcGFyYW0sIFwiPlwiKSwgcG9wbGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmdW5hcmcodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIkBcIikgY29udChleHByZXNzaW9uLCBmdW5hcmcpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJzcHJlYWRcIikgcmV0dXJuIGNvbnQoZnVuYXJnKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1RTICYmIHR5cGUgPT0gXCJ0aGlzXCIpIHJldHVybiBjb250KG1heWJldHlwZSwgbWF5YmVBc3NpZ24pO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NFeHByZXNzaW9uKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyBDbGFzcyBleHByZXNzaW9ucyBtYXkgaGF2ZSBhbiBvcHRpb25hbCBuYW1lLlxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gY2xhc3NOYW1lKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWVBZnRlcih0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NOYW1lKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoY2xhc3NOYW1lQWZ0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsYXNzTmFtZUFmdGVyKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI8XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBjb21tYXNlcCh0eXBlcGFyYW0sIFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWVBZnRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJleHRlbmRzXCIgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImltcGxlbWVudHNcIiB8fFxuICAgICAgICAgICAgICAgIChpc1RTICYmIHR5cGUgPT0gXCIsXCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJpbXBsZW1lbnRzXCIpIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGlzVFMgPyB0eXBlZXhwciA6IGV4cHJlc3Npb24sIGNsYXNzTmFtZUFmdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udChwdXNobGV4KFwifVwiKSwgY2xhc3NCb2R5LCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsYXNzQm9keSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGUgPT0gXCJhc3luY1wiIHx8XG4gICAgICAgICAgICAgICAgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmXG4gICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PSBcInN0YXRpY1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImdldFwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcInNldFwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoaXNUUyAmJiBpc01vZGlmaWVyKHZhbHVlKSkpICYmXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0cmVhbS5tYXRjaCgvXlxccytbXFx3JFxceGExLVxcdWZmZmZdLywgZmFsc2UpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIiB8fCBjeC5zdHlsZSA9PSBcImtleXdvcmRcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc2ZpZWxkLCBjbGFzc0JvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZCwgY2xhc3NCb2R5KTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiW1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBtYXliZXR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIl1cIiksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZmllbGQsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzQm9keVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc0JvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzVFMgJiYgdHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWNsLCBjbGFzc0JvZHkpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI7XCIgfHwgdHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwifVwiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiQFwiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBjbGFzc0JvZHkpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNsYXNzZmllbGQodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIiFcIikgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI/XCIpIHJldHVybiBjb250KGNsYXNzZmllbGQpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHR5cGVleHByLCBtYXliZUFzc2lnbik7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI9XCIpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKTtcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY3guc3RhdGUubGV4aWNhbC5wcmV2LFxuICAgICAgICAgICAgICAgIGlzSW50ZXJmYWNlID0gY29udGV4dCAmJiBjb250ZXh0LmluZm8gPT0gXCJpbnRlcmZhY2VcIjtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKGlzSW50ZXJmYWNlID8gZnVuY3Rpb25kZWNsIDogZnVuY3Rpb25kZWYpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVyRXhwb3J0KHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZUZyb20sIGV4cGVjdChcIjtcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIntcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjb21tYXNlcChleHBvcnRGaWVsZCwgXCJ9XCIpLCBtYXliZUZyb20sIGV4cGVjdChcIjtcIikpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleHBvcnRGaWVsZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiYXNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cGVjdChcInZhcmlhYmxlXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbk5vQ29tbWEsIGV4cG9ydEZpZWxkKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhZnRlckltcG9ydCh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInN0cmluZ1wiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBwYXNzKGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIuXCIpIHJldHVybiBwYXNzKG1heWJlb3BlcmF0b3JDb21tYSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhpbXBvcnRTcGVjLCBtYXliZU1vcmVJbXBvcnRzLCBtYXliZUZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGltcG9ydFNwZWModHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKSByZXR1cm4gY29udENvbW1hc2VwKGltcG9ydFNwZWMsIFwifVwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmVnaXN0ZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiKlwiKSBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlQXMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlTW9yZUltcG9ydHModHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIsXCIpIHJldHVybiBjb250KGltcG9ydFNwZWMsIG1heWJlTW9yZUltcG9ydHMpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlQXMoX3R5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJhc1wiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoaW1wb3J0U3BlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVGcm9tKF90eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZnJvbVwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYXJyYXlMaXRlcmFsKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiXVwiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoY29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsIFwiXVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZW51bWRlZigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKFxuICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgZXhwZWN0KFwie1wiKSxcbiAgICAgICAgICAgICAgICBwdXNobGV4KFwifVwiKSxcbiAgICAgICAgICAgICAgICBjb21tYXNlcChlbnVtbWVtYmVyLCBcIn1cIiksXG4gICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgIHBvcGxleFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlbnVtbWVtYmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmVBc3NpZ24pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNDb250aW51ZWRTdGF0ZW1lbnQoc3RhdGUsIHRleHRBZnRlcikge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHxcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0VHlwZSA9PSBcIixcIiB8fFxuICAgICAgICAgICAgICAgIGlzT3BlcmF0b3JDaGFyLnRlc3QodGV4dEFmdGVyLmNoYXJBdCgwKSkgfHxcbiAgICAgICAgICAgICAgICAvWywuXS8udGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cHJlc3Npb25BbGxvd2VkKHN0cmVhbSwgc3RhdGUsIGJhY2tVcCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAoc3RhdGUudG9rZW5pemUgPT0gdG9rZW5CYXNlICYmXG4gICAgICAgICAgICAgICAgICAgIC9eKD86b3BlcmF0b3J8c29mfGtleXdvcmQgW2JjZF18Y2FzZXxuZXd8ZXhwb3J0fGRlZmF1bHR8c3ByZWFkfFtcXFt7fVxcKCw7Ol18PT4pJC8udGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlXG4gICAgICAgICAgICAgICAgICAgICkpIHx8XG4gICAgICAgICAgICAgICAgKHN0YXRlLmxhc3RUeXBlID09IFwicXVhc2lcIiAmJlxuICAgICAgICAgICAgICAgICAgICAvXFx7XFxzKiQvLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc3RyaW5nLnNsaWNlKDAsIHN0cmVhbS5wb3MgLSAoYmFja1VwIHx8IDApKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludGVyZmFjZVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFN0YXRlOiBmdW5jdGlvbiAoYmFzZWNvbHVtbikge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5pemU6IHRva2VuQmFzZSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdFR5cGU6IFwic29mXCIsXG4gICAgICAgICAgICAgICAgICAgIGNjOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbDogbmV3IEpTTGV4aWNhbChcbiAgICAgICAgICAgICAgICAgICAgICAgIChiYXNlY29sdW1uIHx8IDApIC0gaW5kZW50VW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJsb2NrXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBsb2NhbFZhcnM6IHBhcnNlckNvbmZpZy5sb2NhbFZhcnMsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJDb25maWcubG9jYWxWYXJzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ29udGV4dChudWxsLCBudWxsLCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIGluZGVudGVkOiBiYXNlY29sdW1uIHx8IDAsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBwYXJzZXJDb25maWcuZ2xvYmFsVmFycyA9PSBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5nbG9iYWxWYXJzID0gcGFyc2VyQ29uZmlnLmdsb2JhbFZhcnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdG9rZW46IGZ1bmN0aW9uIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5zb2woKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXRlLmxleGljYWwuaGFzT3duUHJvcGVydHkoXCJhbGlnblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwuYWxpZ24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5kZW50ZWQgPSBzdHJlYW0uaW5kZW50YXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZmluZEZhdEFycm93KHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5Db21tZW50ICYmIHN0cmVhbS5lYXRTcGFjZSgpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBzdGF0ZS50b2tlbml6ZShzdHJlYW0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcImNvbW1lbnRcIikgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9PSBcIm9wZXJhdG9yXCIgJiYgKGNvbnRlbnQgPT0gXCIrK1wiIHx8IGNvbnRlbnQgPT0gXCItLVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcImluY2RlY1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHR5cGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSlMoc3RhdGUsIHN0eWxlLCB0eXBlLCBjb250ZW50LCBzdHJlYW0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5kZW50OiBmdW5jdGlvbiAoc3RhdGUsIHRleHRBZnRlcikge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPT0gdG9rZW5Db21tZW50IHx8XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnRva2VuaXplID09IHRva2VuUXVhc2lcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDb2RlTWlycm9yLlBhc3M7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLnRva2VuaXplICE9IHRva2VuQmFzZSkgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0Q2hhciA9IHRleHRBZnRlciAmJiB0ZXh0QWZ0ZXIuY2hhckF0KDApLFxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsID0gc3RhdGUubGV4aWNhbCxcbiAgICAgICAgICAgICAgICAgICAgdG9wO1xuICAgICAgICAgICAgICAgIC8vIEtsdWRnZSB0byBwcmV2ZW50ICdtYXliZWxzZScgZnJvbSBibG9ja2luZyBsZXhpY2FsIHNjb3BlIHBvcHNcbiAgICAgICAgICAgICAgICBpZiAoIS9eXFxzKmVsc2VcXGIvLnRlc3QodGV4dEFmdGVyKSlcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXRlLmNjLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IHN0YXRlLmNjW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT0gcG9wbGV4KSBsZXhpY2FsID0gbGV4aWNhbC5wcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYyAhPSBtYXliZWVsc2UgJiYgYyAhPSBwb3Bjb250ZXh0KSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgICAgICAgICAgKGxleGljYWwudHlwZSA9PSBcInN0YXRcIiB8fCBsZXhpY2FsLnR5cGUgPT0gXCJmb3JtXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIChmaXJzdENoYXIgPT0gXCJ9XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgodG9wID0gc3RhdGUuY2Nbc3RhdGUuY2MubGVuZ3RoIC0gMV0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvcCA9PSBtYXliZW9wZXJhdG9yQ29tbWEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wID09IG1heWJlb3BlcmF0b3JOb0NvbW1hKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEvXlssXFwuPStcXC0qOj9bXFwoXS8udGVzdCh0ZXh0QWZ0ZXIpKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRJbmRlbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC50eXBlID09IFwiKVwiICYmXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwucHJldi50eXBlID09IFwic3RhdFwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsID0gbGV4aWNhbC5wcmV2O1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gbGV4aWNhbC50eXBlLFxuICAgICAgICAgICAgICAgICAgICBjbG9zaW5nID0gZmlyc3RDaGFyID09IHR5cGU7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmRlZlwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC5pbmRlbnRlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc3RhdGUubGFzdFR5cGUgPT0gXCJvcGVyYXRvclwiIHx8IHN0YXRlLmxhc3RUeXBlID09IFwiLFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBsZXhpY2FsLmluZm8ubGVuZ3RoICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwiZm9ybVwiICYmIGZpcnN0Q2hhciA9PSBcIntcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImZvcm1cIikgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQgKyBpbmRlbnRVbml0O1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJzdGF0XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLmluZGVudGVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc0NvbnRpbnVlZFN0YXRlbWVudChzdGF0ZSwgdGV4dEFmdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gc3RhdGVtZW50SW5kZW50IHx8IGluZGVudFVuaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwuaW5mbyA9PSBcInN3aXRjaFwiICYmXG4gICAgICAgICAgICAgICAgICAgICFjbG9zaW5nICYmXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlckNvbmZpZy5kb3VibGVJbmRlbnRTd2l0Y2ggIT0gZmFsc2VcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLmluZGVudGVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICgvXig/OmNhc2V8ZGVmYXVsdClcXGIvLnRlc3QodGV4dEFmdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaW5kZW50VW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMiAqIGluZGVudFVuaXQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGV4aWNhbC5hbGlnbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxleGljYWwuY29sdW1uICsgKGNsb3NpbmcgPyAwIDogMSk7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChjbG9zaW5nID8gMCA6IGluZGVudFVuaXQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZWxlY3RyaWNJbnB1dDogL15cXHMqKD86Y2FzZSAuKj86fGRlZmF1bHQ6fFxce3xcXH0pJC8sXG4gICAgICAgICAgICBibG9ja0NvbW1lbnRTdGFydDoganNvbk1vZGUgPyBudWxsIDogXCIvKlwiLFxuICAgICAgICAgICAgYmxvY2tDb21tZW50RW5kOiBqc29uTW9kZSA/IG51bGwgOiBcIiovXCIsXG4gICAgICAgICAgICBibG9ja0NvbW1lbnRDb250aW51ZToganNvbk1vZGUgPyBudWxsIDogXCIgKiBcIixcbiAgICAgICAgICAgIGxpbmVDb21tZW50OiBqc29uTW9kZSA/IG51bGwgOiBcIi8vXCIsXG4gICAgICAgICAgICBmb2xkOiBcImJyYWNlXCIsXG4gICAgICAgICAgICBjbG9zZUJyYWNrZXRzOiBcIigpW117fScnXFxcIlxcXCJgYFwiLFxuXG4gICAgICAgICAgICBoZWxwZXJUeXBlOiBqc29uTW9kZSA/IFwianNvblwiIDogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgICAgICBqc29ubGRNb2RlOiBqc29ubGRNb2RlLFxuICAgICAgICAgICAganNvbk1vZGU6IGpzb25Nb2RlLFxuXG4gICAgICAgICAgICBleHByZXNzaW9uQWxsb3dlZDogZXhwcmVzc2lvbkFsbG93ZWQsXG5cbiAgICAgICAgICAgIHNraXBFeHByZXNzaW9uOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBwYXJzZUpTKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJhdG9tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXRvbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvZGVNaXJyb3IuU3RyaW5nU3RyZWFtKFwiXCIsIDIsIG51bGwpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBDb2RlTWlycm9yLnJlZ2lzdGVySGVscGVyKFwid29yZENoYXJzXCIsIFwiamF2YXNjcmlwdFwiLCAvW1xcdyRdLyk7XG5cbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJ0ZXh0L2phdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcInRleHQvZWNtYXNjcmlwdFwiLCBcImphdmFzY3JpcHRcIik7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vamF2YXNjcmlwdFwiLCBcImphdmFzY3JpcHRcIik7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24veC1qYXZhc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9lY21hc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9qc29uXCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24veC1qc29uXCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vbWFuaWZlc3QranNvblwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgIH0pO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2xkK2pzb25cIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAganNvbmxkOiB0cnVlLFxuICAgIH0pO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcInRleHQvdHlwZXNjcmlwdFwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgIH0pO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL3R5cGVzY3JpcHRcIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICB9KTtcbn0pO1xuIiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwczovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0aGF0IGFsbG93cyBtb2RlcyB0byBiZSBjb21iaW5lZC4gVGhlIG1vZGUgZ2l2ZW5cbi8vIGFzIHRoZSBiYXNlIGFyZ3VtZW50IHRha2VzIGNhcmUgb2YgbW9zdCBvZiB0aGUgbm9ybWFsIG1vZGVcbi8vIGZ1bmN0aW9uYWxpdHksIGJ1dCBhIHNlY29uZCAodHlwaWNhbGx5IHNpbXBsZSkgbW9kZSBpcyB1c2VkLCB3aGljaFxuLy8gY2FuIG92ZXJyaWRlIHRoZSBzdHlsZSBvZiB0ZXh0LiBCb3RoIG1vZGVzIGdldCB0byBwYXJzZSBhbGwgb2YgdGhlXG4vLyB0ZXh0LCBidXQgd2hlbiBib3RoIGFzc2lnbiBhIG5vbi1udWxsIHN0eWxlIHRvIGEgcGllY2Ugb2YgY29kZSwgdGhlXG4vLyBvdmVybGF5IHdpbnMsIHVubGVzcyB0aGUgY29tYmluZSBhcmd1bWVudCB3YXMgdHJ1ZSBhbmQgbm90IG92ZXJyaWRkZW4sXG4vLyBvciBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMgd2FzIHRydWUsIGluIHdoaWNoIGNhc2UgdGhlIHN0eWxlcyBhcmVcbi8vIGNvbWJpbmVkLlxuXG4oZnVuY3Rpb24gKG1vZCkge1xuICAgIG1vZCh3aW5kb3cuQ29kZU1pcnJvcik7XG59KShmdW5jdGlvbiAoQ29kZU1pcnJvcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgQ29kZU1pcnJvci5jdXN0b21PdmVybGF5TW9kZSA9IGZ1bmN0aW9uIChiYXNlLCBvdmVybGF5LCBjb21iaW5lKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogQ29kZU1pcnJvci5zdGFydFN0YXRlKGJhc2UpLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiBDb2RlTWlycm9yLnN0YXJ0U3RhdGUob3ZlcmxheSksXG4gICAgICAgICAgICAgICAgICAgIGJhc2VQb3M6IDAsXG4gICAgICAgICAgICAgICAgICAgIGJhc2VDdXI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlQb3M6IDAsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDdXI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbVNlZW46IG51bGwsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3B5U3RhdGU6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IENvZGVNaXJyb3IuY29weVN0YXRlKGJhc2UsIHN0YXRlLmJhc2UpLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiBDb2RlTWlycm9yLmNvcHlTdGF0ZShvdmVybGF5LCBzdGF0ZS5vdmVybGF5KSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZVBvczogc3RhdGUuYmFzZVBvcyxcbiAgICAgICAgICAgICAgICAgICAgYmFzZUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVBvczogc3RhdGUub3ZlcmxheVBvcyxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdG9rZW46IGZ1bmN0aW9uIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0gIT0gc3RhdGUuc3RyZWFtU2VlbiB8fFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGF0ZS5iYXNlUG9zLCBzdGF0ZS5vdmVybGF5UG9zKSA8IHN0cmVhbS5zdGFydFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5zdHJlYW1TZWVuID0gc3RyZWFtO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlUG9zID0gc3RhdGUub3ZlcmxheVBvcyA9IHN0cmVhbS5zdGFydDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnN0YXJ0ID09IHN0YXRlLmJhc2VQb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYmFzZUN1ciA9IGJhc2UudG9rZW4oc3RyZWFtLCBzdGF0ZS5iYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYmFzZVBvcyA9IHN0cmVhbS5wb3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdHJlYW0uc3RhcnQgPT0gc3RhdGUub3ZlcmxheVBvcykge1xuICAgICAgICAgICAgICAgICAgICBzdHJlYW0ucG9zID0gc3RyZWFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vdmVybGF5Q3VyID0gb3ZlcmxheS50b2tlbihzdHJlYW0sIHN0YXRlLm92ZXJsYXkpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vdmVybGF5UG9zID0gc3RyZWFtLnBvcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyZWFtLnBvcyA9IE1hdGgubWluKHN0YXRlLmJhc2VQb3MsIHN0YXRlLm92ZXJsYXlQb3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIGZvciBjb2RlYmxvY2tzIGluIHRlbXBsYXRlciBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlQ3VyICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuYmFzZUN1ci5jb250YWlucyhcImxpbmUtSHlwZXJNRC1jb2RlYmxvY2tcIilcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheUN1ciA9IHN0YXRlLm92ZXJsYXlDdXIucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGluZS10ZW1wbGF0ZXItaW5saW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgKz0gYCBsaW5lLWJhY2tncm91bmQtSHlwZXJNRC1jb2RlYmxvY2stYmdgO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyBhbHdheXMgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGNvbWJpbmUsXG4gICAgICAgICAgICAgICAgLy8gdW5sZXNzIHNldCB0byBudWxsXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLm92ZXJsYXlDdXIgPT0gbnVsbCkgcmV0dXJuIHN0YXRlLmJhc2VDdXI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIChzdGF0ZS5iYXNlQ3VyICE9IG51bGwgJiYgc3RhdGUub3ZlcmxheS5jb21iaW5lVG9rZW5zKSB8fFxuICAgICAgICAgICAgICAgICAgICAoY29tYmluZSAmJiBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMgPT0gbnVsbClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5iYXNlQ3VyICsgXCIgXCIgKyBzdGF0ZS5vdmVybGF5Q3VyO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHN0YXRlLm92ZXJsYXlDdXI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbmRlbnQ6XG4gICAgICAgICAgICAgICAgYmFzZS5pbmRlbnQgJiZcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc3RhdGUsIHRleHRBZnRlciwgbGluZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzZS5pbmRlbnQoc3RhdGUuYmFzZSwgdGV4dEFmdGVyLCBsaW5lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWxlY3RyaWNDaGFyczogYmFzZS5lbGVjdHJpY0NoYXJzLFxuXG4gICAgICAgICAgICBpbm5lck1vZGU6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiBzdGF0ZS5iYXNlLCBtb2RlOiBiYXNlIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBibGFua0xpbmU6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlVG9rZW4sIG92ZXJsYXlUb2tlbjtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZS5ibGFua0xpbmUpIGJhc2VUb2tlbiA9IGJhc2UuYmxhbmtMaW5lKHN0YXRlLmJhc2UpO1xuICAgICAgICAgICAgICAgIGlmIChvdmVybGF5LmJsYW5rTGluZSlcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVRva2VuID0gb3ZlcmxheS5ibGFua0xpbmUoc3RhdGUub3ZlcmxheSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3ZlcmxheVRva2VuID09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyBiYXNlVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgOiBjb21iaW5lICYmIGJhc2VUb2tlbiAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgID8gYmFzZVRva2VuICsgXCIgXCIgKyBvdmVybGF5VG9rZW5cbiAgICAgICAgICAgICAgICAgICAgOiBvdmVybGF5VG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH07XG59KTtcbiIsImltcG9ydCB7IEFwcCwgUGxhdGZvcm0gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBDdXJzb3JKdW1wZXIgfSBmcm9tIFwiZWRpdG9yL0N1cnNvckp1bXBlclwiO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSBcIkxvZ1wiO1xuXG5pbXBvcnQgXCJlZGl0b3IvbW9kZS9qYXZhc2NyaXB0XCI7XG5pbXBvcnQgXCJlZGl0b3IvbW9kZS9jdXN0b21fb3ZlcmxheVwiO1xuLy9pbXBvcnQgXCJlZGl0b3IvbW9kZS9zaG93LWhpbnRcIjtcblxuY29uc3QgVFBfQ01EX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItY29tbWFuZFwiO1xuY29uc3QgVFBfSU5MSU5FX0NMQVNTID0gXCJ0ZW1wbGF0ZXItaW5saW5lXCI7XG5cbmNvbnN0IFRQX09QRU5JTkdfVEFHX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItb3BlbmluZy10YWdcIjtcbmNvbnN0IFRQX0NMT1NJTkdfVEFHX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItY2xvc2luZy10YWdcIjtcblxuY29uc3QgVFBfSU5URVJQT0xBVElPTl9UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1pbnRlcnBvbGF0aW9uLXRhZ1wiO1xuY29uc3QgVFBfUkFXX1RBR19UT0tFTl9DTEFTUyA9IFwidGVtcGxhdGVyLXJhdy10YWdcIjtcbmNvbnN0IFRQX0VYRUNfVEFHX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItZXhlY3V0aW9uLXRhZ1wiO1xuXG5leHBvcnQgY2xhc3MgRWRpdG9yIHtcbiAgICBwcml2YXRlIGN1cnNvcl9qdW1wZXI6IEN1cnNvckp1bXBlcjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMuY3Vyc29yX2p1bXBlciA9IG5ldyBDdXJzb3JKdW1wZXIodGhpcy5hcHApO1xuICAgIH1cblxuICAgIGFzeW5jIHNldHVwKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyQ29kZU1pcnJvck1vZGUoKTtcbiAgICAgICAgLy9hd2FpdCB0aGlzLnJlZ2lzdGVySGludGVyKCk7XG4gICAgfVxuXG4gICAgYXN5bmMganVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5jdXJzb3JfanVtcGVyLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICB9XG5cbiAgICBhc3luYyByZWdpc3RlckNvZGVNaXJyb3JNb2RlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvLyBjbS1lZGl0b3Itc3ludGF4LWhpZ2hsaWdodC1vYnNpZGlhbiBwbHVnaW5cbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9kb2MvbWFudWFsLmh0bWwjbW9kZWFwaVxuICAgICAgICAvLyBodHRwczovL2NvZGVtaXJyb3IubmV0L21vZGUvZGlmZi9kaWZmLmpzXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZW1pcnJvci5uZXQvZGVtby9tdXN0YWNoZS5odG1sXG4gICAgICAgIC8vIGh0dHBzOi8vbWFyaWpuaGF2ZXJiZWtlLm5sL2Jsb2cvY29kZW1pcnJvci1tb2RlLXN5c3RlbS5odG1sXG5cbiAgICAgICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW50YXhfaGlnaGxpZ2h0aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlQXBwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqc19tb2RlID0gd2luZG93LkNvZGVNaXJyb3IuZ2V0TW9kZSh7fSwgXCJqYXZhc2NyaXB0XCIpO1xuICAgICAgICBpZiAoanNfbW9kZS5uYW1lID09PSBcIm51bGxcIikge1xuICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJKYXZhc2NyaXB0IHN5bnRheCBtb2RlIGNvdWxkbid0IGJlIGZvdW5kLCBjYW4ndCBlbmFibGUgc3ludGF4IGhpZ2hsaWdodGluZy5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDdXN0b20gb3ZlcmxheSBtb2RlIHVzZWQgdG8gaGFuZGxlIGVkZ2UgY2FzZXNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBvdmVybGF5X21vZGUgPSB3aW5kb3cuQ29kZU1pcnJvci5jdXN0b21PdmVybGF5TW9kZTtcbiAgICAgICAgaWYgKG92ZXJsYXlfbW9kZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkNvdWxkbid0IGZpbmQgY3VzdG9tT3ZlcmxheU1vZGUsIGNhbid0IGVuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5Db2RlTWlycm9yLmRlZmluZU1vZGUoXCJ0ZW1wbGF0ZXJcIiwgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVyT3ZlcmxheSA9IHtcbiAgICAgICAgICAgICAgICBzdGFydFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzX3N0YXRlID0gd2luZG93LkNvZGVNaXJyb3Iuc3RhcnRTdGF0ZShqc19tb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmpzX3N0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5Db21tYW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19jbGFzczogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyZWVMaW5lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvcHlTdGF0ZTogZnVuY3Rpb24gKHN0YXRlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNfc3RhdGUgPSB3aW5kb3cuQ29kZU1pcnJvci5zdGFydFN0YXRlKGpzX21vZGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5qc19zdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluQ29tbWFuZDogc3RhdGUuaW5Db21tYW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2NsYXNzOiBzdGF0ZS50YWdfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBmcmVlTGluZTogc3RhdGUuZnJlZUxpbmUsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfc3RhdGU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBibGFua0xpbmU6IGZ1bmN0aW9uIChzdGF0ZTogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS1iYWNrZ3JvdW5kLXRlbXBsYXRlci1jb21tYW5kLWJnYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRva2VuOiBmdW5jdGlvbiAoc3RyZWFtOiBhbnksIHN0YXRlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5zb2woKSAmJiBzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmZyZWVMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXl3b3JkcyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKC9bLV9dezAsMX0lPi8sIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5Db21tYW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnJlZUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWdfY2xhc3MgPSBzdGF0ZS50YWdfY2xhc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUudGFnX2NsYXNzID0gXCJcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS0ke1RQX0lOTElORV9DTEFTU30gJHtUUF9DTURfVE9LRU5fQ0xBU1N9ICR7VFBfQ0xPU0lOR19UQUdfVE9LRU5fQ0xBU1N9ICR7dGFnX2NsYXNzfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzX3Jlc3VsdCA9IGpzX21vZGUudG9rZW4oc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnBlZWsoKSA9PSBudWxsICYmIHN0YXRlLmZyZWVMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5d29yZHMgKz0gYCBsaW5lLWJhY2tncm91bmQtdGVtcGxhdGVyLWNvbW1hbmQtYmdgO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0ZS5mcmVlTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmRzICs9IGAgbGluZS0ke1RQX0lOTElORV9DTEFTU31gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7a2V5d29yZHN9ICR7VFBfQ01EX1RPS0VOX0NMQVNTfSAke2pzX3Jlc3VsdH1gO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBzdHJlYW0ubWF0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICAvPCVbLV9dezAsMX1cXHMqKFsqfitdezAsMX0pLyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPSBUUF9FWEVDX1RBR19UT0tFTl9DTEFTUztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIn5cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUudGFnX2NsYXNzID0gVFBfUkFXX1RBR19UT0tFTl9DTEFTUztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUudGFnX2NsYXNzID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRQX0lOVEVSUE9MQVRJT05fVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmluQ29tbWFuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYGxpbmUtJHtUUF9JTkxJTkVfQ0xBU1N9ICR7VFBfQ01EX1RPS0VOX0NMQVNTfSAke1RQX09QRU5JTkdfVEFHX1RPS0VOX0NMQVNTfSAke3N0YXRlLnRhZ19jbGFzc31gO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN0cmVhbS5uZXh0KCkgIT0gbnVsbCAmJiAhc3RyZWFtLm1hdGNoKC88JS8sIGZhbHNlKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXlfbW9kZShcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29kZU1pcnJvci5nZXRNb2RlKGNvbmZpZywgXCJoeXBlcm1kXCIpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlck92ZXJsYXlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHJlZ2lzdGVySGludGVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8qXG4gICAgICAgIGF3YWl0IGRlbGF5KDEwMDApO1xuXG4gICAgICAgIHZhciBjb21wID0gW1xuICAgICAgICAgICAgW1wiaGVyZVwiLCBcImhpdGhlclwiXSxcbiAgICAgICAgICAgIFtcImFzeW5jaHJvbm91c1wiLCBcIm5vbnN5bmNocm9ub3VzXCJdLFxuICAgICAgICAgICAgW1wiY29tcGxldGlvblwiLCBcImFjaGlldmVtZW50XCIsIFwiY29uY2x1c2lvblwiLCBcImN1bG1pbmF0aW9uXCIsIFwiZXhwaXJhdGlvbnNcIl0sXG4gICAgICAgICAgICBbXCJoaW50aW5nXCIsIFwiYWR2aXNlXCIsIFwiYnJvYWNoXCIsIFwiaW1wbHlcIl0sXG4gICAgICAgICAgICBbXCJmdW5jdGlvblwiLFwiYWN0aW9uXCJdLFxuICAgICAgICAgICAgW1wicHJvdmlkZVwiLCBcImFkZFwiLCBcImJyaW5nXCIsIFwiZ2l2ZVwiXSxcbiAgICAgICAgICAgIFtcInN5bm9ueW1zXCIsIFwiZXF1aXZhbGVudHNcIl0sXG4gICAgICAgICAgICBbXCJ3b3Jkc1wiLCBcInRva2VuXCJdLFxuICAgICAgICAgICAgW1wiZWFjaFwiLCBcImV2ZXJ5XCJdLFxuICAgICAgICBdO1xuICAgIFxuICAgICAgICBmdW5jdGlvbiBzeW5vbnltcyhjbTogYW55LCBvcHRpb246IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGFjY2VwdCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3IgPSBjbS5nZXRDdXJzb3IoKSwgbGluZSA9IGNtLmdldExpbmUoY3Vyc29yLmxpbmUpXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IGN1cnNvci5jaCwgZW5kID0gY3Vyc29yLmNoXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChzdGFydCAmJiAvXFx3Ly50ZXN0KGxpbmUuY2hhckF0KHN0YXJ0IC0gMSkpKSAtLXN0YXJ0XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChlbmQgPCBsaW5lLmxlbmd0aCAmJiAvXFx3Ly50ZXN0KGxpbmUuY2hhckF0KGVuZCkpKSArK2VuZFxuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZCA9IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZCkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wW2ldLmluZGV4T2Yod29yZCkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjZXB0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogY29tcFtpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogd2luZG93LkNvZGVNaXJyb3IuUG9zKGN1cnNvci5saW5lLCBzdGFydCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB3aW5kb3cuQ29kZU1pcnJvci5Qb3MoY3Vyc29yLmxpbmUsIGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjZXB0KG51bGwpO1xuICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiY29kZW1pcnJvclwiLCBjbSA9PiB7XG4gICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJleHRyYUtleXNcIiwge1wiQ3RybC1TcGFjZVwiOiBcImF1dG9jb21wbGV0ZVwifSk7XG4gICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJoaW50T3B0aW9uc1wiLCB7aGludDogc3lub255bXN9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycyhjbSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNNOlwiLCBjbSk7XG4gICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJleHRyYUtleXNcIiwge1wiU3BhY2VcIjogXCJhdXRvY29tcGxldGVcIn0pO1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiaGludE9wdGlvbnNcIiwge2hpbnQ6IHN5bm9ueW1zfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xuXG5mdW5jdGlvbiBzZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBvYmouX19wcm90b19fID0gcHJvdG87XHJcbiAgICB9XHJcbn1cclxuLy8gVGhpcyBpcyBwcmV0dHkgbXVjaCB0aGUgb25seSB3YXkgdG8gZ2V0IG5pY2UsIGV4dGVuZGVkIEVycm9yc1xyXG4vLyB3aXRob3V0IHVzaW5nIEVTNlxyXG4vKipcclxuICogVGhpcyByZXR1cm5zIGEgbmV3IEVycm9yIHdpdGggYSBjdXN0b20gcHJvdG90eXBlLiBOb3RlIHRoYXQgaXQncyBfbm90XyBhIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSBtZXNzYWdlIEVycm9yIG1lc3NhZ2VcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogdGhyb3cgRXRhRXJyKFwidGVtcGxhdGUgbm90IGZvdW5kXCIpXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gRXRhRXJyKG1lc3NhZ2UpIHtcclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICBzZXRQcm90b3R5cGVPZihlcnIsIEV0YUVyci5wcm90b3R5cGUpO1xyXG4gICAgcmV0dXJuIGVycjtcclxufVxyXG5FdGFFcnIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUsIHtcclxuICAgIG5hbWU6IHsgdmFsdWU6ICdFdGEgRXJyb3InLCBlbnVtZXJhYmxlOiBmYWxzZSB9XHJcbn0pO1xyXG4vKipcclxuICogVGhyb3dzIGFuIEV0YUVyciB3aXRoIGEgbmljZWx5IGZvcm1hdHRlZCBlcnJvciBhbmQgbWVzc2FnZSBzaG93aW5nIHdoZXJlIGluIHRoZSB0ZW1wbGF0ZSB0aGUgZXJyb3Igb2NjdXJyZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBQYXJzZUVycihtZXNzYWdlLCBzdHIsIGluZHgpIHtcclxuICAgIHZhciB3aGl0ZXNwYWNlID0gc3RyLnNsaWNlKDAsIGluZHgpLnNwbGl0KC9cXG4vKTtcclxuICAgIHZhciBsaW5lTm8gPSB3aGl0ZXNwYWNlLmxlbmd0aDtcclxuICAgIHZhciBjb2xObyA9IHdoaXRlc3BhY2VbbGluZU5vIC0gMV0ubGVuZ3RoICsgMTtcclxuICAgIG1lc3NhZ2UgKz1cclxuICAgICAgICAnIGF0IGxpbmUgJyArXHJcbiAgICAgICAgICAgIGxpbmVObyArXHJcbiAgICAgICAgICAgICcgY29sICcgK1xyXG4gICAgICAgICAgICBjb2xObyArXHJcbiAgICAgICAgICAgICc6XFxuXFxuJyArXHJcbiAgICAgICAgICAgICcgICcgK1xyXG4gICAgICAgICAgICBzdHIuc3BsaXQoL1xcbi8pW2xpbmVObyAtIDFdICtcclxuICAgICAgICAgICAgJ1xcbicgK1xyXG4gICAgICAgICAgICAnICAnICtcclxuICAgICAgICAgICAgQXJyYXkoY29sTm8pLmpvaW4oJyAnKSArXHJcbiAgICAgICAgICAgICdeJztcclxuICAgIHRocm93IEV0YUVycihtZXNzYWdlKTtcclxufVxuXG4vKipcclxuICogQHJldHVybnMgVGhlIGdsb2JhbCBQcm9taXNlIGZ1bmN0aW9uXHJcbiAqL1xyXG52YXIgcHJvbWlzZUltcGwgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKS5Qcm9taXNlO1xyXG4vKipcclxuICogQHJldHVybnMgQSBuZXcgQXN5bmNGdW5jdGlvbiBjb25zdHVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBc3luY0Z1bmN0aW9uQ29uc3RydWN0b3IoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiAoYXN5bmMgZnVuY3Rpb24oKXt9KS5jb25zdHJ1Y3RvcicpKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKFwiVGhpcyBlbnZpcm9ubWVudCBkb2Vzbid0IHN1cHBvcnQgYXN5bmMvYXdhaXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKipcclxuICogc3RyLnRyaW1MZWZ0IHBvbHlmaWxsXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCBzdHJpbmdcclxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIGxlZnQgd2hpdGVzcGFjZSByZW1vdmVkXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcclxuICAgIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbUxlZnQpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW1MZWZ0KCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrLywgJycpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBzdHIudHJpbVJpZ2h0IHBvbHlmaWxsXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCBzdHJpbmdcclxuICogQHJldHVybnMgVGhlIHN0cmluZyB3aXRoIHJpZ2h0IHdoaXRlc3BhY2UgcmVtb3ZlZFxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbVJpZ2h0KHN0cikge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLWJvb2xlYW4tY2FzdFxyXG4gICAgaWYgKCEhU3RyaW5nLnByb3RvdHlwZS50cmltUmlnaHQpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW1SaWdodCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMrJC8sICcnKTsgLy8gVE9ETzogZG8gd2UgcmVhbGx5IG5lZWQgdG8gcmVwbGFjZSBCT00ncz9cclxuICAgIH1cclxufVxuXG4vLyBUT0RPOiBhbGxvdyAnLScgdG8gdHJpbSB1cCB1bnRpbCBuZXdsaW5lLiBVc2UgW15cXFNcXG5cXHJdIGluc3RlYWQgb2YgXFxzXHJcbi8qIEVORCBUWVBFUyAqL1xyXG5mdW5jdGlvbiBoYXNPd25Qcm9wKG9iaiwgcHJvcCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xyXG59XHJcbmZ1bmN0aW9uIGNvcHlQcm9wcyh0b09iaiwgZnJvbU9iaikge1xyXG4gICAgZm9yICh2YXIga2V5IGluIGZyb21PYmopIHtcclxuICAgICAgICBpZiAoaGFzT3duUHJvcChmcm9tT2JqLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHRvT2JqW2tleV0gPSBmcm9tT2JqW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvT2JqO1xyXG59XHJcbi8qKlxyXG4gKiBUYWtlcyBhIHN0cmluZyB3aXRoaW4gYSB0ZW1wbGF0ZSBhbmQgdHJpbXMgaXQsIGJhc2VkIG9uIHRoZSBwcmVjZWRpbmcgdGFnJ3Mgd2hpdGVzcGFjZSBjb250cm9sIGFuZCBgY29uZmlnLmF1dG9UcmltYFxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbVdTKHN0ciwgY29uZmlnLCB3c0xlZnQsIHdzUmlnaHQpIHtcclxuICAgIHZhciBsZWZ0VHJpbTtcclxuICAgIHZhciByaWdodFRyaW07XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcuYXV0b1RyaW0pKSB7XHJcbiAgICAgICAgLy8ga2luZGEgY29uZnVzaW5nXHJcbiAgICAgICAgLy8gYnV0IF99fSB3aWxsIHRyaW0gdGhlIGxlZnQgc2lkZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ1xyXG4gICAgICAgIGxlZnRUcmltID0gY29uZmlnLmF1dG9UcmltWzFdO1xyXG4gICAgICAgIHJpZ2h0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVswXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxlZnRUcmltID0gcmlnaHRUcmltID0gY29uZmlnLmF1dG9UcmltO1xyXG4gICAgfVxyXG4gICAgaWYgKHdzTGVmdCB8fCB3c0xlZnQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgbGVmdFRyaW0gPSB3c0xlZnQ7XHJcbiAgICB9XHJcbiAgICBpZiAod3NSaWdodCB8fCB3c1JpZ2h0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJpZ2h0VHJpbSA9IHdzUmlnaHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJpZ2h0VHJpbSAmJiAhbGVmdFRyaW0pIHtcclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZnRUcmltID09PSAnc2x1cnAnICYmIHJpZ2h0VHJpbSA9PT0gJ3NsdXJwJykge1xyXG4gICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZnRUcmltID09PSAnXycgfHwgbGVmdFRyaW0gPT09ICdzbHVycCcpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndHJpbW1pbmcgbGVmdCcgKyBsZWZ0VHJpbSlcclxuICAgICAgICAvLyBmdWxsIHNsdXJwXHJcbiAgICAgICAgc3RyID0gdHJpbUxlZnQoc3RyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGxlZnRUcmltID09PSAnLScgfHwgbGVmdFRyaW0gPT09ICdubCcpIHtcclxuICAgICAgICAvLyBubCB0cmltXHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL14oPzpcXHJcXG58XFxufFxccikvLCAnJyk7XHJcbiAgICB9XHJcbiAgICBpZiAocmlnaHRUcmltID09PSAnXycgfHwgcmlnaHRUcmltID09PSAnc2x1cnAnKSB7XHJcbiAgICAgICAgLy8gZnVsbCBzbHVycFxyXG4gICAgICAgIHN0ciA9IHRyaW1SaWdodChzdHIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmlnaHRUcmltID09PSAnLScgfHwgcmlnaHRUcmltID09PSAnbmwnKSB7XHJcbiAgICAgICAgLy8gbmwgdHJpbVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oPzpcXHJcXG58XFxufFxccikkLywgJycpOyAvLyBUT0RPOiBtYWtlIHN1cmUgdGhpcyBnZXRzIFxcclxcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufVxyXG4vKipcclxuICogQSBtYXAgb2Ygc3BlY2lhbCBIVE1MIGNoYXJhY3RlcnMgdG8gdGhlaXIgWE1MLWVzY2FwZWQgZXF1aXZhbGVudHNcclxuICovXHJcbnZhciBlc2NNYXAgPSB7XHJcbiAgICAnJic6ICcmYW1wOycsXHJcbiAgICAnPCc6ICcmbHQ7JyxcclxuICAgICc+JzogJyZndDsnLFxyXG4gICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICBcIidcIjogJyYjMzk7J1xyXG59O1xyXG5mdW5jdGlvbiByZXBsYWNlQ2hhcihzKSB7XHJcbiAgICByZXR1cm4gZXNjTWFwW3NdO1xyXG59XHJcbi8qKlxyXG4gKiBYTUwtZXNjYXBlcyBhbiBpbnB1dCB2YWx1ZSBhZnRlciBjb252ZXJ0aW5nIGl0IHRvIGEgc3RyaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBJbnB1dCB2YWx1ZSAodXN1YWxseSBhIHN0cmluZylcclxuICogQHJldHVybnMgWE1MLWVzY2FwZWQgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBYTUxFc2NhcGUoc3RyKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIC8vIFRvIGRlYWwgd2l0aCBYU1MuIEJhc2VkIG9uIEVzY2FwZSBpbXBsZW1lbnRhdGlvbnMgb2YgTXVzdGFjaGUuSlMgYW5kIE1hcmtvLCB0aGVuIGN1c3RvbWl6ZWQuXHJcbiAgICB2YXIgbmV3U3RyID0gU3RyaW5nKHN0cik7XHJcbiAgICBpZiAoL1smPD5cIiddLy50ZXN0KG5ld1N0cikpIHtcclxuICAgICAgICByZXR1cm4gbmV3U3RyLnJlcGxhY2UoL1smPD5cIiddL2csIHJlcGxhY2VDaGFyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBuZXdTdHI7XHJcbiAgICB9XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbnZhciB0ZW1wbGF0ZUxpdFJlZyA9IC9gKD86XFxcXFtcXHNcXFNdfFxcJHsoPzpbXnt9XXx7KD86W157fV18e1tefV0qfSkqfSkqfXwoPyFcXCR7KVteXFxcXGBdKSpgL2c7XHJcbnZhciBzaW5nbGVRdW90ZVJlZyA9IC8nKD86XFxcXFtcXHNcXHdcIidcXFxcYF18W15cXG5cXHInXFxcXF0pKj8nL2c7XHJcbnZhciBkb3VibGVRdW90ZVJlZyA9IC9cIig/OlxcXFxbXFxzXFx3XCInXFxcXGBdfFteXFxuXFxyXCJcXFxcXSkqP1wiL2c7XHJcbi8qKiBFc2NhcGUgc3BlY2lhbCByZWd1bGFyIGV4cHJlc3Npb24gY2hhcmFjdGVycyBpbnNpZGUgYSBzdHJpbmcgKi9cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgLy8gRnJvbSBNRE5cclxuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qK1xcLT9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXHJcbn1cclxuZnVuY3Rpb24gcGFyc2Uoc3RyLCBjb25maWcpIHtcclxuICAgIHZhciBidWZmZXIgPSBbXTtcclxuICAgIHZhciB0cmltTGVmdE9mTmV4dFN0ciA9IGZhbHNlO1xyXG4gICAgdmFyIGxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgcGFyc2VPcHRpb25zID0gY29uZmlnLnBhcnNlO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc1RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBwbHVnaW4ucHJvY2Vzc1RlbXBsYXRlKHN0ciwgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIEFkZGluZyBmb3IgRUpTIGNvbXBhdGliaWxpdHkgKi9cclxuICAgIGlmIChjb25maWcucm1XaGl0ZXNwYWNlKSB7XHJcbiAgICAgICAgLy8gQ29kZSB0YWtlbiBkaXJlY3RseSBmcm9tIEVKU1xyXG4gICAgICAgIC8vIEhhdmUgdG8gdXNlIHR3byBzZXBhcmF0ZSByZXBsYWNlcyBoZXJlIGFzIGBeYCBhbmQgYCRgIG9wZXJhdG9ycyBkb24ndFxyXG4gICAgICAgIC8vIHdvcmsgd2VsbCB3aXRoIGBcXHJgIGFuZCBlbXB0eSBsaW5lcyBkb24ndCB3b3JrIHdlbGwgd2l0aCB0aGUgYG1gIGZsYWcuXHJcbiAgICAgICAgLy8gRXNzZW50aWFsbHksIHRoaXMgcmVwbGFjZXMgdGhlIHdoaXRlc3BhY2UgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mXHJcbiAgICAgICAgLy8gZWFjaCBsaW5lIGFuZCByZW1vdmVzIG11bHRpcGxlIG5ld2xpbmVzLlxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9bXFxyXFxuXSsvZywgJ1xcbicpLnJlcGxhY2UoL15cXHMrfFxccyskL2dtLCAnJyk7XHJcbiAgICB9XHJcbiAgICAvKiBFbmQgcm1XaGl0ZXNwYWNlIG9wdGlvbiAqL1xyXG4gICAgdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4ID0gMDtcclxuICAgIHNpbmdsZVF1b3RlUmVnLmxhc3RJbmRleCA9IDA7XHJcbiAgICBkb3VibGVRdW90ZVJlZy5sYXN0SW5kZXggPSAwO1xyXG4gICAgZnVuY3Rpb24gcHVzaFN0cmluZyhzdHJuZywgc2hvdWxkVHJpbVJpZ2h0T2ZTdHJpbmcpIHtcclxuICAgICAgICBpZiAoc3RybmcpIHtcclxuICAgICAgICAgICAgLy8gaWYgc3RyaW5nIGlzIHRydXRoeSBpdCBtdXN0IGJlIG9mIHR5cGUgJ3N0cmluZydcclxuICAgICAgICAgICAgc3RybmcgPSB0cmltV1Moc3RybmcsIGNvbmZpZywgdHJpbUxlZnRPZk5leHRTdHIsIC8vIHRoaXMgd2lsbCBvbmx5IGJlIGZhbHNlIG9uIHRoZSBmaXJzdCBzdHIsIHRoZSBuZXh0IG9uZXMgd2lsbCBiZSBudWxsIG9yIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICBzaG91bGRUcmltUmlnaHRPZlN0cmluZyk7XHJcbiAgICAgICAgICAgIGlmIChzdHJuZykge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBcXCB3aXRoIFxcXFwsICcgd2l0aCBcXCdcclxuICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGdvaW5nIHRvIGNvbnZlcnQgYWxsIENSTEYgdG8gTEYgc28gaXQgZG9lc24ndCB0YWtlIG1vcmUgdGhhbiBvbmUgcmVwbGFjZVxyXG4gICAgICAgICAgICAgICAgc3RybmcgPSBzdHJuZy5yZXBsYWNlKC9cXFxcfCcvZywgJ1xcXFwkJicpLnJlcGxhY2UoL1xcclxcbnxcXG58XFxyL2csICdcXFxcbicpO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goc3RybmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIHByZWZpeGVzID0gW3BhcnNlT3B0aW9ucy5leGVjLCBwYXJzZU9wdGlvbnMuaW50ZXJwb2xhdGUsIHBhcnNlT3B0aW9ucy5yYXddLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIHByZWZpeCkge1xyXG4gICAgICAgIGlmIChhY2N1bXVsYXRvciAmJiBwcmVmaXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgJ3wnICsgZXNjYXBlUmVnRXhwKHByZWZpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRvciBpcyBmYWxzeVxyXG4gICAgICAgICAgICByZXR1cm4gZXNjYXBlUmVnRXhwKHByZWZpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwcmVmaXggYW5kIGFjY3VtdWxhdG9yIGFyZSBib3RoIGZhbHN5XHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcclxuICAgICAgICB9XHJcbiAgICB9LCAnJyk7XHJcbiAgICB2YXIgcGFyc2VPcGVuUmVnID0gbmV3IFJlZ0V4cCgnKFteXSo/KScgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMF0pICsgJygtfF8pP1xcXFxzKignICsgcHJlZml4ZXMgKyAnKT9cXFxccyooPyFbXFxcXHMrXFxcXC1fJyArIHByZWZpeGVzICsgJ10pJywgJ2cnKTtcclxuICAgIHZhciBwYXJzZUNsb3NlUmVnID0gbmV3IFJlZ0V4cCgnXFwnfFwifGB8XFxcXC9cXFxcKnwoXFxcXHMqKC18Xyk/JyArIGVzY2FwZVJlZ0V4cChjb25maWcudGFnc1sxXSkgKyAnKScsICdnJyk7XHJcbiAgICAvLyBUT0RPOiBiZW5jaG1hcmsgaGF2aW5nIHRoZSBcXHMqIG9uIGVpdGhlciBzaWRlIHZzIHVzaW5nIHN0ci50cmltKClcclxuICAgIHZhciBtO1xyXG4gICAgd2hpbGUgKChtID0gcGFyc2VPcGVuUmVnLmV4ZWMoc3RyKSkpIHtcclxuICAgICAgICBsYXN0SW5kZXggPSBtWzBdLmxlbmd0aCArIG0uaW5kZXg7XHJcbiAgICAgICAgdmFyIHByZWNlZGluZ1N0cmluZyA9IG1bMV07XHJcbiAgICAgICAgdmFyIHdzTGVmdCA9IG1bMl07XHJcbiAgICAgICAgdmFyIHByZWZpeCA9IG1bM10gfHwgJyc7IC8vIGJ5IGRlZmF1bHQgZWl0aGVyIH4sID0sIG9yIGVtcHR5XHJcbiAgICAgICAgcHVzaFN0cmluZyhwcmVjZWRpbmdTdHJpbmcsIHdzTGVmdCk7XHJcbiAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBsYXN0SW5kZXg7XHJcbiAgICAgICAgdmFyIGNsb3NlVGFnID0gdm9pZCAwO1xyXG4gICAgICAgIHZhciBjdXJyZW50T2JqID0gZmFsc2U7XHJcbiAgICAgICAgd2hpbGUgKChjbG9zZVRhZyA9IHBhcnNlQ2xvc2VSZWcuZXhlYyhzdHIpKSkge1xyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWdbMV0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gc3RyLnNsaWNlKGxhc3RJbmRleCwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VPcGVuUmVnLmxhc3RJbmRleCA9IGxhc3RJbmRleCA9IHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgdHJpbUxlZnRPZk5leHRTdHIgPSBjbG9zZVRhZ1syXTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VHlwZSA9IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLmV4ZWNcclxuICAgICAgICAgICAgICAgICAgICA/ICdlJ1xyXG4gICAgICAgICAgICAgICAgICAgIDogcHJlZml4ID09PSBwYXJzZU9wdGlvbnMucmF3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ3InXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcHJlZml4ID09PSBwYXJzZU9wdGlvbnMuaW50ZXJwb2xhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2knXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudE9iaiA9IHsgdDogY3VycmVudFR5cGUsIHZhbDogY29udGVudCB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hhciA9IGNsb3NlVGFnWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYXIgPT09ICcvKicpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWVudENsb3NlSW5kID0gc3RyLmluZGV4T2YoJyovJywgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tZW50Q2xvc2VJbmQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCBjb21tZW50Jywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gY29tbWVudENsb3NlSW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gXCInXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXggPSBjbG9zZVRhZy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2luZ2xlUXVvdGVNYXRjaCA9IHNpbmdsZVF1b3RlUmVnLmV4ZWMoc3RyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2luZ2xlUXVvdGVNYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IHNpbmdsZVF1b3RlUmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCBzdHJpbmcnLCBzdHIsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXCInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG91YmxlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvdWJsZVF1b3RlTWF0Y2ggPSBkb3VibGVRdW90ZVJlZy5leGVjKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvdWJsZVF1b3RlTWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBkb3VibGVRdW90ZVJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgc3RyaW5nJywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ2AnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlTGl0TWF0Y2ggPSB0ZW1wbGF0ZUxpdFJlZy5leGVjKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlTGl0TWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSB0ZW1wbGF0ZUxpdFJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgc3RyaW5nJywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50T2JqKSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKGN1cnJlbnRPYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHRhZycsIHN0ciwgbS5pbmRleCArIHByZWNlZGluZ1N0cmluZy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1c2hTdHJpbmcoc3RyLnNsaWNlKGxhc3RJbmRleCwgc3RyLmxlbmd0aCksIGZhbHNlKTtcclxuICAgIGlmIChjb25maWcucGx1Z2lucykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IGNvbmZpZy5wbHVnaW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAocGx1Z2luLnByb2Nlc3NBU1QpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlciA9IHBsdWdpbi5wcm9jZXNzQVNUKGJ1ZmZlciwgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBidWZmZXI7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBDb21waWxlcyBhIHRlbXBsYXRlIHN0cmluZyB0byBhIGZ1bmN0aW9uIHN0cmluZy4gTW9zdCBvZnRlbiB1c2VycyBqdXN0IHVzZSBgY29tcGlsZSgpYCwgd2hpY2ggY2FsbHMgYGNvbXBpbGVUb1N0cmluZ2AgYW5kIGNyZWF0ZXMgYSBuZXcgZnVuY3Rpb24gdXNpbmcgdGhlIHJlc3VsdFxyXG4gKlxyXG4gKiAqKkV4YW1wbGUqKlxyXG4gKlxyXG4gKiBgYGBqc1xyXG4gKiBjb21waWxlVG9TdHJpbmcoXCJIaSA8JT0gaXQudXNlciAlPlwiLCBldGEuY29uZmlnKVxyXG4gKiAvLyBcInZhciB0Uj0nJyxpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpLGluY2x1ZGVGaWxlPUUuaW5jbHVkZUZpbGUuYmluZChFKTt0Uis9J0hpICc7dFIrPUUuZShpdC51c2VyKTtpZihjYil7Y2IobnVsbCx0Uil9IHJldHVybiB0UlwiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZVRvU3RyaW5nKHN0ciwgY29uZmlnKSB7XHJcbiAgICB2YXIgYnVmZmVyID0gcGFyc2Uoc3RyLCBjb25maWcpO1xyXG4gICAgdmFyIHJlcyA9IFwidmFyIHRSPScnLF9fbCxfX2xQXCIgK1xyXG4gICAgICAgIChjb25maWcuaW5jbHVkZSA/ICcsaW5jbHVkZT1FLmluY2x1ZGUuYmluZChFKScgOiAnJykgK1xyXG4gICAgICAgIChjb25maWcuaW5jbHVkZUZpbGUgPyAnLGluY2x1ZGVGaWxlPUUuaW5jbHVkZUZpbGUuYmluZChFKScgOiAnJykgK1xyXG4gICAgICAgICdcXG5mdW5jdGlvbiBsYXlvdXQocCxkKXtfX2w9cDtfX2xQPWR9XFxuJyArXHJcbiAgICAgICAgKGNvbmZpZy5nbG9iYWxBd2FpdCA/ICdjb25zdCBfcHJzID0gW107XFxuJyA6ICcnKSArXHJcbiAgICAgICAgKGNvbmZpZy51c2VXaXRoID8gJ3dpdGgoJyArIGNvbmZpZy52YXJOYW1lICsgJ3x8e30peycgOiAnJykgK1xyXG4gICAgICAgIGNvbXBpbGVTY29wZShidWZmZXIsIGNvbmZpZykgK1xyXG4gICAgICAgIChjb25maWcuaW5jbHVkZUZpbGVcclxuICAgICAgICAgICAgPyAnaWYoX19sKXRSPScgK1xyXG4gICAgICAgICAgICAgICAgKGNvbmZpZy5hc3luYyA/ICdhd2FpdCAnIDogJycpICtcclxuICAgICAgICAgICAgICAgIChcImluY2x1ZGVGaWxlKF9fbCxPYmplY3QuYXNzaWduKFwiICsgY29uZmlnLnZhck5hbWUgKyBcIix7Ym9keTp0Un0sX19sUCkpXFxuXCIpXHJcbiAgICAgICAgICAgIDogY29uZmlnLmluY2x1ZGVcclxuICAgICAgICAgICAgICAgID8gJ2lmKF9fbCl0Uj0nICtcclxuICAgICAgICAgICAgICAgICAgICAoY29uZmlnLmFzeW5jID8gJ2F3YWl0ICcgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgICAgIChcImluY2x1ZGUoX19sLE9iamVjdC5hc3NpZ24oXCIgKyBjb25maWcudmFyTmFtZSArIFwiLHtib2R5OnRSfSxfX2xQKSlcXG5cIilcclxuICAgICAgICAgICAgICAgIDogJycpICtcclxuICAgICAgICAnaWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFInICtcclxuICAgICAgICAoY29uZmlnLnVzZVdpdGggPyAnfScgOiAnJyk7XHJcbiAgICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzRm5TdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHBsdWdpbi5wcm9jZXNzRm5TdHJpbmcocmVzLCBjb25maWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKipcclxuICogTG9vcHMgdGhyb3VnaCB0aGUgQVNUIGdlbmVyYXRlZCBieSBgcGFyc2VgIGFuZCB0cmFuc2Zvcm0gZWFjaCBpdGVtIGludG8gSlMgY2FsbHNcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogLy8gQVNUIHZlcnNpb24gb2YgJ0hpIDwlPSBpdC51c2VyICU+J1xyXG4gKiBsZXQgdGVtcGxhdGVBU1QgPSBbJ0hpICcsIHsgdmFsOiAnaXQudXNlcicsIHQ6ICdpJyB9XVxyXG4gKiBjb21waWxlU2NvcGUodGVtcGxhdGVBU1QsIGV0YS5jb25maWcpXHJcbiAqIC8vIFwidFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7XCJcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21waWxlU2NvcGUoYnVmZiwgY29uZmlnKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIHZhciBidWZmTGVuZ3RoID0gYnVmZi5sZW5ndGg7XHJcbiAgICB2YXIgcmV0dXJuU3RyID0gJyc7XHJcbiAgICB2YXIgUkVQTEFDRU1FTlRfU1RSID0gXCJySjJLcVh6eFFnXCI7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYnVmZkxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRCbG9jayA9IGJ1ZmZbaV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50QmxvY2sgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBjdXJyZW50QmxvY2s7XHJcbiAgICAgICAgICAgIC8vIHdlIGtub3cgc3RyaW5nIGV4aXN0c1xyXG4gICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgc3RyICsgXCInXFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGN1cnJlbnRCbG9jay50OyAvLyB+LCBzLCAhLCA/LCByXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3VycmVudEJsb2NrLnZhbCB8fCAnJztcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdyJykge1xyXG4gICAgICAgICAgICAgICAgLy8gcmF3XHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwiX3Bycy5wdXNoKFwiICsgY29udGVudCArIFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCInXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZmlsdGVyKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gJ3RSKz0nICsgY29udGVudCArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdpJykge1xyXG4gICAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGVcclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuZ2xvYmFsQXdhaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJfcHJzLnB1c2goXCIgKyBjb250ZW50ICsgXCIpO1xcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBcInRSKz0nXCIgKyBSRVBMQUNFTUVOVF9TVFIgKyBcIidcXG5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuZmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnRS5maWx0ZXIoJyArIGNvbnRlbnQgKyAnKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSAndFIrPScgKyBjb250ZW50ICsgJ1xcbic7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5hdXRvRXNjYXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAnRS5lKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gJ3RSKz0nICsgY29udGVudCArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdlJykge1xyXG4gICAgICAgICAgICAgICAgLy8gZXhlY3V0ZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IGNvbnRlbnQgKyAnXFxuJzsgLy8geW91IG5lZWQgYSBcXG4gaW4gY2FzZSB5b3UgaGF2ZSA8JSB9ICU+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgcmV0dXJuU3RyICs9IFwiY29uc3QgX3JzdCA9IGF3YWl0IFByb21pc2UuYWxsKF9wcnMpO1xcbnRSID0gdFIucmVwbGFjZSgvXCIgKyBSRVBMQUNFTUVOVF9TVFIgKyBcIi9nLCAoKSA9PiBfcnN0LnNoaWZ0KCkpO1xcblwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVyblN0cjtcclxufVxuXG4vKipcclxuICogSGFuZGxlcyBzdG9yYWdlIGFuZCBhY2Nlc3Npbmcgb2YgdmFsdWVzXHJcbiAqXHJcbiAqIEluIHRoaXMgY2FzZSwgd2UgdXNlIGl0IHRvIHN0b3JlIGNvbXBpbGVkIHRlbXBsYXRlIGZ1bmN0aW9uc1xyXG4gKiBJbmRleGVkIGJ5IHRoZWlyIGBuYW1lYCBvciBgZmlsZW5hbWVgXHJcbiAqL1xyXG52YXIgQ2FjaGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQ2FjaGVyKGNhY2hlKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IGNhY2hlO1xyXG4gICAgfVxyXG4gICAgQ2FjaGVyLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcclxuICAgICAgICB0aGlzLmNhY2hlW2tleV0gPSB2YWw7XHJcbiAgICB9O1xyXG4gICAgQ2FjaGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgLy8gc3RyaW5nIHwgYXJyYXkuXHJcbiAgICAgICAgLy8gVE9ETzogYWxsb3cgYXJyYXkgb2Yga2V5cyB0byBsb29rIGRvd25cclxuICAgICAgICAvLyBUT0RPOiBjcmVhdGUgcGx1Z2luIHRvIGFsbG93IHJlZmVyZW5jaW5nIGhlbHBlcnMsIGZpbHRlcnMgd2l0aCBkb3Qgbm90YXRpb25cclxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmNhY2hlW2tleV07XHJcbiAgICB9O1xyXG4gICAgQ2FjaGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNhY2hlID0ge307XHJcbiAgICB9O1xyXG4gICAgQ2FjaGVyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGNhY2hlT2JqKSB7XHJcbiAgICAgICAgY29weVByb3BzKHRoaXMuY2FjaGUsIGNhY2hlT2JqKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ2FjaGVyO1xyXG59KCkpO1xuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIEV0YSdzIHRlbXBsYXRlIHN0b3JhZ2VcclxuICpcclxuICogU3RvcmVzIHBhcnRpYWxzIGFuZCBjYWNoZWQgdGVtcGxhdGVzXHJcbiAqL1xyXG52YXIgdGVtcGxhdGVzID0gbmV3IENhY2hlcih7fSk7XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogSW5jbHVkZSBhIHRlbXBsYXRlIGJhc2VkIG9uIGl0cyBuYW1lIChvciBmaWxlcGF0aCwgaWYgaXQncyBhbHJlYWR5IGJlZW4gY2FjaGVkKS5cclxuICpcclxuICogQ2FsbGVkIGxpa2UgYGluY2x1ZGUodGVtcGxhdGVOYW1lT3JQYXRoLCBkYXRhKWBcclxuICovXHJcbmZ1bmN0aW9uIGluY2x1ZGVIZWxwZXIodGVtcGxhdGVOYW1lT3JQYXRoLCBkYXRhKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlcy5nZXQodGVtcGxhdGVOYW1lT3JQYXRoKTtcclxuICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICB0aHJvdyBFdGFFcnIoJ0NvdWxkIG5vdCBmZXRjaCB0ZW1wbGF0ZSBcIicgKyB0ZW1wbGF0ZU5hbWVPclBhdGggKyAnXCInKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhLCB0aGlzKTtcclxufVxyXG4vKiogRXRhJ3MgYmFzZSAoZ2xvYmFsKSBjb25maWd1cmF0aW9uICovXHJcbnZhciBjb25maWcgPSB7XHJcbiAgICBhc3luYzogZmFsc2UsXHJcbiAgICBhdXRvRXNjYXBlOiB0cnVlLFxyXG4gICAgYXV0b1RyaW06IFtmYWxzZSwgJ25sJ10sXHJcbiAgICBjYWNoZTogZmFsc2UsXHJcbiAgICBlOiBYTUxFc2NhcGUsXHJcbiAgICBpbmNsdWRlOiBpbmNsdWRlSGVscGVyLFxyXG4gICAgcGFyc2U6IHtcclxuICAgICAgICBleGVjOiAnJyxcclxuICAgICAgICBpbnRlcnBvbGF0ZTogJz0nLFxyXG4gICAgICAgIHJhdzogJ34nXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW10sXHJcbiAgICBybVdoaXRlc3BhY2U6IGZhbHNlLFxyXG4gICAgdGFnczogWyc8JScsICclPiddLFxyXG4gICAgdGVtcGxhdGVzOiB0ZW1wbGF0ZXMsXHJcbiAgICB1c2VXaXRoOiBmYWxzZSxcclxuICAgIHZhck5hbWU6ICdpdCdcclxufTtcclxuLyoqXHJcbiAqIFRha2VzIG9uZSBvciB0d28gcGFydGlhbCAobm90IG5lY2Vzc2FyaWx5IGNvbXBsZXRlKSBjb25maWd1cmF0aW9uIG9iamVjdHMsIG1lcmdlcyB0aGVtIDEgbGF5ZXIgZGVlcCBpbnRvIGV0YS5jb25maWcsIGFuZCByZXR1cm5zIHRoZSByZXN1bHRcclxuICpcclxuICogQHBhcmFtIG92ZXJyaWRlIFBhcnRpYWwgY29uZmlndXJhdGlvbiBvYmplY3RcclxuICogQHBhcmFtIGJhc2VDb25maWcgUGFydGlhbCBjb25maWd1cmF0aW9uIG9iamVjdCB0byBtZXJnZSBiZWZvcmUgYG92ZXJyaWRlYFxyXG4gKlxyXG4gKiAqKkV4YW1wbGUqKlxyXG4gKlxyXG4gKiBgYGBqc1xyXG4gKiBsZXQgY3VzdG9tQ29uZmlnID0gZ2V0Q29uZmlnKHt0YWdzOiBbJyEjJywgJyMhJ119KVxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGdldENvbmZpZyhvdmVycmlkZSwgYmFzZUNvbmZpZykge1xyXG4gICAgLy8gVE9ETzogcnVuIG1vcmUgdGVzdHMgb24gdGhpc1xyXG4gICAgdmFyIHJlcyA9IHt9OyAvLyBMaW5rZWRcclxuICAgIGNvcHlQcm9wcyhyZXMsIGNvbmZpZyk7IC8vIENyZWF0ZXMgZGVlcCBjbG9uZSBvZiBldGEuY29uZmlnLCAxIGxheWVyIGRlZXBcclxuICAgIGlmIChiYXNlQ29uZmlnKSB7XHJcbiAgICAgICAgY29weVByb3BzKHJlcywgYmFzZUNvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBpZiAob3ZlcnJpZGUpIHtcclxuICAgICAgICBjb3B5UHJvcHMocmVzLCBvdmVycmlkZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59XHJcbi8qKiBVcGRhdGUgRXRhJ3MgYmFzZSBjb25maWcgKi9cclxuZnVuY3Rpb24gY29uZmlndXJlKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBjb3B5UHJvcHMoY29uZmlnLCBvcHRpb25zKTtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIFRha2VzIGEgdGVtcGxhdGUgc3RyaW5nIGFuZCByZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHdpdGggKGRhdGEsIGNvbmZpZywgW2NiXSlcclxuICpcclxuICogQHBhcmFtIHN0ciAtIFRoZSB0ZW1wbGF0ZSBzdHJpbmdcclxuICogQHBhcmFtIGNvbmZpZyAtIEEgY3VzdG9tIGNvbmZpZ3VyYXRpb24gb2JqZWN0IChvcHRpb25hbClcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogbGV0IGNvbXBpbGVkRm4gPSBldGEuY29tcGlsZShcIkhpIDwlPSBpdC51c2VyICU+XCIpXHJcbiAqIC8vIGZ1bmN0aW9uIGFub255bW91cygpXHJcbiAqIGxldCBjb21waWxlZEZuU3RyID0gY29tcGlsZWRGbi50b1N0cmluZygpXHJcbiAqIC8vIFwiZnVuY3Rpb24gYW5vbnltb3VzKGl0LEUsY2JcXG4pIHtcXG52YXIgdFI9JycsaW5jbHVkZT1FLmluY2x1ZGUuYmluZChFKSxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSk7dFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7aWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFJcXG59XCJcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21waWxlKHN0ciwgY29uZmlnKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgLyogQVNZTkMgSEFORExJTkcgKi9cclxuICAgIC8vIFRoZSBiZWxvdyBjb2RlIGlzIG1vZGlmaWVkIGZyb20gbWRlL2Vqcy4gQWxsIGNyZWRpdCBzaG91bGQgZ28gdG8gdGhlbS5cclxuICAgIHZhciBjdG9yID0gb3B0aW9ucy5hc3luYyA/IGdldEFzeW5jRnVuY3Rpb25Db25zdHJ1Y3RvcigpIDogRnVuY3Rpb247XHJcbiAgICAvKiBFTkQgQVNZTkMgSEFORExJTkcgKi9cclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBjdG9yKG9wdGlvbnMudmFyTmFtZSwgJ0UnLCAvLyBFdGFDb25maWdcclxuICAgICAgICAnY2InLCAvLyBvcHRpb25hbCBjYWxsYmFja1xyXG4gICAgICAgIGNvbXBpbGVUb1N0cmluZyhzdHIsIG9wdGlvbnMpKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycignQmFkIHRlbXBsYXRlIHN5bnRheFxcblxcbicgK1xyXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlICtcclxuICAgICAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgICAgIEFycmF5KGUubWVzc2FnZS5sZW5ndGggKyAxKS5qb2luKCc9JykgK1xyXG4gICAgICAgICAgICAgICAgJ1xcbicgK1xyXG4gICAgICAgICAgICAgICAgY29tcGlsZVRvU3RyaW5nKHN0ciwgb3B0aW9ucykgK1xyXG4gICAgICAgICAgICAgICAgJ1xcbicgLy8gVGhpcyB3aWxsIHB1dCBhbiBleHRyYSBuZXdsaW5lIGJlZm9yZSB0aGUgY2FsbHN0YWNrIGZvciBleHRyYSByZWFkYWJpbGl0eVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxudmFyIF9CT00gPSAvXlxcdUZFRkYvO1xyXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBmcm9tIHRoZSBwYXJlbnQgZmlsZSBwYXRoIGFuZCB0aGVcclxuICogc3BlY2lmaWVkIHBhdGguXHJcbiAqXHJcbiAqIElmIGBuYW1lYCBkb2VzIG5vdCBoYXZlIGFuIGV4dGVuc2lvbiwgaXQgd2lsbCBkZWZhdWx0IHRvIGAuZXRhYFxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSBzcGVjaWZpZWQgcGF0aFxyXG4gKiBAcGFyYW0gcGFyZW50ZmlsZSBwYXJlbnQgZmlsZSBwYXRoXHJcbiAqIEBwYXJhbSBpc0RpcmVjdG9yeSB3aGV0aGVyIHBhcmVudGZpbGUgaXMgYSBkaXJlY3RvcnlcclxuICogQHJldHVybiBhYnNvbHV0ZSBwYXRoIHRvIHRlbXBsYXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRXaG9sZUZpbGVQYXRoKG5hbWUsIHBhcmVudGZpbGUsIGlzRGlyZWN0b3J5KSB7XHJcbiAgICB2YXIgaW5jbHVkZVBhdGggPSBwYXRoLnJlc29sdmUoaXNEaXJlY3RvcnkgPyBwYXJlbnRmaWxlIDogcGF0aC5kaXJuYW1lKHBhcmVudGZpbGUpLCAvLyByZXR1cm5zIGRpcmVjdG9yeSB0aGUgcGFyZW50IGZpbGUgaXMgaW5cclxuICAgIG5hbWUgLy8gZmlsZVxyXG4gICAgKSArIChwYXRoLmV4dG5hbWUobmFtZSkgPyAnJyA6ICcuZXRhJyk7XHJcbiAgICByZXR1cm4gaW5jbHVkZVBhdGg7XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgYWJzb2x1dGUgcGF0aCB0byBhbiBpbmNsdWRlZCB0ZW1wbGF0ZVxyXG4gKlxyXG4gKiBJZiB0aGlzIGlzIGNhbGxlZCB3aXRoIGFuIGFic29sdXRlIHBhdGggKGZvciBleGFtcGxlLCBzdGFydGluZyB3aXRoICcvJyBvciAnQzpcXCcpXHJcbiAqIHRoZW4gRXRhIHdpbGwgYXR0ZW1wdCB0byByZXNvbHZlIHRoZSBhYnNvbHV0ZSBwYXRoIHdpdGhpbiBvcHRpb25zLnZpZXdzLiBJZiBpdCBjYW5ub3QsXHJcbiAqIEV0YSB3aWxsIGZhbGxiYWNrIHRvIG9wdGlvbnMucm9vdCBvciAnLydcclxuICpcclxuICogSWYgdGhpcyBpcyBjYWxsZWQgd2l0aCBhIHJlbGF0aXZlIHBhdGgsIEV0YSB3aWxsOlxyXG4gKiAtIExvb2sgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgdGVtcGxhdGUgKGlmIHRoZSBjdXJyZW50IHRlbXBsYXRlIGhhcyB0aGUgYGZpbGVuYW1lYCBwcm9wZXJ0eSlcclxuICogLSBMb29rIGluc2lkZSBlYWNoIGRpcmVjdG9yeSBpbiBvcHRpb25zLnZpZXdzXHJcbiAqXHJcbiAqIE5vdGU6IGlmIEV0YSBpcyB1bmFibGUgdG8gZmluZCBhIHRlbXBsYXRlIHVzaW5nIHBhdGggYW5kIG9wdGlvbnMsIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IuXHJcbiAqXHJcbiAqIEBwYXJhbSBwYXRoICAgIHNwZWNpZmllZCBwYXRoXHJcbiAqIEBwYXJhbSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHJldHVybiBhYnNvbHV0ZSBwYXRoIHRvIHRlbXBsYXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQYXRoKHBhdGgsIG9wdGlvbnMpIHtcclxuICAgIHZhciBpbmNsdWRlUGF0aCA9IGZhbHNlO1xyXG4gICAgdmFyIHZpZXdzID0gb3B0aW9ucy52aWV3cztcclxuICAgIHZhciBzZWFyY2hlZFBhdGhzID0gW107XHJcbiAgICAvLyBJZiB0aGVzZSBmb3VyIHZhbHVlcyBhcmUgdGhlIHNhbWUsXHJcbiAgICAvLyBnZXRQYXRoKCkgd2lsbCByZXR1cm4gdGhlIHNhbWUgcmVzdWx0IGV2ZXJ5IHRpbWUuXHJcbiAgICAvLyBXZSBjYW4gY2FjaGUgdGhlIHJlc3VsdCB0byBhdm9pZCBleHBlbnNpdmVcclxuICAgIC8vIGZpbGUgb3BlcmF0aW9ucy5cclxuICAgIHZhciBwYXRoT3B0aW9ucyA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBmaWxlbmFtZTogb3B0aW9ucy5maWxlbmFtZSxcclxuICAgICAgICBwYXRoOiBwYXRoLFxyXG4gICAgICAgIHJvb3Q6IG9wdGlvbnMucm9vdCxcclxuICAgICAgICB2aWV3czogb3B0aW9ucy52aWV3c1xyXG4gICAgfSk7XHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlW3BhdGhPcHRpb25zXSkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY2FjaGVkIGZpbGVwYXRoXHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZmlsZXBhdGhDYWNoZVtwYXRoT3B0aW9uc107XHJcbiAgICB9XHJcbiAgICAvKiogQWRkIGEgZmlsZXBhdGggdG8gdGhlIGxpc3Qgb2YgcGF0aHMgd2UndmUgY2hlY2tlZCBmb3IgYSB0ZW1wbGF0ZSAqL1xyXG4gICAgZnVuY3Rpb24gYWRkUGF0aFRvU2VhcmNoZWQocGF0aFNlYXJjaGVkKSB7XHJcbiAgICAgICAgaWYgKCFzZWFyY2hlZFBhdGhzLmluY2x1ZGVzKHBhdGhTZWFyY2hlZCkpIHtcclxuICAgICAgICAgICAgc2VhcmNoZWRQYXRocy5wdXNoKHBhdGhTZWFyY2hlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUYWtlIGEgZmlsZXBhdGggKGxpa2UgJ3BhcnRpYWxzL215cGFydGlhbC5ldGEnKS4gQXR0ZW1wdCB0byBmaW5kIHRoZSB0ZW1wbGF0ZSBmaWxlIGluc2lkZSBgdmlld3NgO1xyXG4gICAgICogcmV0dXJuIHRoZSByZXN1bHRpbmcgdGVtcGxhdGUgZmlsZSBwYXRoLCBvciBgZmFsc2VgIHRvIGluZGljYXRlIHRoYXQgdGhlIHRlbXBsYXRlIHdhcyBub3QgZm91bmQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZpZXdzIHRoZSBmaWxlcGF0aCB0aGF0IGhvbGRzIHRlbXBsYXRlcywgb3IgYW4gYXJyYXkgb2YgZmlsZXBhdGhzIHRoYXQgaG9sZCB0ZW1wbGF0ZXNcclxuICAgICAqIEBwYXJhbSBwYXRoIHRoZSBwYXRoIHRvIHRoZSB0ZW1wbGF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hWaWV3cyh2aWV3cywgcGF0aCkge1xyXG4gICAgICAgIHZhciBmaWxlUGF0aDtcclxuICAgICAgICAvLyBJZiB2aWV3cyBpcyBhbiBhcnJheSwgdGhlbiBsb29wIHRocm91Z2ggZWFjaCBkaXJlY3RvcnlcclxuICAgICAgICAvLyBBbmQgYXR0ZW1wdCB0byBmaW5kIHRoZSB0ZW1wbGF0ZVxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZpZXdzKSAmJlxyXG4gICAgICAgICAgICB2aWV3cy5zb21lKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCA9IGdldFdob2xlRmlsZVBhdGgocGF0aCwgdiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RzU3luYyhmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBhYm92ZSByZXR1cm5lZCB0cnVlLCB3ZSBrbm93IHRoYXQgdGhlIGZpbGVQYXRoIHdhcyBqdXN0IHNldCB0byBhIHBhdGhcclxuICAgICAgICAgICAgLy8gVGhhdCBleGlzdHMgKEFycmF5LnNvbWUoKSByZXR1cm5zIGFzIHNvb24gYXMgaXQgZmluZHMgYSB2YWxpZCBlbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2aWV3cyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciB0aGUgZmlsZSBpZiB2aWV3cyBpcyBhIHNpbmdsZSBkaXJlY3RvcnlcclxuICAgICAgICAgICAgZmlsZVBhdGggPSBnZXRXaG9sZUZpbGVQYXRoKHBhdGgsIHZpZXdzLCB0cnVlKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlUGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBVbmFibGUgdG8gZmluZCBhIGZpbGVcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBQYXRoIHN0YXJ0cyB3aXRoICcvJywgJ0M6XFwnLCBldGMuXHJcbiAgICB2YXIgbWF0Y2ggPSAvXltBLVphLXpdKzpcXFxcfF5cXC8vLmV4ZWMocGF0aCk7XHJcbiAgICAvLyBBYnNvbHV0ZSBwYXRoLCBsaWtlIC9wYXJ0aWFscy9wYXJ0aWFsLmV0YVxyXG4gICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gdHJpbSB0aGUgYmVnaW5uaW5nICcvJyBvZmYgdGhlIHBhdGgsIG9yIGVsc2VcclxuICAgICAgICAvLyBwYXRoLnJlc29sdmUoZGlyLCBwYXRoKSB3aWxsIGFsd2F5cyByZXNvbHZlIHRvIGp1c3QgcGF0aFxyXG4gICAgICAgIHZhciBmb3JtYXR0ZWRQYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvKi8sICcnKTtcclxuICAgICAgICAvLyBGaXJzdCwgdHJ5IHRvIHJlc29sdmUgdGhlIHBhdGggd2l0aGluIG9wdGlvbnMudmlld3NcclxuICAgICAgICBpbmNsdWRlUGF0aCA9IHNlYXJjaFZpZXdzKHZpZXdzLCBmb3JtYXR0ZWRQYXRoKTtcclxuICAgICAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoYXQgZmFpbHMsIHNlYXJjaFZpZXdzIHdpbGwgcmV0dXJuIGZhbHNlLiBUcnkgdG8gZmluZCB0aGUgcGF0aFxyXG4gICAgICAgICAgICAvLyBpbnNpZGUgb3B0aW9ucy5yb290IChieSBkZWZhdWx0ICcvJywgdGhlIGJhc2Ugb2YgdGhlIGZpbGVzeXN0ZW0pXHJcbiAgICAgICAgICAgIHZhciBwYXRoRnJvbVJvb3QgPSBnZXRXaG9sZUZpbGVQYXRoKGZvcm1hdHRlZFBhdGgsIG9wdGlvbnMucm9vdCB8fCAnLycsIHRydWUpO1xyXG4gICAgICAgICAgICBhZGRQYXRoVG9TZWFyY2hlZChwYXRoRnJvbVJvb3QpO1xyXG4gICAgICAgICAgICBpbmNsdWRlUGF0aCA9IHBhdGhGcm9tUm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBSZWxhdGl2ZSBwYXRoc1xyXG4gICAgICAgIC8vIExvb2sgcmVsYXRpdmUgdG8gYSBwYXNzZWQgZmlsZW5hbWUgZmlyc3RcclxuICAgICAgICBpZiAob3B0aW9ucy5maWxlbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBnZXRXaG9sZUZpbGVQYXRoKHBhdGgsIG9wdGlvbnMuZmlsZW5hbWUpO1xyXG4gICAgICAgICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBmaWxlUGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUaGVuIGxvb2sgZm9yIHRoZSB0ZW1wbGF0ZSBpbiBvcHRpb25zLnZpZXdzXHJcbiAgICAgICAgaWYgKCFpbmNsdWRlUGF0aCkge1xyXG4gICAgICAgICAgICBpbmNsdWRlUGF0aCA9IHNlYXJjaFZpZXdzKHZpZXdzLCBwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlUGF0aCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFdGFFcnIoJ0NvdWxkIG5vdCBmaW5kIHRoZSB0ZW1wbGF0ZSBcIicgKyBwYXRoICsgJ1wiLiBQYXRocyB0cmllZDogJyArIHNlYXJjaGVkUGF0aHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIElmIGNhY2hpbmcgYW5kIGZpbGVwYXRoQ2FjaGUgYXJlIGVuYWJsZWQsXHJcbiAgICAvLyBjYWNoZSB0aGUgaW5wdXQgJiBvdXRwdXQgb2YgdGhpcyBmdW5jdGlvbi5cclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZSkge1xyXG4gICAgICAgIG9wdGlvbnMuZmlsZXBhdGhDYWNoZVtwYXRoT3B0aW9uc10gPSBpbmNsdWRlUGF0aDtcclxuICAgIH1cclxuICAgIHJldHVybiBpbmNsdWRlUGF0aDtcclxufVxyXG4vKipcclxuICogUmVhZHMgYSBmaWxlIHN5bmNocm9ub3VzbHlcclxuICovXHJcbmZ1bmN0aW9uIHJlYWRGaWxlKGZpbGVQYXRoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiByZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCkucmVwbGFjZShfQk9NLCAnJyk7IC8vIFRPRE86IGlzIHJlcGxhY2luZyBCT00ncyBuZWNlc3Nhcnk/XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICB0aHJvdyBFdGFFcnIoXCJGYWlsZWQgdG8gcmVhZCB0ZW1wbGF0ZSBhdCAnXCIgKyBmaWxlUGF0aCArIFwiJ1wiKTtcclxuICAgIH1cclxufVxuXG4vLyBleHByZXNzIGlzIHNldCBsaWtlOiBhcHAuZW5naW5lKCdodG1sJywgcmVxdWlyZSgnZXRhJykucmVuZGVyRmlsZSlcclxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBSZWFkcyBhIHRlbXBsYXRlLCBjb21waWxlcyBpdCBpbnRvIGEgZnVuY3Rpb24sIGNhY2hlcyBpdCBpZiBjYWNoaW5nIGlzbid0IGRpc2FibGVkLCByZXR1cm5zIHRoZSBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gZmlsZVBhdGggQWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZSBmaWxlXHJcbiAqIEBwYXJhbSBvcHRpb25zIEV0YSBjb25maWd1cmF0aW9uIG92ZXJyaWRlc1xyXG4gKiBAcGFyYW0gbm9DYWNoZSBPcHRpb25hbGx5LCBtYWtlIEV0YSBub3QgY2FjaGUgdGhlIHRlbXBsYXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkRmlsZShmaWxlUGF0aCwgb3B0aW9ucywgbm9DYWNoZSkge1xyXG4gICAgdmFyIGNvbmZpZyA9IGdldENvbmZpZyhvcHRpb25zKTtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IHJlYWRGaWxlKGZpbGVQYXRoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGNvbXBpbGVkVGVtcGxhdGUgPSBjb21waWxlKHRlbXBsYXRlLCBjb25maWcpO1xyXG4gICAgICAgIGlmICghbm9DYWNoZSkge1xyXG4gICAgICAgICAgICBjb25maWcudGVtcGxhdGVzLmRlZmluZShjb25maWcuZmlsZW5hbWUsIGNvbXBpbGVkVGVtcGxhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcGlsZWRUZW1wbGF0ZTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKCdMb2FkaW5nIGZpbGU6ICcgKyBmaWxlUGF0aCArICcgZmFpbGVkOlxcblxcbicgKyBlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZyb20gYSBzdHJpbmcgb3IgYSBmaWxlLCBlaXRoZXIgY29tcGlsZWQgb24tdGhlLWZseSBvclxyXG4gKiByZWFkIGZyb20gY2FjaGUgKGlmIGVuYWJsZWQpLCBhbmQgY2FjaGUgdGhlIHRlbXBsYXRlIGlmIG5lZWRlZC5cclxuICpcclxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIHRydWUsIHRoaXMgZnVuY3Rpb24gcmVhZHMgdGhlIGZpbGUgZnJvbVxyXG4gKiBgb3B0aW9ucy5maWxlbmFtZWAgc28gaXQgbXVzdCBiZSBzZXQgcHJpb3IgdG8gY2FsbGluZyB0aGlzIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gb3B0aW9ucyAgIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHJldHVybiBFdGEgdGVtcGxhdGUgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNhY2hlJDEob3B0aW9ucykge1xyXG4gICAgdmFyIGZpbGVuYW1lID0gb3B0aW9ucy5maWxlbmFtZTtcclxuICAgIGlmIChvcHRpb25zLmNhY2hlKSB7XHJcbiAgICAgICAgdmFyIGZ1bmMgPSBvcHRpb25zLnRlbXBsYXRlcy5nZXQoZmlsZW5hbWUpO1xyXG4gICAgICAgIGlmIChmdW5jKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbG9hZEZpbGUoZmlsZW5hbWUsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgLy8gQ2FjaGluZyBpcyBkaXNhYmxlZCwgc28gcGFzcyBub0NhY2hlID0gdHJ1ZVxyXG4gICAgcmV0dXJuIGxvYWRGaWxlKGZpbGVuYW1lLCBvcHRpb25zLCB0cnVlKTtcclxufVxyXG4vKipcclxuICogVHJ5IGNhbGxpbmcgaGFuZGxlQ2FjaGUgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBhbmQgZGF0YSBhbmQgY2FsbCB0aGVcclxuICogY2FsbGJhY2sgd2l0aCB0aGUgcmVzdWx0LiBJZiBhbiBlcnJvciBvY2N1cnMsIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGhcclxuICogdGhlIGVycm9yLiBVc2VkIGJ5IHJlbmRlckZpbGUoKS5cclxuICpcclxuICogQHBhcmFtIGRhdGEgdGVtcGxhdGUgZGF0YVxyXG4gKiBAcGFyYW0gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEBwYXJhbSBjYiBjYWxsYmFja1xyXG4gKi9cclxuZnVuY3Rpb24gdHJ5SGFuZGxlQ2FjaGUoZGF0YSwgb3B0aW9ucywgY2IpIHtcclxuICAgIGlmIChjYikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIE5vdGU6IGlmIHRoZXJlIGlzIGFuIGVycm9yIHdoaWxlIHJlbmRlcmluZyB0aGUgdGVtcGxhdGUsXHJcbiAgICAgICAgICAgIC8vIEl0IHdpbGwgYnViYmxlIHVwIGFuZCBiZSBjYXVnaHQgaGVyZVxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVGbiA9IGhhbmRsZUNhY2hlJDEob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucywgY2IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIE5vIGNhbGxiYWNrLCB0cnkgcmV0dXJuaW5nIGEgcHJvbWlzZVxyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvbWlzZUltcGwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUkMShvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVGbihkYXRhLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKFwiUGxlYXNlIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbiwgdGhpcyBlbnYgZG9lc24ndCBzdXBwb3J0IFByb21pc2VzXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbi5cclxuICpcclxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIGB0cnVlYCwgdGhlbiB0aGUgdGVtcGxhdGUgaXMgY2FjaGVkLlxyXG4gKlxyXG4gKiBUaGlzIHJldHVybnMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiBhbmQgdGhlIGNvbmZpZyBvYmplY3Qgd2l0aCB3aGljaCB0aGF0IHRlbXBsYXRlIGZ1bmN0aW9uIHNob3VsZCBiZSBjYWxsZWQuXHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqXHJcbiAqIEl0J3MgaW1wb3J0YW50IHRoYXQgdGhpcyByZXR1cm5zIGEgY29uZmlnIG9iamVjdCB3aXRoIGBmaWxlbmFtZWAgc2V0LlxyXG4gKiBPdGhlcndpc2UsIHRoZSBpbmNsdWRlZCBmaWxlIHdvdWxkIG5vdCBiZSBhYmxlIHRvIHVzZSByZWxhdGl2ZSBwYXRoc1xyXG4gKlxyXG4gKiBAcGFyYW0gcGF0aCBwYXRoIGZvciB0aGUgc3BlY2lmaWVkIGZpbGUgKGlmIHJlbGF0aXZlLCBzcGVjaWZ5IGB2aWV3c2Agb24gYG9wdGlvbnNgKVxyXG4gKiBAcGFyYW0gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gW0V0YSB0ZW1wbGF0ZSBmdW5jdGlvbiwgbmV3IGNvbmZpZyBvYmplY3RdXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlRmlsZShwYXRoLCBvcHRpb25zKSB7XHJcbiAgICAvLyB0aGUgYmVsb3cgY3JlYXRlcyBhIG5ldyBvcHRpb25zIG9iamVjdCwgdXNpbmcgdGhlIHBhcmVudCBmaWxlcGF0aCBvZiB0aGUgb2xkIG9wdGlvbnMgb2JqZWN0IGFuZCB0aGUgcGF0aFxyXG4gICAgdmFyIG5ld0ZpbGVPcHRpb25zID0gZ2V0Q29uZmlnKHsgZmlsZW5hbWU6IGdldFBhdGgocGF0aCwgb3B0aW9ucykgfSwgb3B0aW9ucyk7XHJcbiAgICAvLyBUT0RPOiBtYWtlIHN1cmUgcHJvcGVydGllcyBhcmUgY3VycmVjdGx5IGNvcGllZCBvdmVyXHJcbiAgICByZXR1cm4gW2hhbmRsZUNhY2hlJDEobmV3RmlsZU9wdGlvbnMpLCBuZXdGaWxlT3B0aW9uc107XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyRmlsZShmaWxlbmFtZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgLypcclxuICAgIEhlcmUgd2UgaGF2ZSBzb21lIGZ1bmN0aW9uIG92ZXJsb2FkaW5nLlxyXG4gICAgRXNzZW50aWFsbHksIHRoZSBmaXJzdCAyIGFyZ3VtZW50cyB0byByZW5kZXJGaWxlIHNob3VsZCBhbHdheXMgYmUgdGhlIGZpbGVuYW1lIGFuZCBkYXRhXHJcbiAgICBIb3dldmVyLCB3aXRoIEV4cHJlc3MsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCBhbG9uZyB3aXRoIHRoZSBkYXRhLlxyXG4gICAgVGh1cywgRXhwcmVzcyB3aWxsIGNhbGwgcmVuZGVyRmlsZSB3aXRoIChmaWxlbmFtZSwgZGF0YUFuZE9wdGlvbnMsIGNiKVxyXG4gICAgQW5kIHdlIHdhbnQgdG8gYWxzbyBtYWtlIChmaWxlbmFtZSwgZGF0YSwgb3B0aW9ucywgY2IpIGF2YWlsYWJsZVxyXG4gICAgKi9cclxuICAgIHZhciByZW5kZXJDb25maWc7XHJcbiAgICB2YXIgY2FsbGJhY2s7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB7fTsgLy8gSWYgZGF0YSBpcyB1bmRlZmluZWQsIHdlIGRvbid0IHdhbnQgYWNjZXNzaW5nIGRhdGEuc2V0dGluZ3MgdG8gZXJyb3JcclxuICAgIC8vIEZpcnN0LCBhc3NpZ24gb3VyIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGBjYWxsYmFja2BcclxuICAgIC8vIFdlIGNhbiBsZWF2ZSBpdCB1bmRlZmluZWQgaWYgbmVpdGhlciBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbjtcclxuICAgIC8vIENhbGxiYWNrcyBhcmUgb3B0aW9uYWxcclxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvLyBUaGUgNHRoIGFyZ3VtZW50IGlzIHRoZSBjYWxsYmFja1xyXG4gICAgICAgIGNhbGxiYWNrID0gY2I7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgY29uZmlnID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gVGhlIDNyZCBhcmcgaXMgdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgY2FsbGJhY2sgPSBjb25maWc7XHJcbiAgICB9XHJcbiAgICAvLyBJZiB0aGVyZSBpcyBhIGNvbmZpZyBvYmplY3QgcGFzc2VkIGluIGV4cGxpY2l0bHksIHVzZSBpdFxyXG4gICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmVuZGVyQ29uZmlnID0gZ2V0Q29uZmlnKGNvbmZpZyB8fCB7fSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBPdGhlcndpc2UsIGdldCB0aGUgY29uZmlnIGZyb20gdGhlIGRhdGEgb2JqZWN0XHJcbiAgICAgICAgLy8gQW5kIHRoZW4gZ3JhYiBzb21lIGNvbmZpZyBvcHRpb25zIGZyb20gZGF0YS5zZXR0aW5nc1xyXG4gICAgICAgIC8vIFdoaWNoIGlzIHdoZXJlIEV4cHJlc3Mgc29tZXRpbWVzIHN0b3JlcyB0aGVtXHJcbiAgICAgICAgcmVuZGVyQ29uZmlnID0gZ2V0Q29uZmlnKGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIC8vIFB1bGwgYSBmZXcgdGhpbmdzIGZyb20ga25vd24gbG9jYXRpb25zXHJcbiAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnZpZXdzKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb25maWcudmlld3MgPSBkYXRhLnNldHRpbmdzLnZpZXdzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzWyd2aWV3IGNhY2hlJ10pIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckNvbmZpZy5jYWNoZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gVW5kb2N1bWVudGVkIGFmdGVyIEV4cHJlc3MgMiwgYnV0IHN0aWxsIHVzYWJsZSwgZXNwLiBmb3JcclxuICAgICAgICAgICAgLy8gaXRlbXMgdGhhdCBhcmUgdW5zYWZlIHRvIGJlIHBhc3NlZCBhbG9uZyB3aXRoIGRhdGEsIGxpa2UgYHJvb3RgXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0cyA9IGRhdGEuc2V0dGluZ3NbJ3ZpZXcgb3B0aW9ucyddO1xyXG4gICAgICAgICAgICBpZiAodmlld09wdHMpIHtcclxuICAgICAgICAgICAgICAgIGNvcHlQcm9wcyhyZW5kZXJDb25maWcsIHZpZXdPcHRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFNldCB0aGUgZmlsZW5hbWUgb3B0aW9uIG9uIHRoZSB0ZW1wbGF0ZVxyXG4gICAgLy8gVGhpcyB3aWxsIGZpcnN0IHRyeSB0byByZXNvbHZlIHRoZSBmaWxlIHBhdGggKHNlZSBnZXRQYXRoIGZvciBkZXRhaWxzKVxyXG4gICAgcmVuZGVyQ29uZmlnLmZpbGVuYW1lID0gZ2V0UGF0aChmaWxlbmFtZSwgcmVuZGVyQ29uZmlnKTtcclxuICAgIHJldHVybiB0cnlIYW5kbGVDYWNoZShkYXRhLCByZW5kZXJDb25maWcsIGNhbGxiYWNrKTtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJGaWxlQXN5bmMoZmlsZW5hbWUsIGRhdGEsIGNvbmZpZywgY2IpIHtcclxuICAgIHJldHVybiByZW5kZXJGaWxlKGZpbGVuYW1lLCB0eXBlb2YgY29uZmlnID09PSAnZnVuY3Rpb24nID8gX19hc3NpZ24oX19hc3NpZ24oe30sIGRhdGEpLCB7IGFzeW5jOiB0cnVlIH0pIDogZGF0YSwgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29uZmlnKSwgeyBhc3luYzogdHJ1ZSB9KSA6IGNvbmZpZywgY2IpO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogQ2FsbGVkIHdpdGggYGluY2x1ZGVGaWxlKHBhdGgsIGRhdGEpYFxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZUZpbGVIZWxwZXIocGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHRlbXBsYXRlQW5kQ29uZmlnID0gaW5jbHVkZUZpbGUocGF0aCwgdGhpcyk7XHJcbiAgICByZXR1cm4gdGVtcGxhdGVBbmRDb25maWdbMF0oZGF0YSwgdGVtcGxhdGVBbmRDb25maWdbMV0pO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5uYW1lICYmIG9wdGlvbnMudGVtcGxhdGVzLmdldChvcHRpb25zLm5hbWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMudGVtcGxhdGVzLmdldChvcHRpb25zLm5hbWUpO1xyXG4gICAgfVxyXG4gICAgdmFyIHRlbXBsYXRlRnVuYyA9IHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHRlbXBsYXRlIDogY29tcGlsZSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XHJcbiAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3QgaGF2ZSB0byBjaGVjayBpZiBpdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgY2FjaGU7XHJcbiAgICAvLyBpdCB3b3VsZCBoYXZlIHJldHVybmVkIGVhcmxpZXIgaWYgaXQgaGFkXHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLm5hbWUpIHtcclxuICAgICAgICBvcHRpb25zLnRlbXBsYXRlcy5kZWZpbmUob3B0aW9ucy5uYW1lLCB0ZW1wbGF0ZUZ1bmMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlbXBsYXRlRnVuYztcclxufVxyXG4vKipcclxuICogUmVuZGVyIGEgdGVtcGxhdGVcclxuICpcclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIHN0cmluZywgRXRhIHdpbGwgY29tcGlsZSBpdCB0byBhIGZ1bmN0aW9uIGFuZCB0aGVuIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIHRlbXBsYXRlIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqXHJcbiAqIElmIGBjb25maWcuYXN5bmNgIGlzIGBmYWxzZWAsIEV0YSB3aWxsIHJldHVybiB0aGUgcmVuZGVyZWQgdGVtcGxhdGUuXHJcbiAqXHJcbiAqIElmIGBjb25maWcuYXN5bmNgIGlzIGB0cnVlYCBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIHRoZSBjYWxsYmFjayB3aXRoIGAoZXJyLCByZW5kZXJlZFRlbXBsYXRlKWAuXHJcbiAqIElmIGBjb25maWcuYXN5bmNgIGlzIGB0cnVlYCBhbmQgdGhlcmUncyBub3QgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgcmV0dXJuIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZS5cclxuICpcclxuICogSWYgYGNvbmZpZy5jYWNoZWAgaXMgYHRydWVgIGFuZCBgY29uZmlnYCBoYXMgYSBgbmFtZWAgb3IgYGZpbGVuYW1lYCBwcm9wZXJ0eSwgRXRhIHdpbGwgY2FjaGUgdGhlIHRlbXBsYXRlIG9uIHRoZSBmaXJzdCByZW5kZXIgYW5kIHVzZSB0aGUgY2FjaGVkIHRlbXBsYXRlIGZvciBhbGwgc3Vic2VxdWVudCByZW5kZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgc3RyaW5nIG9yIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcmVuZGVyIHRoZSB0ZW1wbGF0ZSB3aXRoXHJcbiAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlnIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXIodGVtcGxhdGUsIGRhdGEsIGNvbmZpZywgY2IpIHtcclxuICAgIHZhciBvcHRpb25zID0gZ2V0Q29uZmlnKGNvbmZpZyB8fCB7fSk7XHJcbiAgICBpZiAob3B0aW9ucy5hc3luYykge1xyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICAvLyBJZiB1c2VyIHBhc3NlcyBjYWxsYmFja1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gTm90ZTogaWYgdGhlcmUgaXMgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgIC8vIEl0IHdpbGwgYnViYmxlIHVwIGFuZCBiZSBjYXVnaHQgaGVyZVxyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTm8gY2FsbGJhY2ssIHRyeSByZXR1cm5pbmcgYSBwcm9taXNlXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvbWlzZUltcGwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpKGRhdGEsIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucykoZGF0YSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlciBhIHRlbXBsYXRlIGFzeW5jaHJvbm91c2x5XHJcbiAqXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSBzdHJpbmcsIEV0YSB3aWxsIGNvbXBpbGUgaXQgdG8gYSBmdW5jdGlvbiBhbmQgY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICpcclxuICogSWYgdGhlcmUgaXMgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCBpdCB3aXRoIGAoZXJyLCByZW5kZXJlZFRlbXBsYXRlKWAuXHJcbiAqIElmIHRoZXJlIGlzIG5vdCBhIGNhbGxiYWNrIGZ1bmN0aW9uLCBFdGEgd2lsbCByZXR1cm4gYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHJlbmRlcmVkIHRlbXBsYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZSBzdHJpbmcgb3IgdGVtcGxhdGUgZnVuY3Rpb25cclxuICogQHBhcmFtIGRhdGEgRGF0YSB0byByZW5kZXIgdGhlIHRlbXBsYXRlIHdpdGhcclxuICogQHBhcmFtIGNvbmZpZyBPcHRpb25hbCBjb25maWcgb3B0aW9uc1xyXG4gKiBAcGFyYW0gY2IgQ2FsbGJhY2sgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlckFzeW5jKHRlbXBsYXRlLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICAvLyBVc2luZyBPYmplY3QuYXNzaWduIHRvIGxvd2VyIGJ1bmRsZSBzaXplLCB1c2luZyBzcHJlYWQgb3BlcmF0b3IgbWFrZXMgaXQgbGFyZ2VyIGJlY2F1c2Ugb2YgdHlwZXNjcmlwdCBpbmplY3RlZCBwb2x5ZmlsbHNcclxuICAgIHJldHVybiByZW5kZXIodGVtcGxhdGUsIGRhdGEsIE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZywgeyBhc3luYzogdHJ1ZSB9KSwgY2IpO1xyXG59XG5cbi8vIEBkZW5vaWZ5LWlnbm9yZVxyXG5jb25maWcuaW5jbHVkZUZpbGUgPSBpbmNsdWRlRmlsZUhlbHBlcjtcclxuY29uZmlnLmZpbGVwYXRoQ2FjaGUgPSB7fTtcblxuZXhwb3J0IHsgcmVuZGVyRmlsZSBhcyBfX2V4cHJlc3MsIGNvbXBpbGUsIGNvbXBpbGVUb1N0cmluZywgY29uZmlnLCBjb25maWd1cmUsIGNvbmZpZyBhcyBkZWZhdWx0Q29uZmlnLCBnZXRDb25maWcsIGxvYWRGaWxlLCBwYXJzZSwgcmVuZGVyLCByZW5kZXJBc3luYywgcmVuZGVyRmlsZSwgcmVuZGVyRmlsZUFzeW5jLCB0ZW1wbGF0ZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV0YS5lcy5qcy5tYXBcbiIsImltcG9ydCAqIGFzIEV0YSBmcm9tIFwiZXRhXCI7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xuICAgIGFzeW5jIHBhcnNlX2NvbW1hbmRzKFxuICAgICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgICAgIG9iamVjdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb250ZW50ID0gKGF3YWl0IEV0YS5yZW5kZXJBc3luYyhjb250ZW50LCBvYmplY3QsIHtcbiAgICAgICAgICAgIHZhck5hbWU6IFwidHBcIixcbiAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgICAgZXhlYzogXCIqXCIsXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGU6IFwiflwiLFxuICAgICAgICAgICAgICAgIHJhdzogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRvVHJpbTogZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxBd2FpdDogdHJ1ZSxcbiAgICAgICAgfSkpIGFzIHN0cmluZztcblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG59XG4iLCJpbXBvcnQge1xuICAgIEFwcCxcbiAgICBub3JtYWxpemVQYXRoLFxuICAgIE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gICAgTWFya2Rvd25WaWV3LFxuICAgIFRBYnN0cmFjdEZpbGUsXG4gICAgVEZpbGUsXG4gICAgVEZvbGRlcixcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IHJlc29sdmVfdGZpbGUsIGRlbGF5IH0gZnJvbSBcIlV0aWxzXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQge1xuICAgIEZ1bmN0aW9uc01vZGUsXG4gICAgRnVuY3Rpb25zR2VuZXJhdG9yLFxufSBmcm9tIFwiZnVuY3Rpb25zL0Z1bmN0aW9uc0dlbmVyYXRvclwiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyLCBlcnJvcldyYXBwZXJTeW5jLCBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcImVkaXRvci9FZGl0b3JcIjtcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCJwYXJzZXIvUGFyc2VyXCI7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tIFwiTG9nXCI7XG5cbmV4cG9ydCBlbnVtIFJ1bk1vZGUge1xuICAgIENyZWF0ZU5ld0Zyb21UZW1wbGF0ZSxcbiAgICBBcHBlbmRBY3RpdmVGaWxlLFxuICAgIE92ZXJ3cml0ZUZpbGUsXG4gICAgT3ZlcndyaXRlQWN0aXZlRmlsZSxcbiAgICBEeW5hbWljUHJvY2Vzc29yLFxuICAgIFN0YXJ0dXBUZW1wbGF0ZSxcbn1cblxuZXhwb3J0IHR5cGUgUnVubmluZ0NvbmZpZyA9IHtcbiAgICB0ZW1wbGF0ZV9maWxlOiBURmlsZTtcbiAgICB0YXJnZXRfZmlsZTogVEZpbGU7XG4gICAgcnVuX21vZGU6IFJ1bk1vZGU7XG4gICAgYWN0aXZlX2ZpbGU/OiBURmlsZTtcbn07XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXIge1xuICAgIHB1YmxpYyBwYXJzZXI6IFBhcnNlcjtcbiAgICBwdWJsaWMgZnVuY3Rpb25zX2dlbmVyYXRvcjogRnVuY3Rpb25zR2VuZXJhdG9yO1xuICAgIHB1YmxpYyBlZGl0b3I6IEVkaXRvcjtcbiAgICBwdWJsaWMgY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yID0gbmV3IEZ1bmN0aW9uc0dlbmVyYXRvcihcbiAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgdGhpcy5wbHVnaW5cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBuZXcgRWRpdG9yKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcigpO1xuICAgIH1cblxuICAgIGFzeW5jIHNldHVwKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmVkaXRvci5zZXR1cCgpO1xuICAgICAgICBhd2FpdCB0aGlzLmZ1bmN0aW9uc19nZW5lcmF0b3IuaW5pdCgpO1xuICAgICAgICB0aGlzLnBsdWdpbi5yZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvcigoZWwsIGN0eCkgPT5cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc19keW5hbWljX3RlbXBsYXRlcyhlbCwgY3R4KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgdGVtcGxhdGVfZmlsZTogVEZpbGUsXG4gICAgICAgIHRhcmdldF9maWxlOiBURmlsZSxcbiAgICAgICAgcnVuX21vZGU6IFJ1bk1vZGVcbiAgICApOiBSdW5uaW5nQ29uZmlnIHtcbiAgICAgICAgY29uc3QgYWN0aXZlX2ZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlOiB0ZW1wbGF0ZV9maWxlLFxuICAgICAgICAgICAgdGFyZ2V0X2ZpbGU6IHRhcmdldF9maWxlLFxuICAgICAgICAgICAgcnVuX21vZGU6IHJ1bl9tb2RlLFxuICAgICAgICAgICAgYWN0aXZlX2ZpbGU6IGFjdGl2ZV9maWxlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIHJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKGNvbmZpZzogUnVubmluZ0NvbmZpZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlX2NvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKFxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlX2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VfdGVtcGxhdGUoY29uZmlnLCB0ZW1wbGF0ZV9jb250ZW50KTtcbiAgICB9XG5cbiAgICBhc3luYyBwYXJzZV90ZW1wbGF0ZShcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnLFxuICAgICAgICB0ZW1wbGF0ZV9jb250ZW50OiBzdHJpbmdcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBmdW5jdGlvbnNfb2JqZWN0ID0gYXdhaXQgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yLmdlbmVyYXRlX29iamVjdChcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdCA9IGZ1bmN0aW9uc19vYmplY3Q7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZV9jb21tYW5kcyhcbiAgICAgICAgICAgIHRlbXBsYXRlX2NvbnRlbnQsXG4gICAgICAgICAgICBmdW5jdGlvbnNfb2JqZWN0XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGFzeW5jIGp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oZmlsZTogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b19qdW1wX3RvX2N1cnNvciAmJlxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSA9PT0gZmlsZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgIGZvbGRlcj86IFRGb2xkZXIsXG4gICAgICAgIGZpbGVuYW1lPzogc3RyaW5nLFxuICAgICAgICBvcGVuX25ld19ub3RlID0gdHJ1ZVxuICAgICk6IFByb21pc2U8VEZpbGU+IHtcbiAgICAgICAgLy8gVE9ETzogTWF5YmUgdGhlcmUgaXMgYW4gb2JzaWRpYW4gQVBJIGZ1bmN0aW9uIGZvciB0aGF0XG4gICAgICAgIGlmICghZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBGaXggdGhhdFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgbmV3X2ZpbGVfbG9jYXRpb24gPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0LmdldENvbmZpZyhcIm5ld0ZpbGVMb2NhdGlvblwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAobmV3X2ZpbGVfbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiY3VycmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZV9maWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZV9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXIgPSBhY3RpdmVfZmlsZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJmb2xkZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyID0gdGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJvb3RcIjpcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IENoYW5nZSB0aGF0LCBub3Qgc3RhYmxlIGF0bVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGNyZWF0ZWRfbm90ZSA9IGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmNyZWF0ZU5ld01hcmtkb3duRmlsZShcbiAgICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICAgIGZpbGVuYW1lID8/IFwiVW50aXRsZWRcIlxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBydW5uaW5nX2NvbmZpZzogUnVubmluZ0NvbmZpZztcbiAgICAgICAgbGV0IG91dHB1dF9jb250ZW50OiBzdHJpbmc7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfbm90ZSxcbiAgICAgICAgICAgICAgICBSdW5Nb2RlLkNyZWF0ZU5ld0Zyb21UZW1wbGF0ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjcmVhdGVkX25vdGUsXG4gICAgICAgICAgICAgICAgUnVuTW9kZS5DcmVhdGVOZXdGcm9tVGVtcGxhdGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnBhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnLCB0ZW1wbGF0ZSksXG4gICAgICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5kZWxldGUoY3JlYXRlZF9ub3RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShjcmVhdGVkX25vdGUsIG91dHB1dF9jb250ZW50KTtcblxuICAgICAgICBpZiAob3Blbl9uZXdfbm90ZSkge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX2xlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgICAgIGlmICghYWN0aXZlX2xlYWYpIHtcbiAgICAgICAgICAgICAgICBsb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKFwiTm8gYWN0aXZlIGxlYWZcIikpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IGFjdGl2ZV9sZWFmLm9wZW5GaWxlKGNyZWF0ZWRfbm90ZSwge1xuICAgICAgICAgICAgICAgIHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSxcbiAgICAgICAgICAgICAgICBlU3RhdGU6IHsgcmVuYW1lOiBcImFsbFwiIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbihjcmVhdGVkX25vdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWRfbm90ZTtcbiAgICB9XG5cbiAgICBhc3luYyBhcHBlbmRfdGVtcGxhdGVfdG9fYWN0aXZlX2ZpbGUodGVtcGxhdGVfZmlsZTogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09PSBudWxsKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0ZW1wbGF0ZXMuXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJ1bm5pbmdfY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlLFxuICAgICAgICAgICAgYWN0aXZlX3ZpZXcuZmlsZSxcbiAgICAgICAgICAgIFJ1bk1vZGUuQXBwZW5kQWN0aXZlRmlsZVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICApO1xuICAgICAgICAvLyBlcnJvcldyYXBwZXIgZmFpbGVkXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgIGNvbnN0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcbiAgICAgICAgZG9jLnJlcGxhY2VTZWxlY3Rpb24ob3V0cHV0X2NvbnRlbnQpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbihhY3RpdmVfdmlldy5maWxlKTtcbiAgICB9XG5cbiAgICBhc3luYyB3cml0ZV90ZW1wbGF0ZV90b19maWxlKFxuICAgICAgICB0ZW1wbGF0ZV9maWxlOiBURmlsZSxcbiAgICAgICAgZmlsZTogVEZpbGVcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgIHRlbXBsYXRlX2ZpbGUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgUnVuTW9kZS5PdmVyd3JpdGVGaWxlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5yZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShydW5uaW5nX2NvbmZpZyksXG4gICAgICAgICAgICBcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiXG4gICAgICAgICk7XG4gICAgICAgIC8vIGVycm9yV3JhcHBlciBmYWlsZWRcbiAgICAgICAgaWYgKG91dHB1dF9jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgb3V0cHV0X2NvbnRlbnQpO1xuICAgICAgICBhd2FpdCB0aGlzLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oZmlsZSk7XG4gICAgfVxuXG4gICAgb3ZlcndyaXRlX2FjdGl2ZV9maWxlX2NvbW1hbmRzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aXZlIHZpZXcgaXMgbnVsbCwgY2FuJ3Qgb3ZlcndyaXRlIGNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vdmVyd3JpdGVfZmlsZV9jb21tYW5kcyhhY3RpdmVfdmlldy5maWxlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBhc3luYyBvdmVyd3JpdGVfZmlsZV9jb21tYW5kcyhcbiAgICAgICAgZmlsZTogVEZpbGUsXG4gICAgICAgIGFjdGl2ZV9maWxlID0gZmFsc2VcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgYWN0aXZlX2ZpbGUgPyBSdW5Nb2RlLk92ZXJ3cml0ZUFjdGl2ZUZpbGUgOiBSdW5Nb2RlLk92ZXJ3cml0ZUZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0X2NvbnRlbnQgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSxcbiAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZFxuICAgICAgICBpZiAob3V0cHV0X2NvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBvdXRwdXRfY29udGVudCk7XG4gICAgICAgIGF3YWl0IHRoaXMuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbihmaWxlKTtcbiAgICB9XG5cbiAgICBhc3luYyBwcm9jZXNzX2R5bmFtaWNfdGVtcGxhdGVzKFxuICAgICAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgICAgIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBkeW5hbWljX2NvbW1hbmRfcmVnZXggPVxuICAgICAgICAgICAgLyg8JSg/Oi18Xyk/XFxzKlsqfl17MCwxfSlcXCsoKD86LnxcXHMpKj8lPikvZztcblxuICAgICAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3IoZWwsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICAgICAgbGV0IG5vZGU7XG4gICAgICAgIGxldCBwYXNzID0gZmFsc2U7XG4gICAgICAgIGxldCBmdW5jdGlvbnNfb2JqZWN0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICAgICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICAgICAgICBsZXQgY29udGVudCA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IGR5bmFtaWNfY29tbWFuZF9yZWdleC5leGVjKGNvbnRlbnQpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGN0eC5zb3VyY2VQYXRoXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGUgfHwgIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgUnVuTW9kZS5EeW5hbWljUHJvY2Vzc29yXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uc19vYmplY3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yLmdlbmVyYXRlX29iamVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnVuY3Rpb25zTW9kZS5VU0VSX0lOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdCA9IGZ1bmN0aW9uc19vYmplY3Q7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2hpbGUgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IHRoZSBtb3N0IGVmZmljaWVudCB3YXkgdG8gZXhjbHVkZSB0aGUgJysnIGZyb20gdGhlIGNvbW1hbmQgYnV0IEkgY291bGRuJ3QgZmluZCBzb21ldGhpbmcgYmV0dGVyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBsZXRlX2NvbW1hbmQgPSBtYXRjaFsxXSArIG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kX291dHB1dDogc3RyaW5nID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZV9jb21tYW5kcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVfY29tbWFuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zX29iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYENvbW1hbmQgUGFyc2luZyBlcnJvciBpbiBkeW5hbWljIGNvbW1hbmQgJyR7Y29tcGxldGVfY29tbWFuZH0nYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZF9vdXRwdXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGR5bmFtaWNfY29tbWFuZF9yZWdleC5sYXN0SW5kZXggLSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IGR5bmFtaWNfY29tbWFuZF9yZWdleC5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5zdWJzdHJpbmcoMCwgc3RhcnQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRfb3V0cHV0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuc3Vic3RyaW5nKGVuZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY19jb21tYW5kX3JlZ2V4Lmxhc3RJbmRleCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZF9vdXRwdXQubGVuZ3RoIC0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGR5bmFtaWNfY29tbWFuZF9yZWdleC5leGVjKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfbmV3X2ZpbGVfdGVtcGxhdGVfZm9yX2ZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMuZmluZChcbiAgICAgICAgICAgICAgICAoZSkgPT4gZS5mb2xkZXIgPT0gZm9sZGVyLnBhdGhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC50ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaC50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9sZGVyID0gZm9sZGVyLnBhcmVudDtcbiAgICAgICAgfSB3aGlsZSAoZm9sZGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgb25fZmlsZV9jcmVhdGlvbihcbiAgICAgICAgdGVtcGxhdGVyOiBUZW1wbGF0ZXIsXG4gICAgICAgIGZpbGU6IFRBYnN0cmFjdEZpbGVcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB8fCBmaWxlLmV4dGVuc2lvbiAhPT0gXCJtZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdm9pZHMgdGVtcGxhdGUgcmVwbGFjZW1lbnQgd2hlbiBzeW5jaW5nIHRlbXBsYXRlIGZpbGVzXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlX2ZvbGRlciA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICB0ZW1wbGF0ZXIucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGZpbGUucGF0aC5pbmNsdWRlcyh0ZW1wbGF0ZV9mb2xkZXIpICYmIHRlbXBsYXRlX2ZvbGRlciAhPT0gXCIvXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgLy8gQ3VycmVudGx5LCBJIGhhdmUgdG8gd2FpdCBmb3IgdGhlIGRhaWx5IG5vdGUgcGx1Z2luIHRvIGFkZCB0aGUgZmlsZSBjb250ZW50IGJlZm9yZSByZXBsYWNpbmdcbiAgICAgICAgLy8gTm90IGEgcHJvYmxlbSB3aXRoIENhbGVuZGFyIGhvd2V2ZXIgc2luY2UgaXQgY3JlYXRlcyB0aGUgZmlsZSB3aXRoIHRoZSBleGlzdGluZyBjb250ZW50XG4gICAgICAgIGF3YWl0IGRlbGF5KDMwMCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZmlsZS5zdGF0LnNpemUgPT0gMCAmJlxuICAgICAgICAgICAgdGVtcGxhdGVyLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfZm9sZGVyX3RlbXBsYXRlc1xuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlcl90ZW1wbGF0ZV9tYXRjaCA9XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVyLmdldF9uZXdfZmlsZV90ZW1wbGF0ZV9mb3JfZm9sZGVyKGZpbGUucGFyZW50KTtcbiAgICAgICAgICAgIGlmICghZm9sZGVyX3RlbXBsYXRlX21hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZV9maWxlOiBURmlsZSA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICBhc3luYyAoKTogUHJvbWlzZTxURmlsZT4gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZV90ZmlsZSh0ZW1wbGF0ZXIuYXBwLCBmb2xkZXJfdGVtcGxhdGVfbWF0Y2gpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYENvdWxkbid0IGZpbmQgdGVtcGxhdGUgJHtmb2xkZXJfdGVtcGxhdGVfbWF0Y2h9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIGVycm9yV3JhcHBlciBmYWlsZWRcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZV9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCB0ZW1wbGF0ZXIud3JpdGVfdGVtcGxhdGVfdG9fZmlsZSh0ZW1wbGF0ZV9maWxlLCBmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRlbXBsYXRlci5vdmVyd3JpdGVfZmlsZV9jb21tYW5kcyhmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGVfc3RhcnR1cF9zY3JpcHRzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzKSB7XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZXJyb3JXcmFwcGVyU3luYyhcbiAgICAgICAgICAgICAgICAoKSA9PiByZXNvbHZlX3RmaWxlKHRoaXMuYXBwLCB0ZW1wbGF0ZSksXG4gICAgICAgICAgICAgICAgYENvdWxkbid0IGZpbmQgc3RhcnR1cCB0ZW1wbGF0ZSBcIiR7dGVtcGxhdGV9XCJgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICBSdW5Nb2RlLlN0YXJ0dXBUZW1wbGF0ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSxcbiAgICAgICAgICAgICAgICBgU3RhcnR1cCBUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiU2V0dGluZ3NcIjtcbmltcG9ydCB7XG4gICAgQXBwLFxuICAgIEV2ZW50UmVmLFxuICAgIE1lbnUsXG4gICAgTWVudUl0ZW0sXG4gICAgVEFic3RyYWN0RmlsZSxcbiAgICBURmlsZSxcbiAgICBURm9sZGVyLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRIYW5kbGVyIHtcbiAgICBwcml2YXRlIHN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQ6IEV2ZW50UmVmO1xuICAgIHByaXZhdGUgdHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50OiBFdmVudFJlZjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGFwcDogQXBwLFxuICAgICAgICBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luLFxuICAgICAgICBwcml2YXRlIHRlbXBsYXRlcjogVGVtcGxhdGVyLFxuICAgICAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1xuICAgICkge31cblxuICAgIHNldHVwKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZV90cmlnZ2VyX2ZpbGVfb25fY3JlYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTtcbiAgICAgICAgdGhpcy51cGRhdGVfZmlsZV9tZW51KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW50YXhfaGlnaGxpZ2h0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQgPSB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXG4gICAgICAgICAgICAgICAgXCJjb2RlbWlycm9yXCIsXG4gICAgICAgICAgICAgICAgKGNtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNtLnNldE9wdGlvbihcIm1vZGVcIiwgXCJ0ZW1wbGF0ZXJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwibW9kZVwiLCBcInRlbXBsYXRlclwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFdmVudCh0aGlzLnN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0Lm9mZnJlZih0aGlzLnN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJtb2RlXCIsIFwiaHlwZXJtZFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCA9IHRoaXMuYXBwLnZhdWx0Lm9uKFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlXCIsXG4gICAgICAgICAgICAgICAgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+XG4gICAgICAgICAgICAgICAgICAgIFRlbXBsYXRlci5vbl9maWxlX2NyZWF0aW9uKHRoaXMudGVtcGxhdGVyLCBmaWxlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRXZlbnQodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAudmF1bHQub2ZmcmVmKHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZV9maWxlX21lbnUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRXZlbnQoXG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJmaWxlLW1lbnVcIiwgKG1lbnU6IE1lbnUsIGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbTogTWVudUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoXCJDcmVhdGUgbmV3IG5vdGUgZnJvbSB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwidGVtcGxhdGVyLWljb25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmZ1enp5X3N1Z2dlc3Rlci5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgcmVzb2x2ZV90ZmlsZSB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyU3luYyB9IGZyb20gXCJFcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgQ29tbWFuZEhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHt9XG5cbiAgICBzZXR1cCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJpbnNlcnQtdGVtcGxhdGVyXCIsXG4gICAgICAgICAgICBuYW1lOiBcIk9wZW4gSW5zZXJ0IFRlbXBsYXRlIG1vZGFsXCIsXG4gICAgICAgICAgICBob3RrZXlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcImVcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmluc2VydF90ZW1wbGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJyZXBsYWNlLWluLWZpbGUtdGVtcGxhdGVyXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlJlcGxhY2UgdGVtcGxhdGVzIGluIHRoZSBhY3RpdmUgZmlsZVwiLFxuICAgICAgICAgICAgaG90a2V5czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5vdmVyd3JpdGVfYWN0aXZlX2ZpbGVfY29tbWFuZHMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwianVtcC10by1uZXh0LWN1cnNvci1sb2NhdGlvblwiLFxuICAgICAgICAgICAgbmFtZTogXCJKdW1wIHRvIG5leHQgY3Vyc29yIGxvY2F0aW9uXCIsXG4gICAgICAgICAgICBob3RrZXlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcIlRhYlwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiY3JlYXRlLW5ldy1ub3RlLWZyb20tdGVtcGxhdGVcIixcbiAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlIG5ldyBub3RlIGZyb20gdGVtcGxhdGVcIixcbiAgICAgICAgICAgIGhvdGtleXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiblwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5mdXp6eV9zdWdnZXN0ZXIuY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJfdGVtcGxhdGVzX2hvdGtleXMoKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlcl90ZW1wbGF0ZXNfaG90a2V5cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5mb3JFYWNoKCh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRfdGVtcGxhdGVfaG90a2V5KG51bGwsIHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RlbXBsYXRlX2hvdGtleShvbGRfdGVtcGxhdGU6IHN0cmluZywgbmV3X3RlbXBsYXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVfdGVtcGxhdGVfaG90a2V5KG9sZF90ZW1wbGF0ZSk7XG5cbiAgICAgICAgaWYgKG5ld190ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICAgICAgaWQ6IG5ld190ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICBuYW1lOiBgSW5zZXJ0ICR7bmV3X3RlbXBsYXRlfWAsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gcmVzb2x2ZV90ZmlsZSh0aGlzLmFwcCwgbmV3X3RlbXBsYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBDb3VsZG4ndCBmaW5kIHRoZSB0ZW1wbGF0ZSBmaWxlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGhvdGtleWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5hcHBlbmRfdGVtcGxhdGVfdG9fYWN0aXZlX2ZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZV90ZW1wbGF0ZV9ob3RrZXkodGVtcGxhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IEZpbmQgb2ZmaWNpYWwgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRoaXMuYXBwLmNvbW1hbmRzLnJlbW92ZUNvbW1hbmQoXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5wbHVnaW4ubWFuaWZlc3QuaWR9OiR7dGVtcGxhdGV9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGFkZEljb24sIFBsdWdpbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBTZXR0aW5ncywgVGVtcGxhdGVyU2V0dGluZ1RhYiB9IGZyb20gXCJTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRnV6enlTdWdnZXN0ZXIgfSBmcm9tIFwiRnV6enlTdWdnZXN0ZXJcIjtcbmltcG9ydCB7IElDT05fREFUQSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IFRlbXBsYXRlciB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIkV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiQ29tbWFuZEhhbmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgICBwdWJsaWMgc2V0dGluZ3M6IFNldHRpbmdzO1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXI6IFRlbXBsYXRlcjtcbiAgICBwdWJsaWMgZXZlbnRfaGFuZGxlcjogRXZlbnRIYW5kbGVyO1xuICAgIHB1YmxpYyBjb21tYW5kX2hhbmRsZXI6IENvbW1hbmRIYW5kbGVyO1xuICAgIHB1YmxpYyBmdXp6eV9zdWdnZXN0ZXI6IEZ1enp5U3VnZ2VzdGVyO1xuXG4gICAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRfc2V0dGluZ3MoKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlciA9IG5ldyBUZW1wbGF0ZXIodGhpcy5hcHAsIHRoaXMpO1xuICAgICAgICBhd2FpdCB0aGlzLnRlbXBsYXRlci5zZXR1cCgpO1xuXG4gICAgICAgIHRoaXMuZnV6enlfc3VnZ2VzdGVyID0gbmV3IEZ1enp5U3VnZ2VzdGVyKHRoaXMuYXBwLCB0aGlzKTtcblxuICAgICAgICB0aGlzLmV2ZW50X2hhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKFxuICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXIsXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZXZlbnRfaGFuZGxlci5zZXR1cCgpO1xuXG4gICAgICAgIHRoaXMuY29tbWFuZF9oYW5kbGVyID0gbmV3IENvbW1hbmRIYW5kbGVyKHRoaXMuYXBwLCB0aGlzKTtcbiAgICAgICAgdGhpcy5jb21tYW5kX2hhbmRsZXIuc2V0dXAoKTtcblxuICAgICAgICBhZGRJY29uKFwidGVtcGxhdGVyLWljb25cIiwgSUNPTl9EQVRBKTtcbiAgICAgICAgdGhpcy5hZGRSaWJib25JY29uKFwidGVtcGxhdGVyLWljb25cIiwgXCJUZW1wbGF0ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdXp6eV9zdWdnZXN0ZXIuaW5zZXJ0X3RlbXBsYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVGVtcGxhdGVyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgICAgIC8vIEZpbGVzIG1pZ2h0IG5vdCBiZSBjcmVhdGVkIHlldFxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlci5leGVjdXRlX3N0YXJ0dXBfc2NyaXB0cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlX3NldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRfc2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YSgpXG4gICAgICAgICk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIk5vdGljZSIsImVmZmVjdCIsIm1pbiIsIm1heCIsIm1hdGhNYXgiLCJtYXRoTWluIiwiaGFzaCIsImFsbFBsYWNlbWVudHMiLCJwbGFjZW1lbnRzIiwicG9wcGVyT2Zmc2V0cyIsImNvbXB1dGVTdHlsZXMiLCJhcHBseVN0eWxlcyIsIm9mZnNldCIsImZsaXAiLCJwcmV2ZW50T3ZlcmZsb3ciLCJhcnJvdyIsImhpZGUiLCJTY29wZSIsIlRGb2xkZXIiLCJub3JtYWxpemVQYXRoIiwiVEZpbGUiLCJWYXVsdCIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiRnV6enlTdWdnZXN0TW9kYWwiLCJNYXJrZG93blZpZXciLCJwYXJzZUxpbmt0ZXh0IiwicmVzb2x2ZVN1YnBhdGgiLCJQbGF0Zm9ybSIsIkZpbGVTeXN0ZW1BZGFwdGVyIiwiZ2V0QWxsVGFncyIsIk1vZGFsIiwicHJvbWlzaWZ5IiwiZXhlYyIsIm9ic2lkaWFuX21vZHVsZSIsInBhdGgiLCJleGlzdHNTeW5jIiwicmVhZEZpbGVTeW5jIiwiRXRhLnJlbmRlckFzeW5jIiwiUGx1Z2luIiwiYWRkSWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1A7O1NDbkVnQixTQUFTLENBQUMsQ0FBeUI7SUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSUEsc0JBQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsSUFBSSxDQUFDLFlBQVksY0FBYyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUU7OztRQUc5QyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDLE9BQU8sMENBQTBDLENBQUM7UUFDL0csT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDckU7U0FBTTs7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFFO0FBQ0w7O01DbkJhLGNBQWUsU0FBUSxLQUFLO0lBQ3JDLFlBQVksR0FBVyxFQUFTLFdBQW9CO1FBQ2hELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQURpQixnQkFBVyxHQUFYLFdBQVcsQ0FBUztRQUVoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25EO0NBQ0o7U0FFcUIsWUFBWSxDQUM5QixFQUFvQixFQUNwQixHQUFXOztRQUVYLElBQUk7WUFDQSxPQUFPLE1BQU0sRUFBRSxFQUFFLENBQUM7U0FDckI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLFlBQVksY0FBYyxDQUFDLEVBQUU7Z0JBQ2hDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDakQ7aUJBQU07Z0JBQ0gsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0NBQUE7U0FFZSxnQkFBZ0IsQ0FBSSxFQUFXLEVBQUUsR0FBVztJQUN4RCxJQUFJO1FBQ0EsT0FBTyxFQUFFLEVBQUUsQ0FBQztLQUNmO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixTQUFTLENBQUMsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7QUFDTDs7QUNqQ08sSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN0QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDcEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNsQixJQUFJLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNwQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDaEIsSUFBSSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDeEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQzFCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN0QixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDNUIsSUFBSSxtQkFBbUIsZ0JBQWdCLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQzlGLEVBQUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNBLElBQUksVUFBVSxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDeEcsRUFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNQO0FBQ08sSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQzlCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNsQixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDbkM7QUFDTyxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFDOUIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQztBQUNuQztBQUNPLElBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQztBQUNoQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDcEIsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQzlCLElBQUksY0FBYyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUM7O0FDOUJ2RyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUU7QUFDN0MsRUFBRSxPQUFPLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNqRTs7QUNGZSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDeEMsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDcEIsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLGlCQUFpQixFQUFFO0FBQzdDLElBQUksSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUMzQyxJQUFJLE9BQU8sYUFBYSxHQUFHLGFBQWEsQ0FBQyxXQUFXLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN4RSxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2Q7O0FDVEEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3pCLEVBQUUsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQyxFQUFFLE9BQU8sSUFBSSxZQUFZLFVBQVUsSUFBSSxJQUFJLFlBQVksT0FBTyxDQUFDO0FBQy9ELENBQUM7QUFDRDtBQUNBLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUM3QixFQUFFLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDL0MsRUFBRSxPQUFPLElBQUksWUFBWSxVQUFVLElBQUksSUFBSSxZQUFZLFdBQVcsQ0FBQztBQUNuRSxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDNUI7QUFDQSxFQUFFLElBQUksT0FBTyxVQUFVLEtBQUssV0FBVyxFQUFFO0FBQ3pDLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQzlDLEVBQUUsT0FBTyxJQUFJLFlBQVksVUFBVSxJQUFJLElBQUksWUFBWSxVQUFVLENBQUM7QUFDbEU7O0FDbEJBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ3RELElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDekMsSUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsRCxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkM7QUFDQSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDMUQsTUFBTSxPQUFPO0FBQ2IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNwRCxNQUFNLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQztBQUNBLE1BQU0sSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO0FBQzNCLFFBQVEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxPQUFPLE1BQU07QUFDYixRQUFRLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNEO0FBQ0EsU0FBU0MsUUFBTSxDQUFDLEtBQUssRUFBRTtBQUN2QixFQUFFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDMUIsRUFBRSxJQUFJLGFBQWEsR0FBRztBQUN0QixJQUFJLE1BQU0sRUFBRTtBQUNaLE1BQU0sUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUTtBQUN0QyxNQUFNLElBQUksRUFBRSxHQUFHO0FBQ2YsTUFBTSxHQUFHLEVBQUUsR0FBRztBQUNkLE1BQU0sTUFBTSxFQUFFLEdBQUc7QUFDakIsS0FBSztBQUNMLElBQUksS0FBSyxFQUFFO0FBQ1gsTUFBTSxRQUFRLEVBQUUsVUFBVTtBQUMxQixLQUFLO0FBQ0wsSUFBSSxTQUFTLEVBQUUsRUFBRTtBQUNqQixHQUFHLENBQUM7QUFDSixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO0FBQy9CO0FBQ0EsRUFBRSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQzVCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxZQUFZO0FBQ3JCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ3hELE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxNQUFNLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BELE1BQU0sSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RIO0FBQ0EsTUFBTSxJQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNwRSxRQUFRLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDN0IsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDYjtBQUNBLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUM1RCxRQUFRLE9BQU87QUFDZixPQUFPO0FBQ1A7QUFDQSxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFFO0FBQzNELFFBQVEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxPQUFPLENBQUMsQ0FBQztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQSxvQkFBZTtBQUNmLEVBQUUsSUFBSSxFQUFFLGFBQWE7QUFDckIsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNmLEVBQUUsS0FBSyxFQUFFLE9BQU87QUFDaEIsRUFBRSxFQUFFLEVBQUUsV0FBVztBQUNqQixFQUFFLE1BQU0sRUFBRUEsUUFBTTtBQUNoQixFQUFFLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQztBQUM3QixDQUFDOztBQ2xGYyxTQUFTLGdCQUFnQixDQUFDLFNBQVMsRUFBRTtBQUNwRCxFQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQzs7QUNIQTtBQUNlLFNBQVMscUJBQXFCLENBQUMsT0FBTztBQUNyRCxZQUFZLEVBQUU7QUFJZDtBQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0MsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDakIsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTztBQUNULElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTTtBQUM5QixJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDaEMsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNO0FBQzFCLElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTTtBQUM5QixJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07QUFDaEMsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNO0FBQzVCLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTTtBQUN6QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU07QUFDeEIsR0FBRyxDQUFDO0FBQ0o7O0FDcENBO0FBQ0E7QUFDZSxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUU7QUFDL0MsRUFBRSxJQUFJLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRDtBQUNBO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ2xDLEVBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUNwQztBQUNBLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQy9DLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDN0IsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDakQsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUMvQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVCxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsVUFBVTtBQUN6QixJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUztBQUN4QixJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksTUFBTSxFQUFFLE1BQU07QUFDbEIsR0FBRyxDQUFDO0FBQ0o7O0FDdkJlLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDaEQsRUFBRSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMxRDtBQUNBLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzlCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILE9BQU8sSUFBSSxRQUFRLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9DLE1BQU0sSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCO0FBQ0EsTUFBTSxHQUFHO0FBQ1QsUUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzdDLFVBQVUsT0FBTyxJQUFJLENBQUM7QUFDdEIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDNUMsT0FBTyxRQUFRLElBQUksRUFBRTtBQUNyQixLQUFLO0FBQ0w7QUFDQTtBQUNBLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDZjs7QUNyQmUsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7QUFDbEQsRUFBRSxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0RDs7QUNGZSxTQUFTLGNBQWMsQ0FBQyxPQUFPLEVBQUU7QUFDaEQsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xFOztBQ0ZlLFNBQVMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO0FBQ3BEO0FBQ0EsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLGFBQWE7QUFDckQsRUFBRSxPQUFPLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDO0FBQ3hEOztBQ0ZlLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRTtBQUMvQyxFQUFFLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUN2QyxJQUFJLE9BQU8sT0FBTyxDQUFDO0FBQ25CLEdBQUc7QUFDSDtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsSUFBSSxPQUFPLENBQUMsWUFBWTtBQUN4QixJQUFJLE9BQU8sQ0FBQyxVQUFVO0FBQ3RCLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hEO0FBQ0EsSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7QUFDL0I7QUFDQSxJQUFJO0FBQ0o7O0FDWEEsU0FBUyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7QUFDdEMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztBQUM3QixFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDbEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQztBQUM5QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7QUFDckMsRUFBRSxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5RSxFQUFFLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNEO0FBQ0EsRUFBRSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDdEM7QUFDQSxJQUFJLElBQUksVUFBVSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsSUFBSSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO0FBQ3pDLE1BQU0sT0FBTyxJQUFJLENBQUM7QUFDbEIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDO0FBQ0EsRUFBRSxPQUFPLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQy9GLElBQUksSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssUUFBUSxJQUFJLFNBQVMsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzFQLE1BQU0sT0FBTyxXQUFXLENBQUM7QUFDekIsS0FBSyxNQUFNO0FBQ1gsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztBQUMzQyxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDZSxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUU7QUFDakQsRUFBRSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsRUFBRSxJQUFJLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRDtBQUNBLEVBQUUsT0FBTyxZQUFZLElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFDL0csSUFBSSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLFlBQVksS0FBSyxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssTUFBTSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxNQUFNLElBQUksZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxFQUFFO0FBQzlKLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDL0Q7O0FDL0RlLFNBQVMsd0JBQXdCLENBQUMsU0FBUyxFQUFFO0FBQzVELEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDL0Q7O0FDRk8sSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLOztBQ0RkLFNBQVMsTUFBTSxDQUFDQyxLQUFHLEVBQUUsS0FBSyxFQUFFQyxLQUFHLEVBQUU7QUFDaEQsRUFBRSxPQUFPQyxHQUFPLENBQUNGLEtBQUcsRUFBRUcsR0FBTyxDQUFDLEtBQUssRUFBRUYsS0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzQzs7QUNIZSxTQUFTLGtCQUFrQixHQUFHO0FBQzdDLEVBQUUsT0FBTztBQUNULElBQUksR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxHQUFHLENBQUM7QUFDSjs7QUNOZSxTQUFTLGtCQUFrQixDQUFDLGFBQWEsRUFBRTtBQUMxRCxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNoRTs7QUNIZSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3JELEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFLEdBQUcsRUFBRTtBQUM3QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDekIsSUFBSSxPQUFPLE9BQU8sQ0FBQztBQUNuQixHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVDs7QUNNQSxJQUFJLGVBQWUsR0FBRyxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQy9ELEVBQUUsT0FBTyxHQUFHLE9BQU8sT0FBTyxLQUFLLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNuRixJQUFJLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztBQUM5QixHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNoQixFQUFFLE9BQU8sa0JBQWtCLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDOUcsQ0FBQyxDQUFDO0FBQ0Y7QUFDQSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDckIsRUFBRSxJQUFJLHFCQUFxQixDQUFDO0FBQzVCO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztBQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTtBQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLEVBQUUsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDMUMsRUFBRSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztBQUN4RCxFQUFFLElBQUksYUFBYSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN4RCxFQUFFLElBQUksSUFBSSxHQUFHLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3RCxFQUFFLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQzVDO0FBQ0EsRUFBRSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3ZDLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxhQUFhLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUQsRUFBRSxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDMUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDOUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekgsRUFBRSxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEUsRUFBRSxJQUFJLGlCQUFpQixHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RCxFQUFFLElBQUksVUFBVSxHQUFHLGlCQUFpQixHQUFHLElBQUksS0FBSyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxJQUFJLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuSSxFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3REO0FBQ0E7QUFDQSxFQUFFLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQyxFQUFFLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLEVBQUUsSUFBSSxNQUFNLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO0FBQ3ZFLEVBQUUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEM7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN0QixFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLEdBQUcsRUFBRSxFQUFFLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxZQUFZLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2xMLENBQUM7QUFDRDtBQUNBLFNBQVNGLFFBQU0sQ0FBQyxLQUFLLEVBQUU7QUFDdkIsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSztBQUN6QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzlCLEVBQUUsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTztBQUN4QyxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsS0FBSyxLQUFLLENBQUMsR0FBRyxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQztBQUM1RjtBQUNBLEVBQUUsSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO0FBQzVCLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUN4QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckU7QUFDQSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDdkIsTUFBTSxPQUFPO0FBQ2IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUU7QUFDN0MsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3RDLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFFQUFxRSxFQUFFLHFFQUFxRSxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVMLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLEVBQUU7QUFDdEQsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRTtBQUMvQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxxRUFBcUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuSCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU87QUFDWCxHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztBQUN0QyxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGNBQWU7QUFDZixFQUFFLElBQUksRUFBRSxPQUFPO0FBQ2YsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNmLEVBQUUsS0FBSyxFQUFFLE1BQU07QUFDZixFQUFFLEVBQUUsRUFBRSxLQUFLO0FBQ1gsRUFBRSxNQUFNLEVBQUVBLFFBQU07QUFDaEIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDN0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0FBQ3ZDLENBQUM7O0FDcEdjLFNBQVMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUNoRCxFQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQzs7QUNPQSxJQUFJLFVBQVUsR0FBRztBQUNqQixFQUFFLEdBQUcsRUFBRSxNQUFNO0FBQ2IsRUFBRSxLQUFLLEVBQUUsTUFBTTtBQUNmLEVBQUUsTUFBTSxFQUFFLE1BQU07QUFDaEIsRUFBRSxJQUFJLEVBQUUsTUFBTTtBQUNkLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO0FBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDaEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixFQUFFLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUNuQixFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUM7QUFDdEMsRUFBRSxPQUFPO0FBQ1QsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUN2QyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUNuQyxFQUFFLElBQUksZUFBZSxDQUFDO0FBQ3RCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTTtBQUMzQixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVTtBQUNuQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUztBQUNqQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUztBQUNqQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTztBQUM3QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUTtBQUMvQixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZTtBQUM3QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUTtBQUMvQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQ3hDO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxZQUFZLEtBQUssSUFBSSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sWUFBWSxLQUFLLFVBQVUsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTztBQUN2SSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN2QixNQUFNLENBQUMsR0FBRyxPQUFPLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU87QUFDMUMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDdkIsTUFBTSxDQUFDLEdBQUcsT0FBTyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDM0M7QUFDQSxFQUFFLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25CLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDO0FBQ25CO0FBQ0EsRUFBRSxJQUFJLFFBQVEsRUFBRTtBQUNoQixJQUFJLElBQUksWUFBWSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQztBQUNwQyxJQUFJLElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUNsQztBQUNBLElBQUksSUFBSSxZQUFZLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVDLE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsTUFBTSxJQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUMzRixRQUFRLFVBQVUsR0FBRyxjQUFjLENBQUM7QUFDcEMsUUFBUSxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQ2xDLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQztBQUNoQztBQUNBLElBQUksSUFBSSxTQUFTLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxTQUFTLEtBQUssS0FBSyxLQUFLLFNBQVMsS0FBSyxHQUFHLEVBQUU7QUFDL0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ3JCO0FBQ0EsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDeEQsTUFBTSxDQUFDLElBQUksZUFBZSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksU0FBUyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLElBQUksU0FBUyxLQUFLLE1BQU0sS0FBSyxTQUFTLEtBQUssR0FBRyxFQUFFO0FBQ2hHLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNwQjtBQUNBLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0FBQ3RELE1BQU0sQ0FBQyxJQUFJLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuQyxJQUFJLFFBQVEsRUFBRSxRQUFRO0FBQ3RCLEdBQUcsRUFBRSxRQUFRLElBQUksVUFBVSxDQUFDLENBQUM7QUFDN0I7QUFDQSxFQUFFLElBQUksZUFBZSxFQUFFO0FBQ3ZCLElBQUksSUFBSSxjQUFjLENBQUM7QUFDdkI7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxHQUFHLGNBQWMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDO0FBQ3RULEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxZQUFZLEdBQUcsZUFBZSxHQUFHLEVBQUUsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLENBQUM7QUFDaE4sQ0FBQztBQUNEO0FBQ0EsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUs7QUFDekIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUM5QixFQUFFLElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLGVBQWU7QUFDckQsTUFBTSxlQUFlLEdBQUcscUJBQXFCLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLHFCQUFxQjtBQUN2RixNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxRQUFRO0FBQzFDLE1BQU0sUUFBUSxHQUFHLGlCQUFpQixLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxpQkFBaUI7QUFDeEUsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsWUFBWTtBQUNsRCxNQUFNLFlBQVksR0FBRyxxQkFBcUIsS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcscUJBQXFCLENBQUM7QUFDckY7QUFDQSxFQUFFLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQzdDLElBQUksSUFBSSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztBQUM5RjtBQUNBLElBQUksSUFBSSxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQzdGLE1BQU0sT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZELEtBQUssQ0FBQyxFQUFFO0FBQ1IsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsbUVBQW1FLEVBQUUsZ0VBQWdFLEVBQUUsTUFBTSxFQUFFLG9FQUFvRSxFQUFFLGlFQUFpRSxFQUFFLG9FQUFvRSxFQUFFLDBDQUEwQyxFQUFFLE1BQU0sRUFBRSxvRUFBb0UsRUFBRSxxRUFBcUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlqQixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLFlBQVksR0FBRztBQUNyQixJQUFJLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ2hELElBQUksU0FBUyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQzVDLElBQUksTUFBTSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTTtBQUNqQyxJQUFJLFVBQVUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDbEMsSUFBSSxlQUFlLEVBQUUsZUFBZTtBQUNwQyxHQUFHLENBQUM7QUFDSjtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsSUFBSSxJQUFJLEVBQUU7QUFDakQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFO0FBQzdHLE1BQU0sT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYTtBQUNoRCxNQUFNLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVE7QUFDdEMsTUFBTSxRQUFRLEVBQUUsUUFBUTtBQUN4QixNQUFNLFlBQVksRUFBRSxZQUFZO0FBQ2hDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNULEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDekMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFO0FBQzNHLE1BQU0sT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSztBQUN4QyxNQUFNLFFBQVEsRUFBRSxVQUFVO0FBQzFCLE1BQU0sUUFBUSxFQUFFLEtBQUs7QUFDckIsTUFBTSxZQUFZLEVBQUUsWUFBWTtBQUNoQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVCxHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ3ZFLElBQUksdUJBQXVCLEVBQUUsS0FBSyxDQUFDLFNBQVM7QUFDNUMsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLHNCQUFlO0FBQ2YsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUN2QixFQUFFLE9BQU8sRUFBRSxJQUFJO0FBQ2YsRUFBRSxLQUFLLEVBQUUsYUFBYTtBQUN0QixFQUFFLEVBQUUsRUFBRSxhQUFhO0FBQ25CLEVBQUUsSUFBSSxFQUFFLEVBQUU7QUFDVixDQUFDOztBQzNKRCxJQUFJLE9BQU8sR0FBRztBQUNkLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDZixDQUFDLENBQUM7QUFDRjtBQUNBLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUN0QixFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO0FBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO0FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsRUFBRSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTTtBQUN0QyxNQUFNLE1BQU0sR0FBRyxlQUFlLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGVBQWU7QUFDbEUsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU07QUFDdEMsTUFBTSxNQUFNLEdBQUcsZUFBZSxLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxlQUFlLENBQUM7QUFDbkUsRUFBRSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxFQUFFLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzRjtBQUNBLEVBQUUsSUFBSSxNQUFNLEVBQUU7QUFDZCxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxZQUFZLEVBQUU7QUFDbEQsTUFBTSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEUsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksTUFBTSxFQUFFO0FBQ2QsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEUsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLFlBQVk7QUFDckIsSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUNoQixNQUFNLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxZQUFZLEVBQUU7QUFDcEQsUUFBUSxZQUFZLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0UsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxFQUFFO0FBQ2hCLE1BQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JFLEtBQUs7QUFDTCxHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0Q7QUFDQTtBQUNBLHFCQUFlO0FBQ2YsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCO0FBQ3hCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDZixFQUFFLEtBQUssRUFBRSxPQUFPO0FBQ2hCLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7QUFDdEIsRUFBRSxNQUFNLEVBQUUsTUFBTTtBQUNoQixFQUFFLElBQUksRUFBRSxFQUFFO0FBQ1YsQ0FBQzs7QUNoREQsSUFBSUssTUFBSSxHQUFHO0FBQ1gsRUFBRSxJQUFJLEVBQUUsT0FBTztBQUNmLEVBQUUsS0FBSyxFQUFFLE1BQU07QUFDZixFQUFFLE1BQU0sRUFBRSxLQUFLO0FBQ2YsRUFBRSxHQUFHLEVBQUUsUUFBUTtBQUNmLENBQUMsQ0FBQztBQUNhLFNBQVMsb0JBQW9CLENBQUMsU0FBUyxFQUFFO0FBQ3hELEVBQUUsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQVUsT0FBTyxFQUFFO0FBQ3hFLElBQUksT0FBT0EsTUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7O0FDVkEsSUFBSSxJQUFJLEdBQUc7QUFDWCxFQUFFLEtBQUssRUFBRSxLQUFLO0FBQ2QsRUFBRSxHQUFHLEVBQUUsT0FBTztBQUNkLENBQUMsQ0FBQztBQUNhLFNBQVMsNkJBQTZCLENBQUMsU0FBUyxFQUFFO0FBQ2pFLEVBQUUsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUM1RCxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7O0FDUGUsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQzlDLEVBQUUsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLEVBQUUsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztBQUNuQyxFQUFFLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDbEMsRUFBRSxPQUFPO0FBQ1QsSUFBSSxVQUFVLEVBQUUsVUFBVTtBQUMxQixJQUFJLFNBQVMsRUFBRSxTQUFTO0FBQ3hCLEdBQUcsQ0FBQztBQUNKOztBQ05lLFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFFO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDdkc7O0FDVGUsU0FBUyxlQUFlLENBQUMsT0FBTyxFQUFFO0FBQ2pELEVBQUUsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLEVBQUUsSUFBSSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsRUFBRSxJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQzFDLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUMvQixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksY0FBYyxFQUFFO0FBQ3RCLElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7QUFDakMsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNyRSxNQUFNLENBQUMsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDbkMsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTztBQUNULElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsSUFBSSxNQUFNLEVBQUUsTUFBTTtBQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDUixHQUFHLENBQUM7QUFDSjs7QUNsQ0E7QUFDQTtBQUNlLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRTtBQUNqRCxFQUFFLElBQUkscUJBQXFCLENBQUM7QUFDNUI7QUFDQSxFQUFFLElBQUksSUFBSSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pDLEVBQUUsSUFBSSxTQUFTLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7QUFDM0csRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoSCxFQUFFLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JILEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9ELEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0FBQy9CO0FBQ0EsRUFBRSxJQUFJLGdCQUFnQixDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO0FBQzFELElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwRSxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVCxJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksTUFBTSxFQUFFLE1BQU07QUFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNSLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDUixHQUFHLENBQUM7QUFDSjs7QUMzQmUsU0FBUyxjQUFjLENBQUMsT0FBTyxFQUFFO0FBQ2hEO0FBQ0EsRUFBRSxJQUFJLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztBQUNuRCxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRO0FBQzNDLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLFNBQVM7QUFDN0MsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO0FBQzlDO0FBQ0EsRUFBRSxPQUFPLDRCQUE0QixDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzdFOztBQ0xlLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUM5QyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckU7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7QUFDbkMsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzlDOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsU0FBUyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3pELEVBQUUsSUFBSSxxQkFBcUIsQ0FBQztBQUM1QjtBQUNBLEVBQUUsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDdkIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsRUFBRSxJQUFJLE1BQU0sR0FBRyxZQUFZLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMsYUFBYSxLQUFLLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoSSxFQUFFLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxFQUFFLElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLEVBQUUsRUFBRSxjQUFjLENBQUMsWUFBWSxDQUFDLEdBQUcsWUFBWSxHQUFHLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQztBQUNoSSxFQUFFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEMsRUFBRSxPQUFPLE1BQU0sR0FBRyxXQUFXO0FBQzdCLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9EOztBQ3pCZSxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRTtBQUMvQyxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hCLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2YsSUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSztBQUM5QixJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNO0FBQ2hDLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7O0FDUUEsU0FBUywwQkFBMEIsQ0FBQyxPQUFPLEVBQUU7QUFDN0MsRUFBRSxJQUFJLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzFDLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDN0MsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUNoRCxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQy9DLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ25DLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JCLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3BCLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7QUFDN0QsRUFBRSxPQUFPLGNBQWMsS0FBSyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaE8sQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7QUFDckMsRUFBRSxJQUFJLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNsRSxFQUFFLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRyxFQUFFLElBQUksY0FBYyxHQUFHLGlCQUFpQixJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3hHO0FBQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQ2xDLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsT0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFO0FBQzFELElBQUksT0FBTyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksUUFBUSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsSUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQzNILEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNlLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFO0FBQ3pFLEVBQUUsSUFBSSxtQkFBbUIsR0FBRyxRQUFRLEtBQUssaUJBQWlCLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvRyxFQUFFLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLEVBQUUsSUFBSSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsRUFBRSxJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFLGNBQWMsRUFBRTtBQUMvRSxJQUFJLElBQUksSUFBSSxHQUFHLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNuRSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELElBQUksT0FBTyxPQUFPLENBQUM7QUFDbkIsR0FBRyxFQUFFLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7QUFDL0QsRUFBRSxZQUFZLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztBQUM5RCxFQUFFLFlBQVksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDO0FBQy9ELEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0FBQ3JDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDO0FBQ3BDLEVBQUUsT0FBTyxZQUFZLENBQUM7QUFDdEI7O0FDakVlLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUM3QyxFQUFFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTO0FBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPO0FBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDakMsRUFBRSxJQUFJLGFBQWEsR0FBRyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3JFLEVBQUUsSUFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDN0QsRUFBRSxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3RFLEVBQUUsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4RSxFQUFFLElBQUksT0FBTyxDQUFDO0FBQ2Q7QUFDQSxFQUFFLFFBQVEsYUFBYTtBQUN2QixJQUFJLEtBQUssR0FBRztBQUNaLE1BQU0sT0FBTyxHQUFHO0FBQ2hCLFFBQVEsQ0FBQyxFQUFFLE9BQU87QUFDbEIsUUFBUSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTTtBQUN2QyxPQUFPLENBQUM7QUFDUixNQUFNLE1BQU07QUFDWjtBQUNBLElBQUksS0FBSyxNQUFNO0FBQ2YsTUFBTSxPQUFPLEdBQUc7QUFDaEIsUUFBUSxDQUFDLEVBQUUsT0FBTztBQUNsQixRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNO0FBQ3pDLE9BQU8sQ0FBQztBQUNSLE1BQU0sTUFBTTtBQUNaO0FBQ0EsSUFBSSxLQUFLLEtBQUs7QUFDZCxNQUFNLE9BQU8sR0FBRztBQUNoQixRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLO0FBQ3hDLFFBQVEsQ0FBQyxFQUFFLE9BQU87QUFDbEIsT0FBTyxDQUFDO0FBQ1IsTUFBTSxNQUFNO0FBQ1o7QUFDQSxJQUFJLEtBQUssSUFBSTtBQUNiLE1BQU0sT0FBTyxHQUFHO0FBQ2hCLFFBQVEsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUs7QUFDdEMsUUFBUSxDQUFDLEVBQUUsT0FBTztBQUNsQixPQUFPLENBQUM7QUFDUixNQUFNLE1BQU07QUFDWjtBQUNBLElBQUk7QUFDSixNQUFNLE9BQU8sR0FBRztBQUNoQixRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN0QixRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN0QixPQUFPLENBQUM7QUFDUixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLGFBQWEsR0FBRyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDaEY7QUFDQSxFQUFFLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtBQUN4QixJQUFJLElBQUksR0FBRyxHQUFHLFFBQVEsS0FBSyxHQUFHLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUNwRDtBQUNBLElBQUksUUFBUSxTQUFTO0FBQ3JCLE1BQU0sS0FBSyxLQUFLO0FBQ2hCLFFBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RixRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsUUFBUSxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLFFBQVEsTUFBTTtBQUdkLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sT0FBTyxDQUFDO0FBQ2pCOztBQzNEZSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3ZELEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxRQUFRLEdBQUcsT0FBTztBQUN4QixNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxTQUFTO0FBQzdDLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsa0JBQWtCO0FBQ3RGLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLFFBQVE7QUFDM0MsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLEtBQUssS0FBSyxDQUFDLEdBQUcsZUFBZSxHQUFHLGlCQUFpQjtBQUNuRixNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxZQUFZO0FBQ25ELE1BQU0sWUFBWSxHQUFHLHFCQUFxQixLQUFLLEtBQUssQ0FBQyxHQUFHLFFBQVEsR0FBRyxxQkFBcUI7QUFDeEYsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsY0FBYztBQUNyRCxNQUFNLGNBQWMsR0FBRyxxQkFBcUIsS0FBSyxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcscUJBQXFCO0FBQ3hGLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLFdBQVc7QUFDakQsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLG9CQUFvQjtBQUNsRixNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxPQUFPO0FBQ3pDLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztBQUNuRSxFQUFFLElBQUksYUFBYSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQzNILEVBQUUsSUFBSSxVQUFVLEdBQUcsY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ2xFLEVBQUUsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdEMsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUM7QUFDMUUsRUFBRSxJQUFJLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksa0JBQWtCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdkssRUFBRSxJQUFJLG1CQUFtQixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUUsRUFBRSxJQUFJLGFBQWEsR0FBRyxjQUFjLENBQUM7QUFDckMsSUFBSSxTQUFTLEVBQUUsbUJBQW1CO0FBQ2xDLElBQUksT0FBTyxFQUFFLFVBQVU7QUFDdkIsSUFBSSxRQUFRLEVBQUUsVUFBVTtBQUN4QixJQUFJLFNBQVMsRUFBRSxTQUFTO0FBQ3hCLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxJQUFJLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLEVBQUUsSUFBSSxpQkFBaUIsR0FBRyxjQUFjLEtBQUssTUFBTSxHQUFHLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDO0FBQzdGO0FBQ0E7QUFDQSxFQUFFLElBQUksZUFBZSxHQUFHO0FBQ3hCLElBQUksR0FBRyxFQUFFLGtCQUFrQixDQUFDLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUc7QUFDM0UsSUFBSSxNQUFNLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTTtBQUN2RixJQUFJLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJO0FBQy9FLElBQUksS0FBSyxFQUFFLGlCQUFpQixDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUs7QUFDbkYsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUM5QztBQUNBLEVBQUUsSUFBSSxjQUFjLEtBQUssTUFBTSxJQUFJLFVBQVUsRUFBRTtBQUMvQyxJQUFJLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3hELE1BQU0sSUFBSSxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEUsTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDN0QsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUN0RCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxlQUFlLENBQUM7QUFDekI7O0FDMURlLFNBQVMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUM3RCxFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQzFCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLE9BQU87QUFDeEIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVM7QUFDcEMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVE7QUFDbEMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVk7QUFDMUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU87QUFDaEMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWM7QUFDOUMsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMscUJBQXFCO0FBQzVELE1BQU0scUJBQXFCLEdBQUcscUJBQXFCLEtBQUssS0FBSyxDQUFDLEdBQUdDLFVBQWEsR0FBRyxxQkFBcUIsQ0FBQztBQUN2RyxFQUFFLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQyxFQUFFLElBQUlDLFlBQVUsR0FBRyxTQUFTLEdBQUcsY0FBYyxHQUFHLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFVLFNBQVMsRUFBRTtBQUN0SCxJQUFJLE9BQU8sWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUNqRCxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUM7QUFDdEIsRUFBRSxJQUFJLGlCQUFpQixHQUFHQSxZQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsU0FBUyxFQUFFO0FBQ2pFLElBQUksT0FBTyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELEdBQUcsQ0FBQyxDQUFDO0FBQ0w7QUFDQSxFQUFFLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN0QyxJQUFJLGlCQUFpQixHQUFHQSxZQUFVLENBQUM7QUFDbkM7QUFDQSxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQy9DLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLDhEQUE4RCxFQUFFLGlFQUFpRSxFQUFFLDRCQUE0QixFQUFFLDZEQUE2RCxFQUFFLDJCQUEyQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN1IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3JFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUU7QUFDM0MsTUFBTSxTQUFTLEVBQUUsU0FBUztBQUMxQixNQUFNLFFBQVEsRUFBRSxRQUFRO0FBQ3hCLE1BQU0sWUFBWSxFQUFFLFlBQVk7QUFDaEMsTUFBTSxPQUFPLEVBQUUsT0FBTztBQUN0QixLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxFQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3JELElBQUksT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7O0FDdENBLFNBQVMsNkJBQTZCLENBQUMsU0FBUyxFQUFFO0FBQ2xELEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDNUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxpQkFBaUIsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxRCxFQUFFLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsRUFBRSxpQkFBaUIsRUFBRSw2QkFBNkIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFDekgsQ0FBQztBQUNEO0FBQ0EsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3BCLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7QUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87QUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QjtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUN2QyxJQUFJLE9BQU87QUFDWCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFFBQVE7QUFDMUMsTUFBTSxhQUFhLEdBQUcsaUJBQWlCLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGlCQUFpQjtBQUM3RSxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPO0FBQ3hDLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxnQkFBZ0I7QUFDMUUsTUFBTSwyQkFBMkIsR0FBRyxPQUFPLENBQUMsa0JBQWtCO0FBQzlELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO0FBQy9CLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRO0FBQ2pDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZO0FBQ3pDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXO0FBQ3ZDLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLGNBQWM7QUFDcEQsTUFBTSxjQUFjLEdBQUcscUJBQXFCLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLHFCQUFxQjtBQUN0RixNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztBQUM1RCxFQUFFLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbkQsRUFBRSxJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNELEVBQUUsSUFBSSxlQUFlLEdBQUcsYUFBYSxLQUFLLGtCQUFrQixDQUFDO0FBQzdELEVBQUUsSUFBSSxrQkFBa0IsR0FBRywyQkFBMkIsS0FBSyxlQUFlLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsNkJBQTZCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQ2hNLEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDcEcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxHQUFHLG9CQUFvQixDQUFDLEtBQUssRUFBRTtBQUN6RixNQUFNLFNBQVMsRUFBRSxTQUFTO0FBQzFCLE1BQU0sUUFBUSxFQUFFLFFBQVE7QUFDeEIsTUFBTSxZQUFZLEVBQUUsWUFBWTtBQUNoQyxNQUFNLE9BQU8sRUFBRSxPQUFPO0FBQ3RCLE1BQU0sY0FBYyxFQUFFLGNBQWM7QUFDcEMsTUFBTSxxQkFBcUIsRUFBRSxxQkFBcUI7QUFDbEQsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDcEIsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsRUFBRSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUM1QyxFQUFFLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3RDLEVBQUUsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM1QixFQUFFLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLEVBQUUsSUFBSSxxQkFBcUIsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUM7QUFDQSxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLElBQUksSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDO0FBQ0EsSUFBSSxJQUFJLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyRDtBQUNBLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSyxDQUFDO0FBQzdELElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRSxJQUFJLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQzlDLElBQUksSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRTtBQUN6QyxNQUFNLFNBQVMsRUFBRSxTQUFTO0FBQzFCLE1BQU0sUUFBUSxFQUFFLFFBQVE7QUFDeEIsTUFBTSxZQUFZLEVBQUUsWUFBWTtBQUNoQyxNQUFNLFdBQVcsRUFBRSxXQUFXO0FBQzlCLE1BQU0sT0FBTyxFQUFFLE9BQU87QUFDdEIsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLElBQUksaUJBQWlCLEdBQUcsVUFBVSxHQUFHLGdCQUFnQixHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUMzRztBQUNBLElBQUksSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzlDLE1BQU0saUJBQWlCLEdBQUcsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNsRSxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRSxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQjtBQUNBLElBQUksSUFBSSxhQUFhLEVBQUU7QUFDdkIsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksWUFBWSxFQUFFO0FBQ3RCLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckYsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDdEMsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUNuQixLQUFLLENBQUMsRUFBRTtBQUNSLE1BQU0scUJBQXFCLEdBQUcsU0FBUyxDQUFDO0FBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLE1BQU0sTUFBTTtBQUNaLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLGtCQUFrQixFQUFFO0FBQzFCO0FBQ0EsSUFBSSxJQUFJLGNBQWMsR0FBRyxjQUFjLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRDtBQUNBLElBQUksSUFBSSxLQUFLLEdBQUcsU0FBUyxLQUFLLENBQUMsRUFBRSxFQUFFO0FBQ25DLE1BQU0sSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsU0FBUyxFQUFFO0FBQ2xFLFFBQVEsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QztBQUNBLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDcEIsVUFBVSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssRUFBRTtBQUM1RCxZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUztBQUNULE9BQU8sQ0FBQyxDQUFDO0FBQ1Q7QUFDQSxNQUFNLElBQUksZ0JBQWdCLEVBQUU7QUFDNUIsUUFBUSxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQztBQUNqRCxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLE9BQU87QUFDUCxLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxjQUFjLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNoRCxNQUFNLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQjtBQUNBLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFLE1BQU07QUFDbEMsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLHFCQUFxQixFQUFFO0FBQ2pELElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQzNDLElBQUksS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztBQUM1QyxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGFBQWU7QUFDZixFQUFFLElBQUksRUFBRSxNQUFNO0FBQ2QsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNmLEVBQUUsS0FBSyxFQUFFLE1BQU07QUFDZixFQUFFLEVBQUUsRUFBRSxJQUFJO0FBQ1YsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztBQUM5QixFQUFFLElBQUksRUFBRTtBQUNSLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsR0FBRztBQUNILENBQUM7O0FDL0lELFNBQVMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7QUFDMUQsRUFBRSxJQUFJLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ25DLElBQUksZ0JBQWdCLEdBQUc7QUFDdkIsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNWLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDVixLQUFLLENBQUM7QUFDTixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVCxJQUFJLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUN4RCxJQUFJLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCxJQUFJLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUM5RCxJQUFJLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztBQUN6RCxHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLFFBQVEsRUFBRTtBQUN6QyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDekQsSUFBSSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDcEIsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztBQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLEVBQUUsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDNUMsRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN0QyxFQUFFLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7QUFDN0QsRUFBRSxJQUFJLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUU7QUFDaEQsSUFBSSxjQUFjLEVBQUUsV0FBVztBQUMvQixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsSUFBSSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFO0FBQ2hELElBQUksV0FBVyxFQUFFLElBQUk7QUFDckIsR0FBRyxDQUFDLENBQUM7QUFDTCxFQUFFLElBQUksd0JBQXdCLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2xGLEVBQUUsSUFBSSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDNUYsRUFBRSxJQUFJLGlCQUFpQixHQUFHLHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDMUUsRUFBRSxJQUFJLGdCQUFnQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDcEUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQzlCLElBQUksd0JBQXdCLEVBQUUsd0JBQXdCO0FBQ3RELElBQUksbUJBQW1CLEVBQUUsbUJBQW1CO0FBQzVDLElBQUksaUJBQWlCLEVBQUUsaUJBQWlCO0FBQ3hDLElBQUksZ0JBQWdCLEVBQUUsZ0JBQWdCO0FBQ3RDLEdBQUcsQ0FBQztBQUNKLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDdkUsSUFBSSw4QkFBOEIsRUFBRSxpQkFBaUI7QUFDckQsSUFBSSxxQkFBcUIsRUFBRSxnQkFBZ0I7QUFDM0MsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGFBQWU7QUFDZixFQUFFLElBQUksRUFBRSxNQUFNO0FBQ2QsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNmLEVBQUUsS0FBSyxFQUFFLE1BQU07QUFDZixFQUFFLGdCQUFnQixFQUFFLENBQUMsaUJBQWlCLENBQUM7QUFDdkMsRUFBRSxFQUFFLEVBQUUsSUFBSTtBQUNWLENBQUM7O0FDMURNLFNBQVMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbEUsRUFBRSxJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxFQUFFLElBQUksY0FBYyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hFO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtBQUM1RSxJQUFJLFNBQVMsRUFBRSxTQUFTO0FBQ3hCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTTtBQUNkLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCO0FBQ0EsRUFBRSxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUMzQixFQUFFLFFBQVEsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDO0FBQzlDLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHO0FBQ3JELElBQUksQ0FBQyxFQUFFLFFBQVE7QUFDZixJQUFJLENBQUMsRUFBRSxRQUFRO0FBQ2YsR0FBRyxHQUFHO0FBQ04sSUFBSSxDQUFDLEVBQUUsUUFBUTtBQUNmLElBQUksQ0FBQyxFQUFFLFFBQVE7QUFDZixHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0Q7QUFDQSxTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDdkIsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSztBQUN6QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTztBQUM3QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3hCLEVBQUUsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU07QUFDdEMsTUFBTSxNQUFNLEdBQUcsZUFBZSxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQztBQUNyRSxFQUFFLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3pELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdFLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxFQUFFLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDbkQsTUFBTSxDQUFDLEdBQUcscUJBQXFCLENBQUMsQ0FBQztBQUNqQyxNQUFNLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7QUFDbEM7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO0FBQ2pELElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGVBQWU7QUFDZixFQUFFLElBQUksRUFBRSxRQUFRO0FBQ2hCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDZixFQUFFLEtBQUssRUFBRSxNQUFNO0FBQ2YsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDN0IsRUFBRSxFQUFFLEVBQUUsTUFBTTtBQUNaLENBQUM7O0FDbERELFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUM3QixFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDO0FBQzdDLElBQUksU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUztBQUNwQyxJQUFJLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDL0IsSUFBSSxRQUFRLEVBQUUsVUFBVTtBQUN4QixJQUFJLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztBQUM5QixHQUFHLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0Esc0JBQWU7QUFDZixFQUFFLElBQUksRUFBRSxlQUFlO0FBQ3ZCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDZixFQUFFLEtBQUssRUFBRSxNQUFNO0FBQ2YsRUFBRSxFQUFFLEVBQUUsYUFBYTtBQUNuQixFQUFFLElBQUksRUFBRSxFQUFFO0FBQ1YsQ0FBQzs7QUN4QmMsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3pDLEVBQUUsT0FBTyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbEM7O0FDVUEsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQy9CLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7QUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87QUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFFBQVE7QUFDMUMsTUFBTSxhQUFhLEdBQUcsaUJBQWlCLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGlCQUFpQjtBQUM3RSxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPO0FBQ3hDLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxnQkFBZ0I7QUFDM0UsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVE7QUFDakMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVk7QUFDekMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVc7QUFDdkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87QUFDL0IsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU07QUFDdEMsTUFBTSxNQUFNLEdBQUcsZUFBZSxLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxlQUFlO0FBQ2xFLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLFlBQVk7QUFDbEQsTUFBTSxZQUFZLEdBQUcscUJBQXFCLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLHFCQUFxQixDQUFDO0FBQ2xGLEVBQUUsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRTtBQUN2QyxJQUFJLFFBQVEsRUFBRSxRQUFRO0FBQ3RCLElBQUksWUFBWSxFQUFFLFlBQVk7QUFDOUIsSUFBSSxPQUFPLEVBQUUsT0FBTztBQUNwQixJQUFJLFdBQVcsRUFBRSxXQUFXO0FBQzVCLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEQsRUFBRSxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELEVBQUUsSUFBSSxlQUFlLEdBQUcsQ0FBQyxTQUFTLENBQUM7QUFDbkMsRUFBRSxJQUFJLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6RCxFQUFFLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxFQUFFLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0FBQ3hELEVBQUUsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDNUMsRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN0QyxFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxZQUFZLEtBQUssVUFBVSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQzNHLElBQUksU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQzlCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDO0FBQ3JCLEVBQUUsSUFBSSxJQUFJLEdBQUc7QUFDYixJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ1IsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNSLEdBQUcsQ0FBQztBQUNKO0FBQ0EsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxhQUFhLElBQUksWUFBWSxFQUFFO0FBQ3JDLElBQUksSUFBSSxRQUFRLEdBQUcsUUFBUSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2pELElBQUksSUFBSSxPQUFPLEdBQUcsUUFBUSxLQUFLLEdBQUcsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BELElBQUksSUFBSSxHQUFHLEdBQUcsUUFBUSxLQUFLLEdBQUcsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3BELElBQUksSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLElBQUksSUFBSU4sS0FBRyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0QsSUFBSSxJQUFJQyxLQUFHLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxRCxJQUFJLElBQUksUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxLQUFLLEtBQUssR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVFLElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxLQUFLLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5RTtBQUNBO0FBQ0EsSUFBSSxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM1QyxJQUFJLElBQUksU0FBUyxHQUFHLE1BQU0sSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHO0FBQzNFLE1BQU0sS0FBSyxFQUFFLENBQUM7QUFDZCxNQUFNLE1BQU0sRUFBRSxDQUFDO0FBQ2YsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxHQUFHLGtCQUFrQixFQUFFLENBQUM7QUFDOUksSUFBSSxJQUFJLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RCxJQUFJLElBQUksZUFBZSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLElBQUksSUFBSSxTQUFTLEdBQUcsZUFBZSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxlQUFlLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxHQUFHLFFBQVEsR0FBRyxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFDbkwsSUFBSSxJQUFJLFNBQVMsR0FBRyxlQUFlLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsZUFBZSxHQUFHLGlCQUFpQixHQUFHLE1BQU0sR0FBRyxRQUFRLEdBQUcsZUFBZSxHQUFHLGlCQUFpQixDQUFDO0FBQ3BMLElBQUksSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRixJQUFJLElBQUksWUFBWSxHQUFHLGlCQUFpQixHQUFHLFFBQVEsS0FBSyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2SSxJQUFJLElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNySCxJQUFJLElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLEdBQUcsbUJBQW1CLEdBQUcsWUFBWSxDQUFDO0FBQzdGLElBQUksSUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztBQUM5RTtBQUNBLElBQUksSUFBSSxhQUFhLEVBQUU7QUFDdkIsTUFBTSxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHRSxHQUFPLENBQUNILEtBQUcsRUFBRSxTQUFTLENBQUMsR0FBR0EsS0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUdFLEdBQU8sQ0FBQ0QsS0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHQSxLQUFHLENBQUMsQ0FBQztBQUMzSCxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLENBQUM7QUFDaEQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNoRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksWUFBWSxFQUFFO0FBQ3RCLE1BQU0sSUFBSSxTQUFTLEdBQUcsUUFBUSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ3BEO0FBQ0EsTUFBTSxJQUFJLFFBQVEsR0FBRyxRQUFRLEtBQUssR0FBRyxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDdkQ7QUFDQSxNQUFNLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQztBQUNBLE1BQU0sSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQztBQUNBLE1BQU0sSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QztBQUNBLE1BQU0sSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHRSxHQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxHQUFHRCxHQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2pJO0FBQ0EsTUFBTSxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7QUFDaEQsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBQ2pELEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25DLENBQUM7QUFDRDtBQUNBO0FBQ0Esd0JBQWU7QUFDZixFQUFFLElBQUksRUFBRSxpQkFBaUI7QUFDekIsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNmLEVBQUUsS0FBSyxFQUFFLE1BQU07QUFDZixFQUFFLEVBQUUsRUFBRSxlQUFlO0FBQ3JCLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDOUIsQ0FBQzs7QUMxSGMsU0FBUyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUU7QUFDdEQsRUFBRSxPQUFPO0FBQ1QsSUFBSSxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7QUFDbEMsSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7QUFDaEMsR0FBRyxDQUFDO0FBQ0o7O0FDRGUsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzVDLEVBQUUsSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hELElBQUksT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsR0FBRyxNQUFNO0FBQ1QsSUFBSSxPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLEdBQUc7QUFDSDs7QUNGQSxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUU7QUFDbEMsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QyxFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7QUFDckQsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO0FBQ3ZELEVBQUUsT0FBTyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNlLFNBQVMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRTtBQUN6RixFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQzFCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNwQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksdUJBQXVCLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVELEVBQTZCLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxFQUFFO0FBQzFGLEVBQUUsSUFBSSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekQsRUFBRSxJQUFJLElBQUksR0FBRyxxQkFBcUIsQ0FBQyx1QkFBNkMsQ0FBQyxDQUFDO0FBQ2xGLEVBQUUsSUFBSSxNQUFNLEdBQUc7QUFDZixJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ2pCLElBQUksU0FBUyxFQUFFLENBQUM7QUFDaEIsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLE9BQU8sR0FBRztBQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ1IsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNSLEdBQUcsQ0FBQztBQUNKO0FBQ0EsRUFBRSxJQUFJLHVCQUF1QixJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDdkUsSUFBSSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxNQUFNO0FBQzVDLElBQUksY0FBYyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQ3JDLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3JDLE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLFlBQWtCLENBQUMsQ0FBQztBQUMxRCxNQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUMzQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUMxQyxLQUFLLE1BQU0sSUFBSSxlQUFlLEVBQUU7QUFDaEMsTUFBTSxPQUFPLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZELEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVCxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDaEQsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ3JCLElBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ3ZCLEdBQUcsQ0FBQztBQUNKOztBQ3REQSxTQUFTLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDMUIsRUFBRSxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMxQixFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFDeEMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDckMsR0FBRyxDQUFDLENBQUM7QUFDTDtBQUNBLEVBQUUsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzFCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN2RixJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDcEMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM3QixRQUFRLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkM7QUFDQSxRQUFRLElBQUksV0FBVyxFQUFFO0FBQ3pCLFVBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3JDO0FBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckIsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDZSxTQUFTLGNBQWMsQ0FBQyxTQUFTLEVBQUU7QUFDbEQ7QUFDQSxFQUFFLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDO0FBQ0EsRUFBRSxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3JELElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUNsRSxNQUFNLE9BQU8sUUFBUSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7QUFDdEMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNSLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNUOztBQzNDZSxTQUFTLFFBQVEsQ0FBQyxFQUFFLEVBQUU7QUFDckMsRUFBRSxJQUFJLE9BQU8sQ0FBQztBQUNkLEVBQUUsT0FBTyxZQUFZO0FBQ3JCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNsQixNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtBQUMvQyxRQUFRLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWTtBQUMzQyxVQUFVLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDOUIsVUFBVSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QixTQUFTLENBQUMsQ0FBQztBQUNYLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLE9BQU8sQ0FBQztBQUNuQixHQUFHLENBQUM7QUFDSjs7QUNkZSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEMsRUFBRSxLQUFLLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7QUFDOUcsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hELElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDVjs7QUNOQSxJQUFJLHNCQUFzQixHQUFHLCtFQUErRSxDQUFDO0FBQzdHLElBQUksd0JBQXdCLEdBQUcseUVBQXlFLENBQUM7QUFDekcsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVFLFNBQVMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO0FBQ3JELEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUN4QyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQztBQUN0RCxLQUFLLE1BQU0sQ0FBQyxVQUFVLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQzFDLE1BQU0sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztBQUMzQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDOUIsTUFBTSxRQUFRLEdBQUc7QUFDakIsUUFBUSxLQUFLLE1BQU07QUFDbkIsVUFBVSxJQUFJLE9BQU8sUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDakQsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1SSxXQUFXO0FBQ1g7QUFDQSxVQUFVLE1BQU07QUFDaEI7QUFDQSxRQUFRLEtBQUssU0FBUztBQUN0QixVQUFVLElBQUksT0FBTyxRQUFRLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUNyRCxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNJLFdBQVc7QUFDWDtBQUNBLFVBQVUsTUFBTTtBQUNoQjtBQUNBLFFBQVEsS0FBSyxPQUFPO0FBQ3BCLFVBQVUsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDMUQsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pLLFdBQVc7QUFDWDtBQUNBLFVBQVUsTUFBTTtBQUNoQjtBQUNBLFFBQVEsS0FBSyxJQUFJO0FBQ2pCLFVBQVUsSUFBSSxPQUFPLFFBQVEsQ0FBQyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQ2pELFlBQVksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEksV0FBVztBQUNYO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCO0FBQ0EsUUFBUSxLQUFLLFFBQVE7QUFDckIsVUFBVSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDaEYsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0SSxXQUFXO0FBQ1g7QUFDQSxVQUFVLE1BQU07QUFDaEI7QUFDQSxRQUFRLEtBQUssVUFBVTtBQUN2QixVQUFVLElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5RSxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNJLFdBQVc7QUFDWDtBQUNBLFVBQVUsTUFBTTtBQUNoQjtBQUNBLFFBQVEsS0FBSyxrQkFBa0I7QUFDL0IsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtBQUN6RCxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzSixXQUFXO0FBQ1g7QUFDQSxVQUFVLE1BQU07QUFDaEI7QUFDQSxRQUFRLEtBQUssU0FBUyxDQUFDO0FBQ3ZCLFFBQVEsS0FBSyxNQUFNO0FBQ25CLFVBQVUsTUFBTTtBQUNoQjtBQUNBLFFBQVE7QUFDUixVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkRBQTJELEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxvQ0FBb0MsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDL0ssWUFBWSxPQUFPLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25DLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7QUFDakUsT0FBTztBQUNQO0FBQ0EsTUFBTSxRQUFRLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsV0FBVyxFQUFFO0FBQzVFLFFBQVEsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQzFDLFVBQVUsT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQztBQUMxQyxTQUFTLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDcEIsVUFBVSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzNHLFNBQVM7QUFDVCxPQUFPLENBQUMsQ0FBQztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7QUFDTDs7QUNoRmUsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRTtBQUMxQyxFQUFFLElBQUksV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDOUIsRUFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDcEMsSUFBSSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUI7QUFDQSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3RDLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsQyxNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUs7QUFDTCxHQUFHLENBQUMsQ0FBQztBQUNMOztBQ1ZlLFNBQVMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUMvQyxFQUFFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzNELElBQUksSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDM0UsTUFBTSxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ25FLE1BQU0sSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUMxRCxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDakIsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVDtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUNoRCxJQUFJLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7O0FDQ0EsSUFBSSxxQkFBcUIsR0FBRyw4R0FBOEcsQ0FBQztBQUMzSSxJQUFJLG1CQUFtQixHQUFHLCtIQUErSCxDQUFDO0FBQzFKLElBQUksZUFBZSxHQUFHO0FBQ3RCLEVBQUUsU0FBUyxFQUFFLFFBQVE7QUFDckIsRUFBRSxTQUFTLEVBQUUsRUFBRTtBQUNmLEVBQUUsUUFBUSxFQUFFLFVBQVU7QUFDdEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQSxTQUFTLGdCQUFnQixHQUFHO0FBQzVCLEVBQUUsS0FBSyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7QUFDM0YsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxPQUFPLEVBQUU7QUFDdkMsSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLE9BQU8sT0FBTyxDQUFDLHFCQUFxQixLQUFLLFVBQVUsQ0FBQyxDQUFDO0FBQzdFLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNEO0FBQ08sU0FBUyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEQsRUFBRSxJQUFJLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ25DLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzFCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxpQkFBaUIsR0FBRyxnQkFBZ0I7QUFDMUMsTUFBTSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxnQkFBZ0I7QUFDaEUsTUFBTSxnQkFBZ0IsR0FBRyxxQkFBcUIsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcscUJBQXFCO0FBQ3RGLE1BQU0sc0JBQXNCLEdBQUcsaUJBQWlCLENBQUMsY0FBYztBQUMvRCxNQUFNLGNBQWMsR0FBRyxzQkFBc0IsS0FBSyxLQUFLLENBQUMsR0FBRyxlQUFlLEdBQUcsc0JBQXNCLENBQUM7QUFDcEcsRUFBRSxPQUFPLFNBQVMsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzNELElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDNUIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0FBQy9CLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDaEIsTUFBTSxTQUFTLEVBQUUsUUFBUTtBQUN6QixNQUFNLGdCQUFnQixFQUFFLEVBQUU7QUFDMUIsTUFBTSxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQztBQUNqRSxNQUFNLGFBQWEsRUFBRSxFQUFFO0FBQ3ZCLE1BQU0sUUFBUSxFQUFFO0FBQ2hCLFFBQVEsU0FBUyxFQUFFLFNBQVM7QUFDNUIsUUFBUSxNQUFNLEVBQUUsTUFBTTtBQUN0QixPQUFPO0FBQ1AsTUFBTSxVQUFVLEVBQUUsRUFBRTtBQUNwQixNQUFNLE1BQU0sRUFBRSxFQUFFO0FBQ2hCLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDOUIsSUFBSSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDNUIsSUFBSSxJQUFJLFFBQVEsR0FBRztBQUNuQixNQUFNLEtBQUssRUFBRSxLQUFLO0FBQ2xCLE1BQU0sVUFBVSxFQUFFLFNBQVMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO0FBQ3hELFFBQVEsSUFBSSxPQUFPLEdBQUcsT0FBTyxnQkFBZ0IsS0FBSyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQ2xILFFBQVEsc0JBQXNCLEVBQUUsQ0FBQztBQUNqQyxRQUFRLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEYsUUFBUSxLQUFLLENBQUMsYUFBYSxHQUFHO0FBQzlCLFVBQVUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO0FBQ3RKLFVBQVUsTUFBTSxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztBQUMzQyxTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqSDtBQUNBLFFBQVEsS0FBSyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUN0RSxVQUFVLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0E7QUFDQSxRQUFRLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQ25ELFVBQVUsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxVQUFVLElBQUksRUFBRTtBQUN6RyxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixXQUFXLENBQUMsQ0FBQztBQUNiLFVBQVUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkM7QUFDQSxVQUFVLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDbEUsWUFBWSxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQzVFLGNBQWMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNwQyxjQUFjLE9BQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQztBQUNyQyxhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0EsWUFBWSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQy9CLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLDBEQUEwRCxFQUFFLDhCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEksYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBLFVBQVUsSUFBSSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDMUQsY0FBYyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsU0FBUztBQUNyRCxjQUFjLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXO0FBQ3pELGNBQWMsWUFBWSxHQUFHLGlCQUFpQixDQUFDLFlBQVk7QUFDM0QsY0FBYyxVQUFVLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLFVBQVUsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLE1BQU0sRUFBRTtBQUN4RixZQUFZLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFdBQVcsQ0FBQyxFQUFFO0FBQ2QsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsNkRBQTZELEVBQUUsMkRBQTJELEVBQUUsNERBQTRELEVBQUUsMERBQTBELEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDelMsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLFFBQVEsa0JBQWtCLEVBQUUsQ0FBQztBQUM3QixRQUFRLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxXQUFXLEVBQUUsU0FBUyxXQUFXLEdBQUc7QUFDMUMsUUFBUSxJQUFJLFdBQVcsRUFBRTtBQUN6QixVQUFVLE9BQU87QUFDakIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUMsUUFBUTtBQUM1QyxZQUFZLFNBQVMsR0FBRyxlQUFlLENBQUMsU0FBUztBQUNqRCxZQUFZLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDO0FBQzVDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDbEQsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRTtBQUNyRCxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNqRCxXQUFXO0FBQ1g7QUFDQSxVQUFVLE9BQU87QUFDakIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLEtBQUssQ0FBQyxLQUFLLEdBQUc7QUFDdEIsVUFBVSxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7QUFDN0csVUFBVSxNQUFNLEVBQUUsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUN2QyxTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUM1QixRQUFRLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFDM0QsVUFBVSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RixTQUFTLENBQUMsQ0FBQztBQUNYLFFBQVEsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUM1RSxVQUFVLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQ3JELFlBQVksZUFBZSxJQUFJLENBQUMsQ0FBQztBQUNqQztBQUNBLFlBQVksSUFBSSxlQUFlLEdBQUcsR0FBRyxFQUFFO0FBQ3ZDLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pELGNBQWMsTUFBTTtBQUNwQixhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsVUFBVSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3BDLFlBQVksS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDaEMsWUFBWSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsWUFBWSxTQUFTO0FBQ3JCLFdBQVc7QUFDWDtBQUNBLFVBQVUsSUFBSSxxQkFBcUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0FBQ25FLGNBQWMsRUFBRSxHQUFHLHFCQUFxQixDQUFDLEVBQUU7QUFDM0MsY0FBYyxzQkFBc0IsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPO0FBQ3BFLGNBQWMsUUFBUSxHQUFHLHNCQUFzQixLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxzQkFBc0I7QUFDeEYsY0FBYyxJQUFJLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDO0FBQ2hEO0FBQ0EsVUFBVSxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRTtBQUN4QyxZQUFZLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDdkIsY0FBYyxLQUFLLEVBQUUsS0FBSztBQUMxQixjQUFjLE9BQU8sRUFBRSxRQUFRO0FBQy9CLGNBQWMsSUFBSSxFQUFFLElBQUk7QUFDeEIsY0FBYyxRQUFRLEVBQUUsUUFBUTtBQUNoQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDeEIsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sTUFBTSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0FBQ25DLFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtBQUM5QyxVQUFVLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqQyxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixTQUFTLENBQUMsQ0FBQztBQUNYLE9BQU8sQ0FBQztBQUNSLE1BQU0sT0FBTyxFQUFFLFNBQVMsT0FBTyxHQUFHO0FBQ2xDLFFBQVEsc0JBQXNCLEVBQUUsQ0FBQztBQUNqQyxRQUFRLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDM0IsT0FBTztBQUNQLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFO0FBQzlDLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUU7QUFDakQsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0MsT0FBTztBQUNQO0FBQ0EsTUFBTSxPQUFPLFFBQVEsQ0FBQztBQUN0QixLQUFLO0FBQ0w7QUFDQSxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQ3ZELE1BQU0sSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO0FBQ2pELFFBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLGtCQUFrQixHQUFHO0FBQ2xDLE1BQU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRTtBQUN0RCxRQUFRLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJO0FBQzdCLFlBQVksYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPO0FBQ3pDLFlBQVksT0FBTyxHQUFHLGFBQWEsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYTtBQUNuRSxZQUFZLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ2xDO0FBQ0EsUUFBUSxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUMxQyxVQUFVLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUNqQyxZQUFZLEtBQUssRUFBRSxLQUFLO0FBQ3hCLFlBQVksSUFBSSxFQUFFLElBQUk7QUFDdEIsWUFBWSxRQUFRLEVBQUUsUUFBUTtBQUM5QixZQUFZLE9BQU8sRUFBRSxPQUFPO0FBQzVCLFdBQVcsQ0FBQyxDQUFDO0FBQ2I7QUFDQSxVQUFVLElBQUksTUFBTSxHQUFHLFNBQVMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUM1QztBQUNBLFVBQVUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQztBQUNyRCxTQUFTO0FBQ1QsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsc0JBQXNCLEdBQUc7QUFDdEMsTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDN0MsUUFBUSxPQUFPLEVBQUUsRUFBRSxDQUFDO0FBQ3BCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLFFBQVEsQ0FBQztBQUNwQixHQUFHLENBQUM7QUFDSjs7QUNyUEEsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsRUFBRUssZUFBYSxFQUFFQyxlQUFhLEVBQUVDLGFBQVcsRUFBRUMsUUFBTSxFQUFFQyxNQUFJLEVBQUVDLGlCQUFlLEVBQUVDLE9BQUssRUFBRUMsTUFBSSxDQUFDLENBQUM7QUFDL0gsSUFBSSxZQUFZLGdCQUFnQixlQUFlLENBQUM7QUFDaEQsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7QUFDcEMsQ0FBQyxDQUFDLENBQUM7O0FDYkg7QUFLQSxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFZO0lBQzNDLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixNQUFNLE9BQU87SUFPVCxZQUNJLEtBQXVCLEVBQ3ZCLFdBQXdCLEVBQ3hCLEtBQVk7UUFFWixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUUvQixXQUFXLENBQUMsRUFBRSxDQUNWLE9BQU8sRUFDUCxrQkFBa0IsRUFDbEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDcEMsQ0FBQztRQUNGLFdBQVcsQ0FBQyxFQUFFLENBQ1YsV0FBVyxFQUNYLGtCQUFrQixFQUNsQixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN4QyxDQUFDO1FBRUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSztZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxLQUFLLENBQUM7YUFDaEI7U0FDSixDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxLQUFLO1lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUs7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0osQ0FBQyxDQUFDO0tBQ047SUFFRCxpQkFBaUIsQ0FBQyxLQUFpQixFQUFFLEVBQWtCO1FBQ25ELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQy9CO0lBRUQscUJBQXFCLENBQUMsTUFBa0IsRUFBRSxFQUFrQjtRQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyQztJQUVELGNBQWMsQ0FBQyxNQUFXO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsTUFBTSxhQUFhLEdBQXFCLEVBQUUsQ0FBQztRQUUzQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSztZQUNqQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2pELGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUM7UUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbEM7SUFFRCxlQUFlLENBQUMsS0FBaUM7UUFDN0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEQsSUFBSSxZQUFZLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNwRDtLQUNKO0lBRUQsZUFBZSxDQUFDLGFBQXFCLEVBQUUsY0FBdUI7UUFDMUQsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUM5QixhQUFhLEVBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQzFCLENBQUM7UUFDRixNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ25FLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3RCxzQkFBc0IsYUFBdEIsc0JBQXNCLHVCQUF0QixzQkFBc0IsQ0FBRSxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkQsa0JBQWtCLGFBQWxCLGtCQUFrQix1QkFBbEIsa0JBQWtCLENBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDO1FBRXBDLElBQUksY0FBYyxFQUFFO1lBQ2hCLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztLQUNKO0NBQ0o7TUFFcUIsZ0JBQWdCO0lBU2xDLFlBQVksR0FBUSxFQUFFLE9BQStDO1FBQ2pFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJQyxxQkFBSyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNuRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FDYixXQUFXLEVBQ1gsdUJBQXVCLEVBQ3ZCLENBQUMsS0FBaUI7WUFDZCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUIsQ0FDSixDQUFDO0tBQ0w7SUFFRCxjQUFjO1FBQ1YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDcEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTztTQUNWO1FBRUQsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7WUFFekMsSUFBSSxDQUFDLElBQUksQ0FBTyxJQUFJLENBQUMsR0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9EO2FBQU07WUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEI7S0FDSjtJQUVELElBQUksQ0FBQyxTQUFzQixFQUFFLE9BQW9COztRQUV2QyxJQUFJLENBQUMsR0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hELFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFNBQVMsRUFBRTtnQkFDUDtvQkFDSSxJQUFJLEVBQUUsV0FBVztvQkFDakIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFOzs7Ozt3QkFLcEIsTUFBTSxXQUFXLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQzt3QkFDdkQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFOzRCQUMzQyxPQUFPO3lCQUNWO3dCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7d0JBQ3hDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDckI7b0JBQ0QsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQztpQkFDOUI7YUFDSjtTQUNKLENBQUMsQ0FBQztLQUNOO0lBRUQsS0FBSzs7UUFFSyxJQUFJLENBQUMsR0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSSxDQUFDLE1BQU07WUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7OztBQ3RNTDtNQUthLGFBQWMsU0FBUSxnQkFBeUI7SUFDeEQsY0FBYyxDQUFDLFFBQWdCO1FBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO1FBQzlCLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRWpELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFxQjtZQUN4QyxJQUNJLE1BQU0sWUFBWUMsdUJBQU87Z0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQ3ZEO2dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEI7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQztLQUNsQjtJQUVELGdCQUFnQixDQUFDLElBQWEsRUFBRSxFQUFlO1FBQzNDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsZ0JBQWdCLENBQUMsSUFBYTtRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNoQjs7O1NDckJXLEtBQUssQ0FBQyxFQUFVO0lBQzVCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUM7U0FFZSxhQUFhLENBQUMsR0FBVztJQUNyQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEQsQ0FBQztTQUVlLGVBQWUsQ0FBQyxHQUFRLEVBQUUsVUFBa0I7SUFDeEQsVUFBVSxHQUFHQyw2QkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXZDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE1BQU0sSUFBSSxjQUFjLENBQUMsV0FBVyxVQUFVLGlCQUFpQixDQUFDLENBQUM7S0FDcEU7SUFDRCxJQUFJLEVBQUUsTUFBTSxZQUFZRCx1QkFBTyxDQUFDLEVBQUU7UUFDOUIsTUFBTSxJQUFJLGNBQWMsQ0FBQyxHQUFHLFVBQVUsMEJBQTBCLENBQUMsQ0FBQztLQUNyRTtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7U0FFZSxhQUFhLENBQUMsR0FBUSxFQUFFLFFBQWdCO0lBQ3BELFFBQVEsR0FBR0MsNkJBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDUCxNQUFNLElBQUksY0FBYyxDQUFDLFNBQVMsUUFBUSxpQkFBaUIsQ0FBQyxDQUFDO0tBQ2hFO0lBQ0QsSUFBSSxFQUFFLElBQUksWUFBWUMscUJBQUssQ0FBQyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxjQUFjLENBQUMsR0FBRyxRQUFRLDBCQUEwQixDQUFDLENBQUM7S0FDbkU7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO1NBRWUsc0JBQXNCLENBQ2xDLEdBQVEsRUFDUixVQUFrQjtJQUVsQixNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRWhELE1BQU0sS0FBSyxHQUFpQixFQUFFLENBQUM7SUFDL0JDLHFCQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQW1CO1FBQzlDLElBQUksSUFBSSxZQUFZRCxxQkFBSyxFQUFFO1lBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7S0FDSixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDWixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMvQyxDQUFDLENBQUM7SUFFSCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO1NBRWUsU0FBUyxDQUNyQixHQUFRLEVBQ1IsU0FBaUIsRUFDakIsT0FBZTtJQUVmLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUN2QyxPQUFPO0tBQ1Y7SUFDRCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQzNCOztBQzdFQTtBQVFBLElBQVksZUFHWDtBQUhELFdBQVksZUFBZTtJQUN2Qix1RUFBYSxDQUFBO0lBQ2IsbUVBQVcsQ0FBQTtBQUNmLENBQUMsRUFIVyxlQUFlLEtBQWYsZUFBZSxRQUcxQjtNQUVZLFdBQVksU0FBUSxnQkFBdUI7SUFDcEQsWUFDVyxHQUFRLEVBQ1IsT0FBeUIsRUFDeEIsTUFBdUIsRUFDdkIsSUFBcUI7UUFFN0IsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUxiLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFDUixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFpQjtLQUdoQztJQUVELFVBQVUsQ0FBQyxJQUFxQjtRQUM1QixRQUFRLElBQUk7WUFDUixLQUFLLGVBQWUsQ0FBQyxhQUFhO2dCQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pELEtBQUssZUFBZSxDQUFDLFdBQVc7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7U0FDdkQ7S0FDSjtJQUVELGFBQWEsQ0FBQyxJQUFxQjtRQUMvQixRQUFRLElBQUk7WUFDUixLQUFLLGVBQWUsQ0FBQyxhQUFhO2dCQUM5QixPQUFPLGdDQUFnQyxDQUFDO1lBQzVDLEtBQUssZUFBZSxDQUFDLFdBQVc7Z0JBQzVCLE9BQU8sbUNBQW1DLENBQUM7U0FDbEQ7S0FDSjtJQUVELGNBQWMsQ0FBQyxTQUFpQjtRQUM1QixNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FDOUIsTUFBTSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ2xFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNoQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxNQUFNLEtBQUssR0FBWSxFQUFFLENBQUM7UUFDMUIsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRWhELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFtQjtZQUNsQyxJQUNJLElBQUksWUFBWUEscUJBQUs7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSTtnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQ25EO2dCQUNFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEI7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELGdCQUFnQixDQUFDLElBQVcsRUFBRSxFQUFlO1FBQ3pDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsZ0JBQWdCLENBQUMsSUFBVztRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNoQjs7O0FDN0RFLE1BQU0sZ0JBQWdCLEdBQWE7SUFDdEMsZUFBZSxFQUFFLENBQUM7SUFDbEIsZ0JBQWdCLEVBQUUsRUFBRTtJQUNwQixlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQix3QkFBd0IsRUFBRSxLQUFLO0lBQy9CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsc0JBQXNCLEVBQUUsS0FBSztJQUM3QixVQUFVLEVBQUUsRUFBRTtJQUNkLG1CQUFtQixFQUFFLEVBQUU7SUFDdkIsdUJBQXVCLEVBQUUsSUFBSTtJQUM3QixnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDaEQsbUJBQW1CLEVBQUUsSUFBSTtJQUN6Qix5QkFBeUIsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUMvQixpQkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQztDQUMxQixDQUFDO01Ba0JXLG1CQUFvQixTQUFRRSxnQ0FBZ0I7SUFDckQsWUFBbUIsR0FBUSxFQUFVLE1BQXVCO1FBQ3hELEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFESixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7S0FFM0Q7SUFFRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsd0NBQXdDLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1lBQy9DLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLENBQUM7S0FDcEQ7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQztLQUNqRTtJQUVELDJCQUEyQjtRQUN2QixJQUFJQyx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLDBCQUEwQixDQUFDO2FBQ25DLE9BQU8sQ0FBQyxzREFBc0QsQ0FBQzthQUMvRCxTQUFTLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztpQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO2lCQUMvQyxRQUFRLENBQUMsQ0FBQyxVQUFVO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDL0IsQ0FBQyxDQUFDOztZQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDL0MsQ0FBQyxDQUFDO0tBQ1Y7SUFFRCw4QkFBOEI7UUFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FDUCxpRkFBaUYsRUFDakYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsWUFBWSxFQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2YsSUFBSSxFQUFFLDJDQUEyQztZQUNqRCxJQUFJLEVBQUUsZUFBZTtTQUN4QixDQUFDLEVBQ0YscUVBQXFFLENBQ3hFLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLGtDQUFrQyxDQUFDO2FBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QjtJQUVELCtCQUErQjtRQUMzQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUNQLCtEQUErRCxDQUNsRSxDQUFDO1FBRUYsSUFBSUEsdUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzthQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDO2FBQ2IsU0FBUyxDQUFDLENBQUMsTUFBTTtZQUNkLE1BQU07aUJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO2lCQUNsRCxRQUFRLENBQUMsQ0FBQyxtQkFBbUI7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQjtvQkFDcEMsbUJBQW1CLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLDBCQUEwQixFQUFFLENBQUM7YUFDMUQsQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxDQUFDO0tBQ1Y7SUFFRCx1QkFBdUI7UUFDbkIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FDUCx5QkFBeUIsRUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUNqRCw4QkFBOEIsRUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsZ0RBQWdELEVBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFDakQsR0FBRyxDQUNOLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLDBCQUEwQixDQUFDO2FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDYixTQUFTLENBQUMsQ0FBQyxNQUFNO1lBQ2QsTUFBTTtpQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7aUJBQ2xELFFBQVEsQ0FBQyxDQUFDLG1CQUFtQjtnQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CO29CQUNwQyxtQkFBbUIsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUMvQixDQUFDLENBQUM7U0FDVixDQUFDLENBQUM7S0FDVjtJQUVELHdDQUF3QztRQUNwQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUNQLHNIQUFzSCxFQUN0SCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUNuQiwrSUFBK0ksRUFDL0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDZixJQUFJLEVBQUUsV0FBVztTQUNwQixDQUFDLEVBQ0YsdUpBQXVKLENBQzFKLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLHdDQUF3QyxDQUFDO2FBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDYixTQUFTLENBQUMsQ0FBQyxNQUFNO1lBQ2QsTUFBTTtpQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUM7aUJBQ3ZELFFBQVEsQ0FBQyxDQUFDLHdCQUF3QjtnQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsd0JBQXdCO29CQUN6Qyx3QkFBd0IsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsK0JBQStCLEVBQUUsQ0FBQzs7Z0JBRTVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNsQixDQUFDLENBQUM7U0FDVixDQUFDLENBQUM7S0FDVjtJQUVELDZCQUE2QjtRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBRTlELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQ1AsNkRBQTZELENBQ2hFLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUNsRCxDQUFDLFFBQVEsRUFBRSxLQUFLO1lBQ1osTUFBTSxDQUFDLEdBQUcsSUFBSUEsdUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUNsQyxTQUFTLENBQUMsQ0FBQyxFQUFFO2dCQUNWLElBQUksV0FBVyxDQUNYLElBQUksQ0FBQyxHQUFHLEVBQ1IsRUFBRSxDQUFDLE9BQU8sRUFDVixJQUFJLENBQUMsTUFBTSxFQUNYLGVBQWUsQ0FBQyxhQUFhLENBQ2hDLENBQUM7Z0JBQ0YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztxQkFDOUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztxQkFDbEIsUUFBUSxDQUFDLENBQUMsWUFBWTtvQkFDbkIsSUFDSSxZQUFZO3dCQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FDbkQsWUFBWSxDQUNmLEVBQ0g7d0JBQ0UsU0FBUyxDQUNMLElBQUksY0FBYyxDQUNkLDRDQUE0QyxDQUMvQyxDQUNKLENBQUM7d0JBQ0YsT0FBTztxQkFDVjtvQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO3lCQUNmLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxFQUNyQyxZQUFZLENBQ2YsQ0FBQztvQkFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FDMUMsS0FBSyxDQUNSLEdBQUcsWUFBWSxDQUFDO29CQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUMvQixDQUFDLENBQUM7O2dCQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDL0MsQ0FBQztpQkFDRCxjQUFjLENBQUMsQ0FBQyxFQUFFO2dCQUNmLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO3FCQUNoQixVQUFVLENBQUMsa0JBQWtCLENBQUM7cUJBQzlCLE9BQU8sQ0FBQzs7O29CQUdMLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7b0JBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDdkMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLENBQUM7b0JBQzlDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2lCQUNoQyxDQUFDLENBQUM7YUFDVixDQUFDO2lCQUNELGNBQWMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztxQkFDekIsVUFBVSxDQUFDLFNBQVMsQ0FBQztxQkFDckIsT0FBTyxDQUFDO29CQUNMLFNBQVMsQ0FDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7eUJBQ2YseUJBQXlCLEVBQzlCLEtBQUssRUFDTCxLQUFLLEdBQUcsQ0FBQyxDQUNaLENBQUM7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQixDQUFDLENBQUM7YUFDVixDQUFDO2lCQUNELGNBQWMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztxQkFDM0IsVUFBVSxDQUFDLFdBQVcsQ0FBQztxQkFDdkIsT0FBTyxDQUFDO29CQUNMLFNBQVMsQ0FDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7eUJBQ2YseUJBQXlCLEVBQzlCLEtBQUssRUFDTCxLQUFLLEdBQUcsQ0FBQyxDQUNaLENBQUM7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQixDQUFDLENBQUM7YUFDVixDQUFDO2lCQUNELGNBQWMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7cUJBQ2QsVUFBVSxDQUFDLFFBQVEsQ0FBQztxQkFDcEIsT0FBTyxDQUFDO29CQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7eUJBQ2YseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQ3hDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUNqRCxLQUFLLEVBQ0wsQ0FBQyxDQUNKLENBQUM7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7b0JBRTVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQixDQUNKLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO1lBQ3ZDLEVBQUUsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUM7aUJBQzFDLE1BQU0sRUFBRTtpQkFDUixPQUFPLENBQUM7Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFFNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2xCLENBQUMsQ0FBQztTQUNWLENBQUMsQ0FBQztLQUNOO0lBRUQsNEJBQTRCO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFFOUQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdEQsV0FBVyxDQUFDLE1BQU0sQ0FDZCw0Q0FBNEMsRUFDNUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFDbEQsb0NBQW9DLEVBQ3BDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQzFCLGlFQUFpRSxFQUNqRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUMxQixvRkFBb0YsRUFDcEYsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFDM0MsR0FBRyxDQUNOLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkQsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNqRSxzQkFBc0IsQ0FBQyxNQUFNLENBQ3pCLDZFQUE2RSxDQUNoRixDQUFDO1FBRUYsSUFBSUEsdUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzthQUNsQyxPQUFPLENBQUMsc0JBQXNCLENBQUM7YUFDL0IsU0FBUyxDQUFDLENBQUMsTUFBTTtZQUNkLE1BQU07aUJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDO2lCQUN0RCxRQUFRLENBQUMsQ0FBQyxzQkFBc0I7Z0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QjtvQkFDeEMsc0JBQXNCLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUU1QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRVAsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQy9DLE9BQU87U0FDVjtRQUVELElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ2xCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzthQUNsQyxTQUFTLENBQUMsQ0FBQyxNQUF1QjtZQUMvQixNQUFNO2lCQUNELFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDNUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsTUFBTSxFQUFFO2lCQUNSLE9BQU8sQ0FBQztnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7b0JBQ3ZDLE1BQU0sRUFBRSxFQUFFO29CQUNWLFFBQVEsRUFBRSxFQUFFO2lCQUNmLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRVAsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUN6QyxDQUFDLGVBQWUsRUFBRSxLQUFLO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDbEMsU0FBUyxDQUFDLENBQUMsRUFBRTtnQkFDVixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7cUJBQ3RCLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO3FCQUNoQyxRQUFRLENBQUMsQ0FBQyxVQUFVO29CQUNqQixJQUNJLFVBQVU7d0JBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUN0QyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FDaEMsRUFDSDt3QkFDRSxTQUFTLENBQ0wsSUFBSSxjQUFjLENBQ2QsdURBQXVELENBQzFELENBQ0osQ0FBQzt3QkFDRixPQUFPO3FCQUNWO29CQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUNqQyxLQUFLLENBQ1IsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO29CQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUMvQixDQUFDLENBQUM7O2dCQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDL0MsQ0FBQztpQkFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFO2dCQUNWLElBQUksV0FBVyxDQUNYLElBQUksQ0FBQyxHQUFHLEVBQ1IsRUFBRSxDQUFDLE9BQU8sRUFDVixJQUFJLENBQUMsTUFBTSxFQUNYLGVBQWUsQ0FBQyxhQUFhLENBQ2hDLENBQUM7Z0JBQ0YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7cUJBQ3hCLFFBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO3FCQUNsQyxRQUFRLENBQUMsQ0FBQyxZQUFZO29CQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDakMsS0FBSyxDQUNSLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztvQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztpQkFDL0IsQ0FBQyxDQUFDOztnQkFFUCxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2FBQy9DLENBQUM7aUJBQ0QsY0FBYyxDQUFDLENBQUMsRUFBRTtnQkFDZixFQUFFLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDO3FCQUN6QixVQUFVLENBQUMsU0FBUyxDQUFDO3FCQUNyQixPQUFPLENBQUM7b0JBQ0wsU0FBUyxDQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUNyQyxLQUFLLEVBQ0wsS0FBSyxHQUFHLENBQUMsQ0FDWixDQUFDO29CQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ1YsQ0FBQztpQkFDRCxjQUFjLENBQUMsQ0FBQyxFQUFFO2dCQUNmLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7cUJBQzNCLFVBQVUsQ0FBQyxXQUFXLENBQUM7cUJBQ3ZCLE9BQU8sQ0FBQztvQkFDTCxTQUFTLENBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQ3JDLEtBQUssRUFDTCxLQUFLLEdBQUcsQ0FBQyxDQUNaLENBQUM7b0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQixDQUFDLENBQUM7YUFDVixDQUFDO2lCQUNELGNBQWMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7cUJBQ2QsVUFBVSxDQUFDLFFBQVEsQ0FBQztxQkFDcEIsT0FBTyxDQUFDO29CQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FDeEMsS0FBSyxFQUNMLENBQUMsQ0FDSixDQUFDO29CQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQixDQUNKLENBQUM7S0FDTDtJQUVELDZCQUE2QjtRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQ1Asb0ZBQW9GLEVBQ3BGLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQ25CLHdDQUF3QyxFQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUNuQixxRkFBcUYsQ0FDeEYsQ0FBQztRQUVGLElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSztZQUMzRCxNQUFNLENBQUMsR0FBRyxJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQ2xDLFNBQVMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxXQUFXLENBQ1gsSUFBSSxDQUFDLEdBQUcsRUFDUixFQUFFLENBQUMsT0FBTyxFQUNWLElBQUksQ0FBQyxNQUFNLEVBQ1gsZUFBZSxDQUFDLGFBQWEsQ0FDaEMsQ0FBQztnQkFDRixFQUFFLENBQUMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDO3FCQUM5QyxRQUFRLENBQUMsUUFBUSxDQUFDO3FCQUNsQixRQUFRLENBQUMsQ0FBQyxZQUFZO29CQUNuQixJQUNJLFlBQVk7d0JBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUMzQyxZQUFZLENBQ2YsRUFDSDt3QkFDRSxTQUFTLENBQ0wsSUFBSSxjQUFjLENBQ2QscUNBQXFDLENBQ3hDLENBQ0osQ0FBQzt3QkFDRixPQUFPO3FCQUNWO29CQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQzt3QkFDekMsWUFBWSxDQUFDO29CQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUMvQixDQUFDLENBQUM7O2dCQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDL0MsQ0FBQztpQkFDRCxjQUFjLENBQUMsQ0FBQyxFQUFFO2dCQUNmLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO3FCQUNkLFVBQVUsQ0FBQyxRQUFRLENBQUM7cUJBQ3BCLE9BQU8sQ0FBQztvQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQ3pDLEtBQUssRUFDTCxDQUFDLENBQ0osQ0FBQztvQkFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztvQkFFNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsQixDQUFDLENBQUM7YUFDVixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUU7WUFDdkMsRUFBRSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQztpQkFDdkMsTUFBTSxFQUFFO2lCQUNSLE9BQU8sQ0FBQztnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUU1QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxDQUFDO0tBQ047SUFFRCxpQ0FBaUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUVuRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUNQLDBHQUEwRyxFQUMxRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUNuQixtREFBbUQsRUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsWUFBWSxFQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2YsSUFBSSxFQUFFLDJDQUEyQztZQUNqRCxJQUFJLEVBQUUsZUFBZTtTQUN4QixDQUFDLEVBQ0YseUJBQXlCLENBQzVCLENBQUM7UUFFRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLDhCQUE4QixDQUFDO2FBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDYixTQUFTLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztpQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO2lCQUNsRCxRQUFRLENBQUMsQ0FBQyxVQUFVO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDL0IsQ0FBQyxDQUFDOztZQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDL0MsQ0FBQyxDQUFDO1FBRVAsSUFBSSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQ3pDLElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUMzQyxJQUFJLEdBQUcsNEJBQTRCLENBQUM7U0FDdkM7YUFBTTtZQUNILE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUMxQixNQUNJLHNCQUFzQixDQUNsQixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUMzQyxFQUNMLG1DQUFtQyxDQUN0QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDOUIsSUFBSSxHQUFHLDBCQUEwQixDQUFDO2FBQ3JDO2lCQUFNO2dCQUNILElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtvQkFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTt3QkFDekIsS0FBSyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTs0QkFDaEIsSUFBSSxFQUFFLFdBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRTt5QkFDbkMsQ0FBQyxDQUNMLENBQUM7cUJBQ0w7aUJBQ0o7Z0JBQ0QsSUFBSSxHQUFHLFlBQVksS0FBSyxpQkFBaUIsQ0FBQzthQUM3QztTQUNKO1FBRUQsSUFBSUEsdUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDYixPQUFPLENBQUMsSUFBSSxDQUFDO2FBQ2IsY0FBYyxDQUFDLENBQUMsS0FBSztZQUNsQixLQUFLO2lCQUNBLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsVUFBVSxDQUFDLFNBQVMsQ0FBQztpQkFDckIsT0FBTyxDQUFDOztnQkFFTCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1NBQ1YsQ0FBQyxDQUFDO0tBQ1Y7SUFFRCx5Q0FBeUM7UUFDckMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FDUCxnRUFBZ0UsRUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDZixJQUFJLEVBQUUsV0FBVztTQUNwQixDQUFDLEVBQ0Ysc0pBQXNKLENBQ3pKLENBQUM7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsSUFBSSxFQUFFLCtCQUErQjtTQUN4QyxDQUFDLENBQUM7UUFFSCxJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEIsT0FBTyxDQUFDLHNDQUFzQyxDQUFDO2FBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDYixTQUFTLENBQUMsQ0FBQyxNQUFNO1lBQ2QsTUFBTTtpQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7aUJBQ3JELFFBQVEsQ0FBQyxDQUFDLHNCQUFzQjtnQkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsc0JBQXNCO29CQUN2QyxzQkFBc0IsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7Z0JBRTVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNsQixDQUFDLENBQUM7U0FDVixDQUFDLENBQUM7UUFFUCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQzdDLElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLGtEQUFrRCxDQUFDO2lCQUMzRCxPQUFPLENBQUMsQ0FBQyxJQUFJO2dCQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO3FCQUN6QixRQUFRLENBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUNsRDtxQkFDQSxRQUFRLENBQUMsQ0FBQyxTQUFTO29CQUNoQixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3RDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO3dCQUNwQixTQUFTLENBQ0wsSUFBSSxjQUFjLENBQ2QsMEJBQTBCLENBQzdCLENBQ0osQ0FBQzt3QkFDRixPQUFPO3FCQUNWO29CQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUM7b0JBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQy9CLENBQUMsQ0FBQzthQUNWLENBQUMsQ0FBQztZQUVQLElBQUksR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUNQLDREQUE0RCxFQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUNuQiwyRkFBMkYsRUFDM0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsb0ZBQW9GLENBQ3ZGLENBQUM7WUFDRixJQUFJQSx1QkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQ3hCLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztpQkFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQztpQkFDYixPQUFPLENBQUMsQ0FBQyxJQUFJO2dCQUNWLElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUM7cUJBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7cUJBQ3pDLFFBQVEsQ0FBQyxDQUFDLFVBQVU7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQy9CLENBQUMsQ0FBQzthQUNWLENBQUMsQ0FBQztZQUVQLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhO2dCQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO29CQUMxQyxJQUFJLEVBQUUsa0JBQWtCLEdBQUcsQ0FBQztpQkFDL0IsQ0FBQyxDQUFDO2dCQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFbEMsTUFBTSxPQUFPLEdBQUcsSUFBSUEsdUJBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO3FCQUN4QyxjQUFjLENBQUMsQ0FBQyxLQUFLO29CQUNsQixLQUFLO3lCQUNBLE9BQU8sQ0FBQyxPQUFPLENBQUM7eUJBQ2hCLFVBQVUsQ0FBQyxRQUFRLENBQUM7eUJBQ3BCLE9BQU8sQ0FBQzt3QkFDTCxNQUFNLEtBQUssR0FDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUN4QyxhQUFhLENBQ2hCLENBQUM7d0JBQ04sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FDdkMsS0FBSyxFQUNMLENBQUMsQ0FDSixDQUFDOzRCQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7OzRCQUU1QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztpQkFDVixDQUFDO3FCQUNELE9BQU8sQ0FBQyxDQUFDLElBQUk7b0JBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSTt5QkFDVCxjQUFjLENBQUMsZUFBZSxDQUFDO3lCQUMvQixRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMxQixRQUFRLENBQUMsQ0FBQyxTQUFTO3dCQUNoQixNQUFNLEtBQUssR0FDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUN4QyxhQUFhLENBQ2hCLENBQUM7d0JBQ04sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUNoQyxLQUFLLENBQ1IsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7NEJBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7eUJBQy9CO3FCQUNKLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUV6QyxPQUFPLENBQUMsQ0FBQztpQkFDWixDQUFDO3FCQUNELFdBQVcsQ0FBQyxDQUFDLElBQUk7b0JBQ2QsTUFBTSxDQUFDLEdBQUcsSUFBSTt5QkFDVCxjQUFjLENBQUMsZ0JBQWdCLENBQUM7eUJBQ2hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFCLFFBQVEsQ0FBQyxDQUFDLE9BQU87d0JBQ2QsTUFBTSxLQUFLLEdBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FDeEMsYUFBYSxDQUNoQixDQUFDO3dCQUNOLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFOzRCQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FDaEMsS0FBSyxDQUNSLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDOzRCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7eUJBQy9CO3FCQUNKLENBQUMsQ0FBQztvQkFFUCxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUVwQyxPQUFPLENBQUMsQ0FBQztpQkFDWixDQUFDLENBQUM7Z0JBRVAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFeEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUU1QyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRS9CLE1BQU0sT0FBTyxHQUFHLElBQUlBLHVCQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FDbkQsQ0FBQyxNQUFNO2dCQUNILE1BQU07cUJBQ0QsYUFBYSxDQUFDLHVCQUF1QixDQUFDO3FCQUN0QyxNQUFNLEVBQUU7cUJBQ1IsT0FBTyxDQUFDO29CQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7b0JBRTVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEIsQ0FBQyxDQUFDO2FBQ1YsQ0FDSixDQUFDO1lBQ0YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUV4QixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDL0M7S0FDSjs7O0FDM3dCTCxJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDaEIsMkRBQWMsQ0FBQTtJQUNkLG1FQUFrQixDQUFBO0FBQ3RCLENBQUMsRUFIVyxRQUFRLEtBQVIsUUFBUSxRQUduQjtNQUVZLGNBQWUsU0FBUUMsaUNBQXdCO0lBTXhELFlBQVksR0FBUSxFQUFFLE1BQXVCO1FBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQ3JEO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDNUM7UUFDRCxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FDMUIsTUFDSSxzQkFBc0IsQ0FDbEIsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDeEMsRUFDTCwwREFBMEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FDcEcsQ0FBQztRQUNGLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxXQUFXLENBQUMsSUFBVztRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDeEI7SUFFRCxZQUFZLENBQUMsSUFBVztRQUNwQixRQUFRLElBQUksQ0FBQyxTQUFTO1lBQ2xCLEtBQUssUUFBUSxDQUFDLGNBQWM7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRCxNQUFNO1lBQ1YsS0FBSyxRQUFRLENBQUMsa0JBQWtCO2dCQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDL0MsSUFBSSxFQUNKLElBQUksQ0FBQyxlQUFlLENBQ3ZCLENBQUM7Z0JBQ0YsTUFBTTtTQUNiO0tBQ0o7SUFFRCxLQUFLO1FBQ0QsSUFBSTtZQUNBLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7S0FDSjtJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2hCO0lBRUQsNkJBQTZCLENBQUMsTUFBZ0I7UUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2hCOzs7QUM3RUUsTUFBTSwyQkFBMkIsR0FBRyxpQ0FBaUMsQ0FBQztBQUN0RSxNQUFNLFNBQVMsR0FBRyxzeERBQXN4RDs7TUNJenhELGNBQWM7SUFPaEMsWUFBc0IsR0FBUSxFQUFZLE1BQXVCO1FBQTNDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUx2RCxxQkFBZ0IsR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNuRCxzQkFBaUIsR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztLQUlPO0lBRXJFLE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEI7SUFLSyxJQUFJOztZQUNOLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2xFO0tBQUE7SUFFSyxlQUFlLENBQ2pCLFVBQXlCOztZQUV6QixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztZQUN6QixNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBRXRDLHVDQUNPLElBQUksQ0FBQyxhQUFhLEdBQ2xCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQy9DO1NBQ0w7S0FBQTs7O01DakNRLGtCQUFtQixTQUFRLGNBQWM7SUFBdEQ7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztLQW1GeEI7SUFqRlMsdUJBQXVCOztZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztTQUNyRTtLQUFBO0lBRUssd0JBQXdCOytEQUFvQjtLQUFBO0lBRWxELFlBQVk7UUFNUixPQUFPLENBQ0gsTUFBTSxHQUFHLFlBQVksRUFDckIsTUFBd0IsRUFDeEIsU0FBa0IsRUFDbEIsZ0JBQXlCO1lBRXpCLElBQ0ksU0FBUztnQkFDVCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxFQUFFLEVBQ3ZEO2dCQUNFLE1BQU0sSUFBSSxjQUFjLENBQ3BCLHdGQUF3RixDQUMzRixDQUFDO2FBQ0w7WUFDRCxJQUFJLFFBQVEsQ0FBQztZQUNiLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO2dCQUM1QixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDN0M7aUJBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDckQ7WUFFRCxPQUFPLE1BQU07aUJBQ1IsTUFBTSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDbkMsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkIsQ0FBQztLQUNMO0lBRUQsaUJBQWlCO1FBQ2IsT0FBTyxDQUFDLE1BQU0sR0FBRyxZQUFZO1lBQ3pCLE9BQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hELENBQUM7S0FDTDtJQUVELGdCQUFnQjtRQU1aLE9BQU8sQ0FDSCxNQUFNLEdBQUcsWUFBWSxFQUNyQixPQUFlLEVBQ2YsU0FBa0IsRUFDbEIsZ0JBQXlCO1lBRXpCLElBQ0ksU0FBUztnQkFDVCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxFQUFFLEVBQ3ZEO2dCQUNFLE1BQU0sSUFBSSxjQUFjLENBQ3BCLHdGQUF3RixDQUMzRixDQUFDO2FBQ0w7WUFDRCxPQUFPLE1BQU07aUJBQ1IsTUFBTSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDbkMsT0FBTyxDQUFDLE9BQU8sQ0FBQztpQkFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCLENBQUM7S0FDTDtJQUVELGtCQUFrQjtRQUNkLE9BQU8sQ0FBQyxNQUFNLEdBQUcsWUFBWTtZQUN6QixPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pELENBQUM7S0FDTDs7O0FDdEVFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztNQUVqQixrQkFBbUIsU0FBUSxjQUFjO0lBQXREOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDYixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUNsQixxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsbUJBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBMFM3RDtJQXhTUyx1QkFBdUI7O1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQ3JCLGVBQWUsRUFDZixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FDaEMsQ0FBQztZQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FDckIsZUFBZSxFQUNmLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUNoQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQ3JCLG9CQUFvQixFQUNwQixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FDckMsQ0FBQztZQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7U0FDckU7S0FBQTtJQUVLLHdCQUF3Qjs7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1NBQzlEO0tBQUE7SUFFSyxnQkFBZ0I7O1lBQ2xCLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM3RDtLQUFBO0lBRUQsbUJBQW1CO1FBTWYsT0FBTyxDQUNILFFBQXdCLEVBQ3hCLFFBQWdCLEVBQ2hCLFFBQVEsR0FBRyxLQUFLLEVBQ2hCLE1BQWdCO1lBRWhCLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLElBQUksY0FBYyxDQUNwQiwyQ0FBMkMsQ0FDOUMsQ0FBQzthQUNMO1lBRUQsTUFBTSxRQUFRLEdBQ1YsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDckQsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsUUFBUSxDQUNYLENBQUM7WUFFTixJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO1lBRTNCLE9BQU8sUUFBUSxDQUFDO1NBQ25CLENBQUEsQ0FBQztLQUNMO0lBRUQsc0JBQXNCO1FBQ2xCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsa0JBQWtCO1lBQy9CLE9BQU8sTUFBTTtpQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCLENBQUM7S0FDTDtJQUVELGVBQWU7UUFDWCxPQUFPLENBQUMsS0FBYzs7WUFFbEIsT0FBTyxxQkFBcUIsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksRUFBRSxNQUFNLENBQUM7U0FDakQsQ0FBQztLQUNMO0lBRUQsc0JBQXNCO1FBQ2xCLE9BQU8sQ0FBQyxPQUFlO1lBQ25CLE1BQU0sV0FBVyxHQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDQyw0QkFBWSxDQUFDLENBQUM7WUFDekQsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO2dCQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FDakIsSUFBSSxjQUFjLENBQ2QseUNBQXlDLENBQzVDLENBQ0osQ0FBQztnQkFDRixPQUFPO2FBQ1Y7WUFFRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsT0FBTyxFQUFFLENBQUM7U0FDYixDQUFDO0tBQ0w7SUFFRCxlQUFlO1FBQ1gsT0FBTyxDQUFDLFFBQWdCOztZQUVwQixJQUFJLEtBQUssQ0FBQztZQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxFQUFFO2dCQUN2RCxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQ3BELFFBQVEsRUFDUixFQUFFLENBQ0wsQ0FBQztZQUNGLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQztTQUN2QixDQUFDO0tBQ0w7SUFFRCxtQkFBbUI7UUFDZixPQUFPLENBQUMsUUFBZ0I7WUFDcEIsTUFBTSxJQUFJLEdBQUdOLDZCQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEUsQ0FBQztLQUNMO0lBRUQsZUFBZTtRQUNYLE9BQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSztZQUNwQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxNQUFNLENBQUM7WUFFWCxJQUFJLFFBQVEsRUFBRTtnQkFDVixNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzthQUN4QjtpQkFBTTtnQkFDSCxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzthQUN4QjtZQUVELE9BQU8sTUFBTSxDQUFDO1NBQ2pCLENBQUM7S0FDTDtJQUVELGdCQUFnQjtRQUNaLE9BQU8sQ0FBTyxZQUE0Qjs7OztZQUd0QyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztZQUN4QixJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxJQUFJLGNBQWMsQ0FDcEIsMENBQTBDLENBQzdDLENBQUM7YUFDTDtZQUVELElBQUksZ0JBQXdCLENBQUM7WUFFN0IsSUFBSSxZQUFZLFlBQVlDLHFCQUFLLEVBQUU7Z0JBQy9CLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNILElBQUksS0FBSyxDQUFDO2dCQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxFQUFFO29CQUMzRCxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxJQUFJLGNBQWMsQ0FDcEIsK0RBQStELENBQ2xFLENBQUM7aUJBQ0w7Z0JBQ0QsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBR00sNkJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQ3hELElBQUksRUFDSixFQUFFLENBQ0wsQ0FBQztnQkFDRixJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNYLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDO29CQUN4QixNQUFNLElBQUksY0FBYyxDQUNwQixRQUFRLFlBQVksZ0JBQWdCLENBQ3ZDLENBQUM7aUJBQ0w7Z0JBQ0QsZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXZELElBQUksT0FBTyxFQUFFO29CQUNULE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxLQUFLLEVBQUU7d0JBQ1AsTUFBTSxNQUFNLEdBQUdDLDhCQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLE1BQU0sRUFBRTs0QkFDUixnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUNuQixNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLE1BQU0sQ0FDckIsQ0FBQzt5QkFDTDtxQkFDSjtpQkFDSjthQUNKO1lBRUQsSUFBSTtnQkFDQSxNQUFNLGNBQWMsR0FDaEIsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUM3QyxnQkFBZ0IsRUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQ2pELENBQUM7Z0JBQ04sSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sY0FBYyxDQUFDO2FBQ3pCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxDQUFDO2FBQ1g7U0FDSixDQUFBLENBQUM7S0FDTDtJQUVELDJCQUEyQjtRQUN2QixPQUFPLENBQUMsTUFBTSxHQUFHLGtCQUFrQjtZQUMvQixPQUFPLE1BQU07aUJBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QixDQUFDO0tBQ0w7SUFFRCxhQUFhO1FBQ1QsT0FBTyxDQUFPLElBQVk7WUFDdEIsTUFBTSxRQUFRLEdBQUdSLDZCQUFhLENBQzFCLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUNqRCxDQUFDO1lBQ0YsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUN2QixRQUFRLENBQ1gsQ0FBQztZQUNGLE9BQU8sRUFBRSxDQUFDO1NBQ2IsQ0FBQSxDQUFDO0tBQ0w7SUFFRCxhQUFhO1FBQ1QsT0FBTyxDQUFDLFFBQVEsR0FBRyxLQUFLOztZQUVwQixJQUFJUyx3QkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsT0FBTywyQkFBMkIsQ0FBQzthQUN0QztZQUNELElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVlDLGlDQUFpQixDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxjQUFjLENBQ3BCLCtDQUErQyxDQUNsRCxDQUFDO2FBQ0w7WUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFeEQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7YUFDdkM7aUJBQU07Z0JBQ0gsT0FBTyxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMxRDtTQUNKLENBQUM7S0FDTDtJQUVELGVBQWU7UUFDWCxPQUFPLENBQU8sU0FBaUI7WUFDM0IsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM3QixNQUFNLElBQUksY0FBYyxDQUNwQiwwREFBMEQsQ0FDN0QsQ0FBQzthQUNMO1lBQ0QsTUFBTSxRQUFRLEdBQUdWLDZCQUFhLENBQzFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQzdGLENBQUM7WUFDRixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQ3ZCLFFBQVEsQ0FDWCxDQUFDO1lBQ0YsT0FBTyxFQUFFLENBQUM7U0FDYixDQUFBLENBQUM7S0FDTDtJQUVELGtCQUFrQjtRQUNkLE9BQU87WUFDSCxNQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQ00sNEJBQVksQ0FBQyxDQUFDO1lBQ3pELElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtnQkFDckIsTUFBTSxJQUFJLGNBQWMsQ0FDcEIsNENBQTRDLENBQy9DLENBQUM7YUFDTDtZQUVELE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsT0FBTyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDaEMsQ0FBQztLQUNMOztJQUdELGFBQWE7UUFDVCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUMxQixDQUFDO1FBQ0YsT0FBT0ssMEJBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM1Qjs7SUFHRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7S0FDM0M7OztNQzVUUSxpQkFBa0IsU0FBUSxjQUFjO0lBQXJEOztRQUNJLFNBQUksR0FBRyxLQUFLLENBQUM7S0ErQ2hCO0lBN0NTLHVCQUF1Qjs7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUNyQixnQkFBZ0IsRUFDaEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQ2pDLENBQUM7U0FDTDtLQUFBO0lBRUssd0JBQXdCOytEQUFvQjtLQUFBO0lBRTVDLFVBQVUsQ0FBQyxHQUFXOztZQUN4QixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDZCxNQUFNLElBQUksY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUM7YUFDNUQ7WUFDRCxPQUFPLFFBQVEsQ0FBQztTQUNuQjtLQUFBO0lBRUQsb0JBQW9CO1FBQ2hCLE9BQU87WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUNsRSxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssS0FBSyxxQkFBcUIsTUFBTSxTQUFTLENBQUM7WUFFbkUsT0FBTyxXQUFXLENBQUM7U0FDdEIsQ0FBQSxDQUFDO0tBQ0w7SUFFRCx1QkFBdUI7UUFJbkIsT0FBTyxDQUFPLElBQVksRUFBRSxLQUFjO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDbEMsc0NBQXNDLElBQUksYUFBSixJQUFJLGNBQUosSUFBSSxHQUFJLEVBQUUsSUFDNUMsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksRUFDYixFQUFFLENBQ0wsQ0FBQztZQUNGLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDekIsT0FBTyw0QkFBNEIsR0FBRyxHQUFHLENBQUM7U0FDN0MsQ0FBQSxDQUFDO0tBQ0w7OztNQ2hEUSx5QkFBMEIsU0FBUSxjQUFjO0lBQTdEOztRQUNXLFNBQUksR0FBRyxhQUFhLENBQUM7S0FZL0I7SUFWUyx1QkFBdUI7K0RBQW9CO0tBQUE7SUFFM0Msd0JBQXdCOztZQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUMxQixDQUFDO1lBQ0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsS0FBSSxFQUFFLENBQUMsQ0FDM0MsQ0FBQztTQUNMO0tBQUE7OztNQ1hRLFdBQVksU0FBUUMscUJBQUs7SUFNbEMsWUFDSSxHQUFRLEVBQ0EsV0FBbUIsRUFDbkIsYUFBcUI7UUFFN0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSEgsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFMekIsY0FBUyxHQUFHLEtBQUssQ0FBQztLQVF6QjtJQUVELE1BQU07UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ3JCO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7U0FDdkQ7S0FDSjtJQUVELFVBQVU7O1FBQ04sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFckMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQVE7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEIsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBQSxJQUFJLENBQUMsYUFBYSxtQ0FBSSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzFCO0lBRUssZUFBZSxDQUNqQixPQUFnQyxFQUNoQyxNQUF5Qzs7WUFFekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7S0FBQTs7O01DdkRRLGNBQWtCLFNBQVFQLGlDQUFvQjtJQUt2RCxZQUNJLEdBQVEsRUFDQSxVQUE0QyxFQUM1QyxLQUFVLEVBQ2xCLFdBQW1CO1FBRW5CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUpILGVBQVUsR0FBVixVQUFVLENBQWtDO1FBQzVDLFVBQUssR0FBTCxLQUFLLENBQUs7UUFMZCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBU3RCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEM7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ3JCO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0o7SUFFRCxnQkFBZ0IsQ0FDWixLQUFvQixFQUNwQixHQUErQjtRQUUvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsV0FBVyxDQUFDLElBQU87UUFDZixJQUFJLElBQUksQ0FBQyxVQUFVLFlBQVksUUFBUSxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQztRQUNELFFBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLHFCQUFxQixFQUNwRTtLQUNMO0lBRUQsWUFBWSxDQUFDLElBQU87UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QjtJQUVLLGVBQWUsQ0FDakIsT0FBMkIsRUFDM0IsTUFBeUM7O1lBRXpDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO0tBQUE7OztNQ2xEUSxvQkFBcUIsU0FBUSxjQUFjO0lBQXhEOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7S0FzRjFCO0lBcEZTLHVCQUF1Qjs7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1NBQ3JFO0tBQUE7SUFFSyx3QkFBd0I7K0RBQW9CO0tBQUE7SUFFbEQsa0JBQWtCO1FBQ2QsT0FBTzs7WUFFSCxJQUFJSSx3QkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsT0FBTywyQkFBMkIsQ0FBQzthQUN0QztZQUNELE9BQU8sTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQy9DLENBQUEsQ0FBQztLQUNMO0lBRUQsZUFBZTtRQUtYLE9BQU8sQ0FDSCxXQUFtQixFQUNuQixhQUFxQixFQUNyQixlQUFlLEdBQUcsS0FBSztZQUV2QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FDMUIsSUFBSSxDQUFDLEdBQUcsRUFDUixXQUFXLEVBQ1gsYUFBYSxDQUNoQixDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQ3ZCLENBQ0ksT0FBZ0MsRUFDaEMsTUFBeUMsS0FDeEMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQy9DLENBQUM7WUFDRixJQUFJO2dCQUNBLE9BQU8sTUFBTSxPQUFPLENBQUM7YUFDeEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixJQUFJLGVBQWUsRUFBRTtvQkFDakIsTUFBTSxLQUFLLENBQUM7aUJBQ2Y7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKLENBQUEsQ0FBQztLQUNMO0lBRUQsa0JBQWtCO1FBTWQsT0FBTyxDQUNILFVBQTRDLEVBQzVDLEtBQVUsRUFDVixlQUFlLEdBQUcsS0FBSyxFQUN2QixXQUFXLEdBQUcsRUFBRTtZQUVoQixNQUFNLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FDaEMsSUFBSSxDQUFDLEdBQUcsRUFDUixVQUFVLEVBQ1YsS0FBSyxFQUNMLFdBQVcsQ0FDZCxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQ3ZCLENBQ0ksT0FBMkIsRUFDM0IsTUFBeUMsS0FDeEMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQ2xELENBQUM7WUFDRixJQUFJO2dCQUNBLE9BQU8sTUFBTSxPQUFPLENBQUM7YUFDeEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixJQUFJLGVBQWUsRUFBRTtvQkFDakIsTUFBTSxLQUFLLENBQUM7aUJBQ2Y7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKLENBQUEsQ0FBQztLQUNMOzs7TUMxRlEsb0JBQXFCLFNBQVEsY0FBYztJQUF4RDs7UUFDVyxTQUFJLEdBQUcsUUFBUSxDQUFDO0tBVzFCO0lBVFMsdUJBQXVCOytEQUFvQjtLQUFBO0lBRTNDLHdCQUF3QjsrREFBb0I7S0FBQTtJQUU1QyxlQUFlLENBQ2pCLE1BQXFCOztZQUVyQixPQUFPLE1BQU0sQ0FBQztTQUNqQjtLQUFBOzs7TUNEUSxpQkFBaUI7SUFHMUIsWUFBc0IsR0FBUSxFQUFZLE1BQXVCO1FBQTNDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUZ6RCxrQkFBYSxHQUEwQixFQUFFLENBQUM7UUFHOUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ25CLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQ3ZELENBQUM7UUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDbkIsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDbEQsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNuQixJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUNsRCxDQUFDO0tBQ0w7SUFFSyxJQUFJOztZQUNOLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbEMsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEI7U0FDSjtLQUFBO0lBRUssZUFBZSxDQUNqQixNQUFxQjs7WUFFckIsTUFBTSx5QkFBeUIsR0FBK0IsRUFBRSxDQUFDO1lBRWpFLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbEMseUJBQXlCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNwQyxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekM7WUFFRCxPQUFPLHlCQUF5QixDQUFDO1NBQ3BDO0tBQUE7OztNQ3JDUSxtQkFBbUI7SUFPNUIsWUFBWSxHQUFRLEVBQVUsTUFBdUI7UUFBdkIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDakQsSUFDSUEsd0JBQVEsQ0FBQyxXQUFXO1lBQ3BCLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVlDLGlDQUFpQixDQUFDLEVBQ25EO1lBQ0UsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDakI7YUFBTTtZQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBR0csY0FBUyxDQUFDQyxrQkFBSSxDQUFDLENBQUM7U0FDdkM7S0FDSjs7SUFHSyx5QkFBeUIsQ0FDM0IsTUFBcUI7O1lBSXJCLE1BQU0scUJBQXFCLEdBR3ZCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxNQUFNLHlCQUF5QixHQUMzQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FDM0QsTUFBTSxFQUNOLGFBQWEsQ0FBQyxRQUFRLENBQ3pCLENBQUM7WUFFTixLQUFLLE1BQU0sYUFBYSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtnQkFDOUQsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ25CLFNBQVM7aUJBQ1o7Z0JBRUQsSUFBSUwsd0JBQVEsQ0FBQyxXQUFXLEVBQUU7b0JBQ3RCLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7d0JBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQ3ZCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUN2QyxDQUFDO3FCQUNMLENBQUMsQ0FBQztpQkFDTjtxQkFBTTtvQkFDSCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUNuRCxHQUFHLEVBQ0gseUJBQXlCLENBQzVCLENBQUM7b0JBRUYscUJBQXFCLENBQUMsR0FBRyxDQUNyQixRQUFRLEVBQ1IsQ0FDSSxTQUFtQzt3QkFFbkMsTUFBTSxXQUFXLG1DQUNWLE9BQU8sQ0FBQyxHQUFHLEdBQ1gsU0FBUyxDQUNmLENBQUM7d0JBRUYsTUFBTSxXQUFXLG1CQUNiLE9BQU8sRUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxFQUMvQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFDYixHQUFHLEVBQUUsV0FBVyxLQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFBSTs0QkFDbkMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVU7eUJBQ3pDLEVBQ0osQ0FBQzt3QkFFRixJQUFJOzRCQUNBLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQ3RDLEdBQUcsRUFDSCxXQUFXLENBQ2QsQ0FBQzs0QkFDRixPQUFPLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzt5QkFDN0I7d0JBQUMsT0FBTyxLQUFLLEVBQUU7NEJBQ1osTUFBTSxJQUFJLGNBQWMsQ0FDcEIsNEJBQTRCLFFBQVEsRUFBRSxFQUN0QyxLQUFLLENBQ1IsQ0FBQzt5QkFDTDtxQkFDSixDQUFBLENBQ0osQ0FBQztpQkFDTDthQUNKO1lBQ0QsT0FBTyxxQkFBcUIsQ0FBQztTQUNoQztLQUFBO0lBRUssZUFBZSxDQUNqQixNQUFxQjs7WUFFckIsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FDOUQsTUFBTSxDQUNULENBQUM7WUFDRixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUNwRDtLQUFBOzs7TUN2R1EsbUJBQW1CO0lBQzVCLFlBQW9CLEdBQVEsRUFBVSxNQUF1QjtRQUF6QyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7S0FBSTtJQUUzRCw4QkFBOEIsQ0FDaEMsTUFBcUI7O1lBRXJCLE1BQU0scUJBQXFCLEdBQTBCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDL0QsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQzFCLE1BQ0ksc0JBQXNCLENBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQzNDLEVBQ0wscUNBQXFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLENBQ25GLENBQUM7WUFDRixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNSLE9BQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNwQjtZQUVELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxFQUFFO29CQUN2QyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FDaEMsTUFBTSxFQUNOLElBQUksRUFDSixxQkFBcUIsQ0FDeEIsQ0FBQztpQkFDTDthQUNKO1lBQ0QsT0FBTyxxQkFBcUIsQ0FBQztTQUNoQztLQUFBO0lBRUsseUJBQXlCLENBQzNCLE1BQXFCLEVBQ3JCLElBQVcsRUFDWCxxQkFBNEM7O1lBRTVDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVlDLGlDQUFpQixDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxjQUFjLENBQ3BCLCtDQUErQyxDQUNsRCxDQUFDO2FBQ0w7WUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEQsTUFBTSxTQUFTLEdBQUcsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOzs7WUFJL0MsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN2RCxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDbEU7WUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLG1GQUFPLFNBQVMsTUFBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO2dCQUN4QixNQUFNLElBQUksY0FBYyxDQUNwQiw4QkFBOEIsU0FBUyx3QkFBd0IsQ0FDbEUsQ0FBQzthQUNMO1lBQ0QsSUFBSSxFQUFFLGFBQWEsQ0FBQyxPQUFPLFlBQVksUUFBUSxDQUFDLEVBQUU7Z0JBQzlDLE1BQU0sSUFBSSxjQUFjLENBQ3BCLDhCQUE4QixTQUFTLHFDQUFxQyxDQUMvRSxDQUFDO2FBQ0w7WUFDRCxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3hFO0tBQUE7SUFFSyxlQUFlLENBQ2pCLE1BQXFCOztZQUVyQixNQUFNLHFCQUFxQixHQUFHLE1BQU0sSUFBSSxDQUFDLDhCQUE4QixDQUNuRSxNQUFNLENBQ1QsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3BEO0tBQUE7OztNQ3ZFUSxhQUFhO0lBSXRCLFlBQVksR0FBUSxFQUFVLE1BQXVCO1FBQXZCLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQ2pELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDckU7SUFFSyxlQUFlLENBQ2pCLE1BQXFCOztZQUVyQixJQUFJLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztZQUMvQixJQUFJLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztZQUUvQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO2dCQUM3QyxxQkFBcUI7b0JBQ2pCLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoRTs7O1lBSUQsSUFBSUQsd0JBQVEsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ25FLHFCQUFxQjtvQkFDakIsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2hFO1lBRUQsdUNBQ08scUJBQXFCLEdBQ3JCLHFCQUFxQixFQUMxQjtTQUNMO0tBQUE7OztBQzlCTCxJQUFZLGFBR1g7QUFIRCxXQUFZLGFBQWE7SUFDckIseURBQVEsQ0FBQTtJQUNSLG1FQUFhLENBQUE7QUFDakIsQ0FBQyxFQUhXLGFBQWEsS0FBYixhQUFhLFFBR3hCO01BRVksa0JBQWtCO0lBSTNCLFlBQW9CLEdBQVEsRUFBVSxNQUF1QjtRQUF6QyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDekQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNsRTtJQUVLLElBQUk7O1lBQ04sTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEM7S0FBQTtJQUVELG9CQUFvQjtRQUNoQixPQUFPO1lBQ0gsUUFBUSxFQUFFTSwwQkFBZTtTQUM1QixDQUFDO0tBQ0w7SUFFSyxlQUFlLENBQ2pCLE1BQXFCLEVBQ3JCLGlCQUFnQyxhQUFhLENBQUMsYUFBYTs7WUFFM0QsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEUsTUFBTSx5QkFBeUIsR0FDM0IsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELElBQUkscUJBQXFCLEdBQUcsRUFBRSxDQUFDO1lBRS9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFDekQsUUFBUSxjQUFjO2dCQUNsQixLQUFLLGFBQWEsQ0FBQyxRQUFRO29CQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO29CQUN2RCxNQUFNO2dCQUNWLEtBQUssYUFBYSxDQUFDLGFBQWE7b0JBQzVCLHFCQUFxQjt3QkFDakIsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLGtDQUNuQix5QkFBeUIsS0FDNUIsSUFBSSxFQUFFLHFCQUFxQixJQUM3QixDQUFDO29CQUNILE1BQU07YUFDYjtZQUVELE9BQU8sWUFBWSxDQUFDO1NBQ3ZCO0tBQUE7OztNQ2xEUSxZQUFZO0lBQ3JCLFlBQW9CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO0tBQUk7SUFFMUIsNEJBQTRCOztZQUM5QixNQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQ1QsNEJBQVksQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2QsT0FBTzthQUNWO1lBQ0QsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNyQyxNQUFNLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV6QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV2RCxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUM1QixJQUFJLENBQUMsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdkM7U0FDSjtLQUFBO0lBRUQsOEJBQThCLENBQzFCLE9BQWUsRUFDZixLQUFhO1FBRWIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQztZQUFDLENBQUM7UUFDbEUsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUVaLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFekQsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQzlCO0lBRUQsZ0NBQWdDLENBQUMsT0FBZTtRQUk1QyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxLQUFLLENBQUM7UUFDVixNQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FDM0Isc0RBQXNELEVBQ3RELEdBQUcsQ0FDTixDQUFDO1FBRUYsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNqRCxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2QyxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO1NBQzdCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDckIsS0FBSyxNQUFNLEtBQUssSUFBSSxjQUFjLEVBQUU7WUFDaEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7WUFDekMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFcEUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkUsWUFBWSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7O1lBR2hDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDakIsTUFBTTthQUNUO1NBQ0o7UUFFRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7S0FDekQ7SUFFRCxtQkFBbUIsQ0FBQyxTQUEyQjtRQUMzQyxNQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQ0EsNEJBQVksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxPQUFPO1NBQ1Y7UUFFRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLE1BQU0sVUFBVSxHQUE4QixFQUFFLENBQUM7UUFDakQsS0FBSyxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUU7WUFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsTUFBTSxXQUFXLEdBQXNCO1lBQ25DLFVBQVUsRUFBRSxVQUFVO1NBQ3pCLENBQUM7UUFDRixNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25DOzs7QUNoSEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDaEIsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLENBQUMsRUFBRSxVQUFVLFVBQVUsRUFBRTtBQUV6QjtBQUNBLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxNQUFNLEVBQUUsWUFBWSxFQUFFO0FBQ3hFLFFBQVEsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMzQyxRQUFRLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDM0QsUUFBUSxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0FBQzdDLFFBQVEsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUM7QUFDdkQsUUFBUSxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztBQUMzRCxRQUFRLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDM0MsUUFBUSxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsY0FBYyxJQUFJLGtCQUFrQixDQUFDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxZQUFZO0FBQ3BDLFlBQVksU0FBUyxFQUFFLENBQUMsSUFBSSxFQUFFO0FBQzlCLGdCQUFnQixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFDeEQsYUFBYTtBQUNiLFlBQVksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNuQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDbkMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ25DLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLFlBQVksSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztBQUN6QyxnQkFBZ0IsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdkQ7QUFDQSxZQUFZLE9BQU87QUFDbkIsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQzVCLGdCQUFnQixLQUFLLEVBQUUsQ0FBQztBQUN4QixnQkFBZ0IsSUFBSSxFQUFFLENBQUM7QUFDdkIsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0FBQ3ZCLGdCQUFnQixFQUFFLEVBQUUsQ0FBQztBQUNyQixnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDdEIsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDO0FBQzFCLGdCQUFnQixNQUFNLEVBQUUsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxFQUFFLENBQUM7QUFDeEIsZ0JBQWdCLFFBQVEsRUFBRSxDQUFDO0FBQzNCLGdCQUFnQixHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUM5QixnQkFBZ0IsTUFBTSxFQUFFLENBQUM7QUFDekIsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0FBQ3ZCLGdCQUFnQixLQUFLLEVBQUUsQ0FBQztBQUN4QixnQkFBZ0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7QUFDeEMsZ0JBQWdCLEdBQUcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQzlCLGdCQUFnQixLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNoQyxnQkFBZ0IsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDOUIsZ0JBQWdCLFFBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ3hDLGdCQUFnQixLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxnQkFBZ0IsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDOUIsZ0JBQWdCLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ3BDLGdCQUFnQixJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNoQyxnQkFBZ0IsT0FBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRO0FBQzVCLGdCQUFnQixNQUFNLEVBQUUsUUFBUTtBQUNoQyxnQkFBZ0IsVUFBVSxFQUFFLFFBQVE7QUFDcEMsZ0JBQWdCLElBQUksRUFBRSxJQUFJO0FBQzFCLGdCQUFnQixLQUFLLEVBQUUsSUFBSTtBQUMzQixnQkFBZ0IsSUFBSSxFQUFFLElBQUk7QUFDMUIsZ0JBQWdCLFNBQVMsRUFBRSxJQUFJO0FBQy9CLGdCQUFnQixHQUFHLEVBQUUsSUFBSTtBQUN6QixnQkFBZ0IsUUFBUSxFQUFFLElBQUk7QUFDOUIsZ0JBQWdCLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2hDLGdCQUFnQixLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxnQkFBZ0IsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDakMsZ0JBQWdCLEtBQUssRUFBRSxDQUFDO0FBQ3hCLGdCQUFnQixNQUFNLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQztBQUNwQyxnQkFBZ0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDcEMsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDO0FBQzFCLGdCQUFnQixLQUFLLEVBQUUsQ0FBQztBQUN4QixhQUFhLENBQUM7QUFDZCxTQUFTLEdBQUcsQ0FBQztBQUNiO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQztBQUNqRCxRQUFRLElBQUksZUFBZTtBQUMzQixZQUFZLHVGQUF1RixDQUFDO0FBQ3BHO0FBQ0EsUUFBUSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDcEMsWUFBWSxJQUFJLE9BQU8sR0FBRyxLQUFLO0FBQy9CLGdCQUFnQixJQUFJO0FBQ3BCLGdCQUFnQixLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzlCLFlBQVksT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO0FBQ25ELGdCQUFnQixJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLG9CQUFvQixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTztBQUN0RCxvQkFBb0IsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEQseUJBQXlCLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNqRSxpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ25ELGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLElBQUksRUFBRSxPQUFPLENBQUM7QUFDMUIsUUFBUSxTQUFTLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN0QyxZQUFZLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEIsWUFBWSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMxQyxZQUFZLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQyxZQUFZLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFO0FBQ3hDLGdCQUFnQixLQUFLLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxnQkFBZ0IsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRCxhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLEVBQUUsSUFBSSxHQUFHO0FBQ3pCLGdCQUFnQixNQUFNLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDO0FBQzlELGNBQWM7QUFDZCxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLGFBQWEsTUFBTSxJQUFJLEVBQUUsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4RCxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLGFBQWEsTUFBTSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RCxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsYUFBYSxNQUFNLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3JELGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0MsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixFQUFFLElBQUksR0FBRztBQUN6QixnQkFBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQztBQUNyRSxjQUFjO0FBQ2QsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMvQyxhQUFhLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RDLGdCQUFnQixNQUFNLENBQUMsS0FBSztBQUM1QixvQkFBb0Isa0RBQWtEO0FBQ3RFLGlCQUFpQixDQUFDO0FBQ2xCLGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDL0MsYUFBYSxNQUFNLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRTtBQUNsQyxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3JDLG9CQUFvQixLQUFLLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUNsRCxvQkFBb0IsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELGlCQUFpQixNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM1QyxvQkFBb0IsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3ZDLG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckQsaUJBQWlCLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLG9CQUFvQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsb0JBQW9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUN0RSxvQkFBb0IsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELGlCQUFpQixNQUFNO0FBQ3ZCLG9CQUFvQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3pFLGlCQUFpQjtBQUNqQixhQUFhLE1BQU0sSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFO0FBQ2xDLGdCQUFnQixLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUM1QyxnQkFBZ0IsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pELGFBQWEsTUFBTSxJQUFJLEVBQUUsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRTtBQUMxRCxnQkFBZ0IsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ25DLGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0MsYUFBYSxNQUFNLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzdELGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbkQsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDakQsaUJBQWlCLEVBQUUsSUFBSSxHQUFHO0FBQzFCLG9CQUFvQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN0QyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyRSxjQUFjO0FBQ2QsZ0JBQWdCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNuQyxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELGFBQWEsTUFBTSxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEQsZ0JBQWdCLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO0FBQzlFLG9CQUFvQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDekMsd0JBQXdCLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEUscUJBQXFCLE1BQU0sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZELHdCQUF3QixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLHdCQUF3QixJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RCxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGdCQUFnQixJQUFJLEVBQUUsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsRSxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNyRSxhQUFhLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hDLGdCQUFnQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLGdCQUFnQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0Msb0JBQW9CLElBQUksUUFBUSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzdELHdCQUF3QixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsd0JBQXdCLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM1RCxxQkFBcUI7QUFDckIsb0JBQW9CO0FBQ3BCLHdCQUF3QixJQUFJLElBQUksT0FBTztBQUN2Qyx3QkFBd0IsTUFBTSxDQUFDLEtBQUs7QUFDcEMsNEJBQTRCLDBDQUEwQztBQUN0RSw0QkFBNEIsS0FBSztBQUNqQyx5QkFBeUI7QUFDekI7QUFDQSx3QkFBd0IsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3RCxpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3BDLFlBQVksT0FBTyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDNUMsZ0JBQWdCLElBQUksT0FBTyxHQUFHLEtBQUs7QUFDbkMsb0JBQW9CLElBQUksQ0FBQztBQUN6QixnQkFBZ0I7QUFDaEIsb0JBQW9CLFVBQVU7QUFDOUIsb0JBQW9CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHO0FBQ3hDLG9CQUFvQixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztBQUNqRCxrQkFBa0I7QUFDbEIsb0JBQW9CLEtBQUssQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQy9DLG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RCxpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtBQUN2RCxvQkFBb0IsSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU07QUFDekQsb0JBQW9CLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3ZELGlCQUFpQjtBQUNqQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUN6RCxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLGFBQWEsQ0FBQztBQUNkLFNBQVM7QUFDVDtBQUNBLFFBQVEsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUM3QyxZQUFZLElBQUksUUFBUSxHQUFHLEtBQUs7QUFDaEMsZ0JBQWdCLEVBQUUsQ0FBQztBQUNuQixZQUFZLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRztBQUN6QyxnQkFBZ0IsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtBQUMzQyxvQkFBb0IsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDL0Msb0JBQW9CLE1BQU07QUFDMUIsaUJBQWlCO0FBQ2pCLGdCQUFnQixRQUFRLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUNyQyxhQUFhO0FBQ2IsWUFBWSxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDN0MsU0FBUztBQUNUO0FBQ0EsUUFBUSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzNDLFlBQVksSUFBSSxPQUFPLEdBQUcsS0FBSztBQUMvQixnQkFBZ0IsSUFBSSxDQUFDO0FBQ3JCLFlBQVksT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO0FBQ25ELGdCQUFnQjtBQUNoQixvQkFBb0IsQ0FBQyxPQUFPO0FBQzVCLHFCQUFxQixJQUFJLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLGtCQUFrQjtBQUNsQixvQkFBb0IsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDL0Msb0JBQW9CLE1BQU07QUFDMUIsaUJBQWlCO0FBQ2pCLGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztBQUNuRCxhQUFhO0FBQ2IsWUFBWSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzlELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxTQUFTLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzdDLFlBQVksSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQzFELFlBQVksSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRSxZQUFZLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPO0FBQ2xDO0FBQ0EsWUFBWSxJQUFJLElBQUksRUFBRTtBQUN0QjtBQUNBLGdCQUFnQixJQUFJLENBQUMsR0FBRyw0Q0FBNEMsQ0FBQyxJQUFJO0FBQ3pFLG9CQUFvQixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztBQUM1RCxpQkFBaUIsQ0FBQztBQUNsQixnQkFBZ0IsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkMsYUFBYTtBQUNiO0FBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxDQUFDO0FBQ3pCLGdCQUFnQixZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3JDLFlBQVksS0FBSyxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDdkQsZ0JBQWdCLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELGdCQUFnQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELGdCQUFnQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNqRCxvQkFBb0IsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNoQyx3QkFBd0IsRUFBRSxHQUFHLENBQUM7QUFDOUIsd0JBQXdCLE1BQU07QUFDOUIscUJBQXFCO0FBQ3JCLG9CQUFvQixJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtBQUN0Qyx3QkFBd0IsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDM0Qsd0JBQXdCLE1BQU07QUFDOUIscUJBQXFCO0FBQ3JCLGlCQUFpQixNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ3hELG9CQUFvQixFQUFFLEtBQUssQ0FBQztBQUM1QixpQkFBaUIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDNUMsb0JBQW9CLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEMsaUJBQWlCLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLG9CQUFvQixTQUFTLEVBQUUsR0FBRyxFQUFFO0FBQ3BDLHdCQUF3QixJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsT0FBTztBQUM3Qyx3QkFBd0IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLHdCQUF3QjtBQUN4Qiw0QkFBNEIsSUFBSSxJQUFJLEVBQUU7QUFDdEMsNEJBQTRCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJO0FBQ2pFLDBCQUEwQjtBQUMxQiw0QkFBNEIsR0FBRyxFQUFFLENBQUM7QUFDbEMsNEJBQTRCLE1BQU07QUFDbEMseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQixpQkFBaUIsTUFBTSxJQUFJLFlBQVksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNuRCxvQkFBb0IsRUFBRSxHQUFHLENBQUM7QUFDMUIsb0JBQW9CLE1BQU07QUFDMUIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLElBQUksWUFBWSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBQy9ELFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHO0FBQzFCLFlBQVksSUFBSSxFQUFFLElBQUk7QUFDdEIsWUFBWSxNQUFNLEVBQUUsSUFBSTtBQUN4QixZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQzFCLFlBQVksTUFBTSxFQUFFLElBQUk7QUFDeEIsWUFBWSxNQUFNLEVBQUUsSUFBSTtBQUN4QixZQUFZLElBQUksRUFBRSxJQUFJO0FBQ3RCLFlBQVksTUFBTSxFQUFFLElBQUk7QUFDeEIsWUFBWSxnQkFBZ0IsRUFBRSxJQUFJO0FBQ2xDLFNBQVMsQ0FBQztBQUNWO0FBQ0EsUUFBUSxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN0RSxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3JDLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUM3QixZQUFZLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDN0IsWUFBWSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbEQsU0FBUztBQUNUO0FBQ0EsUUFBUSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3pDLFlBQVksSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUMxQyxZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJO0FBQ3ZELGdCQUFnQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ25ELFlBQVksS0FBSyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRTtBQUMzRCxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7QUFDbkQsb0JBQW9CLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDdkQsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM5RCxZQUFZLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDOUI7QUFDQTtBQUNBLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDN0IsWUFBWSxFQUFFLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUMvQixZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM3QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzdCO0FBQ0EsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0FBQ3RELGdCQUFnQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDM0M7QUFDQSxZQUFZLE9BQU8sSUFBSSxFQUFFO0FBQ3pCLGdCQUFnQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsTUFBTTtBQUMxQyxzQkFBc0IsRUFBRSxDQUFDLEdBQUcsRUFBRTtBQUM5QixzQkFBc0IsUUFBUTtBQUM5QixzQkFBc0IsVUFBVTtBQUNoQyxzQkFBc0IsU0FBUyxDQUFDO0FBQ2hDLGdCQUFnQixJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUU7QUFDL0Msb0JBQW9CLE9BQU8sRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDMUUsb0JBQW9CLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDcEQsb0JBQW9CLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztBQUNyRSx3QkFBd0IsT0FBTyxZQUFZLENBQUM7QUFDNUMsb0JBQW9CLE9BQU8sS0FBSyxDQUFDO0FBQ2pDLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDdkUsUUFBUSxTQUFTLElBQUksR0FBRztBQUN4QixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUQsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLFNBQVMsSUFBSSxHQUFHO0FBQ3hCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEMsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixTQUFTO0FBQ1QsUUFBUSxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3BDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDOUUsWUFBWSxPQUFPLEtBQUssQ0FBQztBQUN6QixTQUFTO0FBQ1QsUUFBUSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsWUFBWSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2pDLFlBQVksRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDOUIsWUFBWSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU87QUFDcEMsWUFBWSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDL0IsZ0JBQWdCO0FBQ2hCLG9CQUFvQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxLQUFLO0FBQy9DLG9CQUFvQixLQUFLLENBQUMsT0FBTztBQUNqQyxvQkFBb0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLO0FBQ3ZDLGtCQUFrQjtBQUNsQjtBQUNBLG9CQUFvQixJQUFJLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9FLG9CQUFvQixJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7QUFDNUMsd0JBQXdCLEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBQ25ELHdCQUF3QixPQUFPO0FBQy9CLHFCQUFxQjtBQUNyQixpQkFBaUIsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDOUQsb0JBQW9CLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN4RSxvQkFBb0IsT0FBTztBQUMzQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsWUFBWSxJQUFJLFlBQVksQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUM7QUFDN0UsZ0JBQWdCLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RSxTQUFTO0FBQ1QsUUFBUSxTQUFTLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDckQsWUFBWSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzFCLGdCQUFnQixPQUFPLElBQUksQ0FBQztBQUM1QixhQUFhLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3RDLGdCQUFnQixJQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JFLGdCQUFnQixJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ3hDLGdCQUFnQixJQUFJLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sT0FBTyxDQUFDO0FBQzFELGdCQUFnQixPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELGFBQWEsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RELGdCQUFnQixPQUFPLE9BQU8sQ0FBQztBQUMvQixhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLE9BQU8sSUFBSSxPQUFPO0FBQ2xDLG9CQUFvQixPQUFPLENBQUMsSUFBSTtBQUNoQyxvQkFBb0IsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDbEQsb0JBQW9CLEtBQUs7QUFDekIsaUJBQWlCLENBQUM7QUFDbEIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ2xDLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxJQUFJLFFBQVE7QUFDaEMsZ0JBQWdCLElBQUksSUFBSSxTQUFTO0FBQ2pDLGdCQUFnQixJQUFJLElBQUksV0FBVztBQUNuQyxnQkFBZ0IsSUFBSSxJQUFJLFVBQVU7QUFDbEMsZ0JBQWdCLElBQUksSUFBSSxVQUFVO0FBQ2xDLGNBQWM7QUFDZCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM1QyxZQUFZLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDN0IsWUFBWSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMvQixTQUFTO0FBQ1QsUUFBUSxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDN0IsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUM3QixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RSxRQUFRLFNBQVMsV0FBVyxHQUFHO0FBQy9CLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPO0FBQzFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU87QUFDaEMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUztBQUNsQyxnQkFBZ0IsS0FBSztBQUNyQixhQUFhLENBQUM7QUFDZCxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztBQUM3QyxTQUFTO0FBQ1QsUUFBUSxTQUFTLGdCQUFnQixHQUFHO0FBQ3BDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPO0FBQzFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU87QUFDaEMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUztBQUNsQyxnQkFBZ0IsSUFBSTtBQUNwQixhQUFhLENBQUM7QUFDZCxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QyxTQUFTO0FBQ1QsUUFBUSxTQUFTLFVBQVUsR0FBRztBQUM5QixZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN2RCxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNyRCxTQUFTO0FBQ1QsUUFBUSxVQUFVLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUM5QixRQUFRLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDckMsWUFBWSxJQUFJLE1BQU0sR0FBRyxZQUFZO0FBQ3JDLGdCQUFnQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSztBQUNwQyxvQkFBb0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDNUMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTTtBQUNoRCxvQkFBb0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3BEO0FBQ0Esb0JBQW9CO0FBQ3BCLHdCQUF3QixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTztBQUNqRCx3QkFBd0IsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLO0FBQ2pFLHdCQUF3QixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUk7QUFDMUM7QUFDQSx3QkFBd0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDaEQsZ0JBQWdCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxTQUFTO0FBQzdDLG9CQUFvQixNQUFNO0FBQzFCLG9CQUFvQixFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUN0QyxvQkFBb0IsSUFBSTtBQUN4QixvQkFBb0IsSUFBSTtBQUN4QixvQkFBb0IsS0FBSyxDQUFDLE9BQU87QUFDakMsb0JBQW9CLElBQUk7QUFDeEIsaUJBQWlCLENBQUM7QUFDbEIsYUFBYSxDQUFDO0FBQ2QsWUFBWSxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUM5QixZQUFZLE9BQU8sTUFBTSxDQUFDO0FBQzFCLFNBQVM7QUFDVCxRQUFRLFNBQVMsTUFBTSxHQUFHO0FBQzFCLFlBQVksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNqQyxZQUFZLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDcEMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRztBQUM3QyxvQkFBb0IsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUM1RCxnQkFBZ0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNuRCxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDMUI7QUFDQSxRQUFRLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNoQyxZQUFZLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRTtBQUMvQixnQkFBZ0IsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDbEQscUJBQXFCO0FBQ3JCLG9CQUFvQixNQUFNLElBQUksR0FBRztBQUNqQyxvQkFBb0IsSUFBSSxJQUFJLEdBQUc7QUFDL0Isb0JBQW9CLElBQUksSUFBSSxHQUFHO0FBQy9CLG9CQUFvQixJQUFJLElBQUksR0FBRztBQUMvQjtBQUNBLG9CQUFvQixPQUFPLElBQUksRUFBRSxDQUFDO0FBQ2xDLHFCQUFxQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxhQUFhO0FBQ2IsWUFBWSxPQUFPLEdBQUcsQ0FBQztBQUN2QixTQUFTO0FBQ1Q7QUFDQSxRQUFRLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDeEMsWUFBWSxJQUFJLElBQUksSUFBSSxLQUFLO0FBQzdCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO0FBQzVDLG9CQUFvQixNQUFNO0FBQzFCLG9CQUFvQixNQUFNLENBQUMsR0FBRyxDQUFDO0FBQy9CLG9CQUFvQixNQUFNO0FBQzFCLGlCQUFpQixDQUFDO0FBQ2xCLFlBQVksSUFBSSxJQUFJLElBQUksV0FBVztBQUNuQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0UsWUFBWSxJQUFJLElBQUksSUFBSSxXQUFXO0FBQ25DLGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hFLFlBQVksSUFBSSxJQUFJLElBQUksV0FBVztBQUNuQyxnQkFBZ0IsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO0FBQ3RELHNCQUFzQixJQUFJLEVBQUU7QUFDNUIsc0JBQXNCLElBQUk7QUFDMUIsMEJBQTBCLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDekMsMEJBQTBCLGVBQWU7QUFDekMsMEJBQTBCLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDckMsMEJBQTBCLE1BQU07QUFDaEMsdUJBQXVCLENBQUM7QUFDeEIsWUFBWSxJQUFJLElBQUksSUFBSSxVQUFVLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0QsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQzNCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDaEMsb0JBQW9CLGdCQUFnQjtBQUNwQyxvQkFBb0IsS0FBSztBQUN6QixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsVUFBVTtBQUM5QixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzNDLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQzlCLGdCQUFnQjtBQUNoQixvQkFBb0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU07QUFDbkQsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNO0FBQ2pFO0FBQ0Esb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDeEMsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxvQkFBb0IsU0FBUztBQUM3QixvQkFBb0IsU0FBUztBQUM3QixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsU0FBUztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixhQUFhO0FBQ2IsWUFBWSxJQUFJLElBQUksSUFBSSxVQUFVLEVBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsWUFBWSxJQUFJLElBQUksSUFBSSxLQUFLO0FBQzdCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDbkMsb0JBQW9CLGdCQUFnQjtBQUNwQyxvQkFBb0IsT0FBTztBQUMzQixvQkFBb0IsU0FBUztBQUM3QixvQkFBb0IsVUFBVTtBQUM5QixvQkFBb0IsTUFBTTtBQUMxQixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxFQUFFO0FBQ25FLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNuRSxvQkFBb0IsU0FBUztBQUM3QixvQkFBb0IsTUFBTTtBQUMxQixpQkFBaUIsQ0FBQztBQUNsQixhQUFhO0FBQ2IsWUFBWSxJQUFJLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDcEMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDaEQsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQzFDLG9CQUFvQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxpQkFBaUIsTUFBTTtBQUN2QixvQkFBb0IsSUFBSTtBQUN4QixxQkFBcUIsS0FBSyxJQUFJLFFBQVEsSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUM7QUFDN0Usb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7QUFDcEQsa0JBQWtCO0FBQ2xCLG9CQUFvQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUMxQyxvQkFBb0IsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlELHlCQUF5QixJQUFJLEtBQUssSUFBSSxNQUFNO0FBQzVDLHdCQUF3QixPQUFPLElBQUk7QUFDbkMsNEJBQTRCLFFBQVE7QUFDcEMsNEJBQTRCLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDOUMsNEJBQTRCLFFBQVE7QUFDcEMsNEJBQTRCLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMseUJBQXlCLENBQUM7QUFDMUI7QUFDQSx3QkFBd0IsT0FBTyxJQUFJO0FBQ25DLDRCQUE0QixPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzNDLDRCQUE0QixPQUFPO0FBQ25DLDRCQUE0QixNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLDRCQUE0QixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ3hDLDRCQUE0QixLQUFLO0FBQ2pDLDRCQUE0QixNQUFNO0FBQ2xDLDRCQUE0QixNQUFNO0FBQ2xDLHlCQUF5QixDQUFDO0FBQzFCLGlCQUFpQixNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxXQUFXLEVBQUU7QUFDekQsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQzFDLG9CQUFvQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRixpQkFBaUIsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksVUFBVSxFQUFFO0FBQ3hELG9CQUFvQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUMxQyxvQkFBb0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsaUJBQWlCLE1BQU07QUFDdkIsb0JBQW9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3RCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksUUFBUTtBQUNoQyxnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ25DLG9CQUFvQixTQUFTO0FBQzdCLG9CQUFvQixNQUFNLENBQUMsR0FBRyxDQUFDO0FBQy9CLG9CQUFvQixPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQztBQUMxQyxvQkFBb0IsZ0JBQWdCO0FBQ3BDLG9CQUFvQixLQUFLO0FBQ3pCLG9CQUFvQixNQUFNO0FBQzFCLG9CQUFvQixNQUFNO0FBQzFCLG9CQUFvQixVQUFVO0FBQzlCLGlCQUFpQixDQUFDO0FBQ2xCLFlBQVksSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRSxZQUFZLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1RCxZQUFZLElBQUksSUFBSSxJQUFJLE9BQU87QUFDL0IsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxvQkFBb0IsV0FBVztBQUMvQixvQkFBb0IsaUJBQWlCO0FBQ3JDLG9CQUFvQixTQUFTO0FBQzdCLG9CQUFvQixNQUFNO0FBQzFCLG9CQUFvQixVQUFVO0FBQzlCLGlCQUFpQixDQUFDO0FBQ2xCLFlBQVksSUFBSSxJQUFJLElBQUksUUFBUTtBQUNoQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxZQUFZLElBQUksSUFBSSxJQUFJLFFBQVE7QUFDaEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEUsWUFBWSxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEQsWUFBWSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFlBQVksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUUsU0FBUztBQUNULFFBQVEsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUU7QUFDekMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlELFNBQVM7QUFDVCxRQUFRLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDekMsWUFBWSxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFNBQVM7QUFDVCxRQUFRLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNoRCxZQUFZLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEQsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ2pDLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDM0MsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1RSxTQUFTO0FBQ1QsUUFBUSxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUN2RCxZQUFZLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDeEQsZ0JBQWdCLElBQUksSUFBSSxHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7QUFDbEUsZ0JBQWdCLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDL0Isb0JBQW9CLE9BQU8sSUFBSTtBQUMvQix3QkFBd0IsV0FBVztBQUNuQyx3QkFBd0IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNwQyx3QkFBd0IsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7QUFDN0Msd0JBQXdCLE1BQU07QUFDOUIsd0JBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDcEMsd0JBQXdCLElBQUk7QUFDNUIsd0JBQXdCLFVBQVU7QUFDbEMscUJBQXFCLENBQUM7QUFDdEIscUJBQXFCLElBQUksSUFBSSxJQUFJLFVBQVU7QUFDM0Msb0JBQW9CLE9BQU8sSUFBSTtBQUMvQix3QkFBd0IsV0FBVztBQUNuQyx3QkFBd0IsT0FBTztBQUMvQix3QkFBd0IsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNwQyx3QkFBd0IsSUFBSTtBQUM1Qix3QkFBd0IsVUFBVTtBQUNsQyxxQkFBcUIsQ0FBQztBQUN0QixhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxvQkFBb0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM5RSxZQUFZLElBQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RSxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEUsWUFBWSxJQUFJLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsRUFBRTtBQUNuRSxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEUsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLElBQUksSUFBSSxPQUFPO0FBQ3RELGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDdEUsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQzNCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDaEMsb0JBQW9CLGVBQWU7QUFDbkMsb0JBQW9CLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDL0Isb0JBQW9CLE1BQU07QUFDMUIsb0JBQW9CLE9BQU87QUFDM0IsaUJBQWlCLENBQUM7QUFDbEIsWUFBWSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksSUFBSSxJQUFJLFFBQVE7QUFDdEQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsQ0FBQztBQUN0RSxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pFLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzlFLFlBQVksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxZQUFZLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNqRSxZQUFZLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDMUIsU0FBUztBQUNULFFBQVEsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQ3ZDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDeEQsWUFBWSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxTQUFTO0FBQ1Q7QUFDQSxRQUFRLFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNqRCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxZQUFZLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1QsUUFBUSxTQUFTLG9CQUFvQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzVELFlBQVksSUFBSSxFQUFFO0FBQ2xCLGdCQUFnQixPQUFPLElBQUksS0FBSyxHQUFHLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO0FBQzdFLFlBQVksSUFBSSxJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssR0FBRyxVQUFVLEdBQUcsaUJBQWlCLENBQUM7QUFDekUsWUFBWSxJQUFJLElBQUksSUFBSSxJQUFJO0FBQzVCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLFdBQVc7QUFDL0Isb0JBQW9CLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxTQUFTO0FBQzFELG9CQUFvQixVQUFVO0FBQzlCLGlCQUFpQixDQUFDO0FBQ2xCLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO0FBQ3BDLGdCQUFnQixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUM7QUFDbkUsb0JBQW9CLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSTtBQUN4QixvQkFBb0IsS0FBSyxJQUFJLEdBQUc7QUFDaEMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQztBQUN0RTtBQUNBLG9CQUFvQixPQUFPLElBQUk7QUFDL0Isd0JBQXdCLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDcEMsd0JBQXdCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO0FBQy9DLHdCQUF3QixNQUFNO0FBQzlCLHdCQUF3QixFQUFFO0FBQzFCLHFCQUFxQixDQUFDO0FBQ3RCLGdCQUFnQixJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3RSxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO0FBQ2pDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU87QUFDcEMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQzNCLGdCQUFnQixPQUFPLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2RCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNoQyxvQkFBb0IsZUFBZTtBQUNuQyxvQkFBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMvQixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsRUFBRTtBQUN0QixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDdkMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUMzRCxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEUsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLFlBQVksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDL0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUUsWUFBWSxPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDeEQsU0FBUztBQUNULFFBQVEsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQ3JDLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQzdCLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUN2QyxnQkFBZ0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQy9DLGdCQUFnQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ2pDLFlBQVksWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLFlBQVksT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDOUQsU0FBUztBQUNULFFBQVEsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7QUFDeEMsWUFBWSxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsWUFBWSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxHQUFHLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JFLFNBQVM7QUFDVCxRQUFRLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUN0QyxZQUFZLE9BQU8sVUFBVSxJQUFJLEVBQUU7QUFDbkMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQy9FLHFCQUFxQixJQUFJLElBQUksSUFBSSxVQUFVLElBQUksSUFBSTtBQUNuRCxvQkFBb0IsT0FBTyxJQUFJO0FBQy9CLHdCQUF3QixhQUFhO0FBQ3JDLHdCQUF3QixPQUFPLEdBQUcsb0JBQW9CLEdBQUcsa0JBQWtCO0FBQzNFLHFCQUFxQixDQUFDO0FBQ3RCLHFCQUFxQixPQUFPLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDM0UsYUFBYSxDQUFDO0FBQ2QsU0FBUztBQUNULFFBQVEsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxZQUFZLElBQUksS0FBSyxJQUFJLFFBQVEsRUFBRTtBQUNuQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEQsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFNBQVMsYUFBYSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDekMsWUFBWSxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUU7QUFDbkMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xELGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDbEMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVELFlBQVksT0FBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLFNBQVM7QUFDVCxRQUFRLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUNoQyxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDdkMsZ0JBQWdCLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDOUIsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEMsWUFBWSxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDakMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ3ZDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxhQUFhLE1BQU0sSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLEVBQUUsQ0FBQyxLQUFLLElBQUksU0FBUyxFQUFFO0FBQ3BFLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUN2QyxnQkFBZ0IsSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEYsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO0FBQ3RCLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSTtBQUN4QixvQkFBb0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLO0FBQzFELHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVEO0FBQ0Esb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDdEUsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLGFBQWEsTUFBTSxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTtBQUM3RCxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBQzdFLGdCQUFnQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxhQUFhLE1BQU0sSUFBSSxJQUFJLElBQUksZ0JBQWdCLEVBQUU7QUFDakQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLGFBQWEsTUFBTSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEQsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxhQUFhLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ3BDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRSxhQUFhLE1BQU0sSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFO0FBQ3pDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxRCxhQUFhLE1BQU0sSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQ3JDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsYUFBYSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNwQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUNwQyxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzRCxZQUFZLEVBQUUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ25DLFlBQVksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckMsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ2pDLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDNUQsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEQsU0FBUztBQUNULFFBQVEsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDMUMsWUFBWSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzFDLGdCQUFnQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDaEUsb0JBQW9CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQy9DLG9CQUFvQixJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekUsb0JBQW9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN2RCx3QkFBd0IsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN2RSx3QkFBd0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEMsaUJBQWlCO0FBQ2pCLGdCQUFnQixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO0FBQy9ELGdCQUFnQixJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BFLGdCQUFnQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QyxhQUFhO0FBQ2IsWUFBWSxPQUFPLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMxQyxnQkFBZ0IsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUMvRCxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLGFBQWEsQ0FBQztBQUNkLFNBQVM7QUFDVCxRQUFRLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQy9DLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekUsU0FBUztBQUNULFFBQVEsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQzdCLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDM0MsWUFBWSxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUMsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN4QyxZQUFZLElBQUksSUFBSSxFQUFFO0FBQ3RCLGdCQUFnQixJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkQsZ0JBQWdCLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6RCxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM1QyxZQUFZLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlFLFNBQVM7QUFDVCxRQUFRLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUNwQyxZQUFZLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDckMsZ0JBQWdCLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO0FBQzVELG9CQUFvQixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzVELHFCQUFxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNoQyxZQUFZLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUMvQixnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDOUIsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdkMsWUFBWTtBQUNaLGdCQUFnQixLQUFLLElBQUksT0FBTztBQUNoQyxnQkFBZ0IsS0FBSyxJQUFJLFFBQVE7QUFDakMsZ0JBQWdCLEtBQUssSUFBSSxPQUFPO0FBQ2hDLGdCQUFnQixLQUFLLElBQUksVUFBVTtBQUNuQyxjQUFjO0FBQ2QsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxHQUFHLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzlFLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3ZELGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNuQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsYUFBYTtBQUNiLFlBQVksSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEUsWUFBWSxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksTUFBTTtBQUN0RSxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQzNCLGdCQUFnQixPQUFPLElBQUk7QUFDM0Isb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDaEMsb0JBQW9CLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNoRCxvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsU0FBUztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3hFLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRztBQUMzQixnQkFBZ0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRSxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEYsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1RSxZQUFZLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtBQUNqQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xELGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUU7QUFDdkMsWUFBWSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEQsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ2pDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDdEQsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuRSxZQUFZLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3QyxTQUFTO0FBQ1QsUUFBUSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLEVBQUUsQ0FBQyxLQUFLLElBQUksU0FBUyxFQUFFO0FBQzdELGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUN2QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsYUFBYSxNQUFNLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDN0UsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLGFBQWEsTUFBTSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDcEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLGFBQWEsTUFBTSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDcEMsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxvQkFBb0IsYUFBYTtBQUNqQyxvQkFBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMvQixvQkFBb0IsUUFBUTtBQUM1QixpQkFBaUIsQ0FBQztBQUNsQixhQUFhLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ3BDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEQsYUFBYSxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ2xELGdCQUFnQixPQUFPLElBQUksRUFBRSxDQUFDO0FBQzlCLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3hDLFlBQVksSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDL0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUUsWUFBWSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNyRCxTQUFTO0FBQ1QsUUFBUSxTQUFTLGlCQUFpQixDQUFDLElBQUksRUFBRTtBQUN6QyxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUM3QixnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDdkMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUMvQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEMsWUFBWTtBQUNaLGdCQUFnQixDQUFDLElBQUksSUFBSSxVQUFVLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztBQUN6RSxnQkFBZ0IsS0FBSyxJQUFJLEdBQUc7QUFDNUI7QUFDQSxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsWUFBWSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkQsWUFBWSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxTQUFTO0FBQ1QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3hDLFlBQVksSUFBSSxLQUFLLElBQUksR0FBRztBQUM1QixnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ2hDLG9CQUFvQixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQztBQUMzQyxvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsU0FBUztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHO0FBQzNELGdCQUFnQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNFLFlBQVksSUFBSSxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxZQUFZLEVBQUU7QUFDN0QsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxhQUFhO0FBQ2IsWUFBWSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRSxTQUFTO0FBQ1QsUUFBUSxTQUFTLGFBQWEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ3pDLFlBQVksSUFBSSxLQUFLLElBQUksR0FBRztBQUM1QixnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ2hDLG9CQUFvQixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQztBQUMzQyxvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsU0FBUztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixTQUFTO0FBQ1QsUUFBUSxTQUFTLFNBQVMsR0FBRztBQUM3QixZQUFZLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3BELFNBQVM7QUFDVCxRQUFRLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUM1QyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRCxTQUFTO0FBQ1QsUUFBUSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLFlBQVksSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ2pDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsYUFBYTtBQUNiLFlBQVksT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckUsU0FBUztBQUNULFFBQVEsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN0QyxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMzQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxnQkFBZ0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLGdCQUFnQixPQUFPLElBQUksRUFBRSxDQUFDO0FBQzlCLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEUsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25FLFNBQVM7QUFDVCxRQUFRLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDMUMsWUFBWSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDeEUsZ0JBQWdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQzNELFlBQVksSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDM0MsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQzNCLGdCQUFnQixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMvRSxZQUFZLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDM0QsU0FBUztBQUNULFFBQVEsU0FBUyxVQUFVLEdBQUc7QUFDOUIsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDOUMsU0FBUztBQUNULFFBQVEsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUMzQyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdELFNBQVM7QUFDVCxRQUFRLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUNsQyxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxTQUFTO0FBQ1QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3hDLFlBQVksSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLEtBQUssSUFBSSxNQUFNO0FBQ3RELGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RSxTQUFTO0FBQ1QsUUFBUSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLFlBQVksSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekUsU0FBUztBQUNULFFBQVEsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ2hDLFlBQVksSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3RCxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRCxZQUFZLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLFNBQVM7QUFDVCxRQUFRLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdkMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUMzQyxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxZQUFZLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2hELGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELGFBQWE7QUFDYixZQUFZLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QyxTQUFTO0FBQ1QsUUFBUSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzFDLFlBQVksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQzlCLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO0FBQ3BDLGdCQUFnQixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsV0FBVztBQUMvQixvQkFBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNoQyxvQkFBb0IsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7QUFDekMsb0JBQW9CLE1BQU07QUFDMUIsb0JBQW9CLFlBQVk7QUFDaEMsb0JBQW9CLFNBQVM7QUFDN0Isb0JBQW9CLFVBQVU7QUFDOUIsaUJBQWlCLENBQUM7QUFDbEIsWUFBWSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksR0FBRztBQUNwQyxnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ2hDLG9CQUFvQixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztBQUM1QyxvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsV0FBVztBQUMvQixpQkFBaUIsQ0FBQztBQUNsQixTQUFTO0FBQ1QsUUFBUSxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzNDLFlBQVksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQzlCLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO0FBQ3BDLGdCQUFnQixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsV0FBVztBQUMvQixvQkFBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNoQyxvQkFBb0IsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7QUFDekMsb0JBQW9CLE1BQU07QUFDMUIsb0JBQW9CLFlBQVk7QUFDaEMsb0JBQW9CLFVBQVU7QUFDOUIsaUJBQWlCLENBQUM7QUFDbEIsWUFBWSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksR0FBRztBQUNwQyxnQkFBZ0IsT0FBTyxJQUFJO0FBQzNCLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ2hDLG9CQUFvQixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztBQUM1QyxvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsWUFBWTtBQUNoQyxpQkFBaUIsQ0FBQztBQUNsQixTQUFTO0FBQ1QsUUFBUSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLFlBQVksSUFBSSxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDekQsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ25DLGdCQUFnQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxhQUFhLE1BQU0sSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQ3JDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1RSxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNyQyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFlBQVksSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUUsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELFNBQVM7QUFDVCxRQUFRLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDOUM7QUFDQSxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEUsWUFBWSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0MsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN4QyxZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxnQkFBZ0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM3QyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUc7QUFDNUIsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNoQyxvQkFBb0IsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7QUFDNUMsb0JBQW9CLE1BQU07QUFDMUIsb0JBQW9CLGNBQWM7QUFDbEMsaUJBQWlCLENBQUM7QUFDbEIsWUFBWTtBQUNaLGdCQUFnQixLQUFLLElBQUksU0FBUztBQUNsQyxnQkFBZ0IsS0FBSyxJQUFJLFlBQVk7QUFDckMsaUJBQWlCLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3JDLGNBQWM7QUFDZCxnQkFBZ0IsSUFBSSxLQUFLLElBQUksWUFBWSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ2pFLGdCQUFnQixPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUMxRSxhQUFhO0FBQ2IsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRSxTQUFTO0FBQ1QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3hDLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxJQUFJLE9BQU87QUFDL0IsaUJBQWlCLElBQUksSUFBSSxVQUFVO0FBQ25DLHFCQUFxQixLQUFLLElBQUksUUFBUTtBQUN0Qyx3QkFBd0IsS0FBSyxJQUFJLEtBQUs7QUFDdEMsd0JBQXdCLEtBQUssSUFBSSxLQUFLO0FBQ3RDLHlCQUF5QixJQUFJLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDcEQsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25FLGNBQWM7QUFDZCxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRTtBQUM3RCxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDdkMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxhQUFhO0FBQ2IsWUFBWSxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVE7QUFDcEQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSTtBQUMzQixvQkFBb0IsVUFBVTtBQUM5QixvQkFBb0IsU0FBUztBQUM3QixvQkFBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMvQixvQkFBb0IsVUFBVTtBQUM5QixvQkFBb0IsU0FBUztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUM5QixnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFFLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkUsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUMzQyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakUsU0FBUztBQUNULFFBQVEsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN6QyxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RCxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEUsWUFBWSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM3RCxZQUFZLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDL0MsZ0JBQWdCLFdBQVcsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUM7QUFDckUsWUFBWSxPQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQ2xFLFNBQVM7QUFDVCxRQUFRLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDMUMsWUFBWSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDOUIsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEQsYUFBYTtBQUNiLFlBQVksSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO0FBQ3BDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN0QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JELGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDM0IsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLFlBQVksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsU0FBUztBQUNULFFBQVEsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMxQyxZQUFZLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUMvQixnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ2hELGFBQWE7QUFDYixZQUFZLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoRixTQUFTO0FBQ1QsUUFBUSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDbkMsWUFBWSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNoRCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyRCxZQUFZLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdELFlBQVksT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFNBQVM7QUFDVCxRQUFRLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDekMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUNwRCxZQUFZLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLFNBQVM7QUFDVCxRQUFRLFNBQVMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFO0FBQ3hDLFlBQVksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZFLFNBQVM7QUFDVCxRQUFRLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdkMsWUFBWSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDL0IsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUN6QyxZQUFZLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtBQUNqQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDcEMsWUFBWSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUMzQyxZQUFZLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELFNBQVM7QUFDVCxRQUFRLFNBQVMsT0FBTyxHQUFHO0FBQzNCLFlBQVksT0FBTyxJQUFJO0FBQ3ZCLGdCQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDO0FBQy9CLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDO0FBQzNCLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQzVCLGdCQUFnQixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztBQUN6QyxnQkFBZ0IsTUFBTTtBQUN0QixnQkFBZ0IsTUFBTTtBQUN0QixhQUFhLENBQUM7QUFDZCxTQUFTO0FBQ1QsUUFBUSxTQUFTLFVBQVUsR0FBRztBQUM5QixZQUFZLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM5QyxTQUFTO0FBQ1Q7QUFDQSxRQUFRLFNBQVMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtBQUN4RCxZQUFZO0FBQ1osZ0JBQWdCLEtBQUssQ0FBQyxRQUFRLElBQUksVUFBVTtBQUM1QyxnQkFBZ0IsS0FBSyxDQUFDLFFBQVEsSUFBSSxHQUFHO0FBQ3JDLGdCQUFnQixjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxjQUFjO0FBQ2QsU0FBUztBQUNUO0FBQ0EsUUFBUSxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzFELFlBQVk7QUFDWixnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLFNBQVM7QUFDNUMsb0JBQW9CLGdGQUFnRixDQUFDLElBQUk7QUFDekcsd0JBQXdCLEtBQUssQ0FBQyxRQUFRO0FBQ3RDLHFCQUFxQjtBQUNyQixpQkFBaUIsS0FBSyxDQUFDLFFBQVEsSUFBSSxPQUFPO0FBQzFDLG9CQUFvQixRQUFRLENBQUMsSUFBSTtBQUNqQyx3QkFBd0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFFLHFCQUFxQixDQUFDO0FBQ3RCLGNBQWM7QUFDZCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2YsWUFBWSxVQUFVLEVBQUUsVUFBVSxVQUFVLEVBQUU7QUFDOUMsZ0JBQWdCLElBQUksS0FBSyxHQUFHO0FBQzVCLG9CQUFvQixRQUFRLEVBQUUsU0FBUztBQUN2QyxvQkFBb0IsUUFBUSxFQUFFLEtBQUs7QUFDbkMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFO0FBQzFCLG9CQUFvQixPQUFPLEVBQUUsSUFBSSxTQUFTO0FBQzFDLHdCQUF3QixDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksVUFBVTtBQUN0RCx3QkFBd0IsQ0FBQztBQUN6Qix3QkFBd0IsT0FBTztBQUMvQix3QkFBd0IsS0FBSztBQUM3QixxQkFBcUI7QUFDckIsb0JBQW9CLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUztBQUNyRCxvQkFBb0IsT0FBTztBQUMzQix3QkFBd0IsWUFBWSxDQUFDLFNBQVM7QUFDOUMsd0JBQXdCLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO0FBQ3RELG9CQUFvQixRQUFRLEVBQUUsVUFBVSxJQUFJLENBQUM7QUFDN0MsaUJBQWlCLENBQUM7QUFDbEIsZ0JBQWdCO0FBQ2hCLG9CQUFvQixZQUFZLENBQUMsVUFBVTtBQUMzQyxvQkFBb0IsT0FBTyxZQUFZLENBQUMsVUFBVSxJQUFJLFFBQVE7QUFDOUQ7QUFDQSxvQkFBb0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBQy9ELGdCQUFnQixPQUFPLEtBQUssQ0FBQztBQUM3QixhQUFhO0FBQ2I7QUFDQSxZQUFZLEtBQUssRUFBRSxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDNUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFO0FBQ2xDLG9CQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0FBQzlELHdCQUF3QixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDcEQsb0JBQW9CLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzFELG9CQUFvQixZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFpQjtBQUNqQixnQkFBZ0IsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLFlBQVksSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQ3ZFLG9CQUFvQixPQUFPLElBQUksQ0FBQztBQUNoQyxnQkFBZ0IsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsZ0JBQWdCLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNwRCxnQkFBZ0IsS0FBSyxDQUFDLFFBQVE7QUFDOUIsb0JBQW9CLElBQUksSUFBSSxVQUFVLEtBQUssT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDO0FBQzlFLDBCQUEwQixRQUFRO0FBQ2xDLDBCQUEwQixJQUFJLENBQUM7QUFDL0IsZ0JBQWdCLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRSxhQUFhO0FBQ2I7QUFDQSxZQUFZLE1BQU0sRUFBRSxVQUFVLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDaEQsZ0JBQWdCO0FBQ2hCLG9CQUFvQixLQUFLLENBQUMsUUFBUSxJQUFJLFlBQVk7QUFDbEQsb0JBQW9CLEtBQUssQ0FBQyxRQUFRLElBQUksVUFBVTtBQUNoRDtBQUNBLG9CQUFvQixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDM0MsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUQsZ0JBQWdCLElBQUksU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNoRSxvQkFBb0IsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPO0FBQzNDLG9CQUFvQixHQUFHLENBQUM7QUFDeEI7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pELG9CQUFvQixLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ25FLHdCQUF3QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLHdCQUF3QixJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDaEUsNkJBQTZCLElBQUksQ0FBQyxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksVUFBVSxFQUFFLE1BQU07QUFDMUUscUJBQXFCO0FBQ3JCLGdCQUFnQjtBQUNoQixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU07QUFDckUscUJBQXFCLFNBQVMsSUFBSSxHQUFHO0FBQ3JDLHlCQUF5QixDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM3RCw2QkFBNkIsR0FBRyxJQUFJLGtCQUFrQjtBQUN0RCxnQ0FBZ0MsR0FBRyxJQUFJLG9CQUFvQixDQUFDO0FBQzVELDRCQUE0QixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2pFO0FBQ0Esb0JBQW9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQzNDLGdCQUFnQjtBQUNoQixvQkFBb0IsZUFBZTtBQUNuQyxvQkFBb0IsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHO0FBQ3ZDLG9CQUFvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNO0FBQy9DO0FBQ0Esb0JBQW9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQzNDLGdCQUFnQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSTtBQUN2QyxvQkFBb0IsT0FBTyxHQUFHLFNBQVMsSUFBSSxJQUFJLENBQUM7QUFDaEQ7QUFDQSxnQkFBZ0IsSUFBSSxJQUFJLElBQUksUUFBUTtBQUNwQyxvQkFBb0I7QUFDcEIsd0JBQXdCLE9BQU8sQ0FBQyxRQUFRO0FBQ3hDLHlCQUF5QixLQUFLLENBQUMsUUFBUSxJQUFJLFVBQVUsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEdBQUc7QUFDOUUsOEJBQThCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDckQsOEJBQThCLENBQUMsQ0FBQztBQUNoQyxzQkFBc0I7QUFDdEIscUJBQXFCLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxTQUFTLElBQUksR0FBRztBQUMzRCxvQkFBb0IsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzVDLHFCQUFxQixJQUFJLElBQUksSUFBSSxNQUFNLEVBQUUsT0FBTyxPQUFPLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUM5RSxxQkFBcUIsSUFBSSxJQUFJLElBQUksTUFBTTtBQUN2QyxvQkFBb0I7QUFDcEIsd0JBQXdCLE9BQU8sQ0FBQyxRQUFRO0FBQ3hDLHlCQUF5QixvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDO0FBQy9ELDhCQUE4QixlQUFlLElBQUksVUFBVTtBQUMzRCw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hDLHNCQUFzQjtBQUN0QixxQkFBcUI7QUFDckIsb0JBQW9CLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUTtBQUM1QyxvQkFBb0IsQ0FBQyxPQUFPO0FBQzVCLG9CQUFvQixZQUFZLENBQUMsa0JBQWtCLElBQUksS0FBSztBQUM1RDtBQUNBLG9CQUFvQjtBQUNwQix3QkFBd0IsT0FBTyxDQUFDLFFBQVE7QUFDeEMseUJBQXlCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUQsOEJBQThCLFVBQVU7QUFDeEMsOEJBQThCLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDN0Msc0JBQXNCO0FBQ3RCLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxLQUFLO0FBQ3RDLG9CQUFvQixPQUFPLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5RCxxQkFBcUIsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDMUUsYUFBYTtBQUNiO0FBQ0EsWUFBWSxhQUFhLEVBQUUsbUNBQW1DO0FBQzlELFlBQVksaUJBQWlCLEVBQUUsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJO0FBQ3JELFlBQVksZUFBZSxFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSTtBQUNuRCxZQUFZLG9CQUFvQixFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsS0FBSztBQUN6RCxZQUFZLFdBQVcsRUFBRSxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUk7QUFDL0MsWUFBWSxJQUFJLEVBQUUsT0FBTztBQUN6QixZQUFZLGFBQWEsRUFBRSxnQkFBZ0I7QUFDM0M7QUFDQSxZQUFZLFVBQVUsRUFBRSxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVk7QUFDeEQsWUFBWSxVQUFVLEVBQUUsVUFBVTtBQUNsQyxZQUFZLFFBQVEsRUFBRSxRQUFRO0FBQzlCO0FBQ0EsWUFBWSxpQkFBaUIsRUFBRSxpQkFBaUI7QUFDaEQ7QUFDQSxZQUFZLGNBQWMsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUM3QyxnQkFBZ0IsT0FBTztBQUN2QixvQkFBb0IsS0FBSztBQUN6QixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsTUFBTTtBQUMxQixvQkFBb0IsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO0FBQzVELGlCQUFpQixDQUFDO0FBQ2xCLGFBQWE7QUFDYixTQUFTLENBQUM7QUFDVixLQUFLLENBQUMsQ0FBQztBQUNQO0FBQ0EsSUFBSSxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEU7QUFDQSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0QsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNELElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNsRSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDcEUsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLHdCQUF3QixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xFLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRTtBQUM5QyxRQUFRLElBQUksRUFBRSxZQUFZO0FBQzFCLFFBQVEsSUFBSSxFQUFFLElBQUk7QUFDbEIsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUU7QUFDaEQsUUFBUSxJQUFJLEVBQUUsWUFBWTtBQUMxQixRQUFRLElBQUksRUFBRSxJQUFJO0FBQ2xCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLDJCQUEyQixFQUFFO0FBQ3ZELFFBQVEsSUFBSSxFQUFFLFlBQVk7QUFDMUIsUUFBUSxJQUFJLEVBQUUsSUFBSTtBQUNsQixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRTtBQUNqRCxRQUFRLElBQUksRUFBRSxZQUFZO0FBQzFCLFFBQVEsTUFBTSxFQUFFLElBQUk7QUFDcEIsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDN0MsUUFBUSxJQUFJLEVBQUUsWUFBWTtBQUMxQixRQUFRLFVBQVUsRUFBRSxJQUFJO0FBQ3hCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLHdCQUF3QixFQUFFO0FBQ3BELFFBQVEsSUFBSSxFQUFFLFlBQVk7QUFDMUIsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4QixLQUFLLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQzs7QUN6OUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDaEIsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLENBQUMsRUFBRSxVQUFVLFVBQVUsRUFBRTtBQUV6QjtBQUNBLElBQUksVUFBVSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDckUsUUFBUSxPQUFPO0FBQ2YsWUFBWSxVQUFVLEVBQUUsWUFBWTtBQUNwQyxnQkFBZ0IsT0FBTztBQUN2QixvQkFBb0IsSUFBSSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ3JELG9CQUFvQixPQUFPLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFDM0Qsb0JBQW9CLE9BQU8sRUFBRSxDQUFDO0FBQzlCLG9CQUFvQixPQUFPLEVBQUUsSUFBSTtBQUNqQyxvQkFBb0IsVUFBVSxFQUFFLENBQUM7QUFDakMsb0JBQW9CLFVBQVUsRUFBRSxJQUFJO0FBQ3BDLG9CQUFvQixVQUFVLEVBQUUsSUFBSTtBQUNwQyxpQkFBaUIsQ0FBQztBQUNsQixhQUFhO0FBQ2IsWUFBWSxTQUFTLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDeEMsZ0JBQWdCLE9BQU87QUFDdkIsb0JBQW9CLElBQUksRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2hFLG9CQUFvQixPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUN6RSxvQkFBb0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO0FBQzFDLG9CQUFvQixPQUFPLEVBQUUsSUFBSTtBQUNqQyxvQkFBb0IsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO0FBQ2hELG9CQUFvQixVQUFVLEVBQUUsSUFBSTtBQUNwQyxpQkFBaUIsQ0FBQztBQUNsQixhQUFhO0FBQ2I7QUFDQSxZQUFZLEtBQUssRUFBRSxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDNUMsZ0JBQWdCO0FBQ2hCLG9CQUFvQixNQUFNLElBQUksS0FBSyxDQUFDLFVBQVU7QUFDOUMsb0JBQW9CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUs7QUFDNUUsa0JBQWtCO0FBQ2xCLG9CQUFvQixLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUM5QyxvQkFBb0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDcEUsaUJBQWlCO0FBQ2pCO0FBQ0EsZ0JBQWdCLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ25ELG9CQUFvQixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRSxvQkFBb0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQy9DLGlCQUFpQjtBQUNqQixnQkFBZ0IsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDdEQsb0JBQW9CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUM5QyxvQkFBb0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUUsb0JBQW9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNsRCxpQkFBaUI7QUFDakIsZ0JBQWdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLG9CQUFvQixLQUFLLENBQUMsT0FBTztBQUNqQyxvQkFBb0IsS0FBSyxDQUFDLFVBQVU7QUFDcEMsb0JBQW9CLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDO0FBQ3BFLGtCQUFrQjtBQUNsQixvQkFBb0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU87QUFDL0Qsd0JBQXdCLHVCQUF1QjtBQUMvQyx3QkFBd0IsRUFBRTtBQUMxQixxQkFBcUIsQ0FBQztBQUN0QixvQkFBb0IsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDaEYsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNuRSxxQkFBcUI7QUFDckIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhO0FBQ3pFLHFCQUFxQixPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO0FBQ3BFO0FBQ0Esb0JBQW9CLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUNsRSxxQkFBcUIsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBQzdDLGFBQWE7QUFDYjtBQUNBLFlBQVksTUFBTTtBQUNsQixnQkFBZ0IsSUFBSSxDQUFDLE1BQU07QUFDM0IsZ0JBQWdCLFVBQVUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDbEQsb0JBQW9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRSxpQkFBaUI7QUFDakIsWUFBWSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7QUFDN0M7QUFDQSxZQUFZLFNBQVMsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN4QyxnQkFBZ0IsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN6RCxhQUFhO0FBQ2I7QUFDQSxZQUFZLFNBQVMsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN4QyxnQkFBZ0IsSUFBSSxTQUFTLEVBQUUsWUFBWSxDQUFDO0FBQzVDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNFLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxTQUFTO0FBQ3JDLG9CQUFvQixZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEU7QUFDQSxnQkFBZ0IsT0FBTyxZQUFZLElBQUksSUFBSTtBQUMzQyxzQkFBc0IsU0FBUztBQUMvQixzQkFBc0IsT0FBTyxJQUFJLFNBQVMsSUFBSSxJQUFJO0FBQ2xELHNCQUFzQixTQUFTLEdBQUcsR0FBRyxHQUFHLFlBQVk7QUFDcEQsc0JBQXNCLFlBQVksQ0FBQztBQUNuQyxhQUFhO0FBQ2IsU0FBUyxDQUFDO0FBQ1YsS0FBSyxDQUFDO0FBQ04sQ0FBQyxDQUFDOztBQ3RHRjtBQUVBLE1BQU0sa0JBQWtCLEdBQUcsbUJBQW1CLENBQUM7QUFDL0MsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUM7QUFFM0MsTUFBTSwwQkFBMEIsR0FBRyx1QkFBdUIsQ0FBQztBQUMzRCxNQUFNLDBCQUEwQixHQUFHLHVCQUF1QixDQUFDO0FBRTNELE1BQU0sZ0NBQWdDLEdBQUcsNkJBQTZCLENBQUM7QUFDdkUsTUFBTSxzQkFBc0IsR0FBRyxtQkFBbUIsQ0FBQztBQUNuRCxNQUFNLHVCQUF1QixHQUFHLHlCQUF5QixDQUFDO01BRTdDLE1BQU07SUFHZixZQUEyQixHQUFRLEVBQVUsTUFBdUI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQ2hFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO0lBRUssS0FBSzs7WUFDUCxNQUFNLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDOztTQUV2QztLQUFBO0lBRUssNEJBQTRCOztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLDRCQUE0QixFQUFFLENBQUM7U0FDckQ7S0FBQTtJQUVLLHNCQUFzQjs7Ozs7OztZQU94QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzNDLE9BQU87YUFDVjs7WUFHRCxJQUFJRyx3QkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsT0FBTzthQUNWO1lBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ3pCLFNBQVMsQ0FDTCxJQUFJLGNBQWMsQ0FDZCw2RUFBNkUsQ0FDaEYsQ0FDSixDQUFDO2dCQUNGLE9BQU87YUFDVjs7O1lBSUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztZQUN6RCxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7Z0JBQ3RCLFNBQVMsQ0FDTCxJQUFJLGNBQWMsQ0FDZCxvRUFBb0UsQ0FDdkUsQ0FDSixDQUFDO2dCQUNGLE9BQU87YUFDVjtZQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFVLE1BQU07Z0JBQ3RELE1BQU0sZ0JBQWdCLEdBQUc7b0JBQ3JCLFVBQVUsRUFBRTt3QkFDUixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdkQsdUNBQ08sUUFBUSxLQUNYLFNBQVMsRUFBRSxLQUFLLEVBQ2hCLFNBQVMsRUFBRSxFQUFFLEVBQ2IsUUFBUSxFQUFFLEtBQUssSUFDakI7cUJBQ0w7b0JBQ0QsU0FBUyxFQUFFLFVBQVUsS0FBVTt3QkFDM0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZELE1BQU0sU0FBUyxtQ0FDUixRQUFRLEtBQ1gsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQzFCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsR0FDM0IsQ0FBQzt3QkFDRixPQUFPLFNBQVMsQ0FBQztxQkFDcEI7b0JBQ0QsU0FBUyxFQUFFLFVBQVUsS0FBVTt3QkFDM0IsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFOzRCQUNqQixPQUFPLHNDQUFzQyxDQUFDO3lCQUNqRDt3QkFDRCxPQUFPLElBQUksQ0FBQztxQkFDZjtvQkFDRCxLQUFLLEVBQUUsVUFBVSxNQUFXLEVBQUUsS0FBVTt3QkFDcEMsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTs0QkFDakMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7eUJBQ3pCO3dCQUVELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTs0QkFDakIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOzRCQUNsQixJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFO2dDQUNuQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQ0FDeEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0NBQ3ZCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7Z0NBQ2xDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dDQUVyQixPQUFPLFFBQVEsZUFBZSxJQUFJLGtCQUFrQixJQUFJLDBCQUEwQixJQUFJLFNBQVMsRUFBRSxDQUFDOzZCQUNyRzs0QkFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDL0MsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0NBQ3pDLFFBQVEsSUFBSSx1Q0FBdUMsQ0FBQzs2QkFDdkQ7NEJBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0NBQ2pCLFFBQVEsSUFBSSxTQUFTLGVBQWUsRUFBRSxDQUFDOzZCQUMxQzs0QkFFRCxPQUFPLEdBQUcsUUFBUSxJQUFJLGtCQUFrQixJQUFJLFNBQVMsRUFBRSxDQUFDO3lCQUMzRDt3QkFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUN0Qiw0QkFBNEIsRUFDNUIsSUFBSSxDQUNQLENBQUM7d0JBQ0YsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFOzRCQUNmLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDWixLQUFLLEdBQUc7b0NBQ0osS0FBSyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztvQ0FDMUMsTUFBTTtnQ0FDVixLQUFLLEdBQUc7b0NBQ0osS0FBSyxDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztvQ0FDekMsTUFBTTtnQ0FDVjtvQ0FDSSxLQUFLLENBQUMsU0FBUzt3Q0FDWCxnQ0FBZ0MsQ0FBQztvQ0FDckMsTUFBTTs2QkFDYjs0QkFDRCxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs0QkFDdkIsT0FBTyxRQUFRLGVBQWUsSUFBSSxrQkFBa0IsSUFBSSwwQkFBMEIsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7eUJBQzNHO3dCQUVELE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQzs0QkFBQyxDQUFDO3dCQUM1RCxPQUFPLElBQUksQ0FBQztxQkFDZjtpQkFDSixDQUFDO2dCQUNGLE9BQU8sWUFBWSxDQUNmLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFDNUMsZ0JBQWdCLENBQ25CLENBQUM7YUFDTCxDQUFDLENBQUM7U0FDTjtLQUFBO0lBRUssY0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBa0RuQjtLQUFBOzs7QUNyTEwsU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNwQztBQUNBLElBQUksSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQy9CLFFBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUMsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQzlCLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDekIsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBQ0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDbEQsSUFBSSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7QUFDbkQsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUN0QyxJQUFJLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxJQUFJLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDbkMsSUFBSSxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbEQsSUFBSSxPQUFPO0FBQ1gsUUFBUSxXQUFXO0FBQ25CLFlBQVksTUFBTTtBQUNsQixZQUFZLE9BQU87QUFDbkIsWUFBWSxLQUFLO0FBQ2pCLFlBQVksT0FBTztBQUNuQixZQUFZLElBQUk7QUFDaEIsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdkMsWUFBWSxJQUFJO0FBQ2hCLFlBQVksSUFBSTtBQUNoQixZQUFZLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2xDLFlBQVksR0FBRyxDQUFDO0FBQ2hCLElBQUksTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUcsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsU0FBUywyQkFBMkIsR0FBRztBQUN2QyxJQUFJLElBQUk7QUFDUixRQUFRLE9BQU8sSUFBSSxRQUFRLENBQUMseUNBQXlDLENBQUMsRUFBRSxDQUFDO0FBQ3pFLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxFQUFFO0FBQ2QsUUFBUSxJQUFJLENBQUMsWUFBWSxXQUFXLEVBQUU7QUFDdEMsWUFBWSxNQUFNLE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3pFLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxNQUFNLENBQUMsQ0FBQztBQUNwQixTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUN2QjtBQUNBLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7QUFDckMsUUFBUSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5QixLQUFLO0FBQ0wsU0FBUztBQUNULFFBQVEsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ3hCO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtBQUN0QyxRQUFRLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQy9CLEtBQUs7QUFDTCxTQUFTO0FBQ1QsUUFBUSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUMvQixJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNuQyxJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFO0FBQzdCLFFBQVEsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ3RDLFlBQVksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM5QyxJQUFJLElBQUksUUFBUSxDQUFDO0FBQ2pCLElBQUksSUFBSSxTQUFTLENBQUM7QUFDbEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3hDO0FBQ0E7QUFDQSxRQUFRLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLFFBQVEsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUMvQyxLQUFLO0FBQ0wsSUFBSSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQ3BDLFFBQVEsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUMxQixLQUFLO0FBQ0wsSUFBSSxJQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO0FBQ3RDLFFBQVEsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUM1QixLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pDLFFBQVEsT0FBTyxHQUFHLENBQUM7QUFDbkIsS0FBSztBQUNMLElBQUksSUFBSSxRQUFRLEtBQUssT0FBTyxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7QUFDdkQsUUFBUSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixLQUFLO0FBQ0wsSUFBSSxJQUFJLFFBQVEsS0FBSyxHQUFHLElBQUksUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUNsRDtBQUNBO0FBQ0EsUUFBUSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLEtBQUs7QUFDTCxTQUFTLElBQUksUUFBUSxLQUFLLEdBQUcsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQ3BEO0FBQ0EsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqRCxLQUFLO0FBQ0wsSUFBSSxJQUFJLFNBQVMsS0FBSyxHQUFHLElBQUksU0FBUyxLQUFLLE9BQU8sRUFBRTtBQUNwRDtBQUNBLFFBQVEsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0wsU0FBUyxJQUFJLFNBQVMsS0FBSyxHQUFHLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUN0RDtBQUNBLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxPQUFPO0FBQ2hCLElBQUksR0FBRyxFQUFFLE1BQU07QUFDZixJQUFJLEdBQUcsRUFBRSxNQUFNO0FBQ2YsSUFBSSxHQUFHLEVBQUUsUUFBUTtBQUNqQixJQUFJLEdBQUcsRUFBRSxPQUFPO0FBQ2hCLENBQUMsQ0FBQztBQUNGLFNBQVMsV0FBVyxDQUFDLENBQUMsRUFBRTtBQUN4QixJQUFJLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUU7QUFDeEI7QUFDQTtBQUNBLElBQUksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2hDLFFBQVEsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN2RCxLQUFLO0FBQ0wsU0FBUztBQUNULFFBQVEsT0FBTyxNQUFNLENBQUM7QUFDdEIsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0EsSUFBSSxjQUFjLEdBQUcsb0VBQW9FLENBQUM7QUFDMUYsSUFBSSxjQUFjLEdBQUcsbUNBQW1DLENBQUM7QUFDekQsSUFBSSxjQUFjLEdBQUcsbUNBQW1DLENBQUM7QUFDekQ7QUFDQSxTQUFTLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDOUI7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBQ0QsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUM1QixJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLElBQUksSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNwQyxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxZQUFZLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsWUFBWSxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDeEMsZ0JBQWdCLEdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLEtBQUs7QUFDTDtBQUNBLElBQUksY0FBYyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDakMsSUFBSSxjQUFjLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNqQyxJQUFJLGNBQWMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLElBQUksU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO0FBQ3hELFFBQVEsSUFBSSxLQUFLLEVBQUU7QUFDbkI7QUFDQSxZQUFZLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxpQkFBaUI7QUFDM0QsWUFBWSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JDLFlBQVksSUFBSSxLQUFLLEVBQUU7QUFDdkI7QUFDQTtBQUNBLGdCQUFnQixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRixnQkFBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLElBQUksUUFBUSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxXQUFXLEVBQUUsTUFBTSxFQUFFO0FBQ3pILFFBQVEsSUFBSSxXQUFXLElBQUksTUFBTSxFQUFFO0FBQ25DLFlBQVksT0FBTyxXQUFXLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1QsYUFBYSxJQUFJLE1BQU0sRUFBRTtBQUN6QjtBQUNBLFlBQVksT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEMsU0FBUztBQUNULGFBQWE7QUFDYjtBQUNBLFlBQVksT0FBTyxXQUFXLENBQUM7QUFDL0IsU0FBUztBQUNULEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLElBQUksSUFBSSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxHQUFHLFFBQVEsR0FBRyxvQkFBb0IsR0FBRyxRQUFRLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3JKLElBQUksSUFBSSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsMkJBQTJCLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDMUc7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQ1YsSUFBSSxRQUFRLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO0FBQ3pDLFFBQVEsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMxQyxRQUFRLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsUUFBUSxVQUFVLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFFBQVEsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDNUMsUUFBUSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUM5QixRQUFRLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztBQUMvQixRQUFRLFFBQVEsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUc7QUFDckQsWUFBWSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM3QixnQkFBZ0IsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FLGdCQUFnQixZQUFZLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQzdFLGdCQUFnQixpQkFBaUIsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsZ0JBQWdCLElBQUksV0FBVyxHQUFHLE1BQU0sS0FBSyxZQUFZLENBQUMsSUFBSTtBQUM5RCxzQkFBc0IsR0FBRztBQUN6QixzQkFBc0IsTUFBTSxLQUFLLFlBQVksQ0FBQyxHQUFHO0FBQ2pELDBCQUEwQixHQUFHO0FBQzdCLDBCQUEwQixNQUFNLEtBQUssWUFBWSxDQUFDLFdBQVc7QUFDN0QsOEJBQThCLEdBQUc7QUFDakMsOEJBQThCLEVBQUUsQ0FBQztBQUNqQyxnQkFBZ0IsVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDOUQsZ0JBQWdCLE1BQU07QUFDdEIsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQixnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLGdCQUFnQixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDbkMsb0JBQW9CLElBQUksZUFBZSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyRixvQkFBb0IsSUFBSSxlQUFlLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEQsd0JBQXdCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFFLHFCQUFxQjtBQUNyQixvQkFBb0IsYUFBYSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFDOUQsaUJBQWlCO0FBQ2pCLHFCQUFxQixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7QUFDdkMsb0JBQW9CLGNBQWMsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM5RCxvQkFBb0IsSUFBSSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BFLG9CQUFvQixJQUFJLGdCQUFnQixFQUFFO0FBQzFDLHdCQUF3QixhQUFhLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDM0UscUJBQXFCO0FBQ3JCLHlCQUF5QjtBQUN6Qix3QkFBd0IsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekUscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixxQkFBcUIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ3ZDLG9CQUFvQixjQUFjLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDOUQsb0JBQW9CLElBQUksZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRSxvQkFBb0IsSUFBSSxnQkFBZ0IsRUFBRTtBQUMxQyx3QkFBd0IsYUFBYSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQzNFLHFCQUFxQjtBQUNyQix5QkFBeUI7QUFDekIsd0JBQXdCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pFLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIscUJBQXFCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUN2QyxvQkFBb0IsY0FBYyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzlELG9CQUFvQixJQUFJLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEUsb0JBQW9CLElBQUksZ0JBQWdCLEVBQUU7QUFDMUMsd0JBQXdCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUMzRSxxQkFBcUI7QUFDckIseUJBQXlCO0FBQ3pCLHdCQUF3QixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6RSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxJQUFJLFVBQVUsRUFBRTtBQUN4QixZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsU0FBUztBQUNULGFBQWE7QUFDYixZQUFZLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVFLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hELElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hELFlBQVksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxZQUFZLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUNuQyxnQkFBZ0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNELGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDdEMsSUFBSSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsb0JBQW9CO0FBQ2xDLFNBQVMsTUFBTSxDQUFDLE9BQU8sR0FBRyw0QkFBNEIsR0FBRyxFQUFFLENBQUM7QUFDNUQsU0FBUyxNQUFNLENBQUMsV0FBVyxHQUFHLG9DQUFvQyxHQUFHLEVBQUUsQ0FBQztBQUN4RSxRQUFRLHdDQUF3QztBQUNoRCxTQUFTLE1BQU0sQ0FBQyxXQUFXLEdBQUcsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQ3hELFNBQVMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25FLFFBQVEsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDcEMsU0FBUyxNQUFNLENBQUMsV0FBVztBQUMzQixjQUFjLFlBQVk7QUFDMUIsaUJBQWlCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUM5QyxpQkFBaUIsZ0NBQWdDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztBQUMzRixjQUFjLE1BQU0sQ0FBQyxPQUFPO0FBQzVCLGtCQUFrQixZQUFZO0FBQzlCLHFCQUFxQixNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEQscUJBQXFCLDRCQUE0QixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7QUFDM0Ysa0JBQWtCLEVBQUUsQ0FBQztBQUNyQixRQUFRLCtCQUErQjtBQUN2QyxTQUFTLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hELFlBQVksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxZQUFZLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUN4QyxnQkFBZ0IsR0FBRyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFELGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNwQyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQ1YsSUFBSSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2pDLElBQUksSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLElBQUksSUFBSSxlQUFlLEdBQUcsWUFBWSxDQUFDO0FBQ3ZDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsUUFBUSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUM5QyxZQUFZLElBQUksR0FBRyxHQUFHLFlBQVksQ0FBQztBQUNuQztBQUNBLFlBQVksU0FBUyxJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQy9DLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFlBQVksSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDakQsWUFBWSxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7QUFDOUI7QUFDQSxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ3hDLG9CQUFvQixTQUFTLElBQUksWUFBWSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDakUsb0JBQW9CLFNBQVMsSUFBSSxPQUFPLEdBQUcsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUNuRSxpQkFBaUI7QUFDakIscUJBQXFCO0FBQ3JCLG9CQUFvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDdkMsd0JBQXdCLE9BQU8sR0FBRyxXQUFXLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUM5RCxxQkFBcUI7QUFDckIsb0JBQW9CLFNBQVMsSUFBSSxNQUFNLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztBQUN6RCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLGlCQUFpQixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7QUFDbkM7QUFDQSxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ3hDLG9CQUFvQixTQUFTLElBQUksWUFBWSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDakUsb0JBQW9CLFNBQVMsSUFBSSxPQUFPLEdBQUcsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUNuRSxpQkFBaUI7QUFDakIscUJBQXFCO0FBQ3JCLG9CQUFvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDdkMsd0JBQXdCLE9BQU8sR0FBRyxXQUFXLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUM5RCxxQkFBcUI7QUFDckIsb0JBQW9CLFNBQVMsSUFBSSxNQUFNLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztBQUN6RCxvQkFBb0IsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQzNDLHdCQUF3QixPQUFPLEdBQUcsTUFBTSxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDekQscUJBQXFCO0FBQ3JCLG9CQUFvQixTQUFTLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDekQsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixpQkFBaUIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ25DO0FBQ0EsZ0JBQWdCLFNBQVMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzVDLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQzVCLFFBQVEsU0FBUyxJQUFJLDBEQUEwRCxHQUFHLGVBQWUsR0FBRyw0QkFBNEIsQ0FBQztBQUNqSSxLQUFLO0FBQ0wsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sa0JBQWtCLFlBQVk7QUFDeEMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDM0IsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMzQixLQUFLO0FBQ0wsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDbEQsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUM5QixLQUFLLENBQUM7QUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLEtBQUssQ0FBQztBQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDN0MsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsS0FBSyxDQUFDO0FBQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFZO0FBQ3pDLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDeEIsS0FBSyxDQUFDO0FBQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLFFBQVEsRUFBRTtBQUNoRCxRQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLEtBQUssQ0FBQztBQUNOLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUU7QUFDakQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNuQixRQUFRLE1BQU0sTUFBTSxDQUFDLDRCQUE0QixHQUFHLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzlFLEtBQUs7QUFDTCxJQUFJLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE1BQU0sR0FBRztBQUNiLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsSUFBSSxVQUFVLEVBQUUsSUFBSTtBQUNwQixJQUFJLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDM0IsSUFBSSxLQUFLLEVBQUUsS0FBSztBQUNoQixJQUFJLENBQUMsRUFBRSxTQUFTO0FBQ2hCLElBQUksT0FBTyxFQUFFLGFBQWE7QUFDMUIsSUFBSSxLQUFLLEVBQUU7QUFDWCxRQUFRLElBQUksRUFBRSxFQUFFO0FBQ2hCLFFBQVEsV0FBVyxFQUFFLEdBQUc7QUFDeEIsUUFBUSxHQUFHLEVBQUUsR0FBRztBQUNoQixLQUFLO0FBQ0wsSUFBSSxPQUFPLEVBQUUsRUFBRTtBQUNmLElBQUksWUFBWSxFQUFFLEtBQUs7QUFDdkIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ3RCLElBQUksU0FBUyxFQUFFLFNBQVM7QUFDeEIsSUFBSSxPQUFPLEVBQUUsS0FBSztBQUNsQixJQUFJLE9BQU8sRUFBRSxJQUFJO0FBQ2pCLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDekM7QUFDQSxJQUFJLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxJQUFJLFVBQVUsRUFBRTtBQUNwQixRQUFRLFNBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbkMsS0FBSztBQUNMLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDbEIsUUFBUSxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUtEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQzlCLElBQUksSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxQztBQUNBO0FBQ0EsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLDJCQUEyQixFQUFFLEdBQUcsUUFBUSxDQUFDO0FBQ3hFO0FBQ0EsSUFBSSxJQUFJO0FBQ1IsUUFBUSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRztBQUM1QyxRQUFRLElBQUk7QUFDWixRQUFRLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsRUFBRTtBQUNkLFFBQVEsSUFBSSxDQUFDLFlBQVksV0FBVyxFQUFFO0FBQ3RDLFlBQVksTUFBTSxNQUFNLENBQUMseUJBQXlCO0FBQ2xELGdCQUFnQixDQUFDLENBQUMsT0FBTztBQUN6QixnQkFBZ0IsSUFBSTtBQUNwQixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckQsZ0JBQWdCLElBQUk7QUFDcEIsZ0JBQWdCLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO0FBQzdDLGdCQUFnQixJQUFJO0FBQ3BCLGFBQWEsQ0FBQztBQUNkLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxNQUFNLENBQUMsQ0FBQztBQUNwQixTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO0FBQ3pELElBQUksSUFBSSxXQUFXLEdBQUdPLGVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBR0EsZUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDdEYsSUFBSSxJQUFJO0FBQ1IsS0FBSyxJQUFJQSxlQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMzQyxJQUFJLE9BQU8sV0FBVyxDQUFDO0FBQ3ZCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUNoQyxJQUFJLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztBQUM1QixJQUFJLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDOUIsSUFBSSxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckMsUUFBUSxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7QUFDbEMsUUFBUSxJQUFJLEVBQUUsSUFBSTtBQUNsQixRQUFRLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtBQUMxQixRQUFRLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztBQUM1QixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN0RjtBQUNBLFFBQVEsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUU7QUFDN0MsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNuRCxZQUFZLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0MsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN0QyxRQUFRLElBQUksUUFBUSxDQUFDO0FBQ3JCO0FBQ0E7QUFDQSxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDaEMsWUFBWSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLGdCQUFnQixRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCxnQkFBZ0IsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUMsZ0JBQWdCLE9BQU9DLGFBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QyxhQUFhLENBQUMsRUFBRTtBQUNoQjtBQUNBO0FBQ0EsWUFBWSxPQUFPLFFBQVEsQ0FBQztBQUM1QixTQUFTO0FBQ1QsYUFBYSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUM1QztBQUNBLFlBQVksUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsWUFBWSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxZQUFZLElBQUlBLGFBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN0QyxnQkFBZ0IsT0FBTyxRQUFRLENBQUM7QUFDaEMsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDckIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0M7QUFDQSxJQUFJLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDL0I7QUFDQTtBQUNBLFFBQVEsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckQ7QUFDQSxRQUFRLFdBQVcsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUMxQjtBQUNBO0FBQ0EsWUFBWSxJQUFJLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUYsWUFBWSxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1QyxZQUFZLFdBQVcsR0FBRyxZQUFZLENBQUM7QUFDdkMsU0FBUztBQUNULEtBQUs7QUFDTCxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQzlCLFlBQVksSUFBSSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRSxZQUFZLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksSUFBSUEsYUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3RDLGdCQUFnQixXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQ3ZDLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDMUIsWUFBWSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRCxTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzFCLFlBQVksTUFBTSxNQUFNLENBQUMsK0JBQStCLEdBQUcsSUFBSSxHQUFHLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxDQUFDO0FBQ3RHLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7QUFDaEQsUUFBUSxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztBQUN6RCxLQUFLO0FBQ0wsSUFBSSxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFO0FBQzVCLElBQUksSUFBSTtBQUNSLFFBQVEsT0FBT0MsZUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsS0FBSztBQUNMLElBQUksT0FBTyxFQUFFLEVBQUU7QUFDZixRQUFRLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN0RSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDOUMsSUFBSSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEMsSUFBSSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJO0FBQ1IsUUFBUSxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekQsUUFBUSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3RCLFlBQVksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3ZFLFNBQVM7QUFDVCxRQUFRLE9BQU8sZ0JBQWdCLENBQUM7QUFDaEMsS0FBSztBQUNMLElBQUksT0FBTyxDQUFDLEVBQUU7QUFDZCxRQUFRLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxjQUFjLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9FLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUU7QUFDaEMsSUFBSSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3BDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLElBQUksRUFBRTtBQUNsQixZQUFZLE9BQU8sSUFBSSxDQUFDO0FBQ3hCLFNBQVM7QUFDVCxRQUFRLE9BQU8sUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQXlDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDcEM7QUFDQSxJQUFJLElBQUksY0FBYyxHQUFHLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEY7QUFDQSxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQXdERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLElBQUksSUFBSSxpQkFBaUIsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BELElBQUksT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDeEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDOUUsUUFBUSxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxLQUFLO0FBQ0wsSUFBSSxJQUFJLFlBQVksR0FBRyxPQUFPLFFBQVEsS0FBSyxVQUFVLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUY7QUFDQTtBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDdkMsUUFBUSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzdELEtBQUs7QUFDTCxJQUFJLE9BQU8sWUFBWSxDQUFDO0FBQ3hCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7QUFDNUMsSUFBSSxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxFQUFFLEVBQUU7QUFDaEI7QUFDQSxZQUFZLElBQUk7QUFDaEI7QUFDQTtBQUNBLGdCQUFnQixJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM5QyxhQUFhO0FBQ2IsWUFBWSxPQUFPLEdBQUcsRUFBRTtBQUN4QixnQkFBZ0IsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsYUFBYTtBQUNiLFNBQVM7QUFDVCxhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQ25ELGdCQUFnQixPQUFPLElBQUksV0FBVyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUNsRSxvQkFBb0IsSUFBSTtBQUN4Qix3QkFBd0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0UscUJBQXFCO0FBQ3JCLG9CQUFvQixPQUFPLEdBQUcsRUFBRTtBQUNoQyx3QkFBd0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLHFCQUFxQjtBQUNyQixpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CLGFBQWE7QUFDYixpQkFBaUI7QUFDakIsZ0JBQWdCLE1BQU0sTUFBTSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7QUFDdEcsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0wsU0FBUztBQUNULFFBQVEsT0FBTyxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7QUFDakQ7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQUNEO0FBQ0E7QUFDQSxNQUFNLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO0FBQ3ZDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRTs7TUN4Z0NaLE1BQU07SUFDVCxjQUFjLENBQ2hCLE9BQWUsRUFDZixNQUErQjs7WUFFL0IsT0FBTyxJQUFJLE1BQU1DLFdBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYixLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsV0FBVyxFQUFFLEdBQUc7b0JBQ2hCLEdBQUcsRUFBRSxFQUFFO2lCQUNWO2dCQUNELFFBQVEsRUFBRSxLQUFLO2dCQUNmLFdBQVcsRUFBRSxJQUFJO2FBQ3BCLENBQUMsQ0FBVyxDQUFDO1lBRWQsT0FBTyxPQUFPLENBQUM7U0FDbEI7S0FBQTs7O0FDRUwsSUFBWSxPQU9YO0FBUEQsV0FBWSxPQUFPO0lBQ2YsdUVBQXFCLENBQUE7SUFDckIsNkRBQWdCLENBQUE7SUFDaEIsdURBQWEsQ0FBQTtJQUNiLG1FQUFtQixDQUFBO0lBQ25CLDZEQUFnQixDQUFBO0lBQ2hCLDJEQUFlLENBQUE7QUFDbkIsQ0FBQyxFQVBXLE9BQU8sS0FBUCxPQUFPLFFBT2xCO01BU1ksU0FBUztJQU1sQixZQUFvQixHQUFRLEVBQVUsTUFBdUI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQ3pELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGtCQUFrQixDQUM3QyxJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxNQUFNLENBQ2QsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0tBQzlCO0lBRUssS0FBSzs7WUFDUCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQzlDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQzFDLENBQUM7U0FDTDtLQUFBO0lBRUQscUJBQXFCLENBQ2pCLGFBQW9CLEVBQ3BCLFdBQWtCLEVBQ2xCLFFBQWlCO1FBRWpCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXZELE9BQU87WUFDSCxhQUFhLEVBQUUsYUFBYTtZQUM1QixXQUFXLEVBQUUsV0FBVztZQUN4QixRQUFRLEVBQUUsUUFBUTtZQUNsQixXQUFXLEVBQUUsV0FBVztTQUMzQixDQUFDO0tBQ0w7SUFFSyx1QkFBdUIsQ0FBQyxNQUFxQjs7WUFDL0MsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDOUMsTUFBTSxDQUFDLGFBQWEsQ0FDdkIsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUN4RDtLQUFBO0lBRUssY0FBYyxDQUNoQixNQUFxQixFQUNyQixnQkFBd0I7O1lBRXhCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUNuRSxNQUFNLEVBQ04sYUFBYSxDQUFDLGFBQWEsQ0FDOUIsQ0FBQztZQUNGLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztZQUNqRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUM1QyxnQkFBZ0IsRUFDaEIsZ0JBQWdCLENBQ25CLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztTQUNsQjtLQUFBO0lBRUssNEJBQTRCLENBQUMsSUFBVzs7WUFDMUMsSUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUI7Z0JBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksRUFDN0M7Z0JBQ0UsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLENBQUM7YUFDcEQ7U0FDSjtLQUFBO0lBRUssNkJBQTZCLENBQy9CLFFBQXdCLEVBQ3hCLE1BQWdCLEVBQ2hCLFFBQWlCLEVBQ2pCLGFBQWEsR0FBRyxJQUFJOzs7WUFHcEIsSUFBSSxDQUFDLE1BQU0sRUFBRTs7O2dCQUdULE1BQU0saUJBQWlCLEdBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNoRCxRQUFRLGlCQUFpQjtvQkFDckIsS0FBSyxTQUFTLEVBQUU7d0JBQ1osTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ3ZELElBQUksV0FBVyxFQUFFOzRCQUNiLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO3lCQUMvQjt3QkFDRCxNQUFNO3FCQUNUO29CQUNELEtBQUssUUFBUTt3QkFDVCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ25ELE1BQU07b0JBQ1YsS0FBSyxNQUFNO3dCQUNQLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDbEMsTUFBTTtpQkFHYjthQUNKOzs7WUFJRCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUNqRSxNQUFNLEVBQ04sUUFBUSxhQUFSLFFBQVEsY0FBUixRQUFRLEdBQUksVUFBVSxDQUN6QixDQUFDO1lBRUYsSUFBSSxjQUE2QixDQUFDO1lBQ2xDLElBQUksY0FBc0IsQ0FBQztZQUMzQixJQUFJLFFBQVEsWUFBWWxCLHFCQUFLLEVBQUU7Z0JBQzNCLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3ZDLFFBQVEsRUFDUixZQUFZLEVBQ1osT0FBTyxDQUFDLHFCQUFxQixDQUNoQyxDQUFDO2dCQUNGLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FDL0IscURBQVksT0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUEsR0FBQSxFQUN4RCxtQ0FBbUMsQ0FDdEMsQ0FBQzthQUNMO2lCQUFNO2dCQUNILGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3ZDLFNBQVMsRUFDVCxZQUFZLEVBQ1osT0FBTyxDQUFDLHFCQUFxQixDQUNoQyxDQUFDO2dCQUNGLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FDL0IscURBQVksT0FBQSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQSxHQUFBLEVBQ3pELG1DQUFtQyxDQUN0QyxDQUFDO2FBQ0w7WUFFRCxJQUFJLGNBQWMsSUFBSSxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMxQyxPQUFPO2FBQ1Y7WUFFRCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFMUQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUNsRCxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNkLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELE9BQU87aUJBQ1Y7Z0JBQ0QsTUFBTSxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtvQkFDckMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtvQkFDekIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtpQkFDNUIsQ0FBQyxDQUFDO2dCQUNILE1BQU0sSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsT0FBTyxZQUFZLENBQUM7U0FDdkI7S0FBQTtJQUVLLDhCQUE4QixDQUFDLGFBQW9COztZQUNyRCxNQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQ0ssNEJBQVksQ0FBQyxDQUFDO1lBQ3pELElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDdEIsU0FBUyxDQUNMLElBQUksY0FBYyxDQUFDLHlDQUF5QyxDQUFDLENBQ2hFLENBQUM7Z0JBQ0YsT0FBTzthQUNWO1lBQ0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUM3QyxhQUFhLEVBQ2IsV0FBVyxDQUFDLElBQUksRUFDaEIsT0FBTyxDQUFDLGdCQUFnQixDQUMzQixDQUFDO1lBQ0YsTUFBTSxjQUFjLEdBQUcsTUFBTSxZQUFZLENBQ3JDLHFEQUFZLE9BQUEsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxDQUFBLEdBQUEsRUFDeEQsbUNBQW1DLENBQ3RDLENBQUM7O1lBRUYsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO2dCQUN4QixPQUFPO2FBQ1Y7WUFFRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFckMsTUFBTSxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdEO0tBQUE7SUFFSyxzQkFBc0IsQ0FDeEIsYUFBb0IsRUFDcEIsSUFBVzs7WUFFWCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQzdDLGFBQWEsRUFDYixJQUFJLEVBQ0osT0FBTyxDQUFDLGFBQWEsQ0FDeEIsQ0FBQztZQUNGLE1BQU0sY0FBYyxHQUFHLE1BQU0sWUFBWSxDQUNyQyxxREFBWSxPQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQSxHQUFBLEVBQ3hELG1DQUFtQyxDQUN0QyxDQUFDOztZQUVGLElBQUksY0FBYyxJQUFJLElBQUksRUFBRTtnQkFDeEIsT0FBTzthQUNWO1lBQ0QsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pEO0tBQUE7SUFFRCw4QkFBOEI7UUFDMUIsTUFBTSxXQUFXLEdBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLDRCQUFZLENBQUMsQ0FBQztRQUN6RCxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDdEIsU0FBUyxDQUNMLElBQUksY0FBYyxDQUNkLDhDQUE4QyxDQUNqRCxDQUNKLENBQUM7WUFDRixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4RDtJQUVLLHVCQUF1QixDQUN6QixJQUFXLEVBQ1gsV0FBVyxHQUFHLEtBQUs7O1lBRW5CLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDN0MsSUFBSSxFQUNKLElBQUksRUFDSixXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQ3BFLENBQUM7WUFDRixNQUFNLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FDckMscURBQVksT0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUEsR0FBQSxFQUN4RCxtQ0FBbUMsQ0FDdEMsQ0FBQzs7WUFFRixJQUFJLGNBQWMsSUFBSSxJQUFJLEVBQUU7Z0JBQ3hCLE9BQU87YUFDVjtZQUNELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNsRCxNQUFNLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqRDtLQUFBO0lBRUsseUJBQXlCLENBQzNCLEVBQWUsRUFDZixHQUFpQzs7WUFFakMsTUFBTSxxQkFBcUIsR0FDdkIsMkNBQTJDLENBQUM7WUFFaEQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckUsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7WUFDakIsSUFBSSxnQkFBeUMsQ0FBQztZQUM5QyxRQUFRLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUc7Z0JBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzdCLElBQUksS0FBSyxDQUFDO2dCQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDdkQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQ3BELEVBQUUsRUFDRixHQUFHLENBQUMsVUFBVSxDQUNqQixDQUFDO29CQUNGLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLFlBQVlMLHFCQUFLLENBQUMsRUFBRTt3QkFDbkMsT0FBTztxQkFDVjtvQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNQLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUNyQyxJQUFJLEVBQ0osSUFBSSxFQUNKLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FDM0IsQ0FBQzt3QkFDRixnQkFBZ0I7NEJBQ1osTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUMxQyxNQUFNLEVBQ04sYUFBYSxDQUFDLGFBQWEsQ0FDOUIsQ0FBQzt3QkFDTixJQUFJLENBQUMsd0JBQXdCLEdBQUcsZ0JBQWdCLENBQUM7cUJBQ3BEO29CQUVELE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRTs7d0JBRWxCLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0MsTUFBTSxjQUFjLEdBQVcsTUFBTSxZQUFZLENBQzdDOzRCQUNJLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDbkMsZ0JBQWdCLEVBQ2hCLGdCQUFnQixDQUNuQixDQUFDO3lCQUNMLENBQUEsRUFDRCw2Q0FBNkMsZ0JBQWdCLEdBQUcsQ0FDbkUsQ0FBQzt3QkFDRixJQUFJLGNBQWMsSUFBSSxJQUFJLEVBQUU7NEJBQ3hCLE9BQU87eUJBQ1Y7d0JBQ0QsTUFBTSxLQUFLLEdBQ1AscUJBQXFCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7d0JBQ3RELE1BQU0sR0FBRyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQzt3QkFDNUMsT0FBTzs0QkFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7Z0NBQzNCLGNBQWM7Z0NBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFM0IscUJBQXFCLENBQUMsU0FBUzs0QkFDM0IsY0FBYyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUM1QyxLQUFLLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUMvQztvQkFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztpQkFDNUI7YUFDSjtTQUNKO0tBQUE7SUFFRCxnQ0FBZ0MsQ0FBQyxNQUFlO1FBQzVDLEdBQUc7WUFDQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQ3BELENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FDakMsQ0FBQztZQUVGLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUN6QjtZQUVELE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzFCLFFBQVEsTUFBTSxFQUFFO0tBQ3BCO0lBRUQsT0FBYSxnQkFBZ0IsQ0FDekIsU0FBb0IsRUFDcEIsSUFBbUI7O1lBRW5CLElBQUksRUFBRSxJQUFJLFlBQVlBLHFCQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDckQsT0FBTzthQUNWOztZQUdELE1BQU0sZUFBZSxHQUFHRCw2QkFBYSxDQUNqQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDN0MsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksZUFBZSxLQUFLLEdBQUcsRUFBRTtnQkFDaEUsT0FBTzthQUNWOzs7O1lBS0QsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakIsSUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO2dCQUNuQixTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFDbkQ7Z0JBQ0UsTUFBTSxxQkFBcUIsR0FDdkIsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFO29CQUN4QixPQUFPO2lCQUNWO2dCQUVELE1BQU0sYUFBYSxHQUFVLE1BQU0sWUFBWSxDQUMzQztvQkFDSSxPQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDLENBQUM7aUJBQzlELENBQUEsRUFDRCwwQkFBMEIscUJBQXFCLEVBQUUsQ0FDcEQsQ0FBQzs7Z0JBRUYsSUFBSSxhQUFhLElBQUksSUFBSSxFQUFFO29CQUN2QixPQUFPO2lCQUNWO2dCQUNELE1BQU0sU0FBUyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvRDtpQkFBTTtnQkFDSCxNQUFNLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqRDtTQUNKO0tBQUE7SUFFSyx1QkFBdUI7O1lBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ1gsU0FBUztpQkFDWjtnQkFDRCxNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FDekIsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFDdkMsbUNBQW1DLFFBQVEsR0FBRyxDQUNqRCxDQUFDO2dCQUNGLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1AsU0FBUztpQkFDWjtnQkFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQzdDLElBQUksRUFDSixJQUFJLEVBQ0osT0FBTyxDQUFDLGVBQWUsQ0FDMUIsQ0FBQztnQkFDRixNQUFNLFlBQVksQ0FDZCxxREFBWSxPQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQSxHQUFBLEVBQ3hELDJDQUEyQyxDQUM5QyxDQUFDO2FBQ0w7U0FDSjtLQUFBOzs7TUNqYWdCLFlBQVk7SUFJN0IsWUFDWSxHQUFRLEVBQ1IsTUFBdUIsRUFDdkIsU0FBb0IsRUFDcEIsUUFBa0I7UUFIbEIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUNSLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtLQUMxQjtJQUVKLEtBQUs7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDN0IsSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUM7U0FDMUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDM0I7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUMxQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUNsRCxZQUFZLEVBQ1osQ0FBQyxFQUFFO2dCQUNDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ3JDLENBQ0osQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRTtnQkFDckMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDckMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNILElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFO2dCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDekQ7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ25DLENBQUMsQ0FBQztTQUNOO0tBQ0o7SUFFRCwrQkFBK0I7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1lBQ3hDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQ25ELFFBQVEsRUFDUixDQUFDLElBQW1CLEtBQ2hCLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUN2RCxDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDbEU7YUFBTTtZQUNILElBQUksSUFBSSxDQUFDLDhCQUE4QixFQUFFO2dCQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyw4QkFBOEIsR0FBRyxTQUFTLENBQUM7YUFDbkQ7U0FDSjtLQUNKO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFVLEVBQUUsSUFBVztZQUN2RCxJQUFJLElBQUksWUFBWUQsdUJBQU8sRUFBRTtnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQWM7b0JBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsK0JBQStCLENBQUM7eUJBQ3pDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDekIsT0FBTyxDQUFDO3dCQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUNyRCxJQUFJLENBQ1AsQ0FBQztxQkFDTCxDQUFDLENBQUM7aUJBQ1YsQ0FBQyxDQUFDO2FBQ047U0FDSixDQUFDLENBQ0wsQ0FBQztLQUNMOzs7TUNoRlEsY0FBYztJQUN2QixZQUFvQixHQUFRLEVBQVUsTUFBdUI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO0tBQUk7SUFFakUsS0FBSztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ25CLEVBQUUsRUFBRSxrQkFBa0I7WUFDdEIsSUFBSSxFQUFFLDRCQUE0QjtZQUNsQyxPQUFPLEVBQUU7Z0JBQ0w7b0JBQ0ksU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsR0FBRztpQkFDWDthQUNKO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ2pEO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDbkIsRUFBRSxFQUFFLDJCQUEyQjtZQUMvQixJQUFJLEVBQUUsc0NBQXNDO1lBQzVDLE9BQU8sRUFBRTtnQkFDTDtvQkFDSSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ2xCLEdBQUcsRUFBRSxHQUFHO2lCQUNYO2FBQ0o7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLEVBQUUsQ0FBQzthQUMxRDtTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ25CLEVBQUUsRUFBRSw4QkFBOEI7WUFDbEMsSUFBSSxFQUFFLDhCQUE4QjtZQUNwQyxPQUFPLEVBQUU7Z0JBQ0w7b0JBQ0ksU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsS0FBSztpQkFDYjthQUNKO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO2FBQy9EO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDbkIsRUFBRSxFQUFFLCtCQUErQjtZQUNuQyxJQUFJLEVBQUUsK0JBQStCO1lBQ3JDLE9BQU8sRUFBRTtnQkFDTDtvQkFDSSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ2xCLEdBQUcsRUFBRSxHQUFHO2lCQUNYO2FBQ0o7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQzthQUMvRDtTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0tBQ3JDO0lBRUQsMEJBQTBCO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVE7WUFDNUQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1QztTQUNKLENBQUMsQ0FBQztLQUNOO0lBRUQsbUJBQW1CLENBQUMsWUFBb0IsRUFBRSxZQUFvQjtRQUMxRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFMUMsSUFBSSxZQUFZLEVBQUU7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDbkIsRUFBRSxFQUFFLFlBQVk7Z0JBQ2hCLElBQUksRUFBRSxVQUFVLFlBQVksRUFBRTtnQkFDOUIsUUFBUSxFQUFFO29CQUNOLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUM3QixNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUMzQyw2REFBNkQsQ0FDaEUsQ0FBQztvQkFDRixJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNYLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQ2hELFFBQVEsQ0FDWCxDQUFDO2lCQUNMO2FBQ0osQ0FBQyxDQUFDO1NBQ047S0FDSjtJQUVELHNCQUFzQixDQUFDLFFBQWdCO1FBQ25DLElBQUksUUFBUSxFQUFFOzs7WUFHVixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQzNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLFFBQVEsRUFBRSxDQUMzQyxDQUFDO1NBQ0w7S0FDSjs7O01DbkdnQixlQUFnQixTQUFRcUIsc0JBQU07SUFPekMsTUFBTTs7WUFDUixNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUUzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0MsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTdCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUUxRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUNqQyxJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksRUFDSixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxRQUFRLENBQ2hCLENBQUM7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTNCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTdCQyx1QkFBTyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQzFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7WUFHNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO2dCQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixFQUFFLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1NBQ047S0FBQTtJQUVLLGFBQWE7O1lBQ2YsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztLQUFBO0lBRUssYUFBYTs7WUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQ3pCLEVBQUUsRUFDRixnQkFBZ0IsRUFDaEIsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQ3hCLENBQUM7U0FDTDtLQUFBOzs7OzsifQ==
