"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";
import PropTypes from "prop-types"; // Optional: for type checking

export default function ClientProvider({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

// Optional: Adding PropTypes for type checking
ClientProvider.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object, // session is optional but can be provided
};
