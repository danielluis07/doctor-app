export type Patient = {
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
  patient:
    | {
        id: string | undefined;
        userId: string | null;
        medicine: string | null;
        alergies: string | null;
        familyHistory: string | null;
        vaccine: string | null;
        lifeStyle: string | null;
        dateOfBirth: string | null;
        medicalHistory: string | null;
        gender: "MALE" | "FEMALE" | null;
        createdAt: Date | null;
        updatedAt: Date | null;
      }
    | undefined;
};

const URL = `${process.env.NEXT_PUBLIC_APP_URL}`;

export const getUserPatient = async (
  id: string | undefined
): Promise<Patient> => {
  try {
    const res = await fetch(`${URL}/api/patients/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch patient with ID: ${id}`);
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const getPatient = async (id: string | undefined): Promise<Patient> => {
  try {
    const res = await fetch(`${URL}/api/users/patient/${id}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch patient with ID: ${id}`);
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};
