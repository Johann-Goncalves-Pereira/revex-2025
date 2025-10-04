import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RootLayout() {
  return (
    <div className='bg-gray-200 min-h-dvh dark:bg-stone-950 text-stone-950 dark:text-gray-50'>
      <header className='px-8 py-4 relative flex gap-4 items-center backdrop-blur-[2px]'>
        <Link to='/' className='[&.active]:font-bold pt-1'>
          Home
        </Link>{" "}
        <Link to='/about' className='[&.active]:font-bold pt-1'>
          About
        </Link>
        <div
          className='absolute inset-x-px top-full h-8 rounded-t-2xl'
          style={{
            boxShadow: "0 -24px 16px 8px hsl(0, 0%, 0%, .35) ",
          }}
        />
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}

export default RootLayout;
