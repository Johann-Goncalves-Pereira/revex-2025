import RootLayout from "@layout/Root";
import About from "@pages/About";
import Home from "@pages/Home";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

const Root = createRootRoute({ component: RootLayout });

const IndexRoute = createRoute({
  getParentRoute: () => Root,
  path: "/",
  component: Home,
});

const AboutRoute = createRoute({
  getParentRoute: () => Root,
  path: "/about",
  component: About,
});

const routeTree = Root.addChildren([IndexRoute, AboutRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
