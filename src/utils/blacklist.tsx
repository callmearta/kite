import { ProfileViewDetailed } from "@atproto/api/src/client/types/app/bsky/actor/defs";
import { FeedViewPost, PostView } from "@atproto/api/src/client/types/app/bsky/feed/defs";
import { getSettings } from "../store/settings";

const list: string[] = [];

const blacklist = (
    data: ProfileViewDetailed | FeedViewPost,
    customList?: any[]
) => {
    const isProfileList = data.did;
    const localList = (customList && typeof customList == 'object' && customList?.filter(i => (i as string).trim().length > 1)) || getSettings()?.blacklist?.filter((i: any) => (i as string).trim().length > 1) || [];
    if (isProfileList) {
        const isBlacked = [...list, ...localList].filter(i =>
            (data.handle as string).toLowerCase().includes(i)
            || (data.displayName as string)?.toLowerCase().includes(i)
        ).length;
        return !isBlacked;
    } else {
        // @ts-ignore
        const isBlacked = [...list, ...localList].filter(i =>
            // @ts-ignore
            ((data.post as PostView)?.record?.text as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.reply?.parent?.record?.text as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.reply?.root?.record?.text as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.post?.author?.handle as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.post?.author?.displayName as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.reply?.parent?.author?.displayName as string)?.toLowerCase().includes(i)
            // @ts-ignore
            || (data?.reply?.root?.author?.displayName as string)?.toLowerCase().includes(i)
        ).length;

        return !isBlacked;
    }
}

export default blacklist;