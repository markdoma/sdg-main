import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useEffect, useState } from 'react';

const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }

  config.supportedScanTypes = [Html5QrcodeScanType.SCAN_TYPE_CAMERA];
  config.rememberLastUsedCamera = true;

  return config;
};

const Html5QrcodePlugin = (props) => {
  useEffect(() => {
    let html5QrcodeScanner = null;
    if (props.scannerActive) {
      const config = createConfig(props);
      const verbose = props.verbose === true;

      const targetElement = document.getElementById(qrcodeRegionId);
      console.log('targetElement:', targetElement);
      // Check if the element exists
      html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        verbose
      );

      if (!targetElement) {
        html5QrcodeScanner.clear();
      }
      // Wrap the setting of innerText in a conditional check
      // if (targetElement) {
      //   html5QrcodeScanner.render(
      //     props.qrCodeSuccessCallback
      //     // props.qrCodeErrorCallback
      //   );
      // }

      html5QrcodeScanner.render(
        props.qrCodeSuccessCallback
        // props.qrCodeErrorCallback
      );
    }

    // cleanup function when component will unmount
    return () => {
      // Only clear the scanner if the component is unmounted
      console.log(`qrscanner unmount - ${props.scannerActive}`);
      if (html5QrcodeScanner) {
        html5QrcodeScanner
          .clear()
          .then(() => {
            console.log('html5QrcodeScanner cleared.');
          })
          .catch((error) => {
            console.error('Failed to clear html5QrcodeScanner. ', error);
          });
      }
    };
  }, [
    // permissionGranted,
    props.scannerActive,
  ]);

  return <div id={qrcodeRegionId} className="html5-qrcode-element p-10" />;
};

export default Html5QrcodePlugin;
