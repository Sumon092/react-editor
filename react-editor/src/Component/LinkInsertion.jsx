/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { IoLinkOutline } from 'react-icons/io5';

const LinkInsertion = ({ modalPosition, setDisplayLinkModal, savedSelection, contentEditableRef }) => {
    const [linkURL, setLinkURL] = useState('');
    const [linkText, setLinkText] = useState('');
    const linkRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (linkRef.current && !linkRef.current.contains(event.target)) {
                setDisplayLinkModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setDisplayLinkModal]);

    const handleLinkUrlChange = (e) => {
        setLinkURL(e.target.value);
    };

    const handleLinkTextChange = (e) => {
        setLinkText(e.target.value);
    };

    const restoreSelection = () => {
        if (savedSelection.current) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSelection.current);
        }
    };

    const handleInsertLink = () => {
        if (!linkURL || !linkText) {
            return;
        }

        // Ensure the link URL has a valid protocol
        let formattedLinkURL = linkURL;
        if (!/^https?:\/\//i.test(linkURL)) {
            formattedLinkURL = `http://${linkURL}`;
        }

        restoreSelection();
        document.execCommand('insertHTML', false, `<a href="${formattedLinkURL}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${linkText}</a>`);
        setLinkURL('');
        setLinkText('');
        setDisplayLinkModal(false);
        contentEditableRef.current.focus();
    };

    return (
        <div
            ref={linkRef}
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
                    className="mb-2 w-full px-4 py-2 border border-blue-500 rounded focus:outline-blue-800"
                />
                <input
                    type="text"
                    value={linkURL}
                    onChange={handleLinkUrlChange}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-blue-800"
                />
            </div>
            <button className="px-2 py-1 text-blue-500 rounded-md text-right w-full" onClick={handleInsertLink}>Insert Link</button>
        </div>
    );
};

export default LinkInsertion;
