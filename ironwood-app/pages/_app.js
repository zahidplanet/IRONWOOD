import '../styles/globals.css';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <div style={{ paddingTop: '60px' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;