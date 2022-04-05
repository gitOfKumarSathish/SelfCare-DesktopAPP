import { useEffect, useState } from "react";
import ReactChart from "../../../components/ReactChart/ReactChart";

export default function StartIperf3(props: any) {
  const [receiverDL, setReceiverDL] = useState(0);
  const [receiverUL, setReceiverUL] = useState(0);
  const [dataDL, setDataDL] = useState<number>()
  const [dataUL, setDataUL] = useState<number>()
  const [ulCompleted, setUlCompleted] = useState(false)

  const [showDLLoader, setShowDLLoader] = useState(false)
  const [showULLoader, setShowULLoader] = useState(false)

  const electron = window.require('electron');
  const ipc = electron.ipcRenderer;



  useEffect(() => {
    if (props.trigger) {
      shareDLData()
    }
  }, [props.trigger])

  function shareDLData() {
    console.log('im coming');
    setUlCompleted(false)
    ipc.send("msg", "iperf3 Download Data")
    // ipc.on('reply', (event: any, data: any) => {
    //   // console.log('data ', data);
    // })
    ipc.on('Interval DL', (event: any, data: any) => {
      setDataDL(data);
      // console.log('Interval throughput from DL IPerfDesktop', data);
    })
    ipc.on('Receiver DL', (event: any, data: any) => {
      setReceiverDL(data)
      if (data) {
        shareULData()
      }
      // console.log('Receiver throughput from DL IPerfDesktop', data);
    })
  }


  function shareULData() {
    ipc.send("msg", "iperf3 Upload Data")
    // ipc.on('reply', (event: any, data: any) => {
    //   // console.log('data ', data);
    // })
    ipc.on('Interval UL', (event: any, data: any) => {
      setDataUL(data)
      // console.log('Interval throughput from upload IPerfDesktop', data);
    })
    ipc.on('Receiver UL', (event: any, data: any) => {
      setReceiverUL(data)
      setUlCompleted(true)
      // console.log('Receiver throughput from upload IPerfDesktop', data);
    })
  }


  useEffect(() => {
    if (dataUL) {
      setShowDLLoader(false);
      setShowULLoader(true);
    } else if (dataDL) {
      setShowDLLoader(true);
      setShowULLoader(false);
    }
    if (receiverDL && receiverUL) {
      setShowULLoader(false);
    }
  }, [dataDL, dataUL, receiverDL, receiverUL])

  if (dataDL || dataUL) {

    const parentCallbackForIperf = {
      receiverDL,
      receiverUL,
      title: 'Iperf',
      showULLoader,
      showDLLoader
    }
    props.parentCallback(parentCallbackForIperf)
  }

  return (
    <>
      <div>
        {/* <button onClick={() => shareDLData()}>click for DL</button> */}
      </div>
      <ReactChart intervalDL={dataDL} intervalUL={dataUL} resetValue={ulCompleted} />
    </>
  )
};



