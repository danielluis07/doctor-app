import { SearchedDoctors } from "./_components/searched-doctors";
import { auth } from "@/auth";
import { getSearchedDoctors } from "@/queries/doctors/get-searched-doctors";

const SearchPage = async (props: {
  searchParams: Promise<{ q?: string | undefined; page?: string }>;
}) => {
  const session = await auth();
  const searchParams = await props.searchParams;

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getSearchedDoctors(searchParams.q);

  return <SearchedDoctors data={data} />;
};

export default SearchPage;
