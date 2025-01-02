import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { toast } from "sonner";
import { parseISO } from "date-fns";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

import { useGetCategories } from "~/api/category";
import { useCreatePost, useGetPost, useUpdatePost } from "~/api/post";

import { Editor } from "~/components/mdx-editor";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/muti-select";
import { Switch } from "~/components/ui/switch";
import DateTimePicker from "~/components/date-time-picker";

const formSchema = z
  .object({
    title: z.string().max(32).min(1, { message: "请输入文章标题" }).trim(),
    desc: z.string().max(50).min(1, { message: "请输入文章描述" }).trim(),
    categories: z.array(z.string().min(1)).min(1).nonempty("请选择一个分类"),
    content: z.string().trim(),
    isPublishNow: z.boolean(),
    publishDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.isPublishNow && !data.publishDate) {
        return false;
      }
      return true;
    },
    {
      message: "请选择文章的发布时间",
      path: ["publishDate"],
    }
  );

const WritePage = () => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      categories: [],
      content: "",
      isPublishNow: true,
      publishDate: new Date(),
    },
  });

  const { data: categories, isError: isCategoriesError } = useGetCategories();
  const formatCategories =
    categories && !isCategoriesError
      ? categories.map((category) => ({
          label: category.title,
          value: category.id + "",
        }))
      : [];

  const params = useParams();
  const isUpdate = Boolean(params.postId);

  const { data: postInfo } = useGetPost(params.postId);

  useEffect(() => {
    if (postInfo) {
      form.reset({
        title: postInfo.title,
        desc: postInfo.desc,
        categories: postInfo.categories.map((c) => c + ""),
        content: postInfo.content,
        isPublishNow: false,
        publishDate: parseISO(postInfo.publishDate ?? ""),
      });
      editorRef.current?.setMarkdown(postInfo.content);
    }
  }, [postInfo]);

  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost({
    onSuccess: () => {
      toast.success("更新成功~");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const content = editorRef.current?.getMarkdown();
    form.setValue("content", content ?? "");
    const validateFileds = formSchema.safeParse({ ...values, content });
    if (validateFileds.success) {
      values.content = content ?? ""; // 将内容设置到 data 对象中
      const data = {
        ...validateFileds.data,
        publishDate: validateFileds.data.publishDate?.toString(),
        categories: validateFileds.data.categories.map((c) => parseInt(c)),
      };

      if (isUpdate) {
        updatePost({
          id: Number(params.postId),
          data,
        });
      } else {
        createPost(data);
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入文章标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章描述</FormLabel>
                <FormControl>
                  <Input placeholder="请输入文章描述" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章分类</FormLabel>
                <MultiSelect
                  options={formatCategories}
                  onValueChange={field.onChange}
                  selectedValues={field.value}
                  placeholder="添加文章分类，可以选择多个"
                  variant="inverted"
                  animation={0}
                  maxCount={10}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublishNow"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="align-text-top pl-2">立即发布</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {!form.watch("isPublishNow") && (
            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>发布时间</FormLabel>
                  <DateTimePicker
                    selectedDate={field.value}
                    onDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div>
            <Editor editorRef={editorRef} markdown="" />
          </div>
          <Button type="submit">{isUpdate ? "修改" : "创建"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default WritePage;
