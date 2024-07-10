import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from 'react-color';
import DOMPurify from 'dompurify';
import LinkInsertion from "./Link";
import ImageURL from "./ImageURL";

const EditorCustom = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [displayImageModal, setDisplayImageModal] = useState(false);
    const [error, setError] = useState(false)
    const savedSelection = useRef(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [displayLinkModal, setDisplayLinkModal] = useState(false);
    const contentEditableRef = useRef(null);
    const imageButtonRef = useRef(null);
    const linkButtonRef = useRef(null)

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && !imageButtonRef.current.contains(event.target)) {
                setDisplayImageModal(false)
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const applyStyle = (command, value = null) => {
        document.execCommand(command, false, value);
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

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


    // insert image url
    const openImageModal = (e) => {
        saveSelection();
        const buttonRect = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setDisplayImageModal(true);
    };

    // add link to editor
    const openLinkModal = (e) => {
        saveSelection();
        const buttonRect = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setDisplayLinkModal(true);
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
                <button
                    ref={imageButtonRef}
                    className="bg-slate-300 px-2 py-1 rounded-md"
                    onClick={openImageModal}
                >
                    Image
                </button>
                <button
                    ref={linkButtonRef}
                    className="bg-slate-300 px-2 py-1 rounded-md"
                    onClick={openLinkModal}
                >
                    Link
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

            {displayImageModal && (
                <ImageURL setDisplayImageModal={setDisplayImageModal} modalPosition={modalPosition} contentEditableRef={contentEditableRef} applyStyle={applyStyle} savedSelection={saveSelection} modalRef={modalRef} />
            )}

            {displayLinkModal && (
                <LinkInsertion modalPosition={modalPosition} error={error} setDisplayLinkModal={setDisplayLinkModal} applyStyle={applyStyle} modalRef={modalRef} />
            )}

            <div
                ref={contentEditableRef}
                className="output max-w-[800px]"
                contentEditable
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
                style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px' }}
            />
        </div>
    );
};

export default EditorCustom;

