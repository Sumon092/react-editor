import React, { useState, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { LiaRemoveFormatSolid } from "react-icons/lia";
import { FaCaretDown } from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";
import { TbColorPicker } from "react-icons/tb";
import { MdOutlineCleaningServices } from "react-icons/md";
import { RiCodeView } from "react-icons/ri";

const TextEditor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const editorRef = useRef(null);
    console.log(editorRef, 'editor ref')
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();
    };

    return (
        <div className='relative'>
            <div className={`bg-[#F5F5F5] absolute top-[-80px] w-[950px] left-[-400px] p-3 rounded-md transition-all duration-500 transform ${isVisible ? '' : 'hidden'}`}>
                <div className='flex gap-7 '>
                    <div>
                        <Tooltip title="Insert Variables" placement="top">
                            <button
                                className='bg-none hover:bg-[#ebebeb] ease-in-out duration-300  rounded-md text-md text-[#6d727e] font-semibold'
                                onClick={() => formatText('insertText', '{{variable}}')}
                            >
                                <span className="icon-bolt text-[10px]"></span> Variables
                            </button>
                        </Tooltip>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('bold')}>
                        <i className='icon-bold'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('italic')}>
                        <i className='icon-italic'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('underline')}>
                        <i className='icon-underline'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-xl text-[#6d727e] ' onClick={() => formatText('removeFormat')}>
                        <LiaRemoveFormatSolid />
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] '>
                        <div><i className='icon-font'></i></div>
                        <div><FaCaretDown /></div>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] '>
                        <div><i >16</i></div>
                        <div><FaCaretDown /></div>
                    </div>
                    <div className='flex items-center cursor-pointer text-lg text-[#6d727e] '>
                        <MdFormatColorText />
                    </div>
                    <div className='flex items-center cursor-pointer text-lg text-[#6d727e] '>
                        <TbColorPicker />
                    </div>
                    <div className='flex items-center cursor-pointer' onClick={() => formatText('insertOrderedList')}>
                        <i className='icon-list-ol'></i>
                        <div ><FaCaretDown /></div>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('insertUnorderedList')}>
                        <i className='icon-list-ul'></i>
                        <div ><FaCaretDown /></div>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('strikethrough')}>
                        <i className='icon-strikethrough'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('subscript')}>
                        <i className='icon-subscript'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('superscript')}>
                        <i className='icon-superscript'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-[#6d727e] ' onClick={() => formatText('indent')}>
                        <i className='icon-indent'></i>
                    </div>
                    <div className='flex items-center cursor-pointer text-lg text-[#6d727e] ' onClick={() => formatText('removeFormat')}>
                        <MdOutlineCleaningServices />
                    </div>
                    <div className='flex items-center cursor-pointer text-2xl text-[#6d727e] '>
                        <RiCodeView />
                    </div>
                </div>
            </div>
            <div>
                <Tooltip title="More Text" placement="top">
                    <button onClick={toggleVisibility} className='bg-none hover:bg-[#ebebeb] ease-in-out duration-300 py-[6px] px-[12px] mr-3 rounded-md text-lg text-[#6d727e] font-semibold'>
                        <span className="icon-a text-[16px]"></span>
                        <span className=" ms-1 icon-ellipsis-vertical"></span>
                    </button>
                </Tooltip>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className='border p-3 rounded-md'
                style={{ minHeight: '200px', outline: 'none' }}
            ></div>
        </div>
    );
};

export default TextEditor;
