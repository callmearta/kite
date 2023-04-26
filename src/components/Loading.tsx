import cn from 'classnames';

export default function Loading(props: {
    isColored?: boolean,
    isSmall?: boolean
}) {
    const { isColored, isSmall } = props;

    return (
        <span className={cn("loader", { colored: isColored, small: isSmall })}></span>
    );
}