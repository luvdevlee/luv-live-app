import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegisterData {
  email: string;
  password: string;
  userName: string;
  display_name?: string; // backend hiện không cần, để optional
}

export const register = async (data: RegisterData) => {
  return await axios.post(`${API_URL}/graphql`, {
    query: `
      mutation Register($data: RegisterUserDto!) {
        register(registerUserDto: $data) {
          access_token
          refresh_token
        }
      }
    `,
    variables: {
      data: {
        username: data.userName,
        email: data.email,
        password: data.password,
        display_name: data.display_name
      },
    },
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
