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

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }

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

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
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
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
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
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
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
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
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
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
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
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
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
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
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
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
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
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
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
      offsets = getBoundingClientRect(offsetParent, true);
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
            const response = yield this.getRequest("https://api.quotable.io/random");
            const json = yield response.json();
            const author = json.author;
            const quote = json.content;
            const new_content = `> ${quote}\n> — <cite>${author}</cite>`;
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
    var includePath = path.resolve(isDirectory ? parentfile : path.dirname(parentfile), // returns directory the parent file is in
    name // file
    ) + (path.extname(name) ? '' : '.eta');
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
function handleCache(options) {
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
    return [handleCache(newFileOptions), newFileOptions];
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
function handleCache$1(template, options) {
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
                var templateFn = handleCache$1(template, options);
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
                        resolve(handleCache$1(template, options)(data, options));
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
        return handleCache$1(template, options)(data, options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9Mb2cudHMiLCJzcmMvRXJyb3IudHMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2VudW1zLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXBwbHlTdHlsZXMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL21hdGguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaXNUYWJsZUVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRQYXJlbnROb2RlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3dpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2Fycm93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRWaWV3cG9ydFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFNjcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlT2Zmc2V0cy5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZmxpcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9vZmZzZXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvb3JkZXJNb2RpZmllcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy91bmlxdWVCeS5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2NyZWF0ZVBvcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLmpzIiwic3JjL3N1Z2dlc3RlcnMvc3VnZ2VzdC50cyIsInNyYy9zdWdnZXN0ZXJzL0ZvbGRlclN1Z2dlc3Rlci50cyIsInNyYy9VdGlscy50cyIsInNyYy9zdWdnZXN0ZXJzL0ZpbGVTdWdnZXN0ZXIudHMiLCJzcmMvU2V0dGluZ3MudHMiLCJzcmMvRnV6enlTdWdnZXN0ZXIudHMiLCJzcmMvQ29uc3RhbnRzLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvd2ViL0ludGVybmFsTW9kdWxlV2ViLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9Qcm9tcHRNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9TdWdnZXN0ZXJNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9JbnRlcm5hbE1vZHVsZVN5c3RlbS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2NvbmZpZy9JbnRlcm5hbE1vZHVsZUNvbmZpZy50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU3lzdGVtRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU2NyaXB0RnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3IudHMiLCJzcmMvZWRpdG9yL0N1cnNvckp1bXBlci50cyIsInNyYy9lZGl0b3IvbW9kZS9qYXZhc2NyaXB0LmpzIiwic3JjL2VkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5LmpzIiwic3JjL2VkaXRvci9FZGl0b3IudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLmVzLmpzIiwic3JjL3BhcnNlci9QYXJzZXIudHMiLCJzcmMvVGVtcGxhdGVyLnRzIiwic3JjL0V2ZW50SGFuZGxlci50cyIsInNyYy9Db21tYW5kSGFuZGxlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nX3VwZGF0ZShtc2c6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vdGljZSA9IG5ldyBOb3RpY2UoXCJcIiwgMTUwMDApO1xuICAgIC8vIFRPRE86IEZpbmQgYmV0dGVyIHdheSBmb3IgdGhpc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciB1cGRhdGU8L2I+Ojxici8+JHttc2d9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ19lcnJvcihlOiBFcnJvciB8IFRlbXBsYXRlckVycm9yKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCA4MDAwKTtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yICYmIGUuY29uc29sZV9tc2cpIHtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgZm9yIHRoaXNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX08YnIvPkNoZWNrIGNvbnNvbGUgZm9yIG1vcmUgaW5mb3JtYXRpb25zYDtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVGVtcGxhdGVyIEVycm9yOmAsIGUubWVzc2FnZSwgXCJcXG5cIiwgZS5jb25zb2xlX21zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX1gO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gXCJMb2dcIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1zZzogc3RyaW5nLCBwdWJsaWMgY29uc29sZV9tc2c/OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIobXNnKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlcnJvcldyYXBwZXI8VD4oXG4gICAgZm46ICgpID0+IFByb21pc2U8VD4sXG4gICAgbXNnOiBzdHJpbmdcbik6IFByb21pc2U8VD4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yKSkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihtc2csIGUubWVzc2FnZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nX2Vycm9yKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVycm9yV3JhcHBlclN5bmM8VD4oZm46ICgpID0+IFQsIG1zZzogc3RyaW5nKTogVCB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKG1zZywgZS5tZXNzYWdlKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbiIsImV4cG9ydCB2YXIgdG9wID0gJ3RvcCc7XG5leHBvcnQgdmFyIGJvdHRvbSA9ICdib3R0b20nO1xuZXhwb3J0IHZhciByaWdodCA9ICdyaWdodCc7XG5leHBvcnQgdmFyIGxlZnQgPSAnbGVmdCc7XG5leHBvcnQgdmFyIGF1dG8gPSAnYXV0byc7XG5leHBvcnQgdmFyIGJhc2VQbGFjZW1lbnRzID0gW3RvcCwgYm90dG9tLCByaWdodCwgbGVmdF07XG5leHBvcnQgdmFyIHN0YXJ0ID0gJ3N0YXJ0JztcbmV4cG9ydCB2YXIgZW5kID0gJ2VuZCc7XG5leHBvcnQgdmFyIGNsaXBwaW5nUGFyZW50cyA9ICdjbGlwcGluZ1BhcmVudHMnO1xuZXhwb3J0IHZhciB2aWV3cG9ydCA9ICd2aWV3cG9ydCc7XG5leHBvcnQgdmFyIHBvcHBlciA9ICdwb3BwZXInO1xuZXhwb3J0IHZhciByZWZlcmVuY2UgPSAncmVmZXJlbmNlJztcbmV4cG9ydCB2YXIgdmFyaWF0aW9uUGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9iYXNlUGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pO1xuZXhwb3J0IHZhciBwbGFjZW1lbnRzID0gLyojX19QVVJFX18qL1tdLmNvbmNhdChiYXNlUGxhY2VtZW50cywgW2F1dG9dKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQsIHBsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7IC8vIG1vZGlmaWVycyB0aGF0IG5lZWQgdG8gcmVhZCB0aGUgRE9NXG5cbmV4cG9ydCB2YXIgYmVmb3JlUmVhZCA9ICdiZWZvcmVSZWFkJztcbmV4cG9ydCB2YXIgcmVhZCA9ICdyZWFkJztcbmV4cG9ydCB2YXIgYWZ0ZXJSZWFkID0gJ2FmdGVyUmVhZCc7IC8vIHB1cmUtbG9naWMgbW9kaWZpZXJzXG5cbmV4cG9ydCB2YXIgYmVmb3JlTWFpbiA9ICdiZWZvcmVNYWluJztcbmV4cG9ydCB2YXIgbWFpbiA9ICdtYWluJztcbmV4cG9ydCB2YXIgYWZ0ZXJNYWluID0gJ2FmdGVyTWFpbic7IC8vIG1vZGlmaWVyIHdpdGggdGhlIHB1cnBvc2UgdG8gd3JpdGUgdG8gdGhlIERPTSAob3Igd3JpdGUgaW50byBhIGZyYW1ld29yayBzdGF0ZSlcblxuZXhwb3J0IHZhciBiZWZvcmVXcml0ZSA9ICdiZWZvcmVXcml0ZSc7XG5leHBvcnQgdmFyIHdyaXRlID0gJ3dyaXRlJztcbmV4cG9ydCB2YXIgYWZ0ZXJXcml0ZSA9ICdhZnRlcldyaXRlJztcbmV4cG9ydCB2YXIgbW9kaWZpZXJQaGFzZXMgPSBbYmVmb3JlUmVhZCwgcmVhZCwgYWZ0ZXJSZWFkLCBiZWZvcmVNYWluLCBtYWluLCBhZnRlck1haW4sIGJlZm9yZVdyaXRlLCB3cml0ZSwgYWZ0ZXJXcml0ZV07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCA/IChlbGVtZW50Lm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmIChub2RlLnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdyA6IHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkhUTUxFbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1NoYWRvd1Jvb3Qobm9kZSkge1xuICAvLyBJRSAxMSBoYXMgbm8gU2hhZG93Um9vdFxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuU2hhZG93Um9vdDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290O1xufVxuXG5leHBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9OyIsImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7IC8vIFRoaXMgbW9kaWZpZXIgdGFrZXMgdGhlIHN0eWxlcyBwcmVwYXJlZCBieSB0aGUgYGNvbXB1dGVTdHlsZXNgIG1vZGlmaWVyXG4vLyBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBIVE1MRWxlbWVudHMgc3VjaCBhcyBwb3BwZXIgYW5kIGFycm93XG5cbmZ1bmN0aW9uIGFwcGx5U3R5bGVzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc3R5bGUgPSBzdGF0ZS5zdHlsZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gRmxvdyBkb2Vzbid0IHN1cHBvcnQgdG8gZXh0ZW5kIHRoaXMgcHJvcGVydHksIGJ1dCBpdCdzIHRoZSBtb3N0XG4gICAgLy8gZWZmZWN0aXZlIHdheSB0byBhcHBseSBzdHlsZXMgdG8gYW4gSFRNTEVsZW1lbnRcbiAgICAvLyAkRmxvd0ZpeE1lW2Nhbm5vdC13cml0ZV1cblxuXG4gICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcblxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlID09PSB0cnVlID8gJycgOiB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGU7XG4gIHZhciBpbml0aWFsU3R5bGVzID0ge1xuICAgIHBvcHBlcjoge1xuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIG1hcmdpbjogJzAnXG4gICAgfSxcbiAgICBhcnJvdzoge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICB9LFxuICAgIHJlZmVyZW5jZToge31cbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5wb3BwZXIuc3R5bGUsIGluaXRpYWxTdHlsZXMucG9wcGVyKTtcbiAgc3RhdGUuc3R5bGVzID0gaW5pdGlhbFN0eWxlcztcblxuICBpZiAoc3RhdGUuZWxlbWVudHMuYXJyb3cpIHtcbiAgICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLmFycm93LnN0eWxlLCBpbml0aWFsU3R5bGVzLmFycm93KTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgICB2YXIgc3R5bGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc3RhdGUuc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpID8gc3RhdGUuc3R5bGVzW25hbWVdIDogaW5pdGlhbFN0eWxlc1tuYW1lXSk7IC8vIFNldCBhbGwgdmFsdWVzIHRvIGFuIGVtcHR5IHN0cmluZyB0byB1bnNldCB0aGVtXG5cbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHN0eWxlLCBwcm9wZXJ0eSkge1xuICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgfSwge30pOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2FwcGx5U3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBhcHBseVN0eWxlcyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ2NvbXB1dGVTdHlsZXMnXVxufTsiLCJpbXBvcnQgeyBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG59IiwiZXhwb3J0IHZhciBtYXggPSBNYXRoLm1heDtcbmV4cG9ydCB2YXIgbWluID0gTWF0aC5taW47XG5leHBvcnQgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDsiLCJpbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIGluY2x1ZGVTY2FsZSkge1xuICBpZiAoaW5jbHVkZVNjYWxlID09PSB2b2lkIDApIHtcbiAgICBpbmNsdWRlU2NhbGUgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IDE7XG4gIHZhciBzY2FsZVkgPSAxO1xuXG4gIGlmIChpc0hUTUxFbGVtZW50KGVsZW1lbnQpICYmIGluY2x1ZGVTY2FsZSkge1xuICAgIHZhciBvZmZzZXRIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB2YXIgb2Zmc2V0V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoOyAvLyBEbyBub3QgYXR0ZW1wdCB0byBkaXZpZGUgYnkgMCwgb3RoZXJ3aXNlIHdlIGdldCBgSW5maW5pdHlgIGFzIHNjYWxlXG4gICAgLy8gRmFsbGJhY2sgdG8gMSBpbiBjYXNlIGJvdGggdmFsdWVzIGFyZSBgMGBcblxuICAgIGlmIChvZmZzZXRXaWR0aCA+IDApIHtcbiAgICAgIHNjYWxlWCA9IHJvdW5kKHJlY3Qud2lkdGgpIC8gb2Zmc2V0V2lkdGggfHwgMTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0SGVpZ2h0ID4gMCkge1xuICAgICAgc2NhbGVZID0gcm91bmQocmVjdC5oZWlnaHQpIC8gb2Zmc2V0SGVpZ2h0IHx8IDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogcmVjdC53aWR0aCAvIHNjYWxlWCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0IC8gc2NhbGVZLFxuICAgIHRvcDogcmVjdC50b3AgLyBzY2FsZVksXG4gICAgcmlnaHQ6IHJlY3QucmlnaHQgLyBzY2FsZVgsXG4gICAgYm90dG9tOiByZWN0LmJvdHRvbSAvIHNjYWxlWSxcbiAgICBsZWZ0OiByZWN0LmxlZnQgLyBzY2FsZVgsXG4gICAgeDogcmVjdC5sZWZ0IC8gc2NhbGVYLFxuICAgIHk6IHJlY3QudG9wIC8gc2NhbGVZXG4gIH07XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjsgLy8gUmV0dXJucyB0aGUgbGF5b3V0IHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LiBMYXlvdXRcbi8vIG1lYW5zIGl0IGRvZXNuJ3QgdGFrZSBpbnRvIGFjY291bnQgdHJhbnNmb3Jtcy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TGF5b3V0UmVjdChlbGVtZW50KSB7XG4gIHZhciBjbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpOyAvLyBVc2UgdGhlIGNsaWVudFJlY3Qgc2l6ZXMgaWYgaXQncyBub3QgYmVlbiB0cmFuc2Zvcm1lZC5cbiAgLy8gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMjIzXG5cbiAgdmFyIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LndpZHRoIC0gd2lkdGgpIDw9IDEpIHtcbiAgICB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGg7XG4gIH1cblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC5oZWlnaHQgLSBoZWlnaHQpIDw9IDEpIHtcbiAgICBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgIHk6IGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufSIsImltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRhaW5zKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHJvb3ROb2RlID0gY2hpbGQuZ2V0Um9vdE5vZGUgJiYgY2hpbGQuZ2V0Um9vdE5vZGUoKTsgLy8gRmlyc3QsIGF0dGVtcHQgd2l0aCBmYXN0ZXIgbmF0aXZlIG1ldGhvZFxuXG4gIGlmIChwYXJlbnQuY29udGFpbnMoY2hpbGQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gdGhlbiBmYWxsYmFjayB0byBjdXN0b20gaW1wbGVtZW50YXRpb24gd2l0aCBTaGFkb3cgRE9NIHN1cHBvcnRcbiAgZWxzZSBpZiAocm9vdE5vZGUgJiYgaXNTaGFkb3dSb290KHJvb3ROb2RlKSkge1xuICAgICAgdmFyIG5leHQgPSBjaGlsZDtcblxuICAgICAgZG8ge1xuICAgICAgICBpZiAobmV4dCAmJiBwYXJlbnQuaXNTYW1lTm9kZShuZXh0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXTogbmVlZCBhIGJldHRlciB3YXkgdG8gaGFuZGxlIHRoaXMuLi5cblxuXG4gICAgICAgIG5leHQgPSBuZXh0LnBhcmVudE5vZGUgfHwgbmV4dC5ob3N0O1xuICAgICAgfSB3aGlsZSAobmV4dCk7XG4gICAgfSAvLyBHaXZlIHVwLCB0aGUgcmVzdWx0IGlzIGZhbHNlXG5cblxuICByZXR1cm4gZmFsc2U7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1RhYmxlRWxlbWVudChlbGVtZW50KSB7XG4gIHJldHVybiBbJ3RhYmxlJywgJ3RkJywgJ3RoJ10uaW5kZXhPZihnZXROb2RlTmFtZShlbGVtZW50KSkgPj0gMDtcbn0iLCJpbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gIHJldHVybiAoKGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQub3duZXJEb2N1bWVudCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICBlbGVtZW50LmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpLmRvY3VtZW50RWxlbWVudDtcbn0iLCJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKGdldE5vZGVOYW1lKGVsZW1lbnQpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiAoLy8gdGhpcyBpcyBhIHF1aWNrZXIgKGJ1dCBsZXNzIHR5cGUgc2FmZSkgd2F5IHRvIHNhdmUgcXVpdGUgc29tZSBieXRlcyBmcm9tIHRoZSBidW5kbGVcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dXG4gICAgLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgZWxlbWVudC5hc3NpZ25lZFNsb3QgfHwgLy8gc3RlcCBpbnRvIHRoZSBzaGFkb3cgRE9NIG9mIHRoZSBwYXJlbnQgb2YgYSBzbG90dGVkIG5vZGVcbiAgICBlbGVtZW50LnBhcmVudE5vZGUgfHwgKCAvLyBET00gRWxlbWVudCBkZXRlY3RlZFxuICAgIGlzU2hhZG93Um9vdChlbGVtZW50KSA/IGVsZW1lbnQuaG9zdCA6IG51bGwpIHx8IC8vIFNoYWRvd1Jvb3QgZGV0ZWN0ZWRcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogSFRNTEVsZW1lbnQgaXMgYSBOb2RlXG4gICAgZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIC8vIGZhbGxiYWNrXG5cbiAgKTtcbn0iLCJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGlzVGFibGVFbGVtZW50IGZyb20gXCIuL2lzVGFibGVFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5cbmZ1bmN0aW9uIGdldFRydWVPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy84MzdcbiAgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0UGFyZW50O1xufSAvLyBgLm9mZnNldFBhcmVudGAgcmVwb3J0cyBgbnVsbGAgZm9yIGZpeGVkIGVsZW1lbnRzLCB3aGlsZSBhYnNvbHV0ZSBlbGVtZW50c1xuLy8gcmV0dXJuIHRoZSBjb250YWluaW5nIGJsb2NrXG5cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmluZ0Jsb2NrKGVsZW1lbnQpIHtcbiAgdmFyIGlzRmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuICB2YXIgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpICE9PSAtMTtcblxuICBpZiAoaXNJRSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgLy8gSW4gSUUgOSwgMTAgYW5kIDExIGZpeGVkIGVsZW1lbnRzIGNvbnRhaW5pbmcgYmxvY2sgaXMgYWx3YXlzIGVzdGFibGlzaGVkIGJ5IHRoZSB2aWV3cG9ydFxuICAgIHZhciBlbGVtZW50Q3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgIGlmIChlbGVtZW50Q3NzLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICB2YXIgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGVsZW1lbnQpO1xuXG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiBbJ2h0bWwnLCAnYm9keSddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoY3VycmVudE5vZGUpKSA8IDApIHtcbiAgICB2YXIgY3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShjdXJyZW50Tm9kZSk7IC8vIFRoaXMgaXMgbm9uLWV4aGF1c3RpdmUgYnV0IGNvdmVycyB0aGUgbW9zdCBjb21tb24gQ1NTIHByb3BlcnRpZXMgdGhhdFxuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgYmxvY2suXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL0NvbnRhaW5pbmdfYmxvY2sjaWRlbnRpZnlpbmdfdGhlX2NvbnRhaW5pbmdfYmxvY2tcblxuICAgIGlmIChjc3MudHJhbnNmb3JtICE9PSAnbm9uZScgfHwgY3NzLnBlcnNwZWN0aXZlICE9PSAnbm9uZScgfHwgY3NzLmNvbnRhaW4gPT09ICdwYWludCcgfHwgWyd0cmFuc2Zvcm0nLCAncGVyc3BlY3RpdmUnXS5pbmRleE9mKGNzcy53aWxsQ2hhbmdlKSAhPT0gLTEgfHwgaXNGaXJlZm94ICYmIGNzcy53aWxsQ2hhbmdlID09PSAnZmlsdGVyJyB8fCBpc0ZpcmVmb3ggJiYgY3NzLmZpbHRlciAmJiBjc3MuZmlsdGVyICE9PSAnbm9uZScpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufSAvLyBHZXRzIHRoZSBjbG9zZXN0IGFuY2VzdG9yIHBvc2l0aW9uZWQgZWxlbWVudC4gSGFuZGxlcyBzb21lIGVkZ2UgY2FzZXMsXG4vLyBzdWNoIGFzIHRhYmxlIGFuY2VzdG9ycyBhbmQgY3Jvc3MgYnJvd3NlciBidWdzLlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpO1xuXG4gIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgaXNUYWJsZUVsZW1lbnQob2Zmc2V0UGFyZW50KSAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKG9mZnNldFBhcmVudCAmJiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSA9PT0gJ2h0bWwnIHx8IGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdib2R5JyAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSkge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB8fCB3aW5kb3c7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpID49IDAgPyAneCcgOiAneSc7XG59IiwiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhpbihtaW4sIHZhbHVlLCBtYXgpIHtcbiAgcmV0dXJuIG1hdGhNYXgobWluLCBtYXRoTWluKHZhbHVlLCBtYXgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW5NYXhDbGFtcChtaW4sIHZhbHVlLCBtYXgpIHtcbiAgdmFyIHYgPSB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KTtcbiAgcmV0dXJuIHYgPiBtYXggPyBtYXggOiB2O1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyZXNoU2lkZU9iamVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDBcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmRUb0hhc2hNYXAodmFsdWUsIGtleXMpIHtcbiAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChoYXNoTWFwLCBrZXkpIHtcbiAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gaGFzaE1hcDtcbiAgfSwge30pO1xufSIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi4vZG9tLXV0aWxzL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHdpdGhpbiB9IGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBtZXJnZVBhZGRpbmdPYmplY3QgZnJvbSBcIi4uL3V0aWxzL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi4vdXRpbHMvZXhwYW5kVG9IYXNoTWFwLmpzXCI7XG5pbXBvcnQgeyBsZWZ0LCByaWdodCwgYmFzZVBsYWNlbWVudHMsIHRvcCwgYm90dG9tIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHRvUGFkZGluZ09iamVjdCA9IGZ1bmN0aW9uIHRvUGFkZGluZ09iamVjdChwYWRkaW5nLCBzdGF0ZSkge1xuICBwYWRkaW5nID0gdHlwZW9mIHBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBwYWRkaW5nKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogcGFkZGluZztcbiAgcmV0dXJuIG1lcmdlUGFkZGluZ09iamVjdCh0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBwYWRkaW5nIDogZXhwYW5kVG9IYXNoTWFwKHBhZGRpbmcsIGJhc2VQbGFjZW1lbnRzKSk7XG59O1xuXG5mdW5jdGlvbiBhcnJvdyhfcmVmKSB7XG4gIHZhciBfc3RhdGUkbW9kaWZpZXJzRGF0YSQ7XG5cbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3c7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIGF4aXMgPSBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCk7XG4gIHZhciBpc1ZlcnRpY2FsID0gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDA7XG4gIHZhciBsZW4gPSBpc1ZlcnRpY2FsID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gIGlmICghYXJyb3dFbGVtZW50IHx8ICFwb3BwZXJPZmZzZXRzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBhZGRpbmdPYmplY3QgPSB0b1BhZGRpbmdPYmplY3Qob3B0aW9ucy5wYWRkaW5nLCBzdGF0ZSk7XG4gIHZhciBhcnJvd1JlY3QgPSBnZXRMYXlvdXRSZWN0KGFycm93RWxlbWVudCk7XG4gIHZhciBtaW5Qcm9wID0gYXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgdmFyIG1heFByb3AgPSBheGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgdmFyIGVuZERpZmYgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbbGVuXSArIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXSAtIHBvcHBlck9mZnNldHNbYXhpc10gLSBzdGF0ZS5yZWN0cy5wb3BwZXJbbGVuXTtcbiAgdmFyIHN0YXJ0RGlmZiA9IHBvcHBlck9mZnNldHNbYXhpc10gLSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbYXhpc107XG4gIHZhciBhcnJvd09mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChhcnJvd0VsZW1lbnQpO1xuICB2YXIgY2xpZW50U2l6ZSA9IGFycm93T2Zmc2V0UGFyZW50ID8gYXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50SGVpZ2h0IHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRXaWR0aCB8fCAwIDogMDtcbiAgdmFyIGNlbnRlclRvUmVmZXJlbmNlID0gZW5kRGlmZiAvIDIgLSBzdGFydERpZmYgLyAyOyAvLyBNYWtlIHN1cmUgdGhlIGFycm93IGRvZXNuJ3Qgb3ZlcmZsb3cgdGhlIHBvcHBlciBpZiB0aGUgY2VudGVyIHBvaW50IGlzXG4gIC8vIG91dHNpZGUgb2YgdGhlIHBvcHBlciBib3VuZHNcblxuICB2YXIgbWluID0gcGFkZGluZ09iamVjdFttaW5Qcm9wXTtcbiAgdmFyIG1heCA9IGNsaWVudFNpemUgLSBhcnJvd1JlY3RbbGVuXSAtIHBhZGRpbmdPYmplY3RbbWF4UHJvcF07XG4gIHZhciBjZW50ZXIgPSBjbGllbnRTaXplIC8gMiAtIGFycm93UmVjdFtsZW5dIC8gMiArIGNlbnRlclRvUmVmZXJlbmNlO1xuICB2YXIgb2Zmc2V0ID0gd2l0aGluKG1pbiwgY2VudGVyLCBtYXgpOyAvLyBQcmV2ZW50cyBicmVha2luZyBzeW50YXggaGlnaGxpZ2h0aW5nLi4uXG5cbiAgdmFyIGF4aXNQcm9wID0gYXhpcztcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IChfc3RhdGUkbW9kaWZpZXJzRGF0YSQgPSB7fSwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkW2F4aXNQcm9wXSA9IG9mZnNldCwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkLmNlbnRlck9mZnNldCA9IG9mZnNldCAtIGNlbnRlciwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkKTtcbn1cblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRlbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50LFxuICAgICAgYXJyb3dFbGVtZW50ID0gX29wdGlvbnMkZWxlbWVudCA9PT0gdm9pZCAwID8gJ1tkYXRhLXBvcHBlci1hcnJvd10nIDogX29wdGlvbnMkZWxlbWVudDtcblxuICBpZiAoYXJyb3dFbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gQ1NTIHNlbGVjdG9yXG5cblxuICBpZiAodHlwZW9mIGFycm93RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5wb3BwZXIucXVlcnlTZWxlY3RvcihhcnJvd0VsZW1lbnQpO1xuXG4gICAgaWYgKCFhcnJvd0VsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgaWYgKCFpc0hUTUxFbGVtZW50KGFycm93RWxlbWVudCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoWydQb3BwZXI6IFwiYXJyb3dcIiBlbGVtZW50IG11c3QgYmUgYW4gSFRNTEVsZW1lbnQgKG5vdCBhbiBTVkdFbGVtZW50KS4nLCAnVG8gdXNlIGFuIFNWRyBhcnJvdywgd3JhcCBpdCBpbiBhbiBIVE1MRWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBhcycsICd0aGUgYXJyb3cuJ10uam9pbignICcpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbnRhaW5zKHN0YXRlLmVsZW1lbnRzLnBvcHBlciwgYXJyb3dFbGVtZW50KSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoWydQb3BwZXI6IFwiYXJyb3dcIiBtb2RpZmllclxcJ3MgYGVsZW1lbnRgIG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgcG9wcGVyJywgJ2VsZW1lbnQuJ10uam9pbignICcpKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5lbGVtZW50cy5hcnJvdyA9IGFycm93RWxlbWVudDtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2Fycm93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGFycm93LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xufSIsImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgZW5kIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdW5zZXRTaWRlcyA9IHtcbiAgdG9wOiAnYXV0bycsXG4gIHJpZ2h0OiAnYXV0bycsXG4gIGJvdHRvbTogJ2F1dG8nLFxuICBsZWZ0OiAnYXV0bydcbn07IC8vIFJvdW5kIHRoZSBvZmZzZXRzIHRvIHRoZSBuZWFyZXN0IHN1aXRhYmxlIHN1YnBpeGVsIGJhc2VkIG9uIHRoZSBEUFIuXG4vLyBab29taW5nIGNhbiBjaGFuZ2UgdGhlIERQUiwgYnV0IGl0IHNlZW1zIHRvIHJlcG9ydCBhIHZhbHVlIHRoYXQgd2lsbFxuLy8gY2xlYW5seSBkaXZpZGUgdGhlIHZhbHVlcyBpbnRvIHRoZSBhcHByb3ByaWF0ZSBzdWJwaXhlbHMuXG5cbmZ1bmN0aW9uIHJvdW5kT2Zmc2V0c0J5RFBSKF9yZWYpIHtcbiAgdmFyIHggPSBfcmVmLngsXG4gICAgICB5ID0gX3JlZi55O1xuICB2YXIgd2luID0gd2luZG93O1xuICB2YXIgZHByID0gd2luLmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgcmV0dXJuIHtcbiAgICB4OiByb3VuZCh4ICogZHByKSAvIGRwciB8fCAwLFxuICAgIHk6IHJvdW5kKHkgKiBkcHIpIC8gZHByIHx8IDBcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvU3R5bGVzKF9yZWYyKSB7XG4gIHZhciBfT2JqZWN0JGFzc2lnbjI7XG5cbiAgdmFyIHBvcHBlciA9IF9yZWYyLnBvcHBlcixcbiAgICAgIHBvcHBlclJlY3QgPSBfcmVmMi5wb3BwZXJSZWN0LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZjIucGxhY2VtZW50LFxuICAgICAgdmFyaWF0aW9uID0gX3JlZjIudmFyaWF0aW9uLFxuICAgICAgb2Zmc2V0cyA9IF9yZWYyLm9mZnNldHMsXG4gICAgICBwb3NpdGlvbiA9IF9yZWYyLnBvc2l0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX3JlZjIuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgYWRhcHRpdmUgPSBfcmVmMi5hZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0cyA9IF9yZWYyLnJvdW5kT2Zmc2V0cyxcbiAgICAgIGlzRml4ZWQgPSBfcmVmMi5pc0ZpeGVkO1xuICB2YXIgX29mZnNldHMkeCA9IG9mZnNldHMueCxcbiAgICAgIHggPSBfb2Zmc2V0cyR4ID09PSB2b2lkIDAgPyAwIDogX29mZnNldHMkeCxcbiAgICAgIF9vZmZzZXRzJHkgPSBvZmZzZXRzLnksXG4gICAgICB5ID0gX29mZnNldHMkeSA9PT0gdm9pZCAwID8gMCA6IF9vZmZzZXRzJHk7XG5cbiAgdmFyIF9yZWYzID0gdHlwZW9mIHJvdW5kT2Zmc2V0cyA9PT0gJ2Z1bmN0aW9uJyA/IHJvdW5kT2Zmc2V0cyh7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH0pIDoge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xuXG4gIHggPSBfcmVmMy54O1xuICB5ID0gX3JlZjMueTtcbiAgdmFyIGhhc1ggPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd4Jyk7XG4gIHZhciBoYXNZID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneScpO1xuICB2YXIgc2lkZVggPSBsZWZ0O1xuICB2YXIgc2lkZVkgPSB0b3A7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgaWYgKGFkYXB0aXZlKSB7XG4gICAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChwb3BwZXIpO1xuICAgIHZhciBoZWlnaHRQcm9wID0gJ2NsaWVudEhlaWdodCc7XG4gICAgdmFyIHdpZHRoUHJvcCA9ICdjbGllbnRXaWR0aCc7XG5cbiAgICBpZiAob2Zmc2V0UGFyZW50ID09PSBnZXRXaW5kb3cocG9wcGVyKSkge1xuICAgICAgb2Zmc2V0UGFyZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KHBvcHBlcik7XG5cbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gIT09ICdzdGF0aWMnICYmIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgIGhlaWdodFByb3AgPSAnc2Nyb2xsSGVpZ2h0JztcbiAgICAgICAgd2lkdGhQcm9wID0gJ3Njcm9sbFdpZHRoJztcbiAgICAgIH1cbiAgICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhc3RdOiBmb3JjZSB0eXBlIHJlZmluZW1lbnQsIHdlIGNvbXBhcmUgb2Zmc2V0UGFyZW50IHdpdGggd2luZG93IGFib3ZlLCBidXQgRmxvdyBkb2Vzbid0IGRldGVjdCBpdFxuXG5cbiAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQ7XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSB0b3AgfHwgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCBwbGFjZW1lbnQgPT09IHJpZ2h0KSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVkgPSBib3R0b207XG4gICAgICB2YXIgb2Zmc2V0WSA9IGlzRml4ZWQgJiYgd2luLnZpc3VhbFZpZXdwb3J0ID8gd2luLnZpc3VhbFZpZXdwb3J0LmhlaWdodCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgICAgb2Zmc2V0UGFyZW50W2hlaWdodFByb3BdO1xuICAgICAgeSAtPSBvZmZzZXRZIC0gcG9wcGVyUmVjdC5oZWlnaHQ7XG4gICAgICB5ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSBsZWZ0IHx8IChwbGFjZW1lbnQgPT09IHRvcCB8fCBwbGFjZW1lbnQgPT09IGJvdHRvbSkgJiYgdmFyaWF0aW9uID09PSBlbmQpIHtcbiAgICAgIHNpZGVYID0gcmlnaHQ7XG4gICAgICB2YXIgb2Zmc2V0WCA9IGlzRml4ZWQgJiYgd2luLnZpc3VhbFZpZXdwb3J0ID8gd2luLnZpc3VhbFZpZXdwb3J0LndpZHRoIDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgICBvZmZzZXRQYXJlbnRbd2lkdGhQcm9wXTtcbiAgICAgIHggLT0gb2Zmc2V0WCAtIHBvcHBlclJlY3Qud2lkdGg7XG4gICAgICB4ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgcG9zaXRpb246IHBvc2l0aW9uXG4gIH0sIGFkYXB0aXZlICYmIHVuc2V0U2lkZXMpO1xuXG4gIHZhciBfcmVmNCA9IHJvdW5kT2Zmc2V0cyA9PT0gdHJ1ZSA/IHJvdW5kT2Zmc2V0c0J5RFBSKHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWY0Lng7XG4gIHkgPSBfcmVmNC55O1xuXG4gIGlmIChncHVBY2NlbGVyYXRpb24pIHtcbiAgICB2YXIgX09iamVjdCRhc3NpZ247XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24gPSB7fSwgX09iamVjdCRhc3NpZ25bc2lkZVldID0gaGFzWSA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbltzaWRlWF0gPSBoYXNYID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduLnRyYW5zZm9ybSA9ICh3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSA8PSAxID8gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweCwgMClcIiwgX09iamVjdCRhc3NpZ24pKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbjIgPSB7fSwgX09iamVjdCRhc3NpZ24yW3NpZGVZXSA9IGhhc1kgPyB5ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMltzaWRlWF0gPSBoYXNYID8geCArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjIudHJhbnNmb3JtID0gJycsIF9PYmplY3QkYXNzaWduMikpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3R5bGVzKF9yZWY1KSB7XG4gIHZhciBzdGF0ZSA9IF9yZWY1LnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWY1Lm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPSBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGdwdUFjY2VsZXJhdCxcbiAgICAgIF9vcHRpb25zJGFkYXB0aXZlID0gb3B0aW9ucy5hZGFwdGl2ZSxcbiAgICAgIGFkYXB0aXZlID0gX29wdGlvbnMkYWRhcHRpdmUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhZGFwdGl2ZSxcbiAgICAgIF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9IG9wdGlvbnMucm91bmRPZmZzZXRzLFxuICAgICAgcm91bmRPZmZzZXRzID0gX29wdGlvbnMkcm91bmRPZmZzZXRzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcm91bmRPZmZzZXRzO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICB2YXIgdHJhbnNpdGlvblByb3BlcnR5ID0gZ2V0Q29tcHV0ZWRTdHlsZShzdGF0ZS5lbGVtZW50cy5wb3BwZXIpLnRyYW5zaXRpb25Qcm9wZXJ0eSB8fCAnJztcblxuICAgIGlmIChhZGFwdGl2ZSAmJiBbJ3RyYW5zZm9ybScsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5zb21lKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25Qcm9wZXJ0eS5pbmRleE9mKHByb3BlcnR5KSA+PSAwO1xuICAgIH0pKSB7XG4gICAgICBjb25zb2xlLndhcm4oWydQb3BwZXI6IERldGVjdGVkIENTUyB0cmFuc2l0aW9ucyBvbiBhdCBsZWFzdCBvbmUgb2YgdGhlIGZvbGxvd2luZycsICdDU1MgcHJvcGVydGllczogXCJ0cmFuc2Zvcm1cIiwgXCJ0b3BcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIi4nLCAnXFxuXFxuJywgJ0Rpc2FibGUgdGhlIFwiY29tcHV0ZVN0eWxlc1wiIG1vZGlmaWVyXFwncyBgYWRhcHRpdmVgIG9wdGlvbiB0byBhbGxvdycsICdmb3Igc21vb3RoIHRyYW5zaXRpb25zLCBvciByZW1vdmUgdGhlc2UgcHJvcGVydGllcyBmcm9tIHRoZSBDU1MnLCAndHJhbnNpdGlvbiBkZWNsYXJhdGlvbiBvbiB0aGUgcG9wcGVyIGVsZW1lbnQgaWYgb25seSB0cmFuc2l0aW9uaW5nJywgJ29wYWNpdHkgb3IgYmFja2dyb3VuZC1jb2xvciBmb3IgZXhhbXBsZS4nLCAnXFxuXFxuJywgJ1dlIHJlY29tbWVuZCB1c2luZyB0aGUgcG9wcGVyIGVsZW1lbnQgYXMgYSB3cmFwcGVyIGFyb3VuZCBhbiBpbm5lcicsICdlbGVtZW50IHRoYXQgY2FuIGhhdmUgYW55IENTUyBwcm9wZXJ0eSB0cmFuc2l0aW9uZWQgZm9yIGFuaW1hdGlvbnMuJ10uam9pbignICcpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0ge1xuICAgIHBsYWNlbWVudDogZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHZhcmlhdGlvbjogZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCksXG4gICAgcG9wcGVyOiBzdGF0ZS5lbGVtZW50cy5wb3BwZXIsXG4gICAgcG9wcGVyUmVjdDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIGdwdUFjY2VsZXJhdGlvbjogZ3B1QWNjZWxlcmF0aW9uLFxuICAgIGlzRml4ZWQ6IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCdcbiAgfTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLnBvcHBlciwgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMsXG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGFkYXB0aXZlOiBhZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93ICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMuYXJyb3cgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMuYXJyb3csIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYWRhcHRpdmU6IGZhbHNlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1wbGFjZW1lbnQnOiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdjb21wdXRlU3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdiZWZvcmVXcml0ZScsXG4gIGZuOiBjb21wdXRlU3R5bGVzLFxuICBkYXRhOiB7fVxufTsiLCJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHBhc3NpdmUgPSB7XG4gIHBhc3NpdmU6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBpbnN0YW5jZSA9IF9yZWYuaW5zdGFuY2UsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkc2Nyb2xsID0gb3B0aW9ucy5zY3JvbGwsXG4gICAgICBzY3JvbGwgPSBfb3B0aW9ucyRzY3JvbGwgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzY3JvbGwsXG4gICAgICBfb3B0aW9ucyRyZXNpemUgPSBvcHRpb25zLnJlc2l6ZSxcbiAgICAgIHJlc2l6ZSA9IF9vcHRpb25zJHJlc2l6ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHJlc2l6ZTtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIpO1xuICB2YXIgc2Nyb2xsUGFyZW50cyA9IFtdLmNvbmNhdChzdGF0ZS5zY3JvbGxQYXJlbnRzLnJlZmVyZW5jZSwgc3RhdGUuc2Nyb2xsUGFyZW50cy5wb3BwZXIpO1xuXG4gIGlmIChzY3JvbGwpIHtcbiAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgc2Nyb2xsUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVzaXplKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICAgIHNjcm9sbFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlc2l6ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfVxuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZXZlbnRMaXN0ZW5lcnMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGZ1bmN0aW9uIGZuKCkge30sXG4gIGVmZmVjdDogZWZmZWN0LFxuICBkYXRhOiB7fVxufTsiLCJ2YXIgaGFzaCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCJ2YXIgaGFzaCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbChub2RlKSB7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3cobm9kZSk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luLnBhZ2VYT2Zmc2V0O1xuICB2YXIgc2Nyb2xsVG9wID0gd2luLnBhZ2VZT2Zmc2V0O1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IHNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpIHtcbiAgLy8gSWYgPGh0bWw+IGhhcyBhIENTUyB3aWR0aCBncmVhdGVyIHRoYW4gdGhlIHZpZXdwb3J0LCB0aGVuIHRoaXMgd2lsbCBiZVxuICAvLyBpbmNvcnJlY3QgZm9yIFJUTC5cbiAgLy8gUG9wcGVyIDEgaXMgYnJva2VuIGluIHRoaXMgY2FzZSBhbmQgbmV2ZXIgaGFkIGEgYnVnIHJlcG9ydCBzbyBsZXQncyBhc3N1bWVcbiAgLy8gaXQncyBub3QgYW4gaXNzdWUuIEkgZG9uJ3QgdGhpbmsgYW55b25lIGV2ZXIgc3BlY2lmaWVzIHdpZHRoIG9uIDxodG1sPlxuICAvLyBhbnl3YXkuXG4gIC8vIEJyb3dzZXJzIHdoZXJlIHRoZSBsZWZ0IHNjcm9sbGJhciBkb2Vzbid0IGNhdXNlIGFuIGlzc3VlIHJlcG9ydCBgMGAgZm9yXG4gIC8vIHRoaXMgKGUuZy4gRWRnZSAyMDE5LCBJRTExLCBTYWZhcmkpXG4gIHJldHVybiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKS5sZWZ0ICsgZ2V0V2luZG93U2Nyb2xsKGVsZW1lbnQpLnNjcm9sbExlZnQ7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICB2YXIgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIHZhciB4ID0gMDtcbiAgdmFyIHkgPSAwOyAvLyBOQjogVGhpcyBpc24ndCBzdXBwb3J0ZWQgb24gaU9TIDw9IDEyLiBJZiB0aGUga2V5Ym9hcmQgaXMgb3BlbiwgdGhlIHBvcHBlclxuICAvLyBjYW4gYmUgb2JzY3VyZWQgdW5kZXJuZWF0aCBpdC5cbiAgLy8gQWxzbywgYGh0bWwuY2xpZW50SGVpZ2h0YCBhZGRzIHRoZSBib3R0b20gYmFyIGhlaWdodCBpbiBTYWZhcmkgaU9TLCBldmVuXG4gIC8vIGlmIGl0IGlzbid0IG9wZW4sIHNvIGlmIHRoaXMgaXNuJ3QgYXZhaWxhYmxlLCB0aGUgcG9wcGVyIHdpbGwgYmUgZGV0ZWN0ZWRcbiAgLy8gdG8gb3ZlcmZsb3cgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuIHRvbyBlYXJseS5cblxuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDsgLy8gVXNlcyBMYXlvdXQgVmlld3BvcnQgKGxpa2UgQ2hyb21lOyBTYWZhcmkgZG9lcyBub3QgY3VycmVudGx5KVxuICAgIC8vIEluIENocm9tZSwgaXQgcmV0dXJucyBhIHZhbHVlIHZlcnkgY2xvc2UgdG8gMCAoKy8tKSBidXQgY29udGFpbnMgcm91bmRpbmdcbiAgICAvLyBlcnJvcnMgZHVlIHRvIGZsb2F0aW5nIHBvaW50IG51bWJlcnMsIHNvIHdlIG5lZWQgdG8gY2hlY2sgcHJlY2lzaW9uLlxuICAgIC8vIFNhZmFyaSByZXR1cm5zIGEgbnVtYmVyIDw9IDAsIHVzdWFsbHkgPCAtMSB3aGVuIHBpbmNoLXpvb21lZFxuICAgIC8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZhaWxzIGluIG1vYmlsZSBlbXVsYXRpb24gbW9kZSBpbiBDaHJvbWUuXG4gICAgLy8gTWF0aC5hYnMod2luLmlubmVyV2lkdGggLyB2aXN1YWxWaWV3cG9ydC5zY2FsZSAtIHZpc3VhbFZpZXdwb3J0LndpZHRoKSA8XG4gICAgLy8gMC4wMDFcbiAgICAvLyBGYWxsYmFjayBoZXJlOiBcIk5vdCBTYWZhcmlcIiB1c2VyQWdlbnRcblxuICAgIGlmICghL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgeCA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQ7XG4gICAgICB5ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHggKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpLFxuICAgIHk6IHlcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCB7IG1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIEdldHMgdGhlIGVudGlyZSBzaXplIG9mIHRoZSBzY3JvbGxhYmxlIGRvY3VtZW50IGFyZWEsIGV2ZW4gZXh0ZW5kaW5nIG91dHNpZGVcbi8vIG9mIHRoZSBgPGh0bWw+YCBhbmQgYDxib2R5PmAgcmVjdCBib3VuZHMgaWYgaG9yaXpvbnRhbGx5IHNjcm9sbGFibGVcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHdpblNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbChlbGVtZW50KTtcbiAgdmFyIGJvZHkgPSAoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHk7XG4gIHZhciB3aWR0aCA9IG1heChodG1sLnNjcm9sbFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5zY3JvbGxXaWR0aCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCk7XG4gIHZhciBoZWlnaHQgPSBtYXgoaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBib2R5ID8gYm9keS5zY3JvbGxIZWlnaHQgOiAwLCBib2R5ID8gYm9keS5jbGllbnRIZWlnaHQgOiAwKTtcbiAgdmFyIHggPSAtd2luU2Nyb2xsLnNjcm9sbExlZnQgKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpO1xuICB2YXIgeSA9IC13aW5TY3JvbGwuc2Nyb2xsVG9wO1xuXG4gIGlmIChnZXRDb21wdXRlZFN0eWxlKGJvZHkgfHwgaHRtbCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCkgLSB3aWR0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsImltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgLy8gRmlyZWZveCB3YW50cyB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WTtcblxuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVuLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKTtcbn0iLCJpbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFNjcm9sbFBhcmVudChub2RlKSB7XG4gIGlmIChbJ2h0bWwnLCAnYm9keScsICcjZG9jdW1lbnQnXS5pbmRleE9mKGdldE5vZGVOYW1lKG5vZGUpKSA+PSAwKSB7XG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGlmIChpc0hUTUxFbGVtZW50KG5vZGUpICYmIGlzU2Nyb2xsUGFyZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUobm9kZSkpO1xufSIsImltcG9ydCBnZXRTY3JvbGxQYXJlbnQgZnJvbSBcIi4vZ2V0U2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG4vKlxuZ2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIHRoZSBsaXN0IG9mIGFsbCBzY3JvbGwgcGFyZW50cywgdXAgdGhlIGxpc3Qgb2YgYW5jZXNvcnNcbnVudGlsIHdlIGdldCB0byB0aGUgdG9wIHdpbmRvdyBvYmplY3QuIFRoaXMgbGlzdCBpcyB3aGF0IHdlIGF0dGFjaCBzY3JvbGwgbGlzdGVuZXJzXG50bywgYmVjYXVzZSBpZiBhbnkgb2YgdGhlc2UgcGFyZW50IGVsZW1lbnRzIHNjcm9sbCwgd2UnbGwgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlXG5yZWZlcmVuY2UgZWxlbWVudCdzIHBvc2l0aW9uLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGlzdFNjcm9sbFBhcmVudHMoZWxlbWVudCwgbGlzdCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cblxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpO1xuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50ID09PSAoKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5KTtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhzY3JvbGxQYXJlbnQpO1xuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gW3dpbl0uY29uY2F0KHdpbi52aXN1YWxWaWV3cG9ydCB8fCBbXSwgaXNTY3JvbGxQYXJlbnQoc2Nyb2xsUGFyZW50KSA/IHNjcm9sbFBhcmVudCA6IFtdKSA6IHNjcm9sbFBhcmVudDtcbiAgdmFyIHVwZGF0ZWRMaXN0ID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHVwZGF0ZWRMaXN0IDogLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IGlzQm9keSB0ZWxscyB1cyB0YXJnZXQgd2lsbCBiZSBhbiBIVE1MRWxlbWVudCBoZXJlXG4gIHVwZGF0ZWRMaXN0LmNvbmNhdChsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKHRhcmdldCkpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWN0VG9DbGllbnRSZWN0KHJlY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJlY3QsIHtcbiAgICBsZWZ0OiByZWN0LngsXG4gICAgdG9wOiByZWN0LnksXG4gICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICB9KTtcbn0iLCJpbXBvcnQgeyB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZpZXdwb3J0UmVjdCBmcm9tIFwiLi9nZXRWaWV3cG9ydFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudFJlY3QgZnJvbSBcIi4vZ2V0RG9jdW1lbnRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi4vdXRpbHMvcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgbWF4LCBtaW4gfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpO1xuICByZWN0LnRvcCA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRUb3A7XG4gIHJlY3QubGVmdCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50TGVmdDtcbiAgcmVjdC5ib3R0b20gPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnJpZ2h0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3QuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QueCA9IHJlY3QubGVmdDtcbiAgcmVjdC55ID0gcmVjdC50b3A7XG4gIHJldHVybiByZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCkge1xuICByZXR1cm4gY2xpcHBpbmdQYXJlbnQgPT09IHZpZXdwb3J0ID8gcmVjdFRvQ2xpZW50UmVjdChnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkpIDogaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSA/IGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGNsaXBwaW5nUGFyZW50KSA6IHJlY3RUb0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkpO1xufSAvLyBBIFwiY2xpcHBpbmcgcGFyZW50XCIgaXMgYW4gb3ZlcmZsb3dhYmxlIGNvbnRhaW5lciB3aXRoIHRoZSBjaGFyYWN0ZXJpc3RpYyBvZlxuLy8gY2xpcHBpbmcgKG9yIGhpZGluZykgb3ZlcmZsb3dpbmcgZWxlbWVudHMgd2l0aCBhIHBvc2l0aW9uIGRpZmZlcmVudCBmcm9tXG4vLyBgaW5pdGlhbGBcblxuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ1BhcmVudHMoZWxlbWVudCkge1xuICB2YXIgY2xpcHBpbmdQYXJlbnRzID0gbGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XG4gIHZhciBjYW5Fc2NhcGVDbGlwcGluZyA9IFsnYWJzb2x1dGUnLCAnZml4ZWQnXS5pbmRleE9mKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24pID49IDA7XG4gIHZhciBjbGlwcGVyRWxlbWVudCA9IGNhbkVzY2FwZUNsaXBwaW5nICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkgPyBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkgOiBlbGVtZW50O1xuXG4gIGlmICghaXNFbGVtZW50KGNsaXBwZXJFbGVtZW50KSkge1xuICAgIHJldHVybiBbXTtcbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9pc3N1ZXMvMTQxNFxuXG5cbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50cy5maWx0ZXIoZnVuY3Rpb24gKGNsaXBwaW5nUGFyZW50KSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudChjbGlwcGluZ1BhcmVudCkgJiYgY29udGFpbnMoY2xpcHBpbmdQYXJlbnQsIGNsaXBwZXJFbGVtZW50KSAmJiBnZXROb2RlTmFtZShjbGlwcGluZ1BhcmVudCkgIT09ICdib2R5JztcbiAgfSk7XG59IC8vIEdldHMgdGhlIG1heGltdW0gYXJlYSB0aGF0IHRoZSBlbGVtZW50IGlzIHZpc2libGUgaW4gZHVlIHRvIGFueSBudW1iZXIgb2Zcbi8vIGNsaXBwaW5nIHBhcmVudHNcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDbGlwcGluZ1JlY3QoZWxlbWVudCwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSkge1xuICB2YXIgbWFpbkNsaXBwaW5nUGFyZW50cyA9IGJvdW5kYXJ5ID09PSAnY2xpcHBpbmdQYXJlbnRzJyA/IGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSA6IFtdLmNvbmNhdChib3VuZGFyeSk7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBbXS5jb25jYXQobWFpbkNsaXBwaW5nUGFyZW50cywgW3Jvb3RCb3VuZGFyeV0pO1xuICB2YXIgZmlyc3RDbGlwcGluZ1BhcmVudCA9IGNsaXBwaW5nUGFyZW50c1swXTtcbiAgdmFyIGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjY1JlY3QsIGNsaXBwaW5nUGFyZW50KSB7XG4gICAgdmFyIHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCk7XG4gICAgYWNjUmVjdC50b3AgPSBtYXgocmVjdC50b3AsIGFjY1JlY3QudG9wKTtcbiAgICBhY2NSZWN0LnJpZ2h0ID0gbWluKHJlY3QucmlnaHQsIGFjY1JlY3QucmlnaHQpO1xuICAgIGFjY1JlY3QuYm90dG9tID0gbWluKHJlY3QuYm90dG9tLCBhY2NSZWN0LmJvdHRvbSk7XG4gICAgYWNjUmVjdC5sZWZ0ID0gbWF4KHJlY3QubGVmdCwgYWNjUmVjdC5sZWZ0KTtcbiAgICByZXR1cm4gYWNjUmVjdDtcbiAgfSwgZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgZmlyc3RDbGlwcGluZ1BhcmVudCkpO1xuICBjbGlwcGluZ1JlY3Qud2lkdGggPSBjbGlwcGluZ1JlY3QucmlnaHQgLSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LmhlaWdodCA9IGNsaXBwaW5nUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QudG9wO1xuICBjbGlwcGluZ1JlY3QueCA9IGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QueSA9IGNsaXBwaW5nUmVjdC50b3A7XG4gIHJldHVybiBjbGlwcGluZ1JlY3Q7XG59IiwiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4vZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQsIHN0YXJ0LCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXB1dGVPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHJlZmVyZW5jZSA9IF9yZWYucmVmZXJlbmNlLFxuICAgICAgZWxlbWVudCA9IF9yZWYuZWxlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudCA/IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQgPyBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciBjb21tb25YID0gcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGggLyAyIC0gZWxlbWVudC53aWR0aCAvIDI7XG4gIHZhciBjb21tb25ZID0gcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0IC8gMiAtIGVsZW1lbnQuaGVpZ2h0IC8gMjtcbiAgdmFyIG9mZnNldHM7XG5cbiAgc3dpdGNoIChiYXNlUGxhY2VtZW50KSB7XG4gICAgY2FzZSB0b3A6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSAtIGVsZW1lbnQuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGJvdHRvbTpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSByaWdodDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54ICsgcmVmZXJlbmNlLndpZHRoLFxuICAgICAgICB5OiBjb21tb25ZXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGxlZnQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCAtIGVsZW1lbnQud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnlcbiAgICAgIH07XG4gIH1cblxuICB2YXIgbWFpbkF4aXMgPSBiYXNlUGxhY2VtZW50ID8gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpIDogbnVsbDtcblxuICBpZiAobWFpbkF4aXMgIT0gbnVsbCkge1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgc3dpdGNoICh2YXJpYXRpb24pIHtcbiAgICAgIGNhc2Ugc3RhcnQ6XG4gICAgICAgIG9mZnNldHNbbWFpbkF4aXNdID0gb2Zmc2V0c1ttYWluQXhpc10gLSAocmVmZXJlbmNlW2xlbl0gLyAyIC0gZWxlbWVudFtsZW5dIC8gMik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGVuZDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSArIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9mZnNldHM7XG59IiwiaW1wb3J0IGdldENsaXBwaW5nUmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBjbGlwcGluZ1BhcmVudHMsIHJlZmVyZW5jZSwgcG9wcGVyLCBib3R0b20sIHRvcCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi9leHBhbmRUb0hhc2hNYXAuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zJHBsYWNlbWVudCA9PT0gdm9pZCAwID8gc3RhdGUucGxhY2VtZW50IDogX29wdGlvbnMkcGxhY2VtZW50LFxuICAgICAgX29wdGlvbnMkYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMkYm91bmRhcnkgPT09IHZvaWQgMCA/IGNsaXBwaW5nUGFyZW50cyA6IF9vcHRpb25zJGJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyB2aWV3cG9ydCA6IF9vcHRpb25zJHJvb3RCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGVsZW1lbnRDb250ZSA9IF9vcHRpb25zLmVsZW1lbnRDb250ZXh0LFxuICAgICAgZWxlbWVudENvbnRleHQgPSBfb3B0aW9ucyRlbGVtZW50Q29udGUgPT09IHZvaWQgMCA/IHBvcHBlciA6IF9vcHRpb25zJGVsZW1lbnRDb250ZSxcbiAgICAgIF9vcHRpb25zJGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IF9vcHRpb25zJGFsdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMkcGFkZGluZyA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHBhZGRpbmc7XG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbiAgdmFyIGFsdENvbnRleHQgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcmVmZXJlbmNlIDogcG9wcGVyO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1thbHRCb3VuZGFyeSA/IGFsdENvbnRleHQgOiBlbGVtZW50Q29udGV4dF07XG4gIHZhciBjbGlwcGluZ0NsaWVudFJlY3QgPSBnZXRDbGlwcGluZ1JlY3QoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudCA6IGVsZW1lbnQuY29udGV4dEVsZW1lbnQgfHwgZ2V0RG9jdW1lbnRFbGVtZW50KHN0YXRlLmVsZW1lbnRzLnBvcHBlciksIGJvdW5kYXJ5LCByb290Qm91bmRhcnkpO1xuICB2YXIgcmVmZXJlbmNlQ2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChzdGF0ZS5lbGVtZW50cy5yZWZlcmVuY2UpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHJlZmVyZW5jZUNsaWVudFJlY3QsXG4gICAgZWxlbWVudDogcG9wcGVyUmVjdCxcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KTtcbiAgdmFyIHBvcHBlckNsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KE9iamVjdC5hc3NpZ24oe30sIHBvcHBlclJlY3QsIHBvcHBlck9mZnNldHMpKTtcbiAgdmFyIGVsZW1lbnRDbGllbnRSZWN0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHBvcHBlckNsaWVudFJlY3QgOiByZWZlcmVuY2VDbGllbnRSZWN0OyAvLyBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyByZWN0XG4gIC8vIDAgb3IgbmVnYXRpdmUgPSB3aXRoaW4gdGhlIGNsaXBwaW5nIHJlY3RcblxuICB2YXIgb3ZlcmZsb3dPZmZzZXRzID0ge1xuICAgIHRvcDogY2xpcHBpbmdDbGllbnRSZWN0LnRvcCAtIGVsZW1lbnRDbGllbnRSZWN0LnRvcCArIHBhZGRpbmdPYmplY3QudG9wLFxuICAgIGJvdHRvbTogZWxlbWVudENsaWVudFJlY3QuYm90dG9tIC0gY2xpcHBpbmdDbGllbnRSZWN0LmJvdHRvbSArIHBhZGRpbmdPYmplY3QuYm90dG9tLFxuICAgIGxlZnQ6IGNsaXBwaW5nQ2xpZW50UmVjdC5sZWZ0IC0gZWxlbWVudENsaWVudFJlY3QubGVmdCArIHBhZGRpbmdPYmplY3QubGVmdCxcbiAgICByaWdodDogZWxlbWVudENsaWVudFJlY3QucmlnaHQgLSBjbGlwcGluZ0NsaWVudFJlY3QucmlnaHQgKyBwYWRkaW5nT2JqZWN0LnJpZ2h0XG4gIH07XG4gIHZhciBvZmZzZXREYXRhID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQ7IC8vIE9mZnNldHMgY2FuIGJlIGFwcGxpZWQgb25seSB0byB0aGUgcG9wcGVyIGVsZW1lbnRcblxuICBpZiAoZWxlbWVudENvbnRleHQgPT09IHBvcHBlciAmJiBvZmZzZXREYXRhKSB7XG4gICAgdmFyIG9mZnNldCA9IG9mZnNldERhdGFbcGxhY2VtZW50XTtcbiAgICBPYmplY3Qua2V5cyhvdmVyZmxvd09mZnNldHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIG11bHRpcGx5ID0gW3JpZ2h0LCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGF4aXMgPSBbdG9wLCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gJ3knIDogJ3gnO1xuICAgICAgb3ZlcmZsb3dPZmZzZXRzW2tleV0gKz0gb2Zmc2V0W2F4aXNdICogbXVsdGlwbHk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gb3ZlcmZsb3dPZmZzZXRzO1xufSIsImltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4vZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgeyB2YXJpYXRpb25QbGFjZW1lbnRzLCBiYXNlUGxhY2VtZW50cywgcGxhY2VtZW50cyBhcyBhbGxQbGFjZW1lbnRzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4vZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgcGxhY2VtZW50ID0gX29wdGlvbnMucGxhY2VtZW50LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnMgPSBfb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIF9vcHRpb25zJGFsbG93ZWRBdXRvUCA9IF9vcHRpb25zLmFsbG93ZWRBdXRvUGxhY2VtZW50cyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IF9vcHRpb25zJGFsbG93ZWRBdXRvUCA9PT0gdm9pZCAwID8gYWxsUGxhY2VtZW50cyA6IF9vcHRpb25zJGFsbG93ZWRBdXRvUDtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpO1xuICB2YXIgcGxhY2VtZW50cyA9IHZhcmlhdGlvbiA/IGZsaXBWYXJpYXRpb25zID8gdmFyaWF0aW9uUGxhY2VtZW50cyA6IHZhcmlhdGlvblBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgPT09IHZhcmlhdGlvbjtcbiAgfSkgOiBiYXNlUGxhY2VtZW50cztcbiAgdmFyIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhbGxvd2VkQXV0b1BsYWNlbWVudHMuaW5kZXhPZihwbGFjZW1lbnQpID49IDA7XG4gIH0pO1xuXG4gIGlmIChhbGxvd2VkUGxhY2VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHM7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBUaGUgYGFsbG93ZWRBdXRvUGxhY2VtZW50c2Agb3B0aW9uIGRpZCBub3QgYWxsb3cgYW55JywgJ3BsYWNlbWVudHMuIEVuc3VyZSB0aGUgYHBsYWNlbWVudGAgb3B0aW9uIG1hdGNoZXMgdGhlIHZhcmlhdGlvbicsICdvZiB0aGUgYWxsb3dlZCBwbGFjZW1lbnRzLicsICdGb3IgZXhhbXBsZSwgXCJhdXRvXCIgY2Fubm90IGJlIHVzZWQgdG8gYWxsb3cgXCJib3R0b20tc3RhcnRcIi4nLCAnVXNlIFwiYXV0by1zdGFydFwiIGluc3RlYWQuJ10uam9pbignICcpKTtcbiAgICB9XG4gIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtdHlwZV06IEZsb3cgc2VlbXMgdG8gaGF2ZSBwcm9ibGVtcyB3aXRoIHR3byBhcnJheSB1bmlvbnMuLi5cblxuXG4gIHZhciBvdmVyZmxvd3MgPSBhbGxvd2VkUGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgYWNjW3BsYWNlbWVudF0gPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KVtnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCldO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG92ZXJmbG93cykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBvdmVyZmxvd3NbYV0gLSBvdmVyZmxvd3NbYl07XG4gIH0pO1xufSIsImltcG9ydCBnZXRPcHBvc2l0ZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgY29tcHV0ZUF1dG9QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyBib3R0b20sIHRvcCwgc3RhcnQsIHJpZ2h0LCBsZWZ0LCBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5mdW5jdGlvbiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwbGFjZW1lbnQpIHtcbiAgaWYgKGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0bykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5cbmZ1bmN0aW9uIGZsaXAoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgPSBvcHRpb25zLmZhbGxiYWNrUGxhY2VtZW50cyxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9IG9wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGZsaXBWYXJpYXRpbyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IG9wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzO1xuICB2YXIgcHJlZmVycmVkUGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gYmFzZVBsYWNlbWVudCA9PT0gcHJlZmVycmVkUGxhY2VtZW50O1xuICB2YXIgZmFsbGJhY2tQbGFjZW1lbnRzID0gc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzIHx8IChpc0Jhc2VQbGFjZW1lbnQgfHwgIWZsaXBWYXJpYXRpb25zID8gW2dldE9wcG9zaXRlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCldIDogZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocHJlZmVycmVkUGxhY2VtZW50KSk7XG4gIHZhciBwbGFjZW1lbnRzID0gW3ByZWZlcnJlZFBsYWNlbWVudF0uY29uY2F0KGZhbGxiYWNrUGxhY2VtZW50cykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0byA/IGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zOiBmbGlwVmFyaWF0aW9ucyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50czogYWxsb3dlZEF1dG9QbGFjZW1lbnRzXG4gICAgfSkgOiBwbGFjZW1lbnQpO1xuICB9LCBbXSk7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGNoZWNrc01hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIG1ha2VGYWxsYmFja0NoZWNrcyA9IHRydWU7XG4gIHZhciBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzWzBdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwbGFjZW1lbnQgPSBwbGFjZW1lbnRzW2ldO1xuXG4gICAgdmFyIF9iYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuXG4gICAgdmFyIGlzU3RhcnRWYXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gc3RhcnQ7XG4gICAgdmFyIGlzVmVydGljYWwgPSBbdG9wLCBib3R0b21dLmluZGV4T2YoX2Jhc2VQbGFjZW1lbnQpID49IDA7XG4gICAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSk7XG4gICAgdmFyIG1haW5WYXJpYXRpb25TaWRlID0gaXNWZXJ0aWNhbCA/IGlzU3RhcnRWYXJpYXRpb24gPyByaWdodCA6IGxlZnQgOiBpc1N0YXJ0VmFyaWF0aW9uID8gYm90dG9tIDogdG9wO1xuXG4gICAgaWYgKHJlZmVyZW5jZVJlY3RbbGVuXSA+IHBvcHBlclJlY3RbbGVuXSkge1xuICAgICAgbWFpblZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgfVxuXG4gICAgdmFyIGFsdFZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgdmFyIGNoZWNrcyA9IFtdO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W19iYXNlUGxhY2VtZW50XSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1ttYWluVmFyaWF0aW9uU2lkZV0gPD0gMCwgb3ZlcmZsb3dbYWx0VmFyaWF0aW9uU2lkZV0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrcy5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgIHJldHVybiBjaGVjaztcbiAgICB9KSkge1xuICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50O1xuICAgICAgbWFrZUZhbGxiYWNrQ2hlY2tzID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjaGVja3NNYXAuc2V0KHBsYWNlbWVudCwgY2hlY2tzKTtcbiAgfVxuXG4gIGlmIChtYWtlRmFsbGJhY2tDaGVja3MpIHtcbiAgICAvLyBgMmAgbWF5IGJlIGRlc2lyZWQgaW4gc29tZSBjYXNlcyDigJMgcmVzZWFyY2ggbGF0ZXJcbiAgICB2YXIgbnVtYmVyT2ZDaGVja3MgPSBmbGlwVmFyaWF0aW9ucyA/IDMgOiAxO1xuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoX2kpIHtcbiAgICAgIHZhciBmaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50cy5maW5kKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrcyA9IGNoZWNrc01hcC5nZXQocGxhY2VtZW50KTtcblxuICAgICAgICBpZiAoY2hlY2tzKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrcy5zbGljZSgwLCBfaSkuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZml0dGluZ1BsYWNlbWVudCkge1xuICAgICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBmaXR0aW5nUGxhY2VtZW50O1xuICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBfaSA9IG51bWJlck9mQ2hlY2tzOyBfaSA+IDA7IF9pLS0pIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AoX2kpO1xuXG4gICAgICBpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdGUucGxhY2VtZW50ICE9PSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwID0gdHJ1ZTtcbiAgICBzdGF0ZS5wbGFjZW1lbnQgPSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgc3RhdGUucmVzZXQgPSB0cnVlO1xuICB9XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdmbGlwJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGZsaXAsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J10sXG4gIGRhdGE6IHtcbiAgICBfc2tpcDogZmFsc2VcbiAgfVxufTsiLCJpbXBvcnQgeyB0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcblxuZnVuY3Rpb24gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3QsIHByZXZlbnRlZE9mZnNldHMpIHtcbiAgaWYgKHByZXZlbnRlZE9mZnNldHMgPT09IHZvaWQgMCkge1xuICAgIHByZXZlbnRlZE9mZnNldHMgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogb3ZlcmZsb3cudG9wIC0gcmVjdC5oZWlnaHQgLSBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgcmlnaHQ6IG92ZXJmbG93LnJpZ2h0IC0gcmVjdC53aWR0aCArIHByZXZlbnRlZE9mZnNldHMueCxcbiAgICBib3R0b206IG92ZXJmbG93LmJvdHRvbSAtIHJlY3QuaGVpZ2h0ICsgcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIGxlZnQ6IG92ZXJmbG93LmxlZnQgLSByZWN0LndpZHRoIC0gcHJldmVudGVkT2Zmc2V0cy54XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvdmVyZmxvdykge1xuICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF0uc29tZShmdW5jdGlvbiAoc2lkZSkge1xuICAgIHJldHVybiBvdmVyZmxvd1tzaWRlXSA+PSAwO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGlkZShfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBwcmV2ZW50ZWRPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wcmV2ZW50T3ZlcmZsb3c7XG4gIHZhciByZWZlcmVuY2VPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgZWxlbWVudENvbnRleHQ6ICdyZWZlcmVuY2UnXG4gIH0pO1xuICB2YXIgcG9wcGVyQWx0T3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGFsdEJvdW5kYXJ5OiB0cnVlXG4gIH0pO1xuICB2YXIgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocmVmZXJlbmNlT3ZlcmZsb3csIHJlZmVyZW5jZVJlY3QpO1xuICB2YXIgcG9wcGVyRXNjYXBlT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHBvcHBlckFsdE92ZXJmbG93LCBwb3BwZXJSZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKTtcbiAgdmFyIGlzUmVmZXJlbmNlSGlkZGVuID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyk7XG4gIHZhciBoYXNQb3BwZXJFc2NhcGVkID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHBvcHBlckVzY2FwZU9mZnNldHMpO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0ge1xuICAgIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0czogcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzLFxuICAgIHBvcHBlckVzY2FwZU9mZnNldHM6IHBvcHBlckVzY2FwZU9mZnNldHMsXG4gICAgaXNSZWZlcmVuY2VIaWRkZW46IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgIGhhc1BvcHBlckVzY2FwZWQ6IGhhc1BvcHBlckVzY2FwZWRcbiAgfTtcbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1yZWZlcmVuY2UtaGlkZGVuJzogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgJ2RhdGEtcG9wcGVyLWVzY2FwZWQnOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnaGlkZScsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J10sXG4gIGZuOiBoaWRlXG59OyIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBwbGFjZW1lbnRzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgcmVjdHMsIG9mZnNldCkge1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgdmFyIGludmVydERpc3RhbmNlID0gW2xlZnQsIHRvcF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8gLTEgOiAxO1xuXG4gIHZhciBfcmVmID0gdHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IG9mZnNldChPYmplY3QuYXNzaWduKHt9LCByZWN0cywge1xuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pKSA6IG9mZnNldCxcbiAgICAgIHNraWRkaW5nID0gX3JlZlswXSxcbiAgICAgIGRpc3RhbmNlID0gX3JlZlsxXTtcblxuICBza2lkZGluZyA9IHNraWRkaW5nIHx8IDA7XG4gIGRpc3RhbmNlID0gKGRpc3RhbmNlIHx8IDApICogaW52ZXJ0RGlzdGFuY2U7XG4gIHJldHVybiBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IHtcbiAgICB4OiBkaXN0YW5jZSxcbiAgICB5OiBza2lkZGluZ1xuICB9IDoge1xuICAgIHg6IHNraWRkaW5nLFxuICAgIHk6IGRpc3RhbmNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG9mZnNldChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYyLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRvZmZzZXQgPSBvcHRpb25zLm9mZnNldCxcbiAgICAgIG9mZnNldCA9IF9vcHRpb25zJG9mZnNldCA9PT0gdm9pZCAwID8gWzAsIDBdIDogX29wdGlvbnMkb2Zmc2V0O1xuICB2YXIgZGF0YSA9IHBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCBzdGF0ZS5yZWN0cywgb2Zmc2V0KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHZhciBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQgPSBkYXRhW3N0YXRlLnBsYWNlbWVudF0sXG4gICAgICB4ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50LngsXG4gICAgICB5ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50Lnk7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnggKz0geDtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueSArPSB5O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvZmZzZXQnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIGZuOiBvZmZzZXRcbn07IiwiaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuLi91dGlscy9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuXG5mdW5jdGlvbiBwb3BwZXJPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIC8vIE9mZnNldHMgYXJlIHRoZSBhY3R1YWwgcG9zaXRpb24gdGhlIHBvcHBlciBuZWVkcyB0byBoYXZlIHRvIGJlXG4gIC8vIHByb3Blcmx5IHBvc2l0aW9uZWQgbmVhciBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVGhpcyBpcyB0aGUgbW9zdCBiYXNpYyBwbGFjZW1lbnQsIGFuZCB3aWxsIGJlIGFkanVzdGVkIGJ5XG4gIC8vIHRoZSBtb2RpZmllcnMgaW4gdGhlIG5leHQgc3RlcFxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogc3RhdGUucmVjdHMucmVmZXJlbmNlLFxuICAgIGVsZW1lbnQ6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3BvcHBlck9mZnNldHMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3JlYWQnLFxuICBmbjogcG9wcGVyT2Zmc2V0cyxcbiAgZGF0YToge31cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QWx0QXhpcyhheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneCcgPyAneScgOiAneCc7XG59IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBzdGFydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEFsdEF4aXMgZnJvbSBcIi4uL3V0aWxzL2dldEFsdEF4aXMuanNcIjtcbmltcG9ydCB7IHdpdGhpbiwgd2l0aGluTWF4Q2xhbXAgfSBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldEZyZXNoU2lkZU9iamVjdCBmcm9tIFwiLi4vdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5pbXBvcnQgeyBtaW4gYXMgbWF0aE1pbiwgbWF4IGFzIG1hdGhNYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBwcmV2ZW50T3ZlcmZsb3coX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXIgPSBvcHRpb25zLnRldGhlcixcbiAgICAgIHRldGhlciA9IF9vcHRpb25zJHRldGhlciA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHRldGhlcixcbiAgICAgIF9vcHRpb25zJHRldGhlck9mZnNldCA9IG9wdGlvbnMudGV0aGVyT2Zmc2V0LFxuICAgICAgdGV0aGVyT2Zmc2V0ID0gX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkdGV0aGVyT2Zmc2V0O1xuICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeVxuICB9KTtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIGlzQmFzZVBsYWNlbWVudCA9ICF2YXJpYXRpb247XG4gIHZhciBtYWluQXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGFsdEF4aXMgPSBnZXRBbHRBeGlzKG1haW5BeGlzKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHRldGhlck9mZnNldFZhbHVlID0gdHlwZW9mIHRldGhlck9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IHRldGhlck9mZnNldChPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHRldGhlck9mZnNldDtcbiAgdmFyIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXRWYWx1ZSA9PT0gJ251bWJlcicgPyB7XG4gICAgbWFpbkF4aXM6IHRldGhlck9mZnNldFZhbHVlLFxuICAgIGFsdEF4aXM6IHRldGhlck9mZnNldFZhbHVlXG4gIH0gOiBPYmplY3QuYXNzaWduKHtcbiAgICBtYWluQXhpczogMCxcbiAgICBhbHRBeGlzOiAwXG4gIH0sIHRldGhlck9mZnNldFZhbHVlKTtcbiAgdmFyIG9mZnNldE1vZGlmaWVyU3RhdGUgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldCA/IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0W3N0YXRlLnBsYWNlbWVudF0gOiBudWxsO1xuICB2YXIgZGF0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQ7XG5cbiAgICB2YXIgbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgICB2YXIgYWx0U2lkZSA9IG1haW5BeGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc107XG4gICAgdmFyIG1pbiA9IG9mZnNldCArIG92ZXJmbG93W21haW5TaWRlXTtcbiAgICB2YXIgbWF4ID0gb2Zmc2V0IC0gb3ZlcmZsb3dbYWx0U2lkZV07XG4gICAgdmFyIGFkZGl0aXZlID0gdGV0aGVyID8gLXBvcHBlclJlY3RbbGVuXSAvIDIgOiAwO1xuICAgIHZhciBtaW5MZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gcmVmZXJlbmNlUmVjdFtsZW5dIDogcG9wcGVyUmVjdFtsZW5dO1xuICAgIHZhciBtYXhMZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gLXBvcHBlclJlY3RbbGVuXSA6IC1yZWZlcmVuY2VSZWN0W2xlbl07IC8vIFdlIG5lZWQgdG8gaW5jbHVkZSB0aGUgYXJyb3cgaW4gdGhlIGNhbGN1bGF0aW9uIHNvIHRoZSBhcnJvdyBkb2Vzbid0IGdvXG4gICAgLy8gb3V0c2lkZSB0aGUgcmVmZXJlbmNlIGJvdW5kc1xuXG4gICAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICAgIHZhciBhcnJvd1JlY3QgPSB0ZXRoZXIgJiYgYXJyb3dFbGVtZW50ID8gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpIDoge1xuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuICAgIHZhciBhcnJvd1BhZGRpbmdPYmplY3QgPSBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10gPyBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10ucGFkZGluZyA6IGdldEZyZXNoU2lkZU9iamVjdCgpO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNaW4gPSBhcnJvd1BhZGRpbmdPYmplY3RbbWFpblNpZGVdO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNYXggPSBhcnJvd1BhZGRpbmdPYmplY3RbYWx0U2lkZV07IC8vIElmIHRoZSByZWZlcmVuY2UgbGVuZ3RoIGlzIHNtYWxsZXIgdGhhbiB0aGUgYXJyb3cgbGVuZ3RoLCB3ZSBkb24ndCB3YW50XG4gICAgLy8gdG8gaW5jbHVkZSBpdHMgZnVsbCBzaXplIGluIHRoZSBjYWxjdWxhdGlvbi4gSWYgdGhlIHJlZmVyZW5jZSBpcyBzbWFsbFxuICAgIC8vIGFuZCBuZWFyIHRoZSBlZGdlIG9mIGEgYm91bmRhcnksIHRoZSBwb3BwZXIgY2FuIG92ZXJmbG93IGV2ZW4gaWYgdGhlXG4gICAgLy8gcmVmZXJlbmNlIGlzIG5vdCBvdmVyZmxvd2luZyBhcyB3ZWxsIChlLmcuIHZpcnR1YWwgZWxlbWVudHMgd2l0aCBub1xuICAgIC8vIHdpZHRoIG9yIGhlaWdodClcblxuICAgIHZhciBhcnJvd0xlbiA9IHdpdGhpbigwLCByZWZlcmVuY2VSZWN0W2xlbl0sIGFycm93UmVjdFtsZW5dKTtcbiAgICB2YXIgbWluT2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiAtIGFkZGl0aXZlIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXMgOiBtaW5MZW4gLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcztcbiAgICB2YXIgbWF4T2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gLXJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgKyBhZGRpdGl2ZSArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzIDogbWF4TGVuICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXM7XG4gICAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3cgJiYgZ2V0T2Zmc2V0UGFyZW50KHN0YXRlLmVsZW1lbnRzLmFycm93KTtcbiAgICB2YXIgY2xpZW50T2Zmc2V0ID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBtYWluQXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50VG9wIHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRMZWZ0IHx8IDAgOiAwO1xuICAgIHZhciBvZmZzZXRNb2RpZmllclZhbHVlID0gKF9vZmZzZXRNb2RpZmllclN0YXRlJCA9IG9mZnNldE1vZGlmaWVyU3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IG9mZnNldE1vZGlmaWVyU3RhdGVbbWFpbkF4aXNdKSAhPSBudWxsID8gX29mZnNldE1vZGlmaWVyU3RhdGUkIDogMDtcbiAgICB2YXIgdGV0aGVyTWluID0gb2Zmc2V0ICsgbWluT2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIGNsaWVudE9mZnNldDtcbiAgICB2YXIgdGV0aGVyTWF4ID0gb2Zmc2V0ICsgbWF4T2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZTtcbiAgICB2YXIgcHJldmVudGVkT2Zmc2V0ID0gd2l0aGluKHRldGhlciA/IG1hdGhNaW4obWluLCB0ZXRoZXJNaW4pIDogbWluLCBvZmZzZXQsIHRldGhlciA/IG1hdGhNYXgobWF4LCB0ZXRoZXJNYXgpIDogbWF4KTtcbiAgICBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldDtcbiAgICBkYXRhW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldCAtIG9mZnNldDtcbiAgfVxuXG4gIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICB2YXIgX29mZnNldE1vZGlmaWVyU3RhdGUkMjtcblxuICAgIHZhciBfbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gdG9wIDogbGVmdDtcblxuICAgIHZhciBfYWx0U2lkZSA9IG1haW5BeGlzID09PSAneCcgPyBib3R0b20gOiByaWdodDtcblxuICAgIHZhciBfb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1thbHRBeGlzXTtcblxuICAgIHZhciBfbGVuID0gYWx0QXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgdmFyIF9taW4gPSBfb2Zmc2V0ICsgb3ZlcmZsb3dbX21haW5TaWRlXTtcblxuICAgIHZhciBfbWF4ID0gX29mZnNldCAtIG92ZXJmbG93W19hbHRTaWRlXTtcblxuICAgIHZhciBpc09yaWdpblNpZGUgPSBbdG9wLCBsZWZ0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcblxuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSA9IChfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyID0gb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogb2Zmc2V0TW9kaWZpZXJTdGF0ZVthbHRBeGlzXSkgIT0gbnVsbCA/IF9vZmZzZXRNb2RpZmllclN0YXRlJDIgOiAwO1xuXG4gICAgdmFyIF90ZXRoZXJNaW4gPSBpc09yaWdpblNpZGUgPyBfbWluIDogX29mZnNldCAtIHJlZmVyZW5jZVJlY3RbX2xlbl0gLSBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcztcblxuICAgIHZhciBfdGV0aGVyTWF4ID0gaXNPcmlnaW5TaWRlID8gX29mZnNldCArIHJlZmVyZW5jZVJlY3RbX2xlbl0gKyBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcyA6IF9tYXg7XG5cbiAgICB2YXIgX3ByZXZlbnRlZE9mZnNldCA9IHRldGhlciAmJiBpc09yaWdpblNpZGUgPyB3aXRoaW5NYXhDbGFtcChfdGV0aGVyTWluLCBfb2Zmc2V0LCBfdGV0aGVyTWF4KSA6IHdpdGhpbih0ZXRoZXIgPyBfdGV0aGVyTWluIDogX21pbiwgX29mZnNldCwgdGV0aGVyID8gX3RldGhlck1heCA6IF9tYXgpO1xuXG4gICAgcG9wcGVyT2Zmc2V0c1thbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQ7XG4gICAgZGF0YVthbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQgLSBfb2Zmc2V0O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwcmV2ZW50T3ZlcmZsb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogcHJldmVudE92ZXJmbG93LFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ29mZnNldCddXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEhUTUxFbGVtZW50U2Nyb2xsKGVsZW1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBlbGVtZW50LnNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBlbGVtZW50LnNjcm9sbFRvcFxuICB9O1xufSIsImltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRIVE1MRWxlbWVudFNjcm9sbCBmcm9tIFwiLi9nZXRIVE1MRWxlbWVudFNjcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZVNjcm9sbChub2RlKSB7XG4gIGlmIChub2RlID09PSBnZXRXaW5kb3cobm9kZSkgfHwgIWlzSFRNTEVsZW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gZ2V0V2luZG93U2Nyb2xsKG5vZGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRIVE1MRWxlbWVudFNjcm9sbChub2RlKTtcbiAgfVxufSIsImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZVNjcm9sbCBmcm9tIFwiLi9nZXROb2RlU2Nyb2xsLmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudFNjYWxlZChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IHJvdW5kKHJlY3Qud2lkdGgpIC8gZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAxO1xuICB2YXIgc2NhbGVZID0gcm91bmQocmVjdC5oZWlnaHQpIC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMTtcbiAgcmV0dXJuIHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDE7XG59IC8vIFJldHVybnMgdGhlIGNvbXBvc2l0ZSByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC5cbi8vIENvbXBvc2l0ZSBtZWFucyBpdCB0YWtlcyBpbnRvIGFjY291bnQgdHJhbnNmb3JtcyBhcyB3ZWxsIGFzIGxheW91dC5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wb3NpdGVSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnQsIGlzRml4ZWQpIHtcbiAgaWYgKGlzRml4ZWQgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudElzU2NhbGVkID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzRWxlbWVudFNjYWxlZChvZmZzZXRQYXJlbnQpO1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnRJc1NjYWxlZCk7XG4gIHZhciBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgdmFyIG9mZnNldHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50IHx8ICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCkge1xuICAgIGlmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpICE9PSAnYm9keScgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMDc4XG4gICAgaXNTY3JvbGxQYXJlbnQoZG9jdW1lbnRFbGVtZW50KSkge1xuICAgICAgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChvZmZzZXRQYXJlbnQpO1xuICAgIH1cblxuICAgIGlmIChpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkpIHtcbiAgICAgIG9mZnNldHMgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50LCB0cnVlKTtcbiAgICAgIG9mZnNldHMueCArPSBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgIG9mZnNldHMueSArPSBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBvZmZzZXRzLnggPSBnZXRXaW5kb3dTY3JvbGxCYXJYKGRvY3VtZW50RWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiByZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIG9mZnNldHMueCxcbiAgICB5OiByZWN0LnRvcCArIHNjcm9sbC5zY3JvbGxUb3AgLSBvZmZzZXRzLnksXG4gICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICB9O1xufSIsImltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIHNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk4NzUyNTVcblxuZnVuY3Rpb24gb3JkZXIobW9kaWZpZXJzKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwKCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IFNldCgpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIG1hcC5zZXQobW9kaWZpZXIubmFtZSwgbW9kaWZpZXIpO1xuICB9KTsgLy8gT24gdmlzaXRpbmcgb2JqZWN0LCBjaGVjayBmb3IgaXRzIGRlcGVuZGVuY2llcyBhbmQgdmlzaXQgdGhlbSByZWN1cnNpdmVseVxuXG4gIGZ1bmN0aW9uIHNvcnQobW9kaWZpZXIpIHtcbiAgICB2aXNpdGVkLmFkZChtb2RpZmllci5uYW1lKTtcbiAgICB2YXIgcmVxdWlyZXMgPSBbXS5jb25jYXQobW9kaWZpZXIucmVxdWlyZXMgfHwgW10sIG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMgfHwgW10pO1xuICAgIHJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKGRlcCkge1xuICAgICAgaWYgKCF2aXNpdGVkLmhhcyhkZXApKSB7XG4gICAgICAgIHZhciBkZXBNb2RpZmllciA9IG1hcC5nZXQoZGVwKTtcblxuICAgICAgICBpZiAoZGVwTW9kaWZpZXIpIHtcbiAgICAgICAgICBzb3J0KGRlcE1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKG1vZGlmaWVyKTtcbiAgfVxuXG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmICghdmlzaXRlZC5oYXMobW9kaWZpZXIubmFtZSkpIHtcbiAgICAgIC8vIGNoZWNrIGZvciB2aXNpdGVkIG9iamVjdFxuICAgICAgc29ydChtb2RpZmllcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkZXJNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIC8vIG9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xuICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyKG1vZGlmaWVycyk7IC8vIG9yZGVyIGJhc2VkIG9uIHBoYXNlXG5cbiAgcmV0dXJuIG1vZGlmaWVyUGhhc2VzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwaGFzZSkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLnBoYXNlID09PSBwaGFzZTtcbiAgICB9KSk7XG4gIH0sIFtdKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0KHN0cikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KGFyZ3MpLnJlZHVjZShmdW5jdGlvbiAocCwgYykge1xuICAgIHJldHVybiBwLnJlcGxhY2UoLyVzLywgYyk7XG4gIH0sIHN0cik7XG59IiwiaW1wb3J0IGZvcm1hdCBmcm9tIFwiLi9mb3JtYXQuanNcIjtcbmltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9NT0RJRklFUl9FUlJPUiA9ICdQb3BwZXI6IG1vZGlmaWVyIFwiJXNcIiBwcm92aWRlZCBhbiBpbnZhbGlkICVzIHByb3BlcnR5LCBleHBlY3RlZCAlcyBidXQgZ290ICVzJztcbnZhciBNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IgPSAnUG9wcGVyOiBtb2RpZmllciBcIiVzXCIgcmVxdWlyZXMgXCIlc1wiLCBidXQgXCIlc1wiIG1vZGlmaWVyIGlzIG5vdCBhdmFpbGFibGUnO1xudmFyIFZBTElEX1BST1BFUlRJRVMgPSBbJ25hbWUnLCAnZW5hYmxlZCcsICdwaGFzZScsICdmbicsICdlZmZlY3QnLCAncmVxdWlyZXMnLCAnb3B0aW9ucyddO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmFsaWRhdGVNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIFtdLmNvbmNhdChPYmplY3Qua2V5cyhtb2RpZmllciksIFZBTElEX1BST1BFUlRJRVMpIC8vIElFMTEtY29tcGF0aWJsZSByZXBsYWNlbWVudCBmb3IgYG5ldyBTZXQoaXRlcmFibGUpYFxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmllci5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgU3RyaW5nKG1vZGlmaWVyLm5hbWUpLCAnXCJuYW1lXCInLCAnXCJzdHJpbmdcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLm5hbWUpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmVuYWJsZWQgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZW5hYmxlZFwiJywgJ1wiYm9vbGVhblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZW5hYmxlZCkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3BoYXNlJzpcbiAgICAgICAgICBpZiAobW9kaWZpZXJQaGFzZXMuaW5kZXhPZihtb2RpZmllci5waGFzZSkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJwaGFzZVwiJywgXCJlaXRoZXIgXCIgKyBtb2RpZmllclBoYXNlcy5qb2luKCcsICcpLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5waGFzZSkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2ZuJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJmblwiJywgJ1wiZnVuY3Rpb25cIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLmZuKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZWZmZWN0JzpcbiAgICAgICAgICBpZiAobW9kaWZpZXIuZWZmZWN0ICE9IG51bGwgJiYgdHlwZW9mIG1vZGlmaWVyLmVmZmVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZWZmZWN0XCInLCAnXCJmdW5jdGlvblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZm4pICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdyZXF1aXJlcyc6XG4gICAgICAgICAgaWYgKG1vZGlmaWVyLnJlcXVpcmVzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobW9kaWZpZXIucmVxdWlyZXMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc1wiJywgJ1wiYXJyYXlcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLnJlcXVpcmVzKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncmVxdWlyZXNJZkV4aXN0cyc6XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc0lmRXhpc3RzXCInLCAnXCJhcnJheVwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cykgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ29wdGlvbnMnOlxuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQb3BwZXJKUzogYW4gaW52YWxpZCBwcm9wZXJ0eSBoYXMgYmVlbiBwcm92aWRlZCB0byB0aGUgXFxcIlwiICsgbW9kaWZpZXIubmFtZSArIFwiXFxcIiBtb2RpZmllciwgdmFsaWQgcHJvcGVydGllcyBhcmUgXCIgKyBWQUxJRF9QUk9QRVJUSUVTLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgcmV0dXJuIFwiXFxcIlwiICsgcyArIFwiXFxcIlwiO1xuICAgICAgICAgIH0pLmpvaW4oJywgJykgKyBcIjsgYnV0IFxcXCJcIiArIGtleSArIFwiXFxcIiB3YXMgcHJvdmlkZWQuXCIpO1xuICAgICAgfVxuXG4gICAgICBtb2RpZmllci5yZXF1aXJlcyAmJiBtb2RpZmllci5yZXF1aXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXF1aXJlbWVudCkge1xuICAgICAgICBpZiAobW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgIHJldHVybiBtb2QubmFtZSA9PT0gcmVxdWlyZW1lbnQ7XG4gICAgICAgIH0pID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IsIFN0cmluZyhtb2RpZmllci5uYW1lKSwgcmVxdWlyZW1lbnQsIHJlcXVpcmVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1bmlxdWVCeShhcnIsIGZuKSB7XG4gIHZhciBpZGVudGlmaWVycyA9IG5ldyBTZXQoKTtcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB2YXIgaWRlbnRpZmllciA9IGZuKGl0ZW0pO1xuXG4gICAgaWYgKCFpZGVudGlmaWVycy5oYXMoaWRlbnRpZmllcikpIHtcbiAgICAgIGlkZW50aWZpZXJzLmFkZChpZGVudGlmaWVyKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VCeU5hbWUobW9kaWZpZXJzKSB7XG4gIHZhciBtZXJnZWQgPSBtb2RpZmllcnMucmVkdWNlKGZ1bmN0aW9uIChtZXJnZWQsIGN1cnJlbnQpIHtcbiAgICB2YXIgZXhpc3RpbmcgPSBtZXJnZWRbY3VycmVudC5uYW1lXTtcbiAgICBtZXJnZWRbY3VycmVudC5uYW1lXSA9IGV4aXN0aW5nID8gT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcsIGN1cnJlbnQsIHtcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLm9wdGlvbnMsIGN1cnJlbnQub3B0aW9ucyksXG4gICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5kYXRhLCBjdXJyZW50LmRhdGEpXG4gICAgfSkgOiBjdXJyZW50O1xuICAgIHJldHVybiBtZXJnZWQ7XG4gIH0sIHt9KTsgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IE9iamVjdC52YWx1ZXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VkKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBtZXJnZWRba2V5XTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldENvbXBvc2l0ZVJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgb3JkZXJNb2RpZmllcnMgZnJvbSBcIi4vdXRpbHMvb3JkZXJNb2RpZmllcnMuanNcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiLi91dGlscy9kZWJvdW5jZS5qc1wiO1xuaW1wb3J0IHZhbGlkYXRlTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgdW5pcXVlQnkgZnJvbSBcIi4vdXRpbHMvdW5pcXVlQnkuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBtZXJnZUJ5TmFtZSBmcm9tIFwiLi91dGlscy9tZXJnZUJ5TmFtZS5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9FTEVNRU5UX0VSUk9SID0gJ1BvcHBlcjogSW52YWxpZCByZWZlcmVuY2Ugb3IgcG9wcGVyIGFyZ3VtZW50IHByb3ZpZGVkLiBUaGV5IG11c3QgYmUgZWl0aGVyIGEgRE9NIGVsZW1lbnQgb3IgdmlydHVhbCBlbGVtZW50Lic7XG52YXIgSU5GSU5JVEVfTE9PUF9FUlJPUiA9ICdQb3BwZXI6IEFuIGluZmluaXRlIGxvb3AgaW4gdGhlIG1vZGlmaWVycyBjeWNsZSBoYXMgYmVlbiBkZXRlY3RlZCEgVGhlIGN5Y2xlIGhhcyBiZWVuIGludGVycnVwdGVkIHRvIHByZXZlbnQgYSBicm93c2VyIGNyYXNoLic7XG52YXIgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBtb2RpZmllcnM6IFtdLFxuICBzdHJhdGVneTogJ2Fic29sdXRlJ1xufTtcblxuZnVuY3Rpb24gYXJlVmFsaWRFbGVtZW50cygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiAhYXJncy5zb21lKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuICEoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHBlckdlbmVyYXRvcihnZW5lcmF0b3JPcHRpb25zKSB7XG4gIGlmIChnZW5lcmF0b3JPcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBnZW5lcmF0b3JPcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX2dlbmVyYXRvck9wdGlvbnMgPSBnZW5lcmF0b3JPcHRpb25zLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE1vZGlmaWVycyxcbiAgICAgIGRlZmF1bHRNb2RpZmllcnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPT09IHZvaWQgMCA/IFtdIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuICAgICAgZGVmYXVsdE9wdGlvbnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID09PSB2b2lkIDAgPyBERUZBVUxUX09QVElPTlMgOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyO1xuICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICBvcmRlcmVkTW9kaWZpZXJzOiBbXSxcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMpLFxuICAgICAgbW9kaWZpZXJzRGF0YToge30sXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcbiAgICAgICAgcG9wcGVyOiBwb3BwZXJcbiAgICAgIH0sXG4gICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgIHN0eWxlczoge31cbiAgICB9O1xuICAgIHZhciBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgdmFyIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgc2V0T3B0aW9uczogZnVuY3Rpb24gc2V0T3B0aW9ucyhzZXRPcHRpb25zQWN0aW9uKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIHNldE9wdGlvbnNBY3Rpb24gPT09ICdmdW5jdGlvbicgPyBzZXRPcHRpb25zQWN0aW9uKHN0YXRlLm9wdGlvbnMpIDogc2V0T3B0aW9uc0FjdGlvbjtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBzdGF0ZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHN0YXRlLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogaXNFbGVtZW50KHJlZmVyZW5jZSkgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UpIDogcmVmZXJlbmNlLmNvbnRleHRFbGVtZW50ID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlLmNvbnRleHRFbGVtZW50KSA6IFtdLFxuICAgICAgICAgIHBvcHBlcjogbGlzdFNjcm9sbFBhcmVudHMocG9wcGVyKVxuICAgICAgICB9OyAvLyBPcmRlcnMgdGhlIG1vZGlmaWVycyBiYXNlZCBvbiB0aGVpciBkZXBlbmRlbmNpZXMgYW5kIGBwaGFzZWBcbiAgICAgICAgLy8gcHJvcGVydGllc1xuXG4gICAgICAgIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJNb2RpZmllcnMobWVyZ2VCeU5hbWUoW10uY29uY2F0KGRlZmF1bHRNb2RpZmllcnMsIHN0YXRlLm9wdGlvbnMubW9kaWZpZXJzKSkpOyAvLyBTdHJpcCBvdXQgZGlzYWJsZWQgbW9kaWZpZXJzXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uZW5hYmxlZDtcbiAgICAgICAgfSk7IC8vIFZhbGlkYXRlIHRoZSBwcm92aWRlZCBtb2RpZmllcnMgc28gdGhhdCB0aGUgY29uc3VtZXIgd2lsbCBnZXQgd2FybmVkXG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgbW9kaWZpZXJzIGlzIGludmFsaWQgZm9yIGFueSByZWFzb25cblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgdmFyIG1vZGlmaWVycyA9IHVuaXF1ZUJ5KFtdLmNvbmNhdChvcmRlcmVkTW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycyksIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZTtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhbGlkYXRlTW9kaWZpZXJzKG1vZGlmaWVycyk7XG5cbiAgICAgICAgICBpZiAoZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5vcHRpb25zLnBsYWNlbWVudCkgPT09IGF1dG8pIHtcbiAgICAgICAgICAgIHZhciBmbGlwTW9kaWZpZXIgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICAgICAgICAgIHZhciBuYW1lID0gX3JlZjIubmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT09ICdmbGlwJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWZsaXBNb2RpZmllcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBcImF1dG9cIiBwbGFjZW1lbnRzIHJlcXVpcmUgdGhlIFwiZmxpcFwiIG1vZGlmaWVyIGJlJywgJ3ByZXNlbnQgYW5kIGVuYWJsZWQgdG8gd29yay4nXS5qb2luKCcgJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZ2V0Q29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUocG9wcGVyKSxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luVG9wLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodCA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpblJpZ2h0LFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgICAgIG1hcmdpbkxlZnQgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5MZWZ0OyAvLyBXZSBubyBsb25nZXIgdGFrZSBpbnRvIGFjY291bnQgYG1hcmdpbnNgIG9uIHRoZSBwb3BwZXIsIGFuZCBpdCBjYW5cbiAgICAgICAgICAvLyBjYXVzZSBidWdzIHdpdGggcG9zaXRpb25pbmcsIHNvIHdlJ2xsIHdhcm4gdGhlIGNvbnN1bWVyXG5cblxuICAgICAgICAgIGlmIChbbWFyZ2luVG9wLCBtYXJnaW5SaWdodCwgbWFyZ2luQm90dG9tLCBtYXJnaW5MZWZ0XS5zb21lKGZ1bmN0aW9uIChtYXJnaW4pIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG1hcmdpbik7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihbJ1BvcHBlcjogQ1NTIFwibWFyZ2luXCIgc3R5bGVzIGNhbm5vdCBiZSB1c2VkIHRvIGFwcGx5IHBhZGRpbmcnLCAnYmV0d2VlbiB0aGUgcG9wcGVyIGFuZCBpdHMgcmVmZXJlbmNlIGVsZW1lbnQgb3IgYm91bmRhcnkuJywgJ1RvIHJlcGxpY2F0ZSBtYXJnaW4sIHVzZSB0aGUgYG9mZnNldGAgbW9kaWZpZXIsIGFzIHdlbGwgYXMnLCAndGhlIGBwYWRkaW5nYCBvcHRpb24gaW4gdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIGFuZCBgZmxpcGAnLCAnbW9kaWZpZXJzLiddLmpvaW4oJyAnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcnVuTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIH0sXG4gICAgICAvLyBTeW5jIHVwZGF0ZSDigJMgaXQgd2lsbCBhbHdheXMgYmUgZXhlY3V0ZWQsIGV2ZW4gaWYgbm90IG5lY2Vzc2FyeS4gVGhpc1xuICAgICAgLy8gaXMgdXNlZnVsIGZvciBsb3cgZnJlcXVlbmN5IHVwZGF0ZXMgd2hlcmUgc3luYyBiZWhhdmlvciBzaW1wbGlmaWVzIHRoZVxuICAgICAgLy8gbG9naWMuXG4gICAgICAvLyBGb3IgaGlnaCBmcmVxdWVuY3kgdXBkYXRlcyAoZS5nLiBgcmVzaXplYCBhbmQgYHNjcm9sbGAgZXZlbnRzKSwgYWx3YXlzXG4gICAgICAvLyBwcmVmZXIgdGhlIGFzeW5jIFBvcHBlciN1cGRhdGUgbWV0aG9kXG4gICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gICAgICAgIGlmIChpc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3RhdGUkZWxlbWVudHMgPSBzdGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IF9zdGF0ZSRlbGVtZW50cy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBwb3BwZXIgPSBfc3RhdGUkZWxlbWVudHMucG9wcGVyOyAvLyBEb24ndCBwcm9jZWVkIGlmIGByZWZlcmVuY2VgIG9yIGBwb3BwZXJgIGFyZSBub3QgdmFsaWQgZWxlbWVudHNcbiAgICAgICAgLy8gYW55bW9yZVxuXG4gICAgICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKElOVkFMSURfRUxFTUVOVF9FUlJPUik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgYW5kIHBvcHBlciByZWN0cyB0byBiZSByZWFkIGJ5IG1vZGlmaWVyc1xuXG5cbiAgICAgICAgc3RhdGUucmVjdHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBnZXRDb21wb3NpdGVSZWN0KHJlZmVyZW5jZSwgZ2V0T2Zmc2V0UGFyZW50KHBvcHBlciksIHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCcpLFxuICAgICAgICAgIHBvcHBlcjogZ2V0TGF5b3V0UmVjdChwb3BwZXIpXG4gICAgICAgIH07IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIHJlc2V0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZS4gVGhlXG4gICAgICAgIC8vIG1vc3QgY29tbW9uIHVzZSBjYXNlIGZvciB0aGlzIGlzIHRoZSBgZmxpcGAgbW9kaWZpZXIgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIHBsYWNlbWVudCwgd2hpY2ggdGhlbiBuZWVkcyB0byByZS1ydW4gYWxsIHRoZSBtb2RpZmllcnMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIGxvZ2ljIHdhcyBwcmV2aW91c2x5IHJhbiBmb3IgdGhlIHByZXZpb3VzIHBsYWNlbWVudCBhbmQgaXMgdGhlcmVmb3JlXG4gICAgICAgIC8vIHN0YWxlL2luY29ycmVjdFxuXG4gICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50OyAvLyBPbiBlYWNoIHVwZGF0ZSBjeWNsZSwgdGhlIGBtb2RpZmllcnNEYXRhYCBwcm9wZXJ0eSBmb3IgZWFjaCBtb2RpZmllclxuICAgICAgICAvLyBpcyBmaWxsZWQgd2l0aCB0aGUgaW5pdGlhbCBkYXRhIHNwZWNpZmllZCBieSB0aGUgbW9kaWZpZXIuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gaXQgZG9lc24ndCBwZXJzaXN0IGFuZCBpcyBmcmVzaCBvbiBlYWNoIHVwZGF0ZS5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHBlcnNpc3RlbnQgZGF0YSwgdXNlIGAke25hbWV9I3BlcnNpc3RlbnRgXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5tb2RpZmllcnNEYXRhW21vZGlmaWVyLm5hbWVdID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kaWZpZXIuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgX19kZWJ1Z19sb29wc19fID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBfX2RlYnVnX2xvb3BzX18gKz0gMTtcblxuICAgICAgICAgICAgaWYgKF9fZGVidWdfbG9vcHNfXyA+IDEwMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKElORklOSVRFX0xPT1BfRVJST1IpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdGUucmVzZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICBpbmRleCA9IC0xO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZSA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnNbaW5kZXhdLFxuICAgICAgICAgICAgICBmbiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5mbixcbiAgICAgICAgICAgICAgX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5vcHRpb25zLFxuICAgICAgICAgICAgICBfb3B0aW9ucyA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPT09IHZvaWQgMCA/IHt9IDogX3N0YXRlJG9yZGVyZWRNb2RpZmllMixcbiAgICAgICAgICAgICAgbmFtZSA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5uYW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RhdGUgPSBmbih7XG4gICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgb3B0aW9uczogX29wdGlvbnMsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICAgICAgfSkgfHwgc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQXN5bmMgYW5kIG9wdGltaXN0aWNhbGx5IG9wdGltaXplZCB1cGRhdGUg4oCTIGl0IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IChkZWJvdW5jZWQgdG8gcnVuIGF0IG1vc3Qgb25jZS1wZXItdGljaylcbiAgICAgIHVwZGF0ZTogZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBpc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihJTlZBTElEX0VMRU1FTlRfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKCFpc0Rlc3Ryb3llZCAmJiBvcHRpb25zLm9uRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSBiZWZvcmUgdGhlIGZpcnN0XG4gICAgLy8gdXBkYXRlIGN5Y2xlIHJ1bnMuIFRoZXkgd2lsbCBiZSBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdXBkYXRlXG4gICAgLy8gY3ljbGUuIFRoaXMgaXMgdXNlZnVsIHdoZW4gYSBtb2RpZmllciBhZGRzIHNvbWUgcGVyc2lzdGVudCBkYXRhIHRoYXRcbiAgICAvLyBvdGhlciBtb2RpZmllcnMgbmVlZCB0byB1c2UsIGJ1dCB0aGUgbW9kaWZpZXIgaXMgcnVuIGFmdGVyIHRoZSBkZXBlbmRlbnRcbiAgICAvLyBvbmUuXG5cbiAgICBmdW5jdGlvbiBydW5Nb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgICAgIHZhciBuYW1lID0gX3JlZjMubmFtZSxcbiAgICAgICAgICAgIF9yZWYzJG9wdGlvbnMgPSBfcmVmMy5vcHRpb25zLFxuICAgICAgICAgICAgb3B0aW9ucyA9IF9yZWYzJG9wdGlvbnMgPT09IHZvaWQgMCA/IHt9IDogX3JlZjMkb3B0aW9ucyxcbiAgICAgICAgICAgIGVmZmVjdCA9IF9yZWYzLmVmZmVjdDtcblxuICAgICAgICBpZiAodHlwZW9mIGVmZmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhciBjbGVhbnVwRm4gPSBlZmZlY3Qoe1xuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBub29wRm4gPSBmdW5jdGlvbiBub29wRm4oKSB7fTtcblxuICAgICAgICAgIGVmZmVjdENsZWFudXBGbnMucHVzaChjbGVhbnVwRm4gfHwgbm9vcEZuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KTtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG59XG5leHBvcnQgdmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3IoKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBkZXRlY3RPdmVyZmxvdyB9OyIsImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xuaW1wb3J0IG9mZnNldCBmcm9tIFwiLi9tb2RpZmllcnMvb2Zmc2V0LmpzXCI7XG5pbXBvcnQgZmxpcCBmcm9tIFwiLi9tb2RpZmllcnMvZmxpcC5qc1wiO1xuaW1wb3J0IHByZXZlbnRPdmVyZmxvdyBmcm9tIFwiLi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgYXJyb3cgZnJvbSBcIi4vbW9kaWZpZXJzL2Fycm93LmpzXCI7XG5pbXBvcnQgaGlkZSBmcm9tIFwiLi9tb2RpZmllcnMvaGlkZS5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzLCBvZmZzZXQsIGZsaXAsIHByZXZlbnRPdmVyZmxvdywgYXJyb3csIGhpZGVdO1xudmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3Ioe1xuICBkZWZhdWx0TW9kaWZpZXJzOiBkZWZhdWx0TW9kaWZpZXJzXG59KTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIsIHBvcHBlckdlbmVyYXRvciwgZGVmYXVsdE1vZGlmaWVycywgZGV0ZWN0T3ZlcmZsb3cgfTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyTGl0ZSB9IGZyb20gXCIuL3BvcHBlci1saXRlLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0ICogZnJvbSBcIi4vbW9kaWZpZXJzL2luZGV4LmpzXCI7IiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHsgQXBwLCBJU3VnZ2VzdE93bmVyLCBTY29wZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlUG9wcGVyLCBJbnN0YW5jZSBhcyBQb3BwZXJJbnN0YW5jZSB9IGZyb20gXCJAcG9wcGVyanMvY29yZVwiO1xuXG5jb25zdCB3cmFwQXJvdW5kID0gKHZhbHVlOiBudW1iZXIsIHNpemU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICgodmFsdWUgJSBzaXplKSArIHNpemUpICUgc2l6ZTtcbn07XG5cbmNsYXNzIFN1Z2dlc3Q8VD4ge1xuICAgIHByaXZhdGUgb3duZXI6IElTdWdnZXN0T3duZXI8VD47XG4gICAgcHJpdmF0ZSB2YWx1ZXM6IFRbXTtcbiAgICBwcml2YXRlIHN1Z2dlc3Rpb25zOiBIVE1MRGl2RWxlbWVudFtdO1xuICAgIHByaXZhdGUgc2VsZWN0ZWRJdGVtOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgb3duZXI6IElTdWdnZXN0T3duZXI8VD4sXG4gICAgICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgc2NvcGU6IFNjb3BlXG4gICAgKSB7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbCA9IGNvbnRhaW5lckVsO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLm9uKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgXCIuc3VnZ2VzdGlvbi1pdGVtXCIsXG4gICAgICAgICAgICB0aGlzLm9uU3VnZ2VzdGlvbkNsaWNrLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgY29udGFpbmVyRWwub24oXG4gICAgICAgICAgICBcIm1vdXNlbW92ZVwiLFxuICAgICAgICAgICAgXCIuc3VnZ2VzdGlvbi1pdGVtXCIsXG4gICAgICAgICAgICB0aGlzLm9uU3VnZ2VzdGlvbk1vdXNlb3Zlci5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dVcFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaXNDb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbSh0aGlzLnNlbGVjdGVkSXRlbSAtIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dEb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pc0NvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKHRoaXMuc2VsZWN0ZWRJdGVtICsgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS5yZWdpc3RlcihbXSwgXCJFbnRlclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaXNDb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZVNlbGVjdGVkSXRlbShldmVudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN1Z2dlc3Rpb25DbGljayhldmVudDogTW91c2VFdmVudCwgZWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3VnZ2VzdGlvbnMuaW5kZXhPZihlbCk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKGl0ZW0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy51c2VTZWxlY3RlZEl0ZW0oZXZlbnQpO1xuICAgIH1cblxuICAgIG9uU3VnZ2VzdGlvbk1vdXNlb3ZlcihfZXZlbnQ6IE1vdXNlRXZlbnQsIGVsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdWdnZXN0aW9ucy5pbmRleE9mKGVsKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0oaXRlbSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHNldFN1Z2dlc3Rpb25zKHZhbHVlczogVFtdKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkVsczogSFRNTERpdkVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkVsID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoXCJzdWdnZXN0aW9uLWl0ZW1cIik7XG4gICAgICAgICAgICB0aGlzLm93bmVyLnJlbmRlclN1Z2dlc3Rpb24odmFsdWUsIHN1Z2dlc3Rpb25FbCk7XG4gICAgICAgICAgICBzdWdnZXN0aW9uRWxzLnB1c2goc3VnZ2VzdGlvbkVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uRWxzO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbSgwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdXNlU2VsZWN0ZWRJdGVtKGV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0aGlzLnZhbHVlc1t0aGlzLnNlbGVjdGVkSXRlbV07XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMub3duZXIuc2VsZWN0U3VnZ2VzdGlvbihjdXJyZW50VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFNlbGVjdGVkSXRlbShzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEludG9WaWV3OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJbmRleCA9IHdyYXBBcm91bmQoXG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGhcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zZWxlY3RlZEl0ZW1dO1xuICAgICAgICBjb25zdCBzZWxlY3RlZFN1Z2dlc3Rpb24gPSB0aGlzLnN1Z2dlc3Rpb25zW25vcm1hbGl6ZWRJbmRleF07XG5cbiAgICAgICAgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbj8ucmVtb3ZlQ2xhc3MoXCJpcy1zZWxlY3RlZFwiKTtcbiAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uPy5hZGRDbGFzcyhcImlzLXNlbGVjdGVkXCIpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gbm9ybWFsaXplZEluZGV4O1xuXG4gICAgICAgIGlmIChzY3JvbGxJbnRvVmlldykge1xuICAgICAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uLnNjcm9sbEludG9WaWV3KGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRleHRJbnB1dFN1Z2dlc3Q8VD4gaW1wbGVtZW50cyBJU3VnZ2VzdE93bmVyPFQ+IHtcbiAgICBwcm90ZWN0ZWQgYXBwOiBBcHA7XG4gICAgcHJvdGVjdGVkIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBwb3BwZXI6IFBvcHBlckluc3RhbmNlO1xuICAgIHByaXZhdGUgc2NvcGU6IFNjb3BlO1xuICAgIHByaXZhdGUgc3VnZ2VzdEVsOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHN1Z2dlc3Q6IFN1Z2dlc3Q8VD47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaW5wdXRFbDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoKTtcblxuICAgICAgICB0aGlzLnN1Z2dlc3RFbCA9IGNyZWF0ZURpdihcInN1Z2dlc3Rpb24tY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBzdWdnZXN0aW9uID0gdGhpcy5zdWdnZXN0RWwuY3JlYXRlRGl2KFwic3VnZ2VzdGlvblwiKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0ID0gbmV3IFN1Z2dlc3QodGhpcywgc3VnZ2VzdGlvbiwgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFc2NhcGVcIiwgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHRoaXMub25JbnB1dENoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5vbklucHV0Q2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc3VnZ2VzdEVsLm9uKFxuICAgICAgICAgICAgXCJtb3VzZWRvd25cIixcbiAgICAgICAgICAgIFwiLnN1Z2dlc3Rpb24tY29udGFpbmVyXCIsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2VkKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbnB1dFN0ciA9IHRoaXMuaW5wdXRFbC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSB0aGlzLmdldFN1Z2dlc3Rpb25zKGlucHV0U3RyKTtcblxuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0LnNldFN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICB0aGlzLm9wZW4oKDxhbnk+dGhpcy5hcHApLmRvbS5hcHBDb250YWluZXJFbCwgdGhpcy5pbnB1dEVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4oY29udGFpbmVyOiBIVE1MRWxlbWVudCwgaW5wdXRFbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgKDxhbnk+dGhpcy5hcHApLmtleW1hcC5wdXNoU2NvcGUodGhpcy5zY29wZSk7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc3VnZ2VzdEVsKTtcbiAgICAgICAgdGhpcy5wb3BwZXIgPSBjcmVhdGVQb3BwZXIoaW5wdXRFbCwgdGhpcy5zdWdnZXN0RWwsIHtcbiAgICAgICAgICAgIHBsYWNlbWVudDogXCJib3R0b20tc3RhcnRcIixcbiAgICAgICAgICAgIG1vZGlmaWVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzYW1lV2lkdGhcIixcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZm46ICh7IHN0YXRlLCBpbnN0YW5jZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlOiBwb3NpdGlvbmluZyBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIHR3aWNlIC1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IHBhc3MgLSBwb3NpdGlvbmluZyBpdCBhY2NvcmRpbmcgdG8gdGhlIHdpZHRoIG9mIHRoZSBwb3BwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlY29uZCBwYXNzIC0gcG9zaXRpb24gaXQgd2l0aCB0aGUgd2lkdGggYm91bmQgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGVhcmx5IGV4aXQgdG8gYXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0V2lkdGggPSBgJHtzdGF0ZS5yZWN0cy5yZWZlcmVuY2Uud2lkdGh9cHhgO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnN0eWxlcy5wb3BwZXIud2lkdGggPT09IHRhcmdldFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuc3R5bGVzLnBvcHBlci53aWR0aCA9IHRhcmdldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiBcImJlZm9yZVdyaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzOiBbXCJjb21wdXRlU3R5bGVzXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgKDxhbnk+dGhpcy5hcHApLmtleW1hcC5wb3BTY29wZSh0aGlzLnNjb3BlKTtcblxuICAgICAgICB0aGlzLnN1Z2dlc3Quc2V0U3VnZ2VzdGlvbnMoW10pO1xuICAgICAgICBpZiAodGhpcy5wb3BwZXIpIHRoaXMucG9wcGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0RWwuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRbXTtcbiAgICBhYnN0cmFjdCByZW5kZXJTdWdnZXN0aW9uKGl0ZW06IFQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG4gICAgYWJzdHJhY3Qgc2VsZWN0U3VnZ2VzdGlvbihpdGVtOiBUKTogdm9pZDtcbn1cbiIsIi8vIENyZWRpdHMgZ28gdG8gTGlhbSdzIFBlcmlvZGljIE5vdGVzIFBsdWdpbjogaHR0cHM6Ly9naXRodWIuY29tL2xpYW1jYWluL29ic2lkaWFuLXBlcmlvZGljLW5vdGVzXG5cbmltcG9ydCB7IFRBYnN0cmFjdEZpbGUsIFRGb2xkZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRleHRJbnB1dFN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9zdWdnZXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJTdWdnZXN0IGV4dGVuZHMgVGV4dElucHV0U3VnZ2VzdDxURm9sZGVyPiB7XG4gICAgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRGb2xkZXJbXSB7XG4gICAgICAgIGNvbnN0IGFic3RyYWN0RmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRBbGxMb2FkZWRGaWxlcygpO1xuICAgICAgICBjb25zdCBmb2xkZXJzOiBURm9sZGVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJDYXNlSW5wdXRTdHIgPSBpbnB1dFN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGFic3RyYWN0RmlsZXMuZm9yRWFjaCgoZm9sZGVyOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlciAmJlxuICAgICAgICAgICAgICAgIGZvbGRlci5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJDYXNlSW5wdXRTdHIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb2xkZXJzLnB1c2goZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvbGRlcnM7XG4gICAgfVxuXG4gICAgcmVuZGVyU3VnZ2VzdGlvbihmaWxlOiBURm9sZGVyLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZWwuc2V0VGV4dChmaWxlLnBhdGgpO1xuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24oZmlsZTogVEZvbGRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgbm9ybWFsaXplUGF0aCxcbiAgICBUQWJzdHJhY3RGaWxlLFxuICAgIFRGaWxlLFxuICAgIFRGb2xkZXIsXG4gICAgVmF1bHQsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlX1JlZ0V4cChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZV90Zm9sZGVyKGFwcDogQXBwLCBmb2xkZXJfc3RyOiBzdHJpbmcpOiBURm9sZGVyIHtcbiAgICBmb2xkZXJfc3RyID0gbm9ybWFsaXplUGF0aChmb2xkZXJfc3RyKTtcblxuICAgIGNvbnN0IGZvbGRlciA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyX3N0cik7XG4gICAgaWYgKCFmb2xkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKGBGb2xkZXIgXCIke2ZvbGRlcl9zdHJ9XCIgZG9lc24ndCBleGlzdGApO1xuICAgIH1cbiAgICBpZiAoIShmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYCR7Zm9sZGVyX3N0cn0gaXMgYSBmaWxlLCBub3QgYSBmb2xkZXJgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZV90ZmlsZShhcHA6IEFwcCwgZmlsZV9zdHI6IHN0cmluZyk6IFRGaWxlIHtcbiAgICBmaWxlX3N0ciA9IG5vcm1hbGl6ZVBhdGgoZmlsZV9zdHIpO1xuXG4gICAgY29uc3QgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZV9zdHIpO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYEZpbGUgXCIke2ZpbGVfc3RyfVwiIGRvZXNuJ3QgZXhpc3RgKTtcbiAgICB9XG4gICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYCR7ZmlsZV9zdHJ9IGlzIGEgZm9sZGVyLCBub3QgYSBmaWxlYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgIGFwcDogQXBwLFxuICAgIGZvbGRlcl9zdHI6IHN0cmluZ1xuKTogQXJyYXk8VEZpbGU+IHtcbiAgICBjb25zdCBmb2xkZXIgPSByZXNvbHZlX3Rmb2xkZXIoYXBwLCBmb2xkZXJfc3RyKTtcblxuICAgIGNvbnN0IGZpbGVzOiBBcnJheTxURmlsZT4gPSBbXTtcbiAgICBWYXVsdC5yZWN1cnNlQ2hpbGRyZW4oZm9sZGVyLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmaWxlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhLmJhc2VuYW1lLmxvY2FsZUNvbXBhcmUoYi5iYXNlbmFtZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheW1vdmU8VD4oXG4gICAgYXJyOiBUW10sXG4gICAgZnJvbUluZGV4OiBudW1iZXIsXG4gICAgdG9JbmRleDogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAodG9JbmRleCA8IDAgfHwgdG9JbmRleCA9PT0gYXJyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGVsZW1lbnQgPSBhcnJbZnJvbUluZGV4XTtcbiAgICBhcnJbZnJvbUluZGV4XSA9IGFyclt0b0luZGV4XTtcbiAgICBhcnJbdG9JbmRleF0gPSBlbGVtZW50O1xufVxuIiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHsgQXBwLCBUQWJzdHJhY3RGaWxlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgVGV4dElucHV0U3VnZ2VzdCB9IGZyb20gXCJzdWdnZXN0ZXJzL3N1Z2dlc3RcIjtcbmltcG9ydCB7IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGVudW0gRmlsZVN1Z2dlc3RNb2RlIHtcbiAgICBUZW1wbGF0ZUZpbGVzLFxuICAgIFNjcmlwdEZpbGVzLFxufVxuXG5leHBvcnQgY2xhc3MgRmlsZVN1Z2dlc3QgZXh0ZW5kcyBUZXh0SW5wdXRTdWdnZXN0PFRGaWxlPiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBhcHA6IEFwcCxcbiAgICAgICAgcHVibGljIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4sXG4gICAgICAgIHByaXZhdGUgbW9kZTogRmlsZVN1Z2dlc3RNb2RlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgaW5wdXRFbCk7XG4gICAgfVxuXG4gICAgZ2V0X2ZvbGRlcihtb2RlOiBGaWxlU3VnZ2VzdE1vZGUpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRmlsZVN1Z2dlc3RNb2RlLlRlbXBsYXRlRmlsZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXI7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5TY3JpcHRGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9lcnJvcl9tc2cobW9kZTogRmlsZVN1Z2dlc3RNb2RlKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiBgVGVtcGxhdGVzIGZvbGRlciBkb2Vzbid0IGV4aXN0YDtcbiAgICAgICAgICAgIGNhc2UgRmlsZVN1Z2dlc3RNb2RlLlNjcmlwdEZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiBgVXNlciBTY3JpcHRzIGZvbGRlciBkb2Vzbid0IGV4aXN0YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKGlucHV0X3N0cjogc3RyaW5nKTogVEZpbGVbXSB7XG4gICAgICAgIGNvbnN0IGFsbF9maWxlcyA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAoKSA9PiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKHRoaXMuYXBwLCB0aGlzLmdldF9mb2xkZXIodGhpcy5tb2RlKSksXG4gICAgICAgICAgICB0aGlzLmdldF9lcnJvcl9tc2codGhpcy5tb2RlKVxuICAgICAgICApO1xuICAgICAgICBpZiAoIWFsbF9maWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJfaW5wdXRfc3RyID0gaW5wdXRfc3RyLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgYWxsX2ZpbGVzLmZvckVhY2goKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBmaWxlIGluc3RhbmNlb2YgVEZpbGUgJiZcbiAgICAgICAgICAgICAgICBmaWxlLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmXG4gICAgICAgICAgICAgICAgZmlsZS5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJfaW5wdXRfc3RyKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIHJlbmRlclN1Z2dlc3Rpb24oZmlsZTogVEZpbGUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5zZXRUZXh0KGZpbGUucGF0aCk7XG4gICAgfVxuXG4gICAgc2VsZWN0U3VnZ2VzdGlvbihmaWxlOiBURmlsZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEJ1dHRvbkNvbXBvbmVudCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEZvbGRlclN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9Gb2xkZXJTdWdnZXN0ZXJcIjtcbmltcG9ydCB7IEZpbGVTdWdnZXN0LCBGaWxlU3VnZ2VzdE1vZGUgfSBmcm9tIFwic3VnZ2VzdGVycy9GaWxlU3VnZ2VzdGVyXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IGFycmF5bW92ZSwgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSBcIkxvZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvbGRlclRlbXBsYXRlIHtcbiAgICBmb2xkZXI6IHN0cmluZztcbiAgICB0ZW1wbGF0ZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogU2V0dGluZ3MgPSB7XG4gICAgY29tbWFuZF90aW1lb3V0OiA1LFxuICAgIHRlbXBsYXRlc19mb2xkZXI6IFwiXCIsXG4gICAgdGVtcGxhdGVzX3BhaXJzOiBbW1wiXCIsIFwiXCJdXSxcbiAgICB0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb246IGZhbHNlLFxuICAgIGF1dG9fanVtcF90b19jdXJzb3I6IGZhbHNlLFxuICAgIGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM6IGZhbHNlLFxuICAgIHNoZWxsX3BhdGg6IFwiXCIsXG4gICAgdXNlcl9zY3JpcHRzX2ZvbGRlcjogXCJcIixcbiAgICBlbmFibGVfZm9sZGVyX3RlbXBsYXRlczogdHJ1ZSxcbiAgICBmb2xkZXJfdGVtcGxhdGVzOiBbeyBmb2xkZXI6IFwiXCIsIHRlbXBsYXRlOiBcIlwiIH1dLFxuICAgIHN5bnRheF9oaWdobGlnaHRpbmc6IHRydWUsXG4gICAgZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5czogW1wiXCJdLFxuICAgIHN0YXJ0dXBfdGVtcGxhdGVzOiBbXCJcIl0sXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcbiAgICBjb21tYW5kX3RpbWVvdXQ6IG51bWJlcjtcbiAgICB0ZW1wbGF0ZXNfZm9sZGVyOiBzdHJpbmc7XG4gICAgdGVtcGxhdGVzX3BhaXJzOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPjtcbiAgICB0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb246IGJvb2xlYW47XG4gICAgYXV0b19qdW1wX3RvX2N1cnNvcjogYm9vbGVhbjtcbiAgICBlbmFibGVfc3lzdGVtX2NvbW1hbmRzOiBib29sZWFuO1xuICAgIHNoZWxsX3BhdGg6IHN0cmluZztcbiAgICB1c2VyX3NjcmlwdHNfZm9sZGVyOiBzdHJpbmc7XG4gICAgZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXM6IGJvb2xlYW47XG4gICAgZm9sZGVyX3RlbXBsYXRlczogQXJyYXk8Rm9sZGVyVGVtcGxhdGU+O1xuICAgIHN5bnRheF9oaWdobGlnaHRpbmc6IGJvb2xlYW47XG4gICAgZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5czogQXJyYXk8c3RyaW5nPjtcbiAgICBzdGFydHVwX3RlbXBsYXRlczogQXJyYXk8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICB0aGlzLmFkZF9nZW5lcmFsX3NldHRpbmdfaGVhZGVyKCk7XG4gICAgICAgIHRoaXMuYWRkX3RlbXBsYXRlX2ZvbGRlcl9zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX2ludGVybmFsX2Z1bmN0aW9uc19zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX3N5bnRheF9oaWdobGlnaHRpbmdfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF9hdXRvX2p1bXBfdG9fY3Vyc29yKCk7XG4gICAgICAgIHRoaXMuYWRkX3RyaWdnZXJfb25fbmV3X2ZpbGVfY3JlYXRpb25fc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF90ZW1wbGF0ZXNfaG90a2V5c19zZXR0aW5nKCk7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYWRkX2ZvbGRlcl90ZW1wbGF0ZXNfc2V0dGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkX3N0YXJ0dXBfdGVtcGxhdGVzX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zY3JpcHRfZnVuY3Rpb25zX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zeXN0ZW1fY29tbWFuZF9mdW5jdGlvbnNfc2V0dGluZygpO1xuICAgIH1cblxuICAgIGFkZF9nZW5lcmFsX3NldHRpbmdfaGVhZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkdlbmVyYWwgU2V0dGluZ3NcIiB9KTtcbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVfZm9sZGVyX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlRlbXBsYXRlIGZvbGRlciBsb2NhdGlvblwiKVxuICAgICAgICAgICAgLnNldERlc2MoXCJGaWxlcyBpbiB0aGlzIGZvbGRlciB3aWxsIGJlIGF2YWlsYWJsZSBhcyB0ZW1wbGF0ZXMuXCIpXG4gICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICBjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyID0gbmV3X2ZvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF9pbnRlcm5hbF9mdW5jdGlvbnNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlciBwcm92aWRlcyBtdWx0aXBsZXMgcHJlZGVmaW5lZCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMgdGhhdCB5b3UgY2FuIHVzZS5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiQ2hlY2sgdGhlIFwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImFcIiwge1xuICAgICAgICAgICAgICAgIGhyZWY6IFwiaHR0cHM6Ly9zaWxlbnR2b2lkMTMuZ2l0aHViLmlvL1RlbXBsYXRlci9cIixcbiAgICAgICAgICAgICAgICB0ZXh0OiBcImRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXCIgdG8gZ2V0IGEgbGlzdCBvZiBhbGwgdGhlIGF2YWlsYWJsZSBpbnRlcm5hbCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJJbnRlcm5hbCBWYXJpYWJsZXMgYW5kIEZ1bmN0aW9uc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYyk7XG4gICAgfVxuXG4gICAgYWRkX3N5bnRheF9oaWdobGlnaHRpbmdfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkFkZHMgc3ludGF4IGhpZ2hsaWdodGluZyBmb3IgVGVtcGxhdGVyIGNvbW1hbmRzIGluIGVkaXQgbW9kZS5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlN5bnRheCBIaWdobGlnaHRpbmdcIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgoc3ludGF4X2hpZ2hsaWdodGluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3ludGF4X2hpZ2hsaWdodGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4X2hpZ2hsaWdodGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfYXV0b19qdW1wX3RvX2N1cnNvcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkF1dG9tYXRpY2FsbHkgdHJpZ2dlcnMgXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiY29kZVwiLCB7IHRleHQ6IFwidHAuZmlsZS5jdXJzb3JcIiB9KSxcbiAgICAgICAgICAgIFwiIGFmdGVyIGluc2VydGluZyBhIHRlbXBsYXRlLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJZb3UgY2FuIGFsc28gc2V0IGEgaG90a2V5IHRvIG1hbnVhbGx5IHRyaWdnZXIgXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiY29kZVwiLCB7IHRleHQ6IFwidHAuZmlsZS5jdXJzb3JcIiB9KSxcbiAgICAgICAgICAgIFwiLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQXV0b21hdGljIGp1bXAgdG8gY3Vyc29yXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvX2p1bXBfdG9fY3Vyc29yKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKGF1dG9fanVtcF90b19jdXJzb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9fanVtcF90b19jdXJzb3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9fanVtcF90b19jdXJzb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RyaWdnZXJfb25fbmV3X2ZpbGVfY3JlYXRpb25fc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlciB3aWxsIGxpc3RlbiBmb3IgdGhlIG5ldyBmaWxlIGNyZWF0aW9uIGV2ZW50LCBhbmQgcmVwbGFjZSBldmVyeSBjb21tYW5kIGl0IGZpbmRzIGluIHRoZSBuZXcgZmlsZSdzIGNvbnRlbnQuXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIlRoaXMgbWFrZXMgVGVtcGxhdGVyIGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zIGxpa2UgdGhlIERhaWx5IG5vdGUgY29yZSBwbHVnaW4sIENhbGVuZGFyIHBsdWdpbiwgUmV2aWV3IHBsdWdpbiwgTm90ZSByZWZhY3RvciBwbHVnaW4sIC4uLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJcIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiV2FybmluZzogXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFwiVGhpcyBjYW4gYmUgZGFuZ2Vyb3VzIGlmIHlvdSBjcmVhdGUgbmV3IGZpbGVzIHdpdGggdW5rbm93biAvIHVuc2FmZSBjb250ZW50IG9uIGNyZWF0aW9uLiBNYWtlIHN1cmUgdGhhdCBldmVyeSBuZXcgZmlsZSdzIGNvbnRlbnQgaXMgc2FmZSBvbiBjcmVhdGlvbi5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlRyaWdnZXIgVGVtcGxhdGVyIG9uIG5ldyBmaWxlIGNyZWF0aW9uXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RlbXBsYXRlc19ob3RrZXlzX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVGVtcGxhdGUgSG90a2V5c1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBIb3RrZXlzIGFsbG93cyB5b3UgdG8gYmluZCBhIHRlbXBsYXRlIHRvIGEgaG90a2V5LlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0RGVzYyhkZXNjKTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLmZvckVhY2goXG4gICAgICAgICAgICAodGVtcGxhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuaW5wdXRFbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld190ZW1wbGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5jb250YWlucyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRoaXMgdGVtcGxhdGUgaXMgYWxyZWFkeSBib3VuZCB0byBhIGhvdGtleVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb21tYW5kX2hhbmRsZXIuYWRkX3RlbXBsYXRlX2hvdGtleShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbaW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJhbnkta2V5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJDb25maWd1cmUgSG90a2V5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHdpdGggZnV0dXJlIFwib2ZmaWNpYWxcIiB3YXkgdG8gZG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLnNldHRpbmcub3BlblRhYkJ5SWQoXCJob3RrZXlzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuYXBwLnNldHRpbmcuYWN0aXZlVGFiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWIuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IFwiVGVtcGxhdGVyOiBJbnNlcnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiLnVwZGF0ZUhvdGtleVZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcInVwLWNoZXZyb24tZ2x5cGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIk1vdmUgdXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4IC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiZG93bi1jaGV2cm9uLWdseXBoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJNb3ZlIGRvd25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiY3Jvc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29tbWFuZF9oYW5kbGVyLnJlbW92ZV90ZW1wbGF0ZV9ob3RrZXkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpLmFkZEJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgIGNiLnNldEJ1dHRvblRleHQoXCJBZGQgbmV3IGhvdGtleSBmb3IgdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfZm9sZGVyX3RlbXBsYXRlc19zZXR0aW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkZvbGRlciBUZW1wbGF0ZXNcIiB9KTtcblxuICAgICAgICBjb25zdCBkZXNjSGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzY0hlYWRpbmcuYXBwZW5kKFxuICAgICAgICAgICAgXCJGb2xkZXIgVGVtcGxhdGVzIGFyZSB0cmlnZ2VyZWQgd2hlbiBhIG5ldyBcIixcbiAgICAgICAgICAgIGRlc2NIZWFkaW5nLmNyZWF0ZUVsKFwic3Ryb25nXCIsIHsgdGV4dDogXCJlbXB0eSBcIiB9KSxcbiAgICAgICAgICAgIFwiZmlsZSBpcyBjcmVhdGVkIGluIGEgZ2l2ZW4gZm9sZGVyLlwiLFxuICAgICAgICAgICAgZGVzY0hlYWRpbmcuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGVtcGxhdGVyIHdpbGwgZmlsbCB0aGUgZW1wdHkgZmlsZSB3aXRoIHRoZSBzcGVjaWZpZWQgdGVtcGxhdGUuXCIsXG4gICAgICAgICAgICBkZXNjSGVhZGluZy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGUgZGVlcGVzdCBtYXRjaCBpcyB1c2VkLiBBIGdsb2JhbCBkZWZhdWx0IHRlbXBsYXRlIHdvdWxkIGJlIGRlZmluZWQgb24gdGhlIHJvb3QgXCIsXG4gICAgICAgICAgICBkZXNjSGVhZGluZy5jcmVhdGVFbChcImNvZGVcIiwgeyB0ZXh0OiBcIi9cIiB9KSxcbiAgICAgICAgICAgIFwiLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0RGVzYyhkZXNjSGVhZGluZyk7XG5cbiAgICAgICAgY29uc3QgZGVzY1VzZU5ld0ZpbGVUZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzY1VzZU5ld0ZpbGVUZW1wbGF0ZS5hcHBlbmQoXG4gICAgICAgICAgICBcIldoZW4gZW5hYmxlZCBUZW1wbGF0ZXIgd2lsbCBtYWtlIHVzZSBvZiB0aGUgZm9sZGVyIHRlbXBsYXRlcyBkZWZpbmVkIGJlbG93LlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEZvbGRlciBUZW1wbGF0ZXNcIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2NVc2VOZXdGaWxlVGVtcGxhdGUpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHVzZV9uZXdfZmlsZV90ZW1wbGF0ZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VfbmV3X2ZpbGVfdGVtcGxhdGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfZm9sZGVyX3RlbXBsYXRlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQWRkIE5ld1wiKVxuICAgICAgICAgICAgLnNldERlc2MoXCJBZGQgbmV3IGZvbGRlciB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJBZGQgYWRkaXRpb25hbCBmb2xkZXIgdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCIrXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlcy5mb3JFYWNoKFxuICAgICAgICAgICAgKGZvbGRlcl90ZW1wbGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAgICAgLmFkZFNlYXJjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRm9sZGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKGZvbGRlcl90ZW1wbGF0ZS5mb2xkZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19mb2xkZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZSkgPT4gZS5mb2xkZXIgPT0gbmV3X2ZvbGRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhpcyBmb2xkZXIgYWxyZWFkeSBoYXMgYSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggaXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5mb2xkZXIgPSBuZXdfZm9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuaW5wdXRFbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiVGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoZm9sZGVyX3RlbXBsYXRlLnRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLnRlbXBsYXRlID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJ1cC1jaGV2cm9uLWdseXBoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJNb3ZlIHVwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheW1vdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAtIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImRvd24tY2hldnJvbi1nbHlwaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiTW92ZSBkb3duXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheW1vdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImNyb3NzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJEZWxldGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFkZF9zdGFydHVwX3RlbXBsYXRlc19zZXR0aW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIlN0YXJ0dXAgVGVtcGxhdGVzXCIgfSk7XG5cbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlN0YXJ0dXAgVGVtcGxhdGVzIGFyZSB0ZW1wbGF0ZXMgdGhhdCB3aWxsIGdldCBleGVjdXRlZCBvbmNlIHdoZW4gVGVtcGxhdGVyIHN0YXJ0cy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGhlc2UgdGVtcGxhdGVzIHdvbid0IG91dHB1dCBhbnl0aGluZy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGhpcyBjYW4gYmUgdXNlZnVsIHRvIHNldCB1cCB0ZW1wbGF0ZXMgYWRkaW5nIGhvb2tzIHRvIG9ic2lkaWFuIGV2ZW50cyBmb3IgZXhhbXBsZS5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpLnNldERlc2MoZGVzYyk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMuZm9yRWFjaCgodGVtcGxhdGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmlucHV0RWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld190ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzLmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhpcyBzdGFydHVwIHRlbXBsYXRlIGFscmVhZHkgZXhpc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzW2luZGV4XSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld190ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjYi5jb250YWluZXJFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9zZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJEZWxldGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcy5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzLmluZm9FbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuYWRkQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgY2Iuc2V0QnV0dG9uVGV4dChcIkFkZCBuZXcgc3RhcnR1cCB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdXNlcl9zY3JpcHRfZnVuY3Rpb25zX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVXNlciBTY3JpcHQgRnVuY3Rpb25zXCIgfSk7XG5cbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgXCJBbGwgSmF2YVNjcmlwdCBmaWxlcyBpbiB0aGlzIGZvbGRlciB3aWxsIGJlIGxvYWRlZCBhcyBDb21tb25KUyBtb2R1bGVzLCB0byBpbXBvcnQgY3VzdG9tIHVzZXIgZnVuY3Rpb25zLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGUgZm9sZGVyIG5lZWRzIHRvIGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgdmF1bHQuXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIkNoZWNrIHRoZSBcIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICBocmVmOiBcImh0dHBzOi8vc2lsZW50dm9pZDEzLmdpdGh1Yi5pby9UZW1wbGF0ZXIvXCIsXG4gICAgICAgICAgICAgICAgdGV4dDogXCJkb2N1bWVudGF0aW9uXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFwiIGZvciBtb3JlIGluZm9ybWF0aW9ucy5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlNjcmlwdCBmaWxlcyBmb2xkZXIgbG9jYXRpb25cIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICBjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyID0gbmV3X2ZvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxldCBuYW1lOiBzdHJpbmc7XG4gICAgICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcikge1xuICAgICAgICAgICAgbmFtZSA9IFwiTm8gVXNlciBTY3JpcHRzIGZvbGRlciBzZXRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZXJyb3JXcmFwcGVyU3luYyhcbiAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgYFVzZXIgU2NyaXB0cyBmb2xkZXIgZG9lc24ndCBleGlzdGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBcIk5vIFVzZXIgU2NyaXB0cyBkZXRlY3RlZFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS5leHRlbnNpb24gPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJsaVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGB0cC51c2VyLiR7ZmlsZS5iYXNlbmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5hbWUgPSBgRGV0ZWN0ZWQgJHtjb3VudH0gVXNlciBTY3JpcHQocylgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKG5hbWUpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChleHRyYSkgPT4ge1xuICAgICAgICAgICAgICAgIGV4dHJhXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwic3luY1wiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIlJlZnJlc2hcIilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3VzZXJfc3lzdGVtX2NvbW1hbmRfZnVuY3Rpb25zX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIGxldCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjLmFwcGVuZChcbiAgICAgICAgICAgIFwiQWxsb3dzIHlvdSB0byBjcmVhdGUgdXNlciBmdW5jdGlvbnMgbGlua2VkIHRvIHN5c3RlbSBjb21tYW5kcy5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiXCIsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIldhcm5pbmc6IFwiLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBcIkl0IGNhbiBiZSBkYW5nZXJvdXMgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgc3lzdGVtIGNvbW1hbmRzIGZyb20gdW50cnVzdGVkIHNvdXJjZXMuIE9ubHkgcnVuIHN5c3RlbSBjb21tYW5kcyB0aGF0IHlvdSB1bmRlcnN0YW5kLCBmcm9tIHRydXN0ZWQgc291cmNlcy5cIlxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7XG4gICAgICAgICAgICB0ZXh0OiBcIlVzZXIgU3lzdGVtIENvbW1hbmQgRnVuY3Rpb25zXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkVuYWJsZSBVc2VyIFN5c3RlbSBDb21tYW5kIEZ1bmN0aW9uc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYylcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChlbmFibGVfc3lzdGVtX2NvbW1hbmRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfc3lzdGVtX2NvbW1hbmRzID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVfc3lzdGVtX2NvbW1hbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpIHtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoXCJUaW1lb3V0XCIpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoXCJNYXhpbXVtIHRpbWVvdXQgaW4gc2Vjb25kcyBmb3IgYSBzeXN0ZW0gY29tbWFuZC5cIilcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKFwiVGltZW91dFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld192YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld190aW1lb3V0ID0gTnVtYmVyKG5ld192YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKG5ld190aW1lb3V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaW1lb3V0IG11c3QgYmUgYSBudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCA9IG5ld190aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgXCJGdWxsIHBhdGggdG8gdGhlIHNoZWxsIGJpbmFyeSB0byBleGVjdXRlIHRoZSBjb21tYW5kIHdpdGguXCIsXG4gICAgICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgICAgIFwiVGhpcyBzZXR0aW5nIGlzIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIHN5c3RlbSdzIGRlZmF1bHQgc2hlbGwgaWYgbm90IHNwZWNpZmllZC5cIixcbiAgICAgICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICAgICAgXCJZb3UgY2FuIHVzZSBmb3J3YXJkIHNsYXNoZXMgKCcvJykgYXMgcGF0aCBzZXBhcmF0b3JzIG9uIGFsbCBwbGF0Zm9ybXMgaWYgaW4gZG91YnQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKFwiU2hlbGwgYmluYXJ5IGxvY2F0aW9uXCIpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoZGVzYylcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogL2Jpbi9iYXNoLCAuLi5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChzaGVsbF9wYXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGxfcGF0aCA9IHNoZWxsX3BhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5mb3JFYWNoKCh0ZW1wbGF0ZV9wYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDRcIiwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlVzZXIgRnVuY3Rpb24gbsKwXCIgKyBpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRpdGxlLmFkZENsYXNzKFwidGVtcGxhdGVyX3RpdGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoZXh0cmEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiRGVsZXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9wYWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSB0ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRnVuY3Rpb24gbmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZV9wYWlyWzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlX3BhaXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1bMF0gPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuaW5wdXRFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl90ZW1wbGF0ZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IHRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJTeXN0ZW0gQ29tbWFuZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZV9wYWlyWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X2NtZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9wYWlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWzFdID0gbmV3X2NtZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0LmlucHV0RWwuc2V0QXR0cihcInJvd3NcIiwgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfY21kXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwubGFzdENoaWxkKTtcblxuICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBkaXYgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiZGl2XCIpO1xuICAgICAgICAgICAgZGl2LmFkZENsYXNzKFwidGVtcGxhdGVyX2RpdjJcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmcgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKS5hZGRCdXR0b24oXG4gICAgICAgICAgICAgICAgKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KFwiQWRkIE5ldyBVc2VyIEZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMucHVzaChbXCJcIiwgXCJcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2V0dGluZy5pbmZvRWwucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lckVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEZ1enp5U3VnZ2VzdE1vZGFsLCBURmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tIFwiTG9nXCI7XG5cbmV4cG9ydCBlbnVtIE9wZW5Nb2RlIHtcbiAgICBJbnNlcnRUZW1wbGF0ZSxcbiAgICBDcmVhdGVOb3RlVGVtcGxhdGUsXG59XG5cbmV4cG9ydCBjbGFzcyBGdXp6eVN1Z2dlc3RlciBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFRGaWxlPiB7XG4gICAgcHVibGljIGFwcDogQXBwO1xuICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW47XG4gICAgcHJpdmF0ZSBvcGVuX21vZGU6IE9wZW5Nb2RlO1xuICAgIHByaXZhdGUgY3JlYXRpb25fZm9sZGVyOiBURm9sZGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcihcIlR5cGUgbmFtZSBvZiBhIHRlbXBsYXRlLi4uXCIpO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IFRGaWxlW10ge1xuICAgICAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlclxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBgQ291bGRuJ3QgcmV0cmlldmUgdGVtcGxhdGUgZmlsZXMgZnJvbSB0ZW1wbGF0ZXMgZm9sZGVyICR7dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcn1gXG4gICAgICAgICk7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5iYXNlbmFtZTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVEZpbGUpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0aW9uX2ZvbGRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRfdGVtcGxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3Blbl9tb2RlID0gT3Blbk1vZGUuSW5zZXJ0VGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShmb2xkZXI/OiBURm9sZGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRpb25fZm9sZGVyID0gZm9sZGVyO1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgPSBcIkVycm9yX01vYmlsZVVuc3VwcG9ydGVkVGVtcGxhdGVcIjtcbmV4cG9ydCBjb25zdCBJQ09OX0RBVEEgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MS4xMzI4IDI4LjdcIj48cGF0aCBkPVwiTTAgMTUuMTQgMCAxMC4xNSAxOC42NyAxLjUxIDE4LjY3IDYuMDMgNC43MiAxMi4zMyA0LjcyIDEyLjc2IDE4LjY3IDE5LjIyIDE4LjY3IDIzLjc0IDAgMTUuMTRaTTMzLjY5MjggMS44NEMzMy42OTI4IDEuODQgMzMuOTc2MSAyLjE0NjcgMzQuNTQyOCAyLjc2QzM1LjEwOTQgMy4zOCAzNS4zOTI4IDQuNTYgMzUuMzkyOCA2LjNDMzUuMzkyOCA4LjA0NjYgMzQuODE5NSA5LjU0IDMzLjY3MjggMTAuNzhDMzIuNTI2MSAxMi4wMiAzMS4wOTk1IDEyLjY0IDI5LjM5MjggMTIuNjRDMjcuNjg2MiAxMi42NCAyNi4yNjYxIDEyLjAyNjcgMjUuMTMyOCAxMC44QzIzLjk5MjggOS41NzMzIDIzLjQyMjggOC4wODY3IDIzLjQyMjggNi4zNEMyMy40MjI4IDQuNiAyMy45OTk1IDMuMTA2NiAyNS4xNTI4IDEuODZDMjYuMjk5NC42MiAyNy43MjYxIDAgMjkuNDMyOCAwQzMxLjEzOTUgMCAzMi41NTk0LjYxMzMgMzMuNjkyOCAxLjg0TTQ5LjgyMjguNjcgMjkuNTMyOCAyOC4zOCAyNC40MTI4IDI4LjM4IDQ0LjcxMjguNjcgNDkuODIyOC42N00zMS4wMzI4IDguMzhDMzEuMDMyOCA4LjM4IDMxLjEzOTUgOC4yNDY3IDMxLjM1MjggNy45OEMzMS41NjYyIDcuNzA2NyAzMS42NzI4IDcuMTczMyAzMS42NzI4IDYuMzhDMzEuNjcyOCA1LjU4NjcgMzEuNDQ2MSA0LjkyIDMwLjk5MjggNC4zOEMzMC41NDYxIDMuODQgMjkuOTk5NSAzLjU3IDI5LjM1MjggMy41N0MyOC43MDYxIDMuNTcgMjguMTY5NSAzLjg0IDI3Ljc0MjggNC4zOEMyNy4zMjI4IDQuOTIgMjcuMTEyOCA1LjU4NjcgMjcuMTEyOCA2LjM4QzI3LjExMjggNy4xNzMzIDI3LjMzNjEgNy44NCAyNy43ODI4IDguMzhDMjguMjM2MSA4LjkyNjcgMjguNzg2MSA5LjIgMjkuNDMyOCA5LjJDMzAuMDc5NSA5LjIgMzAuNjEyOCA4LjkyNjcgMzEuMDMyOCA4LjM4TTQ5LjQzMjggMTcuOUM0OS40MzI4IDE3LjkgNDkuNzE2MSAxOC4yMDY3IDUwLjI4MjggMTguODJDNTAuODQ5NSAxOS40MzMzIDUxLjEzMjggMjAuNjEzMyA1MS4xMzI4IDIyLjM2QzUxLjEzMjggMjQuMSA1MC41NTk0IDI1LjU5IDQ5LjQxMjggMjYuODNDNDguMjU5NSAyOC4wNzY2IDQ2LjgyOTUgMjguNyA0NS4xMjI4IDI4LjdDNDMuNDIyOCAyOC43IDQyLjAwMjggMjguMDgzMyA0MC44NjI4IDI2Ljg1QzM5LjcyOTUgMjUuNjIzMyAzOS4xNjI4IDI0LjEzNjYgMzkuMTYyOCAyMi4zOUMzOS4xNjI4IDIwLjY1IDM5LjczNjEgMTkuMTYgNDAuODgyOCAxNy45MkM0Mi4wMzYxIDE2LjY3MzMgNDMuNDYyOCAxNi4wNSA0NS4xNjI4IDE2LjA1QzQ2Ljg2OTQgMTYuMDUgNDguMjkyOCAxNi42NjY3IDQ5LjQzMjggMTcuOU00Ni44NTI4IDI0LjUyQzQ2Ljg1MjggMjQuNTIgNDYuOTU5NSAyNC4zODMzIDQ3LjE3MjggMjQuMTFDNDcuMzc5NSAyMy44MzY3IDQ3LjQ4MjggMjMuMzAzMyA0Ny40ODI4IDIyLjUxQzQ3LjQ4MjggMjEuNzE2NyA0Ny4yNTk1IDIxLjA1IDQ2LjgxMjggMjAuNTFDNDYuMzY2MSAxOS45NyA0NS44MTYyIDE5LjcgNDUuMTYyOCAxOS43QzQ0LjUxNjEgMTkuNyA0My45ODI4IDE5Ljk3IDQzLjU2MjggMjAuNTFDNDMuMTQyOCAyMS4wNSA0Mi45MzI4IDIxLjcxNjcgNDIuOTMyOCAyMi41MUM0Mi45MzI4IDIzLjMwMzMgNDMuMTU2MSAyMy45NzMzIDQzLjYwMjggMjQuNTJDNDQuMDQ5NCAyNS4wNiA0NC41OTYxIDI1LjMzIDQ1LjI0MjggMjUuMzNDNDUuODg5NSAyNS4zMyA0Ni40MjYxIDI1LjA2IDQ2Ljg1MjggMjQuNTJaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz48L3N2Zz5gO1xuIiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEludGVybmFsTW9kdWxlIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwdWJsaWMgYWJzdHJhY3QgbmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBzdGF0aWNfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCB1bmtub3duPiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgZHluYW1pY19mdW5jdGlvbnM6IE1hcDxzdHJpbmcsIHVua25vd24+ID0gbmV3IE1hcCgpO1xuICAgIHByb3RlY3RlZCBjb25maWc6IFJ1bm5pbmdDb25maWc7XG4gICAgcHJvdGVjdGVkIHN0YXRpY19vYmplY3Q6IHsgW3g6IHN0cmluZ106IHVua25vd24gfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IEFwcCwgcHJvdGVjdGVkIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7fVxuXG4gICAgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG4gICAgYWJzdHJhY3QgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk7XG4gICAgICAgIHRoaXMuc3RhdGljX29iamVjdCA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLnN0YXRpY19mdW5jdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgbmV3X2NvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXdfY29uZmlnO1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRpY19vYmplY3QsXG4gICAgICAgICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXModGhpcy5keW5hbWljX2Z1bmN0aW9ucyksXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZURhdGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImRhdGVcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwibm93XCIsIHRoaXMuZ2VuZXJhdGVfbm93KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwidG9tb3Jyb3dcIiwgdGhpcy5nZW5lcmF0ZV90b21vcnJvdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcIndlZWtkYXlcIiwgdGhpcy5nZW5lcmF0ZV93ZWVrZGF5KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwieWVzdGVyZGF5XCIsIHRoaXMuZ2VuZXJhdGVfeWVzdGVyZGF5KCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBnZW5lcmF0ZV9ub3coKTogKFxuICAgICAgICBmb3JtYXQ/OiBzdHJpbmcsXG4gICAgICAgIG9mZnNldD86IG51bWJlciB8IHN0cmluZyxcbiAgICAgICAgcmVmZXJlbmNlPzogc3RyaW5nLFxuICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCIsXG4gICAgICAgICAgICBvZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSAmJlxuICAgICAgICAgICAgICAgICF3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkuaXNWYWxpZCgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCByZWZlcmVuY2UgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlX2Zvcm1hdCdcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gd2luZG93Lm1vbWVudC5kdXJhdGlvbihvZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB3aW5kb3cubW9tZW50LmR1cmF0aW9uKG9mZnNldCwgXCJkYXlzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpXG4gICAgICAgICAgICAgICAgLmFkZChkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdG9tb3Jyb3coKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoMSwgXCJkYXlzXCIpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3dlZWtkYXkoKTogKFxuICAgICAgICBmb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgd2Vla2RheTogbnVtYmVyLFxuICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICApID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIixcbiAgICAgICAgICAgIHdlZWtkYXk6IG51bWJlcixcbiAgICAgICAgICAgIHJlZmVyZW5jZT86IHN0cmluZyxcbiAgICAgICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlICYmXG4gICAgICAgICAgICAgICAgIXdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5pc1ZhbGlkKClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIHJlZmVyZW5jZSBkYXRlIGZvcm1hdCwgdHJ5IHNwZWNpZnlpbmcgb25lIHdpdGggdGhlIGFyZ3VtZW50ICdyZWZlcmVuY2VfZm9ybWF0J1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3dcbiAgICAgICAgICAgICAgICAubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdClcbiAgICAgICAgICAgICAgICAud2Vla2RheSh3ZWVrZGF5KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoLTEsIFwiZGF5c1wiKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5pbXBvcnQge1xuICAgIEZpbGVTeXN0ZW1BZGFwdGVyLFxuICAgIGdldEFsbFRhZ3MsXG4gICAgTWFya2Rvd25WaWV3LFxuICAgIG5vcm1hbGl6ZVBhdGgsXG4gICAgcGFyc2VMaW5rdGV4dCxcbiAgICBQbGF0Zm9ybSxcbiAgICByZXNvbHZlU3VicGF0aCxcbiAgICBURmlsZSxcbiAgICBURm9sZGVyLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjb25zdCBERVBUSF9MSU1JVCA9IDEwO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGaWxlIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJmaWxlXCI7XG4gICAgcHJpdmF0ZSBpbmNsdWRlX2RlcHRoID0gMDtcbiAgICBwcml2YXRlIGNyZWF0ZV9uZXdfZGVwdGggPSAwO1xuICAgIHByaXZhdGUgbGlua3BhdGhfcmVnZXggPSBuZXcgUmVnRXhwKFwiXlxcXFxbXFxcXFsoLiopXFxcXF1cXFxcXSRcIik7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwiY3JlYXRpb25fZGF0ZVwiLFxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZV9jcmVhdGlvbl9kYXRlKClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImNyZWF0ZV9uZXdcIiwgdGhpcy5nZW5lcmF0ZV9jcmVhdGVfbmV3KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY3Vyc29yXCIsIHRoaXMuZ2VuZXJhdGVfY3Vyc29yKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFxuICAgICAgICAgICAgXCJjdXJzb3JfYXBwZW5kXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2N1cnNvcl9hcHBlbmQoKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZXhpc3RzXCIsIHRoaXMuZ2VuZXJhdGVfZXhpc3RzKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZmluZF90ZmlsZVwiLCB0aGlzLmdlbmVyYXRlX2ZpbmRfdGZpbGUoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJmb2xkZXJcIiwgdGhpcy5nZW5lcmF0ZV9mb2xkZXIoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJpbmNsdWRlXCIsIHRoaXMuZ2VuZXJhdGVfaW5jbHVkZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwibGFzdF9tb2RpZmllZF9kYXRlXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJtb3ZlXCIsIHRoaXMuZ2VuZXJhdGVfbW92ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInBhdGhcIiwgdGhpcy5nZW5lcmF0ZV9wYXRoKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicmVuYW1lXCIsIHRoaXMuZ2VuZXJhdGVfcmVuYW1lKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwic2VsZWN0aW9uXCIsIHRoaXMuZ2VuZXJhdGVfc2VsZWN0aW9uKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJjb250ZW50XCIsIGF3YWl0IHRoaXMuZ2VuZXJhdGVfY29udGVudCgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0YWdzXCIsIHRoaXMuZ2VuZXJhdGVfdGFncygpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0aXRsZVwiLCB0aGlzLmdlbmVyYXRlX3RpdGxlKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX2NvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0ZV9uZXcoKTogKFxuICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wZW5fbmV3OiBib29sZWFuLFxuICAgICAgICBmb2xkZXI/OiBURm9sZGVyXG4gICAgKSA9PiBQcm9taXNlPFRGaWxlPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoXG4gICAgICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgb3Blbl9uZXcgPSBmYWxzZSxcbiAgICAgICAgICAgIGZvbGRlcj86IFRGb2xkZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZV9uZXdfZGVwdGggPiBERVBUSF9MSU1JVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlX25ld19kZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIlJlYWNoZWQgY3JlYXRlX25ldyBkZXB0aCBsaW1pdCAobWF4ID0gMTApXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdfZmlsZSA9XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb3Blbl9uZXdcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ld19maWxlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1xuICAgICAgICAgICAgICAgIC5tb21lbnQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuc3RhdC5jdGltZSlcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yKCk6IChvcmRlcj86IG51bWJlcikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChvcmRlcj86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy8gSGFjayB0byBwcmV2ZW50IGVtcHR5IG91dHB1dFxuICAgICAgICAgICAgcmV0dXJuIGA8JSB0cC5maWxlLmN1cnNvcigke29yZGVyID8/IFwiXCJ9KSAlPmA7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yX2FwcGVuZCgpOiAoY29udGVudDogc3RyaW5nKSA9PiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIChjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0byBjdXJzb3IuXCJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgICAgICAgICBkb2MucmVwbGFjZVNlbGVjdGlvbihjb250ZW50KTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2V4aXN0cygpOiAoZmlsZW5hbWU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMsIG9ubHkgaGVyZSB0byBzdXBwb3J0IHRoZSBvbGQgd2F5XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdGhpcy5saW5rcGF0aF9yZWdleC5leGVjKGZpbGVuYW1lKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgIT0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9maW5kX3RmaWxlKCk6IChmaWxlbmFtZTogc3RyaW5nKSA9PiBURmlsZSB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5vcm1hbGl6ZVBhdGgoZmlsZW5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QocGF0aCwgXCJcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCk6IChyZWxhdGl2ZT86IGJvb2xlYW4pID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmUgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvbGRlciA9IHBhcmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9sZGVyO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKTogKGluY2x1ZGVfbGluazogc3RyaW5nIHwgVEZpbGUpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoaW5jbHVkZV9saW5rOiBzdHJpbmcgfCBURmlsZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG11dGV4IGZvciB0aGlzLCB0aGlzIG1heSBjdXJyZW50bHkgbGVhZCB0byBhIHJhY2UgY29uZGl0aW9uLlxuICAgICAgICAgICAgLy8gV2hpbGUgbm90IHZlcnkgaW1wYWN0ZnVsLCB0aGF0IGNvdWxkIHN0aWxsIGJlIGFubm95aW5nLlxuICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlX2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiUmVhY2hlZCBpbmNsdXNpb24gZGVwdGggbGltaXQgKG1heCA9IDEwKVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluY19maWxlX2NvbnRlbnQ6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVfbGluayBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoaW5jbHVkZV9saW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgICAgIGlmICgobWF0Y2ggPSB0aGlzLmxpbmtwYXRoX3JlZ2V4LmV4ZWMoaW5jbHVkZV9saW5rKSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBmaWxlIGZvcm1hdCwgcHJvdmlkZSBhbiBvYnNpZGlhbiBsaW5rIGJldHdlZW4gcXVvdGVzLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGF0aCwgc3VicGF0aCB9ID0gcGFyc2VMaW5rdGV4dChtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmNfZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICghaW5jX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBGaWxlICR7aW5jbHVkZV9saW5rfSBkb2Vzbid0IGV4aXN0YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3VicGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGluY19maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlU3VicGF0aChjYWNoZSwgc3VicGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGluY19maWxlX2NvbnRlbnQuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQ/Lm9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkX2NvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIucGFyc2VyLnBhcnNlX2NvbW1hbmRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2NvbnRlbnQ7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9sYXN0X21vZGlmaWVkX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudCh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5zdGF0Lm10aW1lKVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9tb3ZlKCk6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7cGF0aH0uJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5leHRlbnNpb259YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUoXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUsXG4gICAgICAgICAgICAgICAgbmV3X3BhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9wYXRoKCk6IChyZWxhdGl2ZTogYm9vbGVhbikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChyZWxhdGl2ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZUFwcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhdWx0X3BhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG5cbiAgICAgICAgICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRofWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCk6IChuZXdfdGl0bGU6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChuZXdfdGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKG5ld190aXRsZS5tYXRjaCgvW1xcXFwvOl0rL2cpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkZpbGUgbmFtZSBjYW5ub3QgY29udGFpbiBhbnkgb2YgdGhlc2UgY2hhcmFjdGVyczogXFxcXCAvIDpcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50LnBhdGh9LyR7bmV3X3RpdGxlfS4ke3RoaXMuY29uZmlnLnRhcmdldF9maWxlLmV4dGVuc2lvbn1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucmVuYW1lRmlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZSxcbiAgICAgICAgICAgICAgICBuZXdfcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpOiAoKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCByZWFkIHNlbGVjdGlvbi5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVHVybiB0aGlzIGludG8gYSBmdW5jdGlvblxuICAgIGdlbmVyYXRlX3RhZ3MoKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGdldEFsbFRhZ3MoY2FjaGUpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFR1cm4gdGhpcyBpbnRvIGEgZnVuY3Rpb25cbiAgICBnZW5lcmF0ZV90aXRsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuYmFzZW5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVdlYiBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJ3ZWJcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZGFpbHlfcXVvdGVcIiwgdGhpcy5nZW5lcmF0ZV9kYWlseV9xdW90ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwicmFuZG9tX3BpY3R1cmVcIixcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVfcmFuZG9tX3BpY3R1cmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBnZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcIkVycm9yIHBlcmZvcm1pbmcgR0VUIHJlcXVlc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2RhaWx5X3F1b3RlKCk6ICgpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vYXBpLnF1b3RhYmxlLmlvL3JhbmRvbVwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0ganNvbi5hdXRob3I7XG4gICAgICAgICAgICBjb25zdCBxdW90ZSA9IGpzb24uY29udGVudDtcbiAgICAgICAgICAgIGNvbnN0IG5ld19jb250ZW50ID0gYD4gJHtxdW90ZX1cXG4+IOKAlCA8Y2l0ZT4ke2F1dGhvcn08L2NpdGU+YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ld19jb250ZW50O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3JhbmRvbV9waWN0dXJlKCk6IChcbiAgICAgICAgc2l6ZTogc3RyaW5nLFxuICAgICAgICBxdWVyeT86IHN0cmluZ1xuICAgICkgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChzaXplOiBzdHJpbmcsIHF1ZXJ5Pzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly9zb3VyY2UudW5zcGxhc2guY29tL3JhbmRvbS8ke3NpemUgPz8gXCJcIn0/JHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgPz8gXCJcIlxuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcmVzcG9uc2UudXJsO1xuICAgICAgICAgICAgcmV0dXJuIGAhW3RwLndlYi5yYW5kb21fcGljdHVyZV0oJHt1cmx9KWA7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImZyb250bWF0dGVyXCI7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBjcmVhdGVfZHluYW1pY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmR5bmFtaWNfZnVuY3Rpb25zID0gbmV3IE1hcChcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGNhY2hlPy5mcm9udG1hdHRlciB8fCB7fSlcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgcHJpdmF0ZSBwcm9tcHRFbDogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgcmVqZWN0OiAocmVhc29uPzogVGVtcGxhdGVyRXJyb3IpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSBzdWJtaXR0ZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcHA6IEFwcCxcbiAgICAgICAgcHJpdmF0ZSBwcm9tcHRfdGV4dDogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIGRlZmF1bHRfdmFsdWU6IHN0cmluZ1xuICAgICkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIG9uT3BlbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aXRsZUVsLnNldFRleHQodGhpcy5wcm9tcHRfdGV4dCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybSgpO1xuICAgIH1cblxuICAgIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgICAgIGlmICghdGhpcy5zdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0KG5ldyBUZW1wbGF0ZXJFcnJvcihcIkNhbmNlbGxlZCBwcm9tcHRcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlRm9ybSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGl2ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KCk7XG4gICAgICAgIGRpdi5hZGRDbGFzcyhcInRlbXBsYXRlci1wcm9tcHQtZGl2XCIpO1xuXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkaXYuY3JlYXRlRWwoXCJmb3JtXCIpO1xuICAgICAgICBmb3JtLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1mb3JtXCIpO1xuICAgICAgICBmb3JtLnR5cGUgPSBcInN1Ym1pdFwiO1xuICAgICAgICBmb3JtLm9uc3VibWl0ID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUodGhpcy5wcm9tcHRFbC52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wcm9tcHRFbCA9IGZvcm0uY3JlYXRlRWwoXCJpbnB1dFwiKTtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIHRoaXMucHJvbXB0RWwucGxhY2Vob2xkZXIgPSBcIlR5cGUgdGV4dCBoZXJlLi4uXCI7XG4gICAgICAgIHRoaXMucHJvbXB0RWwudmFsdWUgPSB0aGlzLmRlZmF1bHRfdmFsdWUgPz8gXCJcIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC5hZGRDbGFzcyhcInRlbXBsYXRlci1wcm9tcHQtaW5wdXRcIik7XG4gICAgICAgIHRoaXMucHJvbXB0RWwuc2VsZWN0KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlbkFuZEdldFZhbHVlKFxuICAgICAgICByZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCxcbiAgICAgICAgcmVqZWN0OiAocmVhc29uPzogVGVtcGxhdGVyRXJyb3IpID0+IHZvaWRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBBcHAsIEZ1enp5TWF0Y2gsIEZ1enp5U3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBjbGFzcyBTdWdnZXN0ZXJNb2RhbDxUPiBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFQ+IHtcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgc3VibWl0dGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXBwOiBBcHAsXG4gICAgICAgIHByaXZhdGUgdGV4dF9pdGVtczogc3RyaW5nW10gfCAoKGl0ZW06IFQpID0+IHN0cmluZyksXG4gICAgICAgIHByaXZhdGUgaXRlbXM6IFRbXSxcbiAgICAgICAgcGxhY2Vob2xkZXI6IHN0cmluZ1xuICAgICkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtcygpOiBUW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICB9XG5cbiAgICBvbkNsb3NlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc3VibWl0dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlamVjdChuZXcgVGVtcGxhdGVyRXJyb3IoXCJDYW5jZWxsZWQgcHJvbXB0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24oXG4gICAgICAgIHZhbHVlOiBGdXp6eU1hdGNoPFQ+LFxuICAgICAgICBldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50XG4gICAgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLm9uQ2hvb3NlU3VnZ2VzdGlvbih2YWx1ZSwgZXZ0KTtcbiAgICB9XG5cbiAgICBnZXRJdGVtVGV4dChpdGVtOiBUKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dF9pdGVtcyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0X2l0ZW1zKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnRleHRfaXRlbXNbdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pXSB8fCBcIlVuZGVmaW5lZCBUZXh0IEl0ZW1cIlxuICAgICAgICApO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBUKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzb2x2ZShpdGVtKTtcbiAgICB9XG5cbiAgICBhc3luYyBvcGVuQW5kR2V0VmFsdWUoXG4gICAgICAgIHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZCxcbiAgICAgICAgcmVqZWN0OiAocmVhc29uPzogVGVtcGxhdGVyRXJyb3IpID0+IHZvaWRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgUHJvbXB0TW9kYWwgfSBmcm9tIFwiLi9Qcm9tcHRNb2RhbFwiO1xuaW1wb3J0IHsgU3VnZ2VzdGVyTW9kYWwgfSBmcm9tIFwiLi9TdWdnZXN0ZXJNb2RhbFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlU3lzdGVtIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJzeXN0ZW1cIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY2xpcGJvYXJkXCIsIHRoaXMuZ2VuZXJhdGVfY2xpcGJvYXJkKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicHJvbXB0XCIsIHRoaXMuZ2VuZXJhdGVfcHJvbXB0KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwic3VnZ2VzdGVyXCIsIHRoaXMuZ2VuZXJhdGVfc3VnZ2VzdGVyKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBnZW5lcmF0ZV9jbGlwYm9hcmQoKTogKCkgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlQXBwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcHJvbXB0KCk6IChcbiAgICAgICAgcHJvbXB0X3RleHQ6IHN0cmluZyxcbiAgICAgICAgZGVmYXVsdF92YWx1ZTogc3RyaW5nLFxuICAgICAgICB0aHJvd19vbl9jYW5jZWw6IGJvb2xlYW5cbiAgICApID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoXG4gICAgICAgICAgICBwcm9tcHRfdGV4dDogc3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdF92YWx1ZTogc3RyaW5nLFxuICAgICAgICAgICAgdGhyb3dfb25fY2FuY2VsID0gZmFsc2VcbiAgICAgICAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb21wdCA9IG5ldyBQcm9tcHRNb2RhbChcbiAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICBwcm9tcHRfdGV4dCxcbiAgICAgICAgICAgICAgICBkZWZhdWx0X3ZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgKSA9PiBwcm9tcHQub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9zdWdnZXN0ZXIoKTogPFQ+KFxuICAgICAgICB0ZXh0X2l0ZW1zOiBzdHJpbmdbXSB8ICgoaXRlbTogVCkgPT4gc3RyaW5nKSxcbiAgICAgICAgaXRlbXM6IFRbXSxcbiAgICAgICAgdGhyb3dfb25fY2FuY2VsOiBib29sZWFuLFxuICAgICAgICBwbGFjZWhvbGRlcjogc3RyaW5nXG4gICAgKSA9PiBQcm9taXNlPFQ+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIDxUPihcbiAgICAgICAgICAgIHRleHRfaXRlbXM6IHN0cmluZ1tdIHwgKChpdGVtOiBUKSA9PiBzdHJpbmcpLFxuICAgICAgICAgICAgaXRlbXM6IFRbXSxcbiAgICAgICAgICAgIHRocm93X29uX2NhbmNlbCA9IGZhbHNlLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBcIlwiXG4gICAgICAgICk6IFByb21pc2U8VD4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGVyID0gbmV3IFN1Z2dlc3Rlck1vZGFsKFxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgIHRleHRfaXRlbXMsXG4gICAgICAgICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiAodmFsdWU6IFQpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdDogKHJlYXNvbj86IFRlbXBsYXRlckVycm9yKSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgKSA9PiBzdWdnZXN0ZXIub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCJmdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVDb25maWcgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImNvbmZpZ1wiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge31cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBJR2VuZXJhdGVPYmplY3QgfSBmcm9tIFwiZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdFwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVEYXRlIH0gZnJvbSBcIi4vZGF0ZS9JbnRlcm5hbE1vZHVsZURhdGVcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRmlsZSB9IGZyb20gXCIuL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZVdlYiB9IGZyb20gXCIuL3dlYi9JbnRlcm5hbE1vZHVsZVdlYlwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlciB9IGZyb20gXCIuL2Zyb250bWF0dGVyL0ludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtL0ludGVybmFsTW9kdWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVDb25maWcgfSBmcm9tIFwiLi9jb25maWcvSW50ZXJuYWxNb2R1bGVDb25maWdcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsRnVuY3Rpb25zIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwcml2YXRlIG1vZHVsZXNfYXJyYXk6IEFycmF5PEludGVybmFsTW9kdWxlPiA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwcDogQXBwLCBwcm90ZWN0ZWQgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRGF0ZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRmlsZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlV2ViKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChcbiAgICAgICAgICAgIG5ldyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbilcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2goXG4gICAgICAgICAgICBuZXcgSW50ZXJuYWxNb2R1bGVTeXN0ZW0odGhpcy5hcHAsIHRoaXMucGx1Z2luKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChcbiAgICAgICAgICAgIG5ldyBJbnRlcm5hbE1vZHVsZUNvbmZpZyh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgZm9yIChjb25zdCBtb2Qgb2YgdGhpcy5tb2R1bGVzX2FycmF5KSB7XG4gICAgICAgICAgICBhd2FpdCBtb2QuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWdcbiAgICApOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB7XG4gICAgICAgIGNvbnN0IGludGVybmFsX2Z1bmN0aW9uc19vYmplY3Q6IHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9ID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBtb2Qgb2YgdGhpcy5tb2R1bGVzX2FycmF5KSB7XG4gICAgICAgICAgICBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0W21vZC5nZXROYW1lKCldID1cbiAgICAgICAgICAgICAgICBhd2FpdCBtb2QuZ2VuZXJhdGVfb2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBleGVjIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XG5pbXBvcnQgeyBBcHAsIFBsYXRmb3JtLCBGaWxlU3lzdGVtQWRhcHRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBJR2VuZXJhdGVPYmplY3QgfSBmcm9tIFwiZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdFwiO1xuaW1wb3J0IHsgUnVubmluZ0NvbmZpZyB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBGdW5jdGlvbnNNb2RlIH0gZnJvbSBcImZ1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGNsYXNzIFVzZXJTeXN0ZW1GdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHByaXZhdGUgY3dkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBleGVjX3Byb21pc2U6IChcbiAgICAgICAgYXJnMTogc3RyaW5nLFxuICAgICAgICBhcmcyOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICkgPT4gUHJvbWlzZTx7IHN0ZG91dDogc3RyaW5nOyBzdGRlcnI6IHN0cmluZyB9PjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIFBsYXRmb3JtLmlzTW9iaWxlQXBwIHx8XG4gICAgICAgICAgICAhKGFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5jd2QgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jd2QgPSBhcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuICAgICAgICAgICAgdGhpcy5leGVjX3Byb21pc2UgPSBwcm9taXNpZnkoZXhlYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICBhc3luYyBnZW5lcmF0ZV9zeXN0ZW1fZnVuY3Rpb25zKFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWdcbiAgICApOiBQcm9taXNlPFxuICAgICAgICBNYXA8c3RyaW5nLCAodXNlcl9hcmdzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IFByb21pc2U8c3RyaW5nPj5cbiAgICA+IHtcbiAgICAgICAgY29uc3QgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zOiBNYXA8XG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICAodXNlcl9hcmdzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IFByb21pc2U8c3RyaW5nPlxuICAgICAgICA+ID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0ID1cbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnRlbXBsYXRlci5mdW5jdGlvbnNfZ2VuZXJhdG9yLmdlbmVyYXRlX29iamVjdChcbiAgICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgICAgRnVuY3Rpb25zTW9kZS5JTlRFUk5BTFxuICAgICAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlX3BhaXIgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRlbXBsYXRlX3BhaXJbMF07XG4gICAgICAgICAgICBsZXQgY21kID0gdGVtcGxhdGVfcGFpclsxXTtcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGUgfHwgIWNtZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgICAgICB1c2VyX3N5c3RlbV9mdW5jdGlvbnMuc2V0KHRlbXBsYXRlLCAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNtZCA9IGF3YWl0IHRoaXMucGx1Z2luLnRlbXBsYXRlci5wYXJzZXIucGFyc2VfY29tbWFuZHMoXG4gICAgICAgICAgICAgICAgICAgIGNtZCxcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB1c2VyX3N5c3RlbV9mdW5jdGlvbnMuc2V0KFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9hcmdzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICAgICAgICAgICAgICAgICAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NfZW52ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJfYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNtZF9vcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnY6IHByb2Nlc3NfZW52LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLih0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoICYmIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGw6IHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgc3Rkb3V0IH0gPSBhd2FpdCB0aGlzLmV4ZWNfcHJvbWlzZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY21kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbWRfb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZG91dC50cmltUmlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3Igd2l0aCBVc2VyIFRlbXBsYXRlICR7dGVtcGxhdGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlcl9zeXN0ZW1fZnVuY3Rpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCB1c2VyX3N5c3RlbV9mdW5jdGlvbnMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlX3N5c3RlbV9mdW5jdGlvbnMoXG4gICAgICAgICAgICBjb25maWdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh1c2VyX3N5c3RlbV9mdW5jdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IElHZW5lcmF0ZU9iamVjdCB9IGZyb20gXCJmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0XCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFVzZXJTY3JpcHRGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHt9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV91c2VyX3NjcmlwdF9mdW5jdGlvbnMoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8TWFwPHN0cmluZywgRnVuY3Rpb24+PiB7XG4gICAgICAgIGNvbnN0IHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogTWFwPHN0cmluZywgRnVuY3Rpb24+ID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBmaWxlcyA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGBDb3VsZG4ndCBmaW5kIHVzZXIgc2NyaXB0IGZvbGRlciBcIiR7dGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcn1cImBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFmaWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZF91c2VyX3NjcmlwdF9mdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VyX3NjcmlwdF9mdW5jdGlvbnM7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZF91c2VyX3NjcmlwdF9mdW5jdGlvbihcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnLFxuICAgICAgICBmaWxlOiBURmlsZSxcbiAgICAgICAgdXNlcl9zY3JpcHRfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj5cbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgIFwiYXBwLnZhdWx0IGlzIG5vdCBhIEZpbGVTeXN0ZW1BZGFwdGVyIGluc3RhbmNlXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmF1bHRfcGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZV9wYXRoID0gYCR7dmF1bHRfcGF0aH0vJHtmaWxlLnBhdGh9YDtcblxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNjYzMzkwMS9yZWxvYWQtbW9kdWxlLWF0LXJ1bnRpbWVcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTk3MjI0Mi9ob3ctdG8tYXV0by1yZWxvYWQtZmlsZXMtaW4tbm9kZS1qc1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMod2luZG93LnJlcXVpcmUuY2FjaGUpLmNvbnRhaW5zKGZpbGVfcGF0aCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3cucmVxdWlyZS5jYWNoZVt3aW5kb3cucmVxdWlyZS5yZXNvbHZlKGZpbGVfcGF0aCldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlcl9mdW5jdGlvbiA9IGF3YWl0IGltcG9ydChmaWxlX3BhdGgpO1xuICAgICAgICBpZiAoIXVzZXJfZnVuY3Rpb24uZGVmYXVsdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgIGBGYWlsZWQgdG8gbG9hZCB1c2VyIHNjcmlwdCAke2ZpbGVfcGF0aH0uIE5vIGV4cG9ydHMgZGV0ZWN0ZWQuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISh1c2VyX2Z1bmN0aW9uLmRlZmF1bHQgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICBgRmFpbGVkIHRvIGxvYWQgdXNlciBzY3JpcHQgJHtmaWxlX3BhdGh9LiBEZWZhdWx0IGV4cG9ydCBpcyBub3QgYSBmdW5jdGlvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJfc2NyaXB0X2Z1bmN0aW9ucy5zZXQoYCR7ZmlsZS5iYXNlbmFtZX1gLCB1c2VyX2Z1bmN0aW9uLmRlZmF1bHQpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlX3VzZXJfc2NyaXB0X2Z1bmN0aW9ucyhcbiAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHVzZXJfc2NyaXB0X2Z1bmN0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IFVzZXJTeXN0ZW1GdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJTeXN0ZW1GdW5jdGlvbnNcIjtcbmltcG9ydCB7IFVzZXJTY3JpcHRGdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJTY3JpcHRGdW5jdGlvbnNcIjtcblxuZXhwb3J0IGNsYXNzIFVzZXJGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHByaXZhdGUgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zOiBVc2VyU3lzdGVtRnVuY3Rpb25zO1xuICAgIHByaXZhdGUgdXNlcl9zY3JpcHRfZnVuY3Rpb25zOiBVc2VyU2NyaXB0RnVuY3Rpb25zO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy51c2VyX3N5c3RlbV9mdW5jdGlvbnMgPSBuZXcgVXNlclN5c3RlbUZ1bmN0aW9ucyhhcHAsIHBsdWdpbik7XG4gICAgICAgIHRoaXMudXNlcl9zY3JpcHRfZnVuY3Rpb25zID0gbmV3IFVzZXJTY3JpcHRGdW5jdGlvbnMoYXBwLCBwbHVnaW4pO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBsZXQgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zID0ge307XG4gICAgICAgIGxldCB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPSB7fTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcykge1xuICAgICAgICAgICAgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zID1cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJfc3lzdGVtX2Z1bmN0aW9ucy5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICAvLyB1c2VyX3NjcmlwdHNfZm9sZGVyIG5lZWRzIHRvIGJlIGV4cGxpY2l0bHkgc2V0IHRvICcvJyB0byBxdWVyeSBmcm9tIHJvb3RcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzRGVza3RvcEFwcCAmJiB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKSB7XG4gICAgICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudXNlcl9zY3JpcHRfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnVzZXJfc3lzdGVtX2Z1bmN0aW9ucyxcbiAgICAgICAgICAgIC4uLnVzZXJfc2NyaXB0X2Z1bmN0aW9ucyxcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgSW50ZXJuYWxGdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9JbnRlcm5hbEZ1bmN0aW9uc1wiO1xuaW1wb3J0IHsgVXNlckZ1bmN0aW9ucyB9IGZyb20gXCJmdW5jdGlvbnMvdXNlcl9mdW5jdGlvbnMvVXNlckZ1bmN0aW9uc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgKiBhcyBvYnNpZGlhbl9tb2R1bGUgZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBlbnVtIEZ1bmN0aW9uc01vZGUge1xuICAgIElOVEVSTkFMLFxuICAgIFVTRVJfSU5URVJOQUwsXG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbnNHZW5lcmF0b3IgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHB1YmxpYyBpbnRlcm5hbF9mdW5jdGlvbnM6IEludGVybmFsRnVuY3Rpb25zO1xuICAgIHB1YmxpYyB1c2VyX2Z1bmN0aW9uczogVXNlckZ1bmN0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbF9mdW5jdGlvbnMgPSBuZXcgSW50ZXJuYWxGdW5jdGlvbnModGhpcy5hcHAsIHRoaXMucGx1Z2luKTtcbiAgICAgICAgdGhpcy51c2VyX2Z1bmN0aW9ucyA9IG5ldyBVc2VyRnVuY3Rpb25zKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbF9mdW5jdGlvbnMuaW5pdCgpO1xuICAgIH1cblxuICAgIGFkZGl0aW9uYWxfZnVuY3Rpb25zKCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9ic2lkaWFuOiBvYnNpZGlhbl9tb2R1bGUsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWcsXG4gICAgICAgIGZ1bmN0aW9uc19tb2RlOiBGdW5jdGlvbnNNb2RlID0gRnVuY3Rpb25zTW9kZS5VU0VSX0lOVEVSTkFMXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCBmaW5hbF9vYmplY3QgPSB7fTtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbF9mdW5jdGlvbnNfb2JqZWN0ID0gdGhpcy5hZGRpdGlvbmFsX2Z1bmN0aW9ucygpO1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0ID1cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICBsZXQgdXNlcl9mdW5jdGlvbnNfb2JqZWN0ID0ge307XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihmaW5hbF9vYmplY3QsIGFkZGl0aW9uYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgIHN3aXRjaCAoZnVuY3Rpb25zX21vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRnVuY3Rpb25zTW9kZS5JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZpbmFsX29iamVjdCwgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICB1c2VyX2Z1bmN0aW9uc19vYmplY3QgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZmluYWxfb2JqZWN0LCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmludGVybmFsX2Z1bmN0aW9uc19vYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfZnVuY3Rpb25zX29iamVjdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5hbF9vYmplY3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgRWRpdG9yUG9zaXRpb24sXG4gICAgRWRpdG9yUmFuZ2VPckNhcmV0LFxuICAgIEVkaXRvclRyYW5zYWN0aW9uLFxuICAgIE1hcmtkb3duVmlldyxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBlc2NhcGVfUmVnRXhwIH0gZnJvbSBcIlV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJzb3JKdW1wZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIWFjdGl2ZV92aWV3KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0aXZlX2ZpbGUgPSBhY3RpdmVfdmlldy5maWxlO1xuICAgICAgICBhd2FpdCBhY3RpdmVfdmlldy5zYXZlKCk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoYWN0aXZlX2ZpbGUpO1xuXG4gICAgICAgIGNvbnN0IHsgbmV3X2NvbnRlbnQsIHBvc2l0aW9ucyB9ID1cbiAgICAgICAgICAgIHRoaXMucmVwbGFjZV9hbmRfZ2V0X2N1cnNvcl9wb3NpdGlvbnMoY29udGVudCk7XG4gICAgICAgIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShhY3RpdmVfZmlsZSwgbmV3X2NvbnRlbnQpO1xuICAgICAgICAgICAgdGhpcy5zZXRfY3Vyc29yX2xvY2F0aW9uKHBvc2l0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfZWRpdG9yX3Bvc2l0aW9uX2Zyb21faW5kZXgoXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgaW5kZXg6IG51bWJlclxuICAgICk6IEVkaXRvclBvc2l0aW9uIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyID0gY29udGVudC5zdWJzdHIoMCwgaW5kZXgpO1xuXG4gICAgICAgIGxldCBsID0gMDtcbiAgICAgICAgbGV0IG9mZnNldCA9IC0xO1xuICAgICAgICBsZXQgciA9IC0xO1xuICAgICAgICBmb3IgKDsgKHIgPSBzdWJzdHIuaW5kZXhPZihcIlxcblwiLCByICsgMSkpICE9PSAtMTsgbCsrLCBvZmZzZXQgPSByKTtcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG5cbiAgICAgICAgY29uc3QgY2ggPSBjb250ZW50LnN1YnN0cihvZmZzZXQsIGluZGV4IC0gb2Zmc2V0KS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHsgbGluZTogbCwgY2g6IGNoIH07XG4gICAgfVxuXG4gICAgcmVwbGFjZV9hbmRfZ2V0X2N1cnNvcl9wb3NpdGlvbnMoY29udGVudDogc3RyaW5nKToge1xuICAgICAgICBuZXdfY29udGVudD86IHN0cmluZztcbiAgICAgICAgcG9zaXRpb25zPzogRWRpdG9yUG9zaXRpb25bXTtcbiAgICB9IHtcbiAgICAgICAgbGV0IGN1cnNvcl9tYXRjaGVzID0gW107XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgY29uc3QgY3Vyc29yX3JlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgIFwiPCVcXFxccyp0cC5maWxlLmN1cnNvclxcXFwoKD88b3JkZXI+WzAtOV17MCwyfSlcXFxcKVxcXFxzKiU+XCIsXG4gICAgICAgICAgICBcImdcIlxuICAgICAgICApO1xuXG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSBjdXJzb3JfcmVnZXguZXhlYyhjb250ZW50KSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgY3Vyc29yX21hdGNoZXMucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnNvcl9tYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3Vyc29yX21hdGNoZXMuc29ydCgobTEsIG0yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKG0xLmdyb3Vwc1tcIm9yZGVyXCJdKSAtIE51bWJlcihtMi5ncm91cHNbXCJvcmRlclwiXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXRjaF9zdHIgPSBjdXJzb3JfbWF0Y2hlc1swXVswXTtcblxuICAgICAgICBjdXJzb3JfbWF0Y2hlcyA9IGN1cnNvcl9tYXRjaGVzLmZpbHRlcigobSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1bMF0gPT09IG1hdGNoX3N0cjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gW107XG4gICAgICAgIGxldCBpbmRleF9vZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGN1cnNvcl9tYXRjaGVzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG1hdGNoLmluZGV4IC0gaW5kZXhfb2Zmc2V0O1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2godGhpcy5nZXRfZWRpdG9yX3Bvc2l0aW9uX2Zyb21faW5kZXgoY29udGVudCwgaW5kZXgpKTtcblxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZV9SZWdFeHAobWF0Y2hbMF0pKSwgXCJcIik7XG4gICAgICAgICAgICBpbmRleF9vZmZzZXQgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBGb3IgdHAuZmlsZS5jdXJzb3IoKSwgd2Uga2VlcCB0aGUgZGVmYXVsdCB0b3AgdG8gYm90dG9tXG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IG5ld19jb250ZW50OiBjb250ZW50LCBwb3NpdGlvbnM6IHBvc2l0aW9ucyB9O1xuICAgIH1cblxuICAgIHNldF9jdXJzb3JfbG9jYXRpb24ocG9zaXRpb25zOiBFZGl0b3JQb3NpdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICghYWN0aXZlX3ZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgZWRpdG9yLmZvY3VzKCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uczogQXJyYXk8RWRpdG9yUmFuZ2VPckNhcmV0PiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHBvcyBvZiBwb3NpdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnMucHVzaCh7IGZyb206IHBvcyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uOiBFZGl0b3JUcmFuc2FjdGlvbiA9IHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IHNlbGVjdGlvbnMsXG4gICAgICAgIH07XG4gICAgICAgIGVkaXRvci50cmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XG4gICAgfVxufVxuIiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwczovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuKGZ1bmN0aW9uIChtb2QpIHtcbiAgICBtb2Qod2luZG93LkNvZGVNaXJyb3IpO1xufSkoZnVuY3Rpb24gKENvZGVNaXJyb3IpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIENvZGVNaXJyb3IuZGVmaW5lTW9kZShcImphdmFzY3JpcHRcIiwgZnVuY3Rpb24gKGNvbmZpZywgcGFyc2VyQ29uZmlnKSB7XG4gICAgICAgIHZhciBpbmRlbnRVbml0ID0gY29uZmlnLmluZGVudFVuaXQ7XG4gICAgICAgIHZhciBzdGF0ZW1lbnRJbmRlbnQgPSBwYXJzZXJDb25maWcuc3RhdGVtZW50SW5kZW50O1xuICAgICAgICB2YXIganNvbmxkTW9kZSA9IHBhcnNlckNvbmZpZy5qc29ubGQ7XG4gICAgICAgIHZhciBqc29uTW9kZSA9IHBhcnNlckNvbmZpZy5qc29uIHx8IGpzb25sZE1vZGU7XG4gICAgICAgIHZhciB0cmFja1Njb3BlID0gcGFyc2VyQ29uZmlnLnRyYWNrU2NvcGUgIT09IGZhbHNlO1xuICAgICAgICB2YXIgaXNUUyA9IHBhcnNlckNvbmZpZy50eXBlc2NyaXB0O1xuICAgICAgICB2YXIgd29yZFJFID0gcGFyc2VyQ29uZmlnLndvcmRDaGFyYWN0ZXJzIHx8IC9bXFx3JFxceGExLVxcdWZmZmZdLztcblxuICAgICAgICAvLyBUb2tlbml6ZXJcblxuICAgICAgICB2YXIga2V5d29yZHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24ga3codHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHR5cGUsIHN0eWxlOiBcImtleXdvcmRcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIEEgPSBrdyhcImtleXdvcmQgYVwiKSxcbiAgICAgICAgICAgICAgICBCID0ga3coXCJrZXl3b3JkIGJcIiksXG4gICAgICAgICAgICAgICAgQyA9IGt3KFwia2V5d29yZCBjXCIpLFxuICAgICAgICAgICAgICAgIEQgPSBrdyhcImtleXdvcmQgZFwiKTtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvciA9IGt3KFwib3BlcmF0b3JcIiksXG4gICAgICAgICAgICAgICAgYXRvbSA9IHsgdHlwZTogXCJhdG9tXCIsIHN0eWxlOiBcImF0b21cIiB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlmOiBrdyhcImlmXCIpLFxuICAgICAgICAgICAgICAgIHdoaWxlOiBBLFxuICAgICAgICAgICAgICAgIHdpdGg6IEEsXG4gICAgICAgICAgICAgICAgZWxzZTogQixcbiAgICAgICAgICAgICAgICBkbzogQixcbiAgICAgICAgICAgICAgICB0cnk6IEIsXG4gICAgICAgICAgICAgICAgZmluYWxseTogQixcbiAgICAgICAgICAgICAgICByZXR1cm46IEQsXG4gICAgICAgICAgICAgICAgYnJlYWs6IEQsXG4gICAgICAgICAgICAgICAgY29udGludWU6IEQsXG4gICAgICAgICAgICAgICAgbmV3OiBrdyhcIm5ld1wiKSxcbiAgICAgICAgICAgICAgICBkZWxldGU6IEMsXG4gICAgICAgICAgICAgICAgdm9pZDogQyxcbiAgICAgICAgICAgICAgICB0aHJvdzogQyxcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjoga3coXCJkZWJ1Z2dlclwiKSxcbiAgICAgICAgICAgICAgICB2YXI6IGt3KFwidmFyXCIpLFxuICAgICAgICAgICAgICAgIGNvbnN0OiBrdyhcInZhclwiKSxcbiAgICAgICAgICAgICAgICBsZXQ6IGt3KFwidmFyXCIpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiBrdyhcImZ1bmN0aW9uXCIpLFxuICAgICAgICAgICAgICAgIGNhdGNoOiBrdyhcImNhdGNoXCIpLFxuICAgICAgICAgICAgICAgIGZvcjoga3coXCJmb3JcIiksXG4gICAgICAgICAgICAgICAgc3dpdGNoOiBrdyhcInN3aXRjaFwiKSxcbiAgICAgICAgICAgICAgICBjYXNlOiBrdyhcImNhc2VcIiksXG4gICAgICAgICAgICAgICAgZGVmYXVsdDoga3coXCJkZWZhdWx0XCIpLFxuICAgICAgICAgICAgICAgIGluOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICB0eXBlb2Y6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlb2Y6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHRydWU6IGF0b20sXG4gICAgICAgICAgICAgICAgZmFsc2U6IGF0b20sXG4gICAgICAgICAgICAgICAgbnVsbDogYXRvbSxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQ6IGF0b20sXG4gICAgICAgICAgICAgICAgTmFOOiBhdG9tLFxuICAgICAgICAgICAgICAgIEluZmluaXR5OiBhdG9tLFxuICAgICAgICAgICAgICAgIHRoaXM6IGt3KFwidGhpc1wiKSxcbiAgICAgICAgICAgICAgICBjbGFzczoga3coXCJjbGFzc1wiKSxcbiAgICAgICAgICAgICAgICBzdXBlcjoga3coXCJhdG9tXCIpLFxuICAgICAgICAgICAgICAgIHlpZWxkOiBDLFxuICAgICAgICAgICAgICAgIGV4cG9ydDoga3coXCJleHBvcnRcIiksXG4gICAgICAgICAgICAgICAgaW1wb3J0OiBrdyhcImltcG9ydFwiKSxcbiAgICAgICAgICAgICAgICBleHRlbmRzOiBDLFxuICAgICAgICAgICAgICAgIGF3YWl0OiBDLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICB2YXIgaXNPcGVyYXRvckNoYXIgPSAvWytcXC0qJiU9PD4hP3x+XkBdLztcbiAgICAgICAgdmFyIGlzSnNvbmxkS2V5d29yZCA9XG4gICAgICAgICAgICAvXkAoY29udGV4dHxpZHx2YWx1ZXxsYW5ndWFnZXx0eXBlfGNvbnRhaW5lcnxsaXN0fHNldHxyZXZlcnNlfGluZGV4fGJhc2V8dm9jYWJ8Z3JhcGgpXCIvO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRSZWdleHAoc3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5leHQsXG4gICAgICAgICAgICAgICAgaW5TZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT0gXCIvXCIgJiYgIWluU2V0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09IFwiW1wiKSBpblNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluU2V0ICYmIG5leHQgPT0gXCJdXCIpIGluU2V0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlZCBhcyBzY3JhdGNoIHZhcmlhYmxlcyB0byBjb21tdW5pY2F0ZSBtdWx0aXBsZSB2YWx1ZXMgd2l0aG91dFxuICAgICAgICAvLyBjb25zaW5nIHVwIHRvbnMgb2Ygb2JqZWN0cy5cbiAgICAgICAgdmFyIHR5cGUsIGNvbnRlbnQ7XG4gICAgICAgIGZ1bmN0aW9uIHJldCh0cCwgc3R5bGUsIGNvbnQpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0cDtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250O1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRva2VuQmFzZShzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSBzdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgaWYgKGNoID09ICdcIicgfHwgY2ggPT0gXCInXCIpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuU3RyaW5nKGNoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUudG9rZW5pemUoc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGNoID09IFwiLlwiICYmXG4gICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eXFxkW1xcZF9dKig/OltlRV1bK1xcLV0/W1xcZF9dKyk/LylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJudW1iZXJcIiwgXCJudW1iZXJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiLlwiICYmIHN0cmVhbS5tYXRjaChcIi4uXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInNwcmVhZFwiLCBcIm1ldGFcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9bXFxbXFxde31cXChcXCksO1xcOlxcLl0vLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChjaCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiPVwiICYmIHN0cmVhbS5lYXQoXCI+XCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIj0+XCIsIFwib3BlcmF0b3JcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGNoID09IFwiMFwiICYmXG4gICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eKD86eFtcXGRBLUZhLWZfXSt8b1swLTdfXSt8YlswMV9dKyluPy8pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFxkLy50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaChcbiAgICAgICAgICAgICAgICAgICAgL15bXFxkX10qKD86bnwoPzpcXC5bXFxkX10qKT8oPzpbZUVdWytcXC1dP1tcXGRfXSspPyk/L1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIm51bWJlclwiLCBcIm51bWJlclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIvXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLmVhdChcIipcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbkNvbW1lbnQoc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJlYW0uZWF0KFwiL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb25BbGxvd2VkKHN0cmVhbSwgc3RhdGUsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSZWdleHAoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eXFxiKChbZ2lteXVzXSkoPyFbZ2lteXVzXSpcXDIpKStcXGIvKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInJlZ2V4cFwiLCBcInN0cmluZy0yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5lYXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwib3BlcmF0b3JcIiwgXCJvcGVyYXRvclwiLCBzdHJlYW0uY3VycmVudCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiYFwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlblF1YXNpKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PSBcIiNcIiAmJiBzdHJlYW0ucGVlaygpID09IFwiIVwiKSB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLnNraXBUb0VuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJtZXRhXCIsIFwibWV0YVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIjXCIgJiYgc3RyZWFtLmVhdFdoaWxlKHdvcmRSRSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwidmFyaWFibGVcIiwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgKGNoID09IFwiPFwiICYmIHN0cmVhbS5tYXRjaChcIiEtLVwiKSkgfHxcbiAgICAgICAgICAgICAgICAoY2ggPT0gXCItXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKFwiLT5cIikgJiZcbiAgICAgICAgICAgICAgICAgICAgIS9cXFMvLnRlc3Qoc3RyZWFtLnN0cmluZy5zbGljZSgwLCBzdHJlYW0uc3RhcnQpKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwiY29tbWVudFwiLCBcImNvbW1lbnRcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzT3BlcmF0b3JDaGFyLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoICE9IFwiPlwiIHx8ICFzdGF0ZS5sZXhpY2FsIHx8IHN0YXRlLmxleGljYWwudHlwZSAhPSBcIj5cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLmVhdChcIj1cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PSBcIiFcIiB8fCBjaCA9PSBcIj1cIikgc3RyZWFtLmVhdChcIj1cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL1s8PiorXFwtfCY/XS8udGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5lYXQoY2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoID09IFwiPlwiKSBzdHJlYW0uZWF0KGNoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ggPT0gXCI/XCIgJiYgc3RyZWFtLmVhdChcIi5cIikpIHJldHVybiByZXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJvcGVyYXRvclwiLCBcIm9wZXJhdG9yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3b3JkUkUudGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZWF0V2hpbGUod29yZFJFKTtcbiAgICAgICAgICAgICAgICB2YXIgd29yZCA9IHN0cmVhbS5jdXJyZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmxhc3RUeXBlICE9IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXl3b3Jkcy5wcm9wZXJ0eUlzRW51bWVyYWJsZSh3b3JkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGt3ID0ga2V5d29yZHNbd29yZF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0KGt3LnR5cGUsIGt3LnN0eWxlLCB3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkID09IFwiYXN5bmNcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC9eKFxcc3xcXC9cXCooW14qXXxcXCooPyFcXC8pKSo/XFwqXFwvKSpbXFxbXFwoXFx3XS8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcImFzeW5jXCIsIFwia2V5d29yZFwiLCB3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInZhcmlhYmxlXCIsIFwidmFyaWFibGVcIiwgd29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2tlblN0cmluZyhxdW90ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dDtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGpzb25sZE1vZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLnBlZWsoKSA9PSBcIkBcIiAmJlxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0ubWF0Y2goaXNKc29ubGRLZXl3b3JkKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcImpzb25sZC1rZXl3b3JkXCIsIFwibWV0YVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PSBxdW90ZSAmJiAhZXNjYXBlZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVzY2FwZWQpIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJzdHJpbmdcIiwgXCJzdHJpbmdcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBtYXliZUVuZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNoO1xuICAgICAgICAgICAgd2hpbGUgKChjaCA9IHN0cmVhbS5uZXh0KCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09IFwiL1wiICYmIG1heWJlRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF5YmVFbmQgPSBjaCA9PSBcIipcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRva2VuUXVhc2koc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBuZXh0O1xuICAgICAgICAgICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIWVzY2FwZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKG5leHQgPT0gXCJgXCIgfHwgKG5leHQgPT0gXCIkXCIgJiYgc3RyZWFtLmVhdChcIntcIikpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldChcInF1YXNpXCIsIFwic3RyaW5nLTJcIiwgc3RyZWFtLmN1cnJlbnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYnJhY2tldHMgPSBcIihbe31dKVwiO1xuICAgICAgICAvLyBUaGlzIGlzIGEgY3J1ZGUgbG9va2FoZWFkIHRyaWNrIHRvIHRyeSBhbmQgbm90aWNlIHRoYXQgd2UncmVcbiAgICAgICAgLy8gcGFyc2luZyB0aGUgYXJndW1lbnQgcGF0dGVybnMgZm9yIGEgZmF0LWFycm93IGZ1bmN0aW9uIGJlZm9yZSB3ZVxuICAgICAgICAvLyBhY3R1YWxseSBoaXQgdGhlIGFycm93IHRva2VuLiBJdCBvbmx5IHdvcmtzIGlmIHRoZSBhcnJvdyBpcyBvblxuICAgICAgICAvLyB0aGUgc2FtZSBsaW5lIGFzIHRoZSBhcmd1bWVudHMgYW5kIHRoZXJlJ3Mgbm8gc3RyYW5nZSBub2lzZVxuICAgICAgICAvLyAoY29tbWVudHMpIGluIGJldHdlZW4uIEZhbGxiYWNrIGlzIHRvIG9ubHkgbm90aWNlIHdoZW4gd2UgaGl0IHRoZVxuICAgICAgICAvLyBhcnJvdywgYW5kIG5vdCBkZWNsYXJlIHRoZSBhcmd1bWVudHMgYXMgbG9jYWxzIGZvciB0aGUgYXJyb3dcbiAgICAgICAgLy8gYm9keS5cbiAgICAgICAgZnVuY3Rpb24gZmluZEZhdEFycm93KHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5mYXRBcnJvd0F0KSBzdGF0ZS5mYXRBcnJvd0F0ID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBhcnJvdyA9IHN0cmVhbS5zdHJpbmcuaW5kZXhPZihcIj0+XCIsIHN0cmVhbS5zdGFydCk7XG4gICAgICAgICAgICBpZiAoYXJyb3cgPCAwKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChpc1RTKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHNraXAgVHlwZVNjcmlwdCByZXR1cm4gdHlwZSBkZWNsYXJhdGlvbnMgYWZ0ZXIgdGhlIGFyZ3VtZW50c1xuICAgICAgICAgICAgICAgIHZhciBtID0gLzpcXHMqKD86XFx3Kyg/OjxbXj5dKj58XFxbXFxdKT98XFx7W159XSpcXH0pXFxzKiQvLmV4ZWMoXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5zdHJpbmcuc2xpY2Uoc3RyZWFtLnN0YXJ0LCBhcnJvdylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChtKSBhcnJvdyA9IG0uaW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkZXB0aCA9IDAsXG4gICAgICAgICAgICAgICAgc2F3U29tZXRoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBwb3MgPSBhcnJvdyAtIDE7IHBvcyA+PSAwOyAtLXBvcykge1xuICAgICAgICAgICAgICAgIHZhciBjaCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyk7XG4gICAgICAgICAgICAgICAgdmFyIGJyYWNrZXQgPSBicmFja2V0cy5pbmRleE9mKGNoKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJhY2tldCA+PSAwICYmIGJyYWNrZXQgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tZGVwdGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoID09IFwiKFwiKSBzYXdTb21ldGhpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJyYWNrZXQgPj0gMyAmJiBicmFja2V0IDwgNikge1xuICAgICAgICAgICAgICAgICAgICArK2RlcHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhd1NvbWV0aGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvW1wiJ1xcL2BdLy50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgOyAtLXBvcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA9PSAwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPT0gY2ggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MgLSAyKSAhPSBcIlxcXFxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhd1NvbWV0aGluZyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKytwb3M7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSBzdGF0ZS5mYXRBcnJvd0F0ID0gcG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFyc2VyXG5cbiAgICAgICAgdmFyIGF0b21pY1R5cGVzID0ge1xuICAgICAgICAgICAgYXRvbTogdHJ1ZSxcbiAgICAgICAgICAgIG51bWJlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhcmlhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3RyaW5nOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhwOiB0cnVlLFxuICAgICAgICAgICAgdGhpczogdHJ1ZSxcbiAgICAgICAgICAgIGltcG9ydDogdHJ1ZSxcbiAgICAgICAgICAgIFwianNvbmxkLWtleXdvcmRcIjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBKU0xleGljYWwoaW5kZW50ZWQsIGNvbHVtbiwgdHlwZSwgYWxpZ24sIHByZXYsIGluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50ZWQgPSBpbmRlbnRlZDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgICAgICAgICB0aGlzLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaWYgKGFsaWduICE9IG51bGwpIHRoaXMuYWxpZ24gPSBhbGlnbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluU2NvcGUoc3RhdGUsIHZhcm5hbWUpIHtcbiAgICAgICAgICAgIGlmICghdHJhY2tTY29wZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgdiA9IHN0YXRlLmxvY2FsVmFyczsgdjsgdiA9IHYubmV4dClcbiAgICAgICAgICAgICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZm9yICh2YXIgY3ggPSBzdGF0ZS5jb250ZXh0OyBjeDsgY3ggPSBjeC5wcmV2KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdiA9IGN4LnZhcnM7IHY7IHYgPSB2Lm5leHQpXG4gICAgICAgICAgICAgICAgICAgIGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwYXJzZUpTKHN0YXRlLCBzdHlsZSwgdHlwZSwgY29udGVudCwgc3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBzdGF0ZS5jYztcbiAgICAgICAgICAgIC8vIENvbW11bmljYXRlIG91ciBjb250ZXh0IHRvIHRoZSBjb21iaW5hdG9ycy5cbiAgICAgICAgICAgIC8vIChMZXNzIHdhc3RlZnVsIHRoYW4gY29uc2luZyB1cCBhIGh1bmRyZWQgY2xvc3VyZXMgb24gZXZlcnkgY2FsbC4pXG4gICAgICAgICAgICBjeC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgY3guc3RyZWFtID0gc3RyZWFtO1xuICAgICAgICAgICAgKGN4Lm1hcmtlZCA9IG51bGwpLCAoY3guY2MgPSBjYyk7XG4gICAgICAgICAgICBjeC5zdHlsZSA9IHN0eWxlO1xuXG4gICAgICAgICAgICBpZiAoIXN0YXRlLmxleGljYWwuaGFzT3duUHJvcGVydHkoXCJhbGlnblwiKSlcbiAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsLmFsaWduID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tYmluYXRvciA9IGNjLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICA/IGNjLnBvcCgpXG4gICAgICAgICAgICAgICAgICAgIDoganNvbk1vZGVcbiAgICAgICAgICAgICAgICAgICAgPyBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDogc3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChjb21iaW5hdG9yKHR5cGUsIGNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjYy5sZW5ndGggJiYgY2NbY2MubGVuZ3RoIC0gMV0ubGV4KSBjYy5wb3AoKSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3gubWFya2VkKSByZXR1cm4gY3gubWFya2VkO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgaW5TY29wZShzdGF0ZSwgY29udGVudCkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ2YXJpYWJsZS0yXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21iaW5hdG9yIHV0aWxzXG5cbiAgICAgICAgdmFyIGN4ID0geyBzdGF0ZTogbnVsbCwgY29sdW1uOiBudWxsLCBtYXJrZWQ6IG51bGwsIGNjOiBudWxsIH07XG4gICAgICAgIGZ1bmN0aW9uIHBhc3MoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgIGN4LmNjLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb250KCkge1xuICAgICAgICAgICAgcGFzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5MaXN0KG5hbWUsIGxpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHYgPSBsaXN0OyB2OyB2ID0gdi5uZXh0KSBpZiAodi5uYW1lID09IG5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyKHZhcm5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlO1xuICAgICAgICAgICAgY3gubWFya2VkID0gXCJkZWZcIjtcbiAgICAgICAgICAgIGlmICghdHJhY2tTY29wZSkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwuaW5mbyA9PSBcInZhclwiICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuY29udGV4dC5ibG9ja1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGSVhNRSBmdW5jdGlvbiBkZWNscyBhcmUgYWxzbyBub3QgYmxvY2sgc2NvcGVkXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDb250ZXh0ID0gcmVnaXN0ZXJWYXJTY29wZWQodmFybmFtZSwgc3RhdGUuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgPSBuZXdDb250ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghaW5MaXN0KHZhcm5hbWUsIHN0YXRlLmxvY2FsVmFycykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubG9jYWxWYXJzID0gbmV3IFZhcih2YXJuYW1lLCBzdGF0ZS5sb2NhbFZhcnMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRmFsbCB0aHJvdWdoIG1lYW5zIHRoaXMgaXMgZ2xvYmFsXG4gICAgICAgICAgICBpZiAocGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgJiYgIWluTGlzdCh2YXJuYW1lLCBzdGF0ZS5nbG9iYWxWYXJzKSlcbiAgICAgICAgICAgICAgICBzdGF0ZS5nbG9iYWxWYXJzID0gbmV3IFZhcih2YXJuYW1lLCBzdGF0ZS5nbG9iYWxWYXJzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlclZhclNjb3BlZCh2YXJuYW1lLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5ibG9jaykge1xuICAgICAgICAgICAgICAgIHZhciBpbm5lciA9IHJlZ2lzdGVyVmFyU2NvcGVkKHZhcm5hbWUsIGNvbnRleHQucHJldik7XG4gICAgICAgICAgICAgICAgaWYgKCFpbm5lcikgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyID09IGNvbnRleHQucHJldikgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250ZXh0KGlubmVyLCBjb250ZXh0LnZhcnMsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbkxpc3QodmFybmFtZSwgY29udGV4dC52YXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbnRleHQoXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucHJldixcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZhcih2YXJuYW1lLCBjb250ZXh0LnZhcnMpLFxuICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01vZGlmaWVyKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInB1YmxpY1wiIHx8XG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInByaXZhdGVcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJwcm90ZWN0ZWRcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJhYnN0cmFjdFwiIHx8XG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInJlYWRvbmx5XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21iaW5hdG9yc1xuXG4gICAgICAgIGZ1bmN0aW9uIENvbnRleHQocHJldiwgdmFycywgYmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgICAgICAgICB0aGlzLnZhcnMgPSB2YXJzO1xuICAgICAgICAgICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIFZhcihuYW1lLCBuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0VmFycyA9IG5ldyBWYXIoXCJ0aGlzXCIsIG5ldyBWYXIoXCJhcmd1bWVudHNcIiwgbnVsbCkpO1xuICAgICAgICBmdW5jdGlvbiBwdXNoY29udGV4dCgpIHtcbiAgICAgICAgICAgIGN4LnN0YXRlLmNvbnRleHQgPSBuZXcgQ29udGV4dChcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0LFxuICAgICAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGRlZmF1bHRWYXJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1c2hibG9ja2NvbnRleHQoKSB7XG4gICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0ID0gbmV3IENvbnRleHQoXG4gICAgICAgICAgICAgICAgY3guc3RhdGUuY29udGV4dCxcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9wY29udGV4dCgpIHtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGN4LnN0YXRlLmNvbnRleHQudmFycztcbiAgICAgICAgICAgIGN4LnN0YXRlLmNvbnRleHQgPSBjeC5zdGF0ZS5jb250ZXh0LnByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcG9wY29udGV4dC5sZXggPSB0cnVlO1xuICAgICAgICBmdW5jdGlvbiBwdXNobGV4KHR5cGUsIGluZm8pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IHN0YXRlLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gXCJzdGF0XCIpXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IHN0YXRlLmxleGljYWwuaW5kZW50ZWQ7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG91dGVyID0gc3RhdGUubGV4aWNhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyICYmIG91dGVyLnR5cGUgPT0gXCIpXCIgJiYgb3V0ZXIuYWxpZ247XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRlciA9IG91dGVyLnByZXZcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gb3V0ZXIuaW5kZW50ZWQ7XG4gICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbCA9IG5ldyBKU0xleGljYWwoXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgY3guc3RyZWFtLmNvbHVtbigpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsLFxuICAgICAgICAgICAgICAgICAgICBpbmZvXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXN1bHQubGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9wbGV4KCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGU7XG4gICAgICAgICAgICBpZiAoc3RhdGUubGV4aWNhbC5wcmV2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSBcIilcIilcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5kZW50ZWQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLnByZXY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcG9wbGV4LmxleCA9IHRydWU7XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwZWN0KHdhbnRlZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhwKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSB3YW50ZWQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHdhbnRlZCA9PSBcIjtcIiB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlID09IFwifVwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPT0gXCIpXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9PSBcIl1cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBjb250KGV4cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhwO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhdGVtZW50KHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhclwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwidmFyZGVmXCIsIHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgdmFyZGVmLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI7XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGFcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgcGFyZW5FeHByLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgYlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjeC5zdHJlYW0ubWF0Y2goL15cXHMqJC8sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICA/IGNvbnQoKVxuICAgICAgICAgICAgICAgICAgICA6IGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJzdGF0XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXliZWV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIjtcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImRlYnVnZ2VyXCIpIHJldHVybiBjb250KGV4cGVjdChcIjtcIikpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoYmxvY2tjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBibG9jayxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJpZlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5sZXhpY2FsLmluZm8gPT0gXCJlbHNlXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RhdGUuY2NbY3guc3RhdGUuY2MubGVuZ3RoIC0gMV0gPT0gcG9wbGV4XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5jYy5wb3AoKSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiZm9ybVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW5FeHByLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVlbHNlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJmb3JcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hibG9ja2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGZvcnNwZWMsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiY2xhc3NcIiB8fCAoaXNUUyAmJiB2YWx1ZSA9PSBcImludGVyZmFjZVwiKSkge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiZm9ybVwiLCB0eXBlID09IFwiY2xhc3NcIiA/IHR5cGUgOiB2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiZGVjbGFyZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzVFMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09IFwibW9kdWxlXCIgfHwgdmFsdWUgPT0gXCJlbnVtXCIgfHwgdmFsdWUgPT0gXCJ0eXBlXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0cmVhbS5tYXRjaCgvXlxccypcXHcvLCBmYWxzZSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImVudW1cIikgcmV0dXJuIGNvbnQoZW51bWRlZik7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID09IFwidHlwZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwib3BlcmF0b3JcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZWV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiO1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJ7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIHZhbHVlID09IFwibmFtZXNwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBleHByZXNzaW9uLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIHZhbHVlID09IFwiYWJzdHJhY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgbWF5YmVsYWJlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJzd2l0Y2hcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgIHBhcmVuRXhwcixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwie1wiKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIn1cIiwgXCJzd2l0Y2hcIiksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hibG9ja2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImNhc2VcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiOlwiKSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImRlZmF1bHRcIikgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImNhdGNoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVDYXRjaEJpbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZXhwb3J0XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcInN0YXRcIiksIGFmdGVyRXhwb3J0LCBwb3BsZXgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJpbXBvcnRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgYWZ0ZXJJbXBvcnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImFzeW5jXCIpIHJldHVybiBjb250KHN0YXRlbWVudCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJAXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIHN0YXRlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwdXNobGV4KFwic3RhdFwiKSwgZXhwcmVzc2lvbiwgZXhwZWN0KFwiO1wiKSwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUNhdGNoQmluZGluZyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIGNvbnQoZnVuYXJnLCBleHBlY3QoXCIpXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleHByZXNzaW9uKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbk5vQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uSW5uZXIodHlwZSwgdmFsdWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBhcmVuRXhwcih0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPSBcIihcIikgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCIpXCIpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdChcIilcIiksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCBub0NvbW1hKSB7XG4gICAgICAgICAgICBpZiAoY3guc3RhdGUuZmF0QXJyb3dBdCA9PSBjeC5zdHJlYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYm9keSA9IG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5O1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYXNlcChmdW5hcmcsIFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIj0+XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwidmFyaWFibGVcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI9PlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYXliZW9wID0gbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hO1xuICAgICAgICAgICAgaWYgKGF0b21pY1R5cGVzLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gY29udChtYXliZW9wKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJjbGFzc1wiIHx8IChpc1RTICYmIHZhbHVlID09IFwiaW50ZXJmYWNlXCIpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIGNsYXNzRXhwcmVzc2lvbiwgcG9wbGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwia2V5d29yZCBjXCIgfHwgdHlwZSA9PSBcImFzeW5jXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIG1heWJlZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBtYXliZW9wXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwib3BlcmF0b3JcIiB8fCB0eXBlID09IFwic3ByZWFkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiXVwiKSwgYXJyYXlMaXRlcmFsLCBwb3BsZXgsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAob2JqcHJvcCwgXCJ9XCIsIG51bGwsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJxdWFzaVwiKSByZXR1cm4gcGFzcyhxdWFzaSwgbWF5YmVvcCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIm5ld1wiKSByZXR1cm4gY29udChtYXliZVRhcmdldChub0NvbW1hKSk7XG4gICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlZXhwcmVzc2lvbih0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZS5tYXRjaCgvWztcXH1cXClcXF0sXS8pKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYXliZW9wZXJhdG9yQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiLFwiKSByZXR1cm4gY29udChtYXliZWV4cHJlc3Npb24pO1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVvcGVyYXRvck5vQ29tbWEodHlwZSwgdmFsdWUsIG5vQ29tbWEpIHtcbiAgICAgICAgICAgIHZhciBtZSA9XG4gICAgICAgICAgICAgICAgbm9Db21tYSA9PSBmYWxzZSA/IG1heWJlb3BlcmF0b3JDb21tYSA6IG1heWJlb3BlcmF0b3JOb0NvbW1hO1xuICAgICAgICAgICAgdmFyIGV4cHIgPSBub0NvbW1hID09IGZhbHNlID8gZXhwcmVzc2lvbiA6IGV4cHJlc3Npb25Ob0NvbW1hO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI9PlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgbm9Db21tYSA/IGFycm93Qm9keU5vQ29tbWEgOiBhcnJvd0JvZHksXG4gICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJvcGVyYXRvclwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKC9cXCtcXCt8LS0vLnRlc3QodmFsdWUpIHx8IChpc1RTICYmIHZhbHVlID09IFwiIVwiKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobWUpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaXNUUyAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcIjxcIiAmJlxuICAgICAgICAgICAgICAgICAgICBjeC5zdHJlYW0ubWF0Y2goL14oW148Pl18PFtePD5dKj4pKj5cXHMqXFwoLywgZmFsc2UpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZWV4cHIsIFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI6XCIpLCBleHByKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwicXVhc2lcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKHF1YXNpLCBtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRDb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgXCIpXCIsIFwiY2FsbFwiLCBtZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIGNvbnQocHJvcGVydHksIG1lKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiW1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJdXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1lXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiYXNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByLCBtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInJlZ2V4cFwiKSB7XG4gICAgICAgICAgICAgICAgY3guc3RhdGUubGFzdFR5cGUgPSBjeC5tYXJrZWQgPSBcIm9wZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgY3guc3RyZWFtLmJhY2tVcChjeC5zdHJlYW0ucG9zIC0gY3guc3RyZWFtLnN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcXVhc2kodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9IFwicXVhc2lcIikgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSAyKSAhPSBcIiR7XCIpIHJldHVybiBjb250KHF1YXNpKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlZXhwcmVzc2lvbiwgY29udGludWVRdWFzaSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29udGludWVRdWFzaSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIn1cIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwic3RyaW5nLTJcIjtcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS50b2tlbml6ZSA9IHRva2VuUXVhc2k7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocXVhc2kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFycm93Qm9keSh0eXBlKSB7XG4gICAgICAgICAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlID09IFwie1wiID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYXJyb3dCb2R5Tm9Db21tYSh0eXBlKSB7XG4gICAgICAgICAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlID09IFwie1wiID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlVGFyZ2V0KG5vQ29tbWEpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiLlwiKSByZXR1cm4gY29udChub0NvbW1hID8gdGFyZ2V0Tm9Db21tYSA6IHRhcmdldCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgaXNUUylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXliZVR5cGVBcmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gcGFzcyhub0NvbW1hID8gZXhwcmVzc2lvbk5vQ29tbWEgOiBleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdGFyZ2V0KF8sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJ0YXJnZXRcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlb3BlcmF0b3JDb21tYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdGFyZ2V0Tm9Db21tYShfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwidGFyZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZW9wZXJhdG9yTm9Db21tYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVsYWJlbCh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQocG9wbGV4LCBzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MobWF5YmVvcGVyYXRvckNvbW1hLCBleHBlY3QoXCI7XCIpLCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHByb3BlcnR5KHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9ianByb3AodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiYXN5bmNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChvYmpwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgfHwgY3guc3R5bGUgPT0gXCJrZXl3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZ2V0XCIgfHwgdmFsdWUgPT0gXCJzZXRcIikgcmV0dXJuIGNvbnQoZ2V0dGVyU2V0dGVyKTtcbiAgICAgICAgICAgICAgICB2YXIgbTsgLy8gV29yayBhcm91bmQgZmF0LWFycm93LWRldGVjdGlvbiBjb21wbGljYXRpb24gZm9yIGRldGVjdGluZyB0eXBlc2NyaXB0IHR5cGVkIGFycm93IHBhcmFtc1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaXNUUyAmJlxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5mYXRBcnJvd0F0ID09IGN4LnN0cmVhbS5zdGFydCAmJlxuICAgICAgICAgICAgICAgICAgICAobSA9IGN4LnN0cmVhbS5tYXRjaCgvXlxccyo6XFxzKi8sIGZhbHNlKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0YXRlLmZhdEFycm93QXQgPSBjeC5zdHJlYW0ucG9zICsgbVswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IGpzb25sZE1vZGUgPyBcInByb3BlcnR5XCIgOiBjeC5zdHlsZSArIFwiIHByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImpzb25sZC1rZXl3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChhZnRlcnByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJbXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBtYXliZXR5cGUsIGV4cGVjdChcIl1cIiksIGFmdGVycHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJzcHJlYWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hLCBhZnRlcnByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG9ianByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXR0ZXJTZXR0ZXIodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhhZnRlcnByb3ApO1xuICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVycHJvcCh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb21tYXNlcCh3aGF0LCBlbmQsIHNlcCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2VlZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChzZXAgPyBzZXAuaW5kZXhPZih0eXBlKSA+IC0xIDogdHlwZSA9PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGV4ID0gY3guc3RhdGUubGV4aWNhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC5pbmZvID09IFwiY2FsbFwiKSBsZXgucG9zID0gKGxleC5wb3MgfHwgMCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFzcyh3aGF0KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgcHJvY2VlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlcCAmJiBzZXAuaW5kZXhPZihcIjtcIikgPiAtMSkgcmV0dXJuIHBhc3Mod2hhdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwZWN0KGVuZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3Mod2hhdCwgcHJvY2VlZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbnRDb21tYXNlcCh3aGF0LCBlbmQsIGluZm8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAzOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBjeC5jYy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KGVuZCwgaW5mbyksIGNvbW1hc2VwKHdoYXQsIGVuZCksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYmxvY2sodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQsIGJsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZXR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc1RTKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI/XCIpIHJldHVybiBjb250KG1heWJldHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmV0eXBlT3JJbih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzVFMgJiYgKHR5cGUgPT0gXCI6XCIgfHwgdmFsdWUgPT0gXCJpblwiKSkgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlcmV0dHlwZSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB0eXBlID09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN4LnN0cmVhbS5tYXRjaCgvXlxccypcXHcrXFxzK2lzXFxiLywgZmFsc2UpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBpc0tXLCB0eXBlZXhwcik7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNLVyhfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiaXNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZWV4cHIodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImtleW9mXCIgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcInR5cGVvZlwiIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJpbmZlclwiIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJyZWFkb25seVwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh2YWx1ZSA9PSBcInR5cGVvZlwiID8gZXhwcmVzc2lvbk5vQ29tbWEgOiB0eXBlZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgfHwgdmFsdWUgPT0gXCJ2b2lkXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInR5cGVcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChhZnRlclR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHZhbHVlID09IFwiJlwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwiYXRvbVwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGFmdGVyVHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIl1cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIl1cIiwgXCIsXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyVHlwZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIntcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwifVwiKSwgdHlwZXByb3BzLCBwb3BsZXgsIGFmdGVyVHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjb21tYXNlcCh0eXBlYXJnLCBcIilcIiksIG1heWJlUmV0dXJuVHlwZSwgYWZ0ZXJUeXBlKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiPFwiKSByZXR1cm4gY29udChjb21tYXNlcCh0eXBlZXhwciwgXCI+XCIpLCB0eXBlZXhwcik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInF1YXNpXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFzcyhxdWFzaVR5cGUsIGFmdGVyVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVSZXR1cm5UeXBlKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiPT5cIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHR5cGVwcm9wcyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZS5tYXRjaCgvW1xcfVxcKVxcXV0vKSkgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiLFwiIHx8IHR5cGUgPT0gXCI7XCIpIHJldHVybiBjb250KHR5cGVwcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlcHJvcCwgdHlwZXByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlcHJvcCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCI/XCIgfHwgdHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIjpcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIltcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJ2YXJpYWJsZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmV0eXBlT3JJbixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZXByb3BcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiKFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWNsLCB0eXBlcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0eXBlLm1hdGNoKC9bO1xcfVxcKVxcXSxdLykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHF1YXNpVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT0gXCJxdWFzaVwiKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnNsaWNlKHZhbHVlLmxlbmd0aCAtIDIpICE9IFwiJHtcIikgcmV0dXJuIGNvbnQocXVhc2lUeXBlKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByLCBjb250aW51ZVF1YXNpVHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29udGludWVRdWFzaVR5cGUodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInN0cmluZy0yXCI7XG4gICAgICAgICAgICAgICAgY3guc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHF1YXNpVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZWFyZyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICh0eXBlID09IFwidmFyaWFibGVcIiAmJiBjeC5zdHJlYW0ubWF0Y2goL15cXHMqWz86XS8sIGZhbHNlKSkgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcIj9cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVhcmcpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHR5cGVhcmcpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVyVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZWV4cHIsIFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBhZnRlclR5cGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHR5cGUgPT0gXCIuXCIgfHwgdmFsdWUgPT0gXCImXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpIHJldHVybiBjb250KHR5cGVleHByLCBleHBlY3QoXCJdXCIpLCBhZnRlclR5cGUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZXh0ZW5kc1wiIHx8IHZhbHVlID09IFwiaW1wbGVtZW50c1wiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udCh0eXBlZXhwciwgZXhwZWN0KFwiOlwiKSwgdHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlVHlwZUFyZ3MoXywgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJUeXBlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlcGFyYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlZXhwciwgbWF5YmVUeXBlRGVmYXVsdCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVUeXBlRGVmYXVsdChfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiPVwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdmFyZGVmKF8sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJlbnVtXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChlbnVtZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJldHlwZSwgbWF5YmVBc3NpZ24sIHZhcmRlZkNvbnQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBhdHRlcm4odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpIHJldHVybiBjb250Q29tbWFzZXAoZWx0cGF0dGVybiwgXCJdXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAocHJvcHBhdHRlcm4sIFwifVwiKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwcm9wcGF0dGVybih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmICFjeC5zdHJlYW0ubWF0Y2goL15cXHMqOi8sIGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZUFzc2lnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCJdXCIpLCBleHBlY3QoXCI6XCIpLCBwcm9wcGF0dGVybik7XG4gICAgICAgICAgICByZXR1cm4gY29udChleHBlY3QoXCI6XCIpLCBwYXR0ZXJuLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWx0cGF0dGVybigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJlQXNzaWduKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUFzc2lnbihfdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHZhcmRlZkNvbnQodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIsXCIpIHJldHVybiBjb250KHZhcmRlZik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVlbHNlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgYlwiICYmIHZhbHVlID09IFwiZWxzZVwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIsIFwiZWxzZVwiKSwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZvcnNwZWModHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImF3YWl0XCIpIHJldHVybiBjb250KGZvcnNwZWMpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCIpXCIpLCBmb3JzcGVjMSwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3JzcGVjMSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhclwiKSByZXR1cm4gY29udCh2YXJkZWYsIGZvcnNwZWMyKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzIpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoZm9yc3BlYzIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZvcnNwZWMyKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIilcIikgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udChmb3JzcGVjMik7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJpblwiIHx8IHZhbHVlID09IFwib2ZcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cHJlc3Npb24sIGZvcnNwZWMyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGZvcnNwZWMyKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmdW5jdGlvbmRlZih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKGZ1bmFyZywgXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1heWJlcmV0dHlwZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25kZWZcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZ1bmN0aW9uZGVjbCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWNsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbmRlY2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVyZXR0eXBlLFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25kZWNsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlbmFtZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkXCIgfHwgdHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInR5cGVcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlbmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09IFwiPFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLCBwb3BsZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZ1bmFyZyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiQFwiKSBjb250KGV4cHJlc3Npb24sIGZ1bmFyZyk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udChmdW5hcmcpO1xuICAgICAgICAgICAgaWYgKGlzVFMgJiYgaXNNb2RpZmllcih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5hcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzVFMgJiYgdHlwZSA9PSBcInRoaXNcIikgcmV0dXJuIGNvbnQobWF5YmV0eXBlLCBtYXliZUFzc2lnbik7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZXR5cGUsIG1heWJlQXNzaWduKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGFzc0V4cHJlc3Npb24odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIC8vIENsYXNzIGV4cHJlc3Npb25zIG1heSBoYXZlIGFuIG9wdGlvbmFsIG5hbWUuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHJldHVybiBjbGFzc05hbWUodHlwZSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZUFmdGVyKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGFzc05hbWUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc05hbWVBZnRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NOYW1lQWZ0ZXIodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZUFmdGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImV4dGVuZHNcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlID09IFwiaW1wbGVtZW50c1wiIHx8XG4gICAgICAgICAgICAgICAgKGlzVFMgJiYgdHlwZSA9PSBcIixcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImltcGxlbWVudHNcIikgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoaXNUUyA/IHR5cGVleHByIDogZXhwcmVzc2lvbiwgY2xhc3NOYW1lQWZ0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJ9XCIpLCBjbGFzc0JvZHksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NCb2R5KHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZSA9PSBcImFzeW5jXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09IFwic3RhdGljXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID09IFwiZ2V0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID09IFwic2V0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RyZWFtLm1hdGNoKC9eXFxzK1tcXHckXFx4YTEtXFx1ZmZmZl0vLCBmYWxzZSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc0JvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNsYXNzZmllbGQsIGNsYXNzQm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc2ZpZWxkLCBjbGFzc0JvZHkpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIG1heWJldHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NmaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NCb2R5XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNsYXNzQm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB0eXBlID09IFwiKFwiKSByZXR1cm4gcGFzcyhmdW5jdGlvbmRlY2wsIGNsYXNzQm9keSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIiB8fCB0eXBlID09IFwiLFwiKSByZXR1cm4gY29udChjbGFzc0JvZHkpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJAXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGNsYXNzQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NmaWVsZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiIVwiKSByZXR1cm4gY29udChjbGFzc2ZpZWxkKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIsIG1heWJlQXNzaWduKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjeC5zdGF0ZS5sZXhpY2FsLnByZXYsXG4gICAgICAgICAgICAgICAgaXNJbnRlcmZhY2UgPSBjb250ZXh0ICYmIGNvbnRleHQuaW5mbyA9PSBcImludGVyZmFjZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoaXNJbnRlcmZhY2UgPyBmdW5jdGlvbmRlY2wgOiBmdW5jdGlvbmRlZik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWZ0ZXJFeHBvcnQodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI7XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNvbW1hc2VwKGV4cG9ydEZpZWxkLCBcIn1cIiksIG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4cG9ydEZpZWxkKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJhc1wiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwZWN0KFwidmFyaWFibGVcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSwgZXhwb3J0RmllbGQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVySW1wb3J0KHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3RyaW5nXCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIHBhc3MobWF5YmVvcGVyYXRvckNvbW1hKTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKGltcG9ydFNwZWMsIG1heWJlTW9yZUltcG9ydHMsIG1heWJlRnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW1wb3J0U3BlYyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAoaW1wb3J0U3BlYywgXCJ9XCIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCIqXCIpIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQobWF5YmVBcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVNb3JlSW1wb3J0cyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoaW1wb3J0U3BlYywgbWF5YmVNb3JlSW1wb3J0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVBcyhfdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImFzXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChpbXBvcnRTcGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUZyb20oX3R5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJmcm9tXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhcnJheUxpdGVyYWwodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJdXCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhjb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgXCJdXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlbnVtZGVmKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoXG4gICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICBleHBlY3QoXCJ7XCIpLFxuICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgIGNvbW1hc2VwKGVudW1tZW1iZXIsIFwifVwiKSxcbiAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVudW1tZW1iZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0NvbnRpbnVlZFN0YXRlbWVudChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlID09IFwib3BlcmF0b3JcIiB8fFxuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlID09IFwiLFwiIHx8XG4gICAgICAgICAgICAgICAgaXNPcGVyYXRvckNoYXIudGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKSB8fFxuICAgICAgICAgICAgICAgIC9bLC5dLy50ZXN0KHRleHRBZnRlci5jaGFyQXQoMCkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbkFsbG93ZWQoc3RyZWFtLCBzdGF0ZSwgYmFja1VwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkJhc2UgJiZcbiAgICAgICAgICAgICAgICAgICAgL14oPzpvcGVyYXRvcnxzb2Z8a2V5d29yZCBbYmNkXXxjYXNlfG5ld3xleHBvcnR8ZGVmYXVsdHxzcHJlYWR8W1xcW3t9XFwoLDs6XXw9PikkLy50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUubGFzdFR5cGVcbiAgICAgICAgICAgICAgICAgICAgKSkgfHxcbiAgICAgICAgICAgICAgICAoc3RhdGUubGFzdFR5cGUgPT0gXCJxdWFzaVwiICYmXG4gICAgICAgICAgICAgICAgICAgIC9cXHtcXHMqJC8udGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5zdHJpbmcuc2xpY2UoMCwgc3RyZWFtLnBvcyAtIChiYWNrVXAgfHwgMCkpXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW50ZXJmYWNlXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0U3RhdGU6IGZ1bmN0aW9uIChiYXNlY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbml6ZTogdG9rZW5CYXNlLFxuICAgICAgICAgICAgICAgICAgICBsYXN0VHlwZTogXCJzb2ZcIixcbiAgICAgICAgICAgICAgICAgICAgY2M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsOiBuZXcgSlNMZXhpY2FsKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJhc2Vjb2x1bW4gfHwgMCkgLSBpbmRlbnRVbml0LFxuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsVmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlckNvbmZpZy5sb2NhbFZhcnMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb250ZXh0KG51bGwsIG51bGwsIGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ZWQ6IGJhc2Vjb2x1bW4gfHwgMCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzID09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmdsb2JhbFZhcnMgPSBwYXJzZXJDb25maWcuZ2xvYmFsVmFycztcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b2tlbjogZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eShcImFsaWduXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbC5hbGlnbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pbmRlbnRlZCA9IHN0cmVhbS5pbmRlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBmaW5kRmF0QXJyb3coc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS50b2tlbml6ZSAhPSB0b2tlbkNvbW1lbnQgJiYgc3RyZWFtLmVhdFNwYWNlKCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gc3R5bGU7XG4gICAgICAgICAgICAgICAgc3RhdGUubGFzdFR5cGUgPVxuICAgICAgICAgICAgICAgICAgICB0eXBlID09IFwib3BlcmF0b3JcIiAmJiAoY29udGVudCA9PSBcIisrXCIgfHwgY29udGVudCA9PSBcIi0tXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiaW5jZGVjXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdHlwZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VKUyhzdGF0ZSwgc3R5bGUsIHR5cGUsIGNvbnRlbnQsIHN0cmVhbSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbmRlbnQ6IGZ1bmN0aW9uIChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkNvbW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPT0gdG9rZW5RdWFzaVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvZGVNaXJyb3IuUGFzcztcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5CYXNlKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RDaGFyID0gdGV4dEFmdGVyICYmIHRleHRBZnRlci5jaGFyQXQoMCksXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLFxuICAgICAgICAgICAgICAgICAgICB0b3A7XG4gICAgICAgICAgICAgICAgLy8gS2x1ZGdlIHRvIHByZXZlbnQgJ21heWJlbHNlJyBmcm9tIGJsb2NraW5nIGxleGljYWwgc2NvcGUgcG9wc1xuICAgICAgICAgICAgICAgIGlmICghL15cXHMqZWxzZVxcYi8udGVzdCh0ZXh0QWZ0ZXIpKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhdGUuY2MubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gc3RhdGUuY2NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PSBwb3BsZXgpIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjICE9IG1heWJlZWxzZSAmJiBjICE9IHBvcGNvbnRleHQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICAgICAgICAobGV4aWNhbC50eXBlID09IFwic3RhdFwiIHx8IGxleGljYWwudHlwZSA9PSBcImZvcm1cIikgJiZcbiAgICAgICAgICAgICAgICAgICAgKGZpcnN0Q2hhciA9PSBcIn1cIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCh0b3AgPSBzdGF0ZS5jY1tzdGF0ZS5jYy5sZW5ndGggLSAxXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG9wID09IG1heWJlb3BlcmF0b3JDb21tYSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3AgPT0gbWF5YmVvcGVyYXRvck5vQ29tbWEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIS9eWyxcXC49K1xcLSo6P1tcXChdLy50ZXN0KHRleHRBZnRlcikpKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbCA9IGxleGljYWwucHJldjtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudEluZGVudCAmJlxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLnR5cGUgPT0gXCIpXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC5wcmV2LnR5cGUgPT0gXCJzdGF0XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBsZXhpY2FsLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NpbmcgPSBmaXJzdENoYXIgPT0gdHlwZTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyZGVmXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLmluZGVudGVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgc3RhdGUubGFzdFR5cGUgPT0gXCIsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGxleGljYWwuaW5mby5sZW5ndGggKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJmb3JtXCIgJiYgZmlyc3RDaGFyID09IFwie1wiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwiZm9ybVwiKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIGluZGVudFVuaXQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcInN0YXRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleGljYWwuaW5kZW50ZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGlzQ29udGludWVkU3RhdGVtZW50KHN0YXRlLCB0ZXh0QWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzdGF0ZW1lbnRJbmRlbnQgfHwgaW5kZW50VW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC5pbmZvID09IFwic3dpdGNoXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgIWNsb3NpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyQ29uZmlnLmRvdWJsZUluZGVudFN3aXRjaCAhPSBmYWxzZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleGljYWwuaW5kZW50ZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKC9eKD86Y2FzZXxkZWZhdWx0KVxcYi8udGVzdCh0ZXh0QWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbmRlbnRVbml0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAyICogaW5kZW50VW5pdClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsZXhpY2FsLmFsaWduKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGV4aWNhbC5jb2x1bW4gKyAoY2xvc2luZyA/IDAgOiAxKTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGNsb3NpbmcgPyAwIDogaW5kZW50VW5pdCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbGVjdHJpY0lucHV0OiAvXlxccyooPzpjYXNlIC4qPzp8ZGVmYXVsdDp8XFx7fFxcfSkkLyxcbiAgICAgICAgICAgIGJsb2NrQ29tbWVudFN0YXJ0OiBqc29uTW9kZSA/IG51bGwgOiBcIi8qXCIsXG4gICAgICAgICAgICBibG9ja0NvbW1lbnRFbmQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiKi9cIixcbiAgICAgICAgICAgIGJsb2NrQ29tbWVudENvbnRpbnVlOiBqc29uTW9kZSA/IG51bGwgOiBcIiAqIFwiLFxuICAgICAgICAgICAgbGluZUNvbW1lbnQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiLy9cIixcbiAgICAgICAgICAgIGZvbGQ6IFwiYnJhY2VcIixcbiAgICAgICAgICAgIGNsb3NlQnJhY2tldHM6IFwiKClbXXt9JydcXFwiXFxcImBgXCIsXG5cbiAgICAgICAgICAgIGhlbHBlclR5cGU6IGpzb25Nb2RlID8gXCJqc29uXCIgOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAgICAgIGpzb25sZE1vZGU6IGpzb25sZE1vZGUsXG4gICAgICAgICAgICBqc29uTW9kZToganNvbk1vZGUsXG5cbiAgICAgICAgICAgIGV4cHJlc3Npb25BbGxvd2VkOiBleHByZXNzaW9uQWxsb3dlZCxcblxuICAgICAgICAgICAgc2tpcEV4cHJlc3Npb246IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHBhcnNlSlMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBcImF0b21cIixcbiAgICAgICAgICAgICAgICAgICAgXCJhdG9tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0oXCJcIiwgMiwgbnVsbClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIENvZGVNaXJyb3IucmVnaXN0ZXJIZWxwZXIoXCJ3b3JkQ2hhcnNcIiwgXCJqYXZhc2NyaXB0XCIsIC9bXFx3JF0vKTtcblxuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcInRleHQvamF2YXNjcmlwdFwiLCBcImphdmFzY3JpcHRcIik7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC9lY21hc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi94LWphdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2VjbWFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2pzb25cIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi94LWpzb25cIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9tYW5pZmVzdCtqc29uXCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vbGQranNvblwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICBqc29ubGQ6IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC90eXBlc2NyaXB0XCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vdHlwZXNjcmlwdFwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgIH0pO1xufSk7XG4iLCIvLyBDb2RlTWlycm9yLCBjb3B5cmlnaHQgKGMpIGJ5IE1hcmlqbiBIYXZlcmJla2UgYW5kIG90aGVyc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgYW4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uIHRoYXQgYWxsb3dzIG1vZGVzIHRvIGJlIGNvbWJpbmVkLiBUaGUgbW9kZSBnaXZlblxuLy8gYXMgdGhlIGJhc2UgYXJndW1lbnQgdGFrZXMgY2FyZSBvZiBtb3N0IG9mIHRoZSBub3JtYWwgbW9kZVxuLy8gZnVuY3Rpb25hbGl0eSwgYnV0IGEgc2Vjb25kICh0eXBpY2FsbHkgc2ltcGxlKSBtb2RlIGlzIHVzZWQsIHdoaWNoXG4vLyBjYW4gb3ZlcnJpZGUgdGhlIHN0eWxlIG9mIHRleHQuIEJvdGggbW9kZXMgZ2V0IHRvIHBhcnNlIGFsbCBvZiB0aGVcbi8vIHRleHQsIGJ1dCB3aGVuIGJvdGggYXNzaWduIGEgbm9uLW51bGwgc3R5bGUgdG8gYSBwaWVjZSBvZiBjb2RlLCB0aGVcbi8vIG92ZXJsYXkgd2lucywgdW5sZXNzIHRoZSBjb21iaW5lIGFyZ3VtZW50IHdhcyB0cnVlIGFuZCBub3Qgb3ZlcnJpZGRlbixcbi8vIG9yIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyB3YXMgdHJ1ZSwgaW4gd2hpY2ggY2FzZSB0aGUgc3R5bGVzIGFyZVxuLy8gY29tYmluZWQuXG5cbihmdW5jdGlvbiAobW9kKSB7XG4gICAgbW9kKHdpbmRvdy5Db2RlTWlycm9yKTtcbn0pKGZ1bmN0aW9uIChDb2RlTWlycm9yKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBDb2RlTWlycm9yLmN1c3RvbU92ZXJsYXlNb2RlID0gZnVuY3Rpb24gKGJhc2UsIG92ZXJsYXksIGNvbWJpbmUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0U3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiBDb2RlTWlycm9yLnN0YXJ0U3RhdGUoYmFzZSksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IENvZGVNaXJyb3Iuc3RhcnRTdGF0ZShvdmVybGF5KSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZVBvczogMCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVBvczogMCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtU2VlbjogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcHlTdGF0ZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogQ29kZU1pcnJvci5jb3B5U3RhdGUoYmFzZSwgc3RhdGUuYmFzZSksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IENvZGVNaXJyb3IuY29weVN0YXRlKG92ZXJsYXksIHN0YXRlLm92ZXJsYXkpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlUG9zOiBzdGF0ZS5iYXNlUG9zLFxuICAgICAgICAgICAgICAgICAgICBiYXNlQ3VyOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5UG9zOiBzdGF0ZS5vdmVybGF5UG9zLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q3VyOiBudWxsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b2tlbjogZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbSAhPSBzdGF0ZS5zdHJlYW1TZWVuIHx8XG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlLmJhc2VQb3MsIHN0YXRlLm92ZXJsYXlQb3MpIDwgc3RyZWFtLnN0YXJ0XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnN0cmVhbVNlZW4gPSBzdHJlYW07XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmJhc2VQb3MgPSBzdGF0ZS5vdmVybGF5UG9zID0gc3RyZWFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzdHJlYW0uc3RhcnQgPT0gc3RhdGUuYmFzZVBvcykge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlQ3VyID0gYmFzZS50b2tlbihzdHJlYW0sIHN0YXRlLmJhc2UpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlUG9zID0gc3RyZWFtLnBvcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5zdGFydCA9PSBzdGF0ZS5vdmVybGF5UG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5wb3MgPSBzdHJlYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgPSBvdmVybGF5LnRva2VuKHN0cmVhbSwgc3RhdGUub3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlQb3MgPSBzdHJlYW0ucG9zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJlYW0ucG9zID0gTWF0aC5taW4oc3RhdGUuYmFzZVBvcywgc3RhdGUub3ZlcmxheVBvcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBFZGdlIGNhc2UgZm9yIGNvZGVibG9ja3MgaW4gdGVtcGxhdGVyIG1vZGVcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmJhc2VDdXIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheUN1ciAmJlxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlQ3VyLmNvbnRhaW5zKFwibGluZS1IeXBlck1ELWNvZGVibG9ja1wiKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vdmVybGF5Q3VyID0gc3RhdGUub3ZlcmxheUN1ci5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5lLXRlbXBsYXRlci1pbmxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheUN1ciArPSBgIGxpbmUtYmFja2dyb3VuZC1IeXBlck1ELWNvZGVibG9jay1iZ2A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc3RhdGUub3ZlcmxheS5jb21iaW5lVG9rZW5zIGFsd2F5cyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgY29tYmluZSxcbiAgICAgICAgICAgICAgICAvLyB1bmxlc3Mgc2V0IHRvIG51bGxcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUub3ZlcmxheUN1ciA9PSBudWxsKSByZXR1cm4gc3RhdGUuYmFzZUN1cjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHN0YXRlLmJhc2VDdXIgIT0gbnVsbCAmJiBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMpIHx8XG4gICAgICAgICAgICAgICAgICAgIChjb21iaW5lICYmIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmJhc2VDdXIgKyBcIiBcIiArIHN0YXRlLm92ZXJsYXlDdXI7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc3RhdGUub3ZlcmxheUN1cjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGluZGVudDpcbiAgICAgICAgICAgICAgICBiYXNlLmluZGVudCAmJlxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzdGF0ZSwgdGV4dEFmdGVyLCBsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNlLmluZGVudChzdGF0ZS5iYXNlLCB0ZXh0QWZ0ZXIsIGxpbmUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbGVjdHJpY0NoYXJzOiBiYXNlLmVsZWN0cmljQ2hhcnMsXG5cbiAgICAgICAgICAgIGlubmVyTW9kZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdGU6IHN0YXRlLmJhc2UsIG1vZGU6IGJhc2UgfTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGJsYW5rTGluZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VUb2tlbiwgb3ZlcmxheVRva2VuO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlLmJsYW5rTGluZSkgYmFzZVRva2VuID0gYmFzZS5ibGFua0xpbmUoc3RhdGUuYmFzZSk7XG4gICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkuYmxhbmtMaW5lKVxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5VG9rZW4gPSBvdmVybGF5LmJsYW5rTGluZShzdGF0ZS5vdmVybGF5KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBvdmVybGF5VG9rZW4gPT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICA/IGJhc2VUb2tlblxuICAgICAgICAgICAgICAgICAgICA6IGNvbWJpbmUgJiYgYmFzZVRva2VuICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyBiYXNlVG9rZW4gKyBcIiBcIiArIG92ZXJsYXlUb2tlblxuICAgICAgICAgICAgICAgICAgICA6IG92ZXJsYXlUb2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfTtcbn0pO1xuIiwiaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEN1cnNvckp1bXBlciB9IGZyb20gXCJlZGl0b3IvQ3Vyc29ySnVtcGVyXCI7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tIFwiTG9nXCI7XG5cbmltcG9ydCBcImVkaXRvci9tb2RlL2phdmFzY3JpcHRcIjtcbmltcG9ydCBcImVkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5XCI7XG4vL2ltcG9ydCBcImVkaXRvci9tb2RlL3Nob3ctaGludFwiO1xuXG5jb25zdCBUUF9DTURfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1jb21tYW5kXCI7XG5jb25zdCBUUF9JTkxJTkVfQ0xBU1MgPSBcInRlbXBsYXRlci1pbmxpbmVcIjtcblxuY29uc3QgVFBfT1BFTklOR19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1vcGVuaW5nLXRhZ1wiO1xuY29uc3QgVFBfQ0xPU0lOR19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1jbG9zaW5nLXRhZ1wiO1xuXG5jb25zdCBUUF9JTlRFUlBPTEFUSU9OX1RBR19UT0tFTl9DTEFTUyA9IFwidGVtcGxhdGVyLWludGVycG9sYXRpb24tdGFnXCI7XG5jb25zdCBUUF9SQVdfVEFHX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItcmF3LXRhZ1wiO1xuY29uc3QgVFBfRVhFQ19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1leGVjdXRpb24tdGFnXCI7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3Ige1xuICAgIHByaXZhdGUgY3Vyc29yX2p1bXBlcjogQ3Vyc29ySnVtcGVyO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5jdXJzb3JfanVtcGVyID0gbmV3IEN1cnNvckp1bXBlcih0aGlzLmFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0dXAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMucmVnaXN0ZXJDb2RlTWlycm9yTW9kZSgpO1xuICAgICAgICAvL2F3YWl0IHRoaXMucmVnaXN0ZXJIaW50ZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmN1cnNvcl9qdW1wZXIuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlZ2lzdGVyQ29kZU1pcnJvck1vZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIGNtLWVkaXRvci1zeW50YXgtaGlnaGxpZ2h0LW9ic2lkaWFuIHBsdWdpblxuICAgICAgICAvLyBodHRwczovL2NvZGVtaXJyb3IubmV0L2RvYy9tYW51YWwuaHRtbCNtb2RlYXBpXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZW1pcnJvci5uZXQvbW9kZS9kaWZmL2RpZmYuanNcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9kZW1vL211c3RhY2hlLmh0bWxcbiAgICAgICAgLy8gaHR0cHM6Ly9tYXJpam5oYXZlcmJla2UubmwvYmxvZy9jb2RlbWlycm9yLW1vZGUtc3lzdGVtLmh0bWxcblxuICAgICAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGpzX21vZGUgPSB3aW5kb3cuQ29kZU1pcnJvci5nZXRNb2RlKHt9LCBcImphdmFzY3JpcHRcIik7XG4gICAgICAgIGlmIChqc19tb2RlLm5hbWUgPT09IFwibnVsbFwiKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkphdmFzY3JpcHQgc3ludGF4IG1vZGUgY291bGRuJ3QgYmUgZm91bmQsIGNhbid0IGVuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEN1c3RvbSBvdmVybGF5IG1vZGUgdXNlZCB0byBoYW5kbGUgZWRnZSBjYXNlc1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IG92ZXJsYXlfbW9kZSA9IHdpbmRvdy5Db2RlTWlycm9yLmN1c3RvbU92ZXJsYXlNb2RlO1xuICAgICAgICBpZiAob3ZlcmxheV9tb2RlID09IG51bGwpIHtcbiAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGRuJ3QgZmluZCBjdXN0b21PdmVybGF5TW9kZSwgY2FuJ3QgZW5hYmxlIHN5bnRheCBoaWdobGlnaHRpbmcuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkNvZGVNaXJyb3IuZGVmaW5lTW9kZShcInRlbXBsYXRlclwiLCBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZXJPdmVybGF5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0U3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNfc3RhdGUgPSB3aW5kb3cuQ29kZU1pcnJvci5zdGFydFN0YXRlKGpzX21vZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uanNfc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbkNvbW1hbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2NsYXNzOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZUxpbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29weVN0YXRlOiBmdW5jdGlvbiAoc3RhdGU6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc19zdGF0ZSA9IHdpbmRvdy5Db2RlTWlycm9yLnN0YXJ0U3RhdGUoanNfbW9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld19zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmpzX3N0YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5Db21tYW5kOiBzdGF0ZS5pbkNvbW1hbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfY2xhc3M6IHN0YXRlLnRhZ19jbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyZWVMaW5lOiBzdGF0ZS5mcmVlTGluZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld19zdGF0ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJsYW5rTGluZTogZnVuY3Rpb24gKHN0YXRlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmluQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBsaW5lLWJhY2tncm91bmQtdGVtcGxhdGVyLWNvbW1hbmQtYmdgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9rZW46IGZ1bmN0aW9uIChzdHJlYW06IGFueSwgc3RhdGU6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnNvbCgpICYmIHN0YXRlLmluQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnJlZUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmluQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleXdvcmRzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJlYW0ubWF0Y2goL1stX117MCwxfSU+LywgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pbkNvbW1hbmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5mcmVlTGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhZ19jbGFzcyA9IHN0YXRlLnRhZ19jbGFzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBsaW5lLSR7VFBfSU5MSU5FX0NMQVNTfSAke1RQX0NNRF9UT0tFTl9DTEFTU30gJHtUUF9DTE9TSU5HX1RBR19UT0tFTl9DTEFTU30gJHt0YWdfY2xhc3N9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QganNfcmVzdWx0ID0ganNfbW9kZS50b2tlbihzdHJlYW0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJlYW0ucGVlaygpID09IG51bGwgJiYgc3RhdGUuZnJlZUxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXl3b3JkcyArPSBgIGxpbmUtYmFja2dyb3VuZC10ZW1wbGF0ZXItY29tbWFuZC1iZ2A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXRlLmZyZWVMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5d29yZHMgKz0gYCBsaW5lLSR7VFBfSU5MSU5FX0NMQVNTfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtrZXl3b3Jkc30gJHtUUF9DTURfVE9LRU5fQ0xBU1N9ICR7anNfcmVzdWx0fWA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHN0cmVhbS5tYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIC88JVstX117MCwxfVxccyooWyp+K117MCwxfSkvLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLnRhZ19jbGFzcyA9IFRQX0VYRUNfVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiflwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPSBUUF9SQVdfVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVFBfSU5URVJQT0xBVElPTl9UQUdfVE9LRU5fQ0xBU1M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5Db21tYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS0ke1RQX0lOTElORV9DTEFTU30gJHtUUF9DTURfVE9LRU5fQ0xBU1N9ICR7VFBfT1BFTklOR19UQUdfVE9LRU5fQ0xBU1N9ICR7c3RhdGUudGFnX2NsYXNzfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RyZWFtLm5leHQoKSAhPSBudWxsICYmICFzdHJlYW0ubWF0Y2goLzwlLywgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gb3ZlcmxheV9tb2RlKFxuICAgICAgICAgICAgICAgIHdpbmRvdy5Db2RlTWlycm9yLmdldE1vZGUoY29uZmlnLCBcImh5cGVybWRcIiksXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVyT3ZlcmxheVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVnaXN0ZXJIaW50ZXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLypcbiAgICAgICAgYXdhaXQgZGVsYXkoMTAwMCk7XG5cbiAgICAgICAgdmFyIGNvbXAgPSBbXG4gICAgICAgICAgICBbXCJoZXJlXCIsIFwiaGl0aGVyXCJdLFxuICAgICAgICAgICAgW1wiYXN5bmNocm9ub3VzXCIsIFwibm9uc3luY2hyb25vdXNcIl0sXG4gICAgICAgICAgICBbXCJjb21wbGV0aW9uXCIsIFwiYWNoaWV2ZW1lbnRcIiwgXCJjb25jbHVzaW9uXCIsIFwiY3VsbWluYXRpb25cIiwgXCJleHBpcmF0aW9uc1wiXSxcbiAgICAgICAgICAgIFtcImhpbnRpbmdcIiwgXCJhZHZpc2VcIiwgXCJicm9hY2hcIiwgXCJpbXBseVwiXSxcbiAgICAgICAgICAgIFtcImZ1bmN0aW9uXCIsXCJhY3Rpb25cIl0sXG4gICAgICAgICAgICBbXCJwcm92aWRlXCIsIFwiYWRkXCIsIFwiYnJpbmdcIiwgXCJnaXZlXCJdLFxuICAgICAgICAgICAgW1wic3lub255bXNcIiwgXCJlcXVpdmFsZW50c1wiXSxcbiAgICAgICAgICAgIFtcIndvcmRzXCIsIFwidG9rZW5cIl0sXG4gICAgICAgICAgICBbXCJlYWNoXCIsIFwiZXZlcnlcIl0sXG4gICAgICAgIF07XG4gICAgXG4gICAgICAgIGZ1bmN0aW9uIHN5bm9ueW1zKGNtOiBhbnksIG9wdGlvbjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnNvciA9IGNtLmdldEN1cnNvcigpLCBsaW5lID0gY20uZ2V0TGluZShjdXJzb3IubGluZSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gY3Vyc29yLmNoLCBlbmQgPSBjdXJzb3IuY2hcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN0YXJ0ICYmIC9cXHcvLnRlc3QobGluZS5jaGFyQXQoc3RhcnQgLSAxKSkpIC0tc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVuZCA8IGxpbmUubGVuZ3RoICYmIC9cXHcvLnRlc3QobGluZS5jaGFyQXQoZW5kKSkpICsrZW5kXG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JkID0gbGluZS5zbGljZShzdGFydCwgZW5kKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBbaV0uaW5kZXhPZih3b3JkKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NlcHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBjb21wW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB3aW5kb3cuQ29kZU1pcnJvci5Qb3MoY3Vyc29yLmxpbmUsIHN0YXJ0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG86IHdpbmRvdy5Db2RlTWlycm9yLlBvcyhjdXJzb3IubGluZSwgZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NlcHQobnVsbCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJjb2RlbWlycm9yXCIsIGNtID0+IHtcbiAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImV4dHJhS2V5c1wiLCB7XCJDdHJsLVNwYWNlXCI6IFwiYXV0b2NvbXBsZXRlXCJ9KTtcbiAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImhpbnRPcHRpb25zXCIsIHtoaW50OiBzeW5vbnltc30pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKGNtID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ006XCIsIGNtKTtcbiAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImV4dHJhS2V5c1wiLCB7XCJTcGFjZVwiOiBcImF1dG9jb21wbGV0ZVwifSk7XG4gICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJoaW50T3B0aW9uc1wiLCB7aGludDogc3lub255bXN9KTtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuXG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcblxuZnVuY3Rpb24gc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XHJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8vIFRoaXMgaXMgcHJldHR5IG11Y2ggdGhlIG9ubHkgd2F5IHRvIGdldCBuaWNlLCBleHRlbmRlZCBFcnJvcnNcclxuLy8gd2l0aG91dCB1c2luZyBFUzZcclxuLyoqXHJcbiAqIFRoaXMgcmV0dXJucyBhIG5ldyBFcnJvciB3aXRoIGEgY3VzdG9tIHByb3RvdHlwZS4gTm90ZSB0aGF0IGl0J3MgX25vdF8gYSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnZSBFcnJvciBtZXNzYWdlXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIHRocm93IEV0YUVycihcInRlbXBsYXRlIG5vdCBmb3VuZFwiKVxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIEV0YUVycihtZXNzYWdlKSB7XHJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgc2V0UHJvdG90eXBlT2YoZXJyLCBFdGFFcnIucHJvdG90eXBlKTtcclxuICAgIHJldHVybiBlcnI7XHJcbn1cclxuRXRhRXJyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7XHJcbiAgICBuYW1lOiB7IHZhbHVlOiAnRXRhIEVycm9yJywgZW51bWVyYWJsZTogZmFsc2UgfVxyXG59KTtcclxuLyoqXHJcbiAqIFRocm93cyBhbiBFdGFFcnIgd2l0aCBhIG5pY2VseSBmb3JtYXR0ZWQgZXJyb3IgYW5kIG1lc3NhZ2Ugc2hvd2luZyB3aGVyZSBpbiB0aGUgdGVtcGxhdGUgdGhlIGVycm9yIG9jY3VycmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gUGFyc2VFcnIobWVzc2FnZSwgc3RyLCBpbmR4KSB7XHJcbiAgICB2YXIgd2hpdGVzcGFjZSA9IHN0ci5zbGljZSgwLCBpbmR4KS5zcGxpdCgvXFxuLyk7XHJcbiAgICB2YXIgbGluZU5vID0gd2hpdGVzcGFjZS5sZW5ndGg7XHJcbiAgICB2YXIgY29sTm8gPSB3aGl0ZXNwYWNlW2xpbmVObyAtIDFdLmxlbmd0aCArIDE7XHJcbiAgICBtZXNzYWdlICs9XHJcbiAgICAgICAgJyBhdCBsaW5lICcgK1xyXG4gICAgICAgICAgICBsaW5lTm8gK1xyXG4gICAgICAgICAgICAnIGNvbCAnICtcclxuICAgICAgICAgICAgY29sTm8gK1xyXG4gICAgICAgICAgICAnOlxcblxcbicgK1xyXG4gICAgICAgICAgICAnICAnICtcclxuICAgICAgICAgICAgc3RyLnNwbGl0KC9cXG4vKVtsaW5lTm8gLSAxXSArXHJcbiAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgJyAgJyArXHJcbiAgICAgICAgICAgIEFycmF5KGNvbE5vKS5qb2luKCcgJykgK1xyXG4gICAgICAgICAgICAnXic7XHJcbiAgICB0aHJvdyBFdGFFcnIobWVzc2FnZSk7XHJcbn1cblxuLyoqXHJcbiAqIEByZXR1cm5zIFRoZSBnbG9iYWwgUHJvbWlzZSBmdW5jdGlvblxyXG4gKi9cclxudmFyIHByb21pc2VJbXBsID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCkuUHJvbWlzZTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIEEgbmV3IEFzeW5jRnVuY3Rpb24gY29uc3R1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXN5bmNGdW5jdGlvbkNvbnN0cnVjdG9yKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gKGFzeW5jIGZ1bmN0aW9uKCl7fSkuY29uc3RydWN0b3InKSgpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlRoaXMgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IGFzeW5jL2F3YWl0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIHN0ci50cmltTGVmdCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCBsZWZ0IHdoaXRlc3BhY2UgcmVtb3ZlZFxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XHJcbiAgICBpZiAoISFTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltTGVmdCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKy8sICcnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogc3RyLnRyaW1SaWdodCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCByaWdodCB3aGl0ZXNwYWNlIHJlbW92ZWRcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1SaWdodChzdHIpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcclxuICAgIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltUmlnaHQoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKyQvLCAnJyk7IC8vIFRPRE86IGRvIHdlIHJlYWxseSBuZWVkIHRvIHJlcGxhY2UgQk9NJ3M/XHJcbiAgICB9XHJcbn1cblxuLy8gVE9ETzogYWxsb3cgJy0nIHRvIHRyaW0gdXAgdW50aWwgbmV3bGluZS4gVXNlIFteXFxTXFxuXFxyXSBpbnN0ZWFkIG9mIFxcc1xyXG4vKiBFTkQgVFlQRVMgKi9cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIHByb3ApIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcclxufVxyXG5mdW5jdGlvbiBjb3B5UHJvcHModG9PYmosIGZyb21PYmopIHtcclxuICAgIGZvciAodmFyIGtleSBpbiBmcm9tT2JqKSB7XHJcbiAgICAgICAgaWYgKGhhc093blByb3AoZnJvbU9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICB0b09ialtrZXldID0gZnJvbU9ialtrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b09iajtcclxufVxyXG4vKipcclxuICogVGFrZXMgYSBzdHJpbmcgd2l0aGluIGEgdGVtcGxhdGUgYW5kIHRyaW1zIGl0LCBiYXNlZCBvbiB0aGUgcHJlY2VkaW5nIHRhZydzIHdoaXRlc3BhY2UgY29udHJvbCBhbmQgYGNvbmZpZy5hdXRvVHJpbWBcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1XUyhzdHIsIGNvbmZpZywgd3NMZWZ0LCB3c1JpZ2h0KSB7XHJcbiAgICB2YXIgbGVmdFRyaW07XHJcbiAgICB2YXIgcmlnaHRUcmltO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnLmF1dG9UcmltKSkge1xyXG4gICAgICAgIC8vIGtpbmRhIGNvbmZ1c2luZ1xyXG4gICAgICAgIC8vIGJ1dCBffX0gd2lsbCB0cmltIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdcclxuICAgICAgICBsZWZ0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVsxXTtcclxuICAgICAgICByaWdodFRyaW0gPSBjb25maWcuYXV0b1RyaW1bMF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZWZ0VHJpbSA9IHJpZ2h0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbTtcclxuICAgIH1cclxuICAgIGlmICh3c0xlZnQgfHwgd3NMZWZ0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIGxlZnRUcmltID0gd3NMZWZ0O1xyXG4gICAgfVxyXG4gICAgaWYgKHdzUmlnaHQgfHwgd3NSaWdodCA9PT0gZmFsc2UpIHtcclxuICAgICAgICByaWdodFRyaW0gPSB3c1JpZ2h0O1xyXG4gICAgfVxyXG4gICAgaWYgKCFyaWdodFRyaW0gJiYgIWxlZnRUcmltKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ3NsdXJwJyAmJiByaWdodFRyaW0gPT09ICdzbHVycCcpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ18nIHx8IGxlZnRUcmltID09PSAnc2x1cnAnKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyaW1taW5nIGxlZnQnICsgbGVmdFRyaW0pXHJcbiAgICAgICAgLy8gZnVsbCBzbHVycFxyXG4gICAgICAgIHN0ciA9IHRyaW1MZWZ0KHN0cik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsZWZ0VHJpbSA9PT0gJy0nIHx8IGxlZnRUcmltID09PSAnbmwnKSB7XHJcbiAgICAgICAgLy8gbmwgdHJpbVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eKD86XFxyXFxufFxcbnxcXHIpLywgJycpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJpZ2h0VHJpbSA9PT0gJ18nIHx8IHJpZ2h0VHJpbSA9PT0gJ3NsdXJwJykge1xyXG4gICAgICAgIC8vIGZ1bGwgc2x1cnBcclxuICAgICAgICBzdHIgPSB0cmltUmlnaHQoc3RyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHJpZ2h0VHJpbSA9PT0gJy0nIHx8IHJpZ2h0VHJpbSA9PT0gJ25sJykge1xyXG4gICAgICAgIC8vIG5sIHRyaW1cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvKD86XFxyXFxufFxcbnxcXHIpJC8sICcnKTsgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgZ2V0cyBcXHJcXG5cclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuLyoqXHJcbiAqIEEgbWFwIG9mIHNwZWNpYWwgSFRNTCBjaGFyYWN0ZXJzIHRvIHRoZWlyIFhNTC1lc2NhcGVkIGVxdWl2YWxlbnRzXHJcbiAqL1xyXG52YXIgZXNjTWFwID0ge1xyXG4gICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgJzwnOiAnJmx0OycsXHJcbiAgICAnPic6ICcmZ3Q7JyxcclxuICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgXCInXCI6ICcmIzM5OydcclxufTtcclxuZnVuY3Rpb24gcmVwbGFjZUNoYXIocykge1xyXG4gICAgcmV0dXJuIGVzY01hcFtzXTtcclxufVxyXG4vKipcclxuICogWE1MLWVzY2FwZXMgYW4gaW5wdXQgdmFsdWUgYWZ0ZXIgY29udmVydGluZyBpdCB0byBhIHN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgdmFsdWUgKHVzdWFsbHkgYSBzdHJpbmcpXHJcbiAqIEByZXR1cm5zIFhNTC1lc2NhcGVkIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gWE1MRXNjYXBlKHN0cikge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAvLyBUbyBkZWFsIHdpdGggWFNTLiBCYXNlZCBvbiBFc2NhcGUgaW1wbGVtZW50YXRpb25zIG9mIE11c3RhY2hlLkpTIGFuZCBNYXJrbywgdGhlbiBjdXN0b21pemVkLlxyXG4gICAgdmFyIG5ld1N0ciA9IFN0cmluZyhzdHIpO1xyXG4gICAgaWYgKC9bJjw+XCInXS8udGVzdChuZXdTdHIpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ld1N0ci5yZXBsYWNlKC9bJjw+XCInXS9nLCByZXBsYWNlQ2hhcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3U3RyO1xyXG4gICAgfVxyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG52YXIgdGVtcGxhdGVMaXRSZWcgPSAvYCg/OlxcXFxbXFxzXFxTXXxcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pKn18KD8hXFwkeylbXlxcXFxgXSkqYC9nO1xyXG52YXIgc2luZ2xlUXVvdGVSZWcgPSAvJyg/OlxcXFxbXFxzXFx3XCInXFxcXGBdfFteXFxuXFxyJ1xcXFxdKSo/Jy9nO1xyXG52YXIgZG91YmxlUXVvdGVSZWcgPSAvXCIoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxcclwiXFxcXF0pKj9cIi9nO1xyXG4vKiogRXNjYXBlIHNwZWNpYWwgcmVndWxhciBleHByZXNzaW9uIGNoYXJhY3RlcnMgaW5zaWRlIGEgc3RyaW5nICovXHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcclxuICAgIC8vIEZyb20gTUROXHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKitcXC0/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHN0ciwgY29uZmlnKSB7XHJcbiAgICB2YXIgYnVmZmVyID0gW107XHJcbiAgICB2YXIgdHJpbUxlZnRPZk5leHRTdHIgPSBmYWxzZTtcclxuICAgIHZhciBsYXN0SW5kZXggPSAwO1xyXG4gICAgdmFyIHBhcnNlT3B0aW9ucyA9IGNvbmZpZy5wYXJzZTtcclxuICAgIGlmIChjb25maWcucGx1Z2lucykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IGNvbmZpZy5wbHVnaW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAocGx1Z2luLnByb2Nlc3NUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gcGx1Z2luLnByb2Nlc3NUZW1wbGF0ZShzdHIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiBBZGRpbmcgZm9yIEVKUyBjb21wYXRpYmlsaXR5ICovXHJcbiAgICBpZiAoY29uZmlnLnJtV2hpdGVzcGFjZSkge1xyXG4gICAgICAgIC8vIENvZGUgdGFrZW4gZGlyZWN0bHkgZnJvbSBFSlNcclxuICAgICAgICAvLyBIYXZlIHRvIHVzZSB0d28gc2VwYXJhdGUgcmVwbGFjZXMgaGVyZSBhcyBgXmAgYW5kIGAkYCBvcGVyYXRvcnMgZG9uJ3RcclxuICAgICAgICAvLyB3b3JrIHdlbGwgd2l0aCBgXFxyYCBhbmQgZW1wdHkgbGluZXMgZG9uJ3Qgd29yayB3ZWxsIHdpdGggdGhlIGBtYCBmbGFnLlxyXG4gICAgICAgIC8vIEVzc2VudGlhbGx5LCB0aGlzIHJlcGxhY2VzIHRoZSB3aGl0ZXNwYWNlIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZlxyXG4gICAgICAgIC8vIGVhY2ggbGluZSBhbmQgcmVtb3ZlcyBtdWx0aXBsZSBuZXdsaW5lcy5cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvW1xcclxcbl0rL2csICdcXG4nKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xyXG4gICAgfVxyXG4gICAgLyogRW5kIHJtV2hpdGVzcGFjZSBvcHRpb24gKi9cclxuICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IDA7XHJcbiAgICBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXggPSAwO1xyXG4gICAgZG91YmxlUXVvdGVSZWcubGFzdEluZGV4ID0gMDtcclxuICAgIGZ1bmN0aW9uIHB1c2hTdHJpbmcoc3RybmcsIHNob3VsZFRyaW1SaWdodE9mU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHN0cm5nKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHN0cmluZyBpcyB0cnV0aHkgaXQgbXVzdCBiZSBvZiB0eXBlICdzdHJpbmcnXHJcbiAgICAgICAgICAgIHN0cm5nID0gdHJpbVdTKHN0cm5nLCBjb25maWcsIHRyaW1MZWZ0T2ZOZXh0U3RyLCAvLyB0aGlzIHdpbGwgb25seSBiZSBmYWxzZSBvbiB0aGUgZmlyc3Qgc3RyLCB0aGUgbmV4dCBvbmVzIHdpbGwgYmUgbnVsbCBvciB1bmRlZmluZWRcclxuICAgICAgICAgICAgc2hvdWxkVHJpbVJpZ2h0T2ZTdHJpbmcpO1xyXG4gICAgICAgICAgICBpZiAoc3RybmcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgXFwgd2l0aCBcXFxcLCAnIHdpdGggXFwnXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBjb252ZXJ0IGFsbCBDUkxGIHRvIExGIHNvIGl0IGRvZXNuJ3QgdGFrZSBtb3JlIHRoYW4gb25lIHJlcGxhY2VcclxuICAgICAgICAgICAgICAgIHN0cm5nID0gc3RybmcucmVwbGFjZSgvXFxcXHwnL2csICdcXFxcJCYnKS5yZXBsYWNlKC9cXHJcXG58XFxufFxcci9nLCAnXFxcXG4nKTtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHN0cm5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBwcmVmaXhlcyA9IFtwYXJzZU9wdGlvbnMuZXhlYywgcGFyc2VPcHRpb25zLmludGVycG9sYXRlLCBwYXJzZU9wdGlvbnMucmF3XS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBwcmVmaXgpIHtcclxuICAgICAgICBpZiAoYWNjdW11bGF0b3IgJiYgcHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArICd8JyArIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgLy8gYWNjdW11bGF0b3IgaXMgZmFsc3lcclxuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcHJlZml4IGFuZCBhY2N1bXVsYXRvciBhcmUgYm90aCBmYWxzeVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJycpO1xyXG4gICAgdmFyIHBhcnNlT3BlblJlZyA9IG5ldyBSZWdFeHAoJyhbXl0qPyknICsgZXNjYXBlUmVnRXhwKGNvbmZpZy50YWdzWzBdKSArICcoLXxfKT9cXFxccyooJyArIHByZWZpeGVzICsgJyk/XFxcXHMqKD8hW1xcXFxzK1xcXFwtXycgKyBwcmVmaXhlcyArICddKScsICdnJyk7XHJcbiAgICB2YXIgcGFyc2VDbG9zZVJlZyA9IG5ldyBSZWdFeHAoJ1xcJ3xcInxgfFxcXFwvXFxcXCp8KFxcXFxzKigtfF8pPycgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMV0pICsgJyknLCAnZycpO1xyXG4gICAgLy8gVE9ETzogYmVuY2htYXJrIGhhdmluZyB0aGUgXFxzKiBvbiBlaXRoZXIgc2lkZSB2cyB1c2luZyBzdHIudHJpbSgpXHJcbiAgICB2YXIgbTtcclxuICAgIHdoaWxlICgobSA9IHBhcnNlT3BlblJlZy5leGVjKHN0cikpKSB7XHJcbiAgICAgICAgbGFzdEluZGV4ID0gbVswXS5sZW5ndGggKyBtLmluZGV4O1xyXG4gICAgICAgIHZhciBwcmVjZWRpbmdTdHJpbmcgPSBtWzFdO1xyXG4gICAgICAgIHZhciB3c0xlZnQgPSBtWzJdO1xyXG4gICAgICAgIHZhciBwcmVmaXggPSBtWzNdIHx8ICcnOyAvLyBieSBkZWZhdWx0IGVpdGhlciB+LCA9LCBvciBlbXB0eVxyXG4gICAgICAgIHB1c2hTdHJpbmcocHJlY2VkaW5nU3RyaW5nLCB3c0xlZnQpO1xyXG4gICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gbGFzdEluZGV4O1xyXG4gICAgICAgIHZhciBjbG9zZVRhZyA9IHZvaWQgMDtcclxuICAgICAgICB2YXIgY3VycmVudE9iaiA9IGZhbHNlO1xyXG4gICAgICAgIHdoaWxlICgoY2xvc2VUYWcgPSBwYXJzZUNsb3NlUmVnLmV4ZWMoc3RyKSkpIHtcclxuICAgICAgICAgICAgaWYgKGNsb3NlVGFnWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHN0ci5zbGljZShsYXN0SW5kZXgsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgIHBhcnNlT3BlblJlZy5sYXN0SW5kZXggPSBsYXN0SW5kZXggPSBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgIHRyaW1MZWZ0T2ZOZXh0U3RyID0gY2xvc2VUYWdbMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFR5cGUgPSBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5leGVjXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnZSdcclxuICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLnJhd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLmludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRPYmogPSB7IHQ6IGN1cnJlbnRUeXBlLCB2YWw6IGNvbnRlbnQgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoYXIgPSBjbG9zZVRhZ1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFyID09PSAnLyonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1lbnRDbG9zZUluZCA9IHN0ci5pbmRleE9mKCcqLycsIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudENsb3NlSW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgY29tbWVudCcsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGNvbW1lbnRDbG9zZUluZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09IFwiJ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZVF1b3RlTWF0Y2ggPSBzaW5nbGVRdW90ZVJlZy5leGVjKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVF1b3RlTWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgc3RyaW5nJywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdWJsZVF1b3RlUmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkb3VibGVRdW90ZU1hdGNoID0gZG91YmxlUXVvdGVSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb3VibGVRdW90ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gZG91YmxlUXVvdGVSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICdgJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUxpdE1hdGNoID0gdGVtcGxhdGVMaXRSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUxpdE1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudE9iaikge1xyXG4gICAgICAgICAgICBidWZmZXIucHVzaChjdXJyZW50T2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCB0YWcnLCBzdHIsIG0uaW5kZXggKyBwcmVjZWRpbmdTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdXNoU3RyaW5nKHN0ci5zbGljZShsYXN0SW5kZXgsIHN0ci5sZW5ndGgpLCBmYWxzZSk7XHJcbiAgICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzQVNUKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBwbHVnaW4ucHJvY2Vzc0FTVChidWZmZXIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVmZmVyO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogQ29tcGlsZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgdG8gYSBmdW5jdGlvbiBzdHJpbmcuIE1vc3Qgb2Z0ZW4gdXNlcnMganVzdCB1c2UgYGNvbXBpbGUoKWAsIHdoaWNoIGNhbGxzIGBjb21waWxlVG9TdHJpbmdgIGFuZCBjcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHVzaW5nIHRoZSByZXN1bHRcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogY29tcGlsZVRvU3RyaW5nKFwiSGkgPCU9IGl0LnVzZXIgJT5cIiwgZXRhLmNvbmZpZylcclxuICogLy8gXCJ2YXIgdFI9JycsaW5jbHVkZT1FLmluY2x1ZGUuYmluZChFKSxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSk7dFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7aWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFJcIlxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGVUb1N0cmluZyhzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIGJ1ZmZlciA9IHBhcnNlKHN0ciwgY29uZmlnKTtcclxuICAgIHZhciByZXMgPSBcInZhciB0Uj0nJyxfX2wsX19sUFwiICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGUgPyAnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlID8gJyxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAnXFxuZnVuY3Rpb24gbGF5b3V0KHAsZCl7X19sPXA7X19sUD1kfVxcbicgK1xyXG4gICAgICAgIChjb25maWcuZ2xvYmFsQXdhaXQgPyAnY29uc3QgX3BycyA9IFtdO1xcbicgOiAnJykgK1xyXG4gICAgICAgIChjb25maWcudXNlV2l0aCA/ICd3aXRoKCcgKyBjb25maWcudmFyTmFtZSArICd8fHt9KXsnIDogJycpICtcclxuICAgICAgICBjb21waWxlU2NvcGUoYnVmZmVyLCBjb25maWcpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlXHJcbiAgICAgICAgICAgID8gJ2lmKF9fbCl0Uj0nICtcclxuICAgICAgICAgICAgICAgIChjb25maWcuYXN5bmMgPyAnYXdhaXQgJyA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAoXCJpbmNsdWRlRmlsZShfX2wsT2JqZWN0LmFzc2lnbihcIiArIGNvbmZpZy52YXJOYW1lICsgXCIse2JvZHk6dFJ9LF9fbFApKVxcblwiKVxyXG4gICAgICAgICAgICA6IGNvbmZpZy5pbmNsdWRlXHJcbiAgICAgICAgICAgICAgICA/ICdpZihfX2wpdFI9JyArXHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbmZpZy5hc3luYyA/ICdhd2FpdCAnIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgICAoXCJpbmNsdWRlKF9fbCxPYmplY3QuYXNzaWduKFwiICsgY29uZmlnLnZhck5hbWUgKyBcIix7Ym9keTp0Un0sX19sUCkpXFxuXCIpXHJcbiAgICAgICAgICAgICAgICA6ICcnKSArXHJcbiAgICAgICAgJ2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSJyArXHJcbiAgICAgICAgKGNvbmZpZy51c2VXaXRoID8gJ30nIDogJycpO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKHJlcywgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyoqXHJcbiAqIExvb3BzIHRocm91Z2ggdGhlIEFTVCBnZW5lcmF0ZWQgYnkgYHBhcnNlYCBhbmQgdHJhbnNmb3JtIGVhY2ggaXRlbSBpbnRvIEpTIGNhbGxzXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIC8vIEFTVCB2ZXJzaW9uIG9mICdIaSA8JT0gaXQudXNlciAlPidcclxuICogbGV0IHRlbXBsYXRlQVNUID0gWydIaSAnLCB7IHZhbDogJ2l0LnVzZXInLCB0OiAnaScgfV1cclxuICogY29tcGlsZVNjb3BlKHRlbXBsYXRlQVNULCBldGEuY29uZmlnKVxyXG4gKiAvLyBcInRSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO1wiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZVNjb3BlKGJ1ZmYsIGNvbmZpZykge1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgYnVmZkxlbmd0aCA9IGJ1ZmYubGVuZ3RoO1xyXG4gICAgdmFyIHJldHVyblN0ciA9ICcnO1xyXG4gICAgdmFyIFJFUExBQ0VNRU5UX1NUUiA9IFwickoyS3FYenhRZ1wiO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGJ1ZmZMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjdXJyZW50QmxvY2sgPSBidWZmW2ldO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY3VycmVudEJsb2NrID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gY3VycmVudEJsb2NrO1xyXG4gICAgICAgICAgICAvLyB3ZSBrbm93IHN0cmluZyBleGlzdHNcclxuICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIHN0ciArIFwiJ1xcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBjdXJyZW50QmxvY2sudDsgLy8gfiwgcywgISwgPywgclxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGN1cnJlbnRCbG9jay52YWwgfHwgJyc7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAncicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJhd1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBcIl9wcnMucHVzaChcIiArIGNvbnRlbnQgKyBcIik7XFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIFJFUExBQ0VNRU5UX1NUUiArIFwiJ1xcblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICdFLmZpbHRlcignICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwiX3Bycy5wdXNoKFwiICsgY29udGVudCArIFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCInXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZmlsdGVyKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gJ3RSKz0nICsgY29udGVudCArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuYXV0b0VzY2FwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZSgnICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnZScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBjb250ZW50ICsgJ1xcbic7IC8vIHlvdSBuZWVkIGEgXFxuIGluIGNhc2UgeW91IGhhdmUgPCUgfSAlPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgIHJldHVyblN0ciArPSBcImNvbnN0IF9yc3QgPSBhd2FpdCBQcm9taXNlLmFsbChfcHJzKTtcXG50UiA9IHRSLnJlcGxhY2UoL1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCIvZywgKCkgPT4gX3JzdC5zaGlmdCgpKTtcXG5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXR1cm5TdHI7XHJcbn1cblxuLyoqXHJcbiAqIEhhbmRsZXMgc3RvcmFnZSBhbmQgYWNjZXNzaW5nIG9mIHZhbHVlc1xyXG4gKlxyXG4gKiBJbiB0aGlzIGNhc2UsIHdlIHVzZSBpdCB0byBzdG9yZSBjb21waWxlZCB0ZW1wbGF0ZSBmdW5jdGlvbnNcclxuICogSW5kZXhlZCBieSB0aGVpciBgbmFtZWAgb3IgYGZpbGVuYW1lYFxyXG4gKi9cclxudmFyIENhY2hlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhY2hlcihjYWNoZSkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBjYWNoZTtcclxuICAgIH1cclxuICAgIENhY2hlci5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldID0gdmFsO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIC8vIHN0cmluZyB8IGFycmF5LlxyXG4gICAgICAgIC8vIFRPRE86IGFsbG93IGFycmF5IG9mIGtleXMgdG8gbG9vayBkb3duXHJcbiAgICAgICAgLy8gVE9ETzogY3JlYXRlIHBsdWdpbiB0byBhbGxvdyByZWZlcmVuY2luZyBoZWxwZXJzLCBmaWx0ZXJzIHdpdGggZG90IG5vdGF0aW9uXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVba2V5XTtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChjYWNoZU9iaikge1xyXG4gICAgICAgIGNvcHlQcm9wcyh0aGlzLmNhY2hlLCBjYWNoZU9iaik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhY2hlcjtcclxufSgpKTtcblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBFdGEncyB0ZW1wbGF0ZSBzdG9yYWdlXHJcbiAqXHJcbiAqIFN0b3JlcyBwYXJ0aWFscyBhbmQgY2FjaGVkIHRlbXBsYXRlc1xyXG4gKi9cclxudmFyIHRlbXBsYXRlcyA9IG5ldyBDYWNoZXIoe30pO1xuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIEluY2x1ZGUgYSB0ZW1wbGF0ZSBiYXNlZCBvbiBpdHMgbmFtZSAob3IgZmlsZXBhdGgsIGlmIGl0J3MgYWxyZWFkeSBiZWVuIGNhY2hlZCkuXHJcbiAqXHJcbiAqIENhbGxlZCBsaWtlIGBpbmNsdWRlKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSlgXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlSGVscGVyKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlTmFtZU9yUGF0aCk7XHJcbiAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmV0Y2ggdGVtcGxhdGUgXCInICsgdGVtcGxhdGVOYW1lT3JQYXRoICsgJ1wiJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSwgdGhpcyk7XHJcbn1cclxuLyoqIEV0YSdzIGJhc2UgKGdsb2JhbCkgY29uZmlndXJhdGlvbiAqL1xyXG52YXIgY29uZmlnID0ge1xyXG4gICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgYXV0b0VzY2FwZTogdHJ1ZSxcclxuICAgIGF1dG9UcmltOiBbZmFsc2UsICdubCddLFxyXG4gICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgZTogWE1MRXNjYXBlLFxyXG4gICAgaW5jbHVkZTogaW5jbHVkZUhlbHBlcixcclxuICAgIHBhcnNlOiB7XHJcbiAgICAgICAgZXhlYzogJycsXHJcbiAgICAgICAgaW50ZXJwb2xhdGU6ICc9JyxcclxuICAgICAgICByYXc6ICd+J1xyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtdLFxyXG4gICAgcm1XaGl0ZXNwYWNlOiBmYWxzZSxcclxuICAgIHRhZ3M6IFsnPCUnLCAnJT4nXSxcclxuICAgIHRlbXBsYXRlczogdGVtcGxhdGVzLFxyXG4gICAgdXNlV2l0aDogZmFsc2UsXHJcbiAgICB2YXJOYW1lOiAnaXQnXHJcbn07XHJcbi8qKlxyXG4gKiBUYWtlcyBvbmUgb3IgdHdvIHBhcnRpYWwgKG5vdCBuZWNlc3NhcmlseSBjb21wbGV0ZSkgY29uZmlndXJhdGlvbiBvYmplY3RzLCBtZXJnZXMgdGhlbSAxIGxheWVyIGRlZXAgaW50byBldGEuY29uZmlnLCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqIEBwYXJhbSBvdmVycmlkZSBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAqIEBwYXJhbSBiYXNlQ29uZmlnIFBhcnRpYWwgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gbWVyZ2UgYmVmb3JlIGBvdmVycmlkZWBcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogbGV0IGN1c3RvbUNvbmZpZyA9IGdldENvbmZpZyh7dGFnczogWychIycsICcjISddfSlcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb25maWcob3ZlcnJpZGUsIGJhc2VDb25maWcpIHtcclxuICAgIC8vIFRPRE86IHJ1biBtb3JlIHRlc3RzIG9uIHRoaXNcclxuICAgIHZhciByZXMgPSB7fTsgLy8gTGlua2VkXHJcbiAgICBjb3B5UHJvcHMocmVzLCBjb25maWcpOyAvLyBDcmVhdGVzIGRlZXAgY2xvbmUgb2YgZXRhLmNvbmZpZywgMSBsYXllciBkZWVwXHJcbiAgICBpZiAoYmFzZUNvbmZpZykge1xyXG4gICAgICAgIGNvcHlQcm9wcyhyZXMsIGJhc2VDb25maWcpO1xyXG4gICAgfVxyXG4gICAgaWYgKG92ZXJyaWRlKSB7XHJcbiAgICAgICAgY29weVByb3BzKHJlcywgb3ZlcnJpZGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKiogVXBkYXRlIEV0YSdzIGJhc2UgY29uZmlnICovXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZShvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gY29weVByb3BzKGNvbmZpZywgb3B0aW9ucyk7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHRlbXBsYXRlIHN0cmluZyBhbmQgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIChkYXRhLCBjb25maWcsIFtjYl0pXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBUaGUgdGVtcGxhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSBjb25maWcgLSBBIGN1c3RvbSBjb25maWd1cmF0aW9uIG9iamVjdCAob3B0aW9uYWwpXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjb21waWxlZEZuID0gZXRhLmNvbXBpbGUoXCJIaSA8JT0gaXQudXNlciAlPlwiKVxyXG4gKiAvLyBmdW5jdGlvbiBhbm9ueW1vdXMoKVxyXG4gKiBsZXQgY29tcGlsZWRGblN0ciA9IGNvbXBpbGVkRm4udG9TdHJpbmcoKVxyXG4gKiAvLyBcImZ1bmN0aW9uIGFub255bW91cyhpdCxFLGNiXFxuKSB7XFxudmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXFxufVwiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZShzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIC8qIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICAvLyBUaGUgYmVsb3cgY29kZSBpcyBtb2RpZmllZCBmcm9tIG1kZS9lanMuIEFsbCBjcmVkaXQgc2hvdWxkIGdvIHRvIHRoZW0uXHJcbiAgICB2YXIgY3RvciA9IG9wdGlvbnMuYXN5bmMgPyBnZXRBc3luY0Z1bmN0aW9uQ29uc3RydWN0b3IoKSA6IEZ1bmN0aW9uO1xyXG4gICAgLyogRU5EIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgY3RvcihvcHRpb25zLnZhck5hbWUsICdFJywgLy8gRXRhQ29uZmlnXHJcbiAgICAgICAgJ2NiJywgLy8gb3B0aW9uYWwgY2FsbGJhY2tcclxuICAgICAgICBjb21waWxlVG9TdHJpbmcoc3RyLCBvcHRpb25zKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LWZ1bmNcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFdGFFcnIoJ0JhZCB0ZW1wbGF0ZSBzeW50YXhcXG5cXG4nICtcclxuICAgICAgICAgICAgICAgIGUubWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAnXFxuJyArXHJcbiAgICAgICAgICAgICAgICBBcnJheShlLm1lc3NhZ2UubGVuZ3RoICsgMSkuam9pbignPScpICtcclxuICAgICAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgICAgIGNvbXBpbGVUb1N0cmluZyhzdHIsIG9wdGlvbnMpICtcclxuICAgICAgICAgICAgICAgICdcXG4nIC8vIFRoaXMgd2lsbCBwdXQgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlIGNhbGxzdGFjayBmb3IgZXh0cmEgcmVhZGFiaWxpdHlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbnZhciBfQk9NID0gL15cXHVGRUZGLztcclxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHBhdGggdG8gdGhlIGluY2x1ZGVkIGZpbGUgZnJvbSB0aGUgcGFyZW50IGZpbGUgcGF0aCBhbmQgdGhlXHJcbiAqIHNwZWNpZmllZCBwYXRoLlxyXG4gKlxyXG4gKiBJZiBgbmFtZWAgZG9lcyBub3QgaGF2ZSBhbiBleHRlbnNpb24sIGl0IHdpbGwgZGVmYXVsdCB0byBgLmV0YWBcclxuICpcclxuICogQHBhcmFtIG5hbWUgc3BlY2lmaWVkIHBhdGhcclxuICogQHBhcmFtIHBhcmVudGZpbGUgcGFyZW50IGZpbGUgcGF0aFxyXG4gKiBAcGFyYW0gaXNEaXJlY3Rvcnkgd2hldGhlciBwYXJlbnRmaWxlIGlzIGEgZGlyZWN0b3J5XHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0V2hvbGVGaWxlUGF0aChuYW1lLCBwYXJlbnRmaWxlLCBpc0RpcmVjdG9yeSkge1xyXG4gICAgdmFyIGluY2x1ZGVQYXRoID0gcmVzb2x2ZShpc0RpcmVjdG9yeSA/IHBhcmVudGZpbGUgOiBkaXJuYW1lKHBhcmVudGZpbGUpLCAvLyByZXR1cm5zIGRpcmVjdG9yeSB0aGUgcGFyZW50IGZpbGUgaXMgaW5cclxuICAgIG5hbWUgLy8gZmlsZVxyXG4gICAgKSArIChleHRuYW1lKG5hbWUpID8gJycgOiAnLmV0YScpO1xyXG4gICAgcmV0dXJuIGluY2x1ZGVQYXRoO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGhlIGFic29sdXRlIHBhdGggdG8gYW4gaW5jbHVkZWQgdGVtcGxhdGVcclxuICpcclxuICogSWYgdGhpcyBpcyBjYWxsZWQgd2l0aCBhbiBhYnNvbHV0ZSBwYXRoIChmb3IgZXhhbXBsZSwgc3RhcnRpbmcgd2l0aCAnLycgb3IgJ0M6XFwnKVxyXG4gKiB0aGVuIEV0YSB3aWxsIGF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgYWJzb2x1dGUgcGF0aCB3aXRoaW4gb3B0aW9ucy52aWV3cy4gSWYgaXQgY2Fubm90LFxyXG4gKiBFdGEgd2lsbCBmYWxsYmFjayB0byBvcHRpb25zLnJvb3Qgb3IgJy8nXHJcbiAqXHJcbiAqIElmIHRoaXMgaXMgY2FsbGVkIHdpdGggYSByZWxhdGl2ZSBwYXRoLCBFdGEgd2lsbDpcclxuICogLSBMb29rIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHRlbXBsYXRlIChpZiB0aGUgY3VycmVudCB0ZW1wbGF0ZSBoYXMgdGhlIGBmaWxlbmFtZWAgcHJvcGVydHkpXHJcbiAqIC0gTG9vayBpbnNpZGUgZWFjaCBkaXJlY3RvcnkgaW4gb3B0aW9ucy52aWV3c1xyXG4gKlxyXG4gKiBOb3RlOiBpZiBFdGEgaXMgdW5hYmxlIHRvIGZpbmQgYSB0ZW1wbGF0ZSB1c2luZyBwYXRoIGFuZCBvcHRpb25zLCBpdCB3aWxsIHRocm93IGFuIGVycm9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UGF0aChwYXRoLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgaW5jbHVkZVBhdGggPSBmYWxzZTtcclxuICAgIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XHJcbiAgICB2YXIgc2VhcmNoZWRQYXRocyA9IFtdO1xyXG4gICAgLy8gSWYgdGhlc2UgZm91ciB2YWx1ZXMgYXJlIHRoZSBzYW1lLFxyXG4gICAgLy8gZ2V0UGF0aCgpIHdpbGwgcmV0dXJuIHRoZSBzYW1lIHJlc3VsdCBldmVyeSB0aW1lLlxyXG4gICAgLy8gV2UgY2FuIGNhY2hlIHRoZSByZXN1bHQgdG8gYXZvaWQgZXhwZW5zaXZlXHJcbiAgICAvLyBmaWxlIG9wZXJhdGlvbnMuXHJcbiAgICB2YXIgcGF0aE9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWUsXHJcbiAgICAgICAgcGF0aDogcGF0aCxcclxuICAgICAgICByb290OiBvcHRpb25zLnJvb3QsXHJcbiAgICAgICAgdmlld3M6IG9wdGlvbnMudmlld3NcclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZVtwYXRoT3B0aW9uc10pIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGNhY2hlZCBmaWxlcGF0aFxyXG4gICAgICAgIHJldHVybiBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdO1xyXG4gICAgfVxyXG4gICAgLyoqIEFkZCBhIGZpbGVwYXRoIHRvIHRoZSBsaXN0IG9mIHBhdGhzIHdlJ3ZlIGNoZWNrZWQgZm9yIGEgdGVtcGxhdGUgKi9cclxuICAgIGZ1bmN0aW9uIGFkZFBhdGhUb1NlYXJjaGVkKHBhdGhTZWFyY2hlZCkge1xyXG4gICAgICAgIGlmICghc2VhcmNoZWRQYXRocy5pbmNsdWRlcyhwYXRoU2VhcmNoZWQpKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaGVkUGF0aHMucHVzaChwYXRoU2VhcmNoZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGFrZSBhIGZpbGVwYXRoIChsaWtlICdwYXJ0aWFscy9teXBhcnRpYWwuZXRhJykuIEF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGUgZmlsZSBpbnNpZGUgYHZpZXdzYDtcclxuICAgICAqIHJldHVybiB0aGUgcmVzdWx0aW5nIHRlbXBsYXRlIGZpbGUgcGF0aCwgb3IgYGZhbHNlYCB0byBpbmRpY2F0ZSB0aGF0IHRoZSB0ZW1wbGF0ZSB3YXMgbm90IGZvdW5kLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2aWV3cyB0aGUgZmlsZXBhdGggdGhhdCBob2xkcyB0ZW1wbGF0ZXMsIG9yIGFuIGFycmF5IG9mIGZpbGVwYXRocyB0aGF0IGhvbGQgdGVtcGxhdGVzXHJcbiAgICAgKiBAcGFyYW0gcGF0aCB0aGUgcGF0aCB0byB0aGUgdGVtcGxhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VhcmNoVmlld3Modmlld3MsIHBhdGgpIHtcclxuICAgICAgICB2YXIgZmlsZVBhdGg7XHJcbiAgICAgICAgLy8gSWYgdmlld3MgaXMgYW4gYXJyYXksIHRoZW4gbG9vcCB0aHJvdWdoIGVhY2ggZGlyZWN0b3J5XHJcbiAgICAgICAgLy8gQW5kIGF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGVcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2aWV3cykgJiZcclxuICAgICAgICAgICAgdmlld3Muc29tZShmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSBnZXRXaG9sZUZpbGVQYXRoKHBhdGgsIHYsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0c1N5bmMoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYWJvdmUgcmV0dXJuZWQgdHJ1ZSwgd2Uga25vdyB0aGF0IHRoZSBmaWxlUGF0aCB3YXMganVzdCBzZXQgdG8gYSBwYXRoXHJcbiAgICAgICAgICAgIC8vIFRoYXQgZXhpc3RzIChBcnJheS5zb21lKCkgcmV0dXJucyBhcyBzb29uIGFzIGl0IGZpbmRzIGEgdmFsaWQgZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygdmlld3MgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIC8vIFNlYXJjaCBmb3IgdGhlIGZpbGUgaWYgdmlld3MgaXMgYSBzaW5nbGUgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCB2aWV3cywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVW5hYmxlIHRvIGZpbmQgYSBmaWxlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gUGF0aCBzdGFydHMgd2l0aCAnLycsICdDOlxcJywgZXRjLlxyXG4gICAgdmFyIG1hdGNoID0gL15bQS1aYS16XSs6XFxcXHxeXFwvLy5leGVjKHBhdGgpO1xyXG4gICAgLy8gQWJzb2x1dGUgcGF0aCwgbGlrZSAvcGFydGlhbHMvcGFydGlhbC5ldGFcclxuICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBXZSBoYXZlIHRvIHRyaW0gdGhlIGJlZ2lubmluZyAnLycgb2ZmIHRoZSBwYXRoLCBvciBlbHNlXHJcbiAgICAgICAgLy8gcGF0aC5yZXNvbHZlKGRpciwgcGF0aCkgd2lsbCBhbHdheXMgcmVzb2x2ZSB0byBqdXN0IHBhdGhcclxuICAgICAgICB2YXIgZm9ybWF0dGVkUGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLyovLCAnJyk7XHJcbiAgICAgICAgLy8gRmlyc3QsIHRyeSB0byByZXNvbHZlIHRoZSBwYXRoIHdpdGhpbiBvcHRpb25zLnZpZXdzXHJcbiAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgZm9ybWF0dGVkUGF0aCk7XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlUGF0aCkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGF0IGZhaWxzLCBzZWFyY2hWaWV3cyB3aWxsIHJldHVybiBmYWxzZS4gVHJ5IHRvIGZpbmQgdGhlIHBhdGhcclxuICAgICAgICAgICAgLy8gaW5zaWRlIG9wdGlvbnMucm9vdCAoYnkgZGVmYXVsdCAnLycsIHRoZSBiYXNlIG9mIHRoZSBmaWxlc3lzdGVtKVxyXG4gICAgICAgICAgICB2YXIgcGF0aEZyb21Sb290ID0gZ2V0V2hvbGVGaWxlUGF0aChmb3JtYXR0ZWRQYXRoLCBvcHRpb25zLnJvb3QgfHwgJy8nLCB0cnVlKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQocGF0aEZyb21Sb290KTtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBwYXRoRnJvbVJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmVsYXRpdmUgcGF0aHNcclxuICAgICAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlbiBsb29rIGZvciB0aGUgdGVtcGxhdGUgaW4gb3B0aW9ucy52aWV3c1xyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmluZCB0aGUgdGVtcGxhdGUgXCInICsgcGF0aCArICdcIi4gUGF0aHMgdHJpZWQ6ICcgKyBzZWFyY2hlZFBhdGhzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiBjYWNoaW5nIGFuZCBmaWxlcGF0aENhY2hlIGFyZSBlbmFibGVkLFxyXG4gICAgLy8gY2FjaGUgdGhlIGlucHV0ICYgb3V0cHV0IG9mIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGUpIHtcclxuICAgICAgICBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdID0gaW5jbHVkZVBhdGg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5jbHVkZVBhdGg7XHJcbn1cclxuLyoqXHJcbiAqIFJlYWRzIGEgZmlsZSBzeW5jaHJvbm91c2x5XHJcbiAqL1xyXG5mdW5jdGlvbiByZWFkRmlsZShmaWxlUGF0aCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gcmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpOyAvLyBUT0RPOiBpcyByZXBsYWNpbmcgQk9NJ3MgbmVjZXNzYXJ5P1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKFwiRmFpbGVkIHRvIHJlYWQgdGVtcGxhdGUgYXQgJ1wiICsgZmlsZVBhdGggKyBcIidcIik7XHJcbiAgICB9XHJcbn1cblxuLy8gZXhwcmVzcyBpcyBzZXQgbGlrZTogYXBwLmVuZ2luZSgnaHRtbCcsIHJlcXVpcmUoJ2V0YScpLnJlbmRlckZpbGUpXHJcbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogUmVhZHMgYSB0ZW1wbGF0ZSwgY29tcGlsZXMgaXQgaW50byBhIGZ1bmN0aW9uLCBjYWNoZXMgaXQgaWYgY2FjaGluZyBpc24ndCBkaXNhYmxlZCwgcmV0dXJucyB0aGUgZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGZpbGVQYXRoIEFic29sdXRlIHBhdGggdG8gdGVtcGxhdGUgZmlsZVxyXG4gKiBAcGFyYW0gb3B0aW9ucyBFdGEgY29uZmlndXJhdGlvbiBvdmVycmlkZXNcclxuICogQHBhcmFtIG5vQ2FjaGUgT3B0aW9uYWxseSwgbWFrZSBFdGEgbm90IGNhY2hlIHRoZSB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZVBhdGgsIG9wdGlvbnMsIG5vQ2FjaGUpIHtcclxuICAgIHZhciBjb25maWcgPSBnZXRDb25maWcob3B0aW9ucyk7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSByZWFkRmlsZShmaWxlUGF0aCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gY29tcGlsZSh0ZW1wbGF0ZSwgY29uZmlnKTtcclxuICAgICAgICBpZiAoIW5vQ2FjaGUpIHtcclxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlcy5kZWZpbmUoY29uZmlnLmZpbGVuYW1lLCBjb21waWxlZFRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IEV0YUVycignTG9hZGluZyBmaWxlOiAnICsgZmlsZVBhdGggKyAnIGZhaWxlZDpcXG5cXG4nICsgZS5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZmlsZSwgZWl0aGVyIGNvbXBpbGVkIG9uLXRoZS1mbHkgb3JcclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyB0cnVlLCB0aGlzIGZ1bmN0aW9uIHJlYWRzIHRoZSBmaWxlIGZyb21cclxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgICBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gRXRhIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDYWNoZShvcHRpb25zKSB7XHJcbiAgICB2YXIgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcclxuICAgICAgICB2YXIgZnVuYyA9IG9wdGlvbnMudGVtcGxhdGVzLmdldChmaWxlbmFtZSk7XHJcbiAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsb2FkRmlsZShmaWxlbmFtZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvLyBDYWNoaW5nIGlzIGRpc2FibGVkLCBzbyBwYXNzIG5vQ2FjaGUgPSB0cnVlXHJcbiAgICByZXR1cm4gbG9hZEZpbGUoZmlsZW5hbWUsIG9wdGlvbnMsIHRydWUpO1xyXG59XHJcbi8qKlxyXG4gKiBUcnkgY2FsbGluZyBoYW5kbGVDYWNoZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFuZCBkYXRhIGFuZCBjYWxsIHRoZVxyXG4gKiBjYWxsYmFjayB3aXRoIHRoZSByZXN1bHQuIElmIGFuIGVycm9yIG9jY3VycywgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aFxyXG4gKiB0aGUgZXJyb3IuIFVzZWQgYnkgcmVuZGVyRmlsZSgpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZGF0YSB0ZW1wbGF0ZSBkYXRhXHJcbiAqIEBwYXJhbSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiB0cnlIYW5kbGVDYWNoZShkYXRhLCBvcHRpb25zLCBjYikge1xyXG4gICAgaWYgKGNiKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gTm90ZTogaWYgdGhlcmUgaXMgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgLy8gSXQgd2lsbCBidWJibGUgdXAgYW5kIGJlIGNhdWdodCBoZXJlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucywgY2IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIE5vIGNhbGxiYWNrLCB0cnkgcmV0dXJuaW5nIGEgcHJvbWlzZVxyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvbWlzZUltcGwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyBgdHJ1ZWAsIHRoZW4gdGhlIHRlbXBsYXRlIGlzIGNhY2hlZC5cclxuICpcclxuICogVGhpcyByZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gYW5kIHRoZSBjb25maWcgb2JqZWN0IHdpdGggd2hpY2ggdGhhdCB0ZW1wbGF0ZSBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcmVtYXJrc1xyXG4gKlxyXG4gKiBJdCdzIGltcG9ydGFudCB0aGF0IHRoaXMgcmV0dXJucyBhIGNvbmZpZyBvYmplY3Qgd2l0aCBgZmlsZW5hbWVgIHNldC5cclxuICogT3RoZXJ3aXNlLCB0aGUgaW5jbHVkZWQgZmlsZSB3b3VsZCBub3QgYmUgYWJsZSB0byB1c2UgcmVsYXRpdmUgcGF0aHNcclxuICpcclxuICogQHBhcmFtIHBhdGggcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlIChpZiByZWxhdGl2ZSwgc3BlY2lmeSBgdmlld3NgIG9uIGBvcHRpb25zYClcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIFtFdGEgdGVtcGxhdGUgZnVuY3Rpb24sIG5ldyBjb25maWcgb2JqZWN0XVxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZUZpbGUocGF0aCwgb3B0aW9ucykge1xyXG4gICAgLy8gdGhlIGJlbG93IGNyZWF0ZXMgYSBuZXcgb3B0aW9ucyBvYmplY3QsIHVzaW5nIHRoZSBwYXJlbnQgZmlsZXBhdGggb2YgdGhlIG9sZCBvcHRpb25zIG9iamVjdCBhbmQgdGhlIHBhdGhcclxuICAgIHZhciBuZXdGaWxlT3B0aW9ucyA9IGdldENvbmZpZyh7IGZpbGVuYW1lOiBnZXRQYXRoKHBhdGgsIG9wdGlvbnMpIH0sIG9wdGlvbnMpO1xyXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHByb3BlcnRpZXMgYXJlIGN1cnJlY3RseSBjb3BpZWQgb3ZlclxyXG4gICAgcmV0dXJuIFtoYW5kbGVDYWNoZShuZXdGaWxlT3B0aW9ucyksIG5ld0ZpbGVPcHRpb25zXTtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJGaWxlKGZpbGVuYW1lLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICAvKlxyXG4gICAgSGVyZSB3ZSBoYXZlIHNvbWUgZnVuY3Rpb24gb3ZlcmxvYWRpbmcuXHJcbiAgICBFc3NlbnRpYWxseSwgdGhlIGZpcnN0IDIgYXJndW1lbnRzIHRvIHJlbmRlckZpbGUgc2hvdWxkIGFsd2F5cyBiZSB0aGUgZmlsZW5hbWUgYW5kIGRhdGFcclxuICAgIEhvd2V2ZXIsIHdpdGggRXhwcmVzcywgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIGFsb25nIHdpdGggdGhlIGRhdGEuXHJcbiAgICBUaHVzLCBFeHByZXNzIHdpbGwgY2FsbCByZW5kZXJGaWxlIHdpdGggKGZpbGVuYW1lLCBkYXRhQW5kT3B0aW9ucywgY2IpXHJcbiAgICBBbmQgd2Ugd2FudCB0byBhbHNvIG1ha2UgKGZpbGVuYW1lLCBkYXRhLCBvcHRpb25zLCBjYikgYXZhaWxhYmxlXHJcbiAgICAqL1xyXG4gICAgdmFyIHJlbmRlckNvbmZpZztcclxuICAgIHZhciBjYWxsYmFjaztcclxuICAgIGRhdGEgPSBkYXRhIHx8IHt9OyAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCwgd2UgZG9uJ3Qgd2FudCBhY2Nlc3NpbmcgZGF0YS5zZXR0aW5ncyB0byBlcnJvclxyXG4gICAgLy8gRmlyc3QsIGFzc2lnbiBvdXIgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYGNhbGxiYWNrYFxyXG4gICAgLy8gV2UgY2FuIGxlYXZlIGl0IHVuZGVmaW5lZCBpZiBuZWl0aGVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uO1xyXG4gICAgLy8gQ2FsbGJhY2tzIGFyZSBvcHRpb25hbFxyXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIFRoZSA0dGggYXJndW1lbnQgaXMgdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgY2FsbGJhY2sgPSBjYjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvLyBUaGUgM3JkIGFyZyBpcyB0aGUgY2FsbGJhY2tcclxuICAgICAgICBjYWxsYmFjayA9IGNvbmZpZztcclxuICAgIH1cclxuICAgIC8vIElmIHRoZXJlIGlzIGEgY29uZmlnIG9iamVjdCBwYXNzZWQgaW4gZXhwbGljaXRseSwgdXNlIGl0XHJcbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZW5kZXJDb25maWcgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgZ2V0IHRoZSBjb25maWcgZnJvbSB0aGUgZGF0YSBvYmplY3RcclxuICAgICAgICAvLyBBbmQgdGhlbiBncmFiIHNvbWUgY29uZmlnIG9wdGlvbnMgZnJvbSBkYXRhLnNldHRpbmdzXHJcbiAgICAgICAgLy8gV2hpY2ggaXMgd2hlcmUgRXhwcmVzcyBzb21ldGltZXMgc3RvcmVzIHRoZW1cclxuICAgICAgICByZW5kZXJDb25maWcgPSBnZXRDb25maWcoZGF0YSk7XHJcbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgLy8gUHVsbCBhIGZldyB0aGluZ3MgZnJvbSBrbm93biBsb2NhdGlvbnNcclxuICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Mudmlld3MpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckNvbmZpZy52aWV3cyA9IGRhdGEuc2V0dGluZ3Mudmlld3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3NbJ3ZpZXcgY2FjaGUnXSkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyQ29uZmlnLmNhY2hlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBVbmRvY3VtZW50ZWQgYWZ0ZXIgRXhwcmVzcyAyLCBidXQgc3RpbGwgdXNhYmxlLCBlc3AuIGZvclxyXG4gICAgICAgICAgICAvLyBpdGVtcyB0aGF0IGFyZSB1bnNhZmUgdG8gYmUgcGFzc2VkIGFsb25nIHdpdGggZGF0YSwgbGlrZSBgcm9vdGBcclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRzID0gZGF0YS5zZXR0aW5nc1sndmlldyBvcHRpb25zJ107XHJcbiAgICAgICAgICAgIGlmICh2aWV3T3B0cykge1xyXG4gICAgICAgICAgICAgICAgY29weVByb3BzKHJlbmRlckNvbmZpZywgdmlld09wdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IHRoZSBmaWxlbmFtZSBvcHRpb24gb24gdGhlIHRlbXBsYXRlXHJcbiAgICAvLyBUaGlzIHdpbGwgZmlyc3QgdHJ5IHRvIHJlc29sdmUgdGhlIGZpbGUgcGF0aCAoc2VlIGdldFBhdGggZm9yIGRldGFpbHMpXHJcbiAgICByZW5kZXJDb25maWcuZmlsZW5hbWUgPSBnZXRQYXRoKGZpbGVuYW1lLCByZW5kZXJDb25maWcpO1xyXG4gICAgcmV0dXJuIHRyeUhhbmRsZUNhY2hlKGRhdGEsIHJlbmRlckNvbmZpZywgY2FsbGJhY2spO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlckZpbGVBc3luYyhmaWxlbmFtZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgcmV0dXJuIHJlbmRlckZpbGUoZmlsZW5hbWUsIHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicgPyBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGF0YSksIHsgYXN5bmM6IHRydWUgfSkgOiBkYXRhLCB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb25maWcpLCB7IGFzeW5jOiB0cnVlIH0pIDogY29uZmlnLCBjYik7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBDYWxsZWQgd2l0aCBgaW5jbHVkZUZpbGUocGF0aCwgZGF0YSlgXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlRmlsZUhlbHBlcihwYXRoLCBkYXRhKSB7XHJcbiAgICB2YXIgdGVtcGxhdGVBbmRDb25maWcgPSBpbmNsdWRlRmlsZShwYXRoLCB0aGlzKTtcclxuICAgIHJldHVybiB0ZW1wbGF0ZUFuZENvbmZpZ1swXShkYXRhLCB0ZW1wbGF0ZUFuZENvbmZpZ1sxXSk7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNhY2hlJDEodGVtcGxhdGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMubmFtZSAmJiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKSkge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKTtcclxuICAgIH1cclxuICAgIHZhciB0ZW1wbGF0ZUZ1bmMgPSB0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicgPyB0ZW1wbGF0ZSA6IGNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gY2hlY2sgaWYgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGNhY2hlO1xyXG4gICAgLy8gaXQgd291bGQgaGF2ZSByZXR1cm5lZCBlYXJsaWVyIGlmIGl0IGhhZFxyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZXMuZGVmaW5lKG9wdGlvbnMubmFtZSwgdGVtcGxhdGVGdW5jKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ZW1wbGF0ZUZ1bmM7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlciBhIHRlbXBsYXRlXHJcbiAqXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSBzdHJpbmcsIEV0YSB3aWxsIGNvbXBpbGUgaXQgdG8gYSBmdW5jdGlvbiBhbmQgdGhlbiBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgZmFsc2VgLCBFdGEgd2lsbCByZXR1cm4gdGhlIHJlbmRlcmVkIHRlbXBsYXRlLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3Mgbm90IGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIHJldHVybiBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVuZGVyZWQgdGVtcGxhdGUuXHJcbiAqXHJcbiAqIElmIGBjb25maWcuY2FjaGVgIGlzIGB0cnVlYCBhbmQgYGNvbmZpZ2AgaGFzIGEgYG5hbWVgIG9yIGBmaWxlbmFtZWAgcHJvcGVydHksIEV0YSB3aWxsIGNhY2hlIHRoZSB0ZW1wbGF0ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIGFuZCB1c2UgdGhlIGNhY2hlZCB0ZW1wbGF0ZSBmb3IgYWxsIHN1YnNlcXVlbnQgcmVuZGVycy5cclxuICpcclxuICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHN0cmluZyBvciB0ZW1wbGF0ZSBmdW5jdGlvblxyXG4gKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHJlbmRlciB0aGUgdGVtcGxhdGUgd2l0aFxyXG4gKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIGNvbmZpZyBvcHRpb25zXHJcbiAqIEBwYXJhbSBjYiBDYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgaWYgKG9wdGlvbnMuYXN5bmMpIHtcclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgLy8gSWYgdXNlciBwYXNzZXMgY2FsbGJhY2tcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IGlmIHRoZXJlIGlzIGFuIGVycm9yIHdoaWxlIHJlbmRlcmluZyB0aGUgdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAvLyBJdCB3aWxsIGJ1YmJsZSB1cCBhbmQgYmUgY2F1Z2h0IGhlcmVcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUkMSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTm8gY2FsbGJhY2ssIHRyeSByZXR1cm5pbmcgYSBwcm9taXNlXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvbWlzZUltcGwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaGFuZGxlQ2FjaGUkMSh0ZW1wbGF0ZSwgb3B0aW9ucykoZGF0YSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXRhRXJyKFwiUGxlYXNlIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbiwgdGhpcyBlbnYgZG9lc24ndCBzdXBwb3J0IFByb21pc2VzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZUNhY2hlJDEodGVtcGxhdGUsIG9wdGlvbnMpKGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZW5kZXIgYSB0ZW1wbGF0ZSBhc3luY2hyb25vdXNseVxyXG4gKlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgc3RyaW5nLCBFdGEgd2lsbCBjb21waWxlIGl0IHRvIGEgZnVuY3Rpb24gYW5kIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqXHJcbiAqIElmIHRoZXJlIGlzIGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgaXQgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiB0aGVyZSBpcyBub3QgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgcmV0dXJuIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgc3RyaW5nIG9yIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcmVuZGVyIHRoZSB0ZW1wbGF0ZSB3aXRoXHJcbiAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlnIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXJBc3luYyh0ZW1wbGF0ZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgLy8gVXNpbmcgT2JqZWN0LmFzc2lnbiB0byBsb3dlciBidW5kbGUgc2l6ZSwgdXNpbmcgc3ByZWFkIG9wZXJhdG9yIG1ha2VzIGl0IGxhcmdlciBiZWNhdXNlIG9mIHR5cGVzY3JpcHQgaW5qZWN0ZWQgcG9seWZpbGxzXHJcbiAgICByZXR1cm4gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBPYmplY3QuYXNzaWduKHt9LCBjb25maWcsIHsgYXN5bmM6IHRydWUgfSksIGNiKTtcclxufVxuXG4vLyBAZGVub2lmeS1pZ25vcmVcclxuY29uZmlnLmluY2x1ZGVGaWxlID0gaW5jbHVkZUZpbGVIZWxwZXI7XHJcbmNvbmZpZy5maWxlcGF0aENhY2hlID0ge307XG5cbmV4cG9ydCB7IHJlbmRlckZpbGUgYXMgX19leHByZXNzLCBjb21waWxlLCBjb21waWxlVG9TdHJpbmcsIGNvbmZpZywgY29uZmlndXJlLCBjb25maWcgYXMgZGVmYXVsdENvbmZpZywgZ2V0Q29uZmlnLCBsb2FkRmlsZSwgcGFyc2UsIHJlbmRlciwgcmVuZGVyQXN5bmMsIHJlbmRlckZpbGUsIHJlbmRlckZpbGVBc3luYywgdGVtcGxhdGVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ldGEuZXMuanMubWFwXG4iLCJpbXBvcnQgKiBhcyBFdGEgZnJvbSBcImV0YVwiO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgICBhc3luYyBwYXJzZV9jb21tYW5kcyhcbiAgICAgICAgY29udGVudDogc3RyaW5nLFxuICAgICAgICBvYmplY3Q6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29udGVudCA9IChhd2FpdCBFdGEucmVuZGVyQXN5bmMoY29udGVudCwgb2JqZWN0LCB7XG4gICAgICAgICAgICB2YXJOYW1lOiBcInRwXCIsXG4gICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICAgIGV4ZWM6IFwiKlwiLFxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlOiBcIn5cIixcbiAgICAgICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXV0b1RyaW06IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsQXdhaXQ6IHRydWUsXG4gICAgICAgIH0pKSBhcyBzdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgbm9ybWFsaXplUGF0aCxcbiAgICBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICAgIE1hcmtkb3duVmlldyxcbiAgICBUQWJzdHJhY3RGaWxlLFxuICAgIFRGaWxlLFxuICAgIFRGb2xkZXIsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyByZXNvbHZlX3RmaWxlLCBkZWxheSB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHtcbiAgICBGdW5jdGlvbnNNb2RlLFxuICAgIEZ1bmN0aW9uc0dlbmVyYXRvcixcbn0gZnJvbSBcImZ1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlciwgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gXCJlZGl0b3IvRWRpdG9yXCI7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwicGFyc2VyL1BhcnNlclwiO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSBcIkxvZ1wiO1xuXG5leHBvcnQgZW51bSBSdW5Nb2RlIHtcbiAgICBDcmVhdGVOZXdGcm9tVGVtcGxhdGUsXG4gICAgQXBwZW5kQWN0aXZlRmlsZSxcbiAgICBPdmVyd3JpdGVGaWxlLFxuICAgIE92ZXJ3cml0ZUFjdGl2ZUZpbGUsXG4gICAgRHluYW1pY1Byb2Nlc3NvcixcbiAgICBTdGFydHVwVGVtcGxhdGUsXG59XG5cbmV4cG9ydCB0eXBlIFJ1bm5pbmdDb25maWcgPSB7XG4gICAgdGVtcGxhdGVfZmlsZTogVEZpbGU7XG4gICAgdGFyZ2V0X2ZpbGU6IFRGaWxlO1xuICAgIHJ1bl9tb2RlOiBSdW5Nb2RlO1xuICAgIGFjdGl2ZV9maWxlPzogVEZpbGU7XG59O1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyIHtcbiAgICBwdWJsaWMgcGFyc2VyOiBQYXJzZXI7XG4gICAgcHVibGljIGZ1bmN0aW9uc19nZW5lcmF0b3I6IEZ1bmN0aW9uc0dlbmVyYXRvcjtcbiAgICBwdWJsaWMgZWRpdG9yOiBFZGl0b3I7XG4gICAgcHVibGljIGN1cnJlbnRfZnVuY3Rpb25zX29iamVjdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMuZnVuY3Rpb25zX2dlbmVyYXRvciA9IG5ldyBGdW5jdGlvbnNHZW5lcmF0b3IoXG4gICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgIHRoaXMucGx1Z2luXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZWRpdG9yID0gbmV3IEVkaXRvcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBQYXJzZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBzZXR1cCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5lZGl0b3Iuc2V0dXAoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yLmluaXQoKTtcbiAgICAgICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJNYXJrZG93blBvc3RQcm9jZXNzb3IoKGVsLCBjdHgpID0+XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NfZHluYW1pY190ZW1wbGF0ZXMoZWwsIGN0eClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgIHRlbXBsYXRlX2ZpbGU6IFRGaWxlLFxuICAgICAgICB0YXJnZXRfZmlsZTogVEZpbGUsXG4gICAgICAgIHJ1bl9tb2RlOiBSdW5Nb2RlXG4gICAgKTogUnVubmluZ0NvbmZpZyB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV9maWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZTogdGVtcGxhdGVfZmlsZSxcbiAgICAgICAgICAgIHRhcmdldF9maWxlOiB0YXJnZXRfZmlsZSxcbiAgICAgICAgICAgIHJ1bl9tb2RlOiBydW5fbW9kZSxcbiAgICAgICAgICAgIGFjdGl2ZV9maWxlOiBhY3RpdmVfZmlsZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyByZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShjb25maWc6IFJ1bm5pbmdDb25maWcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChcbiAgICAgICAgICAgIGNvbmZpZy50ZW1wbGF0ZV9maWxlXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlX3RlbXBsYXRlKGNvbmZpZywgdGVtcGxhdGVfY29udGVudCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VfdGVtcGxhdGUoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZyxcbiAgICAgICAgdGVtcGxhdGVfY29udGVudDogc3RyaW5nXG4gICAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZnVuY3Rpb25zX29iamVjdCA9IGF3YWl0IHRoaXMuZnVuY3Rpb25zX2dlbmVyYXRvci5nZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBGdW5jdGlvbnNNb2RlLlVTRVJfSU5URVJOQUxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3QgPSBmdW5jdGlvbnNfb2JqZWN0O1xuICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5wYXJzZXIucGFyc2VfY29tbWFuZHMoXG4gICAgICAgICAgICB0ZW1wbGF0ZV9jb250ZW50LFxuICAgICAgICAgICAgZnVuY3Rpb25zX29iamVjdFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKGZpbGU6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9fanVtcF90b19jdXJzb3IgJiZcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkgPT09IGZpbGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVkaXRvci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShcbiAgICAgICAgdGVtcGxhdGU6IFRGaWxlIHwgc3RyaW5nLFxuICAgICAgICBmb2xkZXI/OiBURm9sZGVyLFxuICAgICAgICBmaWxlbmFtZT86IHN0cmluZyxcbiAgICAgICAgb3Blbl9uZXdfbm90ZSA9IHRydWVcbiAgICApOiBQcm9taXNlPFRGaWxlPiB7XG4gICAgICAgIC8vIFRPRE86IE1heWJlIHRoZXJlIGlzIGFuIG9ic2lkaWFuIEFQSSBmdW5jdGlvbiBmb3IgdGhhdFxuICAgICAgICBpZiAoIWZvbGRlcikge1xuICAgICAgICAgICAgLy8gVE9ETzogRml4IHRoYXRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbnN0IG5ld19maWxlX2xvY2F0aW9uID1cbiAgICAgICAgICAgICAgICB0aGlzLmFwcC52YXVsdC5nZXRDb25maWcoXCJuZXdGaWxlTG9jYXRpb25cIik7XG4gICAgICAgICAgICBzd2l0Y2ggKG5ld19maWxlX2xvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImN1cnJlbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVfZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVfZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyID0gYWN0aXZlX2ZpbGUucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiZm9sZGVyXCI6XG4gICAgICAgICAgICAgICAgICAgIGZvbGRlciA9IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyb290XCI6XG4gICAgICAgICAgICAgICAgICAgIGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBDaGFuZ2UgdGhhdCwgbm90IHN0YWJsZSBhdG1cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBjcmVhdGVkX25vdGUgPSBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5jcmVhdGVOZXdNYXJrZG93bkZpbGUoXG4gICAgICAgICAgICBmb2xkZXIsXG4gICAgICAgICAgICBmaWxlbmFtZSA/PyBcIlVudGl0bGVkXCJcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgcnVubmluZ19jb25maWc6IFJ1bm5pbmdDb25maWc7XG4gICAgICAgIGxldCBvdXRwdXRfY29udGVudDogc3RyaW5nO1xuICAgICAgICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICBjcmVhdGVkX25vdGUsXG4gICAgICAgICAgICAgICAgUnVuTW9kZS5DcmVhdGVOZXdGcm9tVGVtcGxhdGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSxcbiAgICAgICAgICAgICAgICBcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3JlYXRlZF9ub3RlLFxuICAgICAgICAgICAgICAgIFJ1bk1vZGUuQ3JlYXRlTmV3RnJvbVRlbXBsYXRlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5wYXJzZV90ZW1wbGF0ZShydW5uaW5nX2NvbmZpZywgdGVtcGxhdGUpLFxuICAgICAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0cHV0X2NvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuZGVsZXRlKGNyZWF0ZWRfbm90ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoY3JlYXRlZF9ub3RlLCBvdXRwdXRfY29udGVudCk7XG5cbiAgICAgICAgaWYgKG9wZW5fbmV3X25vdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZV9sZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XG4gICAgICAgICAgICBpZiAoIWFjdGl2ZV9sZWFmKSB7XG4gICAgICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihcIk5vIGFjdGl2ZSBsZWFmXCIpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBhY3RpdmVfbGVhZi5vcGVuRmlsZShjcmVhdGVkX25vdGUsIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0sXG4gICAgICAgICAgICAgICAgZVN0YXRlOiB7IHJlbmFtZTogXCJhbGxcIiB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oY3JlYXRlZF9ub3RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVkX25vdGU7XG4gICAgfVxuXG4gICAgYXN5bmMgYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKHRlbXBsYXRlX2ZpbGU6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcIk5vIGFjdGl2ZSB2aWV3LCBjYW4ndCBhcHBlbmQgdGVtcGxhdGVzLlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZSxcbiAgICAgICAgICAgIGFjdGl2ZV92aWV3LmZpbGUsXG4gICAgICAgICAgICBSdW5Nb2RlLkFwcGVuZEFjdGl2ZUZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0X2NvbnRlbnQgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSxcbiAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZFxuICAgICAgICBpZiAob3V0cHV0X2NvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgICAgIGRvYy5yZXBsYWNlU2VsZWN0aW9uKG91dHB1dF9jb250ZW50KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oYWN0aXZlX3ZpZXcuZmlsZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgd3JpdGVfdGVtcGxhdGVfdG9fZmlsZShcbiAgICAgICAgdGVtcGxhdGVfZmlsZTogVEZpbGUsXG4gICAgICAgIGZpbGU6IFRGaWxlXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHJ1bm5pbmdfY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlLFxuICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgIFJ1bk1vZGUuT3ZlcndyaXRlRmlsZVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICApO1xuICAgICAgICAvLyBlcnJvcldyYXBwZXIgZmFpbGVkXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG91dHB1dF9jb250ZW50KTtcbiAgICAgICAgYXdhaXQgdGhpcy5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKGZpbGUpO1xuICAgIH1cblxuICAgIG92ZXJ3cml0ZV9hY3RpdmVfZmlsZV9jb21tYW5kcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09PSBudWxsKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkFjdGl2ZSB2aWV3IGlzIG51bGwsIGNhbid0IG92ZXJ3cml0ZSBjb250ZW50XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3ZlcndyaXRlX2ZpbGVfY29tbWFuZHMoYWN0aXZlX3ZpZXcuZmlsZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3ZlcndyaXRlX2ZpbGVfY29tbWFuZHMoXG4gICAgICAgIGZpbGU6IFRGaWxlLFxuICAgICAgICBhY3RpdmVfZmlsZSA9IGZhbHNlXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHJ1bm5pbmdfY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgIGFjdGl2ZV9maWxlID8gUnVuTW9kZS5PdmVyd3JpdGVBY3RpdmVGaWxlIDogUnVuTW9kZS5PdmVyd3JpdGVGaWxlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5yZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShydW5uaW5nX2NvbmZpZyksXG4gICAgICAgICAgICBcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiXG4gICAgICAgICk7XG4gICAgICAgIC8vIGVycm9yV3JhcHBlciBmYWlsZWRcbiAgICAgICAgaWYgKG91dHB1dF9jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgb3V0cHV0X2NvbnRlbnQpO1xuICAgICAgICBhd2FpdCB0aGlzLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oZmlsZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcHJvY2Vzc19keW5hbWljX3RlbXBsYXRlcyhcbiAgICAgICAgZWw6IEhUTUxFbGVtZW50LFxuICAgICAgICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgZHluYW1pY19jb21tYW5kX3JlZ2V4ID1cbiAgICAgICAgICAgIC8oPCUoPzotfF8pP1xccypbKn5dezAsMX0pXFwrKCg/Oi58XFxzKSo/JT4pL2c7XG5cbiAgICAgICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKGVsLCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gICAgICAgIGxldCBub2RlO1xuICAgICAgICBsZXQgcGFzcyA9IGZhbHNlO1xuICAgICAgICBsZXQgZnVuY3Rpb25zX29iamVjdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBkeW5hbWljX2NvbW1hbmRfcmVnZXguZXhlYyhjb250ZW50KSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KFxuICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBjdHguc291cmNlUGF0aFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlIHx8ICEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghcGFzcykge1xuICAgICAgICAgICAgICAgICAgICBwYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJ1bk1vZGUuRHluYW1pY1Byb2Nlc3NvclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnNfb2JqZWN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZnVuY3Rpb25zX2dlbmVyYXRvci5nZW5lcmF0ZV9vYmplY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3QgPSBmdW5jdGlvbnNfb2JqZWN0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdoaWxlIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCB0aGUgbW9zdCBlZmZpY2llbnQgd2F5IHRvIGV4Y2x1ZGUgdGhlICcrJyBmcm9tIHRoZSBjb21tYW5kIGJ1dCBJIGNvdWxkbid0IGZpbmQgc29tZXRoaW5nIGJldHRlclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wbGV0ZV9jb21tYW5kID0gbWF0Y2hbMV0gKyBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tbWFuZF9vdXRwdXQ6IHN0cmluZyA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wYXJzZXIucGFyc2VfY29tbWFuZHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlX2NvbW1hbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uc19vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBDb21tYW5kIFBhcnNpbmcgZXJyb3IgaW4gZHluYW1pYyBjb21tYW5kICcke2NvbXBsZXRlX2NvbW1hbmR9J2BcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRfb3V0cHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBkeW5hbWljX2NvbW1hbmRfcmVnZXgubGFzdEluZGV4IC0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBkeW5hbWljX2NvbW1hbmRfcmVnZXgubGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuc3Vic3RyaW5nKDAsIHN0YXJ0KSArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kX291dHB1dCArXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnN1YnN0cmluZyhlbmQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNfY29tbWFuZF9yZWdleC5sYXN0SW5kZXggKz1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRfb3V0cHV0Lmxlbmd0aCAtIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBkeW5hbWljX2NvbW1hbmRfcmVnZXguZXhlYyhjb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBjb250ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0X25ld19maWxlX3RlbXBsYXRlX2Zvcl9mb2xkZXIoZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLmZpbmQoXG4gICAgICAgICAgICAgICAgKGUpID0+IGUuZm9sZGVyID09IGZvbGRlci5wYXRoXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2gudGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2gudGVtcGxhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvbGRlciA9IGZvbGRlci5wYXJlbnQ7XG4gICAgICAgIH0gd2hpbGUgKGZvbGRlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIG9uX2ZpbGVfY3JlYXRpb24oXG4gICAgICAgIHRlbXBsYXRlcjogVGVtcGxhdGVyLFxuICAgICAgICBmaWxlOiBUQWJzdHJhY3RGaWxlXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgfHwgZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXZvaWRzIHRlbXBsYXRlIHJlcGxhY2VtZW50IHdoZW4gc3luY2luZyB0ZW1wbGF0ZSBmaWxlc1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZV9mb2xkZXIgPSBub3JtYWxpemVQYXRoKFxuICAgICAgICAgICAgdGVtcGxhdGVyLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyXG4gICAgICAgICk7XG4gICAgICAgIGlmIChmaWxlLnBhdGguaW5jbHVkZXModGVtcGxhdGVfZm9sZGVyKSAmJiB0ZW1wbGF0ZV9mb2xkZXIgIT09IFwiL1wiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXG4gICAgICAgIC8vIEN1cnJlbnRseSwgSSBoYXZlIHRvIHdhaXQgZm9yIHRoZSBkYWlseSBub3RlIHBsdWdpbiB0byBhZGQgdGhlIGZpbGUgY29udGVudCBiZWZvcmUgcmVwbGFjaW5nXG4gICAgICAgIC8vIE5vdCBhIHByb2JsZW0gd2l0aCBDYWxlbmRhciBob3dldmVyIHNpbmNlIGl0IGNyZWF0ZXMgdGhlIGZpbGUgd2l0aCB0aGUgZXhpc3RpbmcgY29udGVudFxuICAgICAgICBhd2FpdCBkZWxheSgzMDApO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGZpbGUuc3RhdC5zaXplID09IDAgJiZcbiAgICAgICAgICAgIHRlbXBsYXRlci5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXNcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBmb2xkZXJfdGVtcGxhdGVfbWF0Y2ggPVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlci5nZXRfbmV3X2ZpbGVfdGVtcGxhdGVfZm9yX2ZvbGRlcihmaWxlLnBhcmVudCk7XG4gICAgICAgICAgICBpZiAoIWZvbGRlcl90ZW1wbGF0ZV9tYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVfZmlsZTogVEZpbGUgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICAgICAgYXN5bmMgKCk6IFByb21pc2U8VEZpbGU+ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVfdGZpbGUodGVtcGxhdGVyLmFwcCwgZm9sZGVyX3RlbXBsYXRlX21hdGNoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGBDb3VsZG4ndCBmaW5kIHRlbXBsYXRlICR7Zm9sZGVyX3RlbXBsYXRlX21hdGNofWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBlcnJvcldyYXBwZXIgZmFpbGVkXG4gICAgICAgICAgICBpZiAodGVtcGxhdGVfZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgdGVtcGxhdGVyLndyaXRlX3RlbXBsYXRlX3RvX2ZpbGUodGVtcGxhdGVfZmlsZSwgZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0ZW1wbGF0ZXIub3ZlcndyaXRlX2ZpbGVfY29tbWFuZHMoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlX3N0YXJ0dXBfc2NyaXB0cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcykge1xuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAgICAgKCkgPT4gcmVzb2x2ZV90ZmlsZSh0aGlzLmFwcCwgdGVtcGxhdGUpLFxuICAgICAgICAgICAgICAgIGBDb3VsZG4ndCBmaW5kIHN0YXJ0dXAgdGVtcGxhdGUgXCIke3RlbXBsYXRlfVwiYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgUnVuTW9kZS5TdGFydHVwVGVtcGxhdGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gdGhpcy5yZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShydW5uaW5nX2NvbmZpZyksXG4gICAgICAgICAgICAgICAgYFN0YXJ0dXAgVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IFRlbXBsYXRlciB9IGZyb20gXCJUZW1wbGF0ZXJcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIlNldHRpbmdzXCI7XG5pbXBvcnQge1xuICAgIEFwcCxcbiAgICBFdmVudFJlZixcbiAgICBNZW51LFxuICAgIE1lbnVJdGVtLFxuICAgIFRBYnN0cmFjdEZpbGUsXG4gICAgVEZpbGUsXG4gICAgVEZvbGRlcixcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50SGFuZGxlciB7XG4gICAgcHJpdmF0ZSBzeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50OiBFdmVudFJlZjtcbiAgICBwcml2YXRlIHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudDogRXZlbnRSZWY7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHA6IEFwcCxcbiAgICAgICAgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbixcbiAgICAgICAgcHJpdmF0ZSB0ZW1wbGF0ZXI6IFRlbXBsYXRlcixcbiAgICAgICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NcbiAgICApIHt9XG5cbiAgICBzZXR1cCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVfdHJpZ2dlcl9maWxlX29uX2NyZWF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZV9zeW50YXhfaGlnaGxpZ2h0aW5nKCk7XG4gICAgICAgIHRoaXMudXBkYXRlX2ZpbGVfbWVudSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZV9zeW50YXhfaGlnaGxpZ2h0aW5nKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3ludGF4X2hpZ2hsaWdodGluZykge1xuICAgICAgICAgICAgdGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50ID0gdGhpcy5hcHAud29ya3NwYWNlLm9uKFxuICAgICAgICAgICAgICAgIFwiY29kZW1pcnJvclwiLFxuICAgICAgICAgICAgICAgIChjbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJtb2RlXCIsIFwidGVtcGxhdGVyXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNtLnNldE9wdGlvbihcIm1vZGVcIiwgXCJ0ZW1wbGF0ZXJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRXZlbnQodGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwibW9kZVwiLCBcImh5cGVybWRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZV90cmlnZ2VyX2ZpbGVfb25fY3JlYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbikge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQgPSB0aGlzLmFwcC52YXVsdC5vbihcbiAgICAgICAgICAgICAgICBcImNyZWF0ZVwiLFxuICAgICAgICAgICAgICAgIChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PlxuICAgICAgICAgICAgICAgICAgICBUZW1wbGF0ZXIub25fZmlsZV9jcmVhdGlvbih0aGlzLnRlbXBsYXRlciwgZmlsZSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckV2ZW50KHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0Lm9mZnJlZih0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVfZmlsZV9tZW51KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51OiBNZW51LCBmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW06IE1lbnVJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKFwiQ3JlYXRlIG5ldyBub3RlIGZyb20gdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInRlbXBsYXRlci1pY29uXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5mdXp6eV9zdWdnZXN0ZXIuY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IHJlc29sdmVfdGZpbGUgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIENvbW1hbmRIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7fVxuXG4gICAgc2V0dXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiaW5zZXJ0LXRlbXBsYXRlclwiLFxuICAgICAgICAgICAgbmFtZTogXCJPcGVuIEluc2VydCBUZW1wbGF0ZSBtb2RhbFwiLFxuICAgICAgICAgICAgaG90a2V5czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJlXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmZ1enp5X3N1Z2dlc3Rlci5pbnNlcnRfdGVtcGxhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwicmVwbGFjZS1pbi1maWxlLXRlbXBsYXRlclwiLFxuICAgICAgICAgICAgbmFtZTogXCJSZXBsYWNlIHRlbXBsYXRlcyBpbiB0aGUgYWN0aXZlIGZpbGVcIixcbiAgICAgICAgICAgIGhvdGtleXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIub3ZlcndyaXRlX2FjdGl2ZV9maWxlX2NvbW1hbmRzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImp1bXAtdG8tbmV4dC1jdXJzb3ItbG9jYXRpb25cIixcbiAgICAgICAgICAgIG5hbWU6IFwiSnVtcCB0byBuZXh0IGN1cnNvciBsb2NhdGlvblwiLFxuICAgICAgICAgICAgaG90a2V5czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJUYWJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmVkaXRvci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImNyZWF0ZS1uZXctbm90ZS1mcm9tLXRlbXBsYXRlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZSBuZXcgbm90ZSBmcm9tIHRlbXBsYXRlXCIsXG4gICAgICAgICAgICBob3RrZXlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcIm5cIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyX3RlbXBsYXRlc19ob3RrZXlzKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJfdGVtcGxhdGVzX2hvdGtleXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMuZm9yRWFjaCgodGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkX3RlbXBsYXRlX2hvdGtleShudWxsLCB0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF90ZW1wbGF0ZV9ob3RrZXkob2xkX3RlbXBsYXRlOiBzdHJpbmcsIG5ld190ZW1wbGF0ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVtb3ZlX3RlbXBsYXRlX2hvdGtleShvbGRfdGVtcGxhdGUpO1xuXG4gICAgICAgIGlmIChuZXdfdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgICAgIGlkOiBuZXdfdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgbmFtZTogYEluc2VydCAke25ld190ZW1wbGF0ZX1gLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZXJyb3JXcmFwcGVyU3luYyhcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHJlc29sdmVfdGZpbGUodGhpcy5hcHAsIG5ld190ZW1wbGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBgQ291bGRuJ3QgZmluZCB0aGUgdGVtcGxhdGUgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBob3RrZXlgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVfdGVtcGxhdGVfaG90a2V5KHRlbXBsYXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBGaW5kIG9mZmljaWFsIHdheSB0byBkbyB0aGlzXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLmFwcC5jb21tYW5kcy5yZW1vdmVDb21tYW5kKFxuICAgICAgICAgICAgICAgIGAke3RoaXMucGx1Z2luLm1hbmlmZXN0LmlkfToke3RlbXBsYXRlfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBhZGRJY29uLCBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgREVGQVVMVF9TRVRUSU5HUywgU2V0dGluZ3MsIFRlbXBsYXRlclNldHRpbmdUYWIgfSBmcm9tIFwiU2V0dGluZ3NcIjtcbmltcG9ydCB7IEZ1enp5U3VnZ2VzdGVyIH0gZnJvbSBcIkZ1enp5U3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBJQ09OX0RBVEEgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXIgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCJFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IENvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIkNvbW1hbmRIYW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gICAgcHVibGljIHNldHRpbmdzOiBTZXR0aW5ncztcbiAgICBwdWJsaWMgdGVtcGxhdGVyOiBUZW1wbGF0ZXI7XG4gICAgcHVibGljIGV2ZW50X2hhbmRsZXI6IEV2ZW50SGFuZGxlcjtcbiAgICBwdWJsaWMgY29tbWFuZF9oYW5kbGVyOiBDb21tYW5kSGFuZGxlcjtcbiAgICBwdWJsaWMgZnV6enlfc3VnZ2VzdGVyOiBGdXp6eVN1Z2dlc3RlcjtcblxuICAgIGFzeW5jIG9ubG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkX3NldHRpbmdzKCk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZXIgPSBuZXcgVGVtcGxhdGVyKHRoaXMuYXBwLCB0aGlzKTtcbiAgICAgICAgYXdhaXQgdGhpcy50ZW1wbGF0ZXIuc2V0dXAoKTtcblxuICAgICAgICB0aGlzLmZ1enp5X3N1Z2dlc3RlciA9IG5ldyBGdXp6eVN1Z2dlc3Rlcih0aGlzLmFwcCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5ldmVudF9oYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcihcbiAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVyLFxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmV2ZW50X2hhbmRsZXIuc2V0dXAoKTtcblxuICAgICAgICB0aGlzLmNvbW1hbmRfaGFuZGxlciA9IG5ldyBDb21tYW5kSGFuZGxlcih0aGlzLmFwcCwgdGhpcyk7XG4gICAgICAgIHRoaXMuY29tbWFuZF9oYW5kbGVyLnNldHVwKCk7XG5cbiAgICAgICAgYWRkSWNvbihcInRlbXBsYXRlci1pY29uXCIsIElDT05fREFUQSk7XG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInRlbXBsYXRlci1pY29uXCIsIFwiVGVtcGxhdGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnV6enlfc3VnZ2VzdGVyLmluc2VydF90ZW1wbGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFRlbXBsYXRlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICAvLyBGaWxlcyBtaWdodCBub3QgYmUgY3JlYXRlZCB5ZXRcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXIuZXhlY3V0ZV9zdGFydHVwX3NjcmlwdHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZV9zZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkX3NldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZERhdGEoKVxuICAgICAgICApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJOb3RpY2UiLCJlZmZlY3QiLCJtaW4iLCJtYXgiLCJtYXRoTWF4IiwibWF0aE1pbiIsImhhc2giLCJhbGxQbGFjZW1lbnRzIiwicGxhY2VtZW50cyIsInBvcHBlck9mZnNldHMiLCJjb21wdXRlU3R5bGVzIiwiYXBwbHlTdHlsZXMiLCJvZmZzZXQiLCJmbGlwIiwicHJldmVudE92ZXJmbG93IiwiYXJyb3ciLCJoaWRlIiwiU2NvcGUiLCJURm9sZGVyIiwibm9ybWFsaXplUGF0aCIsIlRGaWxlIiwiVmF1bHQiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIkZ1enp5U3VnZ2VzdE1vZGFsIiwiTWFya2Rvd25WaWV3IiwicGFyc2VMaW5rdGV4dCIsInJlc29sdmVTdWJwYXRoIiwiUGxhdGZvcm0iLCJGaWxlU3lzdGVtQWRhcHRlciIsImdldEFsbFRhZ3MiLCJNb2RhbCIsInByb21pc2lmeSIsImV4ZWMiLCJvYnNpZGlhbl9tb2R1bGUiLCJyZXNvbHZlIiwiZGlybmFtZSIsImV4dG5hbWUiLCJleGlzdHNTeW5jIiwicmVhZEZpbGVTeW5jIiwiRXRhLnJlbmRlckFzeW5jIiwiUGx1Z2luIiwiYWRkSWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxP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
