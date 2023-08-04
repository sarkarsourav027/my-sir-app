import React, {useState} from 'react';
import {ChromePicker} from 'react-color';

const ColorPicker = ({handleColorChange, color}) => {

    const [showPicker, setShowPicker] = useState(false);
    const togglePicker = () => {
        setShowPicker(!showPicker);
    };
    console.log(color)
    return (
        <div>
            <div className="relative">
                <div
                    onClick={togglePicker}
                    className={`border appearance-none border-gray-300 rounded w-full py-1 px-3 text-gray-700 focus:ring focus:ring-orange-400 focus:ring-opacity-50 transition-all focus:border-orange-400 focus:outline-none focus:transition-shadow`}
                    style={{backgroundColor: color}}
                >
                    Choose Brand Color (For Invoice Templates)
                </div>
                {showPicker && (
                    <div className="absolute z-10">
                        <div
                            className="fixed inset-0"
                            onClick={() => setShowPicker(false)}
                        ></div>
                        <ChromePicker color={color} onChange={handleColorChange}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorPicker;
