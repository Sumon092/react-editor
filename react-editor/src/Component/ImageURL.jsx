/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { IoLink } from 'react-icons/io5';

const ImageURL = ({ setDisplayImageModal, applyStyle, savedSelection, imageUrlInputRef, modalPosition, setError }) => {
    const [imageUrl, setImageUrl] = useState("");
    const imageRef = useRef(null)

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (imageRef.current && !imageRef.current.contains(event.target)) {
                setDisplayImageModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setDisplayImageModal]);

    const restoreSelection = () => {
        if (savedSelection.current) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSelection.current);
        }
    };

    const insertImage = () => {
        if (!imageUrl) {
            setError('Please enter an URL');
            return;
        }
        restoreSelection();
        applyStyle("insertImage", imageUrl);

        setDisplayImageModal(false);
        setImageUrl("");
    };

    return (
        <div className='mt-[-10px]' ref={imageRef} style={{ position: 'fixed', zIndex: 2, top: modalPosition.top, left: modalPosition.left, backgroundColor: '#fff', padding: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <div className=" h-8 text-2xl bg-slate-300 rounded-md">
                <IoLink className="bg-white h-full text-slate-500 border border-slate-300 rounded-md w-16 flex items-center" />
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
