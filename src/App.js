import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef();
  const [cube, setCube] = useState([]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    updateCanvas(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    setInterval(() => {
      capture();
    }, 1500);
  }, [capture]);

  const updateCanvas = (src) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      const img_data = ctx.getImageData(0, 0, img.width, img.height);
      defineColors(img_data, img);
    };
    img.src = src;
  };

  const defineColors = (img_data, img) => {
    setCube([]);
    const pix = img_data.data;

    let x = 200,
      y = 125;

    for (let i = 0, id = 0; i < 3; i++, y += 100, x = 200) {
      for (let j = 0; j < 3; j++, x += 100) {
        const i = (y * img.width + x) * 4;
        const R = pix[i];
        const G = pix[i + 1];
        const B = pix[i + 2];
        const rgb = `rgb(${R},${G},${B})`;

        const block = {
          x,
          y,
          color: rgb,
          id,
          R,
          G,
          B,
        };

        id++;
        setCube((state) => [...state, block]);
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <canvas ref={canvasRef}></canvas>
      <div className="grid">
        {cube.map((el) => (
          <div
            key={el.id}
            className="g"
            style={{
              backgroundColor: el.color,
            }}
          >{`X: ${el.x}, Y: ${el.y}, ID: ${el.id}, COLOR: ${el.color}`}</div>
        ))}
      </div>
    </div>
  );
};
export default App;
