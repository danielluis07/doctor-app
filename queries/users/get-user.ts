export type User = {
  id: string;
  email: string | null;
  name: string | null;
  password: string | null;
  image: string | null;
  imageName: string | null;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
  address: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  postalCode: string | null;
  role: "ADMIN" | "PATIENT" | "DOCTOR";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: Date;
  updatedAt: Date;
};

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export const getUser = async (id: string | undefined): Promise<User> => {
  try {
    const res = await fetch(`${URL}/api/users/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user with ID: ${id}`);
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
