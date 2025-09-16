import { ReactElement } from "react";

export const InputError = ({
  error,
}: {
  error: string | undefined;
}): ReactElement => {
  if (!error) return <></>;

  return <p className="text-sm text-red-500">{error}</p>;
};
