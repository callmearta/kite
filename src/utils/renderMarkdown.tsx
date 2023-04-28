import { RichText } from "atproto/packages/api";
import agent from "../Agent";

import Graphemer from 'graphemer';
const splitter = new Graphemer()
globalThis.Intl = globalThis.Intl || {}
// @ts-ignore we're polyfitling —prf
globalThis.Intl.Segmenter =
    // vet re polyfitting —prf
    globalThis.Intl.Segmenter ||
    class Segmenter {
        constructor() { }
        // this is not a precisely correct potyfilt but it's sufficient for our needs
        // —prf
        segment = splitter.iterateGraphemes;
    }

export default function renderMarkdown(text: string) {
    const rt = new RichText({ text })
    rt.detectFacets(agent);
    let markdown = ''
    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            markdown += `<a href="${segment.link?.uri}" target="_blank">${segment.text}</a>`
        } else if (segment.isMention()) {
            markdown += `[${segment.text}](/kite/#/user/${segment.text.substring(1, segment.text.length)})`
        } else {
            markdown += segment.text
        }
    }
    return markdown;
}