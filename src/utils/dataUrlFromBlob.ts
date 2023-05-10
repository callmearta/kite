const dataUrlFromBlob = (blobData: any) => {
    const arrayBufferView = new Uint8Array(blobData!);
    const blob = new Blob([arrayBufferView]);
    const url = URL.createObjectURL(blob);
    return url;
}

export default dataUrlFromBlob;