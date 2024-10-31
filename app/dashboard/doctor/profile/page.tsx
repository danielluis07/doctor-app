import { auth } from "@/auth";
import { Profile } from "./_components/profile";
import { getUserDoctor } from "@/queries/doctors/get-doctor";

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserDoctor(session.user.id);

  if (!data) {
    return <div>Não foi possível carregar as informações de perfil</div>;
  }

  return (
    <div className="w-full">
      <Profile data={data} id={session.user.id} />
    </div>
  );
};

export default ProfilePage;
