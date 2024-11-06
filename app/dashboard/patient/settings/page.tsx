import { auth } from "@/auth";
import { Settings } from "./_components/settings";
import { getUser } from "@/queries/users/get-user";

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUser(session.user.id);

  return <Settings user={data} />;
};

export default SettingsPage;
