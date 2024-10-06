import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { promises as fs } from "fs";
import path from "path";
import Layout from "@/components/Layout";

export const getStaticPaths = async () => {
  const templateDirectory = path.join(process.cwd(), "templates");
  const files = await fs.readdir(templateDirectory, { withFileTypes: true });
  const paths = files
    .filter((dirent) => dirent.isFile())
    .map((file) => ({
      params: {
        slug: file.name.replace(/\.md?$/, ""),
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ slug: string }>
): Promise<
  GetStaticPropsResult<{
    data: MDXRemoteSerializeResult<Record<string, unknown>>;
  }>
> => {
  const { slug } = ctx.params!;
  const templateDirectory = path.join(process.cwd(), "templates");
  const source = await fs.readFile(`${templateDirectory}/${slug}.md`, "utf8");
  const mdxSource = await serialize(source, { parseFrontmatter: true });

  return {
    props: {
      data: mdxSource,
    },
    revalidate: 60,
  };
};

export default function SiteComponent(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = props;
  const align = data.frontmatter?.align;
  const title = data.frontmatter?.title as string || null;

  const getAlignment = () => {
    switch (align) {
      case "center":
        return "text-center flex flex-col items-center";
      case "right":
        return "text-right";
      default:
        return "";
    }
  };

  return (
      <div
        className={`flex-col ${getAlignment()} w-full wrapper focus:outline-none break-words prose prose-skin prose-headings:font-heading prose-xl max-w-none mt-4 sm:mt-0`}
      >
        {title ? <h1>{title}</h1> : null }
        <iframe src="https://www.youtube.com/embed/JQSmfSnRGVk" width={"100%"} className="aspect-video max-w-[600px]"/>
        <MDXRemote {...data} />
      </div>
  );
}
