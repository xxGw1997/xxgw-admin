import { MouseEvent, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { ImagePreview } from "../image-preview";

const schema = z.object({
  src: z.string().url({ message: "请添加一个有效的url地址" }),
  alt: z.string().optional(),
  title: z.string().optional(),
});

export const UrlTab = () => {
  const [imgPreview, setImgPreview] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      src: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
  };

  const imgSrc = form.watch("src");

  const onPreview = (e: MouseEvent<HTMLButtonElement>) => {
    setImgPreview(true);
  };

  const PreviewButton = () => {
    return (
      <>
        {imgSrc && !form.formState.errors.src && (
          <Button
            variant="link"
            className="text-teal-500 inline-block"
            onClick={onPreview}
          >
            图片预览
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            将图片完整的URL添加到下方URL <PreviewButton />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={form.control}
                name="src"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图片URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.example.com/your-img-name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>完整的图片URL地址</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图片Alt</FormLabel>
                    <FormControl>
                      <Input placeholder="alt" {...field} />
                    </FormControl>
                    <FormDescription>
                      在图片地址无法加载时，显示的图片描述信息
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图片Title</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      用户鼠标指针悬浮图片上时，显示的图片信息
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="ml-auto">
                添加
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={imgPreview} onOpenChange={setImgPreview}>
        <DialogTitle>{""}</DialogTitle>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <ImagePreview
            imageUrl={form.getValues("src")}
            onClose={() => setImgPreview(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
