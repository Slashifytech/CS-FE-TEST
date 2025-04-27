import React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const minDistance = 3;

const PrettoSlider = styled(Slider)({
  color: "#A92525",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#A92525",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});
const inchToFeetInchDecimal = (inches) => {
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}.${inch}`;
};


function HeightSlider({ value, onChange, getAriaLabel, getAriaValueText, className, disableSwap, minValue, maxValue, step}) {
  // const valuetext = (value) => `${value}°C`;
  const valuetext = (val) => inchToFeetInchDecimal(val);


  return (
    <PrettoSlider
      getAriaLabel={getAriaLabel}
      value={value}
      onChange={onChange}
      valueLabelDisplay="auto"
      className={className}
      min={minValue}  
      max={maxValue}
      step = {step}
      valueLabelFormat={inchToFeetInchDecimal}
      getAriaValueText={inchToFeetInchDecimal}
      disableSwap={disableSwap}
    />
  );
}





function CustomSlider({ value, onChange, getAriaLabel, getAriaValueText, className, disableSwap, minValue, maxValue, step}) {
  const valuetext = (value) => `${value}°C`;

  return (
    <PrettoSlider
      getAriaLabel={getAriaLabel}
      value={value}
      onChange={onChange}
      valueLabelDisplay="auto"
      className={className}
      min={minValue}  
      max={maxValue}
      step = {step}
      getAriaValueText={getAriaValueText || valuetext}
      disableSwap={disableSwap}
    />
  );
}export {CustomSlider, HeightSlider}

export default CustomSlider;
