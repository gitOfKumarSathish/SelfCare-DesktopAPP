import { Route } from 'react-router-dom';
import { IonApp, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonModal, IonPage, IonRouterOutlet, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import download from './assets/img/download.png'
import upload from './assets/img/upload.png'
import latency from './assets/img/latency.png'
import heart from './assets/img/heart.png'
import wifi from './assets/img/wifi.png'
import frequency from './assets/img/frequency.png'
import computer from './assets/img/computer.png'
import faq from './assets/img/faq.png'
import timer from './assets/img/timer.png'
import issueFinder from './assets/img/issueFinder.png'
import loaderGif from './assets/img/loader.gif'

import { useState } from 'react';
import ReactChartSingle from './components/ReactChart/ReachChartSingle';
import PingWindow from './pages/RunTraffic/PingWindow';

import StartIperf3 from './pages/RunTraffic/iperf3Test/Iperf3Desktop';
import BrowsingTestDesktop from './pages/RunTraffic/Browsing';

import AuthContext from "./components/ContextStorage/TrafficContext.js";

setupIonicReact();
export function App() {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [avgLatency, setAvgLatency] = useState<number>(0);
  const [triggerBrowser, setTriggerBrowser] = useState<boolean>(false);
  const [dataDL, setdataDL] = useState<number>();
  const [dataUL, setdataUL] = useState<number>();


  const [pingLoader, setPingLoader] = useState<boolean>(false);
  const [startTraffic, setStartTraffic] = useState<boolean>(true);

  const [dlLoader, setDlLoader] = useState<boolean>(false);
  const [ulLoader, setUlLoader] = useState<boolean>(false);

  const [triggerIperf, setTriggerIperf] = useState<boolean>(false);



  function openWithDate(): void {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  let handleCallback = (childData: any) => {
    // console.log('childData', childData)
    setAvgLatency(childData.totalAverageLatency)
    setPingLoader(childData.showLoaderPing)
    setTriggerBrowser(childData.totalAverageLatency > 0)
    setStartTraffic(false)
  }

  let handleCallbackIperf = (childData: any) => {
    // console.log('childData', childData)
    setdataDL(childData.receiverDL)
    setdataUL(childData.receiverUL)
    setDlLoader(childData.showDLLoader)
    setUlLoader(childData.showULLoader)
    if (childData.receiverUL) {
      setStartTraffic(true)
    }
  }

  let handleCallbackBrowsing = (childData: any) => {
    console.log('childData', childData);
    setTriggerIperf(false)
  }
  // const handleCallback = useCallback((childData) => {
  //   console.log('childData', childData)
  //   setAvgLatency(childData.totalAverageLatency)
  //   setNoValue(childData.showPingValue)
  //   setTriggerBrowser(childData.totalAverageLatency > 0)
  // }, []);

  return (
    <AuthContext.Provider value={{ enableTraffics: startTraffic }}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={PingWindow} />
          </IonRouterOutlet>
        </IonReactRouter>
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                <h1 className='title'>SelfCarePortal</h1>
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <section className='container'>
              <div className='flex w-100 spaceBetween'>
                <IonCard className='flex spaceBetween w-18'>
                  <IonCardContent className='flex spaceBetween align-center p-1-full  '>
                    <div className='cardText flex align-center'> <IonImg className='fnImg detailing' src={wifi} alt='wifi' style={{ 'width': '35%' }} /> SSID:</div>
                    <h1>Alethea</h1>
                    {/* <h1>&nbsp;</h1> */}
                  </IonCardContent>
                </IonCard>
                <div className='flex'>
                  <IonCard className=''>
                    <IonCardContent className='cardText flex align-center' onClick={openWithDate}>   <IonImg style={{
                      'width': '66%',
                      'padding': '10px',
                      'alignSelf': 'end'
                    }} className='fnImg detailing' src={issueFinder} alt='issueFinder'></IonImg>
                    </IonCardContent>
                  </IonCard>
                  <IonCard className='urlCard'>
                    <IonCardContent className='cardText flex align-center'>
                      <IonImg className='fnImg detailing' src={faq} alt='faq'></IonImg>
                      <a href='http://faqs.com/'>  http://faqs.com/</a>
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
              <div className='flex networkPart'>
                <IonCard className='w-card'>
                  <IonCardContent className='p-1-full'>
                    <IonCardContent className='cardText flex align-center'>
                      <IonImg className='fnImg' src={heart} alt='heart' /> Health Index</IonCardContent>
                    <h1>3</h1>
                    {/* <h1>&nbsp;</h1> */}
                  </IonCardContent>
                </IonCard>
                <IonCard className='w-card'>
                  <IonCardContent className='p-1-full'>
                    <IonCardContent className='cardText flex align-center'> <IonImg className='fnImg' src={latency} alt='latency' /> Latency</IonCardContent>
                    {pingLoader ? (avgLatency !== 0 ? <h1>{avgLatency + ' ms'}</h1> : <IonImg className='fnImg loader' src={loaderGif} alt='loader' />) : <h1>&nbsp;</h1>}
                  </IonCardContent>
                </IonCard>
                <IonCard className='w-card'>
                  <IonCardContent className='p-1-full'>
                    <IonCardContent className='cardText flex align-center'>   <IonImg className='fnImg' src={timer} alt='timer' /> Load Time</IonCardContent>
                    {triggerBrowser ? <BrowsingTestDesktop parentCallback={handleCallbackBrowsing} /> : <h1>&nbsp;</h1>}
                  </IonCardContent>
                </IonCard>
                <IonCard className='w-card'>
                  <IonCardContent className='p-1-full'>
                    <IonCardContent className='cardText flex align-center'> <IonImg className='fnImg' src={download} alt='download' /> Download Speed</IonCardContent>
                    {dlLoader ? <IonImg className='fnImg loader' src={loaderGif} alt='loader' /> : <h1>{dataDL ? dataDL + ' Mbps' : dataDL}</h1>}
                  </IonCardContent>
                </IonCard>
                <IonCard className='w-card'>
                  <IonCardContent className='p-1-full'>
                    <IonCardContent className='cardText flex align-center'> <IonImg className='fnImg' src={upload} alt='upload' /> Upload Speed</IonCardContent>
                    {ulLoader ? <IonImg className='fnImg loader' src={loaderGif} alt='loader' /> : <h1>{dataUL ? dataUL + ' Mbps' : dataUL}</h1>}
                  </IonCardContent>
                </IonCard>
              </div>
              <div className='flex p-1 spaceBetween'>
                <PingWindow parentCallback={handleCallback} />
                <div className='w-52'>
                  <IonCard>
                    <IonCardContent className='p-1-full'>
                      <StartIperf3 parentCallback={handleCallbackIperf} trigger={triggerIperf} />
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
              <div className='flex networkPart'>
                <div className='flex w-50'>
                  <IonCard className='w-25'>
                    <IonCardContent className='p-1-full'>
                      <IonCardContent className='cardText flex align-center'>
                        <IonImg className='fnImg' src={frequency} alt='frequency' /> Band</IonCardContent>
                      <h1>2.4 GHz</h1>
                    </IonCardContent>
                  </IonCard>
                  <IonCard className='w-25'>
                    <IonCardContent className='p-1-full'>
                      <IonCardContent className='cardText flex align-center'>
                        <IonImg className='fnImg' src={computer} alt='computer' /> Device</IonCardContent>
                      <h1>802.11g</h1>
                    </IonCardContent>
                  </IonCard>
                </div>
                <div className='singleGraph'>
                  <h1>RSSI</h1>
                  <IonCard className='w-28'>
                    <ReactChartSingle />
                  </IonCard>
                </div>
              </div>
            </section>
          </IonContent>

          <IonModal isOpen={modalOpen} onDidDismiss={handleClose} className='modalCss'>
            <h1>Issue Finder</h1>
            <hr />
            <ul>
              <li>Your device is x meters away from the Access Point. Please keep your devices within ym.</li>
              <li>
                Access point is configured to work only for 2.4 GZ. Login to access point and set  band to auto
              </li>
            </ul>
          </IonModal>
        </IonPage >
      </IonApp>
    </AuthContext.Provider>
  )
};

export default App;

