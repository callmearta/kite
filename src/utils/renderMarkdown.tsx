import { RichText } from "@atproto/api";
import { Link } from "react-router-dom";
import agent from "../Agent";


export default function renderMarkdown(text: string) {
    if(!text || !text.length) return [];
    const rt = new RichText({ text })
    rt.detectFacets(agent);
    let markdown = []
    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            markdown.push(<a href={segment.link?.uri} className="text-primary" target="_blank">{segment.text}</a>)
        } else if (segment.isMention()) {
            markdown.push(<Link className="text-primary" to={`/user/${segment.text.substring(1, segment.text.length)}`}>{segment.text}</Link>)

        } else {
            
            markdown.push(segment.text)
        }
    }

    return (markdown);
}