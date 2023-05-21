"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRouter = exports.LessionRouter = exports.PublicRouter = exports.AuthRouter = exports.UserRouter = exports.DiaryRouter = exports.CourseRouter = void 0;
var course_route_1 = require("./course.route");
Object.defineProperty(exports, "CourseRouter", { enumerable: true, get: function () { return __importDefault(course_route_1).default; } });
var diary_route_1 = require("./diary.route");
Object.defineProperty(exports, "DiaryRouter", { enumerable: true, get: function () { return __importDefault(diary_route_1).default; } });
var user_route_1 = require("./user.route");
Object.defineProperty(exports, "UserRouter", { enumerable: true, get: function () { return __importDefault(user_route_1).default; } });
var auth_route_1 = require("./auth.route");
Object.defineProperty(exports, "AuthRouter", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
var public_route_1 = require("./public.route");
Object.defineProperty(exports, "PublicRouter", { enumerable: true, get: function () { return __importDefault(public_route_1).default; } });
var lession_route_1 = require("./lession.route");
Object.defineProperty(exports, "LessionRouter", { enumerable: true, get: function () { return __importDefault(lession_route_1).default; } });
var test_route_1 = require("./test.route");
Object.defineProperty(exports, "TestRouter", { enumerable: true, get: function () { return __importDefault(test_route_1).default; } });
