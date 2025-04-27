import React from 'react';

const ImageCrousel = () => {
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    height: '100vh', // Adjust based on your needs
  };

  const imageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '200%', // Adjust this if necessary
    animation: 'scroll 10s linear infinite',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
  };

  const scrollAnimation = `
    @keyframes scroll {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-50%); /* Adjust to match the height of .image-container */
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{scrollAnimation}</style>
      <div style={imageContainerStyle}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgnUtU4jIDNFL46Rdri5KTbpSM2seqF8f6WA&s"
          style={imageStyle}
          alt="banner"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgnUtU4jIDNFL46Rdri5KTbpSM2seqF8f6WA&s"
          style={imageStyle}
          alt="banner"
        />
      </div>
      <div style={imageContainerStyle}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgnUtU4jIDNFL46Rdri5KTbpSM2seqF8f6WA&s"
          style={imageStyle}
          alt="banner"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgnUtU4jIDNFL46Rdri5KTbpSM2seqF8f6WA&s"
          style={imageStyle}
          alt="banner"
        />
      </div>
    </div>
  );
};

export default ImageCrousel;
