const linkFromPost = (post: any) => {
    return `/blue/${post?.uri?.split('/')[2]}/${post?.uri?.split('/')[post?.uri?.split('/').length - 1]}`;
}

export default linkFromPost;