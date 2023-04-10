import Head from "next/head";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { type GetStaticProps, type NextPage } from "next";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserID.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUser.useQuery({
    username,
  });

  if (!data || !data.username) {
    return <div>Something went wrong</div>;
  }
  const title = `${data.username} -- Emoji Tweeter`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageLayout>
        <div className="relative h-40 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? "user"}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export default ProfilePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUser.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
