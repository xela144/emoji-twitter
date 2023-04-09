import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUser.useQuery({
    username: "xela144",
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data || !data.username) {
    return <div>Something went wrong</div>;
  }
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>{`@${data.username}`}</div>
      </main>
    </>
  );
};

export default ProfilePage;
