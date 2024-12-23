import { ForwardedRef, useState } from "react";
import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  linkPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  ListsToggle,
  InsertThematicBreak,
  CodeToggle,
  StrikeThroughSupSubToggles,
  Separator,
  MDXEditorProps,
  linkDialogPlugin,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { CustomInsertImage } from "./insert-image";
import { CustomInsertLink } from "./insert-link";
import CustomLinkDialog from "./custom-link-dialog";
import { cn } from "~/lib/utils";
import { useTheme } from "../providers/theme-provider";

type EditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps;

export const Editor = ({ editorRef, ...props }: EditorProps) => {
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const { theme } = useTheme();
  return (
    <div>
      <MDXEditor
        className={cn(
          "dark:prose-invert max-w-none border rounded-sm",
          theme === "dark" ? "dark-theme" : ""
        )}
        contentEditableClassName="prose min-h-96"
        ref={editorRef}
        autoFocus
        {...props}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper options={["rich-text", "source"]}>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <Separator />
                <StrikeThroughSupSubToggles />
                <Separator />
                <CustomInsertLink
                  dialogOpen={insertDialogOpen}
                  setDialogOpen={setInsertDialogOpen}
                />
                {/* <CreateLink /> */}
                <CustomInsertImage />
                {/* <InsertImage /> */}
                <Separator />
                <InsertThematicBreak />
                <CodeToggle />
                <InsertCodeBlock />
              </DiffSourceToggleWrapper>
            ),
          }),
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin({
            LinkDialog: () => (
              <CustomLinkDialog
                dialogOpen={insertDialogOpen}
                setDialogOpen={setInsertDialogOpen}
              />
            ),
          }),
          imagePlugin({ disableImageSettingsButton: true }),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: { js: "JavaScript", css: "CSS" },
          }),
          diffSourcePlugin(),
        ]}
      />
    </div>
  );
};
