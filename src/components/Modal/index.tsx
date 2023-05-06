import cn from 'classnames';
import { useEffect, useRef } from 'react';

export default function Modal(props: {
    children: React.ReactNode,
    onClose: Function | any,
    className?: string,
    onScrollEnd?: Function
}) {
    const { children, onClose, className, onScrollEnd } = props;
    const contentRef = useRef<any>(null);

    useEffect(() => {
        if (!onScrollEnd || !contentRef.current) return;
        let fetching = false;
        const handleScroll = async (e: any) => {
            const { scrollHeight, scrollTop, clientHeight } = e.target;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                await onScrollEnd();
                fetching = false
            }
        }
        contentRef.current.addEventListener('scroll', handleScroll)
        return () => {
            if(contentRef.current)
            contentRef.current.removeEventListener('scroll', handleScroll)
        }
    }, [onScrollEnd, contentRef.current])

    return (
        <div className={cn("modal", className)}>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content" ref={contentRef}>
                {children}
            </div>
        </div>
    );
}