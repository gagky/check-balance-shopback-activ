import React, { useState } from 'react';

interface LongTextComponentProps {
  longText: string;
}

const LongTextComponent: React.FC<LongTextComponentProps> = ({ longText }) => {
  const [shortText, setShortText] = useState(longText); // Display first 20 characters by default

  const handleCopyClick = () => {
    // Copy the long text to the clipboard
    navigator.clipboard
      .writeText(longText)
      .then(() => {
        console.log('Text copied to clipboard.');
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  };

  return (
    <div>
      <input type="text" value={shortText} readOnly />
      <button onClick={handleCopyClick}>Copy to Clipboard</button>
    </div>
  );
};

export default LongTextComponent;
