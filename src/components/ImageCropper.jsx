import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";

const CropModal = ({ src, openCropModal, setCropModal, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    const handleCropComplete = (_, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };
  
    const handleDone = () => {
      if (croppedAreaPixels) {
        onCropComplete(crop, croppedAreaPixels);
      }
    };
  
    return (
      <Dialog open={openCropModal} onClose={() => setCropModal(false)}  maxWidth="md" // Or "sm", "lg", "xl" depending on the size you want
  fullWidth >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
            aria-labelledby="Zoom"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDone} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default CropModal;