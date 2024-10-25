import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

interface Post {
  slug: string;
  title: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const files = await fs.readdir(postsDirectory, { withFileTypes: true });
  const posts = files
    .filter((dirent) => dirent.isFile())
    .map((file) => ({
      slug: file.name.replace(/\.md?$/, ""),
      title: file.name.replace(/\.md?$/, ""), // Assuming the file name is the title
    }));

  return {
    props: {
      posts,
    },
  };
};

export default function PostList({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="max-w-[800px] mx-auto w-full mt-4 sm:mt-0">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">Posts</h1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.slug} className="mb-2">
            <Link href={`/blog/${post.slug}`}>
              <span className="text-blue-500 hover:underline">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}