import { IonButton } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import RadialGauges from '../../components/gauges/RadialGauges';

import AuthContext from "./../../components/ContextStorage/TrafficContext.js";

const delay = 1;
const Ping = window.require("ping");
export default function PingWindow(props: any) {
    const auth = useContext(AuthContext);
    let [enablePingTraffic, setEnablePingTraffic] = useState(false);
    const [latency, setLatency] = useState(0);
    let [latencyAvg, setLatencyAvg] = useState<number[]>([])
    useEffect(() => {
        if (enablePingTraffic) {
            auth.enableTraffics = false;
            let count = 0;
            let timer = setInterval(() => {
                count++;
                if (count === 10) {
                    clearInterval(timer);
                    setEnablePingTraffic(false)
                    count = 0
                }
                var hosts = ["google.com"];
                let pingInstance = new Ping();
                let pingPacketCommand = "-s";
                let pingDurationCommand = "-c";
                if (window.navigator.platform === 'Win32') {
                    pingDurationCommand = '-n';
                    pingPacketCommand = '-l';
                }
                pingInstance
                    .probe(hosts, {
                        timeout: 2,
                        extra: [pingPacketCommand, +64, pingDurationCommand, +1],
                    })
                    .then((result: any) => {
                        console.log("result", result);
                        setLatency(result.time);
                        setLatencyAvg(oldLatency => [...oldLatency, result.time]);
                    });
            }, delay * 1000)
        }
    }, [enablePingTraffic, props.data]);
    if (latencyAvg.length === 10) {
        const totalAverageLatency = latencyAvg.length > 0 ? ((latencyAvg.reduce((a, b) => a + b, 0)) / latencyAvg.length).toFixed(2) : 0
        const parentCallbackForPing = {
            totalAverageLatency,
            showPingValue: true,
            title: 'Ping',
            showLoaderPing:  true
        }
        props.parentCallback(parentCallbackForPing)
        setLatencyAvg([])
    }


    function triggerTest(): void {
        setEnablePingTraffic(true)
        setLatencyAvg([])
        setLatency(0)
        const parentCallbackForPing = {
            totalAverageLatency: 0,
            showPingValue: false,
            showLoaderPing:  true
        }
        props.parentCallback(parentCallbackForPing)
    }
    return (
        <div className='p-1 gaugeArea'>
            <RadialGauges data={latency} />
            <div className='startButton'>
                <IonButton disabled={!auth.enableTraffics} size="large" color="medium" onClick={() => triggerTest()}>Start</IonButton>
            </div>
        </div>
    )

};


