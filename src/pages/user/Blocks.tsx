import { Record } from "@atproto/api/src/client/types/com/atproto/repo/listRecords";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Loading from "../../components/Loading";
import PostsRenderer from "../../components/PostsRenderer";
import User from "../../components/Right/User";

export default function Blocks(props: {}) {
    const params = useParams();
    const { did } = params;
    const { data, isLoading: blocksLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(["userBlocks", did], ({ pageParam }) => {
        return agent.api.com.atproto.repo.listRecords({
            collection: "app.bsky.graph.block",
            repo: did!,
            cursor: pageParam || undefined,
            limit: 25
        })
    }, {
        retryOnMount: true,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.cursor ? lastPage.data.cursor : undefined;
        },
        onSuccess: async d => {
            const lastPageRecords = d.pages[d.pages.length - 1].data.records.map(record => (record.value as any).subject);
            if(!lastPageRecords.length) {
                setLoading(false);
                return;
            };
            
            const result = await agent.api.app.bsky.actor.getProfiles({
                actors: d.pages[d.pages.length - 1].data.records.map(record => (record.value as any).subject)
            });
            let newProfiles = d ? [...d?.pages[d.pages.length - 1].data.records!] : [];
            
            for (let i = 0; i < result.data.profiles.length; i++) {
                const profile = result.data.profiles[i];
                const indexInProfilesData = newProfiles.findIndex(i => (i.value as any).subject == profile.did);
                if (indexInProfilesData > -1) {
                    newProfiles[indexInProfilesData].profile = profile;
                }
            }
            newProfiles = newProfiles.filter(p => p.profile);
            setLoading(false);
            setProfilesData([...profilesData, ...newProfiles]);
        }
    });
    const [loading,setLoading] = useState(true);
    const [profilesData, setProfilesData] = useState<Record[]>([]);

    useEffect(() => {
        let fetching = false;
        const handleScroll = async (e: any) => {
            const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                if (hasNextPage) await fetchNextPage()
                fetching = false
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [fetchNextPage, hasNextPage])

    return (
        blocksLoading || loading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                <div className="blocks-page">
                    {profilesData.length ? profilesData.map(i => <User user={i.profile} />) : 
                        <p className="text-center p-5 text-grey">There are no blocked users!</p>
                    }
                </div>
                {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
            </>

    );
}