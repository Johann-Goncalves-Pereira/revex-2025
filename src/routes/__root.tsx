import RootLayout from "@layout/Root";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <RootLayout />,
});
