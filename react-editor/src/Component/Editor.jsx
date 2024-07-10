import React, { useCallback, useMemo, useRef, useState } from "react";
import Quill from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";

const Editor = () => {
    const [value, setValue] = useState("");
    const quillRef = useRef(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                const quillEditor = quillRef.current.getEditor();
                const range = quillEditor.getSelection(true);
                quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
            };
            reader.readAsDataURL(file);
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [2, 3, 4, false] }],
                ["bold", "italic", "underline", "blockquote"],
                [{ color: [] }],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                ],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "clean",
    ];

    const handleSubmit = () => {
        console.log(value)
    };

    return (
        <>
            <div className="wrapper">
                <label className="label">Editor Content</label>
                <ReactQuill
                    ref={quillRef}
                    className="editor"
                    theme="snow"
                    value={value}
                    formats={formats}
                    modules={modules}
                    onChange={setValue}
                />
            </div>
            <button onClick={handleSubmit} className="btn mt-8">
                Submit
            </button>
        </>
    );
};

export default Editor;
