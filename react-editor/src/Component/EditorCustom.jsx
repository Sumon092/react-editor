import React, { useState, useRef } from "react";
import { SketchPicker } from 'react-color';
import { IoLink } from "react-icons/io5";

const EditorCustom = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [displayImageModal, setDisplayImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const contentEditableRef = useRef(null);
    const imageUrlInputRef = useRef(null);
    const savedSelection = useRef(null);

    const applyStyle = (command, value = null) => {
        document.execCommand(command, false, value);
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    // const handlePaste = (e) => {
    //     e.preventDefault();
    //     const text = (e.clipboardData.getData('text/html') || e.clipboardData.getData('text'));
    //     document.execCommand('insertHTML', false, text);
    //     setHtmlContent(contentEditableRef.current.innerHTML);
    // };

    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
        applyStyle("foreColor", color.hex);
    };

    const toggleColorPicker = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const saveSelection = () => {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                savedSelection.current = sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            savedSelection.current = document.selection.createRange();
        }
    };

    const restoreSelection = () => {
        if (savedSelection.current) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedSelection.current);
            } else if (document.selection && savedSelection.current.select) {
                savedSelection.current.select();
            }
        }
    };

    const openImageModal = () => {
        saveSelection();
        setDisplayImageModal(true);
    };

    const insertImage = () => {
        if (imageUrl) {
            restoreSelection();
            applyStyle("insertImage", imageUrl);
        }

        setDisplayImageModal(false);
        setImageUrl("");
    };

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        e.target.blur();
        contentEditableRef.current.focus();
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
                <button className="bg-slate-300 px-2 py-1 rounded-md" onClick={openImageModal}>Image</button>
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
            {displayImageModal && (
                <div style={{ position: 'fixed', zIndex: 2, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <div className="mb-2 h-8 text-2xl bg-slate-300 rounded-md">
                        <IoLink className="bg-white h-full text-slate-500 border border-slate-300 rounded-md w-16 flex items-center py-[4px]" />
                    </div>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="http://:"
                        className="w-full px-4 py-2 my-6 border border-blue-500 rounded focus:outline-blue-800"
                        ref={imageUrlInputRef}
                    />
                    <button className="px-2 py-1 text-blue-500 rounded-md text-right w-full" onClick={insertImage}>Insert</button>
                </div>
            )}
            <div
                ref={contentEditableRef}
                className="output max-w-[800px]"
                contentEditable
                // onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px' }}
            />
        </div>
    );
};

export default EditorCustom;
