import { Line } from 'react-chartjs-2';

const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const data = {
    labels,
    datasets: [
        {
            type: 'line' as const,
            label: 'UL',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            data: labels.map(() => Math.floor(Math.random() * 10)),
            // data: [],
        },
        // {
        //     type: 'line' as const,
        //     label: 'DL',
        //     borderColor: 'rgb(75, 192, 192)',
        //     data: labels.map(() => Math.floor(Math.random() * 10)),
        //     // data: [],
        //     // borderColor: 'white',
        //     fill: false,
        //     borderWidth: 2,
        // },
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
            ticks: { beginAtZero: true, stepSize: 1, display: false, },
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


export default function ReactChartSingle() {
    return <Line data={data} options={options} />;
}
