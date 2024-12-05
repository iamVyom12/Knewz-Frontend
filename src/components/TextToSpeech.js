import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);

  // Load voices when the component mounts and cache them
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice only if no voice is selected
      if (availableVoices.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(availableVoices[0].name);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, [selectedVoiceName]);

  // Find the selected voice object from the voice name
  const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);

  const handleSpeak = () => {
    if (text.trim() === '' || !selectedVoice) return;

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate; // Set the speech speed
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Text to Speech</h2>
      <textarea
        rows="5"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
      />
      <br />

      <label htmlFor="voices">Choose Voice:</label>
      <select
        id="voices"
        value={selectedVoiceName}
        onChange={(e) => setSelectedVoiceName(e.target.value)}
      >
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <br />

      {/* Speed Control */}
      <label htmlFor="rate">Speech Speed:</label>
      <input
        type="range"
        id="rate"
        min="0.5"
        max="2"
        step="0.1"
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
      />
      <span>{rate.toFixed(1)}x</span>
      <br />

      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
