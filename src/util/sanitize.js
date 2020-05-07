/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import sanitizeHTML from "sanitize-html";

const htmlTagWhitelist = [ "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
    "nl", "li", "b", "i", "strong", "em", "strike", "code", "hr", "br", "div",
    "table", "thead", "caption", "tbody", "tr", "th", "td", "pre", "section", "main" ];
const htmlTagBlacklist = [ "style", "script", "textarea", "noscript", "footer", "nav", "header", "title", "figure", "img" ];
const htmlTagSelfClosingWhitelist = [ "br", "td", "th" ];
const htmlClassBlacklist = [ "page-navigation", "additional_information", "off-menu", "frame-top" ];
const htmlAttrWhitelist = { "*": ["class", "data-role", "style"], "a": [], "td": ["colspan"], "th": ["colspan"] };
const htmlInlineStyleWhitelist = { "*": { "color": [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^transparent$/],
    "text-align": [/^left$/, /^right$/, /^center$/], "font-size": [/^\d+(?:px|pt|em|%|)$/] } };

export default function sanitize (dirty) {
    if (!dirty) return "";
    const clean = sanitizeHTML(dirty, {
        allowedTags: htmlTagWhitelist,
        nonTextTags: htmlTagBlacklist,
        allowedAttributes: htmlAttrWhitelist,
        selfClosing: htmlTagSelfClosingWhitelist,
        allowedStyles: htmlInlineStyleWhitelist,
        exclusiveFilter(frame) {
            return (
                !frame.text.trim() &&
                !htmlTagSelfClosingWhitelist.includes(frame.tag)
            ) || (
                frame.attribs.hasOwnProperty("class") &&
                frame.attribs.class.split(/\s+/).some(className => htmlClassBlacklist.includes(className))
            );
        }
    });
    return clean;
}

export function extract (dirty) {
    if (!dirty) return "";
    const clean = sanitize(dirty);
    const text = sanitizeHTML(clean, {
        allowedTags: [],
        allowedAttributes: {},
        textFilter: function (text) {
            return text + " ";
        }
    });
    return text.replace(/\s\s+/g, " ");
}