import { FormGroup } from "@renderer/components/shared/form/FormGroup";
import { FormSection } from "@renderer/components/shared/form/FormSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useGlobalContext } from "@renderer/provider/GlobalProvider";
import { ReactElement, useMemo } from "react";

export const Startup = (): ReactElement => {
  const { os, config, setConfig } = useGlobalContext();

  const isLinux = useMemo(() => os === "linux", [os]);
  const handleRunAtStartupChange = async (checked: boolean): Promise<void> => {
    if (!config) return;

    const isRegistered = await window.api.config.registerStartup(checked);
    setConfig({ ...config, runAtStartup: isRegistered });
  };

  if (!isLinux) return <></>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Startup Execution
        </CardTitle>
        <CardDescription>
          Enable or disable the application to run at startup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <FormSection>
            <>
              <div className="flex flex-row items-center gap-2">
                <Label>Run at startup</Label>
                <Input
                  type="checkbox"
                  className="w-4 h-4"
                  disabled={isLinux}
                  title="Run at startup"
                  checked={config?.runAtStartup}
                  onChange={(e) => handleRunAtStartupChange(e.target.checked)}
                />
              </div>
            </>
          </FormSection>
        </FormGroup>
      </CardContent>
      {isLinux && (
        <CardFooter>
          <span className="text-yellow-400 dark:text-yellow-300 text-sm font-semibold">
            Ops! This feature is not available on Linux
          </span>
        </CardFooter>
      )}
    </Card>
  );
};
