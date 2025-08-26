import { ReactElement } from "react";

export const FormGroup = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement => <div className="space-y-2 my-2">{children}</div>;
