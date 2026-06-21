"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie & TV Catalog API',
            version: '1.0.0',
            description: 'API documentation for LK21 metadata catalog',
        },
        servers: [
            {
                url: '/api',
                description: 'Current Environment'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/docs/*.yaml'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
