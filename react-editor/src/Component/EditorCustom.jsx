import React, { useState, useRef } from "react";
import { SketchPicker } from 'react-color';

const EditorCustom = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const contentEditableRef = useRef(null);
    console.log(htmlContent)
    const applyStyle = (command, value = null) => {
        document.execCommand(command, false, value);
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData.getData('text/html') ||
            e.clipboardData.getData('text'));
        document.execCommand('insertHTML', false, text);
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
        applyStyle("foreColor", color.hex);
    };

    const toggleColorPicker = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    return (
        <div className="editor-wrapper">
            <div className="toolbar flex gap-4 mb-2">
                <button className="bg-slate-300 px-2 py-1 rounded-md" onClick={() => applyStyle("bold")}><b>B</b></button>
                <button className="bg-slate-300 px-2 py-1 rounded-md" onClick={() => applyStyle("italic")}><i>I</i></button>
                <button className="bg-slate-300 px-2 py-1 rounded-md" onClick={() => applyStyle("underline")}><u>U</u></button>
                <button className="bg-slate-300 px-2 py-1 rounded-md" onClick={toggleColorPicker}>
                    <span style={{ color: currentColor }}>A</span>
                </button>
            </div>
            {displayColorPicker && (
                <div style={{ position: 'absolute', zIndex: 2 }}>
                    <div
                        style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
                        onClick={toggleColorPicker}
                    />
                    <SketchPicker color={currentColor} onChange={handleColorChange} />
                </div>
            )}
            <div
                ref={contentEditableRef}
                className="output max-w-[800px]"
                contentEditable
                onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px' }}
            />
        </div>
    );
};

export default EditorCustom;
