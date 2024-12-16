import { useState } from "react";
import { Image } from "lucide-react";
import { insertImage$, usePublisher } from "@mdxeditor/editor";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Hint } from "../hint";
import { UrlTab } from "./url-image-tab";
import { LocalTab } from "./local-image-tab";

export type ImgInfo = {
  src: string;
  title?: string;
  alt?: string;
};

export function CustomInsertImage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectType, setSelectType] = useState<"local" | "url">("local");
  const insertImage = usePublisher(insertImage$);

  const handleSave = ({ src, alt = "", title = "" }: ImgInfo) => {
    setDialogOpen(false);
    insertImage({ src, altText: alt, title });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Hint label="插入图片">
        <DialogTrigger asChild>
          <Button className="_toolbarButton_uazmk_237">
            <Image className="size-5" />
          </Button>
        </DialogTrigger>
      </Hint>
      <DialogContent
        className="sm:max-w-[625px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>添加图片</DialogTitle>
          <DialogDescription>
            你可以选择本地图片进行上传，也可以添加完整的互联网可访问的图片URL.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="local"
          className="w-full"
          value={selectType}
          onValueChange={(value) => setSelectType(value as "local" | "url")}
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="local">
              选择本地图片
            </TabsTrigger>
            <TabsTrigger className="w-full" value="url">
              添加已有图片URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="local">
            <LocalTab handleSubmit={handleSave} />
          </TabsContent>
          <TabsContent value="url">
            <UrlTab handleSubmit={handleSave} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
