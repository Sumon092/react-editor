import { useRef, useState, useEffect } from "react";

const CustomOrderList = () => {
    const [htmlContent, setHtmlContent] = useState("");
    const contentEditableRef = useRef(null);
    const savedSelection = useRef(null);

    useEffect(() => {
        if (contentEditableRef.current) {
            contentEditableRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

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

    const applyOrderedList = () => {
        restoreSelection();
        document.execCommand("insertOrderedList");
        contentEditableRef.current.focus();
        setHtmlContent(contentEditableRef.current.innerHTML);
    };

    return (
        <div>
            <button onClick={applyOrderedList}>Order List</button>
            <div
                ref={contentEditableRef}
                contentEditable
                onInput={() => setHtmlContent(contentEditableRef.current.innerHTML)}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                style={{ border: "1px solid #ccc", padding: "10px", minHeight: "100px" }}
            />
            <textarea value={htmlContent} readOnly style={{ width: "100%", height: "100px", marginTop: "10px" }}></textarea>
        </div>
    );
};

export default CustomOrderList;
