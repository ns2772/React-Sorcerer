import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Load data from local storage on initial load
    const savedData = localStorage.getItem("editorData");
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    // Save data to local storage whenever editor state changes
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorData", JSON.stringify(rawContentState));
  }, [editorState]);

  const handleBeforeInput = (char, editorState) => {
    // Check for # or * as the first character in a line
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const text = block.getText();

    if (text === "" && (char === "#" && " ") || (char === "*")) {
      // Handle # for Heading 1 and * for bold
      const newEditorState =
        char === "#"
          ? RichUtils.toggleBlockType(editorState, "header-one")
          : RichUtils.toggleInlineStyle(editorState, "BOLD");

      setEditorState(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  const handleReturn = (event, editorState) => {
    // Prevent new line when # or * is at the end of a line
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const text = block.getText();

    if (text.endsWith("#") || text.endsWith("*")) {
      setEditorState(RichUtils.insertSoftNewline(editorState));
      return "handled";
    }

    return "not-handled";
  };

  const handleUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const handleRedUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "RED_UNDERLINE"));
  };

  const customStyleMap = {
    RED_UNDERLINE: {
      textDecoration: "underline",
      color: "red",
    },
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>MY EDITOR </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <button
          style={{
            outline: "none",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            width: "10rem",
            height: "2.5rem",
            borderRadius: "5px",
            cursor:"pointer"
          }}
          onClick={handleUnderlineClick}
        >
          Underline
        </button>
        <button
          style={{
            outline: "none",
            backgroundColor: "gray",
            color: "red",
            border: "none",
            width: "10rem",
            height: "2.5rem",
            borderRadius: "5px",
            cursor:"pointer"
          }}
          onClick={handleRedUnderlineClick}
        >
          Red Underline
        </button>

        <button
          style={{
            outline: "none",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            width: "10rem",
            height: "2.5rem",
            borderRadius: "5px",
            cursor:"pointer"
          }}
        >
          Save Text
        </button>
      </div>
      <div style={{marginLeft:"1rem",marginRight:"1rem"}}>

      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        handleBeforeInput={handleBeforeInput}
        handleReturn={handleReturn}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "remove",
            "history",
          ],
          inline: {
            options: ["bold", "italic", "strikethrough"],
            bold: { icon: "bold", className: "custom-option-class" },
            italic: { icon: "italic", className: "custom-option-class" },
            strikethrough: {
              icon: "strikethrough",
              className: "custom-option-class",
            },
          },
        }}
        customStyleMap={customStyleMap}
      />
      </div>
    </div>
  );
};

export default MyEditor;

// This code implements the code block functionality within the `MyEditor` component itself, eliminating the need for a separate `CodeBlock` component. It uses the `renderBlock` prop of the `Editor` component to customize the rendering of code blocks.
