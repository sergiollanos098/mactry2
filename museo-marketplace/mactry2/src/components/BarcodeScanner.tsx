import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

const BarcodeScanner = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const codeReader = new BrowserQRCodeReader();
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          console.log('QR Code scanned:', result.getText());
          alert(`QR Code scanned: ${result.getText()}`);
          codeReader.reset();
          onClose(); // Cierra el escáner después de escanear
        }
        if (error) {
          console.error('Error scanning QR Code:', error);
        }
      });

      return () => {
        codeReader.reset(); // Limpia el lector al desmontar el componente
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null; // No renderizar nada si el escáner no está abierto
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">QR Code Scanner</h2>
        <video ref={videoRef} style={{ width: '100%' }} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;