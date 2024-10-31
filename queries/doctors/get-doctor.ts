export type Doctor = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    password: string | null;
    image: string | null;
    imageName: string | null;
    isTwoFactorEnabled: boolean | null;
    emailVerified: Date | null;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    address: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    phone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  doctor:
    | {
        id: string;
        name: string | null;
        email: string | null;
        specialty: string | null;
        image: string | null;
        education: string | null;
        price: string | null;
        doctor_office: string | null;
        gender: "MALE" | "FEMALE" | null;
        cfm: string | null;
        bio: string | null;
      }
    | undefined;
  averageRating: number;
  reviewsCount: number;
};

export type UserDoctor = {
  doctor:
    | {
        id: string;
        name: string | null;
        email: string | null;
        specialty: string | null;
        image: string | null;
        education: string | null;
        doctor_office: string | null;
        price: string | null;
        gender: "MALE" | "FEMALE" | null;
        cfm: string | null;
        bio: string | null;
      }
    | undefined;
};

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export const getDoctor = async (id: string | undefined): Promise<Doctor> => {
  try {
    const res = await fetch(`${URL}/api/users/doctor/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch doctor with ID: ${id}`);
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

export const getUserDoctor = async (
  id: string | undefined
): Promise<UserDoctor> => {
  try {
    const res = await fetch(`${URL}/api/doctors/${id}`, { cache: "no-cache" });

    if (!res.ok) {
      throw new Error(`Failed to fetch doctor with ID: ${id}`);
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};
