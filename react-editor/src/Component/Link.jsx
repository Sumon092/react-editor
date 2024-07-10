import React, { useState, useRef } from 'react';
import { IoLinkOutline } from 'react-icons/io5';

const LinkInsertion = ({ modalPosition, error, setDisplayLinkModal, applyStyle, modalRef }) => {
    const [linkText, setLinkText] = useState('');
    const [linkURL, setLinkURL] = useState('');


    const handleLinkUrlChange = (e) => {
        setLinkURL(e.target.value);
    };

    const handleLinkTextChange = (e) => {
        setLinkText(e.target.value);
    };

    const handleInsertLink = () => {
        if (linkRef.current && linkURL) {
            applyStyle("createLink", linkURL);
            setLinkURL('');
            setLinkText('');
            setDisplayLinkModal(false);
        }
    };

    return (
        <div
            ref={modalRef}
            style={{ position: 'absolute', zIndex: 2, top: modalPosition.top, left: modalPosition.left, backgroundColor: '#fff', padding: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginTop: '10px', maxWidth: '300px' }}
        >
            <div className="mb-2 h-8 text-2xl bg-slate-300 rounded-md">
                <IoLinkOutline className="bg-white h-full text-slate-500 border border-slate-300 rounded-md w-16 flex items-center py-[4px]" />
            </div>
            <div className="my-6 flex flex-col justify-start">
                <input
                    type="text"
                    value={linkText}
                    onChange={handleLinkTextChange}
                    placeholder="Link Text"
                    className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-blue-800"
                />
                <input
                    type="text"
                    value={linkURL}
                    onChange={handleLinkUrlChange}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-blue-800 mt-2"
                />
                {error && <span className="text-red-500 text-sm mt-2 font-poppins text-start">{error}</span>}
            </div>
            <button className="px-2 py-1 text-blue-500 rounded-md text-right w-full" onClick={handleInsertLink}>Insert Link</button>
        </div>
    );
};

export default LinkInsertion;
