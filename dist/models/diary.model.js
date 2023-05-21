"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiarySchema = exports.ERoundPlayStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ERoundPlayStatus;
(function (ERoundPlayStatus) {
    ERoundPlayStatus["DONE"] = "DONE";
    ERoundPlayStatus["FAILED"] = "FAILED";
    ERoundPlayStatus["NONE"] = "NONE";
})(ERoundPlayStatus = exports.ERoundPlayStatus || (exports.ERoundPlayStatus = {}));
const diarySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    courses: [
        {
            course: {
                type: mongoose_1.Schema.Types.ObjectId,
                require: true,
                ref: "Course",
            },
            isCompleted: {
                type: Boolean,
                require: false,
                default: false,
            },
            lessions: [
                {
                    lession: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        require: true,
                    },
                    rounds: [
                        {
                            roundId: {
                                type: String,
                                require: true,
                            },
                            score: {
                                type: Number,
                                require: true,
                            },
                            playedAt: {
                                type: Date,
                                require: false,
                                default: Date.now(),
                            },
                            playStatus: {
                                type: String,
                                require: true,
                                enum: ERoundPlayStatus,
                            },
                        },
                    ],
                    isCompleted: {
                        type: Boolean,
                        require: false,
                        default: false,
                    },
                },
            ],
        },
    ],
}, {
    collection: "diaries",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
});
exports.DiarySchema = mongoose_1.default.model("Diary", diarySchema);
