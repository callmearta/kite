import { RichText } from "atproto/packages/api";
import agent from "../Agent";

export default function renderMarkdown(text: string) {
    const rt = new RichText({ text })
    rt.detectFacets(agent);
    let markdown = ''
    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            markdown += `<a href="${segment.link?.uri}" target="_blank">${segment.text}</a>`
        } else if (segment.isMention()) {
            markdown += `[${segment.text}](/#/user/${segment.text.substring(1, segment.text.length)})`
        } else {
            markdown += segment.text
        }
    }
    return markdown;
}