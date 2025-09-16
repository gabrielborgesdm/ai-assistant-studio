import { ConfigComponent } from "@renderer/components/features/config";
import { Page } from "@renderer/pages";
import { usePageContext } from "@renderer/provider/PageProvider";

export const ConfigPage = (): React.ReactElement => {
  const { withActivePage } = usePageContext();

  return withActivePage(Page.Config, ConfigComponent);
};
