"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _react = _interopRequireDefault(require("react"));

var _addons = _interopRequireDefault(require("@storybook/addons"));

var _StoryPanel = require("./StoryPanel");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function register() {
  _addons["default"].register(_.ADDON_ID, function (api) {
    _addons["default"].addPanel(_.PANEL_ID, {
      title: 'Compiled Code',
      render: function render(_ref) {
        var active = _ref.active,
            key = _ref.key;
        return active ? /*#__PURE__*/_react["default"].createElement(_StoryPanel.StoryPanel, {
          key: key,
          api: api
        }) : null;
      },
      paramKey: 'compiled-code'
    });
  });
}