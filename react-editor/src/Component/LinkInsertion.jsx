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

    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault(); // Prevent default context menu
            const selection = window.getSelection();
            const selectedText = selection.toString();
            const parentNode = selection.anchorNode.parentNode;

            if (parentNode.tagName === 'A') {
                const menu = [
                    {
                        label: 'Remove Link',
                        action: () => handleRemoveLink(),
                    },
                ];
                showContextMenu(event.clientX, event.clientY, menu);
            } else {
                const menu = [
                    {
                        label: 'Add Link',
                        action: () => handleAddLinkFromContextMenu(selectedText),
                    },
                ];
                showContextMenu(event.clientX, event.clientY, menu);
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    const showContextMenu = (x, y, menu) => {
        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.left = `${x}px`;
        menuContainer.style.top = `${y}px`;
        menuContainer.style.backgroundColor = '#fff';
        menuContainer.style.border = '1px solid #ccc';
        menuContainer.style.padding = '5px';
        menuContainer.style.zIndex = '9999';

        menu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.label;
            menuItem.style.cursor = 'pointer';
            menuItem.style.padding = '3px';
            menuItem.addEventListener('click', () => {
                item.action();
                document.body.removeChild(menuContainer);
            });
            menuContainer.appendChild(menuItem);
        });

        document.body.appendChild(menuContainer);

        document.addEventListener('click', () => {
            document.body.removeChild(menuContainer);
        }, { once: true });
    };

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

    const handleAddLinkFromEditorText = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (!selection.isCollapsed) {
            // Check if the selected text is already a link
            const parentNode = selection.anchorNode.parentNode;
            if (parentNode.tagName === 'A') {
                setLinkURL(parentNode.href);
                setLinkText(selectedText);
            } else {
                setLinkText(selectedText);
            }
        } else {
            alert('Please select some text in the editor to add a link.');
        }
    };

    const handleRemoveLink = () => {
        const selection = window.getSelection();
        // const selectedText = selection.toString();

        if (!selection.isCollapsed) {
            // Check if the selected text is a link
            const parentNode = selection.anchorNode.parentNode;
            if (parentNode.tagName === 'A') {
                restoreSelection();
                const linkNode = parentNode;
                const textNode = document.createTextNode(linkNode.textContent);
                linkNode.parentNode.replaceChild(textNode, linkNode);
                setDisplayLinkModal(false);
                contentEditableRef.current.focus();
            } else {
                alert('The selected text is not a link.');
            }
        } else {
            alert('Please select a linked text in the editor to remove the link.');
        }
    };

    const handleAddLinkFromContextMenu = (selectedText) => {
        setLinkText(selectedText);
        setLinkURL('');
        setDisplayLinkModal(true);
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
            <div className="flex justify-between">
                <button className="px-2 py-1 text-blue-500 rounded-md" onClick={handleInsertLink}>Insert</button>
                <button className="px-2 py-1 text-red-500 rounded-md" onClick={handleRemoveLink}>Remove</button>
                <button className="px-2 py-1 text-green-500 rounded-md" onClick={handleAddLinkFromEditorText}>From Text</button>
            </div>
        </div>
    );
};

export default LinkInsertion;
