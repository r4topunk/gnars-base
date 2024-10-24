import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { promises as fs } from "fs";
import path from "path";

export const getStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const files = await fs.readdir(postsDirectory, { withFileTypes: true });
  const paths = files
    .filter((dirent) => dirent.isFile())
    .map((file) => ({
      params: {
        post: file.name.replace(/\.md?$/, ""),
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ post: string }>
): Promise<
  GetStaticPropsResult<{
    data: MDXRemoteSerializeResult<Record<string, unknown>>;
  }>
> => {
  const { post } = ctx.params!;
  const postsDirectory = path.join(process.cwd(), "posts");
  const source = await fs.readFile(`${postsDirectory}/${post}.md`, "utf8");
  const mdxSource = await serialize(source, { parseFrontmatter: true });

  return {
    props: {
      data: mdxSource,
    },
    revalidate: 60,
  };
};

export default function PostComponent(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = props;
  const align = data.frontmatter?.align;
  const title = data.frontmatter?.title as string || null;
  const thumbnail = data.frontmatter?.thumbnail as string || null;

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
      className={`flex-col bg-skin-muted max-w-[800px] mx-auto w-full wrapper focus:outline-none break-words prose prose-skin prose-headings:font-heading prose-xl mt-4 sm:mt-0 ${getAlignment()}`}
    >
      {title ? <h1 className="mb-4">{title}</h1> : null}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Banner"
          className="w-full rounded-xl mb-4"
        />
      ) : null}
      <MDXRemote {...data} />
    </div>
  );
}