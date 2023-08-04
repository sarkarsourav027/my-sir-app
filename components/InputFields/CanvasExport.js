import { useRef } from 'react';

const CanvasExport = () => {
    const canvasRef = useRef(null);

    // Function to handle export
    const handleExport = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL('image/png'); // Export the canvas as a data URL
        const link = document.createElement('a');
        link.href = image;
        link.download = 'canvas_image.png';
        link.click(); // Simulate click to trigger the download
    };

    return (
        <div>
            <canvas ref={canvasRef} width={300} height={200}></canvas>
            <button onClick={handleExport}>Export Image</button>
        </div>
    );
};

export default CanvasExport;
