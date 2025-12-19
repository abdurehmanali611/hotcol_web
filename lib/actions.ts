/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from "react-hook-form";
import axios from "axios";

interface cloudinarySuccessResult {
  event: "success";
  info: {
    secure_url: string;
  };
}

const api = "http://localhost:4000/graphql"

export const handleUploadSuccess = (
  result: unknown,
  form: UseFormReturn<any>,
  setPreviewUrl: (url: string | null) => void,
  formField: string
) => {
  if (
    typeof result == "object" &&
    result !== null &&
    "event" in result &&
    result.event == "success" &&
    "info" in result &&
    typeof result.info == "object" &&
    result.info !== null &&
    "secure_url" in result.info
  ) {
    const typedResult = result as cloudinarySuccessResult;
    const secured_url = typedResult.info.secure_url;

    form.setValue(formField, secured_url, { shouldValidate: true });
    setPreviewUrl(secured_url);
  } else {
    console.error(
      "Cloudinary Upload Failed or returned an unexpected structure."
    );

    form.setValue(formField, "");
    setPreviewUrl(null);
  }
};

export async function handleCredential(values: any, setIsLoading: (loading: boolean) => void) {
  try {
    setIsLoading(true);
    
    const graphqlQuery = {
      query: `
        mutation CreateAdmin(
          $HotelName: String!
          $UserName: String!
          $Password: String!
          $LogoUrl: String!
          $Role: String!
        ) {
          CreateAdmin(
            HotelName: $HotelName
            UserName: $UserName
            Password: $Password
            LogoUrl: $LogoUrl
            Role: $Role
          ) {
            id
            HotelName
            UserName
            LogoUrl
            Role
          }
        }
      `,
      variables: {
        HotelName: values.HotelName,  
        UserName: values.UserName,    
        Password: values.Password,    
        LogoUrl: values.LogoUrl,      
        Role: "Admin"                 
      }
    };

    console.log("Sending GraphQL request:", graphqlQuery);
    
    const response = await axios.post(api, graphqlQuery, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = response.data;
    
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(data.errors[0]?.message || "GraphQL error occurred");
    }
    
    setIsLoading(false);
    console.log("Success response:", data);
    return data.data.CreateAdmin; 
  } catch (error: unknown) {
    setIsLoading(false);
    let errorMessage = "An unknown error occurred.";
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors[0]?.message || "GraphQL error";
        } else {
          errorMessage = error.response.data?.message || 
                        `Request failed with status ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "No response received from server. Check if backend is running.";
        console.error("No response received. Is backend running?");
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.log("Error submitting credential:", errorMessage);
    throw new Error(errorMessage);
  }
}
