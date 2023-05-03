import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Portal } from "react-portal";
import { useMutation, useQueryClient } from "react-query";
import agent from "../../Agent";
import EditIcon from '../../assets/edit.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import Button from "../../components/Button";
import { userAtom } from "../../store/user";

export default function EditProfile(props: {
    isOpen: boolean,
    setIsOpen: Function,
    user: any,
    refetch:Function
}) {
    const { user,refetch } = props;
    const queryClient = useQueryClient();
    const { isOpen, setIsOpen } = props;
    const { mutate, isLoading } = useMutation((fn: any) => agent.upsertProfile(fn), {
        onSuccess: d => {
            queryClient.invalidateQueries([user.did,user.handle]);
            queryClient.invalidateQueries(["userPosts",user.handle]);
            queryClient.invalidateQueries(["userPosts",user.did]);
            queryClient.invalidateQueries(["profile"]);
            refetch();
            setIsOpen(false);
        }
    });

    const [form, setForm] = useState<{
        name: string,
        description: string,
        avatar: {
            file: File | null,
            preview: string | null | undefined
        },
        banner: {
            file: File | null,
            preview: string | null | undefined
        }
    }>({
        name: user?.displayName || '',
        description: user?.description || '',
        avatar: {
            file: null,
            preview: user?.avatar
        },
        banner: {
            file: null,
            preview: user?.banner
        }
    });

    const _handleSubmit = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        mutate(
            // @ts-ignore
            async (old: any) => {
                old = old || {};
                old.description = form.description;
                old.displayName = form.name;
                if (form.avatar.file) {
                    const avatarResult = await agent.uploadBlob(
                        new Uint8Array(await form.avatar.file.arrayBuffer()),
                        {
                            encoding: form.avatar.file.type,
                        }
                    );
                    old.avatar = avatarResult.data.blob;
                }

                if (form.banner.file) {
                    const bannerResult = await agent.uploadBlob(
                        new Uint8Array(await form.banner.file.arrayBuffer()),
                        {
                            encoding: form.banner.file.type,
                        }
                    );
                    old.banner = bannerResult.data.blob;
                }
                return old
            }
        );
    };

    const _handleBannerChange = (e: any) => {
        const files = e.target.files[0];
        const preview = URL.createObjectURL(files);
        setForm(prev => ({ ...prev, banner: { file: files, preview: preview } }))
    }

    const _handleAvatarChange = (e: any) => {
        const files = e.target.files[0];
        const preview = URL.createObjectURL(files);
        setForm(prev => ({ ...prev, avatar: { file: files, preview: preview } }))
    }

    return (
        isOpen ?
            <Portal>
                <div className="modal">
                    <div className="backdrop" onClick={() => setIsOpen(false)}></div>
                    <div className="content">
                        <form onSubmit={_handleSubmit}>
                            <h3>Edit Profile</h3>
                            <div className="edit-image">
                                <img src={form.banner.preview!} alt="" />
                                <span>
                                    <input onChange={_handleBannerChange} type="file" />
                                    <img src={EditIcon} alt="" />
                                </span>
                            </div>
                            <div className="edit-image edit-avatar">
                                <img src={form.avatar.preview || AvatarPlaceholder} alt="" />
                                <span>
                                    <input onChange={_handleAvatarChange} type="file" />
                                    <img src={EditIcon} alt="" />
                                </span>
                            </div>
                            <div className="input-wrapper bordered">
                                <label>Name:</label>
                                <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} type="text" placeholder="Your Name" />
                            </div>
                            <div className="input-wrapper bordered">
                                <label>Bio:</label>
                                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="A short bio about you"></textarea>
                            </div>
                            <Button className="btn primary" text="Change" loading={isLoading} onClick={_handleSubmit} />
                        </form>
                    </div>
                </div>
            </Portal>
            : null
    );
}