const linkFromPost = (post: any, uri: string | null = null) => {
    if (!post && !uri) return '';
    if (uri) {
        return `/blue/${uri?.split('/')[2]}/${uri?.split('/')[uri?.split('/').length - 1]}`;
    }
    return `/blue/${post?.uri?.split('/')[2]}/${post?.uri?.split('/')[post?.uri?.split('/').length - 1]}`;
}

export default linkFromPost;