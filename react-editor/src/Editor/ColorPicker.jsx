/* eslint-disable react/prop-types */
import { SketchPicker } from "react-color";

const ColorPicker = ({ setCurrentColor, currentColor, toggleColorPicker, applyStyle }) => {
    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
        applyStyle("foreColor", color.hex);
    };
    return (
        <div style={{ position: 'absolute', zIndex: 2 }}>
            <div
                style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
                onClick={toggleColorPicker}
            />
            <SketchPicker color={currentColor} onChange={handleColorChange} />
        </div>
    );
};

export default ColorPicker;