import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ReactChart(props: any) {
    // console.log('props', props);
    let [dataDL, setdataDL] = useState<number[]>([])
    let [dataUL, setdataUL] = useState<number[]>([])
    useEffect(() => {
        // console.log(" data from chart ", props)
        if (props.intervalDL && dataDL.length < 10) {
            setdataDL(oldDL => [...oldDL, props.intervalDL]);
        }
        if (props.intervalUL && dataUL.length < 10) {
            setdataUL(oldUL => [...oldUL, props.intervalUL]);
        }

        if (props.resetValue) {
            setdataDL(dataDL.splice(0, dataDL.length))
            setdataUL(dataUL.splice(0, dataUL.length))
        }
    }, [props.intervalDL, props.intervalUL])
    // console.log('dataDL', dataDL);

    const data = {
        labels,
        datasets: [
            {
                type: 'line' as const,
                label: 'DL',
                borderColor: 'rgb(255, 99, 132)',
                // backgroundColor: 'rgb(255, 99, 132)',
                // borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                fill: true,
                // data: labels.map(() => Math.floor(Math.random() * 10)),
                data: dataDL,
            },
            {
                type: 'line' as const,
                label: 'UL',
                borderColor: 'rgb(75, 192, 192)',
                // backgroundColor: 'rgb(75, 192, 192)',
                // data: labels.map(() => Math.floor(Math.random() * 10)),
                data: dataUL,
                // borderColor: 'white',
                fill: true,
                // fillColor : "yellow",
                // strokeColor : "black",
                borderWidth: 2,
            },
            // {
            //     type: 'bar' as const,
            //     label: 'Dataset 3',
            //     backgroundColor: 'rgb(53, 162, 235)',
            //     data: labels.map(() => Math.floor(Math.random() * 10)),
            // },
        ],
    };
    const options = {
        responsive: true,
        legend: {
            display: false
        },
        layout: {
            padding: {
                top: 5,
                left: 15,
                right: 15,
                bottom: 15
            }
        },
        bezierCurve: true,
        scales: {
            xAxes: [{
                ticks: { beginAtZero: true, stepSize: 1, display: false, },
                scaleLabel: {
                    display: false,
                    // labelString: 'ul'
                }
            }],
            yAxes: [{
                ticks: { beginAtZero: true, display: false, },
                scaleLabel: {
                    display: false,
                    // labelString: 'dl'
                }
            }]
        },
        elements: {
            line: {
                tension: 0.5
            },
        },

    }

    return <Line data={data} options={options} />;
}
