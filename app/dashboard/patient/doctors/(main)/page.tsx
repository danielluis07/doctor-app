import { auth } from "@/auth";
import { DoctorsClient } from "../_components/doctors-client";
import { getDoctors } from "@/queries/doctors/get-doctors";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DoctorsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth();
  const searchParams = await props.searchParams;
  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "10";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const data = await getDoctors(page, per_page);

  const totalPages = Math.ceil(data.total.count / Number(per_page));

  if (!session) {
    return <div>Unauthorized</div>;
  }

  return (
    <>
      <DoctorsClient data={data.data} />
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/dashboard/patient/doctors?page=${
                Number(page) - 1
              }&per_page=${per_page}`}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i + 1 === Number(page)}
                href={`/dashboard/patient/doctors?page=${
                  i + 1
                }&per_page=${per_page}`}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`/dashboard/patient/doctors?page=${
                Number(page) + 1
              }&per_page=${per_page}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default DoctorsPage;
