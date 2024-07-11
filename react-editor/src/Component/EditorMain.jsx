import { useState, useRef } from "react";
import { SketchPicker } from 'react-color';
import DOMPurify from 'dompurify';
import ImageURL from "./ImageURL";
import LinkInsertion from "./LinkInsertion";
import { MdOutlineFormatIndentDecrease, MdOutlineFormatIndentIncrease } from "react-icons/md";
import { IoLinkOutline } from 'react-icons/io5'
import { RiBold, RiFontColor, RiImageFill, RiItalic, RiUnderline } from "react-icons/ri";

const EditorMain = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [displayImageModal, setDisplayImageModal] = useState(false);
    const [error, setError] = useState(false);
    const savedSelection = useRef(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [displayLinkModal, setDisplayLinkModal] = useState(false);
    const contentEditableRef = useRef(null);
    const imageButtonRef = useRef(null);
    const linkButtonRef = useRef(null);


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
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            savedSelection.current = sel.getRangeAt(0);
        }
    };

    // Image URL insertion
    const openImageModal = (e) => {
        saveSelection();
        const buttonRect = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setDisplayImageModal(true);
    };

    // Link text insertion
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
            <div className="flex gap-4 mb-2 items-center h-10 bg-slate-100 px-2 rounded-sm">
                <button onClick={() => applyStyle("bold")}><RiBold className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={() => applyStyle("italic")}><RiItalic className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={() => applyStyle("underline")}><RiUnderline className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={toggleColorPicker}>
                    <span style={{ color: currentColor }}><RiFontColor className="text-2xl text-slate-500" /></span>
                </button>
                <button
                    ref={imageButtonRef}
                    onClick={openImageModal}
                >
                    <RiImageFill className="text-slate-500 text-2xl" />
                </button>
                <button
                    ref={linkButtonRef}
                    onClick={openLinkModal}
                >
                    <IoLinkOutline className="text-slate-500 text-3xl" />
                </button>
                <button><MdOutlineFormatIndentDecrease className="text-2xl text-slate-600" /></button>
                <button><MdOutlineFormatIndentIncrease className="text-2xl text-slate-600" /></button>
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
                <ImageURL
                    setDisplayImageModal={setDisplayImageModal}
                    modalPosition={modalPosition}
                    contentEditableRef={contentEditableRef}
                    applyStyle={applyStyle}
                    savedSelection={savedSelection}
                    error={error}
                    setError={setError}
                />
            )}

            {displayLinkModal && (
                <LinkInsertion
                    modalPosition={modalPosition}
                    setDisplayLinkModal={setDisplayLinkModal}
                    applyStyle={applyStyle}
                    savedSelection={savedSelection}
                    contentEditableRef={contentEditableRef}
                    error={error}
                    setError={setError}
                />
            )}

            <div
                ref={contentEditableRef}
                className="output max-w-full min-w-xl"
                contentEditable
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
                style={{ minHeight: '500px', border: '1px solid #ccc', padding: '10px' }}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
            />
        </div>
    );
};

export default EditorMain;
