import React, { useRef, useState } from 'react';
import { IoLink } from 'react-icons/io5';

const ImageURL = ({ setDisplayImageModal, contentEditableRef, applyStyle, savedSelection, imageUrlInputRef }) => {
    const [imageUrl, setImageUrl] = useState("");

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        e.target.blur();
        contentEditableRef.current.focus();
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
    const insertImage = () => {
        if (!imageUrl) {
            setError('Please enter an url')
            return
        }
        if (imageUrl) {
            restoreSelection();
            applyStyle("insertImage", imageUrl);
        }

        setDisplayImageModal(false);
        setImageUrl("");
    };
    return (
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
    );
};

export default ImageURL;