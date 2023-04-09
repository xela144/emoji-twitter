import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="justify flex h-screen">
        <div>Single Post view</div>
      </main>
    </>
  );
};

export default SinglePostPage;
