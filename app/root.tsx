import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/globals.css";

// Create a Mantine theme with your desired configurations
const theme = createTheme({
  primaryColor: 'blue',
  // Add any other theme customizations here
});

export const meta: MetaFunction = () => {
  return [
    { title: "Asia Client App" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export function links() {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
}

export default function App() {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <Outlet />
    </MantineProvider>
    <ScrollRestoration />
    <Scripts />
    </body>
    </html>
  );
}

// Error boundary
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
      <title>Error</title>
    </head>
    <body>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Application Error</h1>
        {isRouteErrorResponse(error) ? (
          <>
            <h2>{error.status} {error.statusText}</h2>
            <p>{error.data.message || 'Something went wrong!'}</p>
          </>
        ) : error instanceof Error ? (
          <>
            <h2>{error.name}</h2>
            <p>{error.message}</p>
          </>
        ) : (
          <p>Unknown error</p>
        )}
      </div>
    </MantineProvider>
    <Scripts />
    </body>
    </html>
  );
}
