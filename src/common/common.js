export const maritalStatus = ["all","single", "divorce", "awaiting divorce", "widow/widower"];


export const convertToFeetInchesDecimal = (inches) => {
    const feet = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${feet}.${inch}`;
  };

  export const convertFeetInchesToInches = (val) => {
    if (!val) return 48; // default 4'0"
    const [feet, inches] = val.toString().split(".").map(Number);
    return feet * 12 + (inches || 0);
  };

 export  const convertToFeetInches = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}.${remainingInches}`;
  };