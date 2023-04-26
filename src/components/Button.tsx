import Loading from "./Loading";

export default function Button(props: {
    text?: string,
    loading?: boolean,
    loadingColored?: boolean,
    [x: string]: any
}) {
    const { text, loading, loadingColored, ...rest } = props;

    return (
        <button {...rest}>{
            loading ? <Loading isColored={loadingColored} /> : text
        }</button>
    );
}