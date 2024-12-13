import { useState } from "react";
import { Image } from "lucide-react";
import { insertImage$, usePublisher } from "@mdxeditor/editor";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Hint } from "../hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UrlTab } from "./url-tab";

export function CustomInsertImage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectType, setSelectType] = useState<"local" | "url">("url");
  const insertImage = usePublisher(insertImage$);
  const [imgInfo, setImgInfo] = useState({
    src: "",
    alt: "",
    title: "",
  });

  const handleSave = () => {
    setDialogOpen(false);
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
          defaultValue="url"
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
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="url">
            <UrlTab />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
