import { RichText } from "@atproto/api";
import agent from "../Agent";

export default function renderMarkdown(text: string) {
    const rt = new RichText({ text })
    rt.detectFacets(agent);
    let markdown = ''
    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            markdown += `[${segment.text}](${segment.link?.uri})`
        } else if (segment.isMention()) {
            markdown += `[${segment.text}](/kite/#/user/${segment.text.substring(1,segment.text.length)})`
        } else {
            markdown += segment.text
        }
    }
    return markdown;
}