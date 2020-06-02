"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.ends-with");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StoryPanel = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _router = require("@storybook/router");

var _components = require("@storybook/components");

var _coreEvents = require("@storybook/core-events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var StyledStoryLink = (0, _theming.styled)(_router.Link)(function (_ref) {
  var theme = _ref.theme;
  return {
    display: 'block',
    textDecoration: 'none',
    borderRadius: theme.appBorderRadius,
    color: 'inherit',
    '&:hover': {
      background: theme.background.hoverable
    }
  };
});

var SelectedStoryHighlight = _theming.styled.div(function (_ref2) {
  var theme = _ref2.theme;
  return {
    background: theme.background.hoverable,
    borderRadius: theme.appBorderRadius
  };
});

var StyledSyntaxHighlighter = (0, _theming.styled)(_components.SyntaxHighlighter)(function (_ref3) {
  var theme = _ref3.theme;
  return {
    fontSize: theme.typography.size.s2 - 1
  };
});

var areLocationsEqual = function areLocationsEqual(a, b) {
  return a.startLoc.line === b.startLoc.line && a.startLoc.col === b.startLoc.col && a.endLoc.line === b.endLoc.line && a.endLoc.col === b.endLoc.col;
};

var StoryPanel = function StoryPanel(_ref4) {
  var api = _ref4.api;

  var _React$useState = _react["default"].useState({
    source: 'loading source...',
    locationsMap: {}
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var story = api.getCurrentStoryData();

  var selectedStoryRef = _react["default"].useRef(null);

  var setStoryState = function setStoryState() {
    if (story && window.document.querySelector('#storybook-preview-iframe')) {
      var _ref5, _ref6;

      var compiledSource = ((_ref5 = window.document.querySelector('#storybook-preview-iframe')) === null || _ref5 === void 0 ? void 0 : _ref5.contentDocument.querySelector('#root')) ? (_ref6 = window.document.querySelector('#storybook-preview-iframe')) === null || _ref6 === void 0 ? void 0 : _ref6.contentDocument.querySelector('#root').innerHTML : '';
      var _story$parameters = story.parameters;
      _story$parameters = _story$parameters === void 0 ? {} : _story$parameters;
      var _story$parameters$sto = _story$parameters.storySource;
      _story$parameters$sto = _story$parameters$sto === void 0 ? {
        locationsMap: {}
      } : _story$parameters$sto;
      var _locationsMap = _story$parameters$sto.locationsMap;

      var _currentLocation = _locationsMap ? _locationsMap[Object.keys(_locationsMap).find(function (key) {
        var sourceLoaderId = key.split('--');
        return story.id.endsWith(sourceLoaderId[sourceLoaderId.length - 1]);
      })] : undefined;

      setState({
        source: compiledSource,
        locationsMap: _locationsMap,
        currentLocation: _currentLocation
      });
    }
  };

  _react["default"].useEffect(function () {
    return setStoryState();
  }, []);

  api.on(_coreEvents.STORY_RENDERED, function () {
    return setStoryState();
  });

  _react["default"].useEffect(function () {
    if (selectedStoryRef.current) {
      selectedStoryRef.current.scrollIntoView();
    }
  }, [selectedStoryRef.current]);

  var source = state.source,
      locationsMap = state.locationsMap,
      currentLocation = state.currentLocation;

  var createPart = function createPart(_ref7) {
    var rows = _ref7.rows,
        stylesheet = _ref7.stylesheet,
        useInlineStyles = _ref7.useInlineStyles;
    return rows.map(function (node, i) {
      return (0, _components.createSyntaxHighlighterElement)({
        node: node,
        stylesheet: stylesheet,
        useInlineStyles: useInlineStyles,
        key: "code-segement".concat(i)
      });
    });
  };

  var createStoryPart = function createStoryPart(_ref8) {
    var rows = _ref8.rows,
        stylesheet = _ref8.stylesheet,
        useInlineStyles = _ref8.useInlineStyles,
        location = _ref8.location,
        id = _ref8.id,
        refId = _ref8.refId;
    var first = location.startLoc.line - 1;
    var last = location.endLoc.line;
    var storyRows = rows.slice(first, last);
    var storySource = createPart({
      rows: storyRows,
      stylesheet: stylesheet,
      useInlineStyles: useInlineStyles
    });
    var storyKey = "".concat(first, "-").concat(last);

    if (currentLocation && areLocationsEqual(location, currentLocation)) {
      return /*#__PURE__*/_react["default"].createElement(SelectedStoryHighlight, {
        key: storyKey,
        ref: selectedStoryRef
      }, storySource);
    }

    return /*#__PURE__*/_react["default"].createElement(StyledStoryLink, {
      to: refId ? "/story/".concat(refId, "_").concat(id) : "/story/".concat(id),
      key: storyKey
    }, storySource);
  };

  var createParts = function createParts(_ref9) {
    var rows = _ref9.rows,
        stylesheet = _ref9.stylesheet,
        useInlineStyles = _ref9.useInlineStyles;
    var parts = [];
    var lastRow = 0;
    Object.keys(locationsMap).forEach(function (key) {
      var location = locationsMap[key];
      var first = location.startLoc.line - 1;
      var last = location.endLoc.line;
      var kind = story.kind,
          refId = story.refId; // source loader ids are different from story id

      var sourceIdParts = key.split('--');
      var id = api.storyId(kind, sourceIdParts[sourceIdParts.length - 1]);
      var start = createPart({
        rows: rows.slice(lastRow, first),
        stylesheet: stylesheet,
        useInlineStyles: useInlineStyles
      });
      var storyPart = createStoryPart({
        rows: rows,
        stylesheet: stylesheet,
        useInlineStyles: useInlineStyles,
        location: location,
        id: id,
        refId: refId
      });
      parts.push(start);
      parts.push(storyPart);
      lastRow = last;
    });
    var lastPart = createPart({
      rows: rows.slice(lastRow),
      stylesheet: stylesheet,
      useInlineStyles: useInlineStyles
    });
    parts.push(lastPart);
    return parts;
  };

  var lineRenderer = function lineRenderer(_ref10) {
    var rows = _ref10.rows,
        stylesheet = _ref10.stylesheet,
        useInlineStyles = _ref10.useInlineStyles;
    // because of the usage of lineRenderer, all lines will be wrapped in a span
    // these spans will receive all classes on them for some reason
    // which makes colours casecade incorrectly
    // this removed that list of classnames
    var myrows = rows.map(function (_ref11) {
      var properties = _ref11.properties,
          rest = _objectWithoutProperties(_ref11, ["properties"]);

      return Object.assign({}, rest, {
        properties: {
          className: []
        }
      });
    });

    if (!locationsMap || !Object.keys(locationsMap).length) {
      return createPart({
        rows: myrows,
        stylesheet: stylesheet,
        useInlineStyles: useInlineStyles
      });
    }

    var parts = createParts({
      rows: myrows,
      stylesheet: stylesheet,
      useInlineStyles: useInlineStyles
    });
    return /*#__PURE__*/_react["default"].createElement("span", null, parts);
  };

  return /*#__PURE__*/_react["default"].createElement(StyledSyntaxHighlighter, {
    language: "jsx",
    showLineNumbers: true,
    renderer: lineRenderer,
    format: false,
    copyable: false,
    padded: true
  }, source);
};

exports.StoryPanel = StoryPanel;