import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../atoms/FormInput/FormInput";
import PasswordInput from "../../atoms/PasswordInput/PasswordInput";
import Button from "../../atoms/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LinearLoader from "../../atoms/LineLoader/LineLoader";
import ApiCalls from "../../../apis/APICalls";
import { Link } from "react-router-dom";
const SignupFormMolecules = () => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();

  const api = new ApiCalls();
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const authenticationData = {
        ...data,
        role: "client",
      };
      const createdAuthentication = await api.createAuthentication(
        authenticationData
      );
      const clientData = {
        AuthId: createdAuthentication.AuthId,
      };
      const createdClient = await api.createClient(clientData);
      console.log("Authentication created:", createdAuthentication);
      console.log("Client created:", createdClient);
    } catch (error) {
      console.error("Error creating client:", error.message);
    } finally {
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          labelText="Username"
          type="text"
          name="username"
          control={control}
          errors={errors}
          rules={{
            required: "Username is required",
            maxLength: {
              value: 20,
              message: "Username should be less than 20 characters",
            },
            minLength: {
              value: 6,
              message: "Username should be greater than 6 characters",
            },
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9]*$/,
              message:
                "Username should start with an alphabet and contain only alphanumeric characters",
            },
          }}
        />

        <FormInput
          labelText="Email"
          type="email"
          name="emailaddress"
          control={control}
          errors={errors}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />

        <PasswordInput control={control} errors={errors} />
        <PasswordInput
          control={control}
          errors={errors}
          text="Confirm password"
          watch={watch}
        />
        {loading ? (
          <Button type="submit" disabled={true} text={<LinearLoader />} />
        ) : (
          <Button type="submit" text="Sign Up" />
        )}
        <h2 className="text-center">
          Do not have an account?{" "}
          <Link to="/login" className="text-lg text-violet-700">
            Sign In
          </Link>
        </h2>
      </form>
    </>
  );
};

export default SignupFormMolecules;
