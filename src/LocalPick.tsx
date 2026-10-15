import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export function LocalImagePicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvas = canvasRef.current?.getContext('2d')
  const [show, setShow] = useState<boolean>(true)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterVal, setFilterVal] = useState<string | undefined>('')
  const cropperInstance = useRef<Cropper | null>(null);
  const [isCropMode, setIsCropMode] = useState<boolean>(false);
  const [angle, setAngle] = useState<number>(0)
  const [downloadURL, setDownloadURL] = useState<string | undefined>('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (isCropMode && imgRef.current) {
      cropperInstance.current = new Cropper(imgRef.current, {
        viewMode: 1, 
        movable: true,
        zoomable: true,
        scalable: true,
        rotatable: true,
        background: false, 
    });
  }

   return () => {
    if (cropperInstance.current) {
      cropperInstance.current.destroy();
      cropperInstance.current = null;
    }
   };
  }, [isCropMode]);

  useEffect(() => {
    if (!canvas) return
    const canvasCtx = canvas.canvas; 
    const ctx = canvas;              
    const degrees = angle; 
    const radians = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    if (!imgRef.current) return
    const imgWidth = imgRef.current.naturalWidth;
    const imgHeight = imgRef.current.naturalHeight;
    const newWidth = Math.floor(imgWidth * cos + imgHeight * sin);
    const newHeight = Math.floor(imgWidth * sin + imgHeight * cos);
    canvasCtx.width = newWidth;
    canvasCtx.height = newHeight;
    canvasCtx.style.maxWidth = '800px';
    canvasCtx.style.maxHeight = '600px';
    canvasCtx.style.width = '100%';
    canvasCtx.style.height = '100%';
    canvasCtx.style.objectFit = 'contain'; 
    canvasCtx.style.display = 'block';
    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.drawImage(imgRef.current, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!canvasRef.current) return
    setPreviewUrl(canvasRef.current.toDataURL('image/png'))
    setDownloadURL(canvasRef.current.toDataURL('image/png'))
  }, [angle]);

  const handleCanvasImg = () => {
    if (imgRef.current !== null && canvas !== null && canvas !== undefined && filterVal !== undefined) {
      const canvasCtx = canvas.canvas;
      canvas.filter = filterVal
      if (!canvasRef.current) return 
      canvasRef.current.width = imgRef.current.naturalWidth
      canvasRef.current.height = imgRef.current.naturalHeight
      canvasCtx.style.maxWidth = '800px';
      canvasCtx.style.maxHeight = '600px';
      canvasCtx.style.width = '100%';
      canvasCtx.style.height = '100%';
      canvasCtx.style.objectFit = 'contain'; 
      canvasCtx.style.display = 'block';
      const hRatio = canvasCtx.width / imgRef.current.naturalWidth;
      const vRatio = canvasCtx.height / imgRef.current.naturalHeight;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (canvasCtx.width - imgRef.current.naturalWidth * ratio) / 2;
      const centerShift_y = (canvasCtx.height - imgRef.current.naturalHeight * ratio) / 2;  
      canvas.clearRect(0, 0, canvasCtx.width, canvasCtx.height);
      canvas.drawImage(
          imgRef.current, 
          0, 0, imgRef.current.naturalWidth, imgRef.current.naturalHeight,
          centerShift_x, centerShift_y, imgRef.current.naturalWidth * ratio, imgRef.current.naturalHeight * ratio
      );
      setDownloadURL(canvasRef.current?.toDataURL('image/png'))
    }
  }

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!imgRef.current || !canvas || !canvasRef.current) return
    console.log(event.target.value)
     let filtStyle = event.target.value === 'Vintage' 
      ? 'sepia(50%) contrast(120%) brightness(110%) saturate(130%) hue-rotate(-10deg)' 
      : event.target.value === 'Sepia'
      ? 'sepia(100%)'
      : event.target.value === 'Cyberpunk Neon'
      ? 'contrast(130%) saturate(200%) hue-rotate(140deg) brightness(110%)'
      : event.target.value === 'High-Contrast Noir'
      ? 'grayscale(100%) contrast(160%) brightness(95%)'
      : event.target.value === 'Dramatic Moody'
      ? 'contrast(140%) brightness(85%) saturate(70%) sepia(20%)'
      : event.target.value === 'Vivid Pop'
      ? 'brightness(110%) contrast(125%)  saturate(150%) sepia(0%)'
      : event.target.value === 'Noir'
      ? 'grayscale(100%)'
      : event.target.value === 'Heatmap'
      ? 'invert(100%) hue-rotate(180deg) saturate(300%) contrast(150%)'
      : event.target.value === 'Matte'
      ? 'contrast(75%) brightness(110%) saturate(80%)'
      : event.target.value === 'Anime'
      ? 'saturate(180%) brightness(1.15) contrast(95%) sepia(10%)'
      : event.target.value === 'Beach'
      ? 'grayscale(40%) contrast(180%) brightness(90%) saturate(60%)'
      : 'none';
      setFilterVal(filtStyle)
      canvas.filter = filtStyle
      const canvasCtx = canvas.canvas;
      const hRatio = canvasCtx.width / imgRef.current.naturalWidth;
      const vRatio = canvasCtx.height / imgRef.current.naturalHeight;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (canvasCtx.width - imgRef.current.naturalWidth * ratio) / 2;
      const centerShift_y = (canvasCtx.height - imgRef.current.naturalHeight * ratio) / 2;  
      canvas.clearRect(0, 0, canvasCtx.width, canvasCtx.height);
      canvas.drawImage(
          imgRef.current, 
          0, 0, imgRef.current.naturalWidth, imgRef.current.naturalHeight, 
          centerShift_x, centerShift_y, imgRef.current.naturalWidth * ratio, imgRef.current.naturalHeight * ratio 
      );
      setDownloadURL(canvasRef.current.toDataURL('image/png'))
  }

  const handleRotate = () => {
       setAngle((prevAngle) => (prevAngle + 90) % 360);
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const objectUrl = URL.createObjectURL(selectedFile);
      console.log(objectUrl)
      setPreviewUrl(objectUrl);
    }
  };


  const startCropMode = () => {
    setShow(false)
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsCropMode(true);
  };

  const applyCrop = () => {
    setShow(true)
    if (!cropperInstance.current || !canvasRef.current || !imgRef.current) return;
    const croppedCanvas = cropperInstance.current.getCroppedCanvas({
        width: 800,  
        height: 600,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });
    if (!croppedCanvas) {
        console.error("Cropper could not generate a canvas. Is the image loaded?");
        return;
    }
    const targetCanvas = canvasRef.current;
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return
    const canvasCtx = ctx.canvas

    // const hRatio = canvasCtx.width / imgRef.current.naturalWidth;
    // const vRatio = canvasCtx.height / imgRef.current.naturalHeight;
    // const ratio = Math.min(hRatio, vRatio);
    // const centerShift_x = (canvasCtx.width - imgRef.current.naturalWidth * ratio) / 2;
    // const centerShift_y = (canvasCtx.height - imgRef.current.naturalHeight * ratio) / 2;  
    ctx.clearRect(0, 0, canvasCtx.width, canvasCtx.height);
    ctx.drawImage(
          imgRef.current, 
          800, 600
      );
    setPreviewUrl(croppedCanvas.toDataURL('image/png'))
    setDownloadURL(canvasRef.current?.toDataURL('image/png'))
    setIsCropMode(false);
  };

  const cancelCrop = () => {
    setIsCropMode(false);
    setShow(true)
  };

  return (
    <main>
        <div className="main_div">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }} 
          />
          <button 
            onClick={handleButtonClick}
            className="select_btn"
          >
            Select Image
          </button>
          <h2 style={{ display: previewUrl ? 'block' : 'none'}}className="canvas_h2">Canvas Render</h2>
          <div className="canvas_container">
              <canvas ref={canvasRef} id="myCanvas" className="canvas_elem" width="200" height="200" style={{display: isCropMode ? 'none' : 'block'}}></canvas>
          </div> 
          {previewUrl && (
            <div>
              <p>💡 Apply filter last or right before downloading image</p>
              <section className="image_control_sec">
              <a style={{display: show ? 'flex' : 'none'}} className="download_btn" href={downloadURL} download="Image name" >⬇️ Download Image</a>
                <button style={{display: show ? 'flex' : 'none'}} className="rotate_btn" onClick={handleRotate}>🔃 Rotate</button>
                <div>
                  {!isCropMode ? (
                    <button className="crop_btn" onClick={startCropMode}>
                      ✂️ Crop
                    </button>
                  ) : (
                    <>
                      <button className="apply_crop_btn" onClick={applyCrop} style={{  marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "10px 20px", borderRadius: '10px'  }}>
                        ✅ Apply Crop
                      </button>
                      <button className="cancel_crop_btn" onClick={cancelCrop} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: '10px' }}>
                        ❌ Cancel
                      </button>
                    </>
                  )}
                </div>
                <select style={{display: show ? 'flex' : 'none'}} className="select_filter_btn" name="Add Filter" onChange={handleFilter}>
                  <option value="">Please select a filter</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Sepia">Sepia</option>
                  <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                  <option value="High-Contrast Noir">High-Contrast Noir</option>
                  <option value="Dramatic Moody">Dramatic Moody</option>
                  <option value="Vivid Pop">Vivid Pop</option>
                  <option value="Noir">Noir</option>
                  <option value="Heatmap">Heatmap</option>
                  <option value="Matte">Matte</option>
                  <option value="Anime">Golden-Era Anime</option>
                  <option value="Beach">Beach Bypass</option>
                </select>
              </section>
              <h2>Image</h2>
              <img 
                  ref={imgRef}
                  src={previewUrl} 
                  alt="Selected local file" 
                  onLoad={handleCanvasImg}
                  style={{ maxWidth: '120px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
              />
            </div>
          )}
        </div>
    </main>
  );
}
