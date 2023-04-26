import { RichText } from "@atproto/api";
import agent from "../Agent";

export default async function renderMarkdown(text: string) {
    const rt = new RichText({ text })
    await rt.detectFacets(agent);
    let markdown = ''
    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            markdown += `[${segment.text}](${segment.link?.uri})`
        } else if (segment.isMention()) {
            markdown += `[${segment.text}](/user/${segment.mention?.did})`
        } else {
            markdown += segment.text
        }
    }
    return markdown;
}