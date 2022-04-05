import { IonImg } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import loaderGif from '../../assets/img/loader.gif'

const electron = window.require('electron');
const ipc = electron.ipcRenderer;

export default function Browsing(props: any) {
    const [browserValue, setBrowserValue] = useState<number>()
    const [browsingLoader, setBrowsingLoader] = useState(true)
    let [enableBrowsingTraffic, setEnableBrowsingTraffic] = useState(true);
    const [loadTimeAverage, setLoadTimeAverage] = useState<number[]>([])

    useEffect(() => {
        if (enableBrowsingTraffic) {
            let count = 0;
            let timer = setInterval(() => {
                count++;
                if (count === 10) {
                    clearInterval(timer);
                    setEnableBrowsingTraffic(false)
                    count = 0
                }
                const result = ipc.sendSync("BrowserMessage", "https://github.com");
                setLoadTimeAverage(oldLatency => [...oldLatency, result]);
            }, 1000)
        }
    }, [enableBrowsingTraffic])

    if (loadTimeAverage.length === 10) {
        const totalAverageLatency = +(loadTimeAverage.length > 0 ? ((loadTimeAverage.reduce((a, b) => a + b, 0)) / loadTimeAverage.length).toFixed(2) : 0);
        if (totalAverageLatency) {
            setBrowsingLoader(false)
        }
        setBrowserValue(totalAverageLatency)
        setLoadTimeAverage([])
    }
    let passToParent = {
        browserCompleted: browserValue ? browserValue > 0 : false
    }
    props.parentCallback(passToParent)
    return (
        <div>
            <h1> {!browsingLoader ? <h1>{browserValue + ' ms'}</h1> : <IonImg className='fnImg loader' src={loaderGif} alt='loader' />}</h1>
        </div>
    )
}
