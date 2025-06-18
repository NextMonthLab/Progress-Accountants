import { FormProvider, useFormContext } from "react-hook-form";

export const Form = FormProvider;

export const FormField = ({ children }: { children: React.ReactNode }) => {
  return <div className="form-field">{children}</div>;
};

export const FormItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="form-item">{children}</div>;
};

export const FormLabel = ({ children }: { children: React.ReactNode }) => {
  return <label className="form-label">{children}</label>;
};

export const FormControl = ({ children }: { children: React.ReactNode }) => {
  return <div className="form-control">{children}</div>;
};

export const FormMessage = ({ children }: { children: React.ReactNode }) => {
  return <div className="form-message text-red-500 text-sm">{children}</div>;
};