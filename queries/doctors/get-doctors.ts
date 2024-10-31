export type Doctors = {
  id: string;
  name: string | undefined;
  specialty: string | null;
  image: string | undefined;
  education: string | undefined;
  doctor_office: string | undefined;
  gender: string | undefined;
  cfm: string | undefined;
  bio: string | undefined;
  price: string | undefined;
  state: string | undefined;
  city: string | undefined;
  averageRating: number;
  reviewsCount: number;
};

export type DoctorsData = {
  data: Doctors[];
  total: {
    count: number;
  };
  page: number;
  perPage: number;
};

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export const getDoctors = async (
  page: string | string[],
  per_page: string | string[]
): Promise<DoctorsData> => {
  try {
    const res = await fetch(
      `${URL}/api/doctors?page=${page}&per_page=${per_page}`,
      {
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch doctors");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};
