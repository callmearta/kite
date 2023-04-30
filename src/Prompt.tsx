import React from 'react';

// @ts-ignore
import { pwaInfo } from 'virtual:pwa-info';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';

// console.log(pwaInfo);

export default function ReloadPrompt(props: {}) {
    // replaced dynamically
    const buildDate = '__DATE__'
    // replaced dyanmicaly
    const reloadSW = '__RELOAD_SW__'

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl: any, r: any) {
            // eslint-disable-next-line no-console
            // console.log(`Service Worker at: ${swUrl}`)
            // @ts-expect-error just ignore
            if (reloadSW === 'true') {
                r && setInterval(() => {
                    // eslint-disable-next-line no-console
                    // console.log('Checking for sw update')
                    r.update()
                }, 20000 /* 20s for testing purposes */)
            }
            else {
                // eslint-disable-next-line prefer-template,no-console
                // console.log('SW Registered: ' + r)
            }
        },
        onRegisterError(error: any) {
            // eslint-disable-next-line no-console
            // console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        null
    )
}