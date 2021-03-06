"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultLang = void 0;
/**
 * Get a default language based on LANG environment value
 * @param lang
 */
function getDefaultLang(lang) {
    return lang && lang.startsWith("ja") ? "ja" : "en";
}
exports.getDefaultLang = getDefaultLang;
