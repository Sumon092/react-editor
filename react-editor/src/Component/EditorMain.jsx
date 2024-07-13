import { useState, useRef, useEffect } from "react";
import ImageURL from "./ImageURL";
import LinkInsertion from "./LinkInsertion";
import { MdOutlineFormatIndentDecrease, MdOutlineFormatIndentIncrease, MdOutlineFormatListBulleted, MdOutlineFormatListNumbered } from "react-icons/md";
import { IoLinkOutline } from 'react-icons/io5';
import { RiBold, RiFontColor, RiImageFill, RiItalic, RiUnderline } from "react-icons/ri";
import ColorPicker from "./ColorPicker";

const EditorMain = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("");
    const [displayImageModal, setDisplayImageModal] = useState(false);
    const [error, setError] = useState(false);
    const savedSelection = useRef(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [displayLinkModal, setDisplayLinkModal] = useState(false);
    const [displayVariablePopup, setDisplayVariablePopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const contentEditableRef = useRef(null);
    const imageButtonRef = useRef(null);
    const linkButtonRef = useRef(null);

    const variables = ["firstName", "lastName", "signature"];
    console.log(htmlContent)
    useEffect(() => {
        if (displayVariablePopup) {
            contentEditableRef.current.focus();
        }
    }, [displayVariablePopup]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            savedSelection.current = range.cloneRange();
        }
    };

    const restoreSelection = () => {
        const sel = window.getSelection();
        if (savedSelection.current) {
            sel.removeAllRanges();
            sel.addRange(savedSelection.current);
        }
    };

    const applyStyle = (command, value = null) => {
        restoreSelection();
        document.execCommand(command, false, value);
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    const toggleColorPicker = () => {
        saveSelection();
        setDisplayColorPicker(!displayColorPicker);
    };

    const openImageModal = (e) => {
        saveSelection();
        const buttonRect = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setDisplayImageModal(true);
    };

    const openLinkModal = (e) => {
        saveSelection();
        const buttonRect = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setDisplayLinkModal(true);
    };

    const applyIndent = () => {
        applyStyle("indent");
    };

    const applyOutdent = () => {
        applyStyle("outdent");
    };

    const insertList = (type) => {
        restoreSelection();

        const sel = window.getSelection();
        const range = sel.getRangeAt(0);

        const list = document.createElement(type);
        list.style.paddingLeft = '40px'; // Adjust indentation as needed

        const selectedText = range.toString().trim(); // Get selected text

        // Create list items based on type
        if (type === 'ul') {
            list.style.listStyleType = 'disc'; // Use disc for unordered list
        } else if (type === 'ol') {
            list.style.listStyleType = 'decimal'; // Use decimal for ordered list
        }

        const li = document.createElement('li');
        li.textContent = selectedText !== '' ? selectedText : 'List item'; // Default if no selection

        list.appendChild(li);

        range.deleteContents();
        range.insertNode(list);

        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    const handleKeyUp = (e) => {
        saveSelection();
        setHtmlContent(contentEditableRef.current.innerHTML);
        if (e.key === "{") {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0).getBoundingClientRect();
            setPopupPosition({ top: range.bottom + window.scrollY, left: range.left + window.scrollX });
            setDisplayVariablePopup(true);
        }
    };

    const handleVariableClick = (variable) => {
        insertVariable(variable);
    };

    const insertVariable = (variable) => {
        restoreSelection();
        document.execCommand("insertText", false, `{${variable}}}`);
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
        setDisplayVariablePopup(false);
    };

    return (
        <div className="editor-wrapper text-start px-8">
            <div className="flex gap-4 mb-2 items-center h-10 bg-slate-100 px-2 rounded-sm">
                <button onClick={() => applyStyle("bold")}><RiBold className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={() => applyStyle("italic")}><RiItalic className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={() => applyStyle("underline")}><RiUnderline className="text-slate-500 text-2xl font-thin" /></button>
                <button onClick={toggleColorPicker}>
                    <span><RiFontColor className="text-2xl text-slate-500" style={{ color: currentColor }} /></span>
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
                <button onClick={applyOutdent}><MdOutlineFormatIndentDecrease className="text-2xl text-slate-600" /></button>
                <button onClick={applyIndent}><MdOutlineFormatIndentIncrease className="text-2xl text-slate-600" /></button>
                <button onClick={() => insertList('ol')}><MdOutlineFormatListNumbered className="text-3xl text-slate-500" /></button>
                <button onClick={() => insertList('ul')}><MdOutlineFormatListBulleted className="text-3xl text-slate-500" /></button>
            </div>

            {displayColorPicker && (
                <ColorPicker
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    toggleColorPicker={toggleColorPicker}
                    applyStyle={applyStyle}
                />
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

            {displayVariablePopup && (
                <div className="w-[200px] shadow-md font-poppins text-slate-600 rounded-md border border-slate-300 " style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left, zIndex: 1000 }}>
                    {variables.map(variable => (
                        <div className="py-2 px-4 hover:bg-blue-100 w-full flex" key={variable} onClick={() => handleVariableClick(variable)} style={{ cursor: 'pointer' }}>
                            {variable}
                        </div>
                    ))}
                </div>
            )}


            <div
                ref={contentEditableRef}
                className="output max-w-full min-w-xl !px-4 focus:outline-none rounded-md border-2 border-slate-400 text-slate-600"
                contentEditable
                style={{ minHeight: '700px', border: '1px solid #ccc', padding: '10px' }}
                onMouseUp={saveSelection}
                onKeyUp={handleKeyUp}
                onInput={() => setHtmlContent(contentEditableRef.current.innerHTML)}
            />
        </div>
    );
};

export default EditorMain;
